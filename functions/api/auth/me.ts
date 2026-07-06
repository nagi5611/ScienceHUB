/**
 * 現在のセッション情報 API
 */

import type { Env } from "../../lib/types";
import { getSessionUser } from "../../lib/auth";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const user = await getSessionUser(context.request, context.env);
  if (!user) {
    return Response.json({ user: null }, { status: 401 });
  }

  return Response.json({ user });
};
