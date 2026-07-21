// functions/lib/simulation/reservation-edit.ts
import { getDateAvailability, validateSimulatorReservationSlot } from './availability';
import { type SimScale } from './slots';
import { hasStaffOnDate, type Reservation } from './reservations';
import { isSimulatorAvailableOnDate } from './simulator-availability';
import { getSimulatorById } from './simulators';
import { isValidHomeroom } from './homeroom';

export interface ReservationContentInput {
  homeroom: string;
  student_number: number;
  student_name: string;
  title: string;
  purpose: 'ss_s_tan' | 'club' | 'other';
  purpose_other?: string | null;
  summary?: string | null;
  sim_notes?: string | null;
  request_result_video?: boolean;
  sim_scale: SimScale;
  simulator_id?: string | null;
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
    'sim_scale',
    'desired_date',
  ] as const;

  for (const field of required) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      return `${field} は必須です`;
    }
  }

  if (!body.simulator_id?.trim()) {
    return 'シミュレーター機種を選択してください';
  }

  if (!SCALES.includes(body.sim_scale as SimScale)) {
    return 'シミュレーション規模が不正です';
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
  printScale: SimScale,
  excludeReservationId: string,
  simulatorId?: string | null,
  options: { isAdmin?: boolean } = {}
): Promise<string | null> {
  if (!simulatorId?.trim()) {
    return 'シミュレーター機種を選択してください';
  }

  return validateSimulatorReservationSlot(
    db,
    desiredDate,
    simulatorId,
    printScale,
    excludeReservationId,
    options
  );
}

/** Returns whether a reservation can be edited. */
export function canEditReservation(reservation: Reservation): boolean {
  return reservation.status !== 'cancelled';
}

/** Returns available scales for edit form on a given date and simulator. */
export async function getEditAvailableScales(
  db: D1Database,
  desiredDate: string,
  excludeReservationId: string,
  simulatorId?: string | null,
  options: { isAdmin?: boolean } = {}
): Promise<SimScale[]> {
  if (!simulatorId?.trim()) return [];

  const availability = await getDateAvailability(db, desiredDate, {
    simulatorId,
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
    return 'この日は対応可能な実行担当者がいないため予約できません';
  }
  return null;
}

/** Validates simulator shift availability for guest edits. */
export async function validateGuestSimulatorShiftAvailability(
  db: D1Database,
  desiredDate: string,
  simulatorId: string
): Promise<string | null> {
  const simulator = await getSimulatorById(db, simulatorId);
  if (!simulator) return '指定されたシミュレーターが見つかりません';

  const shiftOk = await isSimulatorAvailableOnDate(db, simulatorId, desiredDate);
  if (!shiftOk) {
    return 'この日は選択したシミュレーターが稼働予定に入っていません';
  }

  return null;
}
