/**
 * 各アプリ右下のチュートリアルヒーロー
 */

const MASCOT_SVG = `<svg viewBox="0 0 96 96" aria-hidden="true">
  <circle cx="48" cy="48" r="46" fill="#F38020"/>
  <circle cx="48" cy="48" r="38" fill="#FFC14A"/>
  <ellipse cx="48" cy="62" rx="18" ry="10" fill="#F38020"/>
  <circle cx="35" cy="42" r="6.5" fill="#2B2118"/>
  <circle cx="61" cy="42" r="6.5" fill="#2B2118"/>
  <circle cx="37" cy="40.5" r="2" fill="#fff"/>
  <circle cx="63" cy="40.5" r="2" fill="#fff"/>
  <path d="M38 58c3.4 5 16.6 5 20 0" fill="none" stroke="#2B2118" stroke-width="3" stroke-linecap="round"/>
</svg>`;

/** パスからアプリ slug を取り出す */
function resolveAppSlug() {
  const match = window.location.pathname.match(/^\/apps\/([^/]+)/);
  return match?.[1] ?? "";
}

/** サイズ表示 */
function formatSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** HTML エスケープ */
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** ヒーロー UI を初期化する */
export async function initAppTutorialHero() {
  const slug = resolveAppSlug();
  if (!slug) return;

  const response = await fetch(`/api/apps/${encodeURIComponent(slug)}/tutorials`, {
    credentials: "same-origin",
  });
  if (response.status === 401 || response.status === 403) return;
  if (!response.ok) return;

  const data = await response.json().catch(() => ({}));
  const videos = Array.isArray(data.videos) ? data.videos : [];
  if (videos.length === 0) return;

  const appName = data.app?.display_name ?? "チュートリアル";
  mountHero(slug, appName, videos);
}

/** DOM を組み立てる */
function mountHero(slug, appName, videos) {
  const dismissedKey = `sciencehub-tutorial-dismissed:${slug}`;
  let open = sessionStorage.getItem(dismissedKey) !== "1";
  let activeId = videos[0]?.id ?? "";

  if (!document.querySelector('link[href="/css/app-tutorial-hero.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/css/app-tutorial-hero.css";
    document.head.appendChild(link);
  }

  const root = document.createElement("div");
  root.className = "focusScope tutorial-hero-scope";
  root.setAttribute("data-focus-scope", "");
  document.body.appendChild(root);

  /** 描画 */
  function render() {
    const active = videos.find((video) => video.id === activeId) ?? videos[0];
    const dialog = open && active
      ? `<div class="tutorialDialog fade-enter-done" role="dialog" aria-label="${escapeHtml(appName)}のチュートリアル">
          <div class="tutorialDialog-header">
            <h2 class="tutorialDialog-title">${escapeHtml(appName)}</h2>
            <button type="button" class="tutorialDialog-close" data-tutorial-close aria-label="閉じる">×</button>
          </div>
          <div class="tutorialDialog-player">
            <video src="${escapeHtml(active.file_url)}" controls playsinline></video>
          </div>
          <ul class="tutorialDialog-list">
            ${videos
              .map(
                (video, index) => `
              <li>
                <button type="button" class="tutorialDialog-item${video.id === active.id ? " is-active" : ""}" data-tutorial-id="${escapeHtml(video.id)}">
                  <span class="tutorialDialog-item-index">${index + 1}</span>
                  <span class="tutorialDialog-item-body">
                    <span class="tutorialDialog-item-title">${escapeHtml(video.title)}</span>
                    <span class="tutorialDialog-item-meta">${escapeHtml(formatSize(video.size_bytes))}</span>
                  </span>
                </button>
              </li>`
              )
              .join("")}
          </ul>
        </div>`
      : "";

    root.innerHTML = `
      ${dialog}
      <div class="tutorial-hero-mascot-wrap">
        <span class="tutorial-hero-badge">${videos.length}</span>
        <button type="button" class="tutorial-hero-mascot" data-tutorial-toggle aria-label="チュートリアル" aria-expanded="${open ? "true" : "false"}">
          ${MASCOT_SVG}
        </button>
      </div>
    `;
  }

  root.addEventListener("click", (event) => {
    const closeBtn = event.target.closest("[data-tutorial-close]");
    if (closeBtn) {
      open = false;
      sessionStorage.setItem(dismissedKey, "1");
      render();
      return;
    }

    const toggleBtn = event.target.closest("[data-tutorial-toggle]");
    if (toggleBtn) {
      open = !open;
      if (!open) sessionStorage.setItem(dismissedKey, "1");
      else sessionStorage.removeItem(dismissedKey);
      render();
      return;
    }

    const itemBtn = event.target.closest("[data-tutorial-id]");
    if (itemBtn) {
      activeId = itemBtn.dataset.tutorialId;
      open = true;
      render();
    }
  });

  render();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initAppTutorialHero().catch(() => {});
  });
} else {
  initAppTutorialHero().catch(() => {});
}
