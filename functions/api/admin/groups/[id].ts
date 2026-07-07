/**
 * グループ取得・更新・削除 API（管理者）
 */

import type { Env } from "../../../lib/types";
import { jsonError } from "../../../lib/types";
import { getDb } from "../../../lib/db";
import {
  deleteGroup,
  getGroupById,
  updateGroup,
} from "../../../lib/groups";

interface UpdateGroupBody {
  display_name?: string;
  slug?: string;
  description?: string | null;
  color?: string;
  position?: number;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const groupId = context.params.id as string;
  if (!groupId) {
    return jsonError("グループ ID が不正です", 400);
  }

  const group = await getGroupById(getDb(context.env), groupId);
  if (!group) {
    return jsonError("グループが見つかりません", 404);
  }

  return Response.json({ group });
};

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const groupId = context.params.id as string;
  if (!groupId) {
    return jsonError("グループ ID が不正です", 400);
  }

  let body: UpdateGroupBody;
  try {
    body = await context.request.json<UpdateGroupBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  try {
    const group = await updateGroup(getDb(context.env), groupId, body);
    if (!group) {
      return jsonError("グループが見つかりません", 404);
    }
    return Response.json({ group });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "グループの更新に失敗しました";
    return jsonError(message, 400);
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const groupId = context.params.id as string;
  if (!groupId) {
    return jsonError("グループ ID が不正です", 400);
  }

  const db = getDb(context.env);
  const existing = await db
    .prepare("SELECT id FROM hub_groups WHERE id = ?")
    .bind(groupId)
    .first();

  if (!existing) {
    return jsonError("グループが見つかりません", 404);
  }

  await deleteGroup(db, groupId);
  return Response.json({ ok: true, deleted_id: groupId });
};
