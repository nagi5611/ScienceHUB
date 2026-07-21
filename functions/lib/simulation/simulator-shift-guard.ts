// functions/lib/simulation/simulator-shift-guard.ts
import { getReservationsByDateAndSimulator, type Reservation } from './reservations';
import { isSimulatorAvailableOnDate } from './simulator-availability';

export interface SimulatorShiftBlockReservation {
  id: string;
  title: string;
  sim_scale: string;
  desired_date: string;
  status: string;
  simulator_id: string | null;
}

/** Checks if removing a simulator shift on a date should be blocked. */
export async function checkSimulatorShiftRemovalBlocked(
  db: D1Database,
  simulatorId: string,
  date: string
): Promise<{ blocked: boolean; reservations: SimulatorShiftBlockReservation[] }> {
  const isAvailable = await isSimulatorAvailableOnDate(db, simulatorId, date);
  if (!isAvailable) {
    return { blocked: false, reservations: [] };
  }

  const reservations = await getReservationsByDateAndSimulator(db, date, simulatorId);
  if (!reservations.length) {
    return { blocked: false, reservations: [] };
  }

  return {
    blocked: true,
    reservations: reservations.map(toSimulatorShiftBlockReservation),
  };
}

/** Validates simulator shift removal for multiple dates. */
export async function checkSimulatorShiftRemovalBlockedForDates(
  db: D1Database,
  simulatorId: string,
  dates: string[]
): Promise<{ blocked: boolean; date?: string; reservations: SimulatorShiftBlockReservation[] }> {
  for (const date of dates) {
    const result = await checkSimulatorShiftRemovalBlocked(db, simulatorId, date);
    if (result.blocked) {
      return { blocked: true, date, reservations: result.reservations };
    }
  }
  return { blocked: false, reservations: [] };
}

function toSimulatorShiftBlockReservation(r: Reservation): SimulatorShiftBlockReservation {
  return {
    id: r.id,
    title: r.title,
    sim_scale: r.sim_scale,
    desired_date: r.desired_date,
    status: r.status,
    simulator_id: r.simulator_id,
  };
}
