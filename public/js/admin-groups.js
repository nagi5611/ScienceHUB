/**
 * 管理パネル — グループ・グループロール管理
 */

import { avatarHtml, bindAvatarFallback } from "./user-avatar.js";
import { iconHtml } from "./hub-icons.js";
import { readColorValue, setColorInput } from "./color-input.js";
import { parseRoleWeightInput } from "./role-weight.js";

let groups = [];
let editingGroupMembershipUserId = null;
/** 展開中のグループ ID */
const expandedGroupIds = new Set();

/** グループメンバー編集（D&D）の状態 */
let groupEditState = {
  groupId: null,
  pool: [],
  byRole: new Map(),
  usersById: new Map(),
};

/** グループロール作成時のよく使うプリセット */
const GROUP_ROLE_PRESETS = [
  { display_name: "先生", slug: "teacher", color: "#2C7CB0", weight: 10 },
  { display_name: "生徒", slug: "student", color: "#059669", weight: 5 },
  { display_name: "ゲスト", slug: "guest", color: "#6B7280", weight: 0 },
];

/** よく使うロールプリセットボタンを初期化 */
function bindGroupRolePresets() {
  document.querySelectorAll(".cf-role-presets[data-role-presets-form]").forEach((container) => {
    const form = document.getElementById(container.dataset.rolePresetsForm);
    if (!form || container.dataset.presetsBound === "1") return;
    container.dataset.presetsBound = "1";

    const list = container.querySelector(".cf-role-presets-list");
    if (!list) return;

    list.innerHTML = GROUP_ROLE_PRESETS.map(
      (preset) =>
        `<button type="button" class="cf-role-preset" style="--preset-color:${preset.color}" data-preset-display="${preset.display_name}" data-preset-slug="${preset.slug}" data-preset-color="${preset.color}" data-preset-weight="${preset.weight}">${preset.display_name}</button>`
    ).join("");

    list.addEventListener("click", (event) => {
      const button = event.target.closest(".cf-role-preset");
      if (!button) return;

      const nameInput =
        form.querySelector('[name="display_name"]') ?? form.querySelector("#edit-group-role-name");
      const slugInput = form.querySelector('[name="slug"]');
      const colorInput =
        form.querySelector('[name="color"]') ?? form.querySelector("#edit-group-role-color");
      const weightInput =
        form.querySelector('[name="weight"]') ?? form.querySelector("#edit-group-role-weight");

      if (nameInput) nameInput.value = button.dataset.presetDisplay ?? "";
      if (slugInput) slugInput.value = button.dataset.presetSlug ?? "";
      if (colorInput) setColorInput(colorInput, button.dataset.presetColor ?? "");
      if (weightInput) weightInput.value = button.dataset.presetWeight ?? "1";
      nameInput?.focus();
    });
  });
}

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
      const isExpanded = expandedGroupIds.has(group.id);
      const roleCount = group.roles?.length ?? 0;
      const memberCount = group.member_count ?? 0;

      const rolesHtml =
        roleCount === 0
          ? `<p class="cf-group-roles-empty">グループロールがありません</p>`
          : group.roles
              .map(
                (role) => `
            <div class="cf-group-role-row" style="--role-color:${escapeHtml(role.color)}">
              <div class="cf-group-role-info">
                <span class="cf-group-role-dot"></span>
                <span class="cf-group-role-name">${escapeHtml(role.display_name)}</span>
                <span class="cf-group-role-slug">${escapeHtml(role.slug)} · 重み ${role.weight ?? 1}</span>
              </div>
              <span class="cf-group-role-count cf-count-with-icon">${iconHtml("user", "hub-icon hub-icon--sm")} ${role.member_count ?? 0}</span>
              <button type="button" class="cf-icon-btn" data-edit-group-role="${escapeHtml(group.id)}:${escapeHtml(role.id)}" title="編集">${iconHtml("edit", "hub-icon hub-icon--sm")}</button>
            </div>`
              )
              .join("");

      return `
      <article class="cf-group-card${isExpanded ? " is-expanded" : ""}" style="--group-color:${escapeHtml(group.color)}" data-group-id="${escapeHtml(group.id)}">
        <div class="cf-group-card-summary-row">
          <button
            type="button"
            class="cf-group-toggle"
            data-toggle-group="${escapeHtml(group.id)}"
            aria-expanded="${isExpanded ? "true" : "false"}"
            aria-controls="group-details-${escapeHtml(group.id)}"
          >
            <span class="cf-group-chevron" aria-hidden="true"></span>
            <span class="cf-group-card-icon">${iconHtml("folder", "hub-icon hub-icon--md")}</span>
            <span class="cf-group-summary-text">
              <span class="cf-group-card-name">${escapeHtml(group.display_name)}${group.is_root ? `<span class="cf-group-root-badge">ルート</span>` : ""}</span>
              <span class="cf-group-card-slug">${escapeHtml(group.slug)}</span>
            </span>
          </button>
          <div class="cf-group-summary-meta">
            <span class="cf-group-summary-stat">${roleCount} ロール</span>
            <span class="cf-group-summary-stat cf-count-with-icon">${iconHtml("user", "hub-icon hub-icon--sm")} ${memberCount}</span>
          </div>
        </div>
        <div class="cf-group-card-details" id="group-details-${escapeHtml(group.id)}"${isExpanded ? "" : " hidden"}>
          <div class="cf-group-card-header">
            <div class="cf-group-card-title">
              <div>
                <p class="cf-group-card-desc">${group.description ? escapeHtml(group.description) : "説明は未設定です"}</p>
                ${group.is_root ? `<p class="cf-group-card-root">組織ルート — 全体カレンダー表示名: ${escapeHtml(group.overall_calendar_name || group.display_name)}</p>` : ""}
                ${group.google_calendar_id ? `<p class="cf-group-card-gcal">Google カレンダー連携済</p>` : `<p class="cf-group-card-gcal cf-group-card-gcal--off">Google カレンダー未設定</p>`}
              </div>
            </div>
            <div class="cf-group-card-meta">
              <button type="button" class="cf-btn cf-btn-ghost cf-btn-sm" data-edit-group="${escapeHtml(group.id)}">編集</button>
              <button type="button" class="cf-btn cf-btn-ghost cf-btn-sm" data-edit-group-members="${escapeHtml(group.id)}">メンバーを編集</button>
              <button type="button" class="cf-btn cf-btn-primary cf-btn-sm" data-add-group-role="${escapeHtml(group.id)}">ロールを追加</button>
            </div>
          </div>
          <div class="cf-group-roles">
            <p class="cf-group-roles-label">グループロール</p>
            ${rolesHtml}
          </div>
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
  onGroupsChanged,
}) {
  document.getElementById("group-search")?.addEventListener("input", (e) => {
    renderGroups(e.target.value, escapeHtml);
  });

  document.getElementById("open-create-group")?.addEventListener("click", () => {
    document.getElementById("create-group-error").hidden = true;
    document.getElementById("create-group-dialog")?.showModal();
  });

  document.getElementById("groups-list")?.addEventListener("click", (e) => {
    const toggleBtn = e.target.closest("[data-toggle-group]");
    if (toggleBtn) {
      const groupId = toggleBtn.dataset.toggleGroup;
      if (expandedGroupIds.has(groupId)) {
        expandedGroupIds.delete(groupId);
      } else {
        expandedGroupIds.add(groupId);
      }
      renderGroups(document.getElementById("group-search")?.value ?? "", escapeHtml);
      return;
    }

    const editGroupBtn = e.target.closest("[data-edit-group]");
    if (editGroupBtn) {
      openGroupEditor(editGroupBtn.dataset.editGroup);
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

    const color = readColorValue(form.querySelector('[name="color"]'));
    if (!color) {
      errorEl.textContent = "色は #RRGGBB 形式で入力してください";
      errorEl.hidden = false;
      return;
    }

    try {
      const isRoot = form.querySelector('[name="is_root"]')?.checked === true;
      await api("/api/admin/groups", {
        method: "POST",
        body: JSON.stringify({
          display_name: String(formData.get("display_name") ?? "").trim(),
          slug: String(formData.get("slug") ?? "").trim(),
          description: String(formData.get("description") ?? "").trim(),
          color,
          is_root: isRoot,
          overall_calendar_name: isRoot
            ? document.getElementById("create-group-overall-calendar-name")?.value?.trim() || null
            : undefined,
          google_calendar_id: isRoot
            ? document.getElementById("create-group-calendar-id")?.value?.trim() || null
            : undefined,
        }),
      });
      form.reset();
      setColorInput(form.querySelector('[name="color"]'), "#F38020");
      syncCreateGroupRootUi();
      document.getElementById("create-group-dialog")?.close();
      await loadGroups(api);
      renderGroups(document.getElementById("group-search")?.value ?? "", escapeHtml);
      await onGroupsChanged?.();
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.hidden = false;
    }
  });

  document.getElementById("create-group-is-root")?.addEventListener("change", syncCreateGroupRootUi);

  document.getElementById("edit-group-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const groupId = document.getElementById("edit-group-id").value;
    const errorEl = document.getElementById("edit-group-error");
    const color = readColorValue(document.getElementById("edit-group-color"));
    if (!color) {
      errorEl.textContent = "色は #RRGGBB 形式で入力してください";
      errorEl.hidden = false;
      return;
    }

    try {
      const isRoot = document.getElementById("edit-group-is-root")?.checked === true;
      const calId = isRoot
        ? document.getElementById("edit-group-calendar-id")?.value?.trim() ?? ""
        : document.getElementById("edit-group-group-calendar-id")?.value?.trim() ?? "";
      await api(`/api/admin/groups/${encodeURIComponent(groupId)}`, {
        method: "PATCH",
        body: JSON.stringify({
          display_name: document.getElementById("edit-group-name").value.trim(),
          slug: document.getElementById("edit-group-slug").value.trim(),
          color,
          description: document.getElementById("edit-group-description").value.trim() || null,
          google_calendar_id: calId || null,
          is_root: isRoot,
          overall_calendar_name: isRoot
            ? document.getElementById("edit-group-overall-calendar-name")?.value?.trim() || null
            : null,
        }),
      });
      document.getElementById("edit-group-dialog")?.close();
      await loadGroups(api);
      renderGroups(document.getElementById("group-search")?.value ?? "", escapeHtml);
      await onGroupsChanged?.();
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
      await onGroupsChanged?.();
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

    const color = readColorValue(form.querySelector('[name="color"]'));
    if (!color) {
      errorEl.textContent = "色は #RRGGBB 形式で入力してください";
      errorEl.hidden = false;
      return;
    }
    const weight = parseRoleWeightInput(formData.get("weight"));
    if (weight === null) {
      errorEl.textContent = "重みは整数で入力してください";
      errorEl.hidden = false;
      return;
    }

    try {
      await api(`/api/admin/groups/${encodeURIComponent(groupId)}/roles`, {
        method: "POST",
        body: JSON.stringify({
          display_name: String(formData.get("display_name") ?? "").trim(),
          slug: String(formData.get("slug") ?? "").trim(),
          color,
          weight,
        }),
      });
      form.reset();
      setColorInput(form.querySelector('[name="color"]'), "#2C7CB0");
      const weightInput = form.querySelector('[name="weight"]');
      if (weightInput) weightInput.value = "1";
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
    const color = readColorValue(document.getElementById("edit-group-role-color"));
    if (!color) {
      errorEl.textContent = "色は #RRGGBB 形式で入力してください";
      errorEl.hidden = false;
      return;
    }
    const weight = parseRoleWeightInput(document.getElementById("edit-group-role-weight").value);
    if (weight === null) {
      errorEl.textContent = "重みは整数で入力してください";
      errorEl.hidden = false;
      return;
    }

    try {
      await api(
        `/api/admin/groups/${encodeURIComponent(groupId)}/roles/${encodeURIComponent(roleId)}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            display_name: document.getElementById("edit-group-role-name").value.trim(),
            color,
            weight,
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

  bindGroupRolePresets();
  bindGroupEditDnD();

  document.getElementById("edit-group-is-root")?.addEventListener("change", syncEditGroupRootUi);
}

function openGroupEditor(groupId) {
  const group = groups.find((g) => g.id === groupId);
  if (!group) return;

  document.getElementById("edit-group-id").value = group.id;
  document.getElementById("edit-group-name").value = group.display_name;
  document.getElementById("edit-group-slug").value = group.slug;
  setColorInput(document.getElementById("edit-group-color"), group.color);
  document.getElementById("edit-group-description").value = group.description ?? "";
  document.getElementById("edit-group-overall-calendar-name").value =
    group.overall_calendar_name ?? "";
  document.getElementById("edit-group-calendar-id").value = group.is_root
    ? group.google_calendar_id ?? ""
    : "";
  document.getElementById("edit-group-group-calendar-id").value = group.is_root
    ? ""
    : group.google_calendar_id ?? "";
  const isRootInput = document.getElementById("edit-group-is-root");
  if (isRootInput) isRootInput.checked = Boolean(group.is_root);
  syncEditGroupRootUi();
  document.getElementById("edit-group-error").hidden = true;
  document.getElementById("edit-group-dialog")?.showModal();
}

/** ルートグループ編集を外部から開く */
export function openGroupEditorById(groupId) {
  openGroupEditor(groupId);
}

/** ルートグループ編集 UI の表示を同期 */
function syncEditGroupRootUi() {
  const isRoot = document.getElementById("edit-group-is-root")?.checked === true;
  const rootSection = document.getElementById("edit-group-root-calendar-section");
  const groupGcalField = document.getElementById("edit-group-group-gcal-field");
  if (rootSection) rootSection.hidden = !isRoot;
  if (groupGcalField) groupGcalField.hidden = isRoot;
}

/** グループ作成時のルート UI を同期 */
function syncCreateGroupRootUi() {
  const isRoot = document.getElementById("create-group-is-root")?.checked === true;
  const rootSection = document.getElementById("create-group-root-calendar-section");
  if (rootSection) rootSection.hidden = !isRoot;
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
  document.getElementById("edit-group-role-weight").value = role.weight ?? 1;
  setColorInput(document.getElementById("edit-group-role-color"), role.color);
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
