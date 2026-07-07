/**
 * ロール・ユーザー割り当てヘルパー
 */

import type { RoleRow } from "./types";
import { now } from "./types";

export interface PublicRole {
  slug: string;
  display_name: string;
  color: string;
  is_admin: boolean;
  position: number;
  member_count?: number;
}

/** ロール一覧（メンバー数付き）を取得する */
export async function listRolesWithCounts(db: D1Database): Promise<PublicRole[]> {
  const result = await db
    .prepare(
      `SELECT r.slug, r.display_name, r.color, r.is_admin, r.position, r.created_at,
              COUNT(ur.user_id) AS member_count
       FROM roles r
       LEFT JOIN user_roles ur ON ur.role_slug = r.slug
       GROUP BY r.slug
       ORDER BY r.position ASC, r.created_at ASC, r.slug ASC`
    )
    .all<RoleRow & { member_count: number }>();

  return (result.results ?? []).map(toPublicRole);
}

/** 公開用ロール形式に変換する */
export function toPublicRole(role: RoleRow & { member_count?: number }): PublicRole {
  return {
    slug: role.slug,
    display_name: role.display_name,
    color: role.color ?? "#F38020",
    is_admin: role.is_admin === 1,
    position: role.position ?? 0,
    member_count: role.member_count,
  };
}

/** ユーザーのロール slug 一覧を取得する */
export async function getUserRoleSlugs(
  db: D1Database,
  userId: string
): Promise<string[]> {
  const result = await db
    .prepare(
      `SELECT ur.role_slug
       FROM user_roles ur
       JOIN roles r ON r.slug = ur.role_slug
       WHERE ur.user_id = ?
       ORDER BY r.position ASC, r.display_name ASC`
    )
    .bind(userId)
    .all<{ role_slug: string }>();

  return (result.results ?? []).map((row) => row.role_slug);
}

/** ユーザーのロール詳細を取得する */
export async function getUserRoles(
  db: D1Database,
  userId: string
): Promise<PublicRole[]> {
  const result = await db
    .prepare(
      `SELECT r.slug, r.display_name, r.color, r.is_admin, r.position, r.created_at
       FROM user_roles ur
       JOIN roles r ON r.slug = ur.role_slug
       WHERE ur.user_id = ?
       ORDER BY r.position ASC, r.display_name ASC`
    )
    .bind(userId)
    .all<RoleRow>();

  return (result.results ?? []).map(toPublicRole);
}

/** ユーザーが管理者ロールを持つか判定する */
export async function userHasAdminRole(
  db: D1Database,
  userId: string
): Promise<boolean> {
  const row = await db
    .prepare(
      `SELECT 1 AS ok
       FROM user_roles ur
       JOIN roles r ON r.slug = ur.role_slug
       WHERE ur.user_id = ? AND r.is_admin = 1
       LIMIT 1`
    )
    .bind(userId)
    .first();

  return row !== null;
}

/** ユーザーのロールを置き換える */
export async function setUserRoles(
  db: D1Database,
  userId: string,
  roleSlugs: string[]
): Promise<void> {
  const unique = [...new Set(roleSlugs)];
  const timestamp = now();

  await db.prepare("DELETE FROM user_roles WHERE user_id = ?").bind(userId).run();

  for (const slug of unique) {
    await db
      .prepare(
        "INSERT INTO user_roles (user_id, role_slug, assigned_at) VALUES (?, ?, ?)"
      )
      .bind(userId, slug, timestamp)
      .run();
  }

  const primary = unique[0] ?? "member";
  await db
    .prepare("UPDATE users SET role_slug = ?, updated_at = ? WHERE id = ?")
    .bind(primary, timestamp, userId)
    .run();
}

/** メインロール（単一選択） */
export const MAIN_ROLE_SLUGS = ["admin", "member", "guest"] as const;

/** 複数ロール slug の存在を検証する（メインロールは1つのみ） */
export async function validateRoleSlugs(
  db: D1Database,
  slugs: string[]
): Promise<string | null> {
  if (slugs.length !== 1) {
    return "ロールは1つだけ選択してください";
  }

  if (!MAIN_ROLE_SLUGS.includes(slugs[0] as (typeof MAIN_ROLE_SLUGS)[number])) {
    return "ロールは管理者・メンバー・ゲストのいずれかを選択してください";
  }

  for (const slug of slugs) {
    const row = await db
      .prepare("SELECT slug FROM roles WHERE slug = ?")
      .bind(slug)
      .first();
    if (!row) {
      return `ロール「${slug}」が存在しません`;
    }
  }

  return null;
}
