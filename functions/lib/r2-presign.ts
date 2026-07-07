/**
 * R2 S3 互換 API 向け presigned URL 生成
 */

import { AwsClient } from "aws4fetch";
import type { Env } from "./types";
import { PRESIGN_EXPIRES_SEC } from "./storage/constants";

export const R2_BUCKET_DEFAULT = "sciencehub-files";

/** R2 直アップロード用の S3 認証情報が揃っているか */
export function isR2PresignConfigured(env: Env): boolean {
  return Boolean(
    env.R2_ACCESS_KEY_ID?.trim() &&
      env.R2_SECRET_ACCESS_KEY?.trim() &&
      env.R2_ACCOUNT_ID?.trim()
  );
}

function getBucketName(env: Env): string {
  return env.R2_BUCKET_NAME?.trim() || R2_BUCKET_DEFAULT;
}

function createAwsClient(env: Env): AwsClient {
  return new AwsClient({
    accessKeyId: env.R2_ACCESS_KEY_ID!.trim(),
    secretAccessKey: env.R2_SECRET_ACCESS_KEY!.trim(),
  });
}

/** R2 オブジェクト URL（パスセグメントをエンコード） */
function r2ObjectUrl(env: Env, key: string): URL {
  const accountId = env.R2_ACCOUNT_ID!.trim();
  const bucket = getBucketName(env);
  const encodedKey = key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return new URL(
    `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${encodedKey}`
  );
}

/** オブジェクト PUT 用 presigned URL */
export async function presignPutObject(
  env: Env,
  key: string,
  options: {
    expiresSec?: number;
    query?: Record<string, string>;
  } = {}
): Promise<string> {
  if (!isR2PresignConfigured(env)) {
    throw new Error("R2 直アップロードが設定されていません");
  }

  const client = createAwsClient(env);
  const url = r2ObjectUrl(env, key);
  const expiresSec = options.expiresSec ?? PRESIGN_EXPIRES_SEC;
  url.searchParams.set("X-Amz-Expires", String(expiresSec));
  for (const [name, value] of Object.entries(options.query ?? {})) {
    url.searchParams.set(name, value);
  }

  const signed = await client.sign(url.toString(), {
    method: "PUT",
    aws: { signQuery: true },
  });
  return signed.url;
}

/** オブジェクト GET 用 presigned URL */
export async function presignGetObject(
  env: Env,
  key: string,
  options: {
    expiresSec?: number;
    responseContentType?: string;
    responseContentDisposition?: string;
  } = {}
): Promise<string> {
  if (!isR2PresignConfigured(env)) {
    throw new Error("R2 直ダウンロードが設定されていません");
  }

  const client = createAwsClient(env);
  const url = r2ObjectUrl(env, key);
  const expiresSec = options.expiresSec ?? PRESIGN_EXPIRES_SEC;
  url.searchParams.set("X-Amz-Expires", String(expiresSec));
  if (options.responseContentType) {
    url.searchParams.set("response-content-type", options.responseContentType);
  }
  if (options.responseContentDisposition) {
    url.searchParams.set("response-content-disposition", options.responseContentDisposition);
  }

  const signed = await client.sign(url.toString(), {
    method: "GET",
    aws: { signQuery: true },
  });
  return signed.url;
}

function normalizePartEtag(etag: string): string {
  const trimmed = etag.trim();
  if (!trimmed) {
    throw new Error("ETag が空です");
  }
  if (trimmed.startsWith('"') || trimmed.startsWith("W/")) {
    return trimmed;
  }
  return `"${trimmed}"`;
}

function buildCompleteMultipartXml(parts: Array<{ partNumber: number; etag: string }>): string {
  const partsXml = [...parts]
    .sort((a, b) => a.partNumber - b.partNumber)
    .map(
      (part) =>
        `<Part><PartNumber>${part.partNumber}</PartNumber><ETag>${normalizePartEtag(part.etag)}</ETag></Part>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><CompleteMultipartUpload xmlns="http://s3.amazonaws.com/doc/2006-03-01/">${partsXml}</CompleteMultipartUpload>`;
}

/** S3 API でマルチパート完了（presigned パートアップロード用） */
export async function completeMultipartUploadViaS3(
  env: Env,
  key: string,
  uploadId: string,
  parts: Array<{ partNumber: number; etag: string }>
): Promise<void> {
  if (!isR2PresignConfigured(env)) {
    throw new Error("R2 直アップロードが設定されていません");
  }

  const bucket = getBucketName(env);
  const accountId = env.R2_ACCOUNT_ID!.trim();
  const encodedKey = key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const url = new URL(
    `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${encodedKey}`
  );
  url.searchParams.set("uploadId", uploadId);

  const body = buildCompleteMultipartXml(parts);
  const client = createAwsClient(env);
  const signed = await client.sign(
    new Request(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body,
    })
  );

  const response = await fetch(signed);
  if (!response.ok) {
    const text = await response.text();
    const compact = text.replace(/\s+/g, " ").slice(0, 300);
    throw new Error(
      compact.includes("10025") || compact.includes("InvalidPart")
        ? "マルチパートの完了に失敗しました（パートが R2 に登録されていないか ETag が一致しません）"
        : `マルチパートの完了に失敗しました: ${compact}`
    );
  }
}
