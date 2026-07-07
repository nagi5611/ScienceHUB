/**
 * スケジュール予定の更新・削除 API
 */

import type { Env } from "../../lib/types";
import { getDb } from "../../lib/db";
import { requireUser } from "../../lib/auth";
import { jsonError } from "../../lib/types";
import {
  deleteScheduleEvent,
  updateScheduleEvent,
} from "../../lib/schedule";

interface UpdateScheduleBody {
  title?: string;
  description?: string;
  event_date?: string;
  is_all_day?: boolean;
  start_time?: string | null;
  end_time?: string | null;
}

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const auth = await requireUser(context.request, context.env);
  if (auth instanceof Response) return auth;

  const eventId = context.params.id as string;
  if (!eventId) {
    return jsonError("予定 ID が不正です", 400);
  }

  let body: UpdateScheduleBody;
  try {
    body = await context.request.json<UpdateScheduleBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  try {
    const result = await updateScheduleEvent(
      getDb(context.env),
      context.env,
      auth.id,
      eventId,
      body
    );
    return Response.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "予定の更新に失敗しました";
    return jsonError(message, 400);
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const auth = await requireUser(context.request, context.env);
  if (auth instanceof Response) return auth;

  const eventId = context.params.id as string;
  if (!eventId) {
    return jsonError("予定 ID が不正です", 400);
  }

  try {
    const result = await deleteScheduleEvent(
      getDb(context.env),
      context.env,
      auth.id,
      eventId
    );
    return Response.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "予定の削除に失敗しました";
    return jsonError(message, 400);
  }
};
