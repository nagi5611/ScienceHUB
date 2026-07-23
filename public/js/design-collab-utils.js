/**
 * 設計アプリ共同編集ユーティリティ（クライアント側）
 */

/** 共同編集で送受信するシーン（ビューは個人設定のため除外） */
export function pickCollabScene(scene) {
  if (!scene) {
    return { version: 2, width: 2000, height: 1500, elements: [], tombstones: {} };
  }
  const base = {
    version: scene.version ?? 2,
    width: scene.width ?? 2000,
    height: scene.height ?? 1500,
    elements: Array.isArray(scene.elements) ? scene.elements : [],
  };
  const tombstones = normalizeCollabTombstones(scene.tombstones);
  if (Object.keys(tombstones).length > 0) {
    base.tombstones = tombstones;
  }
  return base;
}

/** シーン変更検知用フィンガープリント */
export function designSceneFingerprint(scene) {
  return JSON.stringify(pickCollabScene(scene));
}

/** 要素の共同編集バージョン */
export function getElementCollabVersion(el) {
  const version = el?.collabVersion;
  return typeof version === "number" && version > 0 ? version : 1;
}

/** 削除トゥームストーンを正規化 */
export function normalizeCollabTombstones(input) {
  if (!input || typeof input !== "object") return {};
  const out = {};
  for (const [id, version] of Object.entries(input)) {
    if (!id || typeof version !== "number" || version <= 0) continue;
    out[id] = Math.max(out[id] ?? 0, version);
  }
  return out;
}

/** 削除トゥームストーンをマージ（高いバージョンを採用） */
export function mergeCollabTombstones(...sources) {
  const merged = {};
  for (const source of sources) {
    const normalized = normalizeCollabTombstones(source);
    for (const [id, version] of Object.entries(normalized)) {
      merged[id] = Math.max(merged[id] ?? 0, version);
    }
  }
  return merged;
}

/**
 * 要素を ID でマージ
 * - 同一 ID は collabVersion が高い方を採用（同値はリモート優先）
 * - トゥームストーンより古い要素は除外
 * - リモートに無いローカル専用 ID は保持（未送信の新規作成）
 */
export function reconcileDesignElements(local, remote, options = {}) {
  const remoteElements = Array.isArray(remote) ? remote : [];
  const localElements = Array.isArray(local) ? local : [];
  const tombstones = mergeCollabTombstones(
    options.localTombstones,
    options.remoteTombstones
  );

  const remoteMap = new Map();
  for (const el of remoteElements) {
    if (el?.id) remoteMap.set(el.id, el);
  }
  const remoteIds = new Set(remoteMap.keys());

  const merged = new Map();

  const consider = (el, preferOnTie) => {
    if (!el?.id) return;
    const tombVersion = tombstones[el.id];
    const elementVersion = getElementCollabVersion(el);
    if (tombVersion !== undefined && tombVersion >= elementVersion) return;

    const prev = merged.get(el.id);
    if (!prev) {
      merged.set(el.id, el);
      return;
    }

    const prevVersion = getElementCollabVersion(prev);
    if (elementVersion > prevVersion) {
      merged.set(el.id, el);
      return;
    }
    if (elementVersion === prevVersion && preferOnTie) {
      merged.set(el.id, el);
    }
  };

  for (const el of localElements) consider(el, false);
  for (const el of remoteElements) consider(el, true);

  const result = [...merged.values()];
  for (const el of localElements) {
    if (!el?.id || remoteIds.has(el.id) || merged.has(el.id)) continue;
    const tombVersion = tombstones[el.id];
    const elementVersion = getElementCollabVersion(el);
    if (tombVersion !== undefined && tombVersion >= elementVersion) continue;
    result.push(el);
  }

  return result;
}

/**
 * リモートシーンを適用
 */
export function applyRemoteDesignScene(scene, onApply) {
  if (!scene) return false;
  onApply?.(pickCollabScene(scene));
  return true;
}

const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 30000;

/**
 * 共同編集 WebSocket 接続を管理
 */
export function createDesignCollabConnection(options) {
  const {
    buildUrl,
    setApplyingRemote,
    onApplyRemoteScene,
    onOpen,
    onClose,
    onError,
    onPeersChange,
  } = options;

  let socket = null;
  let clientId = null;
  let reconnectAttempt = 0;
  let reconnectTimer = null;
  let intentionalClose = false;

  function clearReconnectTimer() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  }

  function scheduleReconnect() {
    if (intentionalClose) return;
    clearReconnectTimer();
    const delay = Math.min(
      RECONNECT_BASE_MS * 2 ** reconnectAttempt,
      RECONNECT_MAX_MS
    );
    reconnectAttempt += 1;
    reconnectTimer = setTimeout(() => connect(), delay);
  }

  function handleMessage(event) {
    let data;
    try {
      data = JSON.parse(event.data);
    } catch {
      return;
    }

    if (data.type === "init") {
      clientId = data.clientId;
      reconnectAttempt = 0;
      setApplyingRemote(true);
      try {
        applyRemoteDesignScene(data.scene, onApplyRemoteScene);
        onPeersChange?.(data.peers ?? [], clientId);
      } finally {
        setApplyingRemote(false);
      }
      return;
    }

    if (data.type === "scene" && data.from !== clientId) {
      setApplyingRemote(true);
      try {
        applyRemoteDesignScene(data.scene, onApplyRemoteScene);
      } finally {
        setApplyingRemote(false);
      }
      return;
    }

    if (data.type === "presence") {
      onPeersChange?.(data.peers ?? [], clientId);
    }
  }

  function connect() {
    clearReconnectTimer();
    if (socket) {
      try {
        socket.close();
      } catch {
        /* ignore */
      }
      socket = null;
    }

    const ws = new WebSocket(buildUrl());
    socket = ws;

    ws.addEventListener("open", () => {
      reconnectAttempt = 0;
      onOpen?.();
    });

    ws.addEventListener("message", handleMessage);

    ws.addEventListener("close", () => {
      socket = null;
      onClose?.();
      scheduleReconnect();
    });

    ws.addEventListener("error", () => {
      onError?.();
    });
  }

  return {
    connect,
    disconnect() {
      intentionalClose = true;
      clearReconnectTimer();
      clientId = null;
      if (socket) {
        try {
          socket.close();
        } catch {
          /* ignore */
        }
        socket = null;
      }
      intentionalClose = false;
    },
    getClientId: () => clientId,
    broadcastScene(scene) {
      if (!socket || socket.readyState !== WebSocket.OPEN) return;
      socket.send(JSON.stringify({ type: "scene", scene: pickCollabScene(scene) }));
    },
    sendPointer(payload) {
      if (!socket || socket.readyState !== WebSocket.OPEN) return;
      socket.send(
        JSON.stringify({
          type: "pointer",
          pointer: payload.pointer,
          selectedIds: payload.selectedIds ?? [],
        })
      );
    },
    isOpen() {
      return socket?.readyState === WebSocket.OPEN;
    },
  };
}
