// functions/lib/3dprint/reservation-edit.ts
import { getDateAvailability, validatePrinterReservationSlot } from './availability';
import { type PrintScale } from './slots';
import { hasStaffOnDate, type Reservation } from './reservations';
import { isPrinterAvailableOnDate } from './printer-availability';
import { getPrinterById } from './printers';
import { isValidHomeroom } from './homeroom';

export interface ReservationContentInput {
  homeroom: string;
  student_number: number;
  student_name: string;
  title: string;
  purpose: 'ss_s_tan' | 'club' | 'other';
  purpose_other?: string | null;
  summary?: string | null;
  print_notes?: string | null;
  request_print_video?: boolean;
  print_scale: PrintScale;
  printer_id?: string | null;
  desired_date: string;
  stl_r2_key?: string;
  stl_filename?: string;
  stl_size_bytes?: number;
}

const PURPOSES = ['ss_s_tan', 'club', 'other'] as const;
const SCALES = ['small', 'medium', 'large'] as const;

/** Validates reservation content fields. Returns error message or null. */
export function validateReservationContentFields(
  body: Partial<ReservationContentInput>
): string | null {
  const required = [
    'homeroom',
    'student_number',
    'student_name',
    'title',
    'purpose',
    'print_scale',
    'desired_date',
  ] as const;

  for (const field of required) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      return `${field} は必須です`;
    }
  }

  if (!body.printer_id?.trim()) {
    return '印刷機種を選択してください';
  }

  if (!SCALES.includes(body.print_scale as PrintScale)) {
    return '印刷規模が不正です';
  }

  if (!PURPOSES.includes(body.purpose as (typeof PURPOSES)[number])) {
    return '目的が不正です';
  }

  if (body.purpose === 'other' && !body.purpose_other?.trim()) {
    return '目的が「その他」の場合は内容を入力してください';
  }

  if (!isValidHomeroom(String(body.homeroom))) {
    return 'ホームルームは 101〜109、201〜209、301〜309 から選択してください';
  }

  return null;
}

/** Validates slot availability excluding the reservation being edited. */
export async function validateReservationSlot(
  db: D1Database,
  desiredDate: string,
  printScale: PrintScale,
  excludeReservationId: string,
  printerId?: string | null,
  options: { isAdmin?: boolean } = {}
): Promise<string | null> {
  if (!printerId?.trim()) {
    return '印刷機種を選択してください';
  }

  return validatePrinterReservationSlot(
    db,
    desiredDate,
    printerId,
    printScale,
    excludeReservationId,
    options
  );
}

/** Returns whether a reservation can be edited. */
export function canEditReservation(reservation: Reservation): boolean {
  return reservation.status !== 'cancelled';
}

/** Returns available scales for edit form on a given date and printer. */
export async function getEditAvailableScales(
  db: D1Database,
  desiredDate: string,
  excludeReservationId: string,
  printerId?: string | null,
  options: { isAdmin?: boolean } = {}
): Promise<PrintScale[]> {
  if (!printerId?.trim()) return [];

  const availability = await getDateAvailability(db, desiredDate, {
    printerId,
    excludeReservationId,
    isAdmin: options.isAdmin,
  });
  return availability.available_scales;
}

/** Validates staff availability for guest edits. */
export async function validateGuestStaffAvailability(
  db: D1Database,
  desiredDate: string
): Promise<string | null> {
  const staffAvailable = await hasStaffOnDate(db, desiredDate);
  if (!staffAvailable) {
    return 'この日は対応可能な印刷担当者がいないため予約できません';
  }
  return null;
}

/** Validates printer shift availability for guest edits. */
export async function validateGuestPrinterShiftAvailability(
  db: D1Database,
  desiredDate: string,
  printerId: string
): Promise<string | null> {
  const printer = await getPrinterById(db, printerId);
  if (!printer) return '指定されたプリンターが見つかりません';

  const shiftOk = await isPrinterAvailableOnDate(db, printerId, desiredDate);
  if (!shiftOk) {
    return 'この日は選択したプリンターが稼働予定に入っていません';
  }

  return null;
}
