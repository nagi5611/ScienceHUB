/**
 * 3Dプリンター利用ガイドの分割アップロード（1パート）
 */

import type { Env } from "../../../lib/types";
import { jsonError } from "../../../lib/types";
import { getFiles } from "../../../lib/r2";
import {
  MANUAL_PART_SIZE,
  isManualMediaKey,
  manualAdminDenied,
} from "../../../lib/3dprintmanual-content";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const denied = await manualAdminDenied(context.request, context.env);
  if (denied) return denied;

  const key = context.request.headers.get("X-R2-Key") ?? "";
  const uploadId = context.request.headers.get("X-Upload-Id") ?? "";
  const partNumber = Number(context.request.headers.get("X-Part-Number"));
  if (!isManualMediaKey(key) || !uploadId || uploadId.length > 2000) {
    return jsonError("アップロード指定が不正です", 400);
  }
  if (!Number.isInteger(partNumber) || partNumber < 1 || partNumber > 10000) {
    return jsonError("パート番号が不正です", 400);
  }

  const body = await context.request.arrayBuffer();
  if (body.byteLength <= 0 || body.byteLength > MANUAL_PART_SIZE) {
    return jsonError("パートのサイズが不正です", 400);
  }

  try {
    const multipart = getFiles(context.env).resumeMultipartUpload(key, uploadId);
    const uploaded = await multipart.uploadPart(partNumber, body);
    return Response.json({
      part: { partNumber: uploaded.partNumber, etag: uploaded.etag },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "パートの送信に失敗しました";
    return jsonError(message, 500);
  }
};
