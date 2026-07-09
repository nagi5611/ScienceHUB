/**
 * Excalidraw ノート API
 * GET    /api/excalidraw/notes
 * POST   /api/excalidraw/notes
 * GET    /api/excalidraw/notes/:id
 * PATCH  /api/excalidraw/notes/:id
 * DELETE /api/excalidraw/notes/:id
 * PUT    /api/excalidraw/notes/:id/scene
 * POST   /api/excalidraw/notes/:id/share
 * DELETE /api/excalidraw/notes/:id/share
 * GET    /api/excalidraw/share/info?token=
 * PUT    /api/excalidraw/share/scene
 * GET|WS /api/excalidraw/collab?noteId=|&token=
 */

import type { Env } from "../../lib/types";
import { jsonError } from "../../lib/types";
import { getDb } from "../../lib/db";
import { getSessionUser, requireUser } from "../../lib/auth";
import { canUserAccessApp } from "../../lib/apps";
import {
  EXCALIDRAW_APP_SLUG,
  createNote,
  createOrGetShareLink,
  deleteNote,
  getOwnedNote,
  getPublicShareInfo,
  listNotes,
  revokeShareLink,
  saveOwnedNoteScene,
  saveSharedNoteScene,
  updateNoteTitle,
} from "../../lib/excalidraw-notes";

type ExtendedEnv = Env & {
  EXCALIDRAW_COLLAB?: DurableObjectNamespace;
};

function getPathParts(pathname: string): string[] {
  const base = "/api/excalidraw/";
  const rest = pathname.startsWith(base) ? pathname.slice(base.length) : "";
  return rest.split("/").filter(Boolean);
}

/** アプリ権限チェック */
async function requireAppAccess(
  request: Request,
  env: Env
): Promise<Response | Awaited<ReturnType<typeof requireUser>>> {
  const auth = await requireUser(request, env);
  if (auth instanceof Response) return auth;
  const allowed = await canUserAccessApp(
    getDb(env),
    auth.id,
    EXCALIDRAW_APP_SLUG
  );
  if (!allowed) {
    return jsonError("このアプリへのアクセス権限がありません", 403);
  }
  return auth;
}

/** WebSocket を DO にプロキシ */
async function handleCollab(
  request: Request,
  env: ExtendedEnv
): Promise<Response> {
  if (!env.EXCALIDRAW_COLLAB) {
    return jsonError("共同編集サービスが未設定です", 503);
  }

  const url = new URL(request.url);
  const noteId = url.searchParams.get("noteId")?.trim() ?? "";
  const token = url.searchParams.get("token")?.trim() ?? "";
  const db = getDb(env);

  let roomNoteId = "";
  let displayName = "ゲスト";
  let userId = "guest";
  let seedScene: unknown = null;

  if (token) {
    const info = await getPublicShareInfo(db, token, request);
    if (!info) return jsonError("共有リンクが無効です", 404);
    roomNoteId = info.note_id;
    seedScene = info.scene;
    const session = await getSessionUser(request, env);
    if (session) {
      displayName = session.display_name || session.username;
      userId = session.id;
    } else {
      displayName = url.searchParams.get("name")?.trim().slice(0, 40) || "ゲスト";
      userId = `guest_${crypto.randomUUID().slice(0, 8)}`;
    }
  } else if (noteId) {
    const auth = await requireAppAccess(request, env);
    if (auth instanceof Response) return auth;
    const note = await getOwnedNote(db, auth.id, noteId, request);
    if (!note) return jsonError("ノートが見つかりません", 404);
    roomNoteId = note.id;
    seedScene = note.scene;
    displayName = auth.display_name || auth.username;
    userId = auth.id;
  } else {
    return jsonError("noteId または token が必要です", 400);
  }

  if (request.headers.get("Upgrade") !== "websocket") {
    return jsonError("WebSocket が必要です", 426);
  }

  const stub = env.EXCALIDRAW_COLLAB.getByName(roomNoteId);

  // D1 の最新シーンを DO にシード（空ルームの初回接続用）
  if (seedScene) {
    try {
      await stub.fetch("https://do/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scene: seedScene }),
      });
    } catch {
      /* ignore */
    }
  }

  const doUrl = new URL("https://do/websocket");
  doUrl.searchParams.set("noteId", roomNoteId);
  doUrl.searchParams.set("userId", userId);
  doUrl.searchParams.set("username", displayName);

  return stub.fetch(
    new Request(doUrl.toString(), {
      headers: request.headers,
    })
  );
}

export const onRequest: PagesFunction<ExtendedEnv> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const parts = getPathParts(url.pathname);
  const method = request.method.toUpperCase();
  const db = getDb(env);

  // 共同編集 WebSocket
  if (parts[0] === "collab") {
    return handleCollab(request, env);
  }

  // 公開共有 API（ログイン不要）
  if (parts[0] === "share" && parts[1] === "info" && method === "GET") {
    const token = url.searchParams.get("token")?.trim() ?? "";
    if (!token) return jsonError("token が必要です", 400);
    const info = await getPublicShareInfo(db, token, request);
    if (!info) return jsonError("共有リンクが見つかりません", 404);
    return Response.json(info);
  }

  if (parts[0] === "share" && parts[1] === "scene" && method === "PUT") {
    const body = (await request.json().catch(() => null)) as {
      token?: string;
      scene?: unknown;
    } | null;
    if (!body?.token) return jsonError("token が必要です", 400);
    const saved = await saveSharedNoteScene(db, body.token, body.scene);
    if (!saved) return jsonError("共有リンクが無効です", 404);

    // DO にも永続化を通知（接続中クライアント向け）
    if (env.EXCALIDRAW_COLLAB) {
      try {
        const stub = env.EXCALIDRAW_COLLAB.getByName(saved.note_id);
        await stub.fetch("https://do/persist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scene: body.scene }),
        });
      } catch {
        /* DO 未起動時は無視 */
      }
    }

    return Response.json({ ok: true, note_id: saved.note_id });
  }

  // 以下はログイン + アプリ権限必須
  const auth = await requireAppAccess(request, env);
  if (auth instanceof Response) return auth;

  // GET /notes
  if (parts.length === 1 && parts[0] === "notes" && method === "GET") {
    const notes = await listNotes(db, auth.id, request);
    return Response.json({ notes });
  }

  // POST /notes
  if (parts.length === 1 && parts[0] === "notes" && method === "POST") {
    const body = (await request.json().catch(() => ({}))) as { title?: string };
    const note = await createNote(db, auth, body.title, request);
    return Response.json({ note }, { status: 201 });
  }

  // /notes/:id ...
  if (parts[0] === "notes" && parts[1]) {
    const noteId = parts[1];
    const action = parts[2];

    if (!action && method === "GET") {
      const note = await getOwnedNote(db, auth.id, noteId, request);
      if (!note) return jsonError("ノートが見つかりません", 404);
      return Response.json({ note });
    }

    if (!action && method === "PATCH") {
      const body = (await request.json().catch(() => ({}))) as { title?: string };
      try {
        const note = await updateNoteTitle(db, auth.id, noteId, body.title, request);
        if (!note) return jsonError("ノートが見つかりません", 404);
        return Response.json({ note });
      } catch (e) {
        return jsonError(e instanceof Error ? e.message : "更新に失敗しました", 400);
      }
    }

    if (!action && method === "DELETE") {
      const ok = await deleteNote(db, auth.id, noteId);
      if (!ok) return jsonError("ノートが見つかりません", 404);
      return Response.json({ ok: true });
    }

    if (action === "scene" && method === "PUT") {
      const body = (await request.json().catch(() => null)) as {
        scene?: unknown;
      } | null;
      const note = await saveOwnedNoteScene(
        db,
        auth.id,
        noteId,
        body?.scene,
        request
      );
      if (!note) return jsonError("ノートが見つかりません", 404);

      if (env.EXCALIDRAW_COLLAB) {
        try {
          const stub = env.EXCALIDRAW_COLLAB.getByName(noteId);
          await stub.fetch("https://do/persist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ scene: body?.scene }),
          });
        } catch {
          /* ignore */
        }
      }

      return Response.json({ note });
    }

    if (action === "share" && method === "POST") {
      try {
        const share = await createOrGetShareLink(db, auth, noteId, request);
        return Response.json(share);
      } catch (e) {
        return jsonError(
          e instanceof Error ? e.message : "共有リンクの作成に失敗しました",
          400
        );
      }
    }

    if (action === "share" && method === "DELETE") {
      const ok = await revokeShareLink(db, auth.id, noteId);
      if (!ok) return jsonError("ノートが見つかりません", 404);
      return Response.json({ ok: true });
    }
  }

  return jsonError("Not Found", 404);
};
