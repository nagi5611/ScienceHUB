/**
 * 動画変換 — 定数
 */

export const APP_SLUG = "video-converter";

/** 最大動画サイズ（4GB） */
export const MAX_VIDEO_BYTES = 4 * 1024 * 1024 * 1024;

/** 警告を出すサイズ（2GB） */
export const WARN_VIDEO_BYTES = 2 * 1024 * 1024 * 1024;

/** パート分割するファイルサイズ閾値（128MB） */
export const PART_SIZE_BYTES = 128 * 1024 * 1024;

/** パート分割する長さ閾値（秒） */
export const PART_DURATION_THRESHOLD_SEC = 90;

/** 1パートあたりの最大秒数 */
export const PART_DURATION_SEC = 90;

/** 1パートの最小秒数 */
export const MIN_PART_DURATION_SEC = 30;

/** 対応入力拡張子 */
export const VIDEO_EXTENSIONS = new Set([
  "mp4",
  "webm",
  "avi",
  "mov",
  "mkv",
  "wmv",
  "mpeg",
  "mpg",
  "3gp",
  "m4v",
  "flv",
  "ogv",
]);

/** 出力形式 */
export const OUTPUT_FORMATS = {
  mp4: { id: "mp4", label: "MP4 (H.264 + AAC)", mime: "video/mp4", ext: "mp4" },
  webm: { id: "webm", label: "WebM (VP9 + Opus)", mime: "video/webm", ext: "webm" },
};

export const FFMPEG_CORE_JS_BASE = "/apps/image-converter/vendor/ffmpeg";
export const FFMPEG_CORE_WASM_URL = "/api/image-converter/assets/ffmpeg-core.wasm";
export const FFMPEG_MOUNT_POINT = "/vcv-input";
