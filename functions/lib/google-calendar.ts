/**
 * Google Calendar API 連携（予定のプッシュ同期）
 */

import type { Env } from "./types";
import { now } from "./types";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const CALENDAR_API = "https://www.googleapis.com/calendar/v3";

export interface GoogleCalendarConfig {
  enabled: boolean;
  all_groups_calendar_id: string | null;
  all_groups_calendar_name: string;
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

/** 設定が有効か（リフレッシュトークン + 全体カレンダー ID） */
export function isGoogleCalendarConfigured(env: Env): boolean {
  return Boolean(
    env.GOOGLE_CALENDAR_REFRESH_TOKEN?.trim() &&
      (env.GOOGLE_CALENDAR_ALL_GROUPS_ID?.trim() ||
        env.HUB_ALL_GROUPS_CALENDAR_ID?.trim())
  );
}

/** DB + 環境変数から連携設定を取得 */
export async function getGoogleCalendarConfig(
  db: D1Database,
  env: Env
): Promise<GoogleCalendarConfig> {
  const nameRow = await db
    .prepare(
      "SELECT value FROM hub_calendar_settings WHERE key = 'all_groups_calendar_name'"
    )
    .first<{ value: string }>();

  const calendarId =
    env.GOOGLE_CALENDAR_ALL_GROUPS_ID?.trim() ||
    env.HUB_ALL_GROUPS_CALENDAR_ID?.trim() ||
    (
      await db
        .prepare(
          "SELECT value FROM hub_calendar_settings WHERE key = 'all_groups_calendar_id'"
        )
        .first<{ value: string }>()
    )?.value?.trim() ||
    null;

  return {
    enabled: isGoogleCalendarConfigured(env) && Boolean(calendarId),
    all_groups_calendar_id: calendarId,
    all_groups_calendar_name: nameRow?.value?.trim() || "自然科学部",
  };
}

/** リフレッシュトークンでアクセストークンを取得 */
async function fetchAccessToken(env: Env): Promise<string> {
  const clientId = env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = env.GOOGLE_CLIENT_SECRET?.trim();
  const refreshToken = env.GOOGLE_CALENDAR_REFRESH_TOKEN?.trim();

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Google カレンダー連携が設定されていません");
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
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

  const body: GoogleCalendarEventBody = {
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
    body.start = { date: event.event_date };
    body.end = { date: nextDay };
  } else {
    const start = `${event.event_date}T${event.start_time}:00`;
    const end = `${event.event_date}T${event.end_time}:00`;
    body.start = { dateTime: start, timeZone: tz };
    body.end = { dateTime: end, timeZone: tz };
  }

  return body;
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

  const accessToken = await fetchAccessToken(env);

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

  if (groupGoogleCalendarId) {
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
  } else {
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
