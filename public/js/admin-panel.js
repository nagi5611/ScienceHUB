/**
 * ScienceHUB 管理者パネル — Discord 風ロール管理
 */

import { avatarHtml, bindAvatarFallback } from "./user-avatar.js";
import {
  bindGroupEvents,
  loadGroups,
  getGroups,
  openGroupMembershipEditor,
  renderGroups,
  renderMemberGroups,
} from "./admin-groups.js";
import { bindAppEvents, loadApps, renderApps } from "./admin-apps.js";
import {
  bindAnnouncementEvents,
  loadAnnouncements,
  renderAnnouncements,
} from "./admin-announcements.js";
import { hydrateIconElements, iconHtml } from "./hub-icons.js";

let roles = [];
let users = [];
let editingUserId = null;
let editingProfileUserId = null;

/** メインロール（単一選択） */
const MAIN_ROLE_SLUGS = ["admin", "member", "guest"];

/** API 呼び出し */
async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) {
    window.location.href = "/admin/login.html?next=" + encodeURIComponent("/admin/panel.html");
    throw new Error("認証が必要です");
  }
  if (!response.ok) throw new Error(data.error ?? "リクエストに失敗しました");
  return data;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatDate(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** 管理パネル初期表示 */
async function initAdminLabel() {
  const label = document.getElementById("admin-user-label");
  try {
    const response = await fetch("/api/admin/me", { credentials: "same-origin" });
    if (response.ok) {
      const data = await response.json();
      if (label && data.admin?.username) {
        label.textContent = `管理者 (${data.admin.username})`;
      } else if (label) {
        label.textContent = "管理者";
      }
      return true;
    }
  } catch {
    /* 下でリダイレクト */
  }
  window.location.href = "/admin/login.html?next=" + encodeURIComponent("/admin/panel.html");
  return false;
}

/** ビュー切替 */
function switchView(view) {
  document.querySelectorAll(".cf-nav-item").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.view === view);
  });
  document.querySelectorAll(".cf-view").forEach((section) => {
    section.classList.toggle("is-active", section.id === `view-${view}`);
  });
}

/** ロールピル HTML */
function rolePillHtml(role) {
  return `<span class="cf-role-pill" style="--pill-color:${escapeHtml(role.color)}">
    <span class="cf-role-pill-dot"></span>${escapeHtml(role.display_name)}
  </span>`;
}

function renderMemberRoles(user) {
  const userRoles = user.roles ?? [];
  const role = userRoles[0];

  if (!role) {
    return `<button type="button" class="cf-role-pill cf-role-pill-btn" data-edit-roles="${user.id}">+ ロールを設定</button>`;
  }

  return `<div class="cf-role-pills">${rolePillHtml(role)}
    <button type="button" class="cf-role-pill cf-role-pill-btn" data-edit-roles="${user.id}" title="ロールを編集">${iconHtml("edit", "hub-icon hub-icon--sm")}</button>
  </div>`;
}

/** メンバー一覧描画 */
function renderMembers(filter = "") {
  const tbody = document.getElementById("members-tbody");
  if (!tbody) return;

  const q = filter.trim().toLowerCase();
  const filtered = users.filter(
    (u) =>
      !q ||
      u.username.toLowerCase().includes(q) ||
      u.display_name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
  );

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="cf-empty">該当するメンバーがいません</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered
    .map((user) => {
      return `<tr>
        <td>
          <div class="cf-member-cell">
            ${avatarHtml(user, { className: "cf-avatar", imgClass: "cf-avatar-img" })}
            <div>
              <div class="cf-member-name">${escapeHtml(user.display_name)}</div>
              <div class="cf-member-handle">@${escapeHtml(user.username)}</div>
            </div>
          </div>
        </td>
        <td>${escapeHtml(user.email)}</td>
        <td>${formatDate(user.created_at)}</td>
        <td class="cf-cell-roles">${renderMemberRoles(user)}</td>
        <td class="cf-cell-groups">${renderMemberGroups(user, escapeHtml)}</td>
        <td>
          <div class="cf-row-actions">
            <button type="button" class="cf-btn cf-btn-ghost cf-btn-sm" data-edit-user="${user.id}" title="プロフィールを編集">編集</button>
            <button type="button" class="cf-btn cf-btn-ghost cf-btn-sm cf-btn-danger-ghost" data-delete-user="${user.id}" title="アカウントを削除">アカウント削除</button>
          </div>
        </td>
      </tr>`;
    })
    .join("");
}

/** ロール一覧描画 */
function renderRoles(filter = "") {
  const container = document.getElementById("roles-list");
  const countEl = document.getElementById("role-count");
  if (!container) return;

  const q = filter.trim().toLowerCase();
  const filtered = roles.filter(
    (r) =>
      !q ||
      r.slug.toLowerCase().includes(q) ||
      r.display_name.toLowerCase().includes(q)
  );

  if (countEl) countEl.textContent = String(roles.length);

  if (filtered.length === 0) {
    container.innerHTML = `<p class="cf-empty">ロールがありません</p>`;
    return;
  }

  container.innerHTML = filtered
    .map(
      (role) => `
      <div class="cf-role-row" style="--role-color:${escapeHtml(role.color)}">
        <div class="cf-role-row-info">
          <div class="cf-role-shield">${iconHtml("shield", "hub-icon hub-icon--sm")}</div>
          <div>
            <div class="cf-role-row-name">${escapeHtml(role.display_name)}${role.is_admin ? ' <span class="cf-badge">Admin</span>' : ""}</div>
            <div class="cf-role-row-slug">${escapeHtml(role.slug)}</div>
          </div>
        </div>
        <div class="cf-role-count cf-count-with-icon">${iconHtml("user", "hub-icon hub-icon--sm")} ${role.member_count ?? 0}</div>
        <div class="cf-role-actions">
          <button type="button" class="cf-icon-btn" data-edit-role="${escapeHtml(role.slug)}" title="編集">${iconHtml("edit", "hub-icon hub-icon--sm")}</button>
        </div>
      </div>`
    )
    .join("");
}

/** ロールラジオリスト描画（管理者・メンバー・ゲストのみ） */
function renderRoleChecklist(container, selectedSlug = "member") {
  if (!container) return;

  const mainRoles = MAIN_ROLE_SLUGS.map((slug) => roles.find((r) => r.slug === slug)).filter(
    Boolean
  );

  container.innerHTML = mainRoles
    .map(
      (role) => `
      <label class="cf-role-check">
        <input type="radio" name="role_slug" value="${escapeHtml(role.slug)}"${selectedSlug === role.slug ? " checked" : ""}>
        <span class="cf-role-check-label">
          <span class="cf-role-pill-dot" style="background:${escapeHtml(role.color)};width:0.6rem;height:0.6rem;border-radius:50%"></span>
          ${escapeHtml(role.display_name)}
        </span>
      </label>`
    )
    .join("");
}

/** データ読み込み */
async function loadRoles() {
  const data = await api("/api/admin/roles");
  roles = data.roles ?? [];
  renderRoles(document.getElementById("role-search")?.value ?? "");
  renderRoleChecklist(document.getElementById("create-user-roles"), ["member"]);
}

async function loadUsers() {
  const data = await api("/api/admin/users");
  users = data.users ?? [];
  renderMembers(document.getElementById("member-search")?.value ?? "");
}

/** ユーザー編集ダイアログ */
function openUserEditor(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  editingProfileUserId = userId;
  document.getElementById("edit-user-id").value = user.id;
  document.getElementById("edit-user-username").value = user.username;
  document.getElementById("edit-user-display-name").value = user.display_name;
  document.getElementById("edit-user-email").value = user.email;
  document.getElementById("edit-user-password").value = "";
  document.getElementById("edit-user-error").hidden = true;
  document.getElementById("edit-user-dialog")?.showModal();
}

/** ユーザー削除 */
async function deleteUser(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  const confirmed = confirm(
    `「${user.display_name}」(@${user.username}) を削除しますか？\nこの操作は取り消せません。`
  );
  if (!confirmed) return;

  try {
    await api(`/api/admin/users/${encodeURIComponent(userId)}`, {
      method: "DELETE",
    });
    await loadUsers();
    await loadRoles();
  } catch (err) {
    alert(err.message);
  }
}

/** ロール編集ダイアログ */
function openRoleEditor(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  editingUserId = userId;
  const dialog = document.getElementById("role-editor-dialog");
  const title = document.getElementById("role-editor-title");
  const subtitle = document.getElementById("role-editor-subtitle");
  const checklist = document.getElementById("role-checklist");

  if (title) title.textContent = "ロールを編集";
  if (subtitle) subtitle.textContent = `${user.display_name} (@${user.username}) に割り当てるロールを選択`;
  renderRoleChecklist(checklist, (user.roles ?? [])[0]?.slug ?? "member");
  dialog?.showModal();
}

async function saveUserRoles() {
  if (!editingUserId) return;

  const checklist = document.getElementById("role-checklist");
  const selected = checklist?.querySelector('input[name="role_slug"]:checked')?.value;

  if (!selected) {
    alert("ロールを選択してください");
    return;
  }

  await api(`/api/admin/users/${editingUserId}`, {
    method: "PATCH",
    body: JSON.stringify({ role_slug: selected }),
  });

  document.getElementById("role-editor-dialog")?.close();
  editingUserId = null;
  await loadUsers();
  await loadRoles();
}

/** ロール編集モーダル */
function openEditRole(slug) {
  const role = roles.find((r) => r.slug === slug);
  if (!role) return;

  document.getElementById("edit-role-slug").value = role.slug;
  document.getElementById("edit-role-name").value = role.display_name;
  document.getElementById("edit-role-color").value = role.color;
  document.getElementById("edit-role-admin").checked = role.is_admin;
  document.getElementById("edit-role-error").hidden = true;
  document.getElementById("edit-role-dialog")?.showModal();
}

/** イベント登録 */
function bindEvents() {
  document.querySelectorAll(".cf-nav-item").forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });

  document.getElementById("member-search")?.addEventListener("input", (e) => {
    renderMembers(e.target.value);
  });

  document.getElementById("role-search")?.addEventListener("input", (e) => {
    renderRoles(e.target.value);
  });

  document.getElementById("members-tbody")?.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest("[data-delete-user]");
    if (deleteBtn) {
      deleteUser(deleteBtn.dataset.deleteUser).catch((err) => alert(err.message));
      return;
    }
    const profileBtn = e.target.closest("[data-edit-user]");
    if (profileBtn) {
      openUserEditor(profileBtn.dataset.editUser);
      return;
    }
    const roleBtn = e.target.closest("[data-edit-roles]");
    if (roleBtn) openRoleEditor(roleBtn.dataset.editRoles);
    const groupBtn = e.target.closest("[data-edit-groups]");
    if (groupBtn) openGroupMembershipEditor(groupBtn.dataset.editGroups, users, escapeHtml);
  });

  document.getElementById("roles-list")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-edit-role]");
    if (btn) openEditRole(btn.dataset.editRole);
  });

  document.getElementById("role-editor-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    saveUserRoles().catch((err) => alert(err.message));
  });

  document.getElementById("close-role-editor")?.addEventListener("click", () => {
    document.getElementById("role-editor-dialog")?.close();
  });

  document.getElementById("cancel-role-editor")?.addEventListener("click", () => {
    document.getElementById("role-editor-dialog")?.close();
  });

  document.getElementById("open-create-user")?.addEventListener("click", () => {
    renderRoleChecklist(document.getElementById("create-user-roles"), ["member"]);
    document.getElementById("create-user-error").hidden = true;
    document.getElementById("create-user-dialog")?.showModal();
  });

  document.getElementById("open-create-role")?.addEventListener("click", () => {
    document.getElementById("create-role-error").hidden = true;
    document.getElementById("create-role-dialog")?.showModal();
  });

  document.querySelectorAll("[data-close-dialog]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById(btn.dataset.closeDialog)?.close();
    });
  });

  document.getElementById("edit-user-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!editingProfileUserId) return;

    const errorEl = document.getElementById("edit-user-error");
    const username = document.getElementById("edit-user-username").value.trim();
    const displayName = document.getElementById("edit-user-display-name").value.trim();
    const email = document.getElementById("edit-user-email").value.trim();
    const password = document.getElementById("edit-user-password").value;

    const payload = { username, display_name: displayName, email };
    if (password) payload.password = password;

    try {
      await api(`/api/admin/users/${editingProfileUserId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      document.getElementById("edit-user-dialog")?.close();
      editingProfileUserId = null;
      await loadUsers();
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.hidden = false;
    }
  });

  document.getElementById("create-user-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const errorEl = document.getElementById("create-user-error");
    const formData = new FormData(form);
    const roleSlug = form.querySelector('input[name="role_slug"]:checked')?.value;

    if (!roleSlug) {
      errorEl.textContent = "ロールを選択してください";
      errorEl.hidden = false;
      return;
    }

    try {
      await api("/api/admin/users", {
        method: "POST",
        body: JSON.stringify({
          username: String(formData.get("username") ?? "").trim(),
          display_name: String(formData.get("display_name") ?? "").trim(),
          email: String(formData.get("email") ?? "").trim(),
          password: String(formData.get("password") ?? ""),
          role_slug: roleSlug,
        }),
      });
      form.reset();
      document.getElementById("create-user-dialog")?.close();
      await loadUsers();
      await loadRoles();
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.hidden = false;
    }
  });

  document.getElementById("create-role-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const errorEl = document.getElementById("create-role-error");
    const formData = new FormData(form);

    try {
      await api("/api/admin/roles", {
        method: "POST",
        body: JSON.stringify({
          display_name: String(formData.get("display_name") ?? "").trim(),
          slug: String(formData.get("slug") ?? "").trim(),
          color: String(formData.get("color") ?? "#F38020"),
          is_admin: formData.get("is_admin") === "on",
        }),
      });
      form.reset();
      form.querySelector('[name="color"]').value = "#F38020";
      document.getElementById("create-role-dialog")?.close();
      await loadRoles();
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.hidden = false;
    }
  });

  document.getElementById("edit-role-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById("edit-role-error");
    const slug = document.getElementById("edit-role-slug").value;

    try {
      await api(`/api/admin/roles/${encodeURIComponent(slug)}`, {
        method: "PATCH",
        body: JSON.stringify({
          display_name: document.getElementById("edit-role-name").value.trim(),
          color: document.getElementById("edit-role-color").value,
          is_admin: document.getElementById("edit-role-admin").checked,
        }),
      });
      document.getElementById("edit-role-dialog")?.close();
      await loadRoles();
      await loadUsers();
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.hidden = false;
    }
  });

  document.getElementById("delete-role-btn")?.addEventListener("click", async () => {
    const slug = document.getElementById("edit-role-slug").value;
    const role = roles.find((r) => r.slug === slug);
    if (!role) return;

    if (!confirm(`ロール「${role.display_name}」を削除しますか？\nこのロールが付与されたユーザーからも外れます。`)) {
      return;
    }

    try {
      await api(`/api/admin/roles/${encodeURIComponent(slug)}`, { method: "DELETE" });
      document.getElementById("edit-role-dialog")?.close();
      await loadRoles();
      await loadUsers();
    } catch (err) {
      alert(err.message);
    }
  });

  document.getElementById("logout-btn")?.addEventListener("click", async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
    window.location.href = "/admin/login.html";
  });
}

async function init() {
  hydrateIconElements();
  const authed = await initAdminLabel();
  if (!authed) return;

  bindAvatarFallback(document.getElementById("members-tbody"));
  bindEvents();
  bindGroupEvents({
    api,
    escapeHtml,
    loadUsers,
    renderMembers,
    getUsers: () => users,
  });
  bindAppEvents({
    api,
    escapeHtml,
    getGroups,
  });
  bindAnnouncementEvents({ api, escapeHtml });
  await loadRoles();
  await loadGroups(api);
  renderGroups("", escapeHtml);
  await loadApps(api);
  renderApps("", escapeHtml);
  await loadAnnouncements(api);
  renderAnnouncements("", escapeHtml);
  await loadUsers();
}

init();
