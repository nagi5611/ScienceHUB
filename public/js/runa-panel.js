/**
 * Runa — ダッシュボード用パネル UI
 */

import { prepareAttachmentFile } from "./runa-attachments/prepare.js";

const MAX_ATTACHMENTS = 5;
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

/** HTML エスケープ */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 論理パスの親ディレクトリ */
function parentStoragePath(logicalPath) {
  const parts = String(logicalPath).split("/").filter(Boolean);
  if (parts.length <= 2) return logicalPath;
  return parts.slice(0, -1).join("/");
}

/** クラウドストレージで開く URL */
function storageBrowserUrl(logicalPath, type = "file") {
  const target =
    type === "folder" ? logicalPath : parentStoragePath(logicalPath);
  return `/apps/cloud-storage/?path=${encodeURIComponent(target)}`;
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
    /\[([^\]]+)\]\((\/apps\/cloud-storage\/\?[^)\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  safe = safe.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  for (let i = 0; i < placeholders.length; i += 1) {
    safe = safe.replace(`@@CODEBLOCK${i}@@`, placeholders[i]);
  }

  return safe.replace(/\n/g, "<br>");
}

function renderFileRefsHtml(files) {
  if (!files?.length) return "";
  const items = files
    .map((f) => {
      const type = f.type === "folder" ? "folder" : "file";
      const icon = type === "folder" ? "📁" : "📄";
      const openUrl = storageBrowserUrl(f.path, type);
      const openLabel = type === "folder" ? "フォルダを開く" : "フォルダで開く";
      return `<li class="runa-file-ref">
        <span class="runa-file-ref-icon" aria-hidden="true">${icon}</span>
        <span class="runa-file-ref-name">${escapeHtml(f.name)}</span>
        <a class="runa-file-ref-link" href="${escapeHtml(openUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(openLabel)}</a>
      </li>`;
    })
    .join("");
  return `<ul class="runa-file-refs">${items}</ul>`;
}

function renderMessageContent(msg) {
  if (!msg.content && !msg.files?.length) return "";
  const filesHtml = renderFileRefsHtml(msg.files);
  if (!msg.content) return filesHtml;
  if (msg.role === "assistant") {
    return `<div class="runa-msg-content runa-md">${renderMarkdown(msg.content)}</div>${filesHtml}`;
  }
  return `<div class="runa-msg-content">${escapeHtml(msg.content)}</div>${filesHtml}`;
}

/** 要素参照 */
const els = {
  fab: document.getElementById("runa-fab"),
  panel: document.getElementById("runa-panel"),
  close: document.getElementById("runa-close"),
  newChat: document.getElementById("runa-new-chat"),
  backdrop: document.getElementById("runa-backdrop"),
  messages: document.getElementById("runa-messages"),
  attachList: document.getElementById("runa-attach-list"),
  form: document.getElementById("runa-form"),
  input: document.getElementById("runa-input"),
  send: document.getElementById("runa-send"),
  attachBtn: document.getElementById("runa-attach-btn"),
  fileInput: document.getElementById("runa-file-input"),
  body: document.querySelector(".runa-body"),
  status: document.getElementById("runa-status"),
};

/** @type {Array<{ id?: string, role: string, content: string, files?: object[], pending?: boolean, activities?: object[] }>} */
let messageState = [];
let chatBusy = false;
let runaDataLoaded = false;
let runaDataLoadFailed = false;
/** @type {HTMLElement | null} */
let pendingAssistantRow = null;
/** @type {{ id: string, name: string, path?: string, uploading?: boolean, statusLabel?: string, extractedText?: string, imagePaths?: string[] }[]} */
let pendingAttachments = [];
let attachDragDepth = 0;
/** @type {string | null} */
let currentUsername = null;

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

function setPanelOpen(open) {
  if (!els.panel || !els.fab) return;
  els.panel.classList.toggle("is-open", open);
  els.panel.setAttribute("aria-hidden", open ? "false" : "true");
  els.fab.setAttribute("aria-expanded", open ? "true" : "false");
  if (open) {
    void ensureRunaDataLoaded();
    if (els.input) els.input.focus();
  } else {
    attachDragDepth = 0;
    setAttachDragOver(false);
  }
}

const ACTIVITY_PHASE_LABELS = {
  thinking: "考え中",
  working: "実行中",
  writing: "作成中",
};

function renderActivityHtml(activity) {
  const phase = ACTIVITY_PHASE_LABELS[activity.phase] || activity.phase;
  const done = activity.state === "done";
  const open = activity.open ? " open" : "";
  const doneClass = done ? " is-done" : " is-active";
  const detailText =
    activity.detail ||
    (done ? "（詳細は記録されませんでした）" : "処理中…");
  const detail = `<div class="runa-activity-detail">${escapeHtml(detailText)}</div>`;
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
      '<p class="runa-empty">Runa にファイルの検索や操作を依頼できます。📎 でファイルを添付できます。</p>';
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
    if (payload.state === "update") {
      if (payload.detail) existing.detail = payload.detail;
      return;
    }
    existing.state = payload.state || "done";
    if (payload.detail) existing.detail = payload.detail;
    if (!existing.label && payload.label) existing.label = payload.label;
  }
}

function renderPendingAttachments() {
  if (!els.attachList) return;
  if (!pendingAttachments.length) {
    els.attachList.hidden = true;
    els.attachList.innerHTML = "";
    return;
  }

  els.attachList.hidden = false;
  els.attachList.innerHTML = pendingAttachments
    .map((item) => {
      const label = item.uploading
        ? `${item.name}（${item.statusLabel || "アップロード中…"}）`
        : item.statusLabel
          ? `${item.name}（${item.statusLabel}）`
          : item.name;
      return `<span class="runa-attach-chip" data-id="${escapeHtml(item.id)}">
        <span class="runa-attach-chip-name">${escapeHtml(label)}</span>
        <button type="button" class="runa-attach-chip-remove" aria-label="添付を削除" data-id="${escapeHtml(item.id)}">×</button>
      </span>`;
    })
    .join("");

  for (const btn of els.attachList.querySelectorAll(".runa-attach-chip-remove")) {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      pendingAttachments = pendingAttachments.filter((a) => a.id !== id);
      renderPendingAttachments();
    });
  }
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
  if (els.attachBtn) els.attachBtn.disabled = busy;
}

async function ensureUsername() {
  if (currentUsername) return currentUsername;
  const res = await safeFetch("/api/auth/me", { credentials: "same-origin" });
  if (!res?.ok) throw new Error("ユーザー情報の取得に失敗しました");
  const data = await res.json();
  currentUsername = data.user?.username;
  if (!currentUsername) throw new Error("ユーザー名を取得できません");
  return currentUsername;
}

async function uploadAttachmentBlob(blob, filename) {
  const username = await ensureUsername();
  const dirPath = `u/${username}/.runa-attachments`;
  const initRes = await fetch("/api/storage/upload/init", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path: dirPath,
      filename,
      size: blob.size,
    }),
  });
  const initData = await initRes.json().catch(() => ({}));
  if (!initRes.ok) {
    throw new Error(initData.error || "アップロードの開始に失敗しました");
  }
  if (initData.mode !== "simple") {
    throw new Error("大きなファイルはチャットから添付できません");
  }

  const uploadRes = await fetch(
    `/api/storage/upload/simple?sessionId=${encodeURIComponent(initData.sessionId)}`,
    {
      method: "PUT",
      credentials: "same-origin",
      body: blob,
    }
  );
  const uploadData = await uploadRes.json().catch(() => ({}));
  if (!uploadRes.ok) {
    throw new Error(uploadData.error || "アップロードに失敗しました");
  }

  return {
    path: uploadData.path,
    name: filename,
  };
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
  renderMessages();
  return true;
}

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

async function startNewChat() {
  if (chatBusy) return;
  const res = await fetch("/api/runa/messages", {
    method: "DELETE",
    credentials: "same-origin",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    setStatus(data.error || "新規チャットの開始に失敗しました");
    return;
  }
  messageState = [];
  pendingAttachments = [];
  renderPendingAttachments();
  renderMessages();
  setStatus("");
  if (els.input) els.input.focus();
}

async function postRunaChat(message, attachments) {
  const res = await fetch("/api/runa/chat?stream=1", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, attachments }),
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
    files: [],
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
      pending.files = payload.items;
      updatePendingAssistantBubble(pending);
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
    pending.files = finalResult.files;
  }
  setStatus("");
  pendingAssistantRow = null;
  renderMessages();
  return finalResult;
}

/** Enter / Ctrl+Enter で送信、Shift+Enter で改行 */
function handleInputKeydown(event) {
  if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;
  event.preventDefault();
  void handleSubmit(event);
}

async function handleSubmit(event) {
  event.preventDefault();
  if (!els.input || chatBusy) return;
  const text = els.input.value.trim();
  const readyAttachments = pendingAttachments.filter((a) => a.path && !a.uploading);
  if (!text && !readyAttachments.length) return;

  if (pendingAttachments.some((a) => a.uploading)) {
    setStatus("アップロード完了をお待ちください");
    return;
  }

  const attachments = readyAttachments.map((a) => ({
    path: a.path,
    name: a.name,
    extractedText: a.extractedText,
    imagePaths: a.imagePaths,
  }));

  messageState.push({
    role: "user",
    content: text,
    files: attachments.map((a) => ({
      name: a.name,
      path: a.path,
      type: "file",
      sizeBytes: null,
      updatedAt: null,
    })),
  });
  els.input.value = "";
  pendingAttachments = [];
  renderPendingAttachments();
  renderMessages();
  setChatBusy(true);

  try {
    await postRunaChat(text, attachments);
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

/** ファイル添付（選択・ドロップ共通） */
async function addAttachmentFiles(files) {
  for (const file of files) {
    if (pendingAttachments.length >= MAX_ATTACHMENTS) {
      setStatus(`添付は最大 ${MAX_ATTACHMENTS} 件までです`);
      break;
    }
    if (file.size > MAX_ATTACHMENT_BYTES) {
      setStatus(`${file.name} は ${formatBytes(MAX_ATTACHMENT_BYTES)} を超えています`);
      continue;
    }

    const id = `att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    pendingAttachments.push({
      id,
      name: file.name,
      uploading: true,
      statusLabel: "準備中…",
    });
    renderPendingAttachments();

    try {
      const prepared = await prepareAttachmentFile(file, {
        onProgress: (label) => {
          const pending = pendingAttachments.find((a) => a.id === id);
          if (pending) {
            pending.statusLabel = label;
            renderPendingAttachments();
          }
        },
      });

      if (prepared.status === "unsupported") {
        throw new Error(prepared.error || "この形式は添付できません");
      }
      if (prepared.status === "error") {
        throw new Error(prepared.error || "変換に失敗しました");
      }

      let originalPath;
      /** @type {string[]} */
      const imagePaths = [];
      const totalUploads = prepared.blobs.length;

      for (let uploadIndex = 0; uploadIndex < prepared.blobs.length; uploadIndex += 1) {
        const entry = prepared.blobs[uploadIndex];
        const pending = pendingAttachments.find((a) => a.id === id);
        if (pending) {
          pending.statusLabel =
            totalUploads > 1
              ? `アップロード中… ${uploadIndex + 1}/${totalUploads}`
              : "アップロード中…";
          renderPendingAttachments();
        }

        const uploaded = await uploadAttachmentBlob(entry.blob, entry.filename);
        if (entry.role === "original") {
          originalPath = uploaded.path;
        } else if (entry.role === "derived-image") {
          imagePaths.push(uploaded.path);
        }
      }

      const item = pendingAttachments.find((a) => a.id === id);
      if (item) {
        item.path = originalPath ?? imagePaths[0];
        item.name = file.name;
        item.extractedText = prepared.extractedText;
        item.imagePaths = imagePaths.length ? imagePaths : undefined;
        item.uploading = false;
        item.statusLabel = prepared.label;
      }
    } catch (error) {
      pendingAttachments = pendingAttachments.filter((a) => a.id !== id);
      const message =
        error instanceof Error && error.message
          ? error.message
          : "添付のアップロードに失敗しました";
      setStatus(message);
    }
    renderPendingAttachments();
  }
}

async function handleFileInputChange(event) {
  const input = event.target;
  const files = Array.from(input.files ?? []);
  input.value = "";
  await addAttachmentFiles(files);
}

function isFileDragEvent(event) {
  const types = event.dataTransfer?.types;
  if (!types) return false;
  return Array.from(types).includes("Files");
}

function setAttachDragOver(active) {
  els.body?.classList.toggle("is-drag-over", active);
}

function handleAttachDragEnter(event) {
  if (!els.body || chatBusy || !isFileDragEvent(event)) return;
  event.preventDefault();
  attachDragDepth += 1;
  setAttachDragOver(true);
}

function handleAttachDragOver(event) {
  if (!els.body || chatBusy || !isFileDragEvent(event)) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
}

function handleAttachDragLeave(event) {
  if (!els.body?.classList.contains("is-drag-over")) return;
  event.preventDefault();
  attachDragDepth = Math.max(0, attachDragDepth - 1);
  if (attachDragDepth === 0) setAttachDragOver(false);
}

function handleAttachDrop(event) {
  if (!els.body || chatBusy) return;
  event.preventDefault();
  attachDragDepth = 0;
  setAttachDragOver(false);
  const files = Array.from(event.dataTransfer?.files ?? []);
  if (!files.length) return;
  void addAttachmentFiles(files);
}

function bindEvents() {
  els.fab?.addEventListener("click", () => setPanelOpen(true));
  els.close?.addEventListener("click", () => setPanelOpen(false));
  els.backdrop?.addEventListener("click", () => setPanelOpen(false));
  els.newChat?.addEventListener("click", () => void startNewChat());
  els.form?.addEventListener("submit", handleSubmit);
  els.input?.addEventListener("keydown", handleInputKeydown);
  els.attachBtn?.addEventListener("click", () => els.fileInput?.click());
  els.fileInput?.addEventListener("change", handleFileInputChange);
  els.body?.addEventListener("dragenter", handleAttachDragEnter);
  els.body?.addEventListener("dragover", handleAttachDragOver);
  els.body?.addEventListener("dragleave", handleAttachDragLeave);
  els.body?.addEventListener("drop", handleAttachDrop);

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
}

initRunaPanel();
