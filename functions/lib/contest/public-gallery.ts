// functions/lib/contest/public-gallery.ts
/** Public contest gallery: title + model only (no PII). */

export interface ContestPublicGalleryEntry {
  id: string;
  title: string;
  model_filename: string;
  model_size_bytes: number;
}

type GalleryModelRow = {
  id: string;
  title: string;
  self_print: number;
  stl_r2_key: string | null;
  stl_filename: string | null;
  stl_size_bytes: number | null;
  status: string;
};

type GalleryReservationStlRow = {
  stl_r2_key: string;
  stl_filename: string;
  stl_size_bytes: number;
};

const GALLERY_LIST_SQL = `
SELECT
  ca.id,
  ca.title,
  CASE
    WHEN ca.self_print = 1 THEN ca.stl_filename
    ELSE pr.stl_filename
  END AS model_filename,
  CASE
    WHEN ca.self_print = 1 THEN ca.stl_size_bytes
    ELSE pr.stl_size_bytes
  END AS model_size_bytes
FROM contest_applications ca
LEFT JOIN print_reservations pr ON pr.id = (
  SELECT id FROM print_reservations
  WHERE contest_application_id = ca.id
    AND source = 'contest'
    AND status != 'cancelled'
    AND stl_r2_key IS NOT NULL
    AND TRIM(stl_r2_key) != ''
  ORDER BY created_at DESC
  LIMIT 1
)
WHERE ca.status = 'approved'
  AND (
    (ca.self_print = 1 AND ca.stl_r2_key IS NOT NULL AND ca.stl_submitted_at IS NOT NULL)
    OR (ca.self_print = 0 AND pr.stl_r2_key IS NOT NULL)
  )
ORDER BY COALESCE(
  ca.stl_submitted_at,
  (
    SELECT MAX(l.uploaded_at)
    FROM contest_stl_submission_logs l
    WHERE l.contest_application_id = ca.id
  ),
  pr.created_at,
  ca.created_at
) DESC
LIMIT 500
`;

/** Lists gallery entries safe for all contest-entry users (no names, class, or impressions). */
export async function listContestPublicGallery(
  db: D1Database
): Promise<ContestPublicGalleryEntry[]> {
  const result = await db.prepare(GALLERY_LIST_SQL).all<{
    id: string;
    title: string;
    model_filename: string | null;
    model_size_bytes: number | null;
  }>();

  const rows = result.results ?? [];
  const entries: ContestPublicGalleryEntry[] = [];

  for (const row of rows) {
    const filename = row.model_filename?.trim();
    if (!filename) continue;
    const size = row.model_size_bytes;
    if (size == null || !Number.isFinite(size) || size < 0) continue;
    entries.push({
      id: row.id,
      title: row.title,
      model_filename: filename,
      model_size_bytes: size,
    });
  }

  return entries;
}

async function loadGalleryApplicationRow(
  db: D1Database,
  applicationId: string
): Promise<GalleryModelRow | null> {
  return (
    await db
      .prepare(
        `SELECT id, title, self_print, stl_r2_key, stl_filename, stl_size_bytes, status
         FROM contest_applications
         WHERE id = ?`
      )
      .bind(applicationId)
      .first<GalleryModelRow>()
  ) ?? null;
}

async function loadLatestReservationStl(
  db: D1Database,
  applicationId: string
): Promise<GalleryReservationStlRow | null> {
  return (
    await db
      .prepare(
        `SELECT stl_r2_key, stl_filename, stl_size_bytes
         FROM print_reservations
         WHERE contest_application_id = ?
           AND source = 'contest'
           AND status != 'cancelled'
           AND stl_r2_key IS NOT NULL
           AND TRIM(stl_r2_key) != ''
         ORDER BY created_at DESC
         LIMIT 1`
      )
      .bind(applicationId)
      .first<GalleryReservationStlRow>()
  ) ?? null;
}

/** Resolves R2 key for a gallery model download (server-side only). */
export async function resolveContestGalleryModelFile(
  db: D1Database,
  applicationId: string
): Promise<{ r2_key: string; filename: string } | null> {
  const app = await loadGalleryApplicationRow(db, applicationId);
  if (!app || app.status !== 'approved') {
    return null;
  }

  if (app.self_print === 1) {
    const key = app.stl_r2_key?.trim();
    const filename = app.stl_filename?.trim();
    if (!key || !filename) return null;
    return { r2_key: key, filename };
  }

  const reservation = await loadLatestReservationStl(db, applicationId);
  if (!reservation) return null;
  const key = reservation.stl_r2_key.trim();
  const filename = reservation.stl_filename.trim();
  if (!key || !filename) return null;
  return { r2_key: key, filename };
}
