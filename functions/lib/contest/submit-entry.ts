// functions/lib/contest/submit-entry.ts
import { findAutoScheduleSlot } from './auto-schedule';
import {
  buildContestEntryAppUrl,
  notifyContestApplicantEmail,
} from './contest-email';
import { build3dPrintAdminUrl, notifyReservationApplication } from '../3dprint/discord';
import {
  createCalendarEventForReservation,
} from '../3dprint/google-calendar';
import { gradeFromHomeroom, isValidHomeroom } from '../3dprint/homeroom';
import {
  createReservation,
  formatMemberLabel,
  getAllMembers,
  getMemberById,
  setGoogleEventId,
  type Reservation,
} from '../3dprint/reservations';
import { getPrinterById } from '../3dprint/printers';
import { verifyR2Key } from '../3dprint/upload';
import { getOAuthRedirectBase } from '../oauth';
import type { Env } from '../types';

export type ContestScheduleType = 'full_time' | 'part_time';

export interface SubmitContestEntryInput {
  schedule_type: ContestScheduleType;
  homeroom: string;
  student_number: number;
  student_name: string;
  stl_r2_key: string;
  stl_filename: string;
  stl_size_bytes: number;
}

export interface SubmitContestEntryResult {
  reservation: Reservation;
  calendar: { ok: boolean; error?: string };
}

function titleFromFilename(filename: string): string {
  const base = filename.replace(/^.*[/\\]/, '').trim();
  const dot = base.lastIndexOf('.');
  return (dot > 0 ? base.slice(0, dot) : base).slice(0, 40) || '造形物';
}

function validateClass(scheduleType: ContestScheduleType, homeroom: string): string | null {
  const trimmed = homeroom.trim();
  if (!trimmed) return 'クラスを入力してください';
  if (scheduleType === 'full_time') {
    if (!isValidHomeroom(trimmed)) return 'ホームルームの形式が不正です（例: 301）';
    return null;
  }
  if (trimmed.length > 20) return 'クラスは20文字以内で入力してください';
  return null;
}

/** Creates an auto-scheduled, auto-accepted contest reservation. */
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

  const studentName = input.student_name.trim();
  if (!studentName) throw new Error('名前を入力してください');

  const keyExists = await verifyR2Key(env.FILES, input.stl_r2_key);
  if (!keyExists) throw new Error('ファイルが見つかりません。再度アップロードしてください');

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
    title: titleFromFilename(input.stl_filename),
    purpose: 'other',
    purpose_other: '造形物コンテスト',
    summary: null,
    print_notes: null,
    print_scale: 'small',
    printer_id: slot.printer_id,
    desired_date: slot.desired_date,
    stl_r2_key: input.stl_r2_key,
    stl_filename: input.stl_filename,
    stl_size_bytes: input.stl_size_bytes,
    status: 'accepted',
    status_comment: null,
    print_staff: null,
    print_staff_member_id: slot.print_staff_member_id,
    delivery_staff: null,
    google_event_id: null,
    request_print_video: 0,
    print_video_storage_path: null,
    print_video_filename: null,
    print_video_size_bytes: null,
    user_id: userId,
    source: 'contest',
    schedule_type: input.schedule_type,
    created_at: new Date().toISOString(),
  };

  await createReservation(db, reservation);

  const memberMap = new Map((await getAllMembers(db)).map((m) => [m.id, m]));
  const printer = await getPrinterById(db, slot.printer_id);
  const staffMember = await getMemberById(db, slot.print_staff_member_id);
  const staffLabel = staffMember ? formatMemberLabel(staffMember) : null;

  let calendar: { ok: boolean; error?: string } = { ok: false, error: 'カレンダー未連携' };
  const calendarResult = await createCalendarEventForReservation(env, reservation, memberMap);
  if (calendarResult.ok && calendarResult.eventId) {
    await setGoogleEventId(db, reservation.id, calendarResult.eventId);
    calendar = { ok: true };
  } else {
    calendar = {
      ok: false,
      error: calendarResult.error ?? 'カレンダーへの追加に失敗しました',
    };
  }

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
    printStaffLabel: staffLabel,
    entryAppUrl: entryUrl,
  });

  return { reservation, calendar };
}
