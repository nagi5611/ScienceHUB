/**
 * アプリ詳細 API（管理者）
 */

import type { Env } from "../../../lib/types";
import { jsonError } from "../../../lib/types";
import { getDb } from "../../../lib/db";
import { deleteApp, getAppWithAccess, updateApp } from "../../../lib/apps";

interface UpdateAppBody {
  display_name?: string;
  slug?: string;
  description?: string | null;
  href?: string;
  icon_emoji?: string | null;
  color?: string;
  position?: number;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const appId = context.params.id as string;
  const app = await getAppWithAccess(getDb(context.env), appId);
  if (!app) {
    return jsonError("アプリが見つかりません", 404);
  }
  return Response.json({ app });
};

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const appId = context.params.id as string;

  let body: UpdateAppBody;
  try {
    body = await context.request.json<UpdateAppBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  try {
    const app = await updateApp(getDb(context.env), appId, body);
    if (!app) {
      return jsonError("アプリが見つかりません", 404);
    }
    return Response.json({ app });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "アプリの更新に失敗しました";
    return jsonError(message, 400);
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const appId = context.params.id as string;

  try {
    await deleteApp(getDb(context.env), appId);
    return Response.json({ ok: true, deleted_id: appId });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "アプリの削除に失敗しました";
    return jsonError(message, 400);
  }
};
