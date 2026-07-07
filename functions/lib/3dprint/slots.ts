// functions/api/lib/slots.ts
import { LEAD_TIME_DAYS, PRINT_SCALE_WEIGHT, SLOT_CAPACITY } from './constants';

export type PrintScale = 'small' | 'medium' | 'large';

/** Returns today's date string in JST (YYYY-MM-DD). */
export function getTodayJst(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/** Adds days to an ISO date string. */
export function addDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Returns the earliest bookable date (today JST + lead time). */
export function getEarliestBookableDate(): string {
  return addDays(getTodayJst(), LEAD_TIME_DAYS);
}

/** Checks if a date meets the minimum lead time requirement. */
export function isDateBookable(desiredDate: string): boolean {
  return desiredDate >= getEarliestBookableDate();
}

/** Returns the earliest bookable date for admin (today JST). */
export function getAdminEarliestBookableDate(): string {
  return getTodayJst();
}

/** Checks if admin can book on a date (today or later). */
export function isAdminDateBookable(desiredDate: string): boolean {
  return desiredDate >= getAdminEarliestBookableDate();
}

/** Calculates total slot units used on a given date. */
export function calculateSlotUsage(scales: PrintScale[]): number {
  return scales.reduce((sum, scale) => sum + (PRINT_SCALE_WEIGHT[scale] ?? 1), 0);
}

/** Returns whether the day has any small print booked. */
export function hasSmallOnDay(existingScales: PrintScale[]): boolean {
  return existingScales.includes('small');
}

/** Returns whether the day has medium or large booked. */
export function hasMediumOrLargeOnDay(existingScales: PrintScale[]): boolean {
  return existingScales.some((s) => s === 'medium' || s === 'large');
}

/** Returns available print scales for a given day. */
export function getAvailableScales(existingScales: PrintScale[]): PrintScale[] {
  if (hasMediumOrLargeOnDay(existingScales)) return [];
  const smallCount = existingScales.filter((s) => s === 'small').length;
  if (smallCount >= 2) return [];
  if (smallCount >= 1) return ['small'];
  return ['small', 'medium', 'large'];
}

/** Returns whether the day is fully booked. */
export function isDayFull(existingScales: PrintScale[]): boolean {
  return getAvailableScales(existingScales).length === 0;
}

/** Determines if a new reservation can be added given existing scales on that date. */
export function canBookSlot(existingScales: PrintScale[], newScale: PrintScale): boolean {
  return getAvailableScales(existingScales).includes(newScale);
}

/** Returns remaining slot capacity for a date (0 to 1). */
export function getRemainingCapacity(existingScales: PrintScale[]): number {
  return Math.max(0, SLOT_CAPACITY - calculateSlotUsage(existingScales));
}
