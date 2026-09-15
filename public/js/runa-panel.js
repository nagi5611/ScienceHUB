/**
 * Runa — ダッシュボード用パネル UI
 */

import { prepareAttachmentFile } from "./runa-attachments/prepare.js";
import { iconHtml } from "./hub-icons.js";

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

/** クラウドストレージで開く URL（ファイルは file= で選択・強調表示） */
function storageBrowserUrl(logicalPath, type = "file") {
  const params = new URLSearchParams();
  if (type === "folder") {
    params.set("path", logicalPath);
  } else {
    params.set("path", parentStoragePath(logicalPath));
    params.set("file", logicalPath);
  }
  return `/apps/cloud-storage/?${params.toString()}`;
}

/** 画像ファイル名かどうか */
function isImageFileName(name) {
  return /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(String(name));
}

/** ストレージファイルのダウンロード URL（チャット内プレビュー用） */
function storageDownloadUrl(logicalPath) {
  return `/api/storage/download?path=${encodeURIComponent(logicalPath)}`;
}

/** @type {HTMLElement | null} */
let imageLightboxEl = null;

/** 画像ライトボックス DOM を用意 */
function ensureImageLightbox() {
  if (imageLightboxEl) return imageLightboxEl;

  const root = document.createElement("div");
  root.id = "runa-image-lightbox";
  root.className = "runa-image-lightbox";
  root.hidden = true;
  root.innerHTML = `<button type="button" class="runa-image-lightbox-backdrop" aria-label="閉じる"></button>
<figure class="runa-image-lightbox-dialog">
  <img class="runa-image-lightbox-img" alt="">
  <figcaption class="runa-image-lightbox-caption"></figcaption>
  <button type="button" class="runa-image-lightbox-edit">この画像を編集</button>
  <button type="button" class="runa-image-lightbox-close" aria-label="閉じる">×</button>
</figure>`;

  root.querySelector(".runa-image-lightbox-backdrop")?.addEventListener("click", closeImageLightbox);
  root.querySelector(".runa-image-lightbox-close")?.addEventListener("click", closeImageLightbox);
  root.querySelector(".runa-image-lightbox-edit")?.addEventListener("click", () => {
    const path = root.dataset.lightboxPath;
    const name = root.dataset.lightboxName || "";
    if (!path) return;
    closeImageLightbox();
    attachStorageReference({ path, name, type: "file" }, { forEdit: true });
  });

  document.body.appendChild(root);
  imageLightboxEl = root;
  return root;
}

/** 画像をポップアップで拡大表示 */
function openImageLightbox(src, alt = "", logicalPath = "") {
  const root = ensureImageLightbox();
  const img = root.querySelector(".runa-image-lightbox-img");
  const caption = root.querySelector(".runa-image-lightbox-caption");
  const editBtn = root.querySelector(".runa-image-lightbox-edit");
  if (!(img instanceof HTMLImageElement)) return;

  img.src = src;
  img.alt = alt;
  root.dataset.lightboxPath = logicalPath;
  root.dataset.lightboxName = alt;
  if (caption) caption.textContent = alt;
  if (editBtn instanceof HTMLButtonElement) {
    editBtn.hidden = !logicalPath;
  }
  root.hidden = false;
  document.body.classList.add("runa-lightbox-open");
  root.querySelector(".runa-image-lightbox-close")?.focus();
}

/** ライトボックスを閉じる。開いていれば true */
function closeImageLightbox() {
  if (!imageLightboxEl || imageLightboxEl.hidden) return false;
  const img = imageLightboxEl.querySelector(".runa-image-lightbox-img");
  if (img instanceof HTMLImageElement) {
    img.removeAttribute("src");
  }
  imageLightboxEl.hidden = true;
  document.body.classList.remove("runa-lightbox-open");
  return true;
}

/** チャット内プレビュー画像クリック */
function handleMessageAreaClick(event) {
  const editBtn = event.target.closest(".runa-file-ref-edit");
  if (editBtn) {
    event.preventDefault();
    const path = editBtn.getAttribute("data-path");
    const name = editBtn.getAttribute("data-name") || "";
    if (!path) return;
    const sizeRaw = editBtn.getAttribute("data-size-bytes");
    const sizeBytes = sizeRaw ? Number(sizeRaw) : null;
    attachStorageReference(
      {
        path,
        name,
        type: "file",
        sizeBytes: Number.isFinite(sizeBytes) ? sizeBytes : null,
      },
      { forEdit: true }
    );
    return;
  }

  const trigger = event.target.closest(".runa-file-ref-preview");
  if (!trigger) return;
  event.preventDefault();
  const src = trigger.getAttribute("data-lightbox-src");
  const alt = trigger.getAttribute("data-lightbox-alt") || "";
  const logicalPath = trigger.getAttribute("data-lightbox-path") || "";
  if (src) openImageLightbox(src, alt, logicalPath);
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
      const openLabel = type === "folder" ? "フォルダを開く" : "ストレージで開く";
      const previewHtml =
        type === "file" && isImageFileName(f.name)
          ? `<div class="runa-file-ref-preview-wrap">
              <button type="button" class="runa-file-ref-preview" data-lightbox-src="${escapeHtml(storageDownloadUrl(f.path))}" data-lightbox-alt="${escapeHtml(f.name)}" data-lightbox-path="${escapeHtml(f.path)}" title="${escapeHtml(f.name)}（クリックで拡大）">
                <img class="runa-preview-img" src="${escapeHtml(storageDownloadUrl(f.path))}" alt="${escapeHtml(f.name)}" loading="lazy">
              </button>
              <button type="button" class="runa-file-ref-edit" data-path="${escapeHtml(f.path)}" data-name="${escapeHtml(f.name)}" data-size-bytes="${f.sizeBytes ?? ""}">編集</button>
            </div>`
          : "";
      return `<li class="runa-file-ref">
        ${previewHtml}
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
  contextUsage: document.getElementById("runa-context-usage"),
  contextUsageFill: document.getElementById("runa-context-usage-fill"),
  contextUsagePct: document.getElementById("runa-context-usage-pct"),
  contextUsageTrack: document.getElementById("runa-context-usage-track"),
  contextUsageActions: document.getElementById("runa-context-usage-actions"),
  contextSummarizeBtn: document.getElementById("runa-context-summarize-btn"),
};

/** @type {Array<{ id?: string, role: string, content: string, files?: object[], pending?: boolean, activities?: object[] }>} */
let messageState = [];
let chatBusy = false;
let runaDataLoaded = false;
let runaDataLoadFailed = false;
/** @type {HTMLElement | null} */
let pendingAssistantRow = null;
/** @type {{ id: string, name: string, path?: string, uploading?: boolean, statusLabel?: string, extractedText?: string, imagePaths?: string[], storageRef?: boolean, sizeBytes?: number | null }[]} */
let pendingAttachments = [];
let attachDragDepth = 0;
/** @type {string | null} */
let pendingEditImagePath = null;
/** @type {{ usedTokens?: number, limitTokens?: number, percent?: number, accuracyWarningPercent?: number, isAccuracyDegrading?: boolean, summarizeThresholdPercent?: number, shouldSummarize?: boolean } | null} */
let contextUsageState = null;
let summarizeBusy = false;

const EDIT_INPUT_PLACEHOLDER = "変更したい内容を入力…";

/** 編集コンテキストをリセット */
function resetEditContext() {
  pendingEditImagePath = null;
  if (els.input && panelOptions.placeholder) {
    els.input.placeholder = panelOptions.placeholder;
  }
}

/** API 送信用コンテキスト（編集意図をマージ） */
function buildRunaChatContext() {
  const base = panelOptions.getContext?.() ?? {};
  if (!pendingEditImagePath) return base;
  return {
    ...base,
    editImagePath: pendingEditImagePath,
    editIntent: true,
  };
}
/** @type {{ getContext?: () => object | null, placeholder?: string, getContextLabel?: () => string | null }} */
let panelOptions = {};
let eventsBound = false;

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

function updateContextHint() {
  const hint = document.getElementById("runa-context-hint");
  if (!hint) return;
  const label = panelOptions.getContextLabel?.();
  if (label) {
    hint.textContent = label;
    hint.hidden = false;
  } else {
    hint.textContent = "";
    hint.hidden = true;
  }
}

/** コンテキスト使用率 UI を更新 */
function updateContextUsageDisplay(usage) {
  if (!usage || typeof usage.percent !== "number") return;
  contextUsageState = usage;

  if (!els.contextUsage || !els.contextUsageFill || !els.contextUsagePct) return;

  const percent = Math.max(0, Math.min(100, usage.percent));
  const autoThreshold = usage.summarizeThresholdPercent ?? 85;
  const warningThreshold = usage.accuracyWarningPercent ?? 50;
  const isDegrading =
    usage.isAccuracyDegrading ?? percent >= warningThreshold;

  els.contextUsage.hidden = false;
  els.contextUsageFill.style.width = `${percent}%`;
  els.contextUsagePct.textContent = `${percent}%`;
  els.contextUsage.classList.toggle("is-warning", isDegrading);
  els.contextUsage.classList.toggle("is-critical", percent >= autoThreshold);

  if (els.contextUsageActions) {
    els.contextUsageActions.hidden = !isDegrading;
  }
  if (els.contextSummarizeBtn) {
    els.contextSummarizeBtn.disabled =
      summarizeBusy || chatBusy || !isDegrading;
  }

  if (els.contextUsageTrack) {
    els.contextUsageTrack.setAttribute("aria-valuenow", String(Math.round(percent)));
    els.contextUsageTrack.title = usage.usedTokens
      ? `約 ${usage.usedTokens.toLocaleString()} / ${usage.limitTokens?.toLocaleString() ?? "?"} tokens`
      : "";
  }
}

/** 手動で会話履歴を要約 */
async function requestContextSummarize() {
  if (summarizeBusy || chatBusy) return;
  if (!contextUsageState?.isAccuracyDegrading && (contextUsageState?.percent ?? 0) < 50) {
    return;
  }

  summarizeBusy = true;
  updateContextUsageDisplay(contextUsageState);
  setStatus("会話履歴を要約しています…");

  try {
    const res = await fetch("/api/runa/summarize", {
      method: "POST",
      credentials: "same-origin",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || "要約に失敗しました");
    }

    messageState = (data.messages ?? []).map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      files: m.files,
    }));
    updateContextUsageDisplay(data.contextUsage);
    renderMessages();
    setStatus("会話を要約しました");
  } catch (error) {
    setStatus(error.message || "要約に失敗しました");
  } finally {
    summarizeBusy = false;
    if (contextUsageState) updateContextUsageDisplay(contextUsageState);
  }
}

function setPanelOpen(open) {
  if (!els.panel || !els.fab) return;
  els.panel.classList.toggle("is-open", open);
  els.panel.setAttribute("aria-hidden", open ? "false" : "true");
  els.fab.setAttribute("aria-expanded", open ? "true" : "false");
  if (open) {
    updateContextHint();
    void ensureRunaDataLoaded();
    if (els.input) els.input.focus();
  } else {
    attachDragDepth = 0;
    setAttachDragOver(false);
  }
}

const ACTIVITY_PHASE_LABELS = {
  thinking: "thinking..",
  working: "working..",
  writing: "writing..",
};

function getCompactPhaseLabel(phase) {
  return ACTIVITY_PHASE_LABELS[phase] || `${phase}..`;
}

function getActivityDetailText(activity) {
  if (activity.detail?.trim()) return activity.detail;
  if (activity.phase === "working" && activity.label && activity.label !== getCompactPhaseLabel(activity.phase)) {
    return activity.label;
  }
  if (activity.state !== "done") return "処理中…";
  return "（詳細は記録されませんでした）";
}

let pendingBubbleRaf = 0;
let lastActivityDetailPaintAt = 0;

/** 推論ストリーム等の高頻度更新をまとめて描画 */
function schedulePendingBubbleUpdate(pending) {
  if (pendingBubbleRaf) return;
  pendingBubbleRaf = requestAnimationFrame(() => {
    pendingBubbleRaf = 0;
    lastActivityDetailPaintAt = Date.now();
    updatePendingAssistantBubble(pending);
  });
}

function renderLivePhaseHtml(activities) {
  const active = activities?.find((a) => a.state !== "done");
  if (!active) return "";
  const compact = getCompactPhaseLabel(active.phase);
  return `<div class="runa-live-phase" aria-live="polite">
    <span class="runa-live-phase-dot" aria-hidden="true"></span>
    <span class="runa-live-phase-text runa-live-phase-compact">${escapeHtml(compact)}</span>
  </div>`;
}

function renderActivityHtml(activity) {
  const compact = getCompactPhaseLabel(activity.phase);
  const done = activity.state === "done";
  const open = activity.open ? " open" : "";
  const doneClass = done ? " is-done" : " is-active";
  const streaming =
    !done && (activity.phase === "thinking" || activity.phase === "writing");
  const detailText = getActivityDetailText(activity);
  const detail = `<div class="runa-activity-detail${streaming ? " is-streaming" : ""}">${escapeHtml(detailText)}</div>`;
  return `<details class="runa-activity runa-activity--${activity.phase}${doneClass}"${open} data-activity-id="${escapeHtml(activity.id)}">
    <summary><span class="runa-activity-phase">${escapeHtml(compact)}</span><span class="runa-activity-chevron" aria-hidden="true">›</span></summary>
    ${detail}
  </details>`;
}

function renderActivitiesHtml(activities) {
  if (!activities?.length) return "";
  const live = renderLivePhaseHtml(activities);
  const items = activities.map(renderActivityHtml).join("");
  return `${live}<div class="runa-activities">${items}</div>`;
}

/** Cursor 風コンパクト TODO カード */
function renderRunaTodosHtml(taskPlan) {
  const tasks = taskPlan?.tasks;
  if (!tasks?.length) return "";

  const current = taskPlan.current ?? 0;
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const allDone = doneCount === tasks.length;

  const items = tasks
    .map((task, index) => {
      const isDone = task.status === "done";
      const isFailed = task.status === "failed";
      const isCurrent = !isDone && !isFailed && index === current;
      const stateClass = isDone
        ? " is-done"
        : isFailed
          ? " is-failed"
          : isCurrent
            ? " is-current"
            : "";

      let icon = "○";
      if (isDone) icon = "✓";
      else if (isFailed) icon = "✕";
      else if (isCurrent) {
        icon = '<span class="runa-todo-spinner" aria-hidden="true"></span>';
      }

      return `<li class="runa-todo-item${stateClass}">
        <span class="runa-todo-check" aria-hidden="true">${icon}</span>
        <span class="runa-todo-label">${escapeHtml(task.title)}</span>
      </li>`;
    })
    .join("");

  const statusText = allDone
    ? "完了"
    : `${doneCount} / ${tasks.length} 完了`;

  return `<div class="runa-chat-todos" aria-label="作業タスク">
    <div class="runa-chat-todos-head">
      <span class="runa-chat-todos-title">To-do</span>
      <span class="runa-chat-todos-meta">${escapeHtml(statusText)}</span>
    </div>
    <ul class="runa-chat-todos-list">${items}</ul>
  </div>`;
}

function renderAssistantExtrasHtml(msg) {
  const todos = renderRunaTodosHtml(msg.taskPlan);
  const activities = renderActivitiesHtml(msg.activities);
  return `${todos}${activities}`;
}

function renderMessageHtml(msg) {
  const roleClass =
    msg.role === "user" ? "runa-msg--user" : "runa-msg--assistant";
  const summaryClass =
    msg.role === "assistant" &&
    typeof msg.content === "string" &&
    msg.content.startsWith("[Runa 会話サマリー")
      ? " runa-msg--summary"
      : "";
  const streamingClass =
    msg.pending && msg.role === "assistant" && msg.content
      ? " is-streaming"
      : "";
  const extras = msg.role === "assistant" ? renderAssistantExtrasHtml(msg) : "";
  const content = renderMessageContent(msg);
  return `<div class="runa-msg ${roleClass}${summaryClass}">
    <div class="runa-msg-bubble${streamingClass}">${extras}${content}</div>
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

  const livePhase = root.querySelector(".runa-live-phase");
  if (livePhase && !livePhase.dataset.bound) {
    livePhase.dataset.bound = "1";
    livePhase.classList.add("is-clickable");
    livePhase.addEventListener("click", () => {
      const pending = messageState.find((m) => m.pending);
      const active = pending?.activities?.find((a) => a.state !== "done");
      if (!active || !pendingAssistantRow) return;
      active.open = true;
      const details = pendingAssistantRow.querySelector(
        `.runa-activity[data-activity-id="${active.id}"]`
      );
      if (details) details.open = true;
      updatePendingAssistantBubble(pending);
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
  bubble.innerHTML = `${renderAssistantExtrasHtml(pending)}${renderMessageContent(pending)}`;
  bindActivityToggleHandlers(pendingAssistantRow);

  const active = pending.activities?.find((a) => a.state !== "done");
  setStatus(active ? getCompactPhaseLabel(active.phase) : "");
  scrollMessagesToBottom();

  if (active?.open) {
    const detailEl = pendingAssistantRow?.querySelector(
      `.runa-activity[data-activity-id="${active.id}"] .runa-activity-detail`
    );
    if (detailEl) {
      detailEl.scrollTop = detailEl.scrollHeight;
    }
  }
}

function applyActivityEvent(pending, payload) {
  if (!payload?.id || !payload.phase) return;
  if (!pending.activities) pending.activities = [];

  const existing = pending.activities.find((a) => a.id === payload.id);
  if (payload.state === "start") {
    if (!existing) {
      for (const item of pending.activities) {
        if (item.state !== "done") item.open = false;
      }
      pending.activities.push({
        id: payload.id,
        phase: payload.phase,
        label: payload.label,
        detail: payload.detail || "",
        state: "start",
        open: true,
      });
    }
    updatePendingAssistantBubble(pending);
    return;
  }

  if (existing) {
    if (payload.state === "update") {
      if (payload.detail) existing.detail = payload.detail;
      const throttleMs = existing.phase === "thinking" ? 24 : 100;
      const now = Date.now();
      if (now - lastActivityDetailPaintAt < throttleMs) {
        schedulePendingBubbleUpdate(pending);
        return;
      }
      lastActivityDetailPaintAt = now;
      schedulePendingBubbleUpdate(pending);
      return;
    }
    existing.state = payload.state || "done";
    if (payload.detail) existing.detail = payload.detail;
    if (!existing.label && payload.label) existing.label = payload.label;
    if (existing.state === "done") existing.open = false;
    updatePendingAssistantBubble(pending);
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
      const label =
        item.storageRef || !item.uploading
          ? item.name
          : `${item.name}（${item.statusLabel || "アップロード中…"}）`;
      return `<span class="runa-attach-chip" data-id="${escapeHtml(item.id)}">
        <span class="runa-attach-chip-name">${escapeHtml(label)}</span>
        <button type="button" class="runa-attach-chip-remove" aria-label="添付を削除" data-id="${escapeHtml(item.id)}">×</button>
      </span>`;
    })
    .join("");

  for (const btn of els.attachList.querySelectorAll(".runa-attach-chip-remove")) {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const removed = pendingAttachments.find((a) => a.id === id);
      pendingAttachments = pendingAttachments.filter((a) => a.id !== id);
      if (removed?.path && removed.path === pendingEditImagePath) {
        resetEditContext();
      }
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
  if (contextUsageState) updateContextUsageDisplay(contextUsageState);
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
  updateContextUsageDisplay(data.contextUsage);
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
  resetEditContext();
  contextUsageState = null;
  if (els.contextUsage) els.contextUsage.hidden = true;
  renderPendingAttachments();
  renderMessages();
  setStatus("");
  if (els.input) els.input.focus();
}

async function postRunaChat(message, attachments) {
  const context = buildRunaChatContext();
  const res = await fetch("/api/runa/chat?stream=1", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, attachments, context }),
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
    taskPlan: null,
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
    } else if (eventName === "tasks" && Array.isArray(payload.tasks)) {
      pending.taskPlan = {
        tasks: payload.tasks,
        current: typeof payload.current === "number" ? payload.current : 0,
      };
      updatePendingAssistantBubble(pending);
    } else if (eventName === "status" && payload.label) {
      const phaseLabel =
        payload.phase && ACTIVITY_PHASE_LABELS[payload.phase]
          ? ACTIVITY_PHASE_LABELS[payload.phase]
          : payload.label;
      setStatus(phaseLabel);
    } else if (eventName === "delta" && payload.text) {
      pending.content += payload.text;
      updatePendingAssistantBubble(pending);
    } else if (eventName === "files" && Array.isArray(payload.items)) {
      pending.files = payload.items;
      updatePendingAssistantBubble(pending);
    } else if (eventName === "context_usage") {
      updateContextUsageDisplay(payload);
    } else if (eventName === "history_compact") {
      if (!pending.pending) {
        void loadMessages();
      } else {
        setStatus("古い会話を要約してコンテキストを圧縮しました");
      }
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
    extractedText: a.storageRef ? undefined : a.extractedText,
    imagePaths: a.storageRef ? undefined : a.imagePaths,
    storageRef: a.storageRef ? true : undefined,
    sizeBytes: a.sizeBytes ?? null,
  }));

  messageState.push({
    role: "user",
    content: text,
    files: attachments.map((a) => ({
      name: a.name,
      path: a.path,
      type: "file",
      sizeBytes: a.sizeBytes ?? null,
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
    resetEditContext();
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

/** 添付ボタンにストローク SVG アイコンを表示 */
function hydrateAttachButtonIcon() {
  if (!els.attachBtn) return;
  els.attachBtn.innerHTML = iconHtml("paperclip", "hub-icon runa-attach-btn-icon");
}

function bindEvents() {
  if (eventsBound) return;
  eventsBound = true;
  els.fab?.addEventListener("click", () => setPanelOpen(true));
  els.close?.addEventListener("click", () => setPanelOpen(false));
  els.backdrop?.addEventListener("click", () => setPanelOpen(false));
  els.newChat?.addEventListener("click", () => void startNewChat());
  els.contextSummarizeBtn?.addEventListener("click", () => void requestContextSummarize());
  els.form?.addEventListener("submit", handleSubmit);
  els.input?.addEventListener("keydown", handleInputKeydown);
  els.attachBtn?.addEventListener("click", () => els.fileInput?.click());
  els.fileInput?.addEventListener("change", handleFileInputChange);
  els.body?.addEventListener("dragenter", handleAttachDragEnter);
  els.body?.addEventListener("dragover", handleAttachDragOver);
  els.body?.addEventListener("dragleave", handleAttachDragLeave);
  els.body?.addEventListener("drop", handleAttachDrop);
  els.messages?.addEventListener("click", handleMessageAreaClick);

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (closeImageLightbox()) return;
    if (els.panel?.classList.contains("is-open")) {
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

/** Runa パネルを初期化（複数ページから options をマージ可能） */
export function initRunaPanel(options = {}) {
  panelOptions = { ...panelOptions, ...options };
  if (els.input && panelOptions.placeholder) {
    els.input.placeholder = panelOptions.placeholder;
  }
  if (!els.fab || !els.panel) return;
  hydrateAttachButtonIcon();
  bindEvents();
  updateContextHint();
}

/** パネルを開く */
export function openRunaPanel() {
  setPanelOpen(true);
}

/** ストレージ上のファイルを参照添付してパネルを開く */
export function attachStorageReference(item, options = {}) {
  const { forEdit = false } = options;
  if (!item?.path || item.type === "folder") return;
  if (pendingAttachments.length >= MAX_ATTACHMENTS) {
    setStatus(`添付は最大 ${MAX_ATTACHMENTS} 件までです`);
    return;
  }
  if (!pendingAttachments.some((a) => a.path === item.path)) {
    pendingAttachments.push({
      id: `ref-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: item.name,
      path: item.path,
      sizeBytes: item.sizeBytes ?? item.size ?? null,
      storageRef: true,
    });
    renderPendingAttachments();
  }
  if (forEdit) {
    pendingEditImagePath = item.path;
    closeImageLightbox();
    if (els.input) {
      els.input.placeholder = EDIT_INPUT_PLACEHOLDER;
    }
  }
  openRunaPanel();
  if (els.input) els.input.focus();
}

if (document.getElementById("runa-fab")) {
  initRunaPanel({
    placeholder: "ファイルの検索や操作を依頼…",
  });
}
