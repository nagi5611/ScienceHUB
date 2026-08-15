/**
 * Cloudflare Images binding による HEIC / TIFF / RAW 等の変換
 */

import type { Env } from "../types";

export const IMAGE_CONVERTER_APP_SLUG = "image-converter";

/** Images binding の入力上限（公式: 20MB） */
export const MAX_SERVER_CONVERT_BYTES = 20 * 1024 * 1024;

/** サーバー変換対象の拡張子 */
export const SERVER_CONVERT_EXTENSIONS = new Set([
  "heic",
  "heif",
  "hif",
  "tiff",
  "tif",
  "raw",
  "cr2",
  "nef",
  "arw",
  "dng",
  "orf",
  "rw2",
]);

export type ServerOutputFormat = "jpeg" | "png" | "webp" | "avif";

const OUTPUT_MIME: Record<ServerOutputFormat, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
};

/** ファイル名から拡張子を取得 */
export function getFileExtension(filename: string): string {
  const base = filename.split(/[/\\]/).pop() ?? "";
  const dot = base.lastIndexOf(".");
  if (dot < 1) return "";
  return base.slice(dot + 1).toLowerCase();
}

/** サーバー変換対象か */
export function isServerConvertFile(
  filename: string,
  mimeType = ""
): boolean {
  const ext = getFileExtension(filename);
  if (SERVER_CONVERT_EXTENSIONS.has(ext)) return true;
  const mime = mimeType.toLowerCase();
  return (
    mime === "image/heic" ||
    mime === "image/heif" ||
    mime === "image/tiff" ||
    mime === "image/x-tiff"
  );
}

/** 出力形式を検証 */
export function parseServerOutputFormat(
  value: string
): ServerOutputFormat | null {
  if (value === "jpeg" || value === "png" || value === "webp" || value === "avif") {
    return value;
  }
  return null;
}

/** 出力 MIME を返す */
export function getServerOutputMime(format: ServerOutputFormat): string {
  return OUTPUT_MIME[format];
}

type ImageOutputOptions = {
  format: string;
  quality?: number;
  anim?: boolean;
};

type ImageTransformOptions = {
  width?: number;
  height?: number;
  fit?: "scale-down" | "contain" | "cover" | "crop" | "pad";
};

type ImageTransformPipeline = {
  transform(options: ImageTransformOptions): ImageTransformPipeline;
  output(options: ImageOutputOptions): { response(): Response };
};

type ImagesBinding = {
  input(stream: ReadableStream): ImageTransformPipeline;
};

type ImagesEnv = Pick<Env, never> & { IMAGES?: ImagesBinding };

/** Cloudflare Images で画像を変換 */
export async function transformWithCloudflareImages(
  env: ImagesEnv,
  stream: ReadableStream,
  options: {
    format: ServerOutputFormat;
    quality: number;
    maxEdge: number;
  }
): Promise<Response> {
  const images = env.IMAGES as ImagesBinding | undefined;
  if (!images) {
    throw new Error("Images binding が設定されていません");
  }

  let pipeline = images.input(stream);
  if (options.maxEdge > 0) {
    pipeline = pipeline.transform({
      width: options.maxEdge,
      height: options.maxEdge,
      fit: "scale-down",
    });
  }

  const outputOptions: ImageOutputOptions = {
    format: OUTPUT_MIME[options.format],
    anim: false,
  };
  if (options.format !== "png") {
    outputOptions.quality = Math.min(100, Math.max(40, options.quality));
  }

  return pipeline.output(outputOptions).response();
}
