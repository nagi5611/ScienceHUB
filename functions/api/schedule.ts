/**
 * スケジュール API（ダッシュボードカレンダー）
 */

import type { Env } from "../lib/types";
import { getDb } from "../lib/db";
import { requireUser } from "../lib/auth";
import { jsonError } from "../lib/types";
import {
  createScheduleEvent,
  listScheduleEvents,
} from "../lib/schedule";

interface CreateScheduleBody {
  title?: string;
  description?: string;
  group_id?: string;
  event_date?: string;
  is_all_day?: boolean;
  start_time?: string | null;
  end_time?: string | null;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireUser(context.request, context.env);
  if (auth instanceof Response) return auth;

  const url = new URL(context.request.url);
  const from = url.searchParams.get("from") ?? "";
  const to = url.searchParams.get("to") ?? "";
  const scopeParam = url.searchParams.get("scope") ?? "mine";
  const scope = scopeParam === "all" ? "all" : "mine";

  if (!from || !to) {
    return jsonError("from と to を指定してください", 400);
  }

  try {
    const data = await listScheduleEvents(
      getDb(context.env),
      context.env,
      auth.id,
      from,
      to,
      scope
    );
    return Response.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "スケジュールの取得に失敗しました";
    return jsonError(message, 400);
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const auth = await requireUser(context.request, context.env);
  if (auth instanceof Response) return auth;

  let body: CreateScheduleBody;
  try {
    body = await context.request.json<CreateScheduleBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  const title = body.title?.trim() ?? "";
  const groupId = body.group_id?.trim() ?? "";
  const eventDate = body.event_date?.trim() ?? "";

  if (!title || !groupId || !eventDate) {
    return jsonError("タイトル・グループ・日付を入力してください", 400);
  }

  try {
    const { event, sync_warnings } = await createScheduleEvent(
      getDb(context.env),
      context.env,
      auth.id,
      {
        title,
        description: body.description,
        group_id: groupId,
        event_date: eventDate,
        is_all_day: body.is_all_day !== false,
        start_time: body.start_time,
        end_time: body.end_time,
      }
    );
    return Response.json({ event, sync_warnings }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "予定の追加に失敗しました";
    return jsonError(message, 400);
  }
};
