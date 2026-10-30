export type AdminLogRow = {
  id: string;
  at: string;
  actor: string;
  type: string;
  text: string;
  app_id: string | null;
  created_at: string;
};

export async function insertAdminLog(
  db: D1Database,
  entry: { actor: string; type: string; text: string; app_id?: string | null }
): Promise<AdminLogRow> {
  const id = crypto.randomUUID();
  const at = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO print_admin_log (id, at, actor, type, text, app_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(id, at, entry.actor, entry.type, entry.text, entry.app_id ?? null, at)
    .run();
  return { id, at, actor: entry.actor, type: entry.type, text: entry.text, app_id: entry.app_id ?? null, created_at: at };
}

export async function listAdminLog(db: D1Database, limit = 100): Promise<AdminLogRow[]> {
  const cap = Math.min(Math.max(limit, 1), 500);
  const res = await db
    .prepare(`SELECT id, at, actor, type, text, app_id, created_at FROM print_admin_log ORDER BY at DESC LIMIT ?`)
    .bind(cap)
    .all<AdminLogRow>();
  return res.results ?? [];
}
