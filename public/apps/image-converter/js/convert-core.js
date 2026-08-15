/**
 * 画像変換コア（形式定義・画像読み込み・canvas 出力）
 */

/** @typedef {'jpeg' | 'png' | 'webp' | 'avif'} CanvasRasterFormat */
/** @typedef {'gif' | 'ico' | 'svg'} SpecialRasterFormat */
/** @typedef {CanvasRasterFormat | SpecialRasterFormat} RasterFormat */
/** @typedef {'pdf'} DocumentFormat */
/** @typedef {RasterFormat | DocumentFormat} OutputFormat */
/** @typedef {'image' | 'pdf' | 'server-image' | 'video'} InputKind */

/** @typedef {{ id: OutputFormat, mime: string, label: string, ext: string, lossy: boolean, kind: 'raster' | 'document', encoder?: 'canvas' | 'gif' | 'ico' | 'svg' }} FormatSpec */

/** Canvas 直接出力（JPEG/PNG/WebP/AVIF） */
export const CANVAS_RASTER_FORMATS = {
  jpeg: { id: "jpeg", mime: "image/jpeg", label: "JPEG (.jpg)", ext: "jpg", lossy: true, kind: "raster", encoder: "canvas" },
  png: { id: "png", mime: "image/png", label: "PNG (.png)", ext: "png", lossy: false, kind: "raster", encoder: "canvas" },
  webp: { id: "webp", mime: "image/webp", label: "WebP (.webp)", ext: "webp", lossy: true, kind: "raster", encoder: "canvas" },
  avif: { id: "avif", mime: "image/avif", label: "AVIF (.avif)", ext: "avif", lossy: true, kind: "raster", encoder: "canvas" },
};

/** ライブラリ経由出力 */
export const SPECIAL_RASTER_FORMATS = {
  gif: { id: "gif", mime: "image/gif", label: "GIF (.gif)", ext: "gif", lossy: false, kind: "raster", encoder: "gif" },
  ico: { id: "ico", mime: "image/x-icon", label: "ICO (.ico)", ext: "ico", lossy: false, kind: "raster", encoder: "ico" },
  svg: { id: "svg", mime: "image/svg+xml", label: "SVG (.svg)", ext: "svg", lossy: false, kind: "raster", encoder: "svg" },
};

/** @type {Record<CanvasRasterFormat, FormatSpec>} */
export const RASTER_FORMATS = {
  ...CANVAS_RASTER_FORMATS,
  ...SPECIAL_RASTER_FORMATS,
};

/** @type {Record<DocumentFormat, FormatSpec>} */
export const DOCUMENT_FORMATS = {
  pdf: { id: "pdf", mime: "application/pdf", label: "PDF (.pdf)", ext: "pdf", lossy: false, kind: "document" },
};

/** @type {Record<OutputFormat, FormatSpec>} */
export const OUTPUT_FORMATS = {
  ...RASTER_FORMATS,
  ...DOCUMENT_FORMATS,
};

const SERVER_CONVERT_EXTENSIONS = new Set([
  "heic",
  "heif",
  "hif",
  "tiff",
  "tif",
  "raw",
  "cr2",
  "nef",
  "arw",
  "dng",
  "orf",
  "rw2",
]);

const VIDEO_EXTENSION_HINTS = ["mp4", "webm", "avi", "mov", "mkv"];

const VIDEO_EXTENSIONS = new Set(["mp4", "webm", "avi"]);

const IMAGE_EXTENSION_HINTS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "bmp",
  "svg",
  "svgz",
  "avif",
  "ico",
  "apng",
  "jfif",
  "pjpeg",
  "pjp",
  ...VIDEO_EXTENSION_HINTS,
];

/** ファイル名から拡張子を取得 */
export function getFileExtension(filename) {
  const base = String(filename ?? "").split(/[/\\]/).pop() ?? "";
  const dot = base.lastIndexOf(".");
  if (dot < 1) return "";
  return base.slice(dot + 1).toLowerCase();
}

/** サーバー変換（Cloudflare Images）対象か */
export function isServerConvertFile(file) {
  const ext = getFileExtension(file.name);
  if (SERVER_CONVERT_EXTENSIONS.has(ext)) return true;
  const mime = String(file.type ?? "").toLowerCase();
  return (
    mime === "image/heic" ||
    mime === "image/heif" ||
    mime === "image/tiff" ||
    mime === "image/x-tiff"
  );
}

/** 動画ファイルか（対応形式のみ） */
export function isVideoFile(file) {
  const ext = getFileExtension(file.name);
  if (VIDEO_EXTENSIONS.has(ext)) return true;
  const mime = String(file.type ?? "").toLowerCase();
  return mime.startsWith("video/");
}

/** 入力ファイルの種別を判定 */
export function detectInputKind(file) {
  const ext = getFileExtension(file.name);
  if (ext === "pdf" || file.type === "application/pdf") {
    return "pdf";
  }
  if (isVideoFile(file)) {
    return "video";
  }
  if (isServerConvertFile(file)) {
    return "server-image";
  }
  return "image";
}

/** Canvas 出力形式か */
export function isCanvasRasterFormat(format) {
  return format in CANVAS_RASTER_FORMATS;
}

/** GIF / ICO / SVG か */
export function isSpecialRasterFormat(format) {
  return format in SPECIAL_RASTER_FORMATS;
}

/** ブラウザが Canvas で出力できる形式を非同期検査（toDataURL では AVIF が誤判定される） */
export async function probeCanvasRasterFormats() {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return ["png"];

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 1, 1);

  /** @type {CanvasRasterFormat[]} */
  const supported = [];
  for (const format of Object.keys(CANVAS_RASTER_FORMATS)) {
    const spec = CANVAS_RASTER_FORMATS[/** @type {CanvasRasterFormat} */ (format)];
    const blob = await canvasToBlob(canvas, spec.mime, spec.lossy ? 0.85 : undefined);
    if (blob && blob.type === spec.mime) {
      supported.push(/** @type {CanvasRasterFormat} */ (format));
    }
  }
  return supported.length > 0 ? supported : ["png"];
}

/** 同期版（後方互換・チップ初期表示用）— 全形式を返す */
export function detectSupportedRasterFormats() {
  return Object.keys(RASTER_FORMATS);
}

/** 利用可能な出力形式一覧 */
export function detectSupportedOutputFormats() {
  return [...detectSupportedRasterFormats(), "pdf"];
}

/** 入力ファイルが変換に向くか判定 */
export function inspectInputFile(file) {
  if (detectInputKind(file) === "pdf") {
    return { ok: true, kind: "pdf" };
  }

  if (isServerConvertFile(file)) {
    return { ok: true, kind: "server-image" };
  }

  if (isVideoFile(file)) {
    return { ok: true, kind: "video" };
  }

  const ext = getFileExtension(file.name);
  if (file.type.startsWith("image/") || IMAGE_EXTENSION_HINTS.includes(ext)) {
    return { ok: true, kind: "image" };
  }

  return {
    ok: false,
    reason: "対応していないファイル形式です",
  };
}

/**
 * 画像ソース（HTMLImageElement または ImageBitmap）を読み込む
 * @param {File} file
 * @returns {Promise<{ source: CanvasImageSource, width: number, height: number }>}
 */
export async function loadImageSource(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = () => resolve(undefined);
      img.onerror = () => reject(new Error("img"));
      img.src = url;
    });
    return { source: img, width: img.naturalWidth, height: img.naturalHeight };
  } catch {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);
      return { source: bitmap, width: bitmap.width, height: bitmap.height };
    } catch {
      const ext = getFileExtension(file.name).toUpperCase() || "この形式";
      throw new Error(`${ext} をブラウザで読み込めません`);
    }
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * 画像ファイルを HTMLImageElement として読み込む（後方互換）
 * @param {File} file
 */
export async function loadImageFromFile(file) {
  const { source } = await loadImageSource(file);
  if (source instanceof Image) {
    return source;
  }
  const img = new Image();
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas を初期化できません");
  ctx.drawImage(source, 0, 0);
  source.close?.();
  const dataUrl = canvas.toDataURL("image/png");
  await new Promise((resolve, reject) => {
    img.onload = () => resolve(undefined);
    img.onerror = () => reject(new Error("decode"));
    img.src = dataUrl;
  });
  return img;
}

/**
 * 最大辺に合わせて描画サイズを計算
 * @param {number} width
 * @param {number} height
 * @param {number} maxEdge
 */
export function fitDimensions(width, height, maxEdge) {
  if (!maxEdge || maxEdge <= 0) {
    return { width, height };
  }
  const longest = Math.max(width, height);
  if (longest <= maxEdge) {
    return { width, height };
  }
  const scale = maxEdge / longest;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/**
 * ラスタ画像を指定形式の Blob に変換
 * @param {File} file
 * @param {{
 *   format: RasterFormat,
 *   quality: number,
 *   maxEdge: number,
 * }} options
 */
export async function convertRasterImage(file, options) {
  const formatSpec = CANVAS_RASTER_FORMATS[/** @type {CanvasRasterFormat} */ (options.format)];
  if (!formatSpec) {
    throw new Error("出力形式が不正です");
  }

  const { source, width: srcW, height: srcH } = await loadImageSource(file);
  const { width, height } = fitDimensions(srcW, srcH, options.maxEdge);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas を初期化できません");
  }

  if (options.format === "jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }

  ctx.drawImage(source, 0, 0, width, height);
  source.close?.();

  const quality = Math.min(1, Math.max(0.05, options.quality / 100));
  const blob = await canvasToBlob(canvas, formatSpec.mime, formatSpec.lossy ? quality : undefined);
  if (!blob) {
    throw new Error(`${formatSpec.label} への変換に失敗しました`);
  }

  return blob;
}

/**
 * canvas.toBlob の Promise ラッパー
 * @param {HTMLCanvasElement} canvas
 * @param {string} mime
 * @param {number | undefined} quality
 */
export function canvasToBlob(canvas, mime, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mime, quality);
  });
}

/**
 * 変換後ファイル名を生成
 * @param {string} originalName
 * @param {OutputFormat} format
 * @param {number | undefined} pageNum
 */
export function buildOutputFilename(originalName, format, pageNum) {
  const ext = OUTPUT_FORMATS[format].ext;
  const base = String(originalName ?? "file").replace(/\.[^.]+$/, "");
  if (pageNum != null) {
    return `${base}-p${pageNum}.${ext}`;
  }
  return `${base}.${ext}`;
}

/** Blob をダウンロード */
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

/** 入力種別の表示ラベル */
export function formatInputKindLabel(kind) {
  if (kind === "pdf") return "PDF";
  if (kind === "server-image") return "サーバー変換";
  if (kind === "video") return "動画";
  return "画像";
}
