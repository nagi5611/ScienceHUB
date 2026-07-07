/**
 * ダッシュボード API（ログインユーザー向けグループ・アプリ一覧）
 */

import type { Env } from "../lib/types";
import { getDb } from "../lib/db";
import { requireUser } from "../lib/auth";
import { getDashboardForUser } from "../lib/apps";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireUser(context.request, context.env);
  if (auth instanceof Response) return auth;

  const groups = await getDashboardForUser(getDb(context.env), auth.id);
  return Response.json({ groups });
};
