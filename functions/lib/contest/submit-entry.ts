// functions/lib/contest/submit-entry.ts
import { findAutoScheduleSlot } from './auto-schedule';
import { getContestApplicationForSubmit } from './applications';
import {
  buildContestEntryAppUrl,
  notifyContestApplicantEmail,
} from './contest-email';
import { syncContestSubmissionToStorage } from './contest-storage';
import { gradeFromHomeroom } from '../3dprint/homeroom';
import {
  createReservation,
  getActiveContestReservationForApplication,
  type Reservation,
} from '../3dprint/reservations';
import { getPrinterById } from '../3dprint/printers';
import { verifyR2Key } from '../3dprint/upload';
import { getOAuthRedirectBase } from '../oauth';
import { build3dPrintAdminUrl, notifyReservationApplication } from '../3dprint/discord';
import type { Env } from '../types';

export interface SubmitContestEntryInput {
  contest_application_id: string;
  stl_r2_key: string;
  stl_filename: string;
  stl_size_bytes: number;
  print_notes?: string | null;
}

const MAX_TEXT_FIELD_LEN = 8000;

function normalizeOptionalText(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export interface SubmitContestEntryResult {
  reservation: Reservation;
  calendar: { ok: boolean; error?: string };
}

/** Creates an auto-scheduled print request linked to an approved participation application. */
export async function submitContestEntry(
  env: Env,
  request: Request,
  userId: string,
  input: SubmitContestEntryInput
): Promise<SubmitContestEntryResult> {
  const db = env.DB;

  const applicationId = input.contest_application_id?.trim();
  if (!applicationId) {
    throw new Error('参加申請を選択してください');
  }

  const application = await getContestApplicationForSubmit(db, userId, applicationId);
  if (!application) {
    throw new Error('参加申請が見つからないか、提出できない状態です');
  }

  const active = await getActiveContestReservationForApplication(db, applicationId);
  if (active) {
    throw new Error('この作品はすでに印刷依頼が進行中です');
  }

  const keyExists = await verifyR2Key(env.FILES, input.stl_r2_key);
  if (!keyExists) throw new Error('ファイルが見つかりません。再度アップロードしてください');

  const printNotes = normalizeOptionalText(input.print_notes);
  if (printNotes && printNotes.length > MAX_TEXT_FIELD_LEN) {
    throw new Error('印刷時の注意点が長すぎます');
  }

  const slot = await findAutoScheduleSlot(db);
  if (!slot) {
    throw new Error('現在、自動で割り当てられる印刷日がありません。しばらくしてから再度お試しください');
  }

  const grade =
    application.schedule_type === 'full_time'
      ? gradeFromHomeroom(application.homeroom)
      : 0;

  const reservation: Reservation = {
    id: crypto.randomUUID(),
    grade,
    homeroom: application.homeroom,
    student_number: application.student_number,
    student_name: application.student_name,
    title: application.title,
    purpose: 'other',
    purpose_other: '印刷依頼',
    summary: application.impressions,
    print_notes: printNotes,
    print_scale: 'small',
    printer_id: slot.printer_id,
    desired_date: slot.desired_date,
    stl_r2_key: input.stl_r2_key,
    stl_filename: input.stl_filename,
    stl_size_bytes: input.stl_size_bytes,
    status: 'applied',
    status_comment: null,
    print_staff: null,
    print_staff_member_id: null,
    delivery_staff: null,
    google_event_id: null,
    request_print_video: 0,
    print_video_storage_path: null,
    print_video_filename: null,
    print_video_size_bytes: null,
    user_id: userId,
    source: 'contest',
    schedule_type: application.schedule_type,
    contest_storage_path: null,
    contest_storage_filename: null,
    contest_application_id: application.id,
    created_at: new Date().toISOString(),
  };

  await createReservation(db, reservation);

  try {
    const synced = await syncContestSubmissionToStorage(env, db, reservation);
    if (synced) {
      reservation.contest_storage_path = synced.path;
      reservation.contest_storage_filename = synced.filename;
    }
  } catch (err) {
    console.error('contest storage sync failed on submit:', err);
  }

  const printer = await getPrinterById(db, slot.printer_id);

  const baseUrl = getOAuthRedirectBase(request, env);
  const adminUrl = build3dPrintAdminUrl(baseUrl);
  await notifyReservationApplication(env.DISCORD_WEBHOOK_URL, adminUrl, {
    title: reservation.title,
    desired_date: reservation.desired_date,
    print_scale: reservation.print_scale,
  });

  const entryUrl = buildContestEntryAppUrl(baseUrl);
  await notifyContestApplicantEmail(env, db, userId, 'submitted', {
    reservation,
    printerName: printer?.name ?? null,
    entryAppUrl: entryUrl,
  });

  return {
    reservation,
    calendar: { ok: false, error: '担当者承認後にカレンダーへ反映されます' },
  };
}
