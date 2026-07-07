/**
 * Google Calendar API 連携（予定のプッシュ同期）
 */

import type { Env } from "./types";
import { now } from "./types";
import { getRootGroup, resolveRootCalendarDisplayName } from "./groups";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const CALENDAR_API = "https://www.googleapis.com/calendar/v3";

export interface GoogleCalendarConfig {
  enabled: boolean;
  all_groups_calendar_id: string | null;
  all_groups_calendar_name: string;
  root_group_id: string | null;
  root_group_color: string | null;
}

export interface ScheduleEventForGoogle {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  is_all_day: boolean;
  start_time: string | null;
  end_time: string | null;
  group_display_name: string;
  group_color: string;
}

interface GoogleCalendarEventBody {
  summary: string;
  description?: string;
  start: { date?: string; dateTime?: string; timeZone?: string };
  end: { date?: string; dateTime?: string; timeZone?: string };
  colorId?: string;
  extendedProperties?: {
    private?: Record<string, string>;
  };
}

/** カレンダー連携用 OAuth クライアント認証情報 */
export function getGoogleCalendarOAuthClient(
  env: Env
): { clientId: string; clientSecret: string } | null {
  const clientId =
    env.GOOGLE_CALENDAR_CLIENT_ID?.trim() || env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret =
    env.GOOGLE_CALENDAR_CLIENT_SECRET?.trim() ||
    env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

/** 設定が有効か（リフレッシュトークンが設定されているか） */
export function hasGoogleCalendarRefreshToken(env: Env): boolean {
  return Boolean(env.GOOGLE_CALENDAR_REFRESH_TOKEN?.trim());
}

/** 設定が有効か（リフレッシュトークン + 全体カレンダー ID） */
export function isGoogleCalendarConfigured(env: Env): boolean {
  return hasGoogleCalendarRefreshToken(env);
}

/** DB + 環境変数 + ルートグループから連携設定を取得 */
export async function getGoogleCalendarConfig(
  db: D1Database,
  env: Env
): Promise<GoogleCalendarConfig> {
  const rootGroup = await getRootGroup(db);

  const nameRow = await db
    .prepare(
      "SELECT value FROM hub_calendar_settings WHERE key = 'all_groups_calendar_name'"
    )
    .first<{ value: string }>();

  const settingsCalendarId = (
    await db
      .prepare(
        "SELECT value FROM hub_calendar_settings WHERE key = 'all_groups_calendar_id'"
      )
      .first<{ value: string }>()
  )?.value?.trim();

  const calendarId =
    rootGroup?.google_calendar_id?.trim() ||
    env.GOOGLE_CALENDAR_ALL_GROUPS_ID?.trim() ||
    env.HUB_ALL_GROUPS_CALENDAR_ID?.trim() ||
    settingsCalendarId ||
    null;

  const calendarName = rootGroup
    ? resolveRootCalendarDisplayName(rootGroup)
    : nameRow?.value?.trim() || "自然科学部";

  return {
    enabled:
      hasGoogleCalendarRefreshToken(env) &&
      Boolean(getGoogleCalendarOAuthClient(env)) &&
      Boolean(calendarId),
    all_groups_calendar_id: calendarId,
    all_groups_calendar_name: calendarName,
    root_group_id: rootGroup?.id ?? null,
    root_group_color: rootGroup?.color ?? null,
  };
}

/** 同一カレンダーへの二重同期を避ける */
function shouldSkipGroupCalendarSync(
  config: GoogleCalendarConfig,
  groupGoogleCalendarId: string | null
): boolean {
  if (!groupGoogleCalendarId || !config.all_groups_calendar_id) return false;
  return (
    groupGoogleCalendarId.trim() === config.all_groups_calendar_id.trim()
  );
}

export interface AdminGoogleCalendarStatus {
  has_refresh_token: boolean;
  has_oauth_client: boolean;
  all_groups_calendar_id: string | null;
  all_groups_calendar_name: string;
  root_group_id: string | null;
  root_group_display_name: string | null;
  ready: boolean;
}

/** 管理画面用の連携ステータス */
export async function getAdminGoogleCalendarStatus(
  db: D1Database,
  env: Env
): Promise<AdminGoogleCalendarStatus> {
  const rootGroup = await getRootGroup(db);
  const config = await getGoogleCalendarConfig(db, env);
  return {
    has_refresh_token: hasGoogleCalendarRefreshToken(env),
    has_oauth_client: Boolean(getGoogleCalendarOAuthClient(env)),
    all_groups_calendar_id: config.all_groups_calendar_id,
    all_groups_calendar_name: config.all_groups_calendar_name,
    root_group_id: config.root_group_id,
    root_group_display_name: rootGroup?.display_name ?? null,
    ready: config.enabled,
  };
}

/** カレンダー設定を DB に保存 */
export async function updateHubCalendarSettings(
  db: D1Database,
  env: Env,
  input: {
    all_groups_calendar_id?: string | null;
    all_groups_calendar_name?: string;
  }
): Promise<AdminGoogleCalendarStatus> {
  const timestamp = now();

  if (input.all_groups_calendar_name !== undefined) {
    const name = input.all_groups_calendar_name.trim();
    if (!name) {
      throw new Error("全体カレンダー名を入力してください");
    }
    await db
      .prepare(
        `INSERT INTO hub_calendar_settings (key, value, updated_at)
         VALUES ('all_groups_calendar_name', ?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
      )
      .bind(name, timestamp)
      .run();
  }

  if (input.all_groups_calendar_id !== undefined) {
    const calId = input.all_groups_calendar_id?.trim() || null;
    if (calId && (!calId.includes("@") || calId.length < 5)) {
      throw new Error("Google カレンダー ID の形式が不正です");
    }
    await db
      .prepare(
        `INSERT INTO hub_calendar_settings (key, value, updated_at)
         VALUES ('all_groups_calendar_id', ?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
      )
      .bind(calId ?? "", timestamp)
      .run();
  }

  return getAdminGoogleCalendarStatus(db, env);
}

/** リフレッシュトークンでアクセストークンを取得 */
export async function getGoogleCalendarAccessToken(env: Env): Promise<string> {
  const oauth = getGoogleCalendarOAuthClient(env);
  const refreshToken = env.GOOGLE_CALENDAR_REFRESH_TOKEN?.trim();

  if (!oauth || !refreshToken) {
    throw new Error(
      "Google カレンダー連携が設定されていません（GOOGLE_CALENDAR_CLIENT_ID / GOOGLE_CALENDAR_CLIENT_SECRET / GOOGLE_CALENDAR_REFRESH_TOKEN）"
    );
  }

  const body = new URLSearchParams({
    client_id: oauth.clientId,
    client_secret: oauth.clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google トークン取得失敗: ${text}`);
  }

  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("Google アクセストークンが取得できませんでした");
  }

  return data.access_token;
}

/** ScienceHUB 予定を Google Calendar イベント JSON に変換 */
export function buildGoogleCalendarEventBody(
  event: ScheduleEventForGoogle,
  calendarLabel: string
): GoogleCalendarEventBody {
  const tz = "Asia/Tokyo";
  const descParts = [
    event.description?.trim(),
    `グループ: ${event.group_display_name}`,
    `ScienceHUB 予定 ID: ${event.id}`,
  ].filter(Boolean);

  const base = {
    summary: event.title,
    description: descParts.join("\n\n"),
    extendedProperties: {
      private: {
        sciencehub_event_id: event.id,
        sciencehub_calendar: calendarLabel,
      },
    },
  };

  if (event.is_all_day) {
    const nextDay = addDays(event.event_date, 1);
    return {
      ...base,
      start: { date: event.event_date },
      end: { date: nextDay },
    };
  }

  const start = `${event.event_date}T${event.start_time}:00`;
  const end = `${event.event_date}T${event.end_time}:00`;
  return {
    ...base,
    start: { dateTime: start, timeZone: tz },
    end: { dateTime: end, timeZone: tz },
  };
}

/** 説明から ScienceHUB 自動付与行を除去 */
export function stripScienceHubDescriptionLines(
  description: string | null
): string {
  if (!description?.trim()) return "";
  return description
    .split("\n\n")
    .filter(
      (line) =>
        !line.startsWith("グループ: ") &&
        !line.startsWith("ScienceHUB 予定 ID: ")
    )
    .join("\n\n")
    .trim();
}

/** Google 直書き予定を PATCH 用 JSON に変換（Asia/Tokyo 固定） */
export function buildGoogleOnlyEventBody(input: {
  title: string;
  description: string | null;
  event_date: string;
  is_all_day: boolean;
  start_time: string | null;
  end_time: string | null;
  group_display_name: string;
  extendedProperties?: Record<string, string>;
}): GoogleCalendarEventBody {
  const tz = "Asia/Tokyo";
  const userDesc = stripScienceHubDescriptionLines(input.description);
  const descParts = [
    userDesc || null,
    `グループ: ${input.group_display_name}`,
  ].filter(Boolean);

  const base = {
    summary: input.title,
    description: descParts.join("\n\n"),
    extendedProperties:
      input.extendedProperties && Object.keys(input.extendedProperties).length > 0
        ? { private: { ...input.extendedProperties } }
        : undefined,
  };

  if (input.is_all_day) {
    return {
      ...base,
      start: { date: input.event_date },
      end: { date: addDays(input.event_date, 1) },
    };
  }

  const start = `${input.event_date}T${input.start_time}:00`;
  const end = `${input.event_date}T${input.end_time}:00`;
  return {
    ...base,
    start: { dateTime: start, timeZone: tz },
    end: { dateTime: end, timeZone: tz },
  };
}

/** Google カレンダーのイベント 1 件を取得 */
async function getGoogleCalendarEvent(
  accessToken: string,
  calendarId: string,
  eventId: string
): Promise<GoogleApiEventItem> {
  const res = await fetch(
    `${CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google Calendar イベント取得失敗: ${text}`);
  }

  return (await res.json()) as GoogleApiEventItem;
}

/** Google 直書き予定を更新（Hub DB なし） */
export async function updateGoogleCalendarOnlyEvent(
  env: Env,
  calendarId: string,
  eventId: string,
  input: {
    title: string;
    description: string | null;
    event_date: string;
    is_all_day: boolean;
    start_time: string | null;
    end_time: string | null;
    group_display_name: string;
  }
): Promise<void> {
  const accessToken = await getGoogleCalendarAccessToken(env);
  const existing = await getGoogleCalendarEvent(
    accessToken,
    calendarId,
    eventId
  );
  const extended =
    existing.extendedProperties?.private &&
    Object.keys(existing.extendedProperties.private).length > 0
      ? { ...existing.extendedProperties.private }
      : undefined;

  const body = buildGoogleOnlyEventBody({
    ...input,
    extendedProperties: extended,
  });
  await patchGoogleEvent(accessToken, calendarId, eventId, body);
}

/** Google 直書き予定を削除（Hub DB なし） */
export async function deleteGoogleCalendarOnlyEvent(
  env: Env,
  calendarId: string,
  eventId: string
): Promise<void> {
  const accessToken = await getGoogleCalendarAccessToken(env);
  await deleteGoogleEvent(accessToken, calendarId, eventId);
}

/** YYYY-MM-DD に日数を加算 */
function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d + days);
  return dt.toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

/** カレンダーにイベントを作成 */
async function insertGoogleEvent(
  accessToken: string,
  calendarId: string,
  body: GoogleCalendarEventBody
): Promise<string> {
  const res = await fetch(
    `${CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google Calendar イベント作成失敗: ${text}`);
  }

  const data = (await res.json()) as { id?: string };
  if (!data.id) {
    throw new Error("Google Calendar イベント ID が返されませんでした");
  }

  return data.id;
}

/** Google カレンダーのイベントを更新 */
async function patchGoogleEvent(
  accessToken: string,
  calendarId: string,
  eventId: string,
  body: GoogleCalendarEventBody
): Promise<void> {
  const res = await fetch(
    `${CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google Calendar イベント更新失敗: ${text}`);
  }
}

/** Google カレンダーのイベントを削除 */
async function deleteGoogleEvent(
  accessToken: string,
  calendarId: string,
  eventId: string
): Promise<void> {
  const res = await fetch(
    `${CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok && res.status !== 204 && res.status !== 410) {
    const text = await res.text();
    throw new Error(`Google Calendar イベント削除失敗: ${text}`);
  }
}

/** 同期済み Google カレンダーのイベントを更新 */
export async function updateSyncedGoogleCalendarEvents(
  env: Env,
  db: D1Database,
  event: ScheduleEventForGoogle,
  googleEventIdAll: string | null,
  googleEventIdGroup: string | null,
  groupGoogleCalendarId: string | null
): Promise<string[]> {
  const config = await getGoogleCalendarConfig(db, env);
  const warnings: string[] = [];

  if (!config.enabled) {
    return warnings;
  }

  const accessToken = await getGoogleCalendarAccessToken(env);

  if (config.all_groups_calendar_id && googleEventIdAll) {
    try {
      const body = buildGoogleCalendarEventBody(
        event,
        config.all_groups_calendar_name
      );
      await patchGoogleEvent(
        accessToken,
        config.all_groups_calendar_id,
        googleEventIdAll,
        body
      );
    } catch (error) {
      warnings.push(
        `全体カレンダー「${config.all_groups_calendar_name}」: ${
          error instanceof Error ? error.message : "更新失敗"
        }`
      );
    }
  }

  if (groupGoogleCalendarId && googleEventIdGroup) {
    if (!shouldSkipGroupCalendarSync(config, groupGoogleCalendarId)) {
      try {
        const body = buildGoogleCalendarEventBody(event, event.group_display_name);
        await patchGoogleEvent(
          accessToken,
          groupGoogleCalendarId,
          googleEventIdGroup,
          body
        );
      } catch (error) {
        warnings.push(
          `グループカレンダー「${event.group_display_name}」: ${
            error instanceof Error ? error.message : "更新失敗"
          }`
        );
      }
    }
  }

  return warnings;
}

/** 同期済み Google カレンダーのイベントを削除 */
export async function deleteSyncedGoogleCalendarEvents(
  env: Env,
  db: D1Database,
  googleEventIdAll: string | null,
  googleEventIdGroup: string | null,
  groupGoogleCalendarId: string | null
): Promise<string[]> {
  const config = await getGoogleCalendarConfig(db, env);
  const warnings: string[] = [];

  if (!config.enabled) {
    return warnings;
  }

  const accessToken = await getGoogleCalendarAccessToken(env);

  if (config.all_groups_calendar_id && googleEventIdAll) {
    try {
      await deleteGoogleEvent(
        accessToken,
        config.all_groups_calendar_id,
        googleEventIdAll
      );
    } catch (error) {
      warnings.push(
        `全体カレンダー「${config.all_groups_calendar_name}」: ${
          error instanceof Error ? error.message : "削除失敗"
        }`
      );
    }
  }

  if (groupGoogleCalendarId && googleEventIdGroup) {
    if (!shouldSkipGroupCalendarSync(config, groupGoogleCalendarId)) {
      try {
        await deleteGoogleEvent(
          accessToken,
          groupGoogleCalendarId,
          googleEventIdGroup
        );
      } catch (error) {
        warnings.push(`グループカレンダー: ${
          error instanceof Error ? error.message : "削除失敗"
        }`);
      }
    }
  }

  return warnings;
}

export interface GoogleSyncResult {
  google_event_id_all: string | null;
  google_event_id_group: string | null;
  warnings: string[];
}

/**
 * 予定を「自然科学部」カレンダーとグループカレンダーへ同期
 * 失敗したカレンダーは warnings に記録し、DB 更新は部分成功を許容
 */
export async function syncEventToGoogleCalendars(
  db: D1Database,
  env: Env,
  event: ScheduleEventForGoogle,
  groupGoogleCalendarId: string | null
): Promise<GoogleSyncResult> {
  const config = await getGoogleCalendarConfig(db, env);
  const warnings: string[] = [];
  let googleEventIdAll: string | null = null;
  let googleEventIdGroup: string | null = null;

  if (!config.enabled) {
    return { google_event_id_all: null, google_event_id_group: null, warnings };
  }

  const accessToken = await getGoogleCalendarAccessToken(env);

  if (config.all_groups_calendar_id) {
    try {
      const body = buildGoogleCalendarEventBody(
        event,
        config.all_groups_calendar_name
      );
      googleEventIdAll = await insertGoogleEvent(
        accessToken,
        config.all_groups_calendar_id,
        body
      );
    } catch (error) {
      warnings.push(
        `全体カレンダー「${config.all_groups_calendar_name}」: ${
          error instanceof Error ? error.message : "同期失敗"
        }`
      );
    }
  }

  if (groupGoogleCalendarId && !shouldSkipGroupCalendarSync(config, groupGoogleCalendarId)) {
    try {
      const body = buildGoogleCalendarEventBody(event, event.group_display_name);
      googleEventIdGroup = await insertGoogleEvent(
        accessToken,
        groupGoogleCalendarId,
        body
      );
    } catch (error) {
      warnings.push(
        `グループカレンダー「${event.group_display_name}」: ${
          error instanceof Error ? error.message : "同期失敗"
        }`
      );
    }
  } else if (
    groupGoogleCalendarId &&
    shouldSkipGroupCalendarSync(config, groupGoogleCalendarId)
  ) {
    // ルートグループのカレンダーは全体同期で既に書き込む
  } else if (!groupGoogleCalendarId) {
    warnings.push(
      `グループ「${event.group_display_name}」に Google カレンダー ID が未設定のためスキップしました`
    );
  }

  return {
    google_event_id_all: googleEventIdAll,
    google_event_id_group: googleEventIdGroup,
    warnings,
  };
}

/** 同期結果を DB に保存 */
export async function saveGoogleEventIds(
  db: D1Database,
  eventId: string,
  ids: Pick<GoogleSyncResult, "google_event_id_all" | "google_event_id_group">
): Promise<void> {
  await db
    .prepare(
      `UPDATE hub_schedule_events
       SET google_event_id_all = ?, google_event_id_group = ?, updated_at = ?
       WHERE id = ?`
    )
    .bind(
      ids.google_event_id_all,
      ids.google_event_id_group,
      now(),
      eventId
    )
    .run();
}

export interface GoogleCalendarFetchedOccurrence {
  google_event_id: string;
  calendar_id: string;
  title: string;
  description: string | null;
  event_date: string;
  is_all_day: boolean;
  start_time: string | null;
  end_time: string | null;
  sciencehub_event_id: string | null;
}

interface GoogleApiEventItem {
  id?: string;
  summary?: string;
  description?: string;
  start?: { date?: string; dateTime?: string };
  end?: { date?: string; dateTime?: string };
  extendedProperties?: { private?: Record<string, string> };
}

/** ISO 日時を JST の HH:MM に変換 */
function toJstTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("sv-SE", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/** ISO 日時を JST の YYYY-MM-DD に変換 */
function toJstDate(iso: string): string {
  return new Date(iso).toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

/** Google API イベント 1 件を表示用オカレンスに展開 */
function expandGoogleApiEvent(
  item: GoogleApiEventItem,
  calendarId: string
): GoogleCalendarFetchedOccurrence[] {
  const googleEventId = item.id?.trim();
  const title = item.summary?.trim();
  if (!googleEventId || !title) return [];

  const sciencehubEventId =
    item.extendedProperties?.private?.sciencehub_event_id?.trim() || null;
  const description = item.description?.trim() || null;
  const occurrences: GoogleCalendarFetchedOccurrence[] = [];

  if (item.start?.date) {
    const startDate = item.start.date;
    const endExclusive = item.end?.date ?? addDays(startDate, 1);
    let current = startDate;
    while (current < endExclusive) {
      occurrences.push({
        google_event_id: googleEventId,
        calendar_id: calendarId,
        title,
        description,
        event_date: current,
        is_all_day: true,
        start_time: null,
        end_time: null,
        sciencehub_event_id: sciencehubEventId,
      });
      current = addDays(current, 1);
    }
    return occurrences;
  }

  if (item.start?.dateTime) {
    const eventDate = toJstDate(item.start.dateTime);
    const startTime = toJstTime(item.start.dateTime);
    const endTime = item.end?.dateTime
      ? toJstTime(item.end.dateTime)
      : startTime;
    occurrences.push({
      google_event_id: googleEventId,
      calendar_id: calendarId,
      title,
      description,
      event_date: eventDate,
      is_all_day: false,
      start_time: startTime,
      end_time: endTime,
      sciencehub_event_id: sciencehubEventId,
    });
  }

  return occurrences;
}

/** 1 カレンダーから指定期間のイベントを取得 */
async function listGoogleCalendarEventItems(
  accessToken: string,
  calendarId: string,
  from: string,
  to: string
): Promise<GoogleApiEventItem[]> {
  const timeMin = `${from}T00:00:00+09:00`;
  const timeMax = `${addDays(to, 1)}T00:00:00+09:00`;
  const items: GoogleApiEventItem[] = [];
  let pageToken: string | undefined;

  do {
    const url = new URL(
      `${CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events`
    );
    url.searchParams.set("timeMin", timeMin);
    url.searchParams.set("timeMax", timeMax);
    url.searchParams.set("singleEvents", "true");
    url.searchParams.set("orderBy", "startTime");
    url.searchParams.set("maxResults", "2500");
    if (pageToken) {
      url.searchParams.set("pageToken", pageToken);
    }

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Google Calendar 読み込み失敗 (${calendarId}): ${text}`);
    }

    const data = (await res.json()) as {
      items?: GoogleApiEventItem[];
      nextPageToken?: string;
    };
    items.push(...(data.items ?? []));
    pageToken = data.nextPageToken;
  } while (pageToken);

  return items;
}

export interface GoogleCalendarFetchTarget {
  calendar_id: string;
  fallback_group_id: string | null;
  fallback_group_display_name: string;
  fallback_group_color: string;
}

/** 複数カレンダーからスケジュール表示用イベントを取得 */
export async function fetchGoogleCalendarScheduleEvents(
  env: Env,
  from: string,
  to: string,
  targets: GoogleCalendarFetchTarget[]
): Promise<GoogleCalendarFetchedOccurrence[]> {
  if (targets.length === 0) return [];

  const accessToken = await getGoogleCalendarAccessToken(env);
  const all: GoogleCalendarFetchedOccurrence[] = [];

  for (const target of targets) {
    const items = await listGoogleCalendarEventItems(
      accessToken,
      target.calendar_id,
      from,
      to
    );
    for (const item of items) {
      all.push(...expandGoogleApiEvent(item, target.calendar_id));
    }
  }

  return all;
}

export type GoogleCalendarTestKind = "connect" | "read" | "write";

export interface GoogleCalendarTestResult {
  ok: boolean;
  test: GoogleCalendarTestKind;
  message: string;
  details?: Record<string, string>;
}

/** 接続テスト（トークン取得） */
export async function testGoogleCalendarConnect(
  env: Env
): Promise<GoogleCalendarTestResult> {
  await getGoogleCalendarAccessToken(env);
  return {
    ok: true,
    test: "connect",
    message: "Google カレンダー API への接続に成功しました",
  };
}

/** 読み込みテスト（カレンダー metadata 取得） */
export async function testGoogleCalendarRead(
  env: Env,
  calendarId: string
): Promise<GoogleCalendarTestResult> {
  const accessToken = await getGoogleCalendarAccessToken(env);
  const res = await fetch(
    `${CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`カレンダー読み込み失敗: ${text}`);
  }

  const data = (await res.json()) as {
    summary?: string;
    timeZone?: string;
    id?: string;
  };

  return {
    ok: true,
    test: "read",
    message: `カレンダー「${data.summary ?? calendarId}」を読み込めました`,
    details: {
      calendar_id: data.id ?? calendarId,
      summary: data.summary ?? "",
      time_zone: data.timeZone ?? "",
    },
  };
}

/** 書き込みテスト（テスト予定を作成して削除） */
export async function testGoogleCalendarWrite(
  env: Env,
  calendarId: string,
  calendarLabel: string
): Promise<GoogleCalendarTestResult> {
  const accessToken = await getGoogleCalendarAccessToken(env);
  const today = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Tokyo",
  });

  const body = buildGoogleCalendarEventBody(
    {
      id: `test_${Date.now()}`,
      title: "[ScienceHUB] 接続テスト",
      description: "管理パネルからの書き込みテストです。自動で削除されます。",
      event_date: today,
      is_all_day: true,
      start_time: null,
      end_time: null,
      group_display_name: calendarLabel,
      group_color: "#F38020",
    },
    calendarLabel
  );

  const eventId = await insertGoogleEvent(accessToken, calendarId, body);

  const delRes = await fetch(
    `${CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!delRes.ok && delRes.status !== 204) {
    const text = await delRes.text();
    return {
      ok: true,
      test: "write",
      message: `書き込みは成功しましたが、テスト予定の削除に失敗しました（手動で削除してください）`,
      details: { event_id: eventId, delete_error: text },
    };
  }

  return {
    ok: true,
    test: "write",
    message: `カレンダー「${calendarLabel}」への書き込み・削除に成功しました`,
    details: { event_id: eventId },
  };
}

/** 管理画面からの検証テスト */
export async function runGoogleCalendarTest(
  db: D1Database,
  env: Env,
  test: GoogleCalendarTestKind,
  calendarId?: string
): Promise<GoogleCalendarTestResult> {
  if (test === "connect") {
    return testGoogleCalendarConnect(env);
  }

  const config = await getGoogleCalendarConfig(db, env);
  const targetId = calendarId?.trim() || config.all_groups_calendar_id;
  if (!targetId) {
    throw new Error("カレンダー ID が設定されていません");
  }

  const label = calendarId?.trim()
    ? targetId
    : config.all_groups_calendar_name;

  if (test === "read") {
    return testGoogleCalendarRead(env, targetId);
  }

  return testGoogleCalendarWrite(env, targetId, label);
}
