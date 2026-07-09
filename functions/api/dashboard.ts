/**
 * ダッシュボード API（ログインユーザー向けグループ・アプリ一覧）
 */

import type { Env } from "../lib/types";
import { getDb } from "../lib/db";
import { requireUser } from "../lib/auth";
import { getDashboardForUser } from "../lib/apps";
import { getStorageOverviewForDashboard } from "../lib/storage/overview";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireUser(context.request, context.env);
  if (auth instanceof Response) return auth;

  const db = getDb(context.env);
  const [groups, storage] = await Promise.all([
    getDashboardForUser(db, auth.id),
    getStorageOverviewForDashboard(context.env, db, auth),
  ]);
  return Response.json({ groups, storage });
};
