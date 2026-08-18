import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  resolveMaxEditPlanTokens,
  resolveMaxTaskEditRetries,
  MAX_EDIT_PLAN_TOKENS_DEFAULT,
  MAX_EDIT_PLAN_TOKENS_FULL_HTML,
} from "./implement-edit-scope.js";
import { salvageEditsFromTruncatedJson } from "./implement-edit-recovery.js";

describe("implement edit token limits", () => {
  it("defaults markup to 8192", () => {
    assert.equal(resolveMaxEditPlanTokens("markup"), MAX_EDIT_PLAN_TOKENS_DEFAULT);
    assert.equal(resolveMaxEditPlanTokens("styles"), 8192);
    assert.equal(resolveMaxEditPlanTokens("script"), 8192);
  });

  it("uses 24576 for skeleton and polish", () => {
    assert.equal(resolveMaxEditPlanTokens("skeleton"), MAX_EDIT_PLAN_TOKENS_FULL_HTML);
    assert.equal(resolveMaxEditPlanTokens("polish"), 24576);
  });

  it("increases retries for skeleton and polish", () => {
    assert.equal(resolveMaxTaskEditRetries("markup"), 2);
    assert.equal(resolveMaxTaskEditRetries("skeleton"), 3);
    assert.equal(resolveMaxTaskEditRetries("polish"), 3);
  });
});

describe("salvageEditsFromTruncatedJson", () => {
  it("parses complete JSON", () => {
    const raw = JSON.stringify({
      assistant_message: "ok",
      target_path: "index.html",
      edits: [
        {
          op: "replace_lines",
          start_line: 1,
          end_line: 1,
          content: "<!DOCTYPE html>",
        },
      ],
    });
    const salvaged = salvageEditsFromTruncatedJson(raw);
    assert.ok(salvaged?.edits?.length === 1);
  });

  it("salvages complete edit objects from truncated array", () => {
    const raw = `{"assistant_message":"partial","target_path":"index.html","edits":[{"op":"insert_after","line":5,"content":"<p>hi</p>"},{"op":"insert_after","line":6,"content":"<p>incomplete`;
    const salvaged = salvageEditsFromTruncatedJson(raw);
    assert.ok(salvaged?.edits?.length === 1);
  });
});
