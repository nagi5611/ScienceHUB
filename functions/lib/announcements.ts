/**
 * ダッシュボードお知らせ
 */

import { createId, now } from "./types";

export interface AnnouncementRow {
  id: string;
  body: string;
  published_at: number;
  position: number;
  is_published: number;
  created_at: number;
  updated_at: number;
}

export interface Announcement {
  id: string;
  body: string;
  published_at: number;
  position: number;
  is_published: boolean;
  /** 空配列 = 全員に表示 */
  group_ids: string[];
  created_at: number;
  updated_at: number;
}

export interface PublicAnnouncement {
  id: string;
  body: string;
  published_at: number;
  date_label: string;
}

function toAnnouncement(row: AnnouncementRow, groupIds: string[]): Announcement {
  return {
    id: row.id,
    body: row.body,
    published_at: row.published_at,
    position: row.position ?? 0,
    is_published: Boolean(row.is_published),
    group_ids: groupIds,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

const ANNOUNCEMENT_SELECT =
  "id, body, published_at, position, is_published, created_at, updated_at";

/** お知らせごとのグループ ID 一覧 */
async function loadGroupIdsByAnnouncements(
  db: D1Database,
  announcementIds: string[]
): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  if (announcementIds.length === 0) return map;

  const placeholders = announcementIds.map(() => "?").join(", ");
  const result = await db
    .prepare(
      `SELECT announcement_id, group_id
       FROM announcement_groups
       WHERE announcement_id IN (${placeholders})
       ORDER BY group_id`
    )
    .bind(...announcementIds)
    .all<{ announcement_id: string; group_id: string }>();

  for (const row of result.results ?? []) {
    const list = map.get(row.announcement_id) ?? [];
    list.push(row.group_id);
    map.set(row.announcement_id, list);
  }
  return map;
}

/** お知らせにグループ紐付けを設定（空 = 全員） */
async function setAnnouncementGroups(
  db: D1Database,
  announcementId: string,
  groupIds: string[]
): Promise<void> {
  const uniqueIds = [...new Set(groupIds.filter(Boolean))];

  for (const groupId of uniqueIds) {
    const group = await db
      .prepare("SELECT id FROM hub_groups WHERE id = ?")
      .bind(groupId)
      .first<{ id: string }>();
    if (!group) {
      throw new Error("グループが見つかりません");
    }
  }

  await db
    .prepare("DELETE FROM announcement_groups WHERE announcement_id = ?")
    .bind(announcementId)
    .run();

  for (const groupId of uniqueIds) {
    await db
      .prepare(
        `INSERT INTO announcement_groups (announcement_id, group_id)
         VALUES (?, ?)`
      )
      .bind(announcementId, groupId)
      .run();
  }
}

/** JST の日付ラベル (MM/DD) */
export function formatAnnouncementDateLabel(publishedAt: number): string {
  const [year, month, day] = new Date(publishedAt)
    .toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" })
    .split("-");
  void year;
  return `${month}/${day}`;
}

/** date 入力値 (YYYY-MM-DD) を JST 正午のタイムスタンプへ */
export function dateInputToPublishedAt(dateStr: string): number {
  const trimmed = dateStr.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    throw new Error("日付の形式が不正です");
  }
  return new Date(`${trimmed}T12:00:00+09:00`).getTime();
}

/** タイムスタンプを date 入力値へ */
export function publishedAtToDateInput(publishedAt: number): string {
  return new Date(publishedAt).toLocaleDateString("sv-SE", {
    timeZone: "Asia/Tokyo",
  });
}

function validateBody(body: string): string {
  const trimmed = body.trim();
  if (!trimmed) {
    throw new Error("お知らせ本文を入力してください");
  }
  if (trimmed.length > 500) {
    throw new Error("お知らせは500文字以内で入力してください");
  }
  return trimmed;
}

/** 管理用一覧 */
export async function listAnnouncements(db: D1Database): Promise<Announcement[]> {
  const result = await db
    .prepare(
      `SELECT ${ANNOUNCEMENT_SELECT}
       FROM announcements
       ORDER BY position DESC, published_at DESC, created_at DESC`
    )
    .all<AnnouncementRow>();

  const rows = result.results ?? [];
  const groupMap = await loadGroupIdsByAnnouncements(
    db,
    rows.map((row) => row.id)
  );

  return rows.map((row) => toAnnouncement(row, groupMap.get(row.id) ?? []));
}

/** 公開中のお知らせ（ダッシュボード用・グループでフィルタ） */
export async function listPublishedAnnouncements(
  db: D1Database,
  userId: string
): Promise<PublicAnnouncement[]> {
  const result = await db
    .prepare(
      `SELECT a.id, a.body, a.published_at
       FROM announcements a
       WHERE a.is_published = 1
         AND (
           NOT EXISTS (
             SELECT 1 FROM announcement_groups ag
             WHERE ag.announcement_id = a.id
           )
           OR EXISTS (
             SELECT 1 FROM announcement_groups ag
             JOIN user_group_memberships ugm
               ON ugm.group_id = ag.group_id AND ugm.user_id = ?
             WHERE ag.announcement_id = a.id
           )
         )
       ORDER BY a.position DESC, a.published_at DESC, a.created_at DESC
       LIMIT 20`
    )
    .bind(userId)
    .all<Pick<AnnouncementRow, "id" | "body" | "published_at">>();

  return (result.results ?? []).map((row) => ({
    id: row.id,
    body: row.body,
    published_at: row.published_at,
    date_label: formatAnnouncementDateLabel(row.published_at),
  }));
}

/** ID で取得 */
export async function getAnnouncementById(
  db: D1Database,
  id: string
): Promise<Announcement | null> {
  const row = await db
    .prepare(`SELECT ${ANNOUNCEMENT_SELECT} FROM announcements WHERE id = ?`)
    .bind(id)
    .first<AnnouncementRow>();

  if (!row) return null;
  const groupMap = await loadGroupIdsByAnnouncements(db, [row.id]);
  return toAnnouncement(row, groupMap.get(row.id) ?? []);
}

/** お知らせ作成 */
export async function createAnnouncement(
  db: D1Database,
  input: {
    body: string;
    published_at: number;
    is_published?: boolean;
    position?: number;
    group_ids?: string[];
  }
): Promise<Announcement> {
  const body = validateBody(input.body);
  const ts = now();
  const id = createId("ann");

  let position = input.position;
  if (position === undefined) {
    const maxRow = await db
      .prepare(`SELECT MAX(position) AS max_position FROM announcements`)
      .first<{ max_position: number | null }>();
    position = (maxRow?.max_position ?? -1) + 1;
  }

  await db
    .prepare(
      `INSERT INTO announcements (id, body, published_at, position, is_published, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      body,
      input.published_at,
      position,
      input.is_published === false ? 0 : 1,
      ts,
      ts
    )
    .run();

  if (input.group_ids !== undefined) {
    await setAnnouncementGroups(db, id, input.group_ids);
  }

  const created = await getAnnouncementById(db, id);
  if (!created) {
    throw new Error("お知らせの作成に失敗しました");
  }
  return created;
}

/** お知らせ更新 */
export async function updateAnnouncement(
  db: D1Database,
  id: string,
  input: {
    body?: string;
    published_at?: number;
    is_published?: boolean;
    position?: number;
    group_ids?: string[];
  }
): Promise<Announcement | null> {
  const existing = await getAnnouncementById(db, id);
  if (!existing) return null;

  const body = input.body !== undefined ? validateBody(input.body) : existing.body;
  const publishedAt = input.published_at ?? existing.published_at;
  const position = input.position ?? existing.position;
  const isPublished =
    input.is_published !== undefined
      ? input.is_published
        ? 1
        : 0
      : existing.is_published
        ? 1
        : 0;
  const ts = now();

  await db
    .prepare(
      `UPDATE announcements
       SET body = ?, published_at = ?, position = ?, is_published = ?, updated_at = ?
       WHERE id = ?`
    )
    .bind(body, publishedAt, position, isPublished, ts, id)
    .run();

  if (input.group_ids !== undefined) {
    await setAnnouncementGroups(db, id, input.group_ids);
  }

  return getAnnouncementById(db, id);
}

/** お知らせ削除 */
export async function deleteAnnouncement(db: D1Database, id: string): Promise<void> {
  const existing = await getAnnouncementById(db, id);
  if (!existing) {
    throw new Error("お知らせが見つかりません");
  }
  await db.prepare(`DELETE FROM announcements WHERE id = ?`).bind(id).run();
}
