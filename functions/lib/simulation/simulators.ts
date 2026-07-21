// functions/lib/simulation/simulators.ts
import {
  DEFAULT_PRINTER_CAPABILITIES,
  parseSimulatorCapabilities,
  serializeSimulatorCapabilities,
  type SimulatorCapabilities,
} from './simulator-capabilities';
import {
  parseSimulatorDailyCapacity,
  serializeSimulatorDailyCapacity,
  validateSimulatorDailyCapacityInput,
  type SimulatorDailyCapacity,
} from './simulator-daily-capacity';
import {
  getSimulatorBookingBlockMessage,
  isSimulatorBookable,
  normalizeSimulatorStatus,
  SIMULATOR_STATUS_LABELS,
  type SimulatorStatus,
} from './simulator-status';

export type { SimulatorCapabilities, SimulatorDailyCapacity, SimulatorStatus };
export { validateSimulatorDailyCapacityInput };

export interface Simulator {
  id: string;
  name: string;
  image_r2_key: string | null;
  position: number;
  capabilities_json?: string | null;
  daily_capacity_json?: string | null;
  status?: string | null;
  created_at: string;
}

export interface SimulatorApiModel {
  id: string;
  name: string;
  image_url: string | null;
  position: number;
  capabilities: SimulatorCapabilities;
  waiting_count: number;
  status: SimulatorStatus;
  bookable: boolean;
  status_label: string;
  daily_capacity: SimulatorDailyCapacity;
}

/** Formats a simulator for API responses. */
export function formatSimulatorForApi(simulator: Simulator, waitingCount = 0): SimulatorApiModel {
  const status = normalizeSimulatorStatus(simulator.status);
  return {
    id: simulator.id,
    name: simulator.name,
    image_url: simulator.image_r2_key ? `/api/simulation/simulators/${simulator.id}/image` : null,
    position: simulator.position,
    capabilities: parseSimulatorCapabilities(simulator.capabilities_json),
    waiting_count: waitingCount,
    status,
    bookable: isSimulatorBookable(status),
    status_label: SIMULATOR_STATUS_LABELS[status],
    daily_capacity: parseSimulatorDailyCapacity(simulator.daily_capacity_json),
  };
}

/** Returns booking block message for a simulator, or null if bookable. */
export function getSimulatorBookingError(simulator: Simulator | null): string | null {
  if (!simulator) return '指定されたシミュレーターが見つかりません';
  const status = normalizeSimulatorStatus(simulator.status);
  if (!isSimulatorBookable(status)) return getSimulatorBookingBlockMessage(status);
  return null;
}

/** Fetches all simulators ordered by position. */
export async function getAllSimulators(db: D1Database): Promise<Simulator[]> {
  const result = await db
    .prepare(`SELECT * FROM sim_simulators ORDER BY position ASC, created_at ASC`)
    .all<Simulator>();
  return result.results ?? [];
}

/** Fetches a simulator by ID. */
export async function getSimulatorById(db: D1Database, id: string): Promise<Simulator | null> {
  return db.prepare(`SELECT * FROM sim_simulators WHERE id = ?`).bind(id).first<Simulator>();
}

/** Returns the next position for a new simulator. */
async function getNextSimulatorPosition(db: D1Database): Promise<number> {
  const row = await db
    .prepare(`SELECT COALESCE(MAX(position), -1) + 1 AS next_position FROM sim_simulators`)
    .first<{ next_position: number }>();
  return row?.next_position ?? 0;
}

/** Inserts a new simulator. */
export async function createSimulator(
  db: D1Database,
  data: {
    id: string;
    name: string;
    image_r2_key?: string | null;
    capabilities?: SimulatorCapabilities;
    status?: SimulatorStatus;
  }
): Promise<Simulator> {
  const position = await getNextSimulatorPosition(db);
  const createdAt = new Date().toISOString();
  const capabilitiesJson = serializeSimulatorCapabilities(
    data.capabilities ?? DEFAULT_PRINTER_CAPABILITIES
  );
  const status = normalizeSimulatorStatus(data.status ?? 'available');

  await db
    .prepare(
      `INSERT INTO sim_simulators (id, name, image_r2_key, position, capabilities_json, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(data.id, data.name, data.image_r2_key ?? null, position, capabilitiesJson, status, createdAt)
    .run();

  const simulator = await getSimulatorById(db, data.id);
  if (!simulator) throw new Error('シミュレーターの作成に失敗しました');
  return simulator;
}

/** Updates simulator name. */
export async function updateSimulatorName(db: D1Database, id: string, name: string): Promise<void> {
  await db.prepare(`UPDATE sim_simulators SET name = ? WHERE id = ?`).bind(name, id).run();
}

/** Updates simulator capabilities. */
export async function updateSimulatorCapabilities(
  db: D1Database,
  id: string,
  capabilities: SimulatorCapabilities
): Promise<void> {
  await db
    .prepare(`UPDATE sim_simulators SET capabilities_json = ? WHERE id = ?`)
    .bind(serializeSimulatorCapabilities(capabilities), id)
    .run();
}

/** Updates simulator daily capacity. */
export async function updateSimulatorDailyCapacity(
  db: D1Database,
  id: string,
  capacity: SimulatorDailyCapacity
): Promise<void> {
  await db
    .prepare(`UPDATE sim_simulators SET daily_capacity_json = ? WHERE id = ?`)
    .bind(serializeSimulatorDailyCapacity(capacity), id)
    .run();
}

/** Updates simulator status. */
export async function updateSimulatorStatus(
  db: D1Database,
  id: string,
  status: SimulatorStatus
): Promise<void> {
  await db.prepare(`UPDATE sim_simulators SET status = ? WHERE id = ?`).bind(status, id).run();
}

/** Updates simulator image R2 key. */
export async function updateSimulatorImage(
  db: D1Database,
  id: string,
  imageR2Key: string | null
): Promise<void> {
  await db
    .prepare(`UPDATE sim_simulators SET image_r2_key = ? WHERE id = ?`)
    .bind(imageR2Key, id)
    .run();
}

/** Counts reservations referencing a simulator. */
export async function countReservationsBySimulatorId(db: D1Database, simulatorId: string): Promise<number> {
  const row = await db
    .prepare(`SELECT COUNT(*) AS count FROM sim_reservations WHERE simulator_id = ?`)
    .bind(simulatorId)
    .first<{ count: number }>();
  return row?.count ?? 0;
}

/** Deletes a simulator when it has no reservations. */
export async function deleteSimulator(db: D1Database, id: string): Promise<boolean> {
  const result = await db.prepare(`DELETE FROM sim_simulators WHERE id = ?`).bind(id).run();
  return (result.meta.changes ?? 0) > 0;
}
