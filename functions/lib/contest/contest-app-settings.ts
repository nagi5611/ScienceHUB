// functions/lib/contest/contest-app-settings.ts
import { getAppBySlug, loadAppAccessMeta, membershipCanAccessApp } from '../apps';
import { getUserGroupMemberships } from '../groups';
import { buildLogicalPath } from '../storage/keys';
import type { StorageRootEntry } from '../storage/list';

export const CONTEST_STORAGE_GROUP_SLUG_KEY = 'contest_storage_group_slug';
const CONTEST_MANAGEMENT_APP_SLUG = 'contest-management';

/** 提出ファイル集約先のグループ slug（未設定なら null） */
export async function getContestStorageGroupSlug(db: D1Database): Promise<string | null> {
  const row = await db
    .prepare('SELECT value FROM print_app_settings WHERE key = ?')
    .bind(CONTEST_STORAGE_GROUP_SLUG_KEY)
    .first<{ value: string }>();
  const value = row?.value?.trim();
  return value || null;
}

/** 提出ファイル集約先グループを設定 */
export async function setContestStorageGroupSlug(db: D1Database, groupSlug: string): Promise<void> {
  const normalized = groupSlug.trim().toLowerCase();
  const ts = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO print_app_settings (key, value, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
    )
    .bind(CONTEST_STORAGE_GROUP_SLUG_KEY, normalized, ts)
    .run();
}

/** 造形物コンテスト管理アプリから指定可能なグループルート一覧 */
export async function getContestManagementAccessibleGroupRoots(
  db: D1Database,
  userId: string,
  isAdmin: boolean
): Promise<StorageRootEntry[]> {
  const app = await getAppBySlug(db, CONTEST_MANAGEMENT_APP_SLUG);
  if (!app) return [];

  if (isAdmin) {
    const allGroups = await db
      .prepare(
        `SELECT slug, display_name FROM hub_groups ORDER BY position ASC, display_name ASC`
      )
      .all<{ slug: string; display_name: string }>();

    return (allGroups.results ?? []).map((g) => ({
      path: buildLogicalPath('group', g.slug),
      type: 'group' as const,
      label: g.display_name,
      key: g.slug,
    }));
  }

  const { enabledGroupIds, roleRestrictions } = await loadAppAccessMeta(db, app.id);
  if (enabledGroupIds.size === 0) return [];

  const memberships = await getUserGroupMemberships(db, userId);
  const roots: StorageRootEntry[] = [];

  for (const membership of memberships) {
    if (!membershipCanAccessApp(membership, enabledGroupIds, roleRestrictions)) {
      continue;
    }
    roots.push({
      path: buildLogicalPath('group', membership.group_slug),
      type: 'group',
      label: membership.group_display_name,
      key: membership.group_slug,
    });
  }

  return roots.sort((a, b) => a.label.localeCompare(b.label, 'ja'));
}

/** 指定グループ slug が管理ユーザーから選べるか */
export async function validateContestStorageGroupForUser(
  db: D1Database,
  userId: string,
  isAdmin: boolean,
  groupSlug: string
): Promise<string | null> {
  const normalized = groupSlug.trim().toLowerCase();
  if (!normalized) return '集約先のグループを選択してください';

  const allowedRoots = await getContestManagementAccessibleGroupRoots(db, userId, isAdmin);
  const allowed = allowedRoots.some((r) => r.key === normalized);
  if (!allowed) {
    return 'このグループを指定する権限がありません';
  }

  const exists = await db
    .prepare('SELECT id FROM hub_groups WHERE slug = ?')
    .bind(normalized)
    .first();
  if (!exists) return 'グループが見つかりません';

  return null;
}
