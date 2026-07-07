/**
 * Google カレンダー購読用カレンダー一覧 API
 */

import type { Env } from "../../lib/types";
import { getDb } from "../../lib/db";
import { requireUser } from "../../lib/auth";
import { jsonError } from "../../lib/types";
import { listSubscribableGoogleCalendars } from "../../lib/schedule";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireUser(context.request, context.env);
  if (auth instanceof Response) return auth;

  try {
    const data = await listSubscribableGoogleCalendars(
      getDb(context.env),
      context.env,
      auth.id
    );
    return Response.json(data);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "カレンダー一覧の取得に失敗しました";
    return jsonError(message, 400);
  }
};
