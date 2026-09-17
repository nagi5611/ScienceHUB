/**
 * GET /api/admin/runa/conversations/:id/messages
 */

import type { Env } from "../../../../../lib/types";
import { jsonError } from "../../../../../lib/types";
import { getDb } from "../../../../../lib/db";
import { listRunaMessagesForConversation } from "../../../../../lib/runa/messages";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const conversationId = context.params.id;
  const id = Array.isArray(conversationId) ? conversationId[0] : conversationId;
  if (!id?.trim()) {
    return jsonError("会話 ID が必要です", 400);
  }

  const db = getDb(context.env);
  const url = new URL(context.request.url);
  const limit = Number.parseInt(url.searchParams.get("limit") ?? "200", 10) || 200;
  const messages = await listRunaMessagesForConversation(db, id.trim(), limit);

  return Response.json({ conversationId: id.trim(), messages });
};
