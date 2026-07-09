/**
 * グループ招待リンク情報 API（ログインユーザー）
 */

import type { Env } from "../../lib/types";
import { jsonError } from "../../lib/types";
import { requireUser } from "../../lib/auth";
import { getDb } from "../../lib/db";
import { getGroupInviteJoinInfo } from "../../lib/group-invite";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireUser(context.request, context.env);
  if (auth instanceof Response) {
    return auth;
  }

  const url = new URL(context.request.url);
  const token = url.searchParams.get("token")?.trim() ?? "";
  if (!token) {
    return jsonError("招待トークンが指定されていません", 400);
  }

  const info = await getGroupInviteJoinInfo(getDb(context.env), token, auth.id);
  if (!info) {
    return jsonError("招待リンクが見つかりません", 404);
  }

  return Response.json({ invite: info });
};
