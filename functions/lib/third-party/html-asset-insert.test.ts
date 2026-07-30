import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildProjectSkeleton,
  isScienceHubPlaceholderHtml,
  normalizeImplementBaseHtml,
} from "./implement-tasks";
import { EMPTY_PLACEHOLDER_HTML } from "./stub-chat";

describe("normalizeImplementBaseHtml", () => {
  it("replaces ScienceHUB placeholder with skeleton", () => {
    const out = normalizeImplementBaseHtml(EMPTY_PLACEHOLDER_HTML, "OX");
    assert.ok(isScienceHubPlaceholderHtml(EMPTY_PLACEHOLDER_HTML));
    assert.ok(out.includes("<style>"));
    assert.ok(out.includes("<script>"));
    assert.ok(out.includes('id="app"'));
    assert.ok(!out.includes("左のチャットで"));
  });

  it("preserves body markup inside main when upgrading shell", () => {
    const broken = `<!DOCTYPE html><html><head><title>x</title></head><body><div id="board"></div></body></html>`;
    const out = normalizeImplementBaseHtml(broken, "OX");
    assert.ok(out.includes('<div id="board">'));
    assert.ok(out.includes("<style>"));
  });
});

describe("buildProjectSkeleton", () => {
  it("includes empty script tag for later merges", () => {
    const html = buildProjectSkeleton("Test");
    assert.match(html, /<script>\s*<\/script>/);
  });
});
