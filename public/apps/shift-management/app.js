/**
 * シフト管理 — 出勤可能日カレンダー
 */

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

let currentYear = 2026;
let currentMonth = 7;
let shiftView = "mine";
/** @type {Set<string>} */
let myAvailable = new Set();
/** @type {{ id: string, display_name: string, username: string }[]} */
let members = [];
/** @type {Record<string, string[]>} */
let othersAvailability = {};
let selectedMemberId = "";
let loading = false;

/** ドラッグ状態 */
let isDragging = false;
let dragMode = null;
/** @type {Set<string>} */
let dragTouched = new Set();
/** @type {Set<string>} */
let pendingChanges = new Set();
let dragStartCell = null;
let pointerMoved = false;

/** JST の今日 (YYYY-MM-DD) */
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

/** 月の from/to を取得 */
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

    if (!response.ok) return;

    const data = await response.json();
    myAvailable = new Set(data.mine ?? []);
    members = data.members ?? [];
    othersAvailability = data.others ?? {};

    if (!selectedMemberId && members.length > 0) {
      selectedMemberId = members[0].id;
    } else if (selectedMemberId && !members.find((m) => m.id === selectedMemberId)) {
      selectedMemberId = members[0]?.id ?? "";
    }

    updateOthersFilter();
    renderCalendar();
  } catch {
    showToast("データの取得に失敗しました", true);
  } finally {
    loading = false;
  }
}

/** メンバー選択 UI を更新 */
function updateOthersFilter() {
  const filter = document.getElementById("others-filter");
  const select = document.getElementById("others-member-select");
  const legendOthers = document.getElementById("legend-others");
  if (!filter || !select) return;

  if (shiftView === "others") {
    filter.hidden = false;
    if (legendOthers) legendOthers.hidden = false;

    if (members.length === 0) {
      select.innerHTML =
        '<option value="">同じグループのメンバーがいません</option>';
      select.disabled = true;
      return;
    }

    select.disabled = false;
    select.innerHTML = members
      .map(
        (m) =>
          `<option value="${escapeHtml(m.id)}"${m.id === selectedMemberId ? " selected" : ""}>${escapeHtml(m.display_name)}</option>`
      )
      .join("");
  } else {
    filter.hidden = true;
    if (legendOthers) legendOthers.hidden = true;
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

/** 指定日が出勤可能か（自分） */
function isMyAvailable(dateStr) {
  return myAvailable.has(dateStr);
}

/** 指定日が他メンバー出勤可能か */
function isOthersAvailable(dateStr) {
  if (!selectedMemberId) return false;
  const dates = othersAvailability[selectedMemberId] ?? [];
  return dates.includes(dateStr);
}

/** セルに出勤可能状態を反映 */
function applyCellState(cell, dateStr) {
  if (!dateStr) return;

  cell.classList.remove("is-available", "is-others-available");
  const badge = cell.querySelector(".calendar-day-badge");
  if (badge) badge.remove();

  if (shiftView === "mine") {
    if (isMyAvailable(dateStr)) {
      cell.classList.add("is-available");
      const b = document.createElement("span");
      b.className = "calendar-day-badge";
      b.textContent = "出勤可";
      cell.appendChild(b);
    }
  } else if (isOthersAvailable(dateStr)) {
    cell.classList.add("is-others-available");
    const b = document.createElement("span");
    b.className = "calendar-day-badge";
    b.textContent = "出勤可";
    cell.appendChild(b);
  }
}

/** 自分のカレンダーで日付をローカル更新 */
function setLocalAvailability(dateStr, available) {
  if (available) {
    myAvailable.add(dateStr);
  } else {
    myAvailable.delete(dateStr);
  }
}

/** API で一括更新 */
async function syncAvailability(dates, available) {
  if (dates.length === 0) return true;

  try {
    const response = await fetch("/api/shift", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dates, available }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      showToast(data.error ?? "保存に失敗しました", true);
      await loadShiftData();
      return false;
    }
    return true;
  } catch {
    showToast("保存に失敗しました", true);
    await loadShiftData();
    return false;
  }
}

/** 単日トグル（クリック用） */
async function toggleDate(dateStr) {
  const wasAvailable = isMyAvailable(dateStr);
  setLocalAvailability(dateStr, !wasAvailable);

  const cell = document.querySelector(`[data-date="${dateStr}"]`);
  if (cell) applyCellState(cell, dateStr);

  const ok = await syncAvailability([dateStr], !wasAvailable);
  if (!ok) return;

  showToast(wasAvailable ? "出勤可能を解除しました" : "出勤可能に設定しました");
}

/** ドラッグ中のセルにモードを適用 */
function applyDragToCell(cell, dateStr) {
  if (!dragMode || !dateStr || dragTouched.has(dateStr)) return;
  if (cell.classList.contains("other-month")) return;

  const currentlyAvailable = isMyAvailable(dateStr);
  const targetAvailable = dragMode === "add";

  if (currentlyAvailable === targetAvailable) return;

  dragTouched.add(dateStr);
  pendingChanges.add(dateStr);
  setLocalAvailability(dateStr, targetAvailable);
  applyCellState(cell, dateStr);
}

/** ドラッグ終了時に保存 */
async function finishDrag() {
  if (!isDragging) return;

  isDragging = false;
  document.body.classList.remove("shift-dragging");

  const mode = dragMode;
  const dates = [...pendingChanges];

  dragMode = null;
  dragTouched.clear();
  pendingChanges.clear();
  dragStartCell = null;

  if (dates.length === 0) return;

  const available = mode === "add";
  const ok = await syncAvailability(dates, available);
  if (ok) {
    showToast(
      available
        ? `${dates.length}日を出勤可能に設定しました`
        : `${dates.length}日の出勤可能を解除しました`
    );
  }
}

/** 日セル生成 */
function createDayCell(dayNum, otherMonth, todayStr, dateStr) {
  const cell = document.createElement("button");
  cell.type = "button";
  cell.className = "calendar-day";
  if (otherMonth) cell.classList.add("other-month");
  if (dateStr === todayStr) cell.classList.add("today");
  if (dateStr) {
    cell.dataset.date = dateStr;
    cell.setAttribute("aria-label", dateStr);
  }

  const num = document.createElement("div");
  num.className = "calendar-day-number";
  num.textContent = dayNum;
  cell.appendChild(num);

  if (dateStr) {
    applyCellState(cell, dateStr);
  }

  if (shiftView === "mine" && dateStr && !otherMonth) {
    cell.classList.add("calendar-day--editable");

    cell.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      pointerMoved = false;
      isDragging = true;
      dragStartCell = cell;
      dragTouched.clear();
      pendingChanges.clear();

      const available = isMyAvailable(dateStr);
      dragMode = available ? "remove" : "add";
      document.body.classList.add("shift-dragging");
      applyDragToCell(cell, dateStr);
      cell.setPointerCapture(e.pointerId);
    });

    cell.addEventListener("pointerenter", () => {
      if (!isDragging) return;
      pointerMoved = true;
      applyDragToCell(cell, dateStr);
    });

    cell.addEventListener("pointerup", (e) => {
      if (!isDragging) return;
      cell.releasePointerCapture(e.pointerId);

      if (!pointerMoved && dragStartCell === cell) {
        isDragging = false;
        dragMode = null;
        dragTouched.clear();
        pendingChanges.clear();
        document.body.classList.remove("shift-dragging");
        toggleDate(dateStr);
        return;
      }

      finishDrag();
    });

    cell.addEventListener("pointercancel", () => {
      finishDrag();
    });
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

/** ビュー切替 */
function setShiftView(view) {
  shiftView = view === "others" ? "others" : "mine";

  document.querySelectorAll("[data-shift-view]").forEach((btn) => {
    const active = btn.dataset.shiftView === shiftView;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-selected", String(active));
  });

  const hint = document.getElementById("shift-hint");
  if (hint) {
    hint.textContent =
      shiftView === "mine"
        ? "日付をクリックまたはドラッグして出勤可能日を設定できます。出勤可能な日を再度操作すると解除されます。"
        : "同じグループのメンバーの出勤可能日を確認できます。";
  }

  updateOthersFilter();
  renderCalendar();
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

  document.getElementById("others-member-select")?.addEventListener("change", (e) => {
    selectedMemberId = e.target.value;
    renderCalendar();
  });

  document.addEventListener("pointerup", () => {
    if (isDragging) finishDrag();
  });
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
