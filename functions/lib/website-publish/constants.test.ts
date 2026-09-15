import assert from "node:assert/strict";
import { test } from "node:test";
import { MAX_SITES_PER_USER } from "./constants";

test("MAX_SITES_PER_USER is 100", () => {
  assert.equal(MAX_SITES_PER_USER, 100);
});
