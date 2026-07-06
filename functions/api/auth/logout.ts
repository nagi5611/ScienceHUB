/**
 * ログアウト API
 */

import type { Env } from "../../lib/types";
import { clearSessionCookie, getSessionIdFromCookie } from "../../lib/types";
import { deleteSession } from "../../lib/auth";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const sessionId = getSessionIdFromCookie(context.request);
  if (sessionId) {
    await deleteSession(context.env.DB, sessionId);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": clearSessionCookie(),
    },
  });
};
