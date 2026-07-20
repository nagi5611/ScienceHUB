/**
 * Excalidraw 共同編集ユーティリティ（クライアント側）
 */

/** 永続化用 appState（ビューポート・個人ツール設定は除外） */
export function pickPersistAppState(appState) {
  if (!appState) return {};
  return {
    viewBackgroundColor: appState.viewBackgroundColor,
    gridSize: appState.gridSize,
  };
}

/** .excalidraw エクスポート用 appState（ビューポートのみ除外） */
export function pickExportAppState(appState) {
  if (!appState) return {};
  return {
    viewBackgroundColor: appState.viewBackgroundColor,
    currentItemStrokeColor: appState.currentItemStrokeColor,
    currentItemBackgroundColor: appState.currentItemBackgroundColor,
    currentItemFillStyle: appState.currentItemFillStyle,
    currentItemStrokeWidth: appState.currentItemStrokeWidth,
    currentItemRoughness: appState.currentItemRoughness,
    currentItemOpacity: appState.currentItemOpacity,
    currentItemFontFamily: appState.currentItemFontFamily,
    currentItemFontSize: appState.currentItemFontSize,
    currentItemTextAlign: appState.currentItemTextAlign,
    gridSize: appState.gridSize,
  };
}

/** 共同編集で送信するシーンの変更検知用フィンガープリント */
export function sceneSyncFingerprint(elements, appState, files) {
  return JSON.stringify({
    elements,
    files,
    appState: pickPersistAppState(appState),
  });
}

/** 要素を version / versionNonce でマージ */
export function reconcileElements(local, remote) {
  const map = new Map();

  for (const el of local ?? []) {
    if (!el || typeof el !== "object") continue;
    if (typeof el.id === "string") map.set(el.id, el);
  }

  for (const el of remote ?? []) {
    if (!el || typeof el !== "object") continue;
    if (typeof el.id !== "string") continue;
    const existing = map.get(el.id);
    if (!existing) {
      map.set(el.id, el);
      continue;
    }
    const ev = Number(existing.version ?? 0);
    const rv = Number(el.version ?? 0);
    if (rv > ev) {
      map.set(el.id, el);
    } else if (rv === ev) {
      const en = Number(existing.versionNonce ?? 0);
      const rn = Number(el.versionNonce ?? 0);
      if (rn > en) map.set(el.id, el);
    }
  }

  return [...map.values()].filter((el) => !el.isDeleted);
}

/** files をマージ */
export function mergeFiles(local, remote) {
  return { ...(local ?? {}), ...(remote ?? {}) };
}

/**
 * リモートシーンをローカルへ適用（ビューポートは維持）
 * @returns {boolean} 適用したか
 */
export function applyRemoteSceneToApi(excalidrawAPI, scene, state) {
  if (!excalidrawAPI || !scene) return false;

  const prevFiles = state.latestFiles ?? {};
  const mergedElements = reconcileElements(
    state.latestElements,
    scene.elements ?? []
  );
  const mergedFiles = mergeFiles(state.latestFiles, scene.files ?? {});

  const localAppState = excalidrawAPI.getAppState();
  const remotePersist = pickPersistAppState(scene.appState);

  state.latestElements = mergedElements;
  state.latestFiles = mergedFiles;
  if ("lastSyncFingerprint" in state) {
    state.lastSyncFingerprint = sceneSyncFingerprint(
      mergedElements,
      localAppState,
      mergedFiles
    );
  }

  excalidrawAPI.updateScene({
    elements: mergedElements,
    appState: {
      ...localAppState,
      ...remotePersist,
      collaborators: localAppState.collaborators,
    },
  });

  const newFileEntries = Object.entries(scene.files ?? {})
    .filter(([id]) => !prevFiles[id])
    .map(([, file]) => file)
    .filter(Boolean);
  if (newFileEntries.length) {
    excalidrawAPI.addFiles(newFileEntries);
  }

  return true;
}

/** presence 更新時に collaborator の pointer 情報を保持 */
export function buildCollaboratorsFromPeers(excalidrawAPI, peers, clientId) {
  const others = (peers ?? []).filter((p) => p.clientId !== clientId);
  const existing = excalidrawAPI?.getAppState().collaborators;
  const prev =
    existing instanceof Map
      ? existing
      : new Map(Array.isArray(existing) ? existing : []);

  const collaborators = new Map();
  for (const p of others) {
    const prior = prev.get(p.clientId);
    collaborators.set(p.clientId, {
      username: p.username,
      color: p.color,
      pointer: prior?.pointer,
      button: prior?.button,
      selectedElementIds: prior?.selectedElementIds,
    });
  }
  return collaborators;
}

/** pointer メッセージ用に collaborator を更新 */
export function updateCollaboratorPointer(excalidrawAPI, from, data) {
  const local = excalidrawAPI.getAppState();
  const collaborators = new Map(
    local.collaborators instanceof Map
      ? local.collaborators
      : Array.isArray(local.collaborators)
        ? local.collaborators
        : []
  );
  collaborators.set(from, {
    username: data.username,
    color: data.color,
    pointer: data.pointer,
    button: data.button,
    selectedElementIds: data.selectedElementIds,
  });
  return collaborators;
}

const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 30000;

/**
 * 共同編集 WebSocket 接続を管理
 */
export function createCollabConnection(options) {
  const {
    buildUrl,
    getApi,
    getState,
    setApplyingRemote,
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

    const excalidrawAPI = getApi();
    const state = getState();

    if (data.type === "init") {
      clientId = data.clientId;
      reconnectAttempt = 0;
      setApplyingRemote(true);
      try {
        applyRemoteSceneToApi(excalidrawAPI, data.scene, state);
        onPeersChange?.(data.peers ?? [], clientId);
      } finally {
        setApplyingRemote(false);
      }
      return;
    }

    if (data.type === "scene" && data.from !== clientId) {
      setApplyingRemote(true);
      try {
        applyRemoteSceneToApi(excalidrawAPI, data.scene, state);
      } finally {
        setApplyingRemote(false);
      }
      return;
    }

    if (data.type === "presence") {
      onPeersChange?.(data.peers ?? [], clientId);
      return;
    }

    if (data.type === "pointer" && data.from !== clientId && excalidrawAPI) {
      setApplyingRemote(true);
      try {
        const collaborators = updateCollaboratorPointer(
          excalidrawAPI,
          data.from,
          data
        );
        excalidrawAPI.updateScene({ collaborators });
      } finally {
        setApplyingRemote(false);
      }
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
      socket.send(JSON.stringify({ type: "scene", scene }));
    },
    sendPointer(payload) {
      if (!socket || socket.readyState !== WebSocket.OPEN) return;
      socket.send(
        JSON.stringify({
          type: "pointer",
          pointer: payload.pointer,
          button: payload.button,
          selectedElementIds: payload.selectedElementIds,
        })
      );
    },
    isOpen() {
      return socket?.readyState === WebSocket.OPEN;
    },
  };
}
