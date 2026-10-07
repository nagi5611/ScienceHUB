import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildDisplayCardPreviewState,
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

  it("wrapDisplayCardComment respects max lines", () => {
    const long =
      "テストコメント。造形にこだわって作りました。細部まで丁寧に仕上げています。ぜひご覧ください。";
    const lines = wrapDisplayCardComment(long, 6);
    assert.ok(lines.length >= 1 && lines.length <= 6);
    assert.ok(lines.join("").includes("テストコメント"));
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
