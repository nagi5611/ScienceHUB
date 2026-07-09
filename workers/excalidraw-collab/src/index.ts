/**
 * Excalidraw ノート共同編集 Durable Object
 * 出典: https://developers.cloudflare.com/durable-objects/best-practices/websockets/
 */

import { DurableObject } from "cloudflare:workers";

export interface CollabEnv {
  EXCALIDRAW_COLLAB: DurableObjectNamespace;
}

interface PeerAttachment {
  userId: string;
  username: string;
  color: string;
  clientId: string;
}

interface SceneState {
  elements: unknown[];
  appState: Record<string, unknown>;
  files: Record<string, unknown>;
}

const COLORS = [
  "#e03131",
  "#2f9e44",
  "#1971c2",
  "#f08c00",
  "#9c36b5",
  "#0c8599",
  "#e64980",
  "#5c7cfa",
];

function emptyScene(): SceneState {
  return { elements: [], appState: {}, files: {} };
}

function colorFor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }
  return COLORS[hash % COLORS.length]!;
}

/** 要素を version/versionNonce でマージ */
function reconcileElements(
  local: unknown[],
  remote: unknown[]
): unknown[] {
  const map = new Map<string, Record<string, unknown>>();

  for (const el of local) {
    if (!el || typeof el !== "object") continue;
    const item = el as Record<string, unknown>;
    if (typeof item.id === "string") map.set(item.id, item);
  }

  for (const el of remote) {
    if (!el || typeof el !== "object") continue;
    const item = el as Record<string, unknown>;
    if (typeof item.id !== "string") continue;
    const existing = map.get(item.id);
    if (!existing) {
      map.set(item.id, item);
      continue;
    }
    const ev = Number(existing.version ?? 0);
    const rv = Number(item.version ?? 0);
    if (rv > ev) {
      map.set(item.id, item);
    } else if (rv === ev) {
      const en = Number(existing.versionNonce ?? 0);
      const rn = Number(item.versionNonce ?? 0);
      if (rn > en) map.set(item.id, item);
    }
  }

  return [...map.values()].filter((el) => !el.isDeleted);
}

export class ExcalidrawCollabRoom extends DurableObject<CollabEnv> {
  private scene: SceneState = emptyScene();
  private loaded = false;

  /** ストレージからシーンを読み込む */
  private async ensureLoaded(): Promise<void> {
    if (this.loaded) return;
    const stored = await this.ctx.storage.get<SceneState>("scene");
    if (stored && Array.isArray(stored.elements)) {
      this.scene = {
        elements: stored.elements,
        appState: stored.appState ?? {},
        files: stored.files ?? {},
      };
    }
    this.loaded = true;
  }

  /** シーンを永続化 */
  private async persistScene(): Promise<void> {
    await this.ctx.storage.put("scene", this.scene);
  }

  /** 接続中ピア一覧 */
  private listPeers(exclude?: WebSocket): Array<{
    clientId: string;
    userId: string;
    username: string;
    color: string;
  }> {
    const peers: Array<{
      clientId: string;
      userId: string;
      username: string;
      color: string;
    }> = [];
    for (const ws of this.ctx.getWebSockets()) {
      if (exclude && ws === exclude) continue;
      const att = ws.deserializeAttachment() as PeerAttachment | null;
      if (!att) continue;
      peers.push({
        clientId: att.clientId,
        userId: att.userId,
        username: att.username,
        color: att.color,
      });
    }
    return peers;
  }

  /** ブロードキャスト */
  private broadcast(message: string, except?: WebSocket): void {
    for (const ws of this.ctx.getWebSockets()) {
      if (except && ws === except) continue;
      try {
        ws.send(message);
      } catch {
        /* closed */
      }
    }
  }

  /** プレゼンス通知 */
  private broadcastPresence(): void {
    const payload = JSON.stringify({
      type: "presence",
      peers: this.listPeers(),
    });
    this.broadcast(payload);
  }

  async fetch(request: Request): Promise<Response> {
    await this.ensureLoaded();
    const url = new URL(request.url);

    if (
      (url.pathname === "/persist" || url.pathname === "/seed") &&
      request.method === "POST"
    ) {
      const body = (await request.json().catch(() => null)) as {
        scene?: Partial<SceneState>;
      } | null;
      if (body?.scene) {
        const incoming = body.scene;
        const isSeed = url.pathname === "/seed";
        // seed: DO が空のときだけ D1 から埋める
        if (isSeed && this.scene.elements.length > 0) {
          return Response.json({ ok: true, skipped: true });
        }
        this.scene = {
          elements: Array.isArray(incoming.elements)
            ? isSeed
              ? incoming.elements
              : reconcileElements(this.scene.elements, incoming.elements)
            : this.scene.elements,
          appState:
            incoming.appState && typeof incoming.appState === "object"
              ? incoming.appState
              : this.scene.appState,
          files:
            incoming.files && typeof incoming.files === "object"
              ? isSeed
                ? incoming.files
                : { ...this.scene.files, ...incoming.files }
              : this.scene.files,
        };
        await this.persistScene();
        if (!isSeed) {
          this.broadcast(
            JSON.stringify({ type: "scene", scene: this.scene }),
          );
        }
      }
      return Response.json({ ok: true });
    }

    if (url.pathname === "/websocket") {
      if (request.headers.get("Upgrade") !== "websocket") {
        return new Response("Expected WebSocket", { status: 400 });
      }

      const userId = url.searchParams.get("userId") ?? "guest";
      const username = url.searchParams.get("username") ?? "ゲスト";
      const clientId = crypto.randomUUID();

      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);

      this.ctx.acceptWebSocket(server);
      const attachment: PeerAttachment = {
        userId,
        username,
        color: colorFor(userId),
        clientId,
      };
      server.serializeAttachment(attachment);

      server.send(
        JSON.stringify({
          type: "init",
          clientId,
          scene: this.scene,
          peers: this.listPeers(server),
        })
      );
      this.broadcastPresence();

      return new Response(null, { status: 101, webSocket: client });
    }

    return new Response("Not found", { status: 404 });
  }

  async webSocketMessage(
    ws: WebSocket,
    message: string | ArrayBuffer
  ): Promise<void> {
    await this.ensureLoaded();
    const text =
      typeof message === "string" ? message : new TextDecoder().decode(message);

    let data: {
      type?: string;
      scene?: Partial<SceneState>;
      pointer?: unknown;
      button?: string;
      selectedElementIds?: Record<string, boolean>;
    };
    try {
      data = JSON.parse(text);
    } catch {
      return;
    }

    const att = ws.deserializeAttachment() as PeerAttachment | null;
    if (!att) return;

    if (data.type === "scene" && data.scene) {
      const incoming = data.scene;
      this.scene = {
        elements: Array.isArray(incoming.elements)
          ? reconcileElements(this.scene.elements, incoming.elements)
          : this.scene.elements,
        appState:
          incoming.appState && typeof incoming.appState === "object"
            ? { ...this.scene.appState, ...incoming.appState }
            : this.scene.appState,
        files:
          incoming.files && typeof incoming.files === "object"
            ? { ...this.scene.files, ...incoming.files }
            : this.scene.files,
      };
      await this.persistScene();
      this.broadcast(
        JSON.stringify({
          type: "scene",
          scene: this.scene,
          from: att.clientId,
        }),
        ws
      );
      return;
    }

    if (data.type === "pointer") {
      this.broadcast(
        JSON.stringify({
          type: "pointer",
          from: att.clientId,
          username: att.username,
          color: att.color,
          pointer: data.pointer,
          button: data.button ?? "up",
          selectedElementIds: data.selectedElementIds ?? {},
        }),
        ws
      );
    }
  }

  async webSocketClose(
    ws: WebSocket,
    code: number,
    reason: string
  ): Promise<void> {
    ws.close(code, reason);
    this.broadcastPresence();
  }

  async webSocketError(ws: WebSocket): Promise<void> {
    try {
      ws.close(1011, "error");
    } catch {
      /* ignore */
    }
    this.broadcastPresence();
  }
}

export default {
  async fetch(): Promise<Response> {
    return new Response("Excalidraw collab worker", { status: 200 });
  },
};
