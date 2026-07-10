/**
 * お知らせ一覧・作成 API（管理者）
 */

import type { Env } from "../../lib/types";
import { jsonError } from "../../lib/types";
import { getDb } from "../../lib/db";
import {
  createAnnouncement,
  dateInputToPublishedAt,
  listAnnouncements,
} from "../../lib/announcements";

interface CreateAnnouncementBody {
  body?: string;
  published_date?: string;
  is_published?: boolean;
  position?: number;
  group_ids?: string[];
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const announcements = await listAnnouncements(getDb(context.env));
  return Response.json({ announcements });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: CreateAnnouncementBody;
  try {
    body = await context.request.json<CreateAnnouncementBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  if (!body.published_date?.trim()) {
    return jsonError("掲載日を入力してください", 400);
  }

  try {
    const announcement = await createAnnouncement(getDb(context.env), {
      body: body.body ?? "",
      published_at: dateInputToPublishedAt(body.published_date),
      is_published: body.is_published,
      position: body.position,
      group_ids: Array.isArray(body.group_ids) ? body.group_ids : [],
    });
    return Response.json({ announcement }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "お知らせの作成に失敗しました";
    return jsonError(message, 400);
  }
};
