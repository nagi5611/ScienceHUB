/**
 * Phase 3 — マルチトラックタイムライン UI + クリップ DnD
 */

import {
  appendBgmClip,
  bladeSplit,
  moveClip,
  placeVideoClip,
  rippleDelete,
  rollEdit,
  setTransition,
  slideEdit,
  trimClipEnd,
  trimClipStart,
} from "./timeline-model.js";
import { formatTimeShort } from "./time.js";

/**
 * @param {Object} deps
 */
export function createTimelineView(deps) {
  const {
    mediaBinEl,
    multiTrackEl,
    getTimeline,
    getPlayhead,
    setPlayhead,
    onChange,
    getSelectedClipId,
    setSelectedClipId,
    onClipSelect,
    onBeforeEdit,
    onSeekPreview,
  } = deps;

  /** @type {{ mode: string, trackId: string, clipId: string, startX: number, startVal: number, laneWidth: number } | null} */
  let dragState = null;

  function pxToSeconds(px, laneWidth, duration) {
    return (px / laneWidth) * duration;
  }

  function renderMediaBin() {
    if (!(mediaBinEl instanceof HTMLElement)) return;
    const timeline = getTimeline();
    mediaBinEl.innerHTML = "";

    for (const item of timeline.mediaBin) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ve-media-bin-item";
      if (item.kind === "audio") btn.classList.add("ve-media-bin-item--audio");
      btn.dataset.mediaId = item.id;
      btn.title = item.name;
      const kindLabel = item.kind === "audio" ? "🎵 " : "🎬 ";
      btn.innerHTML = `<span class="ve-media-bin-name">${kindLabel}${item.name}</span><span class="ve-media-bin-dur">${formatTimeShort(item.duration)}</span>`;
      btn.addEventListener("click", () => {
        onBeforeEdit?.();
        if (item.kind === "audio") {
          appendBgmClip(timeline, item.id, getPlayhead(), 0, item.duration);
        } else {
          placeVideoClip(timeline, item.id, getPlayhead(), 0, item.duration);
        }
        onChange();
        render();
      });
      mediaBinEl.appendChild(btn);
    }
  }

  function bindClipDrag(el, trackId, clipId, lane) {
    const onPointerDown = (event) => {
      if (!(event.target instanceof HTMLElement)) return;
      const isStart = event.target.classList.contains("ve-clip-handle--start");
      const isEnd = event.target.classList.contains("ve-clip-handle--end");
      const isHandle = isStart || isEnd;
      if (!isHandle && event.button !== 0) return;

      event.preventDefault();
      event.stopPropagation();
      onBeforeEdit?.();

      const rect = lane.getBoundingClientRect();
      const timeline = getTimeline();
      dragState = {
        mode: isStart ? "trim-start" : isEnd ? "trim-end" : "move",
        trackId,
        clipId,
        startX: event.clientX,
        startVal: 0,
        laneWidth: rect.width,
        duration: timeline.duration,
      };

      el.setPointerCapture(event.pointerId);
      el.classList.add("is-dragging");
    };

    const onPointerMove = (event) => {
      if (!dragState || dragState.clipId !== clipId) return;
      const timeline = getTimeline();
      const deltaPx = event.clientX - dragState.startX;
      const deltaSec = pxToSeconds(deltaPx, dragState.laneWidth, dragState.duration);

      if (dragState.mode === "move") {
        const track = timeline.tracks.find((t) => t.id === trackId);
        const clip = track?.clips.find((c) => c.id === clipId);
        if (!clip) return;
        moveClip(timeline, trackId, clipId, clip.timelineStart + deltaSec);
      } else if (dragState.mode === "trim-start") {
        trimClipStart(timeline, trackId, clipId, deltaSec);
      } else if (dragState.mode === "trim-end") {
        trimClipEnd(timeline, trackId, clipId, deltaSec);
      }

      dragState.startX = event.clientX;
      onChange();
      onSeekPreview?.(getPlayhead());
      render();
    };

    const onPointerUp = (event) => {
      if (!dragState || dragState.clipId !== clipId) return;
      dragState = null;
      el.classList.remove("is-dragging");
      el.releasePointerCapture(event.pointerId);
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
  }

  function renderTrackRow(track, timeline) {
    const row = document.createElement("div");
    row.className = "ve-track-row";
    if (track.id === "a2") row.classList.add("ve-track-row--bgm");
    row.dataset.trackId = track.id;

    const label = document.createElement("span");
    label.className = "ve-track-label";
    label.textContent = track.id === "a2" ? "BGM" : track.id.toUpperCase();
    row.appendChild(label);

    const lane = document.createElement("div");
    lane.className = "ve-track-lane";

    for (const clip of track.clips) {
      const clipLen = clip.sourceOut - clip.sourceIn;
      const leftPct = (clip.timelineStart / timeline.duration) * 100;
      const widthPct = (clipLen / timeline.duration) * 100;
      const media = timeline.mediaBin.find((m) => m.id === clip.mediaId);

      const el = document.createElement("div");
      el.className = "ve-track-clip";
      el.role = "button";
      el.tabIndex = 0;
      if (clip.id === getSelectedClipId()) el.classList.add("is-selected");
      el.style.left = `${leftPct}%`;
      el.style.width = `${Math.max(1, widthPct)}%`;
      el.dataset.clipId = clip.id;
      el.dataset.trackId = track.id;
      el.title = media?.name ?? clip.id;
      if (clip.transitionOut && clip.transitionOut > 0) {
        el.dataset.transition = String(clip.transitionOut);
      }

      const handleStart = document.createElement("span");
      handleStart.className = "ve-clip-handle ve-clip-handle--start";
      handleStart.setAttribute("aria-hidden", "true");

      const labelEl = document.createElement("span");
      labelEl.className = "ve-clip-label";
      labelEl.textContent = media?.name?.split(".").shift()?.slice(0, 12) ?? "Clip";

      const handleEnd = document.createElement("span");
      handleEnd.className = "ve-clip-handle ve-clip-handle--end";
      handleEnd.setAttribute("aria-hidden", "true");

      el.append(handleStart, labelEl, handleEnd);

      el.addEventListener("click", (event) => {
        if (event.target instanceof HTMLElement && event.target.classList.contains("ve-clip-handle")) return;
        event.stopPropagation();
        setSelectedClipId(clip.id);
        onClipSelect?.(track.id, clip);
        const rect = el.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const t = clip.timelineStart + ratio * clipLen;
        setPlayhead(t);
        onSeekPreview?.(t);
        render();
      });

      if (track.id === "v1" || track.id === "a2") {
        bindClipDrag(el, track.id, clip.id, lane);
      }

      lane.appendChild(el);
    }

    const playhead = document.createElement("div");
    playhead.className = "ve-track-playhead";
    playhead.style.left = `${(getPlayhead() / timeline.duration) * 100}%`;
    lane.appendChild(playhead);

    lane.addEventListener("click", (event) => {
      if (event.target instanceof HTMLElement && event.target.closest(".ve-track-clip")) return;
      const rect = lane.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const t = ratio * timeline.duration;
      setPlayhead(t);
      onSeekPreview?.(t);
      render();
    });

    row.appendChild(lane);
    return row;
  }

  function renderTracks() {
    if (!(multiTrackEl instanceof HTMLElement)) return;
    const timeline = getTimeline();
    multiTrackEl.innerHTML = "";

    if (timeline.duration <= 0) return;

    for (const track of timeline.tracks) {
      if (track.type === "audio" && track.id === "a1") continue;
      if (track.type === "video" || (track.id === "a2" && track.clips.length > 0)) {
        multiTrackEl.appendChild(renderTrackRow(track, timeline));
      }
    }
  }

  function render() {
    renderMediaBin();
    renderTracks();
  }

  function handleBlade() {
    onBeforeEdit?.();
    const timeline = getTimeline();
    const time = getPlayhead();
    bladeSplit(timeline, "v1", time);
    bladeSplit(timeline, "a1", time);
    onChange();
    render();
  }

  function handleRippleDelete() {
    const clipId = getSelectedClipId();
    if (!clipId) return;
    onBeforeEdit?.();
    const timeline = getTimeline();
    rippleDelete(timeline, "v1", clipId);
    rippleDelete(timeline, "a1", clipId.replace(/-a$/, "") || clipId);
    setSelectedClipId(null);
    onChange();
    render();
  }

  function handleRoll(delta) {
    const clipId = getSelectedClipId();
    if (!clipId) return;
    onBeforeEdit?.();
    rollEdit(getTimeline(), "v1", clipId, delta);
    onChange();
    render();
  }

  function handleSlide(delta) {
    const clipId = getSelectedClipId();
    if (!clipId) return;
    onBeforeEdit?.();
    slideEdit(getTimeline(), "v1", clipId, delta);
    onChange();
    render();
  }

  function handleTransition(seconds) {
    const clipId = getSelectedClipId();
    if (!clipId) return;
    onBeforeEdit?.();
    setTransition(getTimeline(), clipId, seconds);
    onChange();
    render();
  }

  return {
    render,
    handleBlade,
    handleRippleDelete,
    handleRoll,
    handleSlide,
    handleTransition,
  };
}
