/**
 * サードパーティ — 実装ジョブランナー（並列バッチ + 検証）
 */

import type { Env } from "../types";
import { createId, now } from "../types";
import {
  ARTIFACT_INDEX,
  ARTIFACT_PLAN,
  ARTIFACT_REQUIREMENTS,
  ARTIFACT_TASKS,
  getArtifact,
} from "./artifacts";
import {
  applyImplementationTask,
  EMPTY_SKELETON,
  loadImplementationTasks,
  planImplementationTasks,
  planImplementationTaskEdits,
  applyPlannedTaskEdits,
  prepareImplementGeminiContext,
  saveImplementationTasks,
  normalizeImplementBaseHtml,
  stripScienceHubPlaceholderParagraph,
  isSkeletonLikeTask,
  buildProjectSkeleton,
  isBareOrDefaultSkeleton,
  isScienceHubPlaceholderHtml,
} from "./implement-tasks";
import { hasPendingTasks, nextParallelBatch } from "./implement-parallel";
import { writeProjectIndexHtml } from "./project-html";
import { snapshotCurrentHtml } from "./revisions";
import {
  markJobFailed,
  markJobRunning,
  markJobSucceeded,
  updateJobProgress,
} from "./jobs";
import { verifyProjectHtml } from "./browser-verify";
import type { TpProjectPipelineRow } from "./gemini-pipeline";

export interface ImplementRunnerCallbacks {
  onActivity?: (label: string, phase?: string) => void;
  onArtifact?: (path: string) => void;
  onTasks?: (payload: {
    tasks: Array<{ id: string; title: string; status: string }>;
    current: number;
  }) => void;
  onVerify?: (result: {
    passed: boolean;
    errors: string[];
    warnings: string[];
  }) => void;
}

const MAX_IMPLEMENT_ATTEMPTS = 3;

async function insertAssistantMessage(
  db: D1Database,
  projectId: string,
  content: string
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO tp_chat_messages (id, project_id, role, content, created_at)
       VALUES (?, ?, 'assistant', ?, ?)`
    )
    .bind(createId("tpmsg"), projectId, content, now())
    .run();
}

async function patchProjectPhase(
  db: D1Database,
  projectId: string,
  fields: Record<string, string | number | null>
): Promise<void> {
  const updates: string[] = ["updated_at = ?"];
  const values: (string | number | null)[] = [now()];
  for (const [key, val] of Object.entries(fields)) {
    updates.push(`${key} = ?`);
    values.push(val);
  }
  values.push(projectId);
  await db
    .prepare(`UPDATE tp_projects SET ${updates.join(", ")} WHERE id = ?`)
    .bind(...values)
    .run();
}

/** 実装ジョブ本体（Worker / in-process 共通） */
export async function runImplementJob(
  env: Env,
  db: D1Database,
  bucket: R2Bucket,
  project: TpProjectPipelineRow,
  jobId: string,
  callbacks?: ImplementRunnerCallbacks
): Promise<{ assistantMessage: string; htmlUpdated: boolean }> {
  if (project.implement_attempts >= MAX_IMPLEMENT_ATTEMPTS) {
    throw new Error("実装の再試行上限に達しました");
  }

  await markJobRunning(db, jobId);
  callbacks?.onActivity?.("実装タスクを準備中…", "flash_implement_tasks");
  await patchProjectPhase(db, project.id, {
    workflow_phase: "flash_implement_tasks",
  });

  const requirements =
    (await getArtifact(bucket, project.dir_name, ARTIFACT_REQUIREMENTS)) ?? "";
  const plan = (await getArtifact(bucket, project.dir_name, ARTIFACT_PLAN)) ?? "";

  let tasksFile = await loadImplementationTasks(bucket, project.dir_name);
  if (!tasksFile) {
    tasksFile = await planImplementationTasks(
      env,
      requirements,
      plan,
      project.title,
      { background: true }
    );
    await saveImplementationTasks(bucket, project.dir_name, tasksFile);
    callbacks?.onArtifact?.(ARTIFACT_TASKS);
  }

  const emitTasks = () => {
    callbacks?.onTasks?.({
      tasks: tasksFile!.tasks.map((t) => ({
        id: t.id,
        title: t.title,
        status: t.status,
      })),
      current: tasksFile!.current_task_index,
    });
  };
  emitTasks();

  let html =
    (await getArtifact(bucket, project.dir_name, ARTIFACT_INDEX)) ?? "";
  if (!html.trim()) html = EMPTY_SKELETON;
  html = normalizeImplementBaseHtml(html, project.title);

  const summaries: string[] = [];
  const implementGemini = await prepareImplementGeminiContext(
    env,
    requirements,
    plan
  );

  while (hasPendingTasks(tasksFile)) {
    const batch = nextParallelBatch(tasksFile);
    if (!batch) break;

    const batchLabel = batch.map((t) => t.title).join(" + ");
    callbacks?.onActivity?.(
      `タスク: ${batchLabel}`,
      "flash_implement_tasks"
    );
    await updateJobProgress(db, jobId, {
      current: tasksFile.current_task_index,
      total: tasksFile.tasks.length,
      label: batchLabel,
      phase: "flash_implement_tasks",
    });

    const batchResults: Array<{
      task: typeof batch[0];
      result: Awaited<ReturnType<typeof applyImplementationTask>>;
    }> = [];

    if (batch.length > 1) {
      const plans = await Promise.all(
        batch.map((task) => {
          if (
            isSkeletonLikeTask(task) &&
            (isBareOrDefaultSkeleton(html) || isScienceHubPlaceholderHtml(html))
          ) {
            return Promise.resolve({
              skeleton: true as const,
              html: buildProjectSkeleton(project.title),
              assistantMessage: `${task.title} を反映しました。`,
            });
          }
          return planImplementationTaskEdits(
            env,
            html,
            task,
            requirements,
            plan,
            project.title,
            implementGemini,
            { background: true }
          ).then((planResult) => ({ skeleton: false as const, planResult, task }));
        })
      );

      for (let i = 0; i < batch.length; i++) {
        const task = batch[i];
        const planned = plans[i];
        if (!planned) continue;

        if ("skeleton" in planned && planned.skeleton) {
          html = planned.html;
          batchResults.push({
            task,
            result: {
              html: planned.html,
              assistantMessage: planned.assistantMessage,
            },
          });
          continue;
        }

        if (!("planResult" in planned) || !planned.planResult) continue;
        const result = applyPlannedTaskEdits(
          html,
          task,
          planned.planResult,
          project.title
        );
        html = result.html;
        batchResults.push({ task, result });
      }
    } else {
      for (const task of batch) {
        const result = await applyImplementationTask(
          env,
          html,
          task,
          requirements,
          plan,
          project.title,
          {
            onActivity: (label) =>
              callbacks?.onActivity?.(label, "flash_implement_tasks"),
            gemini: implementGemini,
            background: true,
          }
        );
        html = result.html;
        batchResults.push({ task, result });
      }
    }

    for (const { task, result } of batchResults) {
      summaries.push(result.assistantMessage);
      task.status = "done";
    }

    tasksFile.current_task_index = tasksFile.tasks.filter(
      (t) => t.status === "done"
    ).length;
    await writeProjectIndexHtml(bucket, project, html);
    callbacks?.onArtifact?.(ARTIFACT_INDEX);
    await saveImplementationTasks(bucket, project.dir_name, tasksFile);
    emitTasks();
  }

  html = stripScienceHubPlaceholderParagraph(html);
  await writeProjectIndexHtml(bucket, project, html);

  const verifyResult = await verifyProjectHtml(
    env,
    bucket,
    project.id,
    project.dir_name,
    { autoRepair: true }
  );
  callbacks?.onVerify?.({
    passed: verifyResult.passed,
    errors: verifyResult.errors,
    warnings: verifyResult.warnings,
  });

  const assistantMessage =
    summaries.length > 0
      ? summaries[summaries.length - 1]
      : "index.html の段階実装が完了しました。";

  const verifyNote = verifyResult.passed
    ? ""
    : `（ブラウザ検証で問題: ${verifyResult.errors.slice(0, 2).join("; ")}）`;

  await insertAssistantMessage(
    db,
    project.id,
    assistantMessage + verifyNote
  );

  await patchProjectPhase(db, project.id, {
    workflow_phase: "draft_ready",
    implement_attempts: project.implement_attempts + 1,
    awaiting_implement_confirm: 0,
  });

  await snapshotCurrentHtml(
    db,
    bucket,
    project,
    `実装完了 (job ${jobId})`,
    jobId
  );

  await markJobSucceeded(db, jobId, project.id, {
    passed: verifyResult.passed,
    errors: verifyResult.errors,
    warnings: verifyResult.warnings,
  });

  return { assistantMessage, htmlUpdated: true };
}

/** 実装ジョブ失敗を記録し、ユーザーが再試行できるフェーズへ戻す */
export async function failImplementJob(
  db: D1Database,
  jobId: string,
  projectId: string,
  error: string
): Promise<void> {
  await markJobFailed(db, jobId, projectId, error);
  await recoverPhaseAfterImplementFailure(db, projectId, error);
}

/** 実装失敗・タイムアウト後に再試行可能なフェーズへ */
export async function recoverPhaseAfterImplementFailure(
  db: D1Database,
  projectId: string,
  errorMessage: string
): Promise<void> {
  const trimmed = errorMessage.slice(0, 200);
  await patchProjectPhase(db, projectId, {
    workflow_phase: "await_implement_confirm",
    awaiting_implement_confirm: 1,
  });
  await insertAssistantMessage(
    db,
    projectId,
    `実装が完了できませんでした: ${trimmed}。「実装開始」と送ると再試行できます。`
  );
}
