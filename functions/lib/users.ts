/**
 * ユーザー作成・更新ヘルパー
 */

import { createId, jsonError, now } from "./types";
import type { UserRow } from "./types";
import { emailExists, toPublicUser, usernameExists } from "./auth";
import { hashPassword } from "./password";
import { setUserRoles, validateRoleSlugs } from "./roles";

export interface CreateUserInput {
  username: string;
  email: string;
  display_name: string;
  password: string;
  role_slugs: string[];
}

/** ユーザー名の形式を検証する */
export function validateUsername(username: string): string | null {
  if (username.length < 2 || username.length > 32) {
    return "ユーザー名は 2〜32 文字で入力してください";
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return "ユーザー名は英数字・ハイフン・アンダースコアのみ使用できます";
  }
  return null;
}

export function validateDisplayName(displayName: string): string | null {
  const name = displayName.trim();
  if (!name) {
    return "表示名を入力してください";
  }
  if (name.length > 64) {
    return "表示名は 64 文字以内にしてください";
  }
  return null;
}

/** パスワードの形式を検証する */
export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "パスワードは 8 文字以上にしてください";
  }
  return null;
}

/** ユーザーを新規作成する */
export async function createUser(
  db: D1Database,
  input: CreateUserInput
): Promise<{ user: Awaited<ReturnType<typeof toPublicUser>> } | Response> {
  const username = input.username.trim();
  const email = input.email.trim();
  const displayName = input.display_name.trim();
  const password = input.password;
  const roleSlugs = input.role_slugs;

  if (!username || !email || !displayName || !password) {
    return jsonError("必須項目を入力してください", 400);
  }

  const usernameError = validateUsername(username);
  if (usernameError) return jsonError(usernameError, 400);

  const passwordError = validatePassword(password);
  if (passwordError) return jsonError(passwordError, 400);

  const roleError = await validateRoleSlugs(db, roleSlugs);
  if (roleError) return jsonError(roleError, 400);

  if (await usernameExists(db, username)) {
    return jsonError("このユーザー名は既に使われています", 400);
  }

  if (await emailExists(db, email)) {
    return jsonError("このメールアドレスは既に登録されています", 400);
  }

  const id = createId("user");
  const timestamp = now();
  const passwordHash = await hashPassword(password);
  const primaryRole = roleSlugs[0] ?? "guest";

  await db
    .prepare(
      `INSERT INTO users (id, username, email, display_name, role_slug, password_hash, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      username,
      email,
      displayName,
      primaryRole,
      passwordHash,
      timestamp,
      timestamp
    )
    .run();

  await setUserRoles(db, id, roleSlugs);

  const user = await db
    .prepare(
      `SELECT id, username, email, display_name, role_slug, password_hash, avatar_url, created_at, updated_at
       FROM users WHERE id = ?`
    )
    .bind(id)
    .first<UserRow>();

  if (!user) {
    return jsonError("ユーザーの作成に失敗しました", 500);
  }

  return { user: await toPublicUser(db, user) };
}
