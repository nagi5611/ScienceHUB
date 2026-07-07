/**
 * シフト管理 — 3dprinterman 管理画面シフト管理表を参考にした実装
 */

import {
  SHIFT_COLORS,
  shiftColorStyle,
  isValidColorIndex,
} from "./lib/shift-colors.js";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
const MOBILE_SHIFT_MQ = window.matchMedia("(max-width: 768px)");

let currentYear = 2026;
let currentMonth = 7;
let shiftView = "mine";
let currentUserId = "";
/** @type {Array<{ id: string, display_name: string, username: string, color_index: number, is_self: boolean }>} */
let shiftMembers = [];
/** @type {Array<{ user_id: string, date: string }>} */
let shiftAvailability = [];
let selectedMemberId = null;
let openColorMenuMemberId = null;
let isDragging = false;
/** @type {Set<string>} */
let dragTouchedDates = new Set();
let dragStartDate = null;
let loading = false;

/** JST の今日 (YYYY-MM-DD) */
function todayJst() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

/** モバイル表示か */
function isMobileShiftView() {
  return MOBILE_SHIFT_MQ.matches;
}

/** HTML エスケープ */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 月の from/to */
function monthRange(year, month) {
  const from = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const to = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return { from, to };
}

/** トースト表示 */
function showToast(message, isError = false) {
  const toast = document.getElementById("shift-toast");
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  toast.classList.toggle("is-error", isError);
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.hidden = true;
  }, 3000);
}

/** 自分のシフトのみ編集可能か */
function canEditSelectedMember() {
  return (
    shiftView === "mine" &&
    selectedMemberId === currentUserId &&
    Boolean(currentUserId)
  );
}

/** アクセス権を確認 */
async function checkAccess() {
  const response = await fetch("/api/apps/shift-management/access", {
    credentials: "same-origin",
  });

  if (response.status === 401) {
    window.location.href =
      "/login/?next=" + encodeURIComponent("/apps/shift-management/");
    return false;
  }

  if (!response.ok) {
    document.getElementById("access-denied").hidden = false;
    return false;
  }

  document.getElementById("app-main").hidden = false;
  return true;
}

/** シフトデータを読み込む */
async function loadShiftData() {
  if (loading) return;
  loading = true;

  const { from, to } = monthRange(currentYear, currentMonth);

  try {
    const response = await fetch(
      `/api/shift?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
      { credentials: "same-origin" }
    );

    if (response.status === 401) {
      window.location.href =
        "/login/?next=" + encodeURIComponent("/apps/shift-management/");
      return;
    }

    if (!response.ok) {
      showToast("データの取得に失敗しました", true);
      return;
    }

    const data = await response.json();
    currentUserId = data.current_user_id ?? "";
    shiftMembers = data.members ?? [];
    shiftAvailability = data.availability ?? [];

    if (!selectedMemberId) {
      const self = shiftMembers.find((m) => m.is_self);
      selectedMemberId = self?.id ?? shiftMembers[0]?.id ?? null;
    }
    if (selectedMemberId && !shiftMembers.find((m) => m.id === selectedMemberId)) {
      const self = shiftMembers.find((m) => m.is_self);
      selectedMemberId = self?.id ?? shiftMembers[0]?.id ?? null;
    }

    renderMemberToolbar();
    renderCalendar();
    updateViewUi();
  } catch {
    showToast("データの取得に失敗しました", true);
  } finally {
    loading = false;
  }
}

/** 日付別の出勤可能メンバー */
function availabilityByDate() {
  const memberById = Object.fromEntries(shiftMembers.map((m) => [m.id, m]));
  const map = {};

  for (const row of shiftAvailability) {
    if (!map[row.date]) map[row.date] = [];
    const member = memberById[row.user_id];
    if (member) map[row.date].push(member);
  }

  return map;
}

/** 指定メンバーがその日に出勤可能か */
function isMemberAvailable(memberId, dateStr) {
  return shiftAvailability.some(
    (row) => row.user_id === memberId && row.date === dateStr
  );
}

/** ローカルで availability を更新 */
function setLocalAvailability(memberId, dateStr, available) {
  if (available) {
    if (!isMemberAvailable(memberId, dateStr)) {
      shiftAvailability.push({ user_id: memberId, date: dateStr });
    }
  } else {
    shiftAvailability = shiftAvailability.filter(
      (row) => !(row.user_id === memberId && row.date === dateStr)
    );
  }
}

/** メンバーツールバーを描画 */
function renderMemberToolbar() {
  const toolbar = document.getElementById("shift-member-toolbar");
  if (!toolbar) return;

  if (shiftView !== "mine") {
    toolbar.hidden = true;
    return;
  }

  toolbar.hidden = false;

  if (!shiftMembers.length) {
    toolbar.innerHTML =
      '<p class="shift-toolbar-hint">同じグループのメンバーがいません。グループに所属してからシフトを設定してください。</p>';
    return;
  }

  const cardsHtml = shiftMembers
    .map((m) => {
      const selected = m.id === selectedMemberId ? " shift-member-card-active" : "";
      const menuOpen = m.id === openColorMenuMemberId;
      const selfBadge = m.is_self ? '<span class="shift-member-self">自分</span>' : "";

      return `
      <div class="shift-member-card${selected}" data-member-id="${m.id}">
        <button type="button" class="shift-color-card" data-member-id="${m.id}" style="${shiftColorStyle(m.color_index)}" aria-expanded="${menuOpen}" aria-label="${escapeHtml(m.display_name)}の色を変更" ${m.is_self ? "" : "disabled"}></button>
        <button type="button" class="shift-member-select" data-member-id="${m.id}">
          <span class="shift-member-name">${escapeHtml(m.display_name)}${selfBadge}</span>
          <span class="shift-member-sub">@${escapeHtml(m.username)}</span>
        </button>
      </div>`;
    })
    .join("");

  const openMember = shiftMembers.find((m) => m.id === openColorMenuMemberId);
  const colorBarHtml =
    openMember?.is_self
      ? `<div class="shift-color-menu-bar" role="menu" aria-label="${escapeHtml(openMember.display_name)}の色">
        ${SHIFT_COLORS.map(
          (c) =>
            `<button type="button" class="shift-color-menu-item${openMember.color_index === c.index ? " is-current" : ""}" data-color="${c.index}" style="${shiftColorStyle(c.index)}" aria-label="色 ${c.index + 1}"></button>`
        ).join("")}
      </div>`
      : "";

  toolbar.innerHTML = `
    <div class="shift-member-toolbar-track">${cardsHtml}</div>
    ${colorBarHtml}`;

  toolbar.querySelectorAll(".shift-member-select").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedMemberId = btn.dataset.memberId ?? null;
      openColorMenuMemberId = null;
      renderMemberToolbar();
      renderCalendar();
      updateViewUi();
    });
  });

  toolbar.querySelectorAll(".shift-color-card:not(:disabled)").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const memberId = btn.dataset.memberId;
      openColorMenuMemberId = openColorMenuMemberId === memberId ? null : memberId;
      selectedMemberId = memberId;
      renderMemberToolbar();
    });
  });

  toolbar.querySelectorAll(".shift-color-menu-item").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      await handleColorChange(Number(btn.dataset.color));
    });
  });

  requestAnimationFrame(() => {
    toolbar
      .querySelector(".shift-member-card-active")
      ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  });
}

/** 自分のシフト色を更新 */
async function handleColorChange(colorIndex) {
  if (!isValidColorIndex(colorIndex)) return;

  try {
    const response = await fetch("/api/shift", {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ color_index: colorIndex }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      showToast(data.error ?? "色の更新に失敗しました", true);
      return;
    }

    const idx = shiftMembers.findIndex((m) => m.id === currentUserId);
    if (idx >= 0 && data.member) {
      shiftMembers[idx] = { ...shiftMembers[idx], ...data.member };
    }

    openColorMenuMemberId = null;
    renderMemberToolbar();
    renderCalendar();
  } catch {
    showToast("色の更新に失敗しました", true);
  }
}

/** 単日トグル */
async function toggleShiftAvailability(date) {
  try {
    const response = await fetch("/api/shift", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      showToast(data.error ?? "更新に失敗しました", true);
      await loadShiftData();
      return false;
    }

    setLocalAvailability(currentUserId, date, data.available);
    return true;
  } catch {
    showToast("更新に失敗しました", true);
    await loadShiftData();
    return false;
  }
}

/** 一括 ON */
async function bulkSetAvailability(dates) {
  try {
    const response = await fetch("/api/shift", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dates, available: true }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      showToast(data.error ?? "更新に失敗しました", true);
      await loadShiftData();
      return false;
    }

    for (const date of dates) {
      setLocalAvailability(currentUserId, date, true);
    }
    return true;
  } catch {
    showToast("更新に失敗しました", true);
    await loadShiftData();
    return false;
  }
}

/** 今日ボタン更新 */
function updateTodayButton() {
  const dayNum = document.getElementById("today-day-num");
  if (!dayNum) return;
  dayNum.textContent = String(Number(todayJst().split("-")[2]));
}

/** 月チップ描画 */
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
      loadShiftData();
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

/** 曜日ヘッダー描画 */
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

/** 月変更 */
function changeMonth(delta) {
  currentMonth += delta;
  if (currentMonth > 12) {
    currentMonth = 1;
    currentYear++;
  } else if (currentMonth < 1) {
    currentMonth = 12;
    currentYear--;
  }
  loadShiftData();
}

/** 今月へ */
function goToToday() {
  const parts = todayJst().split("-").map(Number);
  currentYear = parts[0];
  currentMonth = parts[1];
  loadShiftData();
}

/** ドラッグ開始 */
function startShiftDrag(dateStr, cell) {
  isDragging = true;
  dragStartDate = dateStr;
  dragTouchedDates = new Set([dateStr]);
  cell.classList.add("shift-day-painting");
}

/** タッチ座標からセルを取得 */
function shiftCellFromTouch(touch) {
  const el = document.elementFromPoint(touch.clientX, touch.clientY);
  return el?.closest?.(".shift-day-editable[data-date]") ?? null;
}

/** ドラッグプレビュー */
function applyDragPreview(cell) {
  cell.classList.add("shift-day-painting");
}

/** ドラッグ確定 */
async function handleShiftMouseUp() {
  if (!isDragging || !canEditSelectedMember()) {
    isDragging = false;
    dragStartDate = null;
    dragTouchedDates = new Set();
    document.querySelectorAll(".shift-day-painting").forEach((el) => {
      el.classList.remove("shift-day-painting");
    });
    return;
  }

  isDragging = false;
  const dates = [...dragTouchedDates];
  dragTouchedDates = new Set();

  document.querySelectorAll(".shift-day-painting").forEach((el) => {
    el.classList.remove("shift-day-painting");
  });

  if (dates.length === 1 && dates[0] === dragStartDate) {
    const ok = await toggleShiftAvailability(dates[0]);
    if (ok) {
      showToast(
        isMemberAvailable(currentUserId, dates[0])
          ? "出勤可能に設定しました"
          : "出勤可能を解除しました"
      );
    }
    renderCalendar();
  } else if (dates.length > 0) {
    const ok = await bulkSetAvailability(dates);
    if (ok) {
      showToast(`${dates.length}日を出勤可能に設定しました`);
    }
    renderCalendar();
  }

  dragStartDate = null;
}

/** 日セル生成 */
function createDayCell(dayNum, otherMonth, byDate, todayStr, dateStr) {
  const cell = document.createElement("div");
  cell.className = "calendar-day shift-day";
  if (otherMonth) cell.classList.add("other-month");
  if (dateStr === todayStr) cell.classList.add("today");

  if (shiftView === "others" && dateStr && !otherMonth) {
    const count = (byDate[dateStr] ?? []).length;
    cell.classList.add(count > 0 ? "shift-covered" : "shift-empty");
  }

  const num = document.createElement("div");
  num.className = "calendar-day-number";
  num.textContent = dayNum;
  cell.appendChild(num);

  if (dateStr && !otherMonth) {
    cell.dataset.date = dateStr;
    const membersOnDay = byDate[dateStr] ?? [];

    if (membersOnDay.length) {
      const chips = document.createElement("div");
      chips.className = "shift-day-chips";

      for (const m of membersOnDay) {
        const chip = document.createElement("span");
        chip.className = "shift-day-chip";
        if (isMobileShiftView()) chip.classList.add("shift-day-chip-compact");
        chip.style.cssText = shiftColorStyle(m.color_index);
        chip.textContent = isMobileShiftView()
          ? m.display_name.slice(0, 1)
          : m.display_name;
        chip.title = m.display_name;
        chips.appendChild(chip);
      }

      cell.appendChild(chips);
    }

    if (canEditSelectedMember()) {
      cell.classList.add("shift-day-editable");
      cell.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        startShiftDrag(dateStr, cell);
      });
      cell.addEventListener("mouseenter", () => {
        if (!isDragging || dragTouchedDates.has(dateStr)) return;
        dragTouchedDates.add(dateStr);
        applyDragPreview(cell);
      });
      cell.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
          startShiftDrag(dateStr, cell);
        },
        { passive: false }
      );
      cell.addEventListener(
        "touchmove",
        (e) => {
          if (!isDragging) return;
          e.preventDefault();
          for (const touch of e.changedTouches) {
            const touchCell = shiftCellFromTouch(touch);
            if (!touchCell?.dataset.date) continue;
            const touchDate = touchCell.dataset.date;
            if (dragTouchedDates.has(touchDate)) continue;
            dragTouchedDates.add(touchDate);
            applyDragPreview(touchCell);
          }
        },
        { passive: false }
      );
    }
  }

  return cell;
}

/** カレンダー描画 */
function renderCalendar() {
  const monthLabel = `${currentYear}年${currentMonth}月`;
  const label = document.getElementById("calendar-month-label-text");
  if (label) label.textContent = monthLabel;

  updateTodayButton();
  renderMonthChips();
  renderWeekdayHeaders();

  const grid = document.getElementById("calendar-grid");
  if (!grid) return;

  grid.innerHTML = "";

  const byDate = availabilityByDate();
  const firstDay = new Date(currentYear, currentMonth - 1, 1);
  const lastDay = new Date(currentYear, currentMonth, 0).getDate();
  const startWeekday = firstDay.getDay();
  const todayStr = todayJst();

  const prevMonthLast = new Date(currentYear, currentMonth - 1, 0).getDate();
  for (let i = startWeekday - 1; i >= 0; i--) {
    grid.appendChild(createDayCell(prevMonthLast - i, true, byDate, todayStr));
  }

  for (let day = 1; day <= lastDay; day++) {
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    grid.appendChild(createDayCell(day, false, byDate, todayStr, dateStr));
  }

  const totalCells = startWeekday + lastDay;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let day = 1; day <= remaining; day++) {
    grid.appendChild(createDayCell(day, true, byDate, todayStr));
  }
}

/** ビュー別 UI 更新 */
function updateViewUi() {
  const hint = document.getElementById("shift-hint");
  const footnote = document.getElementById("shift-footnote");
  const legendEdit = document.getElementById("legend-edit");
  const legendCovered = document.getElementById("legend-covered");
  const legendEmpty = document.getElementById("legend-empty");

  if (shiftView === "mine") {
    if (hint) {
      hint.textContent = canEditSelectedMember()
        ? "自分を選択した状態で、カレンダーをクリックまたはドラッグして出勤可能日を設定します。"
        : "他のメンバーの出勤可能日を確認できます。編集するには「自分」を選択してください。";
    }
    if (footnote) {
      footnote.hidden = !canEditSelectedMember();
      footnote.textContent =
        "クリックで ON/OFF、ドラッグでまとめて ON。色カードから自分の表示色を変更できます。";
    }
    if (legendEdit) legendEdit.hidden = !canEditSelectedMember();
    if (legendCovered) legendCovered.hidden = true;
    if (legendEmpty) legendEmpty.hidden = true;
  } else {
    if (hint) {
      hint.textContent =
        "グループ全体の出勤可能状況を確認できます。緑枠は出勤可能者がいる日、赤枠はいない日です。";
    }
    if (footnote) footnote.hidden = true;
    if (legendEdit) legendEdit.hidden = true;
    if (legendCovered) legendCovered.hidden = false;
    if (legendEmpty) legendEmpty.hidden = false;
  }

  document.querySelectorAll("[data-shift-view]").forEach((btn) => {
    const active = btn.dataset.shiftView === shiftView;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-selected", String(active));
  });
}

/** ビュー切替 */
function setShiftView(view) {
  shiftView = view === "others" ? "others" : "mine";
  openColorMenuMemberId = null;

  if (shiftView === "mine") {
    const self = shiftMembers.find((m) => m.is_self);
    if (self) selectedMemberId = self.id;
  }

  renderMemberToolbar();
  renderCalendar();
  updateViewUi();
}

/** 色メニューを外側クリックで閉じる */
function closeColorMenuOnOutsideClick(e) {
  if (!openColorMenuMemberId) return;
  const toolbar = document.getElementById("shift-member-toolbar");
  if (toolbar?.contains(e.target)) return;
  openColorMenuMemberId = null;
  renderMemberToolbar();
}

/** イベント登録 */
function bindEvents() {
  document.getElementById("prev-month")?.addEventListener("click", () => changeMonth(-1));
  document.getElementById("next-month")?.addEventListener("click", () => changeMonth(1));
  document.getElementById("go-today-btn")?.addEventListener("click", goToToday);
  document.getElementById("calendar-month-label")?.addEventListener("click", () => {
    document.getElementById("calendar-month-chips")?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  });

  document.querySelectorAll("[data-shift-view]").forEach((btn) => {
    btn.addEventListener("click", () => setShiftView(btn.dataset.shiftView ?? "mine"));
  });

  document.addEventListener("mouseup", handleShiftMouseUp);
  document.addEventListener("touchend", handleShiftMouseUp);
  document.addEventListener("touchcancel", handleShiftMouseUp);
  document.addEventListener("click", closeColorMenuOnOutsideClick);

  MOBILE_SHIFT_MQ.addEventListener("change", () => renderCalendar());
}

/** 初期化 */
async function init() {
  const parts = todayJst().split("-").map(Number);
  currentYear = parts[0];
  currentMonth = parts[1];

  const allowed = await checkAccess();
  if (!allowed) return;

  bindEvents();
  await loadShiftData();
}

init();
