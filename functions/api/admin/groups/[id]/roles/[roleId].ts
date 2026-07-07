/**
 * グループロール更新・削除 API（管理者）
 */

import type { Env } from "../../../../../lib/types";
import { jsonError } from "../../../../../lib/types";
import { getDb } from "../../../../../lib/db";
import { deleteGroupRole, updateGroupRole } from "../../../../../lib/groups";
import { parseRoleWeight } from "../../../../../lib/roleWeight";

interface UpdateGroupRoleBody {
  display_name?: string;
  color?: string;
  position?: number;
  weight?: number;
}

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const groupId = context.params.id as string;
  const roleId = context.params.roleId as string;

  if (!groupId || !roleId) {
    return jsonError("ID が不正です", 400);
  }

  let body: UpdateGroupRoleBody;
  try {
    body = await context.request.json<UpdateGroupRoleBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  if (body.weight !== undefined) {
    const weight = parseRoleWeight(body.weight);
    if (weight === null) {
      return jsonError("重みは整数で指定してください", 400);
    }
    body = { ...body, weight };
  }

  try {
    const role = await updateGroupRole(getDb(context.env), groupId, roleId, body);
    if (!role) {
      return jsonError("グループロールが見つかりません", 404);
    }
    return Response.json({ role });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "グループロールの更新に失敗しました";
    return jsonError(message, 400);
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const groupId = context.params.id as string;
  const roleId = context.params.roleId as string;

  if (!groupId || !roleId) {
    return jsonError("ID が不正です", 400);
  }

  try {
    await deleteGroupRole(getDb(context.env), groupId, roleId);
    return Response.json({ ok: true, deleted_id: roleId });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "グループロールの削除に失敗しました";
    return jsonError(message, 400);
  }
};
