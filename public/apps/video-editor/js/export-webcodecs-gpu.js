/**
 * WebCodecs + GPU (NVENC / QuickSync / VideoToolbox) によるシンプルな MP4 書き出し
 * 複雑なタイムライン合成は ffmpeg.wasm にフォールバック
 */

import { getFfmpeg } from "../../../js/ffmpeg-loader.js";
import { execFfmpegOrThrow } from "../../../js/ffmpeg-input.js";
import { probeHardwareVideoEncoder } from "../../../js/ffmpeg-capabilities.js";
import { getExportTrimRange } from "./export-video.js";

const MOUNT_POINT = "/ve-gpu";

/**
 * WebCodecs GPU エクスポートが使えるか（シンプルなトリムのみ）
 * @param {import("./export-video.js").ExportSettings} settings
 */
export function canUseWebCodecsGpuExport(settings) {
  if (settings.format !== "mp4") return false;
  if (settings.inverse) return false;
  if (settings.rotation !== 0 || settings.flipH || settings.flipV) return false;
  if (settings.cropEnabled || settings.textEnabled) return false;
  if (settings.volume !== 100 || settings.speed !== 100) return false;
  if (settings.fadeIn > 0 || settings.fadeOut > 0) return false;
  if ((settings.slipOffset ?? 0) !== 0) return false;

  const fx = settings.colorEffects;
  if (fx && ((fx.brightness ?? 0) !== 0 || (fx.contrast ?? 0) !== 0 || (fx.saturation ?? 0) !== 0)) {
    return false;
  }

  const { audioSplit } = getExportTrimRange(settings);
  if (audioSplit) return false;

  const timeline = settings.timeline;
  if (timeline) {
    const v1 = timeline.tracks.find((t) => t.id === "v1");
    const v2 = timeline.tracks.find((t) => t.id === "v2");
    const a2 = timeline.tracks.find((t) => t.id === "a2");
    if ((v1?.clips.length ?? 0) > 1) return false;
    if ((v2?.clips.length ?? 0) > 0) return false;
    if ((a2?.clips.length ?? 0) > 0) return false;
    const mediaIds = new Set(v1?.clips.map((c) => c.mediaId) ?? []);
    if (mediaIds.size > 1) return false;
  }

  return true;
}

/** CRF 相当の品質をビットレートに変換 */
function qualityToBitrate(quality, width, height) {
  const pixels = width * height;
  const mbps = (pixels / (1920 * 1080)) * 8;
  const factor = Math.max(0.35, 1.1 - (quality - 18) / 24);
  return Math.round(Math.max(0.5, mbps * factor) * 1_000_000);
}

/** video の seek 完了を待つ */
function waitSeek(video, time) {
  return new Promise((resolve, reject) => {
    const onError = () => {
      cleanup();
      reject(new Error("動画のシークに失敗しました"));
    };
    const onSeeked = () => {
      cleanup();
      resolve();
    };
    const cleanup = () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
    };
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);
    video.currentTime = time;
  });
}

/**
 * GPU で映像をエンコードし、ffmpeg で音声を合成
 * @param {File} file
 * @param {import("./export-video.js").ExportSettings} settings
 * @param {{ onProgress?: (ratio: number, message?: string) => void }} [callbacks]
 */
export async function exportVideoWebCodecsGpu(file, settings, callbacks = {}) {
  const trim = getExportTrimRange(settings);
  const duration = Math.max(0.1, trim.effectiveEnd - trim.effectiveStart);
  const width = Math.max(2, settings.videoWidth % 2 === 0 ? settings.videoWidth : settings.videoWidth - 1);
  const height = Math.max(2, settings.videoHeight % 2 === 0 ? settings.videoHeight : settings.videoHeight - 1);
  const fps = Math.max(1, Math.min(60, settings.fps ?? 30));

  const encoderProbe = await probeHardwareVideoEncoder(width, height);
  if (!encoderProbe.supported || !encoderProbe.config) {
    throw new Error("GPU エンコーダが利用できません");
  }

  callbacks.onProgress?.(0.08, "GPU エンコーダを準備中…");

  const { Muxer, ArrayBufferTarget } = await import("../vendor/mp4-muxer/mp4-muxer.mjs");
  const target = new ArrayBufferTarget();
  const muxer = new Muxer({
    target,
    video: {
      codec: "avc",
      width,
      height,
    },
    fastStart: "in-memory",
  });

  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  const objectUrl = URL.createObjectURL(file);
  video.src = objectUrl;

  await new Promise((resolve, reject) => {
    video.onloadedmetadata = () => resolve(undefined);
    video.onerror = () => reject(new Error("動画の読み込みに失敗しました"));
  });

  const bitrate = qualityToBitrate(settings.quality, width, height);
  /** @type {VideoEncoderConfig} */
  const encoderConfig = {
    ...encoderProbe.config,
    width,
    height,
    bitrate,
    framerate: fps,
    latencyMode: "quality",
    avc: { format: "avc" },
  };

  const support = await VideoEncoder.isConfigSupported(encoderConfig);
  if (!support.supported) {
    URL.revokeObjectURL(objectUrl);
    throw new Error("GPU エンコード設定がサポートされていません");
  }

  let encodedChunks = 0;
  const encoder = new VideoEncoder({
    output: (chunk, meta) => {
      muxer.addVideoChunk(chunk, meta);
      encodedChunks += 1;
    },
    error: (e) => {
      console.error("VideoEncoder error:", e);
    },
  });
  encoder.configure(support.config ?? encoderConfig);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) {
    URL.revokeObjectURL(objectUrl);
    throw new Error("Canvas 2D が利用できません");
  }

  const frameCount = Math.max(1, Math.ceil(duration * fps));
  const frameDurationUs = Math.round(1_000_000 / fps);

  for (let i = 0; i < frameCount; i += 1) {
    const t = trim.effectiveStart + i / fps;
    if (t >= trim.effectiveEnd) break;

    await waitSeek(video, Math.min(t, video.duration - 0.001));
    ctx.drawImage(video, 0, 0, width, height);

    const timestamp = i * frameDurationUs;
    const frame = new VideoFrame(canvas, { timestamp, duration: frameDurationUs });
    const keyFrame = i % (fps * 2) === 0;
    encoder.encode(frame, { keyFrame });
    frame.close();

    if (i % Math.max(1, Math.floor(fps / 2)) === 0) {
      const ratio = 0.1 + (i / frameCount) * 0.55;
      callbacks.onProgress?.(ratio, "GPU エンコード中…");
    }
  }

  await encoder.flush();
  encoder.close();
  muxer.finalize();
  URL.revokeObjectURL(objectUrl);

  if (encodedChunks === 0) {
    throw new Error("GPU エンコードでフレームが生成されませんでした");
  }

  const videoOnlyBlob = new Blob([target.buffer], { type: "video/mp4" });
  callbacks.onProgress?.(0.72, "音声を合成中…");

  const ffmpeg = await getFfmpeg();
  const gpuFile = new File([videoOnlyBlob], "gpu-video.mp4", { type: "video/mp4" });

  try {
    await ffmpeg.mount("WORKERFS", { files: [gpuFile, file] }, MOUNT_POINT);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`ファイルのマウントに失敗しました（${detail}）`);
  }

  const outName = "output.mp4";
  try {
    await execFfmpegOrThrow(ffmpeg, [
      "-hide_banner",
      "-i",
      `${MOUNT_POINT}/gpu-video.mp4`,
      "-ss",
      String(trim.effectiveStart),
      "-to",
      String(trim.effectiveEnd),
      "-i",
      `${MOUNT_POINT}/${file.name}`,
      "-map",
      "0:v:0",
      "-map",
      "1:a:0?",
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-shortest",
      "-movflags",
      "+faststart",
      "-y",
      outName,
    ]);

    callbacks.onProgress?.(0.96, "ファイルを読み込み中…");
    const data = await ffmpeg.readFile(outName);
    await ffmpeg.deleteFile(outName);
    callbacks.onProgress?.(1, "完了");
    return new Blob([data], { type: "video/mp4" });
  } finally {
    try {
      await ffmpeg.unmount(MOUNT_POINT);
    } catch {
      /* ignore */
    }
  }
}
