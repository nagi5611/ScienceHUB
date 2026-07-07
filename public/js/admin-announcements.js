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

/** お知らせ一覧を読み込む */
export async function loadAnnouncements(api) {
  const data = await api("/api/admin/announcements");
  announcements = data.announcements ?? [];
}

/** お知らせ一覧を描画 */
export function renderAnnouncements(filter = "", escapeHtml) {
  const tbody = document.getElementById("announcements-tbody");
  if (!tbody) return;

  const q = filter.trim().toLowerCase();
  const filtered = announcements.filter(
    (item) => !q || item.body.toLowerCase().includes(q)
  );

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="cf-empty">お知らせがありません</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered
    .map(
      (item) => `
      <tr>
        <td class="cf-announce-date">${escapeHtml(formatDateLabel(item.published_at))}</td>
        <td class="cf-announce-body">${escapeHtml(item.body)}</td>
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
function openAnnouncementEditor(id) {
  const item = announcements.find((a) => a.id === id);
  if (!item) return;

  document.getElementById("edit-announcement-id").value = item.id;
  document.getElementById("edit-announcement-body").value = item.body;
  document.getElementById("edit-announcement-date").value = toDateInput(item.published_at);
  document.getElementById("edit-announcement-position").value = String(item.position ?? 0);
  document.getElementById("edit-announcement-published").checked = item.is_published;
  document.getElementById("edit-announcement-error").hidden = true;
  document.getElementById("edit-announcement-dialog")?.showModal();
}

/** お知らせ管理イベントを登録 */
export function bindAnnouncementEvents({ api, escapeHtml }) {
  document.getElementById("announcement-search")?.addEventListener("input", (e) => {
    renderAnnouncements(e.target.value, escapeHtml);
  });

  document.getElementById("open-create-announcement")?.addEventListener("click", () => {
    const form = document.getElementById("create-announcement-form");
    form?.reset();
    const dateInput = document.getElementById("create-announcement-date");
    if (dateInput) dateInput.value = todayDateInput();
    document.getElementById("create-announcement-published").checked = true;
    document.getElementById("create-announcement-error").hidden = true;
    document.getElementById("create-announcement-dialog")?.showModal();
  });

  document.getElementById("announcements-tbody")?.addEventListener("click", (e) => {
    const editBtn = e.target.closest("[data-edit-announcement]");
    if (editBtn) {
      openAnnouncementEditor(editBtn.dataset.editAnnouncement);
      return;
    }

    const deleteBtn = e.target.closest("[data-delete-announcement]");
    if (deleteBtn) {
      deleteAnnouncement(deleteBtn.dataset.deleteAnnouncement, { api, escapeHtml }).catch((err) =>
        alert(err.message)
      );
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
        }),
      });
      document.getElementById("create-announcement-dialog")?.close();
      await loadAnnouncements(api);
      renderAnnouncements(document.getElementById("announcement-search")?.value ?? "", escapeHtml);
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
        }),
      });
      document.getElementById("edit-announcement-dialog")?.close();
      await loadAnnouncements(api);
      renderAnnouncements(document.getElementById("announcement-search")?.value ?? "", escapeHtml);
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.hidden = false;
    }
  });
}

/** お知らせ削除 */
async function deleteAnnouncement(id, { api, escapeHtml }) {
  const item = announcements.find((a) => a.id === id);
  if (!item) return;
  if (!confirm(`お知らせ「${item.body}」を削除しますか？`)) return;

  await api(`/api/admin/announcements/${encodeURIComponent(id)}`, { method: "DELETE" });
  await loadAnnouncements(api);
  renderAnnouncements(document.getElementById("announcement-search")?.value ?? "", escapeHtml);
}
