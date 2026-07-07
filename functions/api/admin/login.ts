/**
 * 管理者ログイン API
 */

import type { Env } from "../../lib/types";
import { jsonError } from "../../lib/types";
import {
  ADMIN_SESSION_TTL_MS,
  checkAdminLogin,
  createAdminSessionToken,
  isSecureRequest,
  setAdminSessionCookie,
} from "../../lib/admin-session";
import { getAdminBasicCredentials } from "../../lib/basic-auth";

interface AdminLoginBody {
  username?: string;
  password?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  if (!getAdminBasicCredentials(context.env)) {
    return jsonError("管理者認証が設定されていません", 503);
  }

  let body: AdminLoginBody;
  try {
    body = await context.request.json<AdminLoginBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";

  if (!username || !password) {
    return jsonError("ユーザー名とパスワードを入力してください", 400);
  }

  if (!checkAdminLogin(username, password, context.env)) {
    return jsonError("ユーザー名またはパスワードが正しくありません", 401);
  }

  const token = await createAdminSessionToken(username, context.env);
  if (!token) {
    return jsonError("セッションの作成に失敗しました", 500);
  }

  const maxAgeSec = Math.floor(ADMIN_SESSION_TTL_MS / 1000);
  const secure = isSecureRequest(context.request);

  return new Response(JSON.stringify({ ok: true, username }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": setAdminSessionCookie(token, maxAgeSec, secure),
    },
  });
};
