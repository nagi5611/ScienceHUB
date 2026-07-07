/**
 * アプリアクセス確認 API
 */

import type { Env } from "../../../lib/types";
import { jsonError } from "../../../lib/types";
import { getDb } from "../../../lib/db";
import { requireUser } from "../../../lib/auth";
import { canUserAccessApp, getAppBySlug } from "../../../lib/apps";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireUser(context.request, context.env);
  if (auth instanceof Response) return auth;

  const slug = context.params.slug as string;
  if (!slug) {
    return jsonError("アプリ識別子が不正です", 400);
  }

  const app = await getAppBySlug(getDb(context.env), slug);
  if (!app) {
    return jsonError("アプリが見つかりません", 404);
  }

  const allowed = await canUserAccessApp(getDb(context.env), auth.id, slug);
  if (!allowed) {
    return jsonError("このアプリへのアクセス権限がありません", 403);
  }

  return Response.json({
    allowed: true,
    app: {
      slug: app.slug,
      display_name: app.display_name,
      href: app.href,
    },
  });
};
