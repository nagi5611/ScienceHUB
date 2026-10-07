/**
 * chunkContestStaffMessagesForCarousel のユニットテスト
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { chunkContestStaffMessagesForCarousel } from "./staff-messages";

describe("chunkContestStaffMessagesForCarousel", () => {
  it("空配列は空のチャンクを返す", () => {
    assert.deepEqual(chunkContestStaffMessagesForCarousel([]), []);
  });

  it("最大3件ずつに分割する", () => {
    const items = [1, 2, 3, 4, 5];
    assert.deepEqual(chunkContestStaffMessagesForCarousel(items), [[1, 2, 3], [4, 5]]);
  });

  it("size 引数は 1〜3 にクランプされる", () => {
    assert.deepEqual(chunkContestStaffMessagesForCarousel([1, 2, 3, 4], 10), [
      [1, 2, 3],
      [4],
    ]);
    assert.deepEqual(chunkContestStaffMessagesForCarousel([1, 2], 0), [[1], [2]]);
  });
});
