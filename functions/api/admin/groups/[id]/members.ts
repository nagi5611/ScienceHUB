/**
 * グループメンバー API（管理者）
 */

import type { Env } from "../../../../lib/types";
import { jsonError } from "../../../../lib/types";
import { getDb } from "../../../../lib/db";
import { addUsersToGroup, replaceGroupMemberships } from "../../../../lib/groups";

interface AddMembersBody {
  user_ids?: string[];
  group_role_id?: string;
}

interface ReplaceMembersBody {
  memberships?: { user_id?: string; group_role_id?: string }[];
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const groupId = context.params.id as string;
  if (!groupId) {
    return jsonError("グループ ID が不正です", 400);
  }

  let body: AddMembersBody;
  try {
    body = await context.request.json<AddMembersBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  const userIds = body.user_ids ?? [];
  const groupRoleId = body.group_role_id?.trim() ?? "";

  if (!groupRoleId) {
    return jsonError("グループロールを選択してください", 400);
  }

  try {
    await addUsersToGroup(getDb(context.env), groupId, groupRoleId, userIds);
    return Response.json({ ok: true, added_count: userIds.length });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "メンバーの追加に失敗しました";
    return jsonError(message, 400);
  }
};

/** グループ内メンバー配置を一括更新する */
export const onRequestPut: PagesFunction<Env> = async (context) => {
  const groupId = context.params.id as string;
  if (!groupId) {
    return jsonError("グループ ID が不正です", 400);
  }

  let body: ReplaceMembersBody;
  try {
    body = await context.request.json<ReplaceMembersBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  const memberships = (body.memberships ?? [])
    .map((item) => ({
      user_id: item.user_id?.trim() ?? "",
      group_role_id: item.group_role_id?.trim() ?? "",
    }))
    .filter((item) => item.user_id && item.group_role_id);

  try {
    await replaceGroupMemberships(getDb(context.env), groupId, memberships);
    return Response.json({ ok: true, updated_count: memberships.length });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "メンバーの更新に失敗しました";
    return jsonError(message, 400);
  }
};
