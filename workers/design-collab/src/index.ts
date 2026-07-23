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
  tombstones: Record<string, number>;
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
  return { version: 2, width: 2000, height: 1500, elements: [], tombstones: {} };
}

function colorFor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }
  return COLORS[hash % COLORS.length]!;
}

function getElementCollabVersion(el: Record<string, unknown>): number {
  const version = el.collabVersion;
  return typeof version === "number" && version > 0 ? version : 1;
}

function normalizeCollabTombstones(
  input: Record<string, number> | undefined
): Record<string, number> {
  if (!input || typeof input !== "object") return {};
  const out: Record<string, number> = {};
  for (const [id, version] of Object.entries(input)) {
    if (!id || typeof version !== "number" || version <= 0) continue;
    out[id] = Math.max(out[id] ?? 0, version);
  }
  return out;
}

function mergeCollabTombstones(
  ...sources: Array<Record<string, number> | undefined>
): Record<string, number> {
  const merged: Record<string, number> = {};
  for (const source of sources) {
    const normalized = normalizeCollabTombstones(source);
    for (const [id, version] of Object.entries(normalized)) {
      merged[id] = Math.max(merged[id] ?? 0, version);
    }
  }
  return merged;
}

/** 要素 ID でマージ（クライアント側 reconcileDesignElements と同等） */
function reconcileElements(
  local: unknown[],
  remote: unknown[],
  tombstones: Record<string, number>
): unknown[] {
  const remoteElements = Array.isArray(remote) ? remote : [];
  const localElements = Array.isArray(local) ? local : [];

  const remoteMap = new Map<string, unknown>();
  for (const el of remoteElements) {
    if (!el || typeof el !== "object") continue;
    const item = el as Record<string, unknown>;
    if (typeof item.id === "string") remoteMap.set(item.id, item);
  }
  const remoteIds = new Set(remoteMap.keys());

  const merged = new Map<string, unknown>();

  const consider = (el: unknown, preferOnTie: boolean) => {
    if (!el || typeof el !== "object") return;
    const item = el as Record<string, unknown>;
    if (typeof item.id !== "string") return;

    const tombVersion = tombstones[item.id];
    const elementVersion = getElementCollabVersion(item);
    if (tombVersion !== undefined && tombVersion >= elementVersion) return;

    const prev = merged.get(item.id);
    if (!prev || typeof prev !== "object") {
      merged.set(item.id, item);
      return;
    }

    const prevItem = prev as Record<string, unknown>;
    const prevVersion = getElementCollabVersion(prevItem);
    if (elementVersion > prevVersion) {
      merged.set(item.id, item);
      return;
    }
    if (elementVersion === prevVersion && preferOnTie) {
      merged.set(item.id, el);
    }
  };

  for (const el of localElements) consider(el, false);
  for (const el of remoteElements) consider(el, true);

  const result = [...merged.values()];
  for (const el of localElements) {
    if (!el || typeof el !== "object") continue;
    const item = el as Record<string, unknown>;
    if (typeof item.id !== "string") continue;
    if (remoteIds.has(item.id) || merged.has(item.id)) continue;

    const tombVersion = tombstones[item.id];
    const elementVersion = getElementCollabVersion(item);
    if (tombVersion !== undefined && tombVersion >= elementVersion) continue;
    result.push(el);
  }

  return result;
}

function normalizeScene(input: Partial<DesignSceneState> | undefined): DesignSceneState {
  if (!input) return emptyScene();
  return {
    version: typeof input.version === "number" ? input.version : 2,
    width: typeof input.width === "number" ? input.width : 2000,
    height: typeof input.height === "number" ? input.height : 1500,
    elements: Array.isArray(input.elements) ? input.elements : [],
    tombstones: normalizeCollabTombstones(input.tombstones),
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

  private applyIncomingScene(incoming: DesignSceneState): void {
    this.scene.tombstones = mergeCollabTombstones(
      this.scene.tombstones,
      incoming.tombstones
    );
    this.scene = {
      version: incoming.version,
      width: incoming.width,
      height: incoming.height,
      elements: reconcileElements(
        this.scene.elements,
        incoming.elements,
        this.scene.tombstones
      ),
      tombstones: this.scene.tombstones,
    };
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
        if (isSeed) {
          this.scene = incoming;
        } else {
          // D1 からの永続化はプロジェクトの正とみなし、要素は置き換える
          this.scene = {
            ...incoming,
            tombstones: mergeCollabTombstones(
              this.scene.tombstones,
              incoming.tombstones
            ),
          };
        }
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
      this.applyIncomingScene(incoming);
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
