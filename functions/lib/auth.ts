/**
 * セッション・認証ヘルパー
 */

import type { Env, SessionUser, UserRow } from "./types";
import {
  SESSION_TTL_MS,
  createId,
  getSessionIdFromCookie,
  now,
} from "./types";
import { getDb } from "./db";
import { getUserRoles, userHasAdminRole } from "./roles";
import type { PublicRole } from "./roles";
import { resolveUserAvatarUrl } from "./user-icons";
import { getUserGroupMemberships, type UserGroupMembership } from "./groups";
import { getUserOAuthProviders } from "./oauth-users";

/** ログインセッションを作成する */
export async function createSession(
  db: D1Database,
  userId: string
): Promise<string> {
  const sessionId = createId("sess");
  const createdAt = now();
  const expiresAt = createdAt + SESSION_TTL_MS;

  await db
    .prepare(
      "INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)"
    )
    .bind(sessionId, userId, expiresAt, createdAt)
    .run();

  return sessionId;
}

/** セッションを削除する */
export async function deleteSession(
  db: D1Database,
  sessionId: string
): Promise<void> {
  await db.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
}

/** 期限切れセッションを削除する */
export async function purgeExpiredSessions(db: D1Database): Promise<void> {
  await db
    .prepare("DELETE FROM sessions WHERE expires_at <= ?")
    .bind(now())
    .run();
}

/** リクエストからログインユーザーを取得する */
export async function getSessionUser(
  request: Request,
  env: Env
): Promise<SessionUser | null> {
  const sessionId = getSessionIdFromCookie(request);
  if (!sessionId) {
    return null;
  }

  const db = getDb(env);
  await purgeExpiredSessions(db);

  const row = await db
    .prepare(
      `SELECT u.id, u.username, u.email, u.display_name, u.role_slug, u.avatar_url, u.updated_at
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.id = ? AND s.expires_at > ?`
    )
    .bind(sessionId, now())
    .first<{
      id: string;
      username: string;
      email: string;
      display_name: string;
      role_slug: string;
      avatar_url: string | null;
      updated_at: number;
    }>();

  if (!row) {
    return null;
  }

  const roles = await getUserRoles(db, row.id);
  const isAdmin = await userHasAdminRole(db, row.id);
  const avatar_url = await resolveUserAvatarUrl(env, {
    username: row.username,
    avatar_url: row.avatar_url,
    updated_at: row.updated_at,
  });

  return {
    id: row.id,
    username: row.username,
    email: row.email,
    display_name: row.display_name,
    role_slug: row.role_slug,
    avatar_url,
    roles: roles.map((role) => ({
      slug: role.slug,
      display_name: role.display_name,
      color: role.color,
      is_admin: role.is_admin,
    })),
    is_admin: isAdmin,
  };
}

/** ログイン済みユーザーを要求する */
export async function requireUser(
  request: Request,
  env: Env
): Promise<SessionUser | Response> {
  const user = await getSessionUser(request, env);
  if (!user) {
    return Response.json({ error: "ログインが必要です" }, { status: 401 });
  }
  return user;
}

/** 管理者権限を要求する */
export async function requireAdmin(
  request: Request,
  env: Env
): Promise<SessionUser | Response> {
  const user = await getSessionUser(request, env);
  if (!user) {
    return Response.json({ error: "ログインが必要です" }, { status: 401 });
  }
  if (!user.is_admin) {
    return Response.json({ error: "管理者権限が必要です" }, { status: 403 });
  }
  return user;
}

/** 公開用ユーザー情報に変換する */
export async function toPublicUser(
  db: D1Database,
  user: UserRow,
  roles?: PublicRole[],
  env?: Env
) {
  const userRoles = roles ?? (await getUserRoles(db, user.id));
  const avatar_url = env
    ? await resolveUserAvatarUrl(env, user)
    : user.avatar_url;
  const groups: UserGroupMembership[] = env
    ? await getUserGroupMemberships(db, user.id)
    : [];
  const oauth_providers = await getUserOAuthProviders(db, user.id);

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    display_name: user.display_name,
    role_slug: user.role_slug,
    avatar_url,
    groups,
    roles: userRoles,
    oauth_providers,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

/** ユーザー名の重複を確認する */
export async function usernameExists(
  db: D1Database,
  username: string,
  excludeId?: string
): Promise<boolean> {
  const row = excludeId
    ? await db
        .prepare("SELECT id FROM users WHERE username = ? AND id != ?")
        .bind(username, excludeId)
        .first()
    : await db
        .prepare("SELECT id FROM users WHERE username = ?")
        .bind(username)
        .first();
  return row !== null;
}

/** メールの重複を確認する */
export async function emailExists(
  db: D1Database,
  email: string,
  excludeId?: string
): Promise<boolean> {
  const row = excludeId
    ? await db
        .prepare("SELECT id FROM users WHERE email = ? AND id != ?")
        .bind(email, excludeId)
        .first()
    : await db
        .prepare("SELECT id FROM users WHERE email = ?")
        .bind(email)
        .first();
  return row !== null;
}

/** ロール slug の存在確認 */
export async function roleExists(
  db: D1Database,
  slug: string
): Promise<boolean> {
  const row = await db
    .prepare("SELECT slug FROM roles WHERE slug = ?")
    .bind(slug)
    .first();
  return row !== null;
}

/** slug を正規化する */
export function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 32);
}
