/**
 * 3Dプリンター利用ガイドの画像・動画を R2 から配信する
 */

import type { Env } from "../../lib/types";
import { jsonError } from "../../lib/types";
import { manualUserDenied, streamManualMedia } from "../../lib/3dprintmanual-content";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const denied = await manualUserDenied(context.request, context.env);
  if (denied) return denied;

  const key = new URL(context.request.url).searchParams.get("key") ?? "";
  if (!key) return jsonError("key が必要です", 400);
  return streamManualMedia(context.request, context.env, key);
};
