/**
 * 変換結果のダウンロード（個別 / ZIP 一括・ファイル名の重複解消）
 */

import { zip } from "fflate";
import { downloadBlob } from "./convert-core.js";
import { WorkerPool } from "./worker-pool.js";
import {
  OPFS_PIXEL_THRESHOLD,
  ZIP_BATCH_4K,
  ZIP_BATCH_DEFAULT,
} from "./video/constants.js";

/** @typedef {Awaited<ReturnType<import('./video/opfs-session.js').createOpfsSession>>} OpfsSession */

/** @type {WorkerPool | null} */
let zipWorkerPool = null;

function getZipWorker() {
  if (!zipWorkerPool) {
    zipWorkerPool = new WorkerPool(new URL("./zip-worker.js", import.meta.url), 1);
  }
  return zipWorkerPool;
}

/** 既存名と重複しないファイル名を返す */
export function ensureUniqueFilename(usedNames, desired) {
  const key = desired.toLowerCase();
  if (!usedNames.has(key)) {
    usedNames.add(key);
    return desired;
  }

  const dot = desired.lastIndexOf(".");
  const base = dot > 0 ? desired.slice(0, dot) : desired;
  const ext = dot > 0 ? desired.slice(dot) : "";
  let index = 2;

  while (usedNames.has(`${base} (${index})${ext}`.toLowerCase())) {
    index += 1;
  }

  const unique = `${base} (${index})${ext}`;
  usedNames.add(unique.toLowerCase());
  return unique;
}

/** 結果配列の name を一括でユニーク化 */
export function assignUniqueNames(results) {
  const used = new Set();
  for (const result of results) {
    result.name = ensureUniqueFilename(used, result.name);
  }
}

/** ZIP ファイル名を生成 */
export function buildZipFilename(prefix = "image-converter") {
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  return `${prefix}-${stamp}.zip`;
}

/**
 * Worker で無圧縮 ZIP を生成（失敗時はメインスレッド）
 * @param {Record<string, Uint8Array>} files
 */
async function zipStore(files) {
  try {
    const blob = await getZipWorker().run({ files });
    return /** @type {Blob} */ (blob);
  } catch {
    const data = await new Promise((resolve, reject) => {
      zip(files, { level: 0 }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    return new Blob([data], { type: "application/zip" });
  }
}

/**
 * 変換結果から ZIP Blob を生成（1件はそのまま返す）
 * @param {Array<{ blob: Blob, name: string }>} results
 */
export async function buildResultZipBlob(results) {
  if (results.length === 0) {
    throw new Error("ダウンロードできるファイルがありません");
  }

  if (results.length === 1) {
    return { blob: results[0].blob, filename: results[0].name, mode: "single", count: 1 };
  }

  const files = {};
  const used = new Set();

  for (const result of results) {
    const entryName = ensureUniqueFilename(used, result.name);
    files[entryName] = new Uint8Array(await result.blob.arrayBuffer());
  }

  const zipBlob = await zipStore(files);
  return { blob: zipBlob, filename: buildZipFilename(), mode: "zip", count: results.length };
}

/**
 * 変換結果をダウンロード（1件は直接、2件以上は ZIP・無圧縮）
 * @param {Array<{ blob: Blob, name: string }>} results
 */
export async function downloadResultBundle(results) {
  const built = await buildResultZipBlob(results);
  downloadBlob(built.blob, built.filename);
  return { mode: built.mode, count: built.count };
}

/**
 * OPFS 連番フレームから ZIP Blob を生成
 * @param {OpfsSession} session
 * @param {{ batchSize?: number, onProgress?: (p: { done: number, total: number }) => void }} [options]
 */
export async function buildOpfsZipBlob(session, options = {}) {
  const manifest = session.getManifest();
  const frames = manifest.frames;
  if (frames.length === 0) {
    throw new Error("ダウンロードできるフレームがありません");
  }

  if (frames.length === 1) {
    const blob = await session.readFrameBlob(frames[0].index);
    return {
      blob,
      filename: frames[0].name,
      mode: "single",
      count: 1,
      parts: 1,
    };
  }

  const pixels = manifest.width * manifest.height;
  const batchSize =
    options.batchSize ?? (pixels > OPFS_PIXEL_THRESHOLD ? ZIP_BATCH_4K : ZIP_BATCH_DEFAULT);

  const files = {};
  const used = new Set();

  for (let offset = 0; offset < frames.length; offset += batchSize) {
    const batch = frames.slice(offset, offset + batchSize);
    for (const entry of batch) {
      const blob = await session.readFrameBlob(entry.index);
      const name = ensureUniqueFilename(used, entry.name);
      files[name] = new Uint8Array(await blob.arrayBuffer());
    }
    if (options.onProgress) {
      options.onProgress({ done: Math.min(offset + batch.length, frames.length), total: frames.length });
    }
  }

  const zipBlob = await zipStore(files);
  return {
    blob: zipBlob,
    filename: `${manifest.baseName}_frames.zip`,
    mode: "zip",
    count: frames.length,
    parts: 1,
  };
}

export async function downloadOpfsFrameBundle(session, options = {}) {
  const built = await buildOpfsZipBlob(session, options);
  downloadBlob(built.blob, built.filename);
  return { mode: built.mode, count: built.count, parts: built.parts };
}
