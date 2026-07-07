/**
 * Google カレンダー連携設定 API（管理者）
 */

import type { Env } from "../../lib/types";
import { jsonError } from "../../lib/types";
import { getDb } from "../../lib/db";
import {
  getAdminGoogleCalendarStatus,
  updateHubCalendarSettings,
} from "../../lib/google-calendar";

interface PatchGoogleCalendarBody {
  all_groups_calendar_id?: string | null;
  all_groups_calendar_name?: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const status = await getAdminGoogleCalendarStatus(
    getDb(context.env),
    context.env
  );
  return Response.json(status);
};

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  let body: PatchGoogleCalendarBody;
  try {
    body = await context.request.json<PatchGoogleCalendarBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  if (
    body.all_groups_calendar_id === undefined &&
    body.all_groups_calendar_name === undefined
  ) {
    return jsonError("更新する項目を指定してください", 400);
  }

  try {
    const status = await updateHubCalendarSettings(
      getDb(context.env),
      context.env,
      {
        all_groups_calendar_id: body.all_groups_calendar_id,
        all_groups_calendar_name: body.all_groups_calendar_name,
      }
    );
    return Response.json(status);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "設定の更新に失敗しました";
    return jsonError(message, 400);
  }
};
