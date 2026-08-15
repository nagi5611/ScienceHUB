/**
 * 動画 → 連番フレーム変換オーケストレーション
 */

import { getFileExtension } from "../convert-core.js";
import { createOpfsSession, checkStorageQuota, isOpfsAvailable } from "./opfs-session.js";
import {
  probeVideoMetadata,
  estimateVideoJob,
  buildVideoWarnings,
  validateVideoSize,
} from "./probe.js";
import { decodeMp4ToOpfs, canUseMp4WebCodecs } from "./decode-mp4.js";
import { decodeFfmpegToOpfs } from "./decode-ffmpeg.js";

/** @typedef {'png' | 'jpeg' | 'gif'} VideoOutputFormat */

/**
 * 変換前の検証と警告
 * @param {File} file
 * @param {VideoOutputFormat} format
 */
export async function inspectVideoFile(file, format) {
  const sizeCheck = validateVideoSize(file);
  if (!sizeCheck.ok) {
    return { ok: false, reason: sizeCheck.message };
  }

  if (!isOpfsAvailable()) {
    return {
      ok: false,
      reason: "動画のフレーム抽出には OPFS 対応ブラウザ（Chrome / Edge 等）が必要です",
    };
  }

  let probe;
  try {
    probe = await probeVideoMetadata(file);
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : "動画を読み込めません",
    };
  }

  const estimate = estimateVideoJob(probe, format);
  const storage = await checkStorageQuota(estimate.estimatedBytes);
  const warnings = buildVideoWarnings(file, estimate, sizeCheck);

  if (!storage.ok) {
    warnings.push(storage.message ?? "ストレージ容量が不足しています");
  }

  return {
    ok: true,
    probe,
    estimate,
    warnings,
    warnLarge: sizeCheck.warnLarge,
  };
}

/**
 * 動画を連番フレームに変換（OPFS に保存）
 * @param {File} file
 * @param {{
 *   format: VideoOutputFormat,
 *   quality: number,
 * }} options
 * @param {{ onProgress?: (p: { done: number, total: number }) => void }} [callbacks]
 */
export async function convertVideoToFrames(file, options, callbacks = {}) {
  const inspection = await inspectVideoFile(file, options.format);
  if (!inspection.ok) {
    throw new Error(inspection.reason);
  }

  const baseName = file.name.replace(/\.[^.]+$/, "");
  const session = await createOpfsSession(baseName);

  const decodeOptions = {
    format: options.format,
    quality: options.quality,
    baseName,
  };

  const ext = getFileExtension(file.name);
  let result;

  try {
    if (ext === "mp4" && canUseMp4WebCodecs()) {
      try {
        result = await decodeMp4ToOpfs(file, session, decodeOptions, callbacks);
      } catch {
        result = await decodeFfmpegToOpfs(
          file,
          session,
          decodeOptions,
          inspection.probe,
          callbacks,
        );
      }
    } else {
      result = await decodeFfmpegToOpfs(
        file,
        session,
        decodeOptions,
        inspection.probe,
        callbacks,
      );
    }
  } catch (error) {
    await session.dispose();
    throw error;
  }

  return {
    session,
    manifest: session.getManifest(),
    frameCount: result.frameCount,
    warnings: inspection.warnings,
  };
}

/**
 * OPFS セッションから結果 Blob 配列を読み出す（プレビュー用・先頭のみ）
 * @param {Awaited<ReturnType<createOpfsSession>>} session
 * @param {number} limit
 */
export async function readFramePreview(session, limit = 3) {
  const manifest = session.getManifest();
  const preview = [];
  for (const entry of manifest.frames.slice(0, limit)) {
    const blob = await session.readFrameBlob(entry.index);
    preview.push({ blob, name: entry.name });
  }
  return preview;
}
