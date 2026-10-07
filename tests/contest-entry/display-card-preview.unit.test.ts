import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildDisplayCardPreviewState,
  commentLineCharsCapacity,
  parseHomeroomForDisplayCard,
  wrapDisplayCardComment,
} from "../../public/apps/contest-entry/js/display-card-preview.js";

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

  it("overflow moves to next line plot by lineRights width", () => {
    const layout = {
      left: 22,
      top: 37,
      width: 74,
      fontSize: 13,
      lineHeight: 1.52,
      maxLines: 3,
      lineLefts: [22, 22],
      lineRights: [40, 96],
    };
    const cap0 = commentLineCharsCapacity(layout, 0);
    const text = "あ".repeat(cap0 + 5);
    const lines = wrapDisplayCardComment(text, 3, layout);
    assert.equal(lines.length, 2);
    assert.equal(lines[0].length, cap0);
    assert.equal(lines[1].length, 5);
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
});
