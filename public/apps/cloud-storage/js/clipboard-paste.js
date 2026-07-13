/**
 * クリップボード貼り付けから画像・動画ファイルを抽出
 */

import { classifyFile, getFileExtension } from "./file-icons.js";

const MIME_TO_EXT = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/bmp": "bmp",
  "image/svg+xml": "svg",
  "image/heic": "heic",
  "image/heif": "heif",
  "image/tiff": "tiff",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "video/x-msvideo": "avi",
  "video/x-matroska": "mkv",
  "video/mpeg": "mpeg",
};

/** 入力欄など貼り付け先として除外する要素か */
export function shouldIgnorePasteTarget(target) {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
}

/** 画像または動画としてアップロード対象か */
export function isPasteableMediaFile(file) {
  if (!(file instanceof File)) return false;

  const mime = file.type?.toLowerCase() ?? "";
  if (mime.startsWith("image/") || mime.startsWith("video/")) return true;

  const kind = classifyFile(file.name).kind;
  return kind === "image" || kind === "video";
}

function extensionFromMime(mime) {
  const normalized = mime?.toLowerCase() ?? "";
  if (MIME_TO_EXT[normalized]) return MIME_TO_EXT[normalized];
  const subtype = normalized.split("/")[1]?.split("+")[0]?.trim();
  return subtype || "bin";
}

/** クリップボード由来のファイルに分かりやすい名前を付ける */
function normalizeClipboardFileName(file) {
  const rawName = file.name?.trim() ?? "";
  const extFromName = getFileExtension(rawName);
  const ext = extFromName || extensionFromMime(file.type);
  const hasUsableName =
    rawName &&
    rawName !== "blob" &&
    !rawName.startsWith("blob:") &&
    Boolean(extFromName);

  if (hasUsableName) return file;

  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const filename = `paste-${stamp}.${ext}`;
  return new File([file], filename, {
    type: file.type || "application/octet-stream",
    lastModified: file.lastModified,
  });
}

/** DataTransfer から画像・動画ファイルのみ収集 */
export function collectMediaFilesFromClipboard(clipboardData) {
  if (!clipboardData) return [];

  const seen = new Set();
  const files = [];

  const pushFile = (file) => {
    if (!file || !isPasteableMediaFile(file)) return;
    const key = `${file.name}:${file.size}:${file.lastModified}:${file.type}`;
    if (seen.has(key)) return;
    seen.add(key);
    files.push(normalizeClipboardFileName(file));
  };

  for (const item of clipboardData.items ?? []) {
    if (item.kind !== "file") continue;
    pushFile(item.getAsFile());
  }

  for (const file of clipboardData.files ?? []) {
    pushFile(file);
  }

  return files;
}
