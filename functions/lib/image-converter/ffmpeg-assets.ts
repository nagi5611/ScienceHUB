/**
 * ffmpeg.wasm コア — R2 上の静的アセット定義・配信
 */

import { getFiles } from "../r2";
import type { Env } from "../types";

export const FFMPEG_CORE_WASM_R2_KEY = "static/image-converter/ffmpeg/ffmpeg-core.wasm";
export const FFMPEG_CORE_MT_WASM_R2_KEY =
  "static/image-converter/ffmpeg/ffmpeg-core-mt.wasm";

/** 公開 API で配信を許可するファイル名 */
export const FFMPEG_PUBLIC_ASSETS: Record<
  string,
  { r2Key: string; contentType: string }
> = {
  "ffmpeg-core.wasm": {
    r2Key: FFMPEG_CORE_WASM_R2_KEY,
    contentType: "application/wasm",
  },
  "ffmpeg-core-mt.wasm": {
    r2Key: FFMPEG_CORE_MT_WASM_R2_KEY,
    contentType: "application/wasm",
  },
};

/** Pages の path パラメータをファイル名に正規化 */
export function normalizeAssetFilename(
  param: string | string[] | undefined
): string | null {
  if (!param) return null;
  const name = Array.isArray(param) ? param.join("/") : param;
  const trimmed = name.trim();
  return trimmed || null;
}

/**
 * R2 から ffmpeg 静的アセットを配信（Range リクエスト対応）
 */
export async function serveFfmpegPublicAsset(
  env: Env,
  request: Request,
  filename: string
): Promise<Response> {
  const asset = FFMPEG_PUBLIC_ASSETS[filename];
  if (!asset) {
    return new Response("Not found", { status: 404 });
  }

  const bucket = getFiles(env);
  const rangeHeader = request.headers.get("Range");

  if (rangeHeader) {
    const match = /^bytes=(\d+)-(\d*)$/i.exec(rangeHeader.trim());
    if (match) {
      const head = await bucket.head(asset.r2Key);
      if (!head) {
        return new Response("Asset not found in storage", { status: 404 });
      }

      const size = head.size;
      const start = Number(match[1]);
      if (!Number.isFinite(start) || start < 0 || start >= size) {
        return new Response(null, {
          status: 416,
          headers: { "Content-Range": `bytes */${size}` },
        });
      }

      const end =
        match[2] !== ""
          ? Math.min(Number(match[2]), size - 1)
          : size - 1;
      const length = end - start + 1;

      const object = await bucket.get(asset.r2Key, {
        range: { offset: start, length },
      });
      if (!object) {
        return new Response("Asset not found in storage", { status: 404 });
      }

      const headers = new Headers();
      headers.set("Content-Type", asset.contentType);
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
      headers.set("Accept-Ranges", "bytes");
      headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
      headers.set("Content-Length", String(length));
      object.writeHttpMetadata(headers);

      return new Response(object.body, { status: 206, headers });
    }
  }

  const object = await bucket.get(asset.r2Key);
  if (!object) {
    return new Response("Asset not found in storage", { status: 404 });
  }

  const headers = new Headers();
  headers.set("Content-Type", asset.contentType);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("Accept-Ranges", "bytes");
  object.writeHttpMetadata(headers);

  return new Response(object.body, { headers });
}
