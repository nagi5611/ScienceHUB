// functions/lib/simulation/sim-app-settings.ts
import { getAppBySlug, loadAppAccessMeta, membershipCanAccessApp } from '../apps';
import { getUserGroupMemberships } from '../groups';
import { buildLogicalPath, parseLogicalPath } from '../storage/keys';
import type { StorageRootEntry } from '../storage/list';
import { isValidDiscordUserId } from './shift-guard';

export const PRINT_VIDEO_STORAGE_PATH_KEY = 'result_video_storage_path';
export const DISCORD_WEBHOOK_URL_KEY = 'discord_webhook_url';
export const FDS_DISCORD_MENTION_USER_IDS_KEY = 'fds_discord_mention_user_ids';
const MANAGEMENT_APP_SLUG = 'simulation-management';

const DISCORD_WEBHOOK_PREFIXES = [
  'https://discord.com/api/webhooks/',
  'https://discordapp.com/api/webhooks/',
];

/** Discord Webhook URL を検証・正規化（空は null） */
export function normalizeSimDiscordWebhookUrl(input: string | null | undefined): string | null {
  const trimmed = String(input ?? '').trim();
  if (!trimmed) return null;
  if (!DISCORD_WEBHOOK_PREFIXES.some((prefix) => trimmed.startsWith(prefix))) {
    throw new Error(
      'Discord Webhook URL は https://discord.com/api/webhooks/ で始まる必要があります'
    );
  }
  return trimmed;
}

/** 管理画面で保存した Discord Webhook URL（未保存の場合は null） */
export async function getSimDiscordWebhookUrlFromDb(db: D1Database): Promise<string | null> {
  const row = await db
    .prepare('SELECT value FROM sim_app_settings WHERE key = ?')
    .bind(DISCORD_WEBHOOK_URL_KEY)
    .first<{ value: string }>();
  if (!row) return null;
  const value = row.value?.trim();
  return value || null;
}

/** Discord Webhook URL を sim_app_settings に保存（空で通知オフ） */
export async function setSimDiscordWebhookUrl(
  db: D1Database,
  input: string | null | undefined
): Promise<void> {
  const trimmed = String(input ?? '').trim();
  const value = trimmed ? normalizeSimDiscordWebhookUrl(trimmed) : '';
  const ts = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO sim_app_settings (key, value, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
    )
    .bind(DISCORD_WEBHOOK_URL_KEY, value, ts)
    .run();
}

/** 通知送信先（DB 優先。未設定時は Wrangler の DISCORD_SIMULATION_WEBHOOK_URL） */
export async function resolveSimDiscordWebhookUrl(
  db: D1Database,
  env: { DISCORD_SIMULATION_WEBHOOK_URL?: string }
): Promise<string | undefined> {
  const row = await db
    .prepare('SELECT value FROM sim_app_settings WHERE key = ?')
    .bind(DISCORD_WEBHOOK_URL_KEY)
    .first<{ value: string }>();
  if (row) {
    const fromDb = row.value?.trim();
    return fromDb || undefined;
  }
  const fromEnv = env.DISCORD_SIMULATION_WEBHOOK_URL?.trim();
  return fromEnv || undefined;
}

/** Parses Discord user IDs from admin input (comma / newline separated). */
export function parseFdsDiscordMentionUserIdsInput(
  input: string | null | undefined
): string[] {
  const raw = String(input ?? '').trim();
  if (!raw) return [];
  const parts = raw.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);
  const ids: string[] = [];
  for (const part of parts) {
    if (!isValidDiscordUserId(part)) {
      throw new Error(
        `Discord ユーザー ID の形式が不正です（17〜20桁の数字）: ${part}`
      );
    }
    if (!ids.includes(part)) ids.push(part);
  }
  return ids;
}

/** FDS 二次審査通知のメンション先（設定が空なら担当メンバー全員の Discord ID） */
export async function getFdsDiscordMentionUserIdsFromDb(db: D1Database): Promise<string[]> {
  const row = await db
    .prepare('SELECT value FROM sim_app_settings WHERE key = ?')
    .bind(FDS_DISCORD_MENTION_USER_IDS_KEY)
    .first<{ value: string }>();
  const raw = row?.value?.trim();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((id) => String(id).trim())
      .filter((id) => isValidDiscordUserId(id));
  } catch {
    return parseFdsDiscordMentionUserIdsInput(raw);
  }
}

/** Saves FDS secondary-review mention user IDs (empty clears; falls back to sim_members). */
export async function setFdsDiscordMentionUserIds(
  db: D1Database,
  input: string | null | undefined
): Promise<string[]> {
  const ids = parseFdsDiscordMentionUserIdsInput(input);
  const ts = new Date().toISOString();
  const value = ids.length ? JSON.stringify(ids) : '';
  await db
    .prepare(
      `INSERT INTO sim_app_settings (key, value, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
    )
    .bind(FDS_DISCORD_MENTION_USER_IDS_KEY, value, ts)
    .run();
  return ids;
}

/** Resolves Discord user IDs to mention for FDS pending approval notifications. */
export async function listFdsDiscordMentionUserIds(db: D1Database): Promise<string[]> {
  const { getAllMembers } = await import('./reservations');
  const members = await getAllMembers(db);
  const ids: string[] = [];
  for (const member of members) {
    const discordId = member.discord_user_id?.trim();
    if (discordId && isValidDiscordUserId(discordId) && !ids.includes(discordId)) {
      ids.push(discordId);
    }
  }
  return ids;
}

/** 結果動画のクラウドストレージ保存先ディレクトリ（論理パス）を取得 */
export async function getPrintVideoStoragePath(db: D1Database): Promise<string | null> {
  const row = await db
    .prepare('SELECT value FROM sim_app_settings WHERE key = ?')
    .bind(PRINT_VIDEO_STORAGE_PATH_KEY)
    .first<{ value: string }>();
  const value = row?.value?.trim();
  return value || null;
}

/** 結果動画の保存先ディレクトリを設定 */
export async function setPrintVideoStoragePath(db: D1Database, path: string): Promise<void> {
  const normalized = path.replace(/^\/+|\/+$/g, '');
  const ts = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO sim_app_settings (key, value, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
    )
    .bind(PRINT_VIDEO_STORAGE_PATH_KEY, normalized, ts)
    .run();
}

/** シミュレーション管理アプリにアクセス可能なチームのストレージルート一覧 */
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
