/**
 * 設計アプリ API
 * GET    /api/design/projects
 * POST   /api/design/projects
 * GET    /api/design/projects/:id
 * PATCH  /api/design/projects/:id
 * DELETE /api/design/projects/:id
 * POST   /api/design/projects/:id/versions
 * GET    /api/design/projects/:id/versions
 * GET    /api/design/projects/:id/versions/:versionId
 * POST   /api/design/projects/:id/restore/:versionId
 * POST   /api/design/projects/:id/share
 * DELETE /api/design/projects/:id/share
 * GET    /api/design/share/info?token=
 * PUT    /api/design/share/scene
 * GET|WS /api/design/collab?projectId=|&token=
 */

import type { Env } from "../../lib/types";
import { jsonError } from "../../lib/types";
import { getDb } from "../../lib/db";
import { getSessionUser, requireUser } from "../../lib/auth";
import { canUserAccessApp } from "../../lib/apps";
import {
  DESIGN_APP_SLUG,
  createProject,
  createOrGetShareLink,
  deleteProject,
  getProject,
  getPublicShareInfo,
  getVersionScene,
  listProjects,
  listVersions,
  normalizeScene,
  restoreVersion,
  revokeShareLink,
  saveSharedProjectScene,
  saveVersion,
  updateProject,
} from "../../lib/design";

type ExtendedEnv = Env & {
  DESIGN_COLLAB?: DurableObjectNamespace;
};

function pathParts(params: string | string[] | undefined): string[] {
  if (!params) return [];
  const raw = Array.isArray(params) ? params : [params];
  return raw
    .flatMap((p) => String(p).split("/"))
    .map((p) => p.trim())
    .filter(Boolean);
}

/** /projects 以下のセグメントを取得（先頭が projects でなければ null） */
function projectParts(
  params: string | string[] | undefined
): string[] | null {
  const parts = pathParts(params);
  if (parts[0] !== "projects") return null;
  return parts.slice(1);
}

/** 公開共有 API か */
function isPublicShareRoute(parts: string[]): boolean {
  return parts[0] === "share";
}

/** アプリ権限チェック */
async function requireDesignAccess(
  request: Request,
  env: Env
): Promise<Awaited<ReturnType<typeof requireUser>> | Response> {
  const auth = await requireUser(request, env);
  if (auth instanceof Response) return auth;

  const allowed = await canUserAccessApp(getDb(env), auth.id, DESIGN_APP_SLUG);
  if (!allowed) {
    return jsonError("このアプリへのアクセス権限がありません", 403);
  }

  return auth;
}

function toErrorResponse(error: unknown, fallback: string): Response {
  const message = error instanceof Error ? error.message : fallback;
  return jsonError(message, 400);
}

/** DO にシーン永続化を通知 */
async function notifyDesignCollabPersist(
  env: ExtendedEnv,
  projectId: string,
  scene: unknown
): Promise<void> {
  if (!env.DESIGN_COLLAB) return;
  try {
    const stub = env.DESIGN_COLLAB.getByName(projectId);
    await stub.fetch("https://do/persist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scene: normalizeScene(scene) }),
    });
  } catch {
    /* DO 未起動時は無視 */
  }
}

/** WebSocket を DO にプロキシ */
async function handleCollab(
  request: Request,
  env: ExtendedEnv
): Promise<Response> {
  if (!env.DESIGN_COLLAB) {
    return jsonError("共同編集サービスが未設定です", 503);
  }

  const url = new URL(request.url);
  const projectId = url.searchParams.get("projectId")?.trim() ?? "";
  const token = url.searchParams.get("token")?.trim() ?? "";
  const db = getDb(env);

  let roomProjectId = "";
  let displayName = "ゲスト";
  let userId = "guest";
  let seedScene: unknown = null;

  if (token) {
    const info = await getPublicShareInfo(db, token, request);
    if (!info) return jsonError("共有リンクが無効です", 404);
    roomProjectId = info.project_id;
    seedScene = info.scene;
    const session = await getSessionUser(request, env);
    if (session) {
      displayName = session.display_name || session.username;
      userId = session.id;
    } else {
      displayName =
        url.searchParams.get("name")?.trim().slice(0, 40) || "ゲスト";
      userId = `guest_${crypto.randomUUID().slice(0, 8)}`;
    }
  } else if (projectId) {
    const auth = await requireDesignAccess(request, env);
    if (auth instanceof Response) return auth;
    const project = await getProject(db, auth.id, projectId, request);
    if (!project) return jsonError("プロジェクトが見つかりません", 404);
    roomProjectId = project.id;
    seedScene = project.scene;
    displayName = auth.display_name || auth.username;
    userId = auth.id;
  } else {
    return jsonError("projectId または token が必要です", 400);
  }

  if (request.headers.get("Upgrade") !== "websocket") {
    return jsonError("WebSocket が必要です", 426);
  }

  const stub = env.DESIGN_COLLAB.getByName(roomProjectId);

  if (seedScene) {
    try {
      await stub.fetch("https://do/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scene: normalizeScene(seedScene) }),
      });
    } catch {
      /* ignore */
    }
  }

  const doUrl = new URL("https://do/websocket");
  doUrl.searchParams.set("projectId", roomProjectId);
  doUrl.searchParams.set("userId", userId);
  doUrl.searchParams.set("username", displayName);

  return stub.fetch(
    new Request(doUrl.toString(), {
      headers: request.headers,
    })
  );
}

export const onRequestGet: PagesFunction<ExtendedEnv> = async (context) => {
  const parts = pathParts(context.params.path);

  if (parts[0] === "collab") {
    return handleCollab(context.request, context.env);
  }

  const db = getDb(context.env);

  if (isPublicShareRoute(parts) && parts[1] === "info") {
    const token =
      new URL(context.request.url).searchParams.get("token")?.trim() ?? "";
    if (!token) return jsonError("token が必要です", 400);
    const info = await getPublicShareInfo(db, token, context.request);
    if (!info) return jsonError("共有リンクが見つかりません", 404);
    return Response.json(info);
  }

  const auth = await requireDesignAccess(context.request, context.env);
  if (auth instanceof Response) return auth;

  const projectPath = projectParts(context.params.path);
  if (!projectPath) return jsonError("不正なリクエストです", 404);

  try {
    if (projectPath.length === 0) {
      const projects = await listProjects(db, auth.id, context.request);
      return Response.json({ projects });
    }

    const [projectId, sub, subId] = projectPath;

    if (sub === "versions" && subId) {
      const data = await getVersionScene(db, auth.id, projectId, subId);
      if (!data) return jsonError("バージョンが見つかりません", 404);
      return Response.json(data);
    }

    if (sub === "versions") {
      const versions = await listVersions(db, auth.id, projectId);
      if (!versions) return jsonError("プロジェクトが見つかりません", 404);
      return Response.json({ versions });
    }

    if (sub) return jsonError("不正なリクエストです", 404);

    const project = await getProject(
      db,
      auth.id,
      projectId,
      context.request
    );
    if (!project) return jsonError("プロジェクトが見つかりません", 404);
    return Response.json({ project });
  } catch (error) {
    return toErrorResponse(error, "取得に失敗しました");
  }
};

export const onRequestPost: PagesFunction<ExtendedEnv> = async (context) => {
  const auth = await requireDesignAccess(context.request, context.env);
  if (auth instanceof Response) return auth;

  const parts = projectParts(context.params.path);
  if (!parts) return jsonError("不正なリクエストです", 404);

  const db = getDb(context.env);

  try {
    if (parts.length === 0) {
      const body = (await context.request.json().catch(() => ({}))) as {
        title?: string;
      };
      const project = await createProject(db, auth, body.title);
      return Response.json({ project }, { status: 201 });
    }

    const [projectId, sub, versionId] = parts;

    if (sub === "restore" && versionId) {
      const body = (await context.request.json().catch(() => ({}))) as {
        thumbnail_data?: string | null;
      };
      const version = await restoreVersion(
        db,
        auth.id,
        projectId,
        versionId,
        body.thumbnail_data
      );
      if (!version) return jsonError("復元に失敗しました", 404);
      const project = await getProject(db, auth.id, projectId);
      return Response.json({ version, project });
    }

    if (sub === "versions") {
      const body = (await context.request.json()) as {
        scene?: unknown;
        thumbnail_data?: string | null;
        is_autosave?: boolean;
        change_action?: "restore" | "import";
      };
      const version = await saveVersion(db, auth.id, projectId, {
        scene: body.scene,
        thumbnail_data: body.thumbnail_data,
        is_autosave: body.is_autosave,
        change_action: body.change_action,
      });
      if (!version) return jsonError("保存に失敗しました", 404);
      await notifyDesignCollabPersist(
        context.env,
        projectId,
        body.scene
      );
      return Response.json({ version }, { status: 201 });
    }

    if (sub === "share") {
      try {
        const share = await createOrGetShareLink(
          db,
          auth,
          projectId,
          context.request
        );
        return Response.json(share);
      } catch (error) {
        return toErrorResponse(error, "共有リンクの作成に失敗しました");
      }
    }

    return jsonError("不正なリクエストです", 404);
  } catch (error) {
    return toErrorResponse(error, "作成に失敗しました");
  }
};

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const auth = await requireDesignAccess(context.request, context.env);
  if (auth instanceof Response) return auth;

  const parts = projectParts(context.params.path);
  if (!parts || parts.length !== 1) {
    return jsonError("不正なリクエストです", 404);
  }

  const db = getDb(context.env);
  const body = (await context.request.json()) as {
    title?: string;
    cloud_storage_path?: string | null;
  };

  try {
    const result = await updateProject(db, auth.id, parts[0], {
      title: body.title,
      cloud_storage_path: body.cloud_storage_path,
    });
    if (!result) return jsonError("プロジェクトが見つかりません", 404);
    return Response.json(result);
  } catch (error) {
    return toErrorResponse(error, "更新に失敗しました");
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const auth = await requireDesignAccess(context.request, context.env);
  if (auth instanceof Response) return auth;

  const parts = projectParts(context.params.path);
  if (!parts) return jsonError("不正なリクエストです", 404);

  const db = getDb(context.env);

  try {
    if (parts.length === 2 && parts[1] === "share") {
      const ok = await revokeShareLink(db, auth.id, parts[0]);
      if (!ok) return jsonError("プロジェクトが見つかりません", 404);
      return Response.json({ ok: true });
    }

    if (parts.length !== 1) {
      return jsonError("不正なリクエストです", 404);
    }

    const ok = await deleteProject(db, auth.id, parts[0]);
    if (!ok) return jsonError("プロジェクトが見つかりません", 404);
    return Response.json({ ok: true });
  } catch (error) {
    return toErrorResponse(error, "削除に失敗しました");
  }
};

export const onRequestPut: PagesFunction<ExtendedEnv> = async (context) => {
  const parts = pathParts(context.params.path);
  const db = getDb(context.env);

  if (isPublicShareRoute(parts) && parts[1] === "scene") {
    const body = (await context.request.json().catch(() => null)) as {
      token?: string;
      scene?: unknown;
    } | null;
    if (!body?.token) return jsonError("token が必要です", 400);
    const saved = await saveSharedProjectScene(db, body.token, body.scene);
    if (!saved) return jsonError("共有リンクが無効です", 404);
    await notifyDesignCollabPersist(
      context.env,
      saved.project_id,
      body.scene
    );
    return Response.json({ ok: true, project_id: saved.project_id });
  }

  return jsonError("Not Found", 404);
};
