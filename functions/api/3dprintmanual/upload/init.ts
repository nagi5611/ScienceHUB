/**
 * 3Dプリンター利用ガイドの大きい動画向け分割アップロード開始
 */

import type { Env } from "../../../lib/types";
import { jsonError } from "../../../lib/types";
import { getFiles } from "../../../lib/r2";
import {
  MANUAL_MAX_BYTES,
  MANUAL_PART_SIZE,
  MANUAL_SIMPLE_MAX,
  createManualMediaKey,
  manualEditorDenied,
  manualContentType,
} from "../../../lib/3dprintmanual-content";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const denied = await manualEditorDenied(context.request, context.env);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return jsonError("JSON を読み取れませんでした", 400);
  }
  if (!body || typeof body !== "object") return jsonError("形式が不正です", 400);

  const filename = String((body as { filename?: unknown }).filename ?? "");
  const size = Number((body as { size?: unknown }).size);
  const type = manualContentType(filename);
  if (!type) {
    return jsonError("対応形式は JPEG / PNG / WebP / GIF / MP4 / WebM / MOV です", 400);
  }
  if (!Number.isFinite(size) || size <= MANUAL_SIMPLE_MAX || size > MANUAL_MAX_BYTES) {
    return jsonError("分割アップロードは 20MB超、512MB以下のファイルです", 400);
  }

  const key = createManualMediaKey(filename);
  try {
    const multipart = await getFiles(context.env).createMultipartUpload(key, {
      httpMetadata: { contentType: type },
    });
    return Response.json({
      key,
      uploadId: multipart.uploadId,
      partSize: MANUAL_PART_SIZE,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "アップロードを開始できませんでした";
    return jsonError(message, 500);
  }
};
