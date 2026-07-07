/**
 * 画像・動画などメディア種別の判定
 */

const IMAGE_EXTENSIONS = new Set([
  "png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "ico", "heic", "heif", "tif", "tiff", "avif",
]);

const VIDEO_EXTENSIONS = new Set([
  "mp4", "webm", "mkv", "avi", "mov", "m4v", "wmv", "flv", "mpeg", "mpg",
]);

export type StorageMediaKind = "image" | "video";

export function getFileExtension(filename: string): string {
  const lower = filename.toLowerCase();
  const dot = lower.lastIndexOf(".");
  if (dot <= 0 || dot === lower.length - 1) return "";
  return lower.slice(dot + 1);
}

/** プレビュー対象のメディア種別（該当なしは null） */
export function classifyStorageMedia(filename: string): StorageMediaKind | null {
  const ext = getFileExtension(filename);
  if (IMAGE_EXTENSIONS.has(ext)) return "image";
  if (VIDEO_EXTENSIONS.has(ext)) return "video";
  return null;
}

export function isPreviewableMediaFilename(filename: string): boolean {
  return classifyStorageMedia(filename) !== null;
}
