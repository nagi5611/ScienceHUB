/**
 * アプリ登録・グループ/ロール連動アクセス制御
 */

import { createId, now } from "./types";
import { normalizeSlug } from "./auth";
import { getUserGroupMemberships, getRootGroup, type UserGroupMembership } from "./groups";
import { userHasAdminRole } from "./roles";
import { expandRoleIdsByWeight } from "./roleWeight";

const ADMIN_APPS_GROUP_ID = "admin-all-apps";

export interface HubAppRow {
  id: string;
  slug: string;
  display_name: string;
  description: string | null;
  href: string;
  icon_emoji: string | null;
  color: string;
  position: number;
  created_at: number;
  updated_at: number;
}

export interface PublicApp {
  id: string;
  slug: string;
  display_name: string;
  description: string | null;
  href: string;
  icon_emoji: string | null;
  color: string;
  position: number;
  created_at: number;
  updated_at: number;
}

export interface AppGroupAccessRule {
  group_id: string;
  enabled: boolean;
  /** 空配列 = グループ内の全ロールがアクセス可 */
  group_role_ids: string[];
}

export interface AppWithAccess extends PublicApp {
  access_rules: AppGroupAccessRule[];
}

export interface DashboardApp {
  slug: string;
  display_name: string;
  href: string;
  icon_emoji: string | null;
  color: string;
}

export interface DashboardGroup {
  id: string;
  slug: string;
  display_name: string;
  color: string;
  apps: DashboardApp[];
}

function toPublicApp(row: HubAppRow): PublicApp {
  return {
    id: row.id,
    slug: row.slug,
    display_name: row.display_name,
    description: row.description,
    href: row.href,
    icon_emoji: row.icon_emoji,
    color: row.color ?? "#F38020",
    position: row.position ?? 0,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/** アプリ一覧 */
export async function listApps(db: D1Database): Promise<PublicApp[]> {
  const result = await db
    .prepare(
      `SELECT id, slug, display_name, description, href, icon_emoji, color, position, created_at, updated_at
       FROM hub_apps
       ORDER BY position ASC, display_name ASC, slug ASC`
    )
    .all<HubAppRow>();

  return (result.results ?? []).map(toPublicApp);
}

/** slug でアプリ取得 */
export async function getAppBySlug(
  db: D1Database,
  slug: string
): Promise<PublicApp | null> {
  const row = await db
    .prepare(
      `SELECT id, slug, display_name, description, href, icon_emoji, color, position, created_at, updated_at
       FROM hub_apps WHERE slug = ?`
    )
    .bind(slug)
    .first<HubAppRow>();

  return row ? toPublicApp(row) : null;
}

/** ID でアプリ取得 */
export async function getAppById(
  db: D1Database,
  appId: string
): Promise<PublicApp | null> {
  const row = await db
    .prepare(
      `SELECT id, slug, display_name, description, href, icon_emoji, color, position, created_at, updated_at
       FROM hub_apps WHERE id = ?`
    )
    .bind(appId)
    .first<HubAppRow>();

  return row ? toPublicApp(row) : null;
}

/** アプリのアクセスルール取得 */
export async function getAppAccessRules(
  db: D1Database,
  appId: string
): Promise<AppGroupAccessRule[]> {
  const settings = await db
    .prepare(
      `SELECT group_id, enabled FROM app_group_settings WHERE app_id = ? ORDER BY group_id`
    )
    .bind(appId)
    .all<{ group_id: string; enabled: number }>();

  const roles = await db
    .prepare(
      `SELECT group_id, group_role_id FROM app_group_role_access WHERE app_id = ?`
    )
    .bind(appId)
    .all<{ group_id: string; group_role_id: string }>();

  const rolesByGroup = new Map<string, string[]>();
  for (const row of roles.results ?? []) {
    const list = rolesByGroup.get(row.group_id) ?? [];
    list.push(row.group_role_id);
    rolesByGroup.set(row.group_id, list);
  }

  return (settings.results ?? []).map((row) => ({
    group_id: row.group_id,
    enabled: row.enabled === 1,
    group_role_ids: rolesByGroup.get(row.group_id) ?? [],
  }));
}

/** アプリ詳細（アクセスルール付き） */
export async function getAppWithAccess(
  db: D1Database,
  appId: string
): Promise<AppWithAccess | null> {
  const app = await getAppById(db, appId);
  if (!app) return null;

  const access_rules = await getAppAccessRules(db, appId);
  return { ...app, access_rules };
}

/** アプリ作成 */
export async function createApp(
  db: D1Database,
  input: {
    display_name: string;
    slug?: string;
    description?: string;
    href: string;
    icon_emoji?: string;
    color?: string;
  }
): Promise<PublicApp | null> {
  const displayName = input.display_name.trim();
  if (!displayName) throw new Error("アプリ名を入力してください");

  const href = input.href.trim();
  if (!href) throw new Error("URL パスを入力してください");

  const slug = normalizeSlug(input.slug?.trim() || displayName);
  const dup = await db
    .prepare("SELECT id FROM hub_apps WHERE slug = ?")
    .bind(slug)
    .first();
  if (dup) throw new Error("このアプリ識別子は既に存在します");

  const maxPos = await db
    .prepare("SELECT COALESCE(MAX(position), -1) AS max_pos FROM hub_apps")
    .first<{ max_pos: number }>();

  const id = createId("app");
  const timestamp = now();
  const position = (maxPos?.max_pos ?? -1) + 1;
  const color = input.color?.trim() || "#F38020";

  await db
    .prepare(
      `INSERT INTO hub_apps (id, slug, display_name, description, href, icon_emoji, color, position, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      slug,
      displayName,
      input.description?.trim() || null,
      href,
      input.icon_emoji?.trim() || null,
      color,
      position,
      timestamp,
      timestamp
    )
    .run();

  return getAppById(db, id);
}

/** アプリ更新 */
export async function updateApp(
  db: D1Database,
  appId: string,
  input: {
    display_name?: string;
    slug?: string;
    description?: string | null;
    href?: string;
    icon_emoji?: string | null;
    color?: string;
    position?: number;
  }
): Promise<PublicApp | null> {
  const updates: string[] = [];
  const values: (string | number | null)[] = [];

  if (input.display_name !== undefined) {
    const name = input.display_name.trim();
    if (!name) throw new Error("アプリ名を入力してください");
    updates.push("display_name = ?");
    values.push(name);
  }

  if (input.slug !== undefined) {
    const slug = normalizeSlug(input.slug.trim());
    const dup = await db
      .prepare("SELECT id FROM hub_apps WHERE slug = ? AND id != ?")
      .bind(slug, appId)
      .first();
    if (dup) throw new Error("このアプリ識別子は既に存在します");
    updates.push("slug = ?");
    values.push(slug);
  }

  if (input.description !== undefined) {
    updates.push("description = ?");
    values.push(input.description?.trim() || null);
  }

  if (input.href !== undefined) {
    const href = input.href.trim();
    if (!href) throw new Error("URL パスを入力してください");
    updates.push("href = ?");
    values.push(href);
  }

  if (input.icon_emoji !== undefined) {
    updates.push("icon_emoji = ?");
    values.push(input.icon_emoji?.trim() || null);
  }

  if (input.color !== undefined) {
    const color = input.color.trim();
    if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
      throw new Error("色は #RRGGBB 形式で指定してください");
    }
    updates.push("color = ?");
    values.push(color);
  }

  if (input.position !== undefined) {
    updates.push("position = ?");
    values.push(input.position);
  }

  if (updates.length > 0) {
    updates.push("updated_at = ?");
    values.push(now());
    values.push(appId);

    await db
      .prepare(`UPDATE hub_apps SET ${updates.join(", ")} WHERE id = ?`)
      .bind(...values)
      .run();
  }

  return getAppById(db, appId);
}

/** アプリ削除 */
export async function deleteApp(db: D1Database, appId: string): Promise<void> {
  const result = await db
    .prepare("DELETE FROM hub_apps WHERE id = ?")
    .bind(appId)
    .run();
  if ((result.meta.changes ?? 0) === 0) {
    throw new Error("アプリが見つかりません");
  }
}

/** アプリのアクセスルールを置換 */
export async function setAppAccessRules(
  db: D1Database,
  appId: string,
  rules: AppGroupAccessRule[]
): Promise<void> {
  const app = await getAppById(db, appId);
  if (!app) throw new Error("アプリが見つかりません");

  const seenGroups = new Set<string>();
  for (const rule of rules) {
    if (seenGroups.has(rule.group_id)) {
      throw new Error("同じグループを複数回指定できません");
    }
    seenGroups.add(rule.group_id);

    const group = await db
      .prepare("SELECT id FROM hub_groups WHERE id = ?")
      .bind(rule.group_id)
      .first();
    if (!group) throw new Error("グループが見つかりません");

    for (const roleId of rule.group_role_ids) {
      const role = await db
        .prepare("SELECT id FROM group_roles WHERE id = ? AND group_id = ?")
        .bind(roleId, rule.group_id)
        .first();
      if (!role) throw new Error("グループロールが無効です");
    }
  }

  await db
    .prepare("DELETE FROM app_group_settings WHERE app_id = ?")
    .bind(appId)
    .run();
  await db
    .prepare("DELETE FROM app_group_role_access WHERE app_id = ?")
    .bind(appId)
    .run();

  for (const rule of rules) {
    if (!rule.enabled) continue;

    await db
      .prepare(
        "INSERT INTO app_group_settings (app_id, group_id, enabled) VALUES (?, ?, 1)"
      )
      .bind(appId, rule.group_id)
      .run();

    for (const roleId of rule.group_role_ids) {
      await db
        .prepare(
          `INSERT INTO app_group_role_access (app_id, group_id, group_role_id)
           VALUES (?, ?, ?)`
        )
        .bind(appId, rule.group_id, roleId)
        .run();
    }
  }
}

/** 所属情報からアプリへアクセス可能か */
export function membershipCanAccessApp(
  membership: UserGroupMembership,
  enabledGroupIds: Set<string>,
  roleRestrictions: Map<string, Set<string>>
): boolean {
  if (!enabledGroupIds.has(membership.group_id)) {
    return false;
  }

  const restricted = roleRestrictions.get(membership.group_id);
  if (!restricted || restricted.size === 0) {
    return true;
  }

  return restricted.has(membership.group_role_id);
}

/** ダッシュボード用アプリ情報 */
function toDashboardApp(app: PublicApp): DashboardApp {
  return {
    slug: app.slug,
    display_name: app.display_name,
    href: app.href,
    icon_emoji: app.icon_emoji,
    color: app.color,
  };
}

/** 管理者向け: 登録済みアプリをすべて表示 */
async function getDashboardForAdmin(db: D1Database): Promise<DashboardGroup[]> {
  const apps = await listApps(db);
  if (apps.length === 0) return [];

  return [
    {
      id: ADMIN_APPS_GROUP_ID,
      slug: "all-apps",
      display_name: "アプリ",
      color: "#F38020",
      apps: apps.map(toDashboardApp),
    },
  ];
}

/** アプリのアクセス用メタデータを読み込む */
export async function loadAppAccessMeta(
  db: D1Database,
  appId: string
): Promise<{
  enabledGroupIds: Set<string>;
  roleRestrictions: Map<string, Set<string>>;
}> {
  const settings = await db
    .prepare("SELECT group_id FROM app_group_settings WHERE app_id = ? AND enabled = 1")
    .bind(appId)
    .all<{ group_id: string }>();

  const roles = await db
    .prepare("SELECT group_id, group_role_id FROM app_group_role_access WHERE app_id = ?")
    .bind(appId)
    .all<{ group_id: string; group_role_id: string }>();

  const enabledGroupIds = new Set(
    (settings.results ?? []).map((row) => row.group_id)
  );

  const explicitByGroup = new Map<string, string[]>();
  for (const row of roles.results ?? []) {
    const list = explicitByGroup.get(row.group_id) ?? [];
    list.push(row.group_role_id);
    explicitByGroup.set(row.group_id, list);
  }

  const groupIds = [...new Set([...enabledGroupIds, ...explicitByGroup.keys()])];
  const groupRolesByGroup = new Map<string, Array<{ id: string; weight: number }>>();

  if (groupIds.length > 0) {
    const placeholders = groupIds.map(() => "?").join(", ");
    const weightRows = await db
      .prepare(
        `SELECT id, group_id, weight FROM group_roles WHERE group_id IN (${placeholders})`
      )
      .bind(...groupIds)
      .all<{ id: string; group_id: string; weight: number }>();

    for (const row of weightRows.results ?? []) {
      const list = groupRolesByGroup.get(row.group_id) ?? [];
      list.push({ id: row.id, weight: row.weight ?? 1 });
      groupRolesByGroup.set(row.group_id, list);
    }
  }

  const roleRestrictions = new Map<string, Set<string>>();
  for (const [groupId, explicitIds] of explicitByGroup) {
    if (explicitIds.length === 0) continue;
    const groupRoles = groupRolesByGroup.get(groupId) ?? [];
    roleRestrictions.set(groupId, expandRoleIdsByWeight(explicitIds, groupRoles));
  }

  return { enabledGroupIds, roleRestrictions };
}

/** アプリにアクセス可能なメンバー ID を取得（閲覧者と共通グループかつロール許可） */
export async function getAppAccessibleMemberIds(
  db: D1Database,
  appSlug: string,
  viewerUserId: string
): Promise<Set<string>> {
  const app = await getAppBySlug(db, appSlug);
  if (!app) {
    return new Set([viewerUserId]);
  }

  const { enabledGroupIds, roleRestrictions } = await loadAppAccessMeta(db, app.id);
  if (enabledGroupIds.size === 0) {
    return new Set([viewerUserId]);
  }

  const isAdmin = await userHasAdminRole(db, viewerUserId);
  let relevantGroupIds: string[];

  if (isAdmin) {
    relevantGroupIds = [...enabledGroupIds];
  } else {
    const myMemberships = await getUserGroupMemberships(db, viewerUserId);
    relevantGroupIds = myMemberships
      .filter((m) => membershipCanAccessApp(m, enabledGroupIds, roleRestrictions))
      .map((m) => m.group_id);
  }

  if (relevantGroupIds.length === 0) {
    return new Set([viewerUserId]);
  }

  const placeholders = relevantGroupIds.map(() => "?").join(", ");
  const result = await db
    .prepare(
      `SELECT ugm.user_id, ugm.group_id, ugm.group_role_id
       FROM user_group_memberships ugm
       WHERE ugm.group_id IN (${placeholders})`
    )
    .bind(...relevantGroupIds)
    .all<{ user_id: string; group_id: string; group_role_id: string }>();

  const ids = new Set<string>();
  for (const row of result.results ?? []) {
    const membership = {
      group_id: row.group_id,
      group_role_id: row.group_role_id,
    } as UserGroupMembership;

    if (membershipCanAccessApp(membership, enabledGroupIds, roleRestrictions)) {
      ids.add(row.user_id);
    }
  }

  ids.add(viewerUserId);
  return ids;
}

/** ユーザーがアプリにアクセス可能か */
export async function canUserAccessApp(
  db: D1Database,
  userId: string,
  appSlug: string
): Promise<boolean> {
  const app = await getAppBySlug(db, appSlug);
  if (!app) return false;

  if (await userHasAdminRole(db, userId)) {
    return true;
  }

  const { enabledGroupIds, roleRestrictions } = await loadAppAccessMeta(db, app.id);
  if (enabledGroupIds.size === 0) return false;

  const memberships = await getUserGroupMemberships(db, userId);
  return memberships.some((m) =>
    membershipCanAccessApp(m, enabledGroupIds, roleRestrictions)
  );
}

/** ダッシュボード用: ユーザーが見られるグループとアプリ */
export async function getDashboardForUser(
  db: D1Database,
  userId: string
): Promise<DashboardGroup[]> {
  if (await userHasAdminRole(db, userId)) {
    return getDashboardForAdmin(db);
  }

  const memberships = await getUserGroupMemberships(db, userId);
  if (memberships.length === 0) return [];

  const apps = await listApps(db);
  const groupMap = new Map<string, DashboardGroup>();

  for (const membership of memberships) {
    if (!groupMap.has(membership.group_id)) {
      groupMap.set(membership.group_id, {
        id: membership.group_id,
        slug: membership.group_slug,
        display_name: membership.group_display_name,
        color: membership.group_color,
        apps: [],
      });
    }
  }

  for (const app of apps) {
    const { enabledGroupIds, roleRestrictions } = await loadAppAccessMeta(db, app.id);
    if (enabledGroupIds.size === 0) continue;

    for (const membership of memberships) {
      if (!membershipCanAccessApp(membership, enabledGroupIds, roleRestrictions)) {
        continue;
      }

      const group = groupMap.get(membership.group_id);
      if (!group) continue;

      if (group.apps.some((a) => a.slug === app.slug)) continue;

      group.apps.push(toDashboardApp(app));
    }
  }

  const rootGroup = await getRootGroup(db);
  const rootGroupId = rootGroup?.id ?? null;

  return [...groupMap.values()]
    .filter((g) => g.apps.length > 0)
    .sort((a, b) => {
      const aIsRoot = a.id === rootGroupId ? 0 : 1;
      const bIsRoot = b.id === rootGroupId ? 0 : 1;
      if (aIsRoot !== bIsRoot) return aIsRoot - bIsRoot;
      return a.display_name.localeCompare(b.display_name, "ja");
    });
}
