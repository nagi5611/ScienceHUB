/**
 * 管理パネル — ストレージクォータ
 */

let storageRoots = [];
let storageSearchQuery = "";

const GB_BYTES = 1024 ** 3;
const QUOTA_MAX_GB = 10 * 1024;

function formatBytes(bytes) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

/** バイトを割り当て入力用の GB 値に変換 */
function formatGbForInput(bytes) {
  return Number((bytes / GB_BYTES).toFixed(2));
}

function rootLabel(root) {
  if (root.root_type === "user") {
    return root.user_display_name
      ? `${root.user_display_name} (@${root.username})`
      : root.username ?? "—";
  }
  return root.group_display_name ?? root.group_slug ?? "—";
}

function rootSubLabel(root) {
  if (root.root_type === "user" && root.user_email) {
    return root.user_email;
  }
  if (root.root_type === "group" && root.group_slug) {
    return `@${root.group_slug}`;
  }
  return "";
}

function usagePercent(root) {
  return root.quota_bytes > 0
    ? Math.min(100, (root.used_bytes / root.quota_bytes) * 100)
    : 0;
}

function usageBarClass(pct) {
  if (pct >= 95) return " is-danger";
  if (pct >= 80) return " is-warning";
  return "";
}

function matchesStorageSearch(root, query) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return true;
  if (root.root_type !== "user") return false;

  const haystacks = [
    root.user_email,
    root.user_display_name,
    root.username,
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  return haystacks.some((value) => value.includes(trimmed));
}

function getFilteredStorageRoots() {
  return storageRoots.filter((root) => matchesStorageSearch(root, storageSearchQuery));
}

/** 検索クリアボタンの表示を同期 */
function syncStorageSearchClearButton() {
  const input = document.getElementById("storage-user-search");
  const clearBtn = document.getElementById("storage-user-search-clear");
  if (!clearBtn) return;
  clearBtn.hidden = !(input?.value?.trim());
}

/** 検索結果のヒント文言を更新 */
function updateStorageSearchHint() {
  const hint = document.getElementById("storage-search-hint");
  if (!hint) return;

  const userCount = storageRoots.filter((root) => root.root_type === "user").length;
  const groupCount = storageRoots.length - userCount;
  const filteredCount = getFilteredStorageRoots().length;
  const query = storageSearchQuery.trim();

  hint.classList.remove("is-empty");

  if (!query) {
    hint.textContent = `個人 ${userCount} 件 · グループ ${groupCount} 件`;
    return;
  }

  if (filteredCount === 0) {
    hint.textContent = `「${query}」に一致するユーザーはいません`;
    hint.classList.add("is-empty");
    return;
  }

  hint.textContent = `${filteredCount} 件ヒット（個人 ${userCount} 件中）`;
}

/** ストレージルート一覧を読み込む */
export async function loadStorageRoots(api) {
  await api("/api/admin/storage/quota?backfill=1");
  const data = await api("/api/admin/storage/quota");
  storageRoots = data.roots ?? [];
  return storageRoots;
}

/** ストレージ一覧を描画 */
export function renderStorageRoots(escapeHtml) {
  const tbody = document.getElementById("storage-tbody");
  if (!tbody) return;

  const roots = getFilteredStorageRoots();

  if (storageRoots.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="cf-empty">ストレージルートがありません</td></tr>`;
    updateStorageSearchHint();
    syncStorageSearchClearButton();
    return;
  }

  if (roots.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="cf-empty">検索条件に一致するユーザーがありません</td></tr>`;
    updateStorageSearchHint();
    syncStorageSearchClearButton();
    return;
  }

  tbody.innerHTML = roots
    .map((root) => {
      const pct = usagePercent(root);
      const subLabel = rootSubLabel(root);
      return `<tr data-root-id="${escapeHtml(root.id)}">
        <td>${root.root_type === "user" ? "個人" : "グループ"}</td>
        <td>
          <div class="cf-storage-name">${escapeHtml(rootLabel(root))}</div>
          ${subLabel ? `<div class="cf-muted cf-storage-subname">${escapeHtml(subLabel)}</div>` : ""}
        </td>
        <td>
          <div class="cf-storage-usage">
            <div class="cf-storage-bar${usageBarClass(pct)}"><div class="cf-storage-bar-fill" style="width:${pct.toFixed(1)}%"></div></div>
            <span class="cf-storage-usage-label">${formatBytes(root.used_bytes)} / ${formatBytes(root.quota_bytes)}</span>
          </div>
        </td>
        <td>
          <div class="cf-storage-quota-edit">
            <input type="number" class="cf-input cf-input-sm cs-quota-input" value="${formatGbForInput(root.quota_bytes)}" min="0.1" max="${QUOTA_MAX_GB}" step="0.1" aria-label="割り当て GB">
            <span class="cf-muted">GB</span>
          </div>
        </td>
        <td><button type="button" class="cf-btn cf-btn-sm cs-save-quota">保存</button></td>
      </tr>`;
    })
    .join("");

  updateStorageSearchHint();
  syncStorageSearchClearButton();

  tbody.querySelectorAll(".cs-save-quota").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const row = btn.closest("tr");
      const rootId = row?.dataset.rootId;
      const input = row?.querySelector(".cs-quota-input");
      const gb = Number(input?.value);
      if (!rootId || !Number.isFinite(gb) || gb <= 0) {
        alert("有効な割り当て容量（GB）を入力してください");
        return;
      }
      if (gb > QUOTA_MAX_GB) {
        alert(`割り当て容量は最大 ${QUOTA_MAX_GB} GB（10 TB）までです`);
        return;
      }

      try {
        await window.__adminApi("/api/admin/storage/quota", {
          method: "PATCH",
          body: JSON.stringify({
            root_id: rootId,
            quota_bytes: Math.round(gb * GB_BYTES),
          }),
        });
        await loadStorageRoots(window.__adminApi);
        renderStorageRoots(escapeHtml);
      } catch (err) {
        alert(err.message);
      }
    });
  });
}

/** ストレージイベントをバインド */
export function bindStorageEvents({ api, escapeHtml }) {
  window.__adminApi = api;
  document.getElementById("storage-refresh-btn")?.addEventListener("click", async () => {
    await loadStorageRoots(api);
    renderStorageRoots(escapeHtml);
  });

  document.getElementById("storage-user-search")?.addEventListener("input", (e) => {
    storageSearchQuery = e.target.value ?? "";
    syncStorageSearchClearButton();
    renderStorageRoots(escapeHtml);
  });

  document.getElementById("storage-user-search-clear")?.addEventListener("click", () => {
    const input = document.getElementById("storage-user-search");
    if (!input) return;
    input.value = "";
    storageSearchQuery = "";
    syncStorageSearchClearButton();
    renderStorageRoots(escapeHtml);
    input.focus();
  });
}
