/**
 * GET /api/admin/runa/conversations?userId=&limit=
 */

import type { Env } from "../../../lib/types";
import { getDb } from "../../../lib/db";
import { listRunaConversationsAdmin } from "../../../lib/runa/conversations";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = getDb(context.env);
  const url = new URL(context.request.url);
  const userId = url.searchParams.get("userId")?.trim() || undefined;
  const limit = Number.parseInt(url.searchParams.get("limit") ?? "80", 10) || 80;

  const conversations = await listRunaConversationsAdmin(db, { userId, limit });
  return Response.json({ conversations });
};
