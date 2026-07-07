/**
 * プレビュー用インメモリキャッシュ（ダイアログ内の左右移動向け）
 */

import { buildMediaCacheKey } from "./media-cache.js";

const MAX_SESSION_ENTRIES = 40;

/** @type {Map<string, Blob>} */
const blobs = new Map();
/** @type {Map<string, string>} */
const objectUrls = new Map();
/** @type {string[]} */
const accessOrder = [];

function touchKey(key) {
  const index = accessOrder.indexOf(key);
  if (index >= 0) accessOrder.splice(index, 1);
  accessOrder.push(key);
}

function evictOldest() {
  while (accessOrder.length > MAX_SESSION_ENTRIES) {
    const key = accessOrder.shift();
    const url = objectUrls.get(key);
    if (url) URL.revokeObjectURL(url);
    objectUrls.delete(key);
    blobs.delete(key);
  }
}

/** セッションキャッシュから Blob を取得 */
export function getSessionPreviewBlob(path, updatedAt) {
  const key = buildMediaCacheKey(path, updatedAt);
  const blob = blobs.get(key);
  if (!blob) return null;
  touchKey(key);
  return blob;
}

/** セッションキャッシュに Blob を保存 */
export function setSessionPreviewBlob(path, updatedAt, blob) {
  const key = buildMediaCacheKey(path, updatedAt);
  blobs.set(key, blob);
  touchKey(key);
  evictOldest();
}

/** Blob 用 object URL をセッション内で再利用 */
export function getSessionPreviewObjectUrl(path, updatedAt, blob) {
  const key = buildMediaCacheKey(path, updatedAt);
  const existing = objectUrls.get(key);
  if (existing) {
    touchKey(key);
    return existing;
  }
  const url = URL.createObjectURL(blob);
  objectUrls.set(key, url);
  touchKey(key);
  return url;
}

/** プレビューダイアログを閉じるときにセッションキャッシュを破棄 */
export function clearSessionPreviewCache() {
  for (const url of objectUrls.values()) {
    URL.revokeObjectURL(url);
  }
  objectUrls.clear();
  blobs.clear();
  accessOrder.length = 0;
}
