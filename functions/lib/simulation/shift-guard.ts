// functions/api/lib/shift-guard.ts
import {
  getAvailableMemberIdsOnDate,
  getMemberById,
  getReservationsByDate,
  type Reservation,
} from './reservations';

export interface ShiftBlockReservation {
  id: string;
  title: string;
  sim_scale: string;
  desired_date: string;
  status: string;
  sim_staff_member_id: string | null;
}

/** Returns whether a member is available on a date. */
export async function isMemberAvailableOnDate(
  db: D1Database,
  memberId: string,
  date: string
): Promise<boolean> {
  const row = await db
    .prepare(`SELECT 1 AS ok FROM sim_member_availability WHERE member_id = ? AND date = ?`)
    .bind(memberId, date)
    .first<{ ok: number }>();
  return !!row;
}

/** Checks if removing a member's shift on a date should be blocked. */
export async function checkShiftRemovalBlocked(
  db: D1Database,
  memberId: string,
  date: string
): Promise<{ blocked: boolean; reservations: ShiftBlockReservation[] }> {
  const isAvailable = await isMemberAvailableOnDate(db, memberId, date);
  if (!isAvailable) {
    return { blocked: false, reservations: [] };
  }

  const reservations = await getReservationsByDate(db, date);
  if (!reservations.length) {
    return { blocked: false, reservations: [] };
  }

  const staffIds = await getAvailableMemberIdsOnDate(db, date);
  const remainingStaff = staffIds.filter((id) => id !== memberId);
  if (remainingStaff.length > 0) {
    return { blocked: false, reservations: [] };
  }

  return {
    blocked: true,
    reservations: reservations.map(toShiftBlockReservation),
  };
}

/** Validates shift removal for multiple dates. Returns first blocked date. */
export async function checkShiftRemovalBlockedForDates(
  db: D1Database,
  memberId: string,
  dates: string[]
): Promise<{ blocked: boolean; date?: string; reservations: ShiftBlockReservation[] }> {
  for (const date of dates) {
    const result = await checkShiftRemovalBlocked(db, memberId, date);
    if (result.blocked) {
      return { blocked: true, date, reservations: result.reservations };
    }
  }
  return { blocked: false, reservations: [] };
}

/** Maps a reservation to shift-block summary. */
function toShiftBlockReservation(r: Reservation): ShiftBlockReservation {
  return {
    id: r.id,
    title: r.title,
    sim_scale: r.sim_scale,
    desired_date: r.desired_date,
    status: r.status,
    sim_staff_member_id: r.sim_staff_member_id,
  };
}

/** Validates Discord snowflake user ID format. */
export function isValidDiscordUserId(value: string | null | undefined): boolean {
  if (value === null || value === undefined || value === '') return true;
  return /^\d{17,20}$/.test(value);
}

/** Ensures member exists before shift changes. */
export async function requireMember(db: D1Database, memberId: string) {
  const member = await getMemberById(db, memberId);
  if (!member) throw new Error('メンバーが見つかりません');
  return member;
}
