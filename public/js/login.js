/**
 * ScienceHUB — ログイン画面（3dprint UI）
 */

import { GOOGLE_ICON, MICROSOFT_ICON } from "./oauth-icons.js";

/** アラートを表示する */
function showAlert(message, type = "error") {
  const el = document.getElementById("auth-alert");
  if (!el) return;
  el.innerHTML = `<div class="alert alert-${type}" role="alert">${escapeHtml(message)}</div>`;
}

/** HTML エスケープ */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** タブパネルの表示状態を同期（非表示パネルは hidden） */
function setAuthPanelVisible(panelId, visible) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  panel.classList.toggle("is-inactive", !visible);
  if (visible) {
    panel.removeAttribute("hidden");
    panel.setAttribute("aria-hidden", "false");
  } else {
    panel.setAttribute("hidden", "hidden");
    panel.setAttribute("aria-hidden", "true");
  }
}

/** タブ切替 */
function switchTab(tab) {
  document.querySelectorAll(".auth-tab").forEach((el) => {
    const active = el.dataset.authTab === tab;
    el.classList.toggle("active", active);
    el.setAttribute("aria-selected", active ? "true" : "false");
  });
  setAuthPanelVisible("login-panel", tab === "login");
  setAuthPanelVisible("signup-panel", tab === "signup");
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

  const loginForm = document.getElementById("login-form");
  const email = document.getElementById("login-email")?.value.trim() ?? "";
  const password = document.getElementById("login-password")?.value ?? "";
  const submitBtn = document.getElementById("login-submit-btn");

  if (loginForm instanceof HTMLFormElement && !loginForm.checkValidity()) {
    loginForm.reportValidity();
    showAlert("必須項目を入力してください");
    return;
  }

  if (!email || !password) {
    showAlert("メールアドレスとパスワードを入力してください");
    return;
  }

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

  const signupForm = document.getElementById("signup-form");
  const username = document.getElementById("signup-username")?.value.trim() ?? "";
  const displayName = document.getElementById("signup-display-name")?.value.trim() ?? "";
  const email = document.getElementById("signup-email")?.value.trim() ?? "";
  const password = document.getElementById("signup-password")?.value ?? "";
  const passwordConfirm = document.getElementById("signup-password-confirm")?.value ?? "";
  const submitBtn = document.getElementById("signup-submit-btn");

  if (signupForm instanceof HTMLFormElement && !signupForm.checkValidity()) {
    signupForm.reportValidity();
    showAlert("必須項目を入力してください");
    return;
  }

  if (!username || !displayName || !email || !password) {
    showAlert("すべての必須項目を入力してください");
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

  if (params.get("hint") === "oauth_profile") {
    showAlert(
      "このページは外部ログイン（Google / Microsoft）のサインアップ途中専用です。通常のログインまたはサインアップをご利用ください。",
      "error"
    );
  }

  bindOAuthButtons();
  document.getElementById("login-form")?.addEventListener("submit", handleLoginSubmit);
  document.getElementById("signup-form")?.addEventListener("submit", handleSignupSubmit);
  checkExistingSession();
}

init();
