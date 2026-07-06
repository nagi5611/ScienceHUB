/**
 * 管理者 API ミドルウェア
 */

import type { Env } from "../../lib/types";
import { requireAdmin } from "../../lib/auth";

export const onRequest: PagesFunction<Env> = async (context) => {
  const result = await requireAdmin(context.request, context.env);
  if (result instanceof Response) {
    return result;
  }

  context.data.user = result;
  return context.next();
};
