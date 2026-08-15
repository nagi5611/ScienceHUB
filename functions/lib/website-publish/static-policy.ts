/**
 * ウェブサイト公開 — 静的ファイルポリシー
 */

const ALLOWED_EXTENSIONS = new Set([
  ".html",
  ".htm",
  ".css",
  ".js",
  ".mjs",
  ".json",
  ".svg",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".ico",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
  ".map",
  ".txt",
  ".xml",
  ".webmanifest",
]);

const DENIED_EXTENSIONS = new Set([
  ".php",
  ".py",
  ".sh",
  ".exe",
  ".bat",
  ".cmd",
  ".jar",
  ".wasm",
  ".cgi",
  ".pl",
  ".rb",
]);

/** ファイル名から拡張子を取得（小文字） */
export function getExtension(filename: string): string {
  const base = filename.split("/").pop() ?? filename;
  const dot = base.lastIndexOf(".");
  if (dot <= 0) return "";
  return base.slice(dot).toLowerCase();
}

/** 相対パスが安全か検証 */
export function isSafeRelativePath(path: string): boolean {
  if (!path || path.startsWith("/")) return false;
  const segments = path.split("/");
  for (const seg of segments) {
    if (!seg || seg === "." || seg === "..") return false;
    if (seg.startsWith(".")) return false;
  }
  return true;
}

/** 静的ファイルとして許可されるか */
export function isAllowedStaticFile(relativePath: string): boolean {
  if (!isSafeRelativePath(relativePath)) return false;
  const ext = getExtension(relativePath);
  if (!ext) return false;
  if (DENIED_EXTENSIONS.has(ext)) return false;
  return ALLOWED_EXTENSIONS.has(ext);
}

/** ディレクトリ相対パスが安全か */
export function isSafeRelativeDir(dir: string): boolean {
  if (!dir) return true;
  return isSafeRelativePath(dir);
}

/** ディレクトリ相対パスをサニタイズ */
export function sanitizeRelativeDir(dir: string): string {
  const normalized = dir.replace(/\\/g, "/").trim().replace(/^\/+/, "").replace(/\/+$/, "");
  if (!normalized) return "";
  if (!isSafeRelativeDir(normalized)) {
    throw new Error("ディレクトリパスが不正です");
  }
  return normalized;
}

/** テキストエディタで編集可能な拡張子 */
const EDITABLE_EXTENSIONS = new Set([
  ".html",
  ".htm",
  ".css",
  ".js",
  ".mjs",
  ".json",
  ".svg",
  ".txt",
  ".xml",
  ".webmanifest",
  ".map",
]);

/** テキストエディタで編集可能か */
export function isEditableTextFile(relativePath: string): boolean {
  if (!isAllowedStaticFile(relativePath)) return false;
  const ext = getExtension(relativePath);
  return EDITABLE_EXTENSIONS.has(ext);
}

/** 単一ファイル名・フォルダ名をサニタイズ */
export function sanitizeSingleName(name: string): string {
  const trimmed = name.trim().replace(/\\/g, "/");
  if (!trimmed || trimmed.includes("/") || trimmed.includes("..")) {
    throw new Error("名前が不正です");
  }
  if (trimmed.startsWith(".")) {
    throw new Error("ドット始まりの名前は使用できません");
  }
  return trimmed;
}

/** ファイル相対パスをサニタイズ */
export function sanitizeRelativePath(path: string): string {
  const normalized = path.replace(/\\/g, "/").trim().replace(/^\/+/, "");
  if (!isSafeRelativePath(normalized)) {
    throw new Error("ファイルパスが不正です");
  }
  if (!isAllowedStaticFile(normalized)) {
    throw new Error("許可されていないファイル形式です");
  }
  return normalized;
}