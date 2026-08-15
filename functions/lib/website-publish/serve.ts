/**
 * ウェブサイト公開 — 公開配信
 */

import { contentTypeForPath } from "./r2-ops";

const NOT_FOUND_HTML = `<!DOCTYPE html>
<html lang="ja"><head><meta charset="UTF-8"><title>404</title></head>
<body><h1>ページが見つかりません</h1><p>このサイトは存在しないか、ファイルがありません。</p></body></html>`;

/** 公開 URL パスを path_slug と相対パスに分解 */
export function parseWebServePath(pathParam: string): {
  pathSlug: string;
  relativePath: string;
} | null {
  const parts = pathParam.split("/").filter(Boolean);
  if (parts.length === 0) return null;

  const pathSlug = parts[0];
  const relativePath = parts.slice(1).join("/");
  return { pathSlug, relativePath };
}

/** 配信対象の R2 キー候補を決定 */
export function resolveServeRelativePath(relativePath: string): string {
  if (!relativePath) return "index.html";
  if (relativePath.endsWith("/")) return `${relativePath}index.html`;
  const lastSegment = relativePath.split("/").pop() ?? "";
  if (!lastSegment.includes(".")) return `${relativePath}/index.html`;
  return relativePath;
}

/** R2 オブジェクトをレスポンスとして返す */
export function r2ObjectResponse(
  obj: R2ObjectBody,
  relativePath: string
): Response {
  const contentType =
    obj.httpMetadata?.contentType ?? contentTypeForPath(relativePath);

  const headers = new Headers();
  headers.set("Content-Type", contentType);
  headers.set("X-Content-Type-Options", "nosniff");
  if (obj.httpEtag) headers.set("ETag", obj.httpEtag);
  if (obj.uploaded) {
    headers.set("Last-Modified", new Date(obj.uploaded).toUTCString());
  }
  headers.set("Cache-Control", "public, max-age=300");

  return new Response(obj.body, { status: 200, headers });
}

/** 404 レスポンス */
export function webNotFoundResponse(): Response {
  return new Response(NOT_FOUND_HTML, {
    status: 404,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
