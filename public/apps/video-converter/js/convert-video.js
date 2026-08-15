/**
 * 動画形式変換（パート分割 + ffmpeg.wasm）
 */

import {
  FFMPEG_MOUNT_POINT,
  MIN_PART_DURATION_SEC,
  OUTPUT_FORMATS,
  PART_DURATION_SEC,
  PART_DURATION_THRESHOLD_SEC,
  PART_SIZE_BYTES,
} from "./constants.js";
import { getFfmpeg } from "./ffmpeg-loader.js";
import { probeVideo } from "./probe.js";
import {
  execFfmpegOrThrow,
  prepareFfmpegInput,
} from "../../../js/ffmpeg-input.js";

/**
 * 変換パートの時間区間を算出
 * @param {number} durationSec
 * @param {number} fileSize
 */
export function getPartRanges(durationSec, fileSize) {
  if (fileSize <= PART_SIZE_BYTES && durationSec <= PART_DURATION_THRESHOLD_SEC) {
    return [{ start: 0, end: durationSec }];
  }

  const avgBytesPerSec = fileSize / Math.max(durationSec, 0.1);
  const secPerPartBySize = PART_SIZE_BYTES / Math.max(avgBytesPerSec, 1);
  const partDuration = Math.max(
    MIN_PART_DURATION_SEC,
    Math.min(PART_DURATION_SEC, secPerPartBySize),
  );

  /** @type {Array<{ start: number, end: number }>} */
  const ranges = [];
  for (let start = 0; start < durationSec - 0.05; start += partDuration) {
    ranges.push({ start, end: Math.min(start + partDuration, durationSec) });
  }

  if (ranges.length === 0) {
    ranges.push({ start: 0, end: durationSec });
  }

  return ranges;
}

/**
 * 1区間をエンコード
 * @param {import('@ffmpeg/ffmpeg').FFmpeg} ffmpeg
 * @param {string} inputPath
 * @param {string} outputName
 * @param {{ start: number, end: number }} range
 * @param {{ format: 'mp4' | 'webm', crf: number }} options
 */
async function encodePart(ffmpeg, inputPath, outputName, range, options) {
  /** @type {string[]} */
  const args = [
    "-hide_banner",
    "-ss",
    String(range.start),
    "-to",
    String(range.end),
    "-i",
    inputPath,
  ];

  if (options.format === "webm") {
    args.push(
      "-c:v",
      "libvpx-vp9",
      "-crf",
      String(options.crf + 7),
      "-b:v",
      "0",
      "-c:a",
      "libopus",
      "-b:a",
      "128k",
    );
  } else {
    args.push(
      "-c:v",
      "libx264",
      "-crf",
      String(options.crf),
      "-preset",
      "fast",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-movflags",
      "+faststart",
    );
  }

  args.push("-y", outputName);
  await execFfmpegOrThrow(ffmpeg, args);
}

/**
 * パートを結合
 * @param {import('@ffmpeg/ffmpeg').FFmpeg} ffmpeg
 * @param {string[]} partNames
 * @param {string} outputName
 */
async function concatParts(ffmpeg, partNames, outputName) {
  const listBody = partNames.map((name) => `file '${name}'`).join("\n");
  await ffmpeg.writeFile("concat.txt", new TextEncoder().encode(listBody));
  await execFfmpegOrThrow(ffmpeg, [
    "-hide_banner",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    "concat.txt",
    "-c",
    "copy",
    "-y",
    outputName,
  ]);
  await ffmpeg.deleteFile("concat.txt");
}

/**
 * 動画を指定形式に変換
 * @param {File} file
 * @param {{ format: 'mp4' | 'webm', crf: number }} options
 * @param {{ onProgress?: (detail: { phase: string, part?: number, totalParts?: number, ratio?: number, message?: string }) => void }} [callbacks]
 */
export async function convertVideoFile(file, options, callbacks = {}) {
  const formatSpec = OUTPUT_FORMATS[options.format];
  if (!formatSpec) {
    throw new Error("出力形式が不正です");
  }

  const ffmpeg = await getFfmpeg();
  callbacks.onProgress?.({ phase: "load", message: "ffmpeg を準備中…", ratio: 0.02 });

  const input = await prepareFfmpegInput(
    ffmpeg,
    file,
    FFMPEG_MOUNT_POINT,
    PART_SIZE_BYTES,
  );
  const inputPath = input.inputPath;

  callbacks.onProgress?.({ phase: "probe", message: "動画を解析中…", ratio: 0.05 });
  const probe = await probeVideo(ffmpeg, inputPath);
  const ranges = getPartRanges(probe.duration, file.size);
  const ext = formatSpec.ext;
  const outputName = `output.${ext}`;

  /** @type {string[]} */
  const partNames = [];

  ffmpeg.on("progress", ({ progress }) => {
    if (!Number.isFinite(progress) || progress <= 0) return;
    callbacks.onProgress?.({
      phase: "encode",
      message: "エンコード中…",
      ratio: 0.1 + progress * 0.75,
    });
  });

  try {
    for (let i = 0; i < ranges.length; i += 1) {
      const partName = `part_${String(i).padStart(4, "0")}.${ext}`;
      const label =
        ranges.length > 1
          ? `パート ${i + 1}/${ranges.length} を変換中…`
          : "変換中…";

      callbacks.onProgress?.({
        phase: "encode",
        part: i + 1,
        totalParts: ranges.length,
        message: label,
        ratio: 0.1 + (i / ranges.length) * 0.75,
      });

      await encodePart(ffmpeg, inputPath, partName, ranges[i], options);
      partNames.push(partName);
    }

    ffmpeg.off("progress");

    if (partNames.length === 1) {
      const data = await ffmpeg.readFile(partNames[0]);
      await ffmpeg.deleteFile(partNames[0]);
      callbacks.onProgress?.({ phase: "done", message: "完了", ratio: 1 });
      return new Blob([data], { type: formatSpec.mime });
    }

    callbacks.onProgress?.({
      phase: "concat",
      message: `${partNames.length} パートを結合中…`,
      ratio: 0.9,
    });

    await concatParts(ffmpeg, partNames, outputName);

    for (const partName of partNames) {
      await ffmpeg.deleteFile(partName);
    }

    const data = await ffmpeg.readFile(outputName);
    await ffmpeg.deleteFile(outputName);

    callbacks.onProgress?.({ phase: "done", message: "完了", ratio: 1 });
    return new Blob([data], { type: formatSpec.mime });
  } finally {
    ffmpeg.off("progress");
    try {
      await input.cleanup();
    } catch {
      // ignore
    }
  }
}
