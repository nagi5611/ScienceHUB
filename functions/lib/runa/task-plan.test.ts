import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldPlanRunaTasks } from "./task-plan.js";

describe("shouldPlanRunaTasks", () => {
  it("skips short simple messages", () => {
    assert.equal(shouldPlanRunaTasks("こんにちは"), false);
    assert.equal(shouldPlanRunaTasks("このフォルダの一覧"), false);
  });

  it("plans multi-step requests", () => {
    assert.equal(
      shouldPlanRunaTasks(
        "まず u/test のファイル一覧を取得し、次に古い PDF を検索して、最後にまとめて報告してください"
      ),
      true
    );
  });

  it("skips image edit context", () => {
    assert.equal(
      shouldPlanRunaTasks("背景を夕焼けにして人物はそのまま", [], {
        editIntent: true,
        editImagePath: "u/test/a.png",
      }),
      false
    );
  });
});
