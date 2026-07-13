/**
 * クラウドストレージ フォルダショートカット（ログイン・閲覧権限必須）
 */

function getShortcutToken() {
  return new URL(window.location.href).searchParams.get("t")?.trim() ?? "";
}

function setVisible(id, visible) {
  const el = document.getElementById(id);
  if (el) el.hidden = !visible;
}

function showError(message) {
  setVisible("shortcut-loading", false);
  setVisible("shortcut-error", true);
  const text = document.getElementById("shortcut-error-text");
  if (text) text.textContent = message;
}

async function ensureAuthenticated() {
  const response = await fetch("/api/auth/me", { method: "GET" });
  if (response.status === 401) {
    const next = `${window.location.pathname}${window.location.search}`;
    window.location.href = `/login/?next=${encodeURIComponent(next)}`;
    return null;
  }
  if (!response.ok) {
    throw new Error("認証状態の確認に失敗しました");
  }
  return response.json();
}

async function resolveShortcut(token) {
  const response = await fetch(
    `/api/storage/shortcut/resolve?token=${encodeURIComponent(token)}`,
    { method: "GET" }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? "ショートカットリンクを開けませんでした");
  }
  return data;
}

async function main() {
  const token = getShortcutToken();
  if (!token) {
    showError("ショートカットリンクが無効です");
    return;
  }

  try {
    const user = await ensureAuthenticated();
    if (!user) return;

    const result = await resolveShortcut(token);
    const path = result.storage_path?.trim();
    if (!path) {
      showError("フォルダパスが見つかりません");
      return;
    }

    window.location.replace(
      `/apps/cloud-storage/?path=${encodeURIComponent(path)}`
    );
  } catch (error) {
    showError(error instanceof Error ? error.message : "ショートカットリンクを開けませんでした");
  }
}

main();
