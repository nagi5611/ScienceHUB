/**
 * Runa — ユーザー名・表示名の検索（同一グループメンバーに限定）
 */

import type { SessionUser } from "../types";

export interface RunaUserHit {
  id: string;
  username: string;
  displayName: string;
}

function escapeLikePattern(value: string): string {
  return value.replace(/[%_\\]/g, "\\$&");
}

/** 表示名・ユーザー名の部分一致でユーザーを検索 */
export async function searchUsersForRuna(
  db: D1Database,
  user: SessionUser,
  query: string,
  limit = 20
): Promise<RunaUserHit[]> {
  const q = query.trim();
  if (!q) return [];

  const capped = Math.min(30, Math.max(1, limit));
  const pattern = `%${escapeLikePattern(q)}%`;

  if (user.is_admin) {
    const rows = await db
      .prepare(
        `SELECT id, username, display_name
         FROM users
         WHERE username LIKE ? ESCAPE '\\' OR display_name LIKE ? ESCAPE '\\'
         ORDER BY display_name COLLATE NOCASE, username
         LIMIT ?`
      )
      .bind(pattern, pattern, capped)
      .all<{ id: string; username: string; display_name: string }>();

    return (rows.results ?? []).map((row) => ({
      id: row.id,
      username: row.username,
      displayName: row.display_name || row.username,
    }));
  }

  const rows = await db
    .prepare(
      `SELECT DISTINCT u.id, u.username, u.display_name
       FROM users u
       WHERE (
         u.id = ?
         OR u.id IN (
           SELECT ugm2.user_id
           FROM user_group_memberships ugm1
           JOIN user_group_memberships ugm2 ON ugm1.group_id = ugm2.group_id
           WHERE ugm1.user_id = ?
         )
       )
       AND (
         u.username LIKE ? ESCAPE '\\' OR u.display_name LIKE ? ESCAPE '\\'
       )
       ORDER BY u.display_name COLLATE NOCASE, u.username
       LIMIT ?`
    )
    .bind(user.id, user.id, pattern, pattern, capped)
    .all<{ id: string; username: string; display_name: string }>();

  return (rows.results ?? []).map((row) => ({
    id: row.id,
    username: row.username,
    displayName: row.display_name || row.username,
  }));
}
