/**
 * 個人ストレージ + 公開サイトの統合クォータ
 */

import {
  canAllocateBytes,
  getUserStorageRoot,
  type StorageRootRow,
} from "./quota";

export interface UserCombinedQuota {
  quota_bytes: number;
  personal_used_bytes: number;
  website_used_bytes: number;
  combined_used_bytes: number;
  available_bytes: number;
}

export const USER_COMBINED_QUOTA_ERROR =
  "ストレージ上限（個人ファイルと公開サイトの合計）を超えるため操作できません";

/** ユーザーの公開サイト使用量合計 */
export async function getUserWebSitesUsedBytes(
  db: D1Database,
  userId: string
): Promise<number> {
  const row = await db
    .prepare(
      `SELECT COALESCE(SUM(used_bytes), 0) AS total
       FROM web_sites
       WHERE owner_user_id = ?`
    )
    .bind(userId)
    .first<{ total: number }>();
  return Number(row?.total) || 0;
}

/** 個人ルートの統合使用量 */
export function getCombinedUserUsedBytes(
  root: StorageRootRow,
  websiteUsedBytes: number
): number {
  if (root.root_type !== "user") return root.used_bytes;
  return root.used_bytes + websiteUsedBytes;
}

/** 個人ルート向け統合クォータ情報 */
export async function getUserCombinedQuota(
  db: D1Database,
  userId: string
): Promise<UserCombinedQuota | null> {
  const root = await getUserStorageRoot(db, userId);
  if (!root) return null;

  const websiteUsed = await getUserWebSitesUsedBytes(db, userId);
  const combined = getCombinedUserUsedBytes(root, websiteUsed);

  return {
    quota_bytes: root.quota_bytes,
    personal_used_bytes: root.used_bytes,
    website_used_bytes: websiteUsed,
    combined_used_bytes: combined,
    available_bytes: Math.max(0, root.quota_bytes - combined),
  };
}

/** 追加バイトを割り当て可能か（個人ルートは公開サイト分を含む） */
export function canAllocateUserCombinedBytes(
  root: StorageRootRow,
  websiteUsedBytes: number,
  additionalBytes: number
): boolean {
  if (additionalBytes <= 0) return true;
  if (root.root_type !== "user") {
    return canAllocateBytes(root, additionalBytes);
  }
  return (
    getCombinedUserUsedBytes(root, websiteUsedBytes) + additionalBytes <=
    root.quota_bytes
  );
}

/** クラウドストレージ向け割り当てチェック */
export async function canAllocateStorageBytes(
  db: D1Database,
  root: StorageRootRow,
  userId: string,
  additionalBytes: number
): Promise<boolean> {
  if (additionalBytes <= 0) return true;
  if (root.root_type !== "user") {
    return canAllocateBytes(root, additionalBytes);
  }
  const websiteUsed = await getUserWebSitesUsedBytes(db, userId);
  return canAllocateUserCombinedBytes(root, websiteUsed, additionalBytes);
}
