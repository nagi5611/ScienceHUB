import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { withTpUsageRecording } from "./gemini-usage.js";

describe("gemini-usage helpers", () => {
  it("withTpUsageRecording skips hook when db is missing", () => {
    const options = { model: "gemini-2.5-flash-lite", prompt: "hi" };
    const out = withTpUsageRecording(null, {}, options);
    assert.equal(out, options);
    assert.equal(out.usageRecorder, undefined);
  });

  it("withTpUsageRecording adds usageRecorder when db is present", () => {
    const options = {
      model: "gemini-2.5-flash-lite",
      prompt: "hi",
      usageLabel: "lite_chat",
    };
    const out = withTpUsageRecording(
      {} as D1Database,
      { projectId: "tpproj_test", ownerUserId: "user_test" },
      options
    );
    assert.notEqual(out, options);
    assert.equal(typeof out.usageRecorder, "function");
    assert.equal(out.model, options.model);
    assert.equal(out.usageLabel, "lite_chat");
  });
});
