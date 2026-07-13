// functions/lib/3dprint/printer-availability.ts

export interface PrinterAvailabilityRow {
  printer_id: string;
  date: string;
}

/** Fetches printer availability rows in a date range. */
export async function getPrinterAvailabilityInRange(
  db: D1Database,
  startDate: string,
  endDate: string
): Promise<PrinterAvailabilityRow[]> {
  const result = await db
    .prepare(
      `SELECT printer_id, date FROM print_printer_availability
       WHERE date >= ? AND date <= ?
       ORDER BY date ASC, printer_id ASC`
    )
    .bind(startDate, endDate)
    .all<PrinterAvailabilityRow>();
  return result.results ?? [];
}

/** Returns printer IDs available on a date. */
export async function getAvailablePrinterIdsOnDate(
  db: D1Database,
  date: string
): Promise<string[]> {
  const result = await db
    .prepare(`SELECT printer_id FROM print_printer_availability WHERE date = ?`)
    .bind(date)
    .all<{ printer_id: string }>();
  return (result.results ?? []).map((row) => row.printer_id);
}

/** Returns whether any printer is scheduled on a date. */
export async function hasAnyPrinterOnDate(db: D1Database, date: string): Promise<boolean> {
  const row = await db
    .prepare(`SELECT 1 AS ok FROM print_printer_availability WHERE date = ? LIMIT 1`)
    .bind(date)
    .first<{ ok: number }>();
  return !!row;
}

/** Returns whether a printer is scheduled on a date. */
export async function isPrinterAvailableOnDate(
  db: D1Database,
  printerId: string,
  date: string
): Promise<boolean> {
  const row = await db
    .prepare(`SELECT 1 AS ok FROM print_printer_availability WHERE printer_id = ? AND date = ?`)
    .bind(printerId, date)
    .first<{ ok: number }>();
  return !!row;
}

/** Sets printer availability for multiple dates. */
export async function setPrinterAvailability(
  db: D1Database,
  printerId: string,
  dates: string[],
  available: boolean
): Promise<void> {
  if (!dates.length) return;

  if (available) {
    const stmt = db.prepare(
      `INSERT OR IGNORE INTO print_printer_availability (printer_id, date) VALUES (?, ?)`
    );
    const batch = dates.map((date) => stmt.bind(printerId, date));
    await db.batch(batch);
    return;
  }

  const placeholders = dates.map(() => '?').join(',');
  await db
    .prepare(
      `DELETE FROM print_printer_availability WHERE printer_id = ? AND date IN (${placeholders})`
    )
    .bind(printerId, ...dates)
    .run();
}

/** Toggles printer availability on a single date. */
export async function togglePrinterAvailability(
  db: D1Database,
  printerId: string,
  date: string
): Promise<boolean> {
  const exists = await isPrinterAvailableOnDate(db, printerId, date);
  if (exists) {
    await db
      .prepare(`DELETE FROM print_printer_availability WHERE printer_id = ? AND date = ?`)
      .bind(printerId, date)
      .run();
    return false;
  }

  await db
    .prepare(`INSERT INTO print_printer_availability (printer_id, date) VALUES (?, ?)`)
    .bind(printerId, date)
    .run();
  return true;
}

/** Removes all availability rows for a printer. */
export async function deletePrinterAvailabilityByPrinterId(
  db: D1Database,
  printerId: string
): Promise<void> {
  await db
    .prepare(`DELETE FROM print_printer_availability WHERE printer_id = ?`)
    .bind(printerId)
    .run();
}
