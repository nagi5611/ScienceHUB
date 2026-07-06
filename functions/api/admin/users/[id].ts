/**
 * ユーザー更新 API（管理者）— ロール割り当てなど
 */

import type { Env } from "../../../lib/types";
import { jsonError, now } from "../../../lib/types";
import {
  emailExists,
  roleExists,
  toPublicUser,
  usernameExists,
} from "../../../lib/auth";
import type { UserRow } from "../../../lib/types";

interface UpdateUserBody {
  username?: string;
  email?: string;
  display_name?: string;
  role_slug?: string;
}

/** ユーザーを更新する */
export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const userId = context.params.id as string;
  if (!userId) {
    return jsonError("ユーザー ID が不正です", 400);
  }

  const existing = await context.env.DB.prepare(
    "SELECT id FROM users WHERE id = ?"
  )
    .bind(userId)
    .first();

  if (!existing) {
    return jsonError("ユーザーが見つかりません", 404);
  }

  let body: UpdateUserBody;
  try {
    body = await context.request.json<UpdateUserBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  const updates: string[] = [];
  const values: (string | number)[] = [];

  if (body.username !== undefined) {
    const username = body.username.trim();
    if (username.length < 2 || username.length > 32) {
      return jsonError("ユーザー名は 2〜32 文字で入力してください", 400);
    }
    if (await usernameExists(context.env.DB, username, userId)) {
      return jsonError("このユーザー名は既に使われています", 400);
    }
    updates.push("username = ?");
    values.push(username);
  }

  if (body.email !== undefined) {
    const email = body.email.trim();
    if (!email) {
      return jsonError("メールアドレスを入力してください", 400);
    }
    if (await emailExists(context.env.DB, email, userId)) {
      return jsonError("このメールアドレスは既に登録されています", 400);
    }
    updates.push("email = ?");
    values.push(email);
  }

  if (body.display_name !== undefined) {
    const displayName = body.display_name.trim();
    if (!displayName) {
      return jsonError("表示名を入力してください", 400);
    }
    updates.push("display_name = ?");
    values.push(displayName);
  }

  if (body.role_slug !== undefined) {
    const roleSlug = body.role_slug.trim();
    if (!(await roleExists(context.env.DB, roleSlug))) {
      return jsonError("指定されたロールが存在しません", 400);
    }
    updates.push("role_slug = ?");
    values.push(roleSlug);
  }

  if (updates.length === 0) {
    return jsonError("更新する項目がありません", 400);
  }

  updates.push("updated_at = ?");
  values.push(now());
  values.push(userId);

  await context.env.DB.prepare(
    `UPDATE users SET ${updates.join(", ")} WHERE id = ?`
  )
    .bind(...values)
    .run();

  const user = await context.env.DB.prepare(
    `SELECT id, username, email, display_name, role_slug, password_hash, avatar_url, created_at, updated_at
     FROM users WHERE id = ?`
  )
    .bind(userId)
    .first<UserRow>();

  return Response.json({ user: user ? toPublicUser(user) : null });
};
