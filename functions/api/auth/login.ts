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
import { getDb } from "../../lib/db";
import { getUserRoles } from "../../lib/roles";
import { verifyPassword } from "../../lib/password";

interface LoginBody {
  username?: string;
  email?: string;
  password?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    let body: LoginBody;
    try {
      body = await context.request.json<LoginBody>();
    } catch {
      return jsonError("リクエスト形式が不正です", 400);
    }

    const identifier = (body.email ?? body.username ?? "").trim();
    const password = body.password ?? "";

    if (!identifier || !password) {
      return jsonError("メールアドレスとパスワードを入力してください", 400);
    }

    const db = getDb(context.env);

    const user = await db
      .prepare(
        `SELECT u.id, u.username, u.display_name, u.email, u.role_slug, u.password_hash
         FROM users u
         WHERE u.username = ? OR u.email = ?`
      )
      .bind(identifier, identifier)
      .first<{
        id: string;
        username: string;
        display_name: string;
        email: string;
        role_slug: string;
        password_hash: string;
      }>();

    if (!user || !user.password_hash) {
      return jsonError("メールアドレスまたはパスワードが正しくありません", 401);
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return jsonError("メールアドレスまたはパスワードが正しくありません", 401);
    }

    const roles = await getUserRoles(db, user.id);
    const isAdmin = roles.some((role) => role.is_admin);
    const sessionId = await createSession(db, user.id);
    const maxAgeSec = Math.floor(SESSION_TTL_MS / 1000);

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
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": setSessionCookie(sessionId, maxAgeSec),
        },
      }
    );
  } catch (error) {
    console.error("Login failed:", error);
    const message =
      error instanceof Error ? error.message : "ログイン処理でエラーが発生しました";
    return jsonError(message, 500);
  }
};
