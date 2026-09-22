import { addDays, type PrintScale } from './slots';

export const MAX_PART_COUNT = 99;

/**
 * Calendar day span rules (inclusive of desired_date through calendar_end_date):
 * - 1 part → 1 day
 * - 2–3 parts → one day per part (consecutive)
 * - 4–6 parts → Medium Scale Print, 2 days
 * - 7–9 parts → Medium Scale Print, 3 days
 * - 10+ parts → Large Scale Print, min(14, 4 + ceil((parts - 10) / 2)) days
 */
export function normalizePartCount(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 1) return 1;
  return Math.min(n, MAX_PART_COUNT);
}

export function computeCalendarDaySpan(partCount: number): number {
  const parts = normalizePartCount(partCount);
  if (parts <= 1) return 1;
  if (parts <= 3) return parts;
  if (parts <= 9) return parts <= 6 ? 2 : 3;
  return Math.min(14, 4 + Math.ceil((parts - 10) / 2));
}

export function computeCalendarEndDate(desiredDate: string, partCount: number): string {
  const span = computeCalendarDaySpan(partCount);
  return addDays(desiredDate, span - 1);
}

export function derivePrintScaleFromPartCount(partCount: number): PrintScale {
  const parts = normalizePartCount(partCount);
  if (parts >= 10) return 'large';
  if (parts >= 4) return 'medium';
  return 'small';
}

export function getCalendarScalePrintLabel(partCount: number): string | null {
  const parts = normalizePartCount(partCount);
  if (parts >= 10) return 'Large Scale Print';
  if (parts >= 4) return 'Medium Scale Print';
  return null;
}

export function listDatesInclusive(startDate: string, endDate: string): string[] {
  if (endDate < startDate) return [];
  const out: string[] = [];
  let cursor = startDate;
  while (cursor <= endDate) {
    out.push(cursor);
    if (cursor === endDate) break;
    cursor = addDays(cursor, 1);
  }
  return out;
}

export interface SyncedReservationSpanFields {
  part_count: number;
  print_scale: PrintScale;
  calendar_end_date: string;
}

export function syncReservationSpanFields(
  desiredDate: string,
  partCountInput: unknown,
  printScaleInput?: PrintScale | null
): SyncedReservationSpanFields {
  const part_count = normalizePartCount(partCountInput);
  const print_scale = derivePrintScaleFromPartCount(part_count);
  const calendar_end_date = computeCalendarEndDate(desiredDate, part_count);
  if (part_count < 4 && printScaleInput && ['small', 'medium', 'large'].includes(printScaleInput)) {
    return {
      part_count,
      print_scale: printScaleInput,
      calendar_end_date,
    };
  }
  return { part_count, print_scale, calendar_end_date };
}

export function resolveReservationCalendarEndDate(r: {
  desired_date: string;
  calendar_end_date?: string | null;
  part_count?: number | null;
}): string {
  const trimmed = r.calendar_end_date?.trim();
  if (trimmed) return trimmed;
  return computeCalendarEndDate(r.desired_date, normalizePartCount(r.part_count ?? 1));
}

export function formatReservationCalendarApiFields(r: {
  part_count?: number | null;
  calendar_end_date?: string | null;
  desired_date: string;
}): { part_count: number; calendar_end_date: string } {
  const part_count = normalizePartCount(r.part_count ?? 1);
  const calendar_end_date = resolveReservationCalendarEndDate({
    desired_date: r.desired_date,
    calendar_end_date: r.calendar_end_date,
    part_count,
  });
  return { part_count, calendar_end_date };
}
