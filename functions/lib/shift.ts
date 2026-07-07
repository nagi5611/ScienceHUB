/**
 * シフト管理 — 出勤可能日
 */

import { createId, now } from "./types";
import { getUserGroupMemberships } from "./groups";

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
}

export interface ShiftListResult {
  mine: string[];
  members: ShiftMember[];
  others: Record<string, string[]>;
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

/** 同一グループのメンバー一覧を取得 */
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

/** 期間内の出勤可能日を取得 */
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

  const mineResult = await db
    .prepare(
      `SELECT avail_date FROM shift_availability
       WHERE user_id = ? AND avail_date >= ? AND avail_date <= ?
       ORDER BY avail_date`
    )
    .bind(userId, from, to)
    .all<{ avail_date: string }>();

  const mine = (mineResult.results ?? []).map((r) => r.avail_date);

  if (memberIdList.length === 0) {
    return { mine, members: [], others: {} };
  }

  const memberPlaceholders = memberIdList.map(() => "?").join(", ");
  const membersResult = await db
    .prepare(
      `SELECT id, display_name, username
       FROM users
       WHERE id IN (${memberPlaceholders})
       ORDER BY display_name COLLATE NOCASE, username`
    )
    .bind(...memberIdList)
    .all<{ id: string; display_name: string; username: string }>();

  const members: ShiftMember[] = (membersResult.results ?? [])
    .filter((u) => u.id !== userId)
    .map((u) => ({
      id: u.id,
      display_name: u.display_name || u.username,
      username: u.username,
    }));

  const otherIds = members.map((m) => m.id);
  const others: Record<string, string[]> = {};
  for (const m of members) {
    others[m.id] = [];
  }

  if (otherIds.length > 0) {
    const otherPlaceholders = otherIds.map(() => "?").join(", ");
    const othersResult = await db
      .prepare(
        `SELECT user_id, avail_date FROM shift_availability
         WHERE user_id IN (${otherPlaceholders})
           AND avail_date >= ? AND avail_date <= ?
         ORDER BY avail_date`
      )
      .bind(...otherIds, from, to)
      .all<{ user_id: string; avail_date: string }>();

    for (const row of othersResult.results ?? []) {
      const list = others[row.user_id];
      if (list) list.push(row.avail_date);
    }
  }

  return { mine, members, others };
}

/** 出勤可能日を一括設定 */
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

/** 単一日付の出勤可能をトグル */
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
