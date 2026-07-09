/**
 * Excalidraw 共有リンク公開ページ（ログイン不要・リアルタイム共同編集）
 */

import React from "react";
import { createRoot } from "react-dom/client";
import { Excalidraw } from "@excalidraw/excalidraw";
import { createExcalidrawMainMenu } from "../js/excalidraw-menu.js";

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
let socket = null;
let clientId = null;
let applyingRemote = false;
let saveTimer = null;
let broadcastTimer = null;
let latestElements = [];
let latestAppState = {};
let latestFiles = {};

function getToken() {
  return new URL(location.href).searchParams.get("t")?.trim() ?? "";
}

function pickAppState(appState) {
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
    scrollX: appState.scrollX,
    scrollY: appState.scrollY,
    zoom: appState.zoom,
    gridSize: appState.gridSize,
  };
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
          appState: pickAppState(latestAppState),
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

function connectCollab() {
  const proto = location.protocol === "https:" ? "wss:" : "ws:";
  const params = new URLSearchParams({ token });
  const guestName = localStorage.getItem("excal-guest-name");
  if (guestName) params.set("name", guestName);

  const ws = new WebSocket(
    `${proto}//${location.host}/api/excalidraw/collab?${params}`
  );
  socket = ws;

  ws.addEventListener("open", () => {
    peersEl.textContent = "接続中";
  });

  ws.addEventListener("message", (event) => {
    let data;
    try {
      data = JSON.parse(event.data);
    } catch {
      return;
    }
    if (data.type === "init") {
      clientId = data.clientId;
      applyRemoteScene(data.scene);
      updatePeers(data.peers ?? []);
      return;
    }
    if (data.type === "scene" && data.from !== clientId) {
      applyRemoteScene(data.scene);
      return;
    }
    if (data.type === "presence") {
      updatePeers(data.peers ?? []);
      return;
    }
    if (data.type === "pointer" && data.from !== clientId && excalidrawAPI) {
      const collaborators = new Map(
        excalidrawAPI.getAppState().collaborators ?? []
      );
      collaborators.set(data.from, {
        username: data.username,
        color: data.color,
        pointer: data.pointer,
        button: data.button,
        selectedElementIds: data.selectedElementIds,
      });
      applyingRemote = true;
      excalidrawAPI.updateScene({ collaborators });
      applyingRemote = false;
    }
  });

  ws.addEventListener("close", () => {
    peersEl.textContent = "切断";
  });
}

function broadcastScene() {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  socket.send(
    JSON.stringify({
      type: "scene",
      scene: {
        elements: latestElements,
        appState: pickAppState(latestAppState),
        files: latestFiles,
      },
    })
  );
}

function handlePointerUpdate(payload) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  socket.send(
    JSON.stringify({
      type: "pointer",
      pointer: payload.pointer,
      button: payload.button,
      selectedElementIds: payload.selectedElementIds,
    })
  );
}

function applyRemoteScene(scene) {
  if (!excalidrawAPI || !scene) return;
  applyingRemote = true;
  latestElements = scene.elements ?? [];
  latestFiles = scene.files ?? {};
  excalidrawAPI.updateScene({
    elements: latestElements,
    appState: scene.appState ?? {},
  });
  if (scene.files && Object.keys(scene.files).length) {
    excalidrawAPI.addFiles(Object.values(scene.files));
  }
  applyingRemote = false;
}

function updatePeers(peers) {
  const others = (peers ?? []).filter((p) => p.clientId !== clientId);
  peersEl.textContent =
    others.length === 0
      ? "自分のみ"
      : `共同編集: ${others.map((p) => p.username).join(", ")}`;

  if (!excalidrawAPI) return;
  const collaborators = new Map();
  for (const p of others) {
    collaborators.set(p.clientId, {
      username: p.username,
      color: p.color,
    });
  }
  applyingRemote = true;
  excalidrawAPI.updateScene({ collaborators });
  applyingRemote = false;
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
