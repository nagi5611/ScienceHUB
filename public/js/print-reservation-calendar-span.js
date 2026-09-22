// public/js/print-reservation-calendar-span.js
// Keep in sync with functions/lib/3dprint/calendar-span.ts

export const MAX_PART_COUNT = 99;

export function normalizePartCount(value) {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 1) return 1;
  return Math.min(n, MAX_PART_COUNT);
}

export function addDays(isoDate, days) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function computeCalendarDaySpan(partCount) {
  const parts = normalizePartCount(partCount);
  if (parts <= 1) return 1;
  if (parts <= 3) return parts;
  if (parts <= 9) return parts <= 6 ? 2 : 3;
  return Math.min(14, 4 + Math.ceil((parts - 10) / 2));
}

export function computeCalendarEndDate(desiredDate, partCount) {
  return addDays(desiredDate, computeCalendarDaySpan(partCount) - 1);
}

export function derivePrintScaleFromPartCount(partCount) {
  const parts = normalizePartCount(partCount);
  if (parts >= 10) return 'large';
  if (parts >= 4) return 'medium';
  return 'small';
}

export function getCalendarScalePrintLabel(partCount) {
  const parts = normalizePartCount(partCount);
  if (parts >= 10) return 'Large Scale Print';
  if (parts >= 4) return 'Medium Scale Print';
  return null;
}

export function listDatesInclusive(startDate, endDate) {
  if (endDate < startDate) return [];
  const out = [];
  let cursor = startDate;
  while (cursor <= endDate) {
    out.push(cursor);
    if (cursor === endDate) break;
    cursor = addDays(cursor, 1);
  }
  return out;
}

export function buildCalendarOccurrences(reservation) {
  const partCount = normalizePartCount(reservation.part_count ?? 1);
  const start = reservation.desired_date;
  const end =
    reservation.calendar_end_date?.trim() || computeCalendarEndDate(start, partCount);
  const dates = listDatesInclusive(start, end);
  const scale = derivePrintScaleFromPartCount(partCount);
  const scaleLabel = getCalendarScalePrintLabel(partCount);

  if (partCount >= 4) {
    return dates.map((date, index) => {
      let segment = 'middle';
      if (dates.length === 1) segment = 'single';
      else if (index === 0) segment = 'start';
      else if (index === dates.length - 1) segment = 'end';

      return {
        date,
        segment,
        mode: 'span',
        partIndex: null,
        partCount,
        displayLabel: index === 0 ? (scaleLabel ?? reservation.title) : (scaleLabel ?? ''),
        printScale: scale,
      };
    });
  }

  return dates.map((date, index) => {
    let displayLabel = reservation.title;
    if (partCount > 1) {
      displayLabel = `Part ${index + 1}/${partCount}`;
    }
    let segment = 'single';
    if (dates.length > 1) {
      if (index === 0) segment = 'start';
      else if (index === dates.length - 1) segment = 'end';
      else segment = 'middle';
    }
    return {
      date,
      segment,
      mode: 'part',
      partIndex: partCount > 1 ? index + 1 : null,
      partCount,
      displayLabel,
      printScale: scale,
    };
  });
}

export function indexReservationOccurrencesByDate(reservations) {
  const map = {};
  for (const reservation of reservations) {
    for (const occurrence of buildCalendarOccurrences(reservation)) {
      if (!map[occurrence.date]) map[occurrence.date] = [];
      map[occurrence.date].push({ reservation, occurrence });
    }
  }
  return map;
}

export const SCALE_SHORT = { small: 'S', medium: 'M', large: 'L' };
