// functions/api/lib/retry-reservation.ts
import {
  createReservation,
  getReservationById,
  type Reservation,
} from './reservations';
import { gradeFromHomeroom } from './homeroom';
import {
  validateGuestStaffAvailability,
  validateReservationContentFields,
  validateReservationSlot,
  type ReservationContentInput,
} from './reservation-edit';
import { isDateBookable } from './slots';
import { duplicatePrintFile, verifyR2Key } from './upload';

interface RetryReservationEnv {
  DB: D1Database;
  FILES: R2Bucket;
}

interface RetryReservationInput {
  homeroom: string;
  student_number: number;
  student_name: string;
  desired_date: string;
  title: string;
  purpose: Reservation['purpose'];
  purpose_other?: string | null;
  summary?: string | null;
  print_notes?: string | null;
  print_scale: Reservation['print_scale'];
  stl_r2_key?: string;
  stl_filename?: string;
  stl_size_bytes?: number;
}

/** Creates a new reservation from a failed one; the failed record stays in history. */
export async function retryFailedReservation(
  env: RetryReservationEnv,
  reservationId: string,
  body: RetryReservationInput,
  userId: string
): Promise<Reservation> {
  const failedReservation = await getReservationById(env.DB, reservationId);
  if (!failedReservation) {
    throw new Error('予約が見つかりません');
  }
  if (failedReservation.status !== 'failed') {
    throw new Error('印刷失敗の予約のみ再予約できます');
  }

  if (failedReservation.user_id !== userId) {
    throw new Error('この予約にアクセスする権限がありません');
  }

  const content: ReservationContentInput = {
    homeroom: String(body.homeroom),
    student_number: Number(body.student_number),
    student_name: String(body.student_name).trim(),
    title: body.title,
    purpose: body.purpose,
    purpose_other: body.purpose_other ?? null,
    summary: body.summary ?? null,
    print_notes: body.print_notes ?? null,
    print_scale: body.print_scale,
    desired_date: body.desired_date,
    stl_r2_key: body.stl_r2_key,
    stl_filename: body.stl_filename,
    stl_size_bytes: body.stl_size_bytes,
  };

  const validationError = validateReservationContentFields(content);
  if (validationError) {
    throw new Error(validationError);
  }

  if (!isDateBookable(body.desired_date)) {
    throw new Error('希望印刷日は予約可能な日付を選択してください');
  }

  const slotError = await validateReservationSlot(
    env.DB,
    body.desired_date,
    body.print_scale,
    failedReservation.id
  );
  if (slotError) {
    throw new Error(slotError);
  }

  const staffError = await validateGuestStaffAvailability(env.DB, body.desired_date);
  if (staffError) {
    throw new Error(staffError);
  }

  let stlR2Key: string;
  let stlFilename: string;
  let stlSizeBytes: number;

  if (body.stl_r2_key) {
    if (!body.stl_filename || body.stl_size_bytes === undefined) {
      throw new Error('ファイル情報が不完全です');
    }
    const keyExists = await verifyR2Key(env.FILES, body.stl_r2_key);
    if (!keyExists) {
      throw new Error('ファイルが見つかりません。再度アップロードしてください');
    }
    stlR2Key = body.stl_r2_key;
    stlFilename = body.stl_filename;
    stlSizeBytes = Number(body.stl_size_bytes);
  } else {
    const copied = await duplicatePrintFile(
      env.FILES,
      failedReservation.stl_r2_key,
      failedReservation.stl_filename
    );
    stlR2Key = copied.r2Key;
    stlFilename = copied.filename;
    stlSizeBytes = copied.size;
  }

  const newReservation: Reservation = {
    id: crypto.randomUUID(),
    grade: gradeFromHomeroom(String(body.homeroom)),
    homeroom: String(body.homeroom),
    student_number: Number(body.student_number),
    student_name: String(body.student_name).trim(),
    title: String(body.title).trim(),
    purpose: body.purpose,
    purpose_other: body.purpose === 'other' ? body.purpose_other?.trim() || null : null,
    summary: body.summary?.trim() || null,
    print_notes: body.print_notes?.trim() || null,
    print_scale: body.print_scale,
    desired_date: body.desired_date,
    stl_r2_key: stlR2Key,
    stl_filename: stlFilename,
    stl_size_bytes: stlSizeBytes,
    status: 'applied',
    status_comment: null,
    print_staff: null,
    print_staff_member_id: null,
    delivery_staff: null,
    google_event_id: null,
    user_id: userId,
    created_at: new Date().toISOString(),
  };

  await createReservation(env.DB, newReservation);
  return newReservation;
}
