// functions/api/lib/reservation-edit.ts
import {
  canBookSlot,
  getAvailableScales,
  isDayFull,
  type PrintScale,
} from './slots';
import { getReservationsByDate, hasStaffOnDate, type Reservation } from './reservations';
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
  print_scale: PrintScale;
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
  excludeReservationId: string
): Promise<string | null> {
  const existing = await getReservationsByDate(db, desiredDate);
  const existingScales = existing
    .filter((r) => r.id !== excludeReservationId)
    .map((r) => r.print_scale);

  if (isDayFull(existingScales)) {
    return 'この日はもう満杯です。別の日付を選んでください';
  }

  if (!canBookSlot(existingScales, printScale)) {
    if (existingScales.includes('small') && (printScale === 'medium' || printScale === 'large')) {
      return 'この日はスモール印刷が入っているため、ミディアム・ラージは選択できません';
    }
    return '選択した日付の予約枠がいっぱいです。別の日付を選んでください';
  }

  return null;
}

/** Returns whether a reservation can be edited. */
export function canEditReservation(reservation: Reservation): boolean {
  return reservation.status !== 'cancelled';
}

/** Returns available scales for edit form on a given date. */
export async function getEditAvailableScales(
  db: D1Database,
  desiredDate: string,
  excludeReservationId: string
): Promise<PrintScale[]> {
  const existing = await getReservationsByDate(db, desiredDate);
  const existingScales = existing
    .filter((r) => r.id !== excludeReservationId)
    .map((r) => r.print_scale);
  return getAvailableScales(existingScales);
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
