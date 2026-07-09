/**
 * グループ・グループロール・ユーザー所属ヘルパー
 */

import { createId, now } from "./types";
import { normalizeSlug } from "./auth";

export interface HubGroupRow {
  id: string;
  slug: string;
  display_name: string;
  description: string | null;
  color: string;
  position: number;
  google_calendar_id: string | null;
  overall_calendar_name: string | null;
  is_root: number;
  created_at: number;
  updated_at: number;
}

export interface GroupRoleRow {
  id: string;
  group_id: string;
  slug: string;
  display_name: string;
  color: string;
  position: number;
  weight: number;
  created_at: number;
}

export interface PublicGroupRole {
  id: string;
  slug: string;
  display_name: string;
  color: string;
  position: number;
  weight: number;
  member_count?: number;
}

export interface PublicGroup {
  id: string;
  slug: string;
  display_name: string;
  description: string | null;
  color: string;
  position: number;
  google_calendar_id: string | null;
  overall_calendar_name: string | null;
  is_root: boolean;
  member_count: number;
  roles: PublicGroupRole[];
  created_at: number;
  updated_at: number;
}

export interface RootGroupInfo {
  id: string;
  display_name: string;
  overall_calendar_name: string | null;
  color: string;
  google_calendar_id: string | null;
}

/** ルートグループの全体カレンダー表示名 */
export function resolveRootCalendarDisplayName(
  rootGroup: Pick<RootGroupInfo, "display_name" | "overall_calendar_name">
): string {
  const overall = rootGroup.overall_calendar_name?.trim();
  if (overall) return overall;
  return rootGroup.display_name.trim();
}

export interface UserGroupMembership {
  group_id: string;
  group_slug: string;
  group_display_name: string;
  group_color: string;
  group_role_id: string;
  group_role_slug: string;
  group_role_display_name: string;
  group_role_color: string;
  group_role_position: number;
  group_role_weight: number;
}

export interface GroupMembershipInput {
  group_id: string;
  group_role_id: string;
}

const DEFAULT_COLORS = [
  "#F38020",
  "#2C7CB0",
  "#7C3AED",
  "#059669",
  "#E31837",
  "#D97706",
];

const SLUG_WEIGHT_DEFAULTS: Record<string, number> = {
  teacher: 10,
  student: 5,
  guest: 0,
};

/** グループ作成時に必ず用意するデフォルトゲストロール */
const DEFAULT_GUEST_ROLE = {
  slug: "guest",
  display_name: "ゲスト",
  color: "#6B7280",
  weight: 0,
} as const;

function defaultWeightForSlug(slug: string): number {
  return SLUG_WEIGHT_DEFAULTS[slug] ?? 1;
}

function toPublicGroupRole(
  role: GroupRoleRow & { member_count?: number }
): PublicGroupRole {
  return {
    id: role.id,
    slug: role.slug,
    display_name: role.display_name,
    color: role.color ?? "#2C7CB0",
    position: role.position ?? 0,
    weight: role.weight ?? 1,
    member_count: role.member_count,
  };
}

/** ルートグループを取得（全体カレンダーの基準） */
export async function getRootGroup(
  db: D1Database
): Promise<RootGroupInfo | null> {
  const row = await db
    .prepare(
      `SELECT id, display_name, overall_calendar_name, color, google_calendar_id
       FROM hub_groups
       WHERE is_root = 1
       LIMIT 1`
    )
    .first<{
      id: string;
      display_name: string;
      overall_calendar_name: string | null;
      color: string;
      google_calendar_id: string | null;
    }>();

  if (!row) return null;

  return {
    id: row.id,
    display_name: row.display_name,
    overall_calendar_name: row.overall_calendar_name ?? null,
    color: row.color ?? "#F38020",
    google_calendar_id: row.google_calendar_id ?? null,
  };
}

/** ルートグループを1件だけにする */
async function applyRootGroupFlag(
  db: D1Database,
  groupId: string,
  isRoot: boolean
): Promise<void> {
  if (isRoot) {
    await db
      .prepare("UPDATE hub_groups SET is_root = 0 WHERE is_root = 1 AND id != ?")
      .bind(groupId)
      .run();
    await db
      .prepare("UPDATE hub_groups SET is_root = 1, updated_at = ? WHERE id = ?")
      .bind(now(), groupId)
      .run();
    return;
  }

  await db
    .prepare("UPDATE hub_groups SET is_root = 0, updated_at = ? WHERE id = ?")
    .bind(now(), groupId)
    .run();
}

/** ゲストロールが無いグループにデフォルトのゲストロールを追加 */
export async function ensureDefaultGuestRole(
  db: D1Database,
  groupId: string
): Promise<void> {
  const existing = await db
    .prepare("SELECT id FROM group_roles WHERE group_id = ? AND slug = ?")
    .bind(groupId, DEFAULT_GUEST_ROLE.slug)
    .first();

  if (existing) {
    return;
  }

  const maxPos = await db
    .prepare(
      "SELECT COALESCE(MAX(position), -1) AS max_pos FROM group_roles WHERE group_id = ?"
    )
    .bind(groupId)
    .first<{ max_pos: number }>();

  const id = createId("grl");
  const timestamp = now();
  const position = (maxPos?.max_pos ?? -1) + 1;

  await db
    .prepare(
      `INSERT INTO group_roles (id, group_id, slug, display_name, color, position, weight, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      groupId,
      DEFAULT_GUEST_ROLE.slug,
      DEFAULT_GUEST_ROLE.display_name,
      DEFAULT_GUEST_ROLE.color,
      position,
      DEFAULT_GUEST_ROLE.weight,
      timestamp
    )
    .run();
}

/** ゲストロール未設定のグループを一括補完 */
async function ensureDefaultGuestRolesForAllGroups(db: D1Database): Promise<void> {
  const missing = await db
    .prepare(
      `SELECT g.id
       FROM hub_groups g
       LEFT JOIN group_roles gr ON gr.group_id = g.id AND gr.slug = ?
       WHERE gr.id IS NULL`
    )
    .bind(DEFAULT_GUEST_ROLE.slug)
    .all<{ id: string }>();

  for (const row of missing.results ?? []) {
    await ensureDefaultGuestRole(db, row.id);
  }
}

/** グループ一覧（グループロール・メンバー数付き） */
export async function listGroupsWithDetails(db: D1Database): Promise<PublicGroup[]> {
  await ensureDefaultGuestRolesForAllGroups(db);

  const groupsResult = await db
    .prepare(
      `SELECT g.id, g.slug, g.display_name, g.description, g.color, g.position,
              g.google_calendar_id, g.overall_calendar_name, g.is_root, g.created_at, g.updated_at,
              COUNT(DISTINCT ugm.user_id) AS member_count
       FROM hub_groups g
       LEFT JOIN user_group_memberships ugm ON ugm.group_id = g.id
       GROUP BY g.id
       ORDER BY g.is_root DESC, g.position ASC, g.created_at ASC, g.slug ASC`
    )
    .all<HubGroupRow & { member_count: number }>();

  const groups = groupsResult.results ?? [];
  if (groups.length === 0) {
    return [];
  }

  const rolesResult = await db
    .prepare(
      `SELECT gr.id, gr.group_id, gr.slug, gr.display_name, gr.color, gr.position, gr.weight, gr.created_at,
              COUNT(ugm.user_id) AS member_count
       FROM group_roles gr
       LEFT JOIN user_group_memberships ugm ON ugm.group_role_id = gr.id
       GROUP BY gr.id
       ORDER BY gr.weight DESC, gr.position ASC, gr.display_name ASC`
    )
    .all<GroupRoleRow & { member_count: number }>();

  const rolesByGroup = new Map<string, PublicGroupRole[]>();
  for (const role of rolesResult.results ?? []) {
    const list = rolesByGroup.get(role.group_id) ?? [];
    list.push(toPublicGroupRole(role));
    rolesByGroup.set(role.group_id, list);
  }

  return groups.map((group) => ({
    id: group.id,
    slug: group.slug,
    display_name: group.display_name,
    description: group.description,
    color: group.color ?? "#F38020",
    position: group.position ?? 0,
    google_calendar_id: group.google_calendar_id ?? null,
    overall_calendar_name: group.overall_calendar_name ?? null,
    is_root: group.is_root === 1,
    member_count: group.member_count ?? 0,
    roles: rolesByGroup.get(group.id) ?? [],
    created_at: group.created_at,
    updated_at: group.updated_at,
  }));
}

/** グループを ID で取得 */
export async function getGroupById(
  db: D1Database,
  groupId: string
): Promise<PublicGroup | null> {
  const groups = await listGroupsWithDetails(db);
  return groups.find((g) => g.id === groupId) ?? null;
}

/** グループを作成 */
export async function createGroup(
  db: D1Database,
  input: {
    display_name: string;
    slug?: string;
    description?: string;
    color?: string;
    is_root?: boolean;
    google_calendar_id?: string | null;
    overall_calendar_name?: string | null;
  }
): Promise<PublicGroup | null> {
  const displayName = input.display_name.trim();
  const slug = normalizeSlug(input.slug?.trim() || displayName);
  const color =
    input.color?.trim() ||
    DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];

  const existing = await db
    .prepare("SELECT id FROM hub_groups WHERE slug = ?")
    .bind(slug)
    .first();

  if (existing) {
    throw new Error("このグループ識別子は既に存在します");
  }

  const maxPos = await db
    .prepare("SELECT COALESCE(MAX(position), -1) AS max_pos FROM hub_groups")
    .first<{ max_pos: number }>();

  const id = createId("grp");
  const timestamp = now();
  const position = (maxPos?.max_pos ?? -1) + 1;

  await db
    .prepare(
      `INSERT INTO hub_groups (id, slug, display_name, description, color, position, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      slug,
      displayName,
      input.description?.trim() || null,
      color,
      position,
      timestamp,
      timestamp
    )
    .run();

  if (input.is_root) {
    await applyRootGroupFlag(db, id, true);
  }

  await ensureDefaultGuestRole(db, id);

  if (
    input.google_calendar_id !== undefined ||
    input.overall_calendar_name !== undefined
  ) {
    return updateGroup(db, id, {
      google_calendar_id: input.google_calendar_id,
      overall_calendar_name: input.overall_calendar_name,
    });
  }

  return getGroupById(db, id);
}

/** グループを更新 */
export async function updateGroup(
  db: D1Database,
  groupId: string,
  input: {
    display_name?: string;
    slug?: string;
    description?: string | null;
    color?: string;
    position?: number;
    google_calendar_id?: string | null;
    is_root?: boolean;
    overall_calendar_name?: string | null;
  }
): Promise<PublicGroup | null> {
  if (input.is_root !== undefined) {
    await applyRootGroupFlag(db, groupId, input.is_root);
  }

  const updates: string[] = [];
  const values: (string | number | null)[] = [];

  if (input.display_name !== undefined) {
    const name = input.display_name.trim();
    if (!name) throw new Error("グループ名を入力してください");
    updates.push("display_name = ?");
    values.push(name);
  }

  if (input.slug !== undefined) {
    const slug = normalizeSlug(input.slug.trim());
    if (!slug || slug.length < 2) throw new Error("グループ識別子が不正です");
    const dup = await db
      .prepare("SELECT id FROM hub_groups WHERE slug = ? AND id != ?")
      .bind(slug, groupId)
      .first();
    if (dup) throw new Error("このグループ識別子は既に存在します");
    updates.push("slug = ?");
    values.push(slug);
  }

  if (input.description !== undefined) {
    updates.push("description = ?");
    values.push(input.description?.trim() || null);
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

  if (input.google_calendar_id !== undefined) {
    const calId = input.google_calendar_id?.trim() || null;
    if (calId && (!calId.includes("@") || calId.length < 5)) {
      throw new Error("Google カレンダー ID の形式が不正です");
    }
    updates.push("google_calendar_id = ?");
    values.push(calId);
  }

  if (input.overall_calendar_name !== undefined) {
    const overallName = input.overall_calendar_name?.trim() || null;
    if (overallName && overallName.length > 120) {
      throw new Error("全体カレンダー表示名は120文字以内で入力してください");
    }
    updates.push("overall_calendar_name = ?");
    values.push(overallName);
  }

  if (updates.length === 0) {
    return getGroupById(db, groupId);
  }

  updates.push("updated_at = ?");
  values.push(now());
  values.push(groupId);

  await db
    .prepare(`UPDATE hub_groups SET ${updates.join(", ")} WHERE id = ?`)
    .bind(...values)
    .run();

  return getGroupById(db, groupId);
}

/** グループを削除 */
export async function deleteGroup(db: D1Database, groupId: string): Promise<void> {
  const existing = await db
    .prepare("SELECT is_root FROM hub_groups WHERE id = ?")
    .bind(groupId)
    .first<{ is_root: number }>();

  if (!existing) {
    throw new Error("グループが見つかりません");
  }

  if (existing.is_root === 1) {
    throw new Error(
      "ルートグループは削除できません。先にルート設定を解除するか、別のグループをルートに指定してください"
    );
  }

  await db.prepare("DELETE FROM hub_groups WHERE id = ?").bind(groupId).run();
}

/** グループロールを作成 */
export async function createGroupRole(
  db: D1Database,
  groupId: string,
  input: { display_name: string; slug?: string; color?: string; weight?: number }
): Promise<PublicGroupRole | null> {
  const group = await db
    .prepare("SELECT id FROM hub_groups WHERE id = ?")
    .bind(groupId)
    .first();

  if (!group) {
    throw new Error("グループが見つかりません");
  }

  const displayName = input.display_name.trim();
  if (!displayName) {
    throw new Error("グループロール名を入力してください");
  }

  const slug = normalizeSlug(input.slug?.trim() || displayName);
  const color =
    input.color?.trim() ||
    DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];
  const weight =
    input.weight !== undefined ? input.weight : defaultWeightForSlug(slug);
  if (!Number.isInteger(weight)) {
    throw new Error("重みは整数で指定してください");
  }

  const dup = await db
    .prepare("SELECT id FROM group_roles WHERE group_id = ? AND slug = ?")
    .bind(groupId, slug)
    .first();

  if (dup) {
    throw new Error("このグループロール識別子は既に存在します");
  }

  const maxPos = await db
    .prepare(
      "SELECT COALESCE(MAX(position), -1) AS max_pos FROM group_roles WHERE group_id = ?"
    )
    .bind(groupId)
    .first<{ max_pos: number }>();

  const id = createId("grl");
  const timestamp = now();
  const position = (maxPos?.max_pos ?? -1) + 1;

  await db
    .prepare(
      `INSERT INTO group_roles (id, group_id, slug, display_name, color, position, weight, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(id, groupId, slug, displayName, color, position, weight, timestamp)
    .run();

  const role = await db
    .prepare(
      "SELECT id, group_id, slug, display_name, color, position, weight, created_at FROM group_roles WHERE id = ?"
    )
    .bind(id)
    .first<GroupRoleRow>();

  return role ? { ...toPublicGroupRole(role), member_count: 0 } : null;
}

/** グループロールを更新 */
export async function updateGroupRole(
  db: D1Database,
  groupId: string,
  roleId: string,
  input: { display_name?: string; color?: string; position?: number; weight?: number }
): Promise<PublicGroupRole | null> {
  const existing = await db
    .prepare("SELECT id FROM group_roles WHERE id = ? AND group_id = ?")
    .bind(roleId, groupId)
    .first();

  if (!existing) {
    throw new Error("グループロールが見つかりません");
  }

  const updates: string[] = [];
  const values: (string | number)[] = [];

  if (input.display_name !== undefined) {
    const name = input.display_name.trim();
    if (!name) throw new Error("グループロール名を入力してください");
    updates.push("display_name = ?");
    values.push(name);
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

  if (input.weight !== undefined) {
    if (!Number.isInteger(input.weight)) {
      throw new Error("重みは整数で指定してください");
    }
    updates.push("weight = ?");
    values.push(input.weight);
  }

  if (updates.length === 0) {
    const role = await db
      .prepare(
        "SELECT id, group_id, slug, display_name, color, position, weight, created_at FROM group_roles WHERE id = ?"
      )
      .bind(roleId)
      .first<GroupRoleRow>();
    return role ? toPublicGroupRole(role) : null;
  }

  values.push(roleId);

  await db
    .prepare(`UPDATE group_roles SET ${updates.join(", ")} WHERE id = ?`)
    .bind(...values)
    .run();

  const role = await db
    .prepare(
      "SELECT id, group_id, slug, display_name, color, position, weight, created_at FROM group_roles WHERE id = ?"
    )
    .bind(roleId)
    .first<GroupRoleRow>();

  return role ? toPublicGroupRole(role) : null;
}

/** グループロールを削除 */
export async function deleteGroupRole(
  db: D1Database,
  groupId: string,
  roleId: string
): Promise<void> {
  const result = await db
    .prepare("DELETE FROM group_roles WHERE id = ? AND group_id = ?")
    .bind(roleId, groupId)
    .run();

  if ((result.meta.changes ?? 0) === 0) {
    throw new Error("グループロールが見つかりません");
  }
}

/** ユーザーのグループ所属を取得 */
export async function getUserGroupMemberships(
  db: D1Database,
  userId: string
): Promise<UserGroupMembership[]> {
  const result = await db
    .prepare(
      `SELECT
         g.id AS group_id,
         g.slug AS group_slug,
         g.display_name AS group_display_name,
         g.color AS group_color,
         gr.id AS group_role_id,
         gr.slug AS group_role_slug,
         gr.display_name AS group_role_display_name,
         gr.color AS group_role_color,
         gr.position AS group_role_position,
         gr.weight AS group_role_weight
       FROM user_group_memberships ugm
       JOIN hub_groups g ON g.id = ugm.group_id
       JOIN group_roles gr ON gr.id = ugm.group_role_id
       WHERE ugm.user_id = ?
       ORDER BY g.position ASC, g.display_name ASC`
    )
    .bind(userId)
    .all<UserGroupMembership>();

  return result.results ?? [];
}

/** ユーザーのグループ所属を置き換える */
export async function setUserGroupMemberships(
  db: D1Database,
  userId: string,
  memberships: GroupMembershipInput[]
): Promise<void> {
  const seenGroups = new Set<string>();
  const timestamp = now();

  for (const item of memberships) {
    if (seenGroups.has(item.group_id)) {
      throw new Error("同じグループを複数回割り当てることはできません");
    }
    seenGroups.add(item.group_id);

    const role = await db
      .prepare(
        "SELECT id, group_id FROM group_roles WHERE id = ? AND group_id = ?"
      )
      .bind(item.group_role_id, item.group_id)
      .first();

    if (!role) {
      throw new Error("グループロールがグループに属していません");
    }
  }

  await db
    .prepare("DELETE FROM user_group_memberships WHERE user_id = ?")
    .bind(userId)
    .run();

  for (const item of memberships) {
    await db
      .prepare(
        `INSERT INTO user_group_memberships (user_id, group_id, group_role_id, assigned_at)
         VALUES (?, ?, ?, ?)`
      )
      .bind(userId, item.group_id, item.group_role_id, timestamp)
      .run();
  }
}

/** グループのメンバー配置を一括置換（他グループ所属は維持） */
export async function replaceGroupMemberships(
  db: D1Database,
  groupId: string,
  memberships: { user_id: string; group_role_id: string }[]
): Promise<void> {
  const group = await db
    .prepare("SELECT id FROM hub_groups WHERE id = ?")
    .bind(groupId)
    .first();

  if (!group) {
    throw new Error("グループが見つかりません");
  }

  const seenUsers = new Set<string>();
  for (const item of memberships) {
    if (seenUsers.has(item.user_id)) {
      throw new Error("同じユーザーを複数のグループロールに割り当てることはできません");
    }
    seenUsers.add(item.user_id);

    const role = await db
      .prepare("SELECT id FROM group_roles WHERE id = ? AND group_id = ?")
      .bind(item.group_role_id, groupId)
      .first();

    if (!role) {
      throw new Error("グループロールが無効です");
    }

    const user = await db
      .prepare("SELECT id FROM users WHERE id = ?")
      .bind(item.user_id)
      .first();

    if (!user) {
      throw new Error("ユーザーが見つかりません");
    }
  }

  const currentResult = await db
    .prepare("SELECT user_id FROM user_group_memberships WHERE group_id = ?")
    .bind(groupId)
    .all<{ user_id: string }>();

  const affectedUserIds = new Set<string>([
    ...(currentResult.results ?? []).map((row) => row.user_id),
    ...memberships.map((m) => m.user_id),
  ]);

  const assignmentByUser = new Map(
    memberships.map((m) => [m.user_id, m.group_role_id])
  );

  for (const userId of affectedUserIds) {
    const current = await getUserGroupMemberships(db, userId);
    const others = current
      .filter((m) => m.group_id !== groupId)
      .map((m) => ({
        group_id: m.group_id,
        group_role_id: m.group_role_id,
      }));

    const roleId = assignmentByUser.get(userId);
    const next = roleId
      ? [...others, { group_id: groupId, group_role_id: roleId }]
      : others;

    await setUserGroupMemberships(db, userId, next);
  }
}

/** グループにユーザーを追加（既存の他グループ所属は維持） */
export async function addUsersToGroup(
  db: D1Database,
  groupId: string,
  groupRoleId: string,
  userIds: string[]
): Promise<void> {
  const group = await db
    .prepare("SELECT id FROM hub_groups WHERE id = ?")
    .bind(groupId)
    .first();

  if (!group) {
    throw new Error("グループが見つかりません");
  }

  const role = await db
    .prepare("SELECT id FROM group_roles WHERE id = ? AND group_id = ?")
    .bind(groupRoleId, groupId)
    .first();

  if (!role) {
    throw new Error("グループロールが無効です");
  }

  const uniqueUserIds = [...new Set(userIds)];
  if (uniqueUserIds.length === 0) {
    throw new Error("追加するユーザーを選択してください");
  }

  for (const userId of uniqueUserIds) {
    const user = await db
      .prepare("SELECT id FROM users WHERE id = ?")
      .bind(userId)
      .first();

    if (!user) {
      throw new Error("ユーザーが見つかりません");
    }

    const current = await getUserGroupMemberships(db, userId);
    const others = current
      .filter((m) => m.group_id !== groupId)
      .map((m) => ({
        group_id: m.group_id,
        group_role_id: m.group_role_id,
      }));

    await setUserGroupMemberships(db, userId, [
      ...others,
      { group_id: groupId, group_role_id: groupRoleId },
    ]);
  }
}
