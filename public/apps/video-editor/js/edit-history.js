/**
 * Undo / Redo — 編集状態スナップショット
 */

import { applyTimelineStructure, cloneTimelineStructure } from "./timeline-model.js";

const MAX_HISTORY = 50;

/**
 * @typedef {Object} EditorSnapshot
 * @property {ReturnType<typeof cloneTimelineStructure>} timeline
 * @property {number} startTime
 * @property {number} endTime
 * @property {number} slipOffset
 * @property {number} rotation
 * @property {boolean} flipH
 * @property {boolean} flipV
 * @property {number} volume
 * @property {number} speed
 * @property {number} bgmVolume
 * @property {number} fadeIn
 * @property {number} fadeOut
 * @property {boolean} cropEnabled
 * @property {{ x: number, y: number, w: number, h: number }} crop
 * @property {import("./text-tool.js").TextItem[]} texts
 * @property {string | null} activeTextId
 * @property {string | null} selectedClipId
 * @property {number} timelinePlayhead
 * @property {boolean} inverse
 */

export function createEditHistory() {
  /** @type {EditorSnapshot[]} */
  const undoStack = [];
  /** @type {EditorSnapshot[]} */
  const redoStack = [];

  /**
   * @param {import("./timeline-model.js").TimelineModel | null} timeline
   * @param {Record<string, unknown>} stateSlice
   * @returns {EditorSnapshot | null}
   */
  function capture(timeline, stateSlice) {
    if (!timeline) return null;
    return {
      timeline: cloneTimelineStructure(timeline),
      startTime: /** @type {number} */ (stateSlice.startTime),
      endTime: /** @type {number} */ (stateSlice.endTime),
      slipOffset: /** @type {number} */ (stateSlice.slipOffset ?? 0),
      rotation: /** @type {number} */ (stateSlice.rotation ?? 0),
      flipH: /** @type {boolean} */ (stateSlice.flipH ?? false),
      flipV: /** @type {boolean} */ (stateSlice.flipV ?? false),
      volume: /** @type {number} */ (stateSlice.volume ?? 100),
      speed: /** @type {number} */ (stateSlice.speed ?? 100),
      bgmVolume: /** @type {number} */ (stateSlice.bgmVolume ?? 80),
      fadeIn: /** @type {number} */ (stateSlice.fadeIn ?? 0),
      fadeOut: /** @type {number} */ (stateSlice.fadeOut ?? 0),
      cropEnabled: /** @type {boolean} */ (stateSlice.cropEnabled ?? false),
      crop: { ...(/** @type {{ x: number, y: number, w: number, h: number }} */ (stateSlice.crop)) },
      texts: (/** @type {import("./text-tool.js").TextItem[]} */ (stateSlice.texts)).map((t) => ({ ...t })),
      activeTextId: /** @type {string | null} */ (stateSlice.activeTextId ?? null),
      selectedClipId: /** @type {string | null} */ (stateSlice.selectedClipId ?? null),
      timelinePlayhead: /** @type {number} */ (stateSlice.timelinePlayhead ?? 0),
      inverse: /** @type {boolean} */ (stateSlice.inverse ?? false),
    };
  }

  /**
   * @param {import("./timeline-model.js").TimelineModel | null} timeline
   * @param {Record<string, unknown>} stateSlice
   */
  function push(timeline, stateSlice) {
    const snap = capture(timeline, stateSlice);
    if (!snap) return;
    undoStack.push(snap);
    if (undoStack.length > MAX_HISTORY) undoStack.shift();
    redoStack.length = 0;
  }

  /**
   * @param {import("./timeline-model.js").TimelineModel} timeline
   * @param {EditorSnapshot} snap
   * @param {Record<string, unknown>} stateObj
   */
  function applySnapshot(timeline, snap, stateObj) {
    applyTimelineStructure(timeline, snap.timeline);
    Object.assign(stateObj, {
      startTime: snap.startTime,
      endTime: snap.endTime,
      slipOffset: snap.slipOffset,
      rotation: snap.rotation,
      flipH: snap.flipH,
      flipV: snap.flipV,
      volume: snap.volume,
      speed: snap.speed,
      bgmVolume: snap.bgmVolume,
      fadeIn: snap.fadeIn,
      fadeOut: snap.fadeOut,
      cropEnabled: snap.cropEnabled,
      crop: { ...snap.crop },
      texts: snap.texts.map((t) => ({ ...t })),
      activeTextId: snap.activeTextId,
      selectedClipId: snap.selectedClipId,
      timelinePlayhead: snap.timelinePlayhead,
      inverse: snap.inverse,
    });
  }

  /**
   * @param {import("./timeline-model.js").TimelineModel | null} timeline
   * @param {Record<string, unknown>} stateSlice
   * @returns {EditorSnapshot | null}
   */
  function undo(timeline, stateSlice) {
    if (!timeline || undoStack.length === 0) return null;
    const current = capture(timeline, stateSlice);
    if (current) redoStack.push(current);
    const prev = undoStack.pop();
    if (!prev) return null;
    applySnapshot(timeline, prev, stateSlice);
    return prev;
  }

  /**
   * @param {import("./timeline-model.js").TimelineModel | null} timeline
   * @param {Record<string, unknown>} stateSlice
   * @returns {EditorSnapshot | null}
   */
  function redo(timeline, stateSlice) {
    if (!timeline || redoStack.length === 0) return null;
    const current = capture(timeline, stateSlice);
    if (current) undoStack.push(current);
    const next = redoStack.pop();
    if (!next) return null;
    applySnapshot(timeline, next, stateSlice);
    return next;
  }

  function clear() {
    undoStack.length = 0;
    redoStack.length = 0;
  }

  function canUndo() {
    return undoStack.length > 0;
  }

  function canRedo() {
    return redoStack.length > 0;
  }

  return { push, undo, redo, clear, canUndo, canRedo, capture };
}
