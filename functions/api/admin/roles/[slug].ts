/**
 * ロール更新・削除 API（管理者）
 */

import type { Env } from "../../../lib/types";
import { jsonError } from "../../../lib/types";
import { getDb } from "../../../lib/db";
import { toPublicRole } from "../../../lib/roles";
import type { RoleRow } from "../../../lib/types";

interface UpdateRoleBody {
  display_name?: string;
  is_admin?: boolean;
  color?: string;
  position?: number;
}

/** ロールを更新する */
export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const slug = context.params.slug as string;
  if (!slug) {
    return jsonError("ロール slug が不正です", 400);
  }

  const db = getDb(context.env);
  const existing = await db
    .prepare("SELECT slug FROM roles WHERE slug = ?")
    .bind(slug)
    .first();

  if (!existing) {
    return jsonError("ロールが見つかりません", 404);
  }

  let body: UpdateRoleBody;
  try {
    body = await context.request.json<UpdateRoleBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  const updates: string[] = [];
  const values: (string | number)[] = [];

  if (body.display_name !== undefined) {
    const name = body.display_name.trim();
    if (!name) {
      return jsonError("ロール名を入力してください", 400);
    }
    updates.push("display_name = ?");
    values.push(name);
  }

  if (body.is_admin !== undefined) {
    updates.push("is_admin = ?");
    values.push(body.is_admin ? 1 : 0);
  }

  if (body.color !== undefined) {
    const color = body.color.trim();
    if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
      return jsonError("色は #RRGGBB 形式で指定してください", 400);
    }
    updates.push("color = ?");
    values.push(color);
  }

  if (body.position !== undefined) {
    updates.push("position = ?");
    values.push(body.position);
  }

  if (updates.length === 0) {
    return jsonError("更新する項目がありません", 400);
  }

  values.push(slug);

  await db
    .prepare(`UPDATE roles SET ${updates.join(", ")} WHERE slug = ?`)
    .bind(...values)
    .run();

  const role = await db
    .prepare(
      "SELECT slug, display_name, is_admin, color, position, created_at FROM roles WHERE slug = ?"
    )
    .bind(slug)
    .first<RoleRow>();

  return Response.json({ role: role ? toPublicRole(role) : null });
};

/** ロールを削除する */
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const slug = context.params.slug as string;
  if (!slug) {
    return jsonError("ロール slug が不正です", 400);
  }

  const db = getDb(context.env);
  const existing = await db
    .prepare("SELECT slug FROM roles WHERE slug = ?")
    .bind(slug)
    .first();

  if (!existing) {
    return jsonError("ロールが見つかりません", 404);
  }

  await db.prepare("DELETE FROM roles WHERE slug = ?").bind(slug).run();

  return Response.json({ ok: true, deleted: slug });
};
