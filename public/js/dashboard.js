/**
 * ScienceHUB — ダッシュボード
 */

import { initAccountMenu } from "./account-menu.js";
import { appIconHtml } from "./hub-icons.js";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

/** サンプル: 本日のタスク（ページ分割） */
const TASK_PAGES = [
  [
    { label: "シミュレーション結果の整理", color: "pink" },
    { label: "実験ログの更新", color: "blue" },
    { label: "週次ミーティング資料作成", color: "orange" },
  ],
  [
    { label: "3D プリントデータの確認", color: "green" },
    { label: "論文ドラフトのレビュー", color: "pink" },
  ],
];

let currentYear = 2026;
let currentMonth = 7;
let currentTaskPage = 0;
let scheduleScope = "mine";
/** @type {Map<string, object[]>} */
let scheduleByDate = new Map();
let scheduleCanCreate = false;
/** @type {{ id: string, display_name: string, color: string }[]} */
let creatableGroups = [];
/** @type {{ enabled: boolean, all_groups_calendar_name: string }} */
let calendarSync = { enabled: false, all_groups_calendar_name: "自然科学部" };
let scheduleLoading = false;

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

/** お知らせ一覧を描画 */
async function renderAnnouncements() {
  const list = document.getElementById("announcement-list");
  if (!list) return;

  list.innerHTML = `<li class="hub-announcement-item hub-announcement-loading">読み込み中…</li>`;

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

/** タスク一覧を描画 */
function renderTasks() {
  const list = document.getElementById("task-list");
  const dots = document.getElementById("tasks-dots");
  if (!list || !dots) return;

  const tasks = TASK_PAGES[currentTaskPage] ?? [];
  list.innerHTML = tasks
    .map(
      (task) => `
        <li>
          <button type="button" class="hub-task-item hub-task-item--${task.color}">
            ${escapeHtml(task.label)}
          </button>
        </li>`
    )
    .join("");

  dots.innerHTML = TASK_PAGES.map(
    (_, i) => `
      <button
        type="button"
        class="hub-tasks-dot${i === currentTaskPage ? " is-active" : ""}"
        role="tab"
        aria-selected="${i === currentTaskPage}"
        aria-label="タスク ${i + 1} ページ"
        data-page="${i}"
      ></button>`
  ).join("");

  dots.querySelectorAll(".hub-tasks-dot").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentTaskPage = Number(btn.dataset.page);
      renderTasks();
    });
  });
}

/** グループセクションを描画（API から取得） */
async function renderGroups() {
  const section = document.getElementById("groups-section");
  if (!section) return;

  section.innerHTML = `<p class="hub-groups-loading">アプリを読み込み中…</p>`;

  try {
    const response = await fetch("/api/dashboard", { credentials: "same-origin" });
    if (response.status === 401) {
      window.location.href = "/login/?next=" + encodeURIComponent("/");
      return;
    }
    const data = await response.json();
    const groups = data.groups ?? [];

    if (groups.length === 0) {
      section.innerHTML = `<p class="hub-groups-empty">利用可能なアプリがありません。管理者にグループ所属とアプリのアクセス設定を確認してください。</p>`;
      return;
    }

    section.innerHTML = groups
      .map((group) => {
        const tiles = group.apps
          .map(
            (app) => `
          <a href="${escapeHtml(app.href)}" class="hub-app-tile" style="--app-color:${escapeHtml(app.color)}">
            <span class="hub-app-tile-icon" aria-hidden="true">${appIconHtml(app, "hub-icon hub-icon--lg")}</span>
            <span class="hub-app-tile-label">${escapeHtml(app.display_name)}</span>
          </a>`
          )
          .join("");

        return `
        <div class="hub-group" style="--group-color:${escapeHtml(group.color)}">
          <h2 class="hub-group-title">${escapeHtml(group.display_name)}</h2>
          <div class="hub-app-grid">${tiles}</div>
        </div>`;
      })
      .join("");
  } catch {
    section.innerHTML = `<p class="hub-groups-empty">アプリの読み込みに失敗しました。</p>`;
  }
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
async function loadSchedule() {
  if (scheduleLoading) return;
  scheduleLoading = true;

  const { from, to } = getCalendarRange();

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
      return;
    }

    const data = await response.json();
    scheduleCanCreate = Boolean(data.can_create);
    creatableGroups = data.creatable_groups ?? [];
    calendarSync = data.calendar_sync ?? calendarSync;

    scheduleByDate = new Map();
    for (const event of data.events ?? []) {
      const list = scheduleByDate.get(event.event_date) ?? [];
      list.push(event);
      scheduleByDate.set(event.event_date, list);
    }

    renderCalendar();
  } catch {
    // 取得失敗時は既存表示を維持
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
  loadSchedule();
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

/** Google カレンダー同期の説明を更新 */
function updateScheduleGcalNote() {
  const note = document.getElementById("schedule-gcal-note");
  const text = document.getElementById("schedule-gcal-note-text");
  const select = document.getElementById("schedule-event-group");
  if (!note || !text || !select) return;

  if (!calendarSync.enabled) {
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

/** 予定追加モーダルを閉じる */
function closeScheduleModal() {
  const modal = document.getElementById("schedule-modal");
  if (!modal) return;
  modal.setAttribute("aria-hidden", "true");
  modal.classList.remove("is-open");
}

/** 予定を追加 */
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

  if (!titleInput || !groupSelect || !dateInput || !saveBtn || !allDayInput) return;

  const title = titleInput.value.trim();
  const group_id = groupSelect.value;
  const event_date = dateInput.value;
  const is_all_day = allDayInput.checked;

  if (!title || !group_id || !event_date) return;

  const payload = {
    title,
    description: descInput?.value?.trim() || undefined,
    group_id,
    event_date,
    is_all_day,
  };

  if (!is_all_day) {
    payload.start_time = startInput?.value ?? "";
    payload.end_time = endInput?.value ?? "";
  }

  saveBtn.disabled = true;
  if (alert) alert.innerHTML = "";

  try {
    const response = await fetch("/api/schedule", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (alert) {
        alert.innerHTML = `<p class="hub-profile-alert hub-profile-alert--error">${escapeHtml(data.error ?? "追加に失敗しました")}</p>`;
      }
      return;
    }

    closeScheduleModal();
    await loadSchedule();

    const warnings = data.sync_warnings ?? [];
    if (warnings.length > 0) {
      const msg = warnings.map(escapeHtml).join("<br>");
      const toast = document.createElement("div");
      toast.className = "hub-schedule-toast";
      toast.innerHTML = `<p><strong>予定を追加しました</strong></p><p class="hub-schedule-toast-warn">${msg}</p>`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 6000);
    }
  } catch {
    if (alert) {
      alert.innerHTML = `<p class="hub-profile-alert hub-profile-alert--error">追加に失敗しました</p>`;
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
      const slot = document.createElement("span");
      slot.className = "calendar-slot calendar-slot--group";
      const color = ev.group_color ?? "#F38020";
      slot.style.setProperty("--event-color", color);
      slot.style.background = hexToRgba(color, 0.22);
      slot.style.color = color;

      if (ev.show_details) {
        const timePrefix =
          ev.time_label && ev.time_label !== "終日" ? `${ev.time_label} ` : "";
        const label = `${timePrefix}${ev.title}`;
        const tip = [ev.time_label, ev.title, ev.group_display_name, ev.description]
          .filter(Boolean)
          .join(" — ");
        slot.title = tip;
        slot.innerHTML = `<span class="calendar-slot-time">${escapeHtml(ev.time_label && ev.time_label !== "終日" ? ev.time_label : "")}</span><span class="calendar-slot-compact-label">${escapeHtml(ev.title)}</span><span class="calendar-slot-group-name">${escapeHtml(ev.group_display_name)}</span>`;
        if (!timePrefix) {
          slot.querySelector(".calendar-slot-time")?.remove();
        }
      } else {
        slot.title = "予定あり";
        slot.classList.add("calendar-slot--restricted");
        slot.innerHTML = `<span class="calendar-slot-compact-label" aria-hidden="true"> </span>`;
      }

      slot.addEventListener("click", (e) => e.stopPropagation());
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
  const monthLabel = `${currentYear}年${currentMonth}月`;
  const mobileLabel = document.getElementById("calendar-month-label-mobile-text");
  if (mobileLabel) mobileLabel.textContent = monthLabel;

  updateTodayButton();
  renderMonthChips();
  renderWeekdayHeaders();

  const grid = document.getElementById("calendar-grid");
  if (!grid) return;

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
  document.getElementById("calendar-month-label-mobile")?.addEventListener("click", () => {
    document.getElementById("calendar-month-chips")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

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
}

/** 初期化 */
async function init() {
  const parts = todayJst().split("-").map(Number);
  currentYear = parts[0];
  currentMonth = parts[1];

  await renderAnnouncements();
  renderTasks();
  await renderGroups();
  bindEvents();
  await loadSchedule();
  initAccountMenu();
}

init();
