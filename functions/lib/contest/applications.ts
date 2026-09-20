// functions/lib/contest/applications.ts
import type { Env } from '../types';
import type { Reservation } from '../3dprint/reservations';
import {
  getActiveContestReservationForApplication,
  deleteReservation,
  type Reservation as PrintReservation,
} from '../3dprint/reservations';
import {
  parseContestApplicationFields,
  parseContestMemberNames,
  parseContestParticipants,
  type ContestParticipantFields,
  type ContestScheduleType,
} from './contest-validation';
import {
  buildContestEntryAppUrl,
  notifyContestParticipationRegisteredEmail,
} from './contest-email';
import { getOAuthRedirectBase } from '../oauth';
import { deleteCalendarEvent } from '../3dprint/google-calendar';

const CONTEST_APPLICATION_SELECT = `id, user_id, schedule_type, homeroom, student_number, student_name,
  title, impressions, status, self_print, stl_r2_key, stl_filename, stl_size_bytes, stl_print_notes,
  stl_submitted_at, contest_storage_path, contest_storage_filename, created_at, updated_at`;

type ContestApplicationRow = Omit<ContestApplication, 'self_print'> & { self_print: number };

function mapContestApplicationRow(row: ContestApplicationRow): ContestApplication {
  return {
    ...row,
    self_print: row.self_print === 1,
  };
}

export interface ContestApplication {
  id: string;
  user_id: string;
  schedule_type: ContestScheduleType;
  homeroom: string;
  student_number: number;
  student_name: string;
  title: string;
  impressions: string | null;
  status: 'approved' | 'withdrawn';
  self_print: boolean;
  stl_r2_key: string | null;
  stl_filename: string | null;
  stl_size_bytes: number | null;
  stl_print_notes: string | null;
  stl_submitted_at: string | null;
  contest_storage_path: string | null;
  contest_storage_filename: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContestApplicationMember {
  id: string;
  application_id: string;
  member_name: string;
  homeroom: string | null;
  student_number: number | null;
  sort_order: number;
}

export interface ContestApplicationReservationSummary {
  id: string;
  status: PrintReservation['status'];
  desired_date: string;
  created_at: string;
}

export interface ContestApplicationWithDetails extends ContestApplication {
  members: ContestApplicationMember[];
  reservation: ContestApplicationReservationSummary | null;
  can_submit_stl: boolean;
  can_withdraw: boolean;
}

export interface CreateContestApplicationInput {
  schedule_type: ContestScheduleType;
  title: string;
  impressions?: string | null;
  participants?: unknown;
  /** @deprecated 後方互換 */
  homeroom?: string;
  student_number?: number;
  student_name?: string;
  members?: unknown;
  self_print?: boolean;
}

export interface PatchContestApplicationInput {
  title?: string;
  impressions?: string | null;
  participants?: unknown;
  members?: unknown;
}

function primaryParticipantFromApplication(
  app: ContestApplication
): ContestParticipantFields {
  return {
    homeroom: app.homeroom,
    student_number: app.student_number,
    student_name: app.student_name,
  };
}

/** Keeps the application owner as row 0; only additional members may change. */
function mergeParticipantsForPatch(
  app: ContestApplication,
  raw: unknown
): ContestParticipantFields[] {
  const primary = primaryParticipantFromApplication(app);
  if (!Array.isArray(raw)) {
    throw new Error('参加者の形式が不正です');
  }
  if (raw.length === 0) {
    return [primary];
  }
  const extraRows = raw.length > 1 ? raw.slice(1) : [];
  const extras =
    extraRows.length > 0
      ? parseContestParticipants(app.schedule_type, extraRows)
      : [];
  if (extras.length > 20) {
    throw new Error('メンバーは20人までです');
  }
  return [primary, ...extras];
}

async function fetchMembersForApplication(
  db: D1Database,
  applicationId: string
): Promise<ContestApplicationMember[]> {
  const result = await db
    .prepare(
      `SELECT id, application_id, member_name, homeroom, student_number, sort_order
       FROM contest_application_members
       WHERE application_id = ?
       ORDER BY sort_order ASC, id ASC`
    )
    .bind(applicationId)
    .all<ContestApplicationMember>();
  return result.results ?? [];
}

async function fetchLatestReservationForApplication(
  db: D1Database,
  applicationId: string
): Promise<ContestApplicationReservationSummary | null> {
  const row = await db
    .prepare(
      `SELECT id, status, desired_date, created_at
       FROM print_reservations
       WHERE contest_application_id = ? AND source = 'contest'
       ORDER BY created_at DESC
       LIMIT 1`
    )
    .bind(applicationId)
    .first<ContestApplicationReservationSummary>();
  return row ?? null;
}

async function hasBlockingReservationForWithdraw(
  db: D1Database,
  applicationId: string
): Promise<boolean> {
  const row = await db
    .prepare(
      `SELECT 1 FROM print_reservations
       WHERE contest_application_id = ? AND source = 'contest'
         AND status IN ('printing', 'delivered')
       LIMIT 1`
    )
    .bind(applicationId)
    .first();
  return row != null;
}

function enrichApplication(
  app: ContestApplication,
  members: ContestApplicationMember[],
  reservation: ContestApplicationReservationSummary | null,
  active: Reservation | null,
  canWithdraw: boolean
): ContestApplicationWithDetails {
  const selfPrintSubmitted = app.self_print && app.stl_submitted_at != null;
  return {
    ...app,
    members,
    reservation,
    can_submit_stl:
      app.status === 'approved' &&
      !active &&
      !selfPrintSubmitted,
    can_withdraw: canWithdraw,
  };
}

/** Inserts participant rows for an application. */
async function insertMembers(
  db: D1Database,
  applicationId: string,
  participants: ContestParticipantFields[]
): Promise<ContestApplicationMember[]> {
  const members: ContestApplicationMember[] = [];
  for (let i = 0; i < participants.length; i += 1) {
    const row = participants[i];
    const id = crypto.randomUUID();
    await db
      .prepare(
        `INSERT INTO contest_application_members (
          id, application_id, member_name, homeroom, student_number, sort_order
        ) VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(id, applicationId, row.student_name, row.homeroom, row.student_number, i)
      .run();
    members.push({
      id,
      application_id: applicationId,
      member_name: row.student_name,
      homeroom: row.homeroom,
      student_number: row.student_number,
      sort_order: i,
    });
  }
  return members;
}

async function replaceMembers(
  db: D1Database,
  applicationId: string,
  participants: ContestParticipantFields[]
): Promise<ContestApplicationMember[]> {
  await db
    .prepare(`DELETE FROM contest_application_members WHERE application_id = ?`)
    .bind(applicationId)
    .run();
  return insertMembers(db, applicationId, participants);
}

function resolveParticipantsForCreate(
  input: CreateContestApplicationInput
): ContestParticipantFields[] {
  if (Array.isArray(input.participants) && input.participants.length > 0) {
    return parseContestParticipants(input.schedule_type, input.participants);
  }

  const homeroom = String(input.homeroom ?? '').trim();
  const studentName = String(input.student_name ?? '').trim();
  const studentNumber = Number(input.student_number);
  const primary = parseContestParticipants(input.schedule_type, [
    {
      homeroom,
      student_number: studentNumber,
      student_name: studentName,
    },
  ])[0];

  const extraNames = parseContestMemberNames(input.members ?? []);
  return [
    primary,
    ...extraNames.map((name) => ({
      homeroom: primary.homeroom,
      student_number: primary.student_number,
      student_name: name,
    })),
  ];
}

/** Creates an auto-approved contest participation application. */
export async function createContestApplication(
  env: Env,
  request: Request,
  userId: string,
  input: CreateContestApplicationInput
): Promise<ContestApplicationWithDetails> {
  const db = env.DB;
  const participants = resolveParticipantsForCreate(input);
  const first = participants[0];
  const parsed = parseContestApplicationFields({
    schedule_type: input.schedule_type,
    homeroom: first.homeroom,
    student_number: first.student_number,
    student_name: first.student_name,
    title: input.title,
    impressions: input.impressions ?? null,
  });

  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const selfPrint = input.self_print ? 1 : 0;

  await db
    .prepare(
      `INSERT INTO contest_applications (
        id, user_id, schedule_type, homeroom, student_number, student_name,
        title, impressions, status, self_print, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'approved', ?, ?, ?)`
    )
    .bind(
      id,
      userId,
      parsed.schedule_type,
      parsed.homeroom,
      parsed.student_number,
      parsed.student_name,
      parsed.title,
      parsed.impressions,
      selfPrint,
      now,
      now
    )
    .run();

  const members = await insertMembers(db, id, participants);
  const application: ContestApplication = {
    id,
    user_id: userId,
    schedule_type: parsed.schedule_type,
    homeroom: parsed.homeroom,
    student_number: parsed.student_number,
    student_name: parsed.student_name,
    title: parsed.title,
    impressions: parsed.impressions,
    status: 'approved',
    self_print: selfPrint === 1,
    stl_r2_key: null,
    stl_filename: null,
    stl_size_bytes: null,
    stl_print_notes: null,
    stl_submitted_at: null,
    contest_storage_path: null,
    contest_storage_filename: null,
    created_at: now,
    updated_at: now,
  };

  const entryUrl = buildContestEntryAppUrl(getOAuthRedirectBase(request, env));
  await notifyContestParticipationRegisteredEmail(env, db, userId, {
    applicationTitle: application.title,
    entryAppUrl: entryUrl,
  });

  return enrichApplication(application, members, null, null, true);
}

/** Lists the user's contest applications newest first. */
export async function listContestApplicationsForUser(
  db: D1Database,
  userId: string
): Promise<ContestApplicationWithDetails[]> {
  const result = await db
    .prepare(
      `SELECT ${CONTEST_APPLICATION_SELECT}
       FROM contest_applications
       WHERE user_id = ?
       ORDER BY created_at DESC`
    )
    .bind(userId)
    .all<ContestApplicationRow>();

  const apps = (result.results ?? []).map(mapContestApplicationRow);
  const enriched: ContestApplicationWithDetails[] = [];
  for (const app of apps) {
    const members = await fetchMembersForApplication(db, app.id);
    const reservation = await fetchLatestReservationForApplication(db, app.id);
    const active = await getActiveContestReservationForApplication(db, app.id);
    const canWithdraw =
      app.status === 'approved' &&
      !(await hasBlockingReservationForWithdraw(db, app.id));
    enriched.push(enrichApplication(app, members, reservation, active, canWithdraw));
  }
  return enriched;
}

async function getApplicationRow(
  db: D1Database,
  id: string
): Promise<ContestApplication | null> {
  const row = await db
    .prepare(`SELECT ${CONTEST_APPLICATION_SELECT} FROM contest_applications WHERE id = ?`)
    .bind(id)
    .first<ContestApplicationRow>();
  return row ? mapContestApplicationRow(row) : null;
}

/** Loads one application if owned by the user. */
export async function getContestApplicationForUser(
  db: D1Database,
  userId: string,
  applicationId: string
): Promise<ContestApplicationWithDetails | null> {
  const app = await getApplicationRow(db, applicationId);
  if (!app || app.user_id !== userId) return null;
  const members = await fetchMembersForApplication(db, app.id);
  const reservation = await fetchLatestReservationForApplication(db, app.id);
  const active = await getActiveContestReservationForApplication(db, app.id);
  const canWithdraw =
    app.status === 'approved' &&
    !(await hasBlockingReservationForWithdraw(db, app.id));
  return enrichApplication(app, members, reservation, active, canWithdraw);
}

/** Loads application for STL submit (must be approved and owned). */
export async function getContestApplicationForSubmit(
  db: D1Database,
  userId: string,
  applicationId: string
): Promise<ContestApplication | null> {
  const app = await getApplicationRow(db, applicationId);
  if (!app || app.user_id !== userId) return null;
  if (app.status !== 'approved') return null;
  return app;
}

/** Updates title, impressions, and/or additional members (primary row is fixed). */
export async function patchContestApplicationForUser(
  db: D1Database,
  userId: string,
  applicationId: string,
  input: PatchContestApplicationInput
): Promise<ContestApplicationWithDetails> {
  const app = await getApplicationRow(db, applicationId);
  if (!app || app.user_id !== userId) {
    throw new Error('参加申請が見つかりません');
  }
  if (app.status !== 'approved') {
    throw new Error('この参加申請は編集できません');
  }

  const now = new Date().toISOString();
  let title = app.title;
  let impressions = app.impressions;

  if (input.title !== undefined) {
    const parsedTitle = parseContestApplicationFields({
      schedule_type: app.schedule_type,
      homeroom: app.homeroom,
      student_number: app.student_number,
      student_name: app.student_name,
      title: input.title,
      impressions: impressions ?? null,
    });
    title = parsedTitle.title;
  }

  if (input.impressions !== undefined) {
    const parsed = parseContestApplicationFields({
      schedule_type: app.schedule_type,
      homeroom: app.homeroom,
      student_number: app.student_number,
      student_name: app.student_name,
      title,
      impressions: input.impressions,
    });
    impressions = parsed.impressions;
  }

  await db
    .prepare(
      `UPDATE contest_applications SET title = ?, impressions = ?, updated_at = ? WHERE id = ?`
    )
    .bind(title, impressions, now, applicationId)
    .run();

  if (title !== app.title && !app.self_print) {
    await db
      .prepare(
        `UPDATE print_reservations SET title = ?
         WHERE contest_application_id = ? AND source = 'contest'`
      )
      .bind(title, applicationId)
      .run();
  }

  let members = await fetchMembersForApplication(db, applicationId);
  if (input.members !== undefined || input.participants !== undefined) {
    const raw = input.participants ?? input.members;
    const participants = mergeParticipantsForPatch(app, raw);
    members = await replaceMembers(db, applicationId, participants);
  }

  const active = await getActiveContestReservationForApplication(db, applicationId);
  const updated: ContestApplication = {
    ...app,
    title,
    impressions,
    updated_at: now,
  };
  const reservation = await fetchLatestReservationForApplication(db, applicationId);
  const canWithdraw =
    updated.status === 'approved' &&
    !(await hasBlockingReservationForWithdraw(db, applicationId));
  return enrichApplication(updated, members, reservation, active, canWithdraw);
}

/** Records STL submission for self-print applications (no print reservation). */
export async function updateContestApplicationSelfPrintStl(
  db: D1Database,
  applicationId: string,
  data: {
    stl_r2_key: string;
    stl_filename: string;
    stl_size_bytes: number;
    stl_print_notes: string | null;
    contest_storage_path?: string | null;
    contest_storage_filename?: string | null;
  }
): Promise<ContestApplication> {
  const now = new Date().toISOString();
  await db
    .prepare(
      `UPDATE contest_applications SET
        stl_r2_key = ?, stl_filename = ?, stl_size_bytes = ?, stl_print_notes = ?,
        stl_submitted_at = ?, contest_storage_path = ?, contest_storage_filename = ?,
        updated_at = ?
       WHERE id = ?`
    )
    .bind(
      data.stl_r2_key,
      data.stl_filename,
      data.stl_size_bytes,
      data.stl_print_notes,
      now,
      data.contest_storage_path ?? null,
      data.contest_storage_filename ?? null,
      now,
      applicationId
    )
    .run();

  const app = await getApplicationRow(db, applicationId);
  if (!app) throw new Error('参加申請が見つかりません');
  return app;
}

/** Updates contest cloud storage path on a self-print application. */
export async function updateContestApplicationContestStorage(
  db: D1Database,
  applicationId: string,
  data: { contest_storage_path: string; contest_storage_filename: string }
): Promise<void> {
  const now = new Date().toISOString();
  await db
    .prepare(
      `UPDATE contest_applications SET contest_storage_path = ?, contest_storage_filename = ?, updated_at = ? WHERE id = ?`
    )
    .bind(data.contest_storage_path, data.contest_storage_filename, now, applicationId)
    .run();
}

type ContestReservationCancelRow = {
  id: string;
  google_event_id: string | null;
  stl_r2_key: string;
  status: PrintReservation['status'];
};

async function cancelOpenContestReservationsForApplication(
  env: Env,
  db: D1Database,
  applicationId: string
): Promise<void> {
  const result = await db
    .prepare(
      `SELECT id, google_event_id, stl_r2_key, status FROM print_reservations
       WHERE contest_application_id = ? AND source = 'contest' AND status != 'cancelled'`
    )
    .bind(applicationId)
    .all<ContestReservationCancelRow>();

  const rows = result.results ?? [];
  for (const row of rows) {
    if (row.status === 'printing' || row.status === 'delivered') {
      throw new Error('印刷が進行中または完了しているため、参加を取り消せません');
    }
  }

  for (const row of rows) {
    await deleteCalendarEvent(env, row.google_event_id);
    try {
      await env.FILES.delete(row.stl_r2_key);
    } catch (err) {
      console.error('contest withdraw: failed to delete reservation stl', row.id, err);
    }
    await deleteReservation(db, row.id);
  }
}

/** Marks participation as withdrawn and cancels cancellable print reservations. */
export async function withdrawContestApplicationForUser(
  env: Env,
  db: D1Database,
  userId: string,
  applicationId: string
): Promise<ContestApplicationWithDetails> {
  const app = await getApplicationRow(db, applicationId);
  if (!app || app.user_id !== userId) {
    throw new Error('参加申請が見つかりません');
  }
  if (app.status === 'withdrawn') {
    throw new Error('すでに参加を取り消しています');
  }
  if (app.status !== 'approved') {
    throw new Error('この参加申請は取り消せません');
  }

  await cancelOpenContestReservationsForApplication(env, db, applicationId);

  const now = new Date().toISOString();
  await db
    .prepare(`UPDATE contest_applications SET status = 'withdrawn', updated_at = ? WHERE id = ?`)
    .bind(now, applicationId)
    .run();

  const updated = await getApplicationRow(db, applicationId);
  if (!updated) throw new Error('参加申請が見つかりません');

  const members = await fetchMembersForApplication(db, applicationId);
  const reservation = await fetchLatestReservationForApplication(db, applicationId);
  const active = await getActiveContestReservationForApplication(db, applicationId);
  return enrichApplication(updated, members, reservation, active, false);
}

export interface ContestApplicationAdminRow extends ContestApplicationWithDetails {
  applicant_email: string | null;
}

/** Admin list of contest applications (newest first, optional limit). */
export async function listContestApplicationsAdmin(
  db: D1Database,
  options?: { limit?: number }
): Promise<ContestApplicationAdminRow[]> {
  const limit = Math.min(Math.max(options?.limit ?? 200, 1), 500);
  const result = await db
    .prepare(
      `SELECT ca.id, ca.user_id, ca.schedule_type, ca.homeroom, ca.student_number,
              ca.student_name, ca.title, ca.impressions, ca.status, ca.self_print,
              ca.stl_r2_key, ca.stl_filename, ca.stl_size_bytes, ca.stl_print_notes,
              ca.stl_submitted_at, ca.contest_storage_path, ca.contest_storage_filename,
              ca.created_at, ca.updated_at, u.email AS applicant_email
       FROM contest_applications ca
       LEFT JOIN users u ON u.id = ca.user_id
       ORDER BY ca.created_at DESC
       LIMIT ?`
    )
    .bind(limit)
    .all<
      ContestApplicationRow & {
        applicant_email: string | null;
      }
    >();

  const rows = result.results ?? [];
  const enriched: ContestApplicationAdminRow[] = [];
  for (const row of rows) {
    const { applicant_email, ...rawApp } = row;
    const app = mapContestApplicationRow(rawApp);
    const members = await fetchMembersForApplication(db, app.id);
    const reservation = await fetchLatestReservationForApplication(db, app.id);
    const active = await getActiveContestReservationForApplication(db, app.id);
    const canWithdraw =
      app.status === 'approved' &&
      !(await hasBlockingReservationForWithdraw(db, app.id));
    enriched.push({
      ...enrichApplication(app, members, reservation, active, canWithdraw),
      applicant_email,
    });
  }
  return enriched;
}
