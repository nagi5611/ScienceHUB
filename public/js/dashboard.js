/**
 * ScienceHUB — ダッシュボード
 */

import { initAccountMenu } from "./account-menu.js";
import { initDefaultAppMenu } from "./default-app-menu.js";
import { appIconHtml } from "./hub-icons.js";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

let currentYear = 2026;
let currentMonth = 7;
let scheduleScope = "mine";
/** @type {Map<string, object[]>} */
let scheduleByDate = new Map();
let scheduleCanCreate = false;
/** @type {{ id: string, display_name: string, color: string }[]} */
let creatableGroups = [];
/** @type {{ enabled: boolean, all_groups_calendar_name: string }} */
let calendarSync = { enabled: false, all_groups_calendar_name: "自然科学部" };
/** @type {{ id: string, display_name: string, color: string }[]} */
let scheduleLegendGroups = [];
let scheduleLoading = false;
let calendarNavLock = false;
let lastWheelMonthNavAt = 0;
const WHEEL_MONTH_COOLDOWN_MS = 400;
let scheduleFetchedYear = null;
let scheduleFetchedScope = null;
/** @type {Map<string, object>} */
let scheduleEventsById = new Map();
/** @type {object | null} */
let viewingScheduleEvent = null;

/** JST の今日の日付文字列 (YYYY-MM-DD) */
function todayJst() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

/** HTML エスケープ */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 16進色を RGBA に変換 */
function hexToRgba(hex, alpha = 0.22) {
  const h = String(hex).replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = Number.parseInt(full, 16);
  if (Number.isNaN(n)) {
    return `rgba(243, 128, 32, ${alpha})`;
  }
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** 表示用の日付ラベル */
function formatDateLabel(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const weekday = WEEKDAYS[new Date(y, m - 1, d).getDay()];
  return `${y}年${m}月${d}日（${weekday}）`;
}

/** 読み込み中表示 HTML */
function hubLoadingHtml(label = "読み込み中…", variant = "default") {
  const compact = variant === "compact" ? " hub-loading--compact" : "";
  const calendar = variant === "calendar" ? " hub-loading--calendar" : "";
  return `<div class="hub-loading${compact}${calendar}" role="status" aria-live="polite">
    <span class="hub-loading-spinner" aria-hidden="true"></span>
    <span class="hub-loading-label">${escapeHtml(label)}</span>
  </div>`;
}

/** カレンダー読み込み中表示 */
function showCalendarLoading() {
  const grid = document.getElementById("calendar-grid");
  if (!grid) return;
  grid.classList.add("is-loading");
  grid.innerHTML = hubLoadingHtml("スケジュールを読み込み中…", "calendar");
}

/** 本日のタスク読み込み中表示 */
function showTasksLoading() {
  const list = document.getElementById("task-list");
  const dateLabel = document.getElementById("tasks-date-label");
  if (dateLabel) dateLabel.textContent = "読み込み中…";
  if (!list) return;
  list.innerHTML = `<li class="hub-tasks-loading-item">${hubLoadingHtml("本日の予定を読み込み中…", "compact")}</li>`;
}

/** スケジュール取得失敗時の表示 */
function showScheduleLoadError() {
  const grid = document.getElementById("calendar-grid");
  if (grid) {
    grid.classList.add("is-loading");
    grid.innerHTML = `<p class="hub-loading-error">スケジュールの読み込みに失敗しました</p>`;
  }

  const list = document.getElementById("task-list");
  const dateLabel = document.getElementById("tasks-date-label");
  if (dateLabel) {
    dateLabel.textContent = `その日のカレンダー — ${formatDateLabel(todayJst())}`;
  }
  if (list) {
    list.innerHTML = `<li class="hub-tasks-empty">予定の読み込みに失敗しました</li>`;
  }
}

/** お知らせ一覧を描画 */
async function renderAnnouncements() {
  const list = document.getElementById("announcement-list");
  if (!list) return;

  list.innerHTML = `<li class="hub-announcement-item hub-announcement-loading">${hubLoadingHtml("お知らせを読み込み中…", "compact")}</li>`;

  try {
    const response = await fetch("/api/announcements", { credentials: "same-origin" });
    if (response.status === 401) {
      window.location.href = "/login/?next=" + encodeURIComponent("/");
      return;
    }
    const data = await response.json();
    const items = data.announcements ?? [];

    if (items.length === 0) {
      list.innerHTML = `<li class="hub-announcement-item">お知らせはありません</li>`;
      return;
    }

    list.innerHTML = items
      .map((item) => {
        const date = new Date(item.published_at);
        const dateLabel = date.toLocaleDateString("ja-JP", {
          timeZone: "Asia/Tokyo",
          month: "2-digit",
          day: "2-digit",
        });
        return `
      <li class="hub-announcement-item">
        <span class="hub-announcement-date">${escapeHtml(dateLabel)}</span>
        ${escapeHtml(item.body)}
      </li>`;
      })
      .join("");
  } catch {
    list.innerHTML = `<li class="hub-announcement-item">お知らせの読み込みに失敗しました</li>`;
  }
}

/** 本日のスケジュール一覧を描画 */
function renderTodayTasks() {
  const list = document.getElementById("task-list");
  const dateLabel = document.getElementById("tasks-date-label");
  if (!list) return;

  const today = todayJst();
  if (dateLabel) {
    dateLabel.textContent = `その日のカレンダー — ${formatDateLabel(today)}`;
  }

  const events = [...(scheduleByDate.get(today) ?? [])].sort((a, b) => {
    const aAll = a.is_all_day ? 0 : 1;
    const bAll = b.is_all_day ? 0 : 1;
    if (aAll !== bAll) return aAll - bAll;
    return (a.start_time ?? "").localeCompare(b.start_time ?? "");
  });

  if (events.length === 0) {
    list.innerHTML = `<li class="hub-tasks-empty">本日の予定はありません</li>`;
    return;
  }

  list.innerHTML = events
    .map((ev) => {
      const color = ev.group_color ?? "#F38020";
      const time =
        ev.show_details && ev.time_label
          ? ev.time_label
          : ev.show_details
            ? "終日"
            : "予定あり";
      const title = ev.show_details ? ev.title : "予定あり（詳細はメンバー以上）";
      const group = ev.show_details ? ev.group_display_name : "";
      return `
        <li>
          <button
            type="button"
            class="hub-task-item hub-task-item--schedule"
            style="--task-color:${escapeHtml(color)}"
            data-schedule-event-id="${escapeHtml(ev.id)}"
          >
            <span class="hub-task-item-time">${escapeHtml(time)}</span>
            <span class="hub-task-item-main">
              <span class="hub-task-item-title">${escapeHtml(title)}</span>
              ${group ? `<span class="hub-task-item-group">${escapeHtml(group)}</span>` : ""}
            </span>
          </button>
        </li>`;
    })
    .join("");

  list.querySelectorAll("[data-schedule-event-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const event = scheduleEventsById.get(btn.dataset.scheduleEventId);
      if (event) openScheduleDetailModal(event);
    });
  });
}

/** バイト数を表示用に整形 */
function formatBytes(bytes) {
  if (bytes == null) return "—";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

/** 使用率セルの警告クラス */
function storageRatioClass(ratio) {
  if (ratio >= 95) return "hub-storage-ratio is-danger";
  if (ratio >= 80) return "hub-storage-ratio is-warning";
  return "hub-storage-ratio";
}

/** 使用率バーの警告クラス */
function storageBarClass(ratio) {
  if (ratio >= 95) return "is-danger";
  if (ratio >= 80) return "is-warning";
  return "";
}

/** クラウドストレージ使用量表を描画 */
function renderStorageOverview(storage) {
  const section = document.getElementById("hub-storage-section");
  const tbody = document.getElementById("hub-storage-tbody");
  const cards = document.getElementById("hub-storage-cards");
  if (!section || !tbody) return;

  if (!storage?.enabled || !storage.roots?.length) {
    section.hidden = true;
    tbody.innerHTML = "";
    if (cards) cards.innerHTML = "";
    return;
  }

  section.hidden = false;
  tbody.innerHTML = storage.roots
    .map((row) => {
      const storageHref = `/apps/cloud-storage/?path=${encodeURIComponent(row.path)}`;
      return `<tr>
        <th scope="row">${escapeHtml(row.group_label)}</th>
        <td><a href="${escapeHtml(storageHref)}" class="hub-storage-path">${escapeHtml(row.path)}</a></td>
        <td class="hub-storage-num">${formatBytes(row.quota_bytes)}</td>
        <td class="hub-storage-num">${formatBytes(row.used_bytes)}</td>
        <td class="hub-storage-num">${formatBytes(row.available_bytes)}</td>
        <td class="${storageRatioClass(row.usage_ratio)}">${row.usage_ratio}%</td>
        <td class="hub-storage-num">${formatBytes(row.trash_quota_bytes)}</td>
        <td class="hub-storage-num">${formatBytes(row.trash_used_bytes)}</td>
        <td class="hub-storage-num">${formatBytes(row.trash_available_bytes)}</td>
        <td class="${storageRatioClass(row.trash_usage_ratio)}">${row.trash_usage_ratio}%</td>
      </tr>`;
    })
    .join("");

  if (cards) {
    cards.innerHTML = storage.roots
      .map((row) => {
        const storageHref = `/apps/cloud-storage/?path=${encodeURIComponent(row.path)}`;
        const usageWidth = Math.min(100, Math.max(0, row.usage_ratio));
        const trashWidth = Math.min(100, Math.max(0, row.trash_usage_ratio));
        return `<li class="app-card hub-storage-card">
          <p class="app-card-title"><a href="${escapeHtml(storageHref)}" class="hub-storage-path">${escapeHtml(row.group_label)}</a></p>
          <p class="app-card-meta">${escapeHtml(row.path)}</p>
          <p class="app-card-meta">使用: ${formatBytes(row.used_bytes)} / ${formatBytes(row.quota_bytes)}（${row.usage_ratio}%）</p>
          <div class="app-card-bar" role="presentation"><div class="app-card-bar-fill ${storageBarClass(row.usage_ratio)}" style="width:${usageWidth}%"></div></div>
          <p class="app-card-meta hub-storage-card-trash">ごみ箱: ${formatBytes(row.trash_used_bytes)} / ${formatBytes(row.trash_quota_bytes)}（${row.trash_usage_ratio}%）</p>
          <div class="app-card-bar" role="presentation"><div class="app-card-bar-fill ${storageBarClass(row.trash_usage_ratio)}" style="width:${trashWidth}%"></div></div>
        </li>`;
      })
      .join("");
  }
}

/** ダッシュボード API を取得 */
async function fetchDashboard() {
  const response = await fetch("/api/dashboard", { credentials: "same-origin" });
  if (response.status === 401) {
    window.location.href = "/login/?next=" + encodeURIComponent("/");
    return null;
  }
  if (!response.ok) {
    throw new Error("dashboard fetch failed");
  }
  return response.json();
}

/** ダッシュボード用アプリタイル HTML */
function renderAppTileHtml(app) {
  return `<a href="${escapeHtml(app.href)}" class="hub-app-tile" style="--app-color:${escapeHtml(app.color)}">
    <span class="hub-app-tile-icon" aria-hidden="true">${appIconHtml(app, "hub-icon hub-icon--lg")}</span>
    <span class="hub-app-tile-label">${escapeHtml(app.display_name)}</span>
  </a>`;
}

/** グループセクションを描画（API から取得） */
async function renderGroups(dashboardData) {
  const section = document.getElementById("groups-section");
  if (!section) return;

  section.innerHTML = hubLoadingHtml("アプリを読み込み中…");

  try {
    const data = dashboardData ?? (await fetchDashboard());
    if (!data) return;

    const groups = data.groups ?? [];
    const defaultApps = data.default_apps ?? [];
    const defaultSlugs = new Set(defaultApps.map((app) => app.slug));
    renderStorageOverview(data.storage);

    if (groups.length === 0 && defaultApps.length === 0) {
      section.innerHTML = `<p class="hub-groups-empty">利用可能なアプリがありません。管理者にグループ所属とアプリのアクセス設定を確認してください。</p>`;
      return;
    }

    const defaultSection =
      defaultApps.length > 0
        ? `<div class="hub-group hub-group--default" style="--group-color:var(--cf-orange)">
          <h2 class="hub-group-title">Default App</h2>
          <div class="hub-app-grid">${defaultApps.map(renderAppTileHtml).join("")}</div>
        </div>`
        : "";

    const groupSections = groups
      .map((group) => {
        const apps = group.apps.filter((app) => !defaultSlugs.has(app.slug));
        if (apps.length === 0) return "";

        return `<div class="hub-group" style="--group-color:${escapeHtml(group.color)}">
          <h2 class="hub-group-title">${escapeHtml(group.display_name)}</h2>
          <div class="hub-app-grid">${apps.map(renderAppTileHtml).join("")}</div>
        </div>`;
      })
      .filter(Boolean)
      .join("");

    if (!defaultSection && !groupSections) {
      section.innerHTML = `<p class="hub-groups-empty">利用可能なアプリがありません。管理者にグループ所属とアプリのアクセス設定を確認してください。</p>`;
      return;
    }

    section.innerHTML = defaultSection + groupSections;
  } catch {
    section.innerHTML = `<p class="hub-groups-empty">アプリの読み込みに失敗しました。</p>`;
  }
}

/** API 取得範囲（表示年の1月〜12月） */
function getScheduleFetchRange() {
  return {
    from: `${currentYear}-01-01`,
    to: `${currentYear}-12-31`,
  };
}

/** カレンダー表示範囲の from/to を算出 */
function getCalendarRange() {
  const lastDay = new Date(currentYear, currentMonth, 0).getDate();
  const startWeekday = new Date(currentYear, currentMonth - 1, 1).getDay();

  let fromYear = currentYear;
  let fromMonth = currentMonth;
  let fromDay = 1;

  if (startWeekday > 0) {
    const prevMonthLast = new Date(currentYear, currentMonth - 1, 0).getDate();
    fromDay = prevMonthLast - startWeekday + 1;
    fromMonth = currentMonth - 1;
    if (fromMonth < 1) {
      fromMonth = 12;
      fromYear = currentYear - 1;
    }
  }

  const totalCells = startWeekday + lastDay;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

  let toYear = currentYear;
  let toMonth = currentMonth;
  let toDay = lastDay;

  if (remaining > 0) {
    toDay = remaining;
    toMonth = currentMonth + 1;
    if (toMonth > 12) {
      toMonth = 1;
      toYear = currentYear + 1;
    }
  }

  const from = `${fromYear}-${String(fromMonth).padStart(2, "0")}-${String(fromDay).padStart(2, "0")}`;
  const to = `${toYear}-${String(toMonth).padStart(2, "0")}-${String(toDay).padStart(2, "0")}`;
  return { from, to };
}

/** スケジュールを API から取得 */
async function loadSchedule(force = false) {
  if (scheduleLoading) return;

  const { from, to } = getScheduleFetchRange();
  if (
    !force &&
    scheduleFetchedYear === currentYear &&
    scheduleFetchedScope === scheduleScope &&
    scheduleByDate.size > 0
  ) {
    renderCalendar();
    renderTodayTasks();
    return;
  }

  scheduleLoading = true;
  showCalendarLoading();
  showTasksLoading();

  try {
    const response = await fetch(
      `/api/schedule?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&scope=${scheduleScope}`,
      { credentials: "same-origin" }
    );
    if (response.status === 401) {
      window.location.href = "/login/?next=" + encodeURIComponent("/");
      return;
    }
    if (!response.ok) {
      showScheduleLoadError();
      return;
    }

    const data = await response.json();
    scheduleCanCreate = Boolean(data.can_create);
    creatableGroups = data.creatable_groups ?? [];
    calendarSync = data.calendar_sync ?? calendarSync;
    scheduleLegendGroups = data.legend_groups ?? [];

    scheduleByDate = new Map();
    scheduleEventsById = new Map();
    for (const event of data.events ?? []) {
      scheduleEventsById.set(event.id, event);
      const list = scheduleByDate.get(event.event_date) ?? [];
      list.push(event);
      scheduleByDate.set(event.event_date, list);
    }

    scheduleFetchedYear = currentYear;
    scheduleFetchedScope = scheduleScope;
    renderCalendar();
    renderScheduleLegend();
    renderTodayTasks();
  } catch {
    showScheduleLoadError();
  } finally {
    scheduleLoading = false;
  }
}

/** 今日ボタンの日付を更新 */
function updateTodayButton() {
  const dayNum = document.getElementById("today-day-num");
  if (!dayNum) return;
  dayNum.textContent = String(Number(todayJst().split("-")[2]));
}

/** 年セレクトを初期化 */
function initCalendarPeriodControls() {
  const yearSelect = document.getElementById("calendar-year-select");
  if (!yearSelect || yearSelect.dataset.bound === "1") return;

  yearSelect.dataset.bound = "1";

  const todayYear = Number(todayJst().split("-")[0]);
  yearSelect.innerHTML = "";
  for (let year = todayYear - 3; year <= todayYear + 3; year++) {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = `${year}年`;
    yearSelect.appendChild(option);
  }

  yearSelect.addEventListener("change", () => {
    const year = Number(yearSelect.value);
    if (!year || year === currentYear) return;
    currentYear = year;
    scheduleFetchedYear = null;
    loadSchedule();
  });
}

/** 年セレクトを現在表示に同期 */
function syncCalendarPeriodControls() {
  const yearSelect = document.getElementById("calendar-year-select");
  if (!yearSelect) return;

  if (![...yearSelect.options].some((opt) => opt.value === String(currentYear))) {
    const option = document.createElement("option");
    option.value = String(currentYear);
    option.textContent = `${currentYear}年`;
    yearSelect.appendChild(option);
  }

  yearSelect.value = String(currentYear);
}

/** グループ色の凡例を描画 */
function renderScheduleLegend() {
  const container = document.getElementById("schedule-group-legend");
  if (!container) return;

  if (scheduleLegendGroups.length === 0) {
    container.hidden = true;
    container.innerHTML = "";
    return;
  }

  container.hidden = false;
  container.innerHTML = scheduleLegendGroups
    .map(
      (group) =>
        `<span class="hub-schedule-legend-item">
          <span class="hub-schedule-legend-dot" style="background:${escapeHtml(group.color)}" aria-hidden="true"></span>
          <span class="hub-schedule-legend-name">${escapeHtml(group.display_name)}</span>
        </span>`
    )
    .join("");
}

/** 月チップを描画 */
function renderMonthChips() {
  const container = document.getElementById("calendar-month-chips");
  if (!container) return;

  container.innerHTML = "";
  for (let month = 1; month <= 12; month++) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "calendar-month-chip";
    chip.setAttribute("role", "tab");
    chip.setAttribute("aria-selected", month === currentMonth ? "true" : "false");
    if (month === currentMonth) chip.classList.add("active");
    chip.textContent = `${month}月`;
    chip.addEventListener("click", () => {
      if (currentMonth === month) return;
      currentMonth = month;
      loadSchedule();
    });
    container.appendChild(chip);
  }

  requestAnimationFrame(() => {
    container.querySelector(".calendar-month-chip.active")?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  });
}

/** 曜日ヘッダーを描画 */
function renderWeekdayHeaders() {
  const row = document.getElementById("calendar-weekdays-row");
  if (!row) return;

  row.innerHTML = "";
  WEEKDAYS.forEach((day) => {
    const el = document.createElement("div");
    el.className = "calendar-weekday";
    el.textContent = day;
    row.appendChild(el);
  });
}

/** CSS トランジション完了を待つ */
function waitForTransition(el, ms = 320) {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.removeEventListener("transitionend", onEnd);
      resolve();
    };
    const onEnd = (e) => {
      if (e.target !== el) return;
      finish();
    };
    el.addEventListener("transitionend", onEnd);
    setTimeout(finish, ms);
  });
}

/** スライドアニメーション付きで月を移動 */
async function navigateMonthWithSlide(delta) {
  if (calendarNavLock || scheduleLoading) return;

  const grid = document.getElementById("calendar-grid");
  if (!grid || grid.classList.contains("is-loading")) {
    changeMonth(delta);
    return;
  }

  calendarNavLock = true;
  const exitClass = delta > 0 ? "is-sliding-out-next" : "is-sliding-out-prev";
  const enterClass = delta > 0 ? "is-sliding-in-from-next" : "is-sliding-in-from-prev";

  try {
    grid.classList.add(exitClass);
    await waitForTransition(grid);

    grid.classList.remove(exitClass);
    grid.classList.add(enterClass);
    await changeMonth(delta);

    if (grid.classList.contains("is-loading")) {
      grid.classList.remove(enterClass);
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        grid.classList.remove(enterClass);
      });
    });
    await waitForTransition(grid);
  } finally {
    calendarNavLock = false;
    lastWheelMonthNavAt = Date.now();
  }
}

/** カレンダー上のホイールで月を移動 */
function initCalendarWheelNavigation() {
  const section = document.getElementById("calendar-section");
  if (!section || section.dataset.wheelBound === "1") return;
  section.dataset.wheelBound = "1";

  section.addEventListener(
    "wheel",
    (e) => {
      if (e.target.closest(".calendar-month-chips, .calendar-nav-row")) return;
      if (
        document.querySelector(
          ".hub-profile-modal.is-open, #schedule-modal.is-open, #schedule-detail-modal.is-open, #schedule-subscribe-modal.is-open"
        )
      ) {
        return;
      }

      const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(raw) < 15) return;

      e.preventDefault();

      if (Date.now() - lastWheelMonthNavAt < WHEEL_MONTH_COOLDOWN_MS) return;
      if (calendarNavLock || scheduleLoading) return;

      const delta = raw > 0 ? 1 : -1;
      navigateMonthWithSlide(delta).catch(() => {
        calendarNavLock = false;
        changeMonth(delta);
      });
    },
    { passive: false }
  );
}

/** 月を変更 */
function changeMonth(delta) {
  currentMonth += delta;
  if (currentMonth > 12) {
    currentMonth = 1;
    currentYear++;
  } else if (currentMonth < 1) {
    currentMonth = 12;
    currentYear--;
  }
  return loadSchedule();
}

/** 今月へジャンプ */
function goToToday() {
  const parts = todayJst().split("-").map(Number);
  currentYear = parts[0];
  currentMonth = parts[1];
  loadSchedule();
}

/** グループ選択の色ドットを更新 */
function updateScheduleGroupDot() {
  const select = document.getElementById("schedule-event-group");
  const dot = document.getElementById("schedule-group-dot");
  if (!select || !dot) return;

  const group = creatableGroups.find((g) => g.id === select.value);
  const color = group?.color ?? "#F38020";
  dot.style.background = color;
}

/** 説明から ScienceHUB / Google 自動付与行を除去 */
function stripAutoDescriptionLines(description) {
  if (!description?.trim()) return "";
  return description
    .split("\n\n")
    .filter(
      (line) =>
        !line.startsWith("グループ: ") &&
        !line.startsWith("ScienceHUB 予定 ID: ")
    )
    .join("\n\n")
    .trim();
}

/** Google カレンダー同期の説明を更新 */
function updateScheduleGcalNote(editSource = "hub") {
  const note = document.getElementById("schedule-gcal-note");
  const text = document.getElementById("schedule-gcal-note-text");
  const select = document.getElementById("schedule-event-group");
  if (!note || !text) return;

  if (editSource === "google") {
    text.textContent =
      "変更は Google カレンダーに反映されます（タイムゾーンは Asia/Tokyo）。複数日にまたがる終日予定は、変更・削除がイベント全体に適用されます。";
    note.hidden = false;
    return;
  }

  if (!calendarSync.enabled || !select) {
    note.hidden = true;
    return;
  }

  const groupName =
    creatableGroups.find((g) => g.id === select.value)?.display_name ?? "グループ";

  text.textContent = `保存後、Google カレンダー「${calendarSync.all_groups_calendar_name}」と「${groupName}」に同期されます。`;
  note.hidden = false;
}

/** 終日トグルに応じて時刻入力を表示 */
function syncScheduleAllDayUi() {
  const allDay = document.getElementById("schedule-all-day");
  const timeRow = document.getElementById("schedule-time-row");
  if (!allDay || !timeRow) return;
  timeRow.hidden = allDay.checked;
}

/** 説明の文字数を更新 */
function updateScheduleDescCount() {
  const textarea = document.getElementById("schedule-event-description");
  const counter = document.getElementById("schedule-desc-count");
  if (!textarea || !counter) return;
  counter.textContent = String(textarea.value.length);
}

/** トースト通知 */
function showScheduleToast(title, warnings = []) {
  const toast = document.createElement("div");
  toast.className = "hub-schedule-toast";
  const warnHtml =
    warnings.length > 0
      ? `<p class="hub-schedule-toast-warn">${warnings.map(escapeHtml).join("<br>")}</p>`
      : "";
  toast.innerHTML = `<p><strong>${escapeHtml(title)}</strong></p>${warnHtml}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 6000);
}

/** 予定フォームのモードを設定 */
function setScheduleFormMode(mode) {
  const kicker = document.getElementById("schedule-modal-kicker");
  const title = document.getElementById("schedule-modal-title");
  const saveBtn = document.getElementById("schedule-modal-save");
  const groupSelect = document.getElementById("schedule-event-group");
  const editIdInput = document.getElementById("schedule-edit-event-id");
  const editSourceInput = document.getElementById("schedule-edit-source");
  const gcalIdInput = document.getElementById("schedule-google-calendar-id");
  const gEventIdInput = document.getElementById("schedule-google-event-id");

  if (mode === "edit") {
    if (kicker) kicker.textContent = "予定を編集";
    if (title) title.textContent = "予定を編集";
    if (saveBtn) saveBtn.textContent = "変更を保存";
    if (groupSelect) groupSelect.disabled = true;
  } else {
    if (kicker) kicker.textContent = "新しい予定";
    if (title) title.textContent = "予定を追加";
    if (saveBtn) saveBtn.textContent = "予定を追加";
    if (groupSelect) groupSelect.disabled = false;
    if (editIdInput) editIdInput.value = "";
    if (editSourceInput) editSourceInput.value = "hub";
    if (gcalIdInput) gcalIdInput.value = "";
    if (gEventIdInput) gEventIdInput.value = "";
  }
}

/** 予定追加モーダルを開く */
function openScheduleModal(dateStr) {
  if (!scheduleCanCreate || creatableGroups.length === 0) return;

  const modal = document.getElementById("schedule-modal");
  const dateInput = document.getElementById("schedule-event-date");
  const dateLabel = document.getElementById("schedule-modal-date-label");
  const groupSelect = document.getElementById("schedule-event-group");
  const titleInput = document.getElementById("schedule-event-title");
  const descInput = document.getElementById("schedule-event-description");
  const allDayInput = document.getElementById("schedule-all-day");
  const startInput = document.getElementById("schedule-start-time");
  const endInput = document.getElementById("schedule-end-time");
  const alert = document.getElementById("schedule-modal-alert");

  if (!modal || !dateInput || !groupSelect) return;

  setScheduleFormMode("create");
  dateInput.value = dateStr;
  if (dateLabel) dateLabel.textContent = formatDateLabel(dateStr);
  if (titleInput) titleInput.value = "";
  if (descInput) descInput.value = "";
  if (allDayInput) allDayInput.checked = true;
  if (startInput) startInput.value = "09:00";
  if (endInput) endInput.value = "10:00";
  if (alert) alert.innerHTML = "";

  groupSelect.innerHTML = creatableGroups
    .map(
      (g) =>
        `<option value="${escapeHtml(g.id)}">${escapeHtml(g.display_name)}</option>`
    )
    .join("");

  syncScheduleAllDayUi();
  updateScheduleGroupDot();
  updateScheduleGcalNote();
  updateScheduleDescCount();

  modal.setAttribute("aria-hidden", "false");
  modal.classList.add("is-open");
  titleInput?.focus();
}

/** 予定編集モーダルを開く */
function openScheduleEditModal(ev) {
  if (!ev?.can_manage) return;

  closeScheduleDetailModal();

  const modal = document.getElementById("schedule-modal");
  const editIdInput = document.getElementById("schedule-edit-event-id");
  const editSourceInput = document.getElementById("schedule-edit-source");
  const gcalIdInput = document.getElementById("schedule-google-calendar-id");
  const gEventIdInput = document.getElementById("schedule-google-event-id");
  const dateInput = document.getElementById("schedule-event-date");
  const dateLabel = document.getElementById("schedule-modal-date-label");
  const groupSelect = document.getElementById("schedule-event-group");
  const titleInput = document.getElementById("schedule-event-title");
  const descInput = document.getElementById("schedule-event-description");
  const allDayInput = document.getElementById("schedule-all-day");
  const startInput = document.getElementById("schedule-start-time");
  const endInput = document.getElementById("schedule-end-time");
  const alert = document.getElementById("schedule-modal-alert");

  if (!modal || !editIdInput || !dateInput || !groupSelect) return;

  const isGoogle = ev.source === "google";

  setScheduleFormMode("edit");
  editIdInput.value = isGoogle ? "" : ev.id;
  if (editSourceInput) editSourceInput.value = isGoogle ? "google" : "hub";
  if (gcalIdInput) gcalIdInput.value = isGoogle ? (ev.google_calendar_id ?? "") : "";
  if (gEventIdInput) gEventIdInput.value = isGoogle ? (ev.google_event_id ?? "") : "";
  dateInput.value = ev.event_date;
  if (dateLabel) dateLabel.textContent = formatDateLabel(ev.event_date);
  if (titleInput) titleInput.value = ev.title ?? "";
  if (descInput) {
    descInput.value = isGoogle
      ? stripAutoDescriptionLines(ev.description)
      : (ev.description ?? "");
  }
  if (allDayInput) allDayInput.checked = Boolean(ev.is_all_day);
  if (startInput) startInput.value = ev.start_time ?? "09:00";
  if (endInput) endInput.value = ev.end_time ?? "10:00";
  if (alert) alert.innerHTML = "";

  groupSelect.innerHTML = `<option value="${escapeHtml(ev.group_id)}">${escapeHtml(ev.group_display_name)}</option>`;
  groupSelect.value = ev.group_id;

  syncScheduleAllDayUi();
  updateScheduleGroupDot();
  updateScheduleGcalNote(isGoogle ? "google" : "hub");
  updateScheduleDescCount();

  modal.setAttribute("aria-hidden", "false");
  modal.classList.add("is-open");
  titleInput?.focus();
}

/** 予定追加モーダルを閉じる */
function closeScheduleModal() {
  const modal = document.getElementById("schedule-modal");
  if (!modal) return;
  modal.setAttribute("aria-hidden", "true");
  modal.classList.remove("is-open");
  setScheduleFormMode("create");
}

/** 予定詳細モーダルを開く */
function openScheduleDetailModal(ev) {
  viewingScheduleEvent = ev;
  const modal = document.getElementById("schedule-detail-modal");
  const title = document.getElementById("schedule-detail-title");
  const dateLabel = document.getElementById("schedule-detail-date-label");
  const body = document.getElementById("schedule-detail-body");
  const editBtn = document.getElementById("schedule-detail-edit");
  const deleteBtn = document.getElementById("schedule-detail-delete");
  const alert = document.getElementById("schedule-detail-alert");

  if (!modal || !body) return;
  if (alert) alert.innerHTML = "";

  const color = ev.group_color ?? "#F38020";
  if (title) {
    title.textContent = ev.show_details ? ev.title : "予定あり";
  }
  if (dateLabel) {
    dateLabel.textContent = formatDateLabel(ev.event_date);
  }

  if (ev.show_details) {
    const timeText = ev.time_label ?? "終日";
    const desc = ev.description?.trim();
  body.innerHTML = `
      <div class="hub-schedule-detail-card" style="--detail-color:${escapeHtml(color)}">
        <div class="hub-schedule-detail-row">
          <span class="hub-schedule-detail-label">グループ</span>
          <span class="hub-schedule-detail-value">
            <span class="hub-schedule-detail-dot" aria-hidden="true"></span>
            ${escapeHtml(ev.group_display_name)}
          </span>
        </div>
        <div class="hub-schedule-detail-row">
          <span class="hub-schedule-detail-label">日時</span>
          <span class="hub-schedule-detail-value">${escapeHtml(timeText)}</span>
        </div>
        ${
          desc
            ? `<div class="hub-schedule-detail-row hub-schedule-detail-row--stack">
                <span class="hub-schedule-detail-label">説明</span>
                <p class="hub-schedule-detail-description">${escapeHtml(desc)}</p>
              </div>`
            : ""
        }
        ${
          ev.source === "google" && ev.can_manage
            ? `<p class="hub-schedule-detail-note">${
                ev.google_whole_event
                  ? "複数日にまたがる Google カレンダーの予定です。編集・削除はイベント全体に適用されます。"
                  : "Google カレンダーの予定です。ここから編集すると Google カレンダーにも反映されます。"
              }</p>`
            : ""
        }
      </div>`;
  } else {
    body.innerHTML = `
      <div class="hub-schedule-detail-card hub-schedule-detail-card--restricted">
        <p class="hub-schedule-detail-restricted">この予定の詳細を表示する権限がありません（メンバー以上が必要です）。</p>
      </div>`;
  }

  const canManage = Boolean(ev.can_manage);
  if (editBtn) editBtn.hidden = !canManage;
  if (deleteBtn) deleteBtn.hidden = !canManage;

  modal.setAttribute("aria-hidden", "false");
  modal.classList.add("is-open");
}

/** 予定詳細モーダルを閉じる */
function closeScheduleDetailModal() {
  const modal = document.getElementById("schedule-detail-modal");
  if (!modal) return;
  modal.setAttribute("aria-hidden", "true");
  modal.classList.remove("is-open");
  viewingScheduleEvent = null;
}

/** 予定を削除 */
async function deleteViewingScheduleEvent() {
  const ev = viewingScheduleEvent;
  if (!ev?.can_manage) return;

  const wholeNote =
    ev.source === "google" && ev.google_whole_event
      ? "\n（複数日にまたがる予定のため、Google カレンダー上のイベント全体が削除されます）"
      : "";
  if (!confirm(`「${ev.title}」を削除しますか？${wholeNote}`)) return;

  const deleteBtn = document.getElementById("schedule-detail-delete");
  if (deleteBtn) deleteBtn.disabled = true;

  try {
    const isGoogle = ev.source === "google";
    const response = await fetch(
      isGoogle ? "/api/schedule/google" : `/api/schedule/${encodeURIComponent(ev.id)}`,
      {
        method: "DELETE",
        credentials: "same-origin",
        headers: isGoogle ? { "Content-Type": "application/json" } : undefined,
        body: isGoogle
          ? JSON.stringify({
              calendar_id: ev.google_calendar_id,
              google_event_id: ev.google_event_id,
            })
          : undefined,
      }
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      alert(data.error ?? "削除に失敗しました");
      return;
    }

    closeScheduleDetailModal();
    scheduleFetchedYear = null;
    await loadSchedule(true);
    showScheduleToast("予定を削除しました", data.sync_warnings ?? []);
  } catch {
    alert("削除に失敗しました");
  } finally {
    if (deleteBtn) deleteBtn.disabled = false;
  }
}

/** 予定を保存（追加・編集） */
async function submitScheduleEvent(event) {
  event.preventDefault();

  const titleInput = document.getElementById("schedule-event-title");
  const descInput = document.getElementById("schedule-event-description");
  const groupSelect = document.getElementById("schedule-event-group");
  const dateInput = document.getElementById("schedule-event-date");
  const allDayInput = document.getElementById("schedule-all-day");
  const startInput = document.getElementById("schedule-start-time");
  const endInput = document.getElementById("schedule-end-time");
  const alert = document.getElementById("schedule-modal-alert");
  const saveBtn = document.getElementById("schedule-modal-save");
  const editIdInput = document.getElementById("schedule-edit-event-id");
  const editSourceInput = document.getElementById("schedule-edit-source");
  const gcalIdInput = document.getElementById("schedule-google-calendar-id");
  const gEventIdInput = document.getElementById("schedule-google-event-id");

  if (!titleInput || !groupSelect || !dateInput || !saveBtn || !allDayInput) return;

  const title = titleInput.value.trim();
  const group_id = groupSelect.value;
  const event_date = dateInput.value;
  const is_all_day = allDayInput.checked;
  const editId = editIdInput?.value?.trim() ?? "";
  const editSource = editSourceInput?.value ?? "hub";
  const isGoogleEdit = editSource === "google";

  if (!title || !group_id || !event_date) return;

  const payload = {
    title,
    description: descInput?.value?.trim() || undefined,
    event_date,
    is_all_day,
  };

  if (!is_all_day) {
    payload.start_time = startInput?.value ?? "";
    payload.end_time = endInput?.value ?? "";
  }

  if (!isGoogleEdit && !editId) {
    payload.group_id = group_id;
  }

  if (isGoogleEdit) {
    payload.calendar_id = gcalIdInput?.value?.trim() ?? "";
    payload.google_event_id = gEventIdInput?.value?.trim() ?? "";
  }

  saveBtn.disabled = true;
  if (alert) alert.innerHTML = "";

  try {
    const response = await fetch(
      isGoogleEdit
        ? "/api/schedule/google"
        : editId
          ? `/api/schedule/${encodeURIComponent(editId)}`
          : "/api/schedule",
      {
        method: isGoogleEdit || editId ? "PATCH" : "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (alert) {
        alert.innerHTML = `<p class="hub-profile-alert hub-profile-alert--error">${escapeHtml(data.error ?? "保存に失敗しました")}</p>`;
      }
      return;
    }

    closeScheduleModal();
    scheduleFetchedYear = null;
    await loadSchedule(true);

    const warnings = data.sync_warnings ?? [];
    showScheduleToast(
      isGoogleEdit || editId ? "予定を更新しました" : "予定を追加しました",
      warnings
    );
  } catch {
    if (alert) {
      alert.innerHTML = `<p class="hub-profile-alert hub-profile-alert--error">保存に失敗しました</p>`;
    }
  } finally {
    saveBtn.disabled = false;
  }
}

/** カレンダーの日セルを生成 */
function createDayCell(dayNum, otherMonth, todayStr, dateStr) {
  const cell = document.createElement("button");
  cell.type = "button";
  cell.className = "calendar-day";
  if (otherMonth) cell.classList.add("other-month");
  if (dateStr === todayStr) cell.classList.add("today");
  if (dateStr && !otherMonth && scheduleCanCreate) {
    cell.classList.add("calendar-day--addable");
    cell.setAttribute("aria-label", `${dateStr} に予定を追加`);
  } else if (dateStr) {
    cell.setAttribute("aria-label", dateStr);
  }

  const num = document.createElement("div");
  num.className = "calendar-day-number";
  num.textContent = dayNum;
  cell.appendChild(num);

  const events = dateStr ? scheduleByDate.get(dateStr) : null;
  if (events?.length) {
    const slotsWrap = document.createElement("div");
    slotsWrap.className = "calendar-slots";

    for (const ev of events) {
      const slot = document.createElement("button");
      slot.type = "button";
      slot.className = "calendar-slot calendar-slot--group";
      const color = ev.group_color ?? "#F38020";
      slot.style.setProperty("--event-color", color);
      slot.style.background = hexToRgba(color, 0.22);
      slot.style.color = color;

      if (ev.show_details) {
        const timePrefix =
          ev.time_label && ev.time_label !== "終日" ? `${ev.time_label} ` : "";
        const tip = [ev.time_label, ev.title, ev.group_display_name, ev.description]
          .filter(Boolean)
          .join(" — ");
        slot.title = tip;
        slot.setAttribute("aria-label", tip);
        slot.innerHTML = `<span class="calendar-slot-time">${escapeHtml(ev.time_label && ev.time_label !== "終日" ? ev.time_label : "")}</span><span class="calendar-slot-compact-label">${escapeHtml(ev.title)}</span><span class="calendar-slot-group-name">${escapeHtml(ev.group_display_name)}</span>`;
        if (!timePrefix) {
          slot.querySelector(".calendar-slot-time")?.remove();
        }
      } else {
        slot.title = "予定あり（クリックで詳細）";
        slot.setAttribute("aria-label", "予定あり");
        slot.classList.add("calendar-slot--restricted");
        slot.innerHTML = `<span class="calendar-slot-compact-label" aria-hidden="true"> </span>`;
      }

      slot.addEventListener("click", (e) => {
        e.stopPropagation();
        openScheduleDetailModal(ev);
      });
      slotsWrap.appendChild(slot);
    }

    cell.appendChild(slotsWrap);
  }

  if (dateStr && !otherMonth && scheduleCanCreate) {
    cell.addEventListener("click", () => openScheduleModal(dateStr));
  }

  return cell;
}

/** カレンダーを描画 */
function renderCalendar() {
  syncCalendarPeriodControls();
  updateTodayButton();
  renderMonthChips();
  renderWeekdayHeaders();

  const grid = document.getElementById("calendar-grid");
  if (!grid) return;

  grid.classList.remove("is-loading");
  grid.innerHTML = "";

  const firstDay = new Date(currentYear, currentMonth - 1, 1);
  const lastDay = new Date(currentYear, currentMonth, 0).getDate();
  const startWeekday = firstDay.getDay();
  const todayStr = todayJst();

  const prevMonthLast = new Date(currentYear, currentMonth - 1, 0).getDate();
  for (let i = startWeekday - 1; i >= 0; i--) {
    grid.appendChild(createDayCell(prevMonthLast - i, true, todayStr));
  }

  for (let day = 1; day <= lastDay; day++) {
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    grid.appendChild(createDayCell(day, false, todayStr, dateStr));
  }

  const totalCells = startWeekday + lastDay;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let day = 1; day <= remaining; day++) {
    grid.appendChild(createDayCell(day, true, todayStr));
  }
}

/** Google カレンダー購読モーダルを開く */
async function openScheduleSubscribeModal() {
  const modal = document.getElementById("schedule-subscribe-modal");
  const body = document.getElementById("schedule-subscribe-body");
  const alert = document.getElementById("schedule-subscribe-alert");
  const openBtn = document.getElementById("schedule-subscribe-open");
  if (!modal || !body || !openBtn) return;

  if (alert) alert.innerHTML = "";
  body.innerHTML = hubLoadingHtml("読み込み中…", "compact");
  openBtn.disabled = true;
  modal.setAttribute("aria-hidden", "false");
  modal.classList.add("is-open");

  try {
    const response = await fetch("/api/schedule/calendars", {
      credentials: "same-origin",
    });
    if (response.status === 401) {
      window.location.href = "/login/?next=" + encodeURIComponent("/");
      return;
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      body.innerHTML = "";
      if (alert) {
        alert.innerHTML = `<p class="hub-profile-alert hub-profile-alert--error">${escapeHtml(data.error ?? "取得に失敗しました")}</p>`;
      }
      return;
    }

    const calendars = data.calendars ?? [];
    if (!data.enabled) {
      body.innerHTML = `<p class="hub-schedule-subscribe-empty">Google カレンダー連携が有効になっていません。</p>`;
      return;
    }
    if (calendars.length === 0) {
      body.innerHTML = `<p class="hub-schedule-subscribe-empty">追加できるカレンダーがありません。グループに所属しているか、管理者にカレンダー ID の設定を確認してください。</p>`;
      return;
    }

    body.innerHTML = `
      <fieldset class="hub-schedule-subscribe-list">
        <legend class="hub-schedule-subscribe-legend">追加するカレンダー</legend>
        ${calendars
          .map(
            (cal, index) => `
          <label class="hub-schedule-subscribe-option">
            <input
              type="radio"
              name="schedule-subscribe-calendar"
              value="${escapeHtml(cal.id)}"
              data-subscribe-url="${escapeHtml(cal.subscribe_url)}"
              ${index === 0 ? "checked" : ""}
            >
            <span class="hub-schedule-subscribe-option-card" style="--cal-color:${escapeHtml(cal.color)}">
              <span class="hub-schedule-subscribe-dot" aria-hidden="true"></span>
              <span class="hub-schedule-subscribe-name">${escapeHtml(cal.display_name)}</span>
            </span>
          </label>`
          )
          .join("")}
      </fieldset>
      <p class="hub-schedule-subscribe-hint">「Google カレンダーで開く」を押すと、Google カレンダーが開き選択したカレンダーを追加できます。</p>`;

    const syncOpenButton = () => {
      const selected = body.querySelector(
        'input[name="schedule-subscribe-calendar"]:checked'
      );
      openBtn.disabled = !selected;
    };

    body.querySelectorAll('input[name="schedule-subscribe-calendar"]').forEach((input) => {
      input.addEventListener("change", syncOpenButton);
    });
    syncOpenButton();
  } catch {
    body.innerHTML = "";
    if (alert) {
      alert.innerHTML = `<p class="hub-profile-alert hub-profile-alert--error">取得に失敗しました</p>`;
    }
  }
}

/** Google カレンダー購読モーダルを閉じる */
function closeScheduleSubscribeModal() {
  const modal = document.getElementById("schedule-subscribe-modal");
  if (!modal) return;
  modal.setAttribute("aria-hidden", "true");
  modal.classList.remove("is-open");
}

/** 選択したカレンダーを Google カレンダーで開く */
function openSelectedGoogleCalendarSubscribe() {
  const selected = document.querySelector(
    'input[name="schedule-subscribe-calendar"]:checked'
  );
  const url = selected?.dataset.subscribeUrl;
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
  closeScheduleSubscribeModal();
}

/** 表示範囲トグルを更新 */
function setScheduleScope(scope) {
  scheduleScope = scope === "all" ? "all" : "mine";
  document.querySelectorAll("[data-schedule-scope]").forEach((btn) => {
    const active = btn.dataset.scheduleScope === scheduleScope;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
  loadSchedule();
}

/** イベントリスナーを登録 */
function bindEvents() {
  document.getElementById("prev-month-mobile")?.addEventListener("click", () => changeMonth(-1));
  document.getElementById("next-month-mobile")?.addEventListener("click", () => changeMonth(1));
  document.getElementById("go-today-btn")?.addEventListener("click", goToToday);
  initCalendarPeriodControls();
  initCalendarWheelNavigation();

  document.querySelectorAll("[data-schedule-scope]").forEach((btn) => {
    btn.addEventListener("click", () => setScheduleScope(btn.dataset.scheduleScope ?? "mine"));
  });

  document.getElementById("schedule-form")?.addEventListener("submit", submitScheduleEvent);
  document.getElementById("schedule-modal-close")?.addEventListener("click", closeScheduleModal);
  document.getElementById("schedule-modal-cancel")?.addEventListener("click", closeScheduleModal);
  document.getElementById("schedule-modal-backdrop")?.addEventListener("click", closeScheduleModal);

  document.getElementById("schedule-all-day")?.addEventListener("change", syncScheduleAllDayUi);
  document.getElementById("schedule-event-group")?.addEventListener("change", () => {
    updateScheduleGroupDot();
    updateScheduleGcalNote();
  });
  document.getElementById("schedule-event-description")?.addEventListener("input", updateScheduleDescCount);

  document.getElementById("schedule-detail-close")?.addEventListener("click", closeScheduleDetailModal);
  document.getElementById("schedule-detail-dismiss")?.addEventListener("click", closeScheduleDetailModal);
  document.getElementById("schedule-detail-backdrop")?.addEventListener("click", closeScheduleDetailModal);
  document.getElementById("schedule-detail-edit")?.addEventListener("click", () => {
    if (viewingScheduleEvent) openScheduleEditModal(viewingScheduleEvent);
  });
  document.getElementById("schedule-detail-delete")?.addEventListener("click", () => {
    deleteViewingScheduleEvent().catch((err) => alert(err.message));
  });

  document.getElementById("schedule-subscribe-btn")?.addEventListener("click", () => {
    openScheduleSubscribeModal().catch(() => alert("カレンダー一覧の取得に失敗しました"));
  });
  document.getElementById("schedule-subscribe-close")?.addEventListener("click", closeScheduleSubscribeModal);
  document.getElementById("schedule-subscribe-cancel")?.addEventListener("click", closeScheduleSubscribeModal);
  document.getElementById("schedule-subscribe-backdrop")?.addEventListener("click", closeScheduleSubscribeModal);
  document.getElementById("schedule-subscribe-open")?.addEventListener("click", openSelectedGoogleCalendarSubscribe);
}

/** 初期化 */
async function init() {
  const parts = todayJst().split("-").map(Number);
  currentYear = parts[0];
  currentMonth = parts[1];

  bindEvents();

  let dashboardData = null;
  try {
    dashboardData = await fetchDashboard();
  } catch {
    dashboardData = null;
  }

  initDefaultAppMenu(dashboardData?.default_apps ?? []);

  await Promise.all([
    renderAnnouncements(),
    renderGroups(dashboardData),
    loadSchedule(),
  ]);

  initAccountMenu();
}

init();
