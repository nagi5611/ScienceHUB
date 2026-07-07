/**
 * 管理パネル — ストレージクォータ
 */

let storageRoots = [];

const GB_BYTES = 1024 ** 3;

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

  if (storageRoots.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="cf-empty">ストレージルートがありません</td></tr>`;
    return;
  }

  tbody.innerHTML = storageRoots
    .map((root) => {
      const pct =
        root.quota_bytes > 0
          ? Math.min(100, (root.used_bytes / root.quota_bytes) * 100)
          : 0;
      return `<tr data-root-id="${escapeHtml(root.id)}">
        <td>${root.root_type === "user" ? "個人" : "グループ"}</td>
        <td>${escapeHtml(rootLabel(root))}</td>
        <td>${formatBytes(root.used_bytes)}</td>
        <td>
          <div class="cf-storage-quota-edit">
            <input type="number" class="cf-input cf-input-sm cs-quota-input" value="${formatGbForInput(root.quota_bytes)}" min="0.1" step="0.1" aria-label="割り当て GB">
            <span class="cf-muted">GB</span>
          </div>
          <div class="cf-storage-bar"><div class="cf-storage-bar-fill" style="width:${pct.toFixed(1)}%"></div></div>
        </td>
        <td><button type="button" class="cf-btn cf-btn-sm cs-save-quota">保存</button></td>
      </tr>`;
    })
    .join("");

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
}
