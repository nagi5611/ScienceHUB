/**
 * 3Dプリンター利用ガイドの画像・動画（20MB以下）を R2 に保存する
 */

import type { Env } from "../../lib/types";
import { jsonError } from "../../lib/types";
import { getFiles } from "../../lib/r2";
import {
  MANUAL_SIMPLE_MAX,
  createManualMediaKey,
  manualAdminDenied,
  manualContentType,
  manualMediaUrl,
} from "../../lib/3dprintmanual-content";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const denied = await manualAdminDenied(context.request, context.env);
  if (denied) return denied;

  const contentType = context.request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return jsonError("multipart/form-data で送信してください", 400);
  }

  let form: FormData;
  try {
    form = await context.request.formData();
  } catch {
    return jsonError("フォームデータの解析に失敗しました", 400);
  }

  const file = form.get("file");
  if (!(file instanceof File)) return jsonError("file を指定してください", 400);

  const type = manualContentType(file.name);
  if (!type) {
    return jsonError("対応形式は JPEG / PNG / WebP / GIF / MP4 / WebM / MOV です", 400);
  }
  if (file.size <= 0 || file.size > MANUAL_SIMPLE_MAX) {
    return jsonError("20MBを超えるファイルは分割アップロードを使ってください", 400);
  }

  const key = createManualMediaKey(file.name);
  try {
    await getFiles(context.env).put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: type },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "アップロードに失敗しました";
    return jsonError(message, 500);
  }

  return Response.json({ key, url: manualMediaUrl(key) }, { status: 201 });
};
