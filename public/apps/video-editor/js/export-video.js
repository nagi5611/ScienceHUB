/**
 * ffmpeg.wasm による動画書き出し（トリム・クロップ・回転・テキスト等）
 */

import { getFfmpeg } from "../../../js/ffmpeg-loader.js";
import { execFfmpegOrThrow, prepareFfmpegInputs } from "../../../js/ffmpeg-input.js";
import { canUseFfmpegMultithread, isFfmpegMultithreadLoaded } from "../../../js/ffmpeg-capabilities.js";
import { clipDuration, clipTimelineEnd, getClipColorEffects, getClipPipEffects, hasColorEffects, hasTransitions, hasV2Clips } from "./timeline-model.js";

const MOUNT_POINT = "/ve-input";

/**
 * @typedef {Object} CropRect
 * @property {number} x 正規化 0-1
 * @property {number} y 正規化 0-1
 * @property {number} w 正規化 0-1
 * @property {number} h 正規化 0-1
 */

/**
 * @typedef {Object} TextOverlayExport
 * @property {string} content
 * @property {number} x
 * @property {number} y
 * @property {number} fontSize
 * @property {string} color
 * @property {number} opacity
 * @property {string} [fontFamily]
 * @property {boolean} [bold]
 * @property {boolean} [italic]
 * @property {"left" | "center" | "right"} [align]
 * @property {number} [boxWidth]
 */

/**
 * @typedef {Object} ExportSettings
 * @property {number} start
 * @property {number} end
 * @property {number} [slipOffset]
 * @property {number} [audioStart]
 * @property {number} [audioEnd]
 * @property {boolean} [audioLinked]
 * @property {number} rotation
 * @property {boolean} flipH
 * @property {boolean} flipV
 * @property {number} volume
 * @property {number} speed
 * @property {number} fadeIn
 * @property {number} fadeOut
 * @property {boolean} cropEnabled
 * @property {CropRect} crop
 * @property {boolean} textEnabled
 * @property {TextOverlayExport[]} textOverlays
 * @property {string} format mp4 | webm
 * @property {number} quality CRF
 * @property {boolean} noReencode
 * @property {boolean} inverse
 * @property {number} duration
 * @property {number} videoWidth
 * @property {number} videoHeight
 * @property {import("./timeline-model.js").TimelineModel | null} [timeline]
 * @property {"auto" | "cpu-max" | "gpu"} [accelerationMode]
 * @property {number} [fps]
 */

/** 書き出し用の実効トリム区間 */
export function getExportTrimRange(settings) {
  const clipLen = Math.max(0.1, settings.end - settings.start);
  const slip = settings.slipOffset ?? 0;
  const effectiveStart = Math.max(0, settings.start + slip);
  const effectiveEnd = Math.min(settings.duration || effectiveStart + clipLen, effectiveStart + clipLen);
  const linked = settings.audioLinked !== false;
  const audioStart = linked ? effectiveStart : (settings.audioStart ?? effectiveStart);
  const audioEnd = linked ? effectiveEnd : (settings.audioEnd ?? effectiveEnd);
  const audioSplit =
    !linked &&
    (Math.abs(audioStart - effectiveStart) > 0.02 || Math.abs(audioEnd - effectiveEnd) > 0.02);
  return { effectiveStart, effectiveEnd, clipLen, audioStart, audioEnd, audioSplit };
}

/** BGM トラックにクリップがあるか */
function hasBgmClips(timeline) {
  const a2 = timeline.tracks.find((t) => t.id === "a2");
  return (a2?.clips.length ?? 0) > 0;
}

/** @param {{ brightness?: number, contrast?: number, saturation?: number } | null | undefined} effects */
export function buildEqFilter(effects) {
  if (!effects) return null;
  const b = effects.brightness ?? 0;
  const c = effects.contrast ?? 0;
  const s = effects.saturation ?? 0;
  if (b === 0 && c === 0 && s === 0) return null;
  return `eq=brightness=${(b / 100).toFixed(3)}:contrast=${(1 + c / 100).toFixed(3)}:saturation=${(1 + s / 100).toFixed(3)}`;
}

/** タイムライン合成が必要か */
export function needsTimelineCompose(settings) {
  if (!settings.timeline) return false;
  const vTrack = settings.timeline.tracks.find((t) => t.id === "v1");
  const multiClip = (vTrack?.clips.length ?? 0) > 1;
  const multiMedia = new Set(vTrack?.clips.map((c) => c.mediaId) ?? []).size > 1;
  return (
    multiClip ||
    multiMedia ||
    hasBgmClips(settings.timeline) ||
    hasTransitions(settings.timeline) ||
    hasV2Clips(settings.timeline) ||
    hasColorEffects(settings.timeline)
  );
}

/** 再エンコードが必要か */
export function needsReencode(settings) {
  const { audioSplit } = getExportTrimRange(settings);
  return (
    settings.inverse ||
    settings.rotation !== 0 ||
    settings.flipH ||
    settings.flipV ||
    settings.cropEnabled ||
    settings.textEnabled ||
    settings.volume !== 100 ||
    settings.speed !== 100 ||
    settings.fadeIn > 0 ||
    settings.fadeOut > 0 ||
    (settings.colorEffects &&
      ((settings.colorEffects.brightness ?? 0) !== 0 ||
        (settings.colorEffects.contrast ?? 0) !== 0 ||
        (settings.colorEffects.saturation ?? 0) !== 0)) ||
    settings.format === "webm" ||
    (settings.slipOffset ?? 0) !== 0 ||
    audioSplit ||
    needsTimelineCompose(settings)
  );
}

/** drawtext 用にテキストをエスケープ */
function escapeDrawtext(text) {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/:/g, "\\:")
    .replace(/%/g, "\\%");
}

/** テキスト位置を drawtext パラメータに変換 */
function drawtextPosition(position) {
  switch (position) {
    case "top":
      return ":x=(w-text_w)/2:y=40";
    case "center":
      return ":x=(w-text_w)/2:y=(h-text_h)/2";
    case "bottom":
    default:
      return ":x=(w-text_w)/2:y=h-text_h-40";
  }
}

/** 色 #RRGGBB → 0xRRGGBB */
function colorToFfmpeg(hex) {
  const clean = String(hex).replace("#", "");
  return `0x${clean}`;
}

/** クロップ矩形（ピクセル） */
function cropPixels(settings) {
  const vw = Math.max(1, settings.videoWidth);
  const vh = Math.max(1, settings.videoHeight);
  const x = Math.round(settings.crop.x * vw);
  const y = Math.round(settings.crop.y * vh);
  const w = Math.max(2, Math.round(settings.crop.w * vw));
  const h = Math.max(2, Math.round(settings.crop.h * vh));
  const evenW = w % 2 === 0 ? w : w - 1;
  const evenH = h % 2 === 0 ? h : h - 1;
  return { x, y, w: Math.max(2, evenW), h: Math.max(2, evenH) };
}

/** drawtext 用フォント名（ffmpeg fontconfig 向け） */
function fontFamilyToDrawtext(fontFamily) {
  if (!fontFamily) return "";
  const first = String(fontFamily).split(",")[0].replace(/['"]/g, "").trim();
  if (!first) return "";
  return `:font='${escapeDrawtext(first)}'`;
}

/** drawtext フィルタを1件分生成 */
function drawtextFilter(overlay) {
  const escaped = escapeDrawtext(overlay.content.trim());
  const alpha = Math.max(0, Math.min(1, overlay.opacity / 100));
  const color = colorToFfmpeg(overlay.color);
  const size = overlay.bold ? Math.round(overlay.fontSize * 1.08) : overlay.fontSize;
  let xExpr = String(overlay.x);
  if (overlay.align === "center" && overlay.boxWidth) {
    xExpr = `${overlay.x}+(${overlay.boxWidth}-text_w)/2`;
  } else if (overlay.align === "right" && overlay.boxWidth) {
    xExpr = `${overlay.x}+${overlay.boxWidth}-text_w`;
  }
  const font = fontFamilyToDrawtext(overlay.fontFamily);
  const italicSuffix = overlay.italic ? ":expansion=none" : "";
  return `drawtext=text='${escaped}'${font}:fontsize=${size}:fontcolor=${color}@${alpha.toFixed(2)}:x=${xExpr}:y=${overlay.y}${italicSuffix}`;
}

/** 映像フィルタチェーンを組み立て */
function buildVideoFilters(settings) {
  /** @type {string[]} */
  const filters = [];

  if (settings.cropEnabled) {
    const c = cropPixels(settings);
    filters.push(`crop=${c.w}:${c.h}:${c.x}:${c.y}`);
  }

  if (settings.rotation === 90) filters.push("transpose=1");
  else if (settings.rotation === 180) filters.push("transpose=1,transpose=1");
  else if (settings.rotation === 270) filters.push("transpose=2");

  if (settings.flipH) filters.push("hflip");
  if (settings.flipV) filters.push("vflip");

  const overlays = settings.textOverlays ?? [];

  for (const overlay of overlays) {
    if (overlay.content.trim()) {
      filters.push(drawtextFilter(overlay));
    }
  }

  if (settings.speed !== 100) {
    const factor = settings.speed / 100;
    filters.push(`setpts=PTS/${factor}`);
  }

  const clipDuration = Math.max(0.1, settings.end - settings.start);
  if (settings.fadeIn > 0) {
    filters.push(`fade=t=in:st=0:d=${settings.fadeIn}`);
  }
  if (settings.fadeOut > 0) {
    const fadeStart = Math.max(0, clipDuration - settings.fadeOut);
    filters.push(`fade=t=out:st=${fadeStart}:d=${settings.fadeOut}`);
  }

  const eq = buildEqFilter(settings.colorEffects);
  if (eq) filters.push(eq);

  return filters.length ? filters.join(",") : null;
}

/** 音声フィルタチェーンを組み立て */
function buildAudioFilters(settings) {
  /** @type {string[]} */
  const filters = [];

  if (settings.volume !== 100) {
    filters.push(`volume=${(settings.volume / 100).toFixed(3)}`);
  }

  if (settings.speed !== 100) {
    let factor = settings.speed / 100;
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
  }

  const clipDuration = Math.max(0.1, settings.end - settings.start);
  if (settings.fadeIn > 0) {
    filters.push(`afade=t=in:st=0:d=${settings.fadeIn}`);
  }
  if (settings.fadeOut > 0) {
    const fadeStart = Math.max(0, clipDuration - settings.fadeOut);
    filters.push(`afade=t=out:st=${fadeStart}:d=${settings.fadeOut}`);
  }

  return filters.length ? filters.join(",") : null;
}

/** 逆転トリム用 filter_complex（再エンコード必須） */
function buildInverseTrimFilter(settings) {
  const start = Math.max(0, settings.start);
  const end = Math.max(start, settings.end);
  const duration = Math.max(end, settings.duration || end);
  /** @type {string[]} */
  const parts = [];
  /** @type {string[]} */
  const concatPairs = [];
  let idx = 0;

  if (start > 0.05) {
    parts.push(`[0:v]trim=start=0:end=${start},setpts=PTS-STARTPTS[v${idx}]`);
    parts.push(`[0:a]atrim=start=0:end=${start},asetpts=PTS-STARTPTS[a${idx}]`);
    concatPairs.push(`[v${idx}][a${idx}]`);
    idx += 1;
  }

  if (end < duration - 0.05) {
    parts.push(`[0:v]trim=start=${end},setpts=PTS-STARTPTS[v${idx}]`);
    parts.push(`[0:a]atrim=start=${end},asetpts=PTS-STARTPTS[a${idx}]`);
    concatPairs.push(`[v${idx}][a${idx}]`);
    idx += 1;
  }

  if (concatPairs.length === 0) return null;

  if (concatPairs.length === 1) {
    return parts.join(";").replace("[v0]", "[outv]").replace("[a0]", "[outa]");
  }

  parts.push(`${concatPairs.join("")}concat=n=${concatPairs.length}:v=1:a=1[outv][outa]`);
  return parts.join(";");
}

/** 出力ファイル名 */
function outputFilename(format) {
  return format === "webm" ? "output.webm" : "output.mp4";
}

/** MIME タイプ */
function outputMime(format) {
  return format === "webm" ? "video/webm" : "video/mp4";
}

/**
 * 映像エンコード用 ffmpeg 引数（CPU スレッド / プリセット最適化）
 * @param {ExportSettings} settings
 * @param {"auto" | "cpu-max" | "gpu"} [accelerationMode]
 */
export function buildVideoEncodeArgs(settings, accelerationMode = "auto") {
  const cpuMax = accelerationMode === "cpu-max" || accelerationMode === "auto";
  const cores =
    typeof navigator !== "undefined" ? Math.max(1, navigator.hardwareConcurrency ?? 4) : 4;
  const mt = isFfmpegMultithreadLoaded() || canUseFfmpegMultithread();

  if (settings.format === "webm") {
    /** @type {string[]} */
    const args = [
      "-c:v",
      "libvpx-vp9",
      "-crf",
      String(settings.quality + 7),
      "-b:v",
      "0",
      "-row-mt",
      "1",
    ];
    if (cpuMax && mt) {
      args.push("-threads", String(cores));
    }
    return args;
  }

  const preset = cpuMax ? "veryfast" : "fast";
  /** @type {string[]} */
  const args = ["-c:v", "libx264", "-crf", String(settings.quality), "-preset", preset, "-threads", "0"];
  if (cpuMax && mt && cores > 1) {
    args.push("-x264-params", `threads=${cores}:sliced-threads=1`);
  }
  return args;
}

/** 音声エンコード用 ffmpeg 引数 */
function buildAudioEncodeArgs(settings) {
  if (settings.format === "webm") {
    return ["-c:a", "libopus", "-b:a", "128k"];
  }
  return ["-c:a", "aac", "-b:a", "128k"];
}

/** 映像+音声のエンコード引数 */
function buildAVCodecArgs(settings, accelerationMode) {
  return [...buildVideoEncodeArgs(settings, accelerationMode), ...buildAudioEncodeArgs(settings)];
}

/**
 * 動画を書き出す
 * @param {File} file
 * @param {ExportSettings} settings
 * @param {{ onProgress?: (ratio: number, message?: string) => void }} [callbacks]
 */
/**
 * クリップ列を xfade / acrossfade または concat でチェーン
 * @param {import("./timeline-model.js").TimelineClip[]} clips
 * @param {"video"|"audio"} kind
 * @param {string} outLabel
 * @param {string[]} parts
 */
function chainClips(clips, kind, outLabel, parts) {
  if (clips.length === 0) return null;
  if (clips.length === 1) return clips[0].label;

  let current = clips[0].label;
  let accDur = clips[0].dur;

  for (let i = 1; i < clips.length; i += 1) {
    const prev = clips[i - 1];
    const cur = clips[i];
    const nextLabel = i === clips.length - 1 ? outLabel : `xf${kind}${i}`;
    const adjacent = Math.abs(cur.timelineStart - prev.timelineEnd) < 0.05;
    const trans = adjacent && prev.transitionOut > 0 ? prev.transitionOut : 0;

    if (trans > 0) {
      const offset = Math.max(0, accDur - trans);
      if (kind === "video") {
        parts.push(
          `[${current}][${cur.label}]xfade=transition=fade:duration=${trans.toFixed(3)}:offset=${offset.toFixed(3)}[${nextLabel}]`
        );
      } else {
        parts.push(
          `[${current}][${cur.label}]acrossfade=d=${trans.toFixed(3)}[${nextLabel}]`
        );
      }
      accDur = accDur + cur.dur - trans;
    } else {
      if (kind === "video") {
        parts.push(`[${current}][${cur.label}]concat=n=2:v=1:a=0[${nextLabel}]`);
      } else {
        parts.push(`[${current}][${cur.label}]concat=n=2:v=0:a=1[${nextLabel}]`);
      }
      accDur += cur.dur;
    }
    current = nextLabel;
  }
  return current;
}

/**
 * トラックのクリップを trim ラベル付きで生成
 * @param {import("./timeline-model.js").TimelineTrack} track
 * @param {Map<string, number>} mediaToInputIdx
 * @param {"video"|"audio"} streamKind
 * @param {string} prefix
 * @param {string[]} parts
 */
function buildTrimmedClips(track, mediaToInputIdx, streamKind, prefix, parts) {
  const sorted = [...track.clips].sort((a, b) => a.timelineStart - b.timelineStart);
  /** @type {{ label: string, dur: number, timelineStart: number, timelineEnd: number, transitionOut: number }[]} */
  const built = [];

  sorted.forEach((clip, i) => {
    const inputIdx = mediaToInputIdx.get(clip.mediaId);
    if (inputIdx === undefined) return;
    let label = `${prefix}${i}`;
    const dur = clipDuration(clip);
    if (streamKind === "video") {
      parts.push(
        `[${inputIdx}:v]trim=start=${clip.sourceIn}:end=${clip.sourceOut},setpts=PTS-STARTPTS[${label}]`
      );
      const eq = buildEqFilter(getClipColorEffects(clip));
      if (eq) {
        const next = `${label}e`;
        parts.push(`[${label}]${eq}[${next}]`);
        label = next;
      }
    } else {
      parts.push(
        `[${inputIdx}:a]atrim=start=${clip.sourceIn}:end=${clip.sourceOut},asetpts=PTS-STARTPTS[${label}]`
      );
    }
    built.push({
      label,
      dur,
      timelineStart: clip.timelineStart,
      timelineEnd: clipTimelineEnd(clip),
      transitionOut: clip.transitionOut ?? 0,
    });
  });

  return built;
}

/**
 * タイムライン filter_complex を組み立て（Phase 3: xfade + BGM amix）
 * @param {import("./timeline-model.js").TimelineModel} timeline
 * @param {Map<string, string>} inputPaths mediaId -> path
 */
export function buildTimelineGraph(timeline, inputPaths) {
  const v2Track = timeline.tracks.find((t) => t.id === "v2");
  const vTrack = timeline.tracks.find((t) => t.id === "v1");
  const a1Track = timeline.tracks.find((t) => t.id === "a1");
  const a2Track = timeline.tracks.find((t) => t.id === "a2");
  if (!vTrack || vTrack.clips.length === 0) return null;

  /** @type {string[]} */
  const inputFiles = [];
  /** @type {Map<string, number>} */
  const mediaToInputIdx = new Map();

  const allMediaIds = new Set();
  for (const track of [v2Track, vTrack, a1Track, a2Track]) {
    if (!track) continue;
    for (const clip of track.clips) allMediaIds.add(clip.mediaId);
  }

  for (const mediaId of allMediaIds) {
    const path = inputPaths.get(mediaId);
    if (!path) continue;
    mediaToInputIdx.set(mediaId, inputFiles.length);
    inputFiles.push(path);
  }

  /** @type {string[]} */
  const parts = [];

  const vClips = buildTrimmedClips(vTrack, mediaToInputIdx, "video", "vc", parts);
  if (vClips.length === 0) return null;

  let videoOut = "outv";
  if (vClips.length === 1) {
    parts[parts.length - 1] = parts[parts.length - 1].replace(`[${vClips[0].label}]`, "[outv]");
  } else {
    chainClips(vClips, "video", "outv", parts);
  }

  if (v2Track && v2Track.clips.length > 0) {
    let layerOut = "outv";
    v2Track.clips.forEach((clip, i) => {
      const inputIdx = mediaToInputIdx.get(clip.mediaId);
      if (inputIdx === undefined) return;
      const pip = getClipPipEffects(clip);
      const trimLabel = `v2t${i}`;
      let pipLabel = trimLabel;
      parts.push(
        `[${inputIdx}:v]trim=start=${clip.sourceIn}:end=${clip.sourceOut},setpts=PTS-STARTPTS[${trimLabel}]`
      );
      const eq = buildEqFilter(getClipColorEffects(clip));
      if (eq) {
        pipLabel = `${trimLabel}e`;
        parts.push(`[${trimLabel}]${eq}[${pipLabel}]`);
      }
      const scale = Math.max(0.1, Math.min(1, pip.scale ?? 0.35));
      const scaled = `${pipLabel}s`;
      parts.push(`[${pipLabel}]scale=iw*${scale.toFixed(3)}:-1[${scaled}]`);
      const nextOut = i === v2Track.clips.length - 1 ? "outv" : `ov${i}`;
      const start = clip.timelineStart.toFixed(3);
      const end = clipTimelineEnd(clip).toFixed(3);
      const x = (pip.x ?? 0.62).toFixed(3);
      const y = (pip.y ?? 0.05).toFixed(3);
      parts.push(
        `[${layerOut}][${scaled}]overlay=x=main_w*${x}:y=main_h*${y}:enable=between(t\\,${start}\\,${end})[${nextOut}]`
      );
      layerOut = nextOut;
    });
    videoOut = layerOut;
  }

  let audioOut = null;
  if (a1Track && a1Track.clips.length > 0) {
    const a1Clips = buildTrimmedClips(a1Track, mediaToInputIdx, "audio", "ac", parts);
    if (a1Clips.length === 1) {
      parts[parts.length - 1] = parts[parts.length - 1].replace(`[${a1Clips[0].label}]`, "[va1]");
      audioOut = "va1";
    } else if (a1Clips.length > 1) {
      chainClips(a1Clips, "audio", "va1", parts);
      audioOut = "va1";
    }
  }

  let bgmOut = null;
  if (a2Track && a2Track.clips.length > 0) {
    const a2Clips = buildTrimmedClips(a2Track, mediaToInputIdx, "audio", "bg", parts);
    if (a2Clips.length === 1) {
      parts[parts.length - 1] = parts[parts.length - 1].replace(`[${a2Clips[0].label}]`, "[va2]");
      bgmOut = "va2";
    } else if (a2Clips.length > 1) {
      chainClips(a2Clips, "audio", "va2", parts);
      bgmOut = "va2";
    }
  }

  if (audioOut && bgmOut) {
    parts.push(`[${audioOut}][${bgmOut}]amix=inputs=2:duration=first:dropout_transition=0[outa]`);
  } else if (audioOut) {
    parts.push(`[${audioOut}]anull[outa]`);
  } else if (bgmOut) {
    parts.push(`[${bgmOut}]anull[outa]`);
  }

  const hasAudio = !!(audioOut || bgmOut);
  return { filter: parts.join(";"), inputFiles, hasAudio };
}

export async function exportVideo(file, settings, callbacks = {}) {
  const accelerationMode = settings.accelerationMode ?? "auto";

  if (accelerationMode === "auto" || accelerationMode === "gpu") {
    const { canUseWebCodecsGpuExport, exportVideoWebCodecsGpu } = await import(
      "./export-webcodecs-gpu.js",
    );
    if (canUseWebCodecsGpuExport(settings)) {
      try {
        callbacks.onProgress?.(0.02, "GPU エンコードを試行中…");
        return await exportVideoWebCodecsGpu(file, settings, callbacks);
      } catch (error) {
        if (accelerationMode === "gpu") {
          throw error instanceof Error ? error : new Error(String(error));
        }
        console.warn("GPU export failed, falling back to ffmpeg:", error);
      }
    } else if (accelerationMode === "gpu") {
      throw new Error(
        "このプロジェクトは GPU エンコードに対応していません（シンプルなトリムのみ対応）。自動または CPU 最大を選択してください。",
      );
    }
  }

  const ffmpeg = await getFfmpeg();
  const mt = isFfmpegMultithreadLoaded();
  callbacks.onProgress?.(
    0.05,
    mt ? `ffmpeg を準備中（CPU ${navigator.hardwareConcurrency ?? "?"} コア）…` : "ffmpeg を準備中…",
  );

  const filesToMount = [file];
  if (settings.timeline) {
    for (const media of settings.timeline.mediaBin) {
      if (media.file !== file && !filesToMount.includes(media.file)) {
        filesToMount.push(media.file);
      }
    }
  }

  callbacks.onProgress?.(0.08, "動画ファイルを読み込み中…");
  let cleanupInputs = async () => {};
  let pathByFile;
  try {
    const prepared = await prepareFfmpegInputs(ffmpeg, filesToMount, MOUNT_POINT);
    pathByFile = prepared.pathByFile;
    cleanupInputs = prepared.cleanup;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`動画ファイルの読み込みに失敗しました（${detail}）`);
  }

  const inputPath = pathByFile.get(file);
  if (!inputPath) {
    throw new Error("動画ファイルの入力パスを解決できませんでした。");
  }
  const outName = outputFilename(settings.format);
  const streamCopy = settings.noReencode && !needsReencode(settings);
  const trimRange = getExportTrimRange(settings);

  ffmpeg.on("progress", ({ progress, time }) => {
    if (Number.isFinite(progress) && progress > 0) {
      callbacks.onProgress?.(Math.min(0.95, 0.1 + progress * 0.85), "エンコード中…");
    } else if (time > 0) {
      callbacks.onProgress?.(0.5, "処理中…");
    }
  });

  try {
    if (settings.inverse) {
      const filter = buildInverseTrimFilter(settings);
      if (!filter) throw new Error("逆転トリムの対象区間がありません");
      callbacks.onProgress?.(0.15, "逆転トリム中…");
      /** @type {string[]} */
      const args = ["-hide_banner", "-i", inputPath, "-filter_complex", filter, "-map", "[outv]", "-map", "[outa]"];
      args.push(...buildAVCodecArgs(settings, accelerationMode));
      args.push("-movflags", "+faststart", "-y", outName);
      await execFfmpegOrThrow(ffmpeg, args);
    } else if (settings.timeline && needsTimelineCompose(settings)) {
      callbacks.onProgress?.(0.15, "タイムライン合成中…");
      /** @type {Map<string, string>} */
      const inputPaths = new Map();
      for (const media of settings.timeline.mediaBin) {
        const mediaPath = pathByFile.get(media.file);
        if (!mediaPath) {
          throw new Error(`メディア「${media.name ?? media.file.name}」の入力パスを解決できませんでした。`);
        }
        inputPaths.set(media.id, mediaPath);
      }
      const graph = buildTimelineGraph(settings.timeline, inputPaths);
      if (!graph) throw new Error("タイムラインが空です");

      /** @type {string[]} */
      const args = ["-hide_banner"];
      for (const path of graph.inputFiles) {
        args.push("-i", path);
      }
      args.push("-filter_complex", graph.filter, "-map", "[outv]");
      if (graph.hasAudio) args.push("-map", "[outa]");

      args.push(...buildAVCodecArgs(settings, accelerationMode));
      args.push("-movflags", "+faststart", "-y", outName);
      await execFfmpegOrThrow(ffmpeg, args);
    } else if (streamCopy) {
      callbacks.onProgress?.(0.15, "トリミング中（再エンコードなし）…");
      await execFfmpegOrThrow(ffmpeg, [
        "-hide_banner",
        "-ss",
        String(trimRange.effectiveStart),
        "-to",
        String(trimRange.effectiveEnd),
        "-i",
        inputPath,
        "-c",
        "copy",
        "-avoid_negative_ts",
        "1",
        "-y",
        outName,
      ]);
    } else if (trimRange.audioSplit) {
      callbacks.onProgress?.(0.15, "映像・音声を個別トリム中…");
      const vf = buildVideoFilters(settings);
      const af = buildAudioFilters(settings);
      const vChain = [
        `[0:v]trim=start=${trimRange.effectiveStart}:end=${trimRange.effectiveEnd},setpts=PTS-STARTPTS`,
        vf ? vf : "null",
      ].join(",");
      const aChain = [
        `[0:a]atrim=start=${trimRange.audioStart}:end=${trimRange.audioEnd},asetpts=PTS-STARTPTS`,
        af ? af : "anull",
      ].join(",");
      const filter = `${vChain}[outv];${aChain}[outa]`;
      /** @type {string[]} */
      const args = [
        "-hide_banner",
        "-i",
        inputPath,
        "-filter_complex",
        filter,
        "-map",
        "[outv]",
        "-map",
        "[outa]",
      ];
      args.push(...buildAVCodecArgs(settings, accelerationMode));
      args.push("-movflags", "+faststart", "-y", outName);
      await execFfmpegOrThrow(ffmpeg, args);
    } else {
      callbacks.onProgress?.(0.15, "エンコード中…");
      /** @type {string[]} */
      const args = [
        "-hide_banner",
        "-ss",
        String(trimRange.effectiveStart),
        "-to",
        String(trimRange.effectiveEnd),
        "-i",
        inputPath,
      ];

      const vf = buildVideoFilters(settings);
      const af = buildAudioFilters(settings);
      if (vf) args.push("-vf", vf);
      if (af) args.push("-af", af);

      if (settings.format === "webm") {
        args.push(...buildVideoEncodeArgs(settings, accelerationMode));
        args.push("-c:a", "libopus", "-b:a", "128k");
      } else {
        args.push(...buildVideoEncodeArgs(settings, accelerationMode));
        args.push("-c:a", "aac", "-b:a", "128k");
      }

      args.push("-movflags", "+faststart", "-y", outName);
      await execFfmpegOrThrow(ffmpeg, args);
    }

    callbacks.onProgress?.(0.96, "ファイルを読み込み中…");
    const data = await ffmpeg.readFile(outName);
    await ffmpeg.deleteFile(outName);
    callbacks.onProgress?.(1, "完了");
    return new Blob([data], { type: outputMime(settings.format) });
  } finally {
    ffmpeg.off("progress");
    await cleanupInputs();
  }
}

/** 出力ファイル名を生成 */
export function buildDownloadName(originalName, format) {
  const base = originalName.replace(/\.[^.]+$/, "") || "video";
  const ext = format === "webm" ? "webm" : "mp4";
  return `${base}-edited.${ext}`;
}
