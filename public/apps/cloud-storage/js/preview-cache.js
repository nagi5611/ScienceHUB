/**
 * プレビュー Blob の取得（セッション → IndexedDB → ネットワーク）
 */

import { getCachedPreviewBlob, putCachedPreviewBlob } from "./media-cache.js";
import { getSessionPreviewBlob, setSessionPreviewBlob } from "./preview-session-cache.js";
import { classifyFile } from "./file-icons.js";

/**
 * プレビュー用 Blob を解決（キャッシュ優先）
 * @param {{ path: string, updatedAt: number | null, name: string }} item
 * @param {(path: string) => Promise<Blob>} fetchBlob
 * @returns {Promise<{ blob: Blob, source: "session" | "indexeddb" | "network" }>}
 */
export async function resolvePreviewBlob(item, fetchBlob) {
  const sessionBlob = getSessionPreviewBlob(item.path, item.updatedAt);
  if (sessionBlob) {
    return { blob: sessionBlob, source: "session" };
  }

  let cachedBlob = null;
  try {
    cachedBlob = await getCachedPreviewBlob(item.path, item.updatedAt);
  } catch (error) {
    console.warn("プレビュー IndexedDB 読み込みに失敗しました:", error);
  }

  if (cachedBlob) {
    setSessionPreviewBlob(item.path, item.updatedAt, cachedBlob);
    return { blob: cachedBlob, source: "indexeddb" };
  }

  const blob = await fetchBlob(item.path);
  setSessionPreviewBlob(item.path, item.updatedAt, blob);

  const kind = classifyFile(item.name).kind;
  try {
    await putCachedPreviewBlob(item.path, item.updatedAt, blob, kind);
  } catch (error) {
    console.warn("プレビュー IndexedDB 保存に失敗しました:", error);
  }

  return { blob, source: "network" };
}
