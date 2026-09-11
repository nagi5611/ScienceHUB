/**
 * アプリチュートリアル動画一覧・追加（管理者）
 */

import type { Env } from "../../../../lib/types";
import { jsonError } from "../../../../lib/types";
import { getDb } from "../../../../lib/db";
import { getAppById } from "../../../../lib/apps";
import {
  createTutorialVideo,
  listTutorialVideos,
} from "../../../../lib/app-tutorials";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const appId = context.params.id as string;
  const app = await getAppById(getDb(context.env), appId);
  if (!app) {
    return jsonError("アプリが見つかりません", 404);
  }

  const videos = await listTutorialVideos(getDb(context.env), appId);
  return Response.json({ videos });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const appId = context.params.id as string;
  const app = await getAppById(getDb(context.env), appId);
  if (!app) {
    return jsonError("アプリが見つかりません", 404);
  }

  const contentType = context.request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return jsonError("multipart/form-data で送信してください", 400);
  }

  let formData: FormData;
  try {
    formData = await context.request.formData();
  } catch {
    return jsonError("フォームデータの解析に失敗しました", 400);
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return jsonError("file フィールドに動画を指定してください", 400);
  }

  const title = String(formData.get("title") ?? "").trim() || file.name.replace(/\.[^.]+$/, "");

  try {
    const video = await createTutorialVideo(context.env, appId, file, title);
    return Response.json({ video }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "動画の保存に失敗しました";
    return jsonError(message, 400);
  }
};
