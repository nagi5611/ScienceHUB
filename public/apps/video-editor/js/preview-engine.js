/**
 * タイムライン駆動プレビュー — マルチクリップ + トランジション + PiP + BGM
 */

import {
  clipTimelineEnd,
  findClipAtTimelineTime,
  getClipColorEffects,
  getClipPipEffects,
  getNextClip,
  getTransitionState,
  isMultiClipTimeline,
} from "./timeline-model.js";
import { colorEffectsFromClip, createPreviewCompositor } from "./preview-compositor.js";
import { clamp } from "./time.js";

/**
 * @param {Object} deps
 * @param {() => import("./timeline-model.js").TimelineModel | null} deps.getTimeline
 * @param {() => number} deps.getPlayhead
 * @param {(t: number) => void} deps.setPlayhead
 * @param {() => { startTime: number, endTime: number, slipOffset?: number, duration: number, speed: number, volume: number, bgmVolume: number }} deps.getTrimState
 * @param {() => boolean} deps.isPlaying
 * @param {(playing: boolean) => void} deps.setPlaying
 */
export function createPreviewEngine(deps) {
  const { getTimeline, getPlayhead, setPlayhead, getTrimState, isPlaying, setPlaying } = deps;

  /** @type {HTMLVideoElement | null} */
  let videoA = null;
  /** @type {HTMLVideoElement | null} */
  let videoB = null;
  /** @type {HTMLAudioElement | null} */
  let bgm = null;
  /** @type {HTMLCanvasElement | null} */
  let canvas = null;
  /** @type {ReturnType<typeof createPreviewCompositor> | null} */
  let compositor = null;

  /** @type {string | null} */
  let activeMediaA = null;
  /** @type {string | null} */
  let activeMediaB = null;
  /** @type {string | null} */
  let activeBgmMediaId = null;
  /** @type {string | null} */
  let activeVideoClipId = null;
  let rafId = 0;
  let lastTick = 0;

  function getV1Track() {
    return getTimeline()?.tracks.find((t) => t.id === "v1") ?? null;
  }

  function getV2Track() {
    return getTimeline()?.tracks.find((t) => t.id === "v2") ?? null;
  }

  function getA2Track() {
    return getTimeline()?.tracks.find((t) => t.id === "a2") ?? null;
  }

  function resolveSourceTime(clip, timelineTime) {
    return clip.sourceIn + (timelineTime - clip.timelineStart);
  }

  function singleClipRange() {
    const trim = getTrimState();
    const slip = trim.slipOffset ?? 0;
    const effectiveStart = trim.startTime + slip;
    const effectiveEnd = effectiveStart + (trim.endTime - trim.startTime);
    return { effectiveStart, effectiveEnd };
  }

  /**
   * @param {HTMLVideoElement} el
   * @param {string | null} activeId
   * @param {string} mediaId
   * @param {number} sourceTime
   */
  async function ensureVideoSource(el, activeId, mediaId, sourceTime) {
    const timeline = getTimeline();
    if (!timeline) return activeId;
    const media = timeline.mediaBin.find((m) => m.id === mediaId);
    if (!media) return activeId;

    if (activeId !== mediaId) {
      el.src = media.objectUrl;
      await new Promise((resolve) => {
        if (el.readyState >= HTMLMediaElement.HAVE_METADATA) {
          resolve(undefined);
          return;
        }
        el.addEventListener("loadedmetadata", () => resolve(undefined), { once: true });
      });
      activeId = mediaId;
    }

    const t = clamp(sourceTime, 0, Math.max(0, el.duration - 0.001));
    if (Math.abs(el.currentTime - t) > 0.05) {
      el.currentTime = t;
    }
    return activeId;
  }

  async function setBgmSource(mediaId, sourceTime) {
    if (!bgm) return;
    const timeline = getTimeline();
    if (!timeline) return;
    const media = timeline.mediaBin.find((m) => m.id === mediaId);
    if (!media) return;

    if (activeBgmMediaId !== mediaId) {
      activeBgmMediaId = mediaId;
      bgm.src = media.objectUrl;
      await new Promise((resolve) => {
        if (bgm.readyState >= HTMLMediaElement.HAVE_METADATA) {
          resolve(undefined);
          return;
        }
        bgm.addEventListener("loadedmetadata", () => resolve(undefined), { once: true });
      });
    }

    const t = clamp(sourceTime, 0, Math.max(0, bgm.duration - 0.001));
    if (Math.abs(bgm.currentTime - t) > 0.05) {
      bgm.currentTime = t;
    }
  }

  async function renderFrame(timelineTime, { autoplay = false } = {}) {
    if (!videoA || !compositor || !canvas) return;
    const timeline = getTimeline();
    if (!timeline) return;

    const trim = getTrimState();
    videoA.volume = Math.min(1, trim.volume / 100);
    videoA.playbackRate = trim.speed / 100;
    if (videoB) videoB.playbackRate = trim.speed / 100;
    if (bgm) {
      bgm.volume = Math.min(1, trim.bgmVolume / 100);
      bgm.playbackRate = trim.speed / 100;
    }

    const multi = isMultiClipTimeline(timeline);
    const vTrack = getV1Track();
    /** @type {import("./timeline-model.js").TimelineClip | null} */
    let baseClip = null;
    /** @type {import("./timeline-model.js").TimelineClip | null} */
    let overlayClip = null;
    let crossfade = 0;

    if (!multi && vTrack?.clips[0]) {
      const { effectiveStart, effectiveEnd } = singleClipRange();
      baseClip = vTrack.clips[0];
      const t = clamp(timelineTime, effectiveStart, effectiveEnd);
      activeVideoClipId = baseClip.id;
      activeMediaA = await ensureVideoSource(videoA, activeMediaA, baseClip.mediaId, t);
      setPlayhead(t);
    } else if (vTrack) {
      const trans = getTransitionState(vTrack, timelineTime);
      if (trans) {
        baseClip = trans.from;
        overlayClip = trans.to;
        crossfade = trans.progress;
        activeVideoClipId = baseClip.id;
        const srcA = resolveSourceTime(baseClip, timelineTime);
        const srcB = resolveSourceTime(overlayClip, timelineTime);
        activeMediaA = await ensureVideoSource(videoA, activeMediaA, baseClip.mediaId, srcA);
        if (videoB) {
          activeMediaB = await ensureVideoSource(videoB, activeMediaB, overlayClip.mediaId, srcB);
        }
      } else {
        const clip = findClipAtTimelineTime(vTrack, timelineTime);
        if (clip) {
          baseClip = clip;
          activeVideoClipId = clip.id;
          const sourceTime = resolveSourceTime(clip, timelineTime);
          activeMediaA = await ensureVideoSource(videoA, activeMediaA, clip.mediaId, sourceTime);
        }
      }
      setPlayhead(timelineTime);
    }

    const v2 = getV2Track();
    /** @type {import("./preview-compositor.js").Parameters<typeof compositor.render>[0]["pip"]} */
    let pipLayer = null;
    if (v2 && videoB) {
      const pipClip = findClipAtTimelineTime(v2, timelineTime);
      if (pipClip) {
        const pipFx = getClipPipEffects(pipClip);
        const src = resolveSourceTime(pipClip, timelineTime);
        activeMediaB = await ensureVideoSource(videoB, activeMediaB, pipClip.mediaId, src);
        pipLayer = {
          video: videoB,
          x: pipFx.x,
          y: pipFx.y,
          scale: pipFx.scale,
          opacity: pipFx.opacity,
          effects: getClipColorEffects(pipClip),
        };
        overlayClip = null;
        crossfade = 0;
      }
    }

    compositor.render({
      baseVideo: videoA,
      overlayVideo: overlayClip && !pipLayer ? videoB : null,
      crossfade: pipLayer ? 0 : crossfade,
      baseEffects: colorEffectsFromClip(baseClip),
      overlayEffects: colorEffectsFromClip(overlayClip),
      pip: pipLayer,
    });

    const a2 = getA2Track();
    if (bgm && a2) {
      const bgmClip = findClipAtTimelineTime(a2, timelineTime);
      if (bgmClip) {
        const sourceTime = resolveSourceTime(bgmClip, timelineTime);
        await setBgmSource(bgmClip.mediaId, sourceTime);
        if (autoplay && isPlaying()) bgm.play().catch(() => {});
        else if (!autoplay) bgm.pause();
      } else {
        bgm.pause();
        activeBgmMediaId = null;
      }
    }

    if (autoplay && isPlaying()) {
      videoA.play().catch(() => {});
      if (overlayClip && videoB && crossfade > 0) videoB.play().catch(() => {});
      if (pipLayer && videoB) videoB.play().catch(() => {});
    }
  }

  function tick(now) {
    if (!isPlaying() || !videoA) return;
    const timeline = getTimeline();
    if (!timeline || timeline.duration <= 0) return;

    if (!lastTick) lastTick = now;
    const dt = (now - lastTick) / 1000;
    lastTick = now;

    const trim = getTrimState();
    const rate = trim.speed / 100;
    let nextTime = getPlayhead() + dt * rate;

    const multi = isMultiClipTimeline(timeline);
    const vTrack = getV1Track();

    if (!multi && vTrack?.clips[0]) {
      const { effectiveStart, effectiveEnd } = singleClipRange();
      const t = clamp(videoA.currentTime, effectiveStart, effectiveEnd);
      setPlayhead(t);
      renderFrame(t, { autoplay: true }).catch(() => {});
      if (t >= effectiveEnd - 0.02) {
        pause();
        setPlayhead(effectiveEnd);
      }
      rafId = requestAnimationFrame(tick);
      return;
    }

    if (vTrack && activeVideoClipId) {
      const clip = vTrack.clips.find((c) => c.id === activeVideoClipId);
      if (clip) {
        const clipEnd = clipTimelineEnd(clip);
        const trans = clip.transitionOut ?? 0;
        const nextClip = getNextClip(vTrack, clip.id);
        const adjacent = nextClip && Math.abs(nextClip.timelineStart - clipEnd) < 0.05;
        const inTransition = trans > 0 && adjacent && nextTime >= clipEnd - trans;

        if (!inTransition && nextTime >= clipEnd - 0.02) {
          if (nextClip) {
            activeVideoClipId = nextClip.id;
            nextTime = Math.max(nextClip.timelineStart, nextTime);
          } else {
            nextTime = clipEnd;
            pause();
          }
        }
      }
    }

    if (nextTime >= timeline.duration) {
      nextTime = timeline.duration;
      pause();
    }

    setPlayhead(nextTime);
    renderFrame(nextTime, { autoplay: true }).catch(() => {});
    rafId = requestAnimationFrame(tick);
  }

  function attach(videoEl, bgmEl = null, videoBEl = null, canvasEl = null) {
    videoA = videoEl;
    videoB = videoBEl;
    bgm = bgmEl;
    canvas = canvasEl;
    if (canvas && videoA && videoB) {
      compositor = createPreviewCompositor(canvas, videoA, videoB);
      videoA.classList.add("ve-preview--hidden");
      videoB.classList.add("ve-preview--hidden");
      videoB.hidden = false;
      canvas.hidden = false;
    }
    activeMediaA = null;
    activeMediaB = null;
    activeBgmMediaId = null;
    activeVideoClipId = null;
  }

  function detach() {
    stopTick();
    videoA?.classList.remove("ve-preview--hidden");
    videoB?.classList.remove("ve-preview--hidden");
    videoA = null;
    videoB = null;
    bgm = null;
    canvas = null;
    compositor = null;
    activeMediaA = null;
    activeMediaB = null;
    activeBgmMediaId = null;
    activeVideoClipId = null;
  }

  function stopTick() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    lastTick = 0;
  }

  async function seekToTimelineTime(timelineTime, { pauseAfter = true } = {}) {
    stopTick();
    const timeline = getTimeline();
    if (!timeline) return;
    const t = clamp(timelineTime, 0, timeline.duration);
    setPlayhead(t);
    await renderFrame(t, { autoplay: !pauseAfter && isPlaying() });
    if (isPlaying() && !pauseAfter) {
      rafId = requestAnimationFrame(tick);
    }
  }

  async function play() {
    const timeline = getTimeline();
    if (!videoA || !timeline) return;

    const multi = isMultiClipTimeline(timeline);
    if (!multi) {
      const { effectiveStart, effectiveEnd } = singleClipRange();
      if (getPlayhead() >= effectiveEnd - 0.05 || getPlayhead() < effectiveStart) {
        await seekToTimelineTime(effectiveStart, { pauseAfter: false });
      }
    } else if (getPlayhead() >= timeline.duration - 0.05) {
      await seekToTimelineTime(0, { pauseAfter: false });
    } else {
      await renderFrame(getPlayhead(), { autoplay: true });
    }

    setPlaying(true);
    stopTick();
    rafId = requestAnimationFrame(tick);
    videoA.play().catch(() => {});
    if (bgm) bgm.play().catch(() => {});
  }

  function pause() {
    setPlaying(false);
    stopTick();
    videoA?.pause();
    videoB?.pause();
    bgm?.pause();
  }

  async function togglePlay() {
    if (isPlaying()) pause();
    else await play();
  }

  function onVideoTimeUpdate() {
    if (isPlaying()) return;
    const timeline = getTimeline();
    const vTrack = getV1Track();
    if (!videoA || !timeline || !vTrack || isMultiClipTimeline(timeline)) return;
    const { effectiveStart } = singleClipRange();
    if (!vTrack.clips[0]) return;
    setPlayhead(videoA.currentTime);
    renderFrame(videoA.currentTime).catch(() => {});
  }

  function resize() {
    compositor?.resize();
    renderFrame(getPlayhead()).catch(() => {});
  }

  return {
    attach,
    detach,
    seekToTimelineTime,
    play,
    pause,
    togglePlay,
    syncMediaAtTimelineTime: renderFrame,
    onVideoTimeUpdate,
    stopTick,
    resize,
  };
}
