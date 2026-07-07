/**
 * ユーザー一覧・登録 API（管理者）
 */

import type { Env } from "../../lib/types";
import { jsonError } from "../../lib/types";
import { getDb } from "../../lib/db";
import { createUser } from "../../lib/users";
import { ensureUserStorageRoot } from "../../lib/storage/roots";
import type { UserRow } from "../../lib/types";
import { toPublicUser } from "../../lib/auth";

interface CreateUserBody {
  username?: string;
  email?: string;
  display_name?: string;
  password?: string;
  role_slug?: string;
  role_slugs?: string[];
}

/** ユーザー一覧を返す */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = getDb(context.env);
  const result = await db
    .prepare(
      `SELECT id, username, email, display_name, role_slug, password_hash, avatar_url, created_at, updated_at
       FROM users
       ORDER BY created_at ASC, username ASC`
    )
    .all<UserRow>();

  const users = await Promise.all(
    (result.results ?? []).map((user) => toPublicUser(db, user, undefined, context.env))
  );

  return Response.json({ users });
};

/** ユーザーを新規登録する */
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const db = getDb(context.env);

  let body: CreateUserBody;
  try {
    body = await context.request.json<CreateUserBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  const roleSlugs =
    body.role_slugs && body.role_slugs.length > 0
      ? body.role_slugs
      : [body.role_slug?.trim() || "member"];

  const result = await createUser(db, {
    username: body.username ?? "",
    email: body.email ?? "",
    display_name: body.display_name ?? "",
    password: body.password ?? "",
    role_slugs: roleSlugs,
  });

  if (result instanceof Response) {
    return result;
  }

  const primaryRole = roleSlugs[0] ?? "member";
  await ensureUserStorageRoot(
    context.env,
    db,
    result.user.id,
    result.user.username,
    primaryRole
  );

  return Response.json({ user: result.user }, { status: 201 });
};
