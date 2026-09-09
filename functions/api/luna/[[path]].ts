/**
 * Luna エージェント API
 * GET  /api/luna/messages
 * GET  /api/luna/recent-files
 * POST /api/luna/chat?stream=1
 */

import type { Env } from "../../lib/types";
import { jsonError } from "../../lib/types";
import { getDb } from "../../lib/db";
import { requireUser } from "../../lib/auth";
import { createLunaSseResponse } from "../../lib/luna/chat-sse";
import { listLunaMessages } from "../../lib/luna/messages";
import { runLunaChat, listRecentFilesForUser } from "../../lib/luna/agent";

function parseRoute(path: string | string[] | undefined): string[] {
  if (Array.isArray(path)) return path.filter(Boolean);
  return (path ?? "").split("/").filter(Boolean);
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const segments = parseRoute(context.params.path);
  const route = segments.join("/");
  const method = request.method.toUpperCase();
  const db = getDb(env);

  try {
    if (route === "messages" && method === "GET") {
      const auth = await requireUser(request, env);
      if (auth instanceof Response) return auth;

      const url = new URL(request.url);
      const limit = Math.min(
        100,
        Math.max(1, Number.parseInt(url.searchParams.get("limit") ?? "50", 10) || 50)
      );
      const messages = await listLunaMessages(db, auth.id, limit);
      return Response.json({ messages });
    }

    if (route === "recent-files" && method === "GET") {
      const auth = await requireUser(request, env);
      if (auth instanceof Response) return auth;

      const url = new URL(request.url);
      const limit = Math.min(
        50,
        Math.max(1, Number.parseInt(url.searchParams.get("limit") ?? "20", 10) || 20)
      );
      try {
        const items = await listRecentFilesForUser(env, db, auth, limit);
        return Response.json({ items });
      } catch {
        return Response.json({ items: [] });
      }
    }

    if (route === "chat" && method === "POST") {
      const auth = await requireUser(request, env);
      if (auth instanceof Response) return auth;

      let body: { message?: string };
      try {
        body = (await request.json()) as { message?: string };
      } catch {
        return jsonError("JSON の解析に失敗しました", 400);
      }

      const message = body.message?.trim() ?? "";
      if (!message) {
        return jsonError("メッセージを入力してください", 400);
      }

      const url = new URL(request.url);
      const stream = url.searchParams.get("stream") === "1";

      if (stream) {
        return createLunaSseResponse(async (send) => {
          return await runLunaChat(env, db, auth, message, send);
        });
      }

      const chunks: string[] = [];
      const result = await runLunaChat(env, db, auth, message, (event, data) => {
        if (event === "delta" && data && typeof data === "object" && "text" in data) {
          chunks.push(String((data as { text: string }).text));
        }
      });

      return Response.json({
        message: result.message,
        files: result.files,
        text: chunks.join("") || result.message,
      });
    }

    return jsonError("Not Found", 404);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "処理に失敗しました";
    return jsonError(message, 500);
  }
};
