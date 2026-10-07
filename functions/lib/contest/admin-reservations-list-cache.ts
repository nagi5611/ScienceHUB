/**
 * 造形物コンテスト管理 — 予約一覧 API の D1 一時キャッシュ（hub_schedule_list_cache を流用）
 */

import { now } from "../types";

export interface ContestAdminReservationsListResult {
  reservations: Record<string, unknown>[];
}

export interface ContestAdminReservationsListApiPayload
  extends ContestAdminReservationsListResult {
  stale?: boolean;
  read_only?: boolean;
  cache_updated_at?: number;
}

const CACHE_KEY_ALL = "contest-mgmt:admin-reservations:all";
const CACHE_KEY_USER_PREFIX = "contest-mgmt:admin-reservations:user:";

/** 予約者フィルタ付き GET 用の cache_key */
export function buildContestAdminReservationsCacheKey(
  filterUserId: string | null
): string {
  const trimmed = filterUserId?.trim();
  if (trimmed) return `${CACHE_KEY_USER_PREFIX}${trimmed}`;
  return CACHE_KEY_ALL;
}

function parseCachedPayload(raw: string): ContestAdminReservationsListResult | null {
  try {
    const parsed = JSON.parse(raw) as ContestAdminReservationsListResult;
    if (!parsed || !Array.isArray(parsed.reservations)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/** キャッシュを取得 */
export async function getContestAdminReservationsListCache(
  db: D1Database,
  adminUserId: string,
  cacheKey: string
): Promise<{ payload: ContestAdminReservationsListResult; updated_at: number } | null> {
  const row = await db
    .prepare(
      `SELECT payload_json, updated_at
       FROM hub_schedule_list_cache
       WHERE user_id = ? AND cache_key = ?
       LIMIT 1`
    )
    .bind(adminUserId, cacheKey)
    .first<{ payload_json: string; updated_at: number }>();

  if (!row) return null;

  const payload = parseCachedPayload(row.payload_json);
  if (!payload) {
    await db
      .prepare(
        `DELETE FROM hub_schedule_list_cache WHERE user_id = ? AND cache_key = ?`
      )
      .bind(adminUserId, cacheKey)
      .run();
    return null;
  }

  return { payload, updated_at: row.updated_at };
}

/** キャッシュを保存 */
export async function setContestAdminReservationsListCache(
  db: D1Database,
  adminUserId: string,
  cacheKey: string,
  payload: ContestAdminReservationsListResult
): Promise<void> {
  const updatedAt = now();
  await db
    .prepare(
      `INSERT INTO hub_schedule_list_cache (user_id, cache_key, payload_json, updated_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT (user_id, cache_key) DO UPDATE SET
         payload_json = excluded.payload_json,
         updated_at = excluded.updated_at`
    )
    .bind(adminUserId, cacheKey, JSON.stringify(payload), updatedAt)
    .run();
}

/** 管理画面の予約一覧キャッシュを削除（任意の書き込み後） */
export async function invalidateContestAdminReservationsListCache(
  db: D1Database,
  adminUserId: string
): Promise<void> {
  await db
    .prepare(
      `DELETE FROM hub_schedule_list_cache
       WHERE user_id = ? AND cache_key LIKE 'contest-mgmt:admin-reservations:%'`
    )
    .bind(adminUserId)
    .run();
}
