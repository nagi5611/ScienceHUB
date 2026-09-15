/**
 * 公開サイトファイル編集画面 — 埋め込み Runa チャット
 */

const PLACEHOLDER = "開いているファイルについて質問や修正を依頼…";
const MAX_CONTENT_CHARS = 24 * 1024;

/** @type {{ siteId: string, path: string, name?: string, webSiteDir?: string | null, getContent?: () => string } | null} */
let editContext = null;
/** @type {((update: { siteId: string, path: string, content: string }) => void) | null} */
let onSiteFileUpdated = null;
let runaVisible = false;
let chatBusy = false;
let dataLoaded = false;
/** @type {Array<{ id?: string, role: string, content: string, files?: object[], pending?: boolean, activities?: object[] }>} */
let messageState = [];
/** @type {HTMLElement | null} */
let pendingAssistantRow = null;

const els = {
  shell: document.getElementById("cs-editor-shell"),
  runaPane: document.getElementById("cs-editor-runa-pane"),
  runaBtn: document.getElementById("cs-website-edit-runa-btn"),
  messages: document.getElementById("cs-er-messages"),
  form: document.getElementById("cs-er-form"),
  input: document.getElementById("cs-er-input"),
  send: document.getElementById("cs-er-send"),
  status: document.getElementById("cs-er-status"),
  hint: document.getElementById("cs-er-context-hint"),
  newChat: document.getElementById("cs-er-new-chat"),
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderMarkdown(text) {
  if (!text) return "";
  let html = escapeHtml(text);
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  return html.replace(/\n/g, "<br>");
}

function buildChatContext() {
  if (!editContext?.siteId || !editContext.path) return {};
  const content = editContext.getContent?.() ?? "";
  return {
    webSitesView: true,
    webSiteId: editContext.siteId,
    webSiteDir: editContext.webSiteDir ?? null,
    webSiteEditFile: {
      siteId: editContext.siteId,
      path: editContext.path,
      content: content.slice(0, MAX_CONTENT_CHARS),
    },
  };
}

function buildFileAttachment() {
  if (!editContext?.siteId || !editContext.path) return null;
  const content = editContext.getContent?.() ?? "";
  const name = editContext.name ?? editContext.path.split("/").pop() ?? "file";
  return {
    path: `wsp:${editContext.siteId}/${editContext.path}`,
    name,
    extractedText: content,
    sizeBytes: content.length,
  };
}

function updateHint() {
  if (!els.hint) return;
  if (editContext?.path) {
    els.hint.textContent = `編集中: ${editContext.path}`;
    els.hint.hidden = false;
  } else {
    els.hint.textContent = "";
    els.hint.hidden = true;
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
}

function updateRunaToggleUi() {
  if (els.shell) {
    els.shell.classList.toggle("cs-editor-shell--split", runaVisible);
  }
  if (els.runaPane) {
    els.runaPane.hidden = !runaVisible;
  }
  if (els.runaBtn) {
    els.runaBtn.setAttribute("aria-pressed", runaVisible ? "true" : "false");
    els.runaBtn.classList.toggle("is-active", runaVisible);
  }
}

function renderMessageContent(msg) {
  if (!msg.content) return "";
  if (msg.role === "assistant") {
    return `<div class="runa-msg-content runa-md">${renderMarkdown(msg.content)}</div>`;
  }
  return `<div class="runa-msg-content">${escapeHtml(msg.content)}</div>`;
}

function renderMessages() {
  if (!els.messages) return;
  pendingAssistantRow = null;
  if (!messageState.length) {
    els.messages.innerHTML =
      '<p class="runa-empty">開いているファイルの内容を参照して質問や修正を依頼できます。</p>';
    return;
  }
  els.messages.innerHTML = messageState
    .map((msg) => {
      const roleClass = msg.role === "user" ? "runa-msg--user" : "runa-msg--assistant";
      const streaming =
        msg.pending && msg.role === "assistant" && msg.content ? " is-streaming" : "";
      return `<div class="runa-msg ${roleClass}">
        <div class="runa-msg-bubble${streaming}">${renderMessageContent(msg)}</div>
      </div>`;
    })
    .join("");
  els.messages.scrollTop = els.messages.scrollHeight;
}

function mountPendingBubble(pending) {
  if (!els.messages) return;
  const empty = els.messages.querySelector(".runa-empty");
  if (empty) empty.remove();
  const row = document.createElement("div");
  row.className = "runa-msg runa-msg--assistant";
  row.innerHTML = `<div class="runa-msg-bubble"></div>`;
  els.messages.appendChild(row);
  pendingAssistantRow = row;
  els.messages.scrollTop = els.messages.scrollHeight;
}

function updatePendingBubble(pending) {
  if (!pendingAssistantRow) {
    mountPendingBubble(pending);
  }
  const bubble = pendingAssistantRow?.querySelector(".runa-msg-bubble");
  if (!bubble) return;
  bubble.classList.toggle("is-streaming", Boolean(pending.content));
  bubble.innerHTML = renderMessageContent(pending);
  els.messages.scrollTop = els.messages.scrollHeight;
}

async function loadMessages() {
  const res = await fetch("/api/runa/messages?limit=50", { credentials: "same-origin" });
  if (!res.ok) return false;
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

async function ensureDataLoaded() {
  if (dataLoaded) return;
  dataLoaded = await loadMessages();
}

async function startNewChat() {
  if (chatBusy) return;
  const res = await fetch("/api/runa/messages", {
    method: "DELETE",
    credentials: "same-origin",
  });
  if (!res.ok) return;
  messageState = [];
  renderMessages();
  setStatus("");
  els.input?.focus();
}

async function postChat(message, attachments) {
  const res = await fetch("/api/runa/chat?stream=1", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, attachments, context: buildChatContext() }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "リクエストに失敗しました");
  }
  if (!res.body) throw new Error("ストリームを開始できません");

  const pending = { role: "assistant", content: "", pending: true };
  messageState.push(pending);
  mountPendingBubble(pending);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finalResult = null;

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
      if (!dataStr) continue;
      let payload;
      try {
        payload = JSON.parse(dataStr);
      } catch {
        continue;
      }
      if (eventName === "delta" && payload.text) {
        pending.content += payload.text;
        updatePendingBubble(pending);
      } else if (eventName === "web_site_file_updated") {
        applySiteFileUpdate(payload);
      } else if (eventName === "done") {
        finalResult = payload;
      } else if (eventName === "error") {
        throw new Error(payload.message || "エラーが発生しました");
      }
    }
  }

  pending.pending = false;
  if (finalResult?.message && !pending.content) {
    pending.content = finalResult.message;
  }
  pendingAssistantRow = null;
  renderMessages();
  setStatus("");
}

async function handleSubmit(event) {
  event.preventDefault();
  if (!els.input || chatBusy) return;
  const text = els.input.value.trim();
  const fileAttachment = buildFileAttachment();
  if (!text && !fileAttachment) return;

  const attachments = fileAttachment ? [fileAttachment] : [];
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
  renderMessages();
  setChatBusy(true);

  try {
    await postChat(text, attachments);
  } catch (error) {
    messageState.push({
      role: "assistant",
      content: error instanceof Error ? error.message : "エラーが発生しました",
    });
    renderMessages();
  } finally {
    setChatBusy(false);
  }
}

function applySiteFileUpdate(payload) {
  if (!payload?.siteId || !payload?.path || typeof payload.content !== "string") return;
  if (
    editContext?.siteId !== payload.siteId ||
    editContext?.path !== payload.path
  ) {
    return;
  }
  onSiteFileUpdated?.(payload);
}

/** Runa が保存したファイル内容をエディタへ反映するハンドラ */
export function setWebsiteEditorRunaFileSyncHandler(handler) {
  onSiteFileUpdated = handler ?? null;
}

/** 編集ファイルの Runa コンテキストを設定 */
export function setWebsiteEditorRunaContext(context) {
  if (!context?.siteId || !context.path) return;
  editContext = context;
  updateHint();
}

/** 編集ファイルの Runa コンテキストを解除 */
export function clearWebsiteEditorRunaContext() {
  editContext = null;
  runaVisible = false;
  updateHint();
  updateRunaToggleUi();
}

/** Runa ペインの表示をトグル */
export function toggleWebsiteEditorRuna() {
  runaVisible = !runaVisible;
  updateRunaToggleUi();
  if (runaVisible) {
    void ensureDataLoaded();
    els.input?.focus();
  }
}

/** Runa ペインを非表示 */
export function hideWebsiteEditorRuna() {
  runaVisible = false;
  updateRunaToggleUi();
}

/** 埋め込み Runa を初期化 */
export function initWebsiteEditorRuna() {
  if (!els.form || !els.shell) return;

  els.form.addEventListener("submit", (e) => {
    handleSubmit(e).catch((err) => {
      setStatus(err instanceof Error ? err.message : "送信に失敗しました");
    });
  });
  els.input?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;
    event.preventDefault();
    void handleSubmit(event);
  });
  els.newChat?.addEventListener("click", () => {
    void startNewChat();
  });

  if (els.input) els.input.placeholder = PLACEHOLDER;
  updateRunaToggleUi();
  updateHint();
}
