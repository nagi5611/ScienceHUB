/**
 * Google カレンダー連携テスト API（管理者）
 */

import type { Env } from "../../../lib/types";
import { jsonError } from "../../../lib/types";
import { getDb } from "../../../lib/db";
import {
  runGoogleCalendarTest,
  type GoogleCalendarTestKind,
} from "../../../lib/google-calendar";

interface TestGoogleCalendarBody {
  test?: string;
  calendar_id?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: TestGoogleCalendarBody;
  try {
    body = await context.request.json<TestGoogleCalendarBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  const test = body.test as GoogleCalendarTestKind | undefined;
  if (!test || !["connect", "read", "write"].includes(test)) {
    return jsonError("test は connect / read / write を指定してください", 400);
  }

  try {
    const result = await runGoogleCalendarTest(
      getDb(context.env),
      context.env,
      test,
      body.calendar_id
    );
    return Response.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "テストに失敗しました";
    return jsonError(message, 400);
  }
};
