/**
 * お知らせ API（ログインユーザー向け）
 */

import type { Env } from "../lib/types";
import { getDb } from "../lib/db";
import { requireUser } from "../lib/auth";
import { listPublishedAnnouncements } from "../lib/announcements";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireUser(context.request, context.env);
  if (auth instanceof Response) return auth;

  const announcements = await listPublishedAnnouncements(getDb(context.env));
  return Response.json({ announcements });
};
