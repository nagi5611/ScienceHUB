/**
 * 管理パネル — Runa（チャットログ閲覧・検索プロバイダ設定）
 */

let runaSettings = null;
let runaConversations = [];
let selectedConversationId = null;
let runaUserFilter = "";
/** @type {(value: string) => string} */
let escapeHtmlFn = (value) => String(value);

function formatDateTime(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function userLabel(row) {
  const name = row.display_name || row.username || row.email || row.user_id;
  const sub = row.email && row.display_name ? row.email : row.username ? `@${row.username}` : "";
  return sub ? `${name} (${sub})` : name;
}

function renderProviderToggles(container, category, settings) {
  if (!container || !settings) return;
  const flags = settings[category] ?? {};
  const providers = ["serpbase", "serper", "brave", "exa"];
  const labels = {
    serpbase: "SerpBase",
    serper: "Serper",
    brave: "Brave",
    exa: "Exa",
  };
  container.innerHTML = providers
    .map(
      (key) => `
    <label class="cf-runa-toggle">
      <input type="checkbox" data-runa-provider="${key}" data-runa-category="${category}" ${
        flags[key] !== false ? "checked" : ""
      }>
      <span>${labels[key] ?? key}</span>
    </label>`
    )
    .join("");
}

function collectSettingsFromDom() {
  const multi = { serpbase: true, serper: true, brave: true, exa: true };
  const deep = { serpbase: true, serper: true, brave: true, exa: true };
  document.querySelectorAll("[data-runa-provider]").forEach((input) => {
    if (!(input instanceof HTMLInputElement)) return;
    const provider = input.dataset.runaProvider;
    const category = input.dataset.runaCategory;
    if (!provider || !category) return;
    const value = input.checked;
    if (category === "multi_search") multi[provider] = value;
    if (category === "deep_research") deep[provider] = value;
  });
  return { multi_search: multi, deep_research: deep };
}

export async function loadRunaSettings(api) {
  const data = await api("/api/admin/runa/settings");
  runaSettings = data.settings;
  renderProviderToggles(
    document.getElementById("runa-providers-multi"),
    "multi_search",
    runaSettings
  );
  renderProviderToggles(
    document.getElementById("runa-providers-deep"),
    "deep_research",
    runaSettings
  );
}

export async function saveRunaSettings(api) {
  const settings = collectSettingsFromDom();
  const data = await api("/api/admin/runa/settings", {
    method: "PATCH",
    body: JSON.stringify({ settings }),
  });
  runaSettings = data.settings;
  const status = document.getElementById("runa-settings-status");
  if (status) {
    status.textContent = "保存しました";
    status.hidden = false;
    setTimeout(() => {
      status.hidden = true;
    }, 2500);
  }
}

export async function loadRunaConversations(api, userId) {
  const q = userId?.trim() ? `?userId=${encodeURIComponent(userId.trim())}&limit=100` : "?limit=80";
  const data = await api(`/api/admin/runa/conversations${q}`);
  runaConversations = data.conversations ?? [];
  renderRunaConversationList();
}

function renderRunaConversationList() {
  const escapeHtml = escapeHtmlFn;
  const list = document.getElementById("runa-conversation-list");
  if (!list) return;

  const filtered = runaUserFilter.trim()
    ? runaConversations.filter((c) => {
        const q = runaUserFilter.trim().toLowerCase();
        return (
          (c.email ?? "").toLowerCase().includes(q) ||
          (c.username ?? "").toLowerCase().includes(q) ||
          (c.display_name ?? "").toLowerCase().includes(q) ||
          (c.title ?? "").toLowerCase().includes(q)
        );
      })
    : runaConversations;

  if (!filtered.length) {
    list.innerHTML = `<p class="cf-empty">会話がありません</p>`;
    return;
  }

  list.innerHTML = filtered
    .map((c) => {
      const active = c.id === selectedConversationId ? " is-active" : "";
      const activeBadge = c.is_active ? '<span class="cf-runa-active-badge">現在</span>' : "";
      return `<button type="button" class="cf-runa-conv-item${active}" data-conversation-id="${escapeHtml(c.id)}">
        <span class="cf-runa-conv-title">${escapeHtml(c.title || "チャット")} ${activeBadge}</span>
        <span class="cf-runa-conv-meta">${escapeHtml(userLabel(c))} · ${c.message_count ?? 0} 件 · ${formatDateTime(c.updated_at)}</span>
      </button>`;
    })
    .join("");
}

async function loadRunaMessages(api, conversationId) {
  const escapeHtml = escapeHtmlFn;
  const panel = document.getElementById("runa-message-log");
  if (!panel) return;
  panel.innerHTML = `<p class="cf-empty">読み込み中…</p>`;
  const data = await api(
    `/api/admin/runa/conversations/${encodeURIComponent(conversationId)}/messages?limit=300`
  );
  const messages = data.messages ?? [];
  if (!messages.length) {
    panel.innerHTML = `<p class="cf-empty">メッセージがありません</p>`;
    return;
  }
  panel.innerHTML = messages
    .map((m) => {
      const role = m.role === "user" ? "ユーザー" : "Runa";
      const cls = m.role === "user" ? "cf-runa-msg-user" : "cf-runa-msg-assistant";
      return `<article class="cf-runa-msg ${cls}">
        <header><strong>${role}</strong> <time>${formatDateTime(m.created_at)}</time></header>
        <pre class="cf-runa-msg-body">${escapeHtml(m.content ?? "")}</pre>
      </article>`;
    })
    .join("");
  panel.scrollTop = panel.scrollHeight;
}

export function bindRunaEvents({ api }) {
  document.getElementById("runa-settings-save")?.addEventListener("click", async () => {
    try {
      await saveRunaSettings(api);
    } catch (err) {
      alert(err.message);
    }
  });

  document.getElementById("runa-conversations-refresh")?.addEventListener("click", async () => {
    try {
      const userId = document.getElementById("runa-user-id-filter")?.value?.trim();
      await loadRunaConversations(api, userId);
    } catch (err) {
      alert(err.message);
    }
  });

  document.getElementById("runa-user-filter")?.addEventListener("input", (e) => {
    runaUserFilter = e.target.value;
    renderRunaConversationList();
  });

  document.getElementById("runa-conversation-list")?.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-conversation-id]");
    if (!btn) return;
    const id = btn.getAttribute("data-conversation-id");
    if (!id) return;
    selectedConversationId = id;
    renderRunaConversationList();
    try {
      await loadRunaMessages(api, id);
    } catch (err) {
      alert(err.message);
    }
  });
}

export async function initRunaAdmin(api, escapeHtml) {
  escapeHtmlFn = escapeHtml;
  await loadRunaSettings(api);
  await loadRunaConversations(api);
}
