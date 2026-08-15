/**
 * Canvas プレビュー合成 — トランジション / PiP / カラーフィルタ
 */

import { getClipColorEffects } from "./timeline-model.js";

/** @typedef {{ brightness?: number, contrast?: number, saturation?: number }} ColorEffects */

/** @param {ColorEffects | null | undefined} effects */
export function cssFilterFromEffects(effects) {
  if (!effects) return "none";
  const b = effects.brightness ?? 0;
  const c = effects.contrast ?? 0;
  const s = effects.saturation ?? 0;
  if (b === 0 && c === 0 && s === 0) return "none";
  return `brightness(${1 + b / 100}) contrast(${1 + c / 100}) saturate(${1 + s / 100})`;
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLVideoElement} videoA
 * @param {HTMLVideoElement} videoB
 */
export function createPreviewCompositor(canvas, videoA, videoB) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  function resize() {
    const wrap = canvas.parentElement;
    if (!wrap) return;
    const w = Math.max(1, wrap.clientWidth);
    const h = Math.max(1, wrap.clientHeight);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }

  /**
   * @param {HTMLVideoElement} video
   * @param {string} filter
   * @param {number} dx
   * @param {number} dy
   * @param {number} dw
   * @param {number} dh
   */
  function drawVideoRect(video, filter, dx, dy, dw, dh) {
    if (!(video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) || video.videoWidth <= 0) return;
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const scale = Math.min(dw / vw, dh / vh);
    const sw = vw * scale;
    const sh = vh * scale;
    const ox = dx + (dw - sw) / 2;
    const oy = dy + (dh - sh) / 2;
    ctx.filter = filter;
    ctx.drawImage(video, ox, oy, sw, sh);
    ctx.filter = "none";
  }

  /**
   * @param {{
   *   baseVideo?: HTMLVideoElement | null,
   *   overlayVideo?: HTMLVideoElement | null,
   *   crossfade?: number,
   *   baseEffects?: ColorEffects | null,
   *   overlayEffects?: ColorEffects | null,
   *   pip?: { video: HTMLVideoElement, x: number, y: number, scale: number, opacity?: number, effects?: ColorEffects | null } | null,
   * }} opts
   */
  function render(opts) {
    resize();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width;
    const h = canvas.height;
    const crossfade = opts.crossfade ?? 0;

    if (opts.baseVideo) {
      const baseFilter = cssFilterFromEffects(opts.baseEffects);
      if (crossfade > 0 && opts.overlayVideo) {
        ctx.globalAlpha = 1 - crossfade;
        drawVideoRect(opts.baseVideo, baseFilter, 0, 0, w, h);
        ctx.globalAlpha = crossfade;
        drawVideoRect(opts.overlayVideo, cssFilterFromEffects(opts.overlayEffects), 0, 0, w, h);
        ctx.globalAlpha = 1;
      } else {
        drawVideoRect(opts.baseVideo, baseFilter, 0, 0, w, h);
      }
    }

    if (opts.pip?.video) {
      const pip = opts.pip;
      const pw = (pip.scale ?? 0.35) * w;
      const aspect = pip.video.videoHeight > 0 ? pip.video.videoWidth / pip.video.videoHeight : 16 / 9;
      const ph = pw / aspect;
      ctx.globalAlpha = pip.opacity ?? 1;
      drawVideoRect(
        pip.video,
        cssFilterFromEffects(pip.effects),
        (pip.x ?? 0.62) * w,
        (pip.y ?? 0.05) * h,
        pw,
        ph
      );
      ctx.globalAlpha = 1;
    }
  }

  return { render, resize };
}

/** @param {import("./timeline-model.js").TimelineClip | null | undefined} clip */
export function colorEffectsFromClip(clip) {
  return clip ? getClipColorEffects(clip) : null;
}
