/** Time-slot domain logic (handoff core.js), JST date strings YYYY-MM-DD. */

export type BookingKind = 'reserve' | 'request';
export type MachineLane = 'ke' | 'cc';

export const DAY_START = 6 * 60;
export const DAY_END = 20 * 60;
export const SLOT_MIN = 30;
export const SLOT_COUNT = (DAY_END - DAY_START) / SLOT_MIN;
export const SHIFT_START = 16 * 60 + 30;
export const SHIFT_END = 20 * 60;

export const OCCUPYING_STATUSES = new Set(['applied', 'accepted', 'printing']);

export interface TimeSlotReservationLike {
  id: string;
  desired_date: string;
  printer_id: string | null;
  booking_kind?: BookingKind | null;
  start_minute?: number | null;
  end_minute?: number | null;
  status: string;
}

/** Returns today's date in JST (YYYY-MM-DD). */
export function getTodayJstDate(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo' }).format(new Date());
}

export function parseYmdToUtcDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function isWeekdayYmd(dateStr: string): boolean {
  const d = parseYmdToUtcDate(dateStr);
  const w = d.getUTCDay();
  return w >= 1 && w <= 5;
}

/** Reserve: same day or future. */
export function isReserveDateBookable(desiredDate: string): boolean {
  return desiredDate >= getTodayJstDate();
}

/** Request (依頼): must be before the print day (前日まで). */
export function isRequestDateBookable(desiredDate: string): boolean {
  return desiredDate > getTodayJstDate();
}

export function isPastDate(dateStr: string): boolean {
  return dateStr < getTodayJstDate();
}

/** True when the print date is strictly after today (JST). */
export function isFuturePrintDate(dateStr: string): boolean {
  return dateStr > getTodayJstDate();
}

/** User restore: print date must be strictly after today (JST), for both 依頼 and 予約. */
export function canUserRestoreCancelledReservation(
  _bookingKind: BookingKind | null | undefined,
  desiredDate: string,
): boolean {
  return isFuturePrintDate(desiredDate);
}

export function slotIndexFromMinute(mins: number): number {
  return Math.round((mins - DAY_START) / SLOT_MIN);
}

export function spanOfReservation(r: {
  booking_kind?: BookingKind | null;
  start_minute?: number | null;
  end_minute?: number | null;
}): { start: number; end: number } {
  if (r.booking_kind === 'request') {
    return { start: SHIFT_START, end: SHIFT_END };
  }
  const start = r.start_minute ?? DAY_START;
  const end = r.end_minute ?? start + SLOT_MIN;
  return { start, end };
}

export function reservationsOverlap(
  a: { start: number; end: number },
  b: { start: number; end: number }
): boolean {
  return a.start < b.end && b.start < a.end;
}

/** Server-side overlap check for same printer on same day. */
export function hasTimeSlotOverlap(
  existing: TimeSlotReservationLike[],
  candidate: TimeSlotReservationLike
): boolean {
  const cSpan = spanOfReservation(candidate);
  return existing.some((row) => {
    if (row.id === candidate.id) return false;
    if (row.desired_date !== candidate.desired_date) return false;
    if (!row.printer_id || !candidate.printer_id) return false;
    if (row.printer_id !== candidate.printer_id) return false;
    if (!OCCUPYING_STATUSES.has(row.status)) return false;
    if (!row.booking_kind && row.start_minute == null) return false;
    const pSpan = spanOfReservation(row);
    return reservationsOverlap(cSpan, pSpan);
  });
}

export function validateTimeSlotInput(input: {
  booking_kind: BookingKind;
  start_minute?: number;
  end_minute?: number;
}): string | null {
  if (input.booking_kind === 'request') {
    return null;
  }
  const start = input.start_minute;
  const end = input.end_minute;
  if (start == null || end == null) return '開始・終了時刻が必要です';
  if (start < DAY_START || end > DAY_END || end <= start) {
    return '時刻は 6:00〜20:00 の範囲で指定してください';
  }
  if ((start - DAY_START) % SLOT_MIN !== 0 || (end - DAY_START) % SLOT_MIN !== 0) {
    return '時刻は30分単位で指定してください';
  }
  return null;
}

const STL_EXT = /\.(stl|gcode|gco|3mf|obj|html?|htm)$/i;

export function isAllowedPrintFilename(name: string): boolean {
  return STL_EXT.test(name.trim());
}
