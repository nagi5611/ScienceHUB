/**
 * 動画フレーム抽出 — 定数
 */

/** 最大動画サイズ（5GB） */
export const MAX_VIDEO_BYTES = 5 * 1024 * 1024 * 1024;

/** 警告を出すサイズ（2GB） */
export const WARN_VIDEO_BYTES = 2 * 1024 * 1024 * 1024;

/** 対応する動画拡張子 */
export const VIDEO_EXTENSIONS = new Set(["mp4", "webm", "avi"]);

/** 動画出力形式（連番フレーム） */
export const VIDEO_OUTPUT_FORMATS = new Set(["png", "jpeg", "gif"]);

/** OPFS 必須とみなす解像度（幅×高さ）— 1080p 超 */
export const OPFS_PIXEL_THRESHOLD = 1920 * 1080;

/** ZIP 生成時の OPFS 読み込みバッチサイズ（4K 時は小さめ） */
export const ZIP_BATCH_DEFAULT = 50;
export const ZIP_BATCH_4K = 8;

/** ffmpeg コア JS（public に同梱・約 0.1 MiB） */
export const FFMPEG_CORE_JS_BASE = "/apps/image-converter/vendor/ffmpeg";

/** ffmpeg コア WASM（R2 経由 API — public には置かない） */
export const FFMPEG_CORE_WASM_URL = "/api/image-converter/assets/ffmpeg-core.wasm";

/** @deprecated FFMPEG_CORE_JS_BASE を使用 */
export const FFMPEG_CORE_BASE = FFMPEG_CORE_JS_BASE;
