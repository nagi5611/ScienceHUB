/**
 * デュアルタイムライン — Overview + Trim Zoom + 波形 + Trim Editor
 */

import { clamp, formatTimeShort } from "./time.js";
import { drawWaveform } from "./waveform.js";

const TRIM_ZOOM_HALF = 4;
const TRIM_EDITOR_HALF_FRAMES = 7;

/**
 * @typedef {Object} TimelineStateSlice
 * @property {number} duration
 * @property {number} startTime
 * @property {number} endTime
 * @property {number} [slipOffset]
 * @property {number} [audioStart]
 * @property {number} [audioEnd]
 * @property {boolean} [audioLinked]
 * @property {boolean} [trimMode]
 * @property {number[]} [waveformPeaks]
 * @property {number} [fps]
 */

/**
 * スリップ込みの実効ソース区間
 * @param {TimelineStateSlice} state
 */
export function getEffectiveRange(state) {
  const clipLen = Math.max(0.1, state.endTime - state.startTime);
  const minSlip = -state.startTime;
  const maxSlip = Math.max(minSlip, state.duration - state.endTime);
  const slip = clamp(state.slipOffset ?? 0, minSlip, maxSlip);
  const effectiveStart = state.startTime + slip;
  return {
    slipOffset: slip,
    effectiveStart,
    effectiveEnd: effectiveStart + clipLen,
    clipLen,
  };
}

/**
 * @param {TimelineStateSlice} state
 */
export function getAudioRange(state) {
  const linked = state.audioLinked !== false;
  if (linked) {
    const { effectiveStart, effectiveEnd } = getEffectiveRange(state);
    return { audioStart: effectiveStart, audioEnd: effectiveEnd };
  }
  const audioStart = clamp(state.audioStart ?? state.startTime, 0, state.duration);
  const audioEnd = clamp(state.audioEnd ?? state.endTime, audioStart + 0.1, state.duration);
  return { audioStart, audioEnd };
}

/**
 * @param {Object} deps
 */
export function createDualTimeline(deps) {
  const {
    preview,
    overviewFrames,
    overviewStoryboard,
    overviewTrack,
    overviewPlayhead,
    overviewMaskLeft,
    overviewMaskRight,
    overviewHandleStart,
    overviewHandleEnd,
    trimZoomTrack,
    trimZoomFrames,
    trimZoomPlayhead,
    trimZoomMaskLeft,
    trimZoomMaskRight,
    trimZoomHandleStart,
    trimZoomHandleEnd,
    waveformCanvas,
    trimEditorStrip,
    trimModeHint,
    getState,
    patchState,
    onSync,
  } = deps;

  /** @type {"start" | "end" | "seek" | "slip" | "audioStart" | "audioEnd" | null} */
  let dragMode = null;
  let trimZoomWindow = { start: 0, end: 1 };

  function timeFromOverview(event) {
    const track = overviewStoryboard || overviewTrack;
    if (!(track instanceof HTMLElement)) return 0;
    const state = getState();
    if (state.duration <= 0) return 0;
    const rect = track.getBoundingClientRect();
    const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    return ratio * state.duration;
  }

  function timeFromTrimZoom(event) {
    if (!(trimZoomTrack instanceof HTMLElement)) return 0;
    const span = trimZoomWindow.end - trimZoomWindow.start;
    if (span <= 0) return trimZoomWindow.start;
    const rect = trimZoomTrack.getBoundingClientRect();
    const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    return trimZoomWindow.start + ratio * span;
  }

  function computeTrimZoomWindow(currentTime) {
    const state = getState();
    if (state.duration <= 0) return { start: 0, end: 1 };
    const center = clamp(currentTime, 0, state.duration);
    let start = center - TRIM_ZOOM_HALF;
    let end = center + TRIM_ZOOM_HALF;
    if (start < 0) {
      end -= start;
      start = 0;
    }
    if (end > state.duration) {
      start -= end - state.duration;
      end = state.duration;
    }
    start = Math.max(0, start);
    end = Math.min(state.duration, Math.max(start + 0.5, end));
    return { start, end };
  }

  function pctOfDuration(time, duration) {
    if (duration <= 0) return 0;
    return (time / duration) * 100;
  }

  function pctInWindow(time, windowStart, windowEnd) {
    const span = windowEnd - windowStart;
    if (span <= 0) return 0;
    return ((time - windowStart) / span) * 100;
  }

  function updateOverview() {
    const state = getState();
    if (state.duration <= 0) return;

    const startPct = pctOfDuration(state.startTime, state.duration);
    const endPct = pctOfDuration(state.endTime, state.duration);
    const currentPct = pctOfDuration(preview.currentTime, state.duration);
    const { effectiveStart, effectiveEnd } = getEffectiveRange(state);
    const effStartPct = pctOfDuration(effectiveStart, state.duration);
    const effEndPct = pctOfDuration(effectiveEnd, state.duration);

    if (overviewMaskLeft instanceof HTMLElement) overviewMaskLeft.style.width = `${startPct}%`;
    if (overviewMaskRight instanceof HTMLElement) {
      overviewMaskRight.style.left = `${endPct}%`;
      overviewMaskRight.style.width = `${Math.max(0, 100 - endPct)}%`;
    }

    if (overviewHandleStart instanceof HTMLElement) {
      overviewHandleStart.style.left = `${startPct}%`;
      overviewHandleStart.dataset.content = formatTimeShort(state.startTime);
    }
    if (overviewHandleEnd instanceof HTMLElement) {
      overviewHandleEnd.style.left = `${endPct}%`;
      overviewHandleEnd.dataset.content = formatTimeShort(state.endTime);
    }
    if (overviewPlayhead instanceof HTMLElement) {
      overviewPlayhead.style.left = `${clamp(currentPct, 0, 100)}%`;
      overviewPlayhead.dataset.value = formatTimeShort(preview.currentTime);
    }

    if (trimZoomTrack instanceof HTMLElement) {
      trimZoomTrack.style.setProperty("--ve-slip-start", `${effStartPct}%`);
      trimZoomTrack.style.setProperty("--ve-slip-end", `${effEndPct}%`);
    }

    if (trimModeHint instanceof HTMLElement) {
      trimModeHint.hidden = !state.trimMode;
      trimModeHint.textContent = state.trimMode ? "Trim モード (T) — 端: リップル / 中央: スリップ" : "";
    }

    updateTrimZoom();
    updateWaveform();
  }

  function updateTrimZoom() {
    const state = getState();
    if (state.duration <= 0 || !(trimZoomTrack instanceof HTMLElement)) return;

    trimZoomWindow = computeTrimZoomWindow(preview.currentTime);
    const { start: wStart, end: wEnd } = trimZoomWindow;
    const { effectiveStart, effectiveEnd } = getEffectiveRange(state);
    const { audioStart, audioEnd } = getAudioRange(state);

    const startPct = pctInWindow(state.startTime, wStart, wEnd);
    const endPct = pctInWindow(state.endTime, wStart, wEnd);
    const playPct = pctInWindow(preview.currentTime, wStart, wEnd);
    const effStartPct = pctInWindow(effectiveStart, wStart, wEnd);
    const effEndPct = pctInWindow(effectiveEnd, wStart, wEnd);

    if (trimZoomMaskLeft instanceof HTMLElement) trimZoomMaskLeft.style.width = `${clamp(startPct, 0, 100)}%`;
    if (trimZoomMaskRight instanceof HTMLElement) {
      trimZoomMaskRight.style.left = `${clamp(endPct, 0, 100)}%`;
      trimZoomMaskRight.style.width = `${Math.max(0, 100 - clamp(endPct, 0, 100))}%`;
    }

    if (trimZoomHandleStart instanceof HTMLElement) {
      trimZoomHandleStart.style.left = `${clamp(startPct, 0, 100)}%`;
      trimZoomHandleStart.dataset.content = formatTimeShort(state.startTime);
    }
    if (trimZoomHandleEnd instanceof HTMLElement) {
      trimZoomHandleEnd.style.left = `${clamp(endPct, 0, 100)}%`;
      trimZoomHandleEnd.dataset.content = formatTimeShort(state.endTime);
    }
    if (trimZoomPlayhead instanceof HTMLElement) {
      trimZoomPlayhead.style.left = `${clamp(playPct, 0, 100)}%`;
      trimZoomPlayhead.dataset.value = formatTimeShort(preview.currentTime);
    }

    trimZoomTrack.dataset.audioStart = String(audioStart);
    trimZoomTrack.dataset.audioEnd = String(audioEnd);
    trimZoomTrack.style.setProperty("--ve-eff-start", `${clamp(effStartPct, 0, 100)}%`);
    trimZoomTrack.style.setProperty("--ve-eff-end", `${clamp(effEndPct, 0, 100)}%`);
  }

  function updateWaveform() {
    if (!(waveformCanvas instanceof HTMLCanvasElement)) return;
    const state = getState();
    const peaks = state.waveformPeaks;
    if (!peaks?.length || state.duration <= 0) return;

    const { audioStart, audioEnd } = getAudioRange(state);
    drawWaveform(waveformCanvas, peaks, {
      startRatio: state.startTime / state.duration,
      endRatio: state.endTime / state.duration,
      playheadRatio: preview.currentTime / state.duration,
      audioStartRatio: audioStart / state.duration,
      audioEndRatio: audioEnd / state.duration,
    });
  }

  /** プレビュー動画のフレームが canvas 描画可能になるまで待つ */
  async function waitForPreviewFrames() {
    if (preview.videoWidth > 0 && preview.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      return true;
    }

    await new Promise((resolve) => {
      if (preview.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        resolve(undefined);
        return;
      }
      preview.addEventListener("loadeddata", () => resolve(undefined), { once: true });
    });

    if (preview.videoWidth > 0) return true;

    // 一部コーデックは loadeddata 後も videoWidth が 0 のまま
    await seekPreviewTo(0.001, 5000);
    return preview.videoWidth > 0;
  }

  /**
   * 指定時刻へシーク（seeked 未発火・ハング対策つき）
   * @param {number} time
   * @param {number} [timeoutMs]
   */
  function seekPreviewTo(time, timeoutMs = 4000) {
    const maxTime = Math.max(0, preview.duration - 0.001);
    const target = clamp(time, 0, maxTime);

    if (
      preview.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
      Math.abs(preview.currentTime - target) < 0.02
    ) {
      return Promise.resolve(true);
    }

    return new Promise((resolve) => {
      let settled = false;
      const finish = (ok) => {
        if (settled) return;
        settled = true;
        preview.removeEventListener("seeked", onSeeked);
        clearTimeout(timer);
        resolve(ok);
      };
      const onSeeked = () => finish(true);
      const timer = setTimeout(() => finish(false), timeoutMs);
      preview.addEventListener("seeked", onSeeked);
      try {
        preview.currentTime = target;
      } catch {
        finish(false);
      }
    });
  }

  /** フィルムストリップ不可時のプレースホルダ */
  function showFilmstripPlaceholder(container, message) {
    if (!(container instanceof HTMLElement)) return;
    container.innerHTML = "";
    container.classList.add("ve-storyboard-frames--pending");
    const note = document.createElement("p");
    note.className = "ve-filmstrip-status";
    note.textContent = message;
    container.appendChild(note);
  }

  /** ローディング中のスケルトン枠 */
  function showFilmstripSkeleton(container, frameCount) {
    if (!(container instanceof HTMLElement)) return;
    container.innerHTML = "";
    container.classList.add("ve-storyboard-frames--pending");
    for (let i = 0; i < frameCount; i += 1) {
      const frameEl = document.createElement("div");
      frameEl.className = "ve-storyboard-frame ve-storyboard-frame--loading";
      container.appendChild(frameEl);
    }
  }

  async function buildFilmstrip(container, duration, frameCountHint) {
    if (!(container instanceof HTMLElement) || duration <= 0) return;

    const frameCount = Math.min(
      duration > 300 ? 12 : 24,
      Math.max(6, frameCountHint ?? (Math.floor(container.offsetWidth / 56) || 12))
    );

    if (!preview.videoWidth) {
      showFilmstripPlaceholder(
        container,
        "映像トラックをブラウザがデコードできません（H.265/HEVC 等）。波形のみ表示しています。"
      );
      return;
    }

    showFilmstripSkeleton(container, frameCount);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 160;
    canvas.height = 90;
    const savedTime = preview.currentTime;
    const wasPaused = preview.paused;
    const frames = container.querySelectorAll(".ve-storyboard-frame");

    for (let i = 0; i < frameCount; i += 1) {
      const frameEl = frames[i];
      if (!(frameEl instanceof HTMLElement)) continue;

      const img = document.createElement("img");
      img.alt = "";
      frameEl.replaceChildren(img);
      frameEl.classList.remove("ve-storyboard-frame--loading");

      const t = ((i + 0.5) / frameCount) * duration;
      const seekOk = await seekPreviewTo(t);
      if (seekOk) {
        try {
          ctx.drawImage(preview, 0, 0, canvas.width, canvas.height);
          img.src = canvas.toDataURL("image/jpeg", 0.55);
        } catch {
          frameEl.classList.add("ve-storyboard-frame--failed");
        }
      } else {
        frameEl.classList.add("ve-storyboard-frame--failed");
      }
    }

    container.classList.remove("ve-storyboard-frames--pending");
    preview.currentTime = savedTime;
    if (!wasPaused) preview.play().catch(() => {});
  }

  async function rebuildAllFilmstrips() {
    const state = getState();
    if (state.duration <= 0) return;

    const canDraw = await waitForPreviewFrames();
    if (!canDraw) {
      const msg =
        "映像サムネイルを生成できません。ブラウザ非対応コーデック（H.265/HEVC 等）の可能性があります。";
      showFilmstripPlaceholder(overviewFrames, msg);
      showFilmstripPlaceholder(trimZoomFrames, msg);
      return;
    }

    await buildFilmstrip(overviewFrames, state.duration);
    trimZoomWindow = computeTrimZoomWindow(preview.currentTime);
    const { start, end } = trimZoomWindow;
    await buildFilmstrip(trimZoomFrames, end - start, 16);
    await buildTrimEditorStrip();
  }

  async function buildTrimEditorStrip(activeEdge = "start") {
    if (!(trimEditorStrip instanceof HTMLElement)) return;
    const state = getState();
    if (state.duration <= 0 || !preview.videoWidth) {
      trimEditorStrip.innerHTML = "";
      return;
    }

    const fps = state.fps ?? 30;
    const frameDur = 1 / fps;
    const anchor = activeEdge === "end" ? state.endTime : state.startTime;
    trimEditorStrip.innerHTML = "";

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 120;
    canvas.height = 68;
    const savedTime = preview.currentTime;

    for (let i = -TRIM_EDITOR_HALF_FRAMES; i <= TRIM_EDITOR_HALF_FRAMES; i += 1) {
      const t = clamp(anchor + i * frameDur, 0, state.duration);
      const frameEl = document.createElement("div");
      frameEl.className = "ve-trim-editor-frame";
      if (i === 0) frameEl.classList.add("is-anchor");
      const img = document.createElement("img");
      img.alt = "";
      frameEl.appendChild(img);
      trimEditorStrip.appendChild(frameEl);

      await new Promise((resolve) => {
        seekPreviewTo(t).then((seekOk) => {
          if (seekOk) {
            try {
              ctx.drawImage(preview, 0, 0, canvas.width, canvas.height);
              img.src = canvas.toDataURL("image/jpeg", 0.6);
            } catch {
              // ignore
            }
          }
          resolve(undefined);
        });
      });
    }

    preview.currentTime = savedTime;
  }

  function resolveTrimZoomDragMode(event) {
    const state = getState();
    if (!(trimZoomTrack instanceof HTMLElement)) return "seek";
    const t = timeFromTrimZoom(event);
    const edgeThreshold = 0.25;

    const distStart = Math.abs(t - state.startTime);
    const distEnd = Math.abs(t - state.endTime);
    const clipMid = (state.startTime + state.endTime) / 2;
    const inSelection = t >= state.startTime && t <= state.endTime;

    if (state.trimMode && inSelection && distStart > edgeThreshold && distEnd > edgeThreshold) {
      return "slip";
    }
    if (distStart < edgeThreshold) return "start";
    if (distEnd < edgeThreshold) return "end";
    if (state.trimMode && Math.abs(t - clipMid) < (state.endTime - state.startTime) * 0.35) {
      return "slip";
    }
    return "seek";
  }

  function onOverviewMove(event) {
    if (!dragMode) return;
    const state = getState();
    const t = timeFromOverview(event);

    if (dragMode === "start") {
      patchState({ startTime: clamp(t, 0, state.endTime - 0.1) });
    } else if (dragMode === "end") {
      patchState({ endTime: clamp(t, state.startTime + 0.1, state.duration) });
    } else if (dragMode === "seek") {
      const { effectiveStart, effectiveEnd } = getEffectiveRange(getState());
      preview.currentTime = clamp(t, effectiveStart, effectiveEnd);
    }
    onSync();
    updateOverview();
  }

  function onTrimZoomMove(event) {
    if (!dragMode) return;
    const state = getState();
    const t = timeFromTrimZoom(event);

    if (dragMode === "start") {
      patchState({ startTime: clamp(t, 0, state.endTime - 0.1) });
    } else if (dragMode === "end") {
      patchState({ endTime: clamp(t, state.startTime + 0.1, state.duration) });
    } else if (dragMode === "slip") {
      const clipLen = state.endTime - state.startTime;
      const desiredSlip = t - state.startTime - clipLen / 2;
      const minSlip = -state.startTime;
      const maxSlip = state.duration - state.endTime;
      patchState({ slipOffset: clamp(desiredSlip, minSlip, maxSlip) });
    } else if (dragMode === "audioStart") {
      patchState({ audioLinked: false, audioStart: clamp(t, 0, (state.audioEnd ?? state.endTime) - 0.1) });
    } else if (dragMode === "audioEnd") {
      patchState({ audioLinked: false, audioEnd: clamp(t, (state.audioStart ?? state.startTime) + 0.1, state.duration) });
    } else if (dragMode === "seek") {
      preview.currentTime = clamp(t, 0, state.duration);
    }
    onSync();
    updateOverview();
  }

  function onUp() {
    dragMode = null;
    window.removeEventListener("pointermove", onOverviewMove);
    window.removeEventListener("pointermove", onTrimZoomMove);
    window.removeEventListener("pointerup", onUp);
    buildTrimEditorStrip().catch(() => {});
  }

  function bindHandle(handle, mode, useTrimZoom) {
    handle?.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      dragMode = mode;
      if (useTrimZoom) {
        window.addEventListener("pointermove", onTrimZoomMove);
      } else {
        window.addEventListener("pointermove", onOverviewMove);
      }
      window.addEventListener("pointerup", onUp);
      buildTrimEditorStrip(mode === "end" ? "end" : "start").catch(() => {});
    });
  }

  function initDrag() {
    bindHandle(overviewHandleStart, "start", false);
    bindHandle(overviewHandleEnd, "end", false);
    bindHandle(trimZoomHandleStart, "start", true);
    bindHandle(trimZoomHandleEnd, "end", true);

    overviewStoryboard?.addEventListener("pointerdown", (event) => {
      if (event.target === overviewHandleStart || event.target === overviewHandleEnd) return;
      dragMode = "seek";
      onOverviewMove(event);
      window.addEventListener("pointermove", onOverviewMove);
      window.addEventListener("pointerup", onUp);
    });

    trimZoomTrack?.addEventListener("pointerdown", (event) => {
      if (event.target === trimZoomHandleStart || event.target === trimZoomHandleEnd) return;
      dragMode = resolveTrimZoomDragMode(event);
      trimZoomTrack?.classList.toggle("is-slip-drag", dragMode === "slip");
      onTrimZoomMove(event);
      window.addEventListener("pointermove", onTrimZoomMove);
      window.addEventListener("pointerup", () => {
        trimZoomTrack?.classList.remove("is-slip-drag");
        onUp();
      });
    });

    waveformCanvas?.addEventListener("pointerdown", (event) => {
      const state = getState();
      if (state.duration <= 0) return;
      const rect = waveformCanvas.getBoundingClientRect();
      const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const t = ratio * state.duration;
      const { audioStart, audioEnd } = getAudioRange(state);
      dragMode = Math.abs(t - audioStart) < Math.abs(t - audioEnd) ? "audioStart" : "audioEnd";
      patchState({ audioLinked: false });
      onTrimZoomMove(event);
      window.addEventListener("pointermove", onTrimZoomMove);
      window.addEventListener("pointerup", onUp);
    });
  }

  return {
    update: updateOverview,
    updateWaveform,
    buildFilmstrip: rebuildAllFilmstrips,
    buildTrimEditorStrip,
    initDrag,
    getEffectiveRange: () => getEffectiveRange(getState()),
    getAudioRange: () => getAudioRange(getState()),
  };
}

/**
 * JKL トランスポート
 * @param {HTMLVideoElement} video
 * @param {TimelineStateSlice & { jklSpeed?: number }} state
 * @param {string} key
 * @param {(partial: Partial<TimelineStateSlice & { jklSpeed?: number }>) => void} patchState
 */
export function handleJklTransport(video, state, key, patchState) {
  const { effectiveStart, effectiveEnd } = getEffectiveRange(state);
  const fps = state.fps ?? 30;
  const frameStep = 1 / fps;

  if (key === "k" || key === "K") {
    video.pause();
    patchState({ jklSpeed: 0 });
    video.playbackRate = 1;
    return;
  }

  if (key === "j" || key === "J") {
    video.pause();
    const speed = state.jklSpeed && state.jklSpeed < 0 ? state.jklSpeed * 2 : -1;
    patchState({ jklSpeed: Math.max(-8, speed) });
    video.currentTime = clamp(video.currentTime - frameStep * Math.abs(speed), effectiveStart, effectiveEnd);
    return;
  }

  if (key === "l" || key === "L") {
    const speed = state.jklSpeed && state.jklSpeed > 0 ? state.jklSpeed * 2 : 1;
    const nextSpeed = Math.min(8, speed);
    patchState({ jklSpeed: nextSpeed });
    video.playbackRate = nextSpeed;
    if (video.currentTime >= effectiveEnd - 0.05) video.currentTime = effectiveStart;
    video.play().catch(() => {});
    return;
  }

  if (key === ",") {
    video.pause();
    video.currentTime = clamp(video.currentTime - frameStep, effectiveStart, effectiveEnd);
    return;
  }

  if (key === ".") {
    video.pause();
    video.currentTime = clamp(video.currentTime + frameStep, effectiveStart, effectiveEnd);
  }
}
