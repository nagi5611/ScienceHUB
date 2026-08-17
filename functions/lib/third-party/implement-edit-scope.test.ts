import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  extractNumberedHtmlForTask,
  resolveMaxParallelBatch,
} from "./implement-edit-scope.js";

const SAMPLE_HTML = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <style>
    body { margin: 0; }
  </style>
</head>
<body>
  <main id="app">
    <p>Hello</p>
  </main>
  <script>
    console.log("hi");
  </script>
</body>
</html>`;

describe("implement-edit-scope cost helpers", () => {
  it("defaults parallel batch to 1", () => {
    assert.equal(resolveMaxParallelBatch(), 1);
    assert.equal(resolveMaxParallelBatch({}), 1);
  });

  it("respects TP_IMPLEMENT_PARALLEL cap", () => {
    assert.equal(resolveMaxParallelBatch({ TP_IMPLEMENT_PARALLEL: "3" }), 3);
    assert.equal(resolveMaxParallelBatch({ TP_IMPLEMENT_PARALLEL: "9" }), 3);
  });

  it("extracts style snippet for styles target", () => {
    const { snippet, isPartial } = extractNumberedHtmlForTask(
      SAMPLE_HTML,
      "styles"
    );
    assert.equal(isPartial, true);
    assert.match(snippet, /L\d{3}:.*body \{ margin: 0; \}/);
    assert.doesNotMatch(snippet, /console\.log/);
  });

  it("uses full html for polish target", () => {
    const { isPartial } = extractNumberedHtmlForTask(SAMPLE_HTML, "polish");
    assert.equal(isPartial, false);
  });
});
