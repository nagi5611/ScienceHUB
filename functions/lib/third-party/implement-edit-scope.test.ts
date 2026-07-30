/**
 * implement-edit-scope ユニットテスト
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildProjectSkeleton } from "./implement-tasks";
import {
  describeImplementEditScopes,
  IMPLEMENT_EDIT_TARGET_PATH,
  validateImplementEdits,
} from "./implement-edit-scope";

describe("describeImplementEditScopes", () => {
  it("includes target path and line ranges", () => {
    const html = buildProjectSkeleton("Test");
    const text = describeImplementEditScopes(html, "script");
    assert.ok(text.includes(IMPLEMENT_EDIT_TARGET_PATH));
    assert.ok(text.includes("script"));
    assert.match(text, /L\d+–L\d+/);
  });
});

describe("validateImplementEdits", () => {
  it("rejects script content with style tags", () => {
    const html = buildProjectSkeleton("Test");
    const lines = html.split("\n");
    const scriptLine = lines.findIndex((l) => /<script\b/i.test(l)) + 1;
    const err = validateImplementEdits(
      html,
      [
        {
          op: "replace_lines",
          start_line: scriptLine,
          end_line: scriptLine,
          content: "<style>bad</style>",
        },
      ],
      "script"
    );
    assert.ok(err && /style/i.test(err));
  });

  it("rejects styles edits on line 1", () => {
    const html = buildProjectSkeleton("Test");
    const err = validateImplementEdits(
      html,
      [
        {
          op: "insert_after",
          line: 1,
          content: "body { color: red; }",
        },
      ],
      "styles"
    );
    assert.ok(err && err.includes("許可範囲"));
  });
});
