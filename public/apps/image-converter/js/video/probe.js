/**
 * 動画メタデータの取得とジョブ見積もり
 */

import { getFileExtension } from "../convert-core.js";
import {
  MAX_VIDEO_BYTES,
  WARN_VIDEO_BYTES,
  VIDEO_EXTENSIONS,
  OPFS_PIXEL_THRESHOLD,
} from "./constants.js";
import { isOpfsAvailable } from "./opfs-session.js";

/** @typedef {{
 *   width: number,
 *   height: number,
 *   duration: number,
 *   fps: number,
 *   frameCount: number,
 *   codec: string,
 * }} VideoProbe */

/** 動画ファイルか */
export function isVideoFile(file) {
  const ext = getFileExtension(file.name);
  if (VIDEO_EXTENSIONS.has(ext)) return true;
  const mime = String(file.type ?? "").toLowerCase();
  return mime.startsWith("video/");
}

/** サイズ制限チェック */
export function validateVideoSize(file) {
  if (file.size > MAX_VIDEO_BYTES) {
    return {
      ok: false,
      message: `動画は ${Math.round(MAX_VIDEO_BYTES / (1024 ** 3))}GB 以下にしてください`,
    };
  }
  const warnLarge = file.size >= WARN_VIDEO_BYTES;
  return { ok: true, warnLarge };
}

/**
 * video 要素でメタデータを取得（軽量・全形式で試行）
 * @param {File} file
 */
export async function probeVideoMetadata(file) {
  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    await new Promise((resolve, reject) => {
      video.onloadedmetadata = () => resolve(undefined);
      video.onerror = () => reject(new Error("動画メタデータを読み込めません"));
      video.src = url;
    });

    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    if (duration <= 0) {
      throw new Error("動画の長さを取得できません");
    }

    return {
      width: video.videoWidth,
      height: video.videoHeight,
      duration,
      /** 要素だけでは fps 不明 — 後段で mp4box/ffmpeg が上書き */
      fps: 30,
      frameCount: 0,
      codec: "",
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * フレーム数・出力サイズを見積もり
 * @param {VideoProbe} probe
 * @param {'png' | 'jpeg' | 'gif'} format
 */
export function estimateVideoJob(probe, format) {
  const fps = probe.fps > 0 ? probe.fps : 30;
  const frameCount =
    probe.frameCount > 0 ? probe.frameCount : Math.max(1, Math.round(probe.duration * fps));
  const pixels = probe.width * probe.height;

  let bytesPerFrame;
  if (format === "jpeg") {
    bytesPerFrame = Math.round(pixels * 0.35);
  } else if (format === "gif") {
    bytesPerFrame = Math.round(pixels * 0.5);
  } else {
    bytesPerFrame = Math.round(pixels * 1.2);
  }

  const estimatedBytes = frameCount * bytesPerFrame;
  const needsOpfs = pixels > OPFS_PIXEL_THRESHOLD || frameCount > 120 || !isOpfsAvailable();

  return {
    fps,
    frameCount,
    estimatedBytes,
    needsOpfs: needsOpfs || isOpfsAvailable(),
    is4K: pixels > OPFS_PIXEL_THRESHOLD,
  };
}

/**
 * 変換前の警告メッセージを組み立て
 * @param {File} file
 * @param {ReturnType<typeof estimateVideoJob>} estimate
 * @param {{ warnLarge: boolean }} sizeCheck
 */
export function buildVideoWarnings(file, estimate, sizeCheck) {
  /** @type {string[]} */
  const warnings = [];

  if (sizeCheck.warnLarge) {
    warnings.push(
      `ファイルサイズが ${(file.size / (1024 ** 3)).toFixed(1)}GB です。処理に時間がかかり、ブラウザが重くなる可能性があります`,
    );
  }
  if (estimate.is4K) {
    warnings.push(
      "4K 相当の解像度です。フレームは OPFS（ブラウザ内ストレージ）に逐次保存し、メモリ使用量を抑えます",
    );
  }
  if (estimate.frameCount > 5000) {
    warnings.push(`約 ${estimate.frameCount.toLocaleString()} フレーム — ZIP 生成にも時間がかかります`);
  }
  if (estimate.estimatedBytes > 2 * 1024 ** 3) {
    warnings.push("出力合計が 2GB を超える見込みです。空き容量を確認してください");
  }

  return warnings;
}

/** 連番フレームのファイル名 */
export function buildFrameFilename(baseName, frameIndex, format) {
  const ext = format === "jpeg" ? "jpg" : format;
  const num = String(frameIndex + 1).padStart(6, "0");
  return `${baseName}_${num}.${ext}`;
}
