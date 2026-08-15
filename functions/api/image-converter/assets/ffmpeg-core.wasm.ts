/**
 * GET /api/image-converter/assets/ffmpeg-core.wasm
 * 拡張子付き URL は [[path]] より明示ルートが確実
 */

import type { Env } from "../../../lib/types";
import { serveFfmpegPublicAsset } from "../../../lib/image-converter/ffmpeg-assets";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  return serveFfmpegPublicAsset(
    context.env,
    context.request,
    "ffmpeg-core.wasm"
  );
};
