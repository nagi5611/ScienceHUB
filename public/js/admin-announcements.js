/**
 * 管理パネル — お知らせ管理
 */

let announcements = [];

/** お知らせ一覧を返す */
export function getAnnouncements() {
  return announcements;
}

/** JST の日付ラベル (MM/DD) */
function formatDateLabel(publishedAt) {
  const [, month, day] = new Date(publishedAt)
    .toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" })
    .split("-");
  return `${month}/${day}`;
}

/** date 入力値へ */
function toDateInput(publishedAt) {
  return new Date(publishedAt).toLocaleDateString("sv-SE", {
    timeZone: "Asia/Tokyo",
  });
}

/** 今日の date 入力値 */
function todayDateInput() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

/** グループ表示ラベル */
function formatGroupLabel(groupIds, groups, escapeHtml) {
  if (!groupIds?.length) {
    return '<span class="cf-announce-groups-all">全員</span>';
  }
  const names = groupIds
    .map((id) => groups.find((g) => g.id === id)?.display_name)
    .filter(Boolean);
  if (names.length === 0) {
    return '<span class="cf-announce-groups-all">全員</span>';
  }
  return `<span class="cf-announce-groups-list">${names.map((name) => escapeHtml(name)).join("、")}</span>`;
}

/** グループ選択 UI */
function renderGroupCheckboxes(container, groups, selectedIds, escapeHtml) {
  if (!container) return;
  const selected = new Set(selectedIds ?? []);

  if (groups.length === 0) {
    container.innerHTML =
      '<p class="cf-empty">グループがありません（未選択時は全員に表示）</p>';
    return;
  }

  container.innerHTML = groups
    .map(
      (group) => `
    <label class="cf-announce-group-chip" style="--group-color:${escapeHtml(group.color)}">
      <input type="checkbox" name="announcement-group" value="${escapeHtml(group.id)}"${selected.has(group.id) ? " checked" : ""}>
      <span class="cf-announce-group-chip-dot" aria-hidden="true"></span>
      <span class="cf-announce-group-chip-label">${escapeHtml(group.display_name)}</span>
    </label>`
    )
    .join("");
}

/** 選択中のグループ ID */
function readSelectedGroupIds(container) {
  if (!container) return [];
  return [...container.querySelectorAll('input[name="announcement-group"]:checked')].map(
    (input) => input.value
  );
}

/** お知らせ一覧を読み込む */
export async function loadAnnouncements(api) {
  const data = await api("/api/admin/announcements");
  announcements = data.announcements ?? [];
}

/** お知らせ一覧を描画 */
export function renderAnnouncements(filter = "", escapeHtml, groups = []) {
  const tbody = document.getElementById("announcements-tbody");
  if (!tbody) return;

  const q = filter.trim().toLowerCase();
  const filtered = announcements.filter(
    (item) => !q || item.body.toLowerCase().includes(q)
  );

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="cf-empty">お知らせがありません</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered
    .map(
      (item) => `
      <tr>
        <td class="cf-announce-date">${escapeHtml(formatDateLabel(item.published_at))}</td>
        <td class="cf-announce-body">${escapeHtml(item.body)}</td>
        <td class="cf-announce-groups">${formatGroupLabel(item.group_ids, groups, escapeHtml)}</td>
        <td>
          <span class="cf-badge${item.is_published ? "" : " cf-badge--muted"}">
            ${item.is_published ? "公開" : "非公開"}
          </span>
        </td>
        <td>
          <div class="cf-row-actions">
            <button type="button" class="cf-btn cf-btn-ghost cf-btn-sm" data-edit-announcement="${escapeHtml(item.id)}">編集</button>
            <button type="button" class="cf-btn cf-btn-ghost cf-btn-sm cf-btn-danger-ghost" data-delete-announcement="${escapeHtml(item.id)}">削除</button>
          </div>
        </td>
      </tr>`
    )
    .join("");
}

/** 編集ダイアログを開く */
function openAnnouncementEditor(id, getGroups, escapeHtml) {
  const item = announcements.find((a) => a.id === id);
  if (!item) return;

  document.getElementById("edit-announcement-id").value = item.id;
  document.getElementById("edit-announcement-body").value = item.body;
  document.getElementById("edit-announcement-date").value = toDateInput(item.published_at);
  document.getElementById("edit-announcement-position").value = String(item.position ?? 0);
  document.getElementById("edit-announcement-published").checked = item.is_published;
  renderGroupCheckboxes(
    document.getElementById("edit-announcement-groups"),
    getGroups(),
    item.group_ids ?? [],
    escapeHtml
  );
  document.getElementById("edit-announcement-error").hidden = true;
  document.getElementById("edit-announcement-dialog")?.showModal();
}

/** お知らせ管理イベントを登録 */
export function bindAnnouncementEvents({ api, escapeHtml, getGroups }) {
  document.getElementById("announcement-search")?.addEventListener("input", (e) => {
    renderAnnouncements(e.target.value, escapeHtml, getGroups());
  });

  document.getElementById("open-create-announcement")?.addEventListener("click", () => {
    const form = document.getElementById("create-announcement-form");
    form?.reset();
    const dateInput = document.getElementById("create-announcement-date");
    if (dateInput) dateInput.value = todayDateInput();
    document.getElementById("create-announcement-published").checked = true;
    renderGroupCheckboxes(
      document.getElementById("create-announcement-groups"),
      getGroups(),
      [],
      escapeHtml
    );
    document.getElementById("create-announcement-error").hidden = true;
    document.getElementById("create-announcement-dialog")?.showModal();
  });

  document.getElementById("announcements-tbody")?.addEventListener("click", (e) => {
    const editBtn = e.target.closest("[data-edit-announcement]");
    if (editBtn) {
      openAnnouncementEditor(editBtn.dataset.editAnnouncement, getGroups, escapeHtml);
      return;
    }

    const deleteBtn = e.target.closest("[data-delete-announcement]");
    if (deleteBtn) {
      deleteAnnouncement(deleteBtn.dataset.deleteAnnouncement, {
        api,
        escapeHtml,
        getGroups,
      }).catch((err) => alert(err.message));
    }
  });

  document.getElementById("create-announcement-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById("create-announcement-error");

    try {
      await api("/api/admin/announcements", {
        method: "POST",
        body: JSON.stringify({
          body: document.getElementById("create-announcement-body").value.trim(),
          published_date: document.getElementById("create-announcement-date").value,
          is_published: document.getElementById("create-announcement-published").checked,
          position: Number(document.getElementById("create-announcement-position").value) || 0,
          group_ids: readSelectedGroupIds(
            document.getElementById("create-announcement-groups")
          ),
        }),
      });
      document.getElementById("create-announcement-dialog")?.close();
      await loadAnnouncements(api);
      renderAnnouncements(
        document.getElementById("announcement-search")?.value ?? "",
        escapeHtml,
        getGroups()
      );
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.hidden = false;
    }
  });

  document.getElementById("edit-announcement-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("edit-announcement-id").value;
    const errorEl = document.getElementById("edit-announcement-error");

    try {
      await api(`/api/admin/announcements/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({
          body: document.getElementById("edit-announcement-body").value.trim(),
          published_date: document.getElementById("edit-announcement-date").value,
          is_published: document.getElementById("edit-announcement-published").checked,
          position: Number(document.getElementById("edit-announcement-position").value) || 0,
          group_ids: readSelectedGroupIds(
            document.getElementById("edit-announcement-groups")
          ),
        }),
      });
      document.getElementById("edit-announcement-dialog")?.close();
      await loadAnnouncements(api);
      renderAnnouncements(
        document.getElementById("announcement-search")?.value ?? "",
        escapeHtml,
        getGroups()
      );
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.hidden = false;
    }
  });
}

/** お知らせ削除 */
async function deleteAnnouncement(id, { api, escapeHtml, getGroups }) {
  const item = announcements.find((a) => a.id === id);
  if (!item) return;
  if (!confirm(`お知らせ「${item.body}」を削除しますか？`)) return;

  await api(`/api/admin/announcements/${encodeURIComponent(id)}`, { method: "DELETE" });
  await loadAnnouncements(api);
  renderAnnouncements(
    document.getElementById("announcement-search")?.value ?? "",
    escapeHtml,
    getGroups()
  );
}
