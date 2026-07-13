/**
 * メディアサムネイル生成（一覧アイコン・フォルダプレビュー共通）
 */

import { fetchDownloadBlob, fetchDownloadInfo } from "./api.js";
import { getCachedMediaThumb, putCachedMediaThumb } from "./media-cache.js";
import { classifyFile } from "./file-icons.js";

export const THUMB_MAX_EDGE = 96;
export const ICON_THUMB_MAX_EDGE = 176;
export const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 60 * 1024 * 1024;

/** キャッシュまたはネットワークからサムネイル Blob を取得 */
export async function resolveMediaThumbBlob(item, options = {}) {
  const { signal, isStale } = options;
  const kind = item.kind ?? classifyFile(item.name).kind;
  if (kind !== "image" && kind !== "video") return null;

  if (isStale?.()) return null;

  const cached = await getCachedMediaThumb(item.path, item.updatedAt);
  if (cached) {
    return isStale?.() ? null : cached;
  }

  if (isStale?.()) return null;

  let thumbBlob = null;
  const maxEdge = options.maxEdge ?? THUMB_MAX_EDGE;
  if (kind === "image") {
    thumbBlob = await createImageThumb(item, signal, isStale, maxEdge);
  } else {
    thumbBlob = await createVideoThumb(item, signal, isStale, maxEdge);
  }

  if (!thumbBlob || isStale?.()) return null;

  try {
    await putCachedMediaThumb(item.path, item.updatedAt, thumbBlob, kind);
  } catch {
    /* キャッシュ失敗は無視 */
  }

  return thumbBlob;
}

async function createImageThumb(item, signal, isStale, maxEdge = THUMB_MAX_EDGE) {
  if (item.sizeBytes != null && item.sizeBytes > MAX_IMAGE_BYTES) {
    return null;
  }

  const blob = await fetchDownloadBlob(item.path, { signal });
  if (isStale?.()) return null;
  return resizeImageBlob(blob, maxEdge);
}

async function createVideoThumb(item, signal, isStale, maxEdge = THUMB_MAX_EDGE) {
  if (item.sizeBytes != null && item.sizeBytes > MAX_VIDEO_BYTES) {
    return null;
  }

  const info = await fetchDownloadInfo(item.path, { signal });
  if (isStale?.()) return null;

  const isDirect = info.mode === "direct" && info.url;
  const url = isDirect
    ? info.url
    : `/api/storage/download?path=${encodeURIComponent(item.path)}`;

  return captureVideoFrame(url, maxEdge, Boolean(isDirect), signal, isStale);
}

export async function resizeImageBlob(blob, maxEdge) {
  const bitmap = await createImageBitmap(blob);
  try {
    const scale = Math.min(maxEdge / bitmap.width, maxEdge / bitmap.height, 1);
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas unavailable");
    ctx.drawImage(bitmap, 0, 0, width, height);
    return await canvasToJpegBlob(canvas);
  } finally {
    bitmap.close();
  }
}

function canvasToJpegBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("サムネイル生成に失敗しました"))),
      "image/jpeg",
      0.82
    );
  });
}

function captureVideoFrame(url, maxEdge, useCrossOrigin, signal, isStale) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted || isStale?.()) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    if (useCrossOrigin) {
      video.crossOrigin = "anonymous";
    }

    const cleanup = () => {
      signal?.removeEventListener("abort", onAbort);
      video.pause();
      video.removeAttribute("src");
      video.load();
      video.remove();
    };

    const fail = (error) => {
      cleanup();
      reject(error);
    };

    const onAbort = () => {
      fail(new DOMException("Aborted", "AbortError"));
    };

    signal?.addEventListener("abort", onAbort, { once: true });

    video.addEventListener("error", () => fail(new Error("動画の読み込みに失敗しました")));
    video.addEventListener("loadeddata", () => {
      if (isStale?.()) {
        fail(new DOMException("Aborted", "AbortError"));
        return;
      }
      const seekTo = Number.isFinite(video.duration) && video.duration > 0
        ? Math.min(0.5, video.duration * 0.05)
        : 0.1;
      video.currentTime = seekTo;
    });
    video.addEventListener("seeked", async () => {
      if (isStale?.()) {
        fail(new DOMException("Aborted", "AbortError"));
        return;
      }
      try {
        const canvas = document.createElement("canvas");
        const scale = Math.min(maxEdge / video.videoWidth, maxEdge / video.videoHeight, 1);
        canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
        canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("canvas unavailable");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const blob = await canvasToJpegBlob(canvas);
        cleanup();
        resolve(blob);
      } catch (error) {
        fail(error);
      }
    });

    video.src = url;
  });
}
