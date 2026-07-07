/**
 * ScienceHUB — ログイン画面（3dprint UI）
 */

import { GOOGLE_ICON, MICROSOFT_ICON } from "./oauth-icons.js";

/** アラートを表示する */
function showAlert(message, type = "error") {
  const el = document.getElementById("auth-alert");
  if (!el) return;
  el.innerHTML = `<div class="alert alert-${type}">${escapeHtml(message)}</div>`;
}

/** HTML エスケープ */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** タブ切替 */
function switchTab(tab) {
  document.querySelectorAll(".auth-tab").forEach((el) => {
    el.classList.toggle("active", el.dataset.authTab === tab);
  });
  document.getElementById("login-panel")?.classList.toggle("is-inactive", tab !== "login");
  document.getElementById("signup-panel")?.classList.toggle("is-inactive", tab !== "signup");
  document.getElementById("auth-alert").innerHTML = "";
}

/** ログイン後のリダイレクト先 */
function getRedirectTarget(user) {
  const params = new URLSearchParams(window.location.search);
  const next = params.get("next");

  if (next && next.startsWith("/") && !next.startsWith("//")) {
    if (next.startsWith("/admin/panel") && !user?.is_admin) {
      return "/";
    }
    return next;
  }

  if (user?.is_admin && params.get("admin") === "1") {
    return "/admin/panel.html";
  }

  return "/";
}

/** 既存セッションを確認 */
async function checkExistingSession() {
  try {
    const response = await fetch("/api/auth/me");
    if (!response.ok) return;

    const data = await response.json();
    if (data.user) {
      window.location.href = getRedirectTarget(data.user);
    }
  } catch {
    /* 未ログインのまま表示 */
  }
}

/** OAuth ログイン開始 */
function startOAuth(provider) {
  const params = new URLSearchParams(window.location.search);
  const next = params.get("next") ?? "/";
  window.location.href = `/api/auth/oauth/${provider}/start?next=${encodeURIComponent(next)}`;
}

/** OAuth ボタン */
function bindOAuthButtons() {
  document.getElementById("auth-google-btn").innerHTML = `${GOOGLE_ICON}<span>Google</span>`;
  document.getElementById("auth-microsoft-btn").innerHTML = `${MICROSOFT_ICON}<span>Microsoft</span>`;

  document.getElementById("auth-google-btn")?.addEventListener("click", () => {
    startOAuth("google");
  });
  document.getElementById("auth-microsoft-btn")?.addEventListener("click", () => {
    startOAuth("microsoft");
  });
}

/** ログインフォーム送信 */
async function handleLoginSubmit(event) {
  event.preventDefault();
  document.getElementById("auth-alert").innerHTML = "";

  const email = document.getElementById("login-email")?.value.trim() ?? "";
  const password = document.getElementById("login-password")?.value ?? "";
  const submitBtn = document.getElementById("login-submit-btn");

  if (submitBtn instanceof HTMLButtonElement) {
    submitBtn.disabled = true;
    submitBtn.textContent = "ログイン中…";
  }

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      showAlert(data.error ?? "ログインに失敗しました");
      return;
    }

    window.location.href = getRedirectTarget(data.user);
  } catch {
    showAlert("サーバーに接続できませんでした");
  } finally {
    if (submitBtn instanceof HTMLButtonElement) {
      submitBtn.disabled = false;
      submitBtn.textContent = "ログイン";
    }
  }
}

/** サインアップフォーム送信 */
async function handleSignupSubmit(event) {
  event.preventDefault();
  document.getElementById("auth-alert").innerHTML = "";

  const username = document.getElementById("signup-username")?.value.trim() ?? "";
  const displayName = document.getElementById("signup-display-name")?.value.trim() ?? "";
  const email = document.getElementById("signup-email")?.value.trim() ?? "";
  const password = document.getElementById("signup-password")?.value ?? "";
  const passwordConfirm = document.getElementById("signup-password-confirm")?.value ?? "";
  const submitBtn = document.getElementById("signup-submit-btn");

  if (!displayName) {
    showAlert("表示名を入力してください");
    return;
  }

  if (password !== passwordConfirm) {
    showAlert("パスワードが一致しません");
    return;
  }

  if (submitBtn instanceof HTMLButtonElement) {
    submitBtn.disabled = true;
    submitBtn.textContent = "登録中…";
  }

  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        display_name: displayName,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      showAlert(data.error ?? "サインアップに失敗しました");
      return;
    }

    window.location.href = getRedirectTarget(data.user);
  } catch {
    showAlert("サーバーに接続できませんでした");
  } finally {
    if (submitBtn instanceof HTMLButtonElement) {
      submitBtn.disabled = false;
      submitBtn.textContent = "サインアップ";
    }
  }
}

/** 初期化 */
function init() {
  const params = new URLSearchParams(window.location.search);

  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.authTab));
  });

  switchTab(params.get("tab") === "signup" ? "signup" : "login");

  const error = params.get("error");
  if (error) {
    showAlert(decodeURIComponent(error));
  }

  bindOAuthButtons();
  document.getElementById("login-form")?.addEventListener("submit", handleLoginSubmit);
  document.getElementById("signup-form")?.addEventListener("submit", handleSignupSubmit);
  checkExistingSession();
}

init();
