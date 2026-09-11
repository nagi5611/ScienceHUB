/**
 * Runa — ダッシュボード用パネル UI
 */

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|bmp|ico)$/i;
const TEXT_EXT = /\.(txt|md|json|csv|log|xml|html?|css|js|ts|tsx|jsx|py|sh|yaml|yml)$/i;

/** HTML エスケープ */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 軽量 Markdown（太字・斜体・コード・リンク） */
function renderMarkdown(text) {
  if (!text) return "";

  const placeholders = [];
  let safe = escapeHtml(text);

  safe = safe.replace(/```([\s\S]*?)```/g, (_, code) => {
    const key = `@@CODEBLOCK${placeholders.length}@@`;
    placeholders.push(
      `<pre class="runa-md-pre"><code>${code}</code></pre>`
    );
    return key;
  });

  safe = safe.replace(/`([^`\n]+)`/g, '<code class="runa-md-code">$1</code>');
  safe = safe.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  safe = safe.replace(/__([^_\n]+)__/g, "<strong>$1</strong>");
  safe = safe.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  safe = safe.replace(/_([^_\n]+)_/g, "<em>$1</em>");
  safe = safe.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  for (let i = 0; i < placeholders.length; i += 1) {
    safe = safe.replace(`@@CODEBLOCK${i}@@`, placeholders[i]);
  }

  return safe.replace(/\n/g, "<br>");
}

function renderMessageContent(msg) {
  if (!msg.content) return "";
  if (msg.role === "assistant") {
    return `<div class="runa-msg-content runa-md">${renderMarkdown(msg.content)}</div>`;
  }
  return `<div class="runa-msg-content">${escapeHtml(msg.content)}</div>`;
}

/** 要素参照 */
const els = {
  fab: document.getElementById("runa-fab"),
  panel: document.getElementById("runa-panel"),
  close: document.getElementById("runa-close"),
  backdrop: document.getElementById("runa-backdrop"),
  messages: document.getElementById("runa-messages"),
  files: document.getElementById("runa-files"),
  preview: document.getElementById("runa-preview"),
  form: document.getElementById("runa-form"),
  input: document.getElementById("runa-input"),
  send: document.getElementById("runa-send"),
  status: document.getElementById("runa-status"),
  tabs: document.querySelectorAll("[data-runa-tab]"),
  tabPanels: document.querySelectorAll("[data-runa-panel]"),
};

/** @type {Array<{ id?: string, role: string, content: string, files?: object[], pending?: boolean, statusLabel?: string }>} */
let messageState = [];
/** @type {object[]} */
let fileItems = [];
let chatBusy = false;
/** @type {object | null} */
let selectedFile = null;
/** @type {string | null} */
let previewObjectUrl = null;
let runaDataLoaded = false;
let runaDataLoadFailed = false;
/** @type {HTMLElement | null} */
let pendingAssistantRow = null;
let recentFilesLoaded = false;

/** タブ休止・ページ離脱で失敗しやすい fetch を安全に実行 */
async function safeFetch(url, options) {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (error instanceof TypeError) return null;
    throw error;
  }
}

function isTransientNetworkError(error) {
  if (!(error instanceof TypeError)) return false;
  const message = String(error.message || "");
  return (
    message.includes("Failed to fetch") ||
    message.includes("NetworkError") ||
    message.includes("ERR_NETWORK_IO_SUSPENDED") ||
    message.includes("Load failed")
  );
}

function formatBytes(bytes) {
  if (bytes == null || bytes < 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

function formatUpdatedAt(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
}

function setPanelOpen(open) {
  if (!els.panel || !els.fab) return;
  els.panel.classList.toggle("is-open", open);
  els.panel.setAttribute("aria-hidden", open ? "false" : "true");
  els.fab.setAttribute("aria-expanded", open ? "true" : "false");
  if (open) {
    void ensureRunaDataLoaded();
    if (els.input) els.input.focus();
  }
}

function setActiveTab(tabId) {
  for (const btn of els.tabs) {
    const active = btn.getAttribute("data-runa-tab") === tabId;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-selected", active ? "true" : "false");
  }
  for (const panel of els.tabPanels) {
    const show = panel.getAttribute("data-runa-panel") === tabId;
    panel.hidden = !show;
  }
  if (tabId === "files" && !recentFilesLoaded) {
    void loadRecentFiles();
  }
}

const ACTIVITY_PHASE_LABELS = {
  thinking: "thinking",
  working: "working",
  writing: "writing",
};

function renderActivityHtml(activity) {
  const phase = ACTIVITY_PHASE_LABELS[activity.phase] || activity.phase;
  const done = activity.state === "done";
  const open = activity.open ? " open" : "";
  const doneClass = done ? " is-done" : " is-active";
  const detail = activity.detail
    ? `<div class="runa-activity-detail">${escapeHtml(activity.detail)}</div>`
    : "";
  return `<details class="runa-activity runa-activity--${activity.phase}${doneClass}"${open} data-activity-id="${escapeHtml(activity.id)}">
    <summary><span class="runa-activity-phase">${phase}</span><span class="runa-activity-chevron">›</span> ${escapeHtml(activity.label || phase)}</summary>
    ${detail}
  </details>`;
}

function renderActivitiesHtml(activities) {
  if (!activities?.length) return "";
  return `<div class="runa-activities">${activities.map(renderActivityHtml).join("")}</div>`;
}

function renderMessageHtml(msg) {
  const roleClass =
    msg.role === "user" ? "runa-msg--user" : "runa-msg--assistant";
  const streamingClass =
    msg.pending && msg.role === "assistant" && msg.content
      ? " is-streaming"
      : "";
  const activities = renderActivitiesHtml(msg.activities);
  const content = renderMessageContent(msg);
  return `<div class="runa-msg ${roleClass}">
    <div class="runa-msg-bubble${streamingClass}">${activities}${content}</div>
  </div>`;
}

function scrollMessagesToBottom() {
  if (els.messages) els.messages.scrollTop = els.messages.scrollHeight;
}

function renderMessages() {
  if (!els.messages) return;
  pendingAssistantRow = null;
  if (!messageState.length) {
    els.messages.innerHTML =
      '<p class="runa-empty">Runa にファイルの検索や操作を依頼できます。</p>';
    return;
  }

  els.messages.innerHTML = messageState.map(renderMessageHtml).join("");
  scrollMessagesToBottom();
}

function bindActivityToggleHandlers(root) {
  for (const el of root.querySelectorAll(".runa-activity")) {
    el.addEventListener("toggle", () => {
      const id = el.getAttribute("data-activity-id");
      const pending = messageState.find((m) => m.pending);
      const item = pending?.activities?.find((a) => a.id === id);
      if (item) item.open = el.open;
    });
  }
}

/** ストリーミング中のアシスタント吹き出しを差分更新 */
function mountPendingAssistantBubble(pending) {
  if (!els.messages) return;
  const empty = els.messages.querySelector(".runa-empty");
  if (empty) empty.remove();

  const wrapper = document.createElement("div");
  wrapper.innerHTML = renderMessageHtml(pending);
  const row = wrapper.firstElementChild;
  if (!row) return;

  els.messages.appendChild(row);
  pendingAssistantRow = row;
  bindActivityToggleHandlers(row);
  scrollMessagesToBottom();
}

function updatePendingAssistantBubble(pending) {
  if (!pendingAssistantRow) {
    mountPendingAssistantBubble(pending);
    return;
  }
  const bubble = pendingAssistantRow.querySelector(".runa-msg-bubble");
  if (!bubble) return;

  bubble.classList.toggle("is-streaming", Boolean(pending.content));
  bubble.innerHTML = `${renderActivitiesHtml(pending.activities)}${renderMessageContent(pending)}`;
  bindActivityToggleHandlers(pendingAssistantRow);

  const active = pending.activities?.find((a) => a.state !== "done");
  setStatus(active?.label || "");
  scrollMessagesToBottom();
}

function applyActivityEvent(pending, payload) {
  if (!payload?.id || !payload.phase) return;
  if (!pending.activities) pending.activities = [];

  const existing = pending.activities.find((a) => a.id === payload.id);
  if (payload.state === "start") {
    if (!existing) {
      pending.activities.push({
        id: payload.id,
        phase: payload.phase,
        label: payload.label,
        detail: payload.detail || "",
        state: "start",
        open: false,
      });
    }
    return;
  }

  if (existing) {
    existing.state = payload.state || "done";
    if (payload.detail) existing.detail = payload.detail;
    if (!existing.label && payload.label) existing.label = payload.label;
  }
}

function renderFiles() {
  if (!els.files) return;
  if (!fileItems.length) {
    els.files.innerHTML = '<p class="runa-empty">ファイルがありません</p>';
    return;
  }

  els.files.innerHTML = fileItems
    .map((item) => {
      const active = selectedFile?.path === item.path ? " is-active" : "";
      const typeLabel = item.type === "folder" ? "📁" : "📄";
      return `<button type="button" class="runa-file-item${active}" data-path="${escapeHtml(item.path)}">
        <span class="runa-file-icon" aria-hidden="true">${typeLabel}</span>
        <span class="runa-file-meta">
          <span class="runa-file-name">${escapeHtml(item.name)}</span>
          <span class="runa-file-path">${escapeHtml(item.path)}</span>
          <span class="runa-file-sub">${escapeHtml(formatBytes(item.sizeBytes))}${item.updatedAt ? ` · ${formatUpdatedAt(item.updatedAt)}` : ""}</span>
        </span>
      </button>`;
    })
    .join("");

  for (const btn of els.files.querySelectorAll(".runa-file-item")) {
    btn.addEventListener("click", () => {
      const path = btn.getAttribute("data-path");
      const item = fileItems.find((f) => f.path === path);
      if (item) selectFile(item);
    });
  }
}

function revokePreviewUrl() {
  if (previewObjectUrl) {
    URL.revokeObjectURL(previewObjectUrl);
    previewObjectUrl = null;
  }
}

async function fetchDownloadInfo(storagePath) {
  const response = await fetch(
    `/api/storage/download/url?path=${encodeURIComponent(storagePath)}`,
    { credentials: "same-origin" }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? "ダウンロード URL の取得に失敗しました");
  }
  return data;
}

async function fetchDownloadBlob(storagePath) {
  const info = await fetchDownloadInfo(storagePath);
  if (info.mode === "direct" && info.url) {
    const response = await fetch(info.url);
    if (!response.ok) throw new Error("ダウンロードに失敗しました");
    return response.blob();
  }
  const response = await fetch(
    `/api/storage/download?path=${encodeURIComponent(storagePath)}`,
    { credentials: "same-origin" }
  );
  if (!response.ok) throw new Error("ダウンロードに失敗しました");
  return response.blob();
}

async function selectFile(item) {
  selectedFile = item;
  renderFiles();
  setActiveTab("preview");
  if (!els.preview) return;

  if (item.type === "folder") {
    els.preview.innerHTML = `<p class="runa-empty">フォルダ: ${escapeHtml(item.path)}</p>
      <p class="runa-preview-hint">チャットで「${escapeHtml(item.path)} の一覧」と依頼できます。</p>`;
    return;
  }

  els.preview.innerHTML = '<p class="runa-empty">読み込み中…</p>';
  revokePreviewUrl();

  const name = item.name || item.path;
  try {
    if (IMAGE_EXT.test(name)) {
      const blob = await fetchDownloadBlob(item.path);
      previewObjectUrl = URL.createObjectURL(blob);
      els.preview.innerHTML = `<img class="runa-preview-img" src="${previewObjectUrl}" alt="${escapeHtml(name)}">`;
      return;
    }

    if (TEXT_EXT.test(name)) {
      const blob = await fetchDownloadBlob(item.path);
      const text = await blob.text();
      const capped = text.length > 50000 ? `${text.slice(0, 50000)}\n…（省略）` : text;
      els.preview.innerHTML = `<pre class="runa-preview-text">${escapeHtml(capped)}</pre>`;
      return;
    }

    const info = await fetchDownloadInfo(item.path);
    const openUrl =
      info.mode === "direct" && info.url
        ? info.url
        : `/api/storage/download?path=${encodeURIComponent(item.path)}`;
    els.preview.innerHTML = `<p class="runa-preview-meta">${escapeHtml(item.path)}</p>
      <p class="runa-preview-hint">${escapeHtml(formatBytes(item.sizeBytes))}</p>
      <a class="runa-preview-link" href="${escapeHtml(openUrl)}" target="_blank" rel="noopener noreferrer">ファイルを開く</a>`;
  } catch (error) {
    els.preview.innerHTML = `<p class="runa-empty">${escapeHtml(error.message || "プレビューに失敗しました")}</p>`;
  }
}

function mergeFileItems(items) {
  const map = new Map(fileItems.map((f) => [f.path, f]));
  for (const item of items) {
    map.set(item.path, item);
  }
  fileItems = Array.from(map.values());
  renderFiles();
}

function setStatus(text) {
  if (!els.status) return;
  els.status.textContent = text || "";
  els.status.hidden = !text;
}

function setChatBusy(busy) {
  chatBusy = busy;
  if (els.send) els.send.disabled = busy;
  if (els.input) els.input.disabled = busy;
}

async function loadMessages() {
  const res = await safeFetch("/api/runa/messages?limit=50", {
    credentials: "same-origin",
  });
  if (!res?.ok) return false;
  const data = await res.json();
  messageState = (data.messages ?? []).map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    files: m.files,
  }));
  for (const msg of messageState) {
    if (msg.files?.length) mergeFileItems(msg.files);
  }
  renderMessages();
  return true;
}

async function loadRecentFiles() {
  if (recentFilesLoaded) return true;
  const res = await safeFetch("/api/runa/recent-files?limit=20", {
    credentials: "same-origin",
  });
  if (!res?.ok) return false;
  const data = await res.json();
  if (data.items?.length) mergeFileItems(data.items);
  recentFilesLoaded = true;
  return true;
}

/** 初回パネル開時（または再表示後）にチャット履歴を読み込む */
async function ensureRunaDataLoaded() {
  if (runaDataLoaded) return;
  try {
    const messagesOk = await loadMessages();
    runaDataLoaded = messagesOk;
    runaDataLoadFailed = !runaDataLoaded;
  } catch (error) {
    runaDataLoadFailed = true;
    if (!isTransientNetworkError(error)) {
      console.warn("Runa データの読み込みに失敗しました", error);
    }
  }
}

async function postRunaChat(message) {
  const res = await fetch("/api/runa/chat?stream=1", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "リクエストに失敗しました");
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("text/event-stream") || !res.body) {
    return await res.json();
  }

  const pending = {
    role: "assistant",
    content: "",
    pending: true,
    activities: [],
  };
  messageState.push(pending);
  mountPendingAssistantBubble(pending);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finalResult = null;

  const handleEvent = (eventName, dataStr) => {
    if (!dataStr) return;
    let payload;
    try {
      payload = JSON.parse(dataStr);
    } catch {
      return;
    }
    if (eventName === "activity") {
      applyActivityEvent(pending, payload);
      updatePendingAssistantBubble(pending);
    } else if (eventName === "status" && payload.label) {
      setStatus(payload.label);
    } else if (eventName === "delta" && payload.text) {
      pending.content += payload.text;
      updatePendingAssistantBubble(pending);
    } else if (eventName === "files" && Array.isArray(payload.items)) {
      mergeFileItems(payload.items);
    } else if (eventName === "done") {
      finalResult = payload;
    } else if (eventName === "error") {
      throw new Error(payload.message || "エラーが発生しました");
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";
    for (const part of parts) {
      const lines = part.split("\n");
      let eventName = "message";
      let dataStr = "";
      for (const line of lines) {
        if (line.startsWith("event:")) eventName = line.slice(6).trim();
        if (line.startsWith("data:")) dataStr += line.slice(5).trim();
      }
      handleEvent(eventName, dataStr);
    }
  }

  pending.pending = false;
  if (finalResult?.message && !pending.content) {
    pending.content = finalResult.message;
  }
  if (finalResult?.files?.length) {
    mergeFileItems(finalResult.files);
  }
  setStatus("");
  pendingAssistantRow = null;
  renderMessages();
  return finalResult;
}

async function handleSubmit(event) {
  event.preventDefault();
  if (!els.input || chatBusy) return;
  const text = els.input.value.trim();
  if (!text) return;

  messageState.push({ role: "user", content: text });
  els.input.value = "";
  renderMessages();
  setChatBusy(true);

  try {
    await postRunaChat(text);
  } catch (error) {
    messageState.push({
      role: "assistant",
      content: error.message || "エラーが発生しました",
    });
    setStatus("");
    renderMessages();
  } finally {
    setChatBusy(false);
  }
}

function bindEvents() {
  els.fab?.addEventListener("click", () => setPanelOpen(true));
  els.close?.addEventListener("click", () => setPanelOpen(false));
  els.backdrop?.addEventListener("click", () => setPanelOpen(false));
  els.form?.addEventListener("submit", handleSubmit);

  for (const btn of els.tabs) {
    btn.addEventListener("click", () => {
      setActiveTab(btn.getAttribute("data-runa-tab") || "chat");
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && els.panel?.classList.contains("is-open")) {
      setPanelOpen(false);
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible" || !runaDataLoadFailed) return;
    runaDataLoaded = false;
    if (els.panel?.classList.contains("is-open")) {
      void ensureRunaDataLoaded();
    }
  });
}

export function initRunaPanel() {
  if (!els.fab || !els.panel) return;
  bindEvents();
  setActiveTab("chat");
}

initRunaPanel();
