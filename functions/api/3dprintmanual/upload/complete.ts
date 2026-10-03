/**
 * 3Dプリンター利用ガイドの分割アップロード完了
 */

import type { Env } from "../../../lib/types";
import { jsonError } from "../../../lib/types";
import { getFiles } from "../../../lib/r2";
import {
  isManualMediaKey,
  manualAdminDenied,
  manualMediaUrl,
} from "../../../lib/3dprintmanual-content";

interface UploadedPart {
  partNumber: number;
  etag: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const denied = await manualAdminDenied(context.request, context.env);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return jsonError("JSON を読み取れませんでした", 400);
  }
  if (!body || typeof body !== "object") return jsonError("形式が不正です", 400);

  const record = body as { key?: unknown; uploadId?: unknown; parts?: unknown };
  const key = typeof record.key === "string" ? record.key : "";
  const uploadId = typeof record.uploadId === "string" ? record.uploadId : "";
  if (!isManualMediaKey(key) || !uploadId || uploadId.length > 2000) {
    return jsonError("アップロード指定が不正です", 400);
  }
  const parts = parseParts(record.parts);
  if (!parts) return jsonError("パート一覧が不正です", 400);

  try {
    const multipart = getFiles(context.env).resumeMultipartUpload(key, uploadId);
    await multipart.complete(parts);
    return Response.json({ key, url: manualMediaUrl(key) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "アップロードを完了できませんでした";
    return jsonError(message, 500);
  }
};

/** 完了 API が受け取ったパート一覧を検証する */
function parseParts(value: unknown): UploadedPart[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > 10000) return null;
  const parts: UploadedPart[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const partNumber = Number((item as { partNumber?: unknown }).partNumber);
    const etag = (item as { etag?: unknown }).etag;
    if (!Number.isInteger(partNumber) || partNumber < 1) return null;
    if (typeof etag !== "string" || !etag || etag.length > 200) return null;
    parts.push({ partNumber, etag });
  }
  parts.sort((a, b) => a.partNumber - b.partNumber);
  return parts;
}
