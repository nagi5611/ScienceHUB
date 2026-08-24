import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  computeFdsProgressPct,
  FDS_FORMAT_REVIEW_T_END_MISSING_ISSUE,
  parseFdsTEndSeconds,
  runFdsFormatReview,
} from "./fds-format-review.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sampleFdsPath = join(__dirname, "../../../infra/fds-test/sample/simple_test.fds");

describe("fds-format-review", () => {
  it("parses T_END from sample smoke test", () => {
    const text = readFileSync(sampleFdsPath, "utf8");
    assert.equal(parseFdsTEndSeconds(text), 1.0);
    const review = runFdsFormatReview(text);
    assert.equal(review.passed, true);
    assert.equal(review.tEndSeconds, 1.0);
    assert.deepEqual(review.issues, []);
  });

  it("fails when T_END is missing", () => {
    const text = "&HEAD CHID='x' /\n&MESH IJK=2,2,2, XB=0,1,0,1,0,1 /\n&TAIL /";
    const review = runFdsFormatReview(text);
    assert.equal(review.passed, false);
    assert.equal(review.tEndSeconds, null);
    assert.deepEqual(review.issues, [FDS_FORMAT_REVIEW_T_END_MISSING_ISSUE]);
  });

  it("uses the last T_END when multiple blocks exist", () => {
    const text = "&TIME T_END=10.0 /\n&TIME T_END=250.5 /";
    assert.equal(parseFdsTEndSeconds(text), 250.5);
  });

  it("computes capped progress percent", () => {
    assert.equal(computeFdsProgressPct(0.35813, 1.0), 35.8);
    assert.equal(computeFdsProgressPct(1.0, 1.0), 95);
    assert.equal(computeFdsProgressPct(2.0, 1.0), 95);
  });
});
