/**
 * クラウドストレージ API ルーター
 */

import type { Env } from "../../lib/types";
import { jsonError } from "../../lib/types";
import { getDb } from "../../lib/db";
import { requireUser } from "../../lib/auth";
import { canUserAccessApp } from "../../lib/apps";
import { STORAGE_APP_SLUG } from "../../lib/storage/constants";
import { parseLogicalPath } from "../../lib/storage/keys";
import { buildVisibleRoots, listDirectory, parseStorageSortField, parseStorageSortOrder } from "../../lib/storage/list";
import { listFolderPreviewItems } from "../../lib/storage/folder-preview";
import {
  parseSearchDateFrom,
  parseSearchDateTo,
  parseStorageSearchScope,
  searchStorageFiles,
} from "../../lib/storage/search";
import { authorizeStoragePath } from "../../lib/storage/permissions";
import { resolveRootForPath } from "../../lib/storage/roots";
import { ensureUserStorageRoot, ensureGroupStorageRoot } from "../../lib/storage/roots";
import {
  abortStorageUpload,
  completeStorageUpload,
  getPartUploadPresignedUrl,
  getSimpleUploadPresignedUrl,
  getStorageDownloadPresignedUrl,
  initiateStorageUpload,
  simpleStorageUpload,
  uploadStoragePart,
  type UploadedPart,
} from "../../lib/storage/upload";
import { toR2Key } from "../../lib/storage/keys";
import { isR2PresignConfigured } from "../../lib/r2-presign";
import {
  deleteWithAuth,
  mkdirWithAuth,
  moveItemsWithAuth,
  renameWithAuth,
  streamStorageFile,
} from "../../lib/storage/operations";
import {
  authorizeTrashItemAccess,
  authorizeTrashRootAccess,
  emptyTrashForRoot,
  listTrashForRoot,
  purgeTrashItemById,
  restoreTrashItem,
} from "../../lib/storage/trash";
import {
  getOfficePreviewInfo,
  streamOfficePreviewFile,
} from "../../lib/storage/office-preview";
import {
  createStorageShareLink,
  downloadStorageShareFile,
  getStorageShareInfo,
} from "../../lib/storage/share";
import {
  createStorageShortcutLink,
  resolveStorageShortcutLink,
} from "../../lib/storage/shortcut";

function parseRoute(path: string | string[] | undefined): string[] {
  if (Array.isArray(path)) return path.filter(Boolean);
  return (path ?? "").split("/").filter(Boolean);
}

async function requireStorageAccess(
  request: Request,
  env: Env
): Promise<Awaited<ReturnType<typeof requireUser>> | Response> {
  const auth = await requireUser(request, env);
  if (auth instanceof Response) return auth;

  const db = getDb(env);
  const allowed = await canUserAccessApp(db, auth.id, STORAGE_APP_SLUG);
  if (!allowed) {
    return jsonError("このアプリへのアクセス権限がありません", 403);
  }

  return auth;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const segments = parseRoute(context.params.path);
  const route = segments.join("/");
  const method = request.method.toUpperCase();
  const db = getDb(env);

  try {
    if (route === "preview/office-file" && method === "GET") {
      const token = new URL(request.url).searchParams.get("t") ?? "";
      if (!token) return jsonError("トークンが必要です", 400);
      return streamOfficePreviewFile(env, token);
    }

    if (route === "share/info" && method === "GET") {
      const token = new URL(request.url).searchParams.get("token") ?? "";
      if (!token) return jsonError("トークンが必要です", 400);

      const info = await getStorageShareInfo(db, token);
      if (!info) return jsonError("共有リンクが見つかりません", 404);
      return Response.json(info);
    }

    if (route === "share/download" && method === "GET") {
      const url = new URL(request.url);
      const token = url.searchParams.get("token") ?? "";
      const fileId = url.searchParams.get("file") ?? "";
      if (!token || !fileId) {
        return jsonError("トークンとファイル ID が必要です", 400);
      }

      try {
        return await downloadStorageShareFile(env, db, token, fileId);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "ダウンロードに失敗しました";
        const status = message.includes("上限") ? 403 : 404;
        return jsonError(message, status);
      }
    }

    if (route === "access" && method === "GET") {
      const auth = await requireStorageAccess(request, env);
      if (auth instanceof Response) return auth;
      return Response.json({ allowed: true });
    }

    const auth = await requireStorageAccess(request, env);
    if (auth instanceof Response) return auth;

    if (route === "roots" && method === "GET") {
      await ensureUserStorageRoot(
        env,
        db,
        auth.id,
        auth.username,
        auth.role_slug
      );

      const roots = await buildVisibleRoots(
        db,
        auth.id,
        auth.username,
        auth.is_admin
      );

      for (const root of roots) {
        if (root.type === "group") {
          const group = await db
            .prepare("SELECT id, slug FROM hub_groups WHERE slug = ?")
            .bind(root.key)
            .first<{ id: string; slug: string }>();
          if (group) {
            await ensureGroupStorageRoot(
              env,
              db,
              group.id,
              group.slug,
              auth.username
            );
          }
        }
      }

      return Response.json({ roots });
    }

    if (route === "list" && method === "GET") {
      const url = new URL(request.url);
      const path = url.searchParams.get("path") ?? "";
      const parsed = parseLogicalPath(path);
      if (!parsed) return jsonError("パスが不正です", 400);

      const authorized = await authorizeStoragePath(
        env,
        db,
        auth,
        path,
        "read",
        true
      );
      if (typeof authorized === "string") {
        return jsonError(authorized, 403);
      }

      const offset = Math.max(0, Number.parseInt(url.searchParams.get("offset") ?? "0", 10) || 0);
      const limitParam = url.searchParams.get("limit");
      const limit =
        limitParam === null || limitParam === ""
          ? undefined
          : Math.min(200, Math.max(1, Number.parseInt(limitParam, 10) || 40));

      const sortField = parseStorageSortField(url.searchParams.get("sort"));
      const sortOrder = parseStorageSortOrder(url.searchParams.get("order"));

      const result = await listDirectory(
        env,
        parsed.rootType,
        parsed.rootKey,
        parsed.relativePath,
        { offset, limit, sortField, sortOrder }
      );
      return Response.json(result);
    }

    if (route === "folder-preview" && method === "GET") {
      const url = new URL(request.url);
      const path = url.searchParams.get("path") ?? "";
      const parsed = parseLogicalPath(path);
      if (!parsed) return jsonError("パスが不正です", 400);

      const authorized = await authorizeStoragePath(
        env,
        db,
        auth,
        path,
        "read",
        true
      );
      if (typeof authorized === "string") {
        return jsonError(authorized, 403);
      }

      const limitParam = url.searchParams.get("limit");
      const limit = Math.min(
        8,
        Math.max(1, Number.parseInt(limitParam ?? "4", 10) || 4)
      );

      const result = await listFolderPreviewItems(
        env,
        parsed.rootType,
        parsed.rootKey,
        parsed.relativePath,
        { limit }
      );
      return Response.json(result);
    }

    if (route === "search" && method === "GET") {
      const url = new URL(request.url);
      const path = url.searchParams.get("path") ?? "";
      const parsed = parseLogicalPath(path);
      if (!parsed) return jsonError("パスが不正です", 400);

      const authorized = await authorizeStoragePath(
        env,
        db,
        auth,
        path,
        "read",
        true
      );
      if (typeof authorized === "string") {
        return jsonError(authorized, 403);
      }

      const offset = Math.max(0, Number.parseInt(url.searchParams.get("offset") ?? "0", 10) || 0);
      const limitParam = url.searchParams.get("limit");
      const limit =
        limitParam === null || limitParam === ""
          ? undefined
          : Math.min(200, Math.max(1, Number.parseInt(limitParam, 10) || 40));

      const sortField = parseStorageSortField(url.searchParams.get("sort"));
      const sortOrder = parseStorageSortOrder(url.searchParams.get("order"));
      const scope = parseStorageSearchScope(url.searchParams.get("scope"));
      const query = url.searchParams.get("q") ?? "";
      const updatedFrom = parseSearchDateFrom(url.searchParams.get("updatedFrom"));
      const updatedTo = parseSearchDateTo(url.searchParams.get("updatedTo"));

      try {
        const result = await searchStorageFiles(
          env,
          parsed.rootType,
          parsed.rootKey,
          parsed.relativePath,
          {
            query,
            scope,
            updatedFrom,
            updatedTo,
            offset,
            limit,
            sortField,
            sortOrder,
          }
        );
        return Response.json(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : "検索に失敗しました";
        return jsonError(message, 400);
      }
    }

    if (route === "quota" && method === "GET") {
      const path = new URL(request.url).searchParams.get("path") ?? "";
      const parsed = parseLogicalPath(path);
      if (!parsed) return jsonError("パスが不正です", 400);

      const authorized = await authorizeStoragePath(
        env,
        db,
        auth,
        path,
        "read",
        true
      );
      if (typeof authorized === "string") {
        return jsonError(authorized, 403);
      }

      const root = await resolveRootForPath(db, parsed.rootType, parsed.rootKey);
      if (!root) return jsonError("ストレージルートが見つかりません", 404);

      return Response.json({
        quota_bytes: root.quota_bytes,
        used_bytes: root.used_bytes,
      });
    }

    if (route === "mkdir" && method === "POST") {
      const body = await request.json<{ path?: string; name?: string }>();
      const path = body.path?.trim() ?? "";
      const name = body.name?.trim() ?? "";
      if (!path || !name) return jsonError("パスとフォルダ名が必要です", 400);

      try {
        const result = await mkdirWithAuth(env, db, auth, path, name);
        return Response.json(result, { status: 201 });
      } catch (error) {
        const message = error instanceof Error ? error.message : "フォルダの作成に失敗しました";
        return jsonError(message, 400);
      }
    }

    if (route === "upload/init" && method === "POST") {
      const body = await request.json<{
        path?: string;
        filename?: string;
        size?: number;
      }>();
      const path = body.path?.trim() ?? "";
      const filename = body.filename?.trim() ?? "";
      const size = Number(body.size);
      if (!path || !filename || !Number.isFinite(size)) {
        return jsonError("path, filename, size が必要です", 400);
      }

      const parsed = parseLogicalPath(path);
      if (!parsed) return jsonError("パスが不正です", 400);

      try {
        const result = await initiateStorageUpload(
          env,
          db,
          auth,
          parsed.rootType,
          parsed.rootKey,
          parsed.relativePath,
          filename,
          size
        );
        return Response.json(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : "アップロードの開始に失敗しました";
        return jsonError(message, 400);
      }
    }

    if (route === "upload/simple" && method === "PUT") {
      const sessionId = new URL(request.url).searchParams.get("sessionId");
      if (!sessionId) return jsonError("sessionId が必要です", 400);

      try {
        const body = request.body;
        if (!body) return jsonError("リクエストボディが必要です", 400);
        const result = await simpleStorageUpload(env, db, auth, sessionId, body);
        return Response.json(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : "アップロードに失敗しました";
        return jsonError(message, 400);
      }
    }

    if (route === "upload/url" && method === "GET") {
      const sessionId = new URL(request.url).searchParams.get("sessionId");
      if (!sessionId) return jsonError("sessionId が必要です", 400);
      if (!isR2PresignConfigured(env)) {
        return jsonError("R2 直アップロードが設定されていません", 503);
      }

      try {
        const result = await getSimpleUploadPresignedUrl(env, db, auth.id, sessionId);
        return Response.json(result);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "アップロード URL の取得に失敗しました";
        return jsonError(message, 400);
      }
    }

    if (route === "upload/part-url" && method === "GET") {
      const url = new URL(request.url);
      const sessionId = url.searchParams.get("sessionId");
      const partNumber = Number(url.searchParams.get("partNumber"));
      if (!sessionId || !Number.isInteger(partNumber) || partNumber < 1) {
        return jsonError("sessionId と partNumber が必要です", 400);
      }
      if (!isR2PresignConfigured(env)) {
        return jsonError("R2 直アップロードが設定されていません", 503);
      }

      try {
        const result = await getPartUploadPresignedUrl(
          env,
          db,
          auth.id,
          sessionId,
          partNumber
        );
        return Response.json(result);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "パート URL の取得に失敗しました";
        return jsonError(message, 400);
      }
    }

    if (route === "upload/part" && method === "PUT") {
      const url = new URL(request.url);
      const sessionId = url.searchParams.get("sessionId");
      const partNumber = Number(url.searchParams.get("partNumber"));
      if (!sessionId || !Number.isInteger(partNumber) || partNumber < 1) {
        return jsonError("sessionId と partNumber が必要です", 400);
      }

      try {
        const body = request.body;
        if (!body) return jsonError("リクエストボディが必要です", 400);
        const part = await uploadStoragePart(
          env,
          db,
          auth.id,
          sessionId,
          partNumber,
          body
        );
        return Response.json(part);
      } catch (error) {
        const message = error instanceof Error ? error.message : "パートのアップロードに失敗しました";
        return jsonError(message, 400);
      }
    }

    if (route === "upload/complete" && method === "POST") {
      const body = await request.json<{
        sessionId?: string;
        parts?: UploadedPart[];
        directUpload?: boolean;
      }>();
      const sessionId = body.sessionId?.trim();
      if (!sessionId) return jsonError("sessionId が必要です", 400);

      try {
        const result = await completeStorageUpload(
          env,
          db,
          auth,
          sessionId,
          body.parts,
          body.directUpload === true
        );
        return Response.json(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : "アップロードの完了に失敗しました";
        return jsonError(message, 400);
      }
    }

    if (route === "upload/abort" && method === "DELETE") {
      const body = await request.json<{ sessionId?: string }>();
      const sessionId = body.sessionId?.trim();
      if (!sessionId) return jsonError("sessionId が必要です", 400);

      await abortStorageUpload(env, db, auth.id, sessionId);
      return Response.json({ ok: true });
    }

    if (route === "preview/office" && method === "GET") {
      const path = new URL(request.url).searchParams.get("path") ?? "";
      const parsed = parseLogicalPath(path);
      if (!parsed || !parsed.relativePath) {
        return jsonError("ファイルパスが不正です", 400);
      }

      const authorized = await authorizeStoragePath(
        env,
        db,
        auth,
        path,
        "read",
        false
      );
      if (typeof authorized === "string") {
        return jsonError(authorized, 403);
      }

      try {
        const result = await getOfficePreviewInfo(env, new URL(request.url), parsed);
        return Response.json(result);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Office プレビューの準備に失敗しました";
        return jsonError(message, 400);
      }
    }

    if (route === "download/url" && method === "GET") {
      const path = new URL(request.url).searchParams.get("path") ?? "";
      const parsed = parseLogicalPath(path);
      if (!parsed || !parsed.relativePath) {
        return jsonError("ファイルパスが不正です", 400);
      }

      const authorized = await authorizeStoragePath(
        env,
        db,
        auth,
        path,
        "read",
        false
      );
      if (typeof authorized === "string") {
        return jsonError(authorized, 403);
      }

      if (!isR2PresignConfigured(env)) {
        return Response.json({ mode: "proxy" });
      }

      try {
        const r2Key = toR2Key(parsed.rootType, parsed.rootKey, parsed.relativePath);
        const filename = parsed.relativePath.split("/").pop() ?? "download";
        const result = await getStorageDownloadPresignedUrl(env, r2Key, filename);
        return Response.json({ mode: "direct", ...result });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "ダウンロード URL の取得に失敗しました";
        return jsonError(message, 500);
      }
    }

    if (route === "download" && method === "GET") {
      const path = new URL(request.url).searchParams.get("path") ?? "";
      const parsed = parseLogicalPath(path);
      if (!parsed || !parsed.relativePath) {
        return jsonError("ファイルパスが不正です", 400);
      }

      const authorized = await authorizeStoragePath(
        env,
        db,
        auth,
        path,
        "read",
        false
      );
      if (typeof authorized === "string") {
        return jsonError(authorized, 403);
      }

      try {
        return await streamStorageFile(env, parsed);
      } catch (error) {
        const message = error instanceof Error ? error.message : "ダウンロードに失敗しました";
        return jsonError(message, 404);
      }
    }

    if (route === "delete" && method === "DELETE") {
      const body = await request.json<{ path?: string; type?: string }>();
      const path = body.path?.trim() ?? "";
      const isDirectory = body.type === "folder";
      if (!path) return jsonError("パスが必要です", 400);

      try {
        const result = await deleteWithAuth(env, db, auth, path, isDirectory);
        return Response.json(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : "削除に失敗しました";
        return jsonError(message, 400);
      }
    }

    if (route === "trash/list" && method === "GET") {
      const rootPath = new URL(request.url).searchParams.get("path")?.trim() ?? "";
      if (!rootPath) return jsonError("path が必要です", 400);

      const allowed = await authorizeTrashRootAccess(env, db, auth, rootPath, "read");
      if (typeof allowed === "string") return jsonError(allowed, 403);

      try {
        const result = await listTrashForRoot(env, db, rootPath);
        return Response.json(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : "ごみ箱の取得に失敗しました";
        return jsonError(message, 400);
      }
    }

    if (route === "trash/restore" && method === "POST") {
      const body = await request.json<{ id?: string }>();
      const trashId = body.id?.trim() ?? "";
      if (!trashId) return jsonError("id が必要です", 400);

      const allowed = await authorizeTrashItemAccess(env, db, auth, trashId, "write");
      if (typeof allowed === "string") return jsonError(allowed, 403);

      try {
        const result = await restoreTrashItem(env, db, trashId);
        return Response.json(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : "復元に失敗しました";
        return jsonError(message, 400);
      }
    }

    if (route === "trash/purge" && method === "DELETE") {
      const body = await request.json<{ id?: string }>();
      const trashId = body.id?.trim() ?? "";
      if (!trashId) return jsonError("id が必要です", 400);

      const allowed = await authorizeTrashItemAccess(env, db, auth, trashId, "delete");
      if (typeof allowed === "string") return jsonError(allowed, 403);

      try {
        await purgeTrashItemById(env, db, trashId);
        return Response.json({ purged: true });
      } catch (error) {
        const message = error instanceof Error ? error.message : "完全削除に失敗しました";
        return jsonError(message, 400);
      }
    }

    if (route === "trash/empty" && method === "DELETE") {
      const body = await request.json<{ path?: string }>();
      const rootPath = body.path?.trim() ?? "";
      if (!rootPath) return jsonError("path が必要です", 400);

      const allowed = await authorizeTrashRootAccess(env, db, auth, rootPath, "delete");
      if (typeof allowed === "string") return jsonError(allowed, 403);

      try {
        const result = await emptyTrashForRoot(env, db, rootPath);
        return Response.json(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : "ごみ箱の空に失敗しました";
        return jsonError(message, 400);
      }
    }

    if (route === "rename" && method === "PATCH") {
      const body = await request.json<{
        path?: string;
        newName?: string;
        type?: string;
      }>();
      const path = body.path?.trim() ?? "";
      const newName = body.newName?.trim() ?? "";
      const isDirectory = body.type === "folder";
      if (!path || !newName) return jsonError("path と newName が必要です", 400);

      try {
        const result = await renameWithAuth(env, db, auth, path, newName, isDirectory);
        return Response.json(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : "リネームに失敗しました";
        return jsonError(message, 400);
      }
    }

    if (route === "move" && method === "POST") {
      const body = await request.json<{
        items?: Array<{ path?: string; type?: string }>;
        destPath?: string;
      }>();
      const destPath = body.destPath?.trim() ?? "";
      const items = Array.isArray(body.items)
        ? body.items
            .map((item) => ({
              path: item.path?.trim() ?? "",
              type: item.type === "folder" ? ("folder" as const) : ("file" as const),
            }))
            .filter((item) => item.path)
        : [];

      if (!destPath || items.length === 0) {
        return jsonError("destPath と items が必要です", 400);
      }

      try {
        const result = await moveItemsWithAuth(env, db, auth, items, destPath);
        return Response.json(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : "移動に失敗しました";
        return jsonError(message, 400);
      }
    }

    if (route === "share/create" && method === "POST") {
      const body = await request.json<{
        paths?: string[];
        max_downloads?: number;
      }>();
      const paths = Array.isArray(body.paths) ? body.paths : [];
      if (paths.length === 0) {
        return jsonError("共有するファイルを指定してください", 400);
      }

      try {
        const result = await createStorageShareLink(
          env,
          db,
          auth,
          paths,
          body.max_downloads,
          request
        );
        return Response.json(result);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "共有リンクの作成に失敗しました";
        return jsonError(message, 400);
      }
    }

    if (route === "shortcut/create" && method === "POST") {
      const body = await request.json<{
        storage_path?: string;
        label?: string;
      }>();
      const storagePath = body.storage_path?.trim() ?? "";
      if (!storagePath) {
        return jsonError("フォルダパスが必要です", 400);
      }

      try {
        const result = await createStorageShortcutLink(
          env,
          db,
          auth,
          storagePath,
          body.label,
          request
        );
        return Response.json(result);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "ショートカットリンクの作成に失敗しました";
        return jsonError(message, 400);
      }
    }

    if (route === "shortcut/resolve" && method === "GET") {
      const token = new URL(request.url).searchParams.get("token") ?? "";
      if (!token) return jsonError("トークンが必要です", 400);

      try {
        const result = await resolveStorageShortcutLink(env, db, auth, token);
        if (!result) {
          return jsonError("ショートカットリンクが見つかりません", 404);
        }
        return Response.json(result);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "ショートカットを開けませんでした";
        const status = message.includes("権限") ? 403 : 400;
        return jsonError(message, status);
      }
    }

    return jsonError("Not Found", 404);
  } catch (error) {
    console.error("Storage API error:", error);
    const message = error instanceof Error ? error.message : "サーバーエラー";
    return jsonError(message, 500);
  }
};
