// src/admin/js/admin.js
import { apiRequest, apiFormRequest } from '../../simulation-request/js/api.js';
import { uploadSimFile } from '../../simulation-request/js/upload/simple.js';
import { setupHomeroomCombobox } from '../../simulation-request/js/homeroom.js';
import {
  DRAFT_STORAGE_KEYS,
  applyReservationDraft,
  extractReservationDraft,
  loadReservationDraft,
  saveReservationDraft,
  updateDraftRestoreButton,
} from '../../simulation-request/js/reservation-draft.js';
import { initShiftPanel, renderShiftPanel } from './shift.js';
import {
  buildSimulatorCapabilityBadges,
  formatNozzleSizes,
  normalizeSimulatorCapabilities,
  nozzleSizesToInputValue,
  parseNozzleSizesInput,
} from '../../simulation-request/js/simulator-capabilities.js';
import { buildSimulatorStatusBadge } from '../../simulation-request/js/simulator-status.js';
import {
  initPrintVideoFolderPicker,
  openPrintVideoFolderPicker,
} from './result-video-folder-picker.js';
let printVideoGroupRoots = [];
let printVideoStoragePath = '';

const STATUS_LABELS = {
  applied: '申請中',
  accepted: '受領済み',
  running: '実行中',
  delivered: '完了',
  failed: '実行失敗',
  cancelled: 'キャンセル',
};

const SCALE_LABELS = { small: 'スモール', medium: 'ミディアム', large: 'ラージ' };
const SCALE_SHORT = { small: 'S', medium: 'M', large: 'L' };
const PURPOSE_LABELS = { ss_s_tan: 'SS・S探', club: '部活', other: 'その他' };
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
const MOBILE_ADMIN_MQ = window.matchMedia('(max-width: 768px)');
const ADMIN_PANEL_TITLES = {
  dashboard: 'カレンダー',
  history: '依頼履歴',
  members: 'メンバー',
  simulators: 'シミュレーター',
  shifts: 'シフト',
};

let currentReservationId = null;
let allReservations = [];
let allMembers = [];
let allSimulators = [];
let memberHomeroomField = null;
let reservationHomeroomField = null;
let adminSelectedDate = '';
let adminUploadResult = null;
let adminFormMode = 'create';
let currentReservationData = null;
let editingSimulatorId = null;
let currentYear;
let currentMonth;
let activePanel = 'dashboard';
let lastMobileAdminView = MOBILE_ADMIN_MQ.matches;

/** Returns whether the compact mobile admin layout is active. */
function isMobileAdminView() {
  return MOBILE_ADMIN_MQ.matches;
}

/** Truncates a title for a narrow calendar cell. */
function truncateForCell(text, maxLen = 6) {
  const trimmed = String(text).trim();
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, Math.max(1, maxLen - 1))}…`;
}

/** Syncs CSS offset for admin mobile top bar. */
function updateAdminStickyOffsets() {
  const topbar = document.getElementById('admin-mobile-topbar');
  const nav = document.getElementById('admin-mobile-nav');
  if (!isMobileAdminView()) {
    document.documentElement.style.removeProperty('--admin-topbar-offset');
    document.documentElement.style.removeProperty('--admin-nav-offset');
    return;
  }
  if (topbar) {
    document.documentElement.style.setProperty('--admin-topbar-offset', `${topbar.offsetHeight}px`);
  }
  if (nav) {
    document.documentElement.style.setProperty('--admin-nav-offset', `${nav.offsetHeight}px`);
  }
}
async function init() {
  const allowed = await checkManagementAccess();
  if (!allowed) return;

  const adminSection = document.getElementById('admin-section');
  const logoutBtn = document.getElementById('logout-btn');
  const modal = document.getElementById('detail-modal');
  const modalClose = document.getElementById('modal-close');
  const saveBtn = document.getElementById('save-btn');
  const acceptBtn = document.getElementById('accept-btn');
  const deleteBtn = document.getElementById('delete-btn');

  const now = new Date();
  currentYear = now.getFullYear();
  currentMonth = now.getMonth() + 1;

  const authed = true;
  showSection(true);

  logoutBtn.addEventListener('click', () => {
    window.location.href = '/';
  });

  modalClose.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  saveBtn.addEventListener('click', saveReservation);
  acceptBtn.addEventListener('click', acceptReservation);
  deleteBtn.addEventListener('click', deleteReservation);
  document.getElementById('edit-content-btn').addEventListener('click', () => {
    if (!currentReservationData) return;
    document.getElementById('detail-modal').classList.remove('open');
    openAdminEditForm(currentReservationData);
  });

  document.getElementById('prev-month').addEventListener('click', () => changeMonth(-1));
  document.getElementById('next-month').addEventListener('click', () => changeMonth(1));
  document.getElementById('admin-prev-month-mobile')?.addEventListener('click', () => changeMonth(-1));
  document.getElementById('admin-next-month-mobile')?.addEventListener('click', () => changeMonth(1));
  document.getElementById('admin-go-today-btn')?.addEventListener('click', goToAdminToday);
  document.getElementById('admin-calendar-month-label-mobile')?.addEventListener('click', () => {
    document.getElementById('admin-calendar-month-chips')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  document.querySelectorAll('.admin-menu-item[data-panel]').forEach((btn) => {
    btn.addEventListener('click', () => switchPanel(btn.dataset.panel));
  });
  document.querySelectorAll('.admin-mobile-nav-item[data-panel]').forEach((btn) => {
    btn.addEventListener('click', () => switchPanel(btn.dataset.panel));
  });
  document.getElementById('admin-mobile-logout')?.addEventListener('click', () => logoutBtn.click());

  MOBILE_ADMIN_MQ.addEventListener('change', () => {
    const mobile = isMobileAdminView();
    if (lastMobileAdminView !== mobile) {
      lastMobileAdminView = mobile;
      renderAdminCalendar();
      renderTodayTasks();
      if (activePanel === 'history') renderHistory();
      if (activePanel === 'members') renderMembers();
      if (activePanel === 'simulators') {
        renderSimulators();
        loadPrintVideoSettings();
      }
      if (activePanel === 'shifts') renderShiftPanel();
    }
    updateAdminStickyOffsets();
  });
  window.addEventListener('resize', updateAdminStickyOffsets);

  memberHomeroomField = setupHomeroomCombobox('member-homeroom', 'member-homeroom-list');
  reservationHomeroomField = setupHomeroomCombobox('admin-homeroom', 'admin-homeroom-list');
  document.getElementById('member-add-form').addEventListener('submit', handleAddMember);
  document.getElementById('simulator-add-form').addEventListener('submit', handleAddSimulator);
  setupSimulatorEditModal();
  setupPrintVideoSettings();
  document.getElementById('calendar-test-btn')?.addEventListener('click', testGoogleCalendar);
  setupAdminFormModal();
  initShiftPanel();

  /** Shows admin panel. */
  function showSection(isAuthed) {
    adminSection.classList.toggle('hidden', !isAuthed);
    document.body.classList.toggle('admin-app', isAuthed);
    if (isAuthed) {
    requestAnimationFrame(() => {
      updateAdminStickyOffsets();
      requestAnimationFrame(updateAdminStickyOffsets);
    });
    refreshAll();
  }
  }

  if (authed) refreshAll();
}

/** Switches admin panel. */
function switchPanel(panel) {
  activePanel = panel;
  document.querySelectorAll('.admin-menu-item[data-panel], .admin-mobile-nav-item[data-panel]').forEach((b) => {
    b.classList.toggle('active', b.dataset.panel === panel);
  });
  document.querySelectorAll('.admin-panel').forEach((p) => p.classList.add('hidden'));
  document.getElementById(`panel-${panel}`)?.classList.remove('hidden');
  const titleEl = document.getElementById('admin-mobile-panel-title');
  if (titleEl) titleEl.textContent = ADMIN_PANEL_TITLES[panel] ?? panel;
  if (panel === 'history') renderHistory();
  if (panel === 'members') renderMembers();
  if (panel === 'simulators') {
    renderSimulators();
    loadPrintVideoSettings();
  }
  if (panel === 'shifts') renderShiftPanel();
  updateAdminStickyOffsets();
}

/** Refreshes dashboard data. */
async function refreshAll() {
  try {
    const [resData, membersData, simulatorsData] = await Promise.all([
      apiRequest('admin/reservations'),
      apiRequest('admin/members'),
      apiRequest('admin/simulators'),
    ]);
    allReservations = resData.reservations.filter((r) => r.status !== 'cancelled');
    allMembers = membersData.members;
    allSimulators = simulatorsData.simulators;
    await renderAdminCalendar();
    renderTodayTasks();
    if (activePanel === 'history') renderHistory();
    if (activePanel === 'members') renderMembers();
    if (activePanel === 'simulators') {
      renderSimulators();
      loadPrintVideoSettings();
    }
  } catch (err) {
    document.getElementById('today-tasks-mount').innerHTML =
      `<p class="alert alert-error">${escapeHtml(err.message)}</p>`;
  }
}

/** Checks management app access via ScienceHUB. */
async function checkManagementAccess() {
  const response = await fetch('/api/apps/simulation-management/access', {
    credentials: 'include',
  });
  if (response.status === 401) {
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/login/?next=${next}`;
    return false;
  }
  if (response.status === 403) {
    document.body.innerHTML =
      '<main style="padding:2rem;font-family:Inter,sans-serif"><h1>アクセス拒否</h1><p>シミュレーション管理アプリを利用する権限がありません。</p><p><a href="/">ダッシュボードに戻る</a></p></main>';
    return false;
  }
  return response.ok;
}

/** Changes calendar month. */
function changeMonth(delta) {
  currentMonth += delta;
  if (currentMonth > 12) {
    currentMonth = 1;
    currentYear++;
  } else if (currentMonth < 1) {
    currentMonth = 12;
    currentYear--;
  }
  renderAdminCalendar();
}

/** Jumps the admin calendar to the current month. */
function goToAdminToday() {
  const now = new Date();
  currentYear = now.getFullYear();
  currentMonth = now.getMonth() + 1;
  renderAdminCalendar();
}

/** Updates the admin mobile today button day number. */
function updateAdminTodayButton() {
  const dayNum = document.getElementById('admin-today-day-num');
  if (!dayNum) return;
  dayNum.textContent = String(Number(getTodayJst().split('-')[2]));
}

/** Renders horizontal month chips for admin mobile calendar. */
function renderAdminMonthChips() {
  const container = document.getElementById('admin-calendar-month-chips');
  if (!container) return;

  container.innerHTML = '';
  for (let month = 1; month <= 12; month++) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'calendar-month-chip';
    chip.setAttribute('role', 'tab');
    chip.setAttribute('aria-selected', month === currentMonth ? 'true' : 'false');
    if (month === currentMonth) chip.classList.add('active');
    chip.textContent = `${month}月`;
    chip.addEventListener('click', () => {
      if (currentMonth === month) return;
      currentMonth = month;
      renderAdminCalendar();
    });
    container.appendChild(chip);
  }

  requestAnimationFrame(() => {
    container.querySelector('.calendar-month-chip.active')?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  });
}

/** Renders weekday headers for admin calendar. */
function renderAdminWeekdayHeaders() {
  const row = document.getElementById('admin-calendar-weekdays-row');
  if (!row) return;

  row.innerHTML = '';
  WEEKDAYS.forEach((day) => {
    const el = document.createElement('div');
    el.className = 'calendar-weekday';
    el.textContent = day;
    row.appendChild(el);
  });
}

/** Renders admin read-only calendar. */
async function renderAdminCalendar() {
  const monthLabel = `${currentYear}年${currentMonth}月`;
  document.getElementById('calendar-month-label').textContent = monthLabel;
  const mobileLabel = document.getElementById('admin-calendar-month-label-mobile-text');
  if (mobileLabel) mobileLabel.textContent = monthLabel;
  updateAdminTodayButton();
  renderAdminMonthChips();

  const grid = document.getElementById('calendar-grid');
  grid.innerHTML = '';
  renderAdminWeekdayHeaders();

  const reservationsByDate = {};
  for (const r of allReservations) {
    const d = r.desired_date;
    if (d.startsWith(`${currentYear}-${String(currentMonth).padStart(2, '0')}`)) {
      if (!reservationsByDate[d]) reservationsByDate[d] = [];
      reservationsByDate[d].push(r);
    }
  }

  const firstDay = new Date(currentYear, currentMonth - 1, 1);
  const lastDay = new Date(currentYear, currentMonth, 0).getDate();
  const startWeekday = firstDay.getDay();
  const todayStr = getTodayJst();

  const prevMonthLast = new Date(currentYear, currentMonth - 1, 0).getDate();
  for (let i = startWeekday - 1; i >= 0; i--) {
    grid.appendChild(createAdminDayCell(prevMonthLast - i, true, {}, todayStr));
  }

  for (let day = 1; day <= lastDay; day++) {
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    grid.appendChild(createAdminDayCell(day, false, reservationsByDate, todayStr, dateStr));
  }

  const totalCells = startWeekday + lastDay;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let day = 1; day <= remaining; day++) {
    grid.appendChild(createAdminDayCell(day, true, {}, todayStr));
  }

  updateAdminStickyOffsets();
}

/** Creates an admin calendar day cell. */
function createAdminDayCell(dayNum, otherMonth, reservationsByDate, todayStr, dateStr) {
  const cell = document.createElement('div');
  cell.className = 'calendar-day';
  if (otherMonth) cell.classList.add('other-month');
  if (dateStr === todayStr) cell.classList.add('today');
  if (dateStr === adminSelectedDate) cell.classList.add('selected');

  const dayReservations = dateStr && reservationsByDate[dateStr] ? reservationsByDate[dateStr] : [];
  const hasMediumOrLarge = dayReservations.some((r) => r.sim_scale === 'medium' || r.sim_scale === 'large');
  const smallCount = dayReservations.filter((r) => r.sim_scale === 'small').length;
  const isFull = hasMediumOrLarge || smallCount >= 2;

  if (dateStr && !otherMonth) {
    cell.dataset.date = dateStr;
    if (dateStr < todayStr) {
      cell.classList.add('disabled');
    } else if (isFull) {
      cell.classList.add('full');
      cell.addEventListener('click', () => alert('この日はもう満杯です'));
    } else {
      cell.classList.add('clickable');
      cell.addEventListener('click', () => openAdminFormForDate(dateStr));
    }
  }

  const num = document.createElement('div');
  num.className = 'calendar-day-number';
  num.textContent = dayNum;
  cell.appendChild(num);

  if (dayReservations.length) {
    const slotsWrap = document.createElement('div');
    slotsWrap.className = 'calendar-slots';

    const sorted = [...dayReservations].sort((a, b) => {
      const order = { small: 0, medium: 1, large: 2 };
      return (order[a.sim_scale] ?? 9) - (order[b.sim_scale] ?? 9);
    });

    for (const r of sorted) {
      const slot = document.createElement('button');
      slot.type = 'button';
      slot.className = `calendar-slot admin-calendar-slot ${r.sim_scale}`;
      const staffLabel = r.sim_staff_label ? `担当者: ${r.sim_staff_label}` : '';

      if (isMobileAdminView()) {
        slot.classList.add('calendar-slot-compact');
        slot.innerHTML = `<span class="calendar-slot-compact-label">${escapeHtml(`${SCALE_SHORT[r.sim_scale]} ${truncateForCell(r.title, 5)}`)}</span>`;
        slot.title = [r.title, staffLabel].filter(Boolean).join(' / ');
      } else {
        slot.innerHTML = [
          `<span class="calendar-slot-scale">${SCALE_SHORT[r.sim_scale]}</span>`,
          `<span class="calendar-slot-title-text">${escapeHtml(r.title)}</span>`,
          staffLabel ? `<span class="calendar-slot-staff">${escapeHtml(staffLabel)}</span>` : '',
        ].join('');
        slot.title = [r.title, staffLabel].filter(Boolean).join(' / ');
      }

      slot.addEventListener('click', (e) => {
        e.stopPropagation();
        openDetail(r.id);
      });
      slotsWrap.appendChild(slot);
    }

    cell.appendChild(slotsWrap);
  }

  return cell;
}

/** Sets up the admin new-reservation form modal. */
function setupAdminFormModal() {
  const modal = document.getElementById('admin-form-modal');
  const form = document.getElementById('admin-reservation-form');
  const closeBtn = document.getElementById('admin-form-modal-close');
  const cancelBtn = document.getElementById('admin-form-cancel-btn');
  const purposeInputs = form.querySelectorAll('input[name="purpose"]');
  const purposeOtherGroup = document.getElementById('admin-purpose-other-group');
  const uploadZone = document.getElementById('admin-upload-zone');
  const fileInput = document.getElementById('admin-print-file');
  const progressBar = document.getElementById('admin-upload-progress');
  const progressFill = document.getElementById('admin-upload-progress-fill');
  const uploadStatus = document.getElementById('admin-upload-status');

  const closeModal = () => {
    modal.classList.remove('open');
    adminSelectedDate = '';
    adminFormMode = 'create';
    document.querySelectorAll('#calendar-grid .calendar-day.selected').forEach((el) => {
      el.classList.remove('selected');
    });
    resetAdminFormUi();
  };

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  purposeInputs.forEach((input) => {
    input.addEventListener('change', () => {
      purposeOtherGroup.classList.toggle('hidden', input.value !== 'other' || !input.checked);
    });
  });

  uploadZone.addEventListener('click', () => fileInput.click());
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) handleAdminFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) handleAdminFile(fileInput.files[0]);
  });

  const restoreDraftBtn = document.getElementById('admin-restore-draft-btn');
  restoreDraftBtn.addEventListener('click', () => {
    const draft = loadReservationDraft(DRAFT_STORAGE_KEYS.admin);
    if (!draft) {
      updateDraftRestoreButton(restoreDraftBtn, DRAFT_STORAGE_KEYS.admin);
      return;
    }
    applyReservationDraft(form, draft, {
      homeroomInputId: 'admin-homeroom',
      purposeOtherGroupId: 'admin-purpose-other-group',
    });
    showAdminFormAlert('前回の入力内容を反映しました', 'success');
  });

  /** Handles print file upload for admin reservation form. */
  async function handleAdminFile(file) {
    adminUploadResult = null;
    document.getElementById('admin-form-alert').innerHTML = '';
    progressBar.classList.remove('hidden');
    progressFill.style.width = '0%';
    uploadStatus.textContent = `アップロード中: ${file.name} (${formatSize(file.size)})`;

    try {
      adminUploadResult = await uploadSimFile(file, (pct) => {
        progressFill.style.width = `${pct}%`;
      });
      uploadStatus.textContent = `アップロード完了: ${file.name}`;
      uploadStatus.style.color = 'var(--color-success)';
    } catch (err) {
      uploadStatus.textContent = err.message;
      uploadStatus.style.color = 'var(--color-error)';
      progressBar.classList.add('hidden');
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const alertBox = document.getElementById('admin-form-alert');
    alertBox.innerHTML = '';

    const isEdit = adminFormMode === 'edit';
    if (!isEdit && !adminUploadResult) {
      showAdminFormAlert('ファイルをアップロードしてください', 'error');
      return;
    }

    const formData = new FormData(form);
    const purpose = formData.get('purpose');
    const printScale = formData.get('sim_scale');
    const desiredDate = isEdit
      ? document.getElementById('admin-desired-date-input').value
      : formData.get('desired_date');

    if (!desiredDate) {
      showAdminFormAlert('希望実施日を選択してください', 'error');
      return;
    }

    if (purpose === 'other' && !formData.get('purpose_other')?.trim()) {
      showAdminFormAlert('目的が「その他」の場合は内容を入力してください', 'error');
      return;
    }

    if (!reservationHomeroomField.isValid()) {
      showAdminFormAlert('ホームルームは 101〜109、201〜209、301〜309 から選択してください', 'error');
      return;
    }

    if (!formData.get('simulator_id')) {
      showAdminFormAlert('シミュレーター機種を選択してください', 'error');
      return;
    }

    const excludeParam = isEdit ? `&exclude_reservation_id=${currentReservationId}` : '';

    try {
      const availability = await apiRequest(
        `admin/calendar/availability?date=${desiredDate}&scale=${printScale}${excludeParam}`
      );

      if (availability.isFull) {
        showAdminFormAlert('この日はもう満杯です。別の日付を選んでください', 'error');
        return;
      }

      if (!availability.canBook) {
        showAdminFormAlert('選択したシミュレーション規模はこの日付では予約できません', 'error');
        return;
      }

      const payload = {
        homeroom: reservationHomeroomField.getValue(),
        student_number: Number(formData.get('student_number')),
        student_name: formData.get('student_name'),
        title: formData.get('title').trim(),
        purpose,
        purpose_other: purpose === 'other' ? formData.get('purpose_other') : null,
        summary: formData.get('summary')?.trim() || null,
        sim_notes: formData.get('sim_notes')?.trim() || null,
        sim_scale: printScale,
        simulator_id: formData.get('simulator_id'),
        desired_date: desiredDate,
      };

      if (adminUploadResult) {
        payload.stl_r2_key = adminUploadResult.r2Key;
        payload.stl_filename = adminUploadResult.filename;
        payload.stl_size_bytes = adminUploadResult.size;
      }

      const submitBtn = document.getElementById('admin-submit-btn');
      submitBtn.disabled = true;

      if (isEdit) {
        await apiRequest(`admin/reservations/${currentReservationId}/content`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        showAdminFormAlert('予約内容を修正しました。再承認が必要です', 'success');
      } else {
        if (!adminUploadResult) {
          showAdminFormAlert('ファイルをアップロードしてください', 'error');
          submitBtn.disabled = false;
          return;
        }
        await apiRequest('admin/reservations', {
          method: 'POST',
          body: JSON.stringify({
            ...payload,
            stl_r2_key: adminUploadResult.r2Key,
            stl_filename: adminUploadResult.filename,
            stl_size_bytes: adminUploadResult.size,
          }),
        });
        saveReservationDraft(
          DRAFT_STORAGE_KEYS.admin,
          extractReservationDraft(form, reservationHomeroomField)
        );
        showAdminFormAlert('予約を追加しました', 'success');
      }

      submitBtn.disabled = false;
      resetAdminForm();
      adminFormMode = 'create';
      await refreshAll();
      setTimeout(closeModal, 1200);
    } catch (err) {
      showAdminFormAlert(err.message, 'error');
      document.getElementById('admin-submit-btn').disabled = false;
    }
  });

  /** Resets the admin reservation form. */
  function resetAdminForm() {
    form.reset();
    adminUploadResult = null;
    progressBar.classList.add('hidden');
    uploadStatus.textContent = '';
    purposeOtherGroup.classList.add('hidden');
    document.getElementById('admin-scale-restriction-hint').classList.add('hidden');
    setAdminScaleOptions(['small', 'medium', 'large']);
    resetAdminFormUi();
  }
}

/** Restores admin form modal UI to create mode defaults. */
function resetAdminFormUi() {
  document.getElementById('admin-selected-date-display').classList.remove('hidden');
  document.getElementById('admin-desired-date-group').classList.add('hidden');
  document.getElementById('admin-submit-btn').textContent = '予約を追加';
  document.getElementById('admin-restore-draft-btn')?.classList.remove('hidden');
}

/** Opens the admin reservation form for a selected date. */
async function openAdminFormForDate(dateStr) {
  adminFormMode = 'create';
  resetAdminFormUi();
  const todayStr = getTodayJst();
  if (dateStr < todayStr) {
    alert('当日より前の日付には予約できません');
    return;
  }

  let availability;
  try {
    availability = await apiRequest(`admin/calendar/availability?date=${dateStr}`);
  } catch (err) {
    alert(err.message);
    return;
  }

  if (availability.isFull) {
    alert('この日はもう満杯です');
    return;
  }

  adminSelectedDate = dateStr;
  document.querySelectorAll('#calendar-grid .calendar-day.selected').forEach((el) => {
    el.classList.remove('selected');
  });
  document.querySelector(`#calendar-grid .calendar-day[data-date="${dateStr}"]`)?.classList.add('selected');

  document.getElementById('admin-desired-date').value = dateStr;
  document.getElementById('admin-selected-date-display').textContent = `希望実施日: ${formatDateJa(dateStr)}`;
  document.getElementById('admin-form-modal-title').textContent = `${formatDateJa(dateStr)} の新規予約`;
  document.getElementById('admin-form-alert').innerHTML = '';

  setAdminScaleOptions(availability.availableScales);

  const hint = document.getElementById('admin-scale-restriction-hint');
  if (availability.scales.includes('small') && availability.availableScales.length === 1) {
    hint.textContent = 'この日はスモール依頼が入っているため、スモールのみ選択できます。';
    hint.classList.remove('hidden');
  } else {
    hint.classList.add('hidden');
  }

  document.getElementById('admin-form-modal').classList.add('open');
  populateAdminSimulatorSelect();
  updateDraftRestoreButton(
    document.getElementById('admin-restore-draft-btn'),
    DRAFT_STORAGE_KEYS.admin
  );
}

/** Opens the admin form to edit an existing reservation. */
async function openAdminEditForm(r) {
  adminFormMode = 'edit';
  adminUploadResult = null;
  currentReservationId = r.id;

  const form = document.getElementById('admin-reservation-form');
  form.reset();
  document.getElementById('admin-form-alert').innerHTML =
    '<p class="hint">修正後は申請中に戻り、再受領が必要です。Googleカレンダーの予定も削除されます。</p>';
  document.getElementById('admin-upload-progress').classList.add('hidden');
  document.getElementById('admin-upload-status').textContent =
    `現在のファイル: ${r.stl_filename}（変更しない場合はそのまま）`;

  document.getElementById('admin-selected-date-display').classList.add('hidden');
  document.getElementById('admin-desired-date-group').classList.remove('hidden');
  document.getElementById('admin-desired-date-input').value = r.desired_date;
  document.getElementById('admin-restore-draft-btn')?.classList.add('hidden');

  document.getElementById('admin-homeroom').value = r.homeroom;
  document.getElementById('admin-student-number').value = r.student_number;
  document.getElementById('admin-student-name').value = r.student_name;
  document.getElementById('admin-title').value = r.title;
  document.getElementById('admin-summary').value = r.summary ?? '';
  document.getElementById('admin-sim-notes').value = r.sim_notes ?? '';
  document.getElementById('admin-purpose-other').value = r.purpose_other ?? '';

  const purposeRadio = form.querySelector(`input[name="purpose"][value="${r.purpose}"]`);
  if (purposeRadio) purposeRadio.checked = true;
  document.getElementById('admin-purpose-other-group').classList.toggle('hidden', r.purpose !== 'other');

  try {
    const availability = await apiRequest(
      `admin/calendar/availability?date=${r.desired_date}&exclude_reservation_id=${r.id}`
    );
    setAdminScaleOptions(availability.availableScales);
    const scaleRadio = form.querySelector(`input[name="sim_scale"][value="${r.sim_scale}"]`);
    if (scaleRadio && !scaleRadio.disabled) scaleRadio.checked = true;

    const hint = document.getElementById('admin-scale-restriction-hint');
    if (availability.scales.includes('small') && availability.availableScales.length === 1) {
      hint.textContent = 'この日はスモール依頼が入っているため、スモールのみ選択できます。';
      hint.classList.remove('hidden');
    } else {
      hint.classList.add('hidden');
    }
  } catch (err) {
    showAdminFormAlert(err.message, 'error');
  }

  document.getElementById('admin-form-modal-title').textContent = `${r.title} を修正`;
  document.getElementById('admin-submit-btn').textContent = '修正を保存';
  populateAdminSimulatorSelect(r.simulator_id);
  document.getElementById('admin-form-modal').classList.add('open');
}

/** Enables/disables print scale options in the admin form. */
function setAdminScaleOptions(availableScales) {
  const scales = ['small', 'medium', 'large'];
  let firstEnabled = null;

  scales.forEach((scale) => {
    const label = document.getElementById(`admin-scale-label-${scale}`);
    const input = label.querySelector('input');
    const enabled = availableScales.includes(scale);
    input.disabled = !enabled;
    label.classList.toggle('disabled', !enabled);
    if (enabled && !firstEnabled) firstEnabled = input;
  });

  document.querySelectorAll('#admin-reservation-form input[name="sim_scale"]').forEach((i) => {
    i.checked = false;
  });
  if (firstEnabled) firstEnabled.checked = true;
}

/** Shows an alert in the admin reservation form. */
function showAdminFormAlert(message, type) {
  document.getElementById('admin-form-alert').innerHTML =
    `<div class="alert alert-${type}">${escapeHtml(message)}</div>`;
}

/** Formats a date string for Japanese display. */
function formatDateJa(isoDate) {
  const [y, m, d] = isoDate.split('-');
  return `${y}年${Number(m)}月${Number(d)}日`;
}

/** Builds admin reservation card HTML for mobile lists. */
function adminReservationCardHtml(r, { showPurpose = false } = {}) {
  const scaleLabel = SCALE_LABELS[r.sim_scale];
  const metaParts = [];
  if (showPurpose) metaParts.push(PURPOSE_LABELS[r.purpose] ?? r.purpose);
  if (r.sim_staff_label) metaParts.push(`担当: ${r.sim_staff_label}`);

  return `
    <article class="reservation-card admin-list-card">
      <div class="reservation-card-header">
        <time class="reservation-card-date" datetime="${r.desired_date}">${r.desired_date}</time>
        <span class="status-badge status-${r.status}">${STATUS_LABELS[r.status]}</span>
      </div>
      <div class="reservation-card-main">
        <span class="admin-card-hr">${escapeHtml(r.homeroom)}</span>
        <span class="reservation-card-title">${escapeHtml(r.title)}</span>
        <span class="reservation-card-scale">${escapeHtml(scaleLabel)}</span>
      </div>
      ${metaParts.length ? `<p class="admin-card-meta hint">${escapeHtml(metaParts.join(' · '))}</p>` : ''}
      <button type="button" class="btn btn-secondary btn-sm admin-card-detail-btn" data-id="${r.id}">詳細</button>
    </article>`;
}

/** Builds admin reservation table HTML for desktop lists. */
function adminReservationTableHtml(rows, columns) {
  const head = columns.map((c) => `<th>${c.label}</th>`).join('');
  const body = rows
    .map((r) => {
      const cells = columns.map((c) => `<td>${c.cell(r)}</td>`).join('');
      return `<tr>${cells}</tr>`;
    })
    .join('');

  return `
    <div class="table-wrap admin-table-wrap">
      <table>
        <thead><tr>${head}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>`;
}

/** Renders today's task list. */
function renderTodayTasks() {
  const mount = document.getElementById('today-tasks-mount');
  const today = getTodayJst();
  const tasks = allReservations
    .filter((r) => r.desired_date === today)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));

  if (!tasks.length) {
    mount.innerHTML = '<p class="hint admin-list-empty">本日のシミュレーション依頼はありません</p>';
    return;
  }

  if (isMobileAdminView()) {
    mount.innerHTML = `<div class="reservation-card-list">${tasks.map((r) => adminReservationCardHtml(r, { showPurpose: true })).join('')}</div>`;
  } else {
    mount.innerHTML = adminReservationTableHtml(tasks, [
      { label: '希望日', cell: (r) => r.desired_date },
      { label: 'HR', cell: (r) => escapeHtml(r.homeroom) },
      { label: 'タイトル', cell: (r) => escapeHtml(r.title) },
      { label: '規模', cell: (r) => SCALE_LABELS[r.sim_scale] },
      { label: '目的', cell: (r) => PURPOSE_LABELS[r.purpose] },
      { label: 'ステータス', cell: (r) => `<span class="status-badge status-${r.status}">${STATUS_LABELS[r.status]}</span>` },
      { label: '担当者', cell: (r) => formatStaffCell(r.sim_staff_label) },
      { label: '', cell: (r) => `<button class="btn btn-secondary btn-sm" data-id="${r.id}">詳細</button>` },
    ]);
  }

  bindDetailButtons(mount);
}

/** Renders print history table. */
function renderHistory() {
  const mount = document.getElementById('history-mount');
  const sorted = [...allReservations].sort((a, b) => {
    const dateCmp = b.desired_date.localeCompare(a.desired_date);
    return dateCmp !== 0 ? dateCmp : b.created_at.localeCompare(a.created_at);
  });

  if (!sorted.length) {
    mount.innerHTML = '<p class="hint admin-list-empty">履歴がありません</p>';
    return;
  }

  if (isMobileAdminView()) {
    mount.innerHTML = `<div class="reservation-card-list">${sorted.map((r) => adminReservationCardHtml(r)).join('')}</div>`;
  } else {
    mount.innerHTML = adminReservationTableHtml(sorted, [
      { label: '希望日', cell: (r) => r.desired_date },
      { label: 'HR', cell: (r) => escapeHtml(r.homeroom) },
      { label: 'タイトル', cell: (r) => escapeHtml(r.title) },
      { label: '規模', cell: (r) => SCALE_LABELS[r.sim_scale] },
      { label: 'ステータス', cell: (r) => `<span class="status-badge status-${r.status}">${STATUS_LABELS[r.status]}</span>` },
      { label: '担当者', cell: (r) => formatStaffCell(r.sim_staff_label) },
      { label: '', cell: (r) => `<button class="btn btn-secondary btn-sm" data-id="${r.id}">詳細</button>` },
    ]);
  }

  bindDetailButtons(mount);
}

/** Formats staff label for table/calendar display. */
function formatStaffCell(label) {
  if (!label) return '—';
  return escapeHtml(`担当者: ${label}`);
}

/** Renders the members management table. */
function renderMembers() {
  const mount = document.getElementById('members-mount');

  if (!allMembers.length) {
    mount.innerHTML = '<p class="hint admin-list-empty">登録されているメンバーはいません</p>';
    return;
  }

  if (isMobileAdminView()) {
    mount.innerHTML = `<div class="admin-member-card-list">${allMembers.map(adminMemberCardHtml).join('')}</div>`;
  } else {
    mount.innerHTML = `
      <div class="table-wrap admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>ホームルーム</th>
              <th>出席番号</th>
              <th>名前</th>
              <th>Discord ID</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${allMembers
              .map(
                (m) => `
              <tr>
                <td>${escapeHtml(m.homeroom)}</td>
                <td>${m.student_number}</td>
                <td>${escapeHtml(m.name)}</td>
                <td>
                  <input type="text" class="member-discord-input" data-member-id="${m.id}" value="${escapeHtml(m.discord_user_id ?? '')}" placeholder="Discord ID" inputmode="numeric" />
                </td>
                <td><button class="btn btn-secondary btn-sm" data-member-id="${m.id}" type="button">削除</button></td>
              </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>`;
  }

  mount.querySelectorAll('.member-discord-input').forEach((input) => {
    input.addEventListener('change', () => handleMemberDiscordSave(input.dataset.memberId, input));
  });

  mount.querySelectorAll('button[data-member-id]').forEach((btn) => {
    btn.addEventListener('click', () => handleDeleteMember(btn.dataset.memberId));
  });
}

/** Builds a member card for mobile admin list. */
function adminMemberCardHtml(m) {
  return `
    <article class="admin-member-card">
      <div class="admin-member-card-header">
        <span class="admin-member-name">${escapeHtml(m.name)}</span>
        <span class="admin-member-hr">${escapeHtml(m.homeroom)} · ${m.student_number}番</span>
      </div>
      <div class="form-group admin-member-discord-field">
        <label for="member-discord-${m.id}">Discord ID</label>
        <input type="text" id="member-discord-${m.id}" class="member-discord-input" data-member-id="${m.id}" value="${escapeHtml(m.discord_user_id ?? '')}" placeholder="任意（朝6時メンション用）" inputmode="numeric" />
      </div>
      <button class="btn btn-secondary btn-sm" data-member-id="${m.id}" type="button">削除</button>
    </article>`;
}

/** Builds print staff select options filtered by date availability. */
function buildPrintStaffOptions(selectedId, staffList, { placeholder = '未割り当て' } = {}) {
  const options = [`<option value="">${escapeHtml(placeholder)}</option>`];
  const list = staffList ?? allMembers;
  for (const m of list) {
    const label = `${m.name}（${m.homeroom}）`;
    const selected = m.id === selectedId ? ' selected' : '';
    options.push(`<option value="${m.id}"${selected}>${escapeHtml(label)}</option>`);
  }
  return options.join('');
}

/** Tests Google Calendar API connection from admin panel. */
async function testGoogleCalendar() {
  const resultEl = document.getElementById('calendar-test-result');
  resultEl.innerHTML = '<p class="hint">テスト中...</p>';

  try {
    const data = await apiRequest('admin/calendar/status');
    if (!data.configured) {
      resultEl.innerHTML = `<div class="alert alert-error">${escapeHtml(data.error ?? 'シークレットが未設定です')}</div>`;
      return;
    }
    if (data.ok) {
      resultEl.innerHTML = `<div class="alert alert-success">接続OK（カレンダー: ${escapeHtml(data.calendarId ?? '')}）</div>`;
      return;
    }
    resultEl.innerHTML = `<div class="alert alert-error">${escapeHtml(data.error ?? '接続に失敗しました')}</div>`;
  } catch (err) {
    resultEl.innerHTML = `<div class="alert alert-error">${escapeHtml(err.message)}</div>`;
  }
}

/** Handles adding a new member. */
async function handleAddMember(e) {
  e.preventDefault();
  const alertEl = document.getElementById('member-add-alert');
  alertEl.innerHTML = '';

  if (!memberHomeroomField.isValid()) {
    alertEl.innerHTML = '<div class="alert alert-error">ホームルームは 101〜109、201〜209、301〜309 から選択してください</div>';
    return;
  }

  try {
    await apiRequest('admin/members', {
      method: 'POST',
      body: JSON.stringify({
        homeroom: memberHomeroomField.getValue(),
        student_number: Number(document.getElementById('member-student-number').value),
        name: document.getElementById('member-name').value.trim(),
        discord_user_id: document.getElementById('member-discord-id').value.trim() || null,
      }),
    });
    document.getElementById('member-add-form').reset();
    await refreshAll();
    alertEl.innerHTML = '<div class="alert alert-success">メンバーを追加しました</div>';
  } catch (err) {
    alertEl.innerHTML = `<div class="alert alert-error">${escapeHtml(err.message)}</div>`;
  }
}

/** Saves a member's Discord user ID. */
async function handleMemberDiscordSave(id, inputEl) {
  const value = inputEl.value.trim();
  try {
    const data = await apiRequest(`admin/members/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ discord_user_id: value || null }),
    });
    const idx = allMembers.findIndex((m) => m.id === id);
    if (idx >= 0) allMembers[idx] = data.member;
    inputEl.classList.remove('input-error');
  } catch (err) {
    inputEl.classList.add('input-error');
    alert(err.message);
  }
}

/** Handles deleting a member. */
async function handleDeleteMember(id) {
  if (!confirm('このメンバーを削除しますか？')) return;

  try {
    await apiRequest(`admin/members/${id}`, { method: 'DELETE' });
    await refreshAll();
  } catch (err) {
    alert(err.message);
  }
}

/** Binds detail buttons and card taps in an admin list container. */
function bindDetailButtons(container) {
  container.querySelectorAll('button[data-id]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openDetail(btn.dataset.id);
    });
  });

  container.querySelectorAll('.admin-list-card').forEach((card) => {
    const btn = card.querySelector('button[data-id]');
    if (!btn) return;
    card.tabIndex = 0;
    card.addEventListener('click', () => openDetail(btn.dataset.id));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDetail(btn.dataset.id);
      }
    });
  });
}

/** Opens the reservation detail modal. */
async function openDetail(id) {
  currentReservationId = id;
  const modal = document.getElementById('detail-modal');
  const body = document.getElementById('modal-body');

  try {
    const data = await apiRequest(`admin/reservations/${id}`);
    const r = data.reservation;
    currentReservationData = r.status === 'cancelled' ? null : r;
    const availableStaff = data.available_staff ?? allMembers;

    const isApplication = r.status === 'applied';
    const statusField = isApplication
      ? `<div class="form-group" style="margin-top:1.5rem">
          <label>ステータス</label>
          <p><span class="status-badge status-applied">${STATUS_LABELS.applied}</span></p>
          <p class="hint">実行担当を選び「予約を受領」で受領済みになります。</p>
        </div>`
      : `<div class="form-group" style="margin-top:1.5rem">
          <label for="edit-status">ステータス</label>
          <select id="edit-status">
            ${['accepted', 'running', 'delivered', 'failed', 'cancelled']
              .map((k) => `<option value="${k}" ${r.status === k ? 'selected' : ''}>${STATUS_LABELS[k]}</option>`)
              .join('')}
          </select>
        </div>
        <div class="form-group">
          <label for="edit-status-comment">ステータスコメント</label>
          <textarea id="edit-status-comment" rows="3" maxlength="500" placeholder="例: サポート材が足りず実行に失敗しました">${escapeHtml(r.status_comment ?? '')}</textarea>
          <p class="hint">実行失敗などの理由を記入できます。依頼者の予約詳細にも表示されます。</p>
        </div>`;

    const printStaffField = isApplication
      ? `<div class="form-group">
          <label for="edit-print-staff">実行担当は</label>
          <select id="edit-print-staff" required>
            ${buildPrintStaffOptions(null, availableStaff, { placeholder: '選択してください' })}
          </select>
        </div>`
      : `<div class="form-group">
          <label for="edit-print-staff">実行担当は</label>
          <select id="edit-print-staff">
            ${buildPrintStaffOptions(r.sim_staff_member_id, availableStaff)}
          </select>
        </div>`;

    body.innerHTML = `
      <div class="detail-grid">
        <div class="detail-row"><span class="detail-label">タイトル</span><span>${escapeHtml(r.title)}</span></div>
        <div class="detail-row"><span class="detail-label">希望実施日</span><span>${r.desired_date}</span></div>
        <div class="detail-row"><span class="detail-label">HR・出席番号</span><span>${escapeHtml(r.homeroom)} ${r.student_number}番</span></div>
        <div class="detail-row"><span class="detail-label">名前</span><span>${escapeHtml(r.student_name)}</span></div>
        <div class="detail-row"><span class="detail-label">目的</span><span>${PURPOSE_LABELS[r.purpose]}${r.purpose_other ? `（${escapeHtml(r.purpose_other)}）` : ''}</span></div>
        <div class="detail-row"><span class="detail-label">概要</span><span>${escapeHtml(r.summary)}</span></div>
        <div class="detail-row"><span class="detail-label">シミュレーション規模</span><span>${SCALE_LABELS[r.sim_scale]}</span></div>
        <div class="detail-row"><span class="detail-label">シミュレーター機種</span><span>${escapeHtml(r.simulator_name ?? '未指定')}${r.simulator_capabilities ? `（ノズル ${escapeHtml(formatNozzleSizes(r.simulator_capabilities.nozzle_sizes_mm))}${r.simulator_capabilities.can_record_result_video ? '・動画撮影可' : ''}）` : ''}</span></div>
        ${r.sim_notes ? `<div class="detail-row"><span class="detail-label">実行時の注意点</span><span>${escapeHtml(r.sim_notes).replace(/\n/g, '<br>')}</span></div>` : ''}
        ${r.request_result_video ? `<div class="detail-row"><span class="detail-label">動画撮影</span><span>依頼者が希望</span></div>` : ''}
        <div class="detail-row"><span class="detail-label">ファイル</span><span>${escapeHtml(r.stl_filename)} (${formatSize(r.stl_size_bytes)})</span></div>
        <div class="detail-row"><span class="detail-label">申請日時</span><span>${r.created_at}</span></div>
      </div>
      ${statusField}
      ${printStaffField}
      <div class="form-group" style="margin-top:1rem">
        <label>結果動画（クラウドストレージ）</label>
        ${r.result_video_storage_path
          ? `<p class="hint">${escapeHtml(r.result_video_filename ?? '動画')} (${formatSize(r.result_video_size_bytes ?? 0)})</p>
             <a href="/api/simulation/admin/reservations/${r.id}/result-video/download" class="btn btn-secondary btn-sm" download>動画をダウンロード</a>
             <button type="button" class="btn btn-secondary btn-sm" id="delete-result-video-btn">動画を削除</button>`
          : '<p class="hint">まだアップロードされていません。</p>'}
        <input type="file" id="admin-result-video-file" accept="video/*,.mp4,.mov,.webm,.mkv,.m4v" style="margin-top:0.5rem" />
        <button type="button" class="btn btn-primary btn-sm" id="upload-result-video-btn" style="margin-top:0.5rem">動画をアップロード</button>
        <p class="hint">mp4 / mov / webm など（最大500MB）。保存先はシミュレーター管理の「結果動画の保存先」で設定します。</p>
        <p class="hint hidden" id="result-video-upload-status"></p>
      </div>
      <a href="/api/simulation/admin/stl/${r.id}" class="btn btn-secondary btn-sm" download>ファイルをダウンロード</a>
    `;

    document.getElementById('upload-result-video-btn')?.addEventListener('click', () =>
      handleUploadPrintVideo(r.id)
    );
    document.getElementById('delete-result-video-btn')?.addEventListener('click', () =>
      handleDeletePrintVideo(r.id)
    );

    document.getElementById('accept-btn').classList.toggle('hidden', !isApplication);
    document.getElementById('save-btn').classList.toggle('hidden', isApplication);
    document.getElementById('edit-content-btn').classList.toggle('hidden', r.status === 'cancelled');

    modal.classList.add('open');
  } catch (err) {
    alert(err.message);
  }
}

/** Accepts a reservation application with print staff. */
async function acceptReservation() {
  if (!currentReservationId) return;

  const staffId = document.getElementById('edit-print-staff')?.value;
  if (!staffId) {
    alert('実行担当者を選択してください');
    return;
  }

  try {
    const data = await apiRequest(`admin/reservations/${currentReservationId}/accept`, {
      method: 'POST',
      body: JSON.stringify({ sim_staff_member_id: staffId }),
    });

    document.getElementById('detail-modal').classList.remove('open');
    await refreshAll();

    if (data.calendar && !data.calendar.ok) {
      alert(
        `予約は受領しましたが、Googleカレンダーへの追加に失敗しました。\n\n${data.calendar.error}\n\n管理画面のカレンダー接続テストを確認してください。`
      );
    }
  } catch (err) {
    alert(err.message);
  }
}

/** Saves admin edits to a reservation. */
async function saveReservation() {
  if (!currentReservationId) return;

  try {
    await apiRequest(`admin/reservations/${currentReservationId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: document.getElementById('edit-status').value,
        sim_staff_member_id: document.getElementById('edit-print-staff').value || null,
        status_comment: document.getElementById('edit-status-comment')?.value?.trim() || null,
      }),
    });

    document.getElementById('detail-modal').classList.remove('open');
    await refreshAll();
  } catch (err) {
    alert(err.message);
  }
}

/** Deletes a reservation. */
async function deleteReservation() {
  if (!currentReservationId) return;
  if (!confirm('この予約を削除しますか？アップロードされたファイルも削除されます。')) return;

  try {
    await apiRequest(`admin/reservations/${currentReservationId}`, { method: 'DELETE' });
    document.getElementById('detail-modal').classList.remove('open');
    currentReservationId = null;
    await refreshAll();
  } catch (err) {
    alert(err.message);
  }
}

/** Returns today's date in JST. */
function getTodayJst() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo' }).format(new Date());
}

/** Escapes HTML special characters. */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

/** Formats byte size for display. */
function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Populates the admin simulator select dropdown. */
function populateAdminSimulatorSelect(selectedId = '') {
  const select = document.getElementById('admin-simulator-select');
  if (!select) return;

  if (!allSimulators.length) {
    select.innerHTML = '<option value="">シミュレーターが登録されていません</option>';
    select.disabled = true;
    return;
  }

  select.disabled = false;
  select.innerHTML = allSimulators
    .map(
      (p) =>
        `<option value="${escapeHtml(p.id)}"${p.id === selectedId ? ' selected' : ''}>${escapeHtml(p.name)}</option>`
    )
    .join('');
}

/** 結果動画保存先設定のイベントを登録 */
function setupPrintVideoSettings() {
  const saveBtn = document.getElementById('result-video-settings-save');
  const browseBtn = document.getElementById('result-video-browse-btn');

  saveBtn?.addEventListener('click', savePrintVideoSettings);
  browseBtn?.addEventListener('click', async () => {
    if (!printVideoGroupRoots.length) {
      await loadPrintVideoSettings();
    }
    openPrintVideoFolderPicker(printVideoStoragePath);
  });

  initPrintVideoFolderPicker({
    getGroupRoots: () => printVideoGroupRoots,
    onSelect: (path) => {
      printVideoStoragePath = path;
      updatePrintVideoPathDisplay();
    },
  });
}

/** 保存先パス表示を更新 */
function updatePrintVideoPathDisplay() {
  const input = document.getElementById('result-video-storage-path');
  if (!input) return;

  if (!printVideoStoragePath) {
    input.value = '';
    input.placeholder = '未設定（参照から選択）';
    return;
  }

  const roots = printVideoGroupRoots;
  const matchedRoot = roots.find(
    (root) =>
      printVideoStoragePath === root.path || printVideoStoragePath.startsWith(`${root.path}/`)
  );

  if (matchedRoot && printVideoStoragePath !== matchedRoot.path) {
    const suffix = printVideoStoragePath.slice(matchedRoot.path.length + 1);
    input.value = `${matchedRoot.label} / ${suffix}`;
  } else if (matchedRoot) {
    input.value = `${matchedRoot.label}（チームルート）`;
  } else {
    input.value = printVideoStoragePath;
  }
  input.title = printVideoStoragePath;
}

/** 結果動画の保存先設定を読み込む */
async function loadPrintVideoSettings() {
  const alertEl = document.getElementById('result-video-settings-alert');
  if (!document.getElementById('result-video-storage-path')) return;

  try {
    const data = await apiRequest('admin/settings/result-video');
    printVideoGroupRoots = data.group_roots ?? [];
    printVideoStoragePath = data.storage_path ?? '';

    if (alertEl) alertEl.innerHTML = '';
    updatePrintVideoPathDisplay();
  } catch (err) {
    if (alertEl) {
      alertEl.innerHTML = `<p class="alert alert-error">${escapeHtml(err.message)}</p>`;
    }
  }
}

/** 結果動画の保存先設定を保存 */
async function savePrintVideoSettings() {
  const alertEl = document.getElementById('result-video-settings-alert');

  if (!printVideoStoragePath) {
    alert('保存先フォルダを選択してください');
    return;
  }

  try {
    const data = await apiRequest('admin/settings/result-video', {
      method: 'PATCH',
      body: JSON.stringify({ storage_path: printVideoStoragePath }),
    });
    printVideoStoragePath = data.storage_path ?? printVideoStoragePath;
    if (alertEl) {
      alertEl.innerHTML = '<p class="alert alert-success">保存先を更新しました</p>';
    }
    updatePrintVideoPathDisplay();
  } catch (err) {
    if (alertEl) {
      alertEl.innerHTML = `<p class="alert alert-error">${escapeHtml(err.message)}</p>`;
    }
  }
}

/** 予約詳細から結果動画をアップロード */
async function handleUploadPrintVideo(reservationId) {
  const fileInput = document.getElementById('admin-result-video-file');
  const statusEl = document.getElementById('result-video-upload-status');
  const file = fileInput?.files?.[0];
  if (!file) {
    alert('動画ファイルを選択してください');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    if (statusEl) {
      statusEl.textContent = 'アップロード中...';
      statusEl.classList.remove('hidden');
    }
    await apiFormRequest(`admin/reservations/${reservationId}/result-video`, formData, {
      method: 'POST',
    });
    await openDetail(reservationId);
    await refreshAll();
  } catch (err) {
    alert(err.message);
  } finally {
    if (statusEl) statusEl.classList.add('hidden');
  }
}

/** 予約詳細から結果動画を削除 */
async function handleDeletePrintVideo(reservationId) {
  if (!confirm('結果動画を削除しますか？')) return;

  try {
    await apiRequest(`admin/reservations/${reservationId}/result-video`, { method: 'DELETE' });
    await openDetail(reservationId);
    await refreshAll();
  } catch (err) {
    alert(err.message);
  }
}

/** Renders the simulator management list. */
function renderSimulators() {
  const mount = document.getElementById('simulators-mount');
  if (!mount) return;

  if (!allSimulators.length) {
    mount.innerHTML = '<p class="hint admin-list-empty">登録されているシミュレーターはありません</p>';
    return;
  }

  mount.innerHTML = `<div class="simulator-admin-grid">${allSimulators.map(simulatorAdminCardHtml).join('')}</div>`;

  mount.querySelectorAll('[data-simulator-delete]').forEach((btn) => {
    btn.addEventListener('click', () => handleDeleteSimulator(btn.dataset.simulatorDelete));
  });

  mount.querySelectorAll('[data-simulator-edit]').forEach((btn) => {
    btn.addEventListener('click', () => openSimulatorEditModal(btn.dataset.simulatorEdit));
  });
}

/** Builds HTML for a simulator admin card. */
function simulatorAdminCardHtml(simulator) {
  const caps = normalizeSimulatorCapabilities(simulator.capabilities);
  const imageHtml = simulator.image_url
    ? `<img class="simulator-admin-image" src="${escapeHtml(simulator.image_url)}" alt="" loading="lazy" />`
    : `<div class="simulator-admin-image simulator-admin-image-placeholder" aria-hidden="true">🖨️</div>`;

  const videoLabel = caps.can_record_result_video ? '動画撮影可' : '動画撮影不可';
  const statusBadge = buildSimulatorStatusBadge(simulator.status ?? 'available', { escapeHtml });

  return `
    <article class="simulator-admin-card">
      ${imageHtml}
      <div class="simulator-admin-body">
        <div class="simulator-admin-title-row">
          <h3 class="simulator-admin-title">${escapeHtml(simulator.name)}</h3>
          ${statusBadge}
        </div>
        ${buildSimulatorCapabilityBadges(caps, { escapeHtml })}
        <p class="hint simulator-admin-cap-summary">ノズル径: ${escapeHtml(formatNozzleSizes(caps.nozzle_sizes_mm))} / ${videoLabel}</p>
        <div class="simulator-admin-actions">
          <button class="btn btn-primary btn-sm" data-simulator-edit="${simulator.id}" type="button">編集</button>
          <button class="btn btn-secondary btn-sm" data-simulator-delete="${simulator.id}" type="button">削除</button>
        </div>
      </div>
    </article>`;
}

/** Sets up the simulator edit modal. */
function setupSimulatorEditModal() {
  const modal = document.getElementById('simulator-edit-modal');
  const form = document.getElementById('simulator-edit-form');
  const closeBtn = document.getElementById('simulator-edit-modal-close');
  const cancelBtn = document.getElementById('simulator-edit-cancel-btn');

  const closeModal = () => {
    modal.classList.remove('open');
    editingSimulatorId = null;
    form.reset();
    document.getElementById('simulator-edit-alert').innerHTML = '';
  };

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  form.addEventListener('submit', handleSimulatorEditSave);
}

/** Applies daily capacity fields to the simulator edit form. */
function applyDailyCapacityToForm(capacity) {
  const cap = capacity ?? {
    max_small: 2,
    max_small_with_main: 0,
    max_medium: 1,
    max_large: 1,
  };
  document.getElementById('simulator-edit-cap-max-small').value = cap.max_small ?? 2;
  document.getElementById('simulator-edit-cap-max-small-with-main').value = cap.max_small_with_main ?? 0;
  document.getElementById('simulator-edit-cap-max-medium').value = cap.max_medium ?? 1;
  document.getElementById('simulator-edit-cap-max-large').value = cap.max_large ?? 1;
}

/** Reads daily capacity from the simulator edit form. */
function readDailyCapacityFromForm() {
  return {
    max_small: Number(document.getElementById('simulator-edit-cap-max-small').value),
    max_small_with_main: Number(document.getElementById('simulator-edit-cap-max-small-with-main').value),
    max_medium: Number(document.getElementById('simulator-edit-cap-max-medium').value),
    max_large: Number(document.getElementById('simulator-edit-cap-max-large').value),
  };
}

/** Opens the simulator edit modal for a simulator. */
function openSimulatorEditModal(id) {
  const simulator = allSimulators.find((p) => p.id === id);
  if (!simulator) return;

  editingSimulatorId = id;
  const caps = normalizeSimulatorCapabilities(simulator.capabilities);
  const preview = document.getElementById('simulator-edit-image-preview');
  const alertEl = document.getElementById('simulator-edit-alert');

  alertEl.innerHTML = '';
  document.getElementById('simulator-edit-id').value = id;
  document.getElementById('simulator-edit-name').value = simulator.name;
  document.getElementById('simulator-edit-status').value = simulator.status ?? 'available';
  document.getElementById('simulator-edit-can-record-video').checked = caps.can_record_result_video;
  document.getElementById('simulator-edit-nozzle-sizes').value = nozzleSizesToInputValue(caps.nozzle_sizes_mm);
  document.getElementById('simulator-edit-image').value = '';
  applyDailyCapacityToForm(simulator.daily_capacity);

  if (simulator.image_url) {
    preview.innerHTML = `<img src="${escapeHtml(simulator.image_url)}" alt="" />`;
  } else {
    preview.textContent = '🖨️';
  }

  document.getElementById('simulator-edit-modal-title').textContent = `${simulator.name} を編集`;
  document.getElementById('simulator-edit-modal').classList.add('open');
}

/** Saves simulator edits from the modal. */
async function handleSimulatorEditSave(e) {
  e.preventDefault();
  if (!editingSimulatorId) return;

  const alertEl = document.getElementById('simulator-edit-alert');
  alertEl.innerHTML = '';

  const name = document.getElementById('simulator-edit-name').value.trim();
  const status = document.getElementById('simulator-edit-status').value;
  const nozzleSizes = parseNozzleSizesInput(document.getElementById('simulator-edit-nozzle-sizes').value);
  const canRecordVideo = document.getElementById('simulator-edit-can-record-video').checked;
  const dailyCapacity = readDailyCapacityFromForm();
  const imageInput = document.getElementById('simulator-edit-image');

  if (!name) {
    alertEl.innerHTML = '<div class="alert alert-error">シミュレーター名を入力してください</div>';
    return;
  }

  if (!nozzleSizes.length) {
    alertEl.innerHTML = '<div class="alert alert-error">ノズル径を1つ以上入力してください</div>';
    return;
  }

  const saveBtn = document.getElementById('simulator-edit-save-btn');
  saveBtn.disabled = true;

  try {
    await apiRequest(`admin/simulators/${editingSimulatorId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name,
        status,
        daily_capacity: dailyCapacity,
        capabilities: {
          can_record_result_video: canRecordVideo,
          nozzle_sizes_mm: nozzleSizes,
        },
      }),
    });

    if (imageInput.files?.[0]) {
      const formData = new FormData();
      formData.append('image', imageInput.files[0]);
      await apiFormRequest(`admin/simulators/${editingSimulatorId}/image`, formData, { method: 'PUT' });
    }

    await refreshAll();
    document.getElementById('simulator-edit-modal').classList.remove('open');
    editingSimulatorId = null;
  } catch (err) {
    alertEl.innerHTML = `<div class="alert alert-error">${escapeHtml(err.message)}</div>`;
  } finally {
    saveBtn.disabled = false;
  }
}

/** Handles adding a new simulator. */
async function handleAddSimulator(e) {
  e.preventDefault();
  const alertEl = document.getElementById('simulator-add-alert');
  alertEl.innerHTML = '';

  const name = document.getElementById('simulator-name').value.trim();
  const imageInput = document.getElementById('simulator-image');
  const formData = new FormData();
  formData.append('name', name);
  if (imageInput.files?.[0]) {
    formData.append('image', imageInput.files[0]);
  }

  try {
    await apiFormRequest('admin/simulators', formData);
    document.getElementById('simulator-add-form').reset();
    await refreshAll();
    alertEl.innerHTML = '<div class="alert alert-success">シミュレーターを追加しました</div>';
  } catch (err) {
    alertEl.innerHTML = `<div class="alert alert-error">${escapeHtml(err.message)}</div>`;
  }
}

/** Deletes a simulator. */
async function handleDeleteSimulator(id) {
  const simulator = allSimulators.find((p) => p.id === id);
  if (!simulator) return;
  if (!confirm(`「${simulator.name}」を削除しますか？`)) return;

  try {
    await apiRequest(`admin/simulators/${id}`, { method: 'DELETE' });
    await refreshAll();
  } catch (err) {
    alert(err.message);
  }
}

document.addEventListener('DOMContentLoaded', init);
