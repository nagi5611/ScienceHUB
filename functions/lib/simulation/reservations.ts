// functions/api/lib/db.ts
import type { SimScale } from './slots';

export interface Reservation {
  id: string;
  grade: number;
  homeroom: string;
  student_number: number;
  student_name: string;
  title: string;
  purpose: 'ss_s_tan' | 'club' | 'other';
  purpose_other: string | null;
  summary: string | null;
  sim_notes: string | null;
  sim_scale: SimScale;
  simulator_id: string | null;
  desired_date: string;
  stl_r2_key: string;
  stl_filename: string;
  stl_size_bytes: number;
  status: 'applied' | 'accepted' | 'running' | 'delivered' | 'failed' | 'cancelled';
  status_comment: string | null;
  sim_staff: string | null;
  sim_staff_member_id: string | null;
  delivery_staff: string | null;
  google_event_id: string | null;
  request_result_video: number;
  result_video_storage_path: string | null;
  result_video_filename: string | null;
  result_video_size_bytes: number | null;
  user_id: string;
  created_at: string;
}

export interface Member {
  id: string;
  homeroom: string;
  student_number: number;
  name: string;
  color_index: number;
  discord_user_id: string | null;
  created_at: string;
}

export interface MemberAvailability {
  member_id: string;
  date: string;
}

/** Formats a member for dropdown display. */
export function formatMemberLabel(member: Member): string {
  return `${member.name}（${member.homeroom}）`;
}

export interface UploadSession {
  id: string;
  upload_id: string;
  r2_key: string;
  filename: string;
  total_size: number;
  part_size: number;
  parts_json: string;
  status: string;
  created_at: string;
}

export interface UploadedPart {
  partNumber: number;
  etag: string;
}

/** Counts applied (pending acceptance) reservations per simulator. */
export async function getAppliedReservationCountsBySimulator(
  db: D1Database,
  date?: string
): Promise<Record<string, number>> {
  let query = `
    SELECT simulator_id, COUNT(*) AS count
    FROM sim_reservations
    WHERE status = 'applied' AND simulator_id IS NOT NULL`;
  const binds: string[] = [];

  if (date) {
    query += ` AND desired_date = ?`;
    binds.push(date);
  }

  query += ` GROUP BY simulator_id`;

  const statement = db.prepare(query);
  const result =
    binds.length > 0
      ? await statement.bind(...binds).all<{ simulator_id: string; count: number }>()
      : await statement.all<{ simulator_id: string; count: number }>();

  const counts: Record<string, number> = {};
  for (const row of result.results ?? []) {
    counts[row.simulator_id] = row.count;
  }
  return counts;
}

/** Fetches active reservations for a given date. */
export async function getReservationsByDate(db: D1Database, date: string): Promise<Reservation[]> {
  const result = await db
    .prepare(
      `SELECT * FROM sim_reservations WHERE desired_date = ? AND status != 'cancelled' ORDER BY created_at`
    )
    .bind(date)
    .all<Reservation>();
  return result.results ?? [];
}

/** Fetches active reservations for a given date and simulator. */
export async function getReservationsByDateAndSimulator(
  db: D1Database,
  date: string,
  simulatorId: string
): Promise<Reservation[]> {
  const result = await db
    .prepare(
      `SELECT * FROM sim_reservations
       WHERE desired_date = ? AND simulator_id = ? AND status != 'cancelled'
       ORDER BY created_at`
    )
    .bind(date, simulatorId)
    .all<Reservation>();
  return result.results ?? [];
}

/** Fetches reservations within a month range. */
export async function getReservationsInRange(
  db: D1Database,
  startDate: string,
  endDate: string
): Promise<Reservation[]> {
  const result = await db
    .prepare(
      `SELECT * FROM sim_reservations WHERE desired_date >= ? AND desired_date <= ? AND status != 'cancelled' ORDER BY desired_date, created_at`
    )
    .bind(startDate, endDate)
    .all<Reservation>();
  return result.results ?? [];
}

/** Cursor for paginating older public reservations. */
export interface ReservationListCursor {
  desired_date: string;
  created_at: string;
  id: string;
}

/** Fetches upcoming public reservations (today and later). */
export async function getPublicUpcomingReservations(
  db: D1Database,
  today: string
): Promise<Reservation[]> {
  const result = await db
    .prepare(
      `SELECT * FROM sim_reservations
       WHERE desired_date >= ? AND status != 'cancelled'
       ORDER BY desired_date ASC, created_at ASC`
    )
    .bind(today)
    .all<Reservation>();
  return result.results ?? [];
}

/** Fetches recent past public reservations within a date range. */
export async function getPublicRecentPastReservations(
  db: D1Database,
  startDate: string,
  beforeDate: string
): Promise<Reservation[]> {
  const result = await db
    .prepare(
      `SELECT * FROM sim_reservations
       WHERE desired_date >= ? AND desired_date < ? AND status != 'cancelled'
       ORDER BY desired_date DESC, created_at DESC`
    )
    .bind(startDate, beforeDate)
    .all<Reservation>();
  return result.results ?? [];
}

/** Returns whether any reservation exists before a date boundary. */
export async function hasReservationsBeforeDate(
  db: D1Database,
  beforeDate: string
): Promise<boolean> {
  const row = await db
    .prepare(
      `SELECT 1 AS ok FROM sim_reservations
       WHERE desired_date < ? AND status != 'cancelled'
       LIMIT 1`
    )
    .bind(beforeDate)
    .first<{ ok: number }>();
  return !!row;
}

/** Fetches a page of older public reservations. */
export async function getPublicOlderReservations(
  db: D1Database,
  beforeExclusiveDate: string,
  limit: number,
  cursor?: ReservationListCursor | null
): Promise<Reservation[]> {
  if (!cursor) {
    const result = await db
      .prepare(
        `SELECT * FROM sim_reservations
         WHERE desired_date < ? AND status != 'cancelled'
         ORDER BY desired_date DESC, created_at DESC, id DESC
         LIMIT ?`
      )
      .bind(beforeExclusiveDate, limit)
      .all<Reservation>();
    return result.results ?? [];
  }

  const result = await db
    .prepare(
      `SELECT * FROM sim_reservations
       WHERE status != 'cancelled'
         AND (
           desired_date < ?
           OR (desired_date = ? AND created_at < ?)
           OR (desired_date = ? AND created_at = ? AND id < ?)
         )
       ORDER BY desired_date DESC, created_at DESC, id DESC
       LIMIT ?`
    )
    .bind(
      cursor.desired_date,
      cursor.desired_date,
      cursor.created_at,
      cursor.desired_date,
      cursor.created_at,
      cursor.id,
      limit
    )
    .all<Reservation>();
  return result.results ?? [];
}

/** Fetches a single reservation by ID. */
export async function getReservationById(db: D1Database, id: string): Promise<Reservation | null> {
  return db.prepare('SELECT * FROM sim_reservations WHERE id = ?').bind(id).first<Reservation>();
}

/** Fetches all reservations ordered by date. */
export async function getAllReservations(db: D1Database): Promise<Reservation[]> {
  const result = await db
    .prepare(`SELECT * FROM sim_reservations ORDER BY desired_date DESC, created_at DESC`)
    .all<Reservation>();
  return result.results ?? [];
}

/** Inserts a new reservation. */
export async function createReservation(db: D1Database, data: Reservation): Promise<void> {
  await db
    .prepare(
      `INSERT INTO sim_reservations (
        id, grade, homeroom, student_number, student_name, title,
        purpose, purpose_other, summary, sim_notes, sim_scale, simulator_id, desired_date,
        stl_r2_key, stl_filename, stl_size_bytes, status,
        request_result_video, result_video_storage_path, result_video_filename, result_video_size_bytes,
        user_id, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      data.id,
      data.grade,
      data.homeroom,
      data.student_number,
      data.student_name,
      data.title,
      data.purpose,
      data.purpose_other,
      data.summary ?? '',
      data.sim_notes ?? '',
      data.sim_scale,
      data.simulator_id,
      data.desired_date,
      data.stl_r2_key,
      data.stl_filename,
      data.stl_size_bytes,
      data.status,
      data.request_result_video ? 1 : 0,
      data.result_video_storage_path ?? null,
      data.result_video_filename ?? null,
      data.result_video_size_bytes ?? null,
      data.user_id,
      data.created_at
    )
    .run();
}

/** Updates reservation content and resets to applied (pending re-approval). */
export async function updateReservationContent(
  db: D1Database,
  id: string,
  data: {
    grade: number;
    homeroom: string;
    student_number: number;
    student_name: string;
    title: string;
    purpose: Reservation['purpose'];
    purpose_other: string | null;
    summary: string | null;
    sim_notes: string | null;
    sim_scale: SimScale;
    simulator_id: string | null;
    desired_date: string;
    request_result_video: boolean;
    stl_r2_key: string;
    stl_filename: string;
    stl_size_bytes: number;
  }
): Promise<void> {
  await db
    .prepare(
      `UPDATE sim_reservations SET
        grade = ?, homeroom = ?, student_number = ?, student_name = ?,
        title = ?, purpose = ?, purpose_other = ?, summary = ?, sim_notes = ?,
        sim_scale = ?, simulator_id = ?, desired_date = ?,
        request_result_video = ?,
        stl_r2_key = ?, stl_filename = ?, stl_size_bytes = ?,
        status = 'applied', sim_staff_member_id = NULL, google_event_id = NULL,
        status_comment = NULL
       WHERE id = ?`
    )
    .bind(
      data.grade,
      data.homeroom,
      data.student_number,
      data.student_name,
      data.title,
      data.purpose,
      data.purpose_other,
      data.summary ?? '',
      data.sim_notes ?? '',
      data.sim_scale,
      data.simulator_id,
      data.desired_date,
      data.request_result_video ? 1 : 0,
      data.stl_r2_key,
      data.stl_filename,
      data.stl_size_bytes,
      id
    )
    .run();
}

/** 結果動画のメタデータを更新 */
export async function updateReservationPrintVideo(
  db: D1Database,
  id: string,
  data: {
    result_video_storage_path: string;
    result_video_filename: string;
    result_video_size_bytes: number;
  }
): Promise<void> {
  await db
    .prepare(
      `UPDATE sim_reservations SET
        result_video_storage_path = ?,
        result_video_filename = ?,
        result_video_size_bytes = ?
       WHERE id = ?`
    )
    .bind(
      data.result_video_storage_path,
      data.result_video_filename,
      data.result_video_size_bytes,
      id
    )
    .run();
}

/** 結果動画のメタデータをクリア */
export async function clearReservationPrintVideo(db: D1Database, id: string): Promise<void> {
  await db
    .prepare(
      `UPDATE sim_reservations SET
        result_video_storage_path = NULL,
        result_video_filename = NULL,
        result_video_size_bytes = NULL
       WHERE id = ?`
    )
    .bind(id)
    .run();
}

/** ユーザーのダウンロード可能な結果動画一覧 */
export async function getUserPrintVideos(
  db: D1Database,
  userId: string
): Promise<Reservation[]> {
  const result = await db
    .prepare(
      `SELECT * FROM sim_reservations
       WHERE user_id = ?
         AND status != 'cancelled'
         AND result_video_storage_path IS NOT NULL
       ORDER BY desired_date DESC, created_at DESC`
    )
    .bind(userId)
    .all<Reservation>();
  return result.results ?? [];
}

/** Updates admin fields on a reservation. */
export async function updateReservationAdmin(
  db: D1Database,
  id: string,
  fields: {
    sim_staff_member_id?: string | null;
    status?: string;
    status_comment?: string | null;
  }
): Promise<void> {
  const sets: string[] = [];
  const values: unknown[] = [];

  if (fields.sim_staff_member_id !== undefined) {
    sets.push('sim_staff_member_id = ?');
    values.push(fields.sim_staff_member_id);
  }
  if (fields.status !== undefined) {
    sets.push('status = ?');
    values.push(fields.status);
  }
  if (fields.status_comment !== undefined) {
    sets.push('status_comment = ?');
    values.push(fields.status_comment);
  }

  if (sets.length === 0) return;

  values.push(id);
  await db.prepare(`UPDATE sim_reservations SET ${sets.join(', ')} WHERE id = ?`).bind(...values)    .run();
}

/** Stores the Google Calendar event ID for a reservation. */
export async function setGoogleEventId(
  db: D1Database,
  id: string,
  googleEventId: string | null
): Promise<void> {
  await db
    .prepare('UPDATE sim_reservations SET google_event_id = ? WHERE id = ?')
    .bind(googleEventId, id)
    .run();
}

/** Accepts an application and assigns print staff. */
export async function acceptReservation(
  db: D1Database,
  id: string,
  printStaffMemberId: string
): Promise<boolean> {
  const result = await db
    .prepare(
      `UPDATE sim_reservations SET status = 'accepted', sim_staff_member_id = ?
       WHERE id = ? AND status = 'applied'`
    )
    .bind(printStaffMemberId, id)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

/** Fetches all members ordered by homeroom and student number. */
export async function getAllMembers(db: D1Database): Promise<Member[]> {
  const result = await db
    .prepare(`SELECT * FROM sim_members ORDER BY homeroom, student_number`)
    .all<Member>();
  return result.results ?? [];
}

/** Fetches a member by ID. */
export async function getMemberById(db: D1Database, id: string): Promise<Member | null> {
  return db.prepare('SELECT * FROM sim_members WHERE id = ?').bind(id).first<Member>();
}

/** Inserts a new member. */
export async function createMember(db: D1Database, data: Member): Promise<void> {
  await db
    .prepare(
      `INSERT INTO sim_members (id, homeroom, student_number, name, color_index, discord_user_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      data.id,
      data.homeroom,
      data.student_number,
      data.name,
      data.color_index ?? 0,
      data.discord_user_id ?? null,
      data.created_at
    )
    .run();
}

/** Updates a member's Discord user ID. */
export async function updateMemberDiscordUserId(
  db: D1Database,
  id: string,
  discordUserId: string | null
): Promise<void> {
  await db
    .prepare('UPDATE sim_members SET discord_user_id = ? WHERE id = ?')
    .bind(discordUserId, id)
    .run();
}

/** Updates a member's shift color index. */
export async function updateMemberColor(db: D1Database, id: string, colorIndex: number): Promise<void> {
  await db.prepare('UPDATE sim_members SET color_index = ? WHERE id = ?').bind(colorIndex, id).run();
}

/** Deletes a member by ID. */
export async function deleteMember(db: D1Database, id: string): Promise<boolean> {
  await db
    .prepare('UPDATE sim_reservations SET sim_staff_member_id = NULL WHERE sim_staff_member_id = ?')
    .bind(id)
    .run();
  await db.prepare('DELETE FROM sim_member_availability WHERE member_id = ?').bind(id).run();
  const result = await db.prepare('DELETE FROM sim_members WHERE id = ?').bind(id).run();
  return (result.meta.changes ?? 0) > 0;
}

/** Fetches availability rows within a date range. */
export async function getAvailabilityInRange(
  db: D1Database,
  startDate: string,
  endDate: string
): Promise<MemberAvailability[]> {
  const result = await db
    .prepare(
      `SELECT member_id, date FROM sim_member_availability
       WHERE date >= ? AND date <= ?
       ORDER BY date, member_id`
    )
    .bind(startDate, endDate)
    .all<MemberAvailability>();
  return result.results ?? [];
}

/** Returns member IDs available on a given date. */
export async function getAvailableMemberIdsOnDate(db: D1Database, date: string): Promise<string[]> {
  const result = await db
    .prepare(`SELECT member_id FROM sim_member_availability WHERE date = ?`)
    .bind(date)
    .all<{ member_id: string }>();
  return (result.results ?? []).map((r) => r.member_id);
}

/** Checks if at least one member is available on a date. */
export async function hasStaffOnDate(db: D1Database, date: string): Promise<boolean> {
  const row = await db
    .prepare(`SELECT 1 AS ok FROM sim_member_availability WHERE date = ? LIMIT 1`)
    .bind(date)
    .first<{ ok: number }>();
  return !!row;
}

/** Returns dates in range that have at least one available member. */
export async function getDatesWithStaffInRange(
  db: D1Database,
  startDate: string,
  endDate: string
): Promise<string[]> {
  const result = await db
    .prepare(
      `SELECT DISTINCT date FROM sim_member_availability
       WHERE date >= ? AND date <= ?
       ORDER BY date`
    )
    .bind(startDate, endDate)
    .all<{ date: string }>();
  return (result.results ?? []).map((r) => r.date);
}

/** Sets availability for a member on multiple dates. */
export async function setMemberAvailability(
  db: D1Database,
  memberId: string,
  dates: string[],
  available: boolean
): Promise<void> {
  if (!dates.length) return;

  if (available) {
    const stmt = db.prepare(
      `INSERT OR IGNORE INTO sim_member_availability (member_id, date) VALUES (?, ?)`
    );
    const batch = dates.map((date) => stmt.bind(memberId, date));
    await db.batch(batch);
    return;
  }

  const placeholders = dates.map(() => '?').join(', ');
  await db
    .prepare(
      `DELETE FROM sim_member_availability WHERE member_id = ? AND date IN (${placeholders})`
    )
    .bind(memberId, ...dates)
    .run();
}

/** Toggles availability for one member on one date. Returns new state. */
export async function toggleMemberAvailability(
  db: D1Database,
  memberId: string,
  date: string
): Promise<boolean> {
  const existing = await db
    .prepare(`SELECT 1 AS ok FROM sim_member_availability WHERE member_id = ? AND date = ?`)
    .bind(memberId, date)
    .first<{ ok: number }>();

  if (existing) {
    await db
      .prepare(`DELETE FROM sim_member_availability WHERE member_id = ? AND date = ?`)
      .bind(memberId, date)
      .run();
    return false;
  }

  await db
    .prepare(`INSERT INTO sim_member_availability (member_id, date) VALUES (?, ?)`)
    .bind(memberId, date)
    .run();
  return true;
}

/** Updates a reservation's desired date. */
export async function updateReservationDesiredDate(
  db: D1Database,
  id: string,
  desiredDate: string
): Promise<void> {
  await db
    .prepare('UPDATE sim_reservations SET desired_date = ? WHERE id = ?')
    .bind(desiredDate, id)
    .run();
}

/** Fetches today's assigned reservations for daily staff notifications. */
export async function getAssignedReservationsByDate(
  db: D1Database,
  date: string
): Promise<Reservation[]> {
  const result = await db
    .prepare(
      `SELECT * FROM sim_reservations
       WHERE desired_date = ?
         AND status IN ('accepted', 'running')
         AND sim_staff_member_id IS NOT NULL
       ORDER BY created_at`
    )
    .bind(date)
    .all<Reservation>();
  return result.results ?? [];
}

/** Deletes a reservation by ID. */
export async function deleteReservation(db: D1Database, id: string): Promise<boolean> {
  const result = await db.prepare('DELETE FROM sim_reservations WHERE id = ?').bind(id).run();
  return (result.meta.changes ?? 0) > 0;
}

/** Fetches reservations for a specific date (including all statuses for admin). */
export async function getReservationsByDateAdmin(db: D1Database, date: string): Promise<Reservation[]> {
  const result = await db
    .prepare(`SELECT * FROM sim_reservations WHERE desired_date = ? AND status != 'cancelled' ORDER BY created_at`)
    .bind(date)
    .all<Reservation>();
  return result.results ?? [];
}

/** Fetches upcoming reservations for a user (today and later). */
export async function getUserUpcomingReservations(
  db: D1Database,
  userId: string,
  today: string
): Promise<Reservation[]> {
  const result = await db
    .prepare(
      `SELECT * FROM sim_reservations
       WHERE user_id = ? AND desired_date >= ? AND status != 'cancelled'
       ORDER BY desired_date ASC, created_at ASC`
    )
    .bind(userId, today)
    .all<Reservation>();
  return result.results ?? [];
}

/** Fetches recent past reservations for a user within a date range. */
export async function getUserRecentPastReservations(
  db: D1Database,
  userId: string,
  startDate: string,
  beforeDate: string
): Promise<Reservation[]> {
  const result = await db
    .prepare(
      `SELECT * FROM sim_reservations
       WHERE user_id = ? AND desired_date >= ? AND desired_date < ? AND status != 'cancelled'
       ORDER BY desired_date DESC, created_at DESC`
    )
    .bind(userId, startDate, beforeDate)
    .all<Reservation>();
  return result.results ?? [];
}

/** Returns whether a user has reservations before a date boundary. */
export async function hasUserReservationsBeforeDate(
  db: D1Database,
  userId: string,
  beforeDate: string
): Promise<boolean> {
  const row = await db
    .prepare(
      `SELECT 1 AS ok FROM sim_reservations
       WHERE user_id = ? AND desired_date < ? AND status != 'cancelled'
       LIMIT 1`
    )
    .bind(userId, beforeDate)
    .first<{ ok: number }>();
  return !!row;
}

/** Fetches a page of older reservations for a user. */
export async function getUserOlderReservations(
  db: D1Database,
  userId: string,
  beforeExclusiveDate: string,
  limit: number,
  cursor?: ReservationListCursor | null
): Promise<Reservation[]> {
  if (!cursor) {
    const result = await db
      .prepare(
        `SELECT * FROM sim_reservations
         WHERE user_id = ? AND desired_date < ? AND status != 'cancelled'
         ORDER BY desired_date DESC, created_at DESC, id DESC
         LIMIT ?`
      )
      .bind(userId, beforeExclusiveDate, limit)
      .all<Reservation>();
    return result.results ?? [];
  }

  const result = await db
    .prepare(
      `SELECT * FROM sim_reservations
       WHERE user_id = ? AND status != 'cancelled'
         AND (
           desired_date < ?
           OR (desired_date = ? AND created_at < ?)
           OR (desired_date = ? AND created_at = ? AND id < ?)
         )
       ORDER BY desired_date DESC, created_at DESC, id DESC
       LIMIT ?`
    )
    .bind(
      userId,
      cursor.desired_date,
      cursor.desired_date,
      cursor.created_at,
      cursor.desired_date,
      cursor.created_at,
      cursor.id,
      limit
    )
    .all<Reservation>();
  return result.results ?? [];
}

/** Fetches an upload session by ID. */
export async function getUploadSession(db: D1Database, id: string): Promise<UploadSession | null> {
  return db.prepare('SELECT * FROM sim_upload_sessions WHERE id = ?').bind(id).first<UploadSession>();
}

/** Creates a new upload session record. */
export async function createUploadSession(db: D1Database, session: UploadSession): Promise<void> {
  await db
    .prepare(
      `INSERT INTO sim_upload_sessions (id, upload_id, r2_key, filename, total_size, part_size, parts_json, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      session.id,
      session.upload_id,
      session.r2_key,
      session.filename,
      session.total_size,
      session.part_size,
      session.parts_json,
      session.status,
      session.created_at
    )
    .run();
}

/** Updates parts_json and status on an upload session. */
export async function updateUploadSession(
  db: D1Database,
  id: string,
  partsJson: string,
  status: string
): Promise<void> {
  await db
    .prepare('UPDATE sim_upload_sessions SET parts_json = ?, status = ? WHERE id = ?')
    .bind(partsJson, status, id)
    .run();
}
