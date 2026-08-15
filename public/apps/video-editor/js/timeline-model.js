/**
 * Phase 2 — 内部タイムラインデータモデル
 */

/** @typedef {{
 *   id: string,
 *   name: string,
 *   file: File,
 *   duration: number,
 *   objectUrl: string,
 * }} MediaBinItem */

/** @typedef {{
 *   id: string,
 *   mediaId: string,
 *   sourceIn: number,
 *   sourceOut: number,
 *   timelineStart: number,
 *   transitionOut?: number,
 *   effects?: Record<string, unknown>,
 * }} TimelineClip */

/** @typedef {{
 *   id: string,
 *   type: "video" | "audio",
 *   clips: TimelineClip[],
 * }} TimelineTrack */

/** @typedef {{
 *   tracks: TimelineTrack[],
 *   mediaBin: MediaBinItem[],
 *   duration: number,
 * }} TimelineModel */

let clipSeq = 0;

export function createClipId() {
  clipSeq += 1;
  return `clip-${Date.now()}-${clipSeq}`;
}

export function createMediaId() {
  return `media-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * @param {File} file
 * @param {number} duration
 * @param {string} objectUrl
 * @returns {TimelineModel}
 */
export function createTimelineFromFile(file, duration, objectUrl) {
  const mediaId = createMediaId();
  const clipId = createClipId();
  return {
    mediaBin: [{ id: mediaId, name: file.name, file, duration, objectUrl }],
    tracks: [
      {
        id: "v1",
        type: "video",
        clips: [{ id: clipId, mediaId, sourceIn: 0, sourceOut: duration, timelineStart: 0, transitionOut: 0 }],
      },
      {
        id: "a1",
        type: "audio",
        clips: [{ id: `${clipId}-a`, mediaId, sourceIn: 0, sourceOut: duration, timelineStart: 0 }],
      },
    ],
    duration,
  };
}

/** @param {TimelineModel} timeline */
export function recomputeTimelineDuration(timeline) {
  let max = 0;
  for (const track of timeline.tracks) {
    for (const clip of track.clips) {
      const end = clip.timelineStart + (clip.sourceOut - clip.sourceIn);
      if (end > max) max = end;
    }
  }
  timeline.duration = max;
  return max;
}

/** @param {TimelineTrack} track @param {number} time */
export function findClipAtTime(track, time) {
  return (
    track.clips.find((c) => time >= c.timelineStart && time < c.timelineStart + (c.sourceOut - c.sourceIn)) ??
    null
  );
}

/** @param {TimelineModel} timeline @param {string} trackId @param {number} time */
export function bladeSplit(timeline, trackId, time) {
  const track = timeline.tracks.find((t) => t.id === trackId);
  if (!track) return false;

  const clip = findClipAtTime(track, time);
  if (!clip) return false;

  const clipEnd = clip.timelineStart + (clip.sourceOut - clip.sourceIn);
  const clipLen = clipEnd - clip.timelineStart;
  const margin = Math.min(0.05, Math.max(0.01, clipLen * 0.1));
  if (time <= clip.timelineStart + margin || time >= clipEnd - margin) return false;

  const rel = time - clip.timelineStart;
  const splitSource = clip.sourceIn + rel;

  const right = {
    id: createClipId(),
    mediaId: clip.mediaId,
    sourceIn: splitSource,
    sourceOut: clip.sourceOut,
    timelineStart: time,
    transitionOut: clip.transitionOut,
    effects: clip.effects ? { ...clip.effects } : undefined,
  };

  clip.sourceOut = splitSource;
  clip.transitionOut = 0;

  const idx = track.clips.indexOf(clip);
  track.clips.splice(idx + 1, 0, right);
  track.clips.sort((a, b) => a.timelineStart - b.timelineStart);
  recomputeTimelineDuration(timeline);
  return true;
}

/** @param {TimelineModel} timeline @param {string} trackId @param {string} clipId */
export function rippleDelete(timeline, trackId, clipId) {
  const track = timeline.tracks.find((t) => t.id === trackId);
  if (!track) return false;
  const idx = track.clips.findIndex((c) => c.id === clipId);
  if (idx < 0) return false;

  const removed = track.clips[idx];
  const removedLen = removed.sourceOut - removed.sourceIn;
  track.clips.splice(idx, 1);

  for (const clip of track.clips) {
    if (clip.timelineStart > removed.timelineStart) {
      clip.timelineStart = Math.max(0, clip.timelineStart - removedLen);
    }
  }

  recomputeTimelineDuration(timeline);
  return true;
}

/** @param {TimelineModel} timeline @param {string} trackId @param {string} leftClipId @param {number} deltaTimeline */
export function rollEdit(timeline, trackId, leftClipId, deltaTimeline) {
  const track = timeline.tracks.find((t) => t.id === trackId);
  if (!track) return false;

  const leftIdx = track.clips.findIndex((c) => c.id === leftClipId);
  if (leftIdx < 0 || leftIdx >= track.clips.length - 1) return false;

  const left = track.clips[leftIdx];
  const right = track.clips[leftIdx + 1];
  if (Math.abs(right.timelineStart - (left.timelineStart + (left.sourceOut - left.sourceIn))) > 0.01) return false;

  const leftDur = left.sourceOut - left.sourceIn;
  const rightDur = right.sourceOut - right.sourceIn;
  const newLeftDur = leftDur + deltaTimeline;
  const newRightDur = rightDur - deltaTimeline;

  if (newLeftDur < 0.1 || newRightDur < 0.1) return false;

  left.sourceOut = left.sourceIn + newLeftDur;
  right.sourceIn = right.sourceOut - newRightDur;
  recomputeTimelineDuration(timeline);
  return true;
}

/** @param {TimelineModel} timeline @param {string} trackId @param {string} clipId @param {number} deltaTimeline */
export function slideEdit(timeline, trackId, clipId, deltaTimeline) {
  const track = timeline.tracks.find((t) => t.id === trackId);
  if (!track) return false;

  const idx = track.clips.findIndex((c) => c.id === clipId);
  if (idx <= 0 || idx >= track.clips.length - 1) return false;

  const prev = track.clips[idx - 1];
  const clip = track.clips[idx];
  const next = track.clips[idx + 1];

  const prevDur = prev.sourceOut - prev.sourceIn;
  const nextDur = next.sourceOut - next.sourceIn;
  const newPrevDur = prevDur + deltaTimeline;
  const newNextDur = nextDur - deltaTimeline;

  if (newPrevDur < 0.1 || newNextDur < 0.1) return false;

  prev.sourceOut = prev.sourceIn + newPrevDur;
  clip.timelineStart += deltaTimeline;
  next.sourceIn = next.sourceOut - newNextDur;
  recomputeTimelineDuration(timeline);
  return true;
}

/** @param {TimelineModel} timeline @param {string} mediaId @param {number} timelineStart @param {number} sourceIn @param {number} sourceOut */
export function placeOnTop(timeline, mediaId, timelineStart, sourceIn, sourceOut) {
  let v2 = timeline.tracks.find((t) => t.id === "v2");
  if (!v2) {
    v2 = { id: "v2", type: "video", clips: [] };
    timeline.tracks.unshift(v2);
  }

  v2.clips.push({
    id: createClipId(),
    mediaId,
    sourceIn,
    sourceOut,
    timelineStart,
    transitionOut: 0,
  });
  v2.clips.sort((a, b) => a.timelineStart - b.timelineStart);
  recomputeTimelineDuration(timeline);
}

/** @param {TimelineModel} timeline @param {File} file @param {number} duration @param {string} objectUrl */
export function addMediaToBin(timeline, file, duration, objectUrl) {
  const id = createMediaId();
  timeline.mediaBin.push({ id, name: file.name, file, duration, objectUrl });
  return id;
}

/** @param {TimelineModel} timeline @param {string} mediaId @param {number} sourceIn @param {number} sourceOut */
export function appendClip(timeline, mediaId, sourceIn, sourceOut) {
  const vTrack = timeline.tracks.find((t) => t.id === "v1");
  const aTrack = timeline.tracks.find((t) => t.id === "a1");
  if (!vTrack || !aTrack) return;

  const start = timeline.duration;
  const vId = createClipId();

  vTrack.clips.push({ id: vId, mediaId, sourceIn, sourceOut, timelineStart: start, transitionOut: 0 });
  aTrack.clips.push({ id: `${vId}-a`, mediaId, sourceIn, sourceOut, timelineStart: start });
  recomputeTimelineDuration(timeline);
}

/** @param {TimelineModel} timeline @param {string} clipId @param {number} seconds */
export function setTransition(timeline, clipId, seconds) {
  for (const track of timeline.tracks) {
    const clip = track.clips.find((c) => c.id === clipId);
    if (clip) {
      const dur = clip.sourceOut - clip.sourceIn;
      clip.transitionOut = Math.max(0, Math.min(2, Math.min(seconds, dur * 0.45)));
      return true;
    }
  }
  return false;
}

/** @param {TimelineModel} timeline @param {{ startTime: number, endTime: number, slipOffset?: number, duration: number }} trimState */
export function syncSingleClipToTimeline(timeline, trimState) {
  const vTrack = timeline.tracks.find((t) => t.id === "v1");
  const aTrack = timeline.tracks.find((t) => t.id === "a1");
  if (!vTrack?.clips[0] || !aTrack?.clips[0]) return;

  const slip = trimState.slipOffset ?? 0;
  const sourceIn = trimState.startTime + slip;
  const sourceOut = sourceIn + (trimState.endTime - trimState.startTime);

  vTrack.clips[0].sourceIn = Math.max(0, sourceIn);
  vTrack.clips[0].sourceOut = Math.min(trimState.duration, sourceOut);
  vTrack.clips[0].timelineStart = 0;

  aTrack.clips[0].sourceIn = vTrack.clips[0].sourceIn;
  aTrack.clips[0].sourceOut = vTrack.clips[0].sourceOut;
  aTrack.clips[0].timelineStart = 0;

  recomputeTimelineDuration(timeline);
}
