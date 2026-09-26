/**
 * 造形物コンテスト API
 */

import type { Env } from "../../lib/types";
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
  type PrintScale,
} from "../../lib/3dprint/slots";
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
  getAppliedReservationCountsByPrinter,
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
} from "../../lib/3dprint/reservations";
import { adminRescheduleReservation } from "../../lib/3dprint/reschedule";
import {
  createAdminForcePrintReservation,
  type AdminForceReservationInput,
} from "../../lib/3dprint/admin-force-reservation";
import { retryFailedReservation } from "../../lib/3dprint/retry-reservation";
import {
  checkShiftRemovalBlocked,
  checkShiftRemovalBlockedForDates,
  isMemberAvailableOnDate,
  isMemberAvailableOnReservationSpan,
  isValidDiscordUserId,
  type ShiftBlockReservation,
} from "../../lib/3dprint/shift-guard";
import {
  notifyReservationApplication,
  notifyReservationModified,
} from "../../lib/3dprint/discord";
import {
  buildContestManagementAdminUrl,
  buildContestEntryAppUrl,
  getContestEmailComposeSettings,
  notifyContestApplicantEmail,
  sendContestAdminTestEmail,
  sendContestCustomEmailToApplicant,
  resolveContestEmailStaffName,
  type ContestReservationStatus,
} from "../../lib/contest/contest-email";
import {
  createContestApplication,
  getContestApplicationForUser,
  listContestApplicationsForUser,
  listContestApplicationsForAdmin,
  deleteContestApplicationAsAdmin,
  patchContestApplicationForUser,
  withdrawContestApplicationForUser,
  getContestApplicationSubmittedStl,
} from "../../lib/contest/applications";
import {
  listContestStaffMessagesForUser,
  rejectContestPrintReservationAsAdmin,
  recordContestAcceptedStaffMessage,
  recordContestDecidedStaffMessage,
  recordContestStatusChangedStaffMessage,
  insertContestStaffMessage,
} from "../../lib/contest/staff-messages";
import { submitContestEntry } from "../../lib/contest/submit-entry";
import {
  listContestPublicGallery,
  resolveContestGalleryModelFile,
} from "../../lib/contest/public-gallery";
import {
  getContestStorageGroupSlug,
  setContestStorageGroupSlug,
  getContestManagementAccessibleGroupRoots,
  validateContestStorageGroupForUser,
} from "../../lib/contest/contest-app-settings";
import {
  buildContestSubmissionsLogicalDir,
  ensureContestStorageDirectories,
  syncContestSubmissionToStorage,
} from "../../lib/contest/contest-storage";
import {
  formatContestStlSubmissionLogForAdmin,
  listContestStlSubmissionLogsForReservation,
  logContestStlSubmission,
} from "../../lib/contest/stl-submission-logs";
import { getOAuthRedirectBase } from "../../lib/oauth";
import {
  createCalendarEventForReservation,
  deleteCalendarEvent,
  testGoogleCalendarConnection,
} from "../../lib/3dprint/google-calendar";
import {
  canEditReservation,
  validateGuestStaffAvailability,
  validateReservationContentFields,
  validateReservationSlot,
  type ReservationContentInput,
} from "../../lib/3dprint/reservation-edit";
import { isValidColorIndex } from "../../lib/3dprint/shifts";
import { isValidHomeroom, gradeFromHomeroom } from "../../lib/3dprint/homeroom";
import {
  getPrintUserProfile,
  isPrintProfileComplete,
} from "../../lib/3dprint/print-profile";
import {
  abortUpload,
  completeUpload,
  initiateUpload,
  simpleUpload,
  uploadPart,
  verifyR2Key,
  streamPrintFile,
} from "../../lib/3dprint/upload";
import {
  countReservationsByPrinterId,
  createPrinter,
  deletePrinter,
  formatPrinterForApi,
  getAllPrinters,
  getPrinterById,
  updatePrinterImage,
  updatePrinterName,
  updatePrinterCapabilities,
  updatePrinterStatus,
  updatePrinterDailyCapacity,
  getPrinterBookingError,
  validatePrinterDailyCapacityInput,
  type Printer,
} from "../../lib/3dprint/printers";
import { validatePrinterCapabilitiesInput, parsePrinterCapabilities } from "../../lib/3dprint/printer-capabilities";
import { validatePrinterStatusInput, type PrinterStatus } from "../../lib/3dprint/printer-status";
import {
  streamPrinterImage,
  uploadPrinterImage,
} from "../../lib/3dprint/printer-image";
import {
  getDateAvailability,
  validatePrinterReservationSpan,
} from "../../lib/3dprint/availability";
import {
  formatReservationCalendarApiFields,
  normalizePartCount,
  syncReservationSpanFields,
} from "../../lib/3dprint/calendar-span";
import {
  checkPrinterShiftRemovalBlocked,
  checkPrinterShiftRemovalBlockedForDates,
} from "../../lib/3dprint/printer-shift-guard";
import {
  getPrinterAvailabilityInRange,
  isPrinterAvailableOnDate,
  setPrinterAvailability,
  togglePrinterAvailability,
} from "../../lib/3dprint/printer-availability";
import { error, json } from "../../lib/3dprint/response";
import {
  getPrintVideoStoragePath,
  setPrintVideoStoragePath,
  getManagementAccessibleGroupRoots,
  validatePrintVideoStoragePathForUser,
} from "../../lib/3dprint/print-app-settings";
import {
  deletePrintVideoFile,
  resolveRequestPrintVideo,
  uploadPrintVideoToStorage,
  validatePrintVideoFilename,
} from "../../lib/3dprint/print-video";
import { parseLogicalPath } from "../../lib/storage/keys";
import { streamStorageFile } from "../../lib/storage/operations";
import { listDirectory } from "../../lib/storage/list";
import { authorizeStoragePath } from "../../lib/storage/permissions";

const RESERVATION_APP = "contest-entry";
const MANAGEMENT_APP = "contest-management";

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
  if (!r.print_staff_member_id) return null;
  const member = memberMap.get(r.print_staff_member_id);
  return member ? formatMemberLabel(member) : null;
}

/** Statuses shown on the contest entry personal calendar. */
const CONTEST_ENTRY_CALENDAR_STATUSES: Reservation["status"][] = [
  "applied",
  "accepted",
  "printing",
  "delivered",
];

/** Formats reservation for public calendar API. */
function publicCalendarReservation(
  r: Reservation,
  memberMap: Map<string, Member>,
  printerMap: Map<string, Printer>
) {
  return {
    id: r.id,
    print_scale: r.print_scale,
    printer_id: r.printer_id,
    printer_name: resolvePrinterLabel(r, printerMap),
    desired_date: r.desired_date,
    ...formatReservationCalendarApiFields(r),
    status: r.status,
    title: r.title,
    print_staff: resolvePrintStaffLabel(r, memberMap),
    retryable: r.status === "failed",
    owned: false as boolean,
  };
}

/** Formats reservation for user detail API. */
function userReservationDetail(
  r: Reservation,
  memberMap: Map<string, Member>,
  printerMap: Map<string, Printer>
) {
  return {
    id: r.id,
    title: r.title,
    print_scale: r.print_scale,
    printer_id: r.printer_id,
    printer_name: resolvePrinterLabel(r, printerMap),
    printer_capabilities: resolvePrinterCapabilities(r, printerMap),
    desired_date: r.desired_date,
    ...formatReservationCalendarApiFields(r),
    status: r.status,
    purpose: r.purpose,
    purpose_other: r.purpose_other || null,
    summary: r.summary || null,
    print_notes: r.print_notes || null,
    print_staff: resolvePrintStaffLabel(r, memberMap),
    status_comment: r.status_comment || null,
    stl_filename: r.stl_filename,
    stl_size_bytes: r.stl_size_bytes,
    request_print_video: Boolean(r.request_print_video),
    has_print_video: Boolean(r.print_video_storage_path),
    print_video_filename: r.print_video_filename || null,
    retryable: r.status === "failed",
    editable: canEditReservation(r) && r.status !== "failed",
    homeroom: r.homeroom,
    student_number: r.student_number,
    student_name: r.student_name,
  };
}

/** Builds a printer ID lookup map. */
async function buildPrinterMap(db: D1Database): Promise<Map<string, Printer>> {
  const printers = await getAllPrinters(db);
  return new Map(printers.map((p) => [p.id, p]));
}

/** Resolves printer capabilities from ID map. */
function resolvePrinterCapabilities(
  r: Reservation,
  printerMap: Map<string, Printer>
): ReturnType<typeof parsePrinterCapabilities> | null {
  if (!r.printer_id) return null;
  const printer = printerMap.get(r.printer_id);
  if (!printer) return null;
  return parsePrinterCapabilities(printer.capabilities_json);
}

/** Resolves printer display name from ID map. */
function resolvePrinterLabel(
  r: Reservation,
  printerMap: Map<string, Printer>
): string | null {
  if (!r.printer_id) return null;
  const printer = printerMap.get(r.printer_id);
  return printer?.name ?? null;
}

/** Builds a member ID lookup map. */
async function buildMemberMap(db: D1Database): Promise<Map<string, Member>> {
  const members = await getAllMembers(db);
  return new Map(members.map((m) => [m.id, m]));
}

/** Ensures a reservation belongs to the contest app. */
function assertContestReservation(r: Reservation | null): r is Reservation {
  return !!r && r.source === "contest";
}

async function sendContestStatusChangeEmail(
  env: Env,
  db: D1Database,
  request: Request,
  reservation: Reservation,
  previousStatus: Reservation['status'],
  newStatus: Reservation['status']
): Promise<void> {
  const printerMap = await buildPrinterMap(db);
  const memberMap = await buildMemberMap(db);
  const entryUrl = buildContestEntryAppUrl(getOAuthRedirectBase(request, env));
  await notifyContestApplicantEmail(env, db, reservation.user_id, 'status_changed', {
    reservation,
    printerName: resolvePrinterLabel(reservation, printerMap),
    printStaffLabel: resolvePrintStaffLabel(reservation, memberMap),
    statusComment: reservation.status_comment,
    previousStatus: previousStatus as ContestReservationStatus,
    newStatus: newStatus as ContestReservationStatus,
    entryAppUrl: entryUrl,
  });
}

async function sendContestAcceptedEmail(
  env: Env,
  db: D1Database,
  request: Request,
  reservation: Reservation
): Promise<void> {
  const printerMap = await buildPrinterMap(db);
  const memberMap = await buildMemberMap(db);
  await notifyContestApplicantEmail(env, db, reservation.user_id, 'accepted', {
    reservation,
    printerName: resolvePrinterLabel(reservation, printerMap),
    printStaffLabel: resolvePrintStaffLabel(reservation, memberMap),
    entryAppUrl: buildContestEntryAppUrl(getOAuthRedirectBase(request, env)),
  });
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
  printerMap: Map<string, Printer>
) {
  return {
    ...r,
    print_staff_label: resolvePrintStaffLabel(r, memberMap),
    printer_name: resolvePrinterLabel(r, printerMap),
    printer_capabilities: resolvePrinterCapabilities(r, printerMap),
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
    printerAvailable: result.printer_available,
    availableScales: result.available_scales,
    count: result.count,
    scales: result.scales,
    printers: result.printers,
  };
}

/** Returns 409 when printer shift removal is blocked by reservations. */
function printerShiftBlockError(
  date: string,
  reservations: { id: string; title: string; print_scale: string; desired_date: string; status: string }[]
): Response {
  return error("この日のプリンター稼働を外すには、紐づく予約をリスケしてください", 409, {
    code: "RESERVATIONS_ON_PRINTER_DATE",
    date,
    reservations,
  });
}

/** Validates printer_id exists and is bookable for user reservations. */
async function validatePrinterId(
  db: D1Database,
  printerId: string,
  options: { requireBookable?: boolean } = {}
): Promise<string | null> {
  const requireBookable = options.requireBookable !== false;
  if (!printerId?.trim()) return "印刷機種を選択してください";
  const printer = await getPrinterById(db, printerId);
  if (!printer) return "指定されたプリンターが見つかりません";
  if (requireBookable) {
    return getPrinterBookingError(printer);
  }
  return null;
}

/** Applies reservation content edit. */
async function applyReservationContentEdit(
  context: EventContext<Env, string, unknown>,
  reservation: Reservation,
  body: ReservationContentInput,
  options: { isUser: boolean; actorUserId: string }
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
    return error(`希望印刷日は ${minDate} 以降を選択してください`);
  }

  const printerId = body.printer_id ?? reservation.printer_id;
  if (!printerId) {
    return error("印刷機種を選択してください");
  }
  const printerError = await validatePrinterId(db, printerId, { requireBookable: options.isUser });
  if (printerError) return error(printerError);

  const partCount = normalizePartCount(body.part_count ?? reservation.part_count ?? 1);

  const slotError = await validateReservationSlot(
    db,
    body.desired_date,
    body.print_scale,
    reservation.id,
    printerId,
    { isAdmin: !options.isUser, partCount }
  );
  if (slotError) return error(slotError);

  if (options.isUser) {
    const staffError = await validateGuestStaffAvailability(db, body.desired_date);
    if (staffError) return error(staffError);
  }

  let stlR2Key = reservation.stl_r2_key;
  let stlFilename = reservation.stl_filename;
  let stlSizeBytes = reservation.stl_size_bytes;
  const stlWillChange =
    !!body.stl_r2_key && body.stl_r2_key !== reservation.stl_r2_key;

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
    printerId,
    body.request_print_video ?? reservation.request_print_video === 1
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
    print_notes: body.print_notes?.trim() || null,
    print_scale: body.print_scale,
    printer_id: printerId,
    desired_date: body.desired_date,
    part_count: partCount,
    request_print_video: videoResolved.value,
    stl_r2_key: stlR2Key,
    stl_filename: stlFilename,
    stl_size_bytes: stlSizeBytes,
  });

  context.waitUntil(
    notifyReservationModified(
      env.DISCORD_WEBHOOK_URL,
      buildContestManagementAdminUrl(getOAuthRedirectBase(context.request, env)),
      {
      title: String(body.title).trim(),
      desired_date: body.desired_date,
      print_scale: body.print_scale,
      }
    )
  );

  const updated = await getReservationById(db, reservation.id);
  if (updated?.source === "contest") {
    try {
      await syncContestSubmissionToStorage(env, db, updated);
    } catch (syncErr) {
      console.error("contest storage sync failed on update:", syncErr);
    }
    if (stlWillChange) {
      await logContestStlSubmission(db, {
        contest_application_id: updated.contest_application_id,
        print_reservation_id: updated.id,
        stl_r2_key: updated.stl_r2_key,
        stl_filename: updated.stl_filename,
        stl_size_bytes: updated.stl_size_bytes,
        uploaded_by_user_id: options.actorUserId,
        uploader_role: options.isUser ? "user" : "admin",
      });
    }
  }
  const memberMap = await buildMemberMap(db);
  const printerMap = await buildPrinterMap(db);
  return json({
    reservation: updated
      ? options.isUser
        ? userReservationDetail(updated, memberMap, printerMap)
        : enrichReservationForAdmin(updated, memberMap, printerMap)
      : null,
    message: "予約内容を修正しました。再承認をお待ちください",
  });
}

/** Loads user print profile or returns error response. */
async function requireCompletePrintProfile(
  db: D1Database,
  userId: string
): Promise<{ homeroom: string; student_number: number; student_name: string } | Response> {
  const profile = await getPrintUserProfile(db, userId);
  if (!profile || !isPrintProfileComplete(profile)) {
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
  const { request, env, params } = context;
  const url = new URL(request.url);
  const segments = parsePath(params.path as string);
  const method = request.method;
  const db = getDb(env);
  const adminUrl = buildContestManagementAdminUrl(getOAuthRedirectBase(request, env));

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
    const isAdminRoute = segments[0] === "admin";
    const isUploadRoute = segments[0] === "upload";

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
      segments[0] === "applications" ||
      segments[0] === "staff-messages" ||
      segments[0] === "entries" ||
      segments[0] === "gallery" ||
      segments[0] === "reservations" ||
      segments[0] === "printers" ||
      segments[0] === "print-videos" ||
      segments.length === 0
    ) {
      const resAccess = await requireAppAccess(request, env, RESERVATION_APP);
      if (resAccess instanceof Response) return resAccess;
    }

    const authUser = await requireUser(request, env);
    if (authUser instanceof Response) return authUser;
    const userId = authUser.id;

    // POST /api/3dprint/upload/initiate
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

    // GET /api/contest/gallery
    if (method === "GET" && segments[0] === "gallery" && segments.length === 1) {
      const entries = await listContestPublicGallery(db);
      return json({ entries });
    }

    // GET /api/contest/gallery/:id/model
    if (
      method === "GET" &&
      segments[0] === "gallery" &&
      segments.length === 3 &&
      segments[2] === "model"
    ) {
      const file = await resolveContestGalleryModelFile(db, segments[1]);
      if (!file) {
        return error("作品が見つかりません", 404);
      }
      try {
        return await streamPrintFile(env.FILES, file.r2_key, file.filename);
      } catch {
        return error("ファイルが見つかりません", 404);
      }
    }

    // GET /api/contest/applications
    if (method === "GET" && segments[0] === "applications" && segments.length === 1) {
      const applications = await listContestApplicationsForUser(db, userId);
      return json({ applications });
    }

    // GET /api/contest/staff-messages
    if (method === "GET" && segments[0] === "staff-messages" && segments.length === 1) {
      const since = url.searchParams.get("since");
      const messages = await listContestStaffMessagesForUser(db, userId, { since });
      return json({ messages });
    }

    // POST /api/contest/applications
    if (method === "POST" && segments[0] === "applications" && segments.length === 1) {
      const body = await request.json<{
        schedule_type?: "full_time" | "part_time";
        title?: string;
        impressions?: string | null;
        participants?: unknown;
        homeroom?: string;
        student_number?: number;
        student_name?: string;
        members?: unknown;
        self_print?: boolean;
      }>();
      try {
        const application = await createContestApplication(env, request, userId, {
          schedule_type: body.schedule_type ?? "full_time",
          title: String(body.title ?? ""),
          impressions: body.impressions ?? null,
          participants: body.participants,
          homeroom: body.homeroom !== undefined ? String(body.homeroom) : undefined,
          student_number:
            body.student_number !== undefined ? Number(body.student_number) : undefined,
          student_name:
            body.student_name !== undefined ? String(body.student_name) : undefined,
          members: body.members,
          self_print: Boolean(body.self_print),
        });
        return json({ application }, 201);
      } catch (err) {
        const message = err instanceof Error ? err.message : "参加申請に失敗しました";
        return error(message, 400);
      }
    }

    // GET /api/contest/applications/:id/stl
    if (
      method === "GET" &&
      segments[0] === "applications" &&
      segments.length === 3 &&
      segments[2] === "stl"
    ) {
      const stl = await getContestApplicationSubmittedStl(db, userId, segments[1]);
      if (!stl) return error("提出済みの STL が見つかりません", 404);
      return streamPrintFile(env.FILES, stl.r2_key, stl.filename);
    }

    // GET /api/contest/applications/:id
    if (method === "GET" && segments[0] === "applications" && segments.length === 2) {
      const application = await getContestApplicationForUser(db, userId, segments[1]);
      if (!application) return error("参加申請が見つかりません", 404);
      return json({ application });
    }

    // PATCH /api/contest/applications/:id
    if (method === "PATCH" && segments[0] === "applications" && segments.length === 2) {
      const body = await request.json<{
        title?: string;
        impressions?: string | null;
        participants?: unknown;
        members?: unknown;
        uses_multiple_parts?: boolean;
        part_count?: number | null;
      }>();
      try {
        const application = await patchContestApplicationForUser(
          db,
          userId,
          segments[1],
          body
        );
        return json({ application });
      } catch (err) {
        const message = err instanceof Error ? err.message : "更新に失敗しました";
        const status = message.includes("見つかりません") ? 404 : 400;
        return error(message, status);
      }
    }

    // POST /api/contest/applications/:id/withdraw
    if (
      method === "POST" &&
      segments[0] === "applications" &&
      segments.length === 3 &&
      segments[2] === "withdraw"
    ) {
      try {
        await withdrawContestApplicationForUser(env, db, userId, segments[1]);
        return json({ ok: true, message: "参加を取り消しました" });
      } catch (err) {
        const message = err instanceof Error ? err.message : "取り消しに失敗しました";
        const status = message.includes("見つかりません") ? 404 : 400;
        return error(message, status);
      }
    }

    // POST /api/contest/entries
    if (method === "POST" && segments[0] === "entries" && segments.length === 1) {
      const body = await request.json<{
        contest_application_id: string;
        stl_r2_key?: string;
        stl_filename?: string;
        stl_size_bytes?: number;
        stl_files?: Array<{
          stl_r2_key: string;
          stl_filename: string;
          stl_size_bytes: number;
        }>;
        print_notes?: string | null;
      }>();

      try {
        const result = await submitContestEntry(env, request, userId, {
          contest_application_id: String(body.contest_application_id ?? ""),
          stl_r2_key: body.stl_r2_key,
          stl_filename: body.stl_filename,
          stl_size_bytes: body.stl_size_bytes,
          stl_files: body.stl_files,
          print_notes: body.print_notes ?? null,
        });
        if (result.self_print) {
          return json(
            {
              self_print: true,
              message: "STL を提出しました（自己印刷）",
              application: result.application,
              calendar: result.calendar,
            },
            201
          );
        }
        const memberMap = await buildMemberMap(db);
        const printerMap = await buildPrinterMap(db);
        return json(
          {
            self_print: false,
            id: result.reservation!.id,
            message: "印刷依頼を受け付けました",
            reservation: enrichReservationForAdmin(
              result.reservation!,
              memberMap,
              printerMap
            ),
            calendar: result.calendar,
          },
          201
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "登録に失敗しました";
        let status = 400;
        if (message.includes("自動で割り当て")) status = 409;
        if (message.includes("進行中")) status = 409;
        return error(message, status);
      }
    }

    // GET /api/3dprint/printers
    if (method === "GET" && segments[0] === "printers" && segments.length === 1) {
      const date = url.searchParams.get("date");
      if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return error("date が不正です");
      }

      const printers = await getAllPrinters(db);
      const waitingCounts = await getAppliedReservationCountsByPrinter(db, date ?? undefined);
      const formatted = await Promise.all(
        printers.map(async (printer) => {
          const shiftAvailable = date
            ? await isPrinterAvailableOnDate(db, printer.id, date)
            : true;
          return {
            ...formatPrinterForApi(printer, waitingCounts[printer.id] ?? 0),
            shift_available: shiftAvailable,
          };
        })
      );
      return json({ printers: formatted });
    }

    // GET /api/3dprint/printers/:id/image
    if (
      method === "GET" &&
      segments[0] === "printers" &&
      segments[2] === "image" &&
      segments.length === 3
    ) {
      const printer = await getPrinterById(db, segments[1]);
      if (!printer?.image_r2_key) {
        return error("画像が見つかりません", 404);
      }
      const filename = printer.image_r2_key.split("/").pop() ?? "printer-image.png";
      return streamPrinterImage(env.FILES, printer.image_r2_key, filename);
    }

    // POST /api/3dprint/reservations
    if (method === "POST" && segments[0] === "reservations" && segments.length === 1) {
      const profile = await requireCompletePrintProfile(db, userId);
      if (profile instanceof Response) return profile;

      const body = await request.json<{
        title: string;
        purpose: "ss_s_tan" | "club" | "other";
        purpose_other?: string;
        summary?: string;
        print_notes?: string;
        request_print_video?: boolean;
        print_scale: PrintScale;
        printer_id: string;
        desired_date: string;
        stl_r2_key: string;
        stl_filename: string;
        stl_size_bytes: number;
        part_count?: number;
      }>();

      const required = [
        "title",
        "purpose",
        "print_scale",
        "printer_id",
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

      const printerError = await validatePrinterId(db, body.printer_id);
      if (printerError) return error(printerError);

      if (!["small", "medium", "large"].includes(body.print_scale)) {
        return error("印刷規模が不正です");
      }

      if (!["ss_s_tan", "club", "other"].includes(body.purpose)) {
        return error("目的が不正です");
      }

      if (body.purpose === "other" && !body.purpose_other?.trim()) {
        return error("目的が「その他」の場合は内容を入力してください");
      }

      if (!isDateBookable(body.desired_date)) {
        return error(`希望印刷日は ${getEarliestBookableDate()} 以降を選択してください`);
      }

      const partCount = normalizePartCount(body.part_count ?? 1);
      const span = syncReservationSpanFields(body.desired_date, partCount, body.print_scale);

      const slotError = await validatePrinterReservationSpan(
        db,
        body.desired_date,
        body.printer_id,
        span.print_scale,
        span.part_count,
        "",
        { isAdmin: false }
      );
      if (slotError) return error(slotError);

      const staffAvailable = await hasStaffOnDate(db, body.desired_date);
      if (!staffAvailable) {
        return error("この日は対応可能な印刷担当者がいないため予約できません");
      }

      const keyExists = await verifyR2Key(env.FILES, body.stl_r2_key);
      if (!keyExists) {
        return error("ファイルが見つかりません。再度アップロードしてください");
      }

      const videoResolved = await resolveRequestPrintVideo(
        db,
        body.printer_id,
        body.request_print_video
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
        print_notes: body.print_notes?.trim() || null,
        print_scale: span.print_scale,
        printer_id: body.printer_id,
        desired_date: body.desired_date,
        part_count: span.part_count,
        calendar_end_date: span.calendar_end_date,
        stl_r2_key: body.stl_r2_key,
        stl_filename: body.stl_filename,
        stl_size_bytes: Number(body.stl_size_bytes),
        status: "applied",
        status_comment: null,
        print_staff: null,
        print_staff_member_id: null,
        delivery_staff: null,
        google_event_id: null,
        request_print_video: videoResolved.value ? 1 : 0,
        print_video_storage_path: null,
        print_video_filename: null,
        print_video_size_bytes: null,
        user_id: userId,
        source: 'contest',
        schedule_type: null,
        contest_storage_path: null,
        contest_storage_filename: null,
        created_at: new Date().toISOString(),
      };

      await createReservation(db, reservation);

      try {
        await syncContestSubmissionToStorage(env, db, reservation);
      } catch (syncErr) {
        console.error("contest storage sync failed on user create:", syncErr);
      }

      await logContestStlSubmission(db, {
        contest_application_id: reservation.contest_application_id,
        print_reservation_id: reservation.id,
        stl_r2_key: reservation.stl_r2_key,
        stl_filename: reservation.stl_filename,
        stl_size_bytes: reservation.stl_size_bytes,
        uploaded_by_user_id: userId,
        uploader_role: "user",
        uploaded_at: reservation.created_at,
      });

      context.waitUntil(
        notifyReservationApplication(env.DISCORD_WEBHOOK_URL, adminUrl, {
          title: reservation.title,
          desired_date: reservation.desired_date,
          print_scale: reservation.print_scale,
        })
      );

      return json({ id: reservation.id, message: "予約申請を受け付けました" }, 201);
    }

    const RECENT_PAST_DAYS = 7;
    const OLDER_PAGE_SIZE = 15;

    // GET /api/3dprint/calendar/reservation-list
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
      const printerMap = await buildPrinterMap(db);
      const [upcoming, recentPast] = await Promise.all([
        getUserUpcomingReservations(db, userId, today),
        getUserRecentPastReservations(db, userId, recentPastStart, today),
      ]);
      const hasOlderPast = await hasUserReservationsBeforeDate(db, userId, recentPastStart);

      const mapOwned = (r: Reservation) => ({
        ...publicCalendarReservation(r, memberMap, printerMap),
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

    // GET /api/3dprint/calendar/reservation-list/older
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
      const printerMap = await buildPrinterMap(db);
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
          ...publicCalendarReservation(r, memberMap, printerMap),
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

    // GET /api/3dprint/calendar
    if (method === "GET" && segments[0] === "calendar" && segments.length === 1) {
      const year = parseInt(url.searchParams.get("year") ?? "", 10);
      const month = parseInt(url.searchParams.get("month") ?? "", 10);
      if (!year || !month) return error("year と month が必要です");

      const { start, end } = getMonthRange(year, month);
      const allInRange = await getReservationsInRange(db, start, end, "contest");
      const reservations = allInRange.filter(
        (r) =>
          r.user_id === userId &&
          CONTEST_ENTRY_CALENDAR_STATUSES.includes(r.status)
      );
      const memberMap = await buildMemberMap(db);
      const printerMap = await buildPrinterMap(db);
      const shiftAvailability = await getAvailabilityInRange(db, start, end);
      const printerAvailability = await getPrinterAvailabilityInRange(db, start, end);
      const staffCountByDate: Record<string, number> = {};
      const printerCountByDate: Record<string, number> = {};
      for (const row of shiftAvailability) {
        staffCountByDate[row.date] = (staffCountByDate[row.date] ?? 0) + 1;
      }
      for (const row of printerAvailability) {
        printerCountByDate[row.date] = (printerCountByDate[row.date] ?? 0) + 1;
      }
      return json({
        year,
        month,
        earliestBookable: getEarliestBookableDate(),
        staffAvailableDates: Object.keys(staffCountByDate),
        staffCountByDate,
        printerAvailableDates: Object.keys(printerCountByDate),
        printerCountByDate,
        reservations: reservations.map((r) => ({
          ...publicCalendarReservation(r, memberMap, printerMap),
          owned: true,
        })),
      });
    }

    // GET /api/3dprint/reservations/:id
    if (method === "GET" && segments[0] === "reservations" && segments.length === 2) {
      const reservation = await getReservationById(db, segments[1]);
      if (!reservation || reservation.status === "cancelled") {
        return error("予約が見つかりません", 404);
      }
      if (reservation.user_id !== userId) {
        return error("この予約にアクセスする権限がありません", 403);
      }
      const memberMap = await buildMemberMap(db);
      const printerMap = await buildPrinterMap(db);
      return json({ reservation: userReservationDetail(reservation, memberMap, printerMap) });
    }

    // GET /api/3dprint/reservations/:id/print-video/download
    if (
      method === "GET" &&
      segments[0] === "reservations" &&
      segments.length === 4 &&
      segments[2] === "print-video" &&
      segments[3] === "download"
    ) {
      const reservation = await getReservationById(db, segments[1]);
      if (!reservation || reservation.status === "cancelled") {
        return error("予約が見つかりません", 404);
      }
      if (reservation.user_id !== userId) {
        return error("この予約にアクセスする権限がありません", 403);
      }
      if (!reservation.print_video_storage_path) {
        return error("印刷動画はまだアップロードされていません", 404);
      }

      const parsed = parseLogicalPath(reservation.print_video_storage_path);
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

    // GET /api/3dprint/print-videos
    if (method === "GET" && segments[0] === "print-videos" && segments.length === 1) {
      const videos = await getUserPrintVideos(db, userId);
      return json({
        videos: videos.map((r) => ({
          id: r.id,
          title: r.title,
          desired_date: r.desired_date,
          print_video_filename: r.print_video_filename,
          print_video_size_bytes: r.print_video_size_bytes,
          download_url: `/api/3dprint/reservations/${r.id}/print-video/download`,
        })),
      });
    }

    // PATCH /api/3dprint/reservations/:id
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
        { isUser: true, actorUserId: userId }
      );
    }

    // POST /api/3dprint/reservations/:id/retry
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
        print_notes?: string | null;
        print_scale: Reservation["print_scale"];
        stl_r2_key?: string;
        stl_filename?: string;
        stl_size_bytes?: number;
      }>();

      try {
        const failedReservation = await getReservationById(db, segments[1]);
        const created = await retryFailedReservation(env, segments[1], {
          ...body,
          homeroom: profile.homeroom,
          student_number: profile.student_number,
          student_name: profile.student_name,
        }, userId);
        if (created.source === "contest") {
          await logContestStlSubmission(db, {
            contest_application_id:
              created.contest_application_id ??
              failedReservation?.contest_application_id ??
              null,
            print_reservation_id: created.id,
            stl_r2_key: created.stl_r2_key,
            stl_filename: created.stl_filename,
            stl_size_bytes: created.stl_size_bytes,
            uploaded_by_user_id: userId,
            uploader_role: "user",
            uploaded_at: created.created_at,
          });
        }
        const memberMap = await buildMemberMap(db);
        const printerMap = await buildPrinterMap(db);

        context.waitUntil(
          (async () => {
            await notifyReservationApplication(env.DISCORD_WEBHOOK_URL, adminUrl, {
              title: created.title,
              desired_date: created.desired_date,
              print_scale: created.print_scale,
            });
          })()
        );

        return json({
          reservation: userReservationDetail(created, memberMap, printerMap),
          message: "再予約を申請しました。受領後に確定します。",
        });
      } catch (err) {
        return error(err instanceof Error ? err.message : "再予約に失敗しました");
      }
    }

    // POST /api/3dprint/reservations/:id/cancel
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

    // GET /api/3dprint/calendar/availability
    if (method === "GET" && segments[0] === "calendar" && segments[1] === "availability") {
      const date = url.searchParams.get("date");
      const scale = url.searchParams.get("scale") as PrintScale | null;
      const printerId = url.searchParams.get("printer_id");
      const excludeId = url.searchParams.get("exclude_reservation_id");
      if (!date) return error("date が必要です");

      const result = await getDateAvailability(db, date, {
        printerId,
        scale,
        excludeReservationId: excludeId,
        isAdmin: false,
      });
      return json(mapAvailabilityResponse(result));
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
      const scale = url.searchParams.get("scale") as PrintScale | null;
      const printerId = url.searchParams.get("printer_id");
      const excludeId = url.searchParams.get("exclude_reservation_id");
      if (!date) return error("date が必要です");

      const result = await getDateAvailability(db, date, {
        printerId,
        scale,
        excludeReservationId: excludeId,
        isAdmin: true,
      });
      return json(mapAvailabilityResponse(result));
    }

    // POST /api/contest/admin/reservations/force
    if (method === "POST" && segments[1] === "reservations" && segments[2] === "force") {
      const body = await request.json<AdminForceReservationInput>();
      const forced = await createAdminForcePrintReservation(db, env.FILES, userId, body, {
        source: "contest",
      });
      if ("error" in forced) return error(forced.error);
      const memberMap = await buildMemberMap(db);
      const printerMap = await buildPrinterMap(db);
      return json(
        {
          id: forced.reservation.id,
          reservation: enrichReservationForAdmin(forced.reservation, memberMap, printerMap),
        },
        201
      );
    }

    // POST /api/3dprint/admin/reservations
    if (method === "POST" && segments[1] === "reservations" && segments.length === 2) {
      const body = await request.json<{
        homeroom: string;
        student_number: number;
        student_name: string;
        title: string;
        purpose: string;
        purpose_other?: string | null;
        summary?: string | null;
        print_notes?: string | null;
        print_scale: PrintScale;
        printer_id: string;
        desired_date: string;
        stl_r2_key: string;
        stl_filename: string;
        stl_size_bytes: number;
        user_id?: string;
        part_count?: number;
      }>();

      const required = [
        "homeroom",
        "student_number",
        "student_name",
        "title",
        "purpose",
        "print_scale",
        "printer_id",
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

      const adminPrinterError = await validatePrinterId(db, body.printer_id, {
        requireBookable: false,
      });
      if (adminPrinterError) return error(adminPrinterError);

      if (!isAdminDateBookable(body.desired_date)) {
        return error(`希望印刷日は ${getAdminEarliestBookableDate()} 以降を選択してください`);
      }

      const adminPartCount = normalizePartCount(body.part_count ?? 1);
      const adminSpan = syncReservationSpanFields(
        body.desired_date,
        adminPartCount,
        body.print_scale
      );

      const slotError = await validatePrinterReservationSpan(
        db,
        body.desired_date,
        body.printer_id,
        adminSpan.print_scale,
        adminSpan.part_count,
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
        body.printer_id,
        (body as { request_print_video?: boolean }).request_print_video
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
        print_notes: body.print_notes?.trim() || null,
        print_scale: adminSpan.print_scale,
        printer_id: body.printer_id,
        desired_date: body.desired_date,
        part_count: adminSpan.part_count,
        calendar_end_date: adminSpan.calendar_end_date,
        stl_r2_key: body.stl_r2_key,
        stl_filename: body.stl_filename,
        stl_size_bytes: Number(body.stl_size_bytes),
        status: "applied",
        status_comment: null,
        print_staff: null,
        print_staff_member_id: null,
        delivery_staff: null,
        google_event_id: null,
        request_print_video: adminVideoResolved.value ? 1 : 0,
        print_video_storage_path: null,
        print_video_filename: null,
        print_video_size_bytes: null,
        user_id: targetUserId,
        source: 'contest',
        schedule_type: null,
        contest_storage_path: null,
        contest_storage_filename: null,
        created_at: new Date().toISOString(),
      };

      await createReservation(db, reservation);

      try {
        const synced = await syncContestSubmissionToStorage(env, db, reservation);
        if (synced) {
          reservation.contest_storage_path = synced.path;
          reservation.contest_storage_filename = synced.filename;
        }
      } catch (syncErr) {
        console.error("contest storage sync failed on admin create:", syncErr);
      }

      await logContestStlSubmission(db, {
        contest_application_id: reservation.contest_application_id,
        print_reservation_id: reservation.id,
        stl_r2_key: reservation.stl_r2_key,
        stl_filename: reservation.stl_filename,
        stl_size_bytes: reservation.stl_size_bytes,
        uploaded_by_user_id: authUser.id,
        uploader_role: "admin",
        uploaded_at: reservation.created_at,
      });

      context.waitUntil(
        notifyReservationApplication(env.DISCORD_WEBHOOK_URL, adminUrl, {
          title: reservation.title,
          desired_date: reservation.desired_date,
          print_scale: reservation.print_scale,
        })
      );

      const memberMap = await buildMemberMap(db);
      const printerMap = await buildPrinterMap(db);
      return json(
        { id: reservation.id, reservation: enrichReservationForAdmin(reservation, memberMap, printerMap) },
        201
      );
    }

    // GET /api/contest/admin/applications
    if (method === "GET" && segments[1] === "applications" && segments.length === 2) {
      const limitParam = url.searchParams.get("limit");
      const limit = limitParam ? parseInt(limitParam, 10) : undefined;
      const applications = await listContestApplicationsForAdmin(
        db,
        authUser.id,
        authUser.is_admin,
        {
          applicationLimit: Number.isFinite(limit) ? limit : undefined,
        }
      );
      return json({ applications });
    }

    // DELETE /api/contest/admin/applications/:id
    if (method === "DELETE" && segments[1] === "applications" && segments.length === 3) {
      try {
        await deleteContestApplicationAsAdmin(env, db, authUser.id, authUser.is_admin, segments[2]);
        return json({ ok: true });
      } catch (err) {
        const message = err instanceof Error ? err.message : "削除に失敗しました";
        return error(message, 400);
      }
    }

    // GET /api/contest/admin/settings/email-compose
    if (
      method === "GET" &&
      segments[1] === "settings" &&
      segments[2] === "email-compose" &&
      segments.length === 3
    ) {
      return json(getContestEmailComposeSettings(env));
    }

    // POST /api/3dprint/admin/settings/test-email
    if (
      method === "POST" &&
      segments[1] === "settings" &&
      segments[2] === "test-email" &&
      segments.length === 3
    ) {
      const body = await request.json<{ to?: string }>();
      const to = body.to?.trim() ?? "";
      if (!to) return error("送信先メールアドレスを入力してください");
      const result = await sendContestAdminTestEmail(env, to);
      if (!result.ok) return error(result.error ?? "送信に失敗しました", 502);
      return json({ ok: true, to: to.trim().toLowerCase() });
    }

    // GET /api/3dprint/admin/settings/print-video
    if (method === "GET" && segments[1] === "settings" && segments[2] === "print-video") {
      const storage_path = await getPrintVideoStoragePath(db);
      const group_roots = await getManagementAccessibleGroupRoots(
        db,
        authUser.id,
        authUser.is_admin
      );
      return json({ storage_path, group_roots });
    }

    // PATCH /api/contest/admin/settings/print-video
    if (method === "PATCH" && segments[1] === "settings" && segments[2] === "print-video") {
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

    // GET /api/contest/admin/settings/contest-storage
    if (
      method === "GET" &&
      segments[1] === "settings" &&
      segments[2] === "contest-storage"
    ) {
      const group_slug = await getContestStorageGroupSlug(db);
      const group_roots = await getContestManagementAccessibleGroupRoots(
        db,
        authUser.id,
        authUser.is_admin
      );
      const submissions_path = group_slug
        ? buildContestSubmissionsLogicalDir(group_slug)
        : null;
      return json({ group_slug, group_roots, submissions_path });
    }

    // PATCH /api/contest/admin/settings/contest-storage
    if (
      method === "PATCH" &&
      segments[1] === "settings" &&
      segments[2] === "contest-storage"
    ) {
      const body = await request.json<{ group_slug?: string }>();
      const groupSlug = body.group_slug?.trim().toLowerCase() ?? "";
      const slugError = await validateContestStorageGroupForUser(
        db,
        authUser.id,
        authUser.is_admin,
        groupSlug
      );
      if (slugError) return error(slugError);
      await setContestStorageGroupSlug(db, groupSlug);
      await ensureContestStorageDirectories(env, db, authUser, groupSlug);
      return json({
        group_slug: groupSlug,
        submissions_path: buildContestSubmissionsLogicalDir(groupSlug),
      });
    }

    // GET /api/3dprint/admin/settings/storage-list
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

    // GET /api/3dprint/admin/reservations
    if (method === "GET" && segments[1] === "reservations" && segments.length === 2) {
      const userId = url.searchParams.get("user_id")?.trim() || null;
      const reservations = await getAllReservations(
        db,
        "contest",
        userId ? { userId } : undefined
      );
      const memberMap = await buildMemberMap(db);
      const printerMap = await buildPrinterMap(db);
      return json({
        reservations: reservations.map((r) => enrichReservationForAdmin(r, memberMap, printerMap)),
      });
    }

    // GET /api/3dprint/admin/reservations/:id
    if (method === "GET" && segments[1] === "reservations" && segments.length === 3) {
      const reservation = await getReservationById(db, segments[2]);
      if (!reservation) return error("予約が見つかりません", 404);
      const memberMap = await buildMemberMap(db);
      const printerMap = await buildPrinterMap(db);
      const availableIds = await getAvailableMemberIdsOnDate(db, reservation.desired_date);
      const members = await getAllMembers(db);
      const available_staff = members.filter(
        (m) =>
          availableIds.includes(m.id) || m.id === reservation.print_staff_member_id
      );
      const stlLogs = await listContestStlSubmissionLogsForReservation(db, reservation);
      return json({
        reservation: enrichReservationForAdmin(reservation, memberMap, printerMap),
        available_staff,
        stl_submission_logs: stlLogs.map(formatContestStlSubmissionLogForAdmin),
        email_compose: {
          ...getContestEmailComposeSettings(env),
          staff_name: await resolveContestEmailStaffName(
            db,
            env,
            reservation.print_staff_member_id
          ),
          staff_name_locked: true,
        },
      });
    }

    // POST /api/contest/admin/reservations/:id/custom-email
    if (
      method === "POST" &&
      segments[1] === "reservations" &&
      segments.length === 4 &&
      segments[3] === "custom-email"
    ) {
      const reservation = await getReservationById(db, segments[2]);
      if (!assertContestReservation(reservation)) {
        return error("予約が見つかりません", 404);
      }
      if (reservation.status === "cancelled") {
        return error("キャンセル済みの依頼にはメールを送れません", 400);
      }

      const body = await request.json<{ message?: string; print_staff_member_id?: string | null }>();
      const message = body.message?.trim() ?? "";
      if (!message) return error("送信内容を入力してください");
      if (message.length > 4000) {
        return error("送信内容は4000文字以内で入力してください");
      }

      let staffMemberIdForEmail = reservation.print_staff_member_id;
      if (body.print_staff_member_id) {
        const member = await getMemberById(db, body.print_staff_member_id);
        if (!member) return error("指定された印刷担当者が見つかりません");
        staffMemberIdForEmail = body.print_staff_member_id;
      }

      const printerMap = await buildPrinterMap(db);
      const memberMap = await buildMemberMap(db);
      const entryUrl = buildContestEntryAppUrl(getOAuthRedirectBase(request, env));
      const result = await sendContestCustomEmailToApplicant(
        env,
        db,
        reservation.user_id,
        {
          reservation,
          printerName: resolvePrinterLabel(reservation, printerMap),
          printStaffLabel: resolvePrintStaffLabel(reservation, memberMap),
          entryAppUrl: entryUrl,
        },
        message,
        { printStaffMemberId: staffMemberIdForEmail }
      );
      if (!result.ok) {
        return error(result.error ?? "送信に失敗しました", result.error?.includes("設定") ? 503 : 502);
      }

      const staffName = await resolveContestEmailStaffName(db, env, staffMemberIdForEmail);
      if (reservation.contest_application_id) {
        await insertContestStaffMessage(db, {
          userId: reservation.user_id,
          contestApplicationId: reservation.contest_application_id,
          printReservationId: reservation.id,
          kind: "custom",
          body: message,
          staffDisplayName: staffName,
          createdByUserId: userId,
        });
      }

      return json({ ok: true });
    }

    // POST /api/contest/admin/reservations/:id/print-reject
    if (
      method === "POST" &&
      segments[1] === "reservations" &&
      segments.length === 4 &&
      segments[3] === "print-reject"
    ) {
      const body = await request.json<{
        reason?: string;
        print_staff_member_id?: string | null;
      }>();
      const reason = body.reason?.trim() ?? "";
      if (!reason) return error("印刷不能の理由を入力してください");
      if (reason.length > 4000) {
        return error("理由は4000文字以内で入力してください");
      }

      try {
        const result = await rejectContestPrintReservationAsAdmin(
          env,
          db,
          request,
          userId,
          segments[2],
          reason,
          body.print_staff_member_id
        );
        const memberMap = await buildMemberMap(db);
        const printerMap = await buildPrinterMap(db);
        return json({
          ok: true,
          reservation: enrichReservationForAdmin(result.reservation, memberMap, printerMap),
          message: result.message,
        });
      } catch (err) {
        return error(err instanceof Error ? err.message : "印刷不能の登録に失敗しました", 400);
      }
    }

    // PATCH /api/3dprint/admin/reservations/:id
    if (method === "PATCH" && segments[1] === "reservations" && segments.length === 3) {
      const body = await request.json<{
        print_staff_member_id?: string | null;
        status?: string;
        status_comment?: string | null;
      }>();

      const validStatuses = [
        "applied",
        "accepted",
        "printing",
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
      if (!assertContestReservation(existing)) return error("予約が見つかりません", 404);

      const previousStatus = existing.status;

      if (body.status === "accepted" && existing.status === "applied") {
        return error("申請中の予約は「予約を受領」ボタンから受領してください", 400);
      }

      if (body.print_staff_member_id) {
        const member = await getMemberById(db, body.print_staff_member_id);
        if (!member) return error("指定されたメンバーが見つかりません", 400);
        if (
          body.print_staff_member_id !== existing.print_staff_member_id &&
          !(await isMemberAvailableOnReservationSpan(db, body.print_staff_member_id, existing))
        ) {
          return error("予約期間のすべての日に対応可能なメンバーのみ割り当てできます", 400);
        }
      }

      await updateReservationAdmin(db, segments[2], {
        ...body,
        status_comment: statusComment,
      });
      const updated = await getReservationById(db, segments[2]);
      const memberMap = await buildMemberMap(db);
      const printerMap = await buildPrinterMap(db);

      if (updated && body.status && body.status !== previousStatus) {
        context.waitUntil(
          sendContestStatusChangeEmail(
            env,
            db,
            request,
            updated,
            previousStatus,
            body.status as Reservation['status']
          )
        );
        if (body.status === "delivered") {
          context.waitUntil(
            recordContestDecidedStaffMessage(env, db, request, updated, userId)
          );
        } else {
          context.waitUntil(
            recordContestStatusChangedStaffMessage(env, db, request, updated, {
              previousStatus,
              newStatus: body.status as Reservation["status"],
              statusComment: updated.status_comment,
              createdByUserId: userId,
            })
          );
        }
      }

      return json({
        reservation: updated ? enrichReservationForAdmin(updated, memberMap, printerMap) : null,
      });
    }

    // PATCH /api/3dprint/admin/reservations/:id/content
    if (
      method === "PATCH" &&
      segments[1] === "reservations" &&
      segments[3] === "content" &&
      segments.length === 4
    ) {
      const body = await request.json<ReservationContentInput>();
      const reservation = await getReservationById(db, segments[2]);
      if (!reservation) return error("予約が見つかりません", 404);

      return applyReservationContentEdit(context, reservation, body, {
        isUser: false,
        actorUserId: authUser.id,
      });
    }

    // PATCH /api/3dprint/admin/reservations/:id/reschedule
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

      const before = await getReservationById(db, segments[2]);
      if (!assertContestReservation(before)) return error("予約が見つかりません", 404);
      const previousDate = before.desired_date;

      try {
        const updated = await adminRescheduleReservation(env, segments[2], body.desired_date);
        const memberMap = await buildMemberMap(db);
        const printerMap = await buildPrinterMap(db);
        if (previousDate !== updated.desired_date) {
          context.waitUntil(
            notifyContestApplicantEmail(env, db, updated.user_id, "rescheduled", {
              reservation: updated,
              printerName: resolvePrinterLabel(updated, printerMap),
              printStaffLabel: resolvePrintStaffLabel(updated, memberMap),
              previousDate,
              entryAppUrl: buildContestEntryAppUrl(getOAuthRedirectBase(request, env)),
            })
          );
        }
        return json({ reservation: enrichReservationForAdmin(updated, memberMap, printerMap) });
      } catch (err) {
        return error(err instanceof Error ? err.message : "リスケに失敗しました");
      }
    }

    // POST /api/3dprint/admin/reservations/:id/accept
    if (
      method === "POST" &&
      segments[1] === "reservations" &&
      segments[3] === "accept" &&
      segments.length === 4
    ) {
      const body = await request.json<{ print_staff_member_id: string }>();
      if (!body.print_staff_member_id) {
        return error("印刷担当者を選択してください");
      }

      const existing = await getReservationById(db, segments[2]);
      if (!assertContestReservation(existing)) return error("予約が見つかりません", 404);
      if (existing.status !== "applied") {
        return error("申請中の予約のみ受領できます", 400);
      }

      const member = await getMemberById(db, body.print_staff_member_id);
      if (!member) return error("指定されたメンバーが見つかりません", 400);

      if (!(await isMemberAvailableOnReservationSpan(db, body.print_staff_member_id, existing))) {
        return error("予約期間のすべての日に対応可能なメンバーのみ割り当てできます", 400);
      }

      const accepted = await acceptReservation(db, segments[2], body.print_staff_member_id);
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
      const printerMap = await buildPrinterMap(db);

      if (finalReservation) {
        context.waitUntil(sendContestAcceptedEmail(env, db, request, finalReservation));
        context.waitUntil(
          recordContestAcceptedStaffMessage(env, db, request, finalReservation, userId)
        );
      }

      return json({
        reservation: finalReservation
          ? enrichReservationForAdmin(finalReservation, memberMap, printerMap)
          : null,
        calendar,
      });
    }

    // GET /api/3dprint/admin/calendar/status
    if (method === "GET" && segments[1] === "calendar" && segments[2] === "status") {
      const status = await testGoogleCalendarConnection(env);
      return json(status);
    }

    // GET /api/3dprint/admin/members
    if (method === "GET" && segments[1] === "members" && segments.length === 2) {
      const members = await getAllMembers(db);
      return json({ members });
    }

    // POST /api/3dprint/admin/members
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

    // PATCH /api/3dprint/admin/members/:id
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

    // DELETE /api/3dprint/admin/members/:id
    if (method === "DELETE" && segments[1] === "members" && segments.length === 3) {
      const deleted = await deleteMember(db, segments[2]);
      if (!deleted) return error("メンバーが見つかりません", 404);
      return json({ ok: true });
    }

    // GET /api/3dprint/admin/shifts
    if (method === "GET" && segments[1] === "shifts" && segments.length === 2) {
      const year = parseInt(url.searchParams.get("year") ?? "", 10);
      const month = parseInt(url.searchParams.get("month") ?? "", 10);
      if (!year || !month) return error("year と month が必要です");

      const { start, end } = getMonthRange(year, month);
      const members = await getAllMembers(db);
      const availability = await getAvailabilityInRange(db, start, end);
      const printers = await getAllPrinters(db);
      const printerAvailability = await getPrinterAvailabilityInRange(db, start, end);
      return json({
        year,
        month,
        members,
        availability,
        printers: printers.map((p) => formatPrinterForApi(p)),
        printer_availability: printerAvailability,
      });
    }

    // PUT /api/3dprint/admin/shifts/printer-availability
    if (method === "PUT" && segments[1] === "shifts" && segments[2] === "printer-availability") {
      const body = await request.json<{
        printer_id: string;
        dates: string[];
        available: boolean;
      }>();

      if (!body.printer_id || !Array.isArray(body.dates)) {
        return error("printer_id と dates が必要です");
      }

      const printer = await getPrinterById(db, body.printer_id);
      if (!printer) return error("プリンターが見つかりません", 404);

      const validDates = body.dates.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));

      if (body.available === false) {
        const block = await checkPrinterShiftRemovalBlockedForDates(
          db,
          body.printer_id,
          validDates
        );
        if (block.blocked && block.date) {
          return printerShiftBlockError(block.date, block.reservations);
        }
      }

      await setPrinterAvailability(db, body.printer_id, validDates, body.available !== false);
      return json({ ok: true });
    }

    // POST /api/3dprint/admin/shifts/printer-toggle
    if (method === "POST" && segments[1] === "shifts" && segments[2] === "printer-toggle") {
      const body = await request.json<{ printer_id: string; date: string }>();
      if (!body.printer_id || !body.date) return error("printer_id と date が必要です");

      const printer = await getPrinterById(db, body.printer_id);
      if (!printer) return error("プリンターが見つかりません", 404);

      const isCurrentlyAvailable = await isPrinterAvailableOnDate(db, body.printer_id, body.date);
      if (isCurrentlyAvailable) {
        const block = await checkPrinterShiftRemovalBlocked(db, body.printer_id, body.date);
        if (block.blocked) {
          return printerShiftBlockError(body.date, block.reservations);
        }
      }

      const available = await togglePrinterAvailability(db, body.printer_id, body.date);
      return json({ available });
    }

    // PUT /api/3dprint/admin/shifts/availability
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

    // POST /api/3dprint/admin/shifts/toggle
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

    // DELETE /api/3dprint/admin/reservations/:id
    if (method === "DELETE" && segments[1] === "reservations" && segments.length === 3) {
      const reservation = await getReservationById(db, segments[2]);
      if (!reservation) return error("予約が見つかりません", 404);

      await deleteCalendarEvent(env, reservation.google_event_id);
      await env.FILES.delete(reservation.stl_r2_key);
      await deleteReservation(db, segments[2]);
      return json({ ok: true, message: "予約を削除しました" });
    }

    // GET /api/3dprint/admin/printers
    if (method === "GET" && segments[1] === "printers" && segments.length === 2) {
      const printers = await getAllPrinters(db);
      return json({ printers: printers.map(formatPrinterForApi) });
    }

    // POST /api/3dprint/admin/printers
    if (method === "POST" && segments[1] === "printers" && segments.length === 2) {
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

      if (!name) return error("プリンター名は必須です");

      const printerId = crypto.randomUUID();
      let imageR2Key: string | null = null;
      if (imageFile) {
        imageR2Key = await uploadPrinterImage(
          env.FILES,
          printerId,
          imageFile.name,
          await imageFile.arrayBuffer()
        );
      }

      const printer = await createPrinter(db, {
        id: printerId,
        name,
        image_r2_key: imageR2Key,
      });
      return json({ printer: formatPrinterForApi(printer) }, 201);
    }

    // PATCH /api/3dprint/admin/printers/:id
    if (method === "PATCH" && segments[1] === "printers" && segments.length === 3) {
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
          can_record_print_video?: boolean;
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

      const printer = await getPrinterById(db, segments[2]);
      if (!printer) return error("プリンターが見つかりません", 404);

      if (hasName) {
        const name = body.name?.trim() ?? "";
        if (!name) return error("プリンター名は必須です");
        await updatePrinterName(db, segments[2], name);
      }

      if (hasStatus) {
        const statusError = validatePrinterStatusInput(body.status);
        if (statusError) return error(statusError);
        await updatePrinterStatus(db, segments[2], body.status as PrinterStatus);
      }

      if (hasCapabilities) {
        const capabilityResult = validatePrinterCapabilitiesInput(body.capabilities);
        if ("error" in capabilityResult) return error(capabilityResult.error);
        await updatePrinterCapabilities(db, segments[2], capabilityResult.capabilities);
      }

      if (hasDailyCapacity) {
        const capacityResult = validatePrinterDailyCapacityInput(body.daily_capacity);
        if ("error" in capacityResult) return error(capacityResult.error);
        await updatePrinterDailyCapacity(db, segments[2], capacityResult.capacity);
      }

      const updated = await getPrinterById(db, segments[2]);
      return json({ printer: updated ? formatPrinterForApi(updated) : null });
    }

    // PUT /api/3dprint/admin/printers/:id/image
    if (
      method === "PUT" &&
      segments[1] === "printers" &&
      segments[3] === "image" &&
      segments.length === 4
    ) {
      const printer = await getPrinterById(db, segments[2]);
      if (!printer) return error("プリンターが見つかりません", 404);

      const formData = await request.formData();
      const image = formData.get("image");
      if (!(image instanceof File) || image.size <= 0) {
        return error("画像ファイルが必要です");
      }

      const imageR2Key = await uploadPrinterImage(
        env.FILES,
        printer.id,
        image.name,
        await image.arrayBuffer()
      );

      if (printer.image_r2_key) {
        await env.FILES.delete(printer.image_r2_key);
      }
      await updatePrinterImage(db, printer.id, imageR2Key);

      const updated = await getPrinterById(db, printer.id);
      return json({ printer: updated ? formatPrinterForApi(updated) : null });
    }

    // DELETE /api/3dprint/admin/printers/:id
    if (method === "DELETE" && segments[1] === "printers" && segments.length === 3) {
      const printer = await getPrinterById(db, segments[2]);
      if (!printer) return error("プリンターが見つかりません", 404);

      const reservationCount = await countReservationsByPrinterId(db, segments[2]);
      if (reservationCount > 0) {
        return error("このプリンターを使用した予約があるため削除できません", 409);
      }

      if (printer.image_r2_key) {
        await env.FILES.delete(printer.image_r2_key);
      }

      const deleted = await deletePrinter(db, segments[2]);
      if (!deleted) return error("プリンターの削除に失敗しました", 400);
      return json({ ok: true });
    }

    // GET /api/3dprint/admin/stl/:id
    if (method === "GET" && segments[1] === "stl" && segments.length === 3) {
      const reservation = await getReservationById(db, segments[2]);
      if (!reservation) return error("予約が見つかりません", 404);
      return streamPrintFile(env.FILES, reservation.stl_r2_key, reservation.stl_filename);
    }

    // POST /api/3dprint/admin/reservations/:id/print-video
    if (
      method === "POST" &&
      segments[1] === "reservations" &&
      segments.length === 4 &&
      segments[3] === "print-video"
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

      if (reservation.print_video_storage_path) {
        context.waitUntil(
          deletePrintVideoFile(env, db, reservation.print_video_storage_path)
        );
      }

      await updateReservationPrintVideo(db, reservation.id, {
        print_video_storage_path: uploaded.path,
        print_video_filename: uploaded.filename,
        print_video_size_bytes: uploaded.size,
      });

      const memberMap = await buildMemberMap(db);
      const printerMap = await buildPrinterMap(db);
      const updated = await getReservationById(db, reservation.id);
      return json({
        reservation: updated
          ? enrichReservationForAdmin(updated, memberMap, printerMap)
          : null,
      });
    }

    // DELETE /api/3dprint/admin/reservations/:id/print-video
    if (
      method === "DELETE" &&
      segments[1] === "reservations" &&
      segments.length === 4 &&
      segments[3] === "print-video"
    ) {
      const reservation = await getReservationById(db, segments[2]);
      if (!reservation) return error("予約が見つかりません", 404);

      if (reservation.print_video_storage_path) {
        await deletePrintVideoFile(env, db, reservation.print_video_storage_path);
      }
      await clearReservationPrintVideo(db, reservation.id);

      const memberMap = await buildMemberMap(db);
      const printerMap = await buildPrinterMap(db);
      const updated = await getReservationById(db, reservation.id);
      return json({
        reservation: updated
          ? enrichReservationForAdmin(updated, memberMap, printerMap)
          : null,
      });
    }

    // GET /api/3dprint/admin/reservations/:id/print-video/download
    if (
      method === "GET" &&
      segments[1] === "reservations" &&
      segments.length === 5 &&
      segments[3] === "print-video" &&
      segments[4] === "download"
    ) {
      const reservation = await getReservationById(db, segments[2]);
      if (!reservation) return error("予約が見つかりません", 404);
      if (!reservation.print_video_storage_path) {
        return error("印刷動画はまだアップロードされていません", 404);
      }

      const parsed = parseLogicalPath(reservation.print_video_storage_path);
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
