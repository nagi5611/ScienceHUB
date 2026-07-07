/**
 * シフト管理 — 出勤可能日
 */

import { createId, now } from "./types";
import { getUserGroupMemberships } from "./groups";
import { SHIFT_COLOR_COUNT, isValidShiftColorIndex } from "./shift-colors";

export interface ShiftAvailabilityRow {
  id: string;
  user_id: string;
  avail_date: string;
  created_at: number;
  updated_at: number;
}

export interface ShiftMember {
  id: string;
  display_name: string;
  username: string;
  color_index: number;
  is_self: boolean;
}

export interface ShiftAvailabilityEntry {
  user_id: string;
  date: string;
}

export interface ShiftListResult {
  current_user_id: string;
  members: ShiftMember[];
  availability: ShiftAvailabilityEntry[];
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** 日付文字列の妥当性を検証 */
export function isValidDateStr(value: string): boolean {
  if (!DATE_RE.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}

/** 同一グループのメンバー ID を取得 */
async function getSharedGroupMemberIds(
  db: D1Database,
  userId: string
): Promise<Set<string>> {
  const memberships = await getUserGroupMemberships(db, userId);
  const groupIds = memberships.map((m) => m.group_id);
  if (groupIds.length === 0) return new Set([userId]);

  const placeholders = groupIds.map(() => "?").join(", ");
  const result = await db
    .prepare(
      `SELECT DISTINCT ugm.user_id
       FROM user_group_memberships ugm
       WHERE ugm.group_id IN (${placeholders})`
    )
    .bind(...groupIds)
    .all<{ user_id: string }>();

  const ids = new Set((result.results ?? []).map((r) => r.user_id));
  ids.add(userId);
  return ids;
}

/** 期間内のシフト一覧を取得 */
export async function listShiftAvailability(
  db: D1Database,
  userId: string,
  from: string,
  to: string
): Promise<ShiftListResult> {
  if (!isValidDateStr(from) || !isValidDateStr(to)) {
    throw new Error("日付の形式が不正です");
  }
  if (from > to) {
    throw new Error("from は to 以前である必要があります");
  }

  const memberIds = await getSharedGroupMemberIds(db, userId);
  const memberIdList = [...memberIds];

  if (memberIdList.length === 0) {
    return { current_user_id: userId, members: [], availability: [] };
  }

  const memberPlaceholders = memberIdList.map(() => "?").join(", ");
  const membersResult = await db
    .prepare(
      `SELECT id, display_name, username, shift_color_index
       FROM users
       WHERE id IN (${memberPlaceholders})
       ORDER BY display_name COLLATE NOCASE, username`
    )
    .bind(...memberIdList)
    .all<{
      id: string;
      display_name: string;
      username: string;
      shift_color_index: number;
    }>();

  const members: ShiftMember[] = (membersResult.results ?? []).map((u) => ({
    id: u.id,
    display_name: u.display_name || u.username,
    username: u.username,
    color_index: normalizeColorIndex(u.shift_color_index),
    is_self: u.id === userId,
  }));

  const availResult = await db
    .prepare(
      `SELECT user_id, avail_date FROM shift_availability
       WHERE user_id IN (${memberPlaceholders})
         AND avail_date >= ? AND avail_date <= ?
       ORDER BY avail_date`
    )
    .bind(...memberIdList, from, to)
    .all<{ user_id: string; avail_date: string }>();

  const availability: ShiftAvailabilityEntry[] = (
    availResult.results ?? []
  ).map((row) => ({
    user_id: row.user_id,
    date: row.avail_date,
  }));

  return { current_user_id: userId, members, availability };
}

/** 色インデックスを 0〜7 に正規化 */
function normalizeColorIndex(value: number | null | undefined): number {
  if (typeof value !== "number" || !Number.isInteger(value)) return 0;
  return ((value % SHIFT_COLOR_COUNT) + SHIFT_COLOR_COUNT) % SHIFT_COLOR_COUNT;
}

/** 自分のシフト色を更新 */
export async function updateShiftColor(
  db: D1Database,
  userId: string,
  colorIndex: number
): Promise<ShiftMember> {
  if (!isValidShiftColorIndex(colorIndex)) {
    throw new Error("色の指定が不正です");
  }

  const ts = now();
  await db
    .prepare(
      "UPDATE users SET shift_color_index = ?, updated_at = ? WHERE id = ?"
    )
    .bind(colorIndex, ts, userId)
    .run();

  const user = await db
    .prepare(
      "SELECT id, display_name, username, shift_color_index FROM users WHERE id = ?"
    )
    .bind(userId)
    .first<{
      id: string;
      display_name: string;
      username: string;
      shift_color_index: number;
    }>();

  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }

  return {
    id: user.id,
    display_name: user.display_name || user.username,
    username: user.username,
    color_index: normalizeColorIndex(user.shift_color_index),
    is_self: true,
  };
}

/** 出勤可能日を一括設定（自分のみ） */
export async function setShiftAvailability(
  db: D1Database,
  userId: string,
  dates: string[],
  available: boolean
): Promise<string[]> {
  const uniqueDates = [...new Set(dates)];
  for (const date of uniqueDates) {
    if (!isValidDateStr(date)) {
      throw new Error(`不正な日付: ${date}`);
    }
  }

  const updated: string[] = [];

  if (available) {
    for (const availDate of uniqueDates) {
      const existing = await db
        .prepare(
          "SELECT id FROM shift_availability WHERE user_id = ? AND avail_date = ?"
        )
        .bind(userId, availDate)
        .first<{ id: string }>();

      if (existing) {
        updated.push(availDate);
        continue;
      }

      const ts = now();
      await db
        .prepare(
          `INSERT INTO shift_availability (id, user_id, avail_date, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?)`
        )
        .bind(createId("shift"), userId, availDate, ts, ts)
        .run();
      updated.push(availDate);
    }
  } else {
    for (const availDate of uniqueDates) {
      await db
        .prepare(
          "DELETE FROM shift_availability WHERE user_id = ? AND avail_date = ?"
        )
        .bind(userId, availDate)
        .run();
      updated.push(availDate);
    }
  }

  return updated;
}

/** 単一日付の出勤可能をトグル（自分のみ） */
export async function toggleShiftAvailability(
  db: D1Database,
  userId: string,
  date: string
): Promise<{ date: string; available: boolean }> {
  if (!isValidDateStr(date)) {
    throw new Error("日付の形式が不正です");
  }

  const existing = await db
    .prepare(
      "SELECT id FROM shift_availability WHERE user_id = ? AND avail_date = ?"
    )
    .bind(userId, date)
    .first<{ id: string }>();

  if (existing) {
    await db
      .prepare(
        "DELETE FROM shift_availability WHERE user_id = ? AND avail_date = ?"
      )
      .bind(userId, date)
      .run();
    return { date, available: false };
  }

  const ts = now();
  await db
    .prepare(
      `INSERT INTO shift_availability (id, user_id, avail_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(createId("shift"), userId, date, ts, ts)
    .run();

  return { date, available: true };
}
