// functions/lib/contest/contest-stl-parts.ts

export interface ContestApplicationStlPart {
  id: string;
  application_id: string;
  part_index: number;
  stl_r2_key: string;
  stl_filename: string;
  stl_size_bytes: number;
  contest_storage_path: string | null;
  contest_storage_filename: string | null;
}

export interface ContestStlPartInput {
  stl_r2_key: string;
  stl_filename: string;
  stl_size_bytes: number;
}

/** Loads STL parts with part_index >= 2 (part 1 lives on contest_applications). */
export async function listContestApplicationStlParts(
  db: D1Database,
  applicationId: string
): Promise<ContestApplicationStlPart[]> {
  const result = await db
    .prepare(
      `SELECT id, application_id, part_index, stl_r2_key, stl_filename, stl_size_bytes,
              contest_storage_path, contest_storage_filename
       FROM contest_application_stl_parts
       WHERE application_id = ?
       ORDER BY part_index ASC`
    )
    .bind(applicationId)
    .all<ContestApplicationStlPart>();
  return result.results ?? [];
}

/** Replaces extra STL parts (indexes 2..n) for an application. */
export async function replaceContestApplicationStlParts(
  db: D1Database,
  applicationId: string,
  parts: Array<ContestStlPartInput & { part_index: number }>
): Promise<void> {
  await db
    .prepare(`DELETE FROM contest_application_stl_parts WHERE application_id = ?`)
    .bind(applicationId)
    .run();

  for (const part of parts) {
    await db
      .prepare(
        `INSERT INTO contest_application_stl_parts (
          id, application_id, part_index, stl_r2_key, stl_filename, stl_size_bytes
        ) VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(
        crypto.randomUUID(),
        applicationId,
        part.part_index,
        part.stl_r2_key,
        part.stl_filename,
        part.stl_size_bytes
      )
      .run();
  }
}

export async function updateContestApplicationStlPartStorage(
  db: D1Database,
  partId: string,
  data: { contest_storage_path: string; contest_storage_filename: string }
): Promise<void> {
  await db
    .prepare(
      `UPDATE contest_application_stl_parts
       SET contest_storage_path = ?, contest_storage_filename = ?
       WHERE id = ?`
    )
    .bind(data.contest_storage_path, data.contest_storage_filename, partId)
    .run();
}
