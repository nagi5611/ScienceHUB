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
  fetchGoogleCalendarScheduleEvents,
  updateSyncedGoogleCalendarEvents,
  deleteSyncedGoogleCalendarEvents,
  updateGoogleCalendarOnlyEvent,
  deleteGoogleCalendarOnlyEvent,
  type GoogleCalendarFetchTarget,
  type GoogleCalendarFetchedOccurrence,
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
  can_manage: boolean;
  google_synced: boolean;
  source?: "hub" | "google";
  google_calendar_id?: string;
  google_event_id?: string;
  /** 複数日終日イベントの 1 日分表示（編集・削除はイベント全体に適用） */
  google_whole_event?: boolean;
}

export interface CreatableScheduleGroup {
  id: string;
  display_name: string;
  color: string;
}

export interface ScheduleCalendarSyncInfo {
  enabled: boolean;
  all_groups_calendar_name: string;
  root_group_id: string | null;
}

export interface ScheduleLegendGroup {
  id: string;
  display_name: string;
  color: string;
}

export interface SubscribableGoogleCalendar {
  id: string;
  display_name: string;
  color: string;
  google_calendar_id: string;
  subscribe_url: string;
}

export interface SubscribableCalendarsResult {
  enabled: boolean;
  calendars: SubscribableGoogleCalendar[];
}

/** Google カレンダーに追加するための購読 URL */
export function buildGoogleCalendarSubscribeUrl(calendarId: string): string {
  const cid = btoa(calendarId.trim());
  return `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(cid)}`;
}

/** ユーザーが Google カレンダーに追加できるカレンダー一覧 */
export async function listSubscribableGoogleCalendars(
  db: D1Database,
  env: Env,
  userId: string
): Promise<SubscribableCalendarsResult> {
  const config = await getGoogleCalendarConfig(db, env);
  if (!config.enabled) {
    return { enabled: false, calendars: [] };
  }

  const memberships = await getUserGroupMemberships(db, userId);
  if (memberships.length === 0) {
    return { enabled: true, calendars: [] };
  }

  const userGroupIds = new Set(memberships.map((m) => m.group_id));
  const calendars: SubscribableGoogleCalendar[] = [];
  const seenCalendarIds = new Set<string>();

  const addCalendar = (entry: {
    id: string;
    display_name: string;
    color: string;
    google_calendar_id: string;
  }) => {
    const googleCalendarId = entry.google_calendar_id.trim();
    if (!googleCalendarId || seenCalendarIds.has(googleCalendarId)) return;
    seenCalendarIds.add(googleCalendarId);
    calendars.push({
      id: entry.id,
      display_name: entry.display_name,
      color: entry.color ?? "#F38020",
      google_calendar_id: googleCalendarId,
      subscribe_url: buildGoogleCalendarSubscribeUrl(googleCalendarId),
    });
  };

  if (config.all_groups_calendar_id) {
    const rootId = config.root_group_id ?? "__all_groups__";
    const rootColor = config.root_group_color ?? "#F38020";
    addCalendar({
      id: rootId,
      display_name: config.all_groups_calendar_name,
      color: rootColor,
      google_calendar_id: config.all_groups_calendar_id,
    });
  }

  const groups = await db
    .prepare(
      `SELECT id, display_name, color, google_calendar_id
       FROM hub_groups
       WHERE google_calendar_id IS NOT NULL AND TRIM(google_calendar_id) != ''`
    )
    .all<{
      id: string;
      display_name: string;
      color: string;
      google_calendar_id: string;
    }>();

  for (const group of groups.results ?? []) {
    if (!userGroupIds.has(group.id)) continue;
    if (config.root_group_id && group.id === config.root_group_id) continue;
    addCalendar({
      id: group.id,
      display_name: group.display_name,
      color: group.color,
      google_calendar_id: group.google_calendar_id,
    });
  }

  calendars.sort((a, b) =>
    a.display_name.localeCompare(b.display_name, "ja")
  );

  return { enabled: true, calendars };
}

export interface ScheduleListResult {
  can_create: boolean;
  creatable_groups: CreatableScheduleGroup[];
  calendar_sync: ScheduleCalendarSyncInfo;
  legend_groups: ScheduleLegendGroup[];
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

/** カレンダー凡例用のグループ一覧 */
export async function getScheduleLegendGroups(
  db: D1Database,
  userId: string,
  scope: "mine" | "all",
  calendarSync: ScheduleCalendarSyncInfo & {
    root_group_color?: string | null;
  }
): Promise<ScheduleLegendGroup[]> {
  const legend: ScheduleLegendGroup[] = [];
  const rootGroupId = calendarSync.root_group_id;

  if (calendarSync.enabled) {
    legend.push({
      id: rootGroupId ?? "__all_groups__",
      display_name: calendarSync.all_groups_calendar_name,
      color: calendarSync.root_group_color ?? "#F38020",
    });
  }

  if (scope === "all") {
    const rows = await db
      .prepare(
        `SELECT id, display_name, color FROM hub_groups ORDER BY display_name ASC`
      )
      .all<{ id: string; display_name: string; color: string }>();

    for (const group of rows.results ?? []) {
      if (rootGroupId && group.id === rootGroupId) continue;
      legend.push({
        id: group.id,
        display_name: group.display_name,
        color: group.color ?? "#F38020",
      });
    }
    return legend;
  }

  const memberships = await getUserGroupMemberships(db, userId);
  for (const membership of memberships) {
    if (rootGroupId && membership.group_id === rootGroupId) continue;
    legend.push({
      id: membership.group_id,
      display_name: membership.group_display_name,
      color: membership.group_color,
    });
  }

  return legend.sort((a, b) =>
    a.display_name.localeCompare(b.display_name, "ja")
  );
}

/** 説明文からグループ名を抽出（Google 同期時に付与） */
function parseGroupNameFromDescription(
  description: string | null
): string | null {
  if (!description) return null;
  const match = description.match(/グループ:\s*(.+)/);
  return match?.[1]?.trim() ?? null;
}

/** Google カレンダー取得対象を組み立て */
async function buildGoogleCalendarFetchTargets(
  db: D1Database,
  config: Awaited<ReturnType<typeof getGoogleCalendarConfig>>,
  scope: "mine" | "all",
  userGroupIds: Set<string>
): Promise<GoogleCalendarFetchTarget[]> {
  const targets: GoogleCalendarFetchTarget[] = [];
  const seenCalendarIds = new Set<string>();

  const addTarget = (target: GoogleCalendarFetchTarget) => {
    if (!target.calendar_id || seenCalendarIds.has(target.calendar_id)) return;
    seenCalendarIds.add(target.calendar_id);
    targets.push(target);
  };

  if (scope === "all" && config.all_groups_calendar_id) {
    addTarget({
      calendar_id: config.all_groups_calendar_id,
      fallback_group_id: config.root_group_id,
      fallback_group_display_name: config.all_groups_calendar_name,
      fallback_group_color: config.root_group_color ?? "#F38020",
    });
  }

  const groups = await db
    .prepare(
      `SELECT id, display_name, color, google_calendar_id
       FROM hub_groups
       WHERE google_calendar_id IS NOT NULL AND TRIM(google_calendar_id) != ''`
    )
    .all<{
      id: string;
      display_name: string;
      color: string;
      google_calendar_id: string;
    }>();

  for (const group of groups.results ?? []) {
    if (scope === "mine" && !userGroupIds.has(group.id)) {
      continue;
    }
    if (config.root_group_id && group.id === config.root_group_id) {
      continue;
    }
    addTarget({
      calendar_id: group.google_calendar_id.trim(),
      fallback_group_id: group.id,
      fallback_group_display_name: group.display_name,
      fallback_group_color: group.color ?? "#F38020",
    });
  }

  return targets;
}

/** ScienceHUB 管理下の Google カレンダーか */
async function isManagedGoogleCalendarId(
  db: D1Database,
  config: Awaited<ReturnType<typeof getGoogleCalendarConfig>>,
  calendarId: string
): Promise<boolean> {
  const normalized = calendarId.trim();
  if (!normalized) return false;
  if (config.all_groups_calendar_id?.trim() === normalized) return true;

  const row = await db
    .prepare(
      `SELECT 1 AS ok FROM hub_groups
       WHERE TRIM(google_calendar_id) = ?
       LIMIT 1`
    )
    .bind(normalized)
    .first<{ ok: number }>();

  return Boolean(row);
}

/** カレンダー ID から権限チェック用グループを解決 */
async function resolveManagedGroupForCalendar(
  db: D1Database,
  config: Awaited<ReturnType<typeof getGoogleCalendarConfig>>,
  calendarId: string
): Promise<{ group_id: string; group_display_name: string } | null> {
  const normalized = calendarId.trim();

  if (config.all_groups_calendar_id?.trim() === normalized) {
    if (!config.root_group_id) return null;
    const root = await db
      .prepare(
        `SELECT id, display_name FROM hub_groups WHERE id = ? LIMIT 1`
      )
      .bind(config.root_group_id)
      .first<{ id: string; display_name: string }>();
    if (!root) return null;
    return { group_id: root.id, group_display_name: root.display_name };
  }

  const group = await db
    .prepare(
      `SELECT id, display_name FROM hub_groups
       WHERE TRIM(google_calendar_id) = ?
       LIMIT 1`
    )
    .bind(normalized)
    .first<{ id: string; display_name: string }>();

  if (!group) return null;
  return { group_id: group.id, group_display_name: group.display_name };
}

/** Google 直書き予定の操作権限を検証 */
async function assertCanManageGoogleCalendarEvent(
  db: D1Database,
  env: Env,
  userId: string,
  calendarId: string
): Promise<{ group_id: string; group_display_name: string }> {
  const config = await getGoogleCalendarConfig(db, env);
  if (!config.enabled) {
    throw new Error("Google カレンダー連携が無効です");
  }

  if (!(await isManagedGoogleCalendarId(db, config, calendarId))) {
    throw new Error("このカレンダーは ScienceHUB で管理されていません");
  }

  const groupCtx = await resolveManagedGroupForCalendar(db, config, calendarId);
  if (!groupCtx) {
    throw new Error("このカレンダーに対応するグループが見つかりません");
  }

  const memberships = await getUserGroupMemberships(db, userId);
  const membership = memberships.find((m) => m.group_id === groupCtx.group_id);
  if (!membership) {
    throw new Error("このグループに所属していないため操作できません");
  }

  if (!(await canManageScheduleInGroup(db, membership))) {
    throw new Error("メンバー以上の権限が必要です");
  }

  return groupCtx;
}

export interface UpdateGoogleScheduleInput {
  calendar_id: string;
  google_event_id: string;
  title?: string;
  description?: string;
  event_date?: string;
  is_all_day?: boolean;
  start_time?: string | null;
  end_time?: string | null;
}

/** Google 直書き予定を更新 */
export async function updateGoogleScheduleEvent(
  db: D1Database,
  env: Env,
  userId: string,
  input: UpdateGoogleScheduleInput
): Promise<{ ok: true }> {
  const calendarId = input.calendar_id?.trim() ?? "";
  const googleEventId = input.google_event_id?.trim() ?? "";
  if (!calendarId || !googleEventId) {
    throw new Error("カレンダー ID とイベント ID を指定してください");
  }

  const groupCtx = await assertCanManageGoogleCalendarEvent(
    db,
    env,
    userId,
    calendarId
  );

  const title = input.title?.trim() ?? "";
  if (!title) {
    throw new Error("タイトルを入力してください");
  }
  if (title.length > 120) {
    throw new Error("タイトルは120文字以内で入力してください");
  }

  const eventDate = input.event_date?.trim() ?? "";
  if (!DATE_RE.test(eventDate)) {
    throw new Error("日付の形式が不正です");
  }

  const description =
    input.description !== undefined
      ? input.description.trim() || null
      : null;
  if (description && description.length > 2000) {
    throw new Error("説明は2000文字以内で入力してください");
  }

  const isAllDay = input.is_all_day ?? true;
  const { start_time, end_time } = validateScheduleTimes(
    isAllDay,
    input.start_time,
    input.end_time
  );

  await updateGoogleCalendarOnlyEvent(env, calendarId, googleEventId, {
    title,
    description,
    event_date: eventDate,
    is_all_day: isAllDay,
    start_time,
    end_time,
    group_display_name: groupCtx.group_display_name,
  });

  return { ok: true };
}

/** Google 直書き予定を削除 */
export async function deleteGoogleScheduleEvent(
  db: D1Database,
  env: Env,
  userId: string,
  calendarId: string,
  googleEventId: string
): Promise<{ ok: true }> {
  const calId = calendarId.trim();
  const eventId = googleEventId.trim();
  if (!calId || !eventId) {
    throw new Error("カレンダー ID とイベント ID を指定してください");
  }

  await assertCanManageGoogleCalendarEvent(db, env, userId, calId);
  await deleteGoogleCalendarOnlyEvent(env, calId, eventId);

  return { ok: true };
}

/** Google イベントを PublicScheduleEvent に変換してマージ */
async function mergeGoogleCalendarEvents(
  db: D1Database,
  env: Env,
  scope: "mine" | "all",
  userGroupIds: Set<string>,
  from: string,
  to: string,
  hubEvents: PublicScheduleEvent[],
  canViewDetails: (groupId: string) => Promise<boolean>
): Promise<PublicScheduleEvent[]> {
  const config = await getGoogleCalendarConfig(db, env);
  if (!config.enabled) {
    return hubEvents;
  }

  const targets = await buildGoogleCalendarFetchTargets(
    db,
    config,
    scope,
    userGroupIds
  );
  if (targets.length === 0) {
    return hubEvents;
  }

  const groupsByName = new Map<string, { id: string; color: string }>();
  const allGroups = await db
    .prepare("SELECT id, display_name, color FROM hub_groups")
    .all<{ id: string; display_name: string; color: string }>();
  for (const g of allGroups.results ?? []) {
    groupsByName.set(g.display_name, { id: g.id, color: g.color ?? "#F38020" });
  }

  const targetByCalendarId = new Map(
    targets.map((t) => [t.calendar_id, t])
  );

  const hubEventIds = new Set(hubEvents.map((e) => e.id));
  const linkedGoogleIds = new Set<string>();
  const linkedRows = await db
    .prepare(
      `SELECT google_event_id_all, google_event_id_group
       FROM hub_schedule_events
       WHERE event_date >= ? AND event_date <= ?`
    )
    .bind(from, to)
    .all<{
      google_event_id_all: string | null;
      google_event_id_group: string | null;
    }>();
  for (const r of linkedRows.results ?? []) {
    if (r.google_event_id_all) linkedGoogleIds.add(r.google_event_id_all);
    if (r.google_event_id_group) linkedGoogleIds.add(r.google_event_id_group);
  }

  const seenScienceHubIds = new Set<string>();
  const seenOccurrenceKeys = new Set<string>();

  let googleOccurrences: GoogleCalendarFetchedOccurrence[] = [];
  try {
    googleOccurrences = await fetchGoogleCalendarScheduleEvents(
      env,
      from,
      to,
      targets
    );
  } catch (error) {
    console.error("Google Calendar fetch failed:", error);
    return hubEvents;
  }

  const merged = [...hubEvents];

  const wholeEventKeys = new Set<string>();
  const occurrenceCounts = new Map<string, number>();
  for (const occ of googleOccurrences) {
    const key = `${occ.calendar_id}\0${occ.google_event_id}`;
    occurrenceCounts.set(key, (occurrenceCounts.get(key) ?? 0) + 1);
  }
  for (const [key, count] of occurrenceCounts) {
    if (count > 1) wholeEventKeys.add(key);
  }

  for (const occ of googleOccurrences) {
    if (occ.event_date < from || occ.event_date > to) continue;

    if (occ.sciencehub_event_id) {
      if (hubEventIds.has(occ.sciencehub_event_id)) continue;
      if (seenScienceHubIds.has(occ.sciencehub_event_id)) continue;
      seenScienceHubIds.add(occ.sciencehub_event_id);
    }

    if (linkedGoogleIds.has(occ.google_event_id)) continue;

    const occurrenceKey = `${occ.google_event_id}:${occ.event_date}`;
    if (seenOccurrenceKeys.has(occurrenceKey)) continue;
    seenOccurrenceKeys.add(occurrenceKey);

    const target = targetByCalendarId.get(occ.calendar_id);
    if (!target) continue;

    let groupId = target.fallback_group_id;
    let groupDisplayName = target.fallback_group_display_name;
    let groupColor = target.fallback_group_color;

    const parsedName = parseGroupNameFromDescription(occ.description);
    if (parsedName) {
      const matched = groupsByName.get(parsedName);
      if (matched) {
        groupId = matched.id;
        groupDisplayName = parsedName;
        groupColor = matched.color;
      } else {
        groupDisplayName = parsedName;
      }
    }

    if (scope === "mine" && groupId && !userGroupIds.has(groupId)) {
      continue;
    }

    const showDetails = groupId
      ? await canViewDetails(groupId)
      : scope === "all";

    const canManage =
      showDetails && Boolean(groupId) && !groupId!.startsWith("gcal_");

    const wholeKey = `${occ.calendar_id}\0${occ.google_event_id}`;

    merged.push({
      id: `gcal_${occ.google_event_id}_${occ.event_date}`,
      title: occ.title,
      description: showDetails ? occ.description : null,
      event_date: occ.event_date,
      is_all_day: occ.is_all_day,
      start_time: occ.start_time,
      end_time: occ.end_time,
      time_label: formatScheduleTimeLabel(
        occ.is_all_day,
        occ.start_time,
        occ.end_time
      ),
      group_id: groupId ?? `gcal_${occ.calendar_id}`,
      group_display_name: groupDisplayName,
      group_color: groupColor,
      show_details: showDetails,
      can_manage: canManage,
      google_synced: true,
      source: "google",
      google_calendar_id: occ.calendar_id,
      google_event_id: occ.google_event_id,
      google_whole_event: wholeEventKeys.has(wholeKey),
    });
  }

  merged.sort((a, b) => {
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
  });

  return merged;
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
  const legendGroups = await getScheduleLegendGroups(
    db,
    userId,
    scope,
    {
      enabled: calendarSync.enabled,
      all_groups_calendar_name: calendarSync.all_groups_calendar_name,
      root_group_id: calendarSync.root_group_id,
      root_group_color: calendarSync.root_group_color,
    }
  );

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
      can_manage: showDetails,
      google_synced: Boolean(row.google_event_id_all || row.google_event_id_group),
      source: "hub",
    });
  }

  const mergedEvents = await mergeGoogleCalendarEvents(
    db,
    env,
    scope,
    userGroupIds,
    from,
    to,
    events,
    canViewDetails
  );

  return {
    can_create: canCreate,
    creatable_groups: creatableGroups,
    calendar_sync: {
      enabled: calendarSync.enabled,
      all_groups_calendar_name: calendarSync.all_groups_calendar_name,
      root_group_id: calendarSync.root_group_id,
    },
    legend_groups: legendGroups,
    events: mergedEvents,
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
    can_manage: true,
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

export interface UpdateScheduleInput {
  title?: string;
  description?: string;
  event_date?: string;
  is_all_day?: boolean;
  start_time?: string | null;
  end_time?: string | null;
}

interface ScheduleEventWithGroup extends ScheduleEventRow {
  group_display_name: string;
  group_color: string;
  google_calendar_id: string | null;
}

/** 予定の編集・削除権限を検証 */
async function assertCanManageScheduleEvent(
  db: D1Database,
  userId: string,
  eventId: string
): Promise<ScheduleEventWithGroup> {
  const row = await db
    .prepare(
      `SELECT e.id, e.group_id, e.title, e.description, e.event_date,
              e.is_all_day, e.start_time, e.end_time,
              e.google_event_id_all, e.google_event_id_group,
              e.created_by, e.created_at, e.updated_at,
              g.display_name AS group_display_name,
              g.color AS group_color,
              g.google_calendar_id
       FROM hub_schedule_events e
       JOIN hub_groups g ON g.id = e.group_id
       WHERE e.id = ?`
    )
    .bind(eventId)
    .first<ScheduleEventWithGroup>();

  if (!row) {
    throw new Error("予定が見つかりません");
  }

  const memberships = await getUserGroupMemberships(db, userId);
  const membership = memberships.find((m) => m.group_id === row.group_id);
  if (!membership) {
    throw new Error("このグループに所属していないため操作できません");
  }

  if (!(await canManageScheduleInGroup(db, membership))) {
    throw new Error("メンバー以上の権限が必要です");
  }

  return row;
}

function rowToPublicEvent(row: ScheduleEventWithGroup): PublicScheduleEvent {
  const isAllDay = row.is_all_day === 1;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    event_date: row.event_date,
    is_all_day: isAllDay,
    start_time: row.start_time,
    end_time: row.end_time,
    time_label: formatScheduleTimeLabel(isAllDay, row.start_time, row.end_time),
    group_id: row.group_id,
    group_display_name: row.group_display_name,
    group_color: row.group_color ?? "#F38020",
    show_details: true,
    can_manage: true,
    google_synced: Boolean(row.google_event_id_all || row.google_event_id_group),
    source: "hub",
  };
}

/** 予定を更新 */
export async function updateScheduleEvent(
  db: D1Database,
  env: Env,
  userId: string,
  eventId: string,
  input: UpdateScheduleInput
): Promise<{ event: PublicScheduleEvent; sync_warnings: string[] }> {
  const row = await assertCanManageScheduleEvent(db, userId, eventId);

  const title = input.title !== undefined ? input.title.trim() : row.title;
  if (!title) {
    throw new Error("タイトルを入力してください");
  }
  if (title.length > 120) {
    throw new Error("タイトルは120文字以内で入力してください");
  }

  const eventDate = input.event_date?.trim() ?? row.event_date;
  if (!DATE_RE.test(eventDate)) {
    throw new Error("日付の形式が不正です");
  }

  const description =
    input.description !== undefined
      ? input.description.trim() || null
      : row.description;
  if (description && description.length > 2000) {
    throw new Error("説明は2000文字以内で入力してください");
  }

  const isAllDay =
    input.is_all_day !== undefined ? input.is_all_day : row.is_all_day === 1;
  const { start_time, end_time } = validateScheduleTimes(
    isAllDay,
    input.start_time !== undefined ? input.start_time : row.start_time,
    input.end_time !== undefined ? input.end_time : row.end_time
  );

  const timestamp = now();
  await db
    .prepare(
      `UPDATE hub_schedule_events
       SET title = ?, description = ?, event_date = ?,
           is_all_day = ?, start_time = ?, end_time = ?, updated_at = ?
       WHERE id = ?`
    )
    .bind(
      title,
      description,
      eventDate,
      isAllDay ? 1 : 0,
      start_time,
      end_time,
      timestamp,
      eventId
    )
    .run();

  const updatedRow: ScheduleEventWithGroup = {
    ...row,
    title,
    description,
    event_date: eventDate,
    is_all_day: isAllDay ? 1 : 0,
    start_time,
    end_time,
    updated_at: timestamp,
  };

  const publicEvent = rowToPublicEvent(updatedRow);
  let syncWarnings: string[] = [];

  try {
    syncWarnings = await updateSyncedGoogleCalendarEvents(
      env,
      db,
      {
        id: eventId,
        title,
        description,
        event_date: eventDate,
        is_all_day: isAllDay,
        start_time,
        end_time,
        group_display_name: row.group_display_name,
        group_color: row.group_color ?? "#F38020",
      },
      row.google_event_id_all,
      row.google_event_id_group,
      row.google_calendar_id
    );
    publicEvent.google_synced = Boolean(
      row.google_event_id_all || row.google_event_id_group
    );
  } catch (error) {
    syncWarnings.push(
      error instanceof Error ? error.message : "Google カレンダー同期に失敗しました"
    );
  }

  return { event: publicEvent, sync_warnings: syncWarnings };
}

/** 予定を削除 */
export async function deleteScheduleEvent(
  db: D1Database,
  env: Env,
  userId: string,
  eventId: string
): Promise<{ sync_warnings: string[] }> {
  const row = await assertCanManageScheduleEvent(db, userId, eventId);
  let syncWarnings: string[] = [];

  try {
    syncWarnings = await deleteSyncedGoogleCalendarEvents(
      env,
      db,
      row.google_event_id_all,
      row.google_event_id_group,
      row.google_calendar_id
    );
  } catch (error) {
    syncWarnings.push(
      error instanceof Error ? error.message : "Google カレンダー同期に失敗しました"
    );
  }

  await db
    .prepare("DELETE FROM hub_schedule_events WHERE id = ?")
    .bind(eventId)
    .run();

  return { sync_warnings: syncWarnings };
}
