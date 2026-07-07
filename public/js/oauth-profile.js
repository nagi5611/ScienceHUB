/**
 * OAuth 新規登録 — 表示名入力画面
 */

/** HTML エスケープ */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** アラート表示 */
function showAlert(message, type = "error") {
  const el = document.getElementById("profile-alert");
  if (!el) return;
  el.innerHTML = `<div class="alert alert-${type}">${escapeHtml(message)}</div>`;
}

/** 登録待ち情報を読み込む */
async function loadPendingProfile() {
  const response = await fetch("/api/auth/oauth/pending", { credentials: "same-origin" });

  if (!response.ok) {
    window.location.href = "/login/?error=" + encodeURIComponent("登録セッションが無効です。もう一度ログインしてください。");
    return null;
  }

  const data = await response.json();
  if (!data.pending) {
    window.location.href = "/login/";
    return null;
  }

  const note = document.getElementById("profile-account-note");
  if (note) {
    note.textContent = `${data.pending.provider_label}（${data.pending.email_masked}）でサインアップします。`;
  }

  const providerNote = document.getElementById("profile-provider-note");
  if (providerNote) {
    providerNote.textContent = `${data.pending.provider_label} アカウントの連携が完了しました。`;
  }

  const displayNameInput = document.getElementById("profile-display-name");
  if (displayNameInput instanceof HTMLInputElement && data.pending.name_hint) {
    displayNameInput.value = data.pending.name_hint;
    displayNameInput.select();
  }

  return data.pending;
}

/** プロフィール送信 */
async function handleSubmit(event) {
  event.preventDefault();

  const displayName = document.getElementById("profile-display-name")?.value.trim() ?? "";
  const submitBtn = document.getElementById("profile-submit-btn");

  if (!displayName) {
    showAlert("表示名を入力してください");
    return;
  }

  if (submitBtn instanceof HTMLButtonElement) {
    submitBtn.disabled = true;
    submitBtn.textContent = "登録中…";
  }

  try {
    const response = await fetch("/api/auth/oauth/complete", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ display_name: displayName }),
    });

    const data = await response.json();

    if (!response.ok) {
      showAlert(data.error ?? "サインアップに失敗しました");
      return;
    }

    window.location.href = data.redirect ?? "/";
  } catch {
    showAlert("サーバーに接続できませんでした");
  } finally {
    if (submitBtn instanceof HTMLButtonElement) {
      submitBtn.disabled = false;
      submitBtn.textContent = "サインアップを完了";
    }
  }
}

async function init() {
  const pending = await loadPendingProfile();
  if (!pending) return;

  document.getElementById("profile-form")?.addEventListener("submit", handleSubmit);
}

init();
