/**
 * ログインパスワード変更 API
 */

import type { Env } from "../../lib/types";
import { jsonError } from "../../lib/types";
import { requireUser } from "../../lib/auth";
import { changeUserPassword, type PasswordChangeInput } from "../../lib/profile";

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const auth = await requireUser(context.request, context.env);
  if (auth instanceof Response) return auth;

  let body: PasswordChangeInput;
  try {
    body = await context.request.json<PasswordChangeInput>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  const result = await changeUserPassword(context.env, auth.id, body);
  if (result instanceof Response) return result;

  return Response.json({ ok: true });
};
