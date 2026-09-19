// functions/lib/contest/submit-entry.ts
import { findAutoScheduleSlot } from './auto-schedule';
import {
  buildContestEntryAppUrl,
  notifyContestApplicantEmail,
} from './contest-email';
import { syncContestSubmissionToStorage } from './contest-storage';
import { build3dPrintAdminUrl, notifyReservationApplication } from '../3dprint/discord';
import { gradeFromHomeroom, isValidHomeroom } from '../3dprint/homeroom';
import {
  createReservation,
  type Reservation,
} from '../3dprint/reservations';
import { getPrinterById } from '../3dprint/printers';
import { verifyR2Key } from '../3dprint/upload';
import { getOAuthRedirectBase } from '../oauth';
import type { Env } from '../types';

export type ContestScheduleType = 'full_time' | 'part_time' | 'towa_branch';

export interface SubmitContestEntryInput {
  schedule_type: ContestScheduleType;
  homeroom: string;
  student_number: number;
  student_name: string;
  title: string;
  stl_r2_key: string;
  stl_filename: string;
  stl_size_bytes: number;
  summary?: string | null;
  print_notes?: string | null;
}

const MAX_TEXT_FIELD_LEN = 8000;

function normalizeOptionalText(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function resolveContestTitle(input: SubmitContestEntryInput): string {
  const title = normalizeOptionalText(input.title);
  if (!title) throw new Error('タイトルを入力してください');
  if (title.length > 40) throw new Error('タイトルは40文字以内で入力してください');
  return title;
}

export interface SubmitContestEntryResult {
  reservation: Reservation;
  calendar: { ok: boolean; error?: string };
}

function validateClass(scheduleType: ContestScheduleType, homeroom: string): string | null {
  const trimmed = homeroom.trim();
  if (!trimmed) return 'クラスを入力してください';
  if (scheduleType === 'full_time') {
    if (!isValidHomeroom(trimmed)) return 'ホームルームの形式が不正です（例: 301）';
    return null;
  }
  if (scheduleType === 'part_time' || scheduleType === 'towa_branch') {
    if (trimmed.length > 20) return 'クラスは20文字以内で入力してください';
    return null;
  }
  return '在籍区分が不正です';
}

/** Creates an auto-scheduled print request (applied — manager must accept). */
export async function submitContestEntry(
  env: Env,
  request: Request,
  userId: string,
  input: SubmitContestEntryInput
): Promise<SubmitContestEntryResult> {
  const db = env.DB;

  const classError = validateClass(input.schedule_type, input.homeroom);
  if (classError) throw new Error(classError);

  if (!Number.isInteger(input.student_number) || input.student_number < 1 || input.student_number > 50) {
    throw new Error('出席番号が不正です');
  }

  if (!['full_time', 'part_time', 'towa_branch'].includes(input.schedule_type)) {
    throw new Error('在籍区分が不正です');
  }

  const studentName = input.student_name.trim();
  if (!studentName) throw new Error('名前を入力してください');

  const keyExists = await verifyR2Key(env.FILES, input.stl_r2_key);
  if (!keyExists) throw new Error('ファイルが見つかりません。再度アップロードしてください');

  const summary = normalizeOptionalText(input.summary);
  const printNotes = normalizeOptionalText(input.print_notes);
  if (summary && summary.length > MAX_TEXT_FIELD_LEN) {
    throw new Error('概要が長すぎます');
  }
  if (printNotes && printNotes.length > MAX_TEXT_FIELD_LEN) {
    throw new Error('印刷時の注意点が長すぎます');
  }

  const slot = await findAutoScheduleSlot(db);
  if (!slot) {
    throw new Error('現在、自動で割り当てられる印刷日がありません。しばらくしてから再度お試しください');
  }

  const homeroom = input.homeroom.trim();
  const grade =
    input.schedule_type === 'full_time' ? gradeFromHomeroom(homeroom) : 0;

  const reservation: Reservation = {
    id: crypto.randomUUID(),
    grade,
    homeroom,
    student_number: input.student_number,
    student_name: studentName,
    title: resolveContestTitle(input),
    purpose: 'other',
    purpose_other: '印刷依頼',
    summary,
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
    schedule_type: input.schedule_type,
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
