/**
 * サードパーティ — 一覧・スタジオ（Gemini パイプライン UI）
 */

const APP_SLUG = "third-party";
const APP_PATH = `/apps/${APP_SLUG}/`;

const PHASE_LABELS = {
  discovery: "ヒアリング中",
  clarify: "確認中",
  structured_form: "質問フォーム",
  gate_deepen_or_build: "進め方の選択",
  deepen_requirements: "要件深掘り",
  write_req_and_plan: "ドキュメント作成",
  flash_review: "計画レビュー中",
  flash_revise_plan: "計画改訂中",
  flash_implement: "実装中",
  flash_implement_tasks: "段階実装中",
  await_implement_confirm: "実装確認",
  draft_ready: "実装完了",
  app_maintain: "不具合対応中",
  app_maintain_done: "実装完了",
};

/** 現在のチャットモード */
function getChatMode() {
  return chatMode === "ask" ? "ask" : "agent";
}

/** チャットモードを保存・UI 反映 */
function setChatMode(mode) {
  chatMode = mode === "ask" ? "ask" : "agent";
  if (currentProjectId) {
    try {
      sessionStorage.setItem(
        `${CHAT_MODE_STORAGE_KEY}:${currentProjectId}`,
        chatMode
      );
    } catch {
      /* ignore */
    }
  }
  syncChatModeUi();
}

/** モード切替ボタンとプレースホルダを更新 */
function syncChatModeUi() {
  const group = document.getElementById("chat-mode");
  if (group) {
    for (const btn of group.querySelectorAll("[data-chat-mode]")) {
      const active = btn.getAttribute("data-chat-mode") === chatMode;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    }
  }
  const input = document.getElementById("chat-input");
  if (input) {
    input.placeholder =
      chatMode === "ask"
        ? "コードや仕様について質問…（編集はしません）"
        : "作りたいアプリを説明…";
  }
}

function loadChatModeForProject(projectId) {
  try {
    const stored = sessionStorage.getItem(
      `${CHAT_MODE_STORAGE_KEY}:${projectId}`
    );
    chatMode = stored === "ask" ? "ask" : "agent";
  } catch {
    chatMode = "agent";
  }
  syncChatModeUi();
}

/** API 呼び出し */
async function tpApi(path, options = {}) {
  const url = `/api/third-party/${path.replace(/^\//, "")}`;
  const res = await fetch(url, {
    ...options,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "リクエストに失敗しました");
  }
  return data;
}

/** アクセス確認 */
async function checkAccess() {
  const res = await fetch(`/api/apps/${APP_SLUG}/access`, {
    credentials: "same-origin",
  });
  if (res.status === 401) {
    window.location.href = "/login/?next=" + encodeURIComponent(APP_PATH);
    return false;
  }
  if (!res.ok) {
    document.getElementById("access-denied").hidden = false;
    return false;
  }
  return true;
}

let currentProjectId = null;
let currentPhase = null;
let currentPendingForm = null;
let titleSaveTimer = null;
let chatBusy = false;
let editingMessageId = null;
/** @type {Array<{ id: string, role: string, content: string }>} */
let currentMessages = [];
/** @type {{ userText?: string, assistantWaiting: boolean, activityLabel?: string } | null} */
let chatPending = null;
/** @type {{ tasks: Array<{ id: string, title: string, status: string }>, current: number } | null} */
let implementTasksState = null;

const PENDING_USER_ID = "__pending_user__";
const PENDING_ASSISTANT_ID = "__pending_assistant__";

/** @type {"agent" | "ask"} */
let chatMode = "agent";

const CHAT_MODE_STORAGE_KEY = "tp-chat-mode";

let workspaceTree = null;
let selectedWorkspacePath = null;
/** @type {Set<string>} */
const expandedTreeDirs = new Set(["docs"]);

const TREE_ICON_FILE =
  '<svg class="tp-tree-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>';
const TREE_ICON_FOLDER =
  '<svg class="tp-tree-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';
const TREE_CHEVRON =
  '<svg class="tp-tree-chevron" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true"><path d="M3 2l4 3-4 3z"/></svg>';

/** フェーズから待機ラベルを推測（SSE 未到達時のフォールバック） */
function inferFallbackActivityLabel(phase) {
  const map = {
    write_req_and_plan: "要件定義書を作成中…",
    flash_review: "実装計画をレビュー中…",
    flash_revise_plan: "実装計画を改訂中…",
    flash_implement: "index.html を実装中…",
    flash_implement_tasks: "段階実装中…",
    app_maintain: "不具合を調査中…",
  };
  return map[phase] || "Working…";
}

/** 実装タスクをチャットに出すか */
function shouldShowChatTodos() {
  const tasks = implementTasksState?.tasks;
  if (!tasks?.length) return false;
  if (currentPhase === "flash_implement_tasks") return true;
  if (chatPending?.assistantWaiting) {
    return tasks.some((t) => t.status !== "done");
  }
  return tasks.some((t) => t.status !== "done");
}

/** チャット用コンパクト TODO カード */
function createImplementTodosElement() {
  const tasks = implementTasksState?.tasks ?? [];
  const current = implementTasksState?.current ?? 0;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  const box = document.createElement("div");
  box.className = "tp-chat-todos";
  box.setAttribute("aria-label", "実装タスク");

  const head = document.createElement("div");
  head.className = "tp-chat-todos-head";
  const title = document.createElement("span");
  title.className = "tp-chat-todos-title";
  title.textContent = "段階実装";
  const meta = document.createElement("span");
  meta.className = "tp-chat-todos-meta";
  meta.textContent = `${doneCount} / ${tasks.length} 完了`;
  head.appendChild(title);
  head.appendChild(meta);
  box.appendChild(head);

  const list = document.createElement("ul");
  list.className = "tp-chat-todos-list";
  for (let i = 0; i < tasks.length; i++) {
    const t = tasks[i];
    const li = document.createElement("li");
    li.className = "tp-chat-todo-item";
    if (t.status === "done") li.classList.add("is-done");
    if (t.status === "failed") li.classList.add("is-failed");
    if (i === current && t.status === "pending") li.classList.add("is-current");

    const icon = document.createElement("span");
    icon.className = "tp-chat-todo-check";
    icon.setAttribute("aria-hidden", "true");
    if (t.status === "done") {
      icon.textContent = "✓";
    } else if (t.status === "failed") {
      icon.textContent = "✕";
    } else if (i === current) {
      icon.textContent = "◉";
    } else {
      icon.textContent = "○";
    }

    const label = document.createElement("span");
    label.className = "tp-chat-todo-label";
    label.textContent = t.title;

    li.appendChild(icon);
    li.appendChild(label);
    list.appendChild(li);
  }
  box.appendChild(list);
  return box;
}

function appendImplementTodosRow(messagesEl) {
  if (!shouldShowChatTodos()) return;
  const row = document.createElement("div");
  row.className = "tp-msg-row tp-msg-row--assistant tp-chat-todos-row";
  row.appendChild(createImplementTodosElement());
  messagesEl.appendChild(row);
}

/** 実装タスク一覧を更新（チャット内に描画） */
function renderImplementTodos() {
  renderMessagesFromState();
}

/** ワークスペースツリーにファイルがあるか */
function workspaceTreeHasFile(path) {
  if (!workspaceTree?.children) return false;
  const walk = (nodes) => {
    for (const n of nodes) {
      if (n.type === "file" && n.path === path) return true;
      if (n.type === "dir" && n.children?.length && walk(n.children)) {
        return true;
      }
    }
    return false;
  };
  return walk(workspaceTree.children);
}

/** R2 の implementation-tasks.json を読み込み */
async function loadImplementTasksFromWorkspace() {
  if (!currentProjectId) return;
  if (!workspaceTree) {
    try {
      await refreshWorkspaceTree();
    } catch {
      implementTasksState = null;
      renderImplementTodos();
      return;
    }
  }
  if (!workspaceTreeHasFile("docs/implementation-tasks.json")) {
    implementTasksState = null;
    renderImplementTodos();
    return;
  }
  try {
    const path = encodeURIComponent("docs/implementation-tasks.json");
    const data = await tpApi(
      `projects/${currentProjectId}/workspace/file?path=${path}`
    );
    const parsed = JSON.parse(data.content || "{}");
    if (!parsed.tasks?.length) {
      implementTasksState = null;
      renderImplementTodos();
      return;
    }
    implementTasksState = {
      tasks: parsed.tasks,
      current: parsed.current_task_index ?? 0,
    };
    renderImplementTodos();
  } catch {
    implementTasksState = null;
    renderImplementTodos();
  }
}

/** チャット POST（SSE 優先、失敗時 JSON） */
async function postProjectChat(body) {
  const payload = { ...body, chat_mode: getChatMode() };
  const base = `/api/third-party/projects/${currentProjectId}/chat`;
  const streamUrl = `${base}?stream=1`;
  const res = await fetch(streamUrl, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const contentType = res.headers.get("content-type") || "";

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "リクエストに失敗しました");
  }

  if (!contentType.includes("text/event-stream") || !res.body) {
    return await res.json();
  }

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
    if (eventName === "status" && payload.label) {
      if (chatPending) {
        chatPending.activityLabel = payload.label;
        renderMessagesFromState();
      }
    } else if (eventName === "tasks" && Array.isArray(payload.tasks)) {
      implementTasksState = {
        tasks: payload.tasks,
        current: payload.current ?? 0,
      };
      renderImplementTodos();
    } else if (eventName === "artifact") {
      const artifactPath = payload.path || "";
      refreshWorkspaceTree()
        .then(() => {
          if (artifactPath === "docs/implementation-tasks.json") {
            return loadImplementTasksFromWorkspace();
          }
          if (workspaceTreeHasFile("docs/implementation-tasks.json")) {
            return loadImplementTasksFromWorkspace();
          }
        })
        .catch(() => {});
      if (currentProjectId) {
        loadRevisions(currentProjectId).catch(() => {});
      }
    } else if (eventName === "job" && payload.jobId) {
      const label = payload.progress?.label;
      if (label && chatPending) {
        chatPending.activityLabel = label;
        renderMessagesFromState();
      }
    } else if (eventName === "verify") {
      showVerifyBanner(payload);
    } else if (eventName === "done") {
      finalResult = payload;
    } else if (eventName === "error") {
      throw new Error(payload.message || "処理に失敗しました");
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() || "";
    for (const block of blocks) {
      const lines = block.split("\n");
      let eventName = "message";
      let dataLines = [];
      for (const line of lines) {
        if (line.startsWith("event:")) {
          eventName = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
          dataLines.push(line.slice(5).trimStart());
        }
      }
      handleEvent(eventName, dataLines.join("\n"));
    }
  }

  if (buffer.trim()) {
    const lines = buffer.split("\n");
    let eventName = "message";
    let dataLines = [];
    for (const line of lines) {
      if (line.startsWith("event:")) eventName = line.slice(6).trim();
      else if (line.startsWith("data:")) dataLines.push(line.slice(5).trimStart());
    }
    handleEvent(eventName, dataLines.join("\n"));
  }

  if (!finalResult) {
    throw new Error("応答が不完全です");
  }
  return finalResult;
}

function setCanvasTab(tab) {
  const previewPanel = document.getElementById("canvas-panel-preview");
  const filesPanel = document.getElementById("canvas-panel-files");
  const tabPreview = document.getElementById("canvas-tab-preview");
  const tabFiles = document.getElementById("canvas-tab-files");
  const toolbar = document.getElementById("canvas-toolbar-preview");
  const isPreview = tab !== "files";

  previewPanel.hidden = !isPreview;
  filesPanel.hidden = isPreview;

  tabPreview.classList.toggle("is-active", isPreview);
  tabFiles.classList.toggle("is-active", !isPreview);
  tabPreview.setAttribute("aria-selected", isPreview ? "true" : "false");
  tabFiles.setAttribute("aria-selected", !isPreview ? "true" : "false");
  if (toolbar) toolbar.hidden = !isPreview;
}

function treeDirKey(node) {
  return node.path || node.name;
}

function renderWorkspaceTree(node) {
  const container = document.getElementById("workspace-tree");
  container.replaceChildren();
  if (!node) return;

  const rootLabel = document.createElement("div");
  rootLabel.className = "tp-tree-root-label";
  rootLabel.textContent = `${node.name}/`;
  container.appendChild(rootLabel);

  const ul = document.createElement("ul");
  container.appendChild(ul);
  appendTreeChildren(ul, node.children || []);
}

function appendTreeChildren(ul, children) {
  for (const child of children) {
    const li = document.createElement("li");
    li.className = "tp-tree-item";

    if (child.type === "dir") {
      const key = treeDirKey(child);
      const expanded = expandedTreeDirs.has(key);
      const header = document.createElement("button");
      header.type = "button";
      header.className = "tp-tree-dir-header";
      header.innerHTML = `${TREE_CHEVRON.replace(
        'class="tp-tree-chevron"',
        `class="tp-tree-chevron${expanded ? " is-expanded" : ""}"`
      )}${TREE_ICON_FOLDER}<span class="tp-tree-name">${child.name}</span>`;
      header.addEventListener("click", () => {
        if (expandedTreeDirs.has(key)) {
          expandedTreeDirs.delete(key);
        } else {
          expandedTreeDirs.add(key);
        }
        renderWorkspaceTree(workspaceTree);
      });
      li.appendChild(header);
      if (child.children?.length && expanded) {
        const sub = document.createElement("ul");
        sub.className = "tp-tree-children";
        appendTreeChildren(sub, child.children);
        li.appendChild(sub);
      }
    } else {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tp-tree-file-btn";
      if (selectedWorkspacePath === child.path) {
        btn.classList.add("is-selected");
      }
      btn.innerHTML = `<span class="tp-tree-chevron tp-tree-chevron--spacer" aria-hidden="true"></span>${TREE_ICON_FILE}<span class="tp-tree-name">${child.name}</span>`;
      btn.addEventListener("click", () => {
        openWorkspaceFile(child.path).catch((err) => alert(err.message));
      });
      li.appendChild(btn);
    }
    ul.appendChild(li);
  }
}

function setFileViewerState({ name, path, content }) {
  const nameEl = document.getElementById("workspace-file-name");
  const pathEl = document.getElementById("workspace-file-path");
  const contentEl = document.getElementById("workspace-file-content");
  nameEl.textContent = name || "ファイルを選択";
  if (path) {
    pathEl.textContent = path;
    pathEl.hidden = false;
  } else {
    pathEl.textContent = "";
    pathEl.hidden = true;
  }
  contentEl.textContent = content ?? "";
}

async function refreshWorkspaceTree() {
  if (!currentProjectId) return;
  const { tree } = await tpApi(`projects/${currentProjectId}/workspace/tree`);
  workspaceTree = tree;
  renderWorkspaceTree(tree);
}

async function openWorkspaceFile(path) {
  if (!currentProjectId || !path) return;
  selectedWorkspacePath = path;
  setCanvasTab("files");
  const fileName = path.split("/").pop() || path;
  setFileViewerState({ name: fileName, path, content: "" });
  if (workspaceTree) renderWorkspaceTree(workspaceTree);
  const file = await tpApi(
    `projects/${currentProjectId}/workspace/file?path=${encodeURIComponent(path)}`
  );
  setFileViewerState({
    name: fileName,
    path,
    content: file.content ?? "",
  });
}

function showGallery() {
  document.getElementById("gallery-view").hidden = false;
  document.getElementById("studio-view").hidden = true;
  currentProjectId = null;
  currentPhase = null;
  currentPendingForm = null;
  currentMessages = [];
  chatPending = null;
  editingMessageId = null;
  setStudioUrl(null);
}

function showStudio(projectId) {
  document.getElementById("gallery-view").hidden = true;
  document.getElementById("studio-view").hidden = false;
  currentProjectId = projectId;
  setCanvasTab("preview");
}

/** スタジオ URL（再開・共有用） */
function setStudioUrl(projectId) {
  const url = new URL(window.location.href);
  if (projectId) {
    url.searchParams.set("project", projectId);
  } else {
    url.searchParams.delete("project");
  }
  history.replaceState(null, "", url.pathname + url.search);
}

function formatDate(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function phaseLabel(phase) {
  if (!phase) return "";
  return PHASE_LABELS[phase] || phase;
}

/** トップ: 自分のアプリ + 公開ギャラリー */
async function loadGallery() {
  const [{ projects }, { apps }] = await Promise.all([
    tpApi("projects"),
    tpApi("gallery"),
  ]);

  const myGrid = document.getElementById("my-projects-grid");
  const myEmpty = document.getElementById("my-projects-empty");
  myGrid.replaceChildren();

  if (!projects.length) {
    myEmpty.hidden = false;
  } else {
    myEmpty.hidden = true;
    for (const p of projects) {
      const card = document.createElement("article");
      card.className = "tp-card tp-card--mine";

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "tp-card-delete";
      delBtn.textContent = "削除";
      delBtn.setAttribute("aria-label", `${p.title} を削除`);
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteMyProject(p.id, p.title, p.status === "published").catch((err) =>
          alert(err.message)
        );
      });

      const openBtn = document.createElement("button");
      openBtn.type = "button";
      openBtn.className = "tp-card-open";
      const statusBadge =
        p.status === "published"
          ? `<span class="tp-card-badge tp-card-badge--published">公開済み</span>`
          : `<span class="tp-card-badge tp-card-badge--draft">下書き</span>`;
      const phase = phaseLabel(p.workflow_phase);
      openBtn.innerHTML = `
        ${statusBadge}
        <div class="tp-card-emoji">${p.icon_emoji || "🧩"}</div>
        <p class="tp-card-title">${escapeHtml(p.title)}</p>
        <p class="tp-card-meta">${escapeHtml(phase || "開発中")} · 更新 ${formatDate(p.updated_at)}</p>
      `;
      openBtn.addEventListener("click", () => {
        openStudio(p.id).catch((e) => alert(e.message));
      });

      const forkBtn = document.createElement("button");
      forkBtn.type = "button";
      forkBtn.className = "tp-card-fork";
      forkBtn.textContent = "コピー";
      forkBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        forkMyProject(p.id).catch((err) => alert(err.message));
      });

      card.appendChild(delBtn);
      card.appendChild(openBtn);
      card.appendChild(forkBtn);
      myGrid.appendChild(card);
    }
  }

  const grid = document.getElementById("gallery-grid");
  const empty = document.getElementById("gallery-empty");
  grid.replaceChildren();

  if (!apps.length) {
    empty.hidden = false;
  } else {
    empty.hidden = true;
    for (const app of apps) {
      const card = document.createElement("article");
      card.className = "tp-card";

      const openBtn = document.createElement("button");
      openBtn.type = "button";
      openBtn.className = "tp-card-open";
      openBtn.innerHTML = `
        <div class="tp-card-emoji">${app.icon_emoji || "🧩"}</div>
        <p class="tp-card-title">${escapeHtml(app.title)}</p>
        <p class="tp-card-meta">${escapeHtml(app.owner_display_name)} · ${formatDate(app.published_at)}</p>
      `;
      openBtn.addEventListener("click", () => {
        window.location.href = app.view_href;
      });

      const actions = document.createElement("div");
      actions.className = "tp-card-actions";
      const forkBtn = document.createElement("button");
      forkBtn.type = "button";
      forkBtn.className = "tp-card-fork";
      forkBtn.textContent = "ベースに作る";
      forkBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        forkPublishedApp(app.slug).catch((err) => alert(err.message));
      });
      actions.appendChild(forkBtn);

      card.appendChild(openBtn);
      card.appendChild(actions);
      grid.appendChild(card);
    }
  }
}

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

/** ブラウザ検証バナー */
function showVerifyBanner(payload) {
  const el = document.getElementById("verify-banner");
  if (!el || !payload) return;
  const passed = Boolean(payload.passed);
  const errors = Array.isArray(payload.errors) ? payload.errors : [];
  const warnings = Array.isArray(payload.warnings) ? payload.warnings : [];
  if (passed && warnings.length === 0) {
    el.hidden = true;
    return;
  }
  el.hidden = false;
  el.className = "tp-verify-banner";
  if (!passed) {
    el.classList.add("tp-verify-banner--fail");
    el.textContent = `検証: 問題あり — ${errors.slice(0, 2).join("; ") || "エラー"}`;
  } else if (warnings.length) {
    el.classList.add("tp-verify-banner--warn");
    el.textContent = `検証: 警告 — ${warnings.slice(0, 2).join("; ")}`;
  } else {
    el.classList.add("tp-verify-banner--ok");
    el.textContent = "検証: OK";
  }
}

/** HTML 履歴一覧 */
async function loadRevisions(projectId) {
  const listEl = document.getElementById("revisions-list");
  const emptyEl = document.getElementById("revisions-empty");
  if (!listEl) return;
  const { revisions } = await tpApi(`projects/${projectId}/revisions`);
  listEl.replaceChildren();
  if (!revisions?.length) {
    emptyEl.hidden = false;
    return;
  }
  emptyEl.hidden = true;
  for (const rev of revisions) {
    const li = document.createElement("li");
    li.className = "tp-revisions-item";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.innerHTML = `
      <div>#${rev.revision_number} ${escapeHtml(rev.summary)}</div>
      <div class="tp-revisions-meta">${formatDate(rev.created_at)}</div>
    `;
    if (!rev.has_snapshot) {
      btn.disabled = true;
    } else {
      btn.addEventListener("click", () => {
        restoreRevision(projectId, rev.revision_number).catch((err) =>
          alert(err.message)
        );
      });
    }
    li.appendChild(btn);
    listEl.appendChild(li);
  }
}

async function restoreRevision(projectId, revisionNumber) {
  if (!confirm(`リビジョン #${revisionNumber} に戻しますか？`)) return;
  await tpApi(`projects/${projectId}/revisions/${revisionNumber}/restore`, {
    method: "POST",
    body: "{}",
  });
  refreshPreview();
  await loadRevisions(projectId);
  await refreshWorkspaceTree().catch(() => {});
}

/** 公開アプリをフォーク */
async function forkPublishedApp(slug) {
  const { project } = await tpApi(`published/${encodeURIComponent(slug)}/fork`, {
    method: "POST",
    body: "{}",
  });
  await openStudio(project.id);
}

/** 自分のプロジェクトをフォーク */
async function forkMyProject(projectId) {
  const { project } = await tpApi(`projects/${projectId}/fork`, {
    method: "POST",
    body: "{}",
  });
  await openStudio(project.id);
}

/** 自分のアプリを削除 */
async function deleteMyProject(projectId, title, isPublished) {
  const label = title?.trim() || "このアプリ";
  let confirmMsg = `「${label}」を削除しますか？\nチャット履歴とプレビューは復元できません。`;
  if (isPublished) {
    confirmMsg +=
      "\n公開済みの場合、みんなのアプリ一覧からも外れます。";
  }
  if (!confirm(confirmMsg)) return;

  await tpApi(`projects/${projectId}`, { method: "DELETE" });

  if (currentProjectId === projectId) {
    showGallery();
  }
  await loadGallery();
}

function openCreateModal() {
  const input = document.getElementById("create-title");
  input.value = "";
  document.getElementById("create-modal").hidden = false;
  input.focus();
}

/** 新規プロジェクト → スタジオ */
async function createAndOpenStudio(title) {
  const trimmed = title.trim();
  if (!trimmed) throw new Error("アプリ名を入力してください");
  const { project } = await tpApi("projects", {
    method: "POST",
    body: JSON.stringify({ title: trimmed }),
  });
  document.getElementById("create-modal").hidden = true;
  await openStudio(project.id);
}

function setChatBusy(busy) {
  chatBusy = busy;
  const send = document.getElementById("chat-send");
  const formSubmit = document.getElementById("chat-form-submit");
  send.disabled = busy;
  if (formSubmit) formSubmit.disabled = busy;
  document
    .querySelectorAll(
      '[data-action="gate-deepen"], [data-action="gate-build"], [data-action="gate-implement-start"]'
    )
    .forEach((btn) => {
      btn.disabled = busy;
    });
  document.querySelectorAll(".tp-msg-action").forEach((btn) => {
    btn.disabled = busy;
  });
}

function updatePhaseUI(phase, pendingForm, reviewSummary) {
  currentPhase = phase || currentPhase;
  currentPendingForm = pendingForm ?? null;

  const badge = document.getElementById("studio-phase");
  const label = PHASE_LABELS[currentPhase] || currentPhase || "";
  if (label) {
    badge.textContent = label;
    badge.hidden = false;
  } else {
    badge.hidden = true;
  }

  const suggestions = document.getElementById("chat-suggestions");
  const postBuild =
    currentPhase === "draft_ready" ||
    currentPhase === "app_maintain" ||
    currentPhase === "app_maintain_done";
  const showSuggest =
    !postBuild &&
    (currentPhase === "discovery" || currentPhase === "clarify");
  suggestions.hidden = !showSuggest;

  const gate = document.getElementById("chat-gate");
  if (gate) gate.hidden = true;

  const implementConfirm = document.getElementById("chat-implement-confirm");
  if (implementConfirm) implementConfirm.hidden = true;

  const banner = document.getElementById("chat-review-banner");
  if (reviewSummary) {
    banner.textContent = reviewSummary;
    banner.hidden = false;
  } else if (
    currentPhase !== "flash_review" &&
    currentPhase !== "flash_revise_plan"
  ) {
    banner.hidden = true;
    banner.textContent = "";
  }

  renderMessagesFromState();

  const chatInput = document.getElementById("chat-input");
  if (postBuild) {
    chatInput.placeholder =
      "不具合や追加したいことを説明（例: クリアボタンが動かない）…";
  } else if (currentPhase === "gate_deepen_or_build") {
    chatInput.placeholder =
      "「実装に進む」「実装して」または下のボタン…";
  } else {
    chatInput.placeholder = "作りたいアプリを説明…";
  }
}

function buildPendingFormElement(form) {
  const wrap = document.createElement("div");
  wrap.className = "tp-msg tp-msg--assistant tp-msg--form";

  const title = document.createElement("p");
  title.className = "tp-form-title";
  title.textContent = form.title || "回答してください";
  wrap.appendChild(title);

  const formEl = document.createElement("form");
  formEl.className = "tp-dynamic-form";
  formEl.id = "pending-form";

  for (const q of form.questions) {
    const field = document.createElement("fieldset");
    field.className = "tp-form-field";
    const legend = document.createElement("legend");
    legend.textContent = q.prompt;
    field.appendChild(legend);

    const inputType = q.allow_multiple ? "checkbox" : "radio";
    for (const opt of q.options || []) {
      const label = document.createElement("label");
      label.className = "tp-form-option";
      const input = document.createElement("input");
      input.type = inputType;
      input.name = q.id;
      input.value = opt;
      label.appendChild(input);
      label.appendChild(document.createTextNode(opt));
      field.appendChild(label);
    }

    if (q.allow_free_text) {
      const free = document.createElement("input");
      free.type = "text";
      free.className = "tp-form-free";
      free.name = `${q.id}__free`;
      free.placeholder = "自由記述（任意）";
      field.appendChild(free);
    }

    formEl.appendChild(field);
  }

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.className = "tp-btn tp-btn--primary";
  submit.id = "chat-form-submit";
  submit.textContent = "送信";
  formEl.appendChild(submit);

  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    submitPendingForm(form).catch((err) => alert(err.message));
  });

  wrap.appendChild(formEl);
  return wrap;
}

function appendChatInlineChrome(messagesEl) {
  const postBuild =
    currentPhase === "draft_ready" ||
    currentPhase === "app_maintain" ||
    currentPhase === "app_maintain_done";

  if (currentPendingForm?.questions?.length) {
    const row = document.createElement("div");
    row.className = "tp-msg-row tp-msg-row--assistant";
    row.appendChild(buildPendingFormElement(currentPendingForm));
    messagesEl.appendChild(row);
  }

  if (!postBuild && currentPhase === "gate_deepen_or_build") {
    const row = document.createElement("div");
    row.className = "tp-msg-row tp-msg-row--assistant";
    const actions = document.createElement("div");
    actions.className = "tp-chat-inline-actions";
    const deepen = document.createElement("button");
    deepen.type = "button";
    deepen.className = "tp-btn";
    deepen.dataset.action = "gate-deepen";
    deepen.textContent = "要件を深掘り";
    const build = document.createElement("button");
    build.type = "button";
    build.className = "tp-btn tp-btn--primary";
    build.dataset.action = "gate-build";
    build.textContent = "実装に進む";
    actions.appendChild(deepen);
    actions.appendChild(build);
    row.appendChild(actions);
    messagesEl.appendChild(row);
  }

  if (currentPhase === "await_implement_confirm") {
    const row = document.createElement("div");
    row.className = "tp-msg-row tp-msg-row--assistant";
    const actions = document.createElement("div");
    actions.className = "tp-chat-inline-actions";
    const start = document.createElement("button");
    start.type = "button";
    start.className = "tp-btn tp-btn--primary";
    start.dataset.action = "gate-implement-start";
    start.textContent = "実装開始";
    actions.appendChild(start);
    row.appendChild(actions);
    messagesEl.appendChild(row);
  }
}

function renderPendingForm(_form) {
  const container = document.getElementById("chat-dynamic-form");
  if (container) {
    container.replaceChildren();
    container.hidden = true;
  }
}

function collectFormResponses(form) {
  const responses = {};
  for (const q of form.questions) {
    if (q.allow_multiple) {
      const checked = Array.from(
        document.querySelectorAll(`input[name="${q.id}"]:checked`)
      ).map((el) => el.value);
      const free = document.querySelector(`input[name="${q.id}__free"]`);
      if (free?.value.trim()) checked.push(free.value.trim());
      responses[q.id] = checked;
    } else {
      const picked = document.querySelector(`input[name="${q.id}"]:checked`);
      const free = document.querySelector(`input[name="${q.id}__free"]`);
      let val = picked?.value ?? "";
      if (free?.value.trim()) {
        val = val ? `${val}（${free.value.trim()}）` : free.value.trim();
      }
      responses[q.id] = val;
    }
  }
  return responses;
}

/** サーバー保存前のフォーム回答表示用 */
function formatFormResponsesForDisplay(form, responses) {
  const lines = ["【フォーム回答】"];
  for (const q of form.questions) {
    const raw = responses[q.id];
    let text = "";
    if (Array.isArray(raw)) text = raw.join(", ");
    else if (typeof raw === "string") text = raw;
    lines.push(`${q.prompt}: ${text}`);
  }
  return lines.join("\n");
}

function getDisplayMessages() {
  const list = [...currentMessages];
  if (chatPending?.userText) {
    list.push({
      id: PENDING_USER_ID,
      role: "user",
      content: chatPending.userText,
    });
  }
  if (chatPending?.assistantWaiting) {
    list.push({
      id: PENDING_ASSISTANT_ID,
      role: "assistant",
      content: "",
      pending: true,
      activityLabel:
        chatPending.activityLabel ||
        inferFallbackActivityLabel(currentPhase),
    });
  }
  return list;
}

function renderMessagesFromState() {
  renderMessages(getDisplayMessages());
}

async function submitPendingForm(form) {
  if (!currentProjectId || chatBusy) return;
  const form_responses = collectFormResponses(form);
  chatPending = {
    userText: formatFormResponsesForDisplay(form, form_responses),
    assistantWaiting: true,
    activityLabel: inferFallbackActivityLabel(currentPhase),
  };
  currentPendingForm = null;
  renderMessagesFromState();
  setChatBusy(true);
  try {
    const result = await postProjectChat({ form_responses });
    applyChatResult(result);
  } catch (err) {
    chatPending = null;
    currentPendingForm = form;
    renderMessagesFromState();
    throw err;
  } finally {
    setChatBusy(false);
  }
}

/** スタジオを開く（チャット・フェーズ・プレビューを復元） */
async function openStudio(projectId) {
  showStudio(projectId);
  setStudioUrl(projectId);
  loadChatModeForProject(projectId);

  const data = await tpApi(`projects/${projectId}`);
  const project = data.project;
  document.getElementById("studio-title").value = project.title;
  document.getElementById("studio-status").textContent =
    project.status === "published" ? "公開済み" : "下書き";

  const { messages } = await tpApi(`projects/${projectId}/messages`);
  currentMessages = messages;
  chatPending = null;
  renderMessagesFromState();
  updatePhaseUI(
    project.workflow_phase,
    data.pending_form ?? null,
    null
  );
  refreshPreview();
  await refreshWorkspaceTree().catch(() => {});
  await loadImplementTasksFromWorkspace().catch(() => {});
  await loadRevisions(projectId).catch(() => {});
  setFileViewerState({ name: null, path: null, content: "" });
}

function renderMessages(messages) {
  const el = document.getElementById("chat-messages");
  el.replaceChildren();

  let lastUserMsgId = null;
  for (const msg of messages) {
    if (msg.role === "user") lastUserMsgId = msg.id;
  }

  for (const msg of messages) {
    const row = document.createElement("div");
    row.className = `tp-msg-row tp-msg-row--${msg.role}`;

    if (
      msg.role === "user" &&
      editingMessageId === msg.id &&
      !msg.content.startsWith("【フォーム回答】")
    ) {
      const editWrap = document.createElement("div");
      editWrap.className = "tp-msg tp-msg--user tp-msg-edit";
      const ta = document.createElement("textarea");
      ta.value = msg.content;
      ta.setAttribute("aria-label", "メッセージを編集");
      const actions = document.createElement("div");
      actions.className = "tp-msg-edit-actions";
      const cancelBtn = document.createElement("button");
      cancelBtn.type = "button";
      cancelBtn.className = "tp-btn";
      cancelBtn.textContent = "キャンセル";
      cancelBtn.addEventListener("click", () => {
        editingMessageId = null;
        renderMessagesFromState();
      });
      const saveBtn = document.createElement("button");
      saveBtn.type = "button";
      saveBtn.className = "tp-btn tp-btn--primary";
      saveBtn.textContent = "編集して再送信";
      saveBtn.addEventListener("click", () => {
        const next = ta.value.trim();
        if (!next) {
          alert("メッセージを入力してください");
          return;
        }
        sendChatWithRewind(msg.id, next).catch((err) => alert(err.message));
      });
      actions.appendChild(cancelBtn);
      actions.appendChild(saveBtn);
      editWrap.appendChild(ta);
      editWrap.appendChild(actions);
      row.appendChild(editWrap);
      el.appendChild(row);
      ta.focus();
      continue;
    }

    const div = document.createElement("div");
    if (msg.pending || msg.id === PENDING_ASSISTANT_ID) {
      div.className = "tp-msg tp-msg--assistant tp-msg--pending";
      div.setAttribute("aria-busy", "true");
      const activity = document.createElement("p");
      activity.className = "tp-activity";
      activity.textContent =
        msg.activityLabel || inferFallbackActivityLabel(currentPhase);
      div.appendChild(activity);
    } else {
      div.className = `tp-msg tp-msg--${msg.role}`;
      div.textContent = msg.content;
    }
    row.appendChild(div);

    if (
      msg.role === "user" &&
      msg.id !== PENDING_USER_ID &&
      !msg.content.startsWith("【フォーム回答】")
    ) {
      const actions = document.createElement("div");
      actions.className = "tp-msg-actions";
      const resendBtn = document.createElement("button");
      resendBtn.type = "button";
      resendBtn.className = "tp-msg-action";
      resendBtn.textContent = "再送信";
      resendBtn.addEventListener("click", () => {
        if (
          !confirm(
            "この発言とそれ以降の会話を削除し、同じ内容で再送信します。"
          )
        ) {
          return;
        }
        sendChatWithRewind(msg.id, msg.content).catch((err) =>
          alert(err.message)
        );
      });
      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "tp-msg-action";
      editBtn.textContent = "編集";
      editBtn.addEventListener("click", () => {
        editingMessageId = msg.id;
        renderMessagesFromState();
      });
      actions.appendChild(resendBtn);
      actions.appendChild(editBtn);
      row.appendChild(actions);
    }

    el.appendChild(row);

    if (msg.role === "user" && msg.id === lastUserMsgId) {
      appendImplementTodosRow(el);
    }
  }

  appendChatInlineChrome(el);
  el.scrollTop = el.scrollHeight;
}

function refreshPreview() {
  if (!currentProjectId) return;
  const iframe = document.getElementById("preview-iframe");
  iframe.src = `/api/third-party/projects/${currentProjectId}/preview?t=${Date.now()}`;
}

function applyChatResult(result) {
  chatPending = null;
  currentMessages = result.messages;
  renderMessagesFromState();
  if (result.htmlUpdated) refreshPreview();
  refreshWorkspaceTree().catch(() => {});
  loadImplementTasksFromWorkspace().catch(() => {});
  updatePhaseUI(result.phase, result.pending_form, result.review_summary);
}

function beginChatPending(text, rewindToMessageId) {
  const trimmed = text.trim();
  if (rewindToMessageId) {
    const idx = currentMessages.findIndex((m) => m.id === rewindToMessageId);
    if (idx >= 0) {
      currentMessages = currentMessages.slice(0, idx);
    }
    editingMessageId = null;
  }
  chatPending = {
    userText: trimmed,
    assistantWaiting: true,
    activityLabel:
      getChatMode() === "ask"
        ? "質問に回答中…"
        : inferFallbackActivityLabel(currentPhase),
  };
  renderMessagesFromState();
}

async function sendChatWithRewind(messageId, text) {
  if (!currentProjectId || !text.trim() || chatBusy) return;
  const trimmed = text.trim();
  beginChatPending(trimmed, messageId);
  setChatBusy(true);
  const input = document.getElementById("chat-input");
  try {
    const result = await postProjectChat({
      message: trimmed,
      rewind_to_message_id: messageId,
    });
    applyChatResult(result);
  } catch (err) {
    chatPending = null;
    renderMessagesFromState();
    throw err;
  } finally {
    input.value = "";
    setChatBusy(false);
    input.focus();
  }
}

async function sendChat(text, rewindToMessageId = null) {
  if (!currentProjectId || !text.trim() || chatBusy) return;
  const trimmed = text.trim();
  const input = document.getElementById("chat-input");
  input.value = "";
  input.focus();
  beginChatPending(trimmed, rewindToMessageId);
  setChatBusy(true);
  try {
    const body = { message: trimmed };
    if (rewindToMessageId) {
      body.rewind_to_message_id = rewindToMessageId;
    }
    const result = await postProjectChat(body);
    applyChatResult(result);
  } catch (err) {
    chatPending = null;
    if (!rewindToMessageId) {
      input.value = trimmed;
    }
    renderMessagesFromState();
    throw err;
  } finally {
    setChatBusy(false);
    input.focus();
  }
}

async function saveTitle() {
  if (!currentProjectId) return;
  const title = document.getElementById("studio-title").value.trim();
  if (!title) return;
  await tpApi(`projects/${currentProjectId}`, {
    method: "PATCH",
    body: JSON.stringify({ title }),
  });
}

async function openPublishModal() {
  const { groups } = await tpApi("my-groups");
  const select = document.getElementById("publish-group");
  select.replaceChildren();
  if (!groups.length) {
    alert("公開先のグループがありません。管理者にグループ所属を確認してください。");
    return;
  }
  for (const g of groups) {
    const opt = document.createElement("option");
    opt.value = g.id;
    opt.textContent = g.display_name;
    select.appendChild(opt);
  }
  document.getElementById("publish-modal").hidden = false;
}

async function confirmPublish() {
  const groupId = document.getElementById("publish-group").value;
  if (!currentProjectId || !groupId) return;
  document.getElementById("publish-confirm").disabled = true;
  try {
    const { project } = await tpApi(`projects/${currentProjectId}/publish`, {
      method: "POST",
      body: JSON.stringify({ group_id: groupId }),
    });
    document.getElementById("studio-status").textContent = "公開済み";
    document.getElementById("publish-modal").hidden = true;
    alert(`「${project.title}」を公開しました。一覧で確認できます。`);
  } catch (e) {
    alert(e instanceof Error ? e.message : "公開に失敗しました");
  } finally {
    document.getElementById("publish-confirm").disabled = false;
  }
}

function bindPreviewWidth() {
  const box = document.getElementById("preview-box");
  const full = document.getElementById("width-full");
  const mobile = document.getElementById("width-mobile");

  full.addEventListener("click", () => {
    box.classList.remove("tp-preview-frame-box--mobile");
    full.classList.add("is-active");
    mobile.classList.remove("is-active");
  });
  mobile.addEventListener("click", () => {
    box.classList.add("tp-preview-frame-box--mobile");
    mobile.classList.add("is-active");
    full.classList.remove("is-active");
  });
}

function bindEvents() {
  syncChatModeUi();
  document.getElementById("new-app-btn").addEventListener("click", () => {
    openCreateModal();
  });
  document.getElementById("create-cancel").addEventListener("click", () => {
    document.getElementById("create-modal").hidden = true;
  });
  document.getElementById("create-confirm").addEventListener("click", () => {
    const title = document.getElementById("create-title").value;
    document.getElementById("create-confirm").disabled = true;
    createAndOpenStudio(title)
      .catch((e) => alert(e.message))
      .finally(() => {
        document.getElementById("create-confirm").disabled = false;
      });
  });
  document.getElementById("create-title").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("create-confirm").click();
    }
  });

  document.getElementById("studio-back").addEventListener("click", () => {
    showGallery();
    loadGallery().catch(() => {});
  });
  document.getElementById("refresh-preview-btn").addEventListener("click", refreshPreview);
  const canvasRefresh = document.getElementById("canvas-refresh-preview");
  if (canvasRefresh) {
    canvasRefresh.addEventListener("click", refreshPreview);
  }

  document.getElementById("chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("chat-input");
    const text = input.value;
    sendChat(text).catch((err) => alert(err.message));
  });

  const chatModeGroup = document.getElementById("chat-mode");
  if (chatModeGroup) {
    chatModeGroup.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-chat-mode]");
      if (!btn) return;
      const mode = btn.getAttribute("data-chat-mode");
      if (mode) setChatMode(mode);
    });
  }

  document.querySelectorAll(".tp-suggest").forEach((btn) => {
    btn.addEventListener("click", () => {
      const prompt = btn.getAttribute("data-prompt") || "";
      sendChat(prompt).catch((err) => alert(err.message));
    });
  });

  document.getElementById("chat-messages").addEventListener("click", (e) => {
    const deepen = e.target.closest('[data-action="gate-deepen"]');
    if (deepen) {
      sendChat("要件を深掘り").catch((err) => alert(err.message));
      return;
    }
    const build = e.target.closest('[data-action="gate-build"]');
    if (build) {
      sendChat("実装に進む").catch((err) => alert(err.message));
      return;
    }
    const start = e.target.closest('[data-action="gate-implement-start"]');
    if (start) {
      sendChat("実装開始").catch((err) => alert(err.message));
    }
  });

  document.getElementById("studio-title").addEventListener("input", () => {
    clearTimeout(titleSaveTimer);
    titleSaveTimer = setTimeout(() => {
      saveTitle().catch(() => {});
    }, 600);
  });

  document.getElementById("publish-btn").addEventListener("click", () => {
    openPublishModal().catch((e) => alert(e.message));
  });
  document.getElementById("publish-cancel").addEventListener("click", () => {
    document.getElementById("publish-modal").hidden = true;
  });
  document.getElementById("publish-confirm").addEventListener("click", () => {
    confirmPublish();
  });

  bindPreviewWidth();

  document.getElementById("canvas-tab-preview").addEventListener("click", () => {
    setCanvasTab("preview");
  });
  document.getElementById("canvas-tab-files").addEventListener("click", () => {
    setCanvasTab("files");
    refreshWorkspaceTree().catch(() => {});
  loadImplementTasksFromWorkspace().catch(() => {});
  });
}

async function init() {
  const ok = await checkAccess();
  document.getElementById("app-loading").hidden = true;
  if (!ok) return;

  document.getElementById("app-root").hidden = false;
  bindEvents();
  await loadGallery();

  const resumeId = new URLSearchParams(window.location.search).get("project");
  if (resumeId) {
    try {
      await openStudio(resumeId);
    } catch (e) {
      setStudioUrl(null);
      alert(
        e instanceof Error ? e.message : "プロジェクトを開けませんでした"
      );
    }
  }
}

init().catch((e) => {
  document.getElementById("app-loading").textContent =
    e instanceof Error ? e.message : "読み込みに失敗しました";
});
