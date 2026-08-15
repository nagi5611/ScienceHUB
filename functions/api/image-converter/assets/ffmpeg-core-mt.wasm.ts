/**
 * GET /api/image-converter/assets/ffmpeg-core-mt.wasm
 */

import type { Env } from "../../../lib/types";
import { serveFfmpegPublicAsset } from "../../../lib/image-converter/ffmpeg-assets";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  return serveFfmpegPublicAsset(
    context.env,
    context.request,
    "ffmpeg-core-mt.wasm",
  );
};
