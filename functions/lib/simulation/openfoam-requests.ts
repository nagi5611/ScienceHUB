// functions/lib/simulation/openfoam-requests.ts

import type { Env } from "../types";
import { pickEc2InstanceType } from "./openfoam-instance-sizing";
import { OPENFOAM_JOB_MAX_RUNTIME_HOURS, getOpenfoamJobById, type OpenfoamJob, type OpenfoamJobStatus } from "./openfoam-jobs";
import { reviewOpenfoamInputWithGemini } from "./openfoam-primary-review";
import { buildSimulationAdminUrl, notifyOpenfoamSecondaryReviewPending } from "./discord";
import {
  listFdsDiscordMentionUserIds,
  resolveSimDiscordWebhookUrl,
} from "./sim-app-settings";
import {
  openfoamFailureCategoryUserMessage,
  type OpenfoamFailureCategory,
} from "./openfoam-failure-category";

/** 1 依頼あたりの一次審査の最大実施回数（初回 + 再審最大3回 = 合計4回）。 */
export const OPENFOAM_PRIMARY_REVIEW_MAX_ATTEMPTS = 4;

export type OpenfoamRequestStatus =
  | "primary_reviewing"
  | "primary_failed"
  | "primary_error"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "cancelled";

export interface OpenfoamRequest {
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
  status: OpenfoamRequestStatus;
  openfoam_job_id: string | null;
  reviewed_by_user_id: string | null;
  reviewed_at: string | null;
  review_message: string | null;
  created_at: string;
  primary_review_passed: number;
  primary_review_forced: number;
  primary_review_issues: string | null;
  primary_review_error: string | null;
  primary_review_attempt_count: number;
  input_sha256: string | null;
  primary_review_model: string | null;
  primary_review_history: string | null;
}

export interface OpenfoamPrimaryReviewHistoryEntry {
  at: string;
  model: string;
  passed: boolean;
  forced: boolean;
  status: string;
  issues: string[];
  error: string | null;
}

export interface OpenfoamRequestApiModel {
  id: string;
  title: string;
  desired_date: string | null;
  max_runtime_hours: number;
  mpi_processes: number;
  ec2_instance_type: string;
  input_filename: string;
  input_size_bytes: number;
  notes: string | null;
  status: OpenfoamRequestStatus;
  openfoam_job_id: string | null;
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
  /** UI badge key (may differ from `status` when linked OpenFOAM job is running/done). */
  status_badge:
    | OpenfoamRequestStatus
    | "execution_queued"
    | "execution_running"
    | "execution_succeeded"
    | "execution_failed";
  status_display: string;
  openfoam_job_status: OpenfoamJobStatus | null;
  input_sha256: string | null;
  primary_review_model: string | null;
  primary_review_history: OpenfoamPrimaryReviewHistoryEntry[];
  execution_failure_category: OpenfoamFailureCategory | null;
  execution_failure_message: string | null;
  has_output_download: boolean;
  can_rerun: boolean;
  openfoam_ami_id: string | null;
  openfoam_solver_version: string | null;
  output_sha256: string | null;
  job_launched_at: string | null;
  job_finished_at: string | null;
}

const REQUEST_STATUS_LABELS: Record<OpenfoamRequestStatus, string> = {
  primary_reviewing: "一次審査中",
  primary_failed: "一次審査で指摘あり",
  primary_error: "一次審査失敗",
  pending_approval: "二次審査中",
  approved: "承認済み",
  rejected: "却下",
  cancelled: "キャンセル",
};

/** Parses stored primary review history JSON. */
function parsePrimaryReviewHistory(raw: string | null): OpenfoamPrimaryReviewHistoryEntry[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const row = item as Record<string, unknown>;
        return {
          at: String(row.at ?? ""),
          model: String(row.model ?? ""),
          passed: Boolean(row.passed),
          forced: Boolean(row.forced),
          status: String(row.status ?? ""),
          issues: Array.isArray(row.issues)
            ? row.issues.map((s) => String(s).trim()).filter(Boolean)
            : [],
          error: row.error != null ? String(row.error) : null,
        } satisfies OpenfoamPrimaryReviewHistoryEntry;
      })
      .filter((e): e is OpenfoamPrimaryReviewHistoryEntry => Boolean(e?.at));
  } catch {
    return [];
  }
}

/** Appends a primary review attempt to stored history (keeps last 20). */
function appendPrimaryReviewHistory(
  existingJson: string | null,
  entry: OpenfoamPrimaryReviewHistoryEntry
): string {
  const list = parsePrimaryReviewHistory(existingJson);
  list.push(entry);
  return JSON.stringify(list.slice(-20));
}

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

/** Whether the user may upload a revised .zip for another primary review. */
export function canRetryOpenfoamPrimaryReview(row: OpenfoamRequest): boolean {
  const count = row.primary_review_attempt_count ?? 0;
  if (count >= OPENFOAM_PRIMARY_REVIEW_MAX_ATTEMPTS) return false;
  return row.status === "primary_failed" || row.status === "primary_error";
}

const TERMINAL_OPENFOAM_JOB_STATUSES = new Set(["succeeded", "failed", "timed_out", "cancelled"]);

/** Whether the user may submit a new request with the same parameters as a finished run. */
export function canRerunOpenfoamRequest(row: OpenfoamRequest, job: OpenfoamJob | null): boolean {
  if (row.status !== "approved" || !job) return false;
  return TERMINAL_OPENFOAM_JOB_STATUSES.has(job.status);
}

/** Formats a request for API responses. */
export function formatOpenfoamRequestForApi(row: OpenfoamRequest, job: OpenfoamJob | null = null): OpenfoamRequestApiModel {
  const attemptCount = row.primary_review_attempt_count ?? 0;
  const presentation = resolveOpenfoamRequestStatusPresentation(row, job?.status ?? null);
  const failureCategory = (job?.failure_category as OpenfoamFailureCategory | null) ?? null;
  const hasOutput =
    Boolean(job?.output_r2_key) &&
    (job?.status === "succeeded" || job?.status === "failed" || job?.status === "timed_out");

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
    openfoam_job_id: row.openfoam_job_id,
    reviewed_at: row.reviewed_at,
    review_message: row.review_message,
    created_at: row.created_at,
    primary_review_passed: Boolean(row.primary_review_passed),
    primary_review_forced: Boolean(row.primary_review_forced),
    primary_review_issues: parsePrimaryReviewIssues(row.primary_review_issues),
    primary_review_error: row.primary_review_error?.trim() || null,
    primary_review_attempt_count: attemptCount,
    primary_review_max_attempts: OPENFOAM_PRIMARY_REVIEW_MAX_ATTEMPTS,
    primary_review_can_retry: canRetryOpenfoamPrimaryReview(row),
    status_badge: presentation.status_badge,
    status_display: presentation.status_display,
    openfoam_job_status: presentation.openfoam_job_status,
    input_sha256: row.input_sha256 ?? null,
    primary_review_model: row.primary_review_model?.trim() || null,
    primary_review_history: parsePrimaryReviewHistory(row.primary_review_history),
    execution_failure_category: failureCategory,
    execution_failure_message: failureCategory
      ? openfoamFailureCategoryUserMessage(failureCategory)
      : null,
    has_output_download: hasOutput,
    can_rerun: canRerunOpenfoamRequest(row, job),
    openfoam_ami_id: job?.openfoam_ami_id ?? null,
    openfoam_solver_version: job?.openfoam_solver_version ?? null,
    output_sha256: job?.output_sha256 ?? null,
    job_launched_at: job?.launched_at ?? null,
    job_finished_at: job?.finished_at ?? null,
  };
}

function resolveOpenfoamRequestStatusPresentation(
  row: OpenfoamRequest,
  jobStatus: OpenfoamJobStatus | null
): {
  status_display: string;
  status_badge: OpenfoamRequestApiModel["status_badge"];
  openfoam_job_status: OpenfoamJobStatus | null;
} {
  if (row.status === "approved" && jobStatus) {
    if (jobStatus === "succeeded") {
      return { status_display: "完了_成功", status_badge: "execution_succeeded", openfoam_job_status: jobStatus };
    }
    if (jobStatus === "failed" || jobStatus === "timed_out") {
      return { status_display: "完了_失敗", status_badge: "execution_failed", openfoam_job_status: jobStatus };
    }
    if (jobStatus === "running") {
      return { status_display: "実行中", status_badge: "execution_running", openfoam_job_status: jobStatus };
    }
    if (jobStatus === "launching") {
      return {
        status_display: "プロビジョニング中",
        status_badge: "execution_running",
        openfoam_job_status: jobStatus,
      };
    }
    if (jobStatus === "pending") {
      return { status_display: "キュー待ち", status_badge: "execution_queued", openfoam_job_status: jobStatus };
    }
    if (jobStatus === "cancelled") {
      return { status_display: "キャンセル", status_badge: "cancelled", openfoam_job_status: jobStatus };
    }
  }

  return {
    status_display: REQUEST_STATUS_LABELS[row.status] ?? row.status,
    status_badge: row.status,
    openfoam_job_status: jobStatus,
  };
}

/** Formats a request with linked OpenFOAM job execution status. */
export async function formatOpenfoamRequestForApiEnriched(
  db: D1Database,
  row: OpenfoamRequest
): Promise<OpenfoamRequestApiModel> {
  const job = row.openfoam_job_id ? await getOpenfoamJobById(db, row.openfoam_job_id) : null;
  return formatOpenfoamRequestForApi(row, job);
}

/** Returns a human-readable status label. */
export function openfoamRequestStatusLabel(status: OpenfoamRequestStatus): string {
  return REQUEST_STATUS_LABELS[status] ?? status;
}

/** Validates max runtime hours for a request. */
export function validateOpenfoamRequestMaxRuntimeHours(hours: number): string | null {
  if (!Number.isFinite(hours) || hours < 1 || hours > OPENFOAM_JOB_MAX_RUNTIME_HOURS) {
    return `最大実行時間は 1〜${OPENFOAM_JOB_MAX_RUNTIME_HOURS} 時間で指定してください`;
  }
  return null;
}

/** Fetches a request by ID. */
export async function getOpenfoamRequestById(db: D1Database, id: string): Promise<OpenfoamRequest | null> {
  return db.prepare(`SELECT * FROM sim_openfoam_requests WHERE id = ?`).bind(id).first<OpenfoamRequest>();
}

/** Lists pending approval requests (newest first). */
export async function listPendingOpenfoamRequests(db: D1Database, limit = 50): Promise<OpenfoamRequest[]> {
  const result = await db
    .prepare(
      `SELECT * FROM sim_openfoam_requests
       WHERE status = 'pending_approval'
       ORDER BY created_at ASC
       LIMIT ?`
    )
    .bind(limit)
    .all<OpenfoamRequest>();
  return result.results ?? [];
}

/** Lists recent requests for a user. */
export async function listOpenfoamRequestsForUser(
  db: D1Database,
  userId: string,
  limit = 30
): Promise<OpenfoamRequest[]> {
  const result = await db
    .prepare(
      `SELECT * FROM sim_openfoam_requests
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ?`
    )
    .bind(userId, limit)
    .all<OpenfoamRequest>();
  return result.results ?? [];
}

/** Lists recent requests for admin review. */
export async function listOpenfoamRequestsAdmin(db: D1Database, limit = 50): Promise<OpenfoamRequest[]> {
  const result = await db
    .prepare(`SELECT * FROM sim_openfoam_requests ORDER BY created_at DESC LIMIT ?`)
    .bind(limit)
    .all<OpenfoamRequest>();
  return result.results ?? [];
}

/** Creates an OpenFOAM simulation request (initial status: primary_reviewing). */
export async function createOpenfoamRequest(
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
    inputSha256?: string | null;
    notes: string | null;
    createdAt: string;
    status?: OpenfoamRequestStatus;
    primaryReviewPassed?: boolean;
    primaryReviewForced?: boolean;
    primaryReviewIssues?: string[];
    primaryReviewError?: string | null;
  }
): Promise<OpenfoamRequest> {
  const sizing = pickEc2InstanceType(data.mpiProcesses);
  const issues = data.primaryReviewIssues ?? [];
  const issuesJson = issues.length > 0 ? JSON.stringify(issues) : null;
  const status = data.status ?? "primary_reviewing";
  const primaryReviewPassed = data.primaryReviewPassed ?? false;
  const primaryReviewForced = data.primaryReviewForced ?? false;
  const primaryReviewError = data.primaryReviewError?.trim() || null;

  await db
    .prepare(
      `INSERT INTO sim_openfoam_requests (
        id, user_id, title, desired_date, max_runtime_hours, mpi_processes,
        ec2_instance_type, input_r2_key, input_filename, input_size_bytes,
        notes, status, created_at,
        primary_review_passed, primary_review_forced, primary_review_issues,
        primary_review_error, primary_review_attempt_count, input_sha256
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`
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
      primaryReviewError,
      data.inputSha256 ?? null
    )
    .run();

  const row = await getOpenfoamRequestById(db, data.id);
  if (!row) throw new Error("OpenFOAM 依頼の作成に失敗しました");
  return row;
}

/** Persists primary review outcome for a request. */
export async function applyOpenfoamPrimaryReviewResult(
  db: D1Database,
  requestId: string,
  data: {
    status: Extract<OpenfoamRequestStatus, "primary_failed" | "primary_error" | "pending_approval">;
    primaryReviewPassed: boolean;
    primaryReviewForced: boolean;
    primaryReviewIssues: string[];
    primaryReviewError: string | null;
    reviewModel: string | null;
  }
): Promise<void> {
  const row = await getOpenfoamRequestById(db, requestId);
  if (!row) return;

  const issuesJson =
    data.primaryReviewIssues.length > 0 ? JSON.stringify(data.primaryReviewIssues) : null;

  const historyEntry: OpenfoamPrimaryReviewHistoryEntry = {
    at: new Date().toISOString(),
    model: data.reviewModel?.trim() || "unknown",
    passed: data.primaryReviewPassed,
    forced: data.primaryReviewForced,
    status: data.status,
    issues: data.primaryReviewIssues,
    error: data.primaryReviewError,
  };
  const historyJson = appendPrimaryReviewHistory(row.primary_review_history, historyEntry);

  await db
    .prepare(
      `UPDATE sim_openfoam_requests
       SET status = ?,
           primary_review_passed = ?,
           primary_review_forced = ?,
           primary_review_issues = ?,
           primary_review_error = ?,
           primary_review_attempt_count = primary_review_attempt_count + 1,
           primary_review_model = ?,
           primary_review_history = ?
       WHERE id = ? AND status = 'primary_reviewing'`
    )
    .bind(
      data.status,
      data.primaryReviewPassed ? 1 : 0,
      data.primaryReviewForced ? 1 : 0,
      issuesJson,
      data.primaryReviewError,
      data.reviewModel,
      historyJson,
      requestId
    )
    .run();
}

/** Sends Discord webhook + mentions when a request reaches secondary review. */
export async function sendOpenfoamPendingApprovalDiscordNotification(
  env: Env,
  db: D1Database,
  requestId: string
): Promise<void> {
  const row = await getOpenfoamRequestById(db, requestId);
  if (!row || row.status !== "pending_approval") return;

  const webhookUrl = await resolveSimDiscordWebhookUrl(db, env);
  const mentionIds = await listFdsDiscordMentionUserIds(db);
  const base = env.OAUTH_REDIRECT_BASE?.trim().replace(/\/$/, "") || "https://s.mmh-virtual.jp";
  const apiModel = formatOpenfoamRequestForApi(row);

  await notifyOpenfoamSecondaryReviewPending(
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
export async function runOpenfoamPrimaryReviewJob(
  env: Env,
  db: D1Database,
  params: {
    requestId: string;
    caseText: string;
    filename: string;
    mpiProcesses: number;
    maxRuntimeHours: number;
    forceSecondary: boolean;
  }
): Promise<void> {
  const { requestId, caseText, filename, mpiProcesses, maxRuntimeHours, forceSecondary } = params;

  try {
    const review = await reviewOpenfoamInputWithGemini(env, caseText, {
      filename,
      mpiProcesses,
      maxRuntimeHours,
    });

    if (!review.passed && !forceSecondary) {
      await applyOpenfoamPrimaryReviewResult(db, requestId, {
        status: "primary_failed",
        primaryReviewPassed: false,
        primaryReviewForced: false,
        primaryReviewIssues: review.issues,
        primaryReviewError: null,
        reviewModel: review.model,
      });
      return;
    }

    const forced = !review.passed && forceSecondary;
    await applyOpenfoamPrimaryReviewResult(db, requestId, {
      status: "pending_approval",
      primaryReviewPassed: review.passed,
      primaryReviewForced: forced,
      primaryReviewIssues: forced ? review.issues : [],
      primaryReviewError: null,
      reviewModel: review.model,
    });
    await sendOpenfoamPendingApprovalDiscordNotification(env, db, requestId);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "一次審査（AI）の処理に失敗しました";
    console.error("OpenFOAM primary review job failed:", requestId, message);
    await applyOpenfoamPrimaryReviewResult(db, requestId, {
      status: "primary_error",
      primaryReviewPassed: false,
      primaryReviewForced: false,
      primaryReviewIssues: [],
      primaryReviewError: message,
      reviewModel: null,
    });
  }
}

/** Moves a primary_failed request to secondary review (staff queue) without re-running AI. */
export async function forceSecondaryOpenfoamRequest(
  db: D1Database,
  requestId: string,
  userId: string
): Promise<OpenfoamRequest> {
  const row = await getOpenfoamRequestById(db, requestId);
  if (!row || row.user_id !== userId) {
    throw new Error("依頼が見つかりません");
  }
  if (row.status !== "primary_failed" && row.status !== "primary_error") {
    throw new Error("この依頼は二次審査へ進められません");
  }

  await db
    .prepare(
      `UPDATE sim_openfoam_requests
       SET status = 'pending_approval', primary_review_forced = 1
       WHERE id = ? AND user_id = ? AND status IN ('primary_failed', 'primary_error')`
    )
    .bind(requestId, userId)
    .run();

  const updated = await getOpenfoamRequestById(db, requestId);
  if (!updated) throw new Error("依頼の更新に失敗しました");
  return updated;
}

/** Replaces input file and re-queues primary review (within attempt limit). */
export async function retryOpenfoamPrimaryReview(
  db: D1Database,
  requestId: string,
  userId: string,
  data: {
    inputR2Key: string;
    inputFilename: string;
    inputSizeBytes: number;
    inputSha256?: string | null;
  }
): Promise<OpenfoamRequest> {
  const row = await getOpenfoamRequestById(db, requestId);
  if (!row || row.user_id !== userId) {
    throw new Error("依頼が見つかりません");
  }
  if (!canRetryOpenfoamPrimaryReview(row)) {
    throw new Error(
      `一次審査の再審は最大 ${OPENFOAM_PRIMARY_REVIEW_MAX_ATTEMPTS - 1} 回までです。二次審査へ強制申請するか、内容を見直してください`
    );
  }

  const result = await db
    .prepare(
      `UPDATE sim_openfoam_requests
       SET status = 'primary_reviewing',
           input_r2_key = ?,
           input_filename = ?,
           input_size_bytes = ?,
           input_sha256 = ?,
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
      data.inputSha256 ?? null,
      requestId,
      userId,
      OPENFOAM_PRIMARY_REVIEW_MAX_ATTEMPTS
    )
    .run();

  if (!result.meta.changes) {
    throw new Error("再審を開始できませんでした");
  }

  const updated = await getOpenfoamRequestById(db, requestId);
  if (!updated) throw new Error("依頼の更新に失敗しました");
  return updated;
}

/** Marks a request as approved and links the created job. */
export async function markOpenfoamRequestApproved(
  db: D1Database,
  requestId: string,
  fdsJobId: string,
  reviewedByUserId: string,
  reviewedAt: string
): Promise<void> {
  await db
    .prepare(
      `UPDATE sim_openfoam_requests
       SET status = 'approved', openfoam_job_id = ?, reviewed_by_user_id = ?, reviewed_at = ?
       WHERE id = ? AND status = 'pending_approval'`
    )
    .bind(fdsJobId, reviewedByUserId, reviewedAt, requestId)
    .run();
}

/** Rejects a pending request. */
export async function markOpenfoamRequestRejected(
  db: D1Database,
  requestId: string,
  reviewedByUserId: string,
  reviewedAt: string,
  message: string | null
): Promise<void> {
  await db
    .prepare(
      `UPDATE sim_openfoam_requests
       SET status = 'rejected', reviewed_by_user_id = ?, reviewed_at = ?, review_message = ?
       WHERE id = ? AND status = 'pending_approval'`
    )
    .bind(reviewedByUserId, reviewedAt, message, requestId)
    .run();
}

const OPENFOAM_INPUT_REPLACEABLE_STATUSES: OpenfoamRequestStatus[] = [
  "primary_reviewing",
  "primary_failed",
  "primary_error",
  "pending_approval",
  "rejected",
];

/** Returns whether staff may replace the request input .zip file. */
export function canStaffReplaceOpenfoamRequestInput(status: OpenfoamRequestStatus): boolean {
  return OPENFOAM_INPUT_REPLACEABLE_STATUSES.includes(status);
}

/** Replaces request input .zip by staff and re-queues primary review. */
export async function replaceOpenfoamRequestInputByStaff(
  db: D1Database,
  requestId: string,
  data: {
    inputR2Key: string;
    inputFilename: string;
    inputSizeBytes: number;
    inputSha256?: string | null;
  }
): Promise<OpenfoamRequest> {
  const row = await getOpenfoamRequestById(db, requestId);
  if (!row) {
    throw new Error("依頼が見つかりません");
  }
  if (!canStaffReplaceOpenfoamRequestInput(row.status)) {
    throw new Error("この依頼の入力ファイルは置き換えできません");
  }

  const result = await db
    .prepare(
      `UPDATE sim_openfoam_requests
       SET status = 'primary_reviewing',
           input_r2_key = ?,
           input_filename = ?,
           input_size_bytes = ?,
           input_sha256 = ?,
           primary_review_passed = 0,
           primary_review_forced = 0,
           primary_review_issues = NULL,
           primary_review_error = NULL,
           reviewed_by_user_id = NULL,
           reviewed_at = NULL,
           review_message = NULL
       WHERE id = ?
         AND status IN ('primary_reviewing', 'primary_failed', 'primary_error', 'pending_approval', 'rejected')`
    )
    .bind(
      data.inputR2Key,
      data.inputFilename,
      data.inputSizeBytes,
      data.inputSha256 ?? null,
      requestId
    )
    .run();

  if (!result.meta.changes) {
    throw new Error("入力ファイルの置き換えに失敗しました");
  }

  const updated = await getOpenfoamRequestById(db, requestId);
  if (!updated) throw new Error("依頼の更新に失敗しました");
  return updated;
}
