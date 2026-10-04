/**
 * Q&A 添付ファイルの単純アップロード（20MB 以下）
 */

import type { Env } from "../../../lib/types";
import { jsonError } from "../../../lib/types";
import { getFiles } from "../../../lib/r2";
import {
  MANUAL_SIMPLE_MAX,
  createManualQaMediaKey,
  manualAppDenied,
  manualContentType,
  manualMediaUrl,
} from "../../../lib/3dprintmanual-content";
import { requireUser } from "../../../lib/auth";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const denied = await manualAppDenied(context.request, context.env);
  if (denied) return denied;

  const auth = await requireUser(context.request, context.env);
  if (auth instanceof Response) return auth;

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
    return jsonError("20MBを超えるファイルはアップロードできません", 400);
  }

  const questionId = form.get("questionId");
  const qid =
    typeof questionId === "string" && questionId.startsWith("mq_")
      ? questionId
      : undefined;

  const key = createManualQaMediaKey(auth.id, file.name, qid);
  try {
    await getFiles(context.env).put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: type },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "アップロードに失敗しました";
    return jsonError(message, 500);
  }

  return Response.json(
    { key, url: manualMediaUrl(key), contentType: type, sizeBytes: file.size },
    { status: 201 }
  );
};
