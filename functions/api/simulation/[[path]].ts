/**
 * シミュレーション API ルーター（予約・管理）
 */

import type { Env } from "../../lib/types";
import { createId } from "../../lib/types";
import { getDb } from "../../lib/db";
import { requireUser } from "../../lib/auth";
import { canUserAccessApp } from "../../lib/apps";
import {
  getEarliestBookableDate,
  getAdminEarliestBookableDate,
  getTodayJst,
  addDays,
  isDateBookable,
  isAdminDateBookable,
  type SimScale,
} from "../../lib/simulation/slots";
import {
  acceptReservation,
  setGoogleEventId,
  createReservation,
  createMember,
  deleteMember,
  formatMemberLabel,
  getAllMembers,
  getAllReservations,
  getAvailableMemberIdsOnDate,
  getAvailabilityInRange,
  getMemberById,
  getReservationById,
  getReservationsInRange,
  getUserUpcomingReservations,
  getUserRecentPastReservations,
  hasUserReservationsBeforeDate,
  getUserOlderReservations,
  getAppliedReservationCountsBySimulator,
  type ReservationListCursor,
  hasStaffOnDate,
  setMemberAvailability,
  toggleMemberAvailability,
  updateMemberColor,
  updateMemberDiscordUserId,
  updateReservationAdmin,
  updateReservationContent,
  deleteReservation,
  updateReservationPrintVideo,
  clearReservationPrintVideo,
  getUserPrintVideos,
  type Member,
  type Reservation,
} from "../../lib/simulation/reservations";
import { adminRescheduleReservation } from "../../lib/simulation/reschedule";
import { retryFailedReservation } from "../../lib/simulation/retry-reservation";
import {
  checkShiftRemovalBlocked,
  checkShiftRemovalBlockedForDates,
  isMemberAvailableOnDate,
  isValidDiscordUserId,
  type ShiftBlockReservation,
} from "../../lib/simulation/shift-guard";
import {
  buildSimulationAdminUrl,
  notifyReservationApplication,
  notifyReservationModified,
} from "../../lib/simulation/discord";
import { getOAuthRedirectBase } from "../../lib/oauth";
import {
  createCalendarEventForReservation,
  deleteCalendarEvent,
  testGoogleCalendarConnection,
} from "../../lib/simulation/google-calendar";
import {
  canEditReservation,
  validateGuestStaffAvailability,
  validateReservationContentFields,
  validateReservationSlot,
  type ReservationContentInput,
} from "../../lib/simulation/reservation-edit";
import { isValidColorIndex } from "../../lib/simulation/shifts";
import { isValidHomeroom, gradeFromHomeroom } from "../../lib/simulation/homeroom";
import {
  getSimUserProfile,
  isSimProfileComplete,
} from "../../lib/simulation/sim-profile";
import {
  abortUpload,
  completeUpload,
  initiateUpload,
  simpleUpload,
  uploadPart,
  verifyR2Key,
  streamSimFile,
} from "../../lib/simulation/upload";
import {
  countReservationsBySimulatorId,
  createSimulator,
  deleteSimulator,
  formatSimulatorForApi,
  getAllSimulators,
  getSimulatorById,
  updateSimulatorImage,
  updateSimulatorName,
  updateSimulatorCapabilities,
  updateSimulatorStatus,
  updateSimulatorDailyCapacity,
  getSimulatorBookingError,
  validateSimulatorDailyCapacityInput,
  type Simulator,
} from "../../lib/simulation/simulators";
import { validateSimulatorCapabilitiesInput, parseSimulatorCapabilities } from "../../lib/simulation/simulator-capabilities";
import { validateSimulatorStatusInput, type SimulatorStatus, isSimulatorBookable, normalizeSimulatorStatus } from "../../lib/simulation/simulator-status";
import {
  streamSimulatorImage,
  uploadSimulatorImage,
} from "../../lib/simulation/simulator-image";
import {
  getDateAvailability,
  validateSimulatorReservationSlot,
} from "../../lib/simulation/availability";
import {
  checkSimulatorShiftRemovalBlocked,
  checkSimulatorShiftRemovalBlockedForDates,
} from "../../lib/simulation/simulator-shift-guard";
import {
  getSimulatorAvailabilityInRange,
  isSimulatorAvailableOnDate,
  setSimulatorAvailability,
  toggleSimulatorAvailability,
} from "../../lib/simulation/simulator-availability";
import { error, json } from "../../lib/simulation/response";
import {
  getPrintVideoStoragePath,
  getSimDiscordWebhookUrlFromDb,
  getFdsDiscordMentionUserIdsFromDb,
  resolveSimDiscordWebhookUrl,
  setSimDiscordWebhookUrl,
  setFdsDiscordMentionUserIds,
  setPrintVideoStoragePath,
  getManagementAccessibleGroupRoots,
  validatePrintVideoStoragePathForUser,
} from "../../lib/simulation/sim-app-settings";
import {
  deletePrintVideoFile,
  resolveRequestPrintVideo,
  uploadPrintVideoToStorage,
  validatePrintVideoFilename,
} from "../../lib/simulation/result-video";
import { parseLogicalPath } from "../../lib/storage/keys";
import { streamStorageFile } from "../../lib/storage/operations";
import { Ec2AmiNotReadyError } from "../../lib/aws/ec2";
import { listDirectory } from "../../lib/storage/list";
import { authorizeStoragePath } from "../../lib/storage/permissions";
import { handleFdsJobCallback } from "../../lib/simulation/fds-callback";
import { syncFdsJobArtifacts } from "../../lib/simulation/fds-job-artifacts";
import {
  cancelFdsJob,
  fetchFdsAmiStatus,
  fetchLiveEc2StateForJob,
  getFdsAwsConfig,
  launchFdsJobOnEc2,
  syncFdsJobFromEc2,
} from "../../lib/simulation/fds-ec2-runner";
import {
  createFdsJob,
  deleteFdsJob,
  FDS_DEFAULT_INSTANCE_TYPE,
  FDS_JOB_MAX_RUNTIME_HOURS,
  FDS_MAX_INPUT_BYTES,
  formatFdsJobForApi,
  generateFdsInputR2Key,
  getFdsJobById,
  listFdsJobs,
  updateFdsJobStatus,
  validateFdsFilename,
  type FdsJob,
} from "../../lib/simulation/fds-jobs";
import {
  clampMpiProcesses,
  FDS_MAX_MPI_PROCESSES,
  FDS_MIN_MPI_PROCESSES,
  pickEc2InstanceType,
} from "../../lib/simulation/fds-instance-sizing";
import {
  buildEc2InstanceCatalog,
  registerEc2InstanceAsSimulator,
} from "../../lib/simulation/ec2-simulator-catalog";
import {
  createFdsRequest,
  formatFdsRequestForApiEnriched,
  forceSecondaryFdsRequest,
  getFdsRequestById,
  listFdsRequestsAdmin,
  listFdsRequestsForUser,
  listPendingFdsRequests,
  markFdsRequestApproved,
  markFdsRequestRejected,
  replaceFdsRequestInputByStaff,
  retryFdsPrimaryReview,
  runFdsPrimaryReviewJob,
  sendFdsPendingApprovalDiscordNotification,
  FDS_PRIMARY_REVIEW_MAX_ATTEMPTS,
  validateFdsRequestMaxRuntimeHours,
  canStaffReplaceFdsRequestInput,
} from "../../lib/simulation/fds-requests";
import {
  assertFdsRequestChatAccess,
  createFdsRequestMessage,
  FdsRequestChatAccessError,
  getFdsRequestAttachmentForDownload,
  listFdsRequestMessagesForApi,
  postFdsRequestSystemChatMessage,
} from "../../lib/simulation/fds-request-chat";
import {
  extractFdsTextForReview,
} from "../../lib/simulation/fds-primary-review";
import { sha256HexFromBuffer } from "../../lib/simulation/fds-content-hash";
import { estimateFdsRunCost, estimateFdsStorage } from "../../lib/simulation/fds-cost-estimate";
import { createFdsRerunFromRequest } from "../../lib/simulation/fds-rerun";
import { handleOpenfoamJobCallback } from "../../lib/simulation/openfoam-callback";
import { syncOpenfoamJobArtifacts } from "../../lib/simulation/openfoam-job-artifacts";
import {
  cancelOpenfoamJob,
  fetchOpenfoamAmiStatus,
  fetchLiveEc2StateForOpenfoamJob,
  getOpenfoamAwsConfig,
  launchOpenfoamJobOnEc2,
  syncOpenfoamJobFromEc2,
} from "../../lib/simulation/openfoam-ec2-runner";
import {
  createOpenfoamJob,
  OPENFOAM_DEFAULT_INSTANCE_TYPE,
  OPENFOAM_JOB_MAX_RUNTIME_HOURS,
  OPENFOAM_MAX_INPUT_BYTES,
  formatOpenfoamJobForApi,
  generateOpenfoamInputR2Key,
  getOpenfoamJobById,
  listOpenfoamJobs,
  updateOpenfoamJobStatus,
  validateOpenfoamFilename,
} from "../../lib/simulation/openfoam-jobs";
import {
  clampMpiProcesses as clampOpenfoamMpiProcesses,
  FDS_MAX_MPI_PROCESSES as OPENFOAM_MAX_MPI_PROCESSES,
  FDS_MIN_MPI_PROCESSES as OPENFOAM_MIN_MPI_PROCESSES,
  pickEc2InstanceType as pickOpenfoamEc2InstanceType,
} from "../../lib/simulation/openfoam-instance-sizing";
import {
  createOpenfoamRequest,
  formatOpenfoamRequestForApiEnriched,
  forceSecondaryOpenfoamRequest,
  getOpenfoamRequestById,
  listOpenfoamRequestsAdmin,
  listOpenfoamRequestsForUser,
  listPendingOpenfoamRequests,
  markOpenfoamRequestApproved,
  markOpenfoamRequestRejected,
  replaceOpenfoamRequestInputByStaff,
  retryOpenfoamPrimaryReview,
  runOpenfoamPrimaryReviewJob,
  sendOpenfoamPendingApprovalDiscordNotification,
  OPENFOAM_PRIMARY_REVIEW_MAX_ATTEMPTS,
  validateOpenfoamRequestMaxRuntimeHours,
  canStaffReplaceOpenfoamRequestInput,
} from "../../lib/simulation/openfoam-requests";
import {
  assertOpenfoamRequestChatAccess,
  createOpenfoamRequestMessage,
  OpenfoamRequestChatAccessError,
  getOpenfoamRequestAttachmentForDownload,
  listOpenfoamRequestMessagesForApi,
} from "../../lib/simulation/openfoam-request-chat";
import { extractOpenfoamTextForReview } from "../../lib/simulation/openfoam-primary-review";
import { estimateOpenfoamRunCost, estimateOpenfoamStorage } from "../../lib/simulation/openfoam-cost-estimate";
import { createOpenfoamRerunFromRequest } from "../../lib/simulation/openfoam-rerun";

import { verifyFirebaseIdToken } from "../../lib/simulation/firebase-id-token";
import {
  assertSimPhoneE164Available,
  checkAndIncrementDailyPhoneVerificationAttempt,
  completePhoneVerification,
  getActiveConsentVersion,
  getSimPhoneStatus,
  getSimPhoneUserRow,
  insertPhoneVerificationLog,
  listSimPhoneVerificationUsers,
  parseJapanPhoneE164Input,
  PHONE_ALREADY_REGISTERED_CODE,
  recordPhoneVerificationConsent,
  requireSimPhoneVerified,
  revokeSimPhoneVerificationForUser,
  sha256Hex,
  SIM_PHONE_DAILY_ATTEMPT_LIMIT,
  SIM_PHONE_DAILY_LIMIT_CODE,
  SIM_PHONE_NOT_VERIFIED_CODE,
  SIM_PHONE_VERIFICATION_TTL_MS,
  simPhoneDailyLimitError,
} from "../../lib/simulation/sim-phone-verification";

const RESERVATION_APP = "simulation-request";
const MANAGEMENT_APP = "simulation-management";

/** Builds a safe Content-Disposition attachment header value. */
function attachmentFilename(filename: string): string {
  const safe = filename.replace(/[^\w.\-()]/g, "_").slice(0, 180) || "download";
  return `attachment; filename="${safe}"`;
}

/** Parses chat message body and optional file from a request. */
async function parseFdsChatMessageRequest(request: Request): Promise<{
  body: string;
  file: File | null;
}> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const body = String(formData.get("body") ?? "").trim();
    const fileEntry = formData.get("file");
    const file = fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null;
    return { body, file };
  }

  const data = await request.json<{ body?: string }>().catch(() => ({ body: "" }));
  return { body: String(data.body ?? "").trim(), file: null };
}

/** Handles FDS request chat message listing. */
async function handleFdsRequestChatList(
  env: Env,
  db: D1Database,
  request: Request,
  params: {
    requestId: string;
    userId: string;
    apiPrefix: string;
  }
): Promise<Response> {
  try {
    const access = await assertFdsRequestChatAccess(db, params.userId, params.requestId);
    const url = new URL(request.url);
    const after = url.searchParams.get("after");
    const limitRaw = parseInt(url.searchParams.get("limit") ?? "", 10);
    const limit = Number.isFinite(limitRaw) ? limitRaw : undefined;

    const messages = await listFdsRequestMessagesForApi(env, db, {
      requestId: params.requestId,
      viewerUserId: params.userId,
      requestOwnerUserId: access.request.user_id,
      apiPrefix: params.apiPrefix,
      after,
      limit,
    });
    return json({ messages });
  } catch (err) {
    if (err instanceof FdsRequestChatAccessError) {
      return error(err.message, 404);
    }
    const message = err instanceof Error ? err.message : "メッセージの取得に失敗しました";
    return error(message, 400);
  }
}

/** Handles posting a FDS request chat message. */
async function handleFdsRequestChatPost(
  env: Env,
  db: D1Database,
  request: Request,
  params: {
    requestId: string;
    userId: string;
    apiPrefix: string;
  }
): Promise<Response> {
  try {
    const access = await assertFdsRequestChatAccess(db, params.userId, params.requestId);
    const { body, file } = await parseFdsChatMessageRequest(request);

    const row = await createFdsRequestMessage(env, db, {
      requestId: params.requestId,
      senderUserId: params.userId,
      body,
      attachment: file
        ? {
            buffer: await file.arrayBuffer(),
            filename: file.name.trim(),
            contentType: file.type || "application/octet-stream",
            sizeBytes: file.size,
          }
        : null,
    });

    const messages = await listFdsRequestMessagesForApi(env, db, {
      requestId: params.requestId,
      viewerUserId: params.userId,
      requestOwnerUserId: access.request.user_id,
      apiPrefix: params.apiPrefix,
      limit: 200,
    });
    const created = messages.find((m) => m.id === row.id);

    return json({ message: created ?? messages[messages.length - 1] }, 201);
  } catch (err) {
    if (err instanceof FdsRequestChatAccessError) {
      return error(err.message, 404);
    }
    const message = err instanceof Error ? err.message : "メッセージの送信に失敗しました";
    return error(message, 400);
  }
}

/** Handles chat attachment download. */
async function handleFdsRequestChatAttachmentDownload(
  env: Env,
  db: D1Database,
  params: {
    requestId: string;
    messageId: string;
    userId: string;
  }
): Promise<Response> {
  try {
    const resolved = await getFdsRequestAttachmentForDownload(env, db, params);
    const obj = await env.FILES.get(resolved.r2Key);
    if (!obj) return error("添付ファイルが見つかりません", 410);
    return new Response(obj.body, {
      headers: {
        "Content-Type": resolved.contentType,
        "Content-Disposition": attachmentFilename(resolved.filename),
      },
    });
  } catch (err) {
    if (err instanceof FdsRequestChatAccessError) {
      return error(err.message, 404);
    }
    const message = err instanceof Error ? err.message : "添付ファイルの取得に失敗しました";
    const status = message.includes("期限") ? 410 : 400;
    return error(message, status);
  }
}

/** Syncs EC2/R2 state and formats an FDS job for the admin API. */

/** Handles OpenFOAM request chat message listing. */
async function handleOpenfoamRequestChatList(
  env: Env,
  db: D1Database,
  request: Request,
  params: { requestId: string; userId: string; apiPrefix: string }
): Promise<Response> {
  try {
    const access = await assertOpenfoamRequestChatAccess(db, params.userId, params.requestId);
    const url = new URL(request.url);
    const after = url.searchParams.get("after");
    const limitRaw = parseInt(url.searchParams.get("limit") ?? "", 10);
    const limit = Number.isFinite(limitRaw) ? limitRaw : undefined;
    const messages = await listOpenfoamRequestMessagesForApi(env, db, {
      requestId: params.requestId,
      viewerUserId: params.userId,
      requestOwnerUserId: access.request.user_id,
      apiPrefix: params.apiPrefix,
      after,
      limit,
    });
    return json({ messages });
  } catch (err) {
    if (err instanceof OpenfoamRequestChatAccessError) return error(err.message, 404);
    return error(err instanceof Error ? err.message : "メッセージの取得に失敗しました", 400);
  }
}

async function handleOpenfoamRequestChatPost(
  env: Env,
  db: D1Database,
  request: Request,
  params: { requestId: string; userId: string; apiPrefix: string }
): Promise<Response> {
  try {
    const access = await assertOpenfoamRequestChatAccess(db, params.userId, params.requestId);
    const { body, file } = await parseFdsChatMessageRequest(request);
    const row = await createOpenfoamRequestMessage(env, db, {
      requestId: params.requestId,
      senderUserId: params.userId,
      body,
      attachment: file
        ? {
            buffer: await file.arrayBuffer(),
            filename: file.name.trim(),
            contentType: file.type || "application/octet-stream",
            sizeBytes: file.size,
          }
        : null,
    });
    const messages = await listOpenfoamRequestMessagesForApi(env, db, {
      requestId: params.requestId,
      viewerUserId: params.userId,
      requestOwnerUserId: access.request.user_id,
      apiPrefix: params.apiPrefix,
      limit: 200,
    });
    const created = messages.find((m) => m.id === row.id);
    return json({ message: created ?? messages[messages.length - 1] }, 201);
  } catch (err) {
    if (err instanceof OpenfoamRequestChatAccessError) return error(err.message, 404);
    return error(err instanceof Error ? err.message : "メッセージの送信に失敗しました", 400);
  }
}

async function handleOpenfoamRequestChatAttachmentDownload(
  env: Env,
  db: D1Database,
  params: { requestId: string; messageId: string; userId: string }
): Promise<Response> {
  try {
    await assertOpenfoamRequestChatAccess(db, params.userId, params.requestId);
    const result = await getOpenfoamRequestAttachmentForDownload(env, params.messageId, params.userId);
    if (!result) return error("添付ファイルが見つかりません", 404);
    return new Response(result.body, {
      headers: {
        "Content-Type": result.contentType,
        "Content-Disposition": attachmentFilename(result.filename),
      },
    });
  } catch (err) {
    if (err instanceof OpenfoamRequestChatAccessError) return error(err.message, 404);
    return error(err instanceof Error ? err.message : "ダウンロードに失敗しました", 400);
  }
}

async function formatFdsJobForAdminApi(
  env: Env,
  job: FdsJob,
  options: { liveEc2?: boolean } = {}
) {
  const afterEc2 = await syncFdsJobFromEc2(env, job);
  let { job: refreshed, artifacts } = await syncFdsJobArtifacts(env, afterEc2);
  if (
    artifacts.hasOutput &&
    refreshed.status === "failed" &&
    (refreshed.status_message?.includes("完了通知") ||
      refreshed.status_message?.includes("結果 ZIP を R2"))
  ) {
    await updateFdsJobStatus(env.DB, refreshed.id, "succeeded", {
      statusMessage: "FDS の実行が完了しました",
      finishedAt: refreshed.finished_at ?? new Date().toISOString(),
    });
    refreshed = (await getFdsJobById(env.DB, refreshed.id)) ?? refreshed;
  }
  let liveEc2: { ec2_instance_state: string | null; ec2_launch_time: string | null } | undefined;
  if (options.liveEc2) {
    const snapshot = await fetchLiveEc2StateForJob(env, refreshed);
    liveEc2 = {
      ec2_instance_state: snapshot?.state ?? null,
      ec2_launch_time: snapshot?.launchTime ?? null,
    };
  }
  return formatFdsJobForApi(refreshed, artifacts, liveEc2);
}

async function formatOpenfoamJobForAdminApi(
  env: Env,
  job: import("../../lib/simulation/openfoam-jobs").OpenfoamJob,
  options: { liveEc2?: boolean } = {}
) {
  const afterEc2 = await syncOpenfoamJobFromEc2(env, job);
  let { job: refreshed, artifacts } = await syncOpenfoamJobArtifacts(env, afterEc2);
  if (
    artifacts.hasOutput &&
    refreshed.status === "failed" &&
    (refreshed.status_message?.includes("完了通知") ||
      refreshed.status_message?.includes("結果 ZIP を R2"))
  ) {
    await updateOpenfoamJobStatus(env.DB, refreshed.id, "succeeded", {
      statusMessage: "OpenFOAM の実行が完了しました",
      finishedAt: refreshed.finished_at ?? new Date().toISOString(),
    });
    refreshed = (await getOpenfoamJobById(env.DB, refreshed.id)) ?? refreshed;
  }
  let liveEc2: { ec2_instance_state: string | null; ec2_launch_time: string | null } | undefined;
  if (options.liveEc2) {
    const snapshot = await fetchLiveEc2StateForOpenfoamJob(env, refreshed);
    liveEc2 = {
      ec2_instance_state: snapshot?.state ?? null,
      ec2_launch_time: snapshot?.launchTime ?? null,
    };
  }
  return formatOpenfoamJobForApi(refreshed, artifacts, liveEc2);
}

/** Returns hashed client metadata for phone verification audit logs. */
async function phoneVerificationAuditFromRequest(request: Request): Promise<{
  ipHash: string | null;
  userAgentHash: string | null;
}> {
  const ip =
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ??
    "";
  const ua = request.headers.get("User-Agent") ?? "";
  return {
    ipHash: ip ? await sha256Hex(ip) : null,
    userAgentHash: ua ? await sha256Hex(ua) : null,
  };
}

/** Parses route segments from the catch-all path param. */
function parsePath(path: string | string[] | undefined): string[] {
  if (Array.isArray(path)) return path.filter(Boolean);
  return (path ?? "").split("/").filter(Boolean);
}

/** Returns first/last day of month for calendar queries. */
function getMonthRange(year: number, month: number): { start: string; end: string } {
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const end = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return { start, end };
}

/** Requires ScienceHUB login and app access. */
async function requireAppAccess(
  request: Request,
  env: Env,
  slug: string
): Promise<{ id: string } | Response> {
  const auth = await requireUser(request, env);
  if (auth instanceof Response) return auth;

  const db = getDb(env);
  const allowed = await canUserAccessApp(db, auth.id, slug);
  if (!allowed) {
    return error("このアプリへのアクセス権限がありません", 403);
  }

  return { id: auth.id };
}

/** Resolves print staff display label from member ID map. */
function resolvePrintStaffLabel(
  r: Reservation,
  memberMap: Map<string, Member>
): string | null {
  if (!r.sim_staff_member_id) return null;
  const member = memberMap.get(r.sim_staff_member_id);
  return member ? formatMemberLabel(member) : null;
}

/** Formats reservation for public calendar API. */
function publicCalendarReservation(
  r: Reservation,
  memberMap: Map<string, Member>,
  simulatorMap: Map<string, Simulator>
) {
  return {
    id: r.id,
    sim_scale: r.sim_scale,
    simulator_id: r.simulator_id,
    simulator_name: resolveSimulatorLabel(r, simulatorMap),
    desired_date: r.desired_date,
    status: r.status,
    title: r.title,
    sim_staff: resolvePrintStaffLabel(r, memberMap),
    retryable: r.status === "failed",
    owned: false as boolean,
  };
}

/** Formats reservation for user detail API. */
function userReservationDetail(
  r: Reservation,
  memberMap: Map<string, Member>,
  simulatorMap: Map<string, Simulator>
) {
  return {
    id: r.id,
    title: r.title,
    sim_scale: r.sim_scale,
    simulator_id: r.simulator_id,
    simulator_name: resolveSimulatorLabel(r, simulatorMap),
    simulator_capabilities: resolveSimulatorCapabilities(r, simulatorMap),
    desired_date: r.desired_date,
    status: r.status,
    purpose: r.purpose,
    purpose_other: r.purpose_other || null,
    summary: r.summary || null,
    sim_notes: r.sim_notes || null,
    sim_staff: resolvePrintStaffLabel(r, memberMap),
    status_comment: r.status_comment || null,
    stl_filename: r.stl_filename,
    stl_size_bytes: r.stl_size_bytes,
    request_result_video: Boolean(r.request_result_video),
    has_result_video: Boolean(r.result_video_storage_path),
    result_video_filename: r.result_video_filename || null,
    retryable: r.status === "failed",
    editable: canEditReservation(r) && r.status !== "failed",
    homeroom: r.homeroom,
    student_number: r.student_number,
    student_name: r.student_name,
  };
}

/** Builds a simulator ID lookup map. */
async function buildSimulatorMap(db: D1Database): Promise<Map<string, Simulator>> {
  const simulators = await getAllSimulators(db);
  return new Map(simulators.map((p) => [p.id, p]));
}

/** Resolves simulator capabilities from ID map. */
function resolveSimulatorCapabilities(
  r: Reservation,
  simulatorMap: Map<string, Simulator>
): ReturnType<typeof parseSimulatorCapabilities> | null {
  if (!r.simulator_id) return null;
  const simulator = simulatorMap.get(r.simulator_id);
  if (!simulator) return null;
  return parseSimulatorCapabilities(simulator.capabilities_json);
}

/** Resolves simulator display name from ID map. */
function resolveSimulatorLabel(
  r: Reservation,
  simulatorMap: Map<string, Simulator>
): string | null {
  if (!r.simulator_id) return null;
  const simulator = simulatorMap.get(r.simulator_id);
  return simulator?.name ?? null;
}

/** Builds a member ID lookup map. */
async function buildMemberMap(db: D1Database): Promise<Map<string, Member>> {
  const members = await getAllMembers(db);
  return new Map(members.map((m) => [m.id, m]));
}

/** Returns 409 when shift removal is blocked by existing reservations. */
function shiftBlockError(date: string, reservations: ShiftBlockReservation[]): Response {
  return error("この日には予約があるため、対応者を外せません。予約の日付を変更してください", 409, {
    code: "RESERVATIONS_ON_DATE",
    date,
    reservations,
  });
}

/** Enriches a reservation with print staff label for admin responses. */
function enrichReservationForAdmin(
  r: Reservation,
  memberMap: Map<string, Member>,
  simulatorMap: Map<string, Simulator>
) {
  return {
    ...r,
    sim_staff_label: resolvePrintStaffLabel(r, memberMap),
    simulator_name: resolveSimulatorLabel(r, simulatorMap),
    simulator_capabilities: resolveSimulatorCapabilities(r, simulatorMap),
  };
}

/** Maps availability result to API JSON (camelCase). */
function mapAvailabilityResponse(result: Awaited<ReturnType<typeof getDateAvailability>>) {
  return {
    date: result.date,
    bookable: result.bookable,
    remaining: result.remaining,
    canBook: result.can_book,
    isFull: result.is_full,
    staffAvailable: result.staff_available,
    simulatorAvailable: result.simulator_available,
    availableScales: result.available_scales,
    count: result.count,
    scales: result.scales,
    simulators: result.simulators,
  };
}

/** Returns 409 when simulator shift removal is blocked by reservations. */
function simulatorShiftBlockError(
  date: string,
  reservations: { id: string; title: string; sim_scale: string; desired_date: string; status: string }[]
): Response {
  return error("この日のシミュレーター稼働を外すには、紐づく予約をリスケしてください", 409, {
    code: "RESERVATIONS_ON_PRINTER_DATE",
    date,
    reservations,
  });
}

/** Validates simulator_id exists and is bookable for user reservations. */
async function validateSimulatorId(
  db: D1Database,
  simulatorId: string,
  options: { requireBookable?: boolean } = {}
): Promise<string | null> {
  const requireBookable = options.requireBookable !== false;
  if (!simulatorId?.trim()) return "シミュレーター機種を選択してください";
  const simulator = await getSimulatorById(db, simulatorId);
  if (!simulator) return "指定されたシミュレーターが見つかりません";
  if (requireBookable) {
    return getSimulatorBookingError(simulator);
  }
  return null;
}

/** Applies reservation content edit. */
async function applyReservationContentEdit(
  context: EventContext<Env, string, unknown>,
  reservation: Reservation,
  body: ReservationContentInput,
  options: { isUser: boolean }
): Promise<Response> {
  const { env } = context;
  const db = getDb(env);

  if (!canEditReservation(reservation)) {
    return error("この予約は修正できません", 400);
  }

  const validationError = validateReservationContentFields(body);
  if (validationError) return error(validationError);

  const dateOk = options.isUser
    ? isDateBookable(body.desired_date)
    : isAdminDateBookable(body.desired_date);
  if (!dateOk) {
    const minDate = options.isUser ? getEarliestBookableDate() : getAdminEarliestBookableDate();
    return error(`希望実施日は ${minDate} 以降を選択してください`);
  }

  const simulatorId = body.simulator_id ?? reservation.simulator_id;
  if (!simulatorId) {
    return error("シミュレーター機種を選択してください");
  }
  const simulatorError = await validateSimulatorId(db, simulatorId, { requireBookable: options.isUser });
  if (simulatorError) return error(simulatorError);

  const slotError = await validateReservationSlot(
    db,
    body.desired_date,
    body.sim_scale,
    reservation.id,
    simulatorId,
    { isAdmin: !options.isUser }
  );
  if (slotError) return error(slotError);

  if (options.isUser) {
    const staffError = await validateGuestStaffAvailability(db, body.desired_date);
    if (staffError) return error(staffError);
  }

  let stlR2Key = reservation.stl_r2_key;
  let stlFilename = reservation.stl_filename;
  let stlSizeBytes = reservation.stl_size_bytes;

  if (body.stl_r2_key) {
    if (!body.stl_filename || body.stl_size_bytes === undefined) {
      return error("ファイル情報が不完全です");
    }
    const keyExists = await verifyR2Key(env.FILES, body.stl_r2_key);
    if (!keyExists) {
      return error("ファイルが見つかりません。再度アップロードしてください");
    }
    if (body.stl_r2_key !== reservation.stl_r2_key) {
      await env.FILES.delete(reservation.stl_r2_key);
    }
    stlR2Key = body.stl_r2_key;
    stlFilename = body.stl_filename;
    stlSizeBytes = Number(body.stl_size_bytes);
  }

  const videoResolved = await resolveRequestPrintVideo(
    db,
    simulatorId,
    body.request_result_video ?? reservation.request_result_video === 1
  );
  if (!videoResolved.ok) return error(videoResolved.error);

  await deleteCalendarEvent(env, reservation.google_event_id);

  await updateReservationContent(db, reservation.id, {
    grade: gradeFromHomeroom(String(body.homeroom)),
    homeroom: String(body.homeroom),
    student_number: Number(body.student_number),
    student_name: String(body.student_name).trim(),
    title: String(body.title).trim(),
    purpose: body.purpose,
    purpose_other: body.purpose === "other" ? body.purpose_other?.trim() ?? null : null,
    summary: body.summary?.trim() || null,
    sim_notes: body.sim_notes?.trim() || null,
    sim_scale: body.sim_scale,
    simulator_id: simulatorId,
    desired_date: body.desired_date,
    request_result_video: videoResolved.value,
    stl_r2_key: stlR2Key,
    stl_filename: stlFilename,
    stl_size_bytes: stlSizeBytes,
  });

  context.waitUntil(
    (async () => {
      const webhookUrl = await resolveSimDiscordWebhookUrl(db, env);
      await notifyReservationModified(webhookUrl, buildSimulationAdminUrl(getOAuthRedirectBase(context.request, env)), {
        title: String(body.title).trim(),
        desired_date: body.desired_date,
        sim_scale: body.sim_scale,
      });
    })()
  );

  const updated = await getReservationById(db, reservation.id);
  const memberMap = await buildMemberMap(db);
  const simulatorMap = await buildSimulatorMap(db);
  return json({
    reservation: updated
      ? options.isUser
        ? userReservationDetail(updated, memberMap, simulatorMap)
        : enrichReservationForAdmin(updated, memberMap, simulatorMap)
      : null,
    message: "予約内容を修正しました。再承認をお待ちください",
  });
}

/** Loads user print profile or returns error response. */
async function requireCompletePrintProfile(
  db: D1Database,
  userId: string
): Promise<{ homeroom: string; student_number: number; student_name: string } | Response> {
  const profile = await getSimUserProfile(db, userId);
  if (!profile || !isSimProfileComplete(profile)) {
    return error("予約前にホームルーム・出席番号・名前をプロフィールに登録してください", 400, {
      code: "PRINT_PROFILE_INCOMPLETE",
    });
  }
  return {
    homeroom: profile.homeroom!,
    student_number: profile.student_number!,
    student_name: profile.student_name!.trim(),
  };
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, params, waitUntil } = context;
  const url = new URL(request.url);
  const segments = parsePath(params.path as string);
  const method = request.method;
  const db = getDb(env);
  const adminUrl = buildSimulationAdminUrl(getOAuthRedirectBase(request, env));

  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    // POST /api/simulation/fds-jobs/callback — EC2 からの完了通知（ユーザ認証なし）
    if (method === "POST" && segments[0] === "fds-jobs" && segments[1] === "callback") {
      return handleFdsJobCallback(env, request);
    }

    if (method === "POST" && segments[0] === "openfoam-jobs" && segments[1] === "callback") {
      return handleOpenfoamJobCallback(env, request);
    }

    const isAdminRoute = segments[0] === "admin";
    const isUploadRoute = segments[0] === "upload";

    const isPhoneVerificationRoute = segments[0] === "phone-verification";

    if (isUploadRoute) {
      const resAccess = await requireAppAccess(request, env, RESERVATION_APP);
      if (!(resAccess instanceof Response)) {
        // reservation app ok
      } else {
        const mgmtAccess = await requireAppAccess(request, env, MANAGEMENT_APP);
        if (mgmtAccess instanceof Response) return mgmtAccess;
      }
    } else if (isAdminRoute) {
      const mgmtAccess = await requireAppAccess(request, env, MANAGEMENT_APP);
      if (mgmtAccess instanceof Response) return mgmtAccess;
    } else if (
      segments[0] === "calendar" ||
      segments[0] === "fds-requests" ||
      segments[0] === "openfoam-requests" ||
      segments[0] === "reservations" ||
      segments[0] === "simulators" ||
      segments[0] === "result-videos" ||
      segments.length === 0
    ) {
      const resAccess = await requireAppAccess(request, env, RESERVATION_APP);
      if (resAccess instanceof Response) return resAccess;
    } else if (isPhoneVerificationRoute) {
      /* ログインユーザーのみ（アカウント設定からも利用） */
    }

    const authUser = await requireUser(request, env);
    if (authUser instanceof Response) return authUser;
    const userId = authUser.id;

    // POST /api/simulation/upload/initiate
    if (method === "POST" && segments[0] === "upload" && segments[1] === "initiate") {
      const body = await request.json<{ filename: string; size: number }>();
      if (!body.filename || !body.size) return error("filename と size が必要です");
      const result = await initiateUpload(env, body.filename, body.size);
      return json(result);
    }

    if (method === "PUT" && segments[0] === "upload" && segments[1] === "simple") {
      const r2Key = url.searchParams.get("r2Key");
      const filename = url.searchParams.get("filename");
      if (!r2Key || !filename) return error("r2Key と filename が必要です");
      const body = await request.arrayBuffer();
      const result = await simpleUpload(env, r2Key, body, filename);
      return json(result);
    }

    if (method === "PUT" && segments[0] === "upload" && segments[1] === "part") {
      const sessionId = url.searchParams.get("sessionId");
      const partNumber = parseInt(url.searchParams.get("partNumber") ?? "", 10);
      if (!sessionId || !partNumber) return error("sessionId と partNumber が必要です");
      const body = await request.arrayBuffer();
      const part = await uploadPart(env, sessionId, partNumber, body);
      return json(part);
    }

    if (method === "POST" && segments[0] === "upload" && segments[1] === "complete") {
      const body = await request.json<{ sessionId: string }>();
      if (!body.sessionId) return error("sessionId が必要です");
      const result = await completeUpload(env, body.sessionId);
      return json(result);
    }

    if (method === "DELETE" && segments[0] === "upload" && segments[1] === "abort") {
      const body = await request.json<{ sessionId: string }>();
      if (!body.sessionId) return error("sessionId が必要です");
      await abortUpload(env, body.sessionId);
      return json({ ok: true });
    }

    // GET /api/simulation/simulators
    if (method === "GET" && segments[0] === "simulators" && segments.length === 1) {
      const date = url.searchParams.get("date");
      if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return error("date が不正です");
      }

      const simulators = await getAllSimulators(db);
      const waitingCounts = await getAppliedReservationCountsBySimulator(db, date ?? undefined);
      const formatted = await Promise.all(
        simulators.map(async (simulator) => {
          const shiftAvailable = date
            ? await isSimulatorAvailableOnDate(db, simulator.id, date)
            : true;
          return {
            ...formatSimulatorForApi(simulator, waitingCounts[simulator.id] ?? 0),
            shift_available: shiftAvailable,
          };
        })
      );
      return json({ simulators: formatted });
    }

    // GET /api/simulation/simulators/:id/image
    if (
      method === "GET" &&
      segments[0] === "simulators" &&
      segments[2] === "image" &&
      segments.length === 3
    ) {
      const simulator = await getSimulatorById(db, segments[1]);
      if (!simulator?.image_r2_key) {
        return error("画像が見つかりません", 404);
      }
      const filename = simulator.image_r2_key.split("/").pop() ?? "simulator-image.png";
      return streamSimulatorImage(env.FILES, simulator.image_r2_key, filename);
    }

    // POST /api/simulation/reservations
    if (method === "POST" && segments[0] === "reservations" && segments.length === 1) {
      const profile = await requireCompletePrintProfile(db, userId);
      if (profile instanceof Response) return profile;

      const body = await request.json<{
        title: string;
        purpose: "ss_s_tan" | "club" | "other";
        purpose_other?: string;
        summary?: string;
        sim_notes?: string;
        request_result_video?: boolean;
        sim_scale: SimScale;
        simulator_id: string;
        desired_date: string;
        stl_r2_key: string;
        stl_filename: string;
        stl_size_bytes: number;
      }>();

      const required = [
        "title",
        "purpose",
        "sim_scale",
        "simulator_id",
        "desired_date",
        "stl_r2_key",
        "stl_filename",
        "stl_size_bytes",
      ] as const;

      for (const field of required) {
        if (body[field] === undefined || body[field] === null || body[field] === "") {
          return error(`${field} は必須です`);
        }
      }

      const simulatorError = await validateSimulatorId(db, body.simulator_id);
      if (simulatorError) return error(simulatorError);

      if (!["small", "medium", "large"].includes(body.sim_scale)) {
        return error("シミュレーション規模が不正です");
      }

      if (!["ss_s_tan", "club", "other"].includes(body.purpose)) {
        return error("目的が不正です");
      }

      if (body.purpose === "other" && !body.purpose_other?.trim()) {
        return error("目的が「その他」の場合は内容を入力してください");
      }

      if (!isDateBookable(body.desired_date)) {
        return error(`希望実施日は ${getEarliestBookableDate()} 以降を選択してください`);
      }

      const slotError = await validateSimulatorReservationSlot(
        db,
        body.desired_date,
        body.simulator_id,
        body.sim_scale,
        "",
        { isAdmin: false }
      );
      if (slotError) return error(slotError);

      const staffAvailable = await hasStaffOnDate(db, body.desired_date);
      if (!staffAvailable) {
        return error("この日は対応可能な実行担当者がいないため予約できません");
      }

      const keyExists = await verifyR2Key(env.FILES, body.stl_r2_key);
      if (!keyExists) {
        return error("ファイルが見つかりません。再度アップロードしてください");
      }

      const videoResolved = await resolveRequestPrintVideo(
        db,
        body.simulator_id,
        body.request_result_video
      );
      if (!videoResolved.ok) return error(videoResolved.error);

      const reservation: Reservation = {
        id: crypto.randomUUID(),
        grade: gradeFromHomeroom(profile.homeroom),
        homeroom: profile.homeroom,
        student_number: profile.student_number,
        student_name: profile.student_name,
        title: String(body.title).trim(),
        purpose: body.purpose,
        purpose_other: body.purpose_other ?? null,
        summary: body.summary?.trim() || null,
        sim_notes: body.sim_notes?.trim() || null,
        sim_scale: body.sim_scale,
        simulator_id: body.simulator_id,
        desired_date: body.desired_date,
        stl_r2_key: body.stl_r2_key,
        stl_filename: body.stl_filename,
        stl_size_bytes: Number(body.stl_size_bytes),
        status: "applied",
        status_comment: null,
        sim_staff: null,
        sim_staff_member_id: null,
        delivery_staff: null,
        google_event_id: null,
        request_result_video: videoResolved.value ? 1 : 0,
        result_video_storage_path: null,
        result_video_filename: null,
        result_video_size_bytes: null,
        user_id: userId,
        created_at: new Date().toISOString(),
      };

      await createReservation(db, reservation);

      context.waitUntil(
        (async () => {
          const webhookUrl = await resolveSimDiscordWebhookUrl(db, env);
          await notifyReservationApplication(webhookUrl, adminUrl, {
            title: reservation.title,
            desired_date: reservation.desired_date,
            sim_scale: reservation.sim_scale,
          });
        })()
      );

      return json({ id: reservation.id, message: "予約申請を受け付けました" }, 201);
    }

    const RECENT_PAST_DAYS = 7;
    const OLDER_PAGE_SIZE = 15;

    // GET /api/simulation/calendar/reservation-list
    if (
      method === "GET" &&
      segments[0] === "calendar" &&
      segments[1] === "reservation-list" &&
      segments.length === 2
    ) {
      const today = url.searchParams.get("today") ?? getTodayJst();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) {
        return error("today が不正です");
      }

      const recentPastStart = addDays(today, -RECENT_PAST_DAYS);
      const memberMap = await buildMemberMap(db);
      const simulatorMap = await buildSimulatorMap(db);
      const [upcoming, recentPast] = await Promise.all([
        getUserUpcomingReservations(db, userId, today),
        getUserRecentPastReservations(db, userId, recentPastStart, today),
      ]);
      const hasOlderPast = await hasUserReservationsBeforeDate(db, userId, recentPastStart);

      const mapOwned = (r: Reservation) => ({
        ...publicCalendarReservation(r, memberMap, simulatorMap),
        owned: true,
      });

      return json({
        today,
        recentPastStart,
        upcoming: upcoming.map(mapOwned),
        recentPast: recentPast.map(mapOwned),
        hasOlderPast,
      });
    }

    // GET /api/simulation/calendar/reservation-list/older
    if (
      method === "GET" &&
      segments[0] === "calendar" &&
      segments[1] === "reservation-list" &&
      segments[2] === "older" &&
      segments.length === 3
    ) {
      const today = url.searchParams.get("today") ?? getTodayJst();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) {
        return error("today が不正です");
      }

      const recentPastStart = addDays(today, -RECENT_PAST_DAYS);
      const cursorDate = url.searchParams.get("cursor_date");
      const cursorCreatedAt = url.searchParams.get("cursor_created_at");
      const cursorId = url.searchParams.get("cursor_id");

      let cursor: ReservationListCursor | null = null;
      if (cursorDate && cursorCreatedAt && cursorId) {
        cursor = {
          desired_date: cursorDate,
          created_at: cursorCreatedAt,
          id: cursorId,
        };
      }

      const memberMap = await buildMemberMap(db);
      const simulatorMap = await buildSimulatorMap(db);
      const batch = await getUserOlderReservations(
        db,
        userId,
        recentPastStart,
        OLDER_PAGE_SIZE + 1,
        cursor
      );
      const hasMore = batch.length > OLDER_PAGE_SIZE;
      const page = batch.slice(0, OLDER_PAGE_SIZE);
      const last = page[page.length - 1];

      return json({
        reservations: page.map((r) => ({
          ...publicCalendarReservation(r, memberMap, simulatorMap),
          owned: true,
        })),
        hasMore,
        cursor: last
          ? {
              desired_date: last.desired_date,
              created_at: last.created_at,
              id: last.id,
            }
          : null,
      });
    }

    // GET /api/simulation/calendar
    if (method === "GET" && segments[0] === "calendar" && segments.length === 1) {
      const year = parseInt(url.searchParams.get("year") ?? "", 10);
      const month = parseInt(url.searchParams.get("month") ?? "", 10);
      if (!year || !month) return error("year と month が必要です");

      const { start, end } = getMonthRange(year, month);
      const reservations = await getReservationsInRange(db, start, end);
      const memberMap = await buildMemberMap(db);
      const simulatorMap = await buildSimulatorMap(db);
      const shiftAvailability = await getAvailabilityInRange(db, start, end);
      const simulatorUnavailability = await getSimulatorAvailabilityInRange(db, start, end);
      const staffCountByDate: Record<string, number> = {};
      const simulatorCountByDate: Record<string, number> = {};
      for (const row of shiftAvailability) {
        staffCountByDate[row.date] = (staffCountByDate[row.date] ?? 0) + 1;
      }

      const allSimulatorsForCalendar = await getAllSimulators(db);
      const bookableSimulatorIds = new Set(
        allSimulatorsForCalendar
          .filter((s) => isSimulatorBookable(normalizeSimulatorStatus(s.status)))
          .map((s) => s.id)
      );
      const unavailableCountByDate: Record<string, number> = {};
      for (const row of simulatorUnavailability) {
        if (!bookableSimulatorIds.has(row.simulator_id)) continue;
        unavailableCountByDate[row.date] = (unavailableCountByDate[row.date] ?? 0) + 1;
      }
      const totalBookableSimulators = bookableSimulatorIds.size;
      for (let day = 1; day <= new Date(year, month, 0).getDate(); day++) {
        const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const off = unavailableCountByDate[dateStr] ?? 0;
        const availableCount = totalBookableSimulators - off;
        if (availableCount > 0) {
          simulatorCountByDate[dateStr] = availableCount;
        }
      }

      return json({
        year,
        month,
        earliestBookable: getEarliestBookableDate(),
        staffAvailableDates: Object.keys(staffCountByDate),
        staffCountByDate,
        simulatorAvailableDates: Object.keys(simulatorCountByDate),
        simulatorCountByDate,
        reservations: reservations.map((r) => ({
          ...publicCalendarReservation(r, memberMap, simulatorMap),
          owned: r.user_id === userId,
        })),
      });
    }

    // GET /api/simulation/reservations/:id
    if (method === "GET" && segments[0] === "reservations" && segments.length === 2) {
      const reservation = await getReservationById(db, segments[1]);
      if (!reservation || reservation.status === "cancelled") {
        return error("予約が見つかりません", 404);
      }
      if (reservation.user_id !== userId) {
        return error("この予約にアクセスする権限がありません", 403);
      }
      const memberMap = await buildMemberMap(db);
      const simulatorMap = await buildSimulatorMap(db);
      return json({ reservation: userReservationDetail(reservation, memberMap, simulatorMap) });
    }

    // GET /api/simulation/reservations/:id/result-video/download
    if (
      method === "GET" &&
      segments[0] === "reservations" &&
      segments.length === 4 &&
      segments[2] === "result-video" &&
      segments[3] === "download"
    ) {
      const reservation = await getReservationById(db, segments[1]);
      if (!reservation || reservation.status === "cancelled") {
        return error("予約が見つかりません", 404);
      }
      if (reservation.user_id !== userId) {
        return error("この予約にアクセスする権限がありません", 403);
      }
      if (!reservation.result_video_storage_path) {
        return error("結果動画はまだアップロードされていません", 404);
      }

      const parsed = parseLogicalPath(reservation.result_video_storage_path);
      if (!parsed?.relativePath) {
        return error("動画ファイルのパスが不正です", 500);
      }

      try {
        return await streamStorageFile(env, parsed);
      } catch (err) {
        const message = err instanceof Error ? err.message : "ダウンロードに失敗しました";
        return error(message, 404);
      }
    }

    // GET /api/simulation/result-videos
    if (method === "GET" && segments[0] === "result-videos" && segments.length === 1) {
      const videos = await getUserPrintVideos(db, userId);
      return json({
        videos: videos.map((r) => ({
          id: r.id,
          title: r.title,
          desired_date: r.desired_date,
          result_video_filename: r.result_video_filename,
          result_video_size_bytes: r.result_video_size_bytes,
          download_url: `/api/simulation/reservations/${r.id}/result-video/download`,
        })),
      });
    }

    // PATCH /api/simulation/reservations/:id
    if (method === "PATCH" && segments[0] === "reservations" && segments.length === 2) {
      const profile = await requireCompletePrintProfile(db, userId);
      if (profile instanceof Response) return profile;

      const body = await request.json<ReservationContentInput>();
      const reservation = await getReservationById(db, segments[1]);
      if (!reservation || reservation.status === "cancelled") {
        return error("予約が見つかりません", 404);
      }
      if (reservation.user_id !== userId) {
        return error("この予約にアクセスする権限がありません", 403);
      }

      return applyReservationContentEdit(
        context,
        reservation,
        {
          ...body,
          homeroom: profile.homeroom,
          student_number: profile.student_number,
          student_name: profile.student_name,
        },
        { isUser: true }
      );
    }

    // POST /api/simulation/reservations/:id/retry
    if (
      method === "POST" &&
      segments[0] === "reservations" &&
      segments[2] === "retry" &&
      segments.length === 3
    ) {
      const profile = await requireCompletePrintProfile(db, userId);
      if (profile instanceof Response) return profile;

      const body = await request.json<{
        desired_date: string;
        title: string;
        purpose: Reservation["purpose"];
        purpose_other?: string | null;
        summary?: string | null;
        sim_notes?: string | null;
        sim_scale: Reservation["sim_scale"];
        stl_r2_key?: string;
        stl_filename?: string;
        stl_size_bytes?: number;
      }>();

      try {
        const created = await retryFailedReservation(env, segments[1], {
          ...body,
          homeroom: profile.homeroom,
          student_number: profile.student_number,
          student_name: profile.student_name,
        }, userId);
        const memberMap = await buildMemberMap(db);
        const simulatorMap = await buildSimulatorMap(db);

        context.waitUntil(
          (async () => {
            const webhookUrl = await resolveSimDiscordWebhookUrl(db, env);
            await notifyReservationApplication(webhookUrl, adminUrl, {
              title: created.title,
              desired_date: created.desired_date,
              sim_scale: created.sim_scale,
            });
          })()
        );

        return json({
          reservation: userReservationDetail(created, memberMap, simulatorMap),
          message: "再予約を申請しました。受領後に確定します。",
        });
      } catch (err) {
        return error(err instanceof Error ? err.message : "再予約に失敗しました");
      }
    }

    // POST /api/simulation/reservations/:id/cancel
    if (
      method === "POST" &&
      segments[0] === "reservations" &&
      segments[2] === "cancel" &&
      segments.length === 3
    ) {
      const reservation = await getReservationById(db, segments[1]);
      if (!reservation || reservation.status === "cancelled") {
        return error("予約が見つかりません", 404);
      }
      if (reservation.user_id !== userId) {
        return error("この予約にアクセスする権限がありません", 403);
      }

      await deleteCalendarEvent(env, reservation.google_event_id);
      await env.FILES.delete(reservation.stl_r2_key);
      await deleteReservation(db, segments[1]);
      return json({ ok: true, message: "予約を取り消しました" });
    }

    // GET /api/simulation/calendar/availability
    if (method === "GET" && segments[0] === "calendar" && segments[1] === "availability") {
      const date = url.searchParams.get("date");
      const scale = url.searchParams.get("scale") as SimScale | null;
      const simulatorId = url.searchParams.get("simulator_id");
      const excludeId = url.searchParams.get("exclude_reservation_id");
      if (!date) return error("date が必要です");

      const result = await getDateAvailability(db, date, {
        simulatorId,
        scale,
        excludeReservationId: excludeId,
        isAdmin: false,
      });
      return json(mapAvailabilityResponse(result));
    }

    // GET /api/simulation/phone-verification/config
    if (
      method === "GET" &&
      segments[0] === "phone-verification" &&
      segments[1] === "config"
    ) {
      const projectId = env.FIREBASE_PROJECT_ID?.trim();
      const apiKey = env.FIREBASE_WEB_API_KEY?.trim();
      const appId = env.FIREBASE_APP_ID?.trim();
      if (!projectId || !apiKey || !appId) {
        return error("電話認証の設定が完了していません（管理者に連絡してください）", 503);
      }
      const authDomain =
        env.FIREBASE_AUTH_DOMAIN?.trim() || `${projectId}.firebaseapp.com`;
      const consentVersion = getActiveConsentVersion(env);
      return json({
        firebase: {
          apiKey,
          authDomain,
          projectId,
          appId,
        },
        consent_version: consentVersion,
        consent_text_url: "/docs/legal/sim-sms-consent-ja.md",
        verification_validity_days: Math.floor(SIM_PHONE_VERIFICATION_TTL_MS / (24 * 60 * 60 * 1000)),
        daily_attempt_limit: SIM_PHONE_DAILY_ATTEMPT_LIMIT,
      });
    }

    // GET /api/simulation/phone-verification/status
    if (
      method === "GET" &&
      segments[0] === "phone-verification" &&
      segments[1] === "status"
    ) {
      const row = await getSimPhoneUserRow(db, userId);
      return json({ phone: getSimPhoneStatus(row) });
    }

    // POST /api/simulation/phone-verification/consent
    if (
      method === "POST" &&
      segments[0] === "phone-verification" &&
      segments[1] === "consent"
    ) {
      let body: { consent_version?: string; phone_e164?: string };
      try {
        body = await request.json<{ consent_version?: string; phone_e164?: string }>();
      } catch {
        return error("JSON が必要です", 400);
      }
      const activeVersion = getActiveConsentVersion(env);
      const consentVersion = String(body.consent_version ?? "").trim();
      if (consentVersion !== activeVersion) {
        return error("同意文のバージョンが古いです。ページを再読み込みしてください", 400);
      }

      const phoneRaw = String(body.phone_e164 ?? "").trim();
      if (phoneRaw) {
        const phoneE164 = parseJapanPhoneE164Input(phoneRaw);
        if (!phoneE164) {
          return error("日本国内の携帯電話番号（090/080/070 など）の形式が正しくありません", 400);
        }

        try {
          await assertSimPhoneE164Available(db, phoneE164, userId);
        } catch (err) {
          const code =
            err instanceof Error && "code" in err
              ? String((err as Error & { code?: string }).code)
              : undefined;
          if (code === PHONE_ALREADY_REGISTERED_CODE) {
            return json({ error: (err as Error).message, code }, 409);
          }
          throw err;
        }

        const allowed = await checkAndIncrementDailyPhoneVerificationAttempt(db, userId);
        if (!allowed) {
          const limitErr = simPhoneDailyLimitError();
          return json(
            { error: limitErr.message, code: SIM_PHONE_DAILY_LIMIT_CODE },
            429
          );
        }
      }

      const audit = await phoneVerificationAuditFromRequest(request);
      await recordPhoneVerificationConsent(db, userId, consentVersion, audit);
      return json({ ok: true });
    }

    // POST /api/simulation/phone-verification/complete
    if (
      method === "POST" &&
      segments[0] === "phone-verification" &&
      segments[1] === "complete"
    ) {
      const projectId = env.FIREBASE_PROJECT_ID?.trim();
      if (!projectId) {
        return error("電話認証の設定が完了していません", 503);
      }

      let body: { id_token?: string; consent_version?: string };
      try {
        body = await request.json<{ id_token?: string; consent_version?: string }>();
      } catch {
        return error("JSON が必要です", 400);
      }

      const idToken = String(body.id_token ?? "").trim();
      if (!idToken) return error("id_token が必要です", 400);

      const activeVersion = getActiveConsentVersion(env);
      const consentVersion = String(body.consent_version ?? "").trim();
      if (consentVersion !== activeVersion) {
        return error("同意文のバージョンが古いです。ページを再読み込みしてください", 400);
      }

      const nowMs = Date.now();
      const allowed = await checkAndIncrementDailyPhoneVerificationAttempt(db, userId, nowMs);
      if (!allowed) {
        const limitErr = simPhoneDailyLimitError();
        return json(
          { error: limitErr.message, code: SIM_PHONE_DAILY_LIMIT_CODE },
          429
        );
      }

      const audit = await phoneVerificationAuditFromRequest(request);

      try {
        const claims = await verifyFirebaseIdToken(idToken, projectId);
        const phone = await completePhoneVerification(
          db,
          userId,
          claims,
          consentVersion,
          audit
        );
        return json({ phone });
      } catch (err) {
        const message = err instanceof Error ? err.message : "認証に失敗しました";
        const code =
          err instanceof Error && "code" in err
            ? String((err as Error & { code?: string }).code)
            : undefined;
        if (code === "PHONE_ALREADY_REGISTERED" || code === PHONE_ALREADY_REGISTERED_CODE) {
          return json({ error: message, code: PHONE_ALREADY_REGISTERED_CODE }, 409);
        }
        await insertPhoneVerificationLog(db, {
          userId,
          event: "verify_failed",
          consentVersion,
          ipHash: audit.ipHash,
          userAgentHash: audit.userAgentHash,
          createdAt: new Date().toISOString(),
        }).catch(() => {});
        return error(message, 400);
      }
    }

    // GET /api/simulation/fds-requests/config
    if (method === "GET" && segments[0] === "fds-requests" && segments[1] === "config") {
      return json({
        max_runtime_hours: FDS_JOB_MAX_RUNTIME_HOURS,
        min_mpi_processes: FDS_MIN_MPI_PROCESSES,
        max_mpi_processes: FDS_MAX_MPI_PROCESSES,
        instance_family: "c7a,hpc6a",
        primary_review_max_attempts: FDS_PRIMARY_REVIEW_MAX_ATTEMPTS,
      });
    }

    // GET /api/simulation/fds-requests/instance-preview?mpi_processes=8
    if (
      method === "GET" &&
      segments[0] === "fds-requests" &&
      segments[1] === "instance-preview"
    ) {
      const mpiRaw = parseInt(url.searchParams.get("mpi_processes") ?? "", 10);
      const sizing = pickEc2InstanceType(Number.isFinite(mpiRaw) ? mpiRaw : 1);
      const maxRuntimeRaw = parseInt(url.searchParams.get("max_runtime_hours") ?? "", 10);
      const maxRuntimeHours = Number.isFinite(maxRuntimeRaw)
        ? maxRuntimeRaw
        : FDS_JOB_MAX_RUNTIME_HOURS;
      const inputSizeRaw = parseInt(url.searchParams.get("input_size_bytes") ?? "", 10);
      const inputBytes = Number.isFinite(inputSizeRaw) ? inputSizeRaw : 0;
      const cost = estimateFdsRunCost(sizing.instanceType, maxRuntimeHours);
      const storage = estimateFdsStorage(inputBytes);
      return json({
        mpi_processes: sizing.requestedCores,
        instance_type: sizing.instanceType,
        vcpus: sizing.vcpus,
        max_runtime_hours: cost.max_runtime_hours,
        estimated_cost_usd_max: cost.estimated_cost_usd_max,
        estimated_cost_jpy_max: cost.estimated_cost_jpy_max,
        cost_note: cost.cost_note,
        estimated_storage: storage,
      });
    }

    // GET /api/simulation/fds-requests
    if (method === "GET" && segments[0] === "fds-requests" && segments.length === 1) {
      const rows = await listFdsRequestsForUser(db, userId);
      const requests = await Promise.all(rows.map((row) => formatFdsRequestForApiEnriched(db, row)));
      return json({ requests });
    }

    // GET /api/simulation/fds-requests/:id
    if (method === "GET" && segments[0] === "fds-requests" && segments.length === 2) {
      const row = await getFdsRequestById(db, segments[1]);
      if (!row || row.user_id !== userId) {
        return error("依頼が見つかりません", 404);
      }
      return json({ request: await formatFdsRequestForApiEnriched(db, row) });
    }

    // GET /api/simulation/fds-requests/:id/messages
    if (
      method === "GET" &&
      segments[0] === "fds-requests" &&
      segments.length === 3 &&
      segments[2] === "messages"
    ) {
      return handleFdsRequestChatList(env, db, request, {
        requestId: segments[1],
        userId,
        apiPrefix: "fds-requests",
      });
    }

    // POST /api/simulation/fds-requests/:id/messages
    if (
      method === "POST" &&
      segments[0] === "fds-requests" &&
      segments.length === 3 &&
      segments[2] === "messages"
    ) {
      return handleFdsRequestChatPost(env, db, request, {
        requestId: segments[1],
        userId,
        apiPrefix: "fds-requests",
      });
    }

    // GET /api/simulation/fds-requests/:id/messages/:msgId/attachment/download
    if (
      method === "GET" &&
      segments[0] === "fds-requests" &&
      segments.length === 6 &&
      segments[2] === "messages" &&
      segments[4] === "attachment" &&
      segments[5] === "download"
    ) {
      return handleFdsRequestChatAttachmentDownload(env, db, {
        requestId: segments[1],
        messageId: segments[3],
        userId,
      });
    }

    // GET /api/simulation/fds-requests/:id/output/download
    if (
      method === "GET" &&
      segments[0] === "fds-requests" &&
      segments.length === 4 &&
      segments[2] === "output" &&
      segments[3] === "download"
    ) {
      const row = await getFdsRequestById(db, segments[1]);
      if (!row || row.user_id !== userId) {
        return error("依頼が見つかりません", 404);
      }
      if (!row.fds_job_id) return error("実行結果がありません", 404);
      let job = await getFdsJobById(db, row.fds_job_id);
      if (!job?.output_r2_key) return error("結果ファイルがありません", 404);
      const synced = await syncFdsJobArtifacts(env, job);
      job = synced.job;
      if (!synced.artifacts.hasOutput) return error("結果ファイルがありません", 404);
      const obj = await env.FILES.get(job.output_r2_key!);
      if (!obj) return error("結果ファイルがありません", 404);
      const base = job.input_filename.replace(/\.fds$/i, "");
      const filename = job.output_filename ?? `${base}-results.zip`;
      return new Response(obj.body, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": attachmentFilename(filename),
        },
      });
    }

    // POST /api/simulation/fds-requests/:id/rerun
    if (
      method === "POST" &&
      segments[0] === "fds-requests" &&
      segments.length === 3 &&
      segments[2] === "rerun"
    ) {
      try {
        await requireSimPhoneVerified(db, userId);
      } catch (err) {
        const code =
          err instanceof Error && "code" in err
            ? (err as Error & { code?: string }).code
            : undefined;
        if (code === SIM_PHONE_NOT_VERIFIED_CODE) {
          return json(
            { error: err instanceof Error ? err.message : "電話認証が必要です", code },
            403
          );
        }
        throw err;
      }

      const sourceId = segments[1];
      let body: { title?: string; desired_date?: string | null } = {};
      try {
        body = await request.json();
      } catch {
        body = {};
      }

      try {
        const row = await createFdsRerunFromRequest(env, db, sourceId, userId, {
          title: body.title,
          desiredDate: body.desired_date,
        });
        const object = await env.FILES.get(row.input_r2_key);
        const fdsText = object
          ? extractFdsTextForReview(await object.arrayBuffer())
          : "";
        waitUntil(
          runFdsPrimaryReviewJob(env, db, {
            requestId: row.id,
            fdsText,
            filename: row.input_filename,
            mpiProcesses: row.mpi_processes,
            maxRuntimeHours: row.max_runtime_hours,
            forceSecondary: false,
          })
        );
        return json({ request: await formatFdsRequestForApiEnriched(db, row) }, 201);
      } catch (err) {
        const message = err instanceof Error ? err.message : "再依頼に失敗しました";
        return error(message, 400);
      }
    }

    // POST /api/simulation/fds-requests/:id/retry-primary
    if (
      method === "POST" &&
      segments[0] === "fds-requests" &&
      segments.length === 3 &&
      segments[2] === "retry-primary"
    ) {
      try {
        await requireSimPhoneVerified(db, userId);
      } catch (err) {
        const code =
          err instanceof Error && "code" in err
            ? (err as Error & { code?: string }).code
            : undefined;
        if (code === SIM_PHONE_NOT_VERIFIED_CODE) {
          return json(
            { error: err instanceof Error ? err.message : "電話認証が必要です", code },
            403
          );
        }
        throw err;
      }

      const requestId = segments[1];
      const existing = await getFdsRequestById(db, requestId);
      if (!existing || existing.user_id !== userId) {
        return error("依頼が見つかりません", 404);
      }

      const contentType = request.headers.get("content-type") ?? "";
      if (!contentType.includes("multipart/form-data")) {
        return error("multipart/form-data で送信してください", 400);
      }

      const formData = await request.formData();
      const fileEntry = formData.get("file");
      if (!(fileEntry instanceof File)) {
        return error("file フィールドに .fds ファイルを指定してください", 400);
      }

      const filename = fileEntry.name.trim();
      const validationError = validateFdsFilename(filename);
      if (validationError) return error(validationError, 400);

      const sizeBytes = fileEntry.size;
      if (sizeBytes <= 0 || sizeBytes > FDS_MAX_INPUT_BYTES) {
        return error(
          `ファイルサイズは 1 バイト以上 ${FDS_MAX_INPUT_BYTES / (1024 * 1024)}MB 以下である必要があります`,
          400
        );
      }

      const fileBuffer = await fileEntry.arrayBuffer();
      const inputSha256 = await sha256HexFromBuffer(fileBuffer);
      const fdsText = extractFdsTextForReview(fileBuffer);
      const r2Key = generateFdsInputR2Key(requestId, filename);

      await env.FILES.put(r2Key, fileBuffer, {
        httpMetadata: { contentType: "text/plain; charset=utf-8" },
      });

      try {
        const row = await retryFdsPrimaryReview(db, requestId, userId, {
          inputR2Key: r2Key,
          inputFilename: filename,
          inputSizeBytes: sizeBytes,
          inputSha256,
        });

        waitUntil(
          runFdsPrimaryReviewJob(env, db, {
            requestId,
            fdsText,
            filename,
            mpiProcesses: row.mpi_processes,
            maxRuntimeHours: row.max_runtime_hours,
            forceSecondary: false,
          })
        );

        return json({ request: await formatFdsRequestForApiEnriched(db, row) });
      } catch (err) {
        const message = err instanceof Error ? err.message : "再審の開始に失敗しました";
        return error(message, 400);
      }
    }

    // POST /api/simulation/fds-requests/:id/force-secondary
    if (
      method === "POST" &&
      segments[0] === "fds-requests" &&
      segments.length === 3 &&
      segments[2] === "force-secondary"
    ) {
      try {
        const row = await forceSecondaryFdsRequest(db, segments[1], userId);
        waitUntil(sendFdsPendingApprovalDiscordNotification(env, db, row.id));
        return json({ request: await formatFdsRequestForApiEnriched(db, row) });
      } catch (err) {
        const message = err instanceof Error ? err.message : "二次審査への申請に失敗しました";
        return error(message, 400);
      }
    }

    // POST /api/simulation/fds-requests — FDS 依頼（一次審査は非同期）
    if (method === "POST" && segments[0] === "fds-requests" && segments.length === 1) {
      try {
        await requireSimPhoneVerified(db, userId);
      } catch (err) {
        const code =
          err instanceof Error && "code" in err
            ? (err as Error & { code?: string }).code
            : undefined;
        if (code === SIM_PHONE_NOT_VERIFIED_CODE) {
          return json(
            { error: err instanceof Error ? err.message : "電話認証が必要です", code },
            403
          );
        }
        throw err;
      }

      const contentType = request.headers.get("content-type") ?? "";
      if (!contentType.includes("multipart/form-data")) {
        return error("multipart/form-data で送信してください", 400);
      }

      const formData = await request.formData();
      const fileEntry = formData.get("file");
      const titleInput = String(formData.get("title") ?? "").trim();
      const notesInput = String(formData.get("notes") ?? "").trim();
      const desiredDate = String(formData.get("desired_date") ?? "").trim() || null;
      const maxRuntimeRaw = parseInt(String(formData.get("max_runtime_hours") ?? ""), 10);
      const mpiRaw = parseInt(String(formData.get("mpi_processes") ?? ""), 10);

      if (!(fileEntry instanceof File)) {
        return error("file フィールドに .fds ファイルを指定してください", 400);
      }

      const filename = fileEntry.name.trim();
      const validationError = validateFdsFilename(filename);
      if (validationError) return error(validationError, 400);

      const runtimeError = validateFdsRequestMaxRuntimeHours(maxRuntimeRaw);
      if (runtimeError) return error(runtimeError, 400);

      const mpiProcesses = clampMpiProcesses(Number.isFinite(mpiRaw) ? mpiRaw : 1);

      const forceSecondary =
        String(formData.get("force_secondary") ?? "").trim() === "1" ||
        String(formData.get("force_secondary") ?? "").trim().toLowerCase() === "true";

      const sizeBytes = fileEntry.size;
      if (sizeBytes <= 0 || sizeBytes > FDS_MAX_INPUT_BYTES) {
        return error(
          `ファイルサイズは 1 バイト以上 ${FDS_MAX_INPUT_BYTES / (1024 * 1024)}MB 以下である必要があります`,
          400
        );
      }

      const requestId = createId("fdsreq");
      const r2Key = generateFdsInputR2Key(requestId, filename);
      const title = titleInput || filename.replace(/\.fds$/i, "");
      const createdAt = new Date().toISOString();

      const fileBuffer = await fileEntry.arrayBuffer();
      const inputSha256 = await sha256HexFromBuffer(fileBuffer);
      const fdsText = extractFdsTextForReview(fileBuffer);

      await env.FILES.put(r2Key, fileBuffer, {
        httpMetadata: { contentType: "text/plain; charset=utf-8" },
      });

      const row = await createFdsRequest(db, {
        id: requestId,
        userId,
        title,
        desiredDate,
        maxRuntimeHours: maxRuntimeRaw,
        mpiProcesses,
        inputR2Key: r2Key,
        inputFilename: filename,
        inputSizeBytes: sizeBytes,
        inputSha256,
        notes: notesInput || null,
        createdAt,
        status: "primary_reviewing",
      });

      waitUntil(
        runFdsPrimaryReviewJob(env, db, {
          requestId,
          fdsText,
          filename,
          mpiProcesses,
          maxRuntimeHours: maxRuntimeRaw,
          forceSecondary,
        })
      );

      return json({ request: await formatFdsRequestForApiEnriched(db, row) }, 201);
    }


    // GET /api/simulation/openfoam-requests/config
    if (method === "GET" && segments[0] === "openfoam-requests" && segments[1] === "config") {
      return json({
        max_runtime_hours: OPENFOAM_JOB_MAX_RUNTIME_HOURS,
        min_mpi_processes: OPENFOAM_MIN_MPI_PROCESSES,
        max_mpi_processes: OPENFOAM_MAX_MPI_PROCESSES,
        instance_family: "c7a,hpc6a",
        primary_review_max_attempts: OPENFOAM_PRIMARY_REVIEW_MAX_ATTEMPTS,
      });
    }

    // GET /api/simulation/openfoam-requests/instance-preview?mpi_processes=8
    if (
      method === "GET" &&
      segments[0] === "openfoam-requests" &&
      segments[1] === "instance-preview"
    ) {
      const mpiRaw = parseInt(url.searchParams.get("mpi_processes") ?? "", 10);
      const sizing = pickOpenfoamEc2InstanceType(Number.isFinite(mpiRaw) ? mpiRaw : 1);
      const maxRuntimeRaw = parseInt(url.searchParams.get("max_runtime_hours") ?? "", 10);
      const maxRuntimeHours = Number.isFinite(maxRuntimeRaw)
        ? maxRuntimeRaw
        : OPENFOAM_JOB_MAX_RUNTIME_HOURS;
      const inputSizeRaw = parseInt(url.searchParams.get("input_size_bytes") ?? "", 10);
      const inputBytes = Number.isFinite(inputSizeRaw) ? inputSizeRaw : 0;
      const cost = estimateOpenfoamRunCost(sizing.instanceType, maxRuntimeHours);
      const storage = estimateOpenfoamStorage(inputBytes);
      return json({
        mpi_processes: sizing.requestedCores,
        instance_type: sizing.instanceType,
        vcpus: sizing.vcpus,
        max_runtime_hours: cost.max_runtime_hours,
        estimated_cost_usd_max: cost.estimated_cost_usd_max,
        estimated_cost_jpy_max: cost.estimated_cost_jpy_max,
        cost_note: cost.cost_note,
        estimated_storage: storage,
      });
    }

    // GET /api/simulation/openfoam-requests
    if (method === "GET" && segments[0] === "openfoam-requests" && segments.length === 1) {
      const rows = await listOpenfoamRequestsForUser(db, userId);
      const requests = await Promise.all(rows.map((row) => formatOpenfoamRequestForApiEnriched(db, row)));
      return json({ requests });
    }

    // GET /api/simulation/openfoam-requests/:id
    if (method === "GET" && segments[0] === "openfoam-requests" && segments.length === 2) {
      const row = await getOpenfoamRequestById(db, segments[1]);
      if (!row || row.user_id !== userId) {
        return error("依頼が見つかりません", 404);
      }
      return json({ request: await formatOpenfoamRequestForApiEnriched(db, row) });
    }

    // GET /api/simulation/openfoam-requests/:id/messages
    if (
      method === "GET" &&
      segments[0] === "openfoam-requests" &&
      segments.length === 3 &&
      segments[2] === "messages"
    ) {
      return handleOpenfoamRequestChatList(env, db, request, {
        requestId: segments[1],
        userId,
        apiPrefix: "openfoam-requests",
      });
    }

    // POST /api/simulation/openfoam-requests/:id/messages
    if (
      method === "POST" &&
      segments[0] === "openfoam-requests" &&
      segments.length === 3 &&
      segments[2] === "messages"
    ) {
      return handleOpenfoamRequestChatPost(env, db, request, {
        requestId: segments[1],
        userId,
        apiPrefix: "openfoam-requests",
      });
    }

    // GET /api/simulation/openfoam-requests/:id/messages/:msgId/attachment/download
    if (
      method === "GET" &&
      segments[0] === "openfoam-requests" &&
      segments.length === 6 &&
      segments[2] === "messages" &&
      segments[4] === "attachment" &&
      segments[5] === "download"
    ) {
      return handleOpenfoamRequestChatAttachmentDownload(env, db, {
        requestId: segments[1],
        messageId: segments[3],
        userId,
      });
    }

    // GET /api/simulation/openfoam-requests/:id/output/download
    if (
      method === "GET" &&
      segments[0] === "openfoam-requests" &&
      segments.length === 4 &&
      segments[2] === "output" &&
      segments[3] === "download"
    ) {
      const row = await getOpenfoamRequestById(db, segments[1]);
      if (!row || row.user_id !== userId) {
        return error("依頼が見つかりません", 404);
      }
      if (!row.openfoam_job_id) return error("実行結果がありません", 404);
      let job = await getOpenfoamJobById(db, row.openfoam_job_id);
      if (!job?.output_r2_key) return error("結果ファイルがありません", 404);
      const synced = await syncOpenfoamJobArtifacts(env, job);
      job = synced.job;
      if (!synced.artifacts.hasOutput) return error("結果ファイルがありません", 404);
      const obj = await env.FILES.get(job.output_r2_key!);
      if (!obj) return error("結果ファイルがありません", 404);
      const base = job.input_filename.replace(/\.zip/i, "");
      const filename = job.output_filename ?? `${base}-results.zip`;
      return new Response(obj.body, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": attachmentFilename(filename),
        },
      });
    }

    // POST /api/simulation/openfoam-requests/:id/rerun
    if (
      method === "POST" &&
      segments[0] === "openfoam-requests" &&
      segments.length === 3 &&
      segments[2] === "rerun"
    ) {
      try {
        await requireSimPhoneVerified(db, userId);
      } catch (err) {
        const code =
          err instanceof Error && "code" in err
            ? (err as Error & { code?: string }).code
            : undefined;
        if (code === SIM_PHONE_NOT_VERIFIED_CODE) {
          return json(
            { error: err instanceof Error ? err.message : "電話認証が必要です", code },
            403
          );
        }
        throw err;
      }

      const sourceId = segments[1];
      let body: { title?: string; desired_date?: string | null } = {};
      try {
        body = await request.json();
      } catch {
        body = {};
      }

      try {
        const row = await createOpenfoamRerunFromRequest(env, db, sourceId, userId, {
          title: body.title,
          desiredDate: body.desired_date,
        });
        const object = await env.FILES.get(row.input_r2_key);
        const caseText = object
          ? await extractOpenfoamTextForReview(await object.arrayBuffer())
          : "";
        waitUntil(
          runOpenfoamPrimaryReviewJob(env, db, {
            requestId: row.id,
            caseText,
            filename: row.input_filename,
            mpiProcesses: row.mpi_processes,
            maxRuntimeHours: row.max_runtime_hours,
            forceSecondary: false,
          })
        );
        return json({ request: await formatOpenfoamRequestForApiEnriched(db, row) }, 201);
      } catch (err) {
        const message = err instanceof Error ? err.message : "再依頼に失敗しました";
        return error(message, 400);
      }
    }

    // POST /api/simulation/openfoam-requests/:id/retry-primary
    if (
      method === "POST" &&
      segments[0] === "openfoam-requests" &&
      segments.length === 3 &&
      segments[2] === "retry-primary"
    ) {
      try {
        await requireSimPhoneVerified(db, userId);
      } catch (err) {
        const code =
          err instanceof Error && "code" in err
            ? (err as Error & { code?: string }).code
            : undefined;
        if (code === SIM_PHONE_NOT_VERIFIED_CODE) {
          return json(
            { error: err instanceof Error ? err.message : "電話認証が必要です", code },
            403
          );
        }
        throw err;
      }

      const requestId = segments[1];
      const existing = await getOpenfoamRequestById(db, requestId);
      if (!existing || existing.user_id !== userId) {
        return error("依頼が見つかりません", 404);
      }

      const contentType = request.headers.get("content-type") ?? "";
      if (!contentType.includes("multipart/form-data")) {
        return error("multipart/form-data で送信してください", 400);
      }

      const formData = await request.formData();
      const fileEntry = formData.get("file");
      if (!(fileEntry instanceof File)) {
        return error("file フィールドに .zip ケースファイルを指定してください", 400);
      }

      const filename = fileEntry.name.trim();
      const validationError = validateOpenfoamFilename(filename);
      if (validationError) return error(validationError, 400);

      const sizeBytes = fileEntry.size;
      if (sizeBytes <= 0 || sizeBytes > OPENFOAM_MAX_INPUT_BYTES) {
        return error(
          `ファイルサイズは 1 バイト以上 ${OPENFOAM_MAX_INPUT_BYTES / (1024 * 1024)}MB 以下である必要があります`,
          400
        );
      }

      const fileBuffer = await fileEntry.arrayBuffer();
      const inputSha256 = await sha256HexFromBuffer(fileBuffer);
      const caseText = await extractOpenfoamTextForReview(fileBuffer);
      const r2Key = generateOpenfoamInputR2Key(requestId, filename);

      await env.FILES.put(r2Key, fileBuffer, {
        httpMetadata: { contentType: "application/zip" },
      });

      try {
        const row = await retryOpenfoamPrimaryReview(db, requestId, userId, {
          inputR2Key: r2Key,
          inputFilename: filename,
          inputSizeBytes: sizeBytes,
          inputSha256,
        });

        waitUntil(
          runOpenfoamPrimaryReviewJob(env, db, {
            requestId,
            caseText,
            filename,
            mpiProcesses: row.mpi_processes,
            maxRuntimeHours: row.max_runtime_hours,
            forceSecondary: false,
          })
        );

        return json({ request: await formatOpenfoamRequestForApiEnriched(db, row) });
      } catch (err) {
        const message = err instanceof Error ? err.message : "再審の開始に失敗しました";
        return error(message, 400);
      }
    }

    // POST /api/simulation/openfoam-requests/:id/force-secondary
    if (
      method === "POST" &&
      segments[0] === "openfoam-requests" &&
      segments.length === 3 &&
      segments[2] === "force-secondary"
    ) {
      try {
        const row = await forceSecondaryOpenfoamRequest(db, segments[1], userId);
        waitUntil(sendOpenfoamPendingApprovalDiscordNotification(env, db, row.id));
        return json({ request: await formatOpenfoamRequestForApiEnriched(db, row) });
      } catch (err) {
        const message = err instanceof Error ? err.message : "二次審査への申請に失敗しました";
        return error(message, 400);
      }
    }

    // POST /api/simulation/openfoam-requests — OpenFOAM 依頼（一次審査は非同期）
    if (method === "POST" && segments[0] === "openfoam-requests" && segments.length === 1) {
      try {
        await requireSimPhoneVerified(db, userId);
      } catch (err) {
        const code =
          err instanceof Error && "code" in err
            ? (err as Error & { code?: string }).code
            : undefined;
        if (code === SIM_PHONE_NOT_VERIFIED_CODE) {
          return json(
            { error: err instanceof Error ? err.message : "電話認証が必要です", code },
            403
          );
        }
        throw err;
      }

      const contentType = request.headers.get("content-type") ?? "";
      if (!contentType.includes("multipart/form-data")) {
        return error("multipart/form-data で送信してください", 400);
      }

      const formData = await request.formData();
      const fileEntry = formData.get("file");
      const titleInput = String(formData.get("title") ?? "").trim();
      const notesInput = String(formData.get("notes") ?? "").trim();
      const desiredDate = String(formData.get("desired_date") ?? "").trim() || null;
      const maxRuntimeRaw = parseInt(String(formData.get("max_runtime_hours") ?? ""), 10);
      const mpiRaw = parseInt(String(formData.get("mpi_processes") ?? ""), 10);

      if (!(fileEntry instanceof File)) {
        return error("file フィールドに .zip ケースファイルを指定してください", 400);
      }

      const filename = fileEntry.name.trim();
      const validationError = validateOpenfoamFilename(filename);
      if (validationError) return error(validationError, 400);

      const runtimeError = validateOpenfoamRequestMaxRuntimeHours(maxRuntimeRaw);
      if (runtimeError) return error(runtimeError, 400);

      const mpiProcesses = clampOpenfoamMpiProcesses(Number.isFinite(mpiRaw) ? mpiRaw : 1);

      const forceSecondary =
        String(formData.get("force_secondary") ?? "").trim() === "1" ||
        String(formData.get("force_secondary") ?? "").trim().toLowerCase() === "true";

      const sizeBytes = fileEntry.size;
      if (sizeBytes <= 0 || sizeBytes > OPENFOAM_MAX_INPUT_BYTES) {
        return error(
          `ファイルサイズは 1 バイト以上 ${OPENFOAM_MAX_INPUT_BYTES / (1024 * 1024)}MB 以下である必要があります`,
          400
        );
      }

      const requestId = createId("ofreq");
      const r2Key = generateOpenfoamInputR2Key(requestId, filename);
      const title = titleInput || filename.replace(/\.zip/i, "");
      const createdAt = new Date().toISOString();

      const fileBuffer = await fileEntry.arrayBuffer();
      const inputSha256 = await sha256HexFromBuffer(fileBuffer);
      const caseText = await extractOpenfoamTextForReview(fileBuffer);

      await env.FILES.put(r2Key, fileBuffer, {
        httpMetadata: { contentType: "application/zip" },
      });

      const row = await createOpenfoamRequest(db, {
        id: requestId,
        userId,
        title,
        desiredDate,
        maxRuntimeHours: maxRuntimeRaw,
        mpiProcesses,
        inputR2Key: r2Key,
        inputFilename: filename,
        inputSizeBytes: sizeBytes,
        inputSha256,
        notes: notesInput || null,
        createdAt,
        status: "primary_reviewing",
      });

      waitUntil(
        runOpenfoamPrimaryReviewJob(env, db, {
          requestId,
          caseText,
          filename,
          mpiProcesses,
          maxRuntimeHours: maxRuntimeRaw,
          forceSecondary,
        })
      );

      return json({ request: await formatOpenfoamRequestForApiEnriched(db, row) }, 201);
    }

    // --- Admin routes (management app access already verified) ---
    if (!isAdminRoute) {
      return error("Not Found", 404);
    }

    if (
      method === "GET" &&
      segments[1] === "calendar" &&
      segments[2] === "availability"
    ) {
      const date = url.searchParams.get("date");
      const scale = url.searchParams.get("scale") as SimScale | null;
      const simulatorId = url.searchParams.get("simulator_id");
      const excludeId = url.searchParams.get("exclude_reservation_id");
      if (!date) return error("date が必要です");

      const result = await getDateAvailability(db, date, {
        simulatorId,
        scale,
        excludeReservationId: excludeId,
        isAdmin: true,
      });
      return json(mapAvailabilityResponse(result));
    }

    // POST /api/simulation/admin/reservations
    if (method === "POST" && segments[1] === "reservations" && segments.length === 2) {
      const body = await request.json<{
        homeroom: string;
        student_number: number;
        student_name: string;
        title: string;
        purpose: string;
        purpose_other?: string | null;
        summary?: string | null;
        sim_notes?: string | null;
        sim_scale: SimScale;
        simulator_id: string;
        desired_date: string;
        stl_r2_key: string;
        stl_filename: string;
        stl_size_bytes: number;
        user_id?: string;
      }>();

      const required = [
        "homeroom",
        "student_number",
        "student_name",
        "title",
        "purpose",
        "sim_scale",
        "simulator_id",
        "desired_date",
        "stl_r2_key",
        "stl_filename",
        "stl_size_bytes",
      ] as const;

      for (const field of required) {
        if (body[field] === undefined || body[field] === null || body[field] === "") {
          return error(`${field} は必須です`);
        }
      }

      if (!isValidHomeroom(String(body.homeroom))) {
        return error("ホームルームは 101〜109、201〜209、301〜309 から選択してください");
      }

      const adminSimulatorError = await validateSimulatorId(db, body.simulator_id, {
        requireBookable: false,
      });
      if (adminSimulatorError) return error(adminSimulatorError);

      if (!isAdminDateBookable(body.desired_date)) {
        return error(`希望実施日は ${getAdminEarliestBookableDate()} 以降を選択してください`);
      }

      const slotError = await validateSimulatorReservationSlot(
        db,
        body.desired_date,
        body.simulator_id,
        body.sim_scale,
        "",
        { isAdmin: true }
      );
      if (slotError) return error(slotError);

      const keyExists = await verifyR2Key(env.FILES, body.stl_r2_key);
      if (!keyExists) {
        return error("ファイルが見つかりません。再度アップロードしてください");
      }

      const adminVideoResolved = await resolveRequestPrintVideo(
        db,
        body.simulator_id,
        (body as { request_result_video?: boolean }).request_result_video
      );
      if (!adminVideoResolved.ok) return error(adminVideoResolved.error);

      const targetUserId = body.user_id?.trim() || userId;

      const reservation: Reservation = {
        id: crypto.randomUUID(),
        grade: gradeFromHomeroom(String(body.homeroom)),
        homeroom: String(body.homeroom),
        student_number: Number(body.student_number),
        student_name: String(body.student_name),
        title: String(body.title).trim(),
        purpose: body.purpose as Reservation["purpose"],
        purpose_other: body.purpose_other ?? null,
        summary: body.summary?.trim() || null,
        sim_notes: body.sim_notes?.trim() || null,
        sim_scale: body.sim_scale,
        simulator_id: body.simulator_id,
        desired_date: body.desired_date,
        stl_r2_key: body.stl_r2_key,
        stl_filename: body.stl_filename,
        stl_size_bytes: Number(body.stl_size_bytes),
        status: "applied",
        status_comment: null,
        sim_staff: null,
        sim_staff_member_id: null,
        delivery_staff: null,
        google_event_id: null,
        request_result_video: adminVideoResolved.value ? 1 : 0,
        result_video_storage_path: null,
        result_video_filename: null,
        result_video_size_bytes: null,
        user_id: targetUserId,
        created_at: new Date().toISOString(),
      };

      await createReservation(db, reservation);

      context.waitUntil(
        (async () => {
          const webhookUrl = await resolveSimDiscordWebhookUrl(db, env);
          await notifyReservationApplication(webhookUrl, adminUrl, {
            title: reservation.title,
            desired_date: reservation.desired_date,
            sim_scale: reservation.sim_scale,
          });
        })()
      );

      const memberMap = await buildMemberMap(db);
      const simulatorMap = await buildSimulatorMap(db);
      return json(
        { id: reservation.id, reservation: enrichReservationForAdmin(reservation, memberMap, simulatorMap) },
        201
      );
    }

    // GET /api/simulation/admin/settings/notifications
    if (method === "GET" && segments[1] === "settings" && segments[2] === "notifications") {
      const discord_webhook_url = (await getSimDiscordWebhookUrlFromDb(db)) ?? "";
      const fds_discord_mention_user_ids = (
        await getFdsDiscordMentionUserIdsFromDb(db)
      ).join("\n");
      return json({ discord_webhook_url, fds_discord_mention_user_ids });
    }

    // PATCH /api/simulation/admin/settings/notifications
    if (method === "PATCH" && segments[1] === "settings" && segments[2] === "notifications") {
      const body = await request.json<{
        discord_webhook_url?: string | null;
        fds_discord_mention_user_ids?: string | null;
      }>();
      try {
        if (body.discord_webhook_url !== undefined) {
          await setSimDiscordWebhookUrl(db, body.discord_webhook_url ?? "");
        }
        if (body.fds_discord_mention_user_ids !== undefined) {
          await setFdsDiscordMentionUserIds(db, body.fds_discord_mention_user_ids ?? "");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "通知設定が不正です";
        return error(message, 400);
      }
      const discord_webhook_url = (await getSimDiscordWebhookUrlFromDb(db)) ?? "";
      const fds_discord_mention_user_ids = (
        await getFdsDiscordMentionUserIdsFromDb(db)
      ).join("\n");
      return json({ discord_webhook_url, fds_discord_mention_user_ids });
    }

    // GET /api/simulation/admin/settings/result-video
    if (method === "GET" && segments[1] === "settings" && segments[2] === "result-video") {
      const storage_path = await getPrintVideoStoragePath(db);
      const group_roots = await getManagementAccessibleGroupRoots(
        db,
        authUser.id,
        authUser.is_admin
      );
      return json({ storage_path, group_roots });
    }

    // PATCH /api/simulation/admin/settings/result-video
    if (method === "PATCH" && segments[1] === "settings" && segments[2] === "result-video") {
      const body = await request.json<{ storage_path?: string }>();
      const storagePath = body.storage_path?.trim() ?? "";
      const pathError = await validatePrintVideoStoragePathForUser(
        db,
        authUser.id,
        authUser.is_admin,
        storagePath
      );
      if (pathError) return error(pathError);
      await setPrintVideoStoragePath(db, storagePath.replace(/^\/+|\/+$/g, ""));
      return json({ storage_path: storagePath.replace(/^\/+|\/+$/g, "") });
    }

    // GET /api/simulation/admin/settings/storage-list
    if (method === "GET" && segments[1] === "settings" && segments[2] === "storage-list") {
      const listPath = url.searchParams.get("path") ?? "";
      const parsed = parseLogicalPath(listPath);
      if (!parsed) return error("パスが不正です");

      const pathError = await validatePrintVideoStoragePathForUser(
        db,
        authUser.id,
        authUser.is_admin,
        listPath
      );
      if (pathError) return error(pathError);

      const authorized = await authorizeStoragePath(
        env,
        db,
        authUser,
        listPath,
        "read",
        true
      );
      if (typeof authorized === "string") {
        return error(authorized, 403);
      }

      const result = await listDirectory(
        env,
        parsed.rootType,
        parsed.rootKey,
        parsed.relativePath,
        { limit: 200 }
      );
      return json({
        path: result.path,
        items: result.items.filter((item) => item.type === "folder"),
      });
    }

    // GET /api/simulation/admin/reservations
    if (method === "GET" && segments[1] === "reservations" && segments.length === 2) {
      const reservations = await getAllReservations(db);
      const memberMap = await buildMemberMap(db);
      const simulatorMap = await buildSimulatorMap(db);
      return json({
        reservations: reservations.map((r) => enrichReservationForAdmin(r, memberMap, simulatorMap)),
      });
    }

    // GET /api/simulation/admin/reservations/:id
    if (method === "GET" && segments[1] === "reservations" && segments.length === 3) {
      const reservation = await getReservationById(db, segments[2]);
      if (!reservation) return error("予約が見つかりません", 404);
      const memberMap = await buildMemberMap(db);
      const simulatorMap = await buildSimulatorMap(db);
      const availableIds = await getAvailableMemberIdsOnDate(db, reservation.desired_date);
      const members = await getAllMembers(db);
      const available_staff = members.filter(
        (m) =>
          availableIds.includes(m.id) || m.id === reservation.sim_staff_member_id
      );
      return json({
        reservation: enrichReservationForAdmin(reservation, memberMap, simulatorMap),
        available_staff,
      });
    }

    // PATCH /api/simulation/admin/reservations/:id
    if (method === "PATCH" && segments[1] === "reservations" && segments.length === 3) {
      const body = await request.json<{
        sim_staff_member_id?: string | null;
        status?: string;
        status_comment?: string | null;
      }>();

      const validStatuses = [
        "applied",
        "accepted",
        "running",
        "delivered",
        "failed",
        "cancelled",
      ];
      if (body.status && !validStatuses.includes(body.status)) {
        return error("ステータスが不正です");
      }

      let statusComment: string | null | undefined = undefined;
      if (body.status_comment !== undefined) {
        const trimmed = body.status_comment?.trim() ?? "";
        if (trimmed.length > 500) {
          return error("ステータスコメントは500文字以内で入力してください");
        }
        statusComment = trimmed || null;
      }

      const existing = await getReservationById(db, segments[2]);
      if (!existing) return error("予約が見つかりません", 404);

      if (body.status === "accepted" && existing.status === "applied") {
        return error("申請中の予約は「予約を受領」ボタンから受領してください", 400);
      }

      if (body.sim_staff_member_id) {
        const member = await getMemberById(db, body.sim_staff_member_id);
        if (!member) return error("指定されたメンバーが見つかりません", 400);
        const availableIds = await getAvailableMemberIdsOnDate(db, existing.desired_date);
        if (
          !availableIds.includes(body.sim_staff_member_id) &&
          body.sim_staff_member_id !== existing.sim_staff_member_id
        ) {
          return error("この日に対応可能なメンバーのみ割り当てできます", 400);
        }
      }

      await updateReservationAdmin(db, segments[2], {
        ...body,
        status_comment: statusComment,
      });
      const updated = await getReservationById(db, segments[2]);
      const memberMap = await buildMemberMap(db);
      const simulatorMap = await buildSimulatorMap(db);
      return json({
        reservation: updated ? enrichReservationForAdmin(updated, memberMap, simulatorMap) : null,
      });
    }

    // PATCH /api/simulation/admin/reservations/:id/content
    if (
      method === "PATCH" &&
      segments[1] === "reservations" &&
      segments[3] === "content" &&
      segments.length === 4
    ) {
      const body = await request.json<ReservationContentInput>();
      const reservation = await getReservationById(db, segments[2]);
      if (!reservation) return error("予約が見つかりません", 404);

      return applyReservationContentEdit(context, reservation, body, { isUser: false });
    }

    // PATCH /api/simulation/admin/reservations/:id/reschedule
    if (
      method === "PATCH" &&
      segments[1] === "reservations" &&
      segments[3] === "reschedule" &&
      segments.length === 4
    ) {
      const body = await request.json<{ desired_date: string }>();
      if (!body.desired_date || !/^\d{4}-\d{2}-\d{2}$/.test(body.desired_date)) {
        return error("desired_date が不正です");
      }

      try {
        const updated = await adminRescheduleReservation(env, segments[2], body.desired_date);
        const memberMap = await buildMemberMap(db);
        const simulatorMap = await buildSimulatorMap(db);
        return json({ reservation: enrichReservationForAdmin(updated, memberMap, simulatorMap) });
      } catch (err) {
        return error(err instanceof Error ? err.message : "リスケに失敗しました");
      }
    }

    // POST /api/simulation/admin/reservations/:id/accept
    if (
      method === "POST" &&
      segments[1] === "reservations" &&
      segments[3] === "accept" &&
      segments.length === 4
    ) {
      const body = await request.json<{ sim_staff_member_id: string }>();
      if (!body.sim_staff_member_id) {
        return error("実行担当者を選択してください");
      }

      const existing = await getReservationById(db, segments[2]);
      if (!existing) return error("予約が見つかりません", 404);
      if (existing.status !== "applied") {
        return error("申請中の予約のみ受領できます", 400);
      }

      const member = await getMemberById(db, body.sim_staff_member_id);
      if (!member) return error("指定されたメンバーが見つかりません", 400);

      const availableIds = await getAvailableMemberIdsOnDate(db, existing.desired_date);
      if (!availableIds.includes(body.sim_staff_member_id)) {
        return error("この日に対応可能なメンバーのみ割り当てできます", 400);
      }

      const accepted = await acceptReservation(db, segments[2], body.sim_staff_member_id);
      if (!accepted) return error("予約の受領に失敗しました", 400);

      const updated = await getReservationById(db, segments[2]);
      const memberMap = await buildMemberMap(db);

      let calendar: { ok: boolean; error?: string } = {
        ok: false,
        error: "予約データの取得に失敗しました",
      };

      if (updated) {
        const calendarResult = await createCalendarEventForReservation(env, updated, memberMap);
        if (calendarResult.ok && calendarResult.eventId) {
          await setGoogleEventId(db, segments[2], calendarResult.eventId);
          calendar = { ok: true };
        } else {
          calendar = {
            ok: false,
            error: calendarResult.error ?? "カレンダーへの追加に失敗しました",
          };
        }
      }

      const finalReservation = await getReservationById(db, segments[2]);
      const simulatorMap = await buildSimulatorMap(db);
      return json({
        reservation: finalReservation
          ? enrichReservationForAdmin(finalReservation, memberMap, simulatorMap)
          : null,
        calendar,
      });
    }

    // GET /api/simulation/admin/calendar/status
    if (method === "GET" && segments[1] === "calendar" && segments[2] === "status") {
      const status = await testGoogleCalendarConnection(env);
      return json(status);
    }

    // GET /api/simulation/admin/members
    if (method === "GET" && segments[1] === "members" && segments.length === 2) {
      const members = await getAllMembers(db);
      return json({ members });
    }

    // GET /api/simulation/admin/phone-verifications
    if (method === "GET" && segments[1] === "phone-verifications" && segments.length === 2) {
      const users = await listSimPhoneVerificationUsers(db);
      return json({ users });
    }

    // POST /api/simulation/admin/phone-verifications/:userId/revoke
    if (
      method === "POST" &&
      segments[1] === "phone-verifications" &&
      segments.length === 4 &&
      segments[3] === "revoke"
    ) {
      const targetUserId = segments[2];
      const audit = await phoneVerificationAuditFromRequest(request);
      try {
        await revokeSimPhoneVerificationForUser(db, targetUserId, userId, audit);
      } catch (err) {
        const code = (err as Error & { code?: string }).code;
        if (code === "SIM_PHONE_NOT_FOUND") {
          return error((err as Error).message, 404);
        }
        throw err;
      }
      return json({ ok: true });
    }

    // POST /api/simulation/admin/members
    if (method === "POST" && segments[1] === "members" && segments.length === 2) {
      const body = await request.json<{
        homeroom: string;
        student_number: number;
        name: string;
        discord_user_id?: string | null;
      }>();

      if (!body.homeroom || !body.student_number || !body.name?.trim()) {
        return error("ホームルーム・出席番号・名前は必須です");
      }

      if (!isValidHomeroom(String(body.homeroom))) {
        return error("ホームルームは 101〜109、201〜209、301〜309 から選択してください");
      }

      if (!isValidDiscordUserId(body.discord_user_id)) {
        return error("DiscordユーザーIDの形式が不正です（17〜20桁の数字）");
      }

      const existingMembers = await getAllMembers(db);
      const member: Member = {
        id: crypto.randomUUID(),
        homeroom: String(body.homeroom),
        student_number: Number(body.student_number),
        name: String(body.name).trim(),
        color_index: existingMembers.length % 8,
        discord_user_id: body.discord_user_id?.trim() || null,
        created_at: new Date().toISOString(),
      };

      try {
        await createMember(db, member);
      } catch {
        return error("同じホームルーム・出席番号のメンバーが既に登録されています", 409);
      }

      return json({ member }, 201);
    }

    // PATCH /api/simulation/admin/members/:id
    if (method === "PATCH" && segments[1] === "members" && segments.length === 3) {
      const body = await request.json<{ color_index?: number; discord_user_id?: string | null }>();
      const hasColor = body.color_index !== undefined;
      const hasDiscord = body.discord_user_id !== undefined;

      if (!hasColor && !hasDiscord) {
        return error("color_index または discord_user_id が必要です");
      }

      if (hasColor && !isValidColorIndex(body.color_index!)) {
        return error("color_index が不正です（0〜7）");
      }

      if (hasDiscord && !isValidDiscordUserId(body.discord_user_id)) {
        return error("DiscordユーザーIDの形式が不正です（17〜20桁の数字）");
      }

      const member = await getMemberById(db, segments[2]);
      if (!member) return error("メンバーが見つかりません", 404);

      if (hasColor) {
        await updateMemberColor(db, segments[2], body.color_index!);
      }
      if (hasDiscord) {
        const discordId = body.discord_user_id?.trim() || null;
        await updateMemberDiscordUserId(db, segments[2], discordId);
      }

      const updated = await getMemberById(db, segments[2]);
      return json({ member: updated });
    }

    // DELETE /api/simulation/admin/members/:id
    if (method === "DELETE" && segments[1] === "members" && segments.length === 3) {
      const deleted = await deleteMember(db, segments[2]);
      if (!deleted) return error("メンバーが見つかりません", 404);
      return json({ ok: true });
    }

    // GET /api/simulation/admin/shifts
    if (method === "GET" && segments[1] === "shifts" && segments.length === 2) {
      const year = parseInt(url.searchParams.get("year") ?? "", 10);
      const month = parseInt(url.searchParams.get("month") ?? "", 10);
      if (!year || !month) return error("year と month が必要です");

      const { start, end } = getMonthRange(year, month);
      const members = await getAllMembers(db);
      const availability = await getAvailabilityInRange(db, start, end);
      const simulators = await getAllSimulators(db);
      const simulatorAvailability = await getSimulatorAvailabilityInRange(db, start, end);
      return json({
        year,
        month,
        members,
        availability,
        simulators: simulators.map((p) => formatSimulatorForApi(p)),
        simulator_availability: simulatorAvailability,
      });
    }

    // PUT /api/simulation/admin/shifts/simulator-availability
    if (method === "PUT" && segments[1] === "shifts" && segments[2] === "simulator-availability") {
      const body = await request.json<{
        simulator_id: string;
        dates: string[];
        available: boolean;
      }>();

      if (!body.simulator_id || !Array.isArray(body.dates)) {
        return error("simulator_id と dates が必要です");
      }

      const simulator = await getSimulatorById(db, body.simulator_id);
      if (!simulator) return error("シミュレーターが見つかりません", 404);

      const validDates = body.dates.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));

      if (body.available === false) {
        const block = await checkSimulatorShiftRemovalBlockedForDates(
          db,
          body.simulator_id,
          validDates
        );
        if (block.blocked && block.date) {
          return simulatorShiftBlockError(block.date, block.reservations);
        }
      }

      await setSimulatorAvailability(db, body.simulator_id, validDates, body.available !== false);
      return json({ ok: true });
    }

    // POST /api/simulation/admin/shifts/simulator-toggle
    if (method === "POST" && segments[1] === "shifts" && segments[2] === "simulator-toggle") {
      const body = await request.json<{ simulator_id: string; date: string }>();
      if (!body.simulator_id || !body.date) return error("simulator_id と date が必要です");

      const simulator = await getSimulatorById(db, body.simulator_id);
      if (!simulator) return error("シミュレーターが見つかりません", 404);

      const isCurrentlyAvailable = await isSimulatorAvailableOnDate(db, body.simulator_id, body.date);
      if (isCurrentlyAvailable) {
        const block = await checkSimulatorShiftRemovalBlocked(db, body.simulator_id, body.date);
        if (block.blocked) {
          return simulatorShiftBlockError(body.date, block.reservations);
        }
      }

      const available = await toggleSimulatorAvailability(db, body.simulator_id, body.date);
      return json({ available });
    }

    // PUT /api/simulation/admin/shifts/availability
    if (method === "PUT" && segments[1] === "shifts" && segments[2] === "availability") {
      const body = await request.json<{
        member_id: string;
        dates: string[];
        available: boolean;
      }>();

      if (!body.member_id || !Array.isArray(body.dates)) {
        return error("member_id と dates が必要です");
      }

      const member = await getMemberById(db, body.member_id);
      if (!member) return error("メンバーが見つかりません", 404);

      const validDates = body.dates.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));

      if (body.available === false) {
        const block = await checkShiftRemovalBlockedForDates(db, body.member_id, validDates);
        if (block.blocked && block.date) {
          return shiftBlockError(block.date, block.reservations);
        }
      }

      await setMemberAvailability(db, body.member_id, validDates, body.available !== false);
      return json({ ok: true });
    }

    // POST /api/simulation/admin/shifts/toggle
    if (method === "POST" && segments[1] === "shifts" && segments[2] === "toggle") {
      const body = await request.json<{ member_id: string; date: string }>();
      if (!body.member_id || !body.date) return error("member_id と date が必要です");

      const member = await getMemberById(db, body.member_id);
      if (!member) return error("メンバーが見つかりません", 404);

      const isCurrentlyAvailable = await isMemberAvailableOnDate(db, body.member_id, body.date);
      if (isCurrentlyAvailable) {
        const block = await checkShiftRemovalBlocked(db, body.member_id, body.date);
        if (block.blocked) {
          return shiftBlockError(body.date, block.reservations);
        }
      }

      const available = await toggleMemberAvailability(db, body.member_id, body.date);
      return json({ available });
    }

    // DELETE /api/simulation/admin/reservations/:id
    if (method === "DELETE" && segments[1] === "reservations" && segments.length === 3) {
      const reservation = await getReservationById(db, segments[2]);
      if (!reservation) return error("予約が見つかりません", 404);

      await deleteCalendarEvent(env, reservation.google_event_id);
      await env.FILES.delete(reservation.stl_r2_key);
      await deleteReservation(db, segments[2]);
      return json({ ok: true, message: "予約を削除しました" });
    }

    // GET /api/simulation/admin/simulators
    if (method === "GET" && segments[1] === "simulators" && segments.length === 2) {
      const simulators = await getAllSimulators(db);
      return json({ simulators: simulators.map(formatSimulatorForApi) });
    }

    // GET /api/simulation/admin/ec2-instances
    if (method === "GET" && segments[1] === "ec2-instances" && segments.length === 2) {
      const instances = await buildEc2InstanceCatalog(db);
      return json({ instance_family: "c7a,hpc6a", instances });
    }

    // POST /api/simulation/admin/ec2-instances
    if (method === "POST" && segments[1] === "ec2-instances" && segments.length === 2) {
      const body = await request.json<{ instance_type?: string }>();
      const instanceType = body.instance_type?.trim() ?? "";
      if (!instanceType) return error("instance_type は必須です");

      try {
        const simulator = await registerEc2InstanceAsSimulator(db, instanceType);
        return json({ simulator: formatSimulatorForApi(simulator) }, 201);
      } catch (err) {
        const message = err instanceof Error ? err.message : "登録に失敗しました";
        return error(message, 400);
      }
    }

    // POST /api/simulation/admin/simulators
    if (method === "POST" && segments[1] === "simulators" && segments.length === 2) {
      const contentType = request.headers.get("content-type") ?? "";
      let name = "";
      let imageFile: File | null = null;

      if (contentType.includes("multipart/form-data")) {
        const formData = await request.formData();
        name = String(formData.get("name") ?? "").trim();
        const image = formData.get("image");
        imageFile = image instanceof File && image.size > 0 ? image : null;
      } else {
        const body = await request.json<{ name?: string }>();
        name = body.name?.trim() ?? "";
      }

      if (!name) return error("シミュレーター名は必須です");

      const simulatorId = crypto.randomUUID();
      let imageR2Key: string | null = null;
      if (imageFile) {
        imageR2Key = await uploadSimulatorImage(
          env.FILES,
          simulatorId,
          imageFile.name,
          await imageFile.arrayBuffer()
        );
      }

      const simulator = await createSimulator(db, {
        id: simulatorId,
        name,
        image_r2_key: imageR2Key,
      });
      return json({ simulator: formatSimulatorForApi(simulator) }, 201);
    }

    // PATCH /api/simulation/admin/simulators/:id
    if (method === "PATCH" && segments[1] === "simulators" && segments.length === 3) {
      const body = await request.json<{
        name?: string;
        status?: string;
        daily_capacity?: {
          max_small?: number;
          max_small_with_main?: number;
          max_medium?: number;
          max_large?: number;
          allow_small_with_medium?: boolean;
          allow_small_with_large?: boolean;
        };
        capabilities?: {
          can_record_result_video?: boolean;
          nozzle_sizes_mm?: string[];
        };
      }>();

      const hasName = body.name !== undefined;
      const hasCapabilities = body.capabilities !== undefined;
      const hasStatus = body.status !== undefined;
      const hasDailyCapacity = body.daily_capacity !== undefined;
      if (!hasName && !hasCapabilities && !hasStatus && !hasDailyCapacity) {
        return error("name、status、daily_capacity、または capabilities が必要です");
      }

      const simulator = await getSimulatorById(db, segments[2]);
      if (!simulator) return error("シミュレーターが見つかりません", 404);

      if (hasName) {
        const name = body.name?.trim() ?? "";
        if (!name) return error("シミュレーター名は必須です");
        await updateSimulatorName(db, segments[2], name);
      }

      if (hasStatus) {
        const statusError = validateSimulatorStatusInput(body.status);
        if (statusError) return error(statusError);
        await updateSimulatorStatus(db, segments[2], body.status as SimulatorStatus);
      }

      if (hasCapabilities) {
        const capabilityResult = validateSimulatorCapabilitiesInput(body.capabilities);
        if ("error" in capabilityResult) return error(capabilityResult.error);
        await updateSimulatorCapabilities(db, segments[2], capabilityResult.capabilities);
      }

      if (hasDailyCapacity) {
        const capacityResult = validateSimulatorDailyCapacityInput(body.daily_capacity);
        if ("error" in capacityResult) return error(capacityResult.error);
        await updateSimulatorDailyCapacity(db, segments[2], capacityResult.capacity);
      }

      const updated = await getSimulatorById(db, segments[2]);
      return json({ simulator: updated ? formatSimulatorForApi(updated) : null });
    }

    // PUT /api/simulation/admin/simulators/:id/image
    if (
      method === "PUT" &&
      segments[1] === "simulators" &&
      segments[3] === "image" &&
      segments.length === 4
    ) {
      const simulator = await getSimulatorById(db, segments[2]);
      if (!simulator) return error("シミュレーターが見つかりません", 404);

      const formData = await request.formData();
      const image = formData.get("image");
      if (!(image instanceof File) || image.size <= 0) {
        return error("画像ファイルが必要です");
      }

      const imageR2Key = await uploadSimulatorImage(
        env.FILES,
        simulator.id,
        image.name,
        await image.arrayBuffer()
      );

      if (simulator.image_r2_key) {
        await env.FILES.delete(simulator.image_r2_key);
      }
      await updateSimulatorImage(db, simulator.id, imageR2Key);

      const updated = await getSimulatorById(db, simulator.id);
      return json({ simulator: updated ? formatSimulatorForApi(updated) : null });
    }

    // DELETE /api/simulation/admin/simulators/:id
    if (method === "DELETE" && segments[1] === "simulators" && segments.length === 3) {
      const simulator = await getSimulatorById(db, segments[2]);
      if (!simulator) return error("シミュレーターが見つかりません", 404);

      const reservationCount = await countReservationsBySimulatorId(db, segments[2]);
      if (reservationCount > 0) {
        return error("このシミュレーターを使用した予約があるため削除できません", 409);
      }

      if (simulator.image_r2_key) {
        await env.FILES.delete(simulator.image_r2_key);
      }

      const deleted = await deleteSimulator(db, segments[2]);
      if (!deleted) return error("シミュレーターの削除に失敗しました", 400);
      return json({ ok: true });
    }

    // GET /api/simulation/admin/fds-requests
    if (method === "GET" && segments[1] === "fds-requests" && segments.length === 2) {
      const pendingOnly = url.searchParams.get("pending") === "1";
      const rows = pendingOnly
        ? await listPendingFdsRequests(db)
        : await listFdsRequestsAdmin(db);
      const requests = await Promise.all(rows.map((row) => formatFdsRequestForApiEnriched(db, row)));
      return json({ requests });
    }

    // GET /api/simulation/admin/fds-requests/:id
    if (method === "GET" && segments[1] === "fds-requests" && segments.length === 3) {
      const row = await getFdsRequestById(db, segments[2]);
      if (!row) return error("依頼が見つかりません", 404);
      return json({ request: await formatFdsRequestForApiEnriched(db, row) });
    }

    // GET /api/simulation/admin/fds-requests/:id/input/download
    if (
      method === "GET" &&
      segments[1] === "fds-requests" &&
      segments.length === 5 &&
      segments[3] === "input" &&
      segments[4] === "download"
    ) {
      const row = await getFdsRequestById(db, segments[2]);
      if (!row) return error("依頼が見つかりません", 404);
      const obj = await env.FILES.get(row.input_r2_key);
      if (!obj) return error("入力ファイルが見つかりません", 404);
      return new Response(obj.body, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": attachmentFilename(row.input_filename),
        },
      });
    }

    // POST /api/simulation/admin/fds-requests/:id/approve
    if (
      method === "POST" &&
      segments[1] === "fds-requests" &&
      segments.length === 4 &&
      segments[3] === "approve"
    ) {
      const row = await getFdsRequestById(db, segments[2]);
      if (!row) return error("依頼が見つかりません", 404);
      if (row.status !== "pending_approval") {
        return error("この依頼は承認できません", 400);
      }

      const jobId = createId("fds");
      const createdAt = new Date().toISOString();
      const job = await createFdsJob(db, {
        id: jobId,
        title: row.title,
        inputR2Key: row.input_r2_key,
        inputFilename: row.input_filename,
        inputSizeBytes: row.input_size_bytes,
        inputSha256: row.input_sha256,
        instanceType: row.ec2_instance_type,
        maxRuntimeHours: row.max_runtime_hours,
        mpiProcesses: row.mpi_processes,
        createdByUserId: row.user_id,
        createdAt,
      });

      const reviewedAt = new Date().toISOString();
      await markFdsRequestApproved(db, row.id, jobId, userId, reviewedAt);

      try {
        const launched = await launchFdsJobOnEc2(env, job, getOAuthRedirectBase(request, env));
        const approvedRow = await getFdsRequestById(db, row.id);
        return json({
          request: approvedRow ? await formatFdsRequestForApiEnriched(db, approvedRow) : null,
          job: await formatFdsJobForAdminApi(env, launched.job, { liveEc2: true }),
          launch_steps: launched.steps,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "EC2 起動に失敗しました";
        await deleteFdsJob(db, jobId);
        await db
          .prepare(
            `UPDATE sim_fds_requests
             SET status = 'pending_approval', fds_job_id = NULL, reviewed_by_user_id = NULL, reviewed_at = NULL
             WHERE id = ?`
          )
          .bind(row.id)
          .run();
        return error(message, 502);
      }
    }

    // GET /api/simulation/admin/fds-requests/:id/messages
    if (
      method === "GET" &&
      segments[1] === "fds-requests" &&
      segments.length === 4 &&
      segments[3] === "messages"
    ) {
      return handleFdsRequestChatList(env, db, request, {
        requestId: segments[2],
        userId,
        apiPrefix: "admin/fds-requests",
      });
    }

    // POST /api/simulation/admin/fds-requests/:id/messages
    if (
      method === "POST" &&
      segments[1] === "fds-requests" &&
      segments.length === 4 &&
      segments[3] === "messages"
    ) {
      return handleFdsRequestChatPost(env, db, request, {
        requestId: segments[2],
        userId,
        apiPrefix: "admin/fds-requests",
      });
    }

    // GET /api/simulation/admin/fds-requests/:id/messages/:msgId/attachment/download
    if (
      method === "GET" &&
      segments[1] === "fds-requests" &&
      segments.length === 7 &&
      segments[3] === "messages" &&
      segments[5] === "attachment" &&
      segments[6] === "download"
    ) {
      return handleFdsRequestChatAttachmentDownload(env, db, {
        requestId: segments[2],
        messageId: segments[4],
        userId,
      });
    }

    // POST /api/simulation/admin/fds-requests/:id/replace-input
    if (
      method === "POST" &&
      segments[1] === "fds-requests" &&
      segments.length === 4 &&
      segments[3] === "replace-input"
    ) {
      const requestId = segments[2];
      const row = await getFdsRequestById(db, requestId);
      if (!row) return error("依頼が見つかりません", 404);
      if (!canStaffReplaceFdsRequestInput(row.status)) {
        return error("この依頼の入力ファイルは置き換えできません", 400);
      }

      const contentType = request.headers.get("content-type") ?? "";
      if (!contentType.includes("multipart/form-data")) {
        return error("multipart/form-data で送信してください", 400);
      }

      const formData = await request.formData();
      const fileEntry = formData.get("file");
      if (!(fileEntry instanceof File)) {
        return error("file フィールドに .fds ファイルを指定してください", 400);
      }

      const filename = fileEntry.name.trim();
      const validationError = validateFdsFilename(filename);
      if (validationError) return error(validationError, 400);

      const sizeBytes = fileEntry.size;
      if (sizeBytes <= 0 || sizeBytes > FDS_MAX_INPUT_BYTES) {
        return error(
          `ファイルサイズは 1 バイト以上 ${FDS_MAX_INPUT_BYTES / (1024 * 1024)}MB 以下である必要があります`,
          400
        );
      }

      const fileBuffer = await fileEntry.arrayBuffer();
      const inputSha256 = await sha256HexFromBuffer(fileBuffer);
      const fdsText = extractFdsTextForReview(fileBuffer);
      const r2Key = generateFdsInputR2Key(requestId, filename);

      await env.FILES.put(r2Key, fileBuffer, {
        httpMetadata: { contentType: "text/plain; charset=utf-8" },
      });

      try {
        const updated = await replaceFdsRequestInputByStaff(db, requestId, {
          inputR2Key: r2Key,
          inputFilename: filename,
          inputSizeBytes: sizeBytes,
          inputSha256,
        });

        await postFdsRequestSystemChatMessage(db, {
          requestId,
          senderUserId: userId,
          body: `[システム] 担当者が入力 .fds を更新しました（${filename}）。一次審査を再実行します。`,
        });

        waitUntil(
          runFdsPrimaryReviewJob(env, db, {
            requestId,
            fdsText,
            filename,
            mpiProcesses: updated.mpi_processes,
            maxRuntimeHours: updated.max_runtime_hours,
            forceSecondary: false,
          })
        );

        return json({ request: await formatFdsRequestForApiEnriched(db, updated) });
      } catch (err) {
        const message = err instanceof Error ? err.message : "入力ファイルの置き換えに失敗しました";
        return error(message, 400);
      }
    }

    // POST /api/simulation/admin/fds-requests/:id/reject
    if (
      method === "POST" &&
      segments[1] === "fds-requests" &&
      segments.length === 4 &&
      segments[3] === "reject"
    ) {
      const row = await getFdsRequestById(db, segments[2]);
      if (!row) return error("依頼が見つかりません", 404);
      if (row.status !== "pending_approval") {
        return error("この依頼は却下できません", 400);
      }

      let reviewMessage: string | null = null;
      try {
        const body = await request.json<{ message?: string }>();
        reviewMessage = String(body.message ?? "").trim() || null;
      } catch {
        reviewMessage = null;
      }

      const reviewedAt = new Date().toISOString();
      await markFdsRequestRejected(db, row.id, userId, reviewedAt, reviewMessage);
      const updated = await getFdsRequestById(db, row.id);
      return json({ request: updated ? await formatFdsRequestForApiEnriched(db, updated) : null });
    }

    // GET /api/simulation/admin/fds-jobs/config
    if (method === "GET" && segments[1] === "fds-jobs" && segments[2] === "config") {
      const config = getFdsAwsConfig(env);
      const ami = await fetchFdsAmiStatus(env);
      return json({
        aws: config,
        ami,
        r2_presign: Boolean(
          env.R2_ACCESS_KEY_ID?.trim() &&
            env.R2_SECRET_ACCESS_KEY?.trim() &&
            env.R2_ACCOUNT_ID?.trim()
        ),
        callback_secret: Boolean(env.FDS_JOB_CALLBACK_SECRET?.trim()),
        max_runtime_hours: 10,
        default_instance_type: env.AWS_EC2_INSTANCE_TYPE?.trim() || FDS_DEFAULT_INSTANCE_TYPE,
      });
    }

    // GET /api/simulation/admin/fds-jobs
    if (method === "GET" && segments[1] === "fds-jobs" && segments.length === 2) {
      const jobs = await listFdsJobs(db);
      const formatted = await Promise.all(
        jobs.map((job) => formatFdsJobForAdminApi(env, job, { liveEc2: false }))
      );
      return json({ jobs: formatted });
    }

    // POST /api/simulation/admin/fds-jobs/run — .fds をアップロードしてジョブ作成（EC2 起動は POST :id/run）
    if (method === "POST" && segments[1] === "fds-jobs" && segments[2] === "run") {
      const contentType = request.headers.get("content-type") ?? "";
      if (!contentType.includes("multipart/form-data")) {
        return error("multipart/form-data で送信してください", 400);
      }

      const formData = await request.formData();
      const fileEntry = formData.get("file");
      const titleInput = String(formData.get("title") ?? "").trim();

      if (!(fileEntry instanceof File)) {
        return error("file フィールドに .fds ファイルを指定してください", 400);
      }

      const filename = fileEntry.name.trim();
      const validationError = validateFdsFilename(filename);
      if (validationError) return error(validationError, 400);

      const sizeBytes = fileEntry.size;
      if (sizeBytes <= 0 || sizeBytes > FDS_MAX_INPUT_BYTES) {
        return error(`ファイルサイズは 1 バイト以上 ${FDS_MAX_INPUT_BYTES / (1024 * 1024)}MB 以下である必要があります`, 400);
      }

      const jobId = createId("fds");
      const r2Key = generateFdsInputR2Key(jobId, filename);
      const title = titleInput || filename.replace(/\.fds$/i, "");
      const instanceType = env.AWS_EC2_INSTANCE_TYPE?.trim() || FDS_DEFAULT_INSTANCE_TYPE;
      const createdAt = new Date().toISOString();

      await env.FILES.put(r2Key, await fileEntry.arrayBuffer(), {
        httpMetadata: { contentType: "text/plain; charset=utf-8" },
      });

      const job = await createFdsJob(db, {
        id: jobId,
        title,
        inputR2Key: r2Key,
        inputFilename: filename,
        inputSizeBytes: sizeBytes,
        instanceType,
        createdByUserId: userId,
        createdAt,
      });

      return json(
        {
          job: await formatFdsJobForAdminApi(env, job, { liveEc2: false }),
          launch_required: true,
          upload_steps: [
            { at: createdAt, message: `R2 に入力ファイルを保存しました (${r2Key})` },
            { at: new Date().toISOString(), message: `ジョブを作成しました (ID: ${jobId})` },
          ],
        },
        201
      );
    }

    // GET /api/simulation/admin/fds-jobs/:id
    if (
      method === "GET" &&
      segments[1] === "fds-jobs" &&
      segments.length === 3 &&
      segments[2] !== "config"
    ) {
      const job = await getFdsJobById(db, segments[2]);
      if (!job) return error("ジョブが見つかりません", 404);
      return json({ job: await formatFdsJobForAdminApi(env, job, { liveEc2: true }) });
    }

    // POST /api/simulation/admin/fds-jobs/:id/run
    if (
      method === "POST" &&
      segments[1] === "fds-jobs" &&
      segments.length === 4 &&
      segments[3] === "run"
    ) {
      const job = await getFdsJobById(db, segments[2]);
      if (!job) return error("ジョブが見つかりません", 404);
      if (job.status !== "pending" && job.status !== "failed" && job.status !== "cancelled") {
        return error("このジョブは再実行できません", 400);
      }

      try {
        const launched = await launchFdsJobOnEc2(env, job, getOAuthRedirectBase(request, env));
        return json({
          job: await formatFdsJobForAdminApi(env, launched.job, { liveEc2: true }),
          launch_steps: launched.steps,
        });
      } catch (launchErr) {
        if (launchErr instanceof Ec2AmiNotReadyError) {
          return error(launchErr.message, 503, {
            code: launchErr.code,
            ami_state: launchErr.amiState,
          });
        }
        const message =
          launchErr instanceof Error ? launchErr.message : "EC2 の起動に失敗しました";
        return error(message, 500);
      }
    }

    // POST /api/simulation/admin/fds-jobs/:id/cancel
    if (
      method === "POST" &&
      segments[1] === "fds-jobs" &&
      segments.length === 4 &&
      segments[3] === "cancel"
    ) {
      const job = await getFdsJobById(db, segments[2]);
      if (!job) return error("ジョブが見つかりません", 404);
      if (!["pending", "launching", "running"].includes(job.status)) {
        return error("このジョブはキャンセルできません", 400);
      }
      const cancelled = await cancelFdsJob(env, job);
      return json({ job: await formatFdsJobForAdminApi(env, cancelled, { liveEc2: true }) });
    }

    // GET /api/simulation/admin/fds-jobs/:id/input/download
    if (
      method === "GET" &&
      segments[1] === "fds-jobs" &&
      segments.length === 5 &&
      segments[3] === "input" &&
      segments[4] === "download"
    ) {
      const job = await getFdsJobById(db, segments[2]);
      if (!job) return error("ジョブが見つかりません", 404);
      const obj = await env.FILES.get(job.input_r2_key);
      if (!obj) return error("入力ファイルが見つかりません", 404);
      return new Response(obj.body, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": attachmentFilename(job.input_filename),
        },
      });
    }

    // GET /api/simulation/admin/fds-jobs/:id/output/download
    if (
      method === "GET" &&
      segments[1] === "fds-jobs" &&
      segments.length === 5 &&
      segments[3] === "output" &&
      segments[4] === "download"
    ) {
      const job = await getFdsJobById(db, segments[2]);
      if (!job?.output_r2_key) return error("結果ファイルがありません", 404);
      const obj = await env.FILES.get(job.output_r2_key);
      if (!obj) return error("結果ファイルが見つかりません", 404);
      const base = job.input_filename.replace(/\.fds$/i, "") || job.title || job.id;
      const filename = job.output_filename ?? `${base}-results.zip`;
      return new Response(obj.body, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": attachmentFilename(filename),
        },
      });
    }

    // GET /api/simulation/admin/fds-jobs/:id/log/download
    if (
      method === "GET" &&
      segments[1] === "fds-jobs" &&
      segments.length === 5 &&
      segments[3] === "log" &&
      segments[4] === "download"
    ) {
      const job = await getFdsJobById(db, segments[2]);
      if (!job?.log_r2_key) return error("ログファイルがありません", 404);
      const obj = await env.FILES.get(job.log_r2_key);
      if (!obj) return error("ログファイルが見つかりません", 404);
      return new Response(obj.body, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": attachmentFilename(`${job.id}-runner.log`),
        },
      });
    }

    // GET /api/simulation/admin/stl/:id
    if (method === "GET" && segments[1] === "stl" && segments.length === 3) {
      const reservation = await getReservationById(db, segments[2]);
      if (!reservation) return error("予約が見つかりません", 404);
      return streamSimFile(env.FILES, reservation.stl_r2_key, reservation.stl_filename);
    }

    // POST /api/simulation/admin/reservations/:id/result-video
    if (
      method === "POST" &&
      segments[1] === "reservations" &&
      segments.length === 4 &&
      segments[3] === "result-video"
    ) {
      const reservation = await getReservationById(db, segments[2]);
      if (!reservation) return error("予約が見つかりません", 404);

      const contentType = request.headers.get("content-type") ?? "";
      if (!contentType.includes("multipart/form-data")) {
        return error("multipart/form-data で送信してください", 400);
      }

      const formData = await request.formData();
      const file = formData.get("file");
      if (!(file instanceof File)) {
        return error("file フィールドが必要です", 400);
      }

      const filenameError = validatePrintVideoFilename(file.name);
      if (filenameError) return error(filenameError);

      const body = await file.arrayBuffer();
      const uploaded = await uploadPrintVideoToStorage(
        env,
        db,
        authUser,
        reservation,
        file.name,
        body
      );

      if (reservation.result_video_storage_path) {
        context.waitUntil(
          deletePrintVideoFile(env, db, reservation.result_video_storage_path)
        );
      }

      await updateReservationPrintVideo(db, reservation.id, {
        result_video_storage_path: uploaded.path,
        result_video_filename: uploaded.filename,
        result_video_size_bytes: uploaded.size,
      });

      const memberMap = await buildMemberMap(db);
      const simulatorMap = await buildSimulatorMap(db);
      const updated = await getReservationById(db, reservation.id);
      return json({
        reservation: updated
          ? enrichReservationForAdmin(updated, memberMap, simulatorMap)
          : null,
      });
    }

    // DELETE /api/simulation/admin/reservations/:id/result-video
    if (
      method === "DELETE" &&
      segments[1] === "reservations" &&
      segments.length === 4 &&
      segments[3] === "result-video"
    ) {
      const reservation = await getReservationById(db, segments[2]);
      if (!reservation) return error("予約が見つかりません", 404);

      if (reservation.result_video_storage_path) {
        await deletePrintVideoFile(env, db, reservation.result_video_storage_path);
      }
      await clearReservationPrintVideo(db, reservation.id);

      const memberMap = await buildMemberMap(db);
      const simulatorMap = await buildSimulatorMap(db);
      const updated = await getReservationById(db, reservation.id);
      return json({
        reservation: updated
          ? enrichReservationForAdmin(updated, memberMap, simulatorMap)
          : null,
      });
    }

    // GET /api/simulation/admin/reservations/:id/result-video/download
    if (
      method === "GET" &&
      segments[1] === "reservations" &&
      segments.length === 5 &&
      segments[3] === "result-video" &&
      segments[4] === "download"
    ) {
      const reservation = await getReservationById(db, segments[2]);
      if (!reservation) return error("予約が見つかりません", 404);
      if (!reservation.result_video_storage_path) {
        return error("結果動画はまだアップロードされていません", 404);
      }

      const parsed = parseLogicalPath(reservation.result_video_storage_path);
      if (!parsed?.relativePath) {
        return error("動画ファイルのパスが不正です", 500);
      }

      try {
        return await streamStorageFile(env, parsed);
      } catch (err) {
        const message = err instanceof Error ? err.message : "ダウンロードに失敗しました";
        return error(message, 404);
      }
    }

    // GET /api/simulation/admin/openfoam-requests
    if (method === "GET" && segments[1] === "openfoam-requests" && segments.length === 2) {
      const pendingOnly = url.searchParams.get("pending") === "1";
      const rows = pendingOnly
        ? await listPendingOpenfoamRequests(db)
        : await listOpenfoamRequestsAdmin(db);
      const requests = await Promise.all(rows.map((row) => formatOpenfoamRequestForApiEnriched(db, row)));
      return json({ requests });
    }

    // GET /api/simulation/admin/openfoam-requests/:id
    if (method === "GET" && segments[1] === "openfoam-requests" && segments.length === 3) {
      const row = await getOpenfoamRequestById(db, segments[2]);
      if (!row) return error("依頼が見つかりません", 404);
      return json({ request: await formatOpenfoamRequestForApiEnriched(db, row) });
    }

    // GET /api/simulation/admin/openfoam-requests/:id/input/download
    if (
      method === "GET" &&
      segments[1] === "openfoam-requests" &&
      segments.length === 5 &&
      segments[3] === "input" &&
      segments[4] === "download"
    ) {
      const row = await getOpenfoamRequestById(db, segments[2]);
      if (!row) return error("依頼が見つかりません", 404);
      const obj = await env.FILES.get(row.input_r2_key);
      if (!obj) return error("入力ファイルが見つかりません", 404);
      return new Response(obj.body, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": attachmentFilename(row.input_filename),
        },
      });
    }

    // POST /api/simulation/admin/openfoam-requests/:id/approve
    if (
      method === "POST" &&
      segments[1] === "openfoam-requests" &&
      segments.length === 4 &&
      segments[3] === "approve"
    ) {
      const row = await getOpenfoamRequestById(db, segments[2]);
      if (!row) return error("依頼が見つかりません", 404);
      if (row.status !== "pending_approval") {
        return error("この依頼は承認できません", 400);
      }

      const jobId = createId("of");
      const createdAt = new Date().toISOString();
      const job = await createOpenfoamJob(db, {
        id: jobId,
        title: row.title,
        inputR2Key: row.input_r2_key,
        inputFilename: row.input_filename,
        inputSizeBytes: row.input_size_bytes,
        inputSha256: row.input_sha256,
        instanceType: row.ec2_instance_type,
        maxRuntimeHours: row.max_runtime_hours,
        mpiProcesses: row.mpi_processes,
        createdByUserId: row.user_id,
        createdAt,
      });

      const reviewedAt = new Date().toISOString();
      await markOpenfoamRequestApproved(db, row.id, jobId, userId, reviewedAt);

      try {
        const launched = await launchOpenfoamJobOnEc2(env, job, getOAuthRedirectBase(request, env));
        const approvedRow = await getOpenfoamRequestById(db, row.id);
        return json({
          request: approvedRow ? await formatOpenfoamRequestForApiEnriched(db, approvedRow) : null,
          job: await formatOpenfoamJobForAdminApi(env, launched.job, { liveEc2: true }),
          launch_steps: launched.steps,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "EC2 起動に失敗しました";
        await deleteFdsJob(db, jobId);
        await db
          .prepare(
            `UPDATE sim_fds_requests
             SET status = 'pending_approval', fds_job_id = NULL, reviewed_by_user_id = NULL, reviewed_at = NULL
             WHERE id = ?`
          )
          .bind(row.id)
          .run();
        return error(message, 502);
      }
    }

    // GET /api/simulation/admin/openfoam-requests/:id/messages
    if (
      method === "GET" &&
      segments[1] === "openfoam-requests" &&
      segments.length === 4 &&
      segments[3] === "messages"
    ) {
      return handleOpenfoamRequestChatList(env, db, request, {
        requestId: segments[2],
        userId,
        apiPrefix: "admin/openfoam-requests",
      });
    }

    // POST /api/simulation/admin/openfoam-requests/:id/messages
    if (
      method === "POST" &&
      segments[1] === "openfoam-requests" &&
      segments.length === 4 &&
      segments[3] === "messages"
    ) {
      return handleOpenfoamRequestChatPost(env, db, request, {
        requestId: segments[2],
        userId,
        apiPrefix: "admin/openfoam-requests",
      });
    }

    // GET /api/simulation/admin/openfoam-requests/:id/messages/:msgId/attachment/download
    if (
      method === "GET" &&
      segments[1] === "openfoam-requests" &&
      segments.length === 7 &&
      segments[3] === "messages" &&
      segments[5] === "attachment" &&
      segments[6] === "download"
    ) {
      return handleOpenfoamRequestChatAttachmentDownload(env, db, {
        requestId: segments[2],
        messageId: segments[4],
        userId,
      });
    }

    // POST /api/simulation/admin/openfoam-requests/:id/replace-input
    if (
      method === "POST" &&
      segments[1] === "openfoam-requests" &&
      segments.length === 4 &&
      segments[3] === "replace-input"
    ) {
      const requestId = segments[2];
      const row = await getOpenfoamRequestById(db, requestId);
      if (!row) return error("依頼が見つかりません", 404);
      if (!canStaffReplaceOpenfoamRequestInput(row.status)) {
        return error("この依頼の入力ファイルは置き換えできません", 400);
      }

      const contentType = request.headers.get("content-type") ?? "";
      if (!contentType.includes("multipart/form-data")) {
        return error("multipart/form-data で送信してください", 400);
      }

      const formData = await request.formData();
      const fileEntry = formData.get("file");
      if (!(fileEntry instanceof File)) {
        return error("file フィールドに .zip ケースファイルを指定してください", 400);
      }

      const filename = fileEntry.name.trim();
      const validationError = validateOpenfoamFilename(filename);
      if (validationError) return error(validationError, 400);

      const sizeBytes = fileEntry.size;
      if (sizeBytes <= 0 || sizeBytes > OPENFOAM_MAX_INPUT_BYTES) {
        return error(
          `ファイルサイズは 1 バイト以上 ${OPENFOAM_MAX_INPUT_BYTES / (1024 * 1024)}MB 以下である必要があります`,
          400
        );
      }

      const fileBuffer = await fileEntry.arrayBuffer();
      const inputSha256 = await sha256HexFromBuffer(fileBuffer);
      const caseText = await extractOpenfoamTextForReview(fileBuffer);
      const r2Key = generateOpenfoamInputR2Key(requestId, filename);

      await env.FILES.put(r2Key, fileBuffer, {
        httpMetadata: { contentType: "application/zip" },
      });

      try {
        const updated = await replaceOpenfoamRequestInputByStaff(db, requestId, {
          inputR2Key: r2Key,
          inputFilename: filename,
          inputSizeBytes: sizeBytes,
          inputSha256,
        });

        await postFdsRequestSystemChatMessage(db, {
          requestId,
          senderUserId: userId,
          body: `[システム] 担当者が入力 .fds を更新しました（${filename}）。一次審査を再実行します。`,
        });

        waitUntil(
          runOpenfoamPrimaryReviewJob(env, db, {
            requestId,
            caseText,
            filename,
            mpiProcesses: updated.mpi_processes,
            maxRuntimeHours: updated.max_runtime_hours,
            forceSecondary: false,
          })
        );

        return json({ request: await formatOpenfoamRequestForApiEnriched(db, updated) });
      } catch (err) {
        const message = err instanceof Error ? err.message : "入力ファイルの置き換えに失敗しました";
        return error(message, 400);
      }
    }

    // POST /api/simulation/admin/openfoam-requests/:id/reject
    if (
      method === "POST" &&
      segments[1] === "openfoam-requests" &&
      segments.length === 4 &&
      segments[3] === "reject"
    ) {
      const row = await getOpenfoamRequestById(db, segments[2]);
      if (!row) return error("依頼が見つかりません", 404);
      if (row.status !== "pending_approval") {
        return error("この依頼は却下できません", 400);
      }

      let reviewMessage: string | null = null;
      try {
        const body = await request.json<{ message?: string }>();
        reviewMessage = String(body.message ?? "").trim() || null;
      } catch {
        reviewMessage = null;
      }

      const reviewedAt = new Date().toISOString();
      await markOpenfoamRequestRejected(db, row.id, userId, reviewedAt, reviewMessage);
      const updated = await getOpenfoamRequestById(db, row.id);
      return json({ request: updated ? await formatOpenfoamRequestForApiEnriched(db, updated) : null });
    }

    // GET /api/simulation/admin/openfoam-jobs/config
    if (method === "GET" && segments[1] === "openfoam-jobs" && segments[2] === "config") {
      const config = getOpenfoamAwsConfig(env);
      const ami = await fetchOpenfoamAmiStatus(env);
      return json({
        aws: config,
        ami,
        r2_presign: Boolean(
          env.R2_ACCESS_KEY_ID?.trim() &&
            env.R2_SECRET_ACCESS_KEY?.trim() &&
            env.R2_ACCOUNT_ID?.trim()
        ),
        callback_secret: Boolean(env.OPENFOAM_JOB_CALLBACK_SECRET?.trim()),
        max_runtime_hours: 10,
        default_instance_type: env.AWS_EC2_INSTANCE_TYPE?.trim() || OPENFOAM_DEFAULT_INSTANCE_TYPE,
      });
    }

    // GET /api/simulation/admin/openfoam-jobs
    if (method === "GET" && segments[1] === "openfoam-jobs" && segments.length === 2) {
      const jobs = await listOpenfoamJobs(db);
      const formatted = await Promise.all(
        jobs.map((job) => formatOpenfoamJobForAdminApi(env, job, { liveEc2: false }))
      );
      return json({ jobs: formatted });
    }

    // POST /api/simulation/admin/openfoam-jobs/run — .fds をアップロードしてジョブ作成（EC2 起動は POST :id/run）
    if (method === "POST" && segments[1] === "openfoam-jobs" && segments[2] === "run") {
      const contentType = request.headers.get("content-type") ?? "";
      if (!contentType.includes("multipart/form-data")) {
        return error("multipart/form-data で送信してください", 400);
      }

      const formData = await request.formData();
      const fileEntry = formData.get("file");
      const titleInput = String(formData.get("title") ?? "").trim();

      if (!(fileEntry instanceof File)) {
        return error("file フィールドに .zip ケースファイルを指定してください", 400);
      }

      const filename = fileEntry.name.trim();
      const validationError = validateOpenfoamFilename(filename);
      if (validationError) return error(validationError, 400);

      const sizeBytes = fileEntry.size;
      if (sizeBytes <= 0 || sizeBytes > OPENFOAM_MAX_INPUT_BYTES) {
        return error(`ファイルサイズは 1 バイト以上 ${OPENFOAM_MAX_INPUT_BYTES / (1024 * 1024)}MB 以下である必要があります`, 400);
      }

      const jobId = createId("of");
      const r2Key = generateOpenfoamInputR2Key(jobId, filename);
      const title = titleInput || filename.replace(/\.zip/i, "");
      const instanceType = env.AWS_EC2_INSTANCE_TYPE?.trim() || OPENFOAM_DEFAULT_INSTANCE_TYPE;
      const createdAt = new Date().toISOString();

      await env.FILES.put(r2Key, await fileEntry.arrayBuffer(), {
        httpMetadata: { contentType: "application/zip" },
      });

      const job = await createOpenfoamJob(db, {
        id: jobId,
        title,
        inputR2Key: r2Key,
        inputFilename: filename,
        inputSizeBytes: sizeBytes,
        instanceType,
        createdByUserId: userId,
        createdAt,
      });

      return json(
        {
          job: await formatOpenfoamJobForAdminApi(env, job, { liveEc2: false }),
          launch_required: true,
          upload_steps: [
            { at: createdAt, message: `R2 に入力ファイルを保存しました (${r2Key})` },
            { at: new Date().toISOString(), message: `ジョブを作成しました (ID: ${jobId})` },
          ],
        },
        201
      );
    }

    // GET /api/simulation/admin/openfoam-jobs/:id
    if (
      method === "GET" &&
      segments[1] === "openfoam-jobs" &&
      segments.length === 3 &&
      segments[2] !== "config"
    ) {
      const job = await getOpenfoamJobById(db, segments[2]);
      if (!job) return error("ジョブが見つかりません", 404);
      return json({ job: await formatOpenfoamJobForAdminApi(env, job, { liveEc2: true }) });
    }

    // POST /api/simulation/admin/openfoam-jobs/:id/run
    if (
      method === "POST" &&
      segments[1] === "openfoam-jobs" &&
      segments.length === 4 &&
      segments[3] === "run"
    ) {
      const job = await getOpenfoamJobById(db, segments[2]);
      if (!job) return error("ジョブが見つかりません", 404);
      if (job.status !== "pending" && job.status !== "failed" && job.status !== "cancelled") {
        return error("このジョブは再実行できません", 400);
      }

      try {
        const launched = await launchOpenfoamJobOnEc2(env, job, getOAuthRedirectBase(request, env));
        return json({
          job: await formatOpenfoamJobForAdminApi(env, launched.job, { liveEc2: true }),
          launch_steps: launched.steps,
        });
      } catch (launchErr) {
        if (launchErr instanceof Ec2AmiNotReadyError) {
          return error(launchErr.message, 503, {
            code: launchErr.code,
            ami_state: launchErr.amiState,
          });
        }
        const message =
          launchErr instanceof Error ? launchErr.message : "EC2 の起動に失敗しました";
        return error(message, 500);
      }
    }

    // POST /api/simulation/admin/openfoam-jobs/:id/cancel
    if (
      method === "POST" &&
      segments[1] === "openfoam-jobs" &&
      segments.length === 4 &&
      segments[3] === "cancel"
    ) {
      const job = await getOpenfoamJobById(db, segments[2]);
      if (!job) return error("ジョブが見つかりません", 404);
      if (!["pending", "launching", "running"].includes(job.status)) {
        return error("このジョブはキャンセルできません", 400);
      }
      const cancelled = await cancelOpenfoamJob(env, job);
      return json({ job: await formatOpenfoamJobForAdminApi(env, cancelled, { liveEc2: true }) });
    }

    // GET /api/simulation/admin/openfoam-jobs/:id/input/download
    if (
      method === "GET" &&
      segments[1] === "openfoam-jobs" &&
      segments.length === 5 &&
      segments[3] === "input" &&
      segments[4] === "download"
    ) {
      const job = await getOpenfoamJobById(db, segments[2]);
      if (!job) return error("ジョブが見つかりません", 404);
      const obj = await env.FILES.get(job.input_r2_key);
      if (!obj) return error("入力ファイルが見つかりません", 404);
      return new Response(obj.body, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": attachmentFilename(job.input_filename),
        },
      });
    }

    // GET /api/simulation/admin/openfoam-jobs/:id/output/download
    if (
      method === "GET" &&
      segments[1] === "openfoam-jobs" &&
      segments.length === 5 &&
      segments[3] === "output" &&
      segments[4] === "download"
    ) {
      const job = await getOpenfoamJobById(db, segments[2]);
      if (!job?.output_r2_key) return error("結果ファイルがありません", 404);
      const obj = await env.FILES.get(job.output_r2_key);
      if (!obj) return error("結果ファイルが見つかりません", 404);
      const base = job.input_filename.replace(/\.zip/i, "") || job.title || job.id;
      const filename = job.output_filename ?? `${base}-results.zip`;
      return new Response(obj.body, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": attachmentFilename(filename),
        },
      });
    }

    // GET /api/simulation/admin/openfoam-jobs/:id/log/download
    if (
      method === "GET" &&
      segments[1] === "openfoam-jobs" &&
      segments.length === 5 &&
      segments[3] === "log" &&
      segments[4] === "download"
    ) {
      const job = await getOpenfoamJobById(db, segments[2]);
      if (!job?.log_r2_key) return error("ログファイルがありません", 404);
      const obj = await env.FILES.get(job.log_r2_key);
      if (!obj) return error("ログファイルが見つかりません", 404);
      return new Response(obj.body, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": attachmentFilename(`${job.id}-runner.log`),
        },
      });
    }

    // GET /api/simulation/admin/stl/:id
    if (method === "GET" && segments[1] === "stl" && segments.length === 3) {
      const reservation = await getReservationById(db, segments[2]);
      if (!reservation) return error("予約が見つかりません", 404);
      return streamSimFile(env.FILES, reservation.stl_r2_key, reservation.stl_filename);
    }

    // POST /api/simulation/admin/reservations/:id/result-video
    if (
      method === "POST" &&
      segments[1] === "reservations" &&
      segments.length === 4 &&
      segments[3] === "result-video"
    ) {
      const reservation = await getReservationById(db, segments[2]);
      if (!reservation) return error("予約が見つかりません", 404);

      const contentType = request.headers.get("content-type") ?? "";
      if (!contentType.includes("multipart/form-data")) {
        return error("multipart/form-data で送信してください", 400);
      }

      const formData = await request.formData();
      const file = formData.get("file");
      if (!(file instanceof File)) {
        return error("file フィールドが必要です", 400);
      }

      const filenameError = validatePrintVideoFilename(file.name);
      if (filenameError) return error(filenameError);

      const body = await file.arrayBuffer();
      const uploaded = await uploadPrintVideoToStorage(
        env,
        db,
        authUser,
        reservation,
        file.name,
        body
      );

      if (reservation.result_video_storage_path) {
        context.waitUntil(
          deletePrintVideoFile(env, db, reservation.result_video_storage_path)
        );
      }

      await updateReservationPrintVideo(db, reservation.id, {
        result_video_storage_path: uploaded.path,
        result_video_filename: uploaded.filename,
        result_video_size_bytes: uploaded.size,
      });

      const memberMap = await buildMemberMap(db);
      const simulatorMap = await buildSimulatorMap(db);
      const updated = await getReservationById(db, reservation.id);
      return json({
        reservation: updated
          ? enrichReservationForAdmin(updated, memberMap, simulatorMap)
          : null,
      });
    }

    // DELETE /api/simulation/admin/reservations/:id/result-video
    if (
      method === "DELETE" &&
      segments[1] === "reservations" &&
      segments.length === 4 &&
      segments[3] === "result-video"
    ) {
      const reservation = await getReservationById(db, segments[2]);
      if (!reservation) return error("予約が見つかりません", 404);

      if (reservation.result_video_storage_path) {
        await deletePrintVideoFile(env, db, reservation.result_video_storage_path);
      }
      await clearReservationPrintVideo(db, reservation.id);

      const memberMap = await buildMemberMap(db);
      const simulatorMap = await buildSimulatorMap(db);
      const updated = await getReservationById(db, reservation.id);
      return json({
        reservation: updated
          ? enrichReservationForAdmin(updated, memberMap, simulatorMap)
          : null,
      });
    }

    // GET /api/simulation/admin/reservations/:id/result-video/download
    if (
      method === "GET" &&
      segments[1] === "reservations" &&
      segments.length === 5 &&
      segments[3] === "result-video" &&
      segments[4] === "download"
    ) {
      const reservation = await getReservationById(db, segments[2]);
      if (!reservation) return error("予約が見つかりません", 404);
      if (!reservation.result_video_storage_path) {
        return error("結果動画はまだアップロードされていません", 404);
      }

      const parsed = parseLogicalPath(reservation.result_video_storage_path);
      if (!parsed?.relativePath) {
        return error("動画ファイルのパスが不正です", 500);
      }

      try {
        return await streamStorageFile(env, parsed);
      } catch (err) {
        const message = err instanceof Error ? err.message : "ダウンロードに失敗しました";
        return error(message, 404);
      }
    }

    return error("Not Found", 404);
  } catch (err) {
    const message = err instanceof Error ? err.message : "サーバーエラーが発生しました";
    return error(message, 500);
  }
};
