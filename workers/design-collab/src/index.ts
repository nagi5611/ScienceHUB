/**
 * 設計アプリ共同編集 Durable Object
 */

import { DurableObject } from "cloudflare:workers";

export interface DesignCollabEnv {
  DESIGN_COLLAB: DurableObjectNamespace;
}

interface PeerAttachment {
  userId: string;
  username: string;
  color: string;
  clientId: string;
}

interface DesignSceneState {
  version: number;
  width: number;
  height: number;
  elements: unknown[];
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

function emptyScene(): DesignSceneState {
  return { version: 2, width: 2000, height: 1500, elements: [] };
}

function colorFor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }
  return COLORS[hash % COLORS.length]!;
}

/** 要素 ID でマージ（リモート優先） */
function reconcileElements(local: unknown[], remote: unknown[]): unknown[] {
  if (!Array.isArray(remote)) return local;
  if (remote.length === 0 && local.length > 0) {
    return remote;
  }
  const map = new Map<string, unknown>();
  for (const el of local) {
    if (!el || typeof el !== "object") continue;
    const item = el as Record<string, unknown>;
    if (typeof item.id === "string") map.set(item.id, item);
  }
  for (const el of remote) {
    if (!el || typeof el !== "object") continue;
    const item = el as Record<string, unknown>;
    if (typeof item.id === "string") map.set(item.id, item);
  }
  const remoteIds = new Set(
    remote
      .filter((el) => el && typeof el === "object")
      .map((el) => (el as Record<string, unknown>).id)
      .filter((id): id is string => typeof id === "string")
  );
  return [...map.values()].filter((el) => {
    if (!el || typeof el !== "object") return false;
    const id = (el as Record<string, unknown>).id;
    return typeof id === "string" && remoteIds.has(id);
  });
}

function normalizeScene(input: Partial<DesignSceneState> | undefined): DesignSceneState {
  if (!input) return emptyScene();
  return {
    version: typeof input.version === "number" ? input.version : 2,
    width: typeof input.width === "number" ? input.width : 2000,
    height: typeof input.height === "number" ? input.height : 1500,
    elements: Array.isArray(input.elements) ? input.elements : [],
  };
}

export class DesignCollabRoom extends DurableObject<DesignCollabEnv> {
  private scene: DesignSceneState = emptyScene();
  private loaded = false;

  private async ensureLoaded(): Promise<void> {
    if (this.loaded) return;
    const stored = await this.ctx.storage.get<DesignSceneState>("scene");
    if (stored && Array.isArray(stored.elements)) {
      this.scene = normalizeScene(stored);
    }
    this.loaded = true;
  }

  private async persistScene(): Promise<void> {
    await this.ctx.storage.put("scene", this.scene);
  }

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

  private broadcastPresence(): void {
    this.broadcast(JSON.stringify({ type: "presence", peers: this.listPeers() }));
  }

  async fetch(request: Request): Promise<Response> {
    await this.ensureLoaded();
    const url = new URL(request.url);

    if (
      (url.pathname === "/persist" || url.pathname === "/seed") &&
      request.method === "POST"
    ) {
      const body = (await request.json().catch(() => null)) as {
        scene?: Partial<DesignSceneState>;
      } | null;
      if (body?.scene) {
        const incoming = normalizeScene(body.scene);
        const isSeed = url.pathname === "/seed";
        if (isSeed && this.scene.elements.length > 0) {
          return Response.json({ ok: true, skipped: true });
        }
        this.scene = {
          version: incoming.version,
          width: incoming.width,
          height: incoming.height,
          elements: isSeed
            ? incoming.elements
            : reconcileElements(this.scene.elements, incoming.elements),
        };
        await this.persistScene();
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
      server.serializeAttachment({
        userId,
        username,
        color: colorFor(userId),
        clientId,
      } satisfies PeerAttachment);

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

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    await this.ensureLoaded();
    const text =
      typeof message === "string" ? message : new TextDecoder().decode(message);

    let data: {
      type?: string;
      scene?: Partial<DesignSceneState>;
      pointer?: { x: number; y: number };
      selectedIds?: string[];
    };
    try {
      data = JSON.parse(text);
    } catch {
      return;
    }

    const att = ws.deserializeAttachment() as PeerAttachment | null;
    if (!att) return;

    if (data.type === "scene" && data.scene) {
      const incoming = normalizeScene(data.scene);
      this.scene = {
        version: incoming.version,
        width: incoming.width,
        height: incoming.height,
        elements: reconcileElements(this.scene.elements, incoming.elements),
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
          selectedIds: data.selectedIds ?? [],
        }),
        ws
      );
    }
  }

  async webSocketClose(ws: WebSocket, code: number, reason: string): Promise<void> {
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
    return new Response("Design collab worker", { status: 200 });
  },
};
