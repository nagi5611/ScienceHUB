/**
 * AI エージェント用トークン管理 UI
 */

async function agentTokenRequest(path, options = {}) {
  const response = await fetch(`/api/agent-tokens${path}`, {
    credentials: "same-origin",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (response.status === 401) {
    const returnTo = window.location.pathname + window.location.search + window.location.hash;
    window.location.href = "/?next=" + encodeURIComponent(returnTo);
    throw new Error("ログインが必要です");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? "リクエストに失敗しました");
  }
  return data;
}

function formatDate(ms) {
  if (!ms) return "—";
  return new Date(ms).toLocaleString("ja-JP");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** トークン一覧を描画 */
async function renderAgentTokenList(container) {
  const { tokens } = await agentTokenRequest("");
  if (!tokens.length) {
    container.innerHTML = '<p class="cs-agent-token-empty">トークンはまだありません。</p>';
    return;
  }

  const rows = tokens
    .map((token) => {
      const revoked = token.revoked_at ? "（失効済み）" : "";
      return `
        <div class="cs-agent-token-row" data-token-id="${escapeHtml(token.id)}">
          <div class="cs-agent-token-meta">
            <strong>${escapeHtml(token.name)}</strong>
            <span class="cs-agent-token-prefix">${escapeHtml(token.token_prefix)}…</span>
            <span class="cs-agent-token-dates">最終利用: ${formatDate(token.last_used_at)}${revoked}</span>
          </div>
          ${
            token.revoked_at
              ? ""
              : `<button type="button" class="cs-btn cs-btn-danger cs-agent-token-revoke">失効</button>`
          }
        </div>
      `;
    })
    .join("");

  container.innerHTML = rows;

  container.querySelectorAll(".cs-agent-token-revoke").forEach((button) => {
    button.addEventListener("click", async () => {
      const row = button.closest(".cs-agent-token-row");
      const tokenId = row?.getAttribute("data-token-id");
      if (!tokenId) return;
      if (!window.confirm("このトークンを失効しますか？エージェントからは使えなくなります。")) {
        return;
      }
      try {
        await agentTokenRequest(`/${encodeURIComponent(tokenId)}`, { method: "DELETE" });
        await renderAgentTokenList(container);
      } catch (err) {
        alert(err.message);
      }
    });
  });
}

/** トークン作成結果を表示 */
function showCreatedToken(container, token) {
  const block = document.createElement("div");
  block.className = "cs-agent-token-created";
  block.innerHTML = `
    <p class="cs-agent-token-warning">このトークンは一度だけ表示されます。安全な場所に保存してください。</p>
    <div class="cs-agent-token-value-row">
      <code class="cs-agent-token-value" id="cs-agent-token-value">${escapeHtml(token.token)}</code>
      <button type="button" class="cs-btn" id="cs-agent-token-copy">コピー</button>
    </div>
  `;
  container.prepend(block);

  document.getElementById("cs-agent-token-copy")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(token.token);
      alert("コピーしました");
    } catch {
      alert("コピーに失敗しました");
    }
  });
}

/** AI エージェント連携ダイアログを初期化 */
export function initAgentTokensDialog() {
  const dialog = document.getElementById("cs-agent-dialog");
  const openBtn = document.getElementById("cs-agent-btn");
  const listEl = document.getElementById("cs-agent-token-list");
  const nameInput = document.getElementById("cs-agent-token-name");
  const createBtn = document.getElementById("cs-agent-token-create");
  const closeBtn = document.getElementById("cs-agent-dialog-close");
  const closeBtn2 = document.getElementById("cs-agent-dialog-close-btn");

  if (!dialog || !openBtn || !listEl || !nameInput || !createBtn) return;

  async function openDialog() {
    dialog.querySelector(".cs-agent-token-created")?.remove();
    nameInput.value = "";
    await renderAgentTokenList(listEl);
    dialog.showModal();
  }

  openBtn.addEventListener("click", () => {
    openDialog().catch((err) => alert(err.message));
  });

  closeBtn?.addEventListener("click", () => dialog.close());
  closeBtn2?.addEventListener("click", () => dialog.close());

  createBtn.addEventListener("click", async () => {
    const name = nameInput.value.trim();
    if (!name) {
      alert("トークン名を入力してください");
      return;
    }
    createBtn.disabled = true;
    try {
      const { token } = await agentTokenRequest("", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      dialog.querySelector(".cs-agent-token-created")?.remove();
      showCreatedToken(dialog.querySelector(".cs-agent-dialog-body"), token);
      await renderAgentTokenList(listEl);
      nameInput.value = "";
    } catch (err) {
      alert(err.message);
    } finally {
      createBtn.disabled = false;
    }
  });
}
