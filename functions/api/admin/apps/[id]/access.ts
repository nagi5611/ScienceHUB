/**
 * アプリのアクセスルール API（管理者）
 */

import type { Env } from "../../../../lib/types";
import { jsonError } from "../../../../lib/types";
import { getDb } from "../../../../lib/db";
import {
  getAppAccessRules,
  getAppById,
  setAppAccessRules,
  type AppGroupAccessRule,
} from "../../../../lib/apps";

interface AccessBody {
  rules?: Array<{
    group_id?: string;
    enabled?: boolean;
    group_role_ids?: string[];
  }>;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const appId = context.params.id as string;
  const app = await getAppById(getDb(context.env), appId);
  if (!app) {
    return jsonError("アプリが見つかりません", 404);
  }

  const rules = await getAppAccessRules(getDb(context.env), appId);
  return Response.json({ rules });
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const appId = context.params.id as string;

  let body: AccessBody;
  try {
    body = await context.request.json<AccessBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  const rules: AppGroupAccessRule[] = (body.rules ?? []).map((rule) => ({
    group_id: rule.group_id?.trim() ?? "",
    enabled: Boolean(rule.enabled),
    group_role_ids: rule.group_role_ids ?? [],
  }));

  try {
    await setAppAccessRules(getDb(context.env), appId, rules);
    const updated = await getAppAccessRules(getDb(context.env), appId);
    return Response.json({ ok: true, rules: updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "アクセス設定の更新に失敗しました";
    return jsonError(message, 400);
  }
};
