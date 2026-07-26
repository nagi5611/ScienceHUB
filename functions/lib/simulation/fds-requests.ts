// functions/lib/simulation/fds-requests.ts

import type { Env } from "../types";
import { pickC7aInstanceType } from "./fds-instance-sizing";
import { FDS_JOB_MAX_RUNTIME_HOURS, getFdsJobById, type FdsJobStatus } from "./fds-jobs";
import { reviewFdsInputWithGemini } from "./fds-primary-review";
import { buildSimulationAdminUrl, notifyFdsSecondaryReviewPending } from "./discord";
import {
  listFdsDiscordMentionUserIds,
  resolveSimDiscordWebhookUrl,
} from "./sim-app-settings";

/** 1 依頼あたりの一次審査の最大実施回数（初回 + 再審最大3回 = 合計4回）。 */
export const FDS_PRIMARY_REVIEW_MAX_ATTEMPTS = 4;

export type FdsRequestStatus =
  | "primary_reviewing"
  | "primary_failed"
  | "primary_error"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "cancelled";

export interface FdsRequest {
  id: string;
  user_id: string;
  title: string;
  desired_date: string | null;
  max_runtime_hours: number;
  mpi_processes: number;
  ec2_instance_type: string;
  input_r2_key: string;
  input_filename: string;
  input_size_bytes: number;
  notes: string | null;
  status: FdsRequestStatus;
  fds_job_id: string | null;
  reviewed_by_user_id: string | null;
  reviewed_at: string | null;
  review_message: string | null;
  created_at: string;
  primary_review_passed: number;
  primary_review_forced: number;
  primary_review_issues: string | null;
  primary_review_error: string | null;
  primary_review_attempt_count: number;
}

export interface FdsRequestApiModel {
  id: string;
  title: string;
  desired_date: string | null;
  max_runtime_hours: number;
  mpi_processes: number;
  ec2_instance_type: string;
  input_filename: string;
  input_size_bytes: number;
  notes: string | null;
  status: FdsRequestStatus;
  fds_job_id: string | null;
  reviewed_at: string | null;
  review_message: string | null;
  created_at: string;
  primary_review_passed: boolean;
  primary_review_forced: boolean;
  primary_review_issues: string[];
  primary_review_error: string | null;
  primary_review_attempt_count: number;
  primary_review_max_attempts: number;
  primary_review_can_retry: boolean;
  /** UI badge key (may differ from `status` when linked FDS job is running/done). */
  status_badge: FdsRequestStatus | "execution_running" | "execution_succeeded" | "execution_failed";
  status_display: string;
  fds_job_status: FdsJobStatus | null;
}

const REQUEST_STATUS_LABELS: Record<FdsRequestStatus, string> = {
  primary_reviewing: "一次審査中",
  primary_failed: "一次審査で指摘あり",
  primary_error: "一次審査失敗",
  pending_approval: "二次審査中",
  approved: "承認済み",
  rejected: "却下",
  cancelled: "キャンセル",
};

/** Parses stored primary review issues JSON. */
function parsePrimaryReviewIssues(raw: string | null): string[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((s) => String(s).trim()).filter(Boolean);
  } catch {
    return [];
  }
}

/** Whether the user may upload a revised .fds for another primary review. */
export function canRetryPrimaryReview(row: FdsRequest): boolean {
  const count = row.primary_review_attempt_count ?? 0;
  if (count >= FDS_PRIMARY_REVIEW_MAX_ATTEMPTS) return false;
  return row.status === "primary_failed" || row.status === "primary_error";
}

/** Formats a request for API responses. */
export function formatFdsRequestForApi(row: FdsRequest): FdsRequestApiModel {
  const attemptCount = row.primary_review_attempt_count ?? 0;
  const presentation = resolveFdsRequestStatusPresentation(row, null);
  return {
    id: row.id,
    title: row.title,
    desired_date: row.desired_date,
    max_runtime_hours: row.max_runtime_hours,
    mpi_processes: row.mpi_processes,
    ec2_instance_type: row.ec2_instance_type,
    input_filename: row.input_filename,
    input_size_bytes: row.input_size_bytes,
    notes: row.notes,
    status: row.status,
    fds_job_id: row.fds_job_id,
    reviewed_at: row.reviewed_at,
    review_message: row.review_message,
    created_at: row.created_at,
    primary_review_passed: Boolean(row.primary_review_passed),
    primary_review_forced: Boolean(row.primary_review_forced),
    primary_review_issues: parsePrimaryReviewIssues(row.primary_review_issues),
    primary_review_error: row.primary_review_error?.trim() || null,
    primary_review_attempt_count: attemptCount,
    primary_review_max_attempts: FDS_PRIMARY_REVIEW_MAX_ATTEMPTS,
    primary_review_can_retry: canRetryPrimaryReview(row),
    status_badge: presentation.status_badge,
    status_display: presentation.status_display,
    fds_job_status: presentation.fds_job_status,
  };
}

function resolveFdsRequestStatusPresentation(
  row: FdsRequest,
  jobStatus: FdsJobStatus | null
): {
  status_display: string;
  status_badge: FdsRequestApiModel["status_badge"];
  fds_job_status: FdsJobStatus | null;
} {
  if (row.status === "approved" && jobStatus) {
    if (jobStatus === "succeeded") {
      return { status_display: "完了_成功", status_badge: "execution_succeeded", fds_job_status: jobStatus };
    }
    if (jobStatus === "failed" || jobStatus === "timed_out") {
      return { status_display: "完了_失敗", status_badge: "execution_failed", fds_job_status: jobStatus };
    }
    if (jobStatus === "running" || jobStatus === "launching") {
      return { status_display: "実行中", status_badge: "execution_running", fds_job_status: jobStatus };
    }
    if (jobStatus === "pending") {
      return { status_display: "起動待ち", status_badge: "approved", fds_job_status: jobStatus };
    }
    if (jobStatus === "cancelled") {
      return { status_display: "キャンセル", status_badge: "cancelled", fds_job_status: jobStatus };
    }
  }

  return {
    status_display: REQUEST_STATUS_LABELS[row.status] ?? row.status,
    status_badge: row.status,
    fds_job_status: jobStatus,
  };
}

/** Formats a request with linked FDS job execution status. */
export async function formatFdsRequestForApiEnriched(
  db: D1Database,
  row: FdsRequest
): Promise<FdsRequestApiModel> {
  const base = formatFdsRequestForApi(row);
  if (!row.fds_job_id) return base;

  const job = await getFdsJobById(db, row.fds_job_id);
  const presentation = resolveFdsRequestStatusPresentation(row, job?.status ?? null);
  return {
    ...base,
    status_badge: presentation.status_badge,
    status_display: presentation.status_display,
    fds_job_status: presentation.fds_job_status,
  };
}

/** Returns a human-readable status label. */
export function fdsRequestStatusLabel(status: FdsRequestStatus): string {
  return REQUEST_STATUS_LABELS[status] ?? status;
}

/** Validates max runtime hours for a request. */
export function validateFdsRequestMaxRuntimeHours(hours: number): string | null {
  if (!Number.isFinite(hours) || hours < 1 || hours > FDS_JOB_MAX_RUNTIME_HOURS) {
    return `最大実行時間は 1〜${FDS_JOB_MAX_RUNTIME_HOURS} 時間で指定してください`;
  }
  return null;
}

/** Fetches a request by ID. */
export async function getFdsRequestById(db: D1Database, id: string): Promise<FdsRequest | null> {
  return db.prepare(`SELECT * FROM sim_fds_requests WHERE id = ?`).bind(id).first<FdsRequest>();
}

/** Lists pending approval requests (newest first). */
export async function listPendingFdsRequests(db: D1Database, limit = 50): Promise<FdsRequest[]> {
  const result = await db
    .prepare(
      `SELECT * FROM sim_fds_requests
       WHERE status = 'pending_approval'
       ORDER BY created_at ASC
       LIMIT ?`
    )
    .bind(limit)
    .all<FdsRequest>();
  return result.results ?? [];
}

/** Lists recent requests for a user. */
export async function listFdsRequestsForUser(
  db: D1Database,
  userId: string,
  limit = 30
): Promise<FdsRequest[]> {
  const result = await db
    .prepare(
      `SELECT * FROM sim_fds_requests
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ?`
    )
    .bind(userId, limit)
    .all<FdsRequest>();
  return result.results ?? [];
}

/** Lists recent requests for admin review. */
export async function listFdsRequestsAdmin(db: D1Database, limit = 50): Promise<FdsRequest[]> {
  const result = await db
    .prepare(`SELECT * FROM sim_fds_requests ORDER BY created_at DESC LIMIT ?`)
    .bind(limit)
    .all<FdsRequest>();
  return result.results ?? [];
}

/** Creates an FDS simulation request (initial status: primary_reviewing). */
export async function createFdsRequest(
  db: D1Database,
  data: {
    id: string;
    userId: string;
    title: string;
    desiredDate: string | null;
    maxRuntimeHours: number;
    mpiProcesses: number;
    inputR2Key: string;
    inputFilename: string;
    inputSizeBytes: number;
    notes: string | null;
    createdAt: string;
    status?: FdsRequestStatus;
    primaryReviewPassed?: boolean;
    primaryReviewForced?: boolean;
    primaryReviewIssues?: string[];
    primaryReviewError?: string | null;
  }
): Promise<FdsRequest> {
  const sizing = pickC7aInstanceType(data.mpiProcesses);
  const issues = data.primaryReviewIssues ?? [];
  const issuesJson = issues.length > 0 ? JSON.stringify(issues) : null;
  const status = data.status ?? "primary_reviewing";
  const primaryReviewPassed = data.primaryReviewPassed ?? false;
  const primaryReviewForced = data.primaryReviewForced ?? false;
  const primaryReviewError = data.primaryReviewError?.trim() || null;

  await db
    .prepare(
      `INSERT INTO sim_fds_requests (
        id, user_id, title, desired_date, max_runtime_hours, mpi_processes,
        ec2_instance_type, input_r2_key, input_filename, input_size_bytes,
        notes, status, created_at,
        primary_review_passed, primary_review_forced, primary_review_issues,
        primary_review_error, primary_review_attempt_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`
    )
    .bind(
      data.id,
      data.userId,
      data.title,
      data.desiredDate,
      data.maxRuntimeHours,
      sizing.requestedCores,
      sizing.instanceType,
      data.inputR2Key,
      data.inputFilename,
      data.inputSizeBytes,
      data.notes,
      status,
      data.createdAt,
      primaryReviewPassed ? 1 : 0,
      primaryReviewForced ? 1 : 0,
      issuesJson,
      primaryReviewError
    )
    .run();

  const row = await getFdsRequestById(db, data.id);
  if (!row) throw new Error("FDS 依頼の作成に失敗しました");
  return row;
}

/** Persists primary review outcome for a request. */
export async function applyFdsPrimaryReviewResult(
  db: D1Database,
  requestId: string,
  data: {
    status: Extract<FdsRequestStatus, "primary_failed" | "primary_error" | "pending_approval">;
    primaryReviewPassed: boolean;
    primaryReviewForced: boolean;
    primaryReviewIssues: string[];
    primaryReviewError: string | null;
  }
): Promise<void> {
  const issuesJson =
    data.primaryReviewIssues.length > 0 ? JSON.stringify(data.primaryReviewIssues) : null;

  await db
    .prepare(
      `UPDATE sim_fds_requests
       SET status = ?,
           primary_review_passed = ?,
           primary_review_forced = ?,
           primary_review_issues = ?,
           primary_review_error = ?,
           primary_review_attempt_count = primary_review_attempt_count + 1
       WHERE id = ? AND status = 'primary_reviewing'`
    )
    .bind(
      data.status,
      data.primaryReviewPassed ? 1 : 0,
      data.primaryReviewForced ? 1 : 0,
      issuesJson,
      data.primaryReviewError,
      requestId
    )
    .run();
}

/** Sends Discord webhook + mentions when a request reaches secondary review. */
export async function sendFdsPendingApprovalDiscordNotification(
  env: Env,
  db: D1Database,
  requestId: string
): Promise<void> {
  const row = await getFdsRequestById(db, requestId);
  if (!row || row.status !== "pending_approval") return;

  const webhookUrl = await resolveSimDiscordWebhookUrl(db, env);
  const mentionIds = await listFdsDiscordMentionUserIds(db);
  const base = env.OAUTH_REDIRECT_BASE?.trim().replace(/\/$/, "") || "https://s.mmh-virtual.jp";
  const apiModel = formatFdsRequestForApi(row);

  await notifyFdsSecondaryReviewPending(
    webhookUrl,
    buildSimulationAdminUrl(base),
    mentionIds,
    {
      id: apiModel.id,
      title: apiModel.title,
      input_filename: apiModel.input_filename,
      mpi_processes: apiModel.mpi_processes,
      max_runtime_hours: apiModel.max_runtime_hours,
      desired_date: apiModel.desired_date,
      primary_review_forced: apiModel.primary_review_forced,
      primary_review_issues: apiModel.primary_review_issues,
    }
  );
}

/** Runs Gemini primary review in the background and updates the request row. */
export async function runFdsPrimaryReviewJob(
  env: Env,
  db: D1Database,
  params: {
    requestId: string;
    fdsText: string;
    filename: string;
    mpiProcesses: number;
    maxRuntimeHours: number;
    forceSecondary: boolean;
  }
): Promise<void> {
  const { requestId, fdsText, filename, mpiProcesses, maxRuntimeHours, forceSecondary } = params;

  try {
    const review = await reviewFdsInputWithGemini(env, fdsText, {
      filename,
      mpiProcesses,
      maxRuntimeHours,
    });

    if (!review.passed && !forceSecondary) {
      await applyFdsPrimaryReviewResult(db, requestId, {
        status: "primary_failed",
        primaryReviewPassed: false,
        primaryReviewForced: false,
        primaryReviewIssues: review.issues,
        primaryReviewError: null,
      });
      return;
    }

    const forced = !review.passed && forceSecondary;
    await applyFdsPrimaryReviewResult(db, requestId, {
      status: "pending_approval",
      primaryReviewPassed: review.passed,
      primaryReviewForced: forced,
      primaryReviewIssues: forced ? review.issues : [],
      primaryReviewError: null,
    });
    await sendFdsPendingApprovalDiscordNotification(env, db, requestId);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "一次審査（AI）の処理に失敗しました";
    console.error("FDS primary review job failed:", requestId, message);
    await applyFdsPrimaryReviewResult(db, requestId, {
      status: "primary_error",
      primaryReviewPassed: false,
      primaryReviewForced: false,
      primaryReviewIssues: [],
      primaryReviewError: message,
    });
  }
}

/** Moves a primary_failed request to secondary review (staff queue) without re-running AI. */
export async function forceSecondaryFdsRequest(
  db: D1Database,
  requestId: string,
  userId: string
): Promise<FdsRequest> {
  const row = await getFdsRequestById(db, requestId);
  if (!row || row.user_id !== userId) {
    throw new Error("依頼が見つかりません");
  }
  if (row.status !== "primary_failed" && row.status !== "primary_error") {
    throw new Error("この依頼は二次審査へ進められません");
  }

  await db
    .prepare(
      `UPDATE sim_fds_requests
       SET status = 'pending_approval', primary_review_forced = 1
       WHERE id = ? AND user_id = ? AND status IN ('primary_failed', 'primary_error')`
    )
    .bind(requestId, userId)
    .run();

  const updated = await getFdsRequestById(db, requestId);
  if (!updated) throw new Error("依頼の更新に失敗しました");
  return updated;
}

/** Replaces input file and re-queues primary review (within attempt limit). */
export async function retryFdsPrimaryReview(
  db: D1Database,
  requestId: string,
  userId: string,
  data: {
    inputR2Key: string;
    inputFilename: string;
    inputSizeBytes: number;
  }
): Promise<FdsRequest> {
  const row = await getFdsRequestById(db, requestId);
  if (!row || row.user_id !== userId) {
    throw new Error("依頼が見つかりません");
  }
  if (!canRetryPrimaryReview(row)) {
    throw new Error(
      `一次審査の再審は最大 ${FDS_PRIMARY_REVIEW_MAX_ATTEMPTS - 1} 回までです。二次審査へ強制申請するか、内容を見直してください`
    );
  }

  const result = await db
    .prepare(
      `UPDATE sim_fds_requests
       SET status = 'primary_reviewing',
           input_r2_key = ?,
           input_filename = ?,
           input_size_bytes = ?,
           primary_review_passed = 0,
           primary_review_forced = 0,
           primary_review_issues = NULL,
           primary_review_error = NULL
       WHERE id = ? AND user_id = ?
         AND status IN ('primary_failed', 'primary_error')
         AND primary_review_attempt_count < ?`
    )
    .bind(
      data.inputR2Key,
      data.inputFilename,
      data.inputSizeBytes,
      requestId,
      userId,
      FDS_PRIMARY_REVIEW_MAX_ATTEMPTS
    )
    .run();

  if (!result.meta.changes) {
    throw new Error("再審を開始できませんでした");
  }

  const updated = await getFdsRequestById(db, requestId);
  if (!updated) throw new Error("依頼の更新に失敗しました");
  return updated;
}

/** Marks a request as approved and links the created job. */
export async function markFdsRequestApproved(
  db: D1Database,
  requestId: string,
  fdsJobId: string,
  reviewedByUserId: string,
  reviewedAt: string
): Promise<void> {
  await db
    .prepare(
      `UPDATE sim_fds_requests
       SET status = 'approved', fds_job_id = ?, reviewed_by_user_id = ?, reviewed_at = ?
       WHERE id = ? AND status = 'pending_approval'`
    )
    .bind(fdsJobId, reviewedByUserId, reviewedAt, requestId)
    .run();
}

/** Rejects a pending request. */
export async function markFdsRequestRejected(
  db: D1Database,
  requestId: string,
  reviewedByUserId: string,
  reviewedAt: string,
  message: string | null
): Promise<void> {
  await db
    .prepare(
      `UPDATE sim_fds_requests
       SET status = 'rejected', reviewed_by_user_id = ?, reviewed_at = ?, review_message = ?
       WHERE id = ? AND status = 'pending_approval'`
    )
    .bind(reviewedByUserId, reviewedAt, message, requestId)
    .run();
}
