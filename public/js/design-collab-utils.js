/**
 * 設計アプリ共同編集ユーティリティ（クライアント側）
 */

/** 共同編集で送受信するシーン（ビューは個人設定のため除外） */
export function pickCollabScene(scene) {
  if (!scene) {
    return { version: 2, width: 2000, height: 1500, elements: [] };
  }
  return {
    version: scene.version ?? 2,
    width: scene.width ?? 2000,
    height: scene.height ?? 1500,
    elements: Array.isArray(scene.elements) ? scene.elements : [],
  };
}

/** シーン変更検知用フィンガープリント */
export function designSceneFingerprint(scene) {
  return JSON.stringify(pickCollabScene(scene));
}

/** 要素を ID でマージ（リモート優先） */
export function reconcileDesignElements(local, remote) {
  if (!Array.isArray(remote)) return local ?? [];
  if (remote.length === 0) return [];

  const map = new Map();
  for (const el of local ?? []) {
    if (el?.id) map.set(el.id, el);
  }
  for (const el of remote) {
    if (el?.id) map.set(el.id, el);
  }

  const remoteIds = new Set(remote.map((el) => el?.id).filter(Boolean));
  return [...map.values()].filter((el) => el?.id && remoteIds.has(el.id));
}

/**
 * リモートシーンを適用
 * @returns {boolean}
 */
export function applyRemoteDesignScene(state, scene, onApply) {
  if (!scene) return false;

  const merged = reconcileDesignElements(state.elements, scene.elements ?? []);
  state.elements = merged;
  state.lastCollabFingerprint = designSceneFingerprint({
    ...scene,
    elements: merged,
  });

  onApply?.(merged, scene);
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
    getState,
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

    const state = getState();

    if (data.type === "init") {
      clientId = data.clientId;
      reconnectAttempt = 0;
      setApplyingRemote(true);
      try {
        applyRemoteDesignScene(state, data.scene, onApplyRemoteScene);
        onPeersChange?.(data.peers ?? [], clientId);
      } finally {
        setApplyingRemote(false);
      }
      return;
    }

    if (data.type === "scene" && data.from !== clientId) {
      setApplyingRemote(true);
      try {
        applyRemoteDesignScene(state, data.scene, onApplyRemoteScene);
      } finally {
        setApplyingRemote(false);
      }
      return;
    }

    if (data.type === "presence") {
      onPeersChange?.(data.peers ?? [], clientId);
      return;
    }

    if (data.type === "pointer" && data.from !== clientId) {
      onPeersChange?.(getState().peers ?? [], clientId, data);
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
