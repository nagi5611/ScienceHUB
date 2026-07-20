/**
 * Excalidraw 共有リンク公開ページ（ログイン不要・リアルタイム共同編集）
 */

import React from "react";
import { createRoot } from "react-dom/client";
import { Excalidraw } from "@excalidraw/excalidraw";
import { createExcalidrawMainMenu } from "../js/excalidraw-menu.js";
import {
  buildCollaboratorsFromPeers,
  createCollabConnection,
  pickPersistAppState,
  sceneSyncFingerprint,
} from "../js/excalidraw-collab-utils.js";

const SAVE_DEBOUNCE_MS = 800;
const SCENE_BROADCAST_MS = 200;

const loadingEl = document.getElementById("app-loading");
const errorEl = document.getElementById("share-error");
const errorMsg = document.getElementById("share-error-msg");
const editorView = document.getElementById("editor-view");
const titleEl = document.getElementById("note-title");
const statusEl = document.getElementById("save-status");
const peersEl = document.getElementById("peers-status");

let token = "";
let excalidrawAPI = null;
let collab = null;
let applyingRemote = false;
let saveTimer = null;
let broadcastTimer = null;
let latestElements = [];
let latestAppState = {};
let latestFiles = {};
let lastSyncFingerprint = "";

function getToken() {
  return new URL(location.href).searchParams.get("t")?.trim() ?? "";
}

async function loadShareInfo() {
  const response = await fetch(
    `/api/excalidraw/share/info?token=${encodeURIComponent(token)}`
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? "共有リンクが見つかりません");
  }
  return data;
}

function mountEditor(scene) {
  const rootEl = document.getElementById("excalidraw-root");
  const root = createRoot(rootEl);
  latestElements = scene?.elements ?? [];
  latestAppState = scene?.appState ?? {};
  latestFiles = scene?.files ?? {};
  lastSyncFingerprint = sceneSyncFingerprint(
    latestElements,
    latestAppState,
    latestFiles
  );

  const uiOptions = {
    welcomeScreen: false,
    canvasActions: {
      changeViewBackgroundColor: true,
      clearCanvas: true,
      export: { saveFileToDisk: true },
      loadScene: true,
      saveToActiveFile: false,
      toggleTheme: true,
    },
  };

  root.render(
    React.createElement(
      Excalidraw,
      {
        excalidrawAPI: (api) => {
          excalidrawAPI = api;
        },
        initialData: {
          elements: latestElements,
          appState: { ...latestAppState, collaborators: new Map() },
          files: latestFiles,
        },
        onChange: handleLocalChange,
        onPointerUpdate: handlePointerUpdate,
        langCode: "ja-JP",
        UIOptions: uiOptions,
      },
      createExcalidrawMainMenu(uiOptions)
    )
  );
}

function handleLocalChange(elements, appState, files) {
  if (applyingRemote) return;
  latestElements = elements;
  latestAppState = appState;
  latestFiles = files ?? {};

  const fingerprint = sceneSyncFingerprint(
    latestElements,
    latestAppState,
    latestFiles
  );
  if (fingerprint === lastSyncFingerprint) return;
  lastSyncFingerprint = fingerprint;

  statusEl.textContent = "保存中…";
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(persistScene, SAVE_DEBOUNCE_MS);

  if (broadcastTimer) clearTimeout(broadcastTimer);
  broadcastTimer = setTimeout(broadcastScene, SCENE_BROADCAST_MS);
}

async function persistScene() {
  try {
    const response = await fetch("/api/excalidraw/share/scene", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        scene: {
          elements: latestElements,
          appState: pickPersistAppState(latestAppState),
          files: latestFiles,
        },
      }),
    });
    if (!response.ok) throw new Error("save failed");
    statusEl.textContent = "保存済み";
  } catch {
    statusEl.textContent = "保存失敗";
  }
}

function getCollabState() {
  return { latestElements, latestFiles, lastSyncFingerprint };
}

function updatePeers(peers, clientId) {
  const others = (peers ?? []).filter((p) => p.clientId !== clientId);
  peersEl.textContent =
    others.length === 0
      ? "自分のみ"
      : `共同編集: ${others.map((p) => p.username).join(", ")}`;

  if (!excalidrawAPI) return;
  const collaborators = buildCollaboratorsFromPeers(
    excalidrawAPI,
    peers,
    clientId
  );
  applyingRemote = true;
  excalidrawAPI.updateScene({ collaborators });
  applyingRemote = false;
}

function connectCollab() {
  const proto = location.protocol === "https:" ? "wss:" : "ws:";
  collab = createCollabConnection({
    buildUrl: () => {
      const params = new URLSearchParams({ token });
      const guestName = localStorage.getItem("excal-guest-name");
      if (guestName) params.set("name", guestName);
      return `${proto}//${location.host}/api/excalidraw/collab?${params}`;
    },
    getApi: () => excalidrawAPI,
    getState: getCollabState,
    setApplyingRemote: (value) => {
      applyingRemote = value;
    },
    onOpen: () => {
      peersEl.textContent = "接続中";
    },
    onClose: () => {
      peersEl.textContent = "再接続中…";
    },
    onError: () => {
      peersEl.textContent = "接続エラー";
    },
    onPeersChange: updatePeers,
  });
  collab.connect();
}

function broadcastScene() {
  if (!collab) return;
  collab.broadcastScene({
    elements: latestElements,
    appState: pickPersistAppState(latestAppState),
    files: latestFiles,
  });
}

function handlePointerUpdate(payload) {
  collab?.sendPointer(payload);
}

try {
  token = getToken();
  if (!token) throw new Error("共有トークンがありません");

  const info = await loadShareInfo();
  titleEl.textContent = info.title || "共有ノート";
  loadingEl.hidden = true;
  editorView.hidden = false;
  mountEditor(info.scene);
  connectCollab();
} catch (e) {
  loadingEl.hidden = true;
  errorEl.hidden = false;
  if (errorMsg) errorMsg.textContent = e instanceof Error ? e.message : String(e);
}
