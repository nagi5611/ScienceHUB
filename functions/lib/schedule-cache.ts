/**
 * スケジュール一覧 API の D1 一時キャッシュ
 */

import { now } from "./types";
import type { PublicScheduleEvent, ScheduleListResult } from "./schedule";

export interface ScheduleListApiPayload extends ScheduleListResult {
  stale?: boolean;
  read_only?: boolean;
  cache_updated_at?: number;
}

export function buildScheduleListCacheKey(
  from: string,
  to: string,
  scope: "mine" | "all"
): string {
  return `${from}:${to}:${scope}`;
}

function parseCachedPayload(raw: string): ScheduleListResult | null {
  try {
    const parsed = JSON.parse(raw) as ScheduleListResult;
    if (!parsed || !Array.isArray(parsed.events)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/** キャッシュを取得 */
export async function getScheduleListCache(
  db: D1Database,
  userId: string,
  from: string,
  to: string,
  scope: "mine" | "all"
): Promise<{ payload: ScheduleListResult; updated_at: number } | null> {
  const cacheKey = buildScheduleListCacheKey(from, to, scope);
  const row = await db
    .prepare(
      `SELECT payload_json, updated_at
       FROM hub_schedule_list_cache
       WHERE user_id = ? AND cache_key = ?
       LIMIT 1`
    )
    .bind(userId, cacheKey)
    .first<{ payload_json: string; updated_at: number }>();

  if (!row) return null;

  const payload = parseCachedPayload(row.payload_json);
  if (!payload) {
    await db
      .prepare(
        `DELETE FROM hub_schedule_list_cache WHERE user_id = ? AND cache_key = ?`
      )
      .bind(userId, cacheKey)
      .run();
    return null;
  }

  return { payload, updated_at: row.updated_at };
}

/** キャッシュを保存 */
export async function setScheduleListCache(
  db: D1Database,
  userId: string,
  from: string,
  to: string,
  scope: "mine" | "all",
  payload: ScheduleListResult
): Promise<void> {
  const cacheKey = buildScheduleListCacheKey(from, to, scope);
  const updatedAt = now();
  await db
    .prepare(
      `INSERT INTO hub_schedule_list_cache (user_id, cache_key, payload_json, updated_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT (user_id, cache_key) DO UPDATE SET
         payload_json = excluded.payload_json,
         updated_at = excluded.updated_at`
    )
    .bind(userId, cacheKey, JSON.stringify(payload), updatedAt)
    .run();
}

function dateInRange(date: string, from: string, to: string): boolean {
  return date >= from && date <= to;
}

/** ユーザー全キャッシュの events をパッチ */
async function patchAllScheduleListCaches(
  db: D1Database,
  userId: string,
  patchEvents: (
    events: PublicScheduleEvent[],
    from: string,
    to: string
  ) => PublicScheduleEvent[]
): Promise<void> {
  const rows = await db
    .prepare(
      `SELECT cache_key, payload_json, updated_at
       FROM hub_schedule_list_cache
       WHERE user_id = ?`
    )
    .bind(userId)
    .all<{ cache_key: string; payload_json: string; updated_at: number }>();

  const timestamp = now();
  for (const row of rows.results ?? []) {
    const payload = parseCachedPayload(row.payload_json);
    if (!payload) continue;

    const parts = row.cache_key.split(":");
    if (parts.length < 3) continue;
    const from = parts[0];
    const to = parts[1];

    const nextEvents = patchEvents(payload.events, from, to);
    const nextPayload: ScheduleListResult = {
      ...payload,
      events: nextEvents,
    };

    await db
      .prepare(
        `UPDATE hub_schedule_list_cache
         SET payload_json = ?, updated_at = ?
         WHERE user_id = ? AND cache_key = ?`
      )
      .bind(JSON.stringify(nextPayload), timestamp, userId, row.cache_key)
      .run();
  }
}

/** HUB 予定作成後にキャッシュへ反映 */
export async function scheduleCacheAfterHubCreate(
  db: D1Database,
  userId: string,
  event: PublicScheduleEvent
): Promise<void> {
  await patchAllScheduleListCaches(db, userId, (events, from, to) => {
    if (!dateInRange(event.event_date, from, to)) {
      return events;
    }
    const filtered = events.filter((e) => e.id !== event.id);
    filtered.push(event);
    filtered.sort(comparePublicScheduleEvents);
    return filtered;
  });
}

/** HUB 予定更新後にキャッシュへ反映 */
export async function scheduleCacheAfterHubUpdate(
  db: D1Database,
  userId: string,
  event: PublicScheduleEvent
): Promise<void> {
  await patchAllScheduleListCaches(db, userId, (events, from, to) => {
    const without = events.filter((e) => e.id !== event.id);
    if (!dateInRange(event.event_date, from, to)) {
      return without;
    }
    without.push(event);
    without.sort(comparePublicScheduleEvents);
    return without;
  });
}

/** HUB / Google 予定削除後にキャッシュから除去 */
export async function scheduleCacheAfterEventDelete(
  db: D1Database,
  userId: string,
  eventId: string
): Promise<void> {
  await patchAllScheduleListCaches(db, userId, (events) =>
    events.filter((e) => e.id !== eventId)
  );
}

/** Google 直書き予定 ID プレフィックス付き削除 */
export async function scheduleCacheAfterGoogleDelete(
  db: D1Database,
  userId: string,
  googleEventId: string
): Promise<void> {
  const prefix = `gcal_${googleEventId}_`;
  await patchAllScheduleListCaches(db, userId, (events) =>
    events.filter((e) => !e.id.startsWith(prefix))
  );
}

/** ユーザーのスケジュール一覧キャッシュをすべて削除 */
export async function invalidateScheduleListCacheForUser(
  db: D1Database,
  userId: string
): Promise<void> {
  await db
    .prepare(`DELETE FROM hub_schedule_list_cache WHERE user_id = ?`)
    .bind(userId)
    .run();
}

function comparePublicScheduleEvents(
  a: PublicScheduleEvent,
  b: PublicScheduleEvent
): number {
  if (a.event_date !== b.event_date) {
    return a.event_date.localeCompare(b.event_date);
  }
  const aAll = a.is_all_day ? 0 : 1;
  const bAll = b.is_all_day ? 0 : 1;
  if (aAll !== bAll) return aAll - bAll;
  const aStart = a.start_time ?? "";
  const bStart = b.start_time ?? "";
  if (aStart !== bStart) return aStart.localeCompare(bStart);
  return a.title.localeCompare(b.title, "ja");
}
