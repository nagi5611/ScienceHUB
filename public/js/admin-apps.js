/**
 * 管理パネル — アプリ管理（グループ・グループロール連動）
 */

import { appIconHtml } from "./hub-icons.js";
import { readColorValue, setColorInput } from "./color-input.js";
import {
  expandRoleIdsByWeight,
  getPresetRoleIds,
} from "./role-weight.js";

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
          <h3 class="cf-app-card-name">
            ${escapeHtml(app.display_name)}
            ${app.is_default ? `<span class="cf-app-card-badge">Default App</span>` : ""}
          </h3>
          <p class="cf-app-card-slug">${escapeHtml(app.slug)} · ${escapeHtml(app.href)}</p>
          ${app.description ? `<p class="cf-app-card-desc">${escapeHtml(app.description)}</p>` : ""}
        </div>
        <div class="cf-app-card-actions">
          <button type="button" class="cf-btn cf-btn-ghost cf-btn-sm" data-toggle-app-default="${escapeHtml(app.id)}" aria-pressed="${app.is_default ? "true" : "false"}">${app.is_default ? "Default 解除" : "Default 設定"}</button>
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

  document.getElementById("apps-list")?.addEventListener("click", async (e) => {
    const defaultBtn = e.target.closest("[data-toggle-app-default]");
    if (defaultBtn) {
      const appId = defaultBtn.dataset.toggleAppDefault;
      const app = apps.find((a) => a.id === appId);
      if (!app) return;
      try {
        await api(`/api/admin/apps/${encodeURIComponent(appId)}`, {
          method: "PATCH",
          body: JSON.stringify({ is_default: !app.is_default }),
        });
        await loadApps(api);
        renderApps(document.getElementById("app-search")?.value ?? "", escapeHtml);
      } catch (err) {
        alert(err.message);
      }
      return;
    }

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

    const color = readColorValue(form.querySelector('[name="color"]'));
    if (!color) {
      errorEl.textContent = "色は #RRGGBB 形式で入力してください";
      errorEl.hidden = false;
      return;
    }

    try {
      await api("/api/admin/apps", {
        method: "POST",
        body: JSON.stringify({
          display_name: String(formData.get("display_name") ?? "").trim(),
          slug: String(formData.get("slug") ?? "").trim(),
          description: String(formData.get("description") ?? "").trim(),
          href: String(formData.get("href") ?? "").trim(),
          icon_emoji: String(formData.get("icon_emoji") ?? "").trim(),
          color,
        }),
      });
      form.reset();
      setColorInput(form.querySelector('[name="color"]'), "#F38020");
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
    const color = readColorValue(document.getElementById("edit-app-color"));
    if (!color) {
      errorEl.textContent = "色は #RRGGBB 形式で入力してください";
      errorEl.hidden = false;
      return;
    }

    try {
      await api(`/api/admin/apps/${encodeURIComponent(appId)}`, {
        method: "PATCH",
        body: JSON.stringify({
          display_name: document.getElementById("edit-app-name").value.trim(),
          slug: document.getElementById("edit-app-slug").value.trim(),
          description: document.getElementById("edit-app-description").value.trim() || null,
          href: document.getElementById("edit-app-href").value.trim(),
          icon_emoji: document.getElementById("edit-app-icon").value.trim() || null,
          color,
          is_default: document.getElementById("edit-app-default")?.checked ?? false,
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
        .filter((role) => {
          const checkbox = document.getElementById(`app-access-role-${group.id}-${role.id}`);
          return checkbox?.dataset.explicit === "1";
        })
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
  setColorInput(document.getElementById("edit-app-color"), app.color);
  const defaultInput = document.getElementById("edit-app-default");
  if (defaultInput) defaultInput.checked = Boolean(app.is_default);
  document.getElementById("edit-app-error").hidden = true;
  document.getElementById("edit-app-dialog")?.showModal();
}

/** グループのアクセスチップ表示を重み展開に同期 */
function syncGroupAccessChips(group) {
  const roles = [...group.roles];
  const explicitIds = roles
    .filter((role) => {
      const checkbox = document.getElementById(`app-access-role-${group.id}-${role.id}`);
      return checkbox?.dataset.explicit === "1";
    })
    .map((role) => role.id);
  const expanded = expandRoleIdsByWeight(explicitIds, roles);

  for (const role of roles) {
    const checkbox = document.getElementById(`app-access-role-${group.id}-${role.id}`);
    if (!checkbox) continue;

    const isExplicit = checkbox.dataset.explicit === "1";
    const isImplied = expanded.has(role.id) && !isExplicit;
    checkbox.checked = expanded.has(role.id);
    checkbox.closest(".cf-app-access-chip")?.classList.toggle("is-implied", isImplied);
  }
}

/** グループのアクセスをプリセットで初期選択 */
function applyPresetGroupAccess(group) {
  for (const role of group.roles) {
    const checkbox = document.getElementById(`app-access-role-${group.id}-${role.id}`);
    if (checkbox) delete checkbox.dataset.explicit;
  }

  for (const roleId of getPresetRoleIds(group.roles)) {
    const checkbox = document.getElementById(`app-access-role-${group.id}-${roleId}`);
    if (checkbox) checkbox.dataset.explicit = "1";
  }

  syncGroupAccessChips(group);
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
        const hadRule = Boolean(rule);
        const explicitRoleIds = rule?.group_role_ids ?? [];
        const sortedRoles = [...group.roles].sort(
          (a, b) => (b.weight ?? 1) - (a.weight ?? 1) || a.display_name.localeCompare(b.display_name, "ja")
        );

        const rolesHtml =
          group.roles.length === 0
            ? `<p class="cf-app-access-no-roles">グループロール未作成（有効化後は全員アクセス可）</p>`
            : `<div class="cf-app-access-roles${enabled ? "" : " is-disabled"}">
                <p class="cf-app-access-roles-hint">未選択 = 全ロール可。選択した重みより大きいロールも自動的にアクセス可（同じ重みは含まない）</p>
                <div class="cf-app-access-chips" data-group-id="${escapeHtml(group.id)}">
                ${sortedRoles
                  .map(
                    (role) => `
                  <label class="cf-app-access-chip">
                    <input type="checkbox" id="app-access-role-${escapeHtml(group.id)}-${escapeHtml(role.id)}" data-role-weight="${role.weight ?? 1}"${enabled ? "" : " disabled"}>
                    <span class="cf-app-access-chip-body" style="--role-color:${escapeHtml(role.color)}">
                      <span class="cf-app-access-chip-dot" aria-hidden="true"></span>
                      <span class="cf-app-access-chip-label">${escapeHtml(role.display_name)} <span class="cf-app-access-chip-weight">${role.weight ?? 1}</span></span>
                    </span>
                  </label>`
                  )
                  .join("")}
                </div>
              </div>`;

        return `
        <section class="cf-app-access-group${enabled ? " is-enabled" : ""}" data-group-id="${escapeHtml(group.id)}" data-had-rule="${hadRule ? "1" : "0"}" style="--group-color:${escapeHtml(group.color)}">
          <div class="cf-app-access-group-head">
            <div class="cf-app-access-group-info">
              <span class="cf-app-access-group-dot" aria-hidden="true"></span>
              <span class="cf-app-access-group-name">${escapeHtml(group.display_name)}</span>
            </div>
            <label class="cf-toggle cf-app-access-toggle">
              <input type="checkbox" id="app-access-group-${escapeHtml(group.id)}" data-group-toggle="${escapeHtml(group.id)}"${enabled ? " checked" : ""}>
              <span class="cf-toggle-track" aria-hidden="true"></span>
              <span class="cf-toggle-label">アクセス許可</span>
            </label>
          </div>
          ${rolesHtml}
        </section>`;
      })
      .join("");

    for (const group of groups) {
      const rule = ruleByGroup.get(group.id);
      for (const roleId of rule?.group_role_ids ?? []) {
        const checkbox = document.getElementById(`app-access-role-${group.id}-${roleId}`);
        if (checkbox) checkbox.dataset.explicit = "1";
      }
      syncGroupAccessChips(group);
    }

    list.querySelectorAll("[data-group-toggle]").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const groupId = checkbox.dataset.groupToggle;
        const group = groups.find((item) => item.id === groupId);
        const section = checkbox.closest(".cf-app-access-group");
        section?.classList.toggle("is-enabled", checkbox.checked);
        section
          ?.querySelector(".cf-app-access-roles")
          ?.classList.toggle("is-disabled", !checkbox.checked);

        list
          .querySelectorAll(`[id^="app-access-role-${groupId}-"]`)
          .forEach((roleBox) => {
            roleBox.disabled = !checkbox.checked;
            if (!checkbox.checked) {
              roleBox.checked = false;
              delete roleBox.dataset.explicit;
              roleBox.closest(".cf-app-access-chip")?.classList.remove("is-implied");
            }
          });

        if (checkbox.checked && group && section?.dataset.hadRule !== "1") {
          applyPresetGroupAccess(group);
        }
      });
    });

    list.querySelectorAll(".cf-app-access-chips").forEach((chips) => {
      const groupId = chips.dataset.groupId;
      const group = groups.find((item) => item.id === groupId);
      if (!group) return;

      chips.addEventListener("change", (event) => {
        const checkbox = event.target;
        if (!(checkbox instanceof HTMLInputElement) || checkbox.type !== "checkbox") return;

        if (checkbox.checked) {
          checkbox.dataset.explicit = "1";
        } else {
          delete checkbox.dataset.explicit;
        }
        syncGroupAccessChips(group);
      });
    });
  }

  document.getElementById("app-access-dialog")?.showModal();
}
