/**
 * image-converter 用 R2 静的アセット（ffmpeg-core.wasm 等）
 * Pages 25MiB 制限を避けるため wasm は R2 から配信
 */

import type { Env } from "../../../lib/types";
import {
  normalizeAssetFilename,
  serveFfmpegPublicAsset,
} from "../../../lib/image-converter/ffmpeg-assets";

/** GET /api/image-converter/assets/:filename */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const filename = normalizeAssetFilename(context.params.path);
  if (!filename) {
    return new Response("Not found", { status: 404 });
  }

  return serveFfmpegPublicAsset(context.env, context.request, filename);
};
