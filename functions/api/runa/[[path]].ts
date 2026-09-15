/**
 * Runa エージェント API
 * GET  /api/runa/messages
 * GET  /api/runa/recent-files
 * POST /api/runa/chat?stream=1
 * POST /api/runa/summarize
 */

import type { Env } from "../../lib/types";
import { jsonError } from "../../lib/types";
import { getDb } from "../../lib/db";
import { requireUser } from "../../lib/auth";
import { createRunaSseResponse } from "../../lib/runa/chat-sse";
import { clearRunaMessages, listRunaMessages } from "../../lib/runa/messages";
import { compactRunaDbHistory } from "../../lib/runa/context-summarize";
import {
  runRunaChat,
  listRecentFilesForUser,
  estimateRunaContextUsage,
  type RunaChatAttachment,
  type RunaChatContext,
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
      const contextUsage = await estimateRunaContextUsage(env, db, auth);
      return Response.json({ messages, contextUsage });
    }

    if (route === "summarize" && method === "POST") {
      const auth = await requireUser(request, env);
      if (auth instanceof Response) return auth;

      const result = await compactRunaDbHistory(env, db, auth.id);
      const contextUsage = await estimateRunaContextUsage(env, db, auth);
      if (!result.compacted) {
        return Response.json(
          {
            ok: false,
            error: "要約できる履歴が不足しています",
            contextUsage,
          },
          { status: 400 }
        );
      }

      const messages = await listRunaMessages(db, auth.id, 50);
      return Response.json({
        ok: true,
        removed: result.removed,
        kept: result.kept,
        summaryPreview: result.summaryPreview,
        messages,
        contextUsage,
      });
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

      let body: {
        message?: string;
        attachments?: RunaChatAttachment[];
        context?: RunaChatContext;
      };
      try {
        body = (await request.json()) as {
          message?: string;
          attachments?: RunaChatAttachment[];
          context?: RunaChatContext;
        };
      } catch {
        return jsonError("JSON の解析に失敗しました", 400);
      }

      const message = body.message?.trim() ?? "";
      const MAX_EXTRACTED = 24 * 1024;
      const attachments = (body.attachments ?? [])
        .filter(
          (a): a is RunaChatAttachment =>
            Boolean(a?.path?.trim() && a?.name?.trim())
        )
        .slice(0, 5)
        .map((a) => ({
          path: a.path.trim(),
          name: a.name.trim(),
          extractedText:
            a.storageRef || !a.extractedText
              ? undefined
              : a.extractedText.slice(0, MAX_EXTRACTED),
          imagePaths: (a.imagePaths ?? [])
            .filter((p): p is string => typeof p === "string" && Boolean(p.trim()))
            .map((p) => p.trim())
            .slice(0, 10),
          storageRef: Boolean(a.storageRef),
          sizeBytes:
            typeof a.sizeBytes === "number" && Number.isFinite(a.sizeBytes)
              ? a.sizeBytes
              : null,
        }));

      const webSiteEditRaw = body.context?.webSiteEditFile;
      const webSiteEditFile =
        webSiteEditRaw &&
        typeof webSiteEditRaw === "object" &&
        typeof webSiteEditRaw.siteId === "string" &&
        typeof webSiteEditRaw.path === "string" &&
        webSiteEditRaw.siteId.trim() &&
        webSiteEditRaw.path.trim()
          ? {
              siteId: webSiteEditRaw.siteId.trim(),
              path: webSiteEditRaw.path.trim(),
              content:
                typeof webSiteEditRaw.content === "string"
                  ? webSiteEditRaw.content.slice(0, 24 * 1024)
                  : undefined,
            }
          : null;

      const context: RunaChatContext | undefined = body.context
        ? {
            storagePath: body.context.storagePath?.trim() || null,
            trashView: Boolean(body.context.trashView),
            searchActive: Boolean(body.context.searchActive),
            webSitesView: Boolean(body.context.webSitesView),
            webSiteId: body.context.webSiteId?.trim() || null,
            webSiteDir: body.context.webSiteDir?.trim() || null,
            webSiteEditFile,
            editImagePath: body.context.editImagePath?.trim() || null,
            editIntent: Boolean(body.context.editIntent),
          }
        : undefined;

      if (!message && !attachments.length) {
        return jsonError("メッセージを入力してください", 400);
      }

      const url = new URL(request.url);
      const stream = url.searchParams.get("stream") === "1";

      if (stream) {
        return createRunaSseResponse(async (send) => {
          return await runRunaChat(
            env,
            db,
            auth,
            message,
            send,
            attachments,
            context
          );
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
        attachments,
        context
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
