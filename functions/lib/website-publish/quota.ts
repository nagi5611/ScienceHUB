/**
 * ウェブサイト公開 — クォータ
 */

import { MAX_SITE_BYTES } from "./constants";
import { now } from "../types";

export interface WebSiteRow {
  id: string;
  owner_user_id: string;
  path_slug: string;
  title: string;
  dir_name: string;
  r2_prefix: string;
  used_bytes: number;
  status: string;
  visit_count: number;
  last_visit_at: number | null;
  created_at: number;
  updated_at: number;
}

/** 追加バイトを割り当て可能か */
export function canAllocateSiteBytes(site: WebSiteRow, additionalBytes: number): boolean {
  return site.used_bytes + additionalBytes <= MAX_SITE_BYTES;
}

/** 使用量を加算 */
export async function addSiteUsedBytes(
  db: D1Database,
  siteId: string,
  delta: number
): Promise<void> {
  const ts = now();
  await db
    .prepare(
      `UPDATE web_sites SET used_bytes = used_bytes + ?, updated_at = ? WHERE id = ?`
    )
    .bind(delta, ts, siteId)
    .run();
}

/** 使用量を再計算して設定 */
export async function recalcSiteUsedBytes(
  db: D1Database,
  bucket: R2Bucket,
  site: WebSiteRow
): Promise<number> {
  let total = 0;
  let cursor: string | undefined;

  do {
    const listed = await bucket.list({ prefix: site.r2_prefix, cursor });
    for (const obj of listed.objects) {
      total += obj.size;
    }
    cursor = listed.truncated ? listed.cursor : undefined;
  } while (cursor);

  const ts = now();
  await db
    .prepare(`UPDATE web_sites SET used_bytes = ?, updated_at = ? WHERE id = ?`)
    .bind(total, ts, site.id)
    .run();

  return total;
}
