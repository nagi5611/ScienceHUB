/**
 * グループロール一覧・作成 API（管理者）
 */

import type { Env } from "../../../../lib/types";
import { jsonError } from "../../../../lib/types";
import { getDb } from "../../../../lib/db";
import { createGroupRole, getGroupById } from "../../../../lib/groups";

interface CreateGroupRoleBody {
  display_name?: string;
  slug?: string;
  color?: string;
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

  return Response.json({ roles: group.roles });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const groupId = context.params.id as string;
  if (!groupId) {
    return jsonError("グループ ID が不正です", 400);
  }

  let body: CreateGroupRoleBody;
  try {
    body = await context.request.json<CreateGroupRoleBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  const displayName = body.display_name?.trim() ?? "";
  if (!displayName) {
    return jsonError("グループロール名を入力してください", 400);
  }

  try {
    const role = await createGroupRole(getDb(context.env), groupId, {
      display_name: displayName,
      slug: body.slug,
      color: body.color,
    });

    if (!role) {
      return jsonError("グループロールの作成に失敗しました", 500);
    }

    return Response.json({ role }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "グループロールの作成に失敗しました";
    return jsonError(message, 400);
  }
};
