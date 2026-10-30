/**
 * 3D印刷 API ルーター（予約・管理）
 */

import type { Env } from "../../lib/types";
import { getDb } from "../../lib/db";
import { requireUser } from "../../lib/auth";
import { canUserAccessApp, listUsersWithAppAccess } from "../../lib/apps";
import {
  getEarliestBookableDate,
  getAdminEarliestBookableDate,
  getTodayJst,
  addDays,
  isDateBookable,
  isAdminDateBookable,
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
  getCancelledReservationsInRange,
  getReservationsByDateAndPrinter,
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
  updateMemberUserId,
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
import { syncReservationCalendarAfterAdminPatch } from "../../lib/3dprint/admin-calendar-sync";
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
  build3dPrintAdminUrl,
  notifyReservationApplication,
  notifyReservationBooked,
  notifyReservationModified,
  notifyReservationStaffAssigned,
  notifyReservationCancelledByUser,
  notifyPrintAdminOperation,
  sendDiscordStaffMentionTest,
} from "../../lib/3dprint/discord";
import {
  formatPrintActorLogLabel,
  formatPrintActorNoticeLines,
  memberDisplayName,
  resolvePrintActorContext,
  hasLinkedPrintStaffMember,
  type PrintActorContext,
} from "../../lib/3dprint/print-actor";
import { getSessionUserById } from "../../lib/auth";
import {
  buildPrintApplicationFormText,
  build3dPrintAdminDeepLink,
} from "../../lib/3dprint/application-form-text";
import {
  applicationFormPdfR2Key,
  persistApplicationFormPdf,
} from "../../lib/3dprint/application-form-pdf";
import {
  MAX_PRINT_RESERVATION_FILES,
  replacePrintReservationFiles,
  type PrintReservationFileInput,
} from "../../lib/3dprint/print-reservation-files";
import { softCancelReservation, restoreCancelledReservation } from "../../lib/3dprint/cancel-restore";
import {
  build3dPrintReservationAppUrl,
  notifyApplicantPrintReservationEmail,
  sendPrintReservationAdminTestEmail,
} from "../../lib/3dprint/reservation-email";
import { getOAuthRedirectBase } from "../../lib/oauth";
import {
  createCalendarEventForReservation,
  deleteCalendarEvent,
  isGoogleCalendarConfigured,
  testGoogleCalendarConnection,
} from "../../lib/3dprint/google-calendar";
import { insertAdminLog, listAdminLog } from "../../lib/3dprint/admin-log";
import { splitApplicationSlots } from "../../lib/3dprint/split-application-slots";
import { isEmailSendingConfigured } from "../../lib/email/cloudflare-email";
import {
  createAdminForcePrintReservation,
  type AdminForceReservationInput,
} from "../../lib/3dprint/admin-force-reservation";
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
import {
  isPrinterBookable,
  normalizePrinterStatus,
  validatePrinterStatusInput,
  type PrinterStatus,
} from "../../lib/3dprint/printer-status";
import { requeuePrinterReservationsAfterChange } from "../../lib/3dprint/printer-reservation-requeue";
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
import { reservationToApplication } from "../../lib/3dprint/applications-api";
import {
  hasTimeSlotOverlap,
  isAllowedPrintFilename,
  canUserRestoreCancelledReservation,
  isRequestDateBookable,
  isReserveDateBookable,
  isWeekdayYmd,
  validateTimeSlotInput,
  type BookingKind,
} from "../../lib/3dprint/time-slots";

const RESERVATION_APP = "3dprint-reservation";
const MANAGEMENT_APP = "3dprint-management";
const CONTEST_ENTRY_APP = "contest-entry";
const CONTEST_MANAGEMENT_APP = "contest-management";

const PRINTER_IMAGE_ACCESS_APPS = [
  RESERVATION_APP,
  MANAGEMENT_APP,
  CONTEST_ENTRY_APP,
  CONTEST_MANAGEMENT_APP,
] as const;

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

/** Returns trailing next-month padding day count for a month grid. */
function getCalendarTrailingPaddingDays(year: number, month: number): number {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0).getDate();
  const startWeekday = firstDay.getDay();
  const totalCells = startWeekday + lastDay;
  return totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
}

/** Extends month range through shift-calendar trailing padding days. */
function getMonthRangeWithTrailingPadding(year: number, month: number): { start: string; end: string } {
  const { start, end: monthEnd } = getMonthRange(year, month);
  const trailing = getCalendarTrailingPaddingDays(year, month);
  if (trailing === 0) return { start, end: monthEnd };

  let nextYear = year;
  let nextMonth = month + 1;
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  }
  const end = `${nextYear}-${String(nextMonth).padStart(2, "0")}-${String(trailing).padStart(2, "0")}`;
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

/** Requires login and access to any app that lists printers (shared image URL). */
async function requirePrinterImageAccess(
  request: Request,
  env: Env
): Promise<{ id: string } | Response> {
  const auth = await requireUser(request, env);
  if (auth instanceof Response) return auth;

  const db = getDb(env);
  for (const slug of PRINTER_IMAGE_ACCESS_APPS) {
    if (await canUserAccessApp(db, auth.id, slug)) {
      return { id: auth.id };
    }
  }

  return error("このアプリへのアクセス権限がありません", 403);
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

/** Formats reservation for public calendar API. */
function publicCalendarReservation(
  r: Reservation,
  memberMap: Map<string, Member>,
  printerMap: Map<string, Printer>
) {
  return {
    id: r.id,
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

async function applicationFormTextFor(
  db: D1Database,
  reservation: Reservation,
  printerMap: Map<string, Printer>
): Promise<string> {
  const printer = reservation.printer_id ? printerMap.get(reservation.printer_id) : undefined;
  return buildPrintApplicationFormText(db, reservation, printer);
}

function buildAdminApplicationFormPdfUrl(
  request: Request,
  env: Env,
  reservationId: string
): string {
  const base = getOAuthRedirectBase(request, env).replace(/\/$/, "");
  return `${base}/api/3dprint/admin/reservations/${reservationId}/application-form.pdf`;
}

async function normalizeAndValidatePrintFiles(
  env: Env,
  body: {
    stl_r2_key: string;
    stl_filename: string;
    stl_size_bytes: number;
    print_files?: PrintReservationFileInput[];
  }
): Promise<PrintReservationFileInput[] | Response> {
  let files: PrintReservationFileInput[] = body.print_files?.length
    ? body.print_files.map((f) => ({
        r2_key: f.r2_key,
        filename: f.filename,
        size_bytes: Number(f.size_bytes),
      }))
    : [
        {
          r2_key: body.stl_r2_key,
          filename: body.stl_filename,
          size_bytes: Number(body.stl_size_bytes),
        },
      ];
  if (files.length > MAX_PRINT_RESERVATION_FILES) {
    return error(`印刷データは${MAX_PRINT_RESERVATION_FILES}件までです`);
  }
  if (!files.some((f) => f.r2_key === body.stl_r2_key)) {
    files = [
      {
        r2_key: body.stl_r2_key,
        filename: body.stl_filename,
        size_bytes: Number(body.stl_size_bytes),
      },
      ...files,
    ].slice(0, MAX_PRINT_RESERVATION_FILES);
  }
  for (const f of files) {
    if (!isAllowedPrintFilename(f.filename)) {
      return error("対応していないファイル形式です");
    }
    if (!(await verifyR2Key(env.FILES, f.r2_key))) {
      return error("ファイルが見つかりません。再度アップロードしてください");
    }
  }
  return files;
}

async function finalizeNewReservationSubmission(
  env: Env,
  db: D1Database,
  reservation: Reservation,
  files: PrintReservationFileInput[]
): Promise<Reservation> {
  await replacePrintReservationFiles(db, reservation.id, files, reservation.created_at);
  const printer = reservation.printer_id
    ? await getPrinterById(db, reservation.printer_id)
    : null;
  await persistApplicationFormPdf(env, db, reservation, printer ?? undefined);
  return (await getReservationById(db, reservation.id)) ?? reservation;
}

/** Sends「予約申請受付」email to the applicant (non-blocking). */
async function sendApplicantAppliedEmail(
  env: Env,
  db: D1Database,
  request: Request,
  applicantUserId: string,
  reservation: Reservation
): Promise<void> {
  const printerMap = await buildPrinterMap(db);
  const applicationFormText = await applicationFormTextFor(db, reservation, printerMap);
  await notifyApplicantPrintReservationEmail(env, db, applicantUserId, {
    kind: "applied",
    reservation: {
      id: reservation.id,
      title: reservation.title,
      desired_date: reservation.desired_date,
    },
    printerName: resolvePrinterLabel(reservation, printerMap),
    reservationAppUrl: build3dPrintReservationAppUrl(getOAuthRedirectBase(request, env)),
    applicationFormText,
    applicationFormPdfUrl: buildAdminApplicationFormPdfUrl(request, env, reservation.id),
  });
}

async function notifyNewApplicationDiscordAndEmail(
  env: Env,
  db: D1Database,
  request: Request,
  reservation: Reservation,
  applicantUserId: string
): Promise<void> {
  const printerMap = await buildPrinterMap(db);
  const printer = reservation.printer_id ? printerMap.get(reservation.printer_id) : undefined;
  const applicationFormText = await buildPrintApplicationFormText(db, reservation, printer);
  const adminDeepLink = build3dPrintAdminDeepLink(getOAuthRedirectBase(request, env), {
    date: reservation.desired_date,
    appId: reservation.id,
  });
  const applicant = await getSessionUserById(env, db, applicantUserId);
  const applicantLabel = applicant
    ? `${applicant.display_name} (@${applicant.username})`
    : null;
  const applicationFormPdfUrl = buildAdminApplicationFormPdfUrl(request, env, reservation.id);
  await notifyReservationApplication(env.DISCORD_WEBHOOK_URL, {
    applicationFormText,
    applicationFormPdfUrl,
    adminDeepLink,
    applicantLabel,
  });
  await sendApplicantAppliedEmail(env, db, request, applicantUserId, reservation);
}

/** Auto-confirmed time-slot「予約のみ」: applicant email + Discord「予約されました」. */
async function notifyAutoConfirmedTimeSlotReserve(
  env: Env,
  db: D1Database,
  request: Request,
  reservation: Reservation,
  applicantUserId: string,
  printStaffLabel: string
): Promise<void> {
  const printerMap = await buildPrinterMap(db);
  const printer = reservation.printer_id ? printerMap.get(reservation.printer_id) : undefined;
  const applicationFormText = await buildPrintApplicationFormText(db, reservation, printer);
  const adminDeepLink = build3dPrintAdminDeepLink(getOAuthRedirectBase(request, env), {
    date: reservation.desired_date,
    appId: reservation.id,
  });
  const applicant = await getSessionUserById(env, db, applicantUserId);
  const applicantLabel = applicant
    ? `${applicant.display_name} (@${applicant.username})`
    : null;
  await notifyReservationBooked(env.DISCORD_WEBHOOK_URL, {
    applicationFormText,
    applicationFormPdfUrl: buildAdminApplicationFormPdfUrl(request, env, reservation.id),
    adminDeepLink,
    applicantLabel,
  });
  await sendApplicantAcceptedEmail(
    env,
    db,
    request,
    applicantUserId,
    reservation,
    printStaffLabel,
    null
  );
}

async function requireAdminActor(
  env: Env,
  db: D1Database,
  userId: string
): Promise<PrintActorContext | Response> {
  const ctx = await resolvePrintActorContext(env, db, userId);
  if (!ctx) return error("ユーザーが見つかりません", 401);
  return ctx;
}

function isAdminReservationManagementWrite(
  segments: string[],
  method: string
): boolean {
  if (["GET", "HEAD", "OPTIONS"].includes(method)) return false;
  return segments[1] === "reservations" || segments[1] === "applications";
}

async function requireLinkedPrintStaffForReservationMgmt(
  env: Env,
  db: D1Database,
  userId: string
): Promise<PrintActorContext | Response> {
  const ctx = await requireAdminActor(env, db, userId);
  if (ctx instanceof Response) return ctx;
  if (!hasLinkedPrintStaffMember(ctx)) {
    return error(
      "印刷担当者と ScienceHUB アカウントを紐づけてから、申請の承認・変更を行ってください",
      403
    );
  }
  return ctx;
}

function operatorEmailSummary(ctx: PrintActorContext, extra?: Parameters<typeof formatPrintActorNoticeLines>[1]) {
  return formatPrintActorNoticeLines(ctx, extra).join("\n");
}

async function sendApplicantRescheduledEmail(
  env: Env,
  db: D1Database,
  request: Request,
  applicantUserId: string,
  reservation: Reservation,
  previousDate: string,
  operatorSummary?: string | null
): Promise<void> {
  const printerMap = await buildPrinterMap(db);
  const applicationFormText = await applicationFormTextFor(db, reservation, printerMap);
  await notifyApplicantPrintReservationEmail(env, db, applicantUserId, {
    kind: "rescheduled",
    reservation: {
      id: reservation.id,
      title: reservation.title,
      desired_date: reservation.desired_date,
    },
    printerName: resolvePrinterLabel(reservation, printerMap),
    previousDate,
    reservationAppUrl: build3dPrintReservationAppUrl(getOAuthRedirectBase(request, env)),
    applicationFormText,
    operatorSummary,
  });
}

/** Sends「予約確定」email to the applicant (non-blocking). */
async function sendApplicantAcceptedEmail(
  env: Env,
  db: D1Database,
  request: Request,
  applicantUserId: string,
  reservation: Reservation,
  printStaffLabel: string,
  operatorSummary?: string | null
): Promise<void> {
  const printerMap = await buildPrinterMap(db);
  const applicationFormText = await applicationFormTextFor(db, reservation, printerMap);
  await notifyApplicantPrintReservationEmail(env, db, applicantUserId, {
    kind: "accepted",
    reservation: {
      id: reservation.id,
      title: reservation.title,
      desired_date: reservation.desired_date,
    },
    printerName: resolvePrinterLabel(reservation, printerMap),
    printStaffLabel,
    reservationAppUrl: build3dPrintReservationAppUrl(getOAuthRedirectBase(request, env)),
    applicationFormText,
    applicationFormPdfUrl: buildAdminApplicationFormPdfUrl(request, env, reservation.id),
    operatorSummary,
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
    count: result.count,
    capacity: result.capacity,
    printers: result.printers,
  };
}

/** Returns 409 when printer shift removal is blocked by reservations. */
function printerShiftBlockError(
  date: string,
  reservations: { id: string; title: string; desired_date: string; status: string }[]
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
  options: { isUser: boolean; operatorUserId?: string }
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
    printer_id: printerId,
    desired_date: body.desired_date,
    part_count: partCount,
    request_print_video: videoResolved.value,
    stl_r2_key: stlR2Key,
    stl_filename: stlFilename,
    stl_size_bytes: stlSizeBytes,
  });

  if (!options.isUser && options.operatorUserId) {
    const actor = await resolvePrintActorContext(env, db, options.operatorUserId);
    context.waitUntil(
      notifyReservationModified(
        env.DISCORD_WEBHOOK_URL,
        build3dPrintAdminUrl(getOAuthRedirectBase(context.request, env)),
        {
          title: String(body.title).trim(),
          desired_date: body.desired_date,
        },
        actor,
        { action_label: "予約内容の修正（管理）" }
      )
    );
  } else if (options.isUser) {
    context.waitUntil(
      notifyReservationModified(
        env.DISCORD_WEBHOOK_URL,
        build3dPrintAdminUrl(getOAuthRedirectBase(context.request, env)),
        {
          title: String(body.title).trim(),
          desired_date: body.desired_date,
        }
      )
    );
  }

  const updated = await getReservationById(db, reservation.id);
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
    const isPrinterImageGet =
      method === "GET" &&
      segments[0] === "printers" &&
      segments.length === 3 &&
      segments[2] === "image";

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
    } else if (isPrinterImageGet) {
      const imageAccess = await requirePrinterImageAccess(request, env);
      if (imageAccess instanceof Response) return imageAccess;
    } else if (
      segments[0] === "calendar" ||
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
        purpose?: "ss_s_tan" | "club" | "other";
        purpose_other?: string;
        summary?: string;
        print_notes?: string;
        request_print_video?: boolean;
        printer_id: string;
        desired_date: string;
        stl_r2_key: string;
        stl_filename: string;
        stl_size_bytes: number;
        print_files?: PrintReservationFileInput[];
        part_count?: number;
        booking_kind?: BookingKind;
        start_minute?: number;
        end_minute?: number;
      }>();

      const timeSlotMode = body.booking_kind === "reserve" || body.booking_kind === "request";

      const required = timeSlotMode
        ? (["title", "printer_id", "desired_date", "stl_r2_key", "stl_filename", "stl_size_bytes"] as const)
        : ([
            "title",
            "purpose",
            "printer_id",
            "desired_date",
            "stl_r2_key",
            "stl_filename",
            "stl_size_bytes",
          ] as const);

      for (const field of required) {
        if (body[field] === undefined || body[field] === null || body[field] === "") {
          return error(`${field} は必須です`);
        }
      }

      if (timeSlotMode && !body.booking_kind) {
        return error("booking_kind は必須です");
      }

      const printerError = await validatePrinterId(db, body.printer_id);
      if (printerError) return error(printerError);

      const purpose = body.purpose ?? "club";

      if (!["ss_s_tan", "club", "other"].includes(purpose)) {
        return error("目的が不正です");
      }

      if (purpose === "other" && !body.purpose_other?.trim()) {
        return error("目的が「その他」の場合は内容を入力してください");
      }

      if (timeSlotMode) {
        if (!isWeekdayYmd(body.desired_date)) {
          return error("土日は予約・依頼を受け付けていません");
        }
        if (body.booking_kind === "reserve" && !isReserveDateBookable(body.desired_date)) {
          return error("過ぎた日には予約できません");
        }
        if (body.booking_kind === "request" && !isRequestDateBookable(body.desired_date)) {
          return error("依頼は前日までです（当日の依頼は不可）");
        }
        const slotInputError = validateTimeSlotInput({
          booking_kind: body.booking_kind!,
          start_minute: body.start_minute,
          end_minute: body.end_minute,
        });
        if (slotInputError) return error(slotInputError);
      } else if (!isDateBookable(body.desired_date)) {
        return error(`希望印刷日は ${getEarliestBookableDate()} 以降を選択してください`);
      }

      const partCount = normalizePartCount(body.part_count ?? 1);
      const span = syncReservationSpanFields(body.desired_date, partCount);

      if (!timeSlotMode) {
        const slotError = await validatePrinterReservationSpan(
          db,
          body.desired_date,
          body.printer_id,
          span.part_count,
          "",
          { isAdmin: false }
        );
        if (slotError) return error(slotError);
      }

      const staffAvailable = await hasStaffOnDate(db, body.desired_date);
      if (!staffAvailable) {
        return error("この日は対応可能な印刷担当者がいないため予約できません");
      }

      const printFilesResult = await normalizeAndValidatePrintFiles(env, body);
      if (printFilesResult instanceof Response) return printFilesResult;
      const printFiles = printFilesResult;

      const videoResolved = await resolveRequestPrintVideo(
        db,
        body.printer_id,
        body.request_print_video
      );
      if (!videoResolved.ok) return error(videoResolved.error);

      const reservationId = crypto.randomUUID();

      if (timeSlotMode) {
        const sameDay = await getReservationsByDateAndPrinter(db, body.desired_date, body.printer_id);
        const candidate = {
          id: reservationId,
          desired_date: body.desired_date,
          printer_id: body.printer_id,
          booking_kind: body.booking_kind!,
          start_minute: body.start_minute ?? null,
          end_minute: body.end_minute ?? null,
          status: "applied",
        };
        if (hasTimeSlotOverlap(sameDay, candidate)) {
          return error("同じ時間帯にすでに申請があります", 409);
        }
      }

      const autoConfirmReserve =
        timeSlotMode && body.booking_kind === "reserve";
      let autoStaffMemberId: string | null = null;
      if (autoConfirmReserve) {
        const staffIds = await getAvailableMemberIdsOnDate(db, body.desired_date);
        autoStaffMemberId = staffIds[0] ?? null;
      }
      // 予約（reserve）は承認待ちにせず即確定。依頼（request）のみ applied。
      const initialStatus = autoConfirmReserve ? "accepted" : "applied";

      const reservation: Reservation = {
        id: reservationId,
        grade: gradeFromHomeroom(profile.homeroom),
        homeroom: profile.homeroom,
        student_number: profile.student_number,
        student_name: profile.student_name,
        title: String(body.title).trim(),
        purpose,
        purpose_other: body.purpose_other ?? null,
        summary: body.summary?.trim() || null,
        print_notes: body.print_notes?.trim() || null,
        printer_id: body.printer_id,
        desired_date: body.desired_date,
        part_count: span.part_count,
        calendar_end_date: span.calendar_end_date,
        stl_r2_key: body.stl_r2_key,
        stl_filename: body.stl_filename,
        stl_size_bytes: Number(body.stl_size_bytes),
        status: initialStatus,
        status_comment: null,
        print_staff: null,
        print_staff_member_id: autoStaffMemberId,
        delivery_staff: null,
        google_event_id: null,
        request_print_video: videoResolved.value ? 1 : 0,
        print_video_storage_path: null,
        print_video_filename: null,
        print_video_size_bytes: null,
        user_id: userId,
        source: 'standard',
        schedule_type: null,
        booking_kind: timeSlotMode ? body.booking_kind! : null,
        start_minute: timeSlotMode ? (body.start_minute ?? null) : null,
        end_minute: timeSlotMode ? (body.end_minute ?? null) : null,
        created_at: new Date().toISOString(),
      };

      await createReservation(db, reservation);

      let submittedReservation = reservation;
      try {
        submittedReservation = await finalizeNewReservationSubmission(
          env,
          db,
          reservation,
          printFiles
        );
      } catch (err) {
        console.error("finalizeNewReservationSubmission failed", err);
      }

      if (autoConfirmReserve) {
        const member = autoStaffMemberId
          ? await getMemberById(db, autoStaffMemberId)
          : null;
        const memberMap = await buildMemberMap(db);
        let saved = submittedReservation;
        if (saved) {
          const calendarResult = await createCalendarEventForReservation(env, saved, memberMap);
          if (calendarResult.ok && calendarResult.eventId) {
            await setGoogleEventId(db, reservationId, calendarResult.eventId);
            saved = (await getReservationById(db, reservationId)) ?? saved;
          }
        }
        const staffLabel = member ? formatMemberLabel(member) : "担当者（未割当）";
        context.waitUntil(
          notifyAutoConfirmedTimeSlotReserve(
            env,
            db,
            context.request,
            saved,
            userId,
            staffLabel
          ).catch((err) => console.error("auto-confirm notify failed", err))
        );
        return json(
          {
            id: reservation.id,
            message: "予約が確定しました",
            auto_confirmed: true,
            booking_kind: body.booking_kind,
          },
          201
        );
      }

      context.waitUntil(
        notifyNewApplicationDiscordAndEmail(
          env,
          db,
          context.request,
          submittedReservation,
          userId
        )
      );

      const pendingMessage =
        timeSlotMode && body.booking_kind === "request"
          ? "印刷依頼を受け付けました（担当者の受領待ち）"
          : "予約申請を受け付けました";
      return json(
        {
          id: reservation.id,
          message: pendingMessage,
          auto_confirmed: false,
          booking_kind: body.booking_kind ?? null,
        },
        201
      );
    }

    const RECENT_PAST_DAYS = 7;
    const OLDER_PAGE_SIZE = 15;

    // GET /api/3dprint/calendar/applications
    if (
      method === "GET" &&
      segments[0] === "calendar" &&
      segments[1] === "applications" &&
      segments.length === 2
    ) {
      const from = url.searchParams.get("from");
      const to = url.searchParams.get("to");
      if (!from || !to || !/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
        return error("from と to (YYYY-MM-DD) が必要です");
      }
      const rows = await getReservationsInRange(db, from, to, "standard");
      const printerMap = await buildPrinterMap(db);
      const applications = rows
        .map((r) => reservationToApplication(r, printerMap, { viewerId: userId }))
        .filter((a): a is NonNullable<typeof a> => a !== null);
      const staffDates: Record<string, boolean> = {};
      for (const d of applications.map((a) => a.date)) {
        if (!(d in staffDates)) {
          staffDates[d] = await hasStaffOnDate(db, d);
        }
      }
      return json({ applications, staff_dates: staffDates, from, to });
    }

    // GET /api/3dprint/calendar/cancelled-applications
    if (
      method === "GET" &&
      segments[0] === "calendar" &&
      segments[1] === "cancelled-applications" &&
      segments.length === 2
    ) {
      const from = url.searchParams.get("from");
      const to = url.searchParams.get("to");
      if (!from || !to || !/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
        return error("from と to (YYYY-MM-DD) が必要です");
      }
      const rows = await getCancelledReservationsInRange(db, from, to, {
        userId,
        source: "standard",
      });
      const printerMap = await buildPrinterMap(db);
      const applications = rows
        .map((r) => reservationToApplication(r, printerMap, { viewerId: userId }))
        .filter((a): a is NonNullable<typeof a> => a !== null);
      return json({ applications, from, to });
    }

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
      const reservations = await getReservationsInRange(db, start, end);
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
          owned: r.user_id === userId,
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
        { isUser: true }
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
        const printerMap = await buildPrinterMap(db);

        context.waitUntil(
          notifyNewApplicationDiscordAndEmail(
            env,
            db,
            context.request,
            created,
            userId
          )
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

      try {
        const updated = await softCancelReservation(env, db, segments[1], { byUser: true });
        const printerMap = await buildPrinterMap(db);
        const applicant = await getSessionUserById(env, db, userId);
        const applicantLabel = applicant
          ? `${applicant.display_name} (@${applicant.username})`
          : null;
        const kindLabel =
          updated.booking_kind === "request"
            ? "依頼"
            : updated.booking_kind === "reserve"
              ? "予約"
              : null;
        const studentLabel = `${updated.student_name}（${updated.homeroom}・${updated.student_number}番）`;
        context.waitUntil(
          notifyReservationCancelledByUser(env.DISCORD_WEBHOOK_URL, {
            adminDeepLink: build3dPrintAdminDeepLink(getOAuthRedirectBase(context.request, env), {
              date: updated.desired_date,
              appId: updated.id,
            }),
            applicantLabel,
            title: updated.title,
            desiredDate: updated.desired_date,
            studentLabel,
            kindLabel,
            printerName: resolvePrinterLabel(updated, printerMap),
          }).catch((err) => console.error("user cancel discord notify failed", err))
        );
        return json({ ok: true, message: "予約を取り消しました" });
      } catch (err) {
        return error(err instanceof Error ? err.message : "取り消しに失敗しました");
      }
    }

    // POST /api/3dprint/reservations/:id/restore
    if (
      method === "POST" &&
      segments[0] === "reservations" &&
      segments[2] === "restore" &&
      segments.length === 3
    ) {
      const reservation = await getReservationById(db, segments[1]);
      if (!reservation) return error("予約が見つかりません", 404);
      if (reservation.user_id !== userId) {
        return error("この予約にアクセスする権限がありません", 403);
      }
      if (reservation.status !== "cancelled") {
        return error("取り消し済みの申請のみ復元できます", 400);
      }
      if (!canUserRestoreCancelledReservation(reservation.booking_kind, reservation.desired_date)) {
        const msg =
          reservation.booking_kind === "request"
            ? "印刷日当日以降は取り消しを元に戻せません"
            : "過ぎた日（当日を含む）の申請は取り消しを元に戻せません";
        return error(msg, 409);
      }
      try {
        const restored = await restoreCancelledReservation(db, segments[1], { isAdmin: false });
        const printerMap = await buildPrinterMap(db);
        const app = reservationToApplication(restored, printerMap, { viewerId: userId });
        return json({ ok: true, application: app, message: "取り消しを取消しました" });
      } catch (err) {
        return error(err instanceof Error ? err.message : "復元に失敗しました", 409);
      }
    }

    // GET /api/3dprint/calendar/availability
    if (method === "GET" && segments[0] === "calendar" && segments[1] === "availability") {
      const date = url.searchParams.get("date");
      const printerId = url.searchParams.get("printer_id");
      const excludeId = url.searchParams.get("exclude_reservation_id");
      if (!date) return error("date が必要です");

      const result = await getDateAvailability(db, date, {
        printerId,
        excludeReservationId: excludeId,
        isAdmin: false,
      });
      return json(mapAvailabilityResponse(result));
    }

    // --- Admin routes (management app access already verified) ---
    if (!isAdminRoute) {
      return error("Not Found", 404);
    }

    if (isAdminReservationManagementWrite(segments, method)) {
      const linked = await requireLinkedPrintStaffForReservationMgmt(env, db, userId);
      if (linked instanceof Response) return linked;
    }

    if (
      method === "GET" &&
      segments[1] === "calendar" &&
      segments[2] === "availability"
    ) {
      const date = url.searchParams.get("date");
      const printerId = url.searchParams.get("printer_id");
      const excludeId = url.searchParams.get("exclude_reservation_id");
      if (!date) return error("date が必要です");

      const result = await getDateAvailability(db, date, {
        printerId,
        excludeReservationId: excludeId,
        isAdmin: true,
      });
      return json(mapAvailabilityResponse(result));
    }

    // POST /api/3dprint/admin/reservations/force
    if (method === "POST" && segments[1] === "reservations" && segments[2] === "force") {
      const body = await request.json<AdminForceReservationInput>();
      const forced = await createAdminForcePrintReservation(db, env.FILES, userId, body, {
        source: "standard",
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
      const adminSpan = syncReservationSpanFields(body.desired_date, adminPartCount);

      const slotError = await validatePrinterReservationSpan(
        db,
        body.desired_date,
        body.printer_id,
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
        source: 'standard',
        schedule_type: null,
        created_at: new Date().toISOString(),
      };

      await createReservation(db, reservation);

      context.waitUntil(
        notifyNewApplicationDiscordAndEmail(
          env,
          db,
          context.request,
          reservation,
          targetUserId
        )
      );

      const memberMap = await buildMemberMap(db);
      const printerMap = await buildPrinterMap(db);
      return json(
        { id: reservation.id, reservation: enrichReservationForAdmin(reservation, memberMap, printerMap) },
        201
      );
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
      const result = await sendPrintReservationAdminTestEmail(env, to);
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

    // PATCH /api/3dprint/admin/settings/print-video
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
      const reservations = await getAllReservations(db, undefined, userId ? { userId } : undefined);
      const memberMap = await buildMemberMap(db);
      const printerMap = await buildPrinterMap(db);
      return json({
        reservations: reservations.map((r) => enrichReservationForAdmin(r, memberMap, printerMap)),
      });
    }

    // GET /api/3dprint/admin/reservations/:id/application-form.pdf
    if (
      method === "GET" &&
      segments[1] === "reservations" &&
      segments[3] === "application-form.pdf" &&
      segments.length === 4
    ) {
      const reservation = await getReservationById(db, segments[2]);
      if (!reservation) return error("予約が見つかりません", 404);
      const r2Key =
        reservation.application_form_pdf_r2_key ??
        applicationFormPdfR2Key(reservation.id);
      const obj = await env.FILES.get(r2Key);
      if (!obj) {
        const printerMap = await buildPrinterMap(db);
        const printer = reservation.printer_id
          ? printerMap.get(reservation.printer_id)
          : undefined;
        const persisted = await persistApplicationFormPdf(env, db, reservation, printer);
        if (!persisted) return error("申請PDFの生成に失敗しました", 500);
        return streamPrintFile(
          env.FILES,
          persisted.r2Key,
          `application-form-${reservation.id}.pdf`
        );
      }
      return streamPrintFile(
        env.FILES,
        r2Key,
        `application-form-${reservation.id}.pdf`
      );
    }

    // GET /api/3dprint/admin/reservations/:id/application-form
    if (
      method === "GET" &&
      segments[1] === "reservations" &&
      segments[3] === "application-form" &&
      segments.length === 4
    ) {
      const reservation = await getReservationById(db, segments[2]);
      if (!reservation) return error("予約が見つかりません", 404);
      const printerMap = await buildPrinterMap(db);
      const printer = reservation.printer_id ? printerMap.get(reservation.printer_id) : undefined;
      const text = await buildPrintApplicationFormText(db, reservation, printer);
      return json({ text, reservation_id: reservation.id });
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
      return json({
        reservation: enrichReservationForAdmin(reservation, memberMap, printerMap),
        available_staff,
      });
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
      if (!existing) return error("予約が見つかりません", 404);

      if (body.status === "accepted" && existing.status === "applied") {
        return error("申請中の予約は「予約を受領」ボタンから受領してください", 400);
      }

      if (
        existing.status === "applied" &&
        body.status &&
        (body.status === "printing" || body.status === "delivered")
      ) {
        return error(
          "申請中の予約は「予約を受領」から受領してからステータスを変更してください",
          400
        );
      }

      const effectiveStaffId =
        body.print_staff_member_id !== undefined
          ? body.print_staff_member_id
          : existing.print_staff_member_id;

      if (
        body.status &&
        (body.status === "printing" || body.status === "delivered") &&
        !effectiveStaffId
      ) {
        return error("印刷中・配布済みにするには印刷担当者を割り当ててください", 400);
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

      if (
        body.status &&
        (body.status === "cancelled" || body.status === "failed") &&
        existing.google_event_id
      ) {
        await deleteCalendarEvent(env, existing.google_event_id);
        await setGoogleEventId(db, segments[2], null);
      }

      await updateReservationAdmin(db, segments[2], {
        ...body,
        status_comment: statusComment,
      });
      let updated = await getReservationById(db, segments[2]);
      let calendar: { ok: boolean; error?: string } | null = null;
      if (updated) {
        calendar = await syncReservationCalendarAfterAdminPatch(env, existing, updated, body);
        if (calendar) {
          updated = await getReservationById(db, segments[2]);
        }
      }
      if (
        updated &&
        body.status === "cancelled" &&
        existing.status !== "cancelled" &&
        updated.user_id
      ) {
        const actor = await resolvePrintActorContext(env, db, userId);
        const opSummary = actor
          ? operatorEmailSummary(actor, { action_label: "予約の取り消し（管理）" })
          : null;
        const printerMapForMail = await buildPrinterMap(db);
        const deepLink = build3dPrintAdminDeepLink(getOAuthRedirectBase(request, env), {
          date: updated.desired_date,
          appId: updated.id,
        });
        void notifyApplicantPrintReservationEmail(env, db, updated.user_id, {
          kind: "cancelled",
          reservation: {
            id: updated.id,
            title: updated.title,
            desired_date: updated.desired_date,
          },
          printerName: resolvePrinterLabel(updated, printerMapForMail),
          statusComment: updated.status_comment,
          reservationAppUrl: build3dPrintReservationAppUrl(getOAuthRedirectBase(request, env)),
          operatorSummary: opSummary,
        }).catch((err) => console.error("cancel email failed", err));
        if (actor) {
          context.waitUntil(
            notifyPrintAdminOperation(env.DISCORD_WEBHOOK_URL, {
              title: "3D印刷 予約取り消し（管理）",
              color: 0xef4444,
              summary: `管理画面から予約「${updated.title}」を取り消しました。`,
              adminDeepLink: deepLink,
              actor,
              actorExtra: { action_label: "予約の取り消し" },
              fields: [
                { name: "タイトル", value: updated.title, inline: true },
                { name: "希望印刷日", value: updated.desired_date, inline: true },
              ],
            })
          );
          void insertAdminLog(db, {
            actor: formatPrintActorLogLabel(actor),
            type: "status",
            text: `予約「${updated.title}」を取り消し`,
            app_id: updated.id,
            actor_user_id: actor.user_id,
            actor_member_id: actor.member_id,
          }).catch(() => {});
        }
      }
      const memberMap = await buildMemberMap(db);
      const printerMap = await buildPrinterMap(db);
      return json({
        reservation: updated ? enrichReservationForAdmin(updated, memberMap, printerMap) : null,
        ...(calendar ? { calendar } : {}),
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
        operatorUserId: userId,
      });
    }

    // PATCH /api/3dprint/admin/reservations/:id/reschedule
    if (
      method === "PATCH" &&
      segments[1] === "reservations" &&
      segments[3] === "reschedule" &&
      segments.length === 4
    ) {
      const body = await request.json<{ desired_date: string; force?: boolean }>();
      if (!body.desired_date || !/^\d{4}-\d{2}-\d{2}$/.test(body.desired_date)) {
        return error("desired_date が不正です");
      }

      const existing = await getReservationById(db, segments[2]);
      if (!existing) return error("予約が見つかりません", 404);
      const previousDate = existing.desired_date;

      try {
        const updated = await adminRescheduleReservation(env, segments[2], body.desired_date, {
          force: Boolean(body.force),
        });
        if (updated.user_id && updated.desired_date !== previousDate) {
          const actor = await resolvePrintActorContext(env, db, userId);
          const opSummary = actor
            ? operatorEmailSummary(actor, { action_label: "予約日の変更（管理）" })
            : null;
          void sendApplicantRescheduledEmail(
            env,
            db,
            request,
            updated.user_id,
            updated,
            previousDate,
            opSummary
          ).catch((err) => console.error("reschedule email failed", err));
          if (actor) {
            const deepLink = build3dPrintAdminDeepLink(getOAuthRedirectBase(request, env), {
              date: updated.desired_date,
              appId: updated.id,
            });
            context.waitUntil(
              notifyPrintAdminOperation(env.DISCORD_WEBHOOK_URL, {
                title: "3D印刷 予約日変更（管理）",
                color: 0xf59e0b,
                summary: `「${updated.title}」の印刷日を ${previousDate} → ${updated.desired_date} に変更しました。`,
                adminDeepLink: deepLink,
                actor,
                actorExtra: { action_label: "予約日の変更" },
                fields: [
                  { name: "タイトル", value: updated.title, inline: true },
                  { name: "変更後", value: updated.desired_date, inline: true },
                ],
              })
            );
          }
        }
        const memberMap = await buildMemberMap(db);
        const printerMap = await buildPrinterMap(db);
        return json({ reservation: enrichReservationForAdmin(updated, memberMap, printerMap) });
      } catch (err) {
        return error(err instanceof Error ? err.message : "リスケに失敗しました");
      }
    }

    // POST /api/3dprint/admin/reservations/:id/restore
    if (
      method === "POST" &&
      segments[1] === "reservations" &&
      segments[3] === "restore" &&
      segments.length === 4
    ) {
      try {
        const restored = await restoreCancelledReservation(db, segments[2], { isAdmin: true });
        const memberMap = await buildMemberMap(db);
        const printerMap = await buildPrinterMap(db);
        const actor = await resolvePrintActorContext(env, db, userId);
        if (actor) {
          const deepLink = build3dPrintAdminDeepLink(getOAuthRedirectBase(request, env), {
            date: restored.desired_date,
            appId: restored.id,
          });
          context.waitUntil(
            notifyPrintAdminOperation(env.DISCORD_WEBHOOK_URL, {
              title: "3D印刷 取り消しの復元（管理）",
              color: 0x3b82f6,
              summary: `予約「${restored.title}」の取り消しを元に戻しました。`,
              adminDeepLink: deepLink,
              actor,
              actorExtra: { action_label: "取り消しの復元" },
              fields: [
                { name: "タイトル", value: restored.title, inline: true },
                { name: "希望印刷日", value: restored.desired_date, inline: true },
              ],
            })
          );
        }
        return json({
          ok: true,
          reservation: enrichReservationForAdmin(restored, memberMap, printerMap),
        });
      } catch (err) {
        return error(err instanceof Error ? err.message : "復元に失敗しました", 409);
      }
    }

    // GET /api/3dprint/admin/calendar/cancelled-applications
    if (
      method === "GET" &&
      segments[1] === "calendar" &&
      segments[2] === "cancelled-applications" &&
      segments.length === 3
    ) {
      const from = url.searchParams.get("from");
      const to = url.searchParams.get("to");
      if (!from || !to || !/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
        return error("from と to (YYYY-MM-DD) が必要です");
      }
      const rows = await getCancelledReservationsInRange(db, from, to, { source: "standard" });
      const printerMap = await buildPrinterMap(db);
      const applications = rows
        .map((r) => reservationToApplication(r, printerMap, {}))
        .filter((a): a is NonNullable<typeof a> => a !== null);
      return json({ applications, from, to });
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
      if (!existing) return error("予約が見つかりません", 404);
      if (existing.status !== "applied") {
        return error("申請中の予約のみ受領できます", 400);
      }

      const member = await getMemberById(db, body.print_staff_member_id);
      if (!member) return error("指定されたメンバーが見つかりません", 400);

      const actor = await requireAdminActor(env, db, userId);
      if (actor instanceof Response) return actor;

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
        const opSummary = operatorEmailSummary(actor, {
          assigned_staff_name: member.name,
          assigned_staff_homeroom: member.homeroom,
          action_label: "予約受領",
        });
        const deepLink = build3dPrintAdminDeepLink(getOAuthRedirectBase(context.request, env), {
          date: finalReservation.desired_date,
          appId: finalReservation.id,
        });
        const applicationFormText = await applicationFormTextFor(
          db,
          finalReservation,
          printerMap
        );
        context.waitUntil(
          Promise.all([
            sendApplicantAcceptedEmail(
              env,
              db,
              context.request,
              finalReservation.user_id,
              finalReservation,
              formatMemberLabel(member),
              opSummary
            ),
            notifyReservationStaffAssigned(env.DISCORD_WEBHOOK_URL, {
              staffMember: member,
              applicationFormText,
              adminDeepLink: deepLink,
            }),
            insertAdminLog(db, {
              actor: formatPrintActorLogLabel(actor),
              type: "status",
              text: `予約「${finalReservation.title}」を受領（${memberDisplayName(member)}）`,
              app_id: finalReservation.id,
              actor_user_id: actor.user_id,
              actor_member_id: actor.member_id,
            }),
          ]).catch((err) => console.error("accept notify failed", err))
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

    // GET /api/3dprint/admin/integrations/status
    if (method === "GET" && segments[1] === "integrations" && segments[2] === "status") {
      const gcalStatus = isGoogleCalendarConfigured(env)
        ? await testGoogleCalendarConnection(env)
        : { ok: false, error: "未設定" };
      return json({
        discord: { configured: Boolean(env.DISCORD_WEBHOOK_URL?.trim()) },
        gcal: {
          configured: isGoogleCalendarConfigured(env),
          ok: gcalStatus.ok,
          error: gcalStatus.error,
        },
        email: {
          configured: isEmailSendingConfigured(env, env.PRINT_3D_EMAIL_FROM?.trim()),
        },
      });
    }

    // POST /api/3dprint/admin/integrations/discord/test
    if (method === "POST" && segments[1] === "integrations" && segments[2] === "discord" && segments[3] === "test") {
      const url = env.DISCORD_WEBHOOK_URL?.trim();
      if (!url) return error("Discord Webhook がサーバーに設定されていません", 503);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: "ScienceHUB 3Dプリント管理のテスト通知です。",
          username: "ScienceHUB 3Dプリント",
        }),
      });
      if (!res.ok) return error(`Discord 送信に失敗しました（HTTP ${res.status}）`, 502);
      return json({ ok: true });
    }

    // POST /api/3dprint/admin/integrations/discord/test-mention
    if (
      method === "POST" &&
      segments[1] === "integrations" &&
      segments[2] === "discord" &&
      segments[3] === "test-mention"
    ) {
      const body = await request.json<{ member_ids?: string[] }>();
      const memberIds = Array.isArray(body.member_ids) ? body.member_ids : [];
      const allMembers = await getAllMembers(db);
      const result = await sendDiscordStaffMentionTest(env.DISCORD_WEBHOOK_URL, allMembers, memberIds);
      if (!result.ok) {
        if (result.error.includes("Webhook")) return error(result.error, 503);
        if (result.status) return error(result.error, 502);
        return error(result.error, 400);
      }
      return json({
        ok: true,
        sent: result.sent,
        skipped: result.skipped,
        content: result.content,
      });
    }

    // GET /api/3dprint/admin/log
    if (method === "GET" && segments[1] === "log" && segments.length === 2) {
      const limit = parseInt(url.searchParams.get("limit") ?? "100", 10);
      const log = await listAdminLog(db, limit);
      return json({ log });
    }

    // GET /api/3dprint/admin/session
    if (method === "GET" && segments[1] === "session" && segments.length === 2) {
      const actor = await requireAdminActor(env, db, userId);
      if (actor instanceof Response) return actor;
      return json({
        user: {
          id: actor.user_id,
          display_name: actor.user_display_name,
          username: actor.user_username,
        },
        linked_member: actor.member_id
          ? {
              id: actor.member_id,
              name: actor.member_name,
              homeroom: actor.member_homeroom,
            }
          : null,
      });
    }

    // GET /api/3dprint/admin/management-users
    if (method === "GET" && segments[1] === "management-users" && segments.length === 2) {
      const users = await listUsersWithAppAccess(db, MANAGEMENT_APP);
      const members = await getAllMembers(db);
      const memberByUser = new Map(
        members.filter((m) => m.user_id).map((m) => [m.user_id as string, m])
      );
      return json({
        users: users.map((u) => ({
          ...u,
          linked_member_id: memberByUser.get(u.id)?.id ?? null,
          linked_member_name: memberByUser.get(u.id)?.name ?? null,
        })),
      });
    }

    // POST /api/3dprint/admin/log
    if (method === "POST" && segments[1] === "log" && segments.length === 2) {
      const body = await request.json<{ type: string; text: string; app_id?: string | null }>();
      if (!body.type?.trim() || !body.text?.trim()) {
        return error("type, text が必要です");
      }
      const actor = await requireAdminActor(env, db, userId);
      if (actor instanceof Response) return actor;
      const row = await insertAdminLog(db, {
        actor: formatPrintActorLogLabel(actor),
        type: body.type.trim(),
        text: body.text.trim(),
        app_id: body.app_id ?? null,
        actor_user_id: actor.user_id,
        actor_member_id: actor.member_id,
      });
      return json({ ok: true, entry: row });
    }

    // POST /api/3dprint/admin/applications/:id/split-slots
    if (
      method === "POST" &&
      segments[1] === "applications" &&
      segments[3] === "split-slots" &&
      segments.length === 4
    ) {
      const body = await request.json<{
        slot_indexes: number[];
        target_status: "pending" | "approved" | "done" | "cancelled";
      }>();
      if (!Array.isArray(body.slot_indexes) || !body.target_status) {
        return error("slot_indexes と target_status が必要です");
      }
      try {
        const printerMap = await buildPrinterMap(db);
        const applications = await splitApplicationSlots(
          db,
          segments[2],
          body.slot_indexes,
          body.target_status,
          printerMap
        );
        return json({ applications });
      } catch (err) {
        return error(err instanceof Error ? err.message : "分割に失敗しました");
      }
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
        user_id: null,
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
      const body = await request.json<{
        color_index?: number;
        discord_user_id?: string | null;
        user_id?: string | null;
      }>();
      const hasColor = body.color_index !== undefined;
      const hasDiscord = body.discord_user_id !== undefined;
      const hasUser = body.user_id !== undefined;

      if (!hasColor && !hasDiscord && !hasUser) {
        return error("color_index、discord_user_id、user_id のいずれかが必要です");
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
      if (hasUser) {
        const linkId = body.user_id?.trim() || null;
        if (linkId) {
          const userRow = await db
            .prepare("SELECT id FROM users WHERE id = ?")
            .bind(linkId)
            .first<{ id: string }>();
          if (!userRow) return error("指定された ScienceHUB ユーザーが見つかりません", 404);
          const allowed = await canUserAccessApp(db, linkId, MANAGEMENT_APP);
          if (!allowed) {
            return error("このユーザーは 3D印刷管理アプリにアクセスできません", 400);
          }
        }
        try {
          await updateMemberUserId(db, segments[2], linkId);
        } catch (err) {
          return error(err instanceof Error ? err.message : "ユーザー紐づけに失敗しました", 409);
        }
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

      const { start, end } = getMonthRangeWithTrailingPadding(year, month);
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

      const previousBookable = isPrinterBookable(normalizePrinterStatus(printer.status));

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
      if (!updated) return error("プリンターが見つかりません", 404);

      const nextBookable = isPrinterBookable(normalizePrinterStatus(updated.status));
      const becameUnbookable = hasStatus && previousBookable && !nextBookable;
      if (hasDailyCapacity || becameUnbookable) {
        try {
          const requeue = await requeuePrinterReservationsAfterChange(env, segments[2], {
            printerBookable: nextBookable,
          });
          return json({
            printer: formatPrinterForApi(updated),
            requeued_reservations: requeue.moved,
          });
        } catch (requeueErr) {
          const message =
            requeueErr instanceof Error ? requeueErr.message : "予約の再配置に失敗しました";
          return error(message, 409);
        }
      }

      return json({ printer: formatPrinterForApi(updated) });
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
