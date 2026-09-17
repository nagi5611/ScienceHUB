/**
 * GET/PATCH /api/admin/runa/settings — Web 検索プロバイダ ON/OFF
 */

import type { Env } from "../../../lib/types";
import { jsonError } from "../../../lib/types";
import { getDb } from "../../../lib/db";
import {
  getRunaSearchProvidersSettings,
  saveRunaSearchProvidersSettings,
  type RunaSearchProvidersSettings,
} from "../../../lib/runa/site-settings";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = getDb(context.env);
  const settings = await getRunaSearchProvidersSettings(db);
  return Response.json({ settings });
};

interface PatchBody {
  settings?: RunaSearchProvidersSettings;
}

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  let body: PatchBody;
  try {
    body = await context.request.json<PatchBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }
  if (!body.settings) {
    return jsonError("settings が必要です", 400);
  }

  const db = getDb(context.env);
  await saveRunaSearchProvidersSettings(db, body.settings);
  const settings = await getRunaSearchProvidersSettings(db);
  return Response.json({ ok: true, settings });
};
