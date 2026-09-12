/**
 * 各アプリ右下のチュートリアルヒーロー
 */

const PLAY_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>`;
const PAUSE_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 5h4v14H6V5zm8 0h4v14h-4V5z"/></svg>`;
const EXPAND_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 7h4V5H5v6h2V7zm10 0v4h2V5h-6v2h4zM7 17v-4H5v6h6v-2H7zm10 0h-4v2h6v-6h-2v4z"/></svg>`;
const COLLAPSE_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 9H5v2h2v2h2V9zm10 0h-2v4h-2v2h4V9zM9 15H7v-2H5v4h4v-2zm10 0v2h-2v2h4v-4h-2z"/></svg>`;

/** パスからアプリ slug を取り出す */
function resolveAppSlug() {
  const match = window.location.pathname.match(/^\/apps\/([^/]+)/);
  return match?.[1] ?? "";
}

/** HTML エスケープ */
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** 秒数を mm:ss にする */
function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
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

/** カスタム動画プレイヤーを初期化する */
function setupVideoPlayer(root) {
  const stage = root.querySelector(".tutorialDialog-stage");
  const video = root.querySelector(".tutorialDialog-video");
  if (!(stage instanceof HTMLElement) || !(video instanceof HTMLVideoElement)) return;

  const overlayPlay = stage.querySelector(".tutorialDialog-play");
  const togglePlay = stage.querySelector(".tutorialDialog-toggle-play");
  const progressTrack = stage.querySelector(".tutorialDialog-progress-track");
  const progressFill = stage.querySelector(".tutorialDialog-progress-fill");
  const timeEl = stage.querySelector(".tutorialDialog-time");

  /** 再生状態を UI に反映 */
  function syncPlayingState() {
    stage.classList.toggle("is-playing", !video.paused && !video.ended);
    const icon = video.paused || video.ended ? PLAY_ICON : PAUSE_ICON;
    if (overlayPlay instanceof HTMLButtonElement) overlayPlay.innerHTML = icon;
    if (togglePlay instanceof HTMLButtonElement) togglePlay.innerHTML = icon;
  }

  /** 進捗バーと時間表示を更新 */
  function syncProgress() {
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    const current = Number.isFinite(video.currentTime) ? video.currentTime : 0;
    const ratio = duration > 0 ? (current / duration) * 100 : 0;
    if (progressFill instanceof HTMLElement) {
      progressFill.style.width = `${Math.min(100, Math.max(0, ratio))}%`;
    }
    if (timeEl instanceof HTMLElement) {
      timeEl.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
    }
  }

  /** 再生/一時停止を切り替える */
  async function togglePlayback() {
    if (video.paused || video.ended) {
      try {
        await video.play();
      } catch {
        /* autoplay policy */
      }
    } else {
      video.pause();
    }
    syncPlayingState();
    syncProgress();
  }

  /** シーク位置を更新 */
  function seekFromClientX(clientX) {
    if (!(progressTrack instanceof HTMLElement)) return;
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    if (duration <= 0) return;
    const rect = progressTrack.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    video.currentTime = duration * ratio;
    syncProgress();
  }

  overlayPlay?.addEventListener("click", (event) => {
    event.stopPropagation();
    togglePlayback();
  });
  togglePlay?.addEventListener("click", (event) => {
    event.stopPropagation();
    togglePlayback();
  });
  stage.addEventListener("click", (event) => {
    if (event.target.closest(".tutorialDialog-controls, .tutorialDialog-play")) return;
    togglePlayback();
  });
  progressTrack?.addEventListener("click", (event) => {
    event.stopPropagation();
    seekFromClientX(event.clientX);
  });

  video.addEventListener("loadedmetadata", syncProgress);
  video.addEventListener("timeupdate", syncProgress);
  video.addEventListener("play", syncPlayingState);
  video.addEventListener("pause", syncPlayingState);
  video.addEventListener("ended", syncPlayingState);

  syncPlayingState();
  syncProgress();
}

/** DOM を組み立てる */
function mountHero(slug, appName, videos) {
  const dismissedKey = `sciencehub-tutorial-dismissed:${slug}`;
  let open = sessionStorage.getItem(dismissedKey) !== "1";
  let maximized = false;
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

  /** 再生中の動画を止める */
  function pauseCurrentVideo() {
    const video = root.querySelector(".tutorialDialog-video");
    if (video instanceof HTMLVideoElement) {
      video.pause();
    }
  }

  /** 最大化ボタンの表示を更新 */
  function syncMaximizeButton() {
    const btn = root.querySelector("[data-tutorial-maximize]");
    if (!(btn instanceof HTMLButtonElement)) return;
    btn.innerHTML = maximized ? COLLAPSE_ICON : EXPAND_ICON;
    btn.setAttribute("aria-label", maximized ? "元のサイズに戻す" : "最大表示");
    btn.setAttribute("aria-pressed", maximized ? "true" : "false");
  }

  /** 最大化状態を切り替える */
  function toggleMaximize() {
    maximized = !maximized;
    const dialog = root.querySelector(".tutorialDialog");
    if (dialog instanceof HTMLElement) {
      dialog.classList.toggle("is-maximized", maximized);
    }
    syncMaximizeButton();
  }

  /** 描画 */
  function render() {
    const active = videos.find((video) => video.id === activeId) ?? videos[0];
    const dialog = open && active
      ? `<div class="tutorialDialog fade-enter-done${maximized ? " is-maximized" : ""}" role="dialog" aria-label="${escapeHtml(appName)}のチュートリアル">
          <div class="tutorialDialog-header">
            <h2 class="tutorialDialog-title">${escapeHtml(appName)}</h2>
            <div class="tutorialDialog-header-actions">
              <button type="button" class="tutorialDialog-maximize" data-tutorial-maximize aria-label="最大表示" aria-pressed="${maximized ? "true" : "false"}">${maximized ? COLLAPSE_ICON : EXPAND_ICON}</button>
              <button type="button" class="tutorialDialog-close" data-tutorial-close aria-label="閉じる">×</button>
            </div>
          </div>
          <div class="tutorialDialog-player">
            <div class="tutorialDialog-stage">
              <video class="tutorialDialog-video" src="${escapeHtml(active.file_url)}" playsinline preload="metadata"></video>
              <div class="tutorialDialog-overlay">
                <button type="button" class="tutorialDialog-play" aria-label="再生">${PLAY_ICON}</button>
              </div>
              <div class="tutorialDialog-controls">
                <button type="button" class="tutorialDialog-toggle-play" aria-label="再生/一時停止">${PLAY_ICON}</button>
                <div class="tutorialDialog-progress">
                  <div class="tutorialDialog-progress-track">
                    <div class="tutorialDialog-progress-fill"></div>
                  </div>
                </div>
                <span class="tutorialDialog-time">0:00 / 0:00</span>
              </div>
            </div>
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
      <div class="tutorial-hero-trigger-wrap">
        <span class="tutorial-hero-badge">${videos.length}</span>
        <button type="button" class="tutorial-hero-trigger" data-tutorial-toggle aria-label="チュートリアル" aria-expanded="${open ? "true" : "false"}">
          <span class="tutorial-hero-trigger-icon">?</span>
        </button>
      </div>
    `;

    if (open && active) {
      setupVideoPlayer(root);
    }
  }

  root.addEventListener("click", (event) => {
    const closeBtn = event.target.closest("[data-tutorial-close]");
    if (closeBtn) {
      pauseCurrentVideo();
      maximized = false;
      open = false;
      sessionStorage.setItem(dismissedKey, "1");
      render();
      return;
    }

    const maximizeBtn = event.target.closest("[data-tutorial-maximize]");
    if (maximizeBtn) {
      toggleMaximize();
      return;
    }

    const toggleBtn = event.target.closest("[data-tutorial-toggle]");
    if (toggleBtn) {
      if (open) pauseCurrentVideo();
      maximized = false;
      open = !open;
      if (!open) sessionStorage.setItem(dismissedKey, "1");
      else sessionStorage.removeItem(dismissedKey);
      render();
      return;
    }

    const itemBtn = event.target.closest("[data-tutorial-id]");
    if (itemBtn) {
      pauseCurrentVideo();
      activeId = itemBtn.dataset.tutorialId;
      open = true;
      render();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !maximized) return;
    if (!root.isConnected) return;
    maximized = false;
    const dialog = root.querySelector(".tutorialDialog");
    if (dialog instanceof HTMLElement) {
      dialog.classList.remove("is-maximized");
    }
    syncMaximizeButton();
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
