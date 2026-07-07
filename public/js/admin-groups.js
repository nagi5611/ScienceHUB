/**
 * 管理パネル — グループ・グループロール管理
 */

import { avatarHtml, bindAvatarFallback } from "./user-avatar.js";
import { iconHtml } from "./hub-icons.js";

let groups = [];
let editingGroupMembershipUserId = null;

/** グループメンバー編集（D&D）の状態 */
let groupEditState = {
  groupId: null,
  pool: [],
  byRole: new Map(),
  usersById: new Map(),
};

/** グループ一覧を返す */
export function getGroups() {
  return groups;
}

/** グループピル HTML */
export function groupMembershipPillHtml(membership) {
  const esc = (v) =>
    String(v)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  return `<span class="cf-group-pill" style="--pill-color:${esc(membership.group_color)}" title="${esc(membership.group_display_name)}">
    <span class="cf-group-pill-dot"></span>${esc(membership.group_display_name)} · ${esc(membership.group_role_display_name)}
  </span>`;
}

/** メンバー行のグループ表示 */
export function renderMemberGroups(user, escapeHtml) {
  const memberships = user.groups ?? [];
  const maxVisible = 2;

  if (memberships.length === 0) {
    return `<button type="button" class="cf-group-pill cf-group-pill-btn" data-edit-groups="${escapeHtml(user.id)}">+ グループを追加</button>`;
  }

  const visible = memberships.slice(0, maxVisible).map(groupMembershipPillHtml).join("");
  const hidden = memberships.length - maxVisible;
  const overflow =
    hidden > 0
      ? `<button type="button" class="cf-group-pill-more" data-edit-groups="${escapeHtml(user.id)}">+${hidden}</button>`
      : "";

  return `<div class="cf-group-pills">${visible}${overflow}
    <button type="button" class="cf-group-pill cf-group-pill-btn" data-edit-groups="${escapeHtml(user.id)}" title="グループを編集">${iconHtml("edit", "hub-icon hub-icon--sm")}</button>
  </div>`;
}

/** グループ一覧を読み込む */
export async function loadGroups(api) {
  const data = await api("/api/admin/groups");
  groups = data.groups ?? [];
}

/** グループ一覧を描画 */
export function renderGroups(filter = "", escapeHtml) {
  const container = document.getElementById("groups-list");
  if (!container) return;

  const q = filter.trim().toLowerCase();
  const filtered = groups.filter(
    (g) =>
      !q ||
      g.slug.toLowerCase().includes(q) ||
      g.display_name.toLowerCase().includes(q)
  );

  if (filtered.length === 0) {
    container.innerHTML = `<p class="cf-empty">グループがありません</p>`;
    return;
  }

  container.innerHTML = filtered
    .map((group) => {
      const rolesHtml =
        group.roles.length === 0
          ? `<p class="cf-group-roles-empty">グループロールがありません</p>`
          : group.roles
              .map(
                (role) => `
            <div class="cf-group-role-row" style="--role-color:${escapeHtml(role.color)}">
              <div class="cf-group-role-info">
                <span class="cf-group-role-dot"></span>
                <span class="cf-group-role-name">${escapeHtml(role.display_name)}</span>
                <span class="cf-group-role-slug">${escapeHtml(role.slug)}</span>
              </div>
              <span class="cf-group-role-count cf-count-with-icon">${iconHtml("user", "hub-icon hub-icon--sm")} ${role.member_count ?? 0}</span>
              <button type="button" class="cf-icon-btn" data-edit-group-role="${escapeHtml(group.id)}:${escapeHtml(role.id)}" title="編集">${iconHtml("edit", "hub-icon hub-icon--sm")}</button>
            </div>`
              )
              .join("");

      return `
      <article class="cf-group-card" style="--group-color:${escapeHtml(group.color)}">
        <header class="cf-group-card-header">
          <div class="cf-group-card-title">
            <span class="cf-group-card-icon" aria-hidden="true">${iconHtml("folder", "hub-icon hub-icon--md")}</span>
            <div>
              <h3 class="cf-group-card-name">${escapeHtml(group.display_name)}</h3>
              <p class="cf-group-card-slug">${escapeHtml(group.slug)}${group.description ? ` — ${escapeHtml(group.description)}` : ""}</p>
            </div>
          </div>
          <div class="cf-group-card-meta">
            <span class="cf-count-with-icon">${iconHtml("user", "hub-icon hub-icon--sm")} ${group.member_count ?? 0} メンバー</span>
            <button type="button" class="cf-btn cf-btn-ghost cf-btn-sm" data-edit-group="${escapeHtml(group.id)}">編集</button>
            <button type="button" class="cf-btn cf-btn-ghost cf-btn-sm" data-edit-group-members="${escapeHtml(group.id)}">メンバーを編集</button>
            <button type="button" class="cf-btn cf-btn-primary cf-btn-sm" data-add-group-role="${escapeHtml(group.id)}">ロールを追加</button>
          </div>
        </header>
        <div class="cf-group-roles">
          <p class="cf-group-roles-label">グループロール</p>
          ${rolesHtml}
        </div>
      </article>`;
    })
    .join("");
}

/** グループ割り当てダイアログを開く */
export function openGroupMembershipEditor(userId, users, escapeHtml) {
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  editingGroupMembershipUserId = userId;
  const subtitle = document.getElementById("group-membership-subtitle");
  const list = document.getElementById("group-membership-list");

  if (subtitle) {
    subtitle.textContent = `${user.display_name} (@${user.username}) のグループ所属を設定`;
  }

  if (!list) return;

  const currentByGroup = new Map(
    (user.groups ?? []).map((m) => [m.group_id, m.group_role_id])
  );

  if (groups.length === 0) {
    list.innerHTML = `<p class="cf-empty">先にグループを作成してください</p>`;
  } else {
    list.innerHTML = groups
      .map((group) => {
        const selectedRoleId = currentByGroup.get(group.id) ?? "";
        const options =
          group.roles.length === 0
            ? `<option value="">（ロール未作成）</option>`
            : `<option value="">所属なし</option>` +
              group.roles
                .map(
                  (role) =>
                    `<option value="${escapeHtml(role.id)}"${selectedRoleId === role.id ? " selected" : ""}>${escapeHtml(role.display_name)}</option>`
                )
                .join("");

        return `
        <label class="cf-group-membership-row">
          <span class="cf-group-membership-label">
            <span class="cf-group-pill-dot" style="background:${escapeHtml(group.color)}"></span>
            ${escapeHtml(group.display_name)}
          </span>
          <select class="cf-select" data-group-id="${escapeHtml(group.id)}"${group.roles.length === 0 ? " disabled" : ""}>
            ${options}
          </select>
        </label>`;
      })
      .join("");
  }

  document.getElementById("group-membership-dialog")?.showModal();
}

/** グループ管理イベントを登録 */
export function bindGroupEvents({
  api,
  escapeHtml,
  loadUsers,
  renderMembers,
  getUsers,
}) {
  document.getElementById("group-search")?.addEventListener("input", (e) => {
    renderGroups(e.target.value, escapeHtml);
  });

  document.getElementById("open-create-group")?.addEventListener("click", () => {
    document.getElementById("create-group-error").hidden = true;
    document.getElementById("create-group-dialog")?.showModal();
  });

  document.getElementById("groups-list")?.addEventListener("click", (e) => {
    const editGroupBtn = e.target.closest("[data-edit-group]");
    if (editGroupBtn) {
      openGroupEditor(editGroupBtn.dataset.editGroup, escapeHtml);
      return;
    }
    const addRoleBtn = e.target.closest("[data-add-group-role]");
    if (addRoleBtn) {
      openCreateGroupRoleDialog(addRoleBtn.dataset.addGroupRole, escapeHtml);
      return;
    }
    const editRoleBtn = e.target.closest("[data-edit-group-role]");
    if (editRoleBtn) {
      const [groupId, roleId] = editRoleBtn.dataset.editGroupRole.split(":");
      openEditGroupRoleDialog(groupId, roleId, escapeHtml);
      return;
    }
    const editMembersBtn = e.target.closest("[data-edit-group-members]");
    if (editMembersBtn) {
      openGroupEditMembersDialog(editMembersBtn.dataset.editGroupMembers, getUsers(), escapeHtml);
    }
  });

  document.getElementById("create-group-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const errorEl = document.getElementById("create-group-error");
    const formData = new FormData(form);

    try {
      await api("/api/admin/groups", {
        method: "POST",
        body: JSON.stringify({
          display_name: String(formData.get("display_name") ?? "").trim(),
          slug: String(formData.get("slug") ?? "").trim(),
          description: String(formData.get("description") ?? "").trim(),
          color: String(formData.get("color") ?? "#F38020"),
        }),
      });
      form.reset();
      form.querySelector('[name="color"]').value = "#F38020";
      document.getElementById("create-group-dialog")?.close();
      await loadGroups(api);
      renderGroups(document.getElementById("group-search")?.value ?? "", escapeHtml);
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.hidden = false;
    }
  });

  document.getElementById("edit-group-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const groupId = document.getElementById("edit-group-id").value;
    const errorEl = document.getElementById("edit-group-error");

    try {
      await api(`/api/admin/groups/${encodeURIComponent(groupId)}`, {
        method: "PATCH",
        body: JSON.stringify({
          display_name: document.getElementById("edit-group-name").value.trim(),
          slug: document.getElementById("edit-group-slug").value.trim(),
          color: document.getElementById("edit-group-color").value,
          description: document.getElementById("edit-group-description").value.trim() || null,
        }),
      });
      document.getElementById("edit-group-dialog")?.close();
      await loadGroups(api);
      renderGroups(document.getElementById("group-search")?.value ?? "", escapeHtml);
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.hidden = false;
    }
  });

  document.getElementById("delete-group-btn")?.addEventListener("click", async () => {
    const groupId = document.getElementById("edit-group-id").value;
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;
    if (!confirm(`グループ「${group.display_name}」を削除しますか？\nメンバーの所属とグループロールも削除されます。`)) {
      return;
    }
    try {
      await api(`/api/admin/groups/${encodeURIComponent(groupId)}`, { method: "DELETE" });
      document.getElementById("edit-group-dialog")?.close();
      await loadGroups(api);
      renderGroups(document.getElementById("group-search")?.value ?? "", escapeHtml);
      await loadUsers();
      renderMembers(document.getElementById("member-search")?.value ?? "");
    } catch (err) {
      alert(err.message);
    }
  });

  document.getElementById("create-group-role-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const groupId = document.getElementById("create-group-role-group-id").value;
    const errorEl = document.getElementById("create-group-role-error");
    const formData = new FormData(form);

    try {
      await api(`/api/admin/groups/${encodeURIComponent(groupId)}/roles`, {
        method: "POST",
        body: JSON.stringify({
          display_name: String(formData.get("display_name") ?? "").trim(),
          slug: String(formData.get("slug") ?? "").trim(),
          color: String(formData.get("color") ?? "#2C7CB0"),
        }),
      });
      form.reset();
      form.querySelector('[name="color"]').value = "#2C7CB0";
      document.getElementById("create-group-role-dialog")?.close();
      await loadGroups(api);
      renderGroups(document.getElementById("group-search")?.value ?? "", escapeHtml);
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.hidden = false;
    }
  });

  document.getElementById("edit-group-role-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const groupId = document.getElementById("edit-group-role-group-id").value;
    const roleId = document.getElementById("edit-group-role-id").value;
    const errorEl = document.getElementById("edit-group-role-error");

    try {
      await api(
        `/api/admin/groups/${encodeURIComponent(groupId)}/roles/${encodeURIComponent(roleId)}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            display_name: document.getElementById("edit-group-role-name").value.trim(),
            color: document.getElementById("edit-group-role-color").value,
          }),
        }
      );
      document.getElementById("edit-group-role-dialog")?.close();
      await loadGroups(api);
      renderGroups(document.getElementById("group-search")?.value ?? "", escapeHtml);
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.hidden = false;
    }
  });

  document.getElementById("delete-group-role-btn")?.addEventListener("click", async () => {
    const groupId = document.getElementById("edit-group-role-group-id").value;
    const roleId = document.getElementById("edit-group-role-id").value;
    const group = groups.find((g) => g.id === groupId);
    const role = group?.roles.find((r) => r.id === roleId);
    if (!role) return;
    if (!confirm(`グループロール「${role.display_name}」を削除しますか？`)) return;

    try {
      await api(
        `/api/admin/groups/${encodeURIComponent(groupId)}/roles/${encodeURIComponent(roleId)}`,
        { method: "DELETE" }
      );
      document.getElementById("edit-group-role-dialog")?.close();
      await loadGroups(api);
      renderGroups(document.getElementById("group-search")?.value ?? "", escapeHtml);
      await loadUsers();
      renderMembers(document.getElementById("member-search")?.value ?? "");
    } catch (err) {
      alert(err.message);
    }
  });

  document.getElementById("group-membership-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!editingGroupMembershipUserId) return;

    const memberships = [];
    document.querySelectorAll("#group-membership-list select[data-group-id]").forEach((select) => {
      const roleId = select.value;
      if (roleId) {
        memberships.push({
          group_id: select.dataset.groupId,
          group_role_id: roleId,
        });
      }
    });

    try {
      await api(`/api/admin/users/${editingGroupMembershipUserId}`, {
        method: "PATCH",
        body: JSON.stringify({ group_memberships: memberships }),
      });
      document.getElementById("group-membership-dialog")?.close();
      editingGroupMembershipUserId = null;
      await loadUsers();
      renderMembers(document.getElementById("member-search")?.value ?? "");
    } catch (err) {
      alert(err.message);
    }
  });

  document.getElementById("close-group-membership")?.addEventListener("click", () => {
    document.getElementById("group-membership-dialog")?.close();
  });
  document.getElementById("cancel-group-membership")?.addEventListener("click", () => {
    document.getElementById("group-membership-dialog")?.close();
  });

  document.getElementById("group-edit-members-search")?.addEventListener("input", (e) => {
    filterGroupEditPool(e.target.value);
  });

  document.getElementById("group-edit-members-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    await saveGroupEditMembers(api, loadUsers, renderMembers, loadGroups, escapeHtml);
  });

  document.getElementById("close-group-edit-members")?.addEventListener("click", () => {
    document.getElementById("group-edit-members-dialog")?.close();
  });
  document.getElementById("cancel-group-edit-members")?.addEventListener("click", () => {
    document.getElementById("group-edit-members-dialog")?.close();
  });

  bindGroupEditDnD();
}

function openGroupEditor(groupId, escapeHtml) {
  const group = groups.find((g) => g.id === groupId);
  if (!group) return;

  document.getElementById("edit-group-id").value = group.id;
  document.getElementById("edit-group-name").value = group.display_name;
  document.getElementById("edit-group-slug").value = group.slug;
  document.getElementById("edit-group-color").value = group.color;
  document.getElementById("edit-group-description").value = group.description ?? "";
  document.getElementById("edit-group-error").hidden = true;
  document.getElementById("edit-group-dialog")?.showModal();
}

function openCreateGroupRoleDialog(groupId, escapeHtml) {
  const group = groups.find((g) => g.id === groupId);
  if (!group) return;

  document.getElementById("create-group-role-group-id").value = groupId;
  document.getElementById("create-group-role-subtitle").textContent =
    `「${group.display_name}」にグループロールを追加`;
  document.getElementById("create-group-role-error").hidden = true;
  document.getElementById("create-group-role-dialog")?.showModal();
}

function openEditGroupRoleDialog(groupId, roleId, escapeHtml) {
  const group = groups.find((g) => g.id === groupId);
  const role = group?.roles.find((r) => r.id === roleId);
  if (!role) return;

  document.getElementById("edit-group-role-group-id").value = groupId;
  document.getElementById("edit-group-role-id").value = roleId;
  document.getElementById("edit-group-role-name").value = role.display_name;
  document.getElementById("edit-group-role-color").value = role.color;
  document.getElementById("edit-group-role-error").hidden = true;
  document.getElementById("edit-group-role-dialog")?.showModal();
}

/** グループメンバー編集ダイアログを開く */
function openGroupEditMembersDialog(groupId, users, escapeHtml) {
  const group = groups.find((g) => g.id === groupId);
  if (!group) return;

  if (group.roles.length === 0) {
    alert("先にグループロールを作成してください");
    return;
  }

  document.getElementById("group-edit-members-group-id").value = groupId;
  document.getElementById("group-edit-members-subtitle").textContent =
    `「${group.display_name}」のメンバーをグループロールへドラッグして配置`;
  document.getElementById("group-edit-members-error").hidden = true;
  document.getElementById("group-edit-members-search").value = "";

  groupEditState = {
    groupId,
    pool: [],
    byRole: new Map(group.roles.map((role) => [role.id, []])),
    usersById: new Map(users.map((user) => [user.id, user])),
  };

  for (const user of users) {
    const membership = (user.groups ?? []).find((g) => g.group_id === groupId);
    if (!membership) {
      groupEditState.pool.push(user.id);
      continue;
    }
    const list = groupEditState.byRole.get(membership.group_role_id) ?? [];
    list.push(user.id);
    groupEditState.byRole.set(membership.group_role_id, list);
  }

  renderGroupEditMembersBoard(group, escapeHtml);
  document.getElementById("group-edit-members-dialog")?.showModal();
}

/** D&D ボードを描画 */
function renderGroupEditMembersBoard(group, escapeHtml) {
  const poolEl = document.getElementById("group-edit-members-pool");
  const rolesEl = document.getElementById("group-edit-members-roles");
  if (!poolEl || !rolesEl) return;

  poolEl.innerHTML = groupEditState.pool
    .map((userId) => renderDndMemberChip(userId, escapeHtml))
    .join("");

  rolesEl.innerHTML = group.roles
    .map((role) => {
      const memberIds = groupEditState.byRole.get(role.id) ?? [];
      const membersHtml = memberIds
        .map((userId) => renderDndMemberChip(userId, escapeHtml))
        .join("");

      return `
      <div class="cf-group-edit-role-row" style="--role-color:${escapeHtml(role.color)}">
        <div class="cf-group-edit-role-label">
          <span class="cf-group-role-dot"></span>
          <span class="cf-group-edit-role-name">${escapeHtml(role.display_name)}</span>
          <span class="cf-group-edit-role-count">${memberIds.length}</span>
        </div>
        <div class="cf-group-edit-role-members" data-drop-zone="role" data-role-id="${escapeHtml(role.id)}">
          ${membersHtml || '<span class="cf-group-edit-drop-hint">ここにドロップ</span>'}
        </div>
      </div>`;
    })
    .join("");

  bindAvatarFallback(poolEl);
  bindAvatarFallback(rolesEl);
  filterGroupEditPool(document.getElementById("group-edit-members-search")?.value ?? "");
}

/** 表示名を最大文字数で切り詰め */
function truncateDisplayName(name, maxLen = 5) {
  const chars = [...name];
  if (chars.length <= maxLen) return name;
  return `${chars.slice(0, maxLen).join("")}…`;
}

/** ドラッグ可能なメンバーチップ */
function renderDndMemberChip(userId, escapeHtml) {
  const user = groupEditState.usersById.get(userId);
  if (!user) return "";

  const label = `${user.display_name} (@${user.username})`;
  const shortName = truncateDisplayName(user.display_name, 5);

  return `
    <div class="cf-dnd-member cf-dnd-member--compact" draggable="true" data-user-id="${escapeHtml(userId)}" title="${escapeHtml(label)}">
      ${avatarHtml(user, { className: "cf-dnd-avatar", imgClass: "cf-dnd-avatar-img" })}
      <span class="cf-dnd-member-name">${escapeHtml(shortName)}</span>
    </div>`;
}

/** 左側プールの検索フィルタ */
function filterGroupEditPool(query) {
  const q = query.trim().toLowerCase();
  document.querySelectorAll("#group-edit-members-pool .cf-dnd-member").forEach((chip) => {
    const user = groupEditState.usersById.get(chip.dataset.userId);
    if (!user) return;
    const haystack = `${user.display_name} ${user.username} ${user.email}`.toLowerCase();
    chip.hidden = Boolean(q) && !haystack.includes(q);
  });
}

/** ユーザーを指定ゾーンへ移動 */
function moveUserToZone(userId, zone, roleId = null) {
  groupEditState.pool = groupEditState.pool.filter((id) => id !== userId);
  for (const [rid, ids] of groupEditState.byRole) {
    groupEditState.byRole.set(
      rid,
      ids.filter((id) => id !== userId)
    );
  }

  if (zone === "pool") {
    groupEditState.pool.push(userId);
  } else if (roleId) {
    const list = groupEditState.byRole.get(roleId) ?? [];
    list.push(userId);
    groupEditState.byRole.set(roleId, list);
  }

  const group = groups.find((g) => g.id === groupEditState.groupId);
  if (group) {
    renderGroupEditMembersBoard(group, (v) =>
      String(v)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
    );
  }
}

/** D&D イベントを登録 */
function bindGroupEditDnD() {
  const dialog = document.getElementById("group-edit-members-dialog");
  if (!dialog || dialog.dataset.dndBound === "1") return;
  dialog.dataset.dndBound = "1";

  let draggedUserId = null;

  dialog.addEventListener("dragstart", (e) => {
    const chip = e.target.closest(".cf-dnd-member");
    if (!chip) return;
    draggedUserId = chip.dataset.userId;
    chip.classList.add("is-dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", draggedUserId);
  });

  dialog.addEventListener("dragend", (e) => {
    e.target.closest(".cf-dnd-member")?.classList.remove("is-dragging");
    dialog.querySelectorAll(".is-drag-over").forEach((el) => el.classList.remove("is-drag-over"));
    draggedUserId = null;
  });

  dialog.addEventListener("dragover", (e) => {
    const zone = e.target.closest("[data-drop-zone]");
    if (!zone) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    dialog.querySelectorAll(".is-drag-over").forEach((el) => el.classList.remove("is-drag-over"));
    zone.classList.add("is-drag-over");
  });

  dialog.addEventListener("dragleave", (e) => {
    const zone = e.target.closest("[data-drop-zone]");
    if (zone && !zone.contains(e.relatedTarget)) {
      zone.classList.remove("is-drag-over");
    }
  });

  dialog.addEventListener("drop", (e) => {
    const zone = e.target.closest("[data-drop-zone]");
    if (!zone) return;
    e.preventDefault();
    zone.classList.remove("is-drag-over");

    const userId = e.dataTransfer.getData("text/plain") || draggedUserId;
    if (!userId) return;

    const dropZone = zone.dataset.dropZone;
    if (dropZone === "pool") {
      moveUserToZone(userId, "pool");
      return;
    }

    const roleId = zone.dataset.roleId;
    if (dropZone === "role" && roleId) {
      moveUserToZone(userId, "role", roleId);
    }
  });
}

/** グループメンバー編集を保存 */
async function saveGroupEditMembers(api, loadUsers, renderMembers, loadGroups, escapeHtml) {
  const groupId = document.getElementById("group-edit-members-group-id").value;
  const errorEl = document.getElementById("group-edit-members-error");

  const memberships = [];
  for (const [roleId, userIds] of groupEditState.byRole) {
    for (const userId of userIds) {
      memberships.push({ user_id: userId, group_role_id: roleId });
    }
  }

  try {
    await api(`/api/admin/groups/${encodeURIComponent(groupId)}/members`, {
      method: "PUT",
      body: JSON.stringify({ memberships }),
    });
    document.getElementById("group-edit-members-dialog")?.close();
    await loadGroups(api);
    renderGroups(document.getElementById("group-search")?.value ?? "", escapeHtml);
    await loadUsers();
    renderMembers(document.getElementById("member-search")?.value ?? "");
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.hidden = false;
  }
}
