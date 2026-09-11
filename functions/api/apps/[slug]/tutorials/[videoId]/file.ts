/**
 * アプリチュートリアル動画の配信（R2）
 */

import type { Env } from "../../../../../lib/types";
import { jsonError } from "../../../../../lib/types";
import { getDb } from "../../../../../lib/db";
import { requireUser } from "../../../../../lib/auth";
import { canUserAccessApp, getAppBySlug } from "../../../../../lib/apps";
import {
  getTutorialVideo,
  getTutorialVideoObject,
} from "../../../../../lib/app-tutorials";

type ByteRange = { offset: number; length?: number } | { suffix: number };

/** Range ヘッダーを R2 range に変換する */
function parseRangeHeader(header: string | null): ByteRange | undefined {
  if (!header || !header.startsWith("bytes=")) return undefined;
  const spec = header.slice(6).trim();
  if (!spec || spec.includes(",")) return undefined;

  if (spec.startsWith("-")) {
    const suffix = Number(spec.slice(1));
    if (!Number.isInteger(suffix) || suffix <= 0) return undefined;
    return { suffix };
  }

  const dash = spec.indexOf("-");
  if (dash < 0) return undefined;
  const start = Number(spec.slice(0, dash));
  const endPart = spec.slice(dash + 1);
  if (!Number.isInteger(start) || start < 0) return undefined;
  if (!endPart) return { offset: start };
  const end = Number(endPart);
  if (!Number.isInteger(end) || end < start) return undefined;
  return { offset: start, length: end - start + 1 };
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireUser(context.request, context.env);
  if (auth instanceof Response) return auth;

  const slug = context.params.slug as string;
  const videoId = context.params.videoId as string;
  if (!slug || !videoId) {
    return jsonError("リクエストが不正です", 400);
  }

  const app = await getAppBySlug(getDb(context.env), slug);
  if (!app) {
    return jsonError("アプリが見つかりません", 404);
  }

  const allowed = await canUserAccessApp(getDb(context.env), auth.id, slug);
  if (!allowed) {
    return jsonError("このアプリへのアクセス権限がありません", 403);
  }

  const row = await getTutorialVideo(getDb(context.env), videoId);
  if (!row || row.app_id !== app.id) {
    return jsonError("動画が見つかりません", 404);
  }

  const range = parseRangeHeader(context.request.headers.get("Range"));
  const object = await getTutorialVideoObject(context.env, row, range);
  if (!object) {
    return jsonError("動画ファイルが見つかりません", 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Content-Type", row.content_type);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Cache-Control", "private, max-age=3600");
  headers.set(
    "Content-Disposition",
    `inline; filename*=UTF-8''${encodeURIComponent(row.filename)}`
  );

  const status = range ? 206 : 200;
  if (range && "offset" in range) {
    const length = range.length ?? Math.max(0, row.size_bytes - range.offset);
    const end = range.offset + length - 1;
    headers.set("Content-Range", `bytes ${range.offset}-${end}/${row.size_bytes}`);
    headers.set("Content-Length", String(length));
  } else if (range && "suffix" in range) {
    const length = Math.min(range.suffix, row.size_bytes);
    const start = Math.max(0, row.size_bytes - length);
    headers.set("Content-Range", `bytes ${start}-${row.size_bytes - 1}/${row.size_bytes}`);
    headers.set("Content-Length", String(length));
  }

  return new Response(object.body, { status, headers });
};
