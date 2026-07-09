/**
 * クラウドストレージ並列マルチパートアップロード
 */

import { apiRequest, apiUpload, putToPresignedUrl } from "./api.js";
import {
  ensureStorageDirectories,
  getFileRelativePath,
  resolveUploadTarget,
} from "./folder-upload.js";

const MULTIPART_THRESHOLD = 30 * 1024 * 1024;
/** 同時にマルチパート転送できるファイルサイズ合計の上限（サーバー MULTIPART_LARGE_THRESHOLD と一致） */
const MULTIPART_CONCURRENT_BUDGET = 300 * 1024 * 1024;
const PARALLEL_SMALL_FILES = 8;
const PROGRESS_TICK_MS = 500;

/** 転送中パートを含むバイト数をリアルタイム集計 */
function createUploadByteTracker(totalBytes) {
  let completedBytes = 0;
  const inFlight = new Map();

  function getBytesUploaded() {
    let sum = completedBytes;
    for (const loaded of inFlight.values()) {
      sum += loaded;
    }
    return Math.min(sum, totalBytes);
  }

  return {
    getBytesUploaded,
    setInFlight(id, loaded) {
      inFlight.set(id, loaded);
    },
    clearInFlight(id) {
      inFlight.delete(id);
    },
    addCompleted(bytes) {
      completedBytes += bytes;
    },
  };
}

/** presigned URL を取得して単発アップロード */
async function uploadSimpleDirect(sessionId, file, tracker) {
  const { url } = await apiRequest(`upload/url?sessionId=${encodeURIComponent(sessionId)}`);
  const flightId = "simple";
  const { etag } = await putToPresignedUrl(url, file, {
    onProgress: (loaded) => tracker.setInFlight(flightId, loaded),
  });
  if (!etag && file.size > 0) {
    throw new Error("アップロードの ETag が取得できませんでした");
  }
  tracker.clearInFlight(flightId);
  tracker.addCompleted(file.size);
  return apiRequest("upload/complete", {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  });
}

/** presigned URL でパートを並列アップロード */
async function uploadPartsDirect(
  sessionId,
  file,
  partSize,
  totalParts,
  parallel,
  tracker,
  onPartComplete
) {
  const uploadedParts = [];
  let completedParts = 0;

  async function uploadOne(partNumber) {
    const start = (partNumber - 1) * partSize;
    const end = Math.min(start + partSize, file.size);
    const chunk = file.slice(start, end);
    const flightId = `part-${partNumber}`;
    const { url } = await apiRequest(
      `upload/part-url?sessionId=${encodeURIComponent(sessionId)}&partNumber=${partNumber}`
    );
    const { etag } = await putToPresignedUrl(url, chunk, {
      onProgress: (loaded) => tracker.setInFlight(flightId, loaded),
    });
    if (!etag) {
      throw new Error(`パート ${partNumber} の ETag が取得できませんでした`);
    }
    tracker.clearInFlight(flightId);
    tracker.addCompleted(chunk.size);
    uploadedParts.push({ partNumber, etag });
    completedParts += 1;
    onPartComplete?.({ completedParts, bytesUploaded: tracker.getBytesUploaded(), totalParts });
  }

  const queue = Array.from({ length: totalParts }, (_, i) => i + 1);
  const workers = Array.from({ length: Math.min(parallel, totalParts) }, async () => {
    while (queue.length > 0) {
      const partNumber = queue.shift();
      if (partNumber === undefined) break;
      await uploadOne(partNumber);
    }
  });

  await Promise.all(workers);

  if (uploadedParts.length !== totalParts) {
    throw new Error("パートのアップロードが完了しませんでした");
  }

  uploadedParts.sort((a, b) => a.partNumber - b.partNumber);
  return uploadedParts;
}

/** Worker プロキシ経由でパートを並列アップロード */
async function uploadPartsProxy(
  sessionId,
  file,
  partSize,
  totalParts,
  parallel,
  tracker,
  onPartComplete
) {
  const uploadedParts = [];
  let completedParts = 0;

  async function uploadOne(partNumber) {
    const start = (partNumber - 1) * partSize;
    const end = Math.min(start + partSize, file.size);
    const chunk = file.slice(start, end);
    const flightId = `part-${partNumber}`;
    const part = await apiUpload(
      "upload/part",
      chunk,
      {
        sessionId,
        partNumber: String(partNumber),
      },
      {
        onProgress: (loaded) => tracker.setInFlight(flightId, loaded),
      }
    );
    tracker.clearInFlight(flightId);
    tracker.addCompleted(chunk.size);
    uploadedParts.push(part);
    completedParts += 1;
    onPartComplete?.({ completedParts, bytesUploaded: tracker.getBytesUploaded(), totalParts });
  }

  const queue = Array.from({ length: totalParts }, (_, i) => i + 1);
  const workers = Array.from({ length: Math.min(parallel, totalParts) }, async () => {
    while (queue.length > 0) {
      const partNumber = queue.shift();
      if (partNumber === undefined) break;
      await uploadOne(partNumber);
    }
  });

  await Promise.all(workers);

  if (uploadedParts.length !== totalParts) {
    throw new Error("パートのアップロードが完了しませんでした");
  }

  uploadedParts.sort((a, b) => a.partNumber - b.partNumber);
  return uploadedParts;
}

/** ファイルをアップロード */
export async function uploadFile(directoryPath, file, callbacks = {}) {
  const { onProgress, onInit, filename: filenameOverride } = callbacks;
  const filename = filenameOverride ?? file.name;

  const init = await apiRequest("upload/init", {
    method: "POST",
    body: JSON.stringify({
      path: directoryPath,
      filename,
      size: file.size,
    }),
  });

  onInit?.(init);

  const totalBytes = file.size;
  const tracker = createUploadByteTracker(totalBytes);
  let speedBps = 0;
  let lastSnap = { bytes: 0, time: performance.now() };
  let progressTimer = null;
  let completedParts = 0;

  const report = (extra = {}) => {
    const bytesUploaded = tracker.getBytesUploaded();
    const now = performance.now();
    const elapsedSec = (now - lastSnap.time) / 1000;
    if (elapsedSec >= 0.25 && bytesUploaded > lastSnap.bytes) {
      const instant = (bytesUploaded - lastSnap.bytes) / elapsedSec;
      speedBps = speedBps > 0 ? speedBps * 0.65 + instant * 0.35 : instant;
      lastSnap = { bytes: bytesUploaded, time: now };
    }

    const percent = totalBytes > 0 ? Math.round((bytesUploaded / totalBytes) * 100) : 0;
    onProgress?.({
      percent,
      bytesUploaded,
      totalBytes,
      speedBps,
      partSize: init.partSize,
      totalParts: init.totalParts,
      parallel: init.parallel,
      mode: init.mode,
      directUpload: init.directUpload,
      completedParts,
      ...extra,
    });
  };

  const startProgressTicker = () => {
    if (progressTimer !== null) return;
    progressTimer = setInterval(() => {
      report({ phase: "uploading", completedParts });
    }, PROGRESS_TICK_MS);
    report({ phase: "uploading", completedParts });
  };

  const stopProgressTicker = () => {
    if (progressTimer !== null) {
      clearInterval(progressTimer);
      progressTimer = null;
    }
  };

  let sessionToAbort = init.sessionId;

  try {
    startProgressTicker();

    if (init.mode === "simple") {
      let result;
      if (init.directUpload) {
        result = await uploadSimpleDirect(init.sessionId, file, tracker);
      } else {
        const flightId = "simple";
        result = await apiUpload(
          "upload/simple",
          file,
          { sessionId: init.sessionId },
          {
            onProgress: (loaded) => tracker.setInFlight(flightId, loaded),
          }
        );
        tracker.clearInFlight(flightId);
        tracker.addCompleted(file.size);
      }
      completedParts = 1;
      report({ phase: "complete", completedParts: 1 });
      sessionToAbort = null;
      return result;
    }

    const uploadParts = init.directUpload ? uploadPartsDirect : uploadPartsProxy;

    const parts = await uploadParts(
      init.sessionId,
      file,
      init.partSize,
      init.totalParts,
      init.parallel,
      tracker,
      ({ completedParts: done, bytesUploaded }) => {
        completedParts = done;
        lastSnap = { bytes: bytesUploaded, time: performance.now() };
        report({ phase: "uploading", completedParts: done });
      }
    );

    completedParts = init.totalParts;
    report({ phase: "completing", completedParts: init.totalParts });
    const result = await apiRequest("upload/complete", {
      method: "POST",
      body: JSON.stringify({
        sessionId: init.sessionId,
        parts,
        directUpload: Boolean(init.directUpload),
      }),
    });

    report({ phase: "complete", completedParts: init.totalParts });
    sessionToAbort = null;
    return result;
  } catch (err) {
    if (sessionToAbort) {
      await apiRequest("upload/abort", {
        method: "DELETE",
        body: JSON.stringify({ sessionId: sessionToAbort }),
      }).catch(() => {});
    }
    throw err;
  } finally {
    stopProgressTicker();
  }
}

/** キューから最大 concurrency 件まで並列実行 */
async function runParallelQueue(items, concurrency, worker) {
  const queue = [...items];
  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (item === undefined) break;
      await worker(item);
    }
  });
  await Promise.all(workers);
}

/**
 * マルチパート対象ファイルを、同時転送サイズ合計の上限内で並列アップロード
 * 例: 100MB×3 件なら 3 件同時、200MB+150MB なら 200MB 完了後に 150MB を開始
 */
async function runMultipartBudgetQueue(items, budgetBytes, worker) {
  if (items.length === 0) return;

  const queue = [...items];
  const running = new Set();
  let activeBytes = 0;

  await new Promise((resolve) => {
    const pump = () => {
      while (queue.length > 0) {
        const item = queue[0];
        const size = item.file.size;
        if (activeBytes > 0 && activeBytes + size > budgetBytes) break;

        queue.shift();
        activeBytes += size;

        const task = Promise.resolve(worker(item)).finally(() => {
          activeBytes -= size;
          running.delete(task);
          pump();
          if (running.size === 0 && queue.length === 0) resolve();
        });
        running.add(task);
      }

      if (running.size === 0 && queue.length === 0) resolve();
    };

    pump();
  });
}

/**
 * 複数ファイルをアップロード
 * - 30MB 以下: 最大 8 ファイル並列
 * - 30MB 超: 合計 300MB まで複数ファイルのマルチパートを並列（各ファイル内のパート並列は維持）
 * - webkitRelativePath / _relativePath があればフォルダ構造を維持
 */
export async function uploadFiles(directoryPath, files, callbacks = {}) {
  const { onFileProgress, onFileComplete, onBatchStart, onFileStart } = callbacks;

  const items = files.map((file) => {
    const relativePath = getFileRelativePath(file);
    const target = resolveUploadTarget(directoryPath, relativePath);
    file._displayName = relativePath.includes("/") ? relativePath : file.name;
    return { file, ...target };
  });

  await ensureStorageDirectories(
    directoryPath,
    items.map((item) => item.directoryPath),
    async (parentPath, name) => {
      await apiRequest("mkdir", {
        method: "POST",
        body: JSON.stringify({ path: parentPath, name }),
      });
    }
  );

  const smallFiles = [];
  const largeFiles = [];

  for (const item of items) {
    if (item.file.size > MULTIPART_THRESHOLD) {
      largeFiles.push(item);
    } else {
      smallFiles.push(item);
    }
  }

  const uploadOne = async (item) => {
    const { file, directoryPath: targetPath, filename } = item;
    try {
      const result = await uploadFile(targetPath, file, {
        filename,
        onInit: (initInfo) => onFileStart?.(file, initInfo),
        onProgress: (detail) => onFileProgress?.(file, detail),
      });
      onFileComplete?.(file, { ok: true, result });
    } catch (err) {
      onFileComplete?.(file, { ok: false, error: err });
    }
  };

  if (smallFiles.length > 0) {
    onBatchStart?.({ type: "small", count: smallFiles.length, parallel: PARALLEL_SMALL_FILES });
    await runParallelQueue(smallFiles, PARALLEL_SMALL_FILES, uploadOne);
  }

  if (largeFiles.length > 0) {
    onBatchStart?.({
      type: "multipart",
      count: largeFiles.length,
      budgetBytes: MULTIPART_CONCURRENT_BUDGET,
    });
    await runMultipartBudgetQueue(largeFiles, MULTIPART_CONCURRENT_BUDGET, uploadOne);
  }
}
