/**
 * プロフィール更新
 */

import { emailExists } from "./auth";
import { getDb } from "./db";
import type { Env, UserRow } from "./types";
import { jsonError, now } from "./types";
import { userIconPublicUrl } from "./user-icons";
import { validateDisplayName } from "./users";

export function validateEmail(email: string): string | null {
  const value = email.trim();
  if (!value) {
    return "メールアドレスを入力してください";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "有効なメールアドレスを入力してください";
  }
  if (value.length > 254) {
    return "メールアドレスが長すぎます";
  }
  return null;
}

export interface ProfileUpdateInput {
  display_name?: string;
  email?: string;
}

/** プロフィールを更新する */
export async function updateUserProfile(
  env: Env,
  userId: string,
  input: ProfileUpdateInput
): Promise<{ user: UserRow; avatar_url: string | null } | Response> {
  const db = getDb(env);

  const current = await db
    .prepare(
      `SELECT id, username, email, display_name, role_slug, password_hash, avatar_url, created_at, updated_at
       FROM users WHERE id = ?`
    )
    .bind(userId)
    .first<UserRow>();

  if (!current) {
    return jsonError("ユーザーが見つかりません", 404);
  }

  const displayName =
    input.display_name !== undefined
      ? input.display_name.trim()
      : current.display_name;
  const email =
    input.email !== undefined ? input.email.trim().toLowerCase() : current.email;

  if (input.display_name !== undefined) {
    const nameError = validateDisplayName(displayName);
    if (nameError) return jsonError(nameError, 400);
  }

  if (input.email !== undefined) {
    const emailError = validateEmail(email);
    if (emailError) return jsonError(emailError, 400);
    if (await emailExists(db, email, userId)) {
      return jsonError("このメールアドレスは既に登録されています", 400);
    }
  }

  const timestamp = now();
  await db
    .prepare(
      `UPDATE users SET display_name = ?, email = ?, updated_at = ? WHERE id = ?`
    )
    .bind(displayName, email, timestamp, userId)
    .run();

  const user = await db
    .prepare(
      `SELECT id, username, email, display_name, role_slug, password_hash, avatar_url, created_at, updated_at
       FROM users WHERE id = ?`
    )
    .bind(userId)
    .first<UserRow>();

  if (!user) {
    return jsonError("プロフィールの更新に失敗しました", 500);
  }

  const avatarUrl = user.avatar_url;

  return { user, avatar_url: avatarUrl };
}

/** アイコンアップロード後に avatar_url を更新する */
export async function markUserIconUploaded(
  env: Env,
  userId: string
): Promise<string | null> {
  const db = getDb(env);
  const user = await db
    .prepare("SELECT username FROM users WHERE id = ?")
    .bind(userId)
    .first<{ username: string }>();

  if (!user) return null;

  const timestamp = now();
  const avatarUrl = userIconPublicUrl(user.username, timestamp);

  await db
    .prepare(
      "UPDATE users SET avatar_url = ?, updated_at = ? WHERE id = ?"
    )
    .bind(avatarUrl, timestamp, userId)
    .run();

  return avatarUrl;
}
