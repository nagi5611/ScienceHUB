/**
 * ScienceHUB — フロントエンド共通スクリプト
 */

const THEME_KEY = "sciencehub-theme";

/** 保存済みまたは OS 設定からテーマを適用する */
function applyTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved ?? (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
}

/** ライト / ダークを切り替える */
function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") ?? "light";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(THEME_KEY, next);
}

/** ヘルスチェック API の結果を UI に反映する */
async function loadStatus() {
  const panel = document.getElementById("status-panel");
  if (!panel) return;

  try {
    const response = await fetch("/api/health");
    const data = await response.json();

    const items = Object.entries(data.checks ?? {}).map(([name, check]) => {
      const label = name.toUpperCase();
      const badgeClass = check.ok ? "status-badge-ok" : "status-badge-error";
      const badgeText = check.ok ? "接続 OK" : "エラー";

      return `
        <div class="status-item">
          <div>
            <div class="status-item-label">${label}</div>
            <div class="status-item-detail">${check.detail ?? ""}</div>
          </div>
          <span class="status-badge ${badgeClass}">${badgeText}</span>
        </div>
      `;
    });

    panel.innerHTML = `
      <div class="status-grid">${items.join("")}</div>
      <p class="status-overall">
        全体: <strong>${data.status === "ok" ? "正常" : "一部異常"}</strong>
        · 最終確認: ${new Date(data.timestamp).toLocaleString("ja-JP")}
      </p>
    `;
  } catch {
    panel.innerHTML = `
      <p class="status-loading">
        API に接続できませんでした。<code>npm run dev</code> でローカル開発サーバーを起動してください。
      </p>
    `;
  }
}

applyTheme();

document.getElementById("theme-toggle")?.addEventListener("click", toggleTheme);
loadStatus();
