/**
 * 音声変換 — 定数
 */

export const APP_SLUG = "audio-converter";

/** 最大ファイルサイズ（2GB） */
export const MAX_AUDIO_BYTES = 2 * 1024 * 1024 * 1024;

/** 警告を出すサイズ（500MB） */
export const WARN_AUDIO_BYTES = 500 * 1024 * 1024;

/** パート分割するファイルサイズ閾値（64MB） */
export const PART_SIZE_BYTES = 64 * 1024 * 1024;

/** パート分割する長さ閾値（秒）— 10分超 */
export const PART_DURATION_THRESHOLD_SEC = 600;

/** 1パートあたりの最大秒数 */
export const PART_DURATION_SEC = 300;

/** 1パートの最小秒数 */
export const MIN_PART_DURATION_SEC = 60;

/** 対応音声拡張子 */
export const AUDIO_EXTENSIONS = new Set([
  "mp3",
  "wav",
  "flac",
  "ogg",
  "opus",
  "aac",
  "m4a",
  "m4r",
  "wma",
  "aiff",
  "aif",
  "weba",
]);

/** 動画から音声抽出用の入力拡張子 */
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
  mp3: { id: "mp3", label: "MP3", mime: "audio/mpeg", ext: "mp3", lossy: true },
  m4a: { id: "m4a", label: "M4A (AAC)", mime: "audio/mp4", ext: "m4a", lossy: true },
  ogg: { id: "ogg", label: "OGG (Opus)", mime: "audio/ogg", ext: "ogg", lossy: true },
  flac: { id: "flac", label: "FLAC（可逆）", mime: "audio/flac", ext: "flac", lossy: false },
  wav: { id: "wav", label: "WAV（非圧縮）", mime: "audio/wav", ext: "wav", lossy: false },
};

export const FFMPEG_CORE_JS_BASE = "/apps/image-converter/vendor/ffmpeg";
export const FFMPEG_CORE_WASM_URL = "/api/image-converter/assets/ffmpeg-core.wasm";
export const FFMPEG_MOUNT_POINT = "/acv-input";
