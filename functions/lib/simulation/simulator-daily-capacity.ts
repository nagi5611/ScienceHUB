// functions/lib/simulation/simulator-daily-capacity.ts
import type { SimScale } from './slots';

export interface SimulatorDailyCapacity {
  /** Max small prints when no medium/large is booked that day. */
  max_small: number;
  /** Max small prints when medium or large is already booked (mixed mode). */
  max_small_with_main: number;
  max_medium: number;
  max_large: number;
  allow_small_with_medium: boolean;
  allow_small_with_large: boolean;
}

export const DEFAULT_PRINTER_DAILY_CAPACITY: SimulatorDailyCapacity = {
  max_small: 2,
  max_small_with_main: 0,
  max_medium: 1,
  max_large: 1,
  allow_small_with_medium: false,
  allow_small_with_large: false,
};

/** Parses daily capacity JSON from the database. */
export function parseSimulatorDailyCapacity(json: string | null | undefined): SimulatorDailyCapacity {
  if (!json || json.trim() === '' || json.trim() === '{}') {
    return { ...DEFAULT_PRINTER_DAILY_CAPACITY };
  }

  try {
    const raw = JSON.parse(json) as Partial<SimulatorDailyCapacity>;
    return normalizeSimulatorDailyCapacity(raw);
  } catch {
    return { ...DEFAULT_PRINTER_DAILY_CAPACITY };
  }
}

/** Normalizes partial capacity input. */
export function normalizeSimulatorDailyCapacity(
  raw: Partial<SimulatorDailyCapacity>
): SimulatorDailyCapacity {
  const max_small_with_main = clampInt(
    raw.max_small_with_main,
    0,
    4,
    DEFAULT_PRINTER_DAILY_CAPACITY.max_small_with_main
  );
  const allowMixed = max_small_with_main > 0;

  return {
    max_small: clampInt(raw.max_small, 1, 8, DEFAULT_PRINTER_DAILY_CAPACITY.max_small),
    max_small_with_main,
    max_medium: clampInt(raw.max_medium, 0, 4, DEFAULT_PRINTER_DAILY_CAPACITY.max_medium),
    max_large: clampInt(raw.max_large, 0, 4, DEFAULT_PRINTER_DAILY_CAPACITY.max_large),
    allow_small_with_medium:
      raw.allow_small_with_medium !== undefined
        ? Boolean(raw.allow_small_with_medium)
        : allowMixed,
    allow_small_with_large:
      raw.allow_small_with_large !== undefined
        ? Boolean(raw.allow_small_with_large)
        : allowMixed,
  };
}

/** Serializes capacity for storage. */
export function serializeSimulatorDailyCapacity(capacity: SimulatorDailyCapacity): string {
  return JSON.stringify(normalizeSimulatorDailyCapacity(capacity));
}

/** Validates capacity input from admin API. Returns error message or null. */
export function validateSimulatorDailyCapacityInput(
  input: unknown
): { capacity: SimulatorDailyCapacity } | { error: string } {
  if (!input || typeof input !== 'object') {
    return { error: 'daily_capacity の形式が不正です' };
  }

  const raw = input as Partial<SimulatorDailyCapacity>;
  const capacity = normalizeSimulatorDailyCapacity(raw);

  if (capacity.max_medium < 1 && capacity.max_large < 1 && capacity.max_small < 1) {
    return { error: '日次キャパには少なくとも1件分の枠が必要です' };
  }

  return { capacity };
}

/** Returns available print scales for a simulator day given existing reservations. */
export function getAvailableScalesWithCapacity(
  existingScales: SimScale[],
  config: SimulatorDailyCapacity
): SimScale[] {
  const small = existingScales.filter((s) => s === 'small').length;
  const medium = existingScales.filter((s) => s === 'medium').length;
  const large = existingScales.filter((s) => s === 'large').length;

  if (medium > 0 && large > 0) return [];

  const available: SimScale[] = [];
  if (canAddSmall(small, medium, large, config)) available.push('small');
  if (canAddMedium(small, medium, large, config)) available.push('medium');
  if (canAddLarge(small, medium, large, config)) available.push('large');
  return available;
}

/** Returns whether a new reservation scale can be added. */
export function canBookSlotWithCapacity(
  existingScales: SimScale[],
  newScale: SimScale,
  config: SimulatorDailyCapacity
): boolean {
  return getAvailableScalesWithCapacity(existingScales, config).includes(newScale);
}

/** Returns whether the simulator day has no remaining slots. */
export function isSimulatorDayFull(
  existingScales: SimScale[],
  config: SimulatorDailyCapacity
): boolean {
  return getAvailableScalesWithCapacity(existingScales, config).length === 0;
}

/** Returns a user-facing conflict message when scale booking fails. */
export function getScaleBookingConflictMessage(
  existingScales: SimScale[],
  newScale: SimScale,
  config: SimulatorDailyCapacity
): string | null {
  if (canBookSlotWithCapacity(existingScales, newScale, config)) return null;

  const small = existingScales.filter((s) => s === 'small').length;
  const hasMain = existingScales.some((s) => s === 'medium' || s === 'large');

  if (
    small > 0 &&
    (newScale === 'medium' || newScale === 'large') &&
    !config.allow_small_with_medium &&
    !config.allow_small_with_large
  ) {
    return 'この日はスモール依頼が入っているため、ミディアム・ラージは選択できません';
  }

  if (hasMain && newScale === 'small') {
    return 'この日はミディアム・ラージの予約があるため、スモールは追加できません';
  }

  return '選択した日付の予約枠がいっぱいです。別の日付を選んでください';
}

function canAddSmall(
  small: number,
  medium: number,
  large: number,
  config: SimulatorDailyCapacity
): boolean {
  const mainUsed = medium > 0 || large > 0;
  if (!mainUsed) return small < config.max_small;

  if (medium > 0 && !config.allow_small_with_medium) return false;
  if (large > 0 && !config.allow_small_with_large) return false;

  return small < config.max_small_with_main;
}

function canAddMedium(
  small: number,
  medium: number,
  large: number,
  config: SimulatorDailyCapacity
): boolean {
  if (config.max_medium < 1) return false;
  if (large > 0) return false;
  if (medium >= config.max_medium) return false;

  if (small === 0) return true;
  return small <= config.max_small_with_main && config.allow_small_with_medium;
}

function canAddLarge(
  small: number,
  medium: number,
  large: number,
  config: SimulatorDailyCapacity
): boolean {
  if (config.max_large < 1) return false;
  if (medium > 0) return false;
  if (large >= config.max_large) return false;

  if (small === 0) return true;
  return small <= config.max_small_with_main && config.allow_small_with_large;
}

function clampInt(
  value: unknown,
  min: number,
  max: number,
  fallback: number
): number {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, Math.round(num)));
}
