/**
 * 管理者パネル
 */

let roles = [];

/** API 呼び出しヘルパー */
async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error ?? "リクエストに失敗しました");
  }

  return data;
}

/** 管理者セッションを確認する */
async function requireAdmin() {
  const response = await fetch("/api/auth/me");
  const data = await response.json();

  if (!response.ok || !data.user?.is_admin) {
    window.location.href = "/admin/";
    return null;
  }

  const label = document.getElementById("admin-user-label");
  if (label) {
    label.textContent = `${data.user.display_name}（@${data.user.username}）`;
  }

  return data.user;
}

/** ロール選択肢を描画する */
function renderRoleOptions(selectEl, selectedSlug) {
  if (!(selectEl instanceof HTMLSelectElement)) return;

  selectEl.innerHTML = roles
    .map(
      (role) =>
        `<option value="${role.slug}"${role.slug === selectedSlug ? " selected" : ""}>${role.display_name}</option>`
    )
    .join("");
}

/** ロール一覧を描画する */
function renderRolesList() {
  const container = document.getElementById("roles-list");
  if (!container) return;

  if (roles.length === 0) {
    container.textContent = "ロールがありません";
    return;
  }

  container.innerHTML = roles
    .map(
      (role) => `
        <span class="role-chip${role.is_admin ? " role-chip-admin" : ""}">
          <strong>${role.display_name}</strong>
          <code>${role.slug}</code>
          ${role.is_admin ? "<span>管理者</span>" : ""}
        </span>
      `
    )
    .join("");
}

/** ユーザー一覧を読み込む */
async function loadUsers() {
  const tbody = document.getElementById("users-tbody");
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="5" class="table-empty">読み込み中…</td></tr>`;

  try {
    const data = await api("/api/admin/users");
    const users = data.users ?? [];

    if (users.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="table-empty">ユーザーがいません</td></tr>`;
      return;
    }

    tbody.innerHTML = users
      .map((user) => {
        const options = roles
          .map(
            (role) =>
              `<option value="${role.slug}"${role.slug === user.role_slug ? " selected" : ""}>${role.display_name}</option>`
          )
          .join("");

        return `
          <tr data-user-id="${user.id}">
            <td>${escapeHtml(user.username)}</td>
            <td>${escapeHtml(user.display_name)}</td>
            <td>${escapeHtml(user.email)}</td>
            <td>
              <select class="role-select" data-role-select="${user.id}" aria-label="${escapeHtml(user.username)} のロール">
                ${options}
              </select>
            </td>
            <td>
              <button type="button" class="btn btn-ghost" data-save-role="${user.id}">ロール保存</button>
            </td>
          </tr>
        `;
      })
      .join("");
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="5" class="table-empty">${escapeHtml(error.message)}</td></tr>`;
  }
}

/** ロール一覧を読み込む */
async function loadRoles() {
  const data = await api("/api/admin/roles");
  roles = data.roles ?? [];

  renderRoleOptions(document.getElementById("create-user-role"), "member");
  renderRolesList();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function showMessage(errorId, successId, errorMsg, successMsg) {
  const errorEl = document.getElementById(errorId);
  const successEl = document.getElementById(successId);

  if (errorEl instanceof HTMLElement) {
    errorEl.textContent = errorMsg ?? "";
    errorEl.hidden = !errorMsg;
  }
  if (successEl instanceof HTMLElement) {
    successEl.textContent = successMsg ?? "";
    successEl.hidden = !successMsg;
  }
}

document.getElementById("create-user-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage("create-user-error", "create-user-success");

  const form = event.currentTarget;
  if (!(form instanceof HTMLFormElement)) return;

  const formData = new FormData(form);
  const payload = {
    username: String(formData.get("username") ?? "").trim(),
    display_name: String(formData.get("display_name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    role_slug: String(formData.get("role_slug") ?? "member"),
  };

  try {
    await api("/api/admin/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    form.reset();
    renderRoleOptions(document.getElementById("create-user-role"), "member");
    showMessage("create-user-error", "create-user-success", null, "ユーザーを登録しました");
    await loadUsers();
  } catch (error) {
    showMessage("create-user-error", "create-user-success", error.message, null);
  }
});

document.getElementById("create-role-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage("create-role-error", "create-role-success");

  const form = event.currentTarget;
  if (!(form instanceof HTMLFormElement)) return;

  const formData = new FormData(form);
  const payload = {
    display_name: String(formData.get("display_name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    is_admin: formData.get("is_admin") === "on",
  };

  try {
    await api("/api/admin/roles", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    form.reset();
    showMessage("create-role-error", "create-role-success", null, "ロールを追加しました");
    await loadRoles();
    await loadUsers();
  } catch (error) {
    showMessage("create-role-error", "create-role-success", error.message, null);
  }
});

document.getElementById("users-tbody")?.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const userId = target.dataset.saveRole;
  if (!userId) return;

  const select = document.querySelector(`[data-role-select="${userId}"]`);
  if (!(select instanceof HTMLSelectElement)) return;

  try {
    await api(`/api/admin/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ role_slug: select.value }),
    });
    await loadUsers();
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById("refresh-users")?.addEventListener("click", () => {
  loadUsers();
});

document.getElementById("logout-btn")?.addEventListener("click", async () => {
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = "/admin/";
});

async function init() {
  const user = await requireAdmin();
  if (!user) return;

  await loadRoles();
  await loadUsers();
}

init();
