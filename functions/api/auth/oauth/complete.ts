/**
 * OAuth 新規登録完了 API（表示名入力後）
 */

import type { Env } from "../../../lib/types";
import { SESSION_TTL_MS, jsonError, setSessionCookie } from "../../../lib/types";
import { createSession } from "../../../lib/auth";
import { getDb } from "../../../lib/db";
import {
  clearOAuthPendingCookie,
  readOAuthPending,
} from "../../../lib/oauth-pending";
import { createOAuthUser } from "../../../lib/oauth-users";
import { isSecureRequest, sanitizeOAuthNext } from "../../../lib/oauth";
import { getUserRoles } from "../../../lib/roles";
import { validateDisplayName } from "../../../lib/users";

interface CompleteBody {
  display_name?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const pending = await readOAuthPending(context.request, context.env);
  if (!pending) {
    return jsonError("登録セッションが無効です。もう一度ログインしてください。", 401);
  }

  let body: CompleteBody;
  try {
    body = await context.request.json<CompleteBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  const displayNameError = validateDisplayName(body.display_name ?? "");
  if (displayNameError) {
    return jsonError(displayNameError, 400);
  }

  const db = getDb(context.env);
  const user = await createOAuthUser(db, {
    provider: pending.provider,
    subject: pending.subject,
    email: pending.email,
    displayName: body.display_name!.trim(),
  });

  const sessionId = await createSession(db, user.id);
  const roles = await getUserRoles(db, user.id);
  const isAdmin = roles.some((role) => role.is_admin);
  const secure = isSecureRequest(context.request);
  const maxAgeSec = Math.floor(SESSION_TTL_MS / 1000);

  const headers = new Headers({
    "Content-Type": "application/json",
  });
  headers.append("Set-Cookie", setSessionCookie(sessionId, maxAgeSec, secure));
  headers.append("Set-Cookie", clearOAuthPendingCookie(secure));

  return new Response(
    JSON.stringify({
      user: {
        id: user.id,
        username: user.username,
        display_name: user.display_name,
        email: user.email,
        role_slug: user.role_slug,
        roles,
        is_admin: isAdmin,
      },
      redirect: sanitizeOAuthNext(pending.next),
    }),
    { status: 201, headers }
  );
};
