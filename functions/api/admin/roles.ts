/**
 * ロール一覧・新規追加 API（管理者）
 */

import type { Env, RoleRow } from "../../lib/types";
import { jsonError, now } from "../../lib/types";
import { normalizeSlug } from "../../lib/auth";

interface CreateRoleBody {
  slug?: string;
  display_name?: string;
  is_admin?: boolean;
}

/** ロール一覧を返す */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const result = await context.env.DB.prepare(
    "SELECT slug, display_name, is_admin, created_at FROM roles ORDER BY created_at ASC, slug ASC"
  ).all<RoleRow>();

  return Response.json({
    roles: (result.results ?? []).map((role) => ({
      slug: role.slug,
      display_name: role.display_name,
      is_admin: role.is_admin === 1,
      created_at: role.created_at,
    })),
  });
};

/** ロールを新規追加する */
export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: CreateRoleBody;
  try {
    body = await context.request.json<CreateRoleBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  const displayName = body.display_name?.trim() ?? "";
  const slug = normalizeSlug(body.slug?.trim() || displayName);
  const isAdmin = body.is_admin === true ? 1 : 0;

  if (!displayName) {
    return jsonError("ロール名を入力してください", 400);
  }

  if (!slug || slug.length < 2) {
    return jsonError("ロール識別子（slug）が不正です", 400);
  }

  const existing = await context.env.DB.prepare(
    "SELECT slug FROM roles WHERE slug = ?"
  )
    .bind(slug)
    .first();

  if (existing) {
    return jsonError("このロール識別子は既に存在します", 400);
  }

  await context.env.DB.prepare(
    "INSERT INTO roles (slug, display_name, is_admin, created_at) VALUES (?, ?, ?, ?)"
  )
    .bind(slug, displayName, isAdmin, now())
    .run();

  return Response.json(
    {
      role: {
        slug,
        display_name: displayName,
        is_admin: isAdmin === 1,
        created_at: now(),
      },
    },
    { status: 201 }
  );
};
