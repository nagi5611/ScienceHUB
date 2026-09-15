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

const DEFAULT_IMAGE_CONVERTER_PUBLIC_URL =
  "https://image-converter.harumacci94.workers.dev";

interface CompressOptions {
  maxEdge: number;
  quality: number;
}

function resolveConverterPublicUrl(env: Env): string | null {
  const configured = env.IMAGE_CONVERTER_PUBLIC_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  return DEFAULT_IMAGE_CONVERTER_PUBLIC_URL;
}

function buildPrepareForm(
  bytes: Uint8Array,
  filename: string,
  mime: SupportedImageMime,
  options: CompressOptions
): FormData {
  const copy = bytes.slice();
  const prepareName = filename.replace(/\.[^.]+$/, "") + ".jpg";
  const form = new FormData();
  form.append("file", new File([copy], prepareName, { type: mime }));
  form.append("quality", String(options.quality));
  form.append("maxEdge", String(options.maxEdge));
  return form;
}

function buildConverterHeaders(env: Env): Headers {
  const headers = new Headers();
  const secret = env.IMAGE_CONVERTER_WORKER_SECRET?.trim();
  if (secret) headers.set("X-Image-Converter-Secret", secret);
  return headers;
}

async function compressViaConverterService(
  env: Env,
  bytes: Uint8Array,
  filename: string,
  mime: SupportedImageMime,
  options: CompressOptions
): Promise<Uint8Array | null> {
  const headers = buildConverterHeaders(env);
  const attempts: Array<{ label: string; run: () => Promise<Response> }> = [];

  if (env.IMAGE_CONVERTER) {
    attempts.push({
      label: "service_binding",
      run: async () => {
        const form = buildPrepareForm(bytes, filename, mime, options);
        return env.IMAGE_CONVERTER!.fetch(
          new Request("https://image-converter/prepare", {
            method: "POST",
            headers,
            body: form,
          })
        );
      },
    });
  }

  const publicUrl = resolveConverterPublicUrl(env);
  if (publicUrl) {
    attempts.push({
      label: "public_url",
      run: async () => {
        const form = buildPrepareForm(bytes, filename, mime, options);
        return fetch(`${publicUrl}/prepare`, {
          method: "POST",
          headers,
          body: form,
        });
      },
    });
  }

  if (!attempts.length) return null;

  let lastStatus = 0;
  let lastDetail = "";

  for (const attempt of attempts) {
    try {
      const workerResponse = await attempt.run();
      if (workerResponse.ok) {
        return new Uint8Array(await workerResponse.arrayBuffer());
      }

      lastStatus = workerResponse.status;
      lastDetail = await workerResponse.text().catch(() => "");
      console.error("Runa image compress via image-converter failed", {
        transport: attempt.label,
        status: workerResponse.status,
        detail: lastDetail.slice(0, 300),
        filename,
        inputBytes: bytes.length,
      });
    } catch (error) {
      console.error("Runa image compress via image-converter threw", {
        transport: attempt.label,
        filename,
        inputBytes: bytes.length,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (lastStatus) {
    console.error("Runa image compress exhausted transports", {
      status: lastStatus,
      detail: lastDetail.slice(0, 300),
      filename,
      inputBytes: bytes.length,
    });
  }

  return null;
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

  console.warn("Runa image save: compression unavailable, storing original bytes", {
    bytes: bytes.length,
    filename,
    force,
  });
  return { bytes, mime: detectedMime };
}
