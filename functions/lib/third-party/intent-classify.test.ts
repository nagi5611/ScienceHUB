import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { classifyIntentByRules } from "./intent-classify.js";

describe("intent-classify rules", () => {
  it("detects maintain keywords", () => {
    assert.equal(
      classifyIntentByRules("ボタンが動かない", "draft_ready"),
      "maintain"
    );
  });

  it("detects implement_start", () => {
    assert.equal(
      classifyIntentByRules("実装開始", "draft_ready"),
      "implement_start"
    );
  });

  it("detects gate_build", () => {
    assert.equal(
      classifyIntentByRules("実装に進む", "draft_ready"),
      "gate_build"
    );
  });

  it("always maintain in app_maintain phase", () => {
    assert.equal(
      classifyIntentByRules("hello", "app_maintain"),
      "maintain"
    );
  });
});
