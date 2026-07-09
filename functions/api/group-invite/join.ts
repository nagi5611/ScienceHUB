/**
 * グループ招待リンク参加 API（ログインユーザー）
 */

import type { Env } from "../../lib/types";
import { jsonError } from "../../lib/types";
import { requireUser } from "../../lib/auth";
import { getDb } from "../../lib/db";
import { joinGroupViaInviteLink } from "../../lib/group-invite";

interface JoinBody {
  token?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const auth = await requireUser(context.request, context.env);
  if (auth instanceof Response) {
    return auth;
  }

  let body: JoinBody;
  try {
    body = await context.request.json<JoinBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  const token = body.token?.trim() ?? "";
  if (!token) {
    return jsonError("招待トークンが指定されていません", 400);
  }

  try {
    const result = await joinGroupViaInviteLink(
      getDb(context.env),
      token,
      auth.id
    );
    return Response.json({ ok: true, ...result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "グループへの参加に失敗しました";
    return jsonError(message, 400);
  }
};
