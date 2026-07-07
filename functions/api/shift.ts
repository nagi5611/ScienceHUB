/**
 * シフト管理 API
 */

import type { Env } from "../lib/types";
import { getDb } from "../lib/db";
import { requireUser } from "../lib/auth";
import { jsonError } from "../lib/types";
import {
  listShiftAvailability,
  setShiftAvailability,
  toggleShiftAvailability,
} from "../lib/shift";

interface SetShiftBody {
  dates?: string[];
  available?: boolean;
}

interface ToggleShiftBody {
  date?: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireUser(context.request, context.env);
  if (auth instanceof Response) return auth;

  const url = new URL(context.request.url);
  const from = url.searchParams.get("from") ?? "";
  const to = url.searchParams.get("to") ?? "";

  if (!from || !to) {
    return jsonError("from と to を指定してください", 400);
  }

  try {
    const data = await listShiftAvailability(
      getDb(context.env),
      auth.id,
      from,
      to
    );
    return Response.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "シフトの取得に失敗しました";
    return jsonError(message, 400);
  }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const auth = await requireUser(context.request, context.env);
  if (auth instanceof Response) return auth;

  let body: SetShiftBody;
  try {
    body = await context.request.json<SetShiftBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  const dates = body.dates ?? [];
  if (!Array.isArray(dates) || dates.length === 0) {
    return jsonError("dates を指定してください", 400);
  }
  if (typeof body.available !== "boolean") {
    return jsonError("available を指定してください", 400);
  }

  try {
    const updated = await setShiftAvailability(
      getDb(context.env),
      auth.id,
      dates,
      body.available
    );
    return Response.json({ updated, available: body.available });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "シフトの更新に失敗しました";
    return jsonError(message, 400);
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const auth = await requireUser(context.request, context.env);
  if (auth instanceof Response) return auth;

  let body: ToggleShiftBody;
  try {
    body = await context.request.json<ToggleShiftBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  const date = body.date?.trim() ?? "";
  if (!date) {
    return jsonError("date を指定してください", 400);
  }

  try {
    const result = await toggleShiftAvailability(
      getDb(context.env),
      auth.id,
      date
    );
    return Response.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "シフトの更新に失敗しました";
    return jsonError(message, 400);
  }
};
