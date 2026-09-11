/**
 * アプリチュートリアル動画の更新・削除（管理者）
 */

import type { Env } from "../../../../../lib/types";
import { jsonError } from "../../../../../lib/types";
import { getDb } from "../../../../../lib/db";
import {
  deleteTutorialVideo,
  moveTutorialVideo,
  updateTutorialVideo,
} from "../../../../../lib/app-tutorials";

interface PatchBody {
  title?: string;
  move?: "up" | "down";
}

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const videoId = context.params.videoId as string;

  let body: PatchBody;
  try {
    body = await context.request.json<PatchBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  try {
    if (body.move === "up" || body.move === "down") {
      const videos = await moveTutorialVideo(getDb(context.env), videoId, body.move);
      return Response.json({ videos });
    }

    const video = await updateTutorialVideo(getDb(context.env), videoId, {
      title: body.title,
    });
    if (!video) {
      return jsonError("動画が見つかりません", 404);
    }
    return Response.json({ video });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "動画の更新に失敗しました";
    return jsonError(message, 400);
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const videoId = context.params.videoId as string;
  const deleted = await deleteTutorialVideo(context.env, videoId);
  if (!deleted) {
    return jsonError("動画が見つかりません", 404);
  }
  return Response.json({ ok: true, deleted_id: videoId });
};
