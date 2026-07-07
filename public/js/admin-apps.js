/**
 * 管理パネル — アプリ管理（グループ・グループロール連動）
 */

import { appIconHtml } from "./hub-icons.js";

let apps = [];

/** アプリ一覧を返す */
export function getApps() {
  return apps;
}

/** アプリ一覧を読み込む */
export async function loadApps(api) {
  const data = await api("/api/admin/apps");
  apps = data.apps ?? [];
}

/** アプリ一覧を描画 */
export function renderApps(filter = "", escapeHtml) {
  const container = document.getElementById("apps-list");
  if (!container) return;

  const q = filter.trim().toLowerCase();
  const filtered = apps.filter(
    (app) =>
      !q ||
      app.slug.toLowerCase().includes(q) ||
      app.display_name.toLowerCase().includes(q)
  );

  if (filtered.length === 0) {
    container.innerHTML = `<p class="cf-empty">アプリがありません</p>`;
    return;
  }

  container.innerHTML = filtered
    .map(
      (app) => `
      <article class="cf-app-card" style="--app-color:${escapeHtml(app.color)}">
        <div class="cf-app-card-icon" aria-hidden="true">${appIconHtml(app, "hub-icon hub-icon--md")}</div>
        <div class="cf-app-card-body">
          <h3 class="cf-app-card-name">${escapeHtml(app.display_name)}</h3>
          <p class="cf-app-card-slug">${escapeHtml(app.slug)} · ${escapeHtml(app.href)}</p>
          ${app.description ? `<p class="cf-app-card-desc">${escapeHtml(app.description)}</p>` : ""}
        </div>
        <div class="cf-app-card-actions">
          <button type="button" class="cf-btn cf-btn-ghost cf-btn-sm" data-edit-app-access="${escapeHtml(app.id)}">アクセス設定</button>
          <button type="button" class="cf-btn cf-btn-ghost cf-btn-sm" data-edit-app="${escapeHtml(app.id)}">編集</button>
        </div>
      </article>`
    )
    .join("");
}

/** アプリ管理イベントを登録 */
export function bindAppEvents({ api, escapeHtml, getGroups }) {
  document.getElementById("app-search")?.addEventListener("input", (e) => {
    renderApps(e.target.value, escapeHtml);
  });

  document.getElementById("open-create-app")?.addEventListener("click", () => {
    document.getElementById("create-app-error").hidden = true;
    document.getElementById("create-app-dialog")?.showModal();
  });

  document.getElementById("apps-list")?.addEventListener("click", (e) => {
    const editBtn = e.target.closest("[data-edit-app]");
    if (editBtn) {
      openAppEditor(editBtn.dataset.editApp);
      return;
    }
    const accessBtn = e.target.closest("[data-edit-app-access]");
    if (accessBtn) {
      openAppAccessEditor(accessBtn.dataset.editAppAccess, getGroups(), escapeHtml, api);
    }
  });

  document.getElementById("create-app-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const errorEl = document.getElementById("create-app-error");
    const formData = new FormData(form);

    try {
      await api("/api/admin/apps", {
        method: "POST",
        body: JSON.stringify({
          display_name: String(formData.get("display_name") ?? "").trim(),
          slug: String(formData.get("slug") ?? "").trim(),
          description: String(formData.get("description") ?? "").trim(),
          href: String(formData.get("href") ?? "").trim(),
          icon_emoji: String(formData.get("icon_emoji") ?? "").trim(),
          color: String(formData.get("color") ?? "#F38020"),
        }),
      });
      form.reset();
      form.querySelector('[name="color"]').value = "#F38020";
      document.getElementById("create-app-dialog")?.close();
      await loadApps(api);
      renderApps(document.getElementById("app-search")?.value ?? "", escapeHtml);
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.hidden = false;
    }
  });

  document.getElementById("edit-app-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const appId = document.getElementById("edit-app-id").value;
    const errorEl = document.getElementById("edit-app-error");

    try {
      await api(`/api/admin/apps/${encodeURIComponent(appId)}`, {
        method: "PATCH",
        body: JSON.stringify({
          display_name: document.getElementById("edit-app-name").value.trim(),
          slug: document.getElementById("edit-app-slug").value.trim(),
          description: document.getElementById("edit-app-description").value.trim() || null,
          href: document.getElementById("edit-app-href").value.trim(),
          icon_emoji: document.getElementById("edit-app-icon").value.trim() || null,
          color: document.getElementById("edit-app-color").value,
        }),
      });
      document.getElementById("edit-app-dialog")?.close();
      await loadApps(api);
      renderApps(document.getElementById("app-search")?.value ?? "", escapeHtml);
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.hidden = false;
    }
  });

  document.getElementById("delete-app-btn")?.addEventListener("click", async () => {
    const appId = document.getElementById("edit-app-id").value;
    const app = apps.find((a) => a.id === appId);
    if (!app) return;
    if (!confirm(`アプリ「${app.display_name}」を削除しますか？`)) return;

    try {
      await api(`/api/admin/apps/${encodeURIComponent(appId)}`, { method: "DELETE" });
      document.getElementById("edit-app-dialog")?.close();
      await loadApps(api);
      renderApps(document.getElementById("app-search")?.value ?? "", escapeHtml);
    } catch (err) {
      alert(err.message);
    }
  });

  document.getElementById("app-access-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const appId = document.getElementById("app-access-app-id").value;
    const errorEl = document.getElementById("app-access-error");
    const groups = getGroups();

    const rules = groups.map((group) => {
      const enabled = document.getElementById(`app-access-group-${group.id}`)?.checked ?? false;
      const roleIds = group.roles
        .filter((role) =>
          document.getElementById(`app-access-role-${group.id}-${role.id}`)?.checked
        )
        .map((role) => role.id);

      return {
        group_id: group.id,
        enabled,
        group_role_ids: roleIds,
      };
    });

    try {
      await api(`/api/admin/apps/${encodeURIComponent(appId)}/access`, {
        method: "PUT",
        body: JSON.stringify({ rules }),
      });
      document.getElementById("app-access-dialog")?.close();
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.hidden = false;
    }
  });
}

function openAppEditor(appId) {
  const app = apps.find((a) => a.id === appId);
  if (!app) return;

  document.getElementById("edit-app-id").value = app.id;
  document.getElementById("edit-app-name").value = app.display_name;
  document.getElementById("edit-app-slug").value = app.slug;
  document.getElementById("edit-app-description").value = app.description ?? "";
  document.getElementById("edit-app-href").value = app.href;
  document.getElementById("edit-app-icon").value = app.icon_emoji ?? "";
  document.getElementById("edit-app-color").value = app.color;
  document.getElementById("edit-app-error").hidden = true;
  document.getElementById("edit-app-dialog")?.showModal();
}

/** アクセス設定ダイアログを開く */
async function openAppAccessEditor(appId, groups, escapeHtml, api) {
  const app = apps.find((a) => a.id === appId);
  if (!app) return;

  document.getElementById("app-access-app-id").value = appId;
  document.getElementById("app-access-subtitle").textContent =
    `「${app.display_name}」を表示するグループとロールを設定`;
  document.getElementById("app-access-error").hidden = true;

  const list = document.getElementById("app-access-list");
  if (!list) return;

  let rules = [];
  try {
    const data = await api(`/api/admin/apps/${encodeURIComponent(appId)}/access`);
    rules = data.rules ?? [];
  } catch {
    rules = [];
  }

  const ruleByGroup = new Map(rules.map((r) => [r.group_id, r]));

  if (groups.length === 0) {
    list.innerHTML = `<p class="cf-empty">先にグループを作成してください</p>`;
  } else {
    list.innerHTML = groups
      .map((group) => {
        const rule = ruleByGroup.get(group.id);
        const enabled = rule?.enabled ?? false;
        const selectedRoles = new Set(rule?.group_role_ids ?? []);

        const rolesHtml =
          group.roles.length === 0
            ? `<p class="cf-app-access-no-roles">グループロール未作成（有効化後は全員アクセス可）</p>`
            : `<div class="cf-app-access-roles">
                <p class="cf-app-access-roles-hint">未選択 = グループ内の全ロールがアクセス可</p>
                ${group.roles
                  .map(
                    (role) => `
                  <label class="cf-app-access-role-check">
                    <input type="checkbox" id="app-access-role-${escapeHtml(group.id)}-${escapeHtml(role.id)}"${selectedRoles.has(role.id) ? " checked" : ""}${enabled ? "" : " disabled"}>
                    <span>${escapeHtml(role.display_name)}</span>
                  </label>`
                  )
                  .join("")}
              </div>`;

        return `
        <section class="cf-app-access-group" style="--group-color:${escapeHtml(group.color)}">
          <label class="cf-app-access-group-toggle">
            <input type="checkbox" id="app-access-group-${escapeHtml(group.id)}" data-group-toggle="${escapeHtml(group.id)}"${enabled ? " checked" : ""}>
            <span class="cf-app-access-group-name">${escapeHtml(group.display_name)}</span>
          </label>
          ${rolesHtml}
        </section>`;
      })
      .join("");

    list.querySelectorAll("[data-group-toggle]").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const groupId = checkbox.dataset.groupToggle;
        list
          .querySelectorAll(`[id^="app-access-role-${groupId}-"]`)
          .forEach((roleBox) => {
            roleBox.disabled = !checkbox.checked;
            if (!checkbox.checked) roleBox.checked = false;
          });
      });
    });
  }

  document.getElementById("app-access-dialog")?.showModal();
}
