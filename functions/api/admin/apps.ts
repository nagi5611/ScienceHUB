/**
 * アプリ一覧・作成 API（管理者）
 */

import type { Env } from "../../lib/types";
import { jsonError } from "../../lib/types";
import { getDb } from "../../lib/db";
import { createApp, listApps } from "../../lib/apps";

interface CreateAppBody {
  display_name?: string;
  slug?: string;
  description?: string;
  href?: string;
  icon_emoji?: string;
  color?: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const apps = await listApps(getDb(context.env));
  return Response.json({ apps });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: CreateAppBody;
  try {
    body = await context.request.json<CreateAppBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  try {
    const app = await createApp(getDb(context.env), {
      display_name: body.display_name ?? "",
      slug: body.slug,
      description: body.description,
      href: body.href ?? "",
      icon_emoji: body.icon_emoji,
      color: body.color,
    });

    if (!app) {
      return jsonError("アプリの作成に失敗しました", 500);
    }

    return Response.json({ app }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "アプリの作成に失敗しました";
    return jsonError(message, 400);
  }
};
