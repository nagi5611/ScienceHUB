/**
 * Microsoft Office Online 埋め込みプレビュー
 */

import type { Env } from "../types";
import { getFiles } from "../r2";
import { isR2PresignConfigured, presignGetObject } from "../r2-presign";
import { OFFICE_PRESIGN_EXPIRES_SEC, OFFICE_PREVIEW_MAX_BYTES } from "./constants";
import { toR2Key, buildLogicalPath, parseLogicalPath, type ParsedStoragePath } from "./keys";
import { getFileMeta } from "./meta";
import { createOfficePreviewToken, verifyOfficePreviewToken } from "./office-preview-token";

const OFFICE_EXTENSIONS = new Set([
  "doc",
  "docx",
  "dot",
  "dotx",
  "xls",
  "xlsx",
  "xlsm",
  "xlsb",
  "ppt",
  "pptx",
  "pps",
  "ppsx",
  "potx",
  "odt",
  "ods",
  "odp",
]);

const OFFICE_MIME_TYPES: Record<string, string> = {
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  dot: "application/msword",
  dotx: "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  xlsm: "application/vnd.ms-excel.sheet.macroEnabled.12",
  xlsb: "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  pps: "application/vnd.ms-powerpoint",
  ppsx: "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
  potx: "application/vnd.openxmlformats-officedocument.presentationml.template",
  odt: "application/vnd.oasis.opendocument.text",
  ods: "application/vnd.oasis.opendocument.spreadsheet",
  odp: "application/vnd.oasis.opendocument.presentation",
};

const OFFICE_EMBED_BASE = "https://view.officeapps.live.com/op/embed.aspx";

export function getOfficePreviewExtension(filename: string): string | null {
  const lower = filename.toLowerCase();
  const dot = lower.lastIndexOf(".");
  if (dot <= 0) return null;
  const ext = lower.slice(dot + 1);
  return OFFICE_EXTENSIONS.has(ext) ? ext : null;
}

export function isOfficePreviewableFilename(filename: string): boolean {
  return getOfficePreviewExtension(filename) !== null;
}

export function getOfficeMimeType(filename: string): string {
  const ext = getOfficePreviewExtension(filename);
  if (!ext) return "application/octet-stream";
  return OFFICE_MIME_TYPES[ext] ?? "application/octet-stream";
}

export function buildOfficeEmbedUrl(fileUrl: string): string {
  return `${OFFICE_EMBED_BASE}?src=${encodeURIComponent(fileUrl)}`;
}

function isLocalOrigin(origin: string): boolean {
  try {
    const host = new URL(origin).hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
  } catch {
    return true;
  }
}

function buildInlineDisposition(filename: string): string {
  const asciiName = filename.replace(/[^\x20-\x7E]/g, "_");
  return `inline; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

/** Office Online が取得する公開ファイル URL を発行 */
async function createPublicFileUrl(
  env: Env,
  requestUrl: URL,
  parsed: ParsedStoragePath,
  filename: string
): Promise<{ url: string; expiresIn: number }> {
  const r2Key = toR2Key(parsed.rootType, parsed.rootKey, parsed.relativePath);
  const mimeType = getOfficeMimeType(filename);
  const disposition = buildInlineDisposition(filename);

  if (isR2PresignConfigured(env)) {
    const url = await presignGetObject(env, r2Key, {
      expiresSec: OFFICE_PRESIGN_EXPIRES_SEC,
      responseContentType: mimeType,
      responseContentDisposition: disposition,
    });
    return { url, expiresIn: OFFICE_PRESIGN_EXPIRES_SEC };
  }

  const storagePath = buildLogicalPath(parsed.rootType, parsed.rootKey, parsed.relativePath);
  const token = await createOfficePreviewToken(env, storagePath);
  const fileUrl = new URL("/api/storage/preview/office-file", requestUrl.origin);
  fileUrl.searchParams.set("t", token);
  return { url: fileUrl.toString(), expiresIn: OFFICE_PRESIGN_EXPIRES_SEC };
}

async function resolveFileSize(
  env: Env,
  parsed: ParsedStoragePath,
  objectSize: number | null
): Promise<number | null> {
  const meta = await getFileMeta(env, parsed.rootType, parsed.rootKey, parsed.relativePath);
  return meta?.sizeBytes ?? objectSize;
}

export interface OfficePreviewInfo {
  mode: "office";
  embedUrl: string;
  expiresIn: number;
  sizeBytes: number | null;
  sizeWarning: boolean;
  privacyNotice: string;
}

/** 認証済みユーザー向け Office 埋め込み URL を生成 */
export async function getOfficePreviewInfo(
  env: Env,
  requestUrl: URL,
  parsed: ParsedStoragePath
): Promise<OfficePreviewInfo> {
  const filename = parsed.relativePath.split("/").pop() ?? "";
  if (!isOfficePreviewableFilename(filename)) {
    throw new Error("この形式は Office プレビューに対応していません");
  }

  if (isLocalOrigin(requestUrl.origin)) {
    throw new Error(
      "Office プレビューは localhost では利用できません。HTTPS の公開 URL でアクセスしてください"
    );
  }

  const sizeBytes = await resolveFileSize(env, parsed, null);
  if (sizeBytes != null && sizeBytes > OFFICE_PREVIEW_MAX_BYTES) {
    throw new Error(
      `Office プレビューは ${Math.floor(OFFICE_PREVIEW_MAX_BYTES / (1024 * 1024))} MB 以下のファイルに対応しています`
    );
  }

  const { url, expiresIn } = await createPublicFileUrl(env, requestUrl, parsed, filename);
  const embedUrl = buildOfficeEmbedUrl(url);

  return {
    mode: "office",
    embedUrl,
    expiresIn,
    sizeBytes,
    sizeWarning: sizeBytes != null && sizeBytes > 8 * 1024 * 1024,
    privacyNotice:
      "表示は Microsoft Office Online 経由です。ファイルは Microsoft のサーバーから取得されます。",
  };
}

/** Office Online 向けの公開ファイルストリーム（トークン認証） */
export async function streamOfficePreviewFile(
  env: Env,
  token: string
): Promise<Response> {
  const storagePath = await verifyOfficePreviewToken(env, token);
  if (!storagePath) {
    return new Response("Invalid or expired token", { status: 403 });
  }

  const parsed = parseLogicalPath(storagePath);
  if (!parsed?.relativePath) {
    return new Response("Invalid path", { status: 400 });
  }

  const filename = parsed.relativePath.split("/").pop() ?? "file";
  if (!isOfficePreviewableFilename(filename)) {
    return new Response("Unsupported file type", { status: 400 });
  }

  const bucket = getFiles(env);
  const r2Key = toR2Key(parsed.rootType, parsed.rootKey, parsed.relativePath);
  const obj = await bucket.get(r2Key);
  if (!obj) {
    return new Response("Not found", { status: 404 });
  }

  const mimeType =
    obj.httpMetadata?.contentType && obj.httpMetadata.contentType !== "application/octet-stream"
      ? obj.httpMetadata.contentType
      : getOfficeMimeType(filename);

  return new Response(obj.body, {
    headers: {
      "Content-Type": mimeType,
      "Content-Disposition": buildInlineDisposition(filename),
      "Cache-Control": "private, max-age=60",
    },
  });
}
