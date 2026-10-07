import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  collectLayoutXTargets,
  snapLayoutX,
  snapToNearestPercent,
} from "../../public/apps/contest-entry/js/display-card-layout-snap.js";
import { DEFAULT_DISPLAY_CARD_LAYOUT } from "../../functions/lib/contest/display-card-layout.ts";

describe("display-card-layout-snap", () => {
  it("snaps within threshold", () => {
    assert.equal(snapToNearestPercent(22.3, [22, 50], 1.25), 22);
    assert.equal(snapToNearestPercent(23.5, [22, 50], 1.25), 23.5);
  });

  it("collects X targets including comment line lefts", () => {
    const layout = {
      ...DEFAULT_DISPLAY_CARD_LAYOUT,
      comment: {
        ...DEFAULT_DISPLAY_CARD_LAYOUT.comment,
        lineLefts: [24, 30],
      },
    };
    const xs = collectLayoutXTargets(layout);
    assert.ok(xs.includes(24));
    assert.ok(xs.includes(30));
    assert.ok(xs.includes(layout.year.left));
  });

  it("snapLayoutX aligns comment line to title column", () => {
    const layout = structuredClone(DEFAULT_DISPLAY_CARD_LAYOUT);
    layout.title.left = 22;
    const snapped = snapLayoutX(layout, 22.8);
    assert.equal(snapped, 22);
  });
});
