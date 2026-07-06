/**
 * ユーザー一覧・登録 API（管理者）
 */

import type { Env } from "../../lib/types";
import { createId, jsonError, now } from "../../lib/types";
import {
  emailExists,
  roleExists,
  toPublicUser,
  usernameExists,
} from "../../lib/auth";
import { hashPassword } from "../../lib/password";
import type { UserRow } from "../../lib/types";

interface CreateUserBody {
  username?: string;
  email?: string;
  display_name?: string;
  password?: string;
  role_slug?: string;
}

/** ユーザー一覧を返す */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const result = await context.env.DB.prepare(
    `SELECT id, username, email, display_name, role_slug, password_hash, avatar_url, created_at, updated_at
     FROM users
     ORDER BY created_at ASC, username ASC`
  ).all<UserRow>();

  return Response.json({
    users: (result.results ?? []).map(toPublicUser),
  });
};

/** ユーザーを新規登録する */
export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: CreateUserBody;
  try {
    body = await context.request.json<CreateUserBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  const username = body.username?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const displayName = body.display_name?.trim() ?? "";
  const password = body.password ?? "";
  const roleSlug = body.role_slug?.trim() ?? "member";

  if (!username || !email || !displayName || !password) {
    return jsonError("必須項目を入力してください", 400);
  }

  if (username.length < 2 || username.length > 32) {
    return jsonError("ユーザー名は 2〜32 文字で入力してください", 400);
  }

  if (password.length < 8) {
    return jsonError("パスワードは 8 文字以上にしてください", 400);
  }

  if (!(await roleExists(context.env.DB, roleSlug))) {
    return jsonError("指定されたロールが存在しません", 400);
  }

  if (await usernameExists(context.env.DB, username)) {
    return jsonError("このユーザー名は既に使われています", 400);
  }

  if (await emailExists(context.env.DB, email)) {
    return jsonError("このメールアドレスは既に登録されています", 400);
  }

  const id = createId("user");
  const timestamp = now();
  const passwordHash = await hashPassword(password);

  await context.env.DB.prepare(
    `INSERT INTO users (id, username, email, display_name, role_slug, password_hash, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      username,
      email,
      displayName,
      roleSlug,
      passwordHash,
      timestamp,
      timestamp
    )
    .run();

  const user = await context.env.DB.prepare(
    `SELECT id, username, email, display_name, role_slug, password_hash, avatar_url, created_at, updated_at
     FROM users WHERE id = ?`
  )
    .bind(id)
    .first<UserRow>();

  return Response.json({ user: user ? toPublicUser(user) : null }, { status: 201 });
};
