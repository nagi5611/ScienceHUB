/**
 * グループ招待リンク
 */

import { addUsersToGroup, getUserGroupMemberships } from "./groups";
import { createId, now } from "./types";

interface InviteLinkRow {
  id: string;
  token: string;
  group_id: string;
  group_role_id: string;
  created_by_admin_username: string;
  use_count: number;
  revoked_at: number | null;
  created_at: number;
}

export interface InviteRedemptionPublic {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  redeemed_at: number;
}

export interface InviteLinkPublic {
  id: string;
  token: string;
  url: string;
  group_role_id: string;
  group_role_display_name: string;
  group_role_slug: string;
  created_by_admin_username: string;
  use_count: number;
  revoked_at: number | null;
  created_at: number;
  redemptions: InviteRedemptionPublic[];
}

export interface InviteJoinInfo {
  group_id: string;
  group_display_name: string;
  group_color: string;
  group_role_id: string;
  group_role_display_name: string;
  group_role_slug: string;
  group_role_color: string;
  already_member: boolean;
  current_role_display_name: string | null;
  revoked: boolean;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

/** 招待リンク用トークンを生成 */
function generateInviteToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

/** 招待リンクの公開 URL を組み立て */
export function buildGroupInvitePageUrl(request: Request, token: string): string {
  const origin = new URL(request.url).origin;
  return `${origin}/join/?t=${encodeURIComponent(token)}`;
}

/** グループの招待リンク一覧（利用履歴付き） */
export async function listGroupInviteLinks(
  db: D1Database,
  groupId: string,
  request: Request
): Promise<InviteLinkPublic[]> {
  const linksResult = await db
    .prepare(
      `SELECT il.id, il.token, il.group_id, il.group_role_id, il.created_by_admin_username,
              il.use_count, il.revoked_at, il.created_at,
              gr.display_name AS group_role_display_name, gr.slug AS group_role_slug
       FROM group_invite_links il
       JOIN group_roles gr ON gr.id = il.group_role_id
       WHERE il.group_id = ?
       ORDER BY il.created_at DESC`
    )
    .bind(groupId)
    .all<
      InviteLinkRow & {
        group_role_display_name: string;
        group_role_slug: string;
      }
    >();

  const links = linksResult.results ?? [];
  if (links.length === 0) {
    return [];
  }

  const linkIds = links.map((link) => link.id);
  const placeholders = linkIds.map(() => "?").join(", ");
  const redemptionsResult = await db
    .prepare(
      `SELECT r.id, r.invite_link_id, r.user_id, r.redeemed_at,
              u.username, u.display_name
       FROM group_invite_redemptions r
       JOIN users u ON u.id = r.user_id
       WHERE r.invite_link_id IN (${placeholders})
       ORDER BY r.redeemed_at DESC`
    )
    .bind(...linkIds)
    .all<{
      id: string;
      invite_link_id: string;
      user_id: string;
      redeemed_at: number;
      username: string;
      display_name: string;
    }>();

  const redemptionsByLink = new Map<string, InviteRedemptionPublic[]>();
  for (const row of redemptionsResult.results ?? []) {
    const list = redemptionsByLink.get(row.invite_link_id) ?? [];
    list.push({
      id: row.id,
      user_id: row.user_id,
      username: row.username,
      display_name: row.display_name,
      redeemed_at: row.redeemed_at,
    });
    redemptionsByLink.set(row.invite_link_id, list);
  }

  return links.map((link) => ({
    id: link.id,
    token: link.token,
    url: buildGroupInvitePageUrl(request, link.token),
    group_role_id: link.group_role_id,
    group_role_display_name: link.group_role_display_name,
    group_role_slug: link.group_role_slug,
    created_by_admin_username: link.created_by_admin_username,
    use_count: link.use_count,
    revoked_at: link.revoked_at,
    created_at: link.created_at,
    redemptions: redemptionsByLink.get(link.id) ?? [],
  }));
}

/** グループ招待リンクを作成 */
export async function createGroupInviteLink(
  db: D1Database,
  groupId: string,
  groupRoleId: string,
  createdByAdminUsername: string,
  request: Request
): Promise<InviteLinkPublic> {
  const role = await db
    .prepare(
      `SELECT gr.id, gr.display_name, gr.slug
       FROM group_roles gr
       JOIN hub_groups g ON g.id = gr.group_id
       WHERE gr.id = ? AND gr.group_id = ?`
    )
    .bind(groupRoleId, groupId)
    .first<{ id: string; display_name: string; slug: string }>();

  if (!role) {
    throw new Error("グループロールが無効です");
  }

  const id = createId("gil");
  const token = generateInviteToken();
  const timestamp = now();

  await db
    .prepare(
      `INSERT INTO group_invite_links
         (id, token, group_id, group_role_id, created_by_admin_username, use_count, revoked_at, created_at)
       VALUES (?, ?, ?, ?, ?, 0, NULL, ?)`
    )
    .bind(id, token, groupId, groupRoleId, createdByAdminUsername, timestamp)
    .run();

  return {
    id,
    token,
    url: buildGroupInvitePageUrl(request, token),
    group_role_id: groupRoleId,
    group_role_display_name: role.display_name,
    group_role_slug: role.slug,
    created_by_admin_username: createdByAdminUsername,
    use_count: 0,
    revoked_at: null,
    created_at: timestamp,
    redemptions: [],
  };
}

/** 招待リンクを無効化 */
export async function revokeGroupInviteLink(
  db: D1Database,
  groupId: string,
  linkId: string
): Promise<void> {
  const result = await db
    .prepare(
      `UPDATE group_invite_links
       SET revoked_at = ?
       WHERE id = ? AND group_id = ? AND revoked_at IS NULL`
    )
    .bind(now(), linkId, groupId)
    .run();

  if ((result.meta.changes ?? 0) === 0) {
    throw new Error("招待リンクが見つからないか、既に無効化されています");
  }
}

/** 有効な招待リンクをトークンで取得 */
async function getActiveInviteLinkByToken(
  db: D1Database,
  token: string
): Promise<
  | (InviteLinkRow & {
      group_display_name: string;
      group_color: string;
      group_role_display_name: string;
      group_role_slug: string;
      group_role_color: string;
    })
  | null
> {
  return db
    .prepare(
      `SELECT il.id, il.token, il.group_id, il.group_role_id, il.created_by_admin_username,
              il.use_count, il.revoked_at, il.created_at,
              g.display_name AS group_display_name, g.color AS group_color,
              gr.display_name AS group_role_display_name, gr.slug AS group_role_slug,
              gr.color AS group_role_color
       FROM group_invite_links il
       JOIN hub_groups g ON g.id = il.group_id
       JOIN group_roles gr ON gr.id = il.group_role_id
       WHERE il.token = ?`
    )
    .bind(token)
    .first();
}

/** 招待リンクの参加確認情報を取得 */
export async function getGroupInviteJoinInfo(
  db: D1Database,
  token: string,
  userId: string
): Promise<InviteJoinInfo | null> {
  const link = await getActiveInviteLinkByToken(db, token);
  if (!link) {
    return null;
  }

  const memberships = await getUserGroupMemberships(db, userId);
  const current = memberships.find((m) => m.group_id === link.group_id);

  return {
    group_id: link.group_id,
    group_display_name: link.group_display_name,
    group_color: link.group_color ?? "#F38020",
    group_role_id: link.group_role_id,
    group_role_display_name: link.group_role_display_name,
    group_role_slug: link.group_role_slug,
    group_role_color: link.group_role_color ?? "#2C7CB0",
    already_member: Boolean(current),
    current_role_display_name: current?.group_role_display_name ?? null,
    revoked: link.revoked_at !== null,
  };
}

/** 招待リンク経由でグループに参加 */
export async function joinGroupViaInviteLink(
  db: D1Database,
  token: string,
  userId: string
): Promise<{ group_display_name: string; group_role_display_name: string }> {
  const link = await getActiveInviteLinkByToken(db, token);
  if (!link) {
    throw new Error("招待リンクが見つかりません");
  }

  if (link.revoked_at !== null) {
    throw new Error("この招待リンクは無効化されています");
  }

  const existingRedemption = await db
    .prepare(
      "SELECT id FROM group_invite_redemptions WHERE invite_link_id = ? AND user_id = ?"
    )
    .bind(link.id, userId)
    .first();

  await addUsersToGroup(db, link.group_id, link.group_role_id, [userId]);

  if (!existingRedemption) {
    const redemptionId = createId("gir");
    const timestamp = now();

    await db
      .prepare(
        `INSERT INTO group_invite_redemptions (id, invite_link_id, user_id, redeemed_at)
         VALUES (?, ?, ?, ?)`
      )
      .bind(redemptionId, link.id, userId, timestamp)
      .run();

    await db
      .prepare(
        `UPDATE group_invite_links SET use_count = use_count + 1 WHERE id = ?`
      )
      .bind(link.id)
      .run();
  }

  return {
    group_display_name: link.group_display_name,
    group_role_display_name: link.group_role_display_name,
  };
}
