/**
 * プロジェクト管理 — ダッシュボード UI
 * 親子プロジェクト CRUD + 活動可能日ミニカレンダー
 */

const APP_PATH = "/apps/project-management/";
const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

/** @type {string | null} */
let selectedGroupId = null;
/** @type {object | null} */
let dashboard = null;
/** @type {Map<string, 'available' | 'unavailable'>} */
let availabilityMap = new Map();

let currentYear = 2026;
let currentMonth = 7;
let loading = false;

let isDragging = false;
/** @type {'available' | 'unavailable' | null} */
let dragMode = null;
/** @type {Set<string>} */
let dragTouchedDates = new Set();

/** JST の今日 (YYYY-MM-DD) */
function todayJst() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

/** 月の from/to */
function monthRange(year, month) {
  const from = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const to = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return { from, to };
}

/** HTML エスケープ */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** トースト表示 */
function showToast(message, isError = false) {
  const toast = document.getElementById("pm-toast");
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  toast.classList.toggle("is-error", isError);
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.hidden = true;
  }, 3000);
}

/** 日付を表示用に整形 */
function formatDate(dateStr) {
  if (!dateStr) return "";
  const parts = String(dateStr).split("-");
  if (parts.length !== 3) return dateStr;
  return `${Number(parts[1])}/${Number(parts[2])}`;
}

/** 管理者か */
function isAdmin() {
  return Boolean(dashboard?.group?.is_admin);
}

/** 親プロジェクトを ID で探す */
function findParentProject(parentId) {
  return (dashboard?.projects ?? []).find((p) => p.id === parentId) ?? null;
}

/** @type {string | null} */
let selectedParentId = null;

/** @type {string | null} */
let memberTaskAssigneeId = null;

/** @type {string | null} */
let editingMemberTaskId = null;

/** @type {string | null} */
let memberTaskChildId = null;

/** ハッシュ状態を取得 */
function parseHashState() {
  const raw = location.hash.replace(/^#/, "").trim();
  if (!raw) return { parent: null, view: null };
  const params = new URLSearchParams(raw);
  return {
    parent: params.get("parent"),
    view: params.get("view"),
  };
}

/** 現在のビュー */
function getCurrentView() {
  const { parent, view } = parseHashState();
  if (view === "members") return "members";
  if (parent) return "detail";
  return "list";
}

/** ハッシュから親プロジェクト ID を取得 */
function parseHashParent() {
  return parseHashState().parent;
}

/** 親プロジェクト詳細へ遷移 */
function navigateToParent(parentId) {
  selectedParentId = parentId;
  if (parentId) {
    location.hash = `parent=${encodeURIComponent(parentId)}`;
  } else {
    history.replaceState(null, "", location.pathname + location.search);
  }
  renderView();
}

/** 担当プロジェクト一覧へ遷移 */
function navigateToMembers() {
  selectedParentId = null;
  location.hash = "view=members";
  renderView();
}

/** 一覧へ戻る */
function navigateToList() {
  selectedParentId = null;
  history.replaceState(null, "", location.pathname + location.search);
  renderView();
}

/** タスク API 応答をダッシュボードに反映 */
function applyTaskMutationResult(data) {
  if (!data || !dashboard) return;
  if (data.projects) dashboard.projects = data.projects;
  if (data.tasks) dashboard.tasks = data.tasks;
  if (data.member_board) dashboard.member_board = data.member_board;
}

/** 納期をスラッシュ区切りで表示 */
function formatDueSlash(dateStr) {
  if (!dateStr) return "納期未設定";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return `納期: ${dateStr}`;
  return `納期: ${parts[0]}/${parts[1]}/${parts[2]}`;
}

/** タスクのプロジェクト表示名 */
function taskProjectLabel(task) {
  if (task.child_name) return task.child_name;
  if (task.parent_name) return task.parent_name;
  return "未設定";
}

/** 子プロジェクト選択肢をフラット化 */
function listAllChildProjects() {
  const items = [];
  for (const parent of dashboard?.projects ?? []) {
    for (const child of parent.children ?? []) {
      items.push({
        id: child.id,
        name: child.name,
        parent_name: parent.name,
        label: `${parent.name} / ${child.name}`,
      });
    }
    for (const child of parent.completed_children ?? []) {
      items.push({
        id: child.id,
        name: child.name,
        parent_name: parent.name,
        label: `${parent.name} / ${child.name}`,
      });
    }
  }
  return items;
}

/** リーダー表示名（複数対応） */
function formatLeadersLabel(parent) {
  const leaders = parent.leaders?.length
    ? parent.leaders
    : parent.leader
      ? [parent.leader]
      : [];
  if (leaders.length === 0) return "リーダー未設定";
  return leaders.map((l) => l.display_name).join("、");
}

/** タスク操作権限（担当者または管理者） */
function canManageMemberTask(task) {
  if (!task || !dashboard) return false;
  return (
    task.assignee?.id === dashboard.current_user_id || isAdmin()
  );
}

/** Unix ms を日本語日付に */
function formatTimestampJa(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

/** カード用の更新日表示 */
function formatUpdateLabel(parent) {
  const ts = parent.updated_at;
  if (!ts) return "説明なし";
  const d = new Date(ts);
  return `${d.getMonth() + 1}月${d.getDate()}日更新`;
}

/** 進捗バー HTML */
function renderProgressBar(percent) {
  const p = Math.max(0, Math.min(100, Number(percent) || 0));
  return `<div class="pm-progress">
    <div class="pm-progress-head">
      <span class="pm-progress-label">進捗率</span>
      <span class="pm-progress-value">${p}%</span>
    </div>
    <div class="pm-progress-track" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100">
      <div class="pm-progress-fill" style="width:${p}%"></div>
    </div>
  </div>`;
}

const ACTIVITY_LABELS = {
  created_parent: "を作成しました",
  created_child: "を作成しました",
  completed_child: "を達成済みにしました",
  reopened_child: "を進行中に戻しました",
  deleted_project: "を削除しました",
  created_task: "タスクを追加しました",
  completed_task: "タスクを完了しました",
};

/** アクティビティ1行の本文 */
function formatActivityLine(activity) {
  const who = activity.actor?.display_name ?? "ユーザー";
  const target = activity.target_name ?? "";
  const label = ACTIVITY_LABELS[activity.action] ?? activity.action;
  if (activity.action === "created_task" || activity.action === "completed_task") {
    return `${who} ${label}: ${target}`;
  }
  return `${who} ${target} ${label}`;
}

/** アクティビティリスト HTML */
function renderActivityItems(activities, emptyLabel) {
  if (!activities || activities.length === 0) {
    return `<li class="pm-empty">${escapeHtml(emptyLabel)}</li>`;
  }
  return activities
    .map((activity) => {
      const parentLabel = activity.parent_name
        ? escapeHtml(activity.parent_name)
        : "—";
      const date = formatTimestampJa(activity.created_at);
      const iconClass =
        activity.action === "deleted_project"
          ? "pm-activity-icon--delete"
          : "pm-activity-icon--create";
      return `<li class="pm-activity-item">
        <span class="pm-activity-icon ${iconClass}" aria-hidden="true"></span>
        <div class="pm-activity-body">
          <p class="pm-activity-text">${escapeHtml(formatActivityLine(activity))}</p>
          <p class="pm-activity-meta">${parentLabel} · ${escapeHtml(date)}</p>
        </div>
      </li>`;
    })
    .join("");
}

/** アクセス権を確認 */
async function checkAccess() {
  const response = await fetch("/api/apps/project-management/access", {
    credentials: "same-origin",
  });

  if (response.status === 401) {
    window.location.href =
      "/login/?next=" + encodeURIComponent(APP_PATH);
    return false;
  }

  if (!response.ok) {
    document.getElementById("access-denied").hidden = false;
    return false;
  }

  document.getElementById("app-main").hidden = false;
  return true;
}

/** ダッシュボードを読み込む */
async function loadDashboard(groupId = null) {
  if (loading) return;
  loading = true;

  const { from, to } = monthRange(currentYear, currentMonth);
  const params = new URLSearchParams({ from, to });
  if (groupId) params.set("group_id", groupId);

  try {
    const response = await fetch(
      `/api/project-management?${params.toString()}`,
      { credentials: "same-origin" }
    );

    if (response.status === 401) {
      window.location.href =
        "/login/?next=" + encodeURIComponent(APP_PATH);
      return;
    }

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      showToast(err.error || "データの取得に失敗しました", true);
      return;
    }

    dashboard = await response.json();
    selectedGroupId = dashboard.group?.id ?? null;
    availabilityMap = new Map(
      (dashboard.availability ?? []).map((a) => [a.date, a.status])
    );
    renderAll();
  } catch {
    showToast("データの取得に失敗しました", true);
  } finally {
    loading = false;
  }
}

/** ヘッダーを描画 */
function renderHeader() {
  const meta = document.getElementById("pm-header-meta");
  const select = document.getElementById("pm-group-select");
  const badge = document.getElementById("pm-admin-badge");
  if (!meta || !select || !badge || !dashboard) return;

  meta.hidden = false;
  const groups = dashboard.groups ?? [];
  select.innerHTML = groups
    .map(
      (g) =>
        `<option value="${escapeHtml(g.id)}" ${
          g.id === selectedGroupId ? "selected" : ""
        }>${escapeHtml(g.display_name)}</option>`
    )
    .join("");

  badge.hidden = !dashboard.group?.is_admin;
}

/** 自分に振られたタスク一覧を描画 */
function renderTasks() {
  const listEl = document.getElementById("pm-task-list");
  if (!listEl || !dashboard) return;

  const items = Array.isArray(dashboard.tasks) ? dashboard.tasks : [];
  if (items.length === 0) {
    listEl.innerHTML = `<li class="pm-empty">振られたタスクはありません</li>`;
    return;
  }

  listEl.innerHTML = items
    .map((task) => {
      const urgency = task.due_urgency ?? "ok";
      const urgencyClass =
        urgency === "overdue"
          ? " pm-task-item--overdue"
          : urgency === "warning"
            ? " pm-task-item--warning"
            : "";
      const due = task.due_date
        ? `納期 ${formatDate(task.due_date)}`
        : "納期未設定";
      const from = task.created_by?.display_name
        ? `from ${task.created_by.display_name}`
        : "";
      const desc = task.description
        ? `<span class="pm-task-desc">${escapeHtml(task.description)}</span>`
        : "";
      return `<li class="pm-task-item${urgencyClass}" data-task-id="${escapeHtml(task.id)}">
        <div class="pm-task-main">
          <span class="pm-task-title">${escapeHtml(task.title)}</span>
          ${desc}
          <span class="pm-task-meta">${escapeHtml(task.parent_name ?? "未設定")} · ${escapeHtml(due)}${from ? ` · ${escapeHtml(from)}` : ""}</span>
        </div>
        <button type="button" class="pm-btn pm-btn--primary pm-task-complete" data-complete-task="${escapeHtml(task.id)}">完了</button>
      </li>`;
    })
    .join("");

  listEl.querySelectorAll("[data-complete-task]").forEach((btn) => {
    btn.addEventListener("click", () => {
      handleCompleteTask(btn.getAttribute("data-complete-task"));
    });
  });
}

/** 選択中の曜日 (0=日 … 6=土) */
function getSelectedWeekdays() {
  return [...document.querySelectorAll("#pm-cal-bulk-weekdays input:checked")].map(
    (el) => Number(el.value)
  );
}

/** 曜日チェック状態をヘッダー表示に反映 */
function syncWeekdayHeaderSelection() {
  const selected = new Set(getSelectedWeekdays());
  document.querySelectorAll("#pm-cal-weekdays .pm-cal-weekday").forEach((el) => {
    const day = Number(el.dataset.weekday);
    el.classList.toggle("is-selected", selected.has(day));
  });
}

/** 曜日ヘッダー */
function renderWeekdays() {
  const row = document.getElementById("pm-cal-weekdays");
  if (!row) return;
  row.innerHTML = WEEKDAYS.map(
    (d, i) =>
      `<button type="button" class="pm-cal-weekday" data-weekday="${i}" title="${d}曜日を選択">${d}</button>`
  ).join("");

  row.querySelectorAll(".pm-cal-weekday").forEach((btn) => {
    btn.addEventListener("click", () => {
      const weekday = btn.dataset.weekday;
      const checkbox = document.querySelector(
        `#pm-cal-bulk-weekdays input[value="${weekday}"]`
      );
      if (!checkbox) return;
      checkbox.checked = !checkbox.checked;
      syncWeekdayHeaderSelection();
    });
  });

  syncWeekdayHeaderSelection();
}

/** 月ラベル更新 */
function updateMonthLabel() {
  const label = document.getElementById("pm-cal-month-text");
  if (label) label.textContent = `${currentYear}年${currentMonth}月`;
}

/** 日セル生成 */
function createDayCell(dayNum, otherMonth, todayStr, dateStr) {
  const cell = document.createElement("div");
  cell.className = "pm-cal-day";
  if (otherMonth) cell.classList.add("other-month");
  if (dateStr === todayStr) cell.classList.add("today");

  const num = document.createElement("div");
  num.className = "pm-cal-day-num";
  num.textContent = String(dayNum);
  cell.appendChild(num);

  if (!dateStr || otherMonth) return cell;

  cell.dataset.date = dateStr;
  // 未設定はデフォルトで活動不可
  const status = availabilityMap.get(dateStr) ?? "unavailable";
  if (status === "available") cell.classList.add("pm-cal-day--available");
  if (status === "unavailable") cell.classList.add("pm-cal-day--unavailable");

  cell.classList.add("pm-cal-day-editable");

  cell.addEventListener("mousedown", (e) => {
    if (e.button !== 0 && e.button !== 2) return;
    e.preventDefault();
    startDrag(dateStr, cell, e.button === 0 ? "available" : "unavailable");
  });

  cell.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  cell.addEventListener("mouseenter", () => {
    if (!isDragging || !dragMode || dragTouchedDates.has(dateStr)) return;
    dragTouchedDates.add(dateStr);
    applyDragPreview(cell);
  });

  cell.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      startDrag(dateStr, cell, "available");
    },
    { passive: false }
  );

  cell.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      e.preventDefault();
      for (const touch of e.changedTouches) {
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        const touchCell = el?.closest?.(".pm-cal-day-editable[data-date]");
        if (!touchCell?.dataset.date) continue;
        const touchDate = touchCell.dataset.date;
        if (dragTouchedDates.has(touchDate)) continue;
        dragTouchedDates.add(touchDate);
        applyDragPreview(touchCell);
      }
    },
    { passive: false }
  );

  return cell;
}

/** ドラッグ開始 */
function startDrag(dateStr, cell, mode) {
  isDragging = true;
  dragMode = mode;
  dragTouchedDates = new Set([dateStr]);
  applyDragPreview(cell);
}

/** ドラッグプレビュー */
function applyDragPreview(cell) {
  cell.classList.remove(
    "pm-cal-day--painting-available",
    "pm-cal-day--painting-unavailable"
  );
  if (dragMode === "available") {
    cell.classList.add("pm-cal-day--painting-available");
  } else if (dragMode === "unavailable") {
    cell.classList.add("pm-cal-day--painting-unavailable");
  }
}

/** ドラッグ確定 */
async function handleDragEnd() {
  if (!isDragging || !dragMode || !selectedGroupId) {
    clearDragState();
    return;
  }

  const dates = [...dragTouchedDates];
  const available = dragMode === "available";
  clearDragState();

  if (dates.length === 0) return;

  const ok = await saveAvailability(dates, available);
  if (ok) {
    showToast(
      available
        ? `${dates.length}日を活動可能に設定しました`
        : `${dates.length}日を活動不可に設定しました`
    );
  }
  renderCalendar();
}

/** ドラッグ状態クリア */
function clearDragState() {
  isDragging = false;
  dragMode = null;
  dragTouchedDates = new Set();
  document
    .querySelectorAll(
      ".pm-cal-day--painting-available, .pm-cal-day--painting-unavailable"
    )
    .forEach((el) => {
      el.classList.remove(
        "pm-cal-day--painting-available",
        "pm-cal-day--painting-unavailable"
      );
    });
}

/** 活動可能日を保存 */
async function saveAvailability(dates, available) {
  try {
    const response = await fetch("/api/project-management/availability", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        group_id: selectedGroupId,
        dates,
        available,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      showToast(data.error || "更新に失敗しました", true);
      await loadDashboard(selectedGroupId);
      return false;
    }

    const status = available ? "available" : "unavailable";
    for (const date of dates) {
      availabilityMap.set(date, status);
    }
    return true;
  } catch {
    showToast("更新に失敗しました", true);
    await loadDashboard(selectedGroupId);
    return false;
  }
}

/**
 * 表示月を起点に monthsAhead か月分の、指定曜日の日付一覧を返す
 * @param {number[]} weekdays 0=日 … 6=土
 * @param {number} monthsAhead 1=当月のみ
 */
function collectWeekdayDates(weekdays, monthsAhead) {
  const weekdaySet = new Set(weekdays);
  /** @type {string[]} */
  const dates = [];

  for (let offset = 0; offset < monthsAhead; offset++) {
    let year = currentYear;
    let month = currentMonth + offset;
    while (month > 12) {
      month -= 12;
      year += 1;
    }
    const lastDay = new Date(year, month, 0).getDate();
    for (let day = 1; day <= lastDay; day++) {
      const date = new Date(year, month - 1, day);
      if (!weekdaySet.has(date.getDay())) continue;
      dates.push(
        `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      );
    }
  }

  return dates;
}

/** 何か月先までの入力値を取得 */
function getMonthsAhead() {
  const input = document.getElementById("pm-cal-months-ahead");
  const value = Number(input?.value ?? 1);
  if (!Number.isInteger(value) || value < 1) return 1;
  if (value > 24) return 24;
  return value;
}

/** 曜日一括適用 */
async function handleBulkWeekdays(available) {
  if (!selectedGroupId) return;

  const weekdays = getSelectedWeekdays();
  if (weekdays.length === 0) {
    showToast("曜日を選択してください", true);
    return;
  }

  const monthsAhead = getMonthsAhead();
  const dates = collectWeekdayDates(weekdays, monthsAhead);
  if (dates.length === 0) {
    showToast("対象日がありません", true);
    return;
  }

  const dayNames = weekdays.map((d) => WEEKDAYS[d]).join("・");
  const ok = await saveAvailability(dates, available);
  if (ok) {
    showToast(
      available
        ? `${dayNames}を${monthsAhead}か月分（${dates.length}日）活動可能にしました`
        : `${dayNames}を${monthsAhead}か月分（${dates.length}日）活動不可にしました`
    );
    // 表示月以外も更新しているため再読込
    await loadDashboard(selectedGroupId);
  }
}

/** カレンダー描画 */
function renderCalendar() {
  updateMonthLabel();
  renderWeekdays();

  const grid = document.getElementById("pm-cal-grid");
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

/** 月変更 */
async function changeMonth(delta) {
  currentMonth += delta;
  if (currentMonth > 12) {
    currentMonth = 1;
    currentYear++;
  } else if (currentMonth < 1) {
    currentMonth = 12;
    currentYear--;
  }
  await loadDashboard(selectedGroupId);
}

/** 今月へ */
async function goToToday() {
  const parts = todayJst().split("-").map(Number);
  currentYear = parts[0];
  currentMonth = parts[1];
  await loadDashboard(selectedGroupId);
}

/** @type {string | null} */
let editingAssigneeProjectId = null;
/** @type {string | null} */
let editingDueProjectId = null;
/** @type {string | null} */
let editingStorageProjectId = null;
/** @type {string | null} */
let editingChildProjectId = null;
/** 編集ダイアログでフォルダ紐づけを解除するか */
let editClearStorage = false;
/** @type {string | null} */
let editingLeaderParentId = null;
/** @type {string | null} */
let editingProgressParentId = null;
/** @type {string | null} */
let creatingTaskParentId = null;
/** @type {string} */
let storagePickerPath = "";
/** @type {string} */
let storageGroupRoot = "";
let effortPreviewTimer = null;

/** 一覧／詳細／担当一覧の表示切替 */
function renderView() {
  const listView = document.getElementById("pm-list-view");
  const detailView = document.getElementById("pm-detail-view");
  const membersView = document.getElementById("pm-members-view");
  if (!listView || !detailView || !membersView || !dashboard) return;

  const hash = parseHashState();
  selectedParentId = hash.parent;
  const view = getCurrentView();

  if (view === "members") {
    listView.hidden = true;
    detailView.hidden = true;
    membersView.hidden = false;
    renderMemberBoard();
    return;
  }

  const parent = selectedParentId ? findParentProject(selectedParentId) : null;
  if (selectedParentId && !parent) {
    selectedParentId = null;
    history.replaceState(null, "", location.pathname + location.search);
  }

  if (view === "detail" && parent) {
    listView.hidden = true;
    detailView.hidden = false;
    membersView.hidden = true;
    renderDetailView(parent);
    return;
  }

  listView.hidden = false;
  detailView.hidden = true;
  membersView.hidden = true;
  renderProjectCards();
  renderRecentActivity();
}

/** メンバー別タスクカード1枚のタイル */
function renderMemberTaskTile(task) {
  const canManage = canManageMemberTask(task);
  const projectLabel = taskProjectLabel(task);
  const due = formatDueSlash(task.due_date);
  const statusClass =
    task.status === "active"
      ? "pm-member-task-tile--active"
      : "pm-member-task-tile--pending";
  const actions = canManage
    ? `<div class="pm-member-task-actions">
         <button type="button" class="pm-member-task-action" data-edit-member-task="${escapeHtml(task.id)}" title="編集" aria-label="編集">✎</button>
         <button type="button" class="pm-member-task-action" data-complete-member-task="${escapeHtml(task.id)}" title="完了" aria-label="完了">✓</button>
         <button type="button" class="pm-member-task-action pm-member-task-action--danger" data-delete-member-task="${escapeHtml(task.id)}" title="削除" aria-label="削除">×</button>
       </div>`
    : "";

  return `<article class="pm-member-task-tile ${statusClass}" data-task-id="${escapeHtml(task.id)}">
    <h4 class="pm-member-task-title">${escapeHtml(task.title)}</h4>
    <p class="pm-member-task-project">${escapeHtml(projectLabel)}</p>
    <p class="pm-member-task-due">${escapeHtml(due)}</p>
    ${actions}
  </article>`;
}

/** タスク行（横スクロール） */
function renderMemberTaskRow(tasks, emptyLabel) {
  if (!tasks || tasks.length === 0) {
    return `<p class="pm-member-task-empty">${escapeHtml(emptyLabel)}</p>`;
  }
  return `<div class="pm-member-task-row">${tasks.map(renderMemberTaskTile).join("")}</div>`;
}

/** 担当プロジェクト一覧（メンバーカードグリッド） */
function renderMemberBoard() {
  const grid = document.getElementById("pm-member-grid");
  if (!grid || !dashboard) return;

  const boards = dashboard.member_board ?? [];
  if (boards.length === 0) {
    grid.innerHTML = `<p class="pm-empty">メンバーがいません</p>`;
    return;
  }

  grid.innerHTML = boards
    .map((board) => {
      const { member, active_tasks, pending_tasks, can_add } = board;
      const addBtn = can_add
        ? `<button type="button" class="pm-member-add-btn" data-add-member-task="${escapeHtml(member.id)}" aria-label="タスクを追加" title="タスクを追加">+</button>`
        : "";
      return `<article class="pm-member-card">
        <header class="pm-member-card-head">
          <div class="pm-member-card-user">
            <span class="pm-member-avatar" aria-hidden="true"></span>
            <h3 class="pm-member-name">${escapeHtml(member.display_name)}</h3>
          </div>
          ${addBtn}
        </header>
        <section class="pm-member-section">
          <div class="pm-member-section-head">
            <h4 class="pm-member-section-title">進行中</h4>
            <span class="pm-member-section-count">${active_tasks.length}</span>
          </div>
          ${renderMemberTaskRow(active_tasks, "なし")}
        </section>
        <section class="pm-member-section">
          <div class="pm-member-section-head">
            <h4 class="pm-member-section-title">未進行</h4>
            <span class="pm-member-section-count">${pending_tasks.length}</span>
          </div>
          ${renderMemberTaskRow(pending_tasks, "なし")}
        </section>
      </article>`;
    })
    .join("");

  grid.querySelectorAll("[data-add-member-task]").forEach((btn) => {
    btn.addEventListener("click", () => {
      openMemberTaskDialog(btn.getAttribute("data-add-member-task"));
    });
  });

  bindMemberTaskTileActions(grid);
}

/** メンバータスクタイルの操作をバインド */
function bindMemberTaskTileActions(scope) {
  scope.querySelectorAll("[data-edit-member-task]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openMemberTaskEditDialog(btn.getAttribute("data-edit-member-task"));
    });
  });
  scope.querySelectorAll("[data-complete-member-task]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      handleCompleteTask(btn.getAttribute("data-complete-member-task"));
    });
  });
  scope.querySelectorAll("[data-delete-member-task]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      handleDeleteMemberTask(btn.getAttribute("data-delete-member-task"));
    });
  });
}

/** 担当タスク追加ダイアログを開く */
function openMemberTaskDialog(assigneeId) {
  if (!assigneeId || !dashboard) return;
  const board = (dashboard.member_board ?? []).find(
    (b) => b.member.id === assigneeId
  );
  if (!board?.can_add) {
    showToast("このメンバーにタスクを追加する権限がありません", true);
    return;
  }

  editingMemberTaskId = null;
  memberTaskAssigneeId = assigneeId;
  memberTaskChildId = null;

  const dialog = document.getElementById("pm-member-task-dialog");
  const titleEl = document.getElementById("pm-member-task-dialog-title");
  const assigneeEl = document.getElementById("pm-member-task-assignee-label");
  const inputTitle = document.getElementById("pm-member-task-title");
  const inputDue = document.getElementById("pm-member-task-due");
  const inputStatus = document.getElementById("pm-member-task-status");
  const childLabel = document.getElementById("pm-member-task-child-label");
  const saveBtn = document.getElementById("pm-member-task-save");
  const clearChildBtn = document.getElementById("pm-member-task-child-clear");
  if (!dialog || !inputTitle || !inputDue || !inputStatus) return;

  if (titleEl) titleEl.textContent = "担当プロジェクトを追加";
  if (assigneeEl) {
    assigneeEl.textContent = `担当: ${board.member.display_name}`;
  }
  if (saveBtn) saveBtn.textContent = "追加";
  inputTitle.value = "";
  inputDue.value = "";
  inputStatus.value = "pending";
  if (childLabel) childLabel.textContent = "なし（未設定）";
  if (clearChildBtn) clearChildBtn.hidden = true;

  dialog.showModal();
  inputTitle.focus();
}

/** 担当タスク編集ダイアログを開く */
function openMemberTaskEditDialog(taskId) {
  if (!taskId) return;
  const task = findMemberTask(taskId);
  if (!task || !canManageMemberTask(task)) {
    showToast("このタスクを編集する権限がありません", true);
    return;
  }

  editingMemberTaskId = taskId;
  memberTaskAssigneeId = task.assignee.id;
  memberTaskChildId = task.child_project_id;

  const dialog = document.getElementById("pm-member-task-dialog");
  const titleEl = document.getElementById("pm-member-task-dialog-title");
  const assigneeEl = document.getElementById("pm-member-task-assignee-label");
  const inputTitle = document.getElementById("pm-member-task-title");
  const inputDue = document.getElementById("pm-member-task-due");
  const inputStatus = document.getElementById("pm-member-task-status");
  const childLabel = document.getElementById("pm-member-task-child-label");
  const saveBtn = document.getElementById("pm-member-task-save");
  const clearChildBtn = document.getElementById("pm-member-task-child-clear");
  if (!dialog || !inputTitle || !inputDue || !inputStatus) return;

  if (titleEl) titleEl.textContent = "担当プロジェクトを編集";
  if (assigneeEl) {
    assigneeEl.textContent = `担当: ${task.assignee.display_name}`;
  }
  if (saveBtn) saveBtn.textContent = "保存";
  inputTitle.value = task.title;
  inputDue.value = task.due_date ?? "";
  inputStatus.value = task.status === "active" ? "active" : "pending";
  updateMemberTaskChildLabel();
  if (clearChildBtn) clearChildBtn.hidden = !memberTaskChildId;

  dialog.showModal();
  inputTitle.focus();
}

/** 子プロジェクト選択ラベルを更新 */
function updateMemberTaskChildLabel() {
  const childLabel = document.getElementById("pm-member-task-child-label");
  if (!childLabel) return;
  if (!memberTaskChildId) {
    childLabel.textContent = "なし（未設定）";
    return;
  }
  const child = listAllChildProjects().find((c) => c.id === memberTaskChildId);
  childLabel.textContent = child?.label ?? "選択済み";
}

/** ボード上のタスクを ID で探す */
function findMemberTask(taskId) {
  for (const board of dashboard?.member_board ?? []) {
    const all = [...board.active_tasks, ...board.pending_tasks];
    const task = all.find((t) => t.id === taskId);
    if (task) return task;
  }
  for (const task of dashboard?.tasks ?? []) {
    if (task.id === taskId) return task;
  }
  return null;
}

/** 子プロジェクト選択ダイアログ */
function openChildPickerDialog() {
  const list = document.getElementById("pm-child-picker-list");
  const dialog = document.getElementById("pm-child-picker-dialog");
  if (!list || !dialog) return;

  const children = listAllChildProjects();
  if (children.length === 0) {
    list.innerHTML = `<p class="pm-empty">子プロジェクトがありません</p>`;
  } else {
    list.innerHTML = children
      .map(
        (child) =>
          `<button type="button" class="pm-child-picker-item" data-pick-child="${escapeHtml(child.id)}">${escapeHtml(child.label)}</button>`
      )
      .join("");
    list.querySelectorAll("[data-pick-child]").forEach((btn) => {
      btn.addEventListener("click", () => {
        memberTaskChildId = btn.getAttribute("data-pick-child");
        updateMemberTaskChildLabel();
        const clearBtn = document.getElementById("pm-member-task-child-clear");
        if (clearBtn) clearBtn.hidden = !memberTaskChildId;
        dialog.close();
      });
    });
  }

  dialog.showModal();
}

/** 担当タスクを保存（追加または更新） */
async function handleSaveMemberTask() {
  if (!memberTaskAssigneeId || !selectedGroupId) return;
  const inputTitle = document.getElementById("pm-member-task-title");
  const statusEl = document.getElementById("pm-member-task-status");
  if (!inputTitle || !statusEl) return;

  const title = inputTitle.value.trim();
  if (!title) {
    showToast("タイトルを入力してください", true);
    return;
  }

  const dueEl = document.getElementById("pm-member-task-due");
  const dueDate = dueEl?.value || null;
  const status = statusEl.value === "active" ? "active" : "pending";

  try {
    if (editingMemberTaskId) {
      const response = await fetch(
        `/api/project-management/tasks/${encodeURIComponent(editingMemberTaskId)}`,
        {
          method: "PUT",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            due_date: dueDate,
            status,
            child_project_id: memberTaskChildId,
          }),
        }
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        showToast(data.error || "更新に失敗しました", true);
        return;
      }
      applyTaskMutationResult(data);
      renderTasks();
      renderView();
      showToast("タスクを更新しました");
    } else {
      const response = await fetch("/api/project-management/tasks", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          group_id: selectedGroupId,
          assignee_id: memberTaskAssigneeId,
          title,
          due_date: dueDate,
          status,
          child_project_id: memberTaskChildId,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        showToast(data.error || "追加に失敗しました", true);
        return;
      }
      applyTaskMutationResult(data);
      renderTasks();
      renderView();
      showToast("タスクを追加しました");
    }
  } catch {
    showToast("保存に失敗しました", true);
  } finally {
    clearMemberTaskDialogState();
  }
}

/** 担当タスクダイアログの状態をクリア */
function clearMemberTaskDialogState() {
  memberTaskAssigneeId = null;
  editingMemberTaskId = null;
  memberTaskChildId = null;
}

/** 担当タスクを削除 */
async function handleDeleteMemberTask(taskId) {
  if (!taskId) return;
  const task = findMemberTask(taskId);
  if (!task || !canManageMemberTask(task)) {
    showToast("このタスクを削除する権限がありません", true);
    return;
  }
  if (!window.confirm("このタスクを削除しますか？")) return;

  try {
    const response = await fetch(
      `/api/project-management/tasks/${encodeURIComponent(taskId)}`,
      { method: "DELETE", credentials: "same-origin" }
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      showToast(data.error || "削除に失敗しました", true);
      return;
    }
    applyTaskMutationResult(data);
    renderTasks();
    renderView();
    showToast("タスクを削除しました");
  } catch {
    showToast("削除に失敗しました", true);
  }
}

/** プロジェクトカードグリッド */
function renderProjectCards() {
  const container = document.getElementById("pm-project-cards");
  const addParentBtn = document.getElementById("pm-add-parent");
  if (!container || !dashboard) return;

  if (addParentBtn) addParentBtn.hidden = !isAdmin();

  const projects = dashboard.projects ?? [];
  if (projects.length === 0) {
    container.innerHTML = `<p class="pm-empty">${
      isAdmin()
        ? "親プロジェクトがありません。「+ 新規」から作成できます。"
        : "プロジェクトはまだありません。"
    }</p>`;
    return;
  }

  container.innerHTML = projects
    .map((parent) => {
      const leaderName = formatLeadersLabel(parent);
      const footerDate = parent.latest_due_date
        ? formatDate(parent.latest_due_date)
        : formatUpdateLabel(parent);
      const percent = parent.progress_percent ?? 0;
      return `<button type="button" class="pm-project-card" data-open-parent="${escapeHtml(parent.id)}">
        <h3 class="pm-project-card-title">${escapeHtml(parent.name)}</h3>
        <p class="pm-project-card-desc">説明なし</p>
        ${renderProgressBar(percent)}
        <div class="pm-project-card-footer">
          <span class="pm-project-card-meta">${escapeHtml(leaderName)}</span>
          <span class="pm-project-card-meta">${escapeHtml(footerDate)}</span>
        </div>
      </button>`;
    })
    .join("");

  container.querySelectorAll("[data-open-parent]").forEach((btn) => {
    btn.addEventListener("click", () => {
      navigateToParent(btn.getAttribute("data-open-parent"));
    });
  });
}

/** 一覧サイドバー：最近の変更 */
function renderRecentActivity() {
  const list = document.getElementById("pm-activity-list");
  if (!list) return;
  const activities = dashboard?.recent_activity ?? [];
  list.innerHTML = renderActivityItems(activities, "最近の変更はありません");
}

/** ストレージパスの表示用ラベル（グループ接頭辞を省略） */
function formatStoragePathLabel(storagePath) {
  if (!storagePath) return "";
  const parts = storagePath.split("/").filter(Boolean);
  // g/{group}/... → 以降を表示
  if (parts[0] === "g" && parts.length >= 2) {
    return parts.slice(2).join("/") || "（ルート）";
  }
  return storagePath;
}

/** クラウドストレージへのリンク HTML */
function renderStorageLink(storagePath) {
  if (!storagePath) return "";
  const label = formatStoragePathLabel(storagePath);
  const href = `/apps/cloud-storage/?path=${encodeURIComponent(storagePath)}`;
  return `<a class="pm-storage-link" href="${href}" title="クラウドストレージを開く">
    <span class="pm-storage-link-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 7h6l2 2h8v10H4V7z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/>
      </svg>
    </span>
    <span class="pm-storage-link-path">${escapeHtml(label)}</span>
  </a>`;
}

/** Excalidraw プロジェクトノートへのリンク HTML */
function renderNoteLink(noteId, projectId) {
  if (noteId) {
    const href = `/apps/excalidraw/?noteId=${encodeURIComponent(noteId)}`;
    return `<a class="pm-note-link" href="${href}" target="_blank" rel="noopener" title="プロジェクトノートを開く">
      <span class="pm-note-link-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 20h9" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/>
        </svg>
      </span>
      <span class="pm-note-link-label">ノート</span>
    </a>`;
  }
  return `<button type="button" class="pm-note-link" data-open-note="${escapeHtml(projectId)}" title="プロジェクトノートを開く">
    <span class="pm-note-link-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 20h9" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/>
      </svg>
    </span>
    <span class="pm-note-link-label">ノート</span>
  </button>`;
}

/** ストレージ・ノートリンクを横並びで描画 */
function renderProjectResourceLinks({ storagePath, noteId, projectId }) {
  return `<div class="pm-project-resource-links">
    ${renderStorageLink(storagePath)}
    ${renderNoteLink(noteId, projectId)}
  </div>`;
}

/** ノート未作成時のクリックで取得/作成して開く */
function bindNoteLinkHandlers(scope) {
  scope.querySelectorAll("[data-open-note]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const projectId = btn.getAttribute("data-open-note");
      if (!projectId) return;
      btn.disabled = true;
      try {
        await openProjectNote(projectId);
      } finally {
        btn.disabled = false;
      }
    });
  });
}

/** プロジェクトノートを開く（なければ作成） */
async function openProjectNote(projectId) {
  const response = await fetch(
    `/api/project-management/projects/${encodeURIComponent(projectId)}/note`,
    {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
    }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? "ノートを開けませんでした");
  }
  window.open(
    `/apps/excalidraw/?noteId=${encodeURIComponent(data.note_id)}`,
    "_blank",
    "noopener"
  );
}

/** 詳細画面の子行 */
function renderDetailChildRow(child) {
  const isCompleted = Boolean(child.is_completed);
  const itemClass = isCompleted ? "pm-detail-child-row--completed" : "";
  const nameHtml = isCompleted
    ? `<span class="pm-detail-child-name pm-detail-child-name--done">${escapeHtml(child.name)}</span>`
    : `<span class="pm-detail-child-name">${escapeHtml(child.name)}</span>`;
  const storageHtml = renderProjectResourceLinks({
    storagePath: child.storage_path,
    noteId: child.excalidraw_note_id,
    projectId: child.id,
  });

  return `<li class="pm-detail-child-row ${itemClass}">
    <div class="pm-detail-child-info">
      ${nameHtml}
      <p class="pm-detail-child-desc">説明なし</p>
      ${storageHtml}
    </div>
    <button type="button" class="pm-btn pm-btn--ghost" data-edit-child="${escapeHtml(child.id)}">タスクの編集</button>
  </li>`;
}

/** 詳細の子リストに編集ボタンをバインド */
function bindDetailChildEditButtons(scope) {
  scope.querySelectorAll("[data-edit-child]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openEditChildDialog(btn.getAttribute("data-edit-child"));
    });
  });
}

/** 親プロジェクト詳細画面 */
function renderDetailView(parent) {
  const breadcrumbName = document.getElementById("pm-detail-breadcrumb-name");
  const header = document.getElementById("pm-detail-header");
  const childList = document.getElementById("pm-detail-child-list");
  const completedWrap = document.getElementById("pm-detail-completed-wrap");
  const timelineList = document.getElementById("pm-detail-timeline-list");
  const addChildBtn = document.getElementById("pm-detail-add-child");
  if (!breadcrumbName || !header || !childList || !timelineList) return;

  breadcrumbName.textContent = parent.name;

  const leaderName = formatLeadersLabel(parent);
  const percent = parent.progress_percent ?? 0;
  const admin = isAdmin();

  if (addChildBtn) {
    addChildBtn.hidden = !admin;
  }

  header.innerHTML = `
    <div class="pm-detail-header-main">
      <h2 class="pm-detail-title">${escapeHtml(parent.name)}</h2>
      <p class="pm-detail-leader">リーダー: ${escapeHtml(leaderName)}</p>
      ${renderProjectResourceLinks({
        storagePath: null,
        noteId: parent.excalidraw_note_id,
        projectId: parent.id,
      })}
      ${renderProgressBar(percent)}
    </div>
    <div class="pm-detail-header-actions">
      ${
        admin
          ? `<button type="button" class="pm-btn pm-btn--ghost" id="pm-detail-edit-progress" data-parent-id="${escapeHtml(parent.id)}">編集</button>`
          : ""
      }
      ${
        parent.is_leader
          ? `<button type="button" class="pm-btn pm-btn--primary" id="pm-detail-add-task" data-parent-id="${escapeHtml(parent.id)}">タスクを振る</button>`
          : ""
      }
      ${
        admin
          ? `<button type="button" class="pm-btn pm-btn--ghost" id="pm-detail-set-leader" data-parent-id="${escapeHtml(parent.id)}">リーダー</button>
             <button type="button" class="pm-btn pm-btn--danger" id="pm-detail-delete-parent" data-parent-id="${escapeHtml(parent.id)}">削除</button>`
          : ""
      }
    </div>
  `;

  document
    .getElementById("pm-detail-edit-progress")
    ?.addEventListener("click", () => openProgressDialog(parent.id));
  document
    .getElementById("pm-detail-add-task")
    ?.addEventListener("click", () => openTaskDialog(parent.id));
  document
    .getElementById("pm-detail-set-leader")
    ?.addEventListener("click", () => openLeaderDialog(parent.id));
  document
    .getElementById("pm-detail-delete-parent")
    ?.addEventListener("click", () => handleDeleteProject(parent.id));

  bindNoteLinkHandlers(header);

  const activeChildren = parent.children ?? [];
  const completedChildren = parent.completed_children ?? [];

  if (activeChildren.length === 0) {
    childList.innerHTML = `<li class="pm-empty">進行中・開始前の子プロジェクトはありません</li>`;
  } else {
    childList.innerHTML = activeChildren.map(renderDetailChildRow).join("");
    bindDetailChildEditButtons(childList);
    bindNoteLinkHandlers(childList);
  }

  if (completedWrap) {
    if (completedChildren.length === 0) {
      completedWrap.innerHTML = "";
    } else {
      completedWrap.innerHTML = `
        <button type="button" class="pm-completed-toggle" data-toggle-completed aria-expanded="false">
          <span class="pm-completed-caret" aria-hidden="true">▶</span>
          達成済みのプロジェクト（${completedChildren.length}）
        </button>
        <ul class="pm-detail-child-list pm-detail-completed-list" hidden>
          ${completedChildren.map(renderDetailChildRow).join("")}
        </ul>
      `;
      const toggleBtn = completedWrap.querySelector("[data-toggle-completed]");
      const completedList = completedWrap.querySelector(".pm-detail-completed-list");
      if (toggleBtn && completedList) {
        toggleBtn.addEventListener("click", () => {
          const open = completedList.hidden;
          completedList.hidden = !open;
          toggleBtn.setAttribute("aria-expanded", String(open));
        });
        bindDetailChildEditButtons(completedList);
        bindNoteLinkHandlers(completedList);
      }
    }
  }

  const activities = (dashboard?.recent_activity ?? []).filter(
    (a) => a.parent_project_id === parent.id
  );
  timelineList.innerHTML = renderActivityItems(
    activities,
    "このプロジェクトの履歴はありません"
  );
}

/** 子プロジェクト1件の HTML */
function renderChildItem(child) {
  const assignees = child.assignees ?? [];
  const assigneeHtml =
    assignees.length === 0
      ? `<span>担当未設定</span>`
      : `<span class="pm-assignee-tags">${assignees
          .map(
            (a) =>
              `<span class="pm-assignee-tag">${escapeHtml(a.display_name)}</span>`
          )
          .join("")}</span>`;

  const startLabel = formatDate(child.effective_start_date);
  const startNote = child.start_date ? "" : "（作成日）";
  const dueLabel = child.due_date ? formatDate(child.due_date) : "未設定";
  const effortLabel =
    child.effort_days === null || child.effort_days === undefined
      ? "—"
      : `${child.effort_days}日`;

  const urgency = child.due_urgency;
  let itemClass = "pm-child-item";
  if (child.is_completed) itemClass += " pm-child-item--completed";
  else if (urgency === "overdue") itemClass += " pm-child-item--overdue";
  else if (urgency === "warning") itemClass += " pm-child-item--warning";

  const statusLabel = child.is_completed
    ? "達成済み"
    : child.is_active
      ? "進行中"
      : "開始前";

  const storagePath = child.storage_path;
  const nameHtml = storagePath
    ? `<a class="pm-child-name-link" href="/apps/cloud-storage/?path=${encodeURIComponent(storagePath)}" title="クラウドストレージを開く">${escapeHtml(child.name)}</a>`
    : `<span class="pm-child-name">${escapeHtml(child.name)}</span>`;

  const storageLinksHtml = renderProjectResourceLinks({
    storagePath,
    noteId: child.excalidraw_note_id,
    projectId: child.id,
  });

  return `<li class="${itemClass}" data-child-id="${escapeHtml(child.id)}">
    <div class="pm-child-top">
      ${nameHtml}
      <div class="pm-child-actions">
        <button type="button" class="pm-btn pm-btn--ghost" data-edit-child="${escapeHtml(child.id)}">タスクの編集</button>
      </div>
    </div>
    <div class="pm-child-meta">
      <span class="pm-child-meta-item">状態: <strong>${statusLabel}</strong></span>
      <span class="pm-child-meta-item">担当: ${assigneeHtml}</span>
      <span class="pm-child-meta-item">開始: <strong>${escapeHtml(startLabel)}</strong>${escapeHtml(startNote)}</span>
      <span class="pm-child-meta-item">納期: <strong>${escapeHtml(dueLabel)}</strong></span>
      <span class="pm-child-meta-item">工数: <strong>${escapeHtml(effortLabel)}</strong></span>
      <span class="pm-child-meta-item pm-child-meta-item--resources">${storageLinksHtml}</span>
    </div>
  </li>`;
}

/** 子プロジェクトを ID で探す（達成済み含む） */
function findChildProject(projectId) {
  for (const parent of dashboard?.projects ?? []) {
    const child = (parent.children ?? []).find((c) => c.id === projectId);
    if (child) return child;
    const done = (parent.completed_children ?? []).find(
      (c) => c.id === projectId
    );
    if (done) return done;
  }
  return null;
}

/** 子プロジェクト編集ダイアログを開く */
async function openEditChildDialog(projectId) {
  if (!projectId) return;
  const child = findChildProject(projectId);
  if (!child) return;

  editingChildProjectId = projectId;
  editingDueProjectId = projectId;
  editingAssigneeProjectId = projectId;
  editingStorageProjectId = projectId;
  editClearStorage = false;

  const nameEl = document.getElementById("pm-edit-child-name");
  const startInput = document.getElementById("pm-start-input");
  const dueInput = document.getElementById("pm-due-input");
  const dialog = document.getElementById("pm-edit-child-dialog");
  const assigneeSection = document.getElementById("pm-edit-assignee-section");
  const storageSection = document.getElementById("pm-edit-storage-section");
  const statusSection = document.getElementById("pm-edit-status-section");
  const statusLabel = document.getElementById("pm-edit-status-label");
  const completeBtn = document.getElementById("pm-edit-complete");
  const reopenBtn = document.getElementById("pm-edit-reopen");
  const deleteBtn = document.getElementById("pm-edit-delete");
  if (!nameEl || !startInput || !dueInput || !dialog) return;

  nameEl.textContent = child.name;
  startInput.value = child.start_date ?? "";
  dueInput.value = child.due_date ?? "";
  updateDueEffortPreview();

  const admin = isAdmin();
  if (assigneeSection) {
    assigneeSection.hidden = !admin;
    if (admin) fillAssigneeChecks(child);
  }
  if (storageSection) {
    storageSection.hidden = !admin;
    if (admin) await initEditStoragePicker(child);
  }
  if (statusSection) {
    statusSection.hidden = !admin;
    if (admin && statusLabel) {
      statusLabel.textContent = child.is_completed
        ? "状態: 達成済み"
        : child.is_active
          ? "状態: 進行中"
          : "状態: 開始前";
    }
    if (completeBtn) completeBtn.hidden = !admin || child.is_completed;
    if (reopenBtn) reopenBtn.hidden = !admin || !child.is_completed;
    if (deleteBtn) deleteBtn.hidden = !admin;
  }

  dialog.showModal();
}

/** 担当チェックボックスを埋める */
function fillAssigneeChecks(child) {
  const checks = document.getElementById("pm-assignee-checks");
  if (!checks) return;
  const selected = new Set((child.assignees ?? []).map((a) => a.id));
  const members = dashboard.members ?? [];
  checks.innerHTML =
    members.length === 0
      ? `<p class="pm-empty">グループメンバーがいません</p>`
      : members
          .map(
            (m) => `<label class="pm-assignee-check">
              <input type="checkbox" value="${escapeHtml(m.id)}" ${
                selected.has(m.id) ? "checked" : ""
              }>
              ${escapeHtml(m.display_name)}
              <span class="pm-assignee-username">@${escapeHtml(m.username)}</span>
            </label>`
          )
          .join("");
}

/** 編集ダイアログ内のストレージピッカーを初期化 */
async function initEditStoragePicker(child) {
  if (!selectedGroupId) return;
  const selectedEl = document.getElementById("pm-storage-selected");
  try {
    const response = await fetch(
      `/api/project-management/storage-root?group_id=${encodeURIComponent(selectedGroupId)}`,
      { credentials: "same-origin" }
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (selectedEl) {
        selectedEl.textContent = data.error || "ストレージルートの取得に失敗しました";
      }
      return;
    }
    storageGroupRoot = data.path ?? "";
    storagePickerPath =
      child.storage_path && child.storage_path.startsWith(storageGroupRoot)
        ? child.storage_path
        : storageGroupRoot;
    editClearStorage = false;
    await loadStoragePicker(storagePickerPath);
  } catch {
    if (selectedEl) selectedEl.textContent = "ストレージの読み込みに失敗しました";
  }
}

/** 納期変更時の工数プレビュー */
async function updateDueEffortPreview() {
  const effortEl = document.getElementById("pm-due-effort");
  const dueInput = document.getElementById("pm-due-input");
  const startInput = document.getElementById("pm-start-input");
  if (!effortEl || !editingDueProjectId) return;

  const dueDate = dueInput?.value || null;
  const startDate = startInput?.value || "";

  if (!dueDate) {
    effortEl.textContent = "工数: —（納期未設定）";
    return;
  }

  effortEl.textContent = "工数: 計算中…";
  try {
    const params = new URLSearchParams({ due_date: dueDate });
    if (startDate) params.set("start_date", startDate);
    else params.set("start_date", "");
    const response = await fetch(
      `/api/project-management/projects/${encodeURIComponent(editingDueProjectId)}/effort?${params}`,
      { credentials: "same-origin" }
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      effortEl.textContent = "工数: 取得失敗";
      return;
    }
    const days = data.effort_days;
    const count = (data.assignees ?? []).length;
    effortEl.textContent =
      days === null
        ? "工数: —"
        : `工数: ${days}日（担当 ${count} 名の活動可能日合計）`;
  } catch {
    effortEl.textContent = "工数: 取得失敗";
  }
}

/** 子プロジェクト編集を一括保存 */
async function handleSaveEditChild() {
  if (!editingChildProjectId) return;
  const projectId = editingChildProjectId;
  const dueInput = document.getElementById("pm-due-input");
  const startInput = document.getElementById("pm-start-input");
  const dueDate = dueInput?.value || null;
  const startDate = startInput?.value || null;
  const admin = isAdmin();

  try {
    {
      const response = await fetch(
        `/api/project-management/projects/${encodeURIComponent(projectId)}`,
        {
          method: "PUT",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ due_date: dueDate, start_date: startDate }),
        }
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        showToast(data.error || "日程の更新に失敗しました", true);
        return;
      }
      dashboard.projects = data.projects ?? dashboard.projects;
    }

    if (admin) {
      const checks = document.querySelectorAll(
        "#pm-assignee-checks input[type=checkbox]:checked"
      );
      const assigneeIds = [...checks].map((el) => el.value);
      {
        const response = await fetch(
          `/api/project-management/projects/${encodeURIComponent(projectId)}`,
          {
            method: "PUT",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ assignee_ids: assigneeIds }),
          }
        );
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          showToast(data.error || "担当の更新に失敗しました", true);
          return;
        }
        dashboard.projects = data.projects ?? dashboard.projects;
      }

      const storagePath = editClearStorage ? null : storagePickerPath || null;
      {
        const response = await fetch(
          `/api/project-management/projects/${encodeURIComponent(projectId)}`,
          {
            method: "PUT",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ storage_path: storagePath }),
          }
        );
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          showToast(data.error || "フォルダの紐づけに失敗しました", true);
          return;
        }
        dashboard.projects = data.projects ?? dashboard.projects;
      }
    }

    await loadDashboard(selectedGroupId);
    showToast("タスクを更新しました");
  } catch {
    showToast("更新に失敗しました", true);
  } finally {
    clearEditChildState();
  }
}

/** 編集ダイアログの状態をクリア */
function clearEditChildState() {
  editingChildProjectId = null;
  editingDueProjectId = null;
  editingAssigneeProjectId = null;
  editingStorageProjectId = null;
  editClearStorage = false;
}

/** 達成済み／進行中に戻す（管理者） */
async function handleSetCompleted(projectId, completed) {
  if (!isAdmin() || !projectId) return;
  const label = completed ? "達成済みにしますか？" : "進行中に戻しますか？";
  if (!window.confirm(label)) return;

  try {
    const response = await fetch(
      `/api/project-management/projects/${encodeURIComponent(projectId)}`,
      {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      }
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      showToast(data.error || "更新に失敗しました", true);
      return;
    }
    document.getElementById("pm-edit-child-dialog")?.close();
    clearEditChildState();
    await loadDashboard(selectedGroupId);
    showToast(completed ? "達成済みにしました" : "進行中に戻しました");
  } catch {
    showToast("更新に失敗しました", true);
  }
}

/** ストレージフォルダ一覧を読み込む */
async function loadStoragePicker(path) {
  storagePickerPath = path;
  editClearStorage = false;
  const foldersEl = document.getElementById("pm-storage-folders");
  const crumbEl = document.getElementById("pm-storage-breadcrumb");
  const selectedEl = document.getElementById("pm-storage-selected");
  if (!foldersEl || !crumbEl || !selectedEl) return;

  selectedEl.textContent = `選択中: ${path}`;
  renderStorageBreadcrumb(path);

  foldersEl.innerHTML = `<p class="pm-empty">読み込み中…</p>`;
  try {
    const params = new URLSearchParams({
      path,
      limit: "200",
      sort: "name",
      order: "asc",
    });
    const response = await fetch(`/api/storage/list?${params}`, {
      credentials: "same-origin",
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      foldersEl.innerHTML = `<p class="pm-empty">${escapeHtml(data.error || "一覧の取得に失敗しました")}</p>`;
      return;
    }

    const folders = (data.items ?? []).filter((i) => i.type === "folder");
    if (folders.length === 0) {
      foldersEl.innerHTML = `<p class="pm-empty">サブフォルダはありません（このフォルダを紐づけできます）</p>`;
      return;
    }

    foldersEl.innerHTML = folders
      .map(
        (f) =>
          `<button type="button" class="pm-storage-folder-btn" data-storage-path="${escapeHtml(f.path)}">📁 ${escapeHtml(f.name)}</button>`
      )
      .join("");

    foldersEl.querySelectorAll("[data-storage-path]").forEach((btn) => {
      btn.addEventListener("click", () => {
        loadStoragePicker(btn.getAttribute("data-storage-path"));
      });
    });
  } catch {
    foldersEl.innerHTML = `<p class="pm-empty">一覧の取得に失敗しました</p>`;
  }
}

/** ストレージパンくず */
function renderStorageBreadcrumb(path) {
  const crumbEl = document.getElementById("pm-storage-breadcrumb");
  if (!crumbEl || !storageGroupRoot) return;

  const relative = path.startsWith(storageGroupRoot)
    ? path.slice(storageGroupRoot.length).replace(/^\//, "")
    : "";
  const parts = relative ? relative.split("/") : [];

  let html = `<button type="button" class="pm-storage-crumb" data-crumb-path="${escapeHtml(storageGroupRoot)}">グループルート</button>`;
  let acc = storageGroupRoot;
  for (const part of parts) {
    acc = `${acc}/${part}`;
    html += `<span class="pm-storage-crumb-sep">/</span>`;
    html += `<button type="button" class="pm-storage-crumb" data-crumb-path="${escapeHtml(acc)}">${escapeHtml(part)}</button>`;
  }
  crumbEl.innerHTML = html;

  crumbEl.querySelectorAll("[data-crumb-path]").forEach((btn) => {
    btn.addEventListener("click", () => {
      loadStoragePicker(btn.getAttribute("data-crumb-path"));
    });
  });
}

/** 進捗編集ダイアログを開く（管理者） */
function openProgressDialog(parentId) {
  if (!isAdmin() || !parentId) return;
  const parent = findParentProject(parentId);
  if (!parent) return;

  editingProgressParentId = parentId;
  const nameEl = document.getElementById("pm-progress-project-name");
  const slider = document.getElementById("pm-progress-slider");
  const valueLabel = document.getElementById("pm-progress-value-label");
  const hint = document.getElementById("pm-progress-auto-hint");
  const dialog = document.getElementById("pm-progress-dialog");
  if (!nameEl || !slider || !valueLabel || !dialog) return;

  nameEl.textContent = parent.name;
  const percent = Math.max(0, Math.min(100, Number(parent.progress_percent) || 0));
  slider.value = String(percent);
  valueLabel.textContent = `${percent}%`;

  const autoPercent =
    parent.child_total > 0
      ? Math.round((parent.child_completed / parent.child_total) * 100)
      : 0;
  if (hint) {
    hint.textContent = parent.progress_manual
      ? `現在は手動設定です。子の達成率からの自動値は ${autoPercent}% です。`
      : `現在は子の達成率から自動算出（${autoPercent}%）です。スライダーで上書きできます。`;
  }

  dialog.showModal();
}

/** 進捗スライダー表示を同期 */
function syncProgressSliderLabel() {
  const slider = document.getElementById("pm-progress-slider");
  const valueLabel = document.getElementById("pm-progress-value-label");
  if (!slider || !valueLabel) return;
  valueLabel.textContent = `${slider.value}%`;
}

/** 進捗を保存（手動値） */
async function handleSaveProgress() {
  if (!editingProgressParentId) return;
  const slider = document.getElementById("pm-progress-slider");
  if (!slider) return;
  const percent = Number(slider.value);

  try {
    const response = await fetch(
      `/api/project-management/projects/${encodeURIComponent(editingProgressParentId)}`,
      {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress_percent: percent }),
      }
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      showToast(data.error || "進捗の更新に失敗しました", true);
      return;
    }
    dashboard.projects = data.projects ?? [];
    renderView();
    showToast("進捗を更新しました");
  } catch {
    showToast("進捗の更新に失敗しました", true);
  } finally {
    editingProgressParentId = null;
  }
}

/** 進捗を自動算出に戻す */
async function handleResetProgress() {
  if (!editingProgressParentId) return;

  try {
    const response = await fetch(
      `/api/project-management/projects/${encodeURIComponent(editingProgressParentId)}`,
      {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress_percent: null }),
      }
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      showToast(data.error || "進捗のリセットに失敗しました", true);
      return;
    }
    document.getElementById("pm-progress-dialog")?.close();
    dashboard.projects = data.projects ?? [];
    renderView();
    showToast("進捗を自動算出に戻しました");
  } catch {
    showToast("進捗のリセットに失敗しました", true);
  } finally {
    editingProgressParentId = null;
  }
}

/** リーダー指定ダイアログを開く（管理者） */
function openLeaderDialog(parentId) {
  if (!isAdmin() || !parentId) return;
  const parent = findParentProject(parentId);
  if (!parent) return;

  editingLeaderParentId = parentId;
  const nameEl = document.getElementById("pm-leader-project-name");
  const checksEl = document.getElementById("pm-leader-checks");
  const dialog = document.getElementById("pm-leader-dialog");
  if (!nameEl || !checksEl || !dialog) return;

  nameEl.textContent = parent.name;
  const members = dashboard.members ?? [];
  const selected = new Set(
    (parent.leaders?.length
      ? parent.leaders
      : parent.leader
        ? [parent.leader]
        : []
    ).map((l) => l.id)
  );

  if (members.length === 0) {
    checksEl.innerHTML = `<p class="pm-empty">グループメンバーがいません</p>`;
  } else {
    checksEl.innerHTML = members
      .map(
        (m) =>
          `<label class="pm-assignee-check">
            <input type="checkbox" value="${escapeHtml(m.id)}" ${
              selected.has(m.id) ? "checked" : ""
            }>
            <span>${escapeHtml(m.display_name)} <span class="pm-assignee-username">(@${escapeHtml(m.username)})</span></span>
          </label>`
      )
      .join("");
  }

  dialog.showModal();
}

/** リーダーを保存 */
async function handleSaveLeader() {
  if (!editingLeaderParentId) return;
  const checks = document.querySelectorAll(
    "#pm-leader-checks input[type=checkbox]:checked"
  );
  const leaderUserIds = [...checks].map((el) => el.value);

  try {
    const response = await fetch(
      `/api/project-management/projects/${encodeURIComponent(editingLeaderParentId)}`,
      {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leader_user_ids: leaderUserIds }),
      }
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      showToast(data.error || "リーダーの設定に失敗しました", true);
      return;
    }
    dashboard.projects = data.projects ?? [];
    await loadDashboard(selectedGroupId);
    showToast("リーダーを更新しました");
  } catch {
    showToast("リーダーの設定に失敗しました", true);
  } finally {
    editingLeaderParentId = null;
  }
}

/** タスク振付ダイアログを開く（リーダー） */
function openTaskDialog(parentId) {
  if (!parentId) return;
  const parent = findParentProject(parentId);
  if (!parent || !parent.is_leader) return;

  creatingTaskParentId = parentId;
  const nameEl = document.getElementById("pm-task-project-name");
  const titleEl = document.getElementById("pm-task-title");
  const descEl = document.getElementById("pm-task-description");
  const dueEl = document.getElementById("pm-task-due");
  const assigneeEl = document.getElementById("pm-task-assignee");
  const dialog = document.getElementById("pm-task-dialog");
  if (!nameEl || !titleEl || !descEl || !dueEl || !assigneeEl || !dialog) return;

  nameEl.textContent = parent.name;
  titleEl.value = "";
  descEl.value = "";
  dueEl.value = "";

  const members = parent.members ?? [];
  if (members.length === 0) {
    assigneeEl.innerHTML = `<option value="">メンバーがいません（子プロジェクトに担当を設定してください）</option>`;
  } else {
    assigneeEl.innerHTML =
      `<option value="">選択してください</option>` +
      members
        .map(
          (m) =>
            `<option value="${escapeHtml(m.id)}">${escapeHtml(m.display_name)} (@${escapeHtml(m.username)})</option>`
        )
        .join("");
  }

  dialog.showModal();
  titleEl.focus();
}

/** タスクを作成 */
async function handleCreateTask() {
  if (!creatingTaskParentId) return;
  const titleEl = document.getElementById("pm-task-title");
  const descEl = document.getElementById("pm-task-description");
  const dueEl = document.getElementById("pm-task-due");
  const assigneeEl = document.getElementById("pm-task-assignee");
  if (!titleEl || !assigneeEl) return;

  const title = titleEl.value.trim();
  const assigneeId = assigneeEl.value;
  if (!title) {
    showToast("タスクの内容を入力してください", true);
    return;
  }
  if (!assigneeId) {
    showToast("担当者を選択してください", true);
    return;
  }

  try {
    const response = await fetch("/api/project-management/tasks", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parent_project_id: creatingTaskParentId,
        title,
        description: descEl?.value?.trim() ?? "",
        due_date: dueEl?.value || null,
        assignee_id: assigneeId,
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      showToast(data.error || "タスクの追加に失敗しました", true);
      return;
    }
    applyTaskMutationResult(data);
    renderTasks();
    renderView();
    showToast("タスクを追加しました");
  } catch {
    showToast("タスクの追加に失敗しました", true);
  } finally {
    creatingTaskParentId = null;
  }
}

/** タスクを完了 */
async function handleCompleteTask(taskId) {
  if (!taskId) return;
  try {
    const response = await fetch(
      `/api/project-management/tasks/${encodeURIComponent(taskId)}/complete`,
      {
        method: "PUT",
        credentials: "same-origin",
      }
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      showToast(data.error || "完了に失敗しました", true);
      return;
    }
    if (data.projects) dashboard.projects = data.projects;
    if (data.tasks) dashboard.tasks = data.tasks;
    applyTaskMutationResult(data);
    renderTasks();
    renderView();
    showToast("タスクを完了しました");
  } catch {
    showToast("完了に失敗しました", true);
  }
}

/** 親プロジェクト追加 */
async function handleAddParent() {
  if (!selectedGroupId || !isAdmin()) return;
  const name = window.prompt("親プロジェクト名");
  if (name === null) return;
  const trimmed = name.trim();
  if (!trimmed) {
    showToast("名前を入力してください", true);
    return;
  }

  try {
    const response = await fetch("/api/project-management/projects", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ group_id: selectedGroupId, name: trimmed }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      showToast(data.error || "作成に失敗しました", true);
      return;
    }
    dashboard.projects = data.projects ?? [];
    await loadDashboard(selectedGroupId);
    showToast("親プロジェクトを追加しました");
  } catch {
    showToast("作成に失敗しました", true);
  }
}

/** 子プロジェクト追加 */
async function handleAddChild(parentId) {
  if (!selectedGroupId || !isAdmin() || !parentId) return;
  const name = window.prompt("子プロジェクト名");
  if (name === null) return;
  const trimmed = name.trim();
  if (!trimmed) {
    showToast("名前を入力してください", true);
    return;
  }

  try {
    const response = await fetch("/api/project-management/projects", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        group_id: selectedGroupId,
        name: trimmed,
        parent_id: parentId,
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      showToast(data.error || "作成に失敗しました", true);
      return;
    }
    dashboard.projects = data.projects ?? [];
    await loadDashboard(selectedGroupId);
    showToast("子プロジェクトを追加しました");
  } catch {
    showToast("作成に失敗しました", true);
  }
}

/** プロジェクト削除 */
async function handleDeleteProject(projectId) {
  if (!isAdmin() || !projectId) return;
  if (!window.confirm("このプロジェクトを削除しますか？（子も削除されます）")) {
    return;
  }

  try {
    const response = await fetch(
      `/api/project-management/projects/${encodeURIComponent(projectId)}`,
      { method: "DELETE", credentials: "same-origin" }
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      showToast(data.error || "削除に失敗しました", true);
      return;
    }
    dashboard.projects = data.projects ?? [];
    const deletedParent = selectedParentId === projectId;
    if (deletedParent) {
      selectedParentId = null;
      history.replaceState(null, "", location.pathname + location.search);
    }
    await loadDashboard(selectedGroupId);
    showToast("削除しました");
  } catch {
    showToast("削除に失敗しました", true);
  }
}

/** 管理者設定パネルを描画 */
function renderAdminSettings() {
  const section = document.getElementById("pm-admin-section");
  const select = document.getElementById("pm-min-weight");
  const hint = document.getElementById("pm-admin-hint");
  if (!section || !select || !hint || !dashboard) return;

  const canEdit = Boolean(dashboard.can_edit_admin_settings);
  section.hidden = !canEdit;
  if (!canEdit) return;

  const roles = dashboard.roles ?? [];
  const current = dashboard.group?.min_eligible_weight ?? 0;

  const options = [
    { weight: 0, label: "すべてのロール（weight 0 以上）" },
    ...roles.map((r) => ({
      weight: r.weight,
      label: `${r.display_name}（weight ${r.weight}）以上`,
    })),
  ];

  const seen = new Set();
  const unique = options.filter((o) => {
    if (seen.has(o.weight)) return false;
    seen.add(o.weight);
    return true;
  });

  select.innerHTML = unique
    .map(
      (o) =>
        `<option value="${o.weight}" ${
          o.weight === current ? "selected" : ""
        }>${escapeHtml(o.label)}</option>`
    )
    .join("");

  const role = dashboard.group?.my_role;
  hint.textContent = role
    ? `あなたのロール: ${role.display_name}（weight ${role.weight}） / グループ最大 weight: ${dashboard.group.max_weight}`
    : "";
}

/** 全体を再描画 */
function renderAll() {
  renderHeader();
  renderTasks();
  renderCalendar();
  renderView();
  renderAdminSettings();
}

/** 管理者設定を保存 */
async function handleSaveAdmin() {
  if (!selectedGroupId) return;
  const select = document.getElementById("pm-min-weight");
  const btn = document.getElementById("pm-save-admin");
  if (!select || !btn) return;

  const minWeight = Number(select.value);
  btn.disabled = true;

  try {
    const response = await fetch("/api/project-management", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        group_id: selectedGroupId,
        min_eligible_weight: minWeight,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      showToast(err.error || "保存に失敗しました", true);
      return;
    }

    showToast("管理者設定を保存しました");
    await loadDashboard(selectedGroupId);
  } catch {
    showToast("保存に失敗しました", true);
  } finally {
    btn.disabled = false;
  }
}

/** イベントをバインド */
function bindEvents() {
  const groupSelect = document.getElementById("pm-group-select");
  groupSelect?.addEventListener("change", () => {
    const id = groupSelect.value;
    selectedGroupId = id;
    loadDashboard(id);
  });

  document
    .getElementById("pm-save-admin")
    ?.addEventListener("click", handleSaveAdmin);

  document
    .getElementById("pm-add-parent")
    ?.addEventListener("click", handleAddParent);

  document
    .getElementById("pm-go-members")
    ?.addEventListener("click", navigateToMembers);

  document
    .getElementById("pm-back-from-members")
    ?.addEventListener("click", navigateToList);

  document
    .getElementById("pm-member-task-child-pick")
    ?.addEventListener("click", openChildPickerDialog);

  document
    .getElementById("pm-member-task-child-clear")
    ?.addEventListener("click", () => {
      memberTaskChildId = null;
      updateMemberTaskChildLabel();
      const clearBtn = document.getElementById("pm-member-task-child-clear");
      if (clearBtn) clearBtn.hidden = true;
    });

  const memberTaskForm = document.getElementById("pm-member-task-form");
  memberTaskForm?.addEventListener("submit", (e) => {
    const submitter = e.submitter;
    if (submitter?.value === "save") {
      e.preventDefault();
      document.getElementById("pm-member-task-dialog")?.close();
      handleSaveMemberTask();
    } else {
      clearMemberTaskDialogState();
    }
  });

  document
    .getElementById("pm-back-to-list")
    ?.addEventListener("click", navigateToList);

  document
    .getElementById("pm-detail-add-child")
    ?.addEventListener("click", () => {
      if (selectedParentId) handleAddChild(selectedParentId);
    });

  window.addEventListener("hashchange", () => {
    selectedParentId = parseHashParent();
    renderView();
  });

  document
    .getElementById("pm-cal-prev")
    ?.addEventListener("click", () => changeMonth(-1));
  document
    .getElementById("pm-cal-next")
    ?.addEventListener("click", () => changeMonth(1));
  document
    .getElementById("pm-cal-today")
    ?.addEventListener("click", goToToday);

  document
    .getElementById("pm-cal-bulk-available")
    ?.addEventListener("click", () => handleBulkWeekdays(true));
  document
    .getElementById("pm-cal-bulk-unavailable")
    ?.addEventListener("click", () => handleBulkWeekdays(false));

  document
    .getElementById("pm-cal-bulk-weekdays")
    ?.addEventListener("change", syncWeekdayHeaderSelection);

  const editChildForm = document.getElementById("pm-edit-child-form");
  editChildForm?.addEventListener("submit", (e) => {
    const submitter = e.submitter;
    if (submitter?.value === "save") {
      e.preventDefault();
      document.getElementById("pm-edit-child-dialog")?.close();
      handleSaveEditChild();
    } else {
      clearEditChildState();
    }
  });

  document.getElementById("pm-edit-clear-dates")?.addEventListener("click", () => {
    const dueInput = document.getElementById("pm-due-input");
    const startInput = document.getElementById("pm-start-input");
    if (dueInput) dueInput.value = "";
    if (startInput) startInput.value = "";
    updateDueEffortPreview();
  });

  document.getElementById("pm-edit-clear-storage")?.addEventListener("click", () => {
    editClearStorage = true;
    storagePickerPath = "";
    const selectedEl = document.getElementById("pm-storage-selected");
    if (selectedEl) selectedEl.textContent = "選択中: （紐づけなし）";
  });

  document.getElementById("pm-edit-complete")?.addEventListener("click", () => {
    if (editingChildProjectId) handleSetCompleted(editingChildProjectId, true);
  });

  document.getElementById("pm-edit-reopen")?.addEventListener("click", () => {
    if (editingChildProjectId) handleSetCompleted(editingChildProjectId, false);
  });

  document.getElementById("pm-edit-delete")?.addEventListener("click", () => {
    if (!editingChildProjectId) return;
    const id = editingChildProjectId;
    document.getElementById("pm-edit-child-dialog")?.close();
    clearEditChildState();
    handleDeleteProject(id);
  });

  const schedulePreview = () => {
    clearTimeout(effortPreviewTimer);
    effortPreviewTimer = setTimeout(() => updateDueEffortPreview(), 200);
  };
  document.getElementById("pm-due-input")?.addEventListener("input", schedulePreview);
  document.getElementById("pm-start-input")?.addEventListener("input", schedulePreview);

  const leaderForm = document.getElementById("pm-leader-form");
  leaderForm?.addEventListener("submit", (e) => {
    const submitter = e.submitter;
    if (submitter?.value === "save") {
      e.preventDefault();
      document.getElementById("pm-leader-dialog")?.close();
      handleSaveLeader();
    } else {
      editingLeaderParentId = null;
    }
  });

  const progressForm = document.getElementById("pm-progress-form");
  progressForm?.addEventListener("submit", (e) => {
    const submitter = e.submitter;
    if (submitter?.value === "save") {
      e.preventDefault();
      document.getElementById("pm-progress-dialog")?.close();
      handleSaveProgress();
    } else {
      editingProgressParentId = null;
    }
  });

  document
    .getElementById("pm-progress-slider")
    ?.addEventListener("input", syncProgressSliderLabel);

  document
    .getElementById("pm-progress-reset")
    ?.addEventListener("click", handleResetProgress);

  const taskForm = document.getElementById("pm-task-form");
  taskForm?.addEventListener("submit", (e) => {
    const submitter = e.submitter;
    if (submitter?.value === "save") {
      e.preventDefault();
      document.getElementById("pm-task-dialog")?.close();
      handleCreateTask();
    } else {
      creatingTaskParentId = null;
    }
  });

  /** 背景クリックでダイアログを閉じる */
  const dialogCloseHandlers = {
    "pm-member-task-dialog": clearMemberTaskDialogState,
    "pm-edit-child-dialog": clearEditChildState,
    "pm-leader-dialog": () => {
      editingLeaderParentId = null;
    },
    "pm-progress-dialog": () => {
      editingProgressParentId = null;
    },
    "pm-task-dialog": () => {
      creatingTaskParentId = null;
    },
  };

  document.querySelectorAll("dialog.pm-dialog").forEach((dialog) => {
    dialog.addEventListener("click", (e) => {
      if (e.target !== dialog) return;
      dialog.close();
      const onClose = dialogCloseHandlers[dialog.id];
      if (onClose) onClose();
    });
  });

  document.addEventListener("mouseup", handleDragEnd);
  document.addEventListener("touchend", handleDragEnd);
  document.addEventListener("touchcancel", handleDragEnd);
}

/** 初期化 */
async function init() {
  const parts = todayJst().split("-").map(Number);
  currentYear = parts[0];
  currentMonth = parts[1];

  bindEvents();
  selectedParentId = parseHashParent();
  const ok = await checkAccess();
  if (!ok) return;
  await loadDashboard();
}

init();
