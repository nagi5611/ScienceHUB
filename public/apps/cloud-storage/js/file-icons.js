/**
 * ファイル種別アイコン
 */

const EXT_GROUPS = [
  {
    kind: "image",
    label: "画像",
    exts: ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "ico", "heic", "heif", "tif", "tiff", "avif"],
  },
  {
    kind: "video",
    label: "動画",
    exts: ["mp4", "webm", "mkv", "avi", "mov", "m4v", "wmv", "flv", "mpeg", "mpg"],
  },
  {
    kind: "audio",
    label: "音声",
    exts: ["mp3", "wav", "flac", "ogg", "aac", "m4a", "wma", "opus"],
  },
  {
    kind: "model3d",
    label: "3Dモデル",
    exts: ["stl", "obj", "fbx", "glb", "gltf", "blend", "step", "stp", "3mf", "ply", "dae", "usdz"],
  },
  {
    kind: "document",
    label: "ドキュメント",
    exts: ["pdf", "doc", "docx", "odt", "rtf", "pages"],
  },
  {
    kind: "spreadsheet",
    label: "表計算",
    exts: ["xls", "xlsx", "ods", "numbers", "csv"],
  },
  {
    kind: "presentation",
    label: "プレゼン",
    exts: ["ppt", "pptx", "odp", "key"],
  },
  {
    kind: "archive",
    label: "アーカイブ",
    exts: ["zip", "rar", "7z", "tar", "gz", "bz2", "xz", "tgz"],
  },
  {
    kind: "code",
    label: "コード",
    exts: [
      "js", "mjs", "cjs", "ts", "tsx", "jsx", "py", "java", "c", "cpp", "h", "hpp", "cs", "go", "rs",
      "rb", "php", "sql", "sh", "ps1", "html", "htm", "css", "scss", "less", "json", "xml", "yaml", "yml",
    ],
  },
  {
    kind: "text",
    label: "テキスト",
    exts: ["txt", "md", "log", "ini", "cfg", "conf", "env"],
  },
];

const EXT_MAP = new Map();
for (const group of EXT_GROUPS) {
  for (const ext of group.exts) {
    EXT_MAP.set(ext, group);
  }
}

/** ファイル名から拡張子を取得 */
export function getFileExtension(filename) {
  const lower = filename.toLowerCase();
  const dot = lower.lastIndexOf(".");
  if (dot <= 0 || dot === lower.length - 1) return "";
  return lower.slice(dot + 1);
}

/** ファイル種別を分類 */
export function classifyFile(filename) {
  const ext = getFileExtension(filename);
  if (!ext) return { kind: "file", label: "ファイル" };
  return EXT_MAP.get(ext) ?? { kind: "file", label: "ファイル" };
}

const ICONS = {
  folder: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z"/></svg>`,
  image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.6" fill="currentColor" stroke="none"/><path d="m3 16 5-5 4 4 3-3 6 6"/></svg>`,
  video: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v2l4-2v12l-4-2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z"/></svg>`,
  audio: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/></svg>`,
  model3d: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3z"/><path d="M12 12 4 7.5M12 12v9M12 12l8-4.5"/></svg>`,
  document: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2 5 5h-5V4zM8 13h8v2H8v-2zm0 4h8v2H8v-2z"/></svg>`,
  spreadsheet: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1.5V8h4.5L14 3.5zM7 11h3v3H7v-3zm5 0h3v3h-3v-3zm-5 5h3v3H7v-3zm5 0h3v3h-3v-3z"/></svg>`,
  presentation: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 4h16v10H4V4zm2 12h12v2H6v-2zm-1 4h14v2H5v-2z"/><rect x="7" y="7" width="10" height="4" rx="1" fill="#fff" opacity=".35"/></svg>`,
  archive: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 4h16v4H4V4zm2 6h2v2H6v-2zm0 4h2v2H6v-2zm0 4h2v2H6v-2zm4-8h8v10a2 2 0 0 1-2 2h-6V10zm2 2v8h4v-8h-4z"/></svg>`,
  code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m8 8-4 4 4 4"/><path d="m16 8 4 4-4 4"/><path d="M13.5 6 10.5 18"/></svg>`,
  text: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2 5 5h-5V4zM7 11h10v2H7v-2zm0 4h7v2H7v-2z"/></svg>`,
  file: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2 5 5h-5V4z"/></svg>`,
};

/** 一覧用アイコン HTML */
export function renderFileTypeIcon(item) {
  if (item.type === "folder") {
    return `<span class="cs-type-icon cs-type-icon--folder" data-folder-preview="${escapeAttr(item.path)}" title="フォルダ" aria-label="フォルダ">
    <span class="cs-folder-preview-grid" aria-hidden="true"></span>
    <span class="cs-type-icon-graphic cs-type-icon-graphic--folder">${ICONS.folder}</span>
  </span>`;
  }

  const kind = classifyFile(item.name).kind;
  const label = classifyFile(item.name).label;
  const svg = ICONS[kind] ?? ICONS.file;
  const ext = getFileExtension(item.name).toUpperCase().slice(0, 4);

  if (kind === "image" || kind === "video") {
    return `<span class="cs-type-icon cs-type-icon--${kind}" data-file-thumb="${escapeAttr(item.path)}" title="${label}" aria-label="${label}">
    <span class="cs-type-icon-graphic">${svg}</span>
    <img class="cs-file-thumb" alt="" hidden decoding="async">
    ${ext ? `<span class="cs-type-icon-badge">${ext}</span>` : ""}
  </span>`;
  }

  return `<span class="cs-type-icon cs-type-icon--${kind}" title="${label}" aria-label="${label}">
    <span class="cs-type-icon-graphic">${svg}</span>
    ${ext ? `<span class="cs-type-icon-badge">${ext}</span>` : ""}
  </span>`;
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

/** プレビュー時の大容量警告しきい値（10 MB） */
export const PREVIEW_LARGE_WARNING_BYTES = 10 * 1024 * 1024;

/** Office Online 埋め込みプレビュー対象の拡張子 */
const OFFICE_PREVIEW_EXTENSIONS = new Set([
  "doc", "docx", "dot", "dotx",
  "xls", "xlsx", "xlsm", "xlsb",
  "ppt", "pptx", "pps", "ppsx", "potx",
  "odt", "ods", "odp",
]);

export function isOfficePreviewableFilename(filename) {
  const ext = getFileExtension(filename).toLowerCase();
  return OFFICE_PREVIEW_EXTENSIONS.has(ext);
}

/** 3D モデルで A-Frame プレビュー可能な形式 */
export function getModel3dPreviewFormat(filename) {
  const ext = getFileExtension(filename).toLowerCase();
  if (ext === "glb" || ext === "gltf") return "gltf";
  if (ext === "obj") return "obj";
  if (ext === "stl") return "stl";
  if (ext === "fbx") return "fbx";
  return null;
}

/** プレビュー可否 */
export function isPreviewableFile(item) {
  if (!item || item.type !== "file") return false;
  const kind = classifyFile(item.name).kind;
  if (kind === "image" || kind === "video" || kind === "audio") return true;
  if (kind === "text" || kind === "code") return true;
  if (kind === "document" && /\.pdf$/i.test(item.name)) return true;
  if (kind === "document" || kind === "spreadsheet" || kind === "presentation") {
    return isOfficePreviewableFilename(item.name);
  }
  if (kind === "model3d") return getModel3dPreviewFormat(item.name) !== null;
  return false;
}

/** ドキュメント・テキスト系で大容量警告が必要か */
export function needsLargePreviewWarning(item) {
  if (!item || item.type !== "file") return false;
  const kind = classifyFile(item.name).kind;
  if (kind === "text" || kind === "code") return true;
  if (kind === "document" && /\.pdf$/i.test(item.name)) return true;
  if (kind === "model3d" && getModel3dPreviewFormat(item.name)) return true;
  return false;
}

/** 同一カテゴリで連続プレビューできるファイル一覧 */
export function getSameCategoryPreviewItems(items, currentItem) {
  const currentKind = classifyFile(currentItem.name).kind;
  const currentOffice = isOfficePreviewableFilename(currentItem.name);
  const currentPdf = /\.pdf$/i.test(currentItem.name);

  return items.filter((item) => {
    if (item.type !== "file" || !isPreviewableFile(item)) return false;

    if (currentOffice) return isOfficePreviewableFilename(item.name);
    if (currentPdf) return /\.pdf$/i.test(item.name);
    if (isOfficePreviewableFilename(item.name) || /\.pdf$/i.test(item.name)) return false;

    return classifyFile(item.name).kind === currentKind;
  });
}
