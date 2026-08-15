/**
 * ファイル名・入力検証ユーティリティ
 */

import {
  AUDIO_EXTENSIONS,
  MAX_AUDIO_BYTES,
  OUTPUT_FORMATS,
  VIDEO_EXTENSIONS,
  WARN_AUDIO_BYTES,
} from "./constants.js";

export function getFileExtension(name) {
  const match = String(name).match(/\.([^.]+)$/);
  return match ? match[1].toLowerCase() : "";
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function isVideoInput(file) {
  const mime = String(file.type ?? "").toLowerCase();
  if (mime.startsWith("video/")) return true;
  return VIDEO_EXTENSIONS.has(getFileExtension(file.name));
}

export function isAudioInput(file) {
  const mime = String(file.type ?? "").toLowerCase();
  if (mime.startsWith("image/")) return false;
  if (mime.startsWith("audio/")) return true;
  if (isVideoInput(file)) return true;
  return AUDIO_EXTENSIONS.has(getFileExtension(file.name));
}

export function inspectAudioInput(file) {
  if (!(file instanceof File)) {
    return { ok: false, reason: "ファイルが不正です" };
  }
  if (!isAudioInput(file)) {
    return { ok: false, reason: "対応していない音声・動画形式です" };
  }
  const mime = String(file.type ?? "").toLowerCase();
  if (mime.startsWith("image/")) {
    return { ok: false, reason: "このファイルは画像です。音声変換には対応していません" };
  }
  if (file.size > MAX_AUDIO_BYTES) {
    return { ok: false, reason: `ファイルは ${formatBytes(MAX_AUDIO_BYTES)} 以下にしてください` };
  }

  /** @type {string[]} */
  const warnings = [];
  if (file.size > WARN_AUDIO_BYTES) {
    warnings.push(`${formatBytes(WARN_AUDIO_BYTES)} 超 — 変換に時間がかかる場合があります`);
  }
  if (isVideoInput(file)) {
    warnings.push("動画ファイル — 音声トラックのみを抽出して変換します");
  }

  return { ok: true, warnings };
}

export function buildOutputFilename(originalName, formatId) {
  const spec = OUTPUT_FORMATS[formatId];
  const base = originalName.replace(/\.[^.]+$/, "") || "audio";
  return `${base}.${spec?.ext ?? formatId}`;
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
