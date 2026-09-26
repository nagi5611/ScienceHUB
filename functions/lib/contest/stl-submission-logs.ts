// functions/lib/contest/stl-submission-logs.ts

export type ContestStlSubmissionKind = 'initial' | 'replacement';
export type ContestStlUploaderRole = 'user' | 'admin';

export interface ContestStlSubmissionLog {
  id: string;
  contest_application_id: string | null;
  print_reservation_id: string | null;
  sequence_number: number;
  submission_kind: ContestStlSubmissionKind;
  stl_r2_key: string;
  stl_filename: string;
  stl_size_bytes: number;
  uploaded_at: string;
  uploaded_by_user_id: string;
  uploader_role: ContestStlUploaderRole;
}

const LOG_SELECT = `id, contest_application_id, print_reservation_id, sequence_number, submission_kind,
  stl_r2_key, stl_filename, stl_size_bytes, uploaded_at, uploaded_by_user_id, uploader_role`;

export interface LogContestStlSubmissionInput {
  contest_application_id?: string | null;
  print_reservation_id?: string | null;
  stl_r2_key: string;
  stl_filename: string;
  stl_size_bytes: number;
  uploaded_by_user_id: string;
  uploader_role: ContestStlUploaderRole;
  uploaded_at?: string;
}

/** Appends an STL submission log entry for contest admin history. */
export async function logContestStlSubmission(
  db: D1Database,
  input: LogContestStlSubmissionInput
): Promise<ContestStlSubmissionLog> {
  const applicationId = input.contest_application_id?.trim() || null;
  const reservationId = input.print_reservation_id?.trim() || null;
  const uploadedAt = input.uploaded_at ?? new Date().toISOString();

  let sequenceNumber = 1;
  if (applicationId) {
    const row = await db
      .prepare(
        `SELECT COALESCE(MAX(sequence_number), 0) + 1 AS next_seq
         FROM contest_stl_submission_logs
         WHERE contest_application_id = ?`
      )
      .bind(applicationId)
      .first<{ next_seq: number }>();
    sequenceNumber = row?.next_seq ?? 1;
  } else if (reservationId) {
    const row = await db
      .prepare(
        `SELECT COALESCE(MAX(sequence_number), 0) + 1 AS next_seq
         FROM contest_stl_submission_logs
         WHERE contest_application_id IS NULL AND print_reservation_id = ?`
      )
      .bind(reservationId)
      .first<{ next_seq: number }>();
    sequenceNumber = row?.next_seq ?? 1;
  }

  const submissionKind: ContestStlSubmissionKind =
    sequenceNumber === 1 ? 'initial' : 'replacement';

  const entry: ContestStlSubmissionLog = {
    id: crypto.randomUUID(),
    contest_application_id: applicationId,
    print_reservation_id: reservationId,
    sequence_number: sequenceNumber,
    submission_kind: submissionKind,
    stl_r2_key: input.stl_r2_key,
    stl_filename: input.stl_filename,
    stl_size_bytes: input.stl_size_bytes,
    uploaded_at: uploadedAt,
    uploaded_by_user_id: input.uploaded_by_user_id,
    uploader_role: input.uploader_role,
  };

  await db
    .prepare(
      `INSERT INTO contest_stl_submission_logs (
        id, contest_application_id, print_reservation_id, sequence_number, submission_kind,
        stl_r2_key, stl_filename, stl_size_bytes, uploaded_at, uploaded_by_user_id, uploader_role
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      entry.id,
      entry.contest_application_id,
      entry.print_reservation_id,
      entry.sequence_number,
      entry.submission_kind,
      entry.stl_r2_key,
      entry.stl_filename,
      entry.stl_size_bytes,
      entry.uploaded_at,
      entry.uploaded_by_user_id,
      entry.uploader_role
    )
    .run();

  return entry;
}

/** Latest STL submission for an application (by sequence, then upload time). */
export async function getLatestContestStlSubmissionForApplication(
  db: D1Database,
  applicationId: string
): Promise<ContestStlSubmissionLog | null> {
  const row = await db
    .prepare(
      `SELECT ${LOG_SELECT}
       FROM contest_stl_submission_logs
       WHERE contest_application_id = ?
       ORDER BY sequence_number DESC, uploaded_at DESC
       LIMIT 1`
    )
    .bind(applicationId)
    .first<ContestStlSubmissionLog>();
  return row ?? null;
}

/** Lists STL submission logs for a participation application (oldest first). */
export async function listContestStlSubmissionLogsForApplication(
  db: D1Database,
  applicationId: string
): Promise<ContestStlSubmissionLog[]> {
  const result = await db
    .prepare(
      `SELECT ${LOG_SELECT}
       FROM contest_stl_submission_logs
       WHERE contest_application_id = ?
       ORDER BY sequence_number ASC, uploaded_at ASC`
    )
    .bind(applicationId)
    .all<ContestStlSubmissionLog>();
  return result.results ?? [];
}

/** Lists STL logs tied to a reservation (application-wide if linked, else reservation-only). */
export async function listContestStlSubmissionLogsForReservation(
  db: D1Database,
  reservation: { id: string; contest_application_id?: string | null }
): Promise<ContestStlSubmissionLog[]> {
  if (reservation.contest_application_id) {
    return listContestStlSubmissionLogsForApplication(db, reservation.contest_application_id);
  }
  const result = await db
    .prepare(
      `SELECT ${LOG_SELECT}
       FROM contest_stl_submission_logs
       WHERE print_reservation_id = ?
       ORDER BY sequence_number ASC, uploaded_at ASC`
    )
    .bind(reservation.id)
    .all<ContestStlSubmissionLog>();
  return result.results ?? [];
}

/** Public API shape for admin UI (no R2 key). */
export function formatContestStlSubmissionLogForAdmin(log: ContestStlSubmissionLog) {
  return {
    id: log.id,
    contest_application_id: log.contest_application_id,
    print_reservation_id: log.print_reservation_id,
    sequence_number: log.sequence_number,
    submission_kind: log.submission_kind,
    stl_filename: log.stl_filename,
    stl_size_bytes: log.stl_size_bytes,
    uploaded_at: log.uploaded_at,
    uploader_role: log.uploader_role,
  };
}
