/**
 * 管理者セッション確認 API
 */

import type { Env } from "../../lib/types";
import { getAdminSessionUser } from "../../lib/admin-session";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const username = await getAdminSessionUser(context.request, context.env);
  if (!username) {
    return Response.json({ admin: null }, { status: 401 });
  }

  return Response.json({ admin: { username } });
};
