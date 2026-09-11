/**
 * Runa エージェント API
 * GET  /api/runa/messages
 * GET  /api/runa/recent-files
 * POST /api/runa/chat?stream=1
 */

import type { Env } from "../../lib/types";
import { jsonError } from "../../lib/types";
import { getDb } from "../../lib/db";
import { requireUser } from "../../lib/auth";
import { createRunaSseResponse } from "../../lib/runa/chat-sse";
import { clearRunaMessages, listRunaMessages } from "../../lib/runa/messages";
import {
  runRunaChat,
  listRecentFilesForUser,
  type RunaChatAttachment,
} from "../../lib/runa/agent";

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
    if (route === "messages" && method === "DELETE") {
      const auth = await requireUser(request, env);
      if (auth instanceof Response) return auth;

      await clearRunaMessages(db, auth.id);
      return Response.json({ ok: true });
    }

    if (route === "messages" && method === "GET") {
      const auth = await requireUser(request, env);
      if (auth instanceof Response) return auth;

      const url = new URL(request.url);
      const limit = Math.min(
        100,
        Math.max(1, Number.parseInt(url.searchParams.get("limit") ?? "50", 10) || 50)
      );
      const messages = await listRunaMessages(db, auth.id, limit);
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

      let body: { message?: string; attachments?: RunaChatAttachment[] };
      try {
        body = (await request.json()) as {
          message?: string;
          attachments?: RunaChatAttachment[];
        };
      } catch {
        return jsonError("JSON の解析に失敗しました", 400);
      }

      const message = body.message?.trim() ?? "";
      const attachments = (body.attachments ?? [])
        .filter(
          (a): a is RunaChatAttachment =>
            Boolean(a?.path?.trim() && a?.name?.trim())
        )
        .slice(0, 5)
        .map((a) => ({ path: a.path.trim(), name: a.name.trim() }));

      if (!message && !attachments.length) {
        return jsonError("メッセージを入力してください", 400);
      }

      const url = new URL(request.url);
      const stream = url.searchParams.get("stream") === "1";

      if (stream) {
        return createRunaSseResponse(async (send) => {
          return await runRunaChat(env, db, auth, message, send, attachments);
        });
      }

      const chunks: string[] = [];
      const result = await runRunaChat(
        env,
        db,
        auth,
        message,
        (event, data) => {
        if (event === "delta" && data && typeof data === "object" && "text" in data) {
          chunks.push(String((data as { text: string }).text));
        }
        },
        attachments
      );

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
