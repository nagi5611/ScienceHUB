import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildDisplayCardPreviewState,
  commentLineCapacityUnits,
  displayCardTextWidthUnits,
  getCommentLinePlotCount,
  parseHomeroomForDisplayCard,
  wrapDisplayCardComment,
} from "../../public/apps/contest-entry/js/display-card-preview.js";

const sampleLayout = {
  left: 22,
  top: 37,
  width: 74,
  fontSize: 13,
  lineHeight: 1.52,
  maxLines: 3,
  lineLefts: [22, 22],
  lineRights: [40, 96],
};

describe("display-card-preview", () => {
  it("parseHomeroomForDisplayCard: 101 → 1年1組", () => {
    assert.deepEqual(parseHomeroomForDisplayCard("full_time", "101"), {
      year: "1",
      classGroup: "1",
    });
  });

  it("parseHomeroomForDisplayCard: 定時制 203 → 2年3組", () => {
    assert.deepEqual(parseHomeroomForDisplayCard("part_time", "203"), {
      year: "2",
      classGroup: "3",
    });
  });

  it("wrapDisplayCardComment respects max lines", () => {
    const long =
      "テストコメント。造形にこだわって作りました。細部まで丁寧に仕上げています。ぜひご覧ください。";
    const lines = wrapDisplayCardComment(long, 6);
    assert.ok(lines.length >= 1 && lines.length <= 6);
    assert.ok(lines.join("").includes("テストコメント"));
  });

  it("overflow moves to next line plot by lineRights width (CJK)", () => {
    const capUnits = commentLineCapacityUnits(sampleLayout, 0);
    const firstLineChars = Math.floor(capUnits);
    const text = "あ".repeat(firstLineChars + 5);
    const lines = wrapDisplayCardComment(text, 3, sampleLayout);
    assert.equal(lines.length, 2);
    assert.equal(lines[0].length, firstLineChars);
    assert.equal(lines[1].length, 5);
  });

  it("ASCII uses half width units so line fills before early wrap", () => {
    const capUnits = commentLineCapacityUnits(sampleLayout, 0);
    const fitAscii = "a".repeat(Math.floor(capUnits / 0.5));
    assert.ok(displayCardTextWidthUnits(fitAscii) <= capUnits + 0.01);
    const overflow = "bbb";
    const lines = wrapDisplayCardComment(fitAscii + overflow, 2, sampleLayout);
    assert.equal(lines[0], fitAscii);
    assert.equal(lines[1], overflow);
  });

  it("uses fifth plot instead of ellipsis on line 4 when maxLines is 5", () => {
    const layout = {
      ...sampleLayout,
      maxLines: 5,
      lineLefts: [22, 22, 22, 22, 22],
      lineRights: [50, 50, 50, 50, 50],
    };
    const long = "a".repeat(400);
    const fourPlots = wrapDisplayCardComment(long, 4, layout);
    assert.equal(fourPlots.length, 4);
    assert.ok(fourPlots[3].includes("…"));

    const fivePlots = wrapDisplayCardComment(long, 5, layout);
    assert.equal(fivePlots.length, 5);
    assert.ok(!fivePlots[3].includes("…"));
    assert.ok(fivePlots[4].length > 0);
  });

  it("buildDisplayCardPreviewState maps form fields", () => {
    const state = buildDisplayCardPreviewState({
      scheduleType: "full_time",
      homeroom: "101",
      studentName: "山田太郎",
      title: "テストタイトル",
      impressions: "テストコメント。サンプル文です。",
    });
    assert.equal(state.year, "1");
    assert.equal(state.classGroup, "1");
    assert.equal(state.studentName, "山田太郎");
    assert.equal(state.title, "テストタイトル");
    assert.ok(state.commentLines[0]?.includes("テストコメント"));
  });

  it("buildDisplayCardPreviewState uses getCommentLinePlotCount for splitting", () => {
    const layout = {
      ...sampleLayout,
      maxLines: 5,
      lineLefts: [22, 22, 22, 22, 22],
      lineRights: [50, 50, 50, 50, 50],
    };
    const state = buildDisplayCardPreviewState(
      {
        scheduleType: "full_time",
        homeroom: "101",
        studentName: "山田",
        title: "t",
        impressions: "a".repeat(400),
      },
      layout
    );
    assert.ok(state.commentLines.length >= 5);
    assert.ok(!state.commentLines[3].includes("…"));
  });
});
