/**
 * Excalidraw ノート一覧・編集・共有・リアルタイム共同編集
 */

import React from "react";
import { createRoot } from "react-dom/client";
import { Excalidraw, exportToCanvas } from "@excalidraw/excalidraw";
import { createCloudSaveModal } from "../../js/cloud-save-modal.js";
import { createExcalidrawMainMenu } from "../../js/excalidraw-menu.js";
import { fetchDownloadBlob } from "../cloud-storage/js/api.js";

const APP_SLUG = "excalidraw";
const SAVE_DEBOUNCE_MS = 800;
const SCENE_BROADCAST_MS = 200;
const THUMBNAIL_MAX_SIZE = 480;
const THUMBNAIL_CONCURRENCY = 2;

const loadingEl = document.getElementById("app-loading");
const deniedEl = document.getElementById("access-denied");
const listView = document.getElementById("list-view");
const editorView = document.getElementById("editor-view");
const noteListEl = document.getElementById("note-list");
const listBodyEl = document.getElementById("list-body");
const listEmptyEl = document.getElementById("list-empty");
const newNoteBtn = document.getElementById("new-note-btn");
const titleInput = document.getElementById("note-title");
const statusEl = document.getElementById("save-status");
const peersEl = document.getElementById("peers-status");
const shareModal = document.getElementById("share-modal");
const shareUrlInput = document.getElementById("share-url");

let currentNote = null;
let excalidrawAPI = null;
let reactRoot = null;
let saveTimer = null;
let broadcastTimer = null;
let socket = null;
let clientId = null;
let applyingRemote = false;
let latestElements = [];
let latestAppState = {};
let latestFiles = {};
let thumbnailGeneration = 0;

/** HTML エスケープ */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 相対時刻 */
function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleString("ja-JP", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** アクセス権確認 */
async function checkAccess() {
  const response = await fetch(`/api/apps/${APP_SLUG}/access`, {
    credentials: "same-origin",
  });
  if (response.status === 401) {
    window.location.href =
      "/login/?next=" + encodeURIComponent(`/apps/${APP_SLUG}/`);
    return false;
  }
  if (!response.ok) {
    loadingEl.hidden = true;
    deniedEl.hidden = false;
    return false;
  }
  return true;
}

/** API JSON */
async function api(path, options = {}) {
  const response = await fetch(`/api/excalidraw${path}`, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? `リクエスト失敗 (${response.status})`);
  }
  return data;
}

/** CSS.escape のフォールバック */
function cssEscape(value) {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/** シーンからサムネイル用 data URL を生成 */
async function createNoteThumbnailDataUrl(scene) {
  const elements = Array.isArray(scene?.elements)
    ? scene.elements.filter((el) => el && !el.isDeleted)
    : [];
  if (elements.length === 0) return null;

  const appState = scene?.appState && typeof scene.appState === "object" ? scene.appState : {};
  const files = scene?.files && typeof scene.files === "object" ? scene.files : {};

  const canvas = await exportToCanvas({
    elements,
    appState: {
      ...appState,
      exportBackground: true,
      viewBackgroundColor:
        typeof appState.viewBackgroundColor === "string"
          ? appState.viewBackgroundColor
          : "#ffffff",
    },
    files,
    maxWidthOrHeight: THUMBNAIL_MAX_SIZE,
    exportPadding: 12,
  });

  return canvas.toDataURL("image/png");
}

/** 一覧のサムネイルを段階的に描画 */
function scheduleNoteThumbnails(notes, generation) {
  const queue = [...notes];
  let active = 0;

  const pump = () => {
    if (generation !== thumbnailGeneration) return;
    while (active < THUMBNAIL_CONCURRENCY && queue.length > 0) {
      const note = queue.shift();
      if (!note) break;
      active += 1;
      renderThumbnailForNote(note, generation)
        .catch(() => {})
        .finally(() => {
          active -= 1;
          pump();
        });
    }
  };

  pump();
}

/** 1件のノートサムネイルをカードに反映 */
async function renderThumbnailForNote(note, generation) {
  if (generation !== thumbnailGeneration) return;

  const openBtn = noteListEl.querySelector(
    `.excal-note-open[data-id="${cssEscape(note.id)}"]`
  );
  if (!openBtn) return;

  const thumb = openBtn.querySelector(".excal-note-thumb");
  const img = openBtn.querySelector(".excal-note-thumb-img");
  const emptyEl = openBtn.querySelector(".excal-note-thumb-empty");
  if (!thumb || !img || !emptyEl) return;

  const dataUrl = await createNoteThumbnailDataUrl(note.scene);
  if (generation !== thumbnailGeneration || !document.contains(openBtn)) return;

  if (!dataUrl) return;

  img.src = dataUrl;
  img.hidden = false;
  emptyEl.hidden = true;
  thumb.classList.add("excal-note-thumb--loaded");
}

/** ノート一覧表示 */
async function showList() {
  thumbnailGeneration += 1;
  const generation = thumbnailGeneration;
  disconnectCollab();
  unmountEditor();
  currentNote = null;
  editorView.hidden = true;
  listView.hidden = false;
  statusEl.textContent = "";
  peersEl.textContent = "";

  const { notes } = await api("/notes");
  const isEmpty = notes.length === 0;
  listEmptyEl.hidden = !isEmpty;
  noteListEl.hidden = isEmpty;
  listBodyEl.classList.toggle("excal-list-body--empty", isEmpty);
  newNoteBtn.hidden = isEmpty;
  noteListEl.innerHTML = notes
    .map(
      (n) => `<li class="excal-note-item">
        <button type="button" class="excal-note-open" data-id="${escapeHtml(n.id)}">
          <div class="excal-note-thumb" aria-hidden="true">
            <img class="excal-note-thumb-img" alt="" hidden>
            <span class="excal-note-thumb-empty">白紙</span>
          </div>
          <div class="excal-note-body">
            <span class="excal-note-name">${escapeHtml(n.title)}</span>
            <span class="excal-note-meta">${escapeHtml(formatTime(n.updated_at))}${
              n.share_url ? " · 共有中" : ""
            }</span>
          </div>
        </button>
        <button type="button" class="excal-note-delete" data-id="${escapeHtml(n.id)}" title="削除">×</button>
      </li>`
    )
    .join("");

  scheduleNoteThumbnails(notes, generation);

  noteListEl.querySelectorAll(".excal-note-open").forEach((btn) => {
    btn.addEventListener("click", () => openNote(btn.dataset.id));
  });
  noteListEl.querySelectorAll(".excal-note-delete").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (!window.confirm("このノートを削除しますか？")) return;
      await api(`/notes/${btn.dataset.id}`, { method: "DELETE" });
      await showList();
    });
  });
}

/** 新規ノート */
async function createNote() {
  const { note } = await api("/notes", {
    method: "POST",
    body: JSON.stringify({ title: "無題のノート" }),
  });
  await openNote(note.id);
}

/** ノートを開く */
async function openNote(noteId) {
  const { note } = await api(`/notes/${noteId}`);
  currentNote = note;
  listView.hidden = true;
  editorView.hidden = false;
  titleInput.value = note.title;
  statusEl.textContent = "";
  mountEditor(note.scene);
  connectCollab({ noteId: note.id });
}

/** シーンを .excalidraw JSON Blob にする */
function buildExcalidrawBlob() {
  const payload = {
    type: "excalidraw",
    version: 2,
    source: "sciencehub",
    elements: latestElements ?? [],
    appState: pickAppState(latestAppState),
    files: latestFiles ?? {},
  };
  return new Blob([JSON.stringify(payload)], { type: "application/json" });
}

/** クラウド保存ダイアログを開く */
function openCloudSave() {
  if (!cloudSaveModal) {
    alert("保存ダイアログを初期化できませんでした");
    return;
  }
  if (!currentNote) {
    alert("先にノートを開いてください");
    return;
  }
  const base =
    (titleInput.value || currentNote.title || "drawing")
      .trim()
      .replace(/[\\/:*?"<>|]+/g, "_") || "drawing";
  const filename = base.toLowerCase().endsWith(".excalidraw")
    ? base
    : `${base}.excalidraw`;
  cloudSaveModal.open({
    blob: buildExcalidrawBlob(),
    filename,
  });
}

/** ストレージパスからファイル名を取得 */
function filenameFromStoragePath(path) {
  const parts = String(path).split("/").filter(Boolean);
  return parts[parts.length - 1] || "drawing.excalidraw";
}

/** クラウドストレージの .excalidraw を開いて編集 */
async function openFromStoragePath(storagePath) {
  statusEl.textContent = "読み込み中…";
  const blob = await fetchDownloadBlob(storagePath);
  const text = await blob.text();
  let scene;
  try {
    const data = JSON.parse(text);
    scene = {
      elements: Array.isArray(data.elements) ? data.elements : [],
      appState:
        data.appState && typeof data.appState === "object" ? data.appState : {},
      files: data.files && typeof data.files === "object" ? data.files : {},
    };
  } catch {
    throw new Error("ホワイトボードファイル（.excalidraw）の形式が不正です");
  }

  const rawName = filenameFromStoragePath(storagePath).replace(
    /\.excalidraw$/i,
    ""
  );
  const { note } = await api("/notes", {
    method: "POST",
    body: JSON.stringify({ title: rawName || "無題のノート" }),
  });
  await api(`/notes/${note.id}/scene`, {
    method: "PUT",
    body: JSON.stringify({ scene }),
  });
  await openNote(note.id);
  statusEl.textContent = "クラウドから開きました";
}

/** エディタをアンマウント */
function unmountEditor() {
  if (reactRoot) {
    reactRoot.unmount();
    reactRoot = null;
  }
  excalidrawAPI = null;
  const rootEl = document.getElementById("excalidraw-root");
  if (rootEl) rootEl.innerHTML = "";
}

/** Excalidraw マウント */
function mountEditor(initialScene) {
  unmountEditor();
  const rootEl = document.getElementById("excalidraw-root");
  reactRoot = createRoot(rootEl);
  latestElements = initialScene?.elements ?? [];
  latestAppState = initialScene?.appState ?? {};
  latestFiles = initialScene?.files ?? {};

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

  reactRoot.render(
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

/** ローカル変更 */
function handleLocalChange(elements, appState, files) {
  if (applyingRemote) return;
  latestElements = elements;
  latestAppState = appState;
  latestFiles = files ?? {};

  statusEl.textContent = "保存中…";
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => persistToServer(), SAVE_DEBOUNCE_MS);

  if (broadcastTimer) clearTimeout(broadcastTimer);
  broadcastTimer = setTimeout(() => broadcastScene(), SCENE_BROADCAST_MS);
}

/** サーバーへ永続化 */
async function persistToServer() {
  if (!currentNote) return;
  try {
    await api(`/notes/${currentNote.id}/scene`, {
      method: "PUT",
      body: JSON.stringify({
        scene: {
          elements: latestElements,
          appState: pickAppState(latestAppState),
          files: latestFiles,
        },
      }),
    });
    statusEl.textContent = "保存済み";
  } catch {
    statusEl.textContent = "保存失敗";
  }
}

/** 保存する appState の抜粋 */
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

/** WebSocket 接続 */
function connectCollab({ noteId, token, name }) {
  disconnectCollab();
  const proto = location.protocol === "https:" ? "wss:" : "ws:";
  const params = new URLSearchParams();
  if (token) {
    params.set("token", token);
    if (name) params.set("name", name);
  } else if (noteId) {
    params.set("noteId", noteId);
  }
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

  ws.addEventListener("error", () => {
    peersEl.textContent = "接続エラー";
  });
}

/** 共同編集切断 */
function disconnectCollab() {
  if (socket) {
    try {
      socket.close();
    } catch {
      /* ignore */
    }
    socket = null;
  }
  clientId = null;
}

/** シーンを WS 送信 */
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

/** ポインタ送信 */
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

/** リモートシーン適用 */
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

/** 参加者表示 */
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

/** 共有モーダル */
async function openShareModal() {
  if (!currentNote) return;
  const share = await api(`/notes/${currentNote.id}/share`, { method: "POST" });
  currentNote.share_url = share.url;
  currentNote.share_token = share.token;
  shareUrlInput.value = share.url;
  shareModal.hidden = false;
}

function closeShareModal() {
  shareModal.hidden = true;
}

/** タイトル保存 */
let titleTimer = null;
titleInput.addEventListener("input", () => {
  if (!currentNote) return;
  if (titleTimer) clearTimeout(titleTimer);
  titleTimer = setTimeout(async () => {
    try {
      const { note } = await api(`/notes/${currentNote.id}`, {
        method: "PATCH",
        body: JSON.stringify({ title: titleInput.value }),
      });
      currentNote = { ...currentNote, ...note };
    } catch {
      /* ignore */
    }
  }, 500);
});

function handleCreateNote() {
  createNote().catch((e) => alert(e.message));
}

document.getElementById("new-note-btn").addEventListener("click", handleCreateNote);
document.getElementById("empty-new-note-btn").addEventListener("click", handleCreateNote);
document.getElementById("back-to-list").addEventListener("click", () => {
  showList().catch((e) => alert(e.message));
});
document.getElementById("share-btn").addEventListener("click", () => {
  openShareModal().catch((e) => alert(e.message));
});
document.getElementById("cloud-save-btn")?.addEventListener("click", () => {
  try {
    openCloudSave();
  } catch (e) {
    alert(e instanceof Error ? e.message : "保存に失敗しました");
  }
});
document.getElementById("copy-share-btn").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(shareUrlInput.value);
    statusEl.textContent = "リンクをコピーしました";
  } catch {
    shareUrlInput.select();
  }
});
document.getElementById("revoke-share-btn").addEventListener("click", async () => {
  if (!currentNote) return;
  if (!window.confirm("共有リンクを無効化しますか？")) return;
  await api(`/notes/${currentNote.id}/share`, { method: "DELETE" });
  currentNote.share_url = null;
  currentNote.share_token = null;
  closeShareModal();
  statusEl.textContent = "共有を解除しました";
});
shareModal.querySelectorAll("[data-close-modal]").forEach((el) => {
  el.addEventListener("click", closeShareModal);
});

const cloudSaveDialog = document.getElementById("excal-cloud-save-dialog");
const cloudSaveModal = cloudSaveDialog
  ? createCloudSaveModal(cloudSaveDialog, {
      idPrefix: "excal-cloud-save",
      loginNext: "/apps/excalidraw/",
    })
  : null;

const allowed = await checkAccess();
if (allowed) {
  loadingEl.hidden = true;
  const urlParams = new URL(location.href).searchParams;
  const noteIdParam = urlParams.get("noteId")?.trim();
  const storagePath = urlParams.get("storagePath")?.trim();
  if (noteIdParam) {
    listView.hidden = true;
    editorView.hidden = false;
    try {
      await openNote(noteIdParam);
      history.replaceState({}, "", `/apps/excalidraw/?noteId=${encodeURIComponent(noteIdParam)}`);
    } catch (e) {
      alert(e instanceof Error ? e.message : "ノートを開けませんでした");
      await showList();
    }
  } else if (storagePath) {
    listView.hidden = true;
    editorView.hidden = false;
    try {
      await openFromStoragePath(storagePath);
      history.replaceState({}, "", "/apps/excalidraw/");
    } catch (e) {
      alert(e instanceof Error ? e.message : "ファイルを開けませんでした");
      await showList();
    }
  } else {
    await showList();
  }
}

export { connectCollab, mountEditor, applyRemoteScene };
