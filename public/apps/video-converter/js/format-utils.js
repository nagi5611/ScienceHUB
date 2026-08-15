/**
 * ファイル名・入力検証ユーティリティ
 */

import {
  MAX_VIDEO_BYTES,
  OUTPUT_FORMATS,
  VIDEO_EXTENSIONS,
  WARN_VIDEO_BYTES,
} from "./constants.js";

/** 拡張子を取得（小文字・ドットなし） */
export function getFileExtension(name) {
  const match = String(name).match(/\.([^.]+)$/);
  return match ? match[1].toLowerCase() : "";
}

/** バイト数を表示用に整形 */
export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/** 動画ファイルか判定（拡張子・MIME） */
export function isVideoFile(file) {
  const mime = String(file.type ?? "").toLowerCase();
  if (mime.startsWith("image/")) return false;
  if (mime.startsWith("video/")) return true;
  return VIDEO_EXTENSIONS.has(getFileExtension(file.name));
}

/**
 * 入力ファイルを検査（同期）
 * @param {File} file
 */
export function inspectVideoInput(file) {
  if (!(file instanceof File)) {
    return { ok: false, reason: "ファイルが不正です" };
  }
  if (!isVideoFile(file)) {
    return { ok: false, reason: "対応していない動画形式です" };
  }
  const mime = String(file.type ?? "").toLowerCase();
  if (mime.startsWith("image/")) {
    return { ok: false, reason: "このファイルは画像です。動画変換には対応していません" };
  }
  if (file.size > MAX_VIDEO_BYTES) {
    return { ok: false, reason: `動画は ${formatBytes(MAX_VIDEO_BYTES)} 以下にしてください` };
  }

  /** @type {string[]} */
  const warnings = [];
  if (file.size > WARN_VIDEO_BYTES) {
    warnings.push(`${formatBytes(WARN_VIDEO_BYTES)} 超 — 変換に時間がかかる場合があります`);
  }

  return { ok: true, warnings };
}

/** 出力ファイル名を生成 */
export function buildOutputFilename(originalName, formatId) {
  const spec = OUTPUT_FORMATS[formatId];
  const base = originalName.replace(/\.[^.]+$/, "") || "video";
  return `${base}.${spec?.ext ?? formatId}`;
}

/** Blob をダウンロード */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
