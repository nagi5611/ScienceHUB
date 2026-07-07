/**
 * Google 直書き予定の更新・削除 API
 */

import type { Env } from "../../lib/types";
import { getDb } from "../../lib/db";
import { requireUser } from "../../lib/auth";
import { jsonError } from "../../lib/types";
import {
  deleteGoogleScheduleEvent,
  updateGoogleScheduleEvent,
} from "../../lib/schedule";

interface UpdateGoogleScheduleBody {
  calendar_id?: string;
  google_event_id?: string;
  title?: string;
  description?: string;
  event_date?: string;
  is_all_day?: boolean;
  start_time?: string | null;
  end_time?: string | null;
}

interface DeleteGoogleScheduleBody {
  calendar_id?: string;
  google_event_id?: string;
}

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const auth = await requireUser(context.request, context.env);
  if (auth instanceof Response) return auth;

  let body: UpdateGoogleScheduleBody;
  try {
    body = await context.request.json<UpdateGoogleScheduleBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  try {
    const result = await updateGoogleScheduleEvent(
      getDb(context.env),
      context.env,
      auth.id,
      {
        calendar_id: body.calendar_id ?? "",
        google_event_id: body.google_event_id ?? "",
        title: body.title,
        description: body.description,
        event_date: body.event_date,
        is_all_day: body.is_all_day,
        start_time: body.start_time,
        end_time: body.end_time,
      }
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

  let body: DeleteGoogleScheduleBody;
  try {
    body = await context.request.json<DeleteGoogleScheduleBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  try {
    const result = await deleteGoogleScheduleEvent(
      getDb(context.env),
      context.env,
      auth.id,
      body.calendar_id ?? "",
      body.google_event_id ?? ""
    );
    return Response.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "予定の削除に失敗しました";
    return jsonError(message, 400);
  }
};
