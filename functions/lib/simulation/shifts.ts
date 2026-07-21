// functions/api/lib/shifts.ts

export const SHIFT_COLOR_COUNT = 8;

/** Validates a member color index. */
export function isValidColorIndex(index: number): boolean {
  return Number.isInteger(index) && index >= 0 && index < SHIFT_COLOR_COUNT;
}
