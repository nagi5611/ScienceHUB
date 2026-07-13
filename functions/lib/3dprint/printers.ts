// functions/lib/3dprint/printers.ts
import {
  DEFAULT_PRINTER_CAPABILITIES,
  parsePrinterCapabilities,
  serializePrinterCapabilities,
  type PrinterCapabilities,
} from './printer-capabilities';
import {
  parsePrinterDailyCapacity,
  serializePrinterDailyCapacity,
  validatePrinterDailyCapacityInput,
  type PrinterDailyCapacity,
} from './printer-daily-capacity';
import {
  getPrinterBookingBlockMessage,
  isPrinterBookable,
  normalizePrinterStatus,
  PRINTER_STATUS_LABELS,
  type PrinterStatus,
} from './printer-status';

export type { PrinterCapabilities, PrinterDailyCapacity, PrinterStatus };
export { validatePrinterDailyCapacityInput };

export interface Printer {
  id: string;
  name: string;
  image_r2_key: string | null;
  position: number;
  capabilities_json?: string | null;
  daily_capacity_json?: string | null;
  status?: string | null;
  created_at: string;
}

export interface PrinterApiModel {
  id: string;
  name: string;
  image_url: string | null;
  position: number;
  capabilities: PrinterCapabilities;
  waiting_count: number;
  status: PrinterStatus;
  bookable: boolean;
  status_label: string;
  daily_capacity: PrinterDailyCapacity;
}

/** Formats a printer for API responses. */
export function formatPrinterForApi(printer: Printer, waitingCount = 0): PrinterApiModel {
  const status = normalizePrinterStatus(printer.status);
  return {
    id: printer.id,
    name: printer.name,
    image_url: printer.image_r2_key ? `/api/3dprint/printers/${printer.id}/image` : null,
    position: printer.position,
    capabilities: parsePrinterCapabilities(printer.capabilities_json),
    waiting_count: waitingCount,
    status,
    bookable: isPrinterBookable(status),
    status_label: PRINTER_STATUS_LABELS[status],
    daily_capacity: parsePrinterDailyCapacity(printer.daily_capacity_json),
  };
}

/** Returns booking block message for a printer, or null if bookable. */
export function getPrinterBookingError(printer: Printer | null): string | null {
  if (!printer) return '指定されたプリンターが見つかりません';
  const status = normalizePrinterStatus(printer.status);
  if (!isPrinterBookable(status)) return getPrinterBookingBlockMessage(status);
  return null;
}

/** Fetches all printers ordered by position. */
export async function getAllPrinters(db: D1Database): Promise<Printer[]> {
  const result = await db
    .prepare(`SELECT * FROM print_printers ORDER BY position ASC, created_at ASC`)
    .all<Printer>();
  return result.results ?? [];
}

/** Fetches a printer by ID. */
export async function getPrinterById(db: D1Database, id: string): Promise<Printer | null> {
  return db.prepare(`SELECT * FROM print_printers WHERE id = ?`).bind(id).first<Printer>();
}

/** Returns the next position for a new printer. */
async function getNextPrinterPosition(db: D1Database): Promise<number> {
  const row = await db
    .prepare(`SELECT COALESCE(MAX(position), -1) + 1 AS next_position FROM print_printers`)
    .first<{ next_position: number }>();
  return row?.next_position ?? 0;
}

/** Inserts a new printer. */
export async function createPrinter(
  db: D1Database,
  data: {
    id: string;
    name: string;
    image_r2_key?: string | null;
    capabilities?: PrinterCapabilities;
    status?: PrinterStatus;
  }
): Promise<Printer> {
  const position = await getNextPrinterPosition(db);
  const createdAt = new Date().toISOString();
  const capabilitiesJson = serializePrinterCapabilities(
    data.capabilities ?? DEFAULT_PRINTER_CAPABILITIES
  );
  const status = normalizePrinterStatus(data.status ?? 'available');

  await db
    .prepare(
      `INSERT INTO print_printers (id, name, image_r2_key, position, capabilities_json, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(data.id, data.name, data.image_r2_key ?? null, position, capabilitiesJson, status, createdAt)
    .run();

  const printer = await getPrinterById(db, data.id);
  if (!printer) throw new Error('プリンターの作成に失敗しました');
  return printer;
}

/** Updates printer name. */
export async function updatePrinterName(db: D1Database, id: string, name: string): Promise<void> {
  await db.prepare(`UPDATE print_printers SET name = ? WHERE id = ?`).bind(name, id).run();
}

/** Updates printer capabilities. */
export async function updatePrinterCapabilities(
  db: D1Database,
  id: string,
  capabilities: PrinterCapabilities
): Promise<void> {
  await db
    .prepare(`UPDATE print_printers SET capabilities_json = ? WHERE id = ?`)
    .bind(serializePrinterCapabilities(capabilities), id)
    .run();
}

/** Updates printer daily capacity. */
export async function updatePrinterDailyCapacity(
  db: D1Database,
  id: string,
  capacity: PrinterDailyCapacity
): Promise<void> {
  await db
    .prepare(`UPDATE print_printers SET daily_capacity_json = ? WHERE id = ?`)
    .bind(serializePrinterDailyCapacity(capacity), id)
    .run();
}

/** Updates printer status. */
export async function updatePrinterStatus(
  db: D1Database,
  id: string,
  status: PrinterStatus
): Promise<void> {
  await db.prepare(`UPDATE print_printers SET status = ? WHERE id = ?`).bind(status, id).run();
}

/** Updates printer image R2 key. */
export async function updatePrinterImage(
  db: D1Database,
  id: string,
  imageR2Key: string | null
): Promise<void> {
  await db
    .prepare(`UPDATE print_printers SET image_r2_key = ? WHERE id = ?`)
    .bind(imageR2Key, id)
    .run();
}

/** Counts reservations referencing a printer. */
export async function countReservationsByPrinterId(db: D1Database, printerId: string): Promise<number> {
  const row = await db
    .prepare(`SELECT COUNT(*) AS count FROM print_reservations WHERE printer_id = ?`)
    .bind(printerId)
    .first<{ count: number }>();
  return row?.count ?? 0;
}

/** Deletes a printer when it has no reservations. */
export async function deletePrinter(db: D1Database, id: string): Promise<boolean> {
  const result = await db.prepare(`DELETE FROM print_printers WHERE id = ?`).bind(id).run();
  return (result.meta.changes ?? 0) > 0;
}
