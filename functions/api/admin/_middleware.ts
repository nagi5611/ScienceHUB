/**
 * 管理者 API ミドルウェア（セッション認証）
 */

import type { Env } from "../../lib/types";
import {
  isPublicAdminApiPath,
  requireAdminSession,
} from "../../lib/admin-session";

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  if (isPublicAdminApiPath(url.pathname, context.request.method)) {
    return context.next();
  }

  const result = await requireAdminSession(context.request, context.env);
  if (result instanceof Response) {
    return result;
  }

  return context.next();
};
