/**
 * Phase 2 — マルチトラックタイムライン UI + メディア bin
 */

import {
  appendClip,
  bladeSplit,
  placeOnTop,
  rippleDelete,
  rollEdit,
  setTransition,
  slideEdit,
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
  } = deps;

  function renderMediaBin() {
    if (!(mediaBinEl instanceof HTMLElement)) return;
    const timeline = getTimeline();
    mediaBinEl.innerHTML = "";

    for (const item of timeline.mediaBin) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ve-media-bin-item";
      btn.dataset.mediaId = item.id;
      btn.title = item.name;
      btn.innerHTML = `<span class="ve-media-bin-name">${item.name}</span><span class="ve-media-bin-dur">${formatTimeShort(item.duration)}</span>`;
      btn.addEventListener("click", () => {
        appendClip(timeline, item.id, 0, item.duration);
        onChange();
        render();
      });
      btn.addEventListener("dblclick", () => {
        placeOnTop(timeline, item.id, getPlayhead(), 0, Math.min(5, item.duration));
        onChange();
        render();
      });
      mediaBinEl.appendChild(btn);
    }
  }

  function renderTracks() {
    if (!(multiTrackEl instanceof HTMLElement)) return;
    const timeline = getTimeline();
    multiTrackEl.innerHTML = "";

    if (timeline.duration <= 0) return;

    for (const track of timeline.tracks) {
      if (track.type !== "video") continue;

      const row = document.createElement("div");
      row.className = "ve-track-row";
      row.dataset.trackId = track.id;

      const label = document.createElement("span");
      label.className = "ve-track-label";
      label.textContent = track.id.toUpperCase();
      row.appendChild(label);

      const lane = document.createElement("div");
      lane.className = "ve-track-lane";

      for (const clip of track.clips) {
        const clipLen = clip.sourceOut - clip.sourceIn;
        const leftPct = (clip.timelineStart / timeline.duration) * 100;
        const widthPct = (clipLen / timeline.duration) * 100;
        const media = timeline.mediaBin.find((m) => m.id === clip.mediaId);

        const el = document.createElement("button");
        el.type = "button";
        el.className = "ve-track-clip";
        if (clip.id === getSelectedClipId()) el.classList.add("is-selected");
        el.style.left = `${leftPct}%`;
        el.style.width = `${Math.max(1, widthPct)}%`;
        el.dataset.clipId = clip.id;
        el.dataset.trackId = track.id;
        el.title = media?.name ?? clip.id;
        el.textContent = media?.name?.split(".").shift()?.slice(0, 12) ?? "Clip";
        if (clip.transitionOut && clip.transitionOut > 0) {
          el.dataset.transition = String(clip.transitionOut);
        }

        el.addEventListener("click", (event) => {
          event.stopPropagation();
          setSelectedClipId(clip.id);
          onClipSelect?.();
          const rect = el.getBoundingClientRect();
          const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
          const clipLen = clip.sourceOut - clip.sourceIn;
          setPlayhead(clip.timelineStart + ratio * clipLen);
          render();
        });

        lane.appendChild(el);
      }

      const playhead = document.createElement("div");
      playhead.className = "ve-track-playhead";
      playhead.style.left = `${(getPlayhead() / timeline.duration) * 100}%`;
      lane.appendChild(playhead);

      lane.addEventListener("click", (event) => {
        if (!(event.currentTarget instanceof HTMLElement)) return;
        const rect = lane.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        setPlayhead(ratio * timeline.duration);
        render();
      });

      row.appendChild(lane);
      multiTrackEl.appendChild(row);
    }
  }

  function render() {
    renderMediaBin();
    renderTracks();
  }

  function handleBlade() {
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
    rollEdit(getTimeline(), "v1", clipId, delta);
    onChange();
    render();
  }

  function handleSlide(delta) {
    const clipId = getSelectedClipId();
    if (!clipId) return;
    slideEdit(getTimeline(), "v1", clipId, delta);
    onChange();
    render();
  }

  function handleTransition(seconds) {
    const clipId = getSelectedClipId();
    if (!clipId) return;
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
