export const MAX_PRINT_RESERVATION_FILES = 10;

export type PrintReservationFileRow = {
  id: string;
  reservation_id: string;
  file_index: number;
  r2_key: string;
  filename: string;
  size_bytes: number;
  created_at: string;
};

export type PrintReservationFileInput = {
  r2_key: string;
  filename: string;
  size_bytes: number;
};

/** Lists print files for a reservation ordered by file_index. */
export async function listPrintReservationFiles(
  db: D1Database,
  reservationId: string
): Promise<PrintReservationFileRow[]> {
  const result = await db
    .prepare(
      `SELECT id, reservation_id, file_index, r2_key, filename, size_bytes, created_at
       FROM print_reservation_files
       WHERE reservation_id = ?
       ORDER BY file_index ASC`
    )
    .bind(reservationId)
    .all<PrintReservationFileRow>();
  return result.results ?? [];
}

/** Loads print files for many reservations (single query). */
export async function listPrintReservationFilesByReservationIds(
  db: D1Database,
  reservationIds: string[]
): Promise<Map<string, PrintReservationFileRow[]>> {
  const map = new Map<string, PrintReservationFileRow[]>();
  if (!reservationIds.length) return map;
  const placeholders = reservationIds.map(() => '?').join(', ');
  const result = await db
    .prepare(
      `SELECT id, reservation_id, file_index, r2_key, filename, size_bytes, created_at
       FROM print_reservation_files
       WHERE reservation_id IN (${placeholders})
       ORDER BY reservation_id, file_index ASC`
    )
    .bind(...reservationIds)
    .all<PrintReservationFileRow>();
  for (const row of result.results ?? []) {
    const list = map.get(row.reservation_id) ?? [];
    list.push(row);
    map.set(row.reservation_id, list);
  }
  return map;
}

export async function getPrintReservationFileById(
  db: D1Database,
  fileId: string
): Promise<PrintReservationFileRow | null> {
  const row = await db
    .prepare(
      `SELECT id, reservation_id, file_index, r2_key, filename, size_bytes, created_at
       FROM print_reservation_files WHERE id = ?`
    )
    .bind(fileId)
    .first<PrintReservationFileRow>();
  return row ?? null;
}

/** Replaces all print files for a reservation (used on create). */
export async function replacePrintReservationFiles(
  db: D1Database,
  reservationId: string,
  files: PrintReservationFileInput[],
  createdAt: string
): Promise<void> {
  await db
    .prepare(`DELETE FROM print_reservation_files WHERE reservation_id = ?`)
    .bind(reservationId)
    .run();
  for (let i = 0; i < files.length; i++) {
    const f = files[i]!;
    await db
      .prepare(
        `INSERT INTO print_reservation_files (
          id, reservation_id, file_index, r2_key, filename, size_bytes, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        crypto.randomUUID(),
        reservationId,
        i,
        f.r2_key,
        f.filename,
        f.size_bytes,
        createdAt
      )
      .run();
  }
}
