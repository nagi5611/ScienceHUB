/**
 * PDF 出力のダウンロード（単体 / ZIP）
 */

import { zip } from "fflate";

/** Blob をファイルとしてダウンロード */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/** バイト数を人間向けに整形 */
export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

/** ZIP ファイル名を生成 */
export function buildZipFilename(prefix = "pdf-split") {
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  return `${prefix}-${stamp}.zip`;
}

/**
 * 無圧縮 ZIP Blob を生成
 * @param {Record<string, Uint8Array>} files
 */
async function zipStore(files) {
  const data = await new Promise((resolve, reject) => {
    zip(files, { level: 0 }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
  return new Blob([data], { type: "application/zip" });
}

/**
 * 複数 PDF 結果をダウンロード（1件は直接、2件以上は ZIP）
 * @param {Array<{ bytes: Uint8Array, name: string }>} results
 * @param {{ zipPrefix?: string }} [options]
 */
export async function downloadPdfResults(results, options = {}) {
  if (results.length === 0) {
    throw new Error("ダウンロードできるファイルがありません");
  }

  if (results.length === 1) {
    const blob = new Blob([results[0].bytes], { type: "application/pdf" });
    downloadBlob(blob, results[0].name);
    return { mode: "single", count: 1 };
  }

  const files = {};
  const used = new Set();

  for (const result of results) {
    const entryName = ensureUniqueFilename(used, result.name);
    files[entryName] = result.bytes;
  }

  const zipBlob = await zipStore(files);
  downloadBlob(zipBlob, buildZipFilename(options.zipPrefix));
  return { mode: "zip", count: results.length };
}
