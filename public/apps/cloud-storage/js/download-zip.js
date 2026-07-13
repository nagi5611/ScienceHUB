/**
 * 選択項目のダウンロード（1GB 以下の複数ファイルはクライアント ZIP）
 */

import { zip } from "fflate";
import { apiRequest, fetchDownloadBlob, fetchDownloadInfo } from "./api.js";

const DOWNLOAD_GAP_MS = 250;
const ZIP_MAX_BYTES = 1024 * 1024 * 1024;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** フォルダ内のファイルを再帰的に収集 */
async function collectFilesRecursive(dirPath, namePrefix) {
  const data = await apiRequest(`list?path=${encodeURIComponent(dirPath)}`);
  const results = [];

  for (const item of data.items ?? []) {
    const entryName = namePrefix ? `${namePrefix}/${item.name}` : item.name;
    if (item.type === "folder") {
      results.push(...(await collectFilesRecursive(item.path, entryName)));
    } else {
      results.push({
        storagePath: item.path,
        filename: entryName,
        sizeBytes: normalizeEntrySize(item.sizeBytes),
      });
    }
  }

  return results;
}

function normalizeEntrySize(sizeBytes) {
  if (typeof sizeBytes !== "number" || !Number.isFinite(sizeBytes) || sizeBytes < 0) {
    return null;
  }
  return sizeBytes;
}

/** 選択パスからダウンロード対象ファイル一覧を構築 */
export async function collectDownloadEntries(items) {
  const entries = [];
  const seen = new Set();

  for (const item of items) {
    if (item.type === "file") {
      if (!seen.has(item.path)) {
        seen.add(item.path);
        entries.push({
          storagePath: item.path,
          filename: item.name,
          sizeBytes: normalizeEntrySize(item.sizeBytes),
        });
      }
      continue;
    }

    const nested = await collectFilesRecursive(item.path, item.name);
    for (const entry of nested) {
      if (seen.has(entry.storagePath)) continue;
      seen.add(entry.storagePath);
      entries.push(entry);
    }
  }

  return entries;
}

function getEntriesTotalBytes(entries) {
  let total = 0;
  for (const entry of entries) {
    if (entry.sizeBytes === null) return null;
    total += entry.sizeBytes;
  }
  return total;
}

function canDownloadAsZip(entries) {
  if (entries.length <= 1) return false;
  const totalBytes = getEntriesTotalBytes(entries);
  if (totalBytes === null) return false;
  return totalBytes <= ZIP_MAX_BYTES;
}

/** 認証付きでファイル Blob を取得 */
async function fetchFileBlob(storagePath) {
  return fetchDownloadBlob(storagePath);
}

/** Blob をローカルに保存 */
export function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function toDownloadFilename(name) {
  return name.replace(/\//g, " - ");
}

function ensureUniqueZipPath(files, desiredPath) {
  if (!(desiredPath in files)) return desiredPath;
  const dot = desiredPath.lastIndexOf(".");
  const base = dot > 0 ? desiredPath.slice(0, dot) : desiredPath;
  const ext = dot > 0 ? desiredPath.slice(dot) : "";
  let index = 2;
  while (`${base} (${index})${ext}` in files) {
    index += 1;
  }
  return `${base} (${index})${ext}`;
}

function buildZipFilename() {
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  return `download-${stamp}.zip`;
}

/** 単一ファイルをダウンロード */
export async function downloadSingleFile(storagePath, filename) {
  const name = filename ?? storagePath.split("/").pop() ?? "download";
  try {
    const info = await fetchDownloadInfo(storagePath);
    if (info.mode === "direct" && info.url) {
      const a = document.createElement("a");
      a.href = info.url;
      a.download = name;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }
  } catch {
    // presigned 未設定時はプロキシへフォールバック
  }
  const blob = await fetchFileBlob(storagePath);
  saveBlob(blob, name);
}

/** 複数ファイルを ZIP にまとめてダウンロード */
async function downloadEntriesAsZip(entries, options = {}) {
  const { onProgress } = options;
  const files = {};

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    onProgress?.(i, entries.length, entry.filename);
    const blob = await fetchFileBlob(entry.storagePath);
    const data = new Uint8Array(await blob.arrayBuffer());
    const zipPath = ensureUniqueZipPath(files, entry.filename);
    files[zipPath] = data;
    onProgress?.(i + 1, entries.length, entry.filename);
  }

  onProgress?.(entries.length, entries.length, "ZIP を作成中…");

  const zipped = await new Promise((resolve, reject) => {
    zip(files, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

  const zipBlob = new Blob([zipped], { type: "application/zip" });
  saveBlob(zipBlob, buildZipFilename());
  return { count: entries.length, mode: "zip" };
}

/** 選択項目を1件ずつ順番にダウンロード */
async function downloadEntriesSequentially(entries, options = {}) {
  const { onProgress } = options;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    await downloadSingleFile(entry.storagePath, toDownloadFilename(entry.filename));
    onProgress?.(i + 1, entries.length, entry.filename);
    if (i < entries.length - 1) {
      await sleep(DOWNLOAD_GAP_MS);
    }
  }

  return { count: entries.length, mode: "sequential" };
}

/** 選択項目をダウンロード（条件により ZIP または個別） */
export async function downloadItems(items, options = {}) {
  const entries = await collectDownloadEntries(items);

  if (entries.length === 0) {
    throw new Error("ダウンロードできるファイルがありません");
  }

  if (entries.length === 1) {
    const entry = entries[0];
    await downloadSingleFile(entry.storagePath, entry.filename);
    options.onProgress?.(1, 1, entry.filename);
    return { count: 1, mode: "single" };
  }

  if (canDownloadAsZip(entries)) {
    return downloadEntriesAsZip(entries, options);
  }

  return downloadEntriesSequentially(entries, options);
}

/** @deprecated downloadItems を使用 */
export async function downloadItemsSequentially(items, options = {}) {
  return downloadItems(items, options);
}
