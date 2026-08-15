/**
 * ffmpeg.wasm による音声書き出し（トリム・フェード・音量・速度・ピッチ）
 */

import { resolveFfmpegWasmUrl } from "../../../js/ffmpeg-wasm-url.js";

const FFMPEG_CORE_JS_BASE = "/apps/image-converter/vendor/ffmpeg";
const MOUNT_POINT = "/ae-input";

/** @type {import('@ffmpeg/ffmpeg').FFmpeg | null} */
let ffmpegInstance = null;
/** @type {Promise<import('@ffmpeg/ffmpeg').FFmpeg> | null} */
let ffmpegLoadPromise = null;

/** ffmpeg をシングルトンでロード */
async function getFfmpeg() {
  if (ffmpegInstance?.loaded) return ffmpegInstance;
  if (ffmpegLoadPromise) return ffmpegLoadPromise;

  ffmpegLoadPromise = (async () => {
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    const { toBlobURL } = await import("@ffmpeg/util");
    const ffmpeg = new FFmpeg();
    const workerBase = "/apps/image-converter/vendor/ffmpeg-js";
    const wasmUrl = await resolveFfmpegWasmUrl();
    await ffmpeg.load({
      coreURL: await toBlobURL(`${FFMPEG_CORE_JS_BASE}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(wasmUrl, "application/wasm"),
      workerURL: await toBlobURL(`${workerBase}/worker.js`, "text/javascript"),
    });
    ffmpegInstance = ffmpeg;
    return ffmpeg;
  })();

  return ffmpegLoadPromise;
}

/**
 * @typedef {Object} ExportSettings
 * @property {number} start
 * @property {number} end
 * @property {number} volume 0-200
 * @property {number} speed 50-200
 * @property {number} pitch semitones -12..12
 * @property {number} fadeIn
 * @property {number} fadeOut
 * @property {string} format wav | mp3 | ogg | m4a | m4r | flac
 * @property {number} bitrateKbps
 * @property {boolean} noReencode
 * @property {boolean} extractAudioFromVideo
 * @property {boolean} normalize
 * @property {boolean} reverse
 * @property {boolean} trimSilence
 * @property {string} [metadataTitle]
 */

/** 入力と同形式ならストリームコピー可能 */
function canStreamCopyForFile(file, format) {
  if (file.type.startsWith("video/") || /\.(mp4|webm|avi|mov|mkv|wmv|mpeg|mpg|3gp|m4v)$/i.test(file.name)) {
    return false;
  }
  const ext = (file.name.match(/\.([^.]+)$/)?.[1] || "").toLowerCase();
  if (format === "m4r") return ext === "m4r";
  if (format === "m4a") return ext === "m4a" || ext === "m4r";
  if (format === "wav") return ext === "wav";
  if (format === "flac") return ext === "flac";
  return ext === format;
}

/** 再エンコードが必要か */
export function needsReencode(settings) {
  return (
    settings.volume !== 100 ||
    settings.speed !== 100 ||
    settings.pitch !== 0 ||
    settings.fadeIn > 0 ||
    settings.fadeOut > 0 ||
    settings.extractAudioFromVideo ||
    settings.normalize ||
    settings.reverse ||
    settings.trimSilence
  );
}

/** 速度用 atempo チェーン */
function buildAtempoChain(speedPercent) {
  /** @type {string[]} */
  const filters = [];
  let factor = speedPercent / 100;
  while (factor > 2.0) {
    filters.push("atempo=2.0");
    factor /= 2.0;
  }
  while (factor < 0.5) {
    filters.push("atempo=0.5");
    factor /= 0.5;
  }
  if (Math.abs(factor - 1) > 0.001) {
    filters.push(`atempo=${factor.toFixed(4)}`);
  }
  return filters;
}

/** ピッチ（半音）フィルタ */
function buildPitchFilter(semitones) {
  if (!semitones) return null;
  const factor = 2 ** (semitones / 12);
  return `asetrate=44100*${factor.toFixed(6)},aresample=44100,atempo=${(1 / factor).toFixed(6)}`;
}

/** 音声フィルタチェーン */
function buildAudioFilters(settings) {
  /** @type {string[]} */
  const filters = [];

  const pitch = buildPitchFilter(settings.pitch);
  if (pitch) filters.push(pitch);

  if (settings.volume !== 100) {
    filters.push(`volume=${(settings.volume / 100).toFixed(3)}`);
  }

  filters.push(...buildAtempoChain(settings.speed));

  const clipDuration = Math.max(0.1, settings.end - settings.start);
  if (settings.fadeIn > 0) {
    filters.push(`afade=t=in:st=0:d=${settings.fadeIn}`);
  }
  if (settings.fadeOut > 0) {
    const fadeStart = Math.max(0, clipDuration - settings.fadeOut);
    filters.push(`afade=t=out:st=${fadeStart}:d=${settings.fadeOut}`);
  }

  if (settings.trimSilence) {
    filters.push(
      "silenceremove=start_periods=1:start_duration=0.25:start_threshold=-45dB:stop_periods=1:stop_duration=0.25:stop_threshold=-45dB"
    );
  }

  if (settings.normalize) {
    filters.push("loudnorm=I=-16:TP=-1.5:LRA=11");
  }

  if (settings.reverse) {
    filters.push("areverse");
  }

  return filters.length ? filters.join(",") : null;
}

/** 出力ファイル名（ffmpeg 内部） */
function outputFilename(format) {
  switch (format) {
    case "mp3":
      return "output.mp3";
    case "ogg":
      return "output.ogg";
    case "m4a":
      return "output.m4a";
    case "m4r":
      return "output.m4r";
    case "flac":
      return "output.flac";
    default:
      return "output.wav";
  }
}

/** MIME タイプ */
function outputMime(format) {
  switch (format) {
    case "mp3":
      return "audio/mpeg";
    case "ogg":
      return "audio/ogg";
    case "m4a":
      return "audio/mp4";
    case "m4r":
      return "audio/mp4";
    case "flac":
      return "audio/flac";
    default:
      return "audio/wav";
  }
}

/** エンコーダ引数 */
function codecArgs(format, bitrateKbps) {
  switch (format) {
    case "mp3":
      return ["-c:a", "libmp3lame", "-b:a", String(bitrateKbps) + "k"];
    case "ogg":
      return ["-c:a", "libopus", "-b:a", String(bitrateKbps) + "k"];
    case "m4a":
    case "m4r":
      return ["-c:a", "aac", "-b:a", String(bitrateKbps) + "k"];
    case "flac":
      return ["-c:a", "flac"];
    default:
      return ["-c:a", "pcm_s16le"];
  }
}

/**
 * 音声を書き出す
 * @param {File} file
 * @param {ExportSettings} settings
 * @param {{ onProgress?: (ratio: number, message?: string) => void }} [callbacks]
 */
export async function exportAudio(file, settings, callbacks = {}) {
  const ffmpeg = await getFfmpeg();
  callbacks.onProgress?.(0.05, "ffmpeg を準備中…");

  await ffmpeg.mount("WORKERFS", { files: [file] }, MOUNT_POINT);
  const inputPath = `${MOUNT_POINT}/${file.name}`;
  const outName = outputFilename(settings.format);
  const streamCopy =
    settings.noReencode &&
    !needsReencode({ ...settings, extractAudioFromVideo: false }) &&
    canStreamCopyForFile(file, settings.format);

  ffmpeg.on("progress", ({ progress }) => {
    if (Number.isFinite(progress) && progress > 0) {
      callbacks.onProgress?.(Math.min(0.95, 0.1 + progress * 0.85), "処理中…");
    }
  });

  try {
    /** @type {string[]} */
    const args = [
      "-hide_banner",
      "-ss",
      String(settings.start),
      "-to",
      String(settings.end),
      "-i",
      inputPath,
    ];

    if (file.type.startsWith("video/") || /\.(mp4|webm|avi|mov|mkv|wmv|mpeg|mpg|3gp|m4v)$/i.test(file.name)) {
      args.push("-vn");
    }

    if (streamCopy) {
      callbacks.onProgress?.(0.15, "トリミング中（再エンコードなし）…");
      args.push("-c", "copy", "-avoid_negative_ts", "1", "-y", outName);
    } else {
      callbacks.onProgress?.(0.15, "エンコード中…");
      const af = buildAudioFilters(settings);
      if (af) args.push("-af", af);
      args.push(...codecArgs(settings.format, settings.bitrateKbps));
      const title = settings.metadataTitle?.trim();
      if (title) {
        args.push("-metadata", `title=${title}`);
      }
      args.push("-y", outName);
    }

    await ffmpeg.exec(args);

    callbacks.onProgress?.(0.96, "ファイルを読み込み中…");
    const data = await ffmpeg.readFile(outName);
    await ffmpeg.deleteFile(outName);
    callbacks.onProgress?.(1, "完了");
    return new Blob([data], { type: outputMime(settings.format) });
  } catch (error) {
    if (settings.format === "mp3") {
      throw new Error(
        "MP3 出力に失敗しました。WAV / M4A / OGG をお試しください。" +
          (error instanceof Error ? ` (${error.message})` : "")
      );
    }
    throw error;
  } finally {
    ffmpeg.off("progress");
    try {
      await ffmpeg.unmount(MOUNT_POINT);
    } catch {
      // ignore
    }
  }
}

/** ダウンロード名を生成 */
export function buildDownloadName(originalName, format) {
  const base = originalName.replace(/\.[^.]+$/, "") || "audio";
  const ext = format === "m4r" ? "m4r" : format;
  return `${base}-cut.${ext}`;
}
