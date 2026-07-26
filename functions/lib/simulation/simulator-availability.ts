// functions/lib/simulation/simulator-availability.ts
// sim_simulator_availability: 登録された日付はそのシミュレーターの「利用不可」日（未登録 = 稼働可）

export interface SimulatorAvailabilityRow {
  simulator_id: string;
  date: string;
}

/** Fetches simulator unavailability rows in a date range. */
export async function getSimulatorAvailabilityInRange(
  db: D1Database,
  startDate: string,
  endDate: string
): Promise<SimulatorAvailabilityRow[]> {
  const result = await db
    .prepare(
      `SELECT simulator_id, date FROM sim_simulator_availability
       WHERE date >= ? AND date <= ?
       ORDER BY date ASC, simulator_id ASC`
    )
    .bind(startDate, endDate)
    .all<SimulatorAvailabilityRow>();
  return result.results ?? [];
}

/** Returns simulator IDs that are unavailable on a date. */
export async function getUnavailableSimulatorIdsOnDate(
  db: D1Database,
  date: string
): Promise<string[]> {
  const result = await db
    .prepare(`SELECT simulator_id FROM sim_simulator_availability WHERE date = ?`)
    .bind(date)
    .all<{ simulator_id: string }>();
  return (result.results ?? []).map((row) => row.simulator_id);
}

/** Returns whether any simulator is marked unavailable on a date. */
export async function hasAnySimulatorOnDate(db: D1Database, date: string): Promise<boolean> {
  const row = await db
    .prepare(`SELECT 1 AS ok FROM sim_simulator_availability WHERE date = ? LIMIT 1`)
    .bind(date)
    .first<{ ok: number }>();
  return !!row;
}

/** Returns whether a simulator is marked unavailable on a date. */
export async function isSimulatorUnavailableOnDate(
  db: D1Database,
  simulatorId: string,
  date: string
): Promise<boolean> {
  const row = await db
    .prepare(`SELECT 1 AS ok FROM sim_simulator_availability WHERE simulator_id = ? AND date = ?`)
    .bind(simulatorId, date)
    .first<{ ok: number }>();
  return !!row;
}

/** Returns whether a simulator can accept bookings on a date (default: available). */
export async function isSimulatorAvailableOnDate(
  db: D1Database,
  simulatorId: string,
  date: string
): Promise<boolean> {
  return !(await isSimulatorUnavailableOnDate(db, simulatorId, date));
}

/** Sets simulator availability for multiple dates (available=true removes unavailability). */
export async function setSimulatorAvailability(
  db: D1Database,
  simulatorId: string,
  dates: string[],
  available: boolean
): Promise<void> {
  if (!dates.length) return;

  if (available) {
    const placeholders = dates.map(() => '?').join(',');
    await db
      .prepare(
        `DELETE FROM sim_simulator_availability WHERE simulator_id = ? AND date IN (${placeholders})`
      )
      .bind(simulatorId, ...dates)
      .run();
    return;
  }

  const stmt = db.prepare(
    `INSERT OR IGNORE INTO sim_simulator_availability (simulator_id, date) VALUES (?, ?)`
  );
  const batch = dates.map((date) => stmt.bind(simulatorId, date));
  await db.batch(batch);
}

/** Toggles simulator unavailability on a single date. Returns availability after toggle. */
export async function toggleSimulatorAvailability(
  db: D1Database,
  simulatorId: string,
  date: string
): Promise<boolean> {
  const unavailable = await isSimulatorUnavailableOnDate(db, simulatorId, date);
  if (unavailable) {
    await db
      .prepare(`DELETE FROM sim_simulator_availability WHERE simulator_id = ? AND date = ?`)
      .bind(simulatorId, date)
      .run();
    return true;
  }

  await db
    .prepare(`INSERT INTO sim_simulator_availability (simulator_id, date) VALUES (?, ?)`)
    .bind(simulatorId, date)
    .run();
  return false;
}

/** Removes all unavailability rows for a simulator. */
export async function deleteSimulatorAvailabilityBySimulatorId(
  db: D1Database,
  simulatorId: string
): Promise<void> {
  await db
    .prepare(`DELETE FROM sim_simulator_availability WHERE simulator_id = ?`)
    .bind(simulatorId)
    .run();
}
