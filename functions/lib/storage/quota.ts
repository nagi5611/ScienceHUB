/**
 * クラウドストレージクォータ管理
 */

import {
  QUOTA_ADMIN_MAX,
  QUOTA_GUEST,
  QUOTA_GROUP,
  QUOTA_MEMBER,
} from "./constants";
import { now } from "../types";

export interface StorageRootRow {
  id: string;
  root_type: "user" | "group";
  user_id: string | null;
  group_id: string | null;
  quota_bytes: number;
  used_bytes: number;
  created_at: number;
  updated_at: number;
}

/** ハブロールに応じた個人クォータ初期値 */
export function defaultUserQuota(roleSlug: string): number {
  if (roleSlug === "guest") return QUOTA_GUEST;
  return QUOTA_MEMBER;
}

/** ロール昇格時のクォータ更新値 */
export function quotaAfterRoleUpgrade(
  currentQuota: number,
  newRoleSlug: string
): number {
  if (newRoleSlug === "member" || newRoleSlug === "admin") {
    return Math.max(currentQuota, QUOTA_MEMBER);
  }
  return currentQuota;
}

/** ユーザー個人ルートを取得 */
export async function getUserStorageRoot(
  db: D1Database,
  userId: string
): Promise<StorageRootRow | null> {
  return db
    .prepare("SELECT * FROM storage_roots WHERE user_id = ?")
    .bind(userId)
    .first<StorageRootRow>();
}

/** グループルートを取得 */
export async function getGroupStorageRoot(
  db: D1Database,
  groupId: string
): Promise<StorageRootRow | null> {
  return db
    .prepare("SELECT * FROM storage_roots WHERE group_id = ?")
    .bind(groupId)
    .first<StorageRootRow>();
}

/** ID でルート取得 */
export async function getStorageRootById(
  db: D1Database,
  rootId: string
): Promise<StorageRootRow | null> {
  return db
    .prepare("SELECT * FROM storage_roots WHERE id = ?")
    .bind(rootId)
    .first<StorageRootRow>();
}

/** アップロード可能か検証 */
export function canAllocateBytes(root: StorageRootRow, additionalBytes: number): boolean {
  return root.used_bytes + additionalBytes <= root.quota_bytes;
}

/** 使用量を加算 */
export async function addUsedBytes(
  db: D1Database,
  rootId: string,
  bytes: number
): Promise<void> {
  const ts = now();
  await db
    .prepare(
      `UPDATE storage_roots
       SET used_bytes = used_bytes + ?, updated_at = ?
       WHERE id = ?`
    )
    .bind(bytes, ts, rootId)
    .run();
}

/** 使用量を減算 */
export async function subtractUsedBytes(
  db: D1Database,
  rootId: string,
  bytes: number
): Promise<void> {
  const ts = now();
  await db
    .prepare(
      `UPDATE storage_roots
       SET used_bytes = MAX(0, used_bytes - ?), updated_at = ?
       WHERE id = ?`
    )
    .bind(bytes, ts, rootId)
    .run();
}

/** 管理者がクォータを更新 */
export async function updateRootQuota(
  db: D1Database,
  rootId: string,
  quotaBytes: number
): Promise<string | null> {
  if (quotaBytes <= 0 || quotaBytes > QUOTA_ADMIN_MAX) {
    return "割り当て領域は 1 バイト以上 10 TB 以下にしてください";
  }

  const root = await getStorageRootById(db, rootId);
  if (!root) return "ストレージルートが見つかりません";

  if (quotaBytes < root.used_bytes) {
    return "使用中のサイズより小さい割り当て領域には設定できません";
  }

  await db
    .prepare(
      `UPDATE storage_roots SET quota_bytes = ?, updated_at = ? WHERE id = ?`
    )
    .bind(quotaBytes, now(), rootId)
    .run();

  return null;
}

/** 全ストレージルート一覧（管理用） */
export async function listAllStorageRoots(
  db: D1Database
): Promise<
  Array<
    StorageRootRow & {
      username: string | null;
      user_email: string | null;
      user_display_name: string | null;
      group_slug: string | null;
      group_display_name: string | null;
    }
  >
> {
  const result = await db
    .prepare(
      `SELECT sr.*,
              u.username,
              u.email AS user_email,
              u.display_name AS user_display_name,
              hg.slug AS group_slug,
              hg.display_name AS group_display_name
       FROM storage_roots sr
       LEFT JOIN users u ON u.id = sr.user_id
       LEFT JOIN hub_groups hg ON hg.id = sr.group_id
       ORDER BY sr.root_type ASC, u.username ASC, hg.display_name ASC`
    )
    .all<
      StorageRootRow & {
        username: string | null;
        user_email: string | null;
        user_display_name: string | null;
        group_slug: string | null;
        group_display_name: string | null;
      }
    >();

  return result.results ?? [];
}

export { QUOTA_GROUP };
