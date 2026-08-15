/**
 * タイムライン駆動プレビュー — マルチクリップ再生 + BGM 同期
 */

import {
  clipTimelineEnd,
  findClipAtTimelineTime,
  getNextClip,
  isMultiClipTimeline,
} from "./timeline-model.js";
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
  let video = null;
  /** @type {HTMLAudioElement | null} */
  let bgm = null;
  /** @type {string | null} */
  let activeVideoMediaId = null;
  /** @type {string | null} */
  let activeBgmMediaId = null;
  /** @type {string | null} */
  let activeVideoClipId = null;
  let rafId = 0;
  let lastTick = 0;

  function getV1Track() {
    return getTimeline()?.tracks.find((t) => t.id === "v1") ?? null;
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

  async function setVideoSource(mediaId, sourceTime) {
    const timeline = getTimeline();
    if (!video || !timeline) return;
    const media = timeline.mediaBin.find((m) => m.id === mediaId);
    if (!media) return;

    if (activeVideoMediaId !== mediaId) {
      activeVideoMediaId = mediaId;
      video.src = media.objectUrl;
      await new Promise((resolve) => {
        if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
          resolve(undefined);
          return;
        }
        video.addEventListener("loadedmetadata", () => resolve(undefined), { once: true });
      });
    }

    const t = clamp(sourceTime, 0, Math.max(0, video.duration - 0.001));
    if (Math.abs(video.currentTime - t) > 0.05) {
      video.currentTime = t;
    }
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

  async function syncMediaAtTimelineTime(timelineTime, { autoplay = false } = {}) {
    const timeline = getTimeline();
    if (!video || !timeline) return;

    const trim = getTrimState();
    video.volume = Math.min(1, trim.volume / 100);
    video.playbackRate = trim.speed / 100;
    if (bgm) {
      bgm.volume = Math.min(1, trim.bgmVolume / 100);
      bgm.playbackRate = trim.speed / 100;
    }

    const multi = isMultiClipTimeline(timeline);
    const vTrack = getV1Track();

    if (!multi && vTrack?.clips[0]) {
      const { effectiveStart, effectiveEnd } = singleClipRange();
      const clip = vTrack.clips[0];
      const t = clamp(timelineTime, effectiveStart, effectiveEnd);
      activeVideoClipId = clip.id;
      await setVideoSource(clip.mediaId, t);
      setPlayhead(t);
    } else if (vTrack) {
      const clip = findClipAtTimelineTime(vTrack, timelineTime);
      if (clip) {
        activeVideoClipId = clip.id;
        const sourceTime = resolveSourceTime(clip, timelineTime);
        await setVideoSource(clip.mediaId, sourceTime);
      }
      setPlayhead(timelineTime);
    }

    const a2 = getA2Track();
    if (bgm && a2) {
      const bgmClip = findClipAtTimelineTime(a2, timelineTime);
      if (bgmClip) {
        const sourceTime = resolveSourceTime(bgmClip, timelineTime);
        await setBgmSource(bgmClip.mediaId, sourceTime);
        if (autoplay && isPlaying()) {
          bgm.play().catch(() => {});
        } else if (!autoplay) {
          bgm.pause();
        }
      } else {
        bgm.pause();
        activeBgmMediaId = null;
      }
    }

    if (autoplay && isPlaying()) {
      video.play().catch(() => {});
    }
  }

  function tick(now) {
    if (!isPlaying() || !video) return;
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
      const t = clamp(video.currentTime, effectiveStart, effectiveEnd);
      setPlayhead(t);
      if (t >= effectiveEnd - 0.02) {
        pause();
        setPlayhead(effectiveEnd);
      }
      syncBgmOnly(t).catch(() => {});
      rafId = requestAnimationFrame(tick);
      return;
    }

    if (vTrack && activeVideoClipId) {
      const clip = vTrack.clips.find((c) => c.id === activeVideoClipId);
      if (clip) {
        const clipEnd = clipTimelineEnd(clip);
        if (nextTime >= clipEnd - 0.02) {
          const nextClip = getNextClip(vTrack, clip.id);
          if (nextClip) {
            activeVideoClipId = nextClip.id;
            nextTime = nextClip.timelineStart;
            syncMediaAtTimelineTime(nextTime, { autoplay: true }).catch(() => {});
            setPlayhead(nextTime);
            rafId = requestAnimationFrame(tick);
            return;
          }
          nextTime = clipEnd;
          pause();
        }
      }
    }

    if (nextTime >= timeline.duration) {
      nextTime = timeline.duration;
      pause();
    }

    setPlayhead(nextTime);
    syncBgmOnly(nextTime).catch(() => {});
    rafId = requestAnimationFrame(tick);
  }

  async function syncBgmOnly(timelineTime) {
    const a2 = getA2Track();
    if (!bgm || !a2) return;
    const bgmClip = findClipAtTimelineTime(a2, timelineTime);
    if (!bgmClip) {
      bgm.pause();
      return;
    }
    const sourceTime = resolveSourceTime(bgmClip, timelineTime);
    await setBgmSource(bgmClip.mediaId, sourceTime);
    if (isPlaying()) bgm.play().catch(() => {});
  }

  function attach(videoEl, bgmEl = null) {
    video = videoEl;
    bgm = bgmEl;
    activeVideoMediaId = null;
    activeBgmMediaId = null;
    activeVideoClipId = null;
  }

  function detach() {
    stopTick();
    video = null;
    bgm = null;
    activeVideoMediaId = null;
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
    await syncMediaAtTimelineTime(t, { autoplay: !pauseAfter && isPlaying() });
    if (isPlaying() && !pauseAfter) {
      rafId = requestAnimationFrame(tick);
    }
  }

  async function play() {
    const timeline = getTimeline();
    if (!video || !timeline) return;

    const multi = isMultiClipTimeline(timeline);
    if (!multi) {
      const { effectiveStart, effectiveEnd } = singleClipRange();
      if (getPlayhead() >= effectiveEnd - 0.05 || getPlayhead() < effectiveStart) {
        await seekToTimelineTime(effectiveStart, { pauseAfter: false });
      }
    } else if (getPlayhead() >= timeline.duration - 0.05) {
      await seekToTimelineTime(0, { pauseAfter: false });
    } else {
      await syncMediaAtTimelineTime(getPlayhead(), { autoplay: true });
    }

    setPlaying(true);
    stopTick();
    rafId = requestAnimationFrame(tick);
    video.play().catch(() => {});
    if (bgm) bgm.play().catch(() => {});
  }

  function pause() {
    setPlaying(false);
    stopTick();
    video?.pause();
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
    if (!video || !timeline || !vTrack || isMultiClipTimeline(timeline)) return;

    const { effectiveStart } = singleClipRange();
    const clip = vTrack.clips[0];
    if (!clip) return;
    setPlayhead(video.currentTime);
  }

  return {
    attach,
    detach,
    seekToTimelineTime,
    play,
    pause,
    togglePlay,
    syncMediaAtTimelineTime,
    onVideoTimeUpdate,
    stopTick,
  };
}
