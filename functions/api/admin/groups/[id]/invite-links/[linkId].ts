/**
 * グループ招待リンク API（管理者）— 無効化
 */

import type { Env } from "../../../../../lib/types";
import { jsonError } from "../../../../../lib/types";
import { getDb } from "../../../../../lib/db";
import { revokeGroupInviteLink } from "../../../../../lib/group-invite";

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const groupId = context.params.id as string;
  const linkId = context.params.linkId as string;
  if (!groupId || !linkId) {
    return jsonError("パラメータが不正です", 400);
  }

  try {
    await revokeGroupInviteLink(getDb(context.env), groupId, linkId);
    return Response.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "招待リンクの無効化に失敗しました";
    return jsonError(message, 400);
  }
};
