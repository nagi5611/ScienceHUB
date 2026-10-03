/**
 * 3Dプリンター利用ガイドの本文（R2）とメディア配信
 */

import type { Env } from "./types";
import { jsonError } from "./types";
import { requireUser } from "./auth";
import { canUserAccessApp } from "./apps";
import { getDb } from "./db";
import { getFiles } from "./r2";

export const MANUAL_EDITOR_APP_SLUG = "3dprintmanual-editor";

export const MANUAL_CONTENT_KEY = "3dprintmanual/content.json";
export const MANUAL_MEDIA_PREFIX = "3dprintmanual/media/";
/** これ以下は1リクエストで保存する */
export const MANUAL_SIMPLE_MAX = 20 * 1024 * 1024;
/** R2 の非最終パートは 5MiB 以上。8MB にしておく */
export const MANUAL_PART_SIZE = 8 * 1024 * 1024;
export const MANUAL_MAX_BYTES = 512 * 1024 * 1024;

const MEDIA_KEY_RE =
  /^3dprintmanual\/media\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[A-Za-z0-9._-]{1,80}$/;

const EXT_TYPE: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

export interface ManualContent {
  version: 1;
  machines: Record<string, unknown>;
  sections: unknown[];
  checklist: string[];
  chrome: Record<string, string>;
}

/** 利用ガイド編集アプリに入れるユーザーでなければエラーレスポンスを返す */
export async function manualEditorDenied(
  request: Request,
  env: Env
): Promise<Response | null> {
  const user = await requireUser(request, env);
  if (user instanceof Response) return user;

  const allowed = await canUserAccessApp(getDb(env), user.id, MANUAL_EDITOR_APP_SLUG);
  if (!allowed) {
    return jsonError("このアプリへのアクセス権限がありません", 403);
  }
  return null;
}

/** ログインしていなければエラーレスポンスを返す */
export async function manualUserDenied(
  request: Request,
  env: Env
): Promise<Response | null> {
  const user = await requireUser(request, env);
  return user instanceof Response ? user : null;
}

/** ガイド本文の公開URLを返す */
export function manualMediaUrl(key: string): string {
  return `/api/3dprintmanual/file?key=${encodeURIComponent(key)}`;
}

/** メディア用の R2 キーを作る */
export function createManualMediaKey(filename: string): string {
  return `${MANUAL_MEDIA_PREFIX}${crypto.randomUUID()}/${sanitizeMediaName(filename)}`;
}

/** このガイドのメディアキーか判定する */
export function isManualMediaKey(key: string): boolean {
  return MEDIA_KEY_RE.test(key);
}

/** 拡張子から保存する Content-Type を返す。非対応なら null */
export function manualContentType(filename: string): string | null {
  const ext = extensionOf(filename);
  return EXT_TYPE[ext] ?? null;
}

/** R2 からガイド本文を読む。未保存なら null */
export async function readManualContent(env: Env): Promise<ManualContent | null> {
  const object = await getFiles(env).get(MANUAL_CONTENT_KEY);
  if (!object) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(await object.text());
  } catch {
    throw new Error("保存データのJSONが壊れています");
  }
  return parseManualContent(parsed);
}

/** ガイド本文を R2 に書く */
export async function writeManualContent(
  env: Env,
  content: ManualContent
): Promise<void> {
  await getFiles(env).put(MANUAL_CONTENT_KEY, JSON.stringify(content), {
    httpMetadata: { contentType: "application/json; charset=utf-8" },
  });
}

/** リクエスト JSON をガイド本文として検証する */
export function parseManualContent(value: unknown): ManualContent {
  const data = sanitizeJson(value, 0);
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("形式が不正です");
  }
  const record = data as Record<string, unknown>;
  if (record.version !== 1) throw new Error("version が不正です");
  if (!isPlainObject(record.machines)) throw new Error("machines が不正です");
  if (!Array.isArray(record.sections)) throw new Error("sections が不正です");
  if (record.sections.some((section) => !isPlainObject(section))) {
    throw new Error("section が不正です");
  }
  if (
    !Array.isArray(record.checklist) ||
    record.checklist.some((item) => typeof item !== "string")
  ) {
    throw new Error("checklist が不正です");
  }
  if (!isPlainObject(record.chrome)) throw new Error("chrome が不正です");
  const chrome: Record<string, string> = {};
  for (const [key, item] of Object.entries(record.chrome)) {
    if (!/^[A-Za-z][A-Za-z0-9]{0,40}$/.test(key)) throw new Error("chrome のキーが不正です");
    if (typeof item !== "string") throw new Error("chrome が不正です");
    chrome[key] = item;
  }
  return {
    version: 1,
    machines: record.machines,
    sections: record.sections,
    checklist: record.checklist as string[],
    chrome,
  };
}

/** ログイン済みユーザーへ R2 のメディアを返す */
export async function streamManualMedia(
  request: Request,
  env: Env,
  key: string
): Promise<Response> {
  if (!isManualMediaKey(key)) return jsonError("ファイルが見つかりません", 404);
  const bucket = getFiles(env);
  const head = await bucket.head(key);
  if (!head) return jsonError("ファイルが見つかりません", 404);

  const parsed = parseByteRange(request.headers.get("Range"), head.size);
  if (parsed === "unsatisfiable") {
    return new Response(null, {
      status: 416,
      headers: { "Content-Range": `bytes */${head.size}` },
    });
  }

  const object = parsed
    ? await bucket.get(key, { range: parsed })
    : await bucket.get(key);
  if (!object || !("body" in object)) return jsonError("ファイルが見つかりません", 404);

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Cache-Control", "private, max-age=3600");

  if (!parsed) {
    headers.set("Content-Length", String(head.size));
    return new Response(object.body, { status: 200, headers });
  }

  if ("suffix" in parsed) {
    const length = Math.min(parsed.suffix, head.size);
    const start = head.size - length;
    headers.set("Content-Range", `bytes ${start}-${head.size - 1}/${head.size}`);
    headers.set("Content-Length", String(length));
  } else {
    const length = parsed.length ?? head.size - parsed.offset;
    const end = parsed.offset + length - 1;
    headers.set("Content-Range", `bytes ${parsed.offset}-${end}/${head.size}`);
    headers.set("Content-Length", String(length));
  }
  return new Response(object.body, { status: 206, headers });
}

/** ファイル名から拡張子を取る */
function extensionOf(filename: string): string {
  const base = filename.split(/[/\\]/).pop() ?? "";
  const dot = base.lastIndexOf(".");
  return dot < 0 ? "" : base.slice(dot).toLowerCase();
}

/** R2 キーに使えるファイル名にする */
function sanitizeMediaName(filename: string): string {
  const base = filename.split(/[/\\]/).pop() ?? "file";
  const cleaned = base.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 80);
  return cleaned || "file";
}

/** プレーンオブジェクトか判定する */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

/** JSON として保存できる値だけ残す */
function sanitizeJson(value: unknown, depth: number): unknown {
  if (value === null) return null;
  if (typeof value === "string") {
    if (value.length > 20_000) throw new Error("文字列が長すぎます");
    return value;
  }
  if (typeof value === "boolean") return value;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("数値が不正です");
    return value;
  }
  if (depth > 12) throw new Error("構造が深すぎます");
  if (Array.isArray(value)) {
    if (value.length > 400) throw new Error("配列が長すぎます");
    return value.map((item) => sanitizeJson(item, depth + 1));
  }
  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length > 80) throw new Error("項目が多すぎます");
    const out: Record<string, unknown> = {};
    for (const [key, item] of entries) {
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        throw new Error("不正なキーです");
      }
      if (key.length > 80) throw new Error("キーが長すぎます");
      out[key] = sanitizeJson(item, depth + 1);
    }
    return out;
  }
  throw new Error("対応していない値です");
}

type ByteRange = { offset: number; length?: number } | { suffix: number };

/** Range ヘッダーを R2 の range に変換する */
function parseByteRange(
  header: string | null,
  size: number
): ByteRange | null | "unsatisfiable" {
  if (!header) return null;
  if (!header.startsWith("bytes=") || size <= 0) return "unsatisfiable";
  const spec = header.slice("bytes=".length).trim();
  if (!spec || spec.includes(",")) return "unsatisfiable";

  if (spec.startsWith("-")) {
    const suffix = Number(spec.slice(1));
    if (!Number.isInteger(suffix) || suffix <= 0) return "unsatisfiable";
    return { suffix: Math.min(suffix, size) };
  }

  const dash = spec.indexOf("-");
  if (dash < 0) return "unsatisfiable";
  const start = Number(spec.slice(0, dash));
  const endPart = spec.slice(dash + 1);
  if (!Number.isInteger(start) || start < 0 || start >= size) return "unsatisfiable";
  if (!endPart) return { offset: start };
  const end = Number(endPart);
  if (!Number.isInteger(end) || end < start) return "unsatisfiable";
  const last = Math.min(end, size - 1);
  return { offset: start, length: last - start + 1 };
}
