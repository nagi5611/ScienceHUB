/**
 * サードパーティ — バックグラウンドジョブ（tp_jobs）
 */

import { createId, now } from "../types";

export type TpJobType = "implement" | "verify";
export type TpJobStatus =
  | "pending"
  | "running"
  | "succeeded"
  | "failed"
  | "cancelled";

/** 実行中ジョブの打ち切り（ms） */
export const TP_JOB_STALE_MS = 15 * 60 * 1000;

export interface TpJobProgress {
  current?: number;
  total?: number;
  taskId?: string;
  label?: string;
  phase?: string;
}

export interface TpJobRow {
  id: string;
  project_id: string;
  owner_user_id: string;
  job_type: TpJobType;
  status: TpJobStatus;
  progress_json: string | null;
  error_message: string | null;
  result_json: string | null;
  created_at: number;
  started_at: number | null;
  finished_at: number | null;
}

function parseProgress(json: string | null): TpJobProgress | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as TpJobProgress;
  } catch {
    return null;
  }
}

/** 新規ジョブ作成 + active_job_id 設定 */
export async function createTpJob(
  db: D1Database,
  projectId: string,
  ownerUserId: string,
  jobType: TpJobType
): Promise<TpJobRow> {
  const active = await db
    .prepare("SELECT active_job_id FROM tp_projects WHERE id = ?")
    .bind(projectId)
    .first<{ active_job_id: string | null }>();
  if (active?.active_job_id) {
    const running = await getTpJob(db, active.active_job_id);
    if (
      running &&
      (running.status === "pending" || running.status === "running")
    ) {
      throw new Error("別のジョブが実行中です。完了までお待ちください。");
    }
  }

  const id = createId("tpjob");
  const timestamp = now();
  await db
    .prepare(
      `INSERT INTO tp_jobs (
        id, project_id, owner_user_id, job_type, status,
        progress_json, error_message, result_json,
        created_at, started_at, finished_at
      ) VALUES (?, ?, ?, ?, 'pending', NULL, NULL, NULL, ?, NULL, NULL)`
    )
    .bind(id, projectId, ownerUserId, jobType, timestamp)
    .run();

  await db
    .prepare("UPDATE tp_projects SET active_job_id = ? WHERE id = ?")
    .bind(id, projectId)
    .run();

  const job = await getTpJob(db, id);
  if (!job) throw new Error("ジョブの作成に失敗しました");
  return job;
}

/** ジョブ取得 */
export async function getTpJob(
  db: D1Database,
  jobId: string
): Promise<TpJobRow | null> {
  const row = await db
    .prepare(
      `SELECT id, project_id, owner_user_id, job_type, status,
              progress_json, error_message, result_json,
              created_at, started_at, finished_at
       FROM tp_jobs WHERE id = ?`
    )
    .bind(jobId)
    .first<TpJobRow>();
  return row ?? null;
}

/** プロジェクトのアクティブジョブ（スタール時は失敗扱い） */
export async function getActiveJobForProject(
  db: D1Database,
  projectId: string
): Promise<TpJobRow | null> {
  const proj = await db
    .prepare("SELECT active_job_id FROM tp_projects WHERE id = ?")
    .bind(projectId)
    .first<{ active_job_id: string | null }>();
  if (!proj?.active_job_id) return null;
  const job = await getTpJob(db, proj.active_job_id);
  if (!job || job.status === "succeeded" || job.status === "failed") {
    return null;
  }

  const staleAnchor = job.started_at ?? job.created_at;
  if (
    (job.status === "pending" || job.status === "running") &&
    now() - staleAnchor > TP_JOB_STALE_MS
  ) {
    const staleMsg =
      "ジョブがタイムアウトしました。再度「実装開始」を試してください。";
    await markJobFailed(db, job.id, projectId, staleMsg);
    if (job.job_type === "implement") {
      const { recoverPhaseAfterImplementFailure } = await import(
        "./implement-runner"
      );
      await recoverPhaseAfterImplementFailure(db, projectId, staleMsg);
    }
    return null;
  }

  return job;
}

/** ジョブ進捗更新 */
export async function updateJobProgress(
  db: D1Database,
  jobId: string,
  progress: TpJobProgress
): Promise<void> {
  await db
    .prepare("UPDATE tp_jobs SET progress_json = ? WHERE id = ?")
    .bind(JSON.stringify(progress), jobId)
    .run();
}

/** ジョブ開始 */
export async function markJobRunning(db: D1Database, jobId: string): Promise<void> {
  await db
    .prepare(
      "UPDATE tp_jobs SET status = 'running', started_at = ? WHERE id = ?"
    )
    .bind(now(), jobId)
    .run();
}

/** ジョブ成功 */
export async function markJobSucceeded(
  db: D1Database,
  jobId: string,
  projectId: string,
  result?: Record<string, unknown>
): Promise<void> {
  const finished = now();
  await db
    .prepare(
      `UPDATE tp_jobs SET status = 'succeeded', result_json = ?, finished_at = ?
       WHERE id = ?`
    )
    .bind(result ? JSON.stringify(result) : null, finished, jobId)
    .run();
  await db
    .prepare(
      "UPDATE tp_projects SET active_job_id = NULL WHERE id = ? AND active_job_id = ?"
    )
    .bind(projectId, jobId)
    .run();
}

/** ジョブ失敗 */
export async function markJobFailed(
  db: D1Database,
  jobId: string,
  projectId: string,
  errorMessage: string
): Promise<void> {
  const finished = now();
  await db
    .prepare(
      `UPDATE tp_jobs SET status = 'failed', error_message = ?, finished_at = ?
       WHERE id = ?`
    )
    .bind(errorMessage.slice(0, 500), finished, jobId)
    .run();
  await db
    .prepare(
      "UPDATE tp_projects SET active_job_id = NULL WHERE id = ? AND active_job_id = ?"
    )
    .bind(projectId, jobId)
    .run();
}

/** ジョブ完了までポーリング（SSE 用） */
export async function pollJobUntilDone(
  db: D1Database,
  jobId: string,
  options: {
    intervalMs?: number;
    timeoutMs?: number;
    onPoll?: (job: TpJobRow) => void | Promise<void>;
  }
): Promise<TpJobRow> {
  const intervalMs = options.intervalMs ?? 1000;
  const timeoutMs = options.timeoutMs ?? 300000;
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const job = await getTpJob(db, jobId);
    if (!job) throw new Error("ジョブが見つかりません");

    if (options.onPoll) {
      await options.onPoll(job);
    }

    if (
      job.status === "succeeded" ||
      job.status === "failed" ||
      job.status === "cancelled"
    ) {
      return job;
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error("ジョブの完了待ちがタイムアウトしました");
}

export function jobProgress(job: TpJobRow): TpJobProgress | null {
  return parseProgress(job.progress_json);
}
