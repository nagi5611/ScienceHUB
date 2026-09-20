// functions/lib/contest/applications.ts
import type { Env } from '../types';
import type { Reservation } from '../3dprint/reservations';
import {
  getActiveContestReservationForApplication,
  type Reservation as PrintReservation,
} from '../3dprint/reservations';
import {
  parseContestApplicationFields,
  parseContestMemberNames,
  type ContestScheduleType,
} from './contest-validation';
import {
  buildContestEntryAppUrl,
  notifyContestParticipationRegisteredEmail,
} from './contest-email';
import { getOAuthRedirectBase } from '../oauth';

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
  created_at: string;
  updated_at: string;
}

export interface ContestApplicationMember {
  id: string;
  application_id: string;
  member_name: string;
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
}

export interface CreateContestApplicationInput {
  schedule_type: ContestScheduleType;
  homeroom: string;
  student_number: number;
  student_name: string;
  title: string;
  impressions?: string | null;
  members?: unknown;
}

export interface PatchContestApplicationInput {
  impressions?: string | null;
  members?: unknown;
}

async function fetchMembersForApplication(
  db: D1Database,
  applicationId: string
): Promise<ContestApplicationMember[]> {
  const result = await db
    .prepare(
      `SELECT id, application_id, member_name, sort_order
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

function enrichApplication(
  app: ContestApplication,
  members: ContestApplicationMember[],
  reservation: ContestApplicationReservationSummary | null,
  active: Reservation | null
): ContestApplicationWithDetails {
  return {
    ...app,
    members,
    reservation,
    can_submit_stl: app.status === 'approved' && !active,
  };
}

/** Inserts member rows for an application (replaces none — use replaceMembers). */
async function insertMembers(
  db: D1Database,
  applicationId: string,
  memberNames: string[]
): Promise<ContestApplicationMember[]> {
  const members: ContestApplicationMember[] = [];
  for (let i = 0; i < memberNames.length; i += 1) {
    const id = crypto.randomUUID();
    await db
      .prepare(
        `INSERT INTO contest_application_members (id, application_id, member_name, sort_order)
         VALUES (?, ?, ?, ?)`
      )
      .bind(id, applicationId, memberNames[i], i)
      .run();
    members.push({
      id,
      application_id: applicationId,
      member_name: memberNames[i],
      sort_order: i,
    });
  }
  return members;
}

async function replaceMembers(
  db: D1Database,
  applicationId: string,
  memberNames: string[]
): Promise<ContestApplicationMember[]> {
  await db
    .prepare(`DELETE FROM contest_application_members WHERE application_id = ?`)
    .bind(applicationId)
    .run();
  return insertMembers(db, applicationId, memberNames);
}

/** Creates an auto-approved contest participation application. */
export async function createContestApplication(
  env: Env,
  request: Request,
  userId: string,
  input: CreateContestApplicationInput
): Promise<ContestApplicationWithDetails> {
  const db = env.DB;
  const parsed = parseContestApplicationFields(input);
  const memberNames = parseContestMemberNames(input.members ?? []);

  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  await db
    .prepare(
      `INSERT INTO contest_applications (
        id, user_id, schedule_type, homeroom, student_number, student_name,
        title, impressions, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'approved', ?, ?)`
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
      now,
      now
    )
    .run();

  const members = await insertMembers(db, id, memberNames);
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
    created_at: now,
    updated_at: now,
  };

  const entryUrl = buildContestEntryAppUrl(getOAuthRedirectBase(request, env));
  await notifyContestParticipationRegisteredEmail(env, db, userId, {
    applicationTitle: application.title,
    entryAppUrl: entryUrl,
  });

  return enrichApplication(application, members, null, null);
}

/** Lists the user's contest applications newest first. */
export async function listContestApplicationsForUser(
  db: D1Database,
  userId: string
): Promise<ContestApplicationWithDetails[]> {
  const result = await db
    .prepare(
      `SELECT id, user_id, schedule_type, homeroom, student_number, student_name,
              title, impressions, status, created_at, updated_at
       FROM contest_applications
       WHERE user_id = ?
       ORDER BY created_at DESC`
    )
    .bind(userId)
    .all<ContestApplication>();

  const apps = result.results ?? [];
  const enriched: ContestApplicationWithDetails[] = [];
  for (const app of apps) {
    const members = await fetchMembersForApplication(db, app.id);
    const reservation = await fetchLatestReservationForApplication(db, app.id);
    const active = await getActiveContestReservationForApplication(db, app.id);
    enriched.push(enrichApplication(app, members, reservation, active));
  }
  return enriched;
}

async function getApplicationRow(
  db: D1Database,
  id: string
): Promise<ContestApplication | null> {
  return db
    .prepare(
      `SELECT id, user_id, schedule_type, homeroom, student_number, student_name,
              title, impressions, status, created_at, updated_at
       FROM contest_applications WHERE id = ?`
    )
    .bind(id)
    .first<ContestApplication>();
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
  return enrichApplication(app, members, reservation, active);
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

/** Updates impressions and/or member list (not while active reservation exists). */
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

  const active = await getActiveContestReservationForApplication(db, applicationId);
  if (active) {
    throw new Error('印刷依頼が進行中のため、参加申請は編集できません');
  }

  const now = new Date().toISOString();
  let impressions = app.impressions;
  if (input.impressions !== undefined) {
    const parsed = parseContestApplicationFields({
      schedule_type: app.schedule_type,
      homeroom: app.homeroom,
      student_number: app.student_number,
      student_name: app.student_name,
      title: app.title,
      impressions: input.impressions,
    });
    impressions = parsed.impressions;
  }

  await db
    .prepare(
      `UPDATE contest_applications SET impressions = ?, updated_at = ? WHERE id = ?`
    )
    .bind(impressions, now, applicationId)
    .run();

  let members = await fetchMembersForApplication(db, applicationId);
  if (input.members !== undefined) {
    const memberNames = parseContestMemberNames(input.members);
    members = await replaceMembers(db, applicationId, memberNames);
  }

  const updated: ContestApplication = {
    ...app,
    impressions,
    updated_at: now,
  };
  const reservation = await fetchLatestReservationForApplication(db, applicationId);
  return enrichApplication(updated, members, reservation, null);
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
              ca.student_name, ca.title, ca.impressions, ca.status, ca.created_at,
              ca.updated_at, u.email AS applicant_email
       FROM contest_applications ca
       LEFT JOIN users u ON u.id = ca.user_id
       ORDER BY ca.created_at DESC
       LIMIT ?`
    )
    .bind(limit)
    .all<
      ContestApplication & {
        applicant_email: string | null;
      }
    >();

  const rows = result.results ?? [];
  const enriched: ContestApplicationAdminRow[] = [];
  for (const row of rows) {
    const { applicant_email, ...app } = row;
    const members = await fetchMembersForApplication(db, app.id);
    const reservation = await fetchLatestReservationForApplication(db, app.id);
    const active = await getActiveContestReservationForApplication(db, app.id);
    enriched.push({
      ...enrichApplication(app, members, reservation, active),
      applicant_email,
    });
  }
  return enriched;
}
