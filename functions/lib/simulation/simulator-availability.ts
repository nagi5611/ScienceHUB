// functions/lib/simulation/simulator-availability.ts

export interface SimulatorAvailabilityRow {
  simulator_id: string;
  date: string;
}

/** Fetches simulator availability rows in a date range. */
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

/** Returns simulator IDs available on a date. */
export async function getAvailableSimulatorIdsOnDate(
  db: D1Database,
  date: string
): Promise<string[]> {
  const result = await db
    .prepare(`SELECT simulator_id FROM sim_simulator_availability WHERE date = ?`)
    .bind(date)
    .all<{ simulator_id: string }>();
  return (result.results ?? []).map((row) => row.simulator_id);
}

/** Returns whether any simulator is scheduled on a date. */
export async function hasAnySimulatorOnDate(db: D1Database, date: string): Promise<boolean> {
  const row = await db
    .prepare(`SELECT 1 AS ok FROM sim_simulator_availability WHERE date = ? LIMIT 1`)
    .bind(date)
    .first<{ ok: number }>();
  return !!row;
}

/** Returns whether a simulator is scheduled on a date. */
export async function isSimulatorAvailableOnDate(
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

/** Sets simulator availability for multiple dates. */
export async function setSimulatorAvailability(
  db: D1Database,
  simulatorId: string,
  dates: string[],
  available: boolean
): Promise<void> {
  if (!dates.length) return;

  if (available) {
    const stmt = db.prepare(
      `INSERT OR IGNORE INTO sim_simulator_availability (simulator_id, date) VALUES (?, ?)`
    );
    const batch = dates.map((date) => stmt.bind(simulatorId, date));
    await db.batch(batch);
    return;
  }

  const placeholders = dates.map(() => '?').join(',');
  await db
    .prepare(
      `DELETE FROM sim_simulator_availability WHERE simulator_id = ? AND date IN (${placeholders})`
    )
    .bind(simulatorId, ...dates)
    .run();
}

/** Toggles simulator availability on a single date. */
export async function toggleSimulatorAvailability(
  db: D1Database,
  simulatorId: string,
  date: string
): Promise<boolean> {
  const exists = await isSimulatorAvailableOnDate(db, simulatorId, date);
  if (exists) {
    await db
      .prepare(`DELETE FROM sim_simulator_availability WHERE simulator_id = ? AND date = ?`)
      .bind(simulatorId, date)
      .run();
    return false;
  }

  await db
    .prepare(`INSERT INTO sim_simulator_availability (simulator_id, date) VALUES (?, ?)`)
    .bind(simulatorId, date)
    .run();
  return true;
}

/** Removes all availability rows for a simulator. */
export async function deleteSimulatorAvailabilityBySimulatorId(
  db: D1Database,
  simulatorId: string
): Promise<void> {
  await db
    .prepare(`DELETE FROM sim_simulator_availability WHERE simulator_id = ?`)
    .bind(simulatorId)
    .run();
}
