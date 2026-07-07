/**
 * 公開サインアップ API（ゲストロール）
 */

import type { Env } from "../../lib/types";
import { SESSION_TTL_MS, jsonError, setSessionCookie } from "../../lib/types";
import { createSession } from "../../lib/auth";
import { getDb } from "../../lib/db";
import { createUser, validateDisplayName } from "../../lib/users";
import { ensureUserStorageRoot } from "../../lib/storage/roots";

interface SignupBody {
  username?: string;
  email?: string;
  display_name?: string;
  password?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    let body: SignupBody;
    try {
      body = await context.request.json<SignupBody>();
    } catch {
      return jsonError("リクエスト形式が不正です", 400);
    }

    const db = getDb(context.env);

    const displayNameError = validateDisplayName(body.display_name ?? "");
    if (displayNameError) {
      return jsonError(displayNameError, 400);
    }

    const result = await createUser(db, {
      username: body.username ?? "",
      email: body.email ?? "",
      display_name: body.display_name ?? "",
      password: body.password ?? "",
      role_slugs: ["guest"],
    });

    if (result instanceof Response) {
      return result;
    }

    await ensureUserStorageRoot(
      context.env,
      db,
      result.user.id,
      result.user.username,
      result.user.role_slug ?? "guest"
    );

    const sessionId = await createSession(db, result.user.id);
    const maxAgeSec = Math.floor(SESSION_TTL_MS / 1000);
    const isAdmin = (result.user.roles ?? []).some((role) => role.is_admin);

    return new Response(
      JSON.stringify({
        user: {
          ...result.user,
          is_admin: isAdmin,
        },
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": setSessionCookie(sessionId, maxAgeSec),
        },
      }
    );
  } catch (error) {
    console.error("Signup failed:", error);
    const message =
      error instanceof Error ? error.message : "サインアップ処理でエラーが発生しました";
    return jsonError(message, 500);
  }
};
