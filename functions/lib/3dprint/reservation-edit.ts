// functions/lib/3dprint/reservation-edit.ts
import {
  validatePrinterReservationSlot,
  validatePrinterReservationSpan,
} from './availability';
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
  printer_id?: string | null;
  desired_date: string;
  stl_r2_key?: string;
  stl_filename?: string;
  stl_size_bytes?: number;
  part_count?: number;
}

const PURPOSES = ['ss_s_tan', 'club', 'other'] as const;

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
  excludeReservationId: string,
  printerId?: string | null,
  options: { isAdmin?: boolean; partCount?: number } = {}
): Promise<string | null> {
  if (!printerId?.trim()) {
    return '印刷機種を選択してください';
  }

  const partCount = options.partCount ?? 1;
  if (partCount > 1) {
    return validatePrinterReservationSpan(
      db,
      desiredDate,
      printerId,
      partCount,
      excludeReservationId,
      options
    );
  }

  return validatePrinterReservationSlot(
    db,
    desiredDate,
    printerId,
    excludeReservationId,
    options
  );
}

/** Returns whether a reservation can be edited. */
export function canEditReservation(reservation: Reservation): boolean {
  return reservation.status !== 'cancelled';
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
