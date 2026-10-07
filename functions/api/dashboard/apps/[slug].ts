/**
 * ダッシュボード用: 1 アプリの表示情報
 */

import type { Env } from "../../../lib/types";
import { jsonError } from "../../../lib/types";
import { getDb } from "../../../lib/db";
import { requireUser } from "../../../lib/auth";
import { getDashboardAppForUser } from "../../../lib/apps";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireUser(context.request, context.env);
  if (auth instanceof Response) return auth;

  const slug = context.params.slug as string;
  if (!slug) {
    return jsonError("アプリ識別子が不正です", 400);
  }

  const db = getDb(context.env);
  const app = await getDashboardAppForUser(db, auth.id, slug);
  if (!app) {
    return jsonError("アプリが見つからないか、アクセス権がありません", 404);
  }

  return Response.json({ app });
};
