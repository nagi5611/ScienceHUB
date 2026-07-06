/**
 * 管理者ログイン画面
 */

async function checkExistingSession() {
  const response = await fetch("/api/auth/me");
  if (!response.ok) return;

  const data = await response.json();
  if (data.user?.is_admin) {
    window.location.href = "/admin/panel.html";
  }
}

function showError(message) {
  const el = document.getElementById("login-error");
  if (!el) return;
  el.textContent = message;
  el.hidden = !message;
}

document.getElementById("login-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  showError("");

  const form = event.currentTarget;
  if (!(form instanceof HTMLFormElement)) return;

  const submitBtn = document.getElementById("login-submit");
  if (submitBtn instanceof HTMLButtonElement) {
    submitBtn.disabled = true;
    submitBtn.textContent = "ログイン中…";
  }

  const formData = new FormData(form);
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      showError(data.error ?? "ログインに失敗しました");
      return;
    }

    window.location.href = "/admin/panel.html";
  } catch {
    showError("サーバーに接続できませんでした");
  } finally {
    if (submitBtn instanceof HTMLButtonElement) {
      submitBtn.disabled = false;
      submitBtn.textContent = "ログイン";
    }
  }
});

checkExistingSession();
