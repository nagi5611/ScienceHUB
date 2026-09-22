// functions/lib/contest/staff-messages.ts
import type { Env } from '../types';
import type { Reservation } from '../3dprint/reservations';
import {
  getMemberById,
  getReservationById,
  updateReservationAdmin,
} from '../3dprint/reservations';
import { deleteCalendarEvent } from '../3dprint/google-calendar';
import {
  buildContestEntryAppUrl,
  notifyContestStaffMessageEmail,
  resolveContestEmailStaffName,
} from './contest-email';
import { getOAuthRedirectBase } from '../oauth';

export type ContestStaffMessageKind =
  | 'print_rejected'
  | 'accepted'
  | 'decided'
  | 'status_changed'
  | 'custom';

export const CONTEST_STAFF_MESSAGE_KIND_LABELS: Record<ContestStaffMessageKind, string> = {
  print_rejected: '印刷不能',
  accepted: '承認（受領）',
  decided: '決定',
  status_changed: 'お知らせ',
  custom: '担当者からのお知らせ',
};

export interface ContestStaffMessageRow {
  id: string;
  user_id: string;
  contest_application_id: string;
  print_reservation_id: string | null;
  kind: ContestStaffMessageKind;
  body: string;
  staff_display_name: string;
  created_by_user_id: string | null;
  created_at: string;
}

export interface ContestStaffMessageForApi extends ContestStaffMessageRow {
  kind_label: string;
  application_title: string | null;
}

const MAX_BODY_LEN = 4000;

function assertBodyLength(body: string): void {
  const trimmed = body.trim();
  if (!trimmed) throw new Error('メッセージを入力してください');
  if (trimmed.length > MAX_BODY_LEN) {
    throw new Error(`メッセージは${MAX_BODY_LEN}文字以内で入力してください`);
  }
}

/** Inserts a staff message row for the contest applicant UI. */
export async function insertContestStaffMessage(
  db: D1Database,
  input: {
    userId: string;
    contestApplicationId: string;
    printReservationId?: string | null;
    kind: ContestStaffMessageKind;
    body: string;
    staffDisplayName: string;
    createdByUserId?: string | null;
  }
): Promise<ContestStaffMessageRow> {
  assertBodyLength(input.body);
  const id = crypto.randomUUID();
  const created_at = new Date().toISOString();
  const body = input.body.trim();
  await db
    .prepare(
      `INSERT INTO contest_staff_messages (
        id, user_id, contest_application_id, print_reservation_id,
        kind, body, staff_display_name, created_by_user_id, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      input.userId,
      input.contestApplicationId,
      input.printReservationId ?? null,
      input.kind,
      body,
      input.staffDisplayName.trim() || '担当者',
      input.createdByUserId ?? null,
      created_at
    )
    .run();

  return {
    id,
    user_id: input.userId,
    contest_application_id: input.contestApplicationId,
    print_reservation_id: input.printReservationId ?? null,
    kind: input.kind,
    body,
    staff_display_name: input.staffDisplayName.trim() || '担当者',
    created_by_user_id: input.createdByUserId ?? null,
    created_at,
  };
}

async function fetchApplicationTitles(
  db: D1Database,
  applicationIds: string[]
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (applicationIds.length === 0) return map;
  const placeholders = applicationIds.map(() => '?').join(', ');
  const result = await db
    .prepare(
      `SELECT id, title FROM contest_applications WHERE id IN (${placeholders})`
    )
    .bind(...applicationIds)
    .all<{ id: string; title: string }>();
  for (const row of result.results ?? []) {
    map.set(row.id, row.title);
  }
  return map;
}

/** Lists staff messages for the logged-in contest participant. */
export async function listContestStaffMessagesForUser(
  db: D1Database,
  userId: string,
  options?: { since?: string | null; limit?: number }
): Promise<ContestStaffMessageForApi[]> {
  const limit = Math.min(Math.max(options?.limit ?? 100, 1), 200);
  const since = options?.since?.trim();
  let query = `SELECT m.* FROM contest_staff_messages m
    WHERE m.user_id = ?`;
  const binds: unknown[] = [userId];
  if (since) {
    query += ` AND m.created_at > ?`;
    binds.push(since);
  }
  query += ` ORDER BY m.created_at ASC LIMIT ?`;
  binds.push(limit);

  const result = await db.prepare(query).bind(...binds).all<ContestStaffMessageRow>();
  const rows = result.results ?? [];
  const titleMap = await fetchApplicationTitles(
    db,
    [...new Set(rows.map((r) => r.contest_application_id))]
  );

  return rows.map((row) => ({
    ...row,
    kind_label: CONTEST_STAFF_MESSAGE_KIND_LABELS[row.kind] ?? row.kind,
    application_title: titleMap.get(row.contest_application_id) ?? null,
  }));
}

async function resolveStaffDisplayName(
  db: D1Database,
  env: Env,
  printStaffMemberId: string | null | undefined
): Promise<string> {
  return resolveContestEmailStaffName(db, env, printStaffMemberId ?? null);
}

async function getContestApplicationIdForReservation(
  db: D1Database,
  reservation: Reservation
): Promise<string | null> {
  if (reservation.contest_application_id) return reservation.contest_application_id;
  const row = await db
    .prepare(`SELECT id FROM contest_applications WHERE user_id = ? AND title = ? LIMIT 1`)
    .bind(reservation.user_id, reservation.title)
    .first<{ id: string }>();
  return row?.id ?? null;
}

/** Records a staff message and optionally sends email (fire-and-forget caller). */
export async function recordContestStaffMessageWithEmail(
  env: Env,
  db: D1Database,
  request: Request,
  options: {
    reservation: Reservation;
    kind: ContestStaffMessageKind;
    body: string;
    staffDisplayName: string;
    createdByUserId?: string | null;
    sendEmail?: boolean;
  }
): Promise<ContestStaffMessageRow | null> {
  const applicationId = await getContestApplicationIdForReservation(db, options.reservation);
  if (!applicationId) {
    console.warn('contest staff message skipped: no application id', options.reservation.id);
    return null;
  }

  const row = await insertContestStaffMessage(db, {
    userId: options.reservation.user_id,
    contestApplicationId: applicationId,
    printReservationId: options.reservation.id,
    kind: options.kind,
    body: options.body,
    staffDisplayName: options.staffDisplayName,
    createdByUserId: options.createdByUserId ?? null,
  });

  if (options.sendEmail !== false) {
    const entryAppUrl = buildContestEntryAppUrl(getOAuthRedirectBase(request, env));
    await notifyContestStaffMessageEmail(env, db, options.reservation.user_id, {
      kind: options.kind,
      body: options.body,
      staffName: options.staffDisplayName,
      applicationTitle: options.reservation.title,
      entryAppUrl,
      reservation: options.reservation,
    });
  }

  return row;
}

const PRINT_REJECT_ALLOWED_STATUSES = ['applied', 'accepted'] as const;

const RESERVATION_STATUS_LABELS: Record<Reservation['status'], string> = {
  applied: '申請中',
  accepted: '受領済み',
  printing: '印刷中',
  delivered: '印刷完了',
  failed: '印刷失敗',
  cancelled: 'キャンセル',
};

/** Admin: mark STL print request as unprintable, notify applicant. */
export async function rejectContestPrintReservationAsAdmin(
  env: Env,
  db: D1Database,
  request: Request,
  adminUserId: string,
  reservationId: string,
  reason: string,
  printStaffMemberId?: string | null
): Promise<{ reservation: Reservation; message: ContestStaffMessageRow }> {
  assertBodyLength(reason);

  const reservation = await getReservationById(db, reservationId);
  if (!reservation || reservation.source !== 'contest') {
    throw new Error('予約が見つかりません');
  }
  if (!PRINT_REJECT_ALLOWED_STATUSES.includes(reservation.status as (typeof PRINT_REJECT_ALLOWED_STATUSES)[number])) {
    throw new Error('申請中または受領済みの印刷依頼のみ印刷不能にできます');
  }

  if (printStaffMemberId) {
    const member = await getMemberById(db, printStaffMemberId);
    if (!member) throw new Error('指定されたメンバーが見つかりません');
  }

  const staffName = await resolveStaffDisplayName(db, env, printStaffMemberId ?? reservation.print_staff_member_id);

  if (reservation.google_event_id) {
    try {
      await deleteCalendarEvent(env, reservation.google_event_id);
    } catch (err) {
      console.error('contest print reject calendar delete failed:', err);
    }
  }

  await updateReservationAdmin(db, reservationId, {
    status: 'cancelled',
    status_comment: reason.trim(),
    print_staff_member_id: printStaffMemberId ?? reservation.print_staff_member_id,
  });

  const updated = await getReservationById(db, reservationId);
  if (!updated) throw new Error('予約の更新に失敗しました');

  const messageRow = await recordContestStaffMessageWithEmail(env, db, request, {
    reservation: updated,
    kind: 'print_rejected',
    body: reason.trim(),
    staffDisplayName: staffName,
    createdByUserId: adminUserId,
    sendEmail: true,
  });

  if (!messageRow) {
    throw new Error('メッセージの保存に失敗しました');
  }

  return { reservation: updated, message: messageRow };
}

/** Auto message when admin accepts a print reservation. */
export async function recordContestAcceptedStaffMessage(
  env: Env,
  db: D1Database,
  request: Request,
  reservation: Reservation,
  createdByUserId: string
): Promise<void> {
  const staffName = await resolveStaffDisplayName(db, env, reservation.print_staff_member_id);
  const body = `印刷依頼を受領しました。印刷予定日は ${reservation.desired_date} です。`;
  await recordContestStaffMessageWithEmail(env, db, request, {
    reservation,
    kind: 'accepted',
    body,
    staffDisplayName: staffName,
    createdByUserId,
    sendEmail: false,
  });
}

/** Auto message when print is marked delivered. */
export async function recordContestDecidedStaffMessage(
  env: Env,
  db: D1Database,
  request: Request,
  reservation: Reservation,
  createdByUserId: string | null
): Promise<void> {
  const staffName = await resolveStaffDisplayName(db, env, reservation.print_staff_member_id);
  const body = `作品「${reservation.title}」の印刷が完了しました。`;
  await recordContestStaffMessageWithEmail(env, db, request, {
    reservation,
    kind: 'decided',
    body,
    staffDisplayName: staffName,
    createdByUserId,
    sendEmail: false,
  });
}

/** Status change with optional comment (excluding transitions handled elsewhere). */
export async function recordContestStatusChangedStaffMessage(
  env: Env,
  db: D1Database,
  request: Request,
  reservation: Reservation,
  options: {
    previousStatus: Reservation['status'];
    newStatus: Reservation['status'];
    statusComment?: string | null;
    createdByUserId: string | null;
  }
): Promise<void> {
  if (options.newStatus === 'delivered') return;
  if (options.newStatus === 'accepted' && options.previousStatus === 'applied') return;

  const staffName = await resolveStaffDisplayName(db, env, reservation.print_staff_member_id);
  const prevLabel = RESERVATION_STATUS_LABELS[options.previousStatus] ?? options.previousStatus;
  const nextLabel = RESERVATION_STATUS_LABELS[options.newStatus] ?? options.newStatus;
  const comment = options.statusComment?.trim();
  let body = `印刷依頼のステータスが「${prevLabel}」から「${nextLabel}」に更新されました。`;
  if (comment) {
    body += `\n\n${comment}`;
  }

  await recordContestStaffMessageWithEmail(env, db, request, {
    reservation,
    kind: 'status_changed',
    body,
    staffDisplayName: staffName,
    createdByUserId: options.createdByUserId,
    sendEmail: false,
  });
}
