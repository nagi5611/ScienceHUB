/**
 * ScienceHUB — アカウントメニュー・プロフィール
 */

import { resizeImageToPng } from "./image-resize.js";
import { applyAvatarToElement } from "./user-avatar.js";

const NOTIFY_STORAGE_KEY = "sciencehub_notify_prefs";

/** HTML エスケープ */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 表示名からイニシャルを生成 */
function initials(name) {
  const parts = String(name || "?").trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return String(name || "?").slice(0, 2).toUpperCase();
}

/** 通知設定を読み込む */
function loadNotifyPrefs() {
  try {
    return JSON.parse(localStorage.getItem(NOTIFY_STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

/** 通知設定を保存する */
function saveNotifyPrefs(prefs) {
  localStorage.setItem(NOTIFY_STORAGE_KEY, JSON.stringify(prefs));
}

/** アカウントメニュー・プロフィール UI */
export function initAccountMenu() {
  const menuRoot = document.getElementById("account-menu");
  if (!menuRoot) return;

  const toggleBtn = document.getElementById("account-menu-toggle");
  const dropdown = document.getElementById("account-dropdown");
  const avatarEl = document.getElementById("account-avatar");
  const labelEl = document.getElementById("account-label");
  const profileModal = document.getElementById("profile-modal");
  const profileBackdrop = document.getElementById("profile-modal-backdrop");
  const profileClose = document.getElementById("profile-modal-close");
  const profileForm = document.getElementById("profile-form");
  const profileAlert = document.getElementById("profile-alert");
  const iconInput = document.getElementById("profile-icon-input");
  const iconPreview = document.getElementById("profile-icon-preview");
  const iconInitials = document.getElementById("profile-icon-initials");
  const notifyForm = document.getElementById("notify-form");
  const passwordForm = document.getElementById("password-form");
  const passwordTab = document.getElementById("profile-tab-password");
  const passwordOAuthNotice = document.getElementById("password-oauth-notice");
  const passwordOAuthNoticeText = document.getElementById("password-oauth-notice-text");

  let currentUser = null;
  let dropdownOpen = false;

  /** OAuth プロバイダー表示名 */
  function oauthProviderLabel(provider) {
    if (provider === "google") return "Google";
    if (provider === "microsoft") return "Microsoft";
    return provider;
  }

  /** OAuth 専用アカウント向けメッセージ */
  function buildOAuthPasswordMessage(providers) {
    if (providers.length === 1) {
      const name = oauthProviderLabel(providers[0]);
      return `このアカウントは ${name} でログインしています。パスワードの変更は ${name} アカウントの設定から行ってください。`;
    }

    const names = providers.map(oauthProviderLabel).join("・");
    return `このアカウントは ${names} でログインしています。パスワードの変更は各サービスのアカウント設定から行ってください。`;
  }

  /** パスワードタブの表示を切り替え */
  function updatePasswordPanel(user) {
    const canChangePassword = user?.has_password === true;
    const providers = user?.oauth_providers ?? [];
    const showOAuthNotice = !canChangePassword && providers.length > 0;

    if (passwordForm) passwordForm.hidden = !canChangePassword;
    if (passwordOAuthNotice) passwordOAuthNotice.hidden = !showOAuthNotice;
    if (passwordOAuthNoticeText && showOAuthNotice) {
      passwordOAuthNoticeText.textContent = buildOAuthPasswordMessage(providers);
    }
  }

  /** ユーザー情報を API から取得 */
  async function fetchUser() {
    const res = await fetch("/api/auth/profile");
    if (!res.ok) {
      const fallback = await fetch("/api/auth/me");
      if (!fallback.ok) return null;
      const data = await fallback.json();
      return data.user ?? null;
    }
    const data = await res.json();
    return data.user ?? null;
  }

  /** ヘッダーのアカウント表示を更新 */
  function renderAccountHeader(user) {
    if (!user) return;
    currentUser = user;

    if (labelEl) {
      labelEl.textContent = user.display_name || user.username;
    }

    applyAvatarToElement(avatarEl, user, {
      imgClass: "hub-account-avatar-img",
      initialsClass: "hub-account-avatar--initials",
    });

    updatePasswordPanel(user);
  }

  /** プロフィールのアイコン表示を更新 */
  function applyProfileIcon(user) {
    if (!iconPreview || !iconInitials) return;

    iconPreview.innerHTML = "";
    iconInitials.textContent = initials(user.display_name);

    const url = user?.avatar_url;
    if (!url) {
      iconPreview.hidden = true;
      iconInitials.hidden = false;
      return;
    }

    iconInitials.hidden = true;
    iconPreview.hidden = false;

    const img = document.createElement("img");
    img.src = url;
    img.alt = "";
    img.className = "hub-profile-icon-img";
    img.addEventListener("error", () => {
      iconPreview.hidden = true;
      iconInitials.hidden = false;
    });
    iconPreview.appendChild(img);
  }

  /** プロフィールフォームをユーザー情報で埋める */
  function fillProfileForm(user) {
    document.getElementById("profile-display-name").value = user.display_name ?? "";
    document.getElementById("profile-email").value = user.email ?? "";
    document.getElementById("profile-username").textContent = user.username ?? "";
    applyProfileIcon(user);
  }

  /** 通知設定フォームを反映 */
  function fillNotifyForm() {
    const prefs = loadNotifyPrefs();
    const emailNotify = document.getElementById("notify-email");
    const taskNotify = document.getElementById("notify-tasks");
    if (emailNotify) emailNotify.checked = prefs.email !== false;
    if (taskNotify) taskNotify.checked = prefs.tasks !== false;
  }

  /** ドロップダウン開閉 */
  function setDropdownOpen(open) {
    dropdownOpen = open;
    dropdown?.classList.toggle("is-open", open);
    toggleBtn?.setAttribute("aria-expanded", open ? "true" : "false");
  }

  /** パスワード変更フォームをリセット */
  function resetPasswordForm() {
    passwordForm?.reset();
  }

  /** プロフィールモーダル開閉 */
  function openProfileModal(tab = "profile") {
    setDropdownOpen(false);
    if (!currentUser) return;
    fillProfileForm(currentUser);
    fillNotifyForm();
    resetPasswordForm();
    updatePasswordPanel(currentUser);
    profileModal?.classList.add("is-open");
    profileModal?.setAttribute("aria-hidden", "false");
    document.body.classList.add("hub-modal-open");

    const activeTab = tab;

    document.querySelectorAll(".hub-profile-tab").forEach((btn) => {
      const active = btn.dataset.profileTab === activeTab;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });
    document.getElementById("profile-panel-profile")?.classList.toggle("is-active", activeTab === "profile");
    document.getElementById("profile-panel-password")?.classList.toggle("is-active", activeTab === "password");
    document.getElementById("profile-panel-notify")?.classList.toggle("is-active", activeTab === "notify");
    profileAlert.innerHTML = "";
  }

  function closeProfileModal() {
    profileModal?.classList.remove("is-open");
    profileModal?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("hub-modal-open");
    profileAlert.innerHTML = "";
  }

  /** アラート表示 */
  function showProfileAlert(message, type = "error") {
    profileAlert.innerHTML = `<div class="hub-profile-alert hub-profile-alert--${type}">${escapeHtml(message)}</div>`;
  }

  /** ログアウト */
  async function handleLogout() {
    setDropdownOpen(false);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* 失敗時もログインへ */
    }
    window.location.href = "/login/";
  }

  /** プロフィール保存 */
  async function handleProfileSubmit(event) {
    event.preventDefault();
    const displayName = document.getElementById("profile-display-name").value.trim();
    const email = document.getElementById("profile-email").value.trim();

    const saveBtn = document.getElementById("profile-save-btn");
    saveBtn.disabled = true;

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_name: displayName, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        showProfileAlert(data.error ?? "保存に失敗しました");
        return;
      }
      currentUser = data.user;
      renderAccountHeader(currentUser);
      closeProfileModal();
    } catch {
      showProfileAlert("通信エラーが発生しました");
    } finally {
      saveBtn.disabled = false;
    }
  }

  /** アイコンアップロード */
  async function handleIconChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const pngBlob = await resizeImageToPng(file, 512);
      const formData = new FormData();
      formData.append("icon", pngBlob, "icon.png");

      showProfileAlert("アイコンをアップロード中…", "info");

      const res = await fetch("/api/auth/profile/icon", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        showProfileAlert(data.error ?? "アイコンのアップロードに失敗しました");
        return;
      }

      currentUser = { ...currentUser, avatar_url: `${data.avatar_url}${data.avatar_url.includes("?") ? "&" : "?"}t=${Date.now()}` };
      renderAccountHeader(currentUser);
      fillProfileForm(currentUser);
      showProfileAlert("アイコンを更新しました", "success");
    } catch (err) {
      showProfileAlert(err instanceof Error ? err.message : "アイコンの処理に失敗しました");
    } finally {
      iconInput.value = "";
    }
  }

  /** 通知設定保存 */
  function handleNotifySubmit(event) {
    event.preventDefault();
    const prefs = {
      email: document.getElementById("notify-email")?.checked !== false,
      tasks: document.getElementById("notify-tasks")?.checked !== false,
    };
    saveNotifyPrefs(prefs);
    showProfileAlert("通知設定を保存しました", "success");
  }

  /** パスワード変更 */
  async function handlePasswordSubmit(event) {
    event.preventDefault();

    const currentPassword = document.getElementById("password-current")?.value ?? "";
    const newPassword = document.getElementById("password-new")?.value ?? "";
    const confirmPassword = document.getElementById("password-confirm")?.value ?? "";

    if (newPassword !== confirmPassword) {
      showProfileAlert("新しいパスワードと確認用パスワードが一致しません");
      return;
    }

    const saveBtn = document.getElementById("password-save-btn");
    saveBtn.disabled = true;

    try {
      const res = await fetch("/api/auth/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showProfileAlert(data.error ?? "パスワードの変更に失敗しました");
        return;
      }
      resetPasswordForm();
      showProfileAlert("パスワードを変更しました", "success");
    } catch {
      showProfileAlert("通信エラーが発生しました");
    } finally {
      saveBtn.disabled = false;
    }
  }

  toggleBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  });

  document.addEventListener("click", (e) => {
    if (!dropdownOpen) return;
    if (menuRoot.contains(e.target)) return;
    setDropdownOpen(false);
  });

  document.getElementById("account-menu-profile")?.addEventListener("click", () => {
    openProfileModal("profile");
  });

  document.getElementById("account-menu-notify")?.addEventListener("click", () => {
    openProfileModal("notify");
  });

  document.getElementById("account-menu-password")?.addEventListener("click", () => {
    openProfileModal("password");
  });

  document.getElementById("account-menu-logout")?.addEventListener("click", handleLogout);

  profileClose?.addEventListener("click", closeProfileModal);
  profileBackdrop?.addEventListener("click", closeProfileModal);

  document.querySelectorAll(".hub-profile-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      openProfileModal(btn.dataset.profileTab);
    });
  });

  profileForm?.addEventListener("submit", handleProfileSubmit);
  notifyForm?.addEventListener("submit", handleNotifySubmit);
  passwordForm?.addEventListener("submit", handlePasswordSubmit);
  iconInput?.addEventListener("change", handleIconChange);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (profileModal?.classList.contains("is-open")) {
        closeProfileModal();
      } else {
        setDropdownOpen(false);
      }
    }
  });

  fetchUser().then((user) => {
    if (user) {
      currentUser = user;
      renderAccountHeader(user);
    }
  });
}
