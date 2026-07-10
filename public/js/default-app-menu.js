/**
 * ScienceHUB — ヘッダー Default App メニュー
 */

import { appIconHtml } from "./hub-icons.js";

/** HTML エスケープ */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Default App ドロップダウンを初期化 */
export function initDefaultAppMenu(defaultApps = []) {
  const menuRoot = document.getElementById("default-app-menu");
  if (!menuRoot) return;

  const toggleBtn = document.getElementById("default-app-menu-toggle");
  const dropdown = document.getElementById("default-app-dropdown");
  const listEl = document.getElementById("default-app-list");
  const emptyEl = document.getElementById("default-app-empty");

  let dropdownOpen = false;
  let hoverCloseTimer = null;

  /** ドロップダウン開閉 */
  function setDropdownOpen(open) {
    dropdownOpen = open;
    dropdown?.classList.toggle("is-open", open);
    toggleBtn?.setAttribute("aria-expanded", open ? "true" : "false");
    if (dropdown) dropdown.hidden = false;
  }

  /** リストを描画 */
  function renderList(apps) {
    if (!listEl || !emptyEl) return;

    if (!apps.length) {
      listEl.innerHTML = "";
      emptyEl.hidden = false;
      return;
    }

    emptyEl.hidden = true;
    listEl.innerHTML = apps
      .map(
        (app) => `
      <li role="none">
        <a
          href="${escapeHtml(app.href)}"
          class="hub-default-app-item"
          role="menuitem"
          style="--app-color:${escapeHtml(app.color)}"
        >
          <span class="hub-default-app-item-icon" aria-hidden="true">${appIconHtml(app, "hub-icon hub-icon--sm")}</span>
          <span class="hub-default-app-item-label">${escapeHtml(app.display_name)}</span>
        </a>
      </li>`
      )
      .join("");
  }

  renderList(defaultApps);

  function clearHoverCloseTimer() {
    if (hoverCloseTimer) {
      clearTimeout(hoverCloseTimer);
      hoverCloseTimer = null;
    }
  }

  function scheduleHoverClose() {
    clearHoverCloseTimer();
    hoverCloseTimer = setTimeout(() => {
      setDropdownOpen(false);
    }, 180);
  }

  menuRoot.addEventListener("mouseenter", () => {
    clearHoverCloseTimer();
    setDropdownOpen(true);
  });

  menuRoot.addEventListener("mouseleave", () => {
    scheduleHoverClose();
  });

  toggleBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  });

  document.addEventListener("click", (e) => {
    if (!dropdownOpen) return;
    if (menuRoot.contains(e.target)) return;
    setDropdownOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && dropdownOpen) {
      setDropdownOpen(false);
    }
  });
}
