import { getDateAvailability, validatePrinterReservationSlot } from './availability';
import { gradeFromHomeroom, isValidHomeroom } from './homeroom';
import { isAdminDateBookable, type PrintScale } from './slots';
import { getPrinterById } from './printers';
import { createReservation, type Reservation, type ReservationSource } from './reservations';
import { verifyR2Key } from './upload';

export const ADMIN_FORCE_PLACEHOLDER_STL_KEY = 'system/admin-force-reservation/placeholder.stl';
export const ADMIN_FORCE_PLACEHOLDER_STL_FILENAME = '（ファイル未登録）.stl';

export interface AdminForceReservationInput {
  desired_date: string;
  homeroom?: string | null;
  student_number?: number | null;
  student_name?: string | null;
  title?: string | null;
  purpose?: string | null;
  purpose_other?: string | null;
  summary?: string | null;
  print_notes?: string | null;
  print_scale?: PrintScale | null;
  printer_id?: string | null;
  stl_r2_key?: string | null;
  stl_filename?: string | null;
  stl_size_bytes?: number | null;
  user_id?: string | null;
}

function pickScale(
  requested: PrintScale | null | undefined,
  available: PrintScale[]
): PrintScale | null {
  if (requested && available.includes(requested)) return requested;
  for (const scale of ['small', 'medium', 'large'] as PrintScale[]) {
    if (available.includes(scale)) return scale;
  }
  return available[0] ?? null;
}

export async function createAdminForcePrintReservation(
  db: D1Database,
  files: R2Bucket | undefined,
  adminUserId: string,
  input: AdminForceReservationInput,
  options: { source: ReservationSource }
): Promise<{ reservation: Reservation } | { error: string }> {
  const desiredDate = String(input.desired_date ?? '').trim();
  if (!desiredDate) return { error: 'desired_date は必須です' };
  if (!isAdminDateBookable(desiredDate)) return { error: '希望印刷日が不正です' };

  const availability = await getDateAvailability(db, desiredDate, { isAdmin: true });
  if (availability.is_full || availability.available_scales.length === 0) {
    return { error: 'この日はもう満杯です' };
  }

  let printerId = input.printer_id?.trim() || '';
  let printerAvailability = availability.printers.find((p) => p.printer_id === printerId);
  if (!printerId || !printerAvailability) {
    printerAvailability = availability.printers.find(
      (p) => !p.is_full && p.available_scales.length > 0
    );
    printerId = printerAvailability?.printer_id ?? '';
  }
  if (!printerId || !printerAvailability) {
    return { error: 'この日付で予約可能なプリンターがありません' };
  }

  const printScale = pickScale(input.print_scale ?? null, printerAvailability.available_scales);
  if (!printScale) return { error: 'この日は選択可能な印刷規模がありません' };
  if (!(await getPrinterById(db, printerId))) {
    return { error: '指定されたプリンターが見つかりません' };
  }

  const slotError = await validatePrinterReservationSlot(
    db,
    desiredDate,
    printerId,
    printScale,
    '',
    { isAdmin: true }
  );
  if (slotError) return { error: slotError };

  const homeroomRaw = String(input.homeroom ?? '').trim();
  const homeroom = homeroomRaw && isValidHomeroom(homeroomRaw) ? homeroomRaw : '101';
  const student_number =
    input.student_number != null &&
    Number.isFinite(Number(input.student_number)) &&
    Number(input.student_number) > 0
      ? Number(input.student_number)
      : 0;

  const purposeRaw = String(input.purpose ?? '').trim();
  const purpose: Reservation['purpose'] =
    purposeRaw === 'ss_s_tan' || purposeRaw === 'club' || purposeRaw === 'other' ? purposeRaw : 'other';

  let stl_r2_key = String(input.stl_r2_key ?? '').trim();
  let stl_filename = String(input.stl_filename ?? '').trim();
  let stl_size_bytes = Number(input.stl_size_bytes ?? 0);
  if (stl_r2_key) {
    if (!files) return { error: 'ファイルストレージが利用できません' };
    if (!(await verifyR2Key(files, stl_r2_key))) {
      return { error: 'ファイルが見つかりません。再度アップロードしてください' };
    }
    if (!stl_filename) stl_filename = 'upload.stl';
    if (!Number.isFinite(stl_size_bytes) || stl_size_bytes < 0) stl_size_bytes = 0;
  } else {
    stl_r2_key = ADMIN_FORCE_PLACEHOLDER_STL_KEY;
    stl_filename = ADMIN_FORCE_PLACEHOLDER_STL_FILENAME;
    stl_size_bytes = 0;
  }

  const reservation: Reservation = {
    id: crypto.randomUUID(),
    grade: gradeFromHomeroom(homeroom),
    homeroom,
    student_number,
    student_name: String(input.student_name ?? '').trim() || '（未入力）',
    title: String(input.title ?? '').trim() || '（仮予約）',
    purpose,
    purpose_other:
      purpose === 'other' ? String(input.purpose_other ?? '').trim() || null : null,
    summary: String(input.summary ?? '').trim() || null,
    print_notes: String(input.print_notes ?? '').trim() || null,
    print_scale: printScale,
    printer_id: printerId,
    desired_date: desiredDate,
    stl_r2_key,
    stl_filename,
    stl_size_bytes,
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
    user_id: input.user_id?.trim() || adminUserId,
    source: options.source,
    schedule_type: null,
    contest_storage_path: null,
    contest_storage_filename: null,
    contest_application_id: null,
    created_at: new Date().toISOString(),
  };

  await createReservation(db, reservation);
  return { reservation };
}
