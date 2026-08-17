import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  hasPendingTasks,
  nextParallelBatch,
} from "./implement-parallel.js";
import type { ImplementationTasksFile } from "./schemas.js";

describe("implement-parallel", () => {
  it("respects depends_on before scheduling", () => {
    const file: ImplementationTasksFile = {
      version: 1,
      current_task_index: 0,
      tasks: [
        {
          id: "t1",
          title: "styles",
          depends_on: [],
          target: "styles",
          acceptance_hint: "a",
          status: "pending",
        },
        {
          id: "t2",
          title: "script",
          depends_on: ["t1"],
          target: "script",
          acceptance_hint: "b",
          status: "pending",
        },
      ],
    };
    const batch = nextParallelBatch(file, 3);
    assert.ok(batch);
    assert.equal(batch.length, 1);
    assert.equal(batch[0].id, "t1");
  });

  it("groups markup and styles when both ready", () => {
    const file: ImplementationTasksFile = {
      version: 1,
      current_task_index: 0,
      tasks: [
        {
          id: "m",
          title: "markup",
          depends_on: [],
          target: "markup",
          acceptance_hint: "a",
          status: "pending",
        },
        {
          id: "s",
          title: "styles",
          depends_on: [],
          target: "styles",
          acceptance_hint: "b",
          status: "pending",
        },
      ],
    };
    const batch = nextParallelBatch(file, 3);
    assert.ok(batch);
    assert.equal(batch.length, 2);
  });

  it("hasPendingTasks detects pending work", () => {
    const file: ImplementationTasksFile = {
      version: 1,
      current_task_index: 0,
      tasks: [
        {
          id: "t1",
          title: "done",
          depends_on: [],
          target: "markup",
          acceptance_hint: "a",
          status: "done",
        },
        {
          id: "t2",
          title: "pending",
          depends_on: [],
          target: "script",
          acceptance_hint: "b",
          status: "pending",
        },
      ],
    };
    assert.equal(hasPendingTasks(file), true);
  });
});
