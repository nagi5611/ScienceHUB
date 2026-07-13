// functions/lib/3dprint/print-app-settings.ts
import { getAppBySlug, loadAppAccessMeta, membershipCanAccessApp } from '../apps';
import { getUserGroupMemberships } from '../groups';
import { buildLogicalPath, parseLogicalPath } from '../storage/keys';
import type { StorageRootEntry } from '../storage/list';

export const PRINT_VIDEO_STORAGE_PATH_KEY = 'print_video_storage_path';
const MANAGEMENT_APP_SLUG = '3dprint-management';

/** 印刷動画のクラウドストレージ保存先ディレクトリ（論理パス）を取得 */
export async function getPrintVideoStoragePath(db: D1Database): Promise<string | null> {
  const row = await db
    .prepare('SELECT value FROM print_app_settings WHERE key = ?')
    .bind(PRINT_VIDEO_STORAGE_PATH_KEY)
    .first<{ value: string }>();
  const value = row?.value?.trim();
  return value || null;
}

/** 印刷動画の保存先ディレクトリを設定 */
export async function setPrintVideoStoragePath(db: D1Database, path: string): Promise<void> {
  const normalized = path.replace(/^\/+|\/+$/g, '');
  const ts = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO print_app_settings (key, value, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
    )
    .bind(PRINT_VIDEO_STORAGE_PATH_KEY, normalized, ts)
    .run();
}

/** 3D印刷管理アプリにアクセス可能なチームのストレージルート一覧 */
export async function getManagementAccessibleGroupRoots(
  db: D1Database,
  userId: string,
  isAdmin: boolean
): Promise<StorageRootEntry[]> {
  const app = await getAppBySlug(db, MANAGEMENT_APP_SLUG);
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

/** 保存先パスが管理権限のあるチーム配下か検証 */
export async function validatePrintVideoStoragePathForUser(
  db: D1Database,
  userId: string,
  isAdmin: boolean,
  path: string
): Promise<string | null> {
  const normalized = path.replace(/^\/+|\/+$/g, '');
  if (!normalized) return '保存先ディレクトリを入力してください';

  const parsed = parseLogicalPath(normalized);
  if (!parsed) return 'パス形式が不正です（例: g/チームslug/フォルダ名）';
  if (parsed.rootType !== 'group') {
    return 'チームのクラウドストレージ（g/ で始まるパス）を指定してください';
  }

  const allowedRoots = await getManagementAccessibleGroupRoots(db, userId, isAdmin);
  const allowed = allowedRoots.some((r) => r.key === parsed.rootKey);
  if (!allowed) {
    return 'このチームのストレージを指定する権限がありません';
  }

  return null;
}
