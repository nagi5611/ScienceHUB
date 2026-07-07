/**
 * 管理者ログイン画面
 */

/** ログイン後の遷移先 */
function getRedirectTarget() {
  const params = new URLSearchParams(window.location.search);
  const next = params.get("next");
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }
  return "/admin/panel.html";
}

/** アラート表示 */
function showAlert(message) {
  const el = document.getElementById("admin-login-alert");
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
}

/** 既存セッション確認 */
async function checkExistingSession() {
  try {
    const response = await fetch("/api/admin/me", { credentials: "same-origin" });
    if (response.ok) {
      window.location.href = getRedirectTarget();
    }
  } catch {
    /* 未ログインのまま */
  }
}

/** ログイン送信 */
async function handleSubmit(event) {
  event.preventDefault();

  const alertEl = document.getElementById("admin-login-alert");
  if (alertEl) alertEl.hidden = true;

  const username = document.getElementById("admin-username")?.value.trim() ?? "";
  const password = document.getElementById("admin-password")?.value ?? "";
  const submitBtn = document.getElementById("admin-login-submit");

  if (submitBtn instanceof HTMLButtonElement) {
    submitBtn.disabled = true;
    submitBtn.textContent = "ログイン中…";
  }

  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      showAlert(data.error ?? "ログインに失敗しました");
      return;
    }

    window.location.href = getRedirectTarget();
  } catch {
    showAlert("サーバーに接続できませんでした");
  } finally {
    if (submitBtn instanceof HTMLButtonElement) {
      submitBtn.disabled = false;
      submitBtn.textContent = "ログイン";
    }
  }
}

const params = new URLSearchParams(window.location.search);
const error = params.get("error");
if (error) {
  showAlert(decodeURIComponent(error));
}

document.getElementById("admin-login-form")?.addEventListener("submit", handleSubmit);
checkExistingSession();
