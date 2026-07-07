/**
 * 管理者ログアウト API
 */

import type { Env } from "../../lib/types";
import {
  clearAdminSessionCookie,
  isSecureRequest,
} from "../../lib/admin-session";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const secure = isSecureRequest(context.request);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": clearAdminSessionCookie(secure),
    },
  });
};
