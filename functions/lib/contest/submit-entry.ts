// functions/lib/contest/submit-entry.ts
import { findAutoScheduleSlot } from './auto-schedule';
import {
  contestApplicationStlFileLimit,
  fetchLatestContestReservationForApplication,
  getContestApplicationForSubmit,
  updateContestApplicationSelfPrintStl,
  updateContestApplicationContestStorage,
  getContestApplicationForUser,
} from './applications';
import type { ContestApplication } from './applications';
import {
  buildContestEntryAppUrl,
  buildContestManagementAdminUrl,
  notifyContestApplicantEmail,
} from './contest-email';
import {
  syncContestSelfPrintSubmissionToStorage,
  syncContestSubmissionToStorage,
} from './contest-storage';
import { gradeFromHomeroom } from '../3dprint/homeroom';
import { syncReservationSpanFields } from '../3dprint/calendar-span';
import {
  createReservation,
  getActiveContestReservationForApplication,
  getReservationById,
  updateReservationStlOnly,
  type Reservation,
} from '../3dprint/reservations';
import { getPrinterById } from '../3dprint/printers';
import { verifyR2Key } from '../3dprint/upload';
import { getOAuthRedirectBase } from '../oauth';
import { notifyReservationApplication } from '../3dprint/discord';
import { logContestStlSubmission } from './stl-submission-logs';
import type { Env } from '../types';
import { replaceContestApplicationStlParts } from './contest-stl-parts';

export interface SubmitContestStlFile {
  stl_r2_key: string;
  stl_filename: string;
  stl_size_bytes: number;
}

export interface SubmitContestEntryInput {
  contest_application_id: string;
  stl_r2_key?: string;
  stl_filename?: string;
  stl_size_bytes?: number;
  stl_files?: SubmitContestStlFile[];
  print_notes?: string | null;
}

const MAX_TEXT_FIELD_LEN = 8000;

function normalizeOptionalText(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export interface SubmitContestEntryResult {
  self_print: boolean;
  reservation: Reservation | null;
  application: ContestApplication | null;
  calendar: { ok: boolean; error?: string };
}

function resolveSubmitStlFiles(input: SubmitContestEntryInput): SubmitContestStlFile[] {
  if (Array.isArray(input.stl_files) && input.stl_files.length > 0) {
    return input.stl_files.map((file, index) => {
      const key = String(file.stl_r2_key ?? '').trim();
      const filename = String(file.stl_filename ?? '').trim();
      const size = Number(file.stl_size_bytes);
      if (!key || !filename || !Number.isFinite(size) || size < 1) {
        throw new Error(`ファイル${index + 1}の情報が不正です`);
      }
      return { stl_r2_key: key, stl_filename: filename, stl_size_bytes: size };
    });
  }

  const key = String(input.stl_r2_key ?? '').trim();
  const filename = String(input.stl_filename ?? '').trim();
  const size = Number(input.stl_size_bytes);
  if (!key || !filename || !Number.isFinite(size) || size < 1) {
    throw new Error('ファイルを指定してください');
  }
  return [{ stl_r2_key: key, stl_filename: filename, stl_size_bytes: size }];
}

async function verifySubmitStlFiles(
  env: Env,
  files: SubmitContestStlFile[]
): Promise<void> {
  for (let i = 0; i < files.length; i += 1) {
    const keyExists = await verifyR2Key(env.FILES, files[i].stl_r2_key);
    if (!keyExists) {
      throw new Error(
        `ファイル${files.length > 1 ? i + 1 : ''}が見つかりません。再度アップロードしてください`
      );
    }
  }
}

async function submitContestSelfPrintEntry(
  env: Env,
  db: D1Database,
  application: ContestApplication,
  files: SubmitContestStlFile[],
  printNotes: string | null
): Promise<SubmitContestEntryResult> {
  if (!application.self_print) {
    throw new Error('この作品は学校プリンターでの印刷申込です');
  }
  if (application.stl_submitted_at) {
    throw new Error('この作品はすでに STL を提出済みです');
  }

  const [first, ...rest] = files;

  let updated = await updateContestApplicationSelfPrintStl(db, application.id, {
    stl_r2_key: first.stl_r2_key,
    stl_filename: first.stl_filename,
    stl_size_bytes: first.stl_size_bytes,
    stl_print_notes: printNotes,
  });

  if (rest.length > 0) {
    await replaceContestApplicationStlParts(
      db,
      application.id,
      rest.map((file, index) => ({
        part_index: index + 2,
        stl_r2_key: file.stl_r2_key,
        stl_filename: file.stl_filename,
        stl_size_bytes: file.stl_size_bytes,
      }))
    );
  }

  try {
    const synced = await syncContestSelfPrintSubmissionToStorage(env, db, {
      id: updated.id,
      user_id: updated.user_id,
      homeroom: updated.homeroom,
      student_number: updated.student_number,
      student_name: updated.student_name,
      title: updated.title,
      stl_filename: updated.stl_filename ?? first.stl_filename,
      stl_r2_key: updated.stl_r2_key ?? first.stl_r2_key,
      stl_submitted_at: updated.stl_submitted_at ?? new Date().toISOString(),
      contest_storage_path: updated.contest_storage_path,
      contest_storage_filename: updated.contest_storage_filename,
    });
    if (synced) {
      await updateContestApplicationContestStorage(db, application.id, {
        contest_storage_path: synced.path,
        contest_storage_filename: synced.filename,
      });
      updated = (await getContestApplicationForUser(db, application.user_id, application.id))!;
    }

    for (let i = 0; i < rest.length; i += 1) {
      const file = rest[i];
      const partIndex = i + 2;
      await syncContestSelfPrintSubmissionToStorage(env, db, {
        id: updated.id,
        user_id: updated.user_id,
        homeroom: updated.homeroom,
        student_number: updated.student_number,
        student_name: updated.student_name,
        title: `${updated.title} パーツ${partIndex}`,
        stl_filename: file.stl_filename,
        stl_r2_key: file.stl_r2_key,
        stl_submitted_at: updated.stl_submitted_at ?? new Date().toISOString(),
        contest_storage_path: null,
        contest_storage_filename: null,
      });
    }
  } catch (err) {
    console.error('contest self-print storage sync failed:', err);
  }

  await logContestStlSubmission(db, {
    contest_application_id: application.id,
    print_reservation_id: null,
    stl_r2_key: updated.stl_r2_key ?? first.stl_r2_key,
    stl_filename: updated.stl_filename ?? first.stl_filename,
    stl_size_bytes: updated.stl_size_bytes ?? first.stl_size_bytes,
    uploaded_by_user_id: application.user_id,
    uploader_role: 'user',
    uploaded_at: updated.stl_submitted_at ?? undefined,
  });

  return {
    self_print: true,
    reservation: null,
    application: updated,
    calendar: { ok: false, error: '自己印刷のため印刷予定はありません' },
  };
}

/** Creates an auto-scheduled print request or self-print STL record linked to a participation application. */
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

  const files = resolveSubmitStlFiles(input);
  const expectedCount = contestApplicationStlFileLimit(application);
  if (files.length !== expectedCount) {
    if (expectedCount === 1) {
      throw new Error('STL ファイルは1件だけ提出できます');
    }
    throw new Error(`STL ファイルは${expectedCount}件提出してください（現在${files.length}件）`);
  }

  await verifySubmitStlFiles(env, files);

  const printNotes = normalizeOptionalText(input.print_notes);
  if (printNotes && printNotes.length > MAX_TEXT_FIELD_LEN) {
    throw new Error('印刷時の注意点が長すぎます');
  }

  if (application.self_print) {
    return submitContestSelfPrintEntry(env, db, application, files, printNotes);
  }

  const active = await getActiveContestReservationForApplication(db, applicationId);
  if (active) {
    if (active.status !== 'printing') {
      throw new Error('この作品はすでに印刷依頼が進行中です');
    }
    if (files.length !== 1) {
      throw new Error('印刷中の再提出は1件の STL のみ対応しています');
    }
    const resubmitFile = files[0];
    if (active.stl_r2_key !== resubmitFile.stl_r2_key) {
      try {
        await env.FILES.delete(active.stl_r2_key);
      } catch (err) {
        console.error('contest re-submit: failed to delete previous stl', err);
      }
    }
    await updateReservationStlOnly(db, active.id, {
      stl_r2_key: resubmitFile.stl_r2_key,
      stl_filename: resubmitFile.stl_filename,
      stl_size_bytes: resubmitFile.stl_size_bytes,
      print_notes: printNotes,
    });
    let reservation = (await getReservationById(db, active.id))!;
    try {
      const synced = await syncContestSubmissionToStorage(env, db, reservation);
      if (synced) {
        reservation = {
          ...reservation,
          contest_storage_path: synced.path,
          contest_storage_filename: synced.filename,
        };
      }
    } catch (err) {
      console.error('contest storage sync failed on re-submit:', err);
    }
    await logContestStlSubmission(db, {
      contest_application_id: application.id,
      print_reservation_id: reservation.id,
      stl_r2_key: reservation.stl_r2_key,
      stl_filename: reservation.stl_filename,
      stl_size_bytes: reservation.stl_size_bytes,
      uploaded_by_user_id: userId,
      uploader_role: 'user',
    });
    return {
      self_print: false,
      reservation,
      application: null,
      calendar: { ok: false, error: '印刷中のためカレンダーは変更されません' },
    };
  }

  const latestReservation = await fetchLatestContestReservationForApplication(
    db,
    applicationId
  );
  if (latestReservation?.status === 'delivered') {
    throw new Error('印刷が完了しているため、新たに STL を提出できません');
  }

  const grade =
    application.schedule_type === 'full_time'
      ? gradeFromHomeroom(application.homeroom)
      : 0;

  const partCount = files.length;
  const slot = await findAutoScheduleSlot(db, partCount);
  if (!slot) {
    throw new Error(
      '現在、自動で割り当てられる印刷日がありません。しばらくしてから再度お試しください'
    );
  }

  const span = syncReservationSpanFields(slot.desired_date, partCount);
  const [firstFile, ...restFiles] = files;

  const submittedAt = new Date().toISOString();
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
    print_scale: span.print_scale,
    printer_id: slot.printer_id,
    desired_date: slot.desired_date,
    part_count: span.part_count,
    calendar_end_date: span.calendar_end_date,
    stl_r2_key: firstFile.stl_r2_key,
    stl_filename: firstFile.stl_filename,
    stl_size_bytes: firstFile.stl_size_bytes,
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
    created_at: submittedAt,
  };

  await createReservation(db, reservation);

  if (restFiles.length > 0) {
    await replaceContestApplicationStlParts(
      db,
      application.id,
      restFiles.map((file, index) => ({
        part_index: index + 2,
        stl_r2_key: file.stl_r2_key,
        stl_filename: file.stl_filename,
        stl_size_bytes: file.stl_size_bytes,
      }))
    );
  }

  try {
    const synced = await syncContestSubmissionToStorage(env, db, reservation);
    if (synced) {
      reservation.contest_storage_path = synced.path;
      reservation.contest_storage_filename = synced.filename;
    }
  } catch (err) {
    console.error('contest storage sync failed on submit:', err);
  }

  await logContestStlSubmission(db, {
    contest_application_id: application.id,
    print_reservation_id: reservation.id,
    stl_r2_key: reservation.stl_r2_key,
    stl_filename: reservation.stl_filename,
    stl_size_bytes: reservation.stl_size_bytes,
    uploaded_by_user_id: userId,
    uploader_role: 'user',
    uploaded_at: submittedAt,
  });

  const printerId = reservation.printer_id;
  const printer = printerId ? await getPrinterById(db, printerId) : null;

  const baseUrl = getOAuthRedirectBase(request, env);
  const adminUrl = buildContestManagementAdminUrl(baseUrl);
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
    self_print: false,
    reservation,
    application: null,
    calendar: { ok: false, error: '担当者承認後にカレンダーへ反映されます' },
  };
}
