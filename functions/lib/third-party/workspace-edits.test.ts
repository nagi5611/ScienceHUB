/**
 * workspace-edits ユニットテスト（node --import tsx）
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyWorkspaceEdits,
  formatNumberedLines,
  previewEditContext,
} from "./workspace-edits";

describe("formatNumberedLines", () => {
  it("prefixes lines with L001 style", () => {
    const out = formatNumberedLines("a\nbb");
    assert.match(out, /^L1: a/);
    assert.match(out, /L2: bb/);
  });
});

describe("applyWorkspaceEdits", () => {
  it("replaces a line range", () => {
    const src = "one\ntwo\nthree";
    const r = applyWorkspaceEdits(src, [
      { op: "replace_lines", start_line: 2, end_line: 2, content: "TWO" },
    ]);
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.text, "one\nTWO\nthree");
  });

  it("inserts after line", () => {
    const src = "a\nb";
    const r = applyWorkspaceEdits(src, [
      { op: "insert_after", line: 1, content: "x" },
    ]);
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.text, "a\nx\nb");
  });

  it("deletes lines", () => {
    const src = "a\nb\nc";
    const r = applyWorkspaceEdits(src, [
      { op: "delete_lines", start_line: 2, end_line: 2 },
    ]);
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.text, "a\nc");
  });

  it("applies multiple edits in descending line order", () => {
    const src = "1\n2\n3\n4";
    const r = applyWorkspaceEdits(src, [
      { op: "replace_lines", start_line: 2, end_line: 2, content: "B" },
      { op: "replace_lines", start_line: 4, end_line: 4, content: "D" },
    ]);
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.text, "1\nB\n3\nD");
  });

  it("rejects out of range", () => {
    const r = applyWorkspaceEdits("a\nb", [
      { op: "delete_lines", start_line: 1, end_line: 99 },
    ]);
    assert.equal(r.ok, false);
  });
});

describe("previewEditContext", () => {
  it("includes padded context", () => {
    const p = previewEditContext("a\nb\nc\nd\ne", 3, 3, 1);
    assert.match(p, /L2:/);
    assert.match(p, /L3:/);
  });
});
