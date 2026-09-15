/**
 * Runa — 編集 API / ストレージ向け画像圧縮（image-converter Worker 経由）
 */

import type { Env } from "../types";
import {
  EDIT_IMAGE_MAX_EDGE_PX,
  detectImageMimeFromBytes,
  type SupportedImageMime,
} from "./image-bytes";

/** 圧縮なしで編集 API に渡せる参照画像の上限（生バイト） */
export const EDIT_IMAGE_MAX_REFERENCE_BYTES = 1_500_000;
/** 保存時に JPEG へ圧縮する閾値（生バイト） */
export const EDIT_IMAGE_STORE_COMPRESS_THRESHOLD_BYTES = 512 * 1024;

interface CompressOptions {
  maxEdge: number;
  quality: number;
}

async function compressViaConverterService(
  env: Env,
  bytes: Uint8Array,
  filename: string,
  mime: SupportedImageMime,
  options: CompressOptions
): Promise<Uint8Array | null> {
  if (!env.IMAGE_CONVERTER) return null;

  const form = new FormData();
  form.append("file", new File([bytes], filename, { type: mime }));
  form.append("quality", String(options.quality));
  form.append("maxEdge", String(options.maxEdge));

  const headers = new Headers();
  const secret = env.IMAGE_CONVERTER_WORKER_SECRET?.trim();
  if (secret) headers.set("X-Image-Converter-Secret", secret);

  const workerResponse = await env.IMAGE_CONVERTER.fetch(
    new Request("https://image-converter/prepare", {
      method: "POST",
      headers,
      body: form,
    })
  );

  if (!workerResponse.ok) {
    const detail = await workerResponse.text().catch(() => "");
    console.error("Runa image compress via IMAGE_CONVERTER failed", {
      status: workerResponse.status,
      detail: detail.slice(0, 300),
      filename,
      inputBytes: bytes.length,
    });
    return null;
  }

  return new Uint8Array(await workerResponse.arrayBuffer());
}

/** image-converter Worker で JPEG 圧縮 */
export async function compressImageToJpeg(
  env: Env,
  bytes: Uint8Array,
  filename: string,
  detectedMime: SupportedImageMime,
  options: Partial<CompressOptions> = {}
): Promise<{ bytes: Uint8Array; mime: SupportedImageMime } | null> {
  const maxEdge = options.maxEdge ?? EDIT_IMAGE_MAX_EDGE_PX;
  const quality = options.quality ?? 85;

  const viaService = await compressViaConverterService(
    env,
    bytes,
    filename,
    detectedMime,
    { maxEdge, quality }
  );
  if (!viaService) return null;

  const mime = detectImageMimeFromBytes(viaService) ?? "image/jpeg";
  return { bytes: viaService, mime };
}

/** 編集 API 向けに参照画像を圧縮（常に JPEG 化を試行） */
export async function prepareReferenceImageForEdit(
  env: Env,
  bytes: Uint8Array,
  filename: string,
  detectedMime: SupportedImageMime
): Promise<{ bytes: Uint8Array; mime: SupportedImageMime }> {
  const compressed = await compressImageToJpeg(env, bytes, filename, detectedMime, {
    maxEdge: EDIT_IMAGE_MAX_EDGE_PX,
    quality: 85,
  });

  if (compressed) {
    console.info("Runa image edit: compressed reference image", {
      beforeBytes: bytes.length,
      afterBytes: compressed.bytes.length,
      filename,
    });
    return compressed;
  }

  if (bytes.length > EDIT_IMAGE_MAX_REFERENCE_BYTES) {
    throw new Error(
      "編集用画像が大きすぎます。image-converter Worker のデプロイを確認してください"
    );
  }

  console.warn("Runa image edit: compression unavailable, sending reference as-is", {
    bytes: bytes.length,
    filename,
  });
  return { bytes, mime: detectedMime };
}

/** ストレージ保存前に巨大 PNG/JPEG を圧縮 */
export async function prepareGeneratedImageForStorage(
  env: Env,
  bytes: Uint8Array,
  filename: string,
  detectedMime: SupportedImageMime,
  force = false
): Promise<{ bytes: Uint8Array; mime: SupportedImageMime }> {
  if (
    !force &&
    bytes.length <= EDIT_IMAGE_STORE_COMPRESS_THRESHOLD_BYTES &&
    detectedMime === "image/jpeg"
  ) {
    return { bytes, mime: detectedMime };
  }

  const compressed = await compressImageToJpeg(env, bytes, filename, detectedMime, {
    maxEdge: EDIT_IMAGE_MAX_EDGE_PX,
    quality: 90,
  });

  if (compressed) {
    console.info("Runa image save: compressed generated image", {
      beforeBytes: bytes.length,
      afterBytes: compressed.bytes.length,
      filename,
    });
    return compressed;
  }

  return { bytes, mime: detectedMime };
}
