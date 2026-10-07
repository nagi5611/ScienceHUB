import assert from "node:assert/strict";
import { test } from "node:test";
import {
  computeParallelismFromBudget,
  estimateRgbaCanvasBytes,
  getClientMemoryBudgetBytes,
} from "../public/js/shared/client-memory-budget.js";

test("getClientMemoryBudgetBytes uses half of device memory", () => {
  const budget = getClientMemoryBudgetBytes(8);
  assert.equal(budget, 4 * 1024 ** 3);
});

test("computeParallelismFromBudget caps by memory and max concurrency", () => {
  const pageBytes = estimateRgbaCanvasBytes(2000, 3000, 2.5);
  const budget = getClientMemoryBudgetBytes(8);
  const reserved = 100 * 1024 ** 2;
  const parallel = computeParallelismFromBudget({
    budgetBytes: budget,
    reservedBytes: reserved,
    maxPageWorkingSetBytes: pageBytes,
    maxConcurrency: 64,
  });
  assert.ok(parallel >= 1);
  assert.ok(parallel <= 64);
  const available = budget - reserved;
  assert.ok(parallel * pageBytes <= available + pageBytes);
});

test("computeParallelismFromBudget returns 1 when budget is tight", () => {
  const hugePage = estimateRgbaCanvasBytes(8000, 12000, 2.5);
  const parallel = computeParallelismFromBudget({
    budgetBytes: 512 * 1024 ** 2,
    reservedBytes: 0,
    maxPageWorkingSetBytes: hugePage,
    maxConcurrency: 64,
  });
  assert.equal(parallel, 1);
});
