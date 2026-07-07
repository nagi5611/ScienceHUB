/**
 * ユーザー更新 API（管理者）— 複数ロール割り当てなど
 */

import type { Env } from "../../../lib/types";
import { jsonError, now } from "../../../lib/types";
import { emailExists, toPublicUser, usernameExists } from "../../../lib/auth";
import { getDb } from "../../../lib/db";
import { hashPassword } from "../../../lib/password";
import { setUserRoles, validateRoleSlugs } from "../../../lib/roles";
import {
  setUserGroupMemberships,
  type GroupMembershipInput,
} from "../../../lib/groups";
import { validatePassword, validateUsername } from "../../../lib/users";
import type { UserRow } from "../../../lib/types";

interface UpdateUserBody {
  username?: string;
  email?: string;
  display_name?: string;
  password?: string;
  role_slug?: string;
  role_slugs?: string[];
  group_memberships?: GroupMembershipInput[];
}

/** ユーザーを更新する */
export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const userId = context.params.id as string;
  if (!userId) {
    return jsonError("ユーザー ID が不正です", 400);
  }

  const db = getDb(context.env);
  const existing = await db
    .prepare("SELECT id FROM users WHERE id = ?")
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
    const usernameError = validateUsername(username);
    if (usernameError) {
      return jsonError(usernameError, 400);
    }
    if (await usernameExists(db, username, userId)) {
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
    if (await emailExists(db, email, userId)) {
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

  if (body.password !== undefined && body.password !== "") {
    const passwordError = validatePassword(body.password);
    if (passwordError) {
      return jsonError(passwordError, 400);
    }
    updates.push("password_hash = ?");
    values.push(await hashPassword(body.password));
  }

  if (body.role_slugs !== undefined) {
    const roleError = await validateRoleSlugs(db, body.role_slugs);
    if (roleError) {
      return jsonError(roleError, 400);
    }
    await setUserRoles(db, userId, body.role_slugs);
  } else if (body.role_slug !== undefined) {
    const roleError = await validateRoleSlugs(db, [body.role_slug.trim()]);
    if (roleError) {
      return jsonError(roleError, 400);
    }
    await setUserRoles(db, userId, [body.role_slug.trim()]);
  }

  if (body.group_memberships !== undefined) {
    try {
      await setUserGroupMemberships(db, userId, body.group_memberships);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "グループの割り当てに失敗しました";
      return jsonError(message, 400);
    }
  }

  if (
    updates.length === 0 &&
    body.role_slugs === undefined &&
    body.role_slug === undefined &&
    body.group_memberships === undefined
  ) {
    return jsonError("更新する項目がありません", 400);
  }

  if (updates.length > 0) {
    updates.push("updated_at = ?");
    values.push(now());
    values.push(userId);

    await db
      .prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`)
      .bind(...values)
      .run();
  }

  const user = await db
    .prepare(
      `SELECT id, username, email, display_name, role_slug, password_hash, avatar_url, created_at, updated_at
       FROM users WHERE id = ?`
    )
    .bind(userId)
    .first<UserRow>();

  return Response.json({ user: user ? await toPublicUser(db, user, undefined, context.env) : null });
};

/** ユーザーを削除する */
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const userId = context.params.id as string;
  if (!userId) {
    return jsonError("ユーザー ID が不正です", 400);
  }

  const db = getDb(context.env);
  const existing = await db
    .prepare("SELECT id, username, display_name FROM users WHERE id = ?")
    .bind(userId)
    .first<{ id: string; username: string; display_name: string }>();

  if (!existing) {
    return jsonError("ユーザーが見つかりません", 404);
  }

  const ownedDirs = await db
    .prepare("SELECT COUNT(*) AS count FROM directories WHERE owner_id = ?")
    .bind(userId)
    .first<{ count: number }>();

  if ((ownedDirs?.count ?? 0) > 0) {
    return jsonError(
      "このユーザーが所有するディレクトリがあるため削除できません",
      409
    );
  }

  try {
    await db.prepare("DELETE FROM sessions WHERE user_id = ?").bind(userId).run();
    await db
      .prepare("DELETE FROM oauth_identities WHERE user_id = ?")
      .bind(userId)
      .run();
    await db.prepare("DELETE FROM user_roles WHERE user_id = ?").bind(userId).run();
    await db
      .prepare("DELETE FROM user_group_memberships WHERE user_id = ?")
      .bind(userId)
      .run();
    await db.prepare("DELETE FROM users WHERE id = ?").bind(userId).run();
  } catch (error) {
    console.error("User delete failed:", error);
    return jsonError("ユーザーの削除に失敗しました", 500);
  }

  return Response.json({ ok: true, deleted_id: userId });
};
