/**
 * 添付ファイルの変換種別を判定
 */

/** @typedef {'pdf' | 'excel' | 'docx' | 'pptx' | 'text' | 'image' | 'unsupported' | 'passthrough'} AttachmentKind */

const EXCEL_EXTENSIONS = new Set([
  "xlsx",
  "xlsm",
  "xls",
  "xlsb",
  "ods",
  "csv",
]);

const TEXT_EXTENSIONS = new Set([
  "txt",
  "md",
  "markdown",
  "json",
  "xml",
  "html",
  "htm",
  "log",
  "yaml",
  "yml",
  "ts",
  "js",
  "py",
  "sql",
]);

const IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "svg",
  "avif",
  "ico",
]);

/** ファイル名から拡張子を取得 */
export function getFileExtension(filename) {
  const base = String(filename ?? "").split(/[/\\]/).pop() ?? "";
  const dot = base.lastIndexOf(".");
  if (dot < 1) return "";
  return base.slice(dot + 1).toLowerCase();
}

/**
 * 変換種別を返す
 * @param {File} file
 * @returns {AttachmentKind}
 */
export function detectAttachmentKind(file) {
  const ext = getFileExtension(file.name);
  const mime = String(file.type ?? "").toLowerCase();

  if (ext === "pdf" || mime === "application/pdf") return "pdf";
  if (ext === "docx" || mime.includes("wordprocessingml")) return "docx";
  if (ext === "doc" || mime === "application/msword") return "unsupported";
  if (ext === "pptx" || mime.includes("presentationml")) return "pptx";
  if (ext === "ppt" || mime === "application/vnd.ms-powerpoint") return "unsupported";

  if (
    EXCEL_EXTENSIONS.has(ext) ||
    mime.includes("spreadsheet") ||
    mime === "text/csv"
  ) {
    return ext === "csv" ? "text" : "excel";
  }

  if (TEXT_EXTENSIONS.has(ext) || mime.startsWith("text/")) return "text";
  if (IMAGE_EXTENSIONS.has(ext) || mime.startsWith("image/")) return "image";

  return "passthrough";
}

/** 非対応時の案内メッセージ */
export function unsupportedMessage(file) {
  const ext = getFileExtension(file.name);
  if (ext === "doc") {
    return "旧形式の .doc はブラウザで変換できません。Word で .docx に保存してから添付してください。";
  }
  if (ext === "ppt") {
    return "旧形式の .ppt はブラウザで変換できません。PowerPoint で .pptx に保存してから添付してください。";
  }
  return `この形式（.${ext || "不明"}）は Runa 添付の自動変換に対応していません。`;
}
