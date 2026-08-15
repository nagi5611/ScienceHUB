/**
 * ウェブサイト公開 — 訪問数
 */

import { now } from "../types";

/** HTML ページビューを記録（静的アセットは除外） */
export async function recordSitePageView(
  db: D1Database,
  siteId: string
): Promise<void> {
  const ts = now();
  await db
    .prepare(
      `UPDATE web_sites SET visit_count = visit_count + 1, last_visit_at = ?, updated_at = updated_at WHERE id = ?`
    )
    .bind(ts, siteId)
    .run();
}

/** 配信パスがページビューとして数える対象か */
export function isPageViewServePath(relativePath: string): boolean {
  if (!relativePath || relativePath === "index.html") return true;
  if (relativePath.endsWith("/")) return true;
  const last = relativePath.split("/").pop() ?? "";
  return !last.includes(".");
}
