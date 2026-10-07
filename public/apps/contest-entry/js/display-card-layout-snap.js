// public/apps/contest-entry/js/display-card-layout-snap.js

/** @typedef {import('./display-card-preview.js').DISPLAY_CARD_LAYOUT} DisplayCardLayout */

export const SNAP_THRESHOLD_PERCENT = 1.25;

/**
 * Snaps value to the nearest target within threshold (ties prefer exact match).
 * @param {number} value
 * @param {number[]} targets
 * @param {number} [threshold]
 */
export function snapToNearestPercent(value, targets, threshold = SNAP_THRESHOLD_PERCENT) {
  let best = value;
  let bestDistance = threshold + 1;
  for (const target of targets) {
    if (!Number.isFinite(target)) continue;
    const distance = Math.abs(value - target);
    if (distance <= threshold && distance < bestDistance) {
      bestDistance = distance;
      best = target;
    }
  }
  return best;
}

/**
 * @param {DisplayCardLayout | Record<string, unknown>} layout
 */
export function collectLayoutXTargets(layout) {
  const xs = [];
  const push = (v) => {
    if (typeof v === 'number' && Number.isFinite(v)) xs.push(v);
  };
  push(layout.year?.left);
  push(layout.classGroup?.left);
  push(layout.name?.left);
  push(layout.title?.left);
  push(layout.comment?.left);
  if (layout.marks) {
    for (const key of Object.keys(layout.marks)) {
      push(layout.marks[key]?.left);
    }
  }
  for (const left of layout.comment?.lineLefts ?? []) {
    push(left);
  }
  for (const right of layout.comment?.lineRights ?? []) {
    push(right);
  }
  return xs;
}

/**
 * @param {DisplayCardLayout | Record<string, unknown>} layout
 */
export function collectLayoutYTargets(layout) {
  const ys = [];
  const push = (v) => {
    if (typeof v === 'number' && Number.isFinite(v)) ys.push(v);
  };
  if (layout.marks) {
    for (const key of Object.keys(layout.marks)) {
      push(layout.marks[key]?.top);
    }
  }
  push(layout.year?.top);
  push(layout.classGroup?.top);
  push(layout.name?.top);
  push(layout.title?.top);
  push(layout.comment?.top);
  for (const top of layout.comment?.lineTops ?? []) {
    push(top);
  }
  return ys;
}

/**
 * @param {DisplayCardLayout | Record<string, unknown>} layout
 * @param {number} value
 */
export function snapLayoutX(layout, value) {
  return snapToNearestPercent(value, collectLayoutXTargets(layout));
}

/**
 * @param {DisplayCardLayout | Record<string, unknown>} layout
 * @param {number} value
 */
export function snapLayoutY(layout, value) {
  return snapToNearestPercent(value, collectLayoutYTargets(layout));
}
