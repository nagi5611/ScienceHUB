/**
 * ウェブサイト公開 API
 */

import type { Env } from "../../lib/types";
import { jsonError } from "../../lib/types";
import { getDb } from "../../lib/db";
import { requireUser } from "../../lib/auth";
import { canUserAccessApp } from "../../lib/apps";
import { WEBSITE_PUBLISH_APP_SLUG } from "../../lib/website-publish/constants";
import {
  createWebSite,
  deleteWebSite,
  getOwnedWebSite,
  listUserWebSites,
  updateWebSiteTitle,
} from "../../lib/website-publish/sites";
import { listSiteFiles } from "../../lib/website-publish/r2-ops";
import {
  abortWebUpload,
  completeWebUpload,
  deleteWebSiteFile,
  getWebPartUploadUrl,
  getWebSimpleUploadUrl,
  initiateWebUpload,
  simpleWebUpload,
  type WebUploadedPart,
} from "../../lib/website-publish/upload";
import { extractZipToSite } from "../../lib/website-publish/zip";
import {
  getSiteFileForDownload,
  readSiteFileText,
  renameSitePath,
  writeSiteFileText,
} from "../../lib/website-publish/file-ops";
import { contentTypeForPath } from "../../lib/website-publish/r2-ops";

function pathParts(params: string | string[] | undefined): string[] {
  if (!params) return [];
  const raw = Array.isArray(params) ? params : [params];
  return raw
    .flatMap((p) => String(p).split("/"))
    .map((p) => p.trim())
    .filter(Boolean);
}

async function requireWebsitePublishAccess(
  request: Request,
  env: Env
): Promise<Awaited<ReturnType<typeof requireUser>> | Response> {
  const auth = await requireUser(request, env);
  if (auth instanceof Response) return auth;

  const allowed = await canUserAccessApp(
    getDb(env),
    auth.id,
    WEBSITE_PUBLISH_APP_SLUG
  );
  if (!allowed) {
    return jsonError("このアプリへのアクセス権限がありません", 403);
  }

  return auth;
}

function toErrorResponse(error: unknown, fallback: string): Response {
  const message = error instanceof Error ? error.message : fallback;
  return jsonError(message, 400);
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const parts = pathParts(context.params.path);
  const auth = await requireWebsitePublishAccess(context.request, context.env);
  if (auth instanceof Response) return auth;

  const db = getDb(context.env);
  const bucket = context.env.FILES;

  try {
    if (parts[0] === "sites" && parts.length === 1) {
      const sites = await listUserWebSites(db, bucket, auth.id);
      return Response.json({ sites });
    }

    if (parts[0] === "sites" && parts[1] && parts[2] === "files") {
      const site = await getOwnedWebSite(db, auth.id, parts[1]);
      if (!site) return jsonError("サイトが見つかりません", 404);

      const url = new URL(context.request.url);
      const filePath = url.searchParams.get("path");

      if (parts[3] === "content" && filePath) {
        const result = await readSiteFileText(context.env, site, filePath);
        return Response.json(result);
      }

      if (parts[3] === "download" && filePath) {
        const { obj, filename } = await getSiteFileForDownload(
          context.env,
          site,
          filePath
        );
        const headers = new Headers();
        headers.set(
          "Content-Type",
          obj.httpMetadata?.contentType ??
            contentTypeForPath(filePath)
        );
        headers.set(
          "Content-Disposition",
          `attachment; filename="${encodeURIComponent(filename)}"`
        );
        if (obj.httpEtag) headers.set("ETag", obj.httpEtag);
        return new Response(obj.body, { status: 200, headers });
      }

      if (parts.length === 3) {
        const files = await listSiteFiles(bucket, site.r2_prefix);
        return Response.json({ files });
      }
    }

    return jsonError("不正なリクエストです", 404);
  } catch (error) {
    return toErrorResponse(error, "リクエストの処理に失敗しました");
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const parts = pathParts(context.params.path);
  const auth = await requireWebsitePublishAccess(context.request, context.env);
  if (auth instanceof Response) return auth;

  const db = getDb(context.env);
  const bucket = context.env.FILES;

  try {
    if (parts[0] === "sites" && parts.length === 1) {
      const body = await context.request.json<{ title?: string; path_slug?: string }>();
      const site = await createWebSite(
        db,
        auth.id,
        body.title ?? "",
        body.path_slug ?? ""
      );
      return Response.json({ site });
    }

    const siteId = parts[1];
    if (parts[0] !== "sites" || !siteId) {
      return jsonError("不正なリクエストです", 404);
    }

    const site = await getOwnedWebSite(db, auth.id, siteId);
    if (!site) return jsonError("サイトが見つかりません", 404);

    if (parts[2] === "upload" && parts[3] === "init") {
      const body = await context.request.json<{
        filename?: string;
        size?: number;
        relative_dir?: string;
      }>();
      const result = await initiateWebUpload(
        context.env,
        db,
        auth,
        site,
        body.relative_dir ?? "",
        body.filename ?? "",
        Number(body.size ?? 0)
      );
      return Response.json(result);
    }

    if (parts[2] === "upload" && parts[3] === "url") {
      const body = await context.request.json<{ session_id?: string }>();
      const url = await getWebSimpleUploadUrl(
        context.env,
        db,
        auth.id,
        body.session_id ?? ""
      );
      return Response.json(url);
    }

    if (parts[2] === "upload" && parts[3] === "part-url") {
      const body = await context.request.json<{
        session_id?: string;
        part_number?: number;
      }>();
      const url = await getWebPartUploadUrl(
        context.env,
        db,
        auth.id,
        body.session_id ?? "",
        Number(body.part_number ?? 0)
      );
      return Response.json(url);
    }

    if (parts[2] === "upload" && parts[3] === "simple") {
      const sessionId = context.request.headers.get("X-Upload-Session") ?? "";
      const body = await context.request.arrayBuffer();
      const result = await simpleWebUpload(
        context.env,
        db,
        auth,
        site,
        sessionId,
        body
      );
      return Response.json(result);
    }

    if (parts[2] === "upload" && parts[3] === "complete") {
      const body = await context.request.json<{
        session_id?: string;
        parts?: WebUploadedPart[];
        direct_upload?: boolean;
      }>();
      const result = await completeWebUpload(
        context.env,
        db,
        auth,
        site,
        body.session_id ?? "",
        body.parts,
        Boolean(body.direct_upload)
      );
      return Response.json(result);
    }

    if (parts[2] === "upload" && parts[3] === "abort") {
      const body = await context.request.json<{ session_id?: string }>();
      await abortWebUpload(context.env, db, auth.id, body.session_id ?? "");
      return Response.json({ ok: true });
    }

    if (parts[2] === "upload" && parts[3] === "zip") {
      const zipBytes = new Uint8Array(await context.request.arrayBuffer());
      const result = await extractZipToSite(bucket, db, site, zipBytes);
      return Response.json(result);
    }

    return jsonError("不正なリクエストです", 404);
  } catch (error) {
    return toErrorResponse(error, "リクエストの処理に失敗しました");
  }
};

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const parts = pathParts(context.params.path);
  const auth = await requireWebsitePublishAccess(context.request, context.env);
  if (auth instanceof Response) return auth;

  const db = getDb(context.env);

  try {
    if (parts[0] === "sites" && parts[1] && parts.length === 2) {
      const body = await context.request.json<{ title?: string }>();
      const site = await updateWebSiteTitle(
        db,
        auth.id,
        parts[1],
        body.title ?? ""
      );
      return Response.json({ site });
    }

    if (parts[0] === "sites" && parts[1] && parts[2] === "files" && parts[3] === "rename") {
      const site = await getOwnedWebSite(db, auth.id, parts[1]);
      if (!site) return jsonError("サイトが見つかりません", 404);

      const body = await context.request.json<{
        path?: string;
        new_name?: string;
        kind?: "file" | "folder";
      }>();
      if (!body.path || !body.new_name) {
        return jsonError("path と new_name が必要です", 400);
      }
      const result = await renameSitePath(
        context.env,
        site,
        body.path,
        body.new_name,
        body.kind === "folder" ? "folder" : "file"
      );
      return Response.json(result);
    }

    return jsonError("不正なリクエストです", 404);
  } catch (error) {
    return toErrorResponse(error, "更新に失敗しました");
  }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const parts = pathParts(context.params.path);
  const auth = await requireWebsitePublishAccess(context.request, context.env);
  if (auth instanceof Response) return auth;

  const db = getDb(context.env);

  try {
    if (
      parts[0] === "sites" &&
      parts[1] &&
      parts[2] === "files" &&
      parts[3] === "content"
    ) {
      const site = await getOwnedWebSite(db, auth.id, parts[1]);
      if (!site) return jsonError("サイトが見つかりません", 404);

      const body = await context.request.json<{ path?: string; content?: string }>();
      if (!body.path) return jsonError("path が必要です", 400);
      const result = await writeSiteFileText(
        context.env,
        db,
        site,
        body.path,
        body.content ?? ""
      );
      return Response.json(result);
    }

    return jsonError("不正なリクエストです", 404);
  } catch (error) {
    return toErrorResponse(error, "保存に失敗しました");
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const parts = pathParts(context.params.path);
  const auth = await requireWebsitePublishAccess(context.request, context.env);
  if (auth instanceof Response) return auth;

  const db = getDb(context.env);
  const bucket = context.env.FILES;

  try {
    if (parts[0] === "sites" && parts[1] && parts.length === 2) {
      await deleteWebSite(db, bucket, auth.id, parts[1]);
      return Response.json({ ok: true });
    }

    if (parts[0] === "sites" && parts[1] && parts[2] === "files") {
      const site = await getOwnedWebSite(db, auth.id, parts[1]);
      if (!site) return jsonError("サイトが見つかりません", 404);

      const url = new URL(context.request.url);
      const pathParam = url.searchParams.get("path");
      if (!pathParam) return jsonError("path が必要です", 400);

      await deleteWebSiteFile(context.env, db, site, pathParam);
      return Response.json({ ok: true });
    }

    return jsonError("不正なリクエストです", 404);
  } catch (error) {
    return toErrorResponse(error, "削除に失敗しました");
  }
};
