/**
 * ログイン API
 */

import type { Env } from "../../lib/types";
import {
  SESSION_TTL_MS,
  jsonError,
  setSessionCookie,
} from "../../lib/types";
import { createSession } from "../../lib/auth";
import { verifyPassword } from "../../lib/password";

interface LoginBody {
  username?: string;
  password?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: LoginBody;
  try {
    body = await context.request.json<LoginBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";

  if (!username || !password) {
    return jsonError("ユーザー名とパスワードを入力してください", 400);
  }

  const user = await context.env.DB.prepare(
    `SELECT u.id, u.username, u.display_name, u.email, u.role_slug, u.password_hash, r.is_admin
     FROM users u
     JOIN roles r ON r.slug = u.role_slug
     WHERE u.username = ?`
  )
    .bind(username)
    .first<{
      id: string;
      username: string;
      display_name: string;
      email: string;
      role_slug: string;
      password_hash: string;
      is_admin: number;
    }>();

  if (!user || !user.password_hash) {
    return jsonError("ユーザー名またはパスワードが正しくありません", 401);
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return jsonError("ユーザー名またはパスワードが正しくありません", 401);
  }

  if (user.is_admin !== 1) {
    return jsonError("管理者のみログインできます", 403);
  }

  const sessionId = await createSession(context.env.DB, user.id);
  const maxAgeSec = Math.floor(SESSION_TTL_MS / 1000);

  return new Response(
    JSON.stringify({
      user: {
        id: user.id,
        username: user.username,
        display_name: user.display_name,
        email: user.email,
        role_slug: user.role_slug,
        is_admin: true,
      },
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": setSessionCookie(sessionId, maxAgeSec),
      },
    }
  );
};
