/**
 * グループ招待リンク API（管理者）— 一覧・作成
 */

import type { Env } from "../../../../lib/types";
import { jsonError } from "../../../../lib/types";
import { getDb } from "../../../../lib/db";
import { getGroupById } from "../../../../lib/groups";
import {
  createGroupInviteLink,
  listGroupInviteLinks,
} from "../../../../lib/group-invite";
import { getAdminSessionUser } from "../../../../lib/admin-session";

interface CreateInviteLinkBody {
  group_role_id?: string;
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

  const invite_links = await listGroupInviteLinks(
    getDb(context.env),
    groupId,
    context.request
  );

  return Response.json({ invite_links });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const groupId = context.params.id as string;
  if (!groupId) {
    return jsonError("グループ ID が不正です", 400);
  }

  const adminUsername = await getAdminSessionUser(context.request, context.env);
  if (!adminUsername) {
    return jsonError("管理者ログインが必要です", 401);
  }

  let body: CreateInviteLinkBody;
  try {
    body = await context.request.json<CreateInviteLinkBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  const groupRoleId = body.group_role_id?.trim() ?? "";
  if (!groupRoleId) {
    return jsonError("グループロールを選択してください", 400);
  }

  try {
    const invite_link = await createGroupInviteLink(
      getDb(context.env),
      groupId,
      groupRoleId,
      adminUsername,
      context.request
    );
    return Response.json({ invite_link }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "招待リンクの作成に失敗しました";
    return jsonError(message, 400);
  }
};
