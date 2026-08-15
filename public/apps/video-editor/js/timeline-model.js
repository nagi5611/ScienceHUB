/**
 * Phase 2/3 — 内部タイムラインデータモデル
 */

const MIN_CLIP_LEN = 0.1;

/** @typedef {{
 *   id: string,
 *   name: string,
 *   file: File,
 *   duration: number,
 *   objectUrl: string,
 *   kind: "video" | "audio",
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

/** @param {TimelineClip} clip */
export function clipTimelineEnd(clip) {
  return clip.timelineStart + (clip.sourceOut - clip.sourceIn);
}

/** @param {TimelineClip} clip */
export function clipDuration(clip) {
  return clip.sourceOut - clip.sourceIn;
}

/** @param {TimelineTrack} track @param {number} time */
export function findClipAtTime(track, time) {
  return findClipAtTimelineTime(track, time);
}

/** @param {TimelineTrack} track @param {number} time */
export function findClipAtTimelineTime(track, time) {
  const clip =
    track.clips.find((c) => time >= c.timelineStart && time < clipTimelineEnd(c)) ?? null;
  if (clip) return clip;
  if (track.clips.length === 0) return null;
  const last = track.clips[track.clips.length - 1];
  if (Math.abs(time - clipTimelineEnd(last)) < 0.001) return last;
  return null;
}

/** @param {TimelineTrack} track @param {string} clipId */
export function getNextClip(track, clipId) {
  const idx = track.clips.findIndex((c) => c.id === clipId);
  if (idx < 0 || idx >= track.clips.length - 1) return null;
  return track.clips[idx + 1];
}

/** @param {TimelineModel} timeline @param {string} mediaId */
export function getMediaDuration(timeline, mediaId) {
  const media = timeline.mediaBin.find((m) => m.id === mediaId);
  return media?.duration ?? 0;
}

/** @param {string} videoClipId */
export function pairedAudioClipId(videoClipId) {
  return `${videoClipId}-a`;
}

/** @param {TimelineModel} timeline @param {string} trackId @param {string} clipId */
function getTrackClip(timeline, trackId, clipId) {
  const track = timeline.tracks.find((t) => t.id === trackId);
  if (!track) return null;
  return track.clips.find((c) => c.id === clipId) ?? null;
}

/** @param {TimelineTrack} track @param {string} clipId @param {number} newStart @param {number} newEnd */
function overlapsOther(track, clipId, newStart, newEnd) {
  for (const other of track.clips) {
    if (other.id === clipId) continue;
    const oStart = other.timelineStart;
    const oEnd = clipTimelineEnd(other);
    if (newStart < oEnd - 0.001 && newEnd > oStart + 0.001) return true;
  }
  return false;
}

/** @typedef {{
 *   brightness?: number,
 *   contrast?: number,
 *   saturation?: number,
 *   pip?: { x: number, y: number, scale: number, opacity?: number },
 * }} ClipEffects */

export const DEFAULT_PIP = { x: 0.62, y: 0.05, scale: 0.35, opacity: 1 };

/** @param {TimelineClip} clip */
export function getClipColorEffects(clip) {
  const fx = /** @type {ClipEffects | undefined} */ (clip.effects);
  return {
    brightness: fx?.brightness ?? 0,
    contrast: fx?.contrast ?? 0,
    saturation: fx?.saturation ?? 0,
  };
}

/** @param {TimelineClip} clip */
export function getClipPipEffects(clip) {
  const fx = /** @type {ClipEffects | undefined} */ (clip.effects);
  return { ...DEFAULT_PIP, ...fx?.pip };
}

/** @param {TimelineModel} timeline @param {string} clipId @param {Partial<ClipEffects>} partial */
export function setClipEffects(timeline, clipId, partial) {
  for (const track of timeline.tracks) {
    const clip = track.clips.find((c) => c.id === clipId);
    if (!clip) continue;
    const prev = /** @type {ClipEffects} */ (clip.effects ?? {});
    clip.effects = { ...prev, ...partial };
    if (partial.pip) {
      clip.effects.pip = { ...DEFAULT_PIP, ...prev.pip, ...partial.pip };
    }
    return true;
  }
  return false;
}

/** @param {TimelineModel} timeline */
export function hasV2Clips(timeline) {
  const v2 = timeline.tracks.find((t) => t.id === "v2");
  return (v2?.clips.length ?? 0) > 0;
}

/** @param {TimelineModel} timeline */
export function hasColorEffects(timeline) {
  for (const track of timeline.tracks) {
    for (const clip of track.clips) {
      const fx = getClipColorEffects(clip);
      if (fx.brightness !== 0 || fx.contrast !== 0 || fx.saturation !== 0) return true;
    }
  }
  return false;
}

/** @param {TimelineTrack} vTrack @param {number} time */
export function getTransitionState(vTrack, time) {
  for (const clip of vTrack.clips) {
    const trans = clip.transitionOut ?? 0;
    if (trans <= 0) continue;
    const clipEnd = clipTimelineEnd(clip);
    const next = getNextClip(vTrack, clip.id);
    if (!next || Math.abs(next.timelineStart - clipEnd) > 0.05) continue;
    const transStart = clipEnd - trans;
    if (time >= transStart - 0.001 && time <= clipEnd + 0.001) {
      const progress = clamp01((time - transStart) / trans);
      return { from: clip, to: next, progress, transStart, clipEnd };
    }
  }
  return null;
}

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

/** @param {TimelineModel} timeline */
export function ensureV2Track(timeline) {
  let v2 = timeline.tracks.find((t) => t.id === "v2");
  if (!v2) {
    v2 = { id: "v2", type: "video", clips: [] };
    timeline.tracks.unshift(v2);
  }
  return v2;
}

/** @param {TimelineModel} timeline */
export function ensureA2Track(timeline) {
  let a2 = timeline.tracks.find((t) => t.id === "a2");
  if (!a2) {
    a2 = { id: "a2", type: "audio", clips: [] };
    timeline.tracks.push(a2);
  }
  return a2;
}

/** @returns {TimelineModel} */
export function createEmptyTimeline() {
  return {
    mediaBin: [],
    tracks: [
      { id: "v2", type: "video", clips: [] },
      { id: "v1", type: "video", clips: [] },
      { id: "a1", type: "audio", clips: [] },
      { id: "a2", type: "audio", clips: [] },
    ],
    duration: 0,
  };
}

/** @param {TimelineModel} timeline */
export function hasVideoClips(timeline) {
  const vTrack = timeline.tracks.find((t) => t.id === "v1");
  return (vTrack?.clips.length ?? 0) > 0;
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
    mediaBin: [{ id: mediaId, name: file.name, file, duration, objectUrl, kind: "video" }],
    tracks: [
      { id: "v2", type: "video", clips: [] },
      {
        id: "v1",
        type: "video",
        clips: [{ id: clipId, mediaId, sourceIn: 0, sourceOut: duration, timelineStart: 0, transitionOut: 0 }],
      },
      {
        id: "a1",
        type: "audio",
        clips: [{ id: pairedAudioClipId(clipId), mediaId, sourceIn: 0, sourceOut: duration, timelineStart: 0 }],
      },
      { id: "a2", type: "audio", clips: [] },
    ],
    duration,
  };
}

/** @param {TimelineModel} timeline */
export function recomputeTimelineDuration(timeline) {
  let max = 0;
  for (const track of timeline.tracks) {
    for (const clip of track.clips) {
      const end = clipTimelineEnd(clip);
      if (end > max) max = end;
    }
  }
  timeline.duration = max;
  return max;
}

/** @param {TimelineModel} timeline @param {string} trackId @param {number} time */
export function bladeSplit(timeline, trackId, time) {
  const track = timeline.tracks.find((t) => t.id === trackId);
  if (!track) return false;

  const clip = findClipAtTimelineTime(track, time);
  if (!clip) return false;

  const clipEnd = clipTimelineEnd(clip);
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
  const removedLen = clipDuration(removed);
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
  if (Math.abs(right.timelineStart - clipTimelineEnd(left)) > 0.01) return false;

  const leftDur = clipDuration(left);
  const rightDur = clipDuration(right);
  const newLeftDur = leftDur + deltaTimeline;
  const newRightDur = rightDur - deltaTimeline;

  if (newLeftDur < MIN_CLIP_LEN || newRightDur < MIN_CLIP_LEN) return false;

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

  const prevDur = clipDuration(prev);
  const nextDur = clipDuration(next);
  const newPrevDur = prevDur + deltaTimeline;
  const newNextDur = nextDur - deltaTimeline;

  if (newPrevDur < MIN_CLIP_LEN || newNextDur < MIN_CLIP_LEN) return false;

  prev.sourceOut = prev.sourceIn + newPrevDur;
  clip.timelineStart += deltaTimeline;
  next.sourceIn = next.sourceOut - newNextDur;
  recomputeTimelineDuration(timeline);
  return true;
}

/** @param {TimelineModel} timeline @param {string} trackId @param {string} clipId @param {number} newTimelineStart */
export function moveClip(timeline, trackId, clipId, newTimelineStart) {
  const clip = getTrackClip(timeline, trackId, clipId);
  if (!clip) return false;

  const dur = clipDuration(clip);
  const maxStart = Math.max(0, timeline.duration - dur);
  const nextStart = Math.max(0, Math.min(newTimelineStart, maxStart));
  const nextEnd = nextStart + dur;

  if (overlapsOther(timeline.tracks.find((t) => t.id === trackId), clipId, nextStart, nextEnd)) {
    return false;
  }

  clip.timelineStart = nextStart;

  if (trackId === "v1") {
    const aClip = getTrackClip(timeline, "a1", pairedAudioClipId(clipId));
    if (aClip) aClip.timelineStart = nextStart;
  }

  recomputeTimelineDuration(timeline);
  return true;
}

/** @param {TimelineModel} timeline @param {string} trackId @param {string} clipId @param {number} deltaSource */
export function trimClipStart(timeline, trackId, clipId, deltaSource) {
  const clip = getTrackClip(timeline, trackId, clipId);
  if (!clip) return false;

  const mediaDur = getMediaDuration(timeline, clip.mediaId);
  const newSourceIn = Math.max(0, Math.min(clip.sourceOut - MIN_CLIP_LEN, clip.sourceIn + deltaSource));
  const actualDelta = newSourceIn - clip.sourceIn;
  if (Math.abs(actualDelta) < 0.0001) return false;

  const newDur = clip.sourceOut - newSourceIn;
  const newStart = clip.timelineStart + actualDelta;
  const newEnd = newStart + newDur;

  const track = timeline.tracks.find((t) => t.id === trackId);
  if (!track || overlapsOther(track, clipId, newStart, newEnd)) return false;

  clip.sourceIn = newSourceIn;
  clip.timelineStart = newStart;

  if (trackId === "v1") {
    const aClip = getTrackClip(timeline, "a1", pairedAudioClipId(clipId));
    if (aClip) {
      aClip.sourceIn = newSourceIn;
      aClip.timelineStart = newStart;
    }
  }

  recomputeTimelineDuration(timeline);
  return true;
}

/** @param {TimelineModel} timeline @param {string} trackId @param {string} clipId @param {number} deltaSource */
export function trimClipEnd(timeline, trackId, clipId, deltaSource) {
  const clip = getTrackClip(timeline, trackId, clipId);
  if (!clip) return false;

  const mediaDur = getMediaDuration(timeline, clip.mediaId);
  const target = clip.sourceOut + deltaSource;
  const maxOut = mediaDur > 0 ? mediaDur : target;
  const newSourceOut = Math.max(clip.sourceIn + MIN_CLIP_LEN, Math.min(maxOut, target));
  if (Math.abs(newSourceOut - clip.sourceOut) < 0.0001) return false;

  const prevSourceOut = clip.sourceOut;
  clip.sourceOut = newSourceOut;

  const newEnd = clip.timelineStart + clipDuration(clip);
  const track = timeline.tracks.find((t) => t.id === trackId);
  if (!track || overlapsOther(track, clipId, clip.timelineStart, newEnd)) {
    clip.sourceOut = prevSourceOut;
    return false;
  }

  if (trackId === "v1") {
    const aClip = getTrackClip(timeline, "a1", pairedAudioClipId(clipId));
    if (aClip) aClip.sourceOut = clip.sourceOut;
  }

  recomputeTimelineDuration(timeline);
  return true;
}

/** @param {TimelineModel} timeline @param {string} mediaId @param {number} timelineStart @param {number} sourceIn @param {number} sourceOut */
export function placeOnTop(timeline, mediaId, timelineStart, sourceIn, sourceOut) {
  const v2 = ensureV2Track(timeline);
  const start = Math.max(0, timelineStart);
  const clipId = createClipId();
  v2.clips.push({
    id: clipId,
    mediaId,
    sourceIn,
    sourceOut,
    timelineStart: start,
    transitionOut: 0,
    effects: { pip: { ...DEFAULT_PIP } },
  });
  v2.clips.sort((a, b) => a.timelineStart - b.timelineStart);
  recomputeTimelineDuration(timeline);
  return clipId;
}

/** @param {TimelineModel} timeline @param {File} file @param {number} duration @param {string} objectUrl @param {"video"|"audio"} [kind] */
export function addMediaToBin(timeline, file, duration, objectUrl, kind = "video") {
  const id = createMediaId();
  timeline.mediaBin.push({ id, name: file.name, file, duration, objectUrl, kind });
  return id;
}

/** @param {TimelineModel} timeline @param {File} file @param {number} duration @param {string} objectUrl */
export function addAudioMedia(timeline, file, duration, objectUrl) {
  return addMediaToBin(timeline, file, duration, objectUrl, "audio");
}

/** @param {TimelineModel} timeline @param {string} mediaId @param {number} sourceIn @param {number} sourceOut */
export function appendClip(timeline, mediaId, sourceIn, sourceOut) {
  placeVideoClip(timeline, mediaId, timeline.duration, sourceIn, sourceOut);
}

/** @param {TimelineModel} timeline @param {string} mediaId @param {number} timelineStart @param {number} sourceIn @param {number} sourceOut */
export function placeVideoClip(timeline, mediaId, timelineStart, sourceIn, sourceOut) {
  const vTrack = timeline.tracks.find((t) => t.id === "v1");
  const aTrack = timeline.tracks.find((t) => t.id === "a1");
  if (!vTrack || !aTrack) return null;

  const start = Math.max(0, timelineStart);
  const vId = createClipId();

  vTrack.clips.push({ id: vId, mediaId, sourceIn, sourceOut, timelineStart: start, transitionOut: 0 });
  aTrack.clips.push({
    id: pairedAudioClipId(vId),
    mediaId,
    sourceIn,
    sourceOut,
    timelineStart: start,
    transitionOut: 0,
  });
  vTrack.clips.sort((a, b) => a.timelineStart - b.timelineStart);
  aTrack.clips.sort((a, b) => a.timelineStart - b.timelineStart);
  recomputeTimelineDuration(timeline);
  return vId;
}

/** @param {TimelineModel} timeline @param {string} mediaId @param {number} timelineStart @param {number} sourceIn @param {number} sourceOut */
export function appendBgmClip(timeline, mediaId, timelineStart, sourceIn, sourceOut) {
  const a2 = ensureA2Track(timeline);
  const clipId = createClipId();
  a2.clips.push({
    id: clipId,
    mediaId,
    sourceIn,
    sourceOut,
    timelineStart,
    transitionOut: 0,
  });
  a2.clips.sort((a, b) => a.timelineStart - b.timelineStart);
  recomputeTimelineDuration(timeline);
  return clipId;
}

/** @param {TimelineModel} timeline @param {string} clipId @param {number} seconds */
export function setTransition(timeline, clipId, seconds) {
  for (const track of timeline.tracks) {
    const clip = track.clips.find((c) => c.id === clipId);
    if (clip) {
      const dur = clipDuration(clip);
      const val = Math.max(0, Math.min(2, Math.min(seconds, dur * 0.45)));
      clip.transitionOut = val;
      if (track.id === "v1") {
        const aTrack = timeline.tracks.find((t) => t.id === "a1");
        const aClip = aTrack?.clips.find((c) => c.id === pairedAudioClipId(clipId));
        if (aClip) aClip.transitionOut = val;
      }
      return true;
    }
  }
  return false;
}

/** @param {TimelineModel} timeline */
export function hasTransitions(timeline) {
  const vTrack = timeline.tracks.find((t) => t.id === "v1");
  if (!vTrack) return false;
  return vTrack.clips.some((c) => (c.transitionOut ?? 0) > 0);
}

/** @param {TimelineModel} timeline */
export function isMultiClipTimeline(timeline) {
  const vTrack = timeline.tracks.find((t) => t.id === "v1");
  return (vTrack?.clips.length ?? 0) > 1;
}

/** @param {TimelineModel} timeline @param {{ startTime: number, endTime: number, slipOffset?: number, duration: number }} trimState */
export function syncSingleClipToTimeline(timeline, trimState) {
  const vTrack = timeline.tracks.find((t) => t.id === "v1");
  const aTrack = timeline.tracks.find((t) => t.id === "a1");
  if (!vTrack?.clips[0] || !aTrack?.clips[0] || vTrack.clips.length > 1) return;

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

/** @param {TimelineModel} timeline */
export function cloneTimelineStructure(timeline) {
  return {
    tracks: timeline.tracks.map((track) => ({
      id: track.id,
      type: track.type,
      clips: track.clips.map((clip) => ({
        id: clip.id,
        mediaId: clip.mediaId,
        sourceIn: clip.sourceIn,
        sourceOut: clip.sourceOut,
        timelineStart: clip.timelineStart,
        transitionOut: clip.transitionOut ?? 0,
        effects: clip.effects ? { ...clip.effects } : undefined,
      })),
    })),
    mediaBin: timeline.mediaBin.map((m) => ({ ...m })),
    duration: timeline.duration,
  };
}

/** @param {TimelineModel} timeline @param {ReturnType<typeof cloneTimelineStructure>} snapshot */
export function applyTimelineStructure(timeline, snapshot) {
  timeline.tracks = snapshot.tracks.map((track) => ({
    id: track.id,
    type: track.type,
    clips: track.clips.map((clip) => ({ ...clip })),
  }));
  timeline.mediaBin = snapshot.mediaBin;
  timeline.duration = snapshot.duration;
}
