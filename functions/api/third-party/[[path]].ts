/**
 * サードパーティ API
 * GET/POST   /api/third-party/projects
 * GET/PATCH/DELETE /api/third-party/projects/:id
 * GET        /api/third-party/projects/:id/messages
 * GET        /api/third-party/projects/:id/workspace/tree
 * GET        /api/third-party/projects/:id/workspace/file?path=
 * POST       /api/third-party/projects/:id/chat?stream=1  (SSE)
 * GET        /api/third-party/projects/:id/preview
 * POST       /api/third-party/projects/:id/publish
 * GET        /api/third-party/gallery
 * GET        /api/third-party/my-groups
 * GET        /api/third-party/published/:slug
 * GET        /api/third-party/published/:slug/meta
 */

import type { Env } from "../../lib/types";
import { jsonError } from "../../lib/types";
import { getDb } from "../../lib/db";
import { requireUser } from "../../lib/auth";
import { canUserAccessApp } from "../../lib/apps";
import {
  THIRD_PARTY_APP_SLUG,
  createTpProject,
  deleteTpProject,
  getOwnedProject,
  getOwnedArtifactText,
  getOwnedProjectDetail,
  getOwnedWorkspaceFile,
  getOwnedWorkspaceTree,
  getProjectHtml,
  getPublishedMeta,
  htmlResponse,
  listChatMessages,
  listGallery,
  listMyProjects,
  listPublishGroups,
  postGeminiChat,
  publishTpProject,
  updateTpProject,
  canViewPublished,
} from "../../lib/third-party";
import { createChatSseResponse } from "../../lib/third-party/chat-sse";

function pathParts(params: string | string[] | undefined): string[] {
  if (!params) return [];
  const raw = Array.isArray(params) ? params : [params];
  return raw
    .flatMap((p) => String(p).split("/"))
    .map((p) => p.trim())
    .filter(Boolean);
}

async function requireThirdPartyAccess(
  request: Request,
  env: Env
): Promise<Awaited<ReturnType<typeof requireUser>> | Response> {
  const auth = await requireUser(request, env);
  if (auth instanceof Response) return auth;

  const allowed = await canUserAccessApp(
    getDb(env),
    auth.id,
    THIRD_PARTY_APP_SLUG
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
  const db = getDb(context.env);
  const bucket = context.env.FILES;

  if (parts[0] === "published" && parts[1]) {
    const slug = parts[1];
    const auth = await requireUser(context.request, context.env);
    if (auth instanceof Response) return auth;

    if (parts[2] === "meta") {
      const meta = await getPublishedMeta(db, auth.id, slug);
      if (!meta) return jsonError("アプリが見つかりません", 404);
      return Response.json({ meta });
    }

    const project = await canViewPublished(db, auth.id, slug);
    if (!project) return jsonError("アプリが見つかりません", 403);

    const html = await getProjectHtml(bucket, project.r2_prefix);
    if (!html) return jsonError("コンテンツがありません", 404);
    return htmlResponse(html);
  }

  const auth = await requireThirdPartyAccess(context.request, context.env);
  if (auth instanceof Response) return auth;

  try {
    if (parts.length === 0) {
      return jsonError("不正なリクエストです", 404);
    }

    if (parts[0] === "gallery") {
      const apps = await listGallery(db, auth.id);
      return Response.json({ apps });
    }

    if (parts[0] === "my-groups") {
      const groups = await listPublishGroups(db, auth.id);
      return Response.json({ groups });
    }

    if (parts[0] !== "projects") {
      return jsonError("不正なリクエストです", 404);
    }

    const projectParts = parts.slice(1);
    if (projectParts.length === 0) {
      const projects = await listMyProjects(db, auth.id);
      return Response.json({ projects });
    }

    const [projectId, sub, artifactKind] = projectParts;

    if (sub === "messages") {
      const project = await getOwnedProject(db, auth.id, projectId);
      if (!project) return jsonError("プロジェクトが見つかりません", 404);
      const messages = await listChatMessages(db, projectId);
      return Response.json({ messages });
    }

    if (sub === "preview") {
      const project = await getOwnedProject(db, auth.id, projectId);
      if (!project) return jsonError("プロジェクトが見つかりません", 404);
      const html =
        (await getProjectHtml(bucket, project.r2_prefix)) ??
        "<!DOCTYPE html><html><body>空</body></html>";
      return htmlResponse(html);
    }

    if (sub === "workspace" && artifactKind === "tree") {
      const tree = await getOwnedWorkspaceTree(db, bucket, auth.id, projectId);
      if (!tree) return jsonError("プロジェクトが見つかりません", 404);
      return Response.json({ tree });
    }

    if (sub === "workspace" && artifactKind === "file") {
      const path = new URL(context.request.url).searchParams.get("path") ?? "";
      const file = await getOwnedWorkspaceFile(
        db,
        bucket,
        auth.id,
        projectId,
        path
      );
      if (!file) return jsonError("プロジェクトが見つかりません", 404);
      if ("error" in file) return jsonError(file.error, 404);
      return Response.json(file);
    }

    if (sub === "artifacts" && artifactKind === "requirements") {
      const text = await getOwnedArtifactText(
        db,
        bucket,
        auth.id,
        projectId,
        "requirements"
      );
      if (!text) return jsonError("要件定義がありません", 404);
      return new Response(text, {
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
      });
    }

    if (sub === "artifacts" && artifactKind === "plan") {
      const text = await getOwnedArtifactText(
        db,
        bucket,
        auth.id,
        projectId,
        "plan"
      );
      if (!text) return jsonError("実装計画がありません", 404);
      return new Response(text, {
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
      });
    }

    if (sub) return jsonError("不正なリクエストです", 404);

    const detail = await getOwnedProjectDetail(db, bucket, auth.id, projectId);
    if (!detail) return jsonError("プロジェクトが見つかりません", 404);
    return Response.json({
      project: detail.project,
      pending_form: detail.pending_form,
    });
  } catch (error) {
    return toErrorResponse(error, "取得に失敗しました");
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const parts = pathParts(context.params.path);
  const auth = await requireThirdPartyAccess(context.request, context.env);
  if (auth instanceof Response) return auth;

  const db = getDb(context.env);
  const bucket = context.env.FILES;

  try {
    if (parts[0] !== "projects") {
      return jsonError("不正なリクエストです", 404);
    }

    const projectParts = parts.slice(1);
    if (projectParts.length === 0) {
      const body = (await context.request.json().catch(() => ({}))) as {
        title?: string;
      };
      const project = await createTpProject(db, bucket, auth, body.title);
      return Response.json({ project }, { status: 201 });
    }

    const [projectId, sub] = projectParts;

    if (sub === "chat") {
      const body = (await context.request.json().catch(() => ({}))) as {
        message?: string;
        form_responses?: Record<string, string | string[]>;
        rewind_to_message_id?: string;
        chat_mode?: string;
      };
      const wantsStream =
        new URL(context.request.url).searchParams.get("stream") === "1";

      if (wantsStream) {
        return createChatSseResponse(async (send) => {
          const callbacks = {
            onActivity: (label: string, phase?: string) => {
              send("status", { label, phase: phase ?? null });
            },
            onArtifact: (path: string) => {
              send("artifact", { path, action: "written" });
            },
            onTasks: (payload: {
              tasks: Array<{ id: string; title: string; status: string }>;
              current: number;
            }) => {
              send("tasks", payload);
            },
          };
          const result = await postGeminiChat(
            context.env,
            db,
            bucket,
            auth.id,
            projectId,
            {
              message: body.message,
              form_responses: body.form_responses,
              rewind_to_message_id: body.rewind_to_message_id,
              chat_mode: body.chat_mode,
            },
            callbacks
          );
          return result;
        });
      }

      const result = await postGeminiChat(
        context.env,
        db,
        bucket,
        auth.id,
        projectId,
        {
          message: body.message,
          form_responses: body.form_responses,
          rewind_to_message_id: body.rewind_to_message_id,
          chat_mode: body.chat_mode,
        }
      );
      if (!result) return jsonError("プロジェクトが見つかりません", 404);
      return Response.json(result);
    }

    if (sub === "publish") {
      const body = (await context.request.json()) as { group_id?: string };
      const groupId = body.group_id?.trim() ?? "";
      if (!groupId) return jsonError("公開先グループを選択してください", 400);
      const project = await publishTpProject(
        db,
        bucket,
        auth.id,
        projectId,
        groupId
      );
      if (!project) return jsonError("プロジェクトが見つかりません", 404);
      return Response.json({ project });
    }

    return jsonError("不正なリクエストです", 404);
  } catch (error) {
    return toErrorResponse(error, "処理に失敗しました");
  }
};

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const parts = pathParts(context.params.path);
  const auth = await requireThirdPartyAccess(context.request, context.env);
  if (auth instanceof Response) return auth;

  if (parts[0] !== "projects" || parts.length !== 2) {
    return jsonError("不正なリクエストです", 404);
  }

  const db = getDb(context.env);
  const projectId = parts[1];
  const body = (await context.request.json().catch(() => ({}))) as {
    title?: string;
    description?: string | null;
    icon_emoji?: string | null;
    color?: string;
  };

  try {
    const project = await updateTpProject(db, auth.id, projectId, body);
    if (!project) return jsonError("プロジェクトが見つかりません", 404);
    return Response.json({ project });
  } catch (error) {
    return toErrorResponse(error, "更新に失敗しました");
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const parts = pathParts(context.params.path);
  const auth = await requireThirdPartyAccess(context.request, context.env);
  if (auth instanceof Response) return auth;

  if (parts[0] !== "projects" || parts.length !== 2) {
    return jsonError("不正なリクエストです", 404);
  }

  const db = getDb(context.env);
  const bucket = context.env.FILES;
  const ok = await deleteTpProject(db, bucket, auth.id, parts[1]);
  if (!ok) return jsonError("プロジェクトが見つかりません", 404);
  return Response.json({ ok: true });
};
