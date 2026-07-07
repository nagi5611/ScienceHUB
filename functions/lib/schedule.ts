/**
 * ダッシュボードスケジュール（グループ予定）
 */

import { createId, now } from "./types";
import type { Env } from "./types";
import {
  getUserGroupMemberships,
  type UserGroupMembership,
} from "./groups";
import {
  getGoogleCalendarConfig,
  saveGoogleEventIds,
  syncEventToGoogleCalendars,
} from "./google-calendar";

export interface ScheduleEventRow {
  id: string;
  group_id: string;
  title: string;
  description: string | null;
  event_date: string;
  is_all_day: number;
  start_time: string | null;
  end_time: string | null;
  google_event_id_all: string | null;
  google_event_id_group: string | null;
  created_by: string;
  created_at: number;
  updated_at: number;
}

export interface PublicScheduleEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  is_all_day: boolean;
  start_time: string | null;
  end_time: string | null;
  time_label: string | null;
  group_id: string;
  group_display_name: string;
  group_color: string;
  show_details: boolean;
  google_synced: boolean;
}

export interface CreatableScheduleGroup {
  id: string;
  display_name: string;
  color: string;
}

export interface ScheduleCalendarSyncInfo {
  enabled: boolean;
  all_groups_calendar_name: string;
}

export interface ScheduleListResult {
  can_create: boolean;
  creatable_groups: CreatableScheduleGroup[];
  calendar_sync: ScheduleCalendarSyncInfo;
  events: PublicScheduleEvent[];
}

export interface CreateScheduleInput {
  title: string;
  description?: string;
  group_id: string;
  event_date: string;
  is_all_day: boolean;
  start_time?: string | null;
  end_time?: string | null;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

/** 表示用の時間ラベル */
export function formatScheduleTimeLabel(
  isAllDay: boolean,
  startTime: string | null,
  endTime: string | null
): string | null {
  if (isAllDay) return "終日";
  if (!startTime) return null;
  if (endTime && endTime !== startTime) {
    return `${startTime}–${endTime}`;
  }
  return startTime;
}

/** 時間入力を検証 */
export function validateScheduleTimes(
  isAllDay: boolean,
  startTime: string | null | undefined,
  endTime: string | null | undefined
): { start_time: string | null; end_time: string | null } {
  if (isAllDay) {
    return { start_time: null, end_time: null };
  }

  const start = startTime?.trim() ?? "";
  const end = endTime?.trim() ?? "";

  if (!start || !end) {
    throw new Error("開始時刻と終了時刻を入力してください");
  }
  if (!TIME_RE.test(start) || !TIME_RE.test(end)) {
    throw new Error("時刻は HH:MM 形式で入力してください");
  }
  if (start >= end) {
    throw new Error("終了時刻は開始時刻より後にしてください");
  }

  return { start_time: start, end_time: end };
}

/** グループ内「メンバー」ロールの position（これ以下＝メンバー以上） */
export async function getMemberBaselinePosition(
  db: D1Database,
  groupId: string
): Promise<number | null> {
  const memberRole = await db
    .prepare(
      "SELECT position FROM group_roles WHERE group_id = ? AND slug = 'member' LIMIT 1"
    )
    .bind(groupId)
    .first<{ position: number }>();

  if (memberRole) {
    return memberRole.position;
  }

  const maxRole = await db
    .prepare(
      "SELECT MAX(position) AS max_pos FROM group_roles WHERE group_id = ?"
    )
    .bind(groupId)
    .first<{ max_pos: number | null }>();

  if (maxRole?.max_pos === null || maxRole?.max_pos === undefined) {
    return null;
  }

  return maxRole.max_pos;
}

/** メンバー以上の権限か（position が小さいほど上位） */
export function isMemberOrHigher(
  rolePosition: number,
  baselinePosition: number
): boolean {
  return rolePosition <= baselinePosition;
}

/** 指定グループで予定の詳細表示・作成が可能か */
export async function canManageScheduleInGroup(
  db: D1Database,
  membership: UserGroupMembership
): Promise<boolean> {
  const baseline = await getMemberBaselinePosition(db, membership.group_id);
  if (baseline === null) {
    return false;
  }
  return isMemberOrHigher(membership.group_role_position, baseline);
}

/** ユーザーの作成可能グループ一覧 */
export async function getCreatableGroupsForUser(
  db: D1Database,
  userId: string
): Promise<CreatableScheduleGroup[]> {
  const memberships = await getUserGroupMemberships(db, userId);
  const groups: CreatableScheduleGroup[] = [];

  for (const membership of memberships) {
    if (await canManageScheduleInGroup(db, membership)) {
      groups.push({
        id: membership.group_id,
        display_name: membership.group_display_name,
        color: membership.group_color,
      });
    }
  }

  return groups.sort((a, b) =>
    a.display_name.localeCompare(b.display_name, "ja")
  );
}

/** 予定一覧を取得 */
export async function listScheduleEvents(
  db: D1Database,
  env: Env,
  userId: string,
  from: string,
  to: string,
  scope: "mine" | "all"
): Promise<ScheduleListResult> {
  if (!DATE_RE.test(from) || !DATE_RE.test(to)) {
    throw new Error("日付の形式が不正です");
  }

  const memberships = await getUserGroupMemberships(db, userId);
  const membershipByGroup = new Map(
    memberships.map((m) => [m.group_id, m])
  );
  const userGroupIds = new Set(memberships.map((m) => m.group_id));

  const creatableGroups = await getCreatableGroupsForUser(db, userId);
  const canCreate = creatableGroups.length > 0;
  const calendarSync = await getGoogleCalendarConfig(db, env);

  const detailCache = new Map<string, boolean>();
  async function canViewDetails(groupId: string): Promise<boolean> {
    if (detailCache.has(groupId)) {
      return detailCache.get(groupId)!;
    }
    const membership = membershipByGroup.get(groupId);
    if (!membership) {
      detailCache.set(groupId, false);
      return false;
    }
    const allowed = await canManageScheduleInGroup(db, membership);
    detailCache.set(groupId, allowed);
    return allowed;
  }

  const result = await db
    .prepare(
      `SELECT e.id, e.group_id, e.title, e.description, e.event_date,
              e.is_all_day, e.start_time, e.end_time,
              e.google_event_id_all, e.google_event_id_group,
              e.created_by, e.created_at, e.updated_at,
              g.display_name AS group_display_name, g.color AS group_color
       FROM hub_schedule_events e
       JOIN hub_groups g ON g.id = e.group_id
       WHERE e.event_date >= ? AND e.event_date <= ?
       ORDER BY e.event_date ASC,
                CASE WHEN e.is_all_day = 1 THEN 0 ELSE 1 END,
                e.start_time ASC,
                g.display_name ASC,
                e.title ASC`
    )
    .bind(from, to)
    .all<
      ScheduleEventRow & {
        group_display_name: string;
        group_color: string;
      }
    >();

  const events: PublicScheduleEvent[] = [];

  for (const row of result.results ?? []) {
    if (scope === "mine" && !userGroupIds.has(row.group_id)) {
      continue;
    }

    const showDetails = await canViewDetails(row.group_id);
    const isAllDay = row.is_all_day === 1;

    events.push({
      id: row.id,
      title: row.title,
      description: row.description,
      event_date: row.event_date,
      is_all_day: isAllDay,
      start_time: row.start_time,
      end_time: row.end_time,
      time_label: formatScheduleTimeLabel(
        isAllDay,
        row.start_time,
        row.end_time
      ),
      group_id: row.group_id,
      group_display_name: row.group_display_name,
      group_color: row.group_color ?? "#F38020",
      show_details: showDetails,
      google_synced: Boolean(row.google_event_id_all || row.google_event_id_group),
    });
  }

  return {
    can_create: canCreate,
    creatable_groups: creatableGroups,
    calendar_sync: {
      enabled: calendarSync.enabled,
      all_groups_calendar_name: calendarSync.all_groups_calendar_name,
    },
    events,
  };
}

/** 予定を作成 */
export async function createScheduleEvent(
  db: D1Database,
  env: Env,
  userId: string,
  input: CreateScheduleInput
): Promise<{ event: PublicScheduleEvent; sync_warnings: string[] }> {
  const title = input.title.trim();
  if (!title) {
    throw new Error("タイトルを入力してください");
  }
  if (title.length > 120) {
    throw new Error("タイトルは120文字以内で入力してください");
  }
  if (!DATE_RE.test(input.event_date)) {
    throw new Error("日付の形式が不正です");
  }

  const description = input.description?.trim() || null;
  if (description && description.length > 2000) {
    throw new Error("説明は2000文字以内で入力してください");
  }

  const { start_time, end_time } = validateScheduleTimes(
    input.is_all_day,
    input.start_time,
    input.end_time
  );

  const memberships = await getUserGroupMemberships(db, userId);
  const membership = memberships.find((m) => m.group_id === input.group_id);
  if (!membership) {
    throw new Error("このグループに所属していないため予定を追加できません");
  }

  if (!(await canManageScheduleInGroup(db, membership))) {
    throw new Error("メンバー以上の権限が必要です");
  }

  const group = await db
    .prepare(
      "SELECT id, display_name, color, google_calendar_id FROM hub_groups WHERE id = ?"
    )
    .bind(input.group_id)
    .first<{
      id: string;
      display_name: string;
      color: string;
      google_calendar_id: string | null;
    }>();

  if (!group) {
    throw new Error("グループが見つかりません");
  }

  const id = createId("sch");
  const timestamp = now();
  const isAllDayInt = input.is_all_day ? 1 : 0;

  await db
    .prepare(
      `INSERT INTO hub_schedule_events (
         id, group_id, title, description, event_date,
         is_all_day, start_time, end_time,
         created_by, created_at, updated_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      input.group_id,
      title,
      description,
      input.event_date,
      isAllDayInt,
      start_time,
      end_time,
      userId,
      timestamp,
      timestamp
    )
    .run();

  const publicEvent: PublicScheduleEvent = {
    id,
    title,
    description,
    event_date: input.event_date,
    is_all_day: input.is_all_day,
    start_time,
    end_time,
    time_label: formatScheduleTimeLabel(input.is_all_day, start_time, end_time),
    group_id: group.id,
    group_display_name: group.display_name,
    group_color: group.color ?? "#F38020",
    show_details: true,
    google_synced: false,
  };

  let syncWarnings: string[] = [];

  try {
    const syncResult = await syncEventToGoogleCalendars(
      db,
      env,
      {
        id,
        title,
        description,
        event_date: input.event_date,
        is_all_day: input.is_all_day,
        start_time,
        end_time,
        group_display_name: group.display_name,
        group_color: group.color ?? "#F38020",
      },
      group.google_calendar_id
    );

    syncWarnings = syncResult.warnings;

    if (
      syncResult.google_event_id_all ||
      syncResult.google_event_id_group
    ) {
      await saveGoogleEventIds(db, id, syncResult);
      publicEvent.google_synced = true;
    }
  } catch (error) {
    syncWarnings.push(
      error instanceof Error ? error.message : "Google カレンダー同期に失敗しました"
    );
  }

  return { event: publicEvent, sync_warnings: syncWarnings };
}
