/**
 * お知らせ詳細 API（管理者）
 */

import type { Env } from "../../../lib/types";
import { jsonError } from "../../../lib/types";
import { getDb } from "../../../lib/db";
import {
  dateInputToPublishedAt,
  deleteAnnouncement,
  getAnnouncementById,
  updateAnnouncement,
} from "../../../lib/announcements";

interface UpdateAnnouncementBody {
  body?: string;
  published_date?: string;
  is_published?: boolean;
  position?: number;
  group_ids?: string[];
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const id = context.params.id as string;
  const announcement = await getAnnouncementById(getDb(context.env), id);
  if (!announcement) {
    return jsonError("お知らせが見つかりません", 404);
  }
  return Response.json({ announcement });
};

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const id = context.params.id as string;

  let body: UpdateAnnouncementBody;
  try {
    body = await context.request.json<UpdateAnnouncementBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  try {
    const announcement = await updateAnnouncement(getDb(context.env), id, {
      body: body.body,
      published_at:
        body.published_date !== undefined
          ? dateInputToPublishedAt(body.published_date)
          : undefined,
      is_published: body.is_published,
      position: body.position,
      group_ids:
        body.group_ids !== undefined && Array.isArray(body.group_ids)
          ? body.group_ids
          : undefined,
    });

    if (!announcement) {
      return jsonError("お知らせが見つかりません", 404);
    }

    return Response.json({ announcement });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "お知らせの更新に失敗しました";
    return jsonError(message, 400);
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const id = context.params.id as string;

  try {
    await deleteAnnouncement(getDb(context.env), id);
    return Response.json({ ok: true, deleted_id: id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "お知らせの削除に失敗しました";
    return jsonError(message, 400);
  }
};
