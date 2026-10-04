/**
 * 3Dプリンター利用ガイド Q&A API
 */

import type { Env } from "../../../lib/types";
import { jsonError } from "../../../lib/types";
import { getDb } from "../../../lib/db";
import { requireUser } from "../../../lib/auth";
import { canUserAccessApp } from "../../../lib/apps";
import {
  MANUAL_QA_ADMIN_APP_SLUG,
  manualAppDenied,
  manualQaAdminDenied,
} from "../../../lib/3dprintmanual-content";
import {
  addAskerPost,
  addStaffReply,
  createQuestion,
  getQuestionDetail,
  listAdminQuestions,
  listPublicQuestions,
  patchQuestionAdmin,
} from "../../../lib/3dprintmanual-qa/repo";
import { searchManualQa } from "../../../lib/3dprintmanual-qa/search";

function pathParts(params: string | string[] | undefined): string[] {
  if (!params) return [];
  const raw = Array.isArray(params) ? params : [params];
  return raw
    .flatMap((p) => String(p).split("/"))
    .map((p) => p.trim())
    .filter(Boolean);
}

/** ログイン + 利用ガイドアプリ */
async function requireManualApp(
  request: Request,
  env: Env
): Promise<{ id: string } | Response> {
  const denied = await manualAppDenied(request, env);
  if (denied) return denied;
  const auth = await requireUser(request, env);
  if (auth instanceof Response) return auth;
  return { id: auth.id };
}

async function isQaAdmin(env: Env, userId: string): Promise<boolean> {
  return canUserAccessApp(getDb(env), userId, MANUAL_QA_ADMIN_APP_SLUG);
}

function toError(error: unknown, fallback: string): Response {
  const message = error instanceof Error ? error.message : fallback;
  const status =
    message.includes("権限") || message.includes("アクセス")
      ? 403
      : message.includes("見つかりません")
        ? 404
        : 400;
  return jsonError(message, status);
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const parts = pathParts(context.params.path);
  const method = context.request.method;

  try {
    if (parts.length === 1 && parts[0] === "questions" && method === "GET") {
      const auth = await requireManualApp(context.request, context.env);
      if (auth instanceof Response) return auth;

      const url = new URL(context.request.url);
      const admin = url.searchParams.get("admin") === "1";
      if (admin) {
        const denied = await manualQaAdminDenied(context.request, context.env);
        if (denied) return denied;
      }

      const options = {
        categoryId: url.searchParams.get("cat") ?? "all",
        machine: url.searchParams.get("machine") ?? "all",
        status: (url.searchParams.get("status") ?? "all") as "all" | "answered" | "open",
        resolved: (url.searchParams.get("resolved") ?? "all") as "all" | "0" | "1",
        limit: Number(url.searchParams.get("limit") ?? "100"),
        offset: Number(url.searchParams.get("offset") ?? "0"),
      };

      const db = getDb(context.env);
      const items = admin
        ? await listAdminQuestions(db, options)
        : await listPublicQuestions(db, options);

      return Response.json({ items });
    }

    if (parts.length === 2 && parts[0] === "questions" && parts[1] === "search" && method === "POST") {
      const auth = await requireManualApp(context.request, context.env);
      if (auth instanceof Response) return auth;

      let body: { query?: string };
      try {
        body = await context.request.json();
      } catch {
        return jsonError("JSON を読み取れませんでした", 400);
      }
      const query = typeof body.query === "string" ? body.query.trim() : "";
      if (!query) {
        return Response.json({ ids: [], items: [] });
      }

      const { ids } = await searchManualQa(context.env, query);
      const db = getDb(context.env);
      const items = ids.length
        ? await listPublicQuestions(db, { ids, limit: ids.length })
        : [];
      const order = new Map(ids.map((id, i) => [id, i]));
      items.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

      return Response.json({ ids, items });
    }

    if (parts.length === 1 && parts[0] === "questions" && method === "POST") {
      const auth = await requireManualApp(context.request, context.env);
      if (auth instanceof Response) return auth;

      let body: {
        categoryId?: string;
        machine?: string;
        title?: string;
        body?: string;
        attachmentKeys?: string[];
      };
      try {
        body = await context.request.json();
      } catch {
        return jsonError("JSON を読み取れませんでした", 400);
      }

      const result = await createQuestion(context.env, {
        userId: auth.id,
        categoryId: String(body.categoryId ?? ""),
        machine: String(body.machine ?? "both"),
        title: String(body.title ?? ""),
        body: String(body.body ?? ""),
        attachmentKeys: Array.isArray(body.attachmentKeys)
          ? body.attachmentKeys.filter((k): k is string => typeof k === "string")
          : [],
      });

      if ("rejected" in result) {
        return Response.json({ ok: false, userMessage: result.userMessage }, { status: 422 });
      }

      return Response.json({ ok: true, id: result.id }, { status: 201 });
    }

    if (parts.length === 2 && parts[0] === "questions" && method === "GET") {
      const auth = await requireManualApp(context.request, context.env);
      if (auth instanceof Response) return auth;

      const questionId = parts[1];
      const db = getDb(context.env);
      const admin = await isQaAdmin(context.env, auth.id);
      const detail = await getQuestionDetail(db, questionId, auth.id, admin);
      if (!detail) return jsonError("質問が見つかりません", 404);
      return Response.json({ item: detail });
    }

    if (parts.length === 2 && parts[0] === "questions" && method === "PATCH") {
      const denied = await manualQaAdminDenied(context.request, context.env);
      if (denied) return denied;

      const questionId = parts[1];
      let body: { resolved?: boolean; pinned?: boolean };
      try {
        body = await context.request.json();
      } catch {
        return jsonError("JSON を読み取れませんでした", 400);
      }

      await patchQuestionAdmin(getDb(context.env), questionId, {
        resolved: body.resolved,
        pinned: body.pinned,
      });
      return Response.json({ ok: true });
    }

    if (
      parts.length === 3 &&
      parts[0] === "questions" &&
      parts[2] === "posts" &&
      method === "POST"
    ) {
      const auth = await requireManualApp(context.request, context.env);
      if (auth instanceof Response) return auth;

      const questionId = parts[1];
      let body: { body?: string };
      try {
        body = await context.request.json();
      } catch {
        return jsonError("JSON を読み取れませんでした", 400);
      }

      const result = await addAskerPost(
        context.env,
        questionId,
        auth.id,
        String(body.body ?? "")
      );
      if ("rejected" in result) {
        return Response.json({ ok: false, userMessage: result.userMessage }, { status: 422 });
      }
      return Response.json({ ok: true, id: result.id }, { status: 201 });
    }

    if (
      parts.length === 3 &&
      parts[0] === "questions" &&
      parts[2] === "staff-reply" &&
      method === "POST"
    ) {
      const denied = await manualQaAdminDenied(context.request, context.env);
      if (denied) return denied;

      const auth = await requireUser(context.request, context.env);
      if (auth instanceof Response) return auth;

      const questionId = parts[1];
      let body: { body?: string };
      try {
        body = await context.request.json();
      } catch {
        return jsonError("JSON を読み取れませんでした", 400);
      }

      const result = await addStaffReply(
        context.env,
        questionId,
        auth.id,
        String(body.body ?? "")
      );
      return Response.json({ ok: true, id: result.id }, { status: 201 });
    }

    return jsonError("Not Found", 404);
  } catch (error) {
    return toError(error, "処理に失敗しました");
  }
};
