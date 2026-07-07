/**
 * ロール一覧・新規追加 API（管理者）
 */

import type { Env } from "../../lib/types";
import { jsonError, now } from "../../lib/types";
import { normalizeSlug } from "../../lib/auth";
import { getDb } from "../../lib/db";
import { listRolesWithCounts, toPublicRole } from "../../lib/roles";
import type { RoleRow } from "../../lib/types";

interface CreateRoleBody {
  slug?: string;
  display_name?: string;
  is_admin?: boolean;
  color?: string;
}

const DEFAULT_COLORS = [
  "#F38020",
  "#2C7CB0",
  "#7C3AED",
  "#059669",
  "#E31837",
  "#D97706",
];

/** ロール一覧を返す */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = getDb(context.env);
  const roles = await listRolesWithCounts(db);
  return Response.json({ roles });
};

/** ロールを新規追加する */
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const db = getDb(context.env);

  let body: CreateRoleBody;
  try {
    body = await context.request.json<CreateRoleBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  const displayName = body.display_name?.trim() ?? "";
  const slug = normalizeSlug(body.slug?.trim() || displayName);
  const isAdmin = body.is_admin === true ? 1 : 0;
  const color = body.color?.trim() || DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];

  if (!displayName) {
    return jsonError("ロール名を入力してください", 400);
  }

  if (!slug || slug.length < 2) {
    return jsonError("ロール識別子（slug）が不正です", 400);
  }

  const existing = await db
    .prepare("SELECT slug FROM roles WHERE slug = ?")
    .bind(slug)
    .first();

  if (existing) {
    return jsonError("このロール識別子は既に存在します", 400);
  }

  const maxPos = await db
    .prepare("SELECT COALESCE(MAX(position), -1) AS max_pos FROM roles")
    .first<{ max_pos: number }>();

  const position = (maxPos?.max_pos ?? -1) + 1;
  const createdAt = now();

  await db
    .prepare(
      "INSERT INTO roles (slug, display_name, is_admin, color, position, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(slug, displayName, isAdmin, color, position, createdAt)
    .run();

  const role = await db
    .prepare(
      "SELECT slug, display_name, is_admin, color, position, created_at FROM roles WHERE slug = ?"
    )
    .bind(slug)
    .first<RoleRow>();

  return Response.json(
    { role: role ? { ...toPublicRole(role), member_count: 0 } : null },
    { status: 201 }
  );
};
