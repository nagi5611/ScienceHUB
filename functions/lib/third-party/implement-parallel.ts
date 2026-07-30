/**
 * サードパーティ — 並列実装バッチ（depends_on + target 競合判定）
 */

import type {
  ImplementationTask,
  ImplementationTasksFile,
  ImplementationTaskTarget,
} from "./schemas";
import {
  canParallelizeTargets,
  maxParallelBatchSize,
} from "./implement-edit-scope";

function isTaskReady(task: ImplementationTask, tasks: ImplementationTask[]): boolean {
  if (task.status === "done" || task.status === "failed") return false;
  for (const depId of task.depends_on) {
    const dep = tasks.find((t) => t.id === depId);
    if (!dep || dep.status !== "done") return false;
  }
  return true;
}

function batchCanAdd(
  batch: ImplementationTask[],
  candidate: ImplementationTask
): boolean {
  for (const t of batch) {
    if (!canParallelizeTargets(t.target, candidate.target)) return false;
  }
  return true;
}

/** 未完了タスクが残っているか */
export function hasPendingTasks(tasksFile: ImplementationTasksFile): boolean {
  return tasksFile.tasks.some((t) => t.status === "pending");
}

/** 次に実行する並列バッチ（空なら null） */
export function nextParallelBatch(
  tasksFile: ImplementationTasksFile
): ImplementationTask[] | null {
  const ready = tasksFile.tasks.filter((t) =>
    isTaskReady(t, tasksFile.tasks)
  );
  if (ready.length === 0) return null;

  const batch: ImplementationTask[] = [];
  const limit = maxParallelBatchSize();

  for (const task of ready) {
    if (batch.length === 0) {
      batch.push(task);
      continue;
    }
    if (batch.length >= limit) break;
    if (batchCanAdd(batch, task)) {
      batch.push(task);
    }
  }

  return batch.length > 0 ? batch : [ready[0]];
}

/** バッチ内ターゲット一覧（デバッグ用） */
export function batchTargets(batch: ImplementationTask[]): ImplementationTaskTarget[] {
  return batch.map((t) => t.target);
}
