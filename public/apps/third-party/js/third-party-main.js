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
  await_implement_confirm: "実装確認",
  draft_ready: "実装完了",
};

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

function showGallery() {
  document.getElementById("gallery-view").hidden = false;
  document.getElementById("studio-view").hidden = true;
  currentProjectId = null;
  currentPhase = null;
  currentPendingForm = null;
  setStudioUrl(null);
}

function showStudio(projectId) {
  document.getElementById("gallery-view").hidden = true;
  document.getElementById("studio-view").hidden = false;
  currentProjectId = projectId;
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
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tp-card tp-card--mine";
      const statusBadge =
        p.status === "published"
          ? `<span class="tp-card-badge tp-card-badge--published">公開済み</span>`
          : `<span class="tp-card-badge tp-card-badge--draft">下書き</span>`;
      const phase = phaseLabel(p.workflow_phase);
      btn.innerHTML = `
        ${statusBadge}
        <div class="tp-card-emoji">${p.icon_emoji || "🧩"}</div>
        <p class="tp-card-title">${escapeHtml(p.title)}</p>
        <p class="tp-card-meta">${escapeHtml(phase || "開発中")} · 更新 ${formatDate(p.updated_at)}</p>
      `;
      btn.addEventListener("click", () => {
        openStudio(p.id).catch((e) => alert(e.message));
      });
      myGrid.appendChild(btn);
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
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tp-card";
      btn.innerHTML = `
        <div class="tp-card-emoji">${app.icon_emoji || "🧩"}</div>
        <p class="tp-card-title">${escapeHtml(app.title)}</p>
        <p class="tp-card-meta">${escapeHtml(app.owner_display_name)} · ${formatDate(app.published_at)}</p>
      `;
      btn.addEventListener("click", () => {
        window.location.href = app.view_href;
      });
      grid.appendChild(btn);
    }
  }
}

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
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
  const input = document.getElementById("chat-input");
  const send = document.getElementById("chat-send");
  const formSubmit = document.getElementById("chat-form-submit");
  input.disabled = busy;
  send.disabled = busy;
  if (formSubmit) formSubmit.disabled = busy;
  document.getElementById("gate-deepen").disabled = busy;
  document.getElementById("gate-build").disabled = busy;
  const implementStart = document.getElementById("gate-implement-start");
  if (implementStart) implementStart.disabled = busy;
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
  const showSuggest =
    currentPhase === "discovery" || currentPhase === "clarify";
  suggestions.hidden = !showSuggest;

  const gate = document.getElementById("chat-gate");
  gate.hidden = currentPhase !== "gate_deepen_or_build";

  const implementConfirm = document.getElementById("chat-implement-confirm");
  implementConfirm.hidden = currentPhase !== "await_implement_confirm";

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

  renderPendingForm(currentPendingForm);
}

function renderPendingForm(form) {
  const container = document.getElementById("chat-dynamic-form");
  container.replaceChildren();
  if (!form?.questions?.length) {
    container.hidden = true;
    return;
  }

  container.hidden = false;
  const title = document.createElement("p");
  title.className = "tp-form-title";
  title.textContent = form.title || "回答してください";
  container.appendChild(title);

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
  submit.textContent = "フォームを送信";
  formEl.appendChild(submit);

  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    submitPendingForm(form).catch((err) => alert(err.message));
  });

  container.appendChild(formEl);
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

async function submitPendingForm(form) {
  if (!currentProjectId || chatBusy) return;
  const form_responses = collectFormResponses(form);
  setChatBusy(true);
  try {
    const result = await tpApi(`projects/${currentProjectId}/chat`, {
      method: "POST",
      body: JSON.stringify({ form_responses }),
    });
    applyChatResult(result);
  } finally {
    setChatBusy(false);
  }
}

/** スタジオを開く（チャット・フェーズ・プレビューを復元） */
async function openStudio(projectId) {
  showStudio(projectId);
  setStudioUrl(projectId);

  const data = await tpApi(`projects/${projectId}`);
  const project = data.project;
  document.getElementById("studio-title").value = project.title;
  document.getElementById("studio-status").textContent =
    project.status === "published" ? "公開済み" : "下書き";

  const { messages } = await tpApi(`projects/${projectId}/messages`);
  renderMessages(messages);
  updatePhaseUI(
    project.workflow_phase,
    data.pending_form ?? null,
    null
  );
  refreshPreview();
}

function renderMessages(messages) {
  const el = document.getElementById("chat-messages");
  el.replaceChildren();
  for (const msg of messages) {
    const div = document.createElement("div");
    div.className = `tp-msg tp-msg--${msg.role}`;
    div.textContent = msg.content;
    el.appendChild(div);
  }
  el.scrollTop = el.scrollHeight;
}

function refreshPreview() {
  if (!currentProjectId) return;
  const iframe = document.getElementById("preview-iframe");
  iframe.src = `/api/third-party/projects/${currentProjectId}/preview?t=${Date.now()}`;
}

function applyChatResult(result) {
  renderMessages(result.messages);
  if (result.htmlUpdated) refreshPreview();
  updatePhaseUI(result.phase, result.pending_form, result.review_summary);
}

async function sendChat(text) {
  if (!currentProjectId || !text.trim() || chatBusy) return;
  setChatBusy(true);
  const input = document.getElementById("chat-input");
  try {
    const result = await tpApi(`projects/${currentProjectId}/chat`, {
      method: "POST",
      body: JSON.stringify({ message: text }),
    });
    applyChatResult(result);
  } finally {
    input.value = "";
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

  document.getElementById("chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("chat-input");
    const text = input.value;
    sendChat(text).catch((err) => alert(err.message));
  });

  document.querySelectorAll(".tp-suggest").forEach((btn) => {
    btn.addEventListener("click", () => {
      const prompt = btn.getAttribute("data-prompt") || "";
      sendChat(prompt).catch((err) => alert(err.message));
    });
  });

  document.getElementById("gate-deepen").addEventListener("click", () => {
    sendChat("要件を深掘り").catch((err) => alert(err.message));
  });
  document.getElementById("gate-build").addEventListener("click", () => {
    sendChat("実装に進む").catch((err) => alert(err.message));
  });
  document.getElementById("gate-implement-start").addEventListener("click", () => {
    sendChat("実装開始").catch((err) => alert(err.message));
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
