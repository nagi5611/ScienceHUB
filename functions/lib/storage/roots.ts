/**
 * ストレージルートの自動作成・バックフィル
 */

import { createId, now } from "../types";
import { getFiles } from "../r2";
import type { Env } from "../types";
import {
  createFolderMeta,
  writeMetaJson,
} from "./meta";
import { folderMetaKey } from "./keys";
import {
  defaultUserQuota,
  getGroupStorageRoot,
  getUserStorageRoot,
  quotaAfterRoleUpgrade,
  QUOTA_GROUP,
  type StorageRootRow,
} from "./quota";

/** ユーザー個人ストレージルートを確保 */
export async function ensureUserStorageRoot(
  env: Env,
  db: D1Database,
  userId: string,
  username: string,
  roleSlug: string
): Promise<StorageRootRow> {
  const existing = await getUserStorageRoot(db, userId);
  if (existing) return existing;

  const id = createId("sroot");
  const ts = now();
  const quota = defaultUserQuota(roleSlug);

  await db
    .prepare(
      `INSERT INTO storage_roots (id, root_type, user_id, group_id, quota_bytes, used_bytes, created_at, updated_at)
       VALUES (?, 'user', ?, NULL, ?, 0, ?, ?)`
    )
    .bind(id, userId, quota, ts, ts)
    .run();

  const bucket = getFiles(env);
  const meta = createFolderMeta(username, "user");
  await writeMetaJson(
    bucket,
    folderMetaKey("user", username, ""),
    meta
  );

  const row = await getUserStorageRoot(db, userId);
  if (!row) throw new Error("ストレージルートの作成に失敗しました");
  return row;
}

/** グループストレージルートを確保 */
export async function ensureGroupStorageRoot(
  env: Env,
  db: D1Database,
  groupId: string,
  groupSlug: string,
  createdByUsername: string
): Promise<StorageRootRow> {
  const existing = await getGroupStorageRoot(db, groupId);
  if (existing) return existing;

  const id = createId("sroot");
  const ts = now();

  await db
    .prepare(
      `INSERT INTO storage_roots (id, root_type, user_id, group_id, quota_bytes, used_bytes, created_at, updated_at)
       VALUES (?, 'group', NULL, ?, ?, 0, ?, ?)`
    )
    .bind(id, groupId, QUOTA_GROUP, ts, ts)
    .run();

  const bucket = getFiles(env);
  const meta = createFolderMeta(createdByUsername, "group");
  await writeMetaJson(
    bucket,
    folderMetaKey("group", groupSlug, ""),
    meta
  );

  const row = await getGroupStorageRoot(db, groupId);
  if (!row) throw new Error("グループストレージルートの作成に失敗しました");
  return row;
}

/** ロール変更時に個人クォータを更新 */
export async function applyUserQuotaOnRoleChange(
  db: D1Database,
  userId: string,
  newRoleSlug: string
): Promise<void> {
  const root = await getUserStorageRoot(db, userId);
  if (!root) return;

  const newQuota = quotaAfterRoleUpgrade(root.quota_bytes, newRoleSlug);
  if (newQuota === root.quota_bytes) return;

  await db
    .prepare(
      `UPDATE storage_roots SET quota_bytes = ?, updated_at = ? WHERE id = ?`
    )
    .bind(newQuota, now(), root.id)
    .run();
}

/** 既存ユーザー・グループのルートを一括作成 */
export async function backfillStorageRoots(
  env: Env,
  db: D1Database
): Promise<{ users: number; groups: number }> {
  let users = 0;
  let groups = 0;

  const userRows = await db
    .prepare("SELECT id, username, role_slug FROM users")
    .all<{ id: string; username: string; role_slug: string }>();

  for (const user of userRows.results ?? []) {
    const before = await getUserStorageRoot(db, user.id);
    if (!before) {
      await ensureUserStorageRoot(env, db, user.id, user.username, user.role_slug);
      users++;
    }
  }

  const groupRows = await db
    .prepare("SELECT id, slug FROM hub_groups")
    .all<{ id: string; slug: string }>();

  for (const group of groupRows.results ?? []) {
    const before = await getGroupStorageRoot(db, group.id);
    if (!before) {
      await ensureGroupStorageRoot(env, db, group.id, group.slug, "system");
      groups++;
    }
  }

  return { users, groups };
}

/** username / group slug から storage root row を解決 */
export async function resolveRootForPath(
  db: D1Database,
  rootType: "user" | "group",
  rootKey: string
): Promise<StorageRootRow | null> {
  if (rootType === "user") {
    return db
      .prepare(
        `SELECT sr.* FROM storage_roots sr
         JOIN users u ON u.id = sr.user_id
         WHERE u.username = ?`
      )
      .bind(rootKey)
      .first<StorageRootRow>();
  }

  return db
    .prepare(
      `SELECT sr.* FROM storage_roots sr
       JOIN hub_groups hg ON hg.id = sr.group_id
       WHERE hg.slug = ?`
    )
    .bind(rootKey)
    .first<StorageRootRow>();
}
