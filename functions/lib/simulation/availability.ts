// functions/lib/simulation/availability.ts
import {
  getAvailableScalesWithCapacity,
  canBookSlotWithCapacity,
  getScaleBookingConflictMessage,
  isSimulatorDayFull,
  parseSimulatorDailyCapacity,
  type SimulatorDailyCapacity,
} from './simulator-daily-capacity';
import { isSimulatorAvailableOnDate } from './simulator-availability';
import { getAllSimulators, getSimulatorById, type Simulator } from './simulators';
import {
  getReservationsByDate,
  getReservationsByDateAndSimulator,
  hasStaffOnDate,
} from './reservations';
import {
  canBookSlot,
  getRemainingCapacity,
  isDayFull,
  isDateBookable,
  isAdminDateBookable,
  type SimScale,
} from './slots';
import { isSimulatorBookable, normalizeSimulatorStatus } from './simulator-status';

export interface SimulatorDateAvailability {
  simulator_id: string;
  simulator_name: string;
  simulator_available: boolean;
  simulator_bookable: boolean;
  available_scales: SimScale[];
  is_full: boolean;
}

export interface DateAvailabilityResult {
  date: string;
  bookable: boolean;
  staff_available: boolean;
  simulator_available: boolean;
  can_book: boolean;
  is_full: boolean;
  available_scales: SimScale[];
  scales: SimScale[];
  remaining: number;
  count: number;
  simulators: SimulatorDateAvailability[];
}

/** Resolves availability for a specific simulator on a date. */
export async function getSimulatorDateAvailability(
  db: D1Database,
  date: string,
  simulator: Simulator,
  options: {
    excludeReservationId?: string | null;
    requireShift?: boolean;
  } = {}
): Promise<SimulatorDateAvailability> {
  const requireShift = options.requireShift !== false;
  const status = normalizeSimulatorStatus(simulator.status);
  const capacity = parseSimulatorDailyCapacity(simulator.daily_capacity_json);
  const shiftOk =
    !requireShift || (await isSimulatorAvailableOnDate(db, simulator.id, date));
  const statusOk = isSimulatorBookable(status);

  const reservations = await getReservationsByDateAndSimulator(db, date, simulator.id);
  const filtered = options.excludeReservationId
    ? reservations.filter((r) => r.id !== options.excludeReservationId)
    : reservations;
  const existingScales = filtered.map((r) => r.sim_scale);
  const availableScales =
    shiftOk && statusOk
      ? getAvailableScalesWithCapacity(existingScales, capacity)
      : [];

  return {
    simulator_id: simulator.id,
    simulator_name: simulator.name,
    simulator_available: shiftOk,
    simulator_bookable: statusOk,
    available_scales: availableScales,
    is_full: shiftOk && statusOk ? isSimulatorDayFull(existingScales, capacity) : true,
  };
}

/** Resolves day-level availability, optionally scoped to one simulator. */
export async function getDateAvailability(
  db: D1Database,
  date: string,
  options: {
    simulatorId?: string | null;
    scale?: SimScale | null;
    excludeReservationId?: string | null;
    isAdmin?: boolean;
  } = {}
): Promise<DateAvailabilityResult> {
  const isAdmin = options.isAdmin === true;
  const bookable = isAdmin ? isAdminDateBookable(date) : isDateBookable(date);
  const staffAvailable = isAdmin ? true : await hasStaffOnDate(db, date);
  const requireShift = !isAdmin;

  if (options.simulatorId) {
    const simulator = await getSimulatorById(db, options.simulatorId);
    if (!simulator) {
      return emptyAvailability(date, bookable, staffAvailable);
    }

    const simulatorAvailability = await getSimulatorDateAvailability(db, date, simulator, {
      excludeReservationId: options.excludeReservationId,
      requireShift,
    });

    const reservations = await getReservationsByDateAndSimulator(db, date, simulator.id);
    const filtered = options.excludeReservationId
      ? reservations.filter((r) => r.id !== options.excludeReservationId)
      : reservations;
    const existingScales = filtered.map((r) => r.sim_scale);
    const capacity = parseSimulatorDailyCapacity(simulator.daily_capacity_json);
    const slotOk = options.scale
      ? canBookSlotWithCapacity(existingScales, options.scale, capacity)
      : simulatorAvailability.available_scales.length > 0;

    return {
      date,
      bookable,
      staff_available: staffAvailable,
      simulator_available: simulatorAvailability.simulator_available && simulatorAvailability.simulator_bookable,
      can_book:
        bookable &&
        staffAvailable &&
        simulatorAvailability.simulator_available &&
        simulatorAvailability.simulator_bookable &&
        slotOk,
      is_full: simulatorAvailability.is_full,
      available_scales: simulatorAvailability.available_scales,
      scales: existingScales,
      remaining: getRemainingCapacity(existingScales),
      count: filtered.length,
      simulators: [simulatorAvailability],
    };
  }

  const allReservations = await getReservationsByDate(db, date);
  const filteredAll = options.excludeReservationId
    ? allReservations.filter((r) => r.id !== options.excludeReservationId)
    : allReservations;

  const simulators = await getSimulatorsForAvailability(db, date, {
    excludeReservationId: options.excludeReservationId,
    requireShift,
  });

  const unionScales = new Set<SimScale>();
  for (const simulator of simulators) {
    for (const scale of simulator.available_scales) {
      unionScales.add(scale);
    }
  }
  const availableScales = [...unionScales];
  const anySimulatorOperational = simulators.some(
    (p) => p.simulator_available && p.simulator_bookable && p.available_scales.length > 0
  );
  const slotOk = options.scale
    ? availableScales.includes(options.scale)
    : anySimulatorOperational;

  return {
    date,
    bookable,
    staff_available: staffAvailable,
    simulator_available: simulators.some((p) => p.simulator_available && p.simulator_bookable),
    can_book: bookable && staffAvailable && anySimulatorOperational && slotOk,
    is_full: !anySimulatorOperational,
    available_scales: availableScales,
    scales: filteredAll.map((r) => r.sim_scale),
    remaining: getRemainingCapacity(filteredAll.map((r) => r.sim_scale)),
    count: filteredAll.length,
    simulators,
  };
}

/** Validates whether a reservation slot can be booked on a simulator. */
export async function validateSimulatorReservationSlot(
  db: D1Database,
  desiredDate: string,
  simulatorId: string,
  printScale: SimScale,
  excludeReservationId: string,
  options: { isAdmin?: boolean } = {}
): Promise<string | null> {
  const isAdmin = options.isAdmin === true;
  const simulator = await getSimulatorById(db, simulatorId);
  if (!simulator) return '指定されたシミュレーターが見つかりません';

  const status = normalizeSimulatorStatus(simulator.status);
  if (!isSimulatorBookable(status)) {
    return 'この機種は現在予約できません';
  }

  if (!isAdmin) {
    const staffAvailable = await hasStaffOnDate(db, desiredDate);
    if (!staffAvailable) {
      return 'この日は対応可能な実行担当者がいないため予約できません';
    }

    const shiftOk = await isSimulatorAvailableOnDate(db, simulatorId, desiredDate);
    if (!shiftOk) {
      return 'この日は選択したシミュレーターが稼働予定に入っていません';
    }
  }

  const capacity = parseSimulatorDailyCapacity(simulator.daily_capacity_json);
  const reservations = await getReservationsByDateAndSimulator(db, desiredDate, simulatorId);
  const existingScales = reservations
    .filter((r) => r.id !== excludeReservationId)
    .map((r) => r.sim_scale);

  if (isSimulatorDayFull(existingScales, capacity)) {
    return 'このシミュレーターはこの日もう満杯です。別の日付または機種を選んでください';
  }

  return getScaleBookingConflictMessage(existingScales, printScale, capacity);
}

async function getSimulatorsForAvailability(
  db: D1Database,
  date: string,
  options: {
    excludeReservationId?: string | null;
    requireShift?: boolean;
  }
): Promise<SimulatorDateAvailability[]> {
  const allSimulators = await getAllSimulators(db);
  const results: SimulatorDateAvailability[] = [];

  for (const simulator of allSimulators) {
    results.push(
      await getSimulatorDateAvailability(db, date, simulator, {
        excludeReservationId: options.excludeReservationId,
        requireShift: options.requireShift,
      })
    );
  }

  return results;
}

function emptyAvailability(
  date: string,
  bookable: boolean,
  staffAvailable: boolean
): DateAvailabilityResult {
  return {
    date,
    bookable,
    staff_available: staffAvailable,
    simulator_available: false,
    can_book: false,
    is_full: true,
    available_scales: [],
    scales: [],
    remaining: 0,
    count: 0,
    simulators: [],
  };
}

/** Legacy day-level slot validation using global default capacity. */
export function validateLegacyDaySlot(
  existingScales: SimScale[],
  printScale: SimScale,
  capacity?: SimulatorDailyCapacity
): string | null {
  if (isDayFull(existingScales, capacity)) {
    return 'この日はもう満杯です。別の日付を選んでください';
  }
  if (!canBookSlot(existingScales, printScale, capacity)) {
    if (
      existingScales.includes('small') &&
      (printScale === 'medium' || printScale === 'large')
    ) {
      return 'この日はスモール依頼が入っているため、ミディアム・ラージは選択できません';
    }
    return '選択した日付の予約枠がいっぱいです。別の日付を選んでください';
  }
  return null;
}
