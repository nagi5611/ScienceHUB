/**
 * 各アプリ右下のチュートリアルヒーロー
 */

const PLAY_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>`;
const PAUSE_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 5h4v14H6V5zm8 0h4v14h-4V5z"/></svg>`;
const OVERLAY_FADE_MS = 1000;

/** パスからアプリ slug を取り出す */
function resolveAppSlug() {
  const match = window.location.pathname.match(/^\/apps\/([^/]+)/);
  return match?.[1] ?? "";
}

/** 一度でもチュートリアルを開いたかの localStorage キー */
function dismissedKeyFor(slug) {
  return `sciencehub-tutorial-dismissed:${slug}`;
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

/** チュートリアル CSS を読み込む */
function ensureTutorialStyles() {
  if (document.querySelector('link[href="/css/app-tutorial-hero.css"]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/css/app-tutorial-hero.css";
  document.head.appendChild(link);
}

/** チュートリアル API から動画一覧を取得 */
async function fetchTutorialVideos(slug) {
  const response = await fetch(`/api/apps/${encodeURIComponent(slug)}/tutorials`, {
    credentials: "same-origin",
  });
  if (response.status === 401 || response.status === 403) return null;
  if (!response.ok) return null;

  const data = await response.json().catch(() => ({}));
  const videos = Array.isArray(data.videos) ? data.videos : [];
  if (videos.length === 0) return null;

  return {
    appName: data.app?.display_name ?? "チュートリアル",
    videos,
  };
}

/** ヒーロー UI を初期化する */
export async function initAppTutorialHero() {
  const slug = resolveAppSlug();
  if (!slug) return;

  ensureTutorialStyles();

  const dismissedKey = dismissedKeyFor(slug);
  const hasOpenedBefore = localStorage.getItem(dismissedKey) === "1";

  if (hasOpenedBefore) {
    mountHero(slug, { open: false, autoplay: false });
    return;
  }

  const payload = await fetchTutorialVideos(slug);
  if (!payload) return;

  mountHero(slug, {
    appName: payload.appName,
    videos: payload.videos,
    open: true,
    autoplay: true,
  });
}

/** 中央オーバーレイを 1 秒かけてフェードアウト */
function fadeOutOverlay(stage) {
  const overlay = stage.querySelector(".tutorialDialog-overlay");
  if (!(overlay instanceof HTMLElement)) return;
  if (stage.classList.contains("is-overlay-hidden")) return;

  overlay.classList.add("is-fading-out");
  window.setTimeout(() => {
    stage.classList.add("is-overlay-hidden");
    overlay.classList.remove("is-fading-out");
  }, OVERLAY_FADE_MS);
}

/** 中央オーバーレイを表示（一時停止時） */
function showOverlay(stage) {
  const overlay = stage.querySelector(".tutorialDialog-overlay");
  stage.classList.remove("is-overlay-hidden");
  overlay?.classList.remove("is-fading-out");
}

/** カスタム動画プレイヤーを初期化する */
function setupVideoPlayer(root, { autoplay = false } = {}) {
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
  video.addEventListener("play", () => {
    syncPlayingState();
    fadeOutOverlay(stage);
  });
  video.addEventListener("pause", () => {
    syncPlayingState();
    if (!video.ended) showOverlay(stage);
  });
  video.addEventListener("ended", () => {
    syncPlayingState();
    showOverlay(stage);
  });

  syncPlayingState();
  syncProgress();

  if (autoplay) {
    video.play().catch(() => {
      /* autoplay policy */
    });
  }
}

/** DOM を組み立てる */
function mountHero(slug, initialState) {
  const dismissedKey = dismissedKeyFor(slug);
  let open = initialState.open;
  let autoplay = initialState.autoplay;
  let appName = initialState.appName ?? "チュートリアル";
  let videos = initialState.videos ?? null;
  let activeId = videos?.[0]?.id ?? "";
  let loading = false;

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

  /** 再訪ユーザー向け: 初回クリック時だけ API から動画を取得 */
  async function ensureVideosLoaded() {
    if (videos) return true;
    if (loading) return false;
    loading = true;
    render();
    try {
      const payload = await fetchTutorialVideos(slug);
      if (!payload) return false;
      appName = payload.appName;
      videos = payload.videos;
      activeId = videos[0]?.id ?? "";
      return true;
    } finally {
      loading = false;
    }
  }

  /** 描画 */
  function render() {
    const hasVideos = Array.isArray(videos) && videos.length > 0;
    const active = hasVideos ? (videos.find((video) => video.id === activeId) ?? videos[0]) : null;
    const shouldLoadVideo = open && active && !loading;

    const dialog =
      open && (loading || active)
        ? `<div class="tutorialDialog fade-enter-done" role="dialog" aria-label="${escapeHtml(appName)}のチュートリアル">
          <div class="tutorialDialog-header">
            <h2 class="tutorialDialog-title">${escapeHtml(appName)}</h2>
            <button type="button" class="tutorialDialog-close" data-tutorial-close aria-label="閉じる">×</button>
          </div>
          <div class="tutorialDialog-player">
            ${
              loading
                ? `<div class="tutorialDialog-loading" aria-live="polite">読み込み中…</div>`
                : `<div class="tutorialDialog-stage">
              <video class="tutorialDialog-video"${shouldLoadVideo ? ` src="${escapeHtml(active.file_url)}"` : ""} playsinline${shouldLoadVideo ? ' preload="metadata"' : ' preload="none"'}></video>
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
            </div>`
            }
          </div>
          ${
            hasVideos
              ? `<ul class="tutorialDialog-list">
            ${videos
              .map(
                (video, index) => `
              <li>
                <button type="button" class="tutorialDialog-item${video.id === active?.id ? " is-active" : ""}" data-tutorial-id="${escapeHtml(video.id)}">
                  <span class="tutorialDialog-item-index">${index + 1}</span>
                  <span class="tutorialDialog-item-body">
                    <span class="tutorialDialog-item-title">${escapeHtml(video.title)}</span>
                  </span>
                </button>
              </li>`
              )
              .join("")}
          </ul>`
              : ""
          }
        </div>`
        : "";

    const badgeCount = hasVideos ? videos.length : null;

    root.innerHTML = `
      ${dialog}
      <div class="tutorial-hero-trigger-wrap">
        ${badgeCount ? `<span class="tutorial-hero-badge">${badgeCount}</span>` : ""}
        <button type="button" class="tutorial-hero-trigger" data-tutorial-toggle aria-label="チュートリアル" aria-expanded="${open ? "true" : "false"}">
          <span class="tutorial-hero-trigger-icon">?</span>
        </button>
      </div>
    `;

    if (shouldLoadVideo) {
      setupVideoPlayer(root, { autoplay });
      autoplay = false;
    }
  }

  root.addEventListener("click", async (event) => {
    const closeBtn = event.target.closest("[data-tutorial-close]");
    if (closeBtn) {
      pauseCurrentVideo();
      open = false;
      localStorage.setItem(dismissedKey, "1");
      render();
      return;
    }

    const toggleBtn = event.target.closest("[data-tutorial-toggle]");
    if (toggleBtn) {
      if (open) {
        pauseCurrentVideo();
        open = false;
        localStorage.setItem(dismissedKey, "1");
        render();
        return;
      }

      const loaded = await ensureVideosLoaded();
      if (!loaded) {
        open = false;
        render();
        return;
      }
      open = true;
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

  render();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initAppTutorialHero().catch(() => {});
  });
} else {
  initAppTutorialHero().catch(() => {});
}
