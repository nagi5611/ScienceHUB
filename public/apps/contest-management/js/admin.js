// src/admin/js/admin.js
import { apiRequest, apiFormRequest } from './api.js';
import { uploadPrintFile } from '../../contest-entry/js/upload/simple.js';
import { setupHomeroomCombobox } from '../../3dprint-reservation/js/homeroom.js';
import {
  DRAFT_STORAGE_KEYS,
  applyReservationDraft,
  extractReservationDraft,
  loadReservationDraft,
  saveReservationDraft,
  updateDraftRestoreButton,
} from '../../3dprint-reservation/js/reservation-draft.js';
import { initShiftPanel, renderShiftPanel } from './shift.js';
import {
  buildPrinterCapabilityBadges,
  formatNozzleSizes,
  normalizePrinterCapabilities,
  nozzleSizesToInputValue,
  parseNozzleSizesInput,
} from '../../3dprint-reservation/js/printer-capabilities.js';
import { buildPrinterStatusBadge } from '../../3dprint-reservation/js/printer-status.js';
import {
  initPrintVideoFolderPicker,
  openPrintVideoFolderPicker,
} from './print-video-folder-picker.js';
let printVideoGroupRoots = [];
let printVideoStoragePath = '';
let contestStorageGroupSlug = '';
let contestStorageGroupRoots = [];
let contestStorageSubmissionsPath = '';

const STATUS_LABELS = {
  applied: '申請中',
  accepted: '受領済み',
  printing: '印刷中',
  delivered: '印刷済み',
  failed: '印刷失敗',
  cancelled: 'キャンセル',
};

const SCALE_LABELS = { small: 'スモール', medium: 'ミディアム', large: 'ラージ' };
const SCALE_SHORT = { small: 'S', medium: 'M', large: 'L' };
const PURPOSE_LABELS = { ss_s_tan: 'SS・S探', club: '部活', other: 'その他' };
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
const MOBILE_ADMIN_MQ = window.matchMedia('(max-width: 768px)');
const ADMIN_PANEL_TITLES = {
  dashboard: 'カレンダー',
  history: '印刷履歴',
  applications: '参加申請',
  members: 'メンバー',
  printers: 'プリンター',
  shifts: 'シフト',
};

const CONTEST_SCHEDULE_LABELS = {
  full_time: '全日制',
  part_time: '定時制',
};

let contestApplications = [];
let contestApplicationById = new Map();
let contestApplicationDetailId = null;
let contestApplicationsSearchQuery = '';
let contestApplicationsSort = { key: 'created_at', dir: 'desc' };
let contestApplicationsToolbarBound = false;

const CONTEST_APPLICATION_SORT_KEYS = [
  'homeroom',
  'student_number',
  'student_name',
  'title',
  'schedule_type',
  'members',
  'status',
  'applicant_email',
  null,
];

let currentReservationId = null;
let allReservations = [];
let allMembers = [];
let allPrinters = [];
let memberHomeroomField = null;
let reservationHomeroomField = null;
let adminSelectedDate = '';
let adminUploadResult = null;
let adminFormMode = 'create';
let currentReservationData = null;
let editingPrinterId = null;
let currentYear;
let currentMonth;
let activePanel = 'dashboard';
let lastMobileAdminView = MOBILE_ADMIN_MQ.matches;
let draggedReservationId = null;
let emailComposeSettings = {
  email_configured: false,
};

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
  acceptBtn?.addEventListener('click', acceptReservation);
  deleteBtn.addEventListener('click', deleteReservation);
  setupContestApplicationDetailModal();
  setupContestApplicationsToolbar();
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
      if (activePanel === 'applications') renderContestApplications();
      if (activePanel === 'members') renderMembers();
      if (activePanel === 'printers') {
        renderPrinters();
        loadContestStorageSettings();
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
  document.getElementById('printer-add-form').addEventListener('submit', handleAddPrinter);
  setupPrinterEditModal();
  setupPrintVideoSettings();
  setupContestStorageSettings();
  document.getElementById('calendar-test-btn')?.addEventListener('click', testGoogleCalendar);
  document.getElementById('email-test-send-btn')?.addEventListener('click', sendReservationTestEmail);
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

  if (authed) {
    loadEmailComposeSettings();
    refreshAll();
  }
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
  if (panel === 'applications') renderContestApplications();
  if (panel === 'members') renderMembers();
  if (panel === 'printers') {
    renderPrinters();
    loadContestStorageSettings();
    loadPrintVideoSettings();
  }
  if (panel === 'shifts') renderShiftPanel();
  updateAdminStickyOffsets();
}

/** Loads fixed email staff name settings for compose UI. */
async function loadEmailComposeSettings() {
  try {
    emailComposeSettings = await apiRequest('admin/settings/email-compose');
  } catch {
    // keep defaults
  }
}

/** Refreshes dashboard data. */
async function refreshAll() {
  try {
    const [resData, membersData, printersData, appsData] = await Promise.all([
      apiRequest('admin/reservations'),
      apiRequest('admin/members'),
      apiRequest('admin/printers'),
      apiRequest('admin/applications?limit=500').catch(() => ({ applications: [] })),
    ]);
    allReservations = resData.reservations.filter((r) => r.status !== 'cancelled');
    allMembers = membersData.members;
    allPrinters = printersData.printers;
    contestApplications = appsData.applications ?? [];
    contestApplicationById = new Map();
    for (const app of contestApplications) {
      contestApplicationById.set(app.id, app);
    }
    await renderAdminCalendar();
    renderTodayTasks();
    if (activePanel === 'history') renderHistory();
    if (activePanel === 'applications') renderContestApplications();
    if (activePanel === 'members') renderMembers();
    if (activePanel === 'printers') {
      renderPrinters();
      loadPrintVideoSettings();
    }
  } catch (err) {
    document.getElementById('today-tasks-mount').innerHTML =
      `<p class="alert alert-error">${escapeHtml(err.message)}</p>`;
  }
}

/** Checks management app access via ScienceHUB. */
async function checkManagementAccess() {
  const response = await fetch('/api/apps/contest-management/access', {
    credentials: 'include',
  });
  if (response.status === 401) {
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/login/?next=${next}`;
    return false;
  }
  if (response.status === 403) {
    document.body.innerHTML =
      '<main style="padding:2rem;font-family:Inter,sans-serif"><h1>アクセス拒否</h1><p>3D印刷管理アプリを利用する権限がありません。</p><p><a href="/">ダッシュボードに戻る</a></p></main>';
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
  const hasMediumOrLarge = dayReservations.some((r) => r.print_scale === 'medium' || r.print_scale === 'large');
  const smallCount = dayReservations.filter((r) => r.print_scale === 'small').length;
  const isFull = hasMediumOrLarge || smallCount >= 2;

  if (dateStr && !otherMonth) {
    cell.dataset.date = dateStr;
    if (dateStr < todayStr) {
      cell.classList.add('disabled');
    } else if (isFull) {
      cell.classList.add('full');
    }

    cell.addEventListener('dragover', (e) => {
      if (!draggedReservationId || dateStr < todayStr) return;
      e.preventDefault();
      cell.classList.add('drop-target');
    });
    cell.addEventListener('dragleave', () => cell.classList.remove('drop-target'));
    cell.addEventListener('drop', async (e) => {
      e.preventDefault();
      cell.classList.remove('drop-target');
      const id = e.dataTransfer.getData('text/plain') || draggedReservationId;
      draggedReservationId = null;
      if (!id || dateStr < todayStr) return;
      try {
        await apiRequest(`admin/reservations/${id}/reschedule`, {
          method: 'PATCH',
          body: JSON.stringify({ desired_date: dateStr }),
        });
        await refreshAll();
      } catch (err) {
        alert(err.message);
      }
    });
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
      return (order[a.print_scale] ?? 9) - (order[b.print_scale] ?? 9);
    });

    for (const r of sorted) {
      const slot = document.createElement('button');
      slot.type = 'button';
      slot.className = `calendar-slot admin-calendar-slot ${r.print_scale}`;
      const staffLabel = r.print_staff_label ? `担当者: ${r.print_staff_label}` : '';

      if (isMobileAdminView()) {
        slot.classList.add('calendar-slot-compact');
        slot.innerHTML = `<span class="calendar-slot-compact-label">${escapeHtml(`${SCALE_SHORT[r.print_scale]} ${truncateForCell(r.title, 5)}`)}</span>`;
        slot.title = [r.title, staffLabel].filter(Boolean).join(' / ');
      } else {
        slot.innerHTML = [
          `<span class="calendar-slot-scale">${SCALE_SHORT[r.print_scale]}</span>`,
          `<span class="calendar-slot-title-text">${escapeHtml(r.title)}</span>`,
          staffLabel ? `<span class="calendar-slot-staff">${escapeHtml(staffLabel)}</span>` : '',
        ].join('');
        slot.title = [r.title, staffLabel].filter(Boolean).join(' / ');
      }

      slot.draggable = true;
      slot.addEventListener('dragstart', (e) => {
        draggedReservationId = r.id;
        e.dataTransfer.setData('text/plain', r.id);
        e.dataTransfer.effectAllowed = 'move';
        e.stopPropagation();
      });
      slot.addEventListener('dragend', () => {
        draggedReservationId = null;
        document.querySelectorAll('#calendar-grid .calendar-day.drop-target').forEach((el) => {
          el.classList.remove('drop-target');
        });
      });

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
      adminUploadResult = await uploadPrintFile(file, (pct) => {
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
    const printScale = formData.get('print_scale');
    const desiredDate = isEdit
      ? document.getElementById('admin-desired-date-input').value
      : formData.get('desired_date');

    if (!desiredDate) {
      showAdminFormAlert('希望印刷日を選択してください', 'error');
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

    if (!formData.get('printer_id')) {
      showAdminFormAlert('印刷機種を選択してください', 'error');
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
        showAdminFormAlert('選択した印刷規模はこの日付では予約できません', 'error');
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
        print_notes: formData.get('print_notes')?.trim() || null,
        print_scale: printScale,
        printer_id: formData.get('printer_id'),
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
  document.getElementById('admin-selected-date-display').textContent = `希望印刷日: ${formatDateJa(dateStr)}`;
  document.getElementById('admin-form-modal-title').textContent = `${formatDateJa(dateStr)} の新規予約`;
  document.getElementById('admin-form-alert').innerHTML = '';

  setAdminScaleOptions(availability.availableScales);

  const hint = document.getElementById('admin-scale-restriction-hint');
  if (availability.scales.includes('small') && availability.availableScales.length === 1) {
    hint.textContent = 'この日はスモール印刷が入っているため、スモールのみ選択できます。';
    hint.classList.remove('hidden');
  } else {
    hint.classList.add('hidden');
  }

  document.getElementById('admin-form-modal').classList.add('open');
  populateAdminPrinterSelect();
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
  document.getElementById('admin-print-notes').value = r.print_notes ?? '';
  document.getElementById('admin-purpose-other').value = r.purpose_other ?? '';

  const purposeRadio = form.querySelector(`input[name="purpose"][value="${r.purpose}"]`);
  if (purposeRadio) purposeRadio.checked = true;
  document.getElementById('admin-purpose-other-group').classList.toggle('hidden', r.purpose !== 'other');

  try {
    const availability = await apiRequest(
      `admin/calendar/availability?date=${r.desired_date}&exclude_reservation_id=${r.id}`
    );
    setAdminScaleOptions(availability.availableScales);
    const scaleRadio = form.querySelector(`input[name="print_scale"][value="${r.print_scale}"]`);
    if (scaleRadio && !scaleRadio.disabled) scaleRadio.checked = true;

    const hint = document.getElementById('admin-scale-restriction-hint');
    if (availability.scales.includes('small') && availability.availableScales.length === 1) {
      hint.textContent = 'この日はスモール印刷が入っているため、スモールのみ選択できます。';
      hint.classList.remove('hidden');
    } else {
      hint.classList.add('hidden');
    }
  } catch (err) {
    showAdminFormAlert(err.message, 'error');
  }

  document.getElementById('admin-form-modal-title').textContent = `${r.title} を修正`;
  document.getElementById('admin-submit-btn').textContent = '修正を保存';
  populateAdminPrinterSelect(r.printer_id);
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

  document.querySelectorAll('#admin-reservation-form input[name="print_scale"]').forEach((i) => {
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

/** Formats an ISO datetime for Japanese display. */
function formatDateTimeJa(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return escapeHtml(String(iso));
  return d.toLocaleString('ja-JP', { dateStyle: 'medium', timeStyle: 'short' });
}

function contestStlLogKindLabel(kind) {
  return kind === 'replacement' ? '追加アップロード' : '初回提出';
}

function contestStlUploaderRoleLabel(role) {
  return role === 'admin' ? '管理者' : '依頼者';
}

/** Renders STL submission history table for admin modals. */
function renderContestStlSubmissionLogsHtml(logs, { heading = 'STL提出履歴' } = {}) {
  if (!logs?.length) {
    return `<h3 class="contest-detail-subheading">${escapeHtml(heading)}</h3><p class="hint">提出履歴はありません</p>`;
  }
  const rows = logs
    .map((log) => {
      const kindClass =
        log.submission_kind === 'replacement'
          ? 'contest-stl-log-kind--replacement'
          : 'contest-stl-log-kind--initial';
      return `<tr>
        <td>${log.sequence_number}</td>
        <td><span class="contest-stl-log-kind ${kindClass}">${escapeHtml(contestStlLogKindLabel(log.submission_kind))}</span></td>
        <td>${formatDateTimeJa(log.uploaded_at)}</td>
        <td>${escapeHtml(log.stl_filename)} (${formatSize(log.stl_size_bytes)})</td>
        <td>${escapeHtml(contestStlUploaderRoleLabel(log.uploader_role))}</td>
      </tr>`;
    })
    .join('');
  return `
    <h3 class="contest-detail-subheading">${escapeHtml(heading)}</h3>
    <div class="table-wrap admin-table-wrap">
      <table class="contest-stl-log-table">
        <thead>
          <tr>
            <th>順番</th>
            <th>区分</th>
            <th>アップロード日時</th>
            <th>ファイル</th>
            <th>操作者</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

/** Builds admin reservation card HTML for mobile lists. */
function adminReservationCardHtml(r, { showPurpose = false } = {}) {
  const scaleLabel = SCALE_LABELS[r.print_scale];
  const metaParts = [];
  if (showPurpose) metaParts.push(PURPOSE_LABELS[r.purpose] ?? r.purpose);
  if (r.print_staff_label) metaParts.push(`担当: ${r.print_staff_label}`);

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
    mount.innerHTML = '<p class="hint admin-list-empty">本日の印刷予約はありません</p>';
    return;
  }

  if (isMobileAdminView()) {
    mount.innerHTML = `<div class="reservation-card-list">${tasks.map((r) => adminReservationCardHtml(r, { showPurpose: true })).join('')}</div>`;
  } else {
    mount.innerHTML = adminReservationTableHtml(tasks, [
      { label: '希望日', cell: (r) => r.desired_date },
      { label: 'HR', cell: (r) => escapeHtml(r.homeroom) },
      { label: 'タイトル', cell: (r) => escapeHtml(r.title) },
      { label: '規模', cell: (r) => SCALE_LABELS[r.print_scale] },
      { label: '目的', cell: (r) => PURPOSE_LABELS[r.purpose] },
      { label: 'ステータス', cell: (r) => `<span class="status-badge status-${r.status}">${STATUS_LABELS[r.status]}</span>` },
      { label: '担当者', cell: (r) => formatStaffCell(r.print_staff_label) },
      { label: '', cell: (r) => `<button class="btn btn-secondary btn-sm" data-id="${r.id}">詳細</button>` },
    ]);
  }

  bindDetailButtons(mount);
}

/** Maps admin submission status code to badge CSS class. */
function contestSubmissionStatusBadgeClass(code) {
  if (!code) return 'contest-submission-status--default';
  if (code === 'stl_pending') return 'contest-submission-status--pending';
  if (code === 'self_print_submitted') return 'contest-submission-status--self';
  if (code.startsWith('print_')) return `contest-submission-status--${code.replace('print_', '')}`;
  return 'contest-submission-status--default';
}

function formatContestSubmissionStatusBadge(app) {
  const status = app.submission_status;
  if (!status) return '—';
  const cls = contestSubmissionStatusBadgeClass(status.code);
  const detail = status.detail ? `<span class="contest-submission-detail">${escapeHtml(status.detail)}</span>` : '';
  return `<span class="contest-submission-status ${cls}">${escapeHtml(status.label)}</span>${detail}`;
}

/** Short label for member list in compact admin table. */
function formatContestMembersCompact(members, maxShown = 2) {
  if (!members?.length) return '—';
  const parts = members.slice(0, maxShown).map((m) => {
    const bits = [
      m.homeroom ? escapeHtml(m.homeroom) : null,
      m.student_number != null ? `${m.student_number}番` : null,
      escapeHtml(m.member_name),
    ].filter(Boolean);
    return bits.join(' ');
  });
  const rest = members.length - maxShown;
  const suffix = rest > 0 ? ` 他${rest}名` : '';
  return `${parts.join('、')}${suffix}`;
}

function contestAdminApplicationDeleteCell(app) {
  const title = escapeHtml(app.title);
  return `<button type="button" class="btn btn-secondary btn-sm contest-admin-app-delete" data-app-id="${escapeHtml(app.id)}" data-app-title="${title}">削除</button>`;
}

function contestAdminApplicationActionsCell(app) {
  return `<div class="contest-admin-app-actions">
    <button type="button" class="btn btn-secondary btn-sm contest-admin-app-detail" data-app-id="${escapeHtml(app.id)}">詳細</button>
    ${contestAdminApplicationDeleteCell(app)}
  </div>`;
}

/** Hover tooltip listing all members in the compact applications table. */
function formatContestMembersCompactCell(members, maxShown = 1) {
  if (!members?.length) return '—';
  const compact = formatContestMembersCompact(members, maxShown);
  const fullLines = members
    .map((m) => {
      const bits = [
        m.homeroom ?? '',
        m.student_number != null ? `${m.student_number}番` : '',
        m.member_name,
      ].filter(Boolean);
      return escapeHtml(bits.join(' '));
    })
    .join('<br>');
  return `<span class="contest-admin-members-compact">${compact}<span class="contest-admin-members-tooltip" role="tooltip">${fullLines}</span></span>`;
}

/** Wires contest application detail modal close/delete actions. */
function setupContestApplicationDetailModal() {
  const modal = document.getElementById('contest-application-detail-modal');
  if (!modal) return;
  const closeModal = () => modal.classList.remove('open');
  document.getElementById('contest-application-detail-close')?.addEventListener('click', closeModal);
  document.getElementById('contest-application-detail-dismiss')?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.getElementById('contest-application-detail-delete')?.addEventListener('click', async () => {
    if (!contestApplicationDetailId) return;
    const app = contestApplicationById.get(contestApplicationDetailId);
    const title = app?.title ?? '';
    closeModal();
    await handleDeleteContestApplication(contestApplicationDetailId, title);
  });
}

/** Builds HTML for the participation application detail modal. */
function renderContestApplicationDetailHtml(app) {
  const membersHtml =
    (app.members ?? [])
      .map((m) => {
        const parts = [
          m.homeroom ? escapeHtml(m.homeroom) : null,
          m.student_number != null ? `${m.student_number}番` : null,
          escapeHtml(m.member_name),
        ].filter(Boolean);
        return `<li>${parts.join(' ')}</li>`;
      })
      .join('') || '<li>—</li>';

  const reservations = app.reservations ?? [];
  const historyHtml =
    reservations.length === 0
      ? '<p class="hint">印刷依頼はまだありません</p>'
      : `<div class="table-wrap admin-table-wrap"><table><thead><tr>
          <th>希望日</th><th>ステータス</th><th>ファイル</th><th>規模</th><th>申請日時</th><th></th>
        </tr></thead><tbody>${reservations
          .map(
            (r) => `<tr>
          <td>${escapeHtml(r.desired_date)}</td>
          <td><span class="status-badge status-${r.status}">${STATUS_LABELS[r.status]}</span></td>
          <td>${escapeHtml(r.stl_filename)} (${formatSize(r.stl_size_bytes)})</td>
          <td>${SCALE_LABELS[r.print_scale] ?? escapeHtml(String(r.print_scale))}</td>
          <td>${escapeHtml(r.created_at)}</td>
          <td><button type="button" class="btn btn-secondary btn-sm contest-app-reservation-detail" data-reservation-id="${escapeHtml(r.id)}">予約詳細</button></td>
        </tr>`
          )
          .join('')}</tbody></table></div>`;

  const selfPrintBlock = app.self_print
    ? `
      <div class="detail-row"><span class="detail-label">印刷</span><span>自己印刷</span></div>
      ${
        app.stl_submitted_at
          ? `<div class="detail-row"><span class="detail-label">STL提出</span><span>${escapeHtml(app.stl_submitted_at)}</span></div>`
          : ''
      }
      ${
        app.stl_filename
          ? `<div class="detail-row"><span class="detail-label">STLファイル</span><span>${escapeHtml(app.stl_filename)}${
              app.stl_size_bytes != null ? ` (${formatSize(app.stl_size_bytes)})` : ''
            }</span></div>`
          : ''
      }
      ${
        app.stl_print_notes
          ? `<div class="detail-row"><span class="detail-label">印刷時の注意</span><span>${escapeHtml(app.stl_print_notes).replace(/\n/g, '<br>')}</span></div>`
          : ''
      }
    `
    : '';

  return `
    <div class="detail-grid">
      <div class="detail-row"><span class="detail-label">タイトル</span><span>${escapeHtml(app.title)}</span></div>
      <div class="detail-row"><span class="detail-label">在籍区分</span><span>${escapeHtml(CONTEST_SCHEDULE_LABELS[app.schedule_type] ?? app.schedule_type)}</span></div>
      <div class="detail-row"><span class="detail-label">代表者</span><span>${escapeHtml(app.homeroom)} ${escapeHtml(String(app.student_number))}番 ${escapeHtml(app.student_name)}</span></div>
      <div class="detail-row"><span class="detail-label">申請者</span><span>${escapeHtml(app.applicant_email ?? '—')}</span></div>
      <div class="detail-row"><span class="detail-label">提出ステータス</span><span>${formatContestSubmissionStatusBadge(app)}</span></div>
      <div class="detail-row"><span class="detail-label">申請日時</span><span>${escapeHtml(app.created_at)}</span></div>
      <div class="detail-row"><span class="detail-label">更新日時</span><span>${escapeHtml(app.updated_at)}</span></div>
      ${selfPrintBlock}
      <div class="detail-row detail-row-block"><span class="detail-label">感想</span><span class="contest-detail-impressions">${app.impressions ? escapeHtml(app.impressions).replace(/\n/g, '<br>') : '—'}</span></div>
      <div class="detail-row detail-row-block"><span class="detail-label">参加者</span><ul class="contest-detail-members">${membersHtml}</ul></div>
    </div>
    <h3 class="contest-detail-subheading">印刷依頼履歴</h3>
    ${historyHtml}
    ${renderContestStlSubmissionLogsHtml(app.stl_submission_logs)}
  `;
}

function bindContestApplicationDetailReservationLinks(container) {
  container.querySelectorAll('.contest-app-reservation-detail').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.getElementById('contest-application-detail-modal')?.classList.remove('open');
      openDetail(btn.dataset.reservationId);
    });
  });
}

/** Opens the participation application detail modal. */
function openContestApplicationDetail(applicationId) {
  const app = contestApplicationById.get(applicationId);
  if (!app) return;
  contestApplicationDetailId = applicationId;
  document.getElementById('contest-application-detail-title').textContent = app.title;
  const body = document.getElementById('contest-application-detail-body');
  body.innerHTML = renderContestApplicationDetailHtml(app);
  bindContestApplicationDetailReservationLinks(body);
  document.getElementById('contest-application-detail-modal').classList.add('open');
}

/** Binds detail buttons on the participation applications panel. */
function bindContestApplicationDetailButtons(container) {
  container.querySelectorAll('.contest-admin-app-detail').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openContestApplicationDetail(btn.dataset.appId);
    });
  });
}

/** Binds delete buttons on the participation applications panel. */
function bindContestApplicationDeleteButtons(container) {
  container.querySelectorAll('.contest-admin-app-delete').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleDeleteContestApplication(btn.dataset.appId, btn.dataset.appTitle);
    });
  });
}

/** Admin: delete a participation application and refresh lists. */
async function handleDeleteContestApplication(applicationId, title) {
  const label = title ? `「${title}」` : 'この参加申請';
  if (!confirm(`${label}を削除しますか？\n予約・提出ファイルも削除されます。`)) return;

  try {
    await apiRequest(`admin/applications/${applicationId}`, { method: 'DELETE' });
    await refreshAll();
  } catch (err) {
    alert(err.message);
  }
}

/** Builds a searchable haystack string for one participation application. */
function contestApplicationSearchHaystack(app) {
  const parts = [
    app.homeroom,
    String(app.student_number),
    app.student_name,
    app.title,
    app.impressions,
    app.applicant_email,
    CONTEST_SCHEDULE_LABELS[app.schedule_type] ?? app.schedule_type,
    app.submission_status?.label,
    app.submission_status?.detail,
    app.submission_status?.desired_date,
    app.created_at,
  ];
  for (const member of app.members ?? []) {
    parts.push(member.member_name, member.homeroom, member.student_number);
  }
  return parts
    .filter((part) => part != null && String(part).trim() !== '')
    .join(' ')
    .toLowerCase();
}

/** Returns sortable value for a participation application column. */
function contestApplicationSortValue(app, sortKey) {
  switch (sortKey) {
    case 'homeroom':
      return app.homeroom ?? '';
    case 'student_number':
      return Number(app.student_number) || 0;
    case 'student_name':
      return app.student_name ?? '';
    case 'title':
      return app.title ?? '';
    case 'schedule_type':
      return CONTEST_SCHEDULE_LABELS[app.schedule_type] ?? app.schedule_type ?? '';
    case 'members':
      return (app.members ?? []).map((m) => m.member_name).join(' ');
    case 'status':
      return app.submission_status?.label ?? '';
    case 'applicant_email':
      return app.applicant_email ?? '';
    case 'created_at':
      return app.created_at ?? '';
    default:
      return '';
  }
}

function filterContestApplicationsBySearch(apps, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return apps;
  return apps.filter((app) => contestApplicationSearchHaystack(app).includes(normalized));
}

function sortContestApplicationsList(apps, sortKey, sortDir) {
  const direction = sortDir === 'asc' ? 1 : -1;
  return [...apps].sort((a, b) => {
    const av = contestApplicationSortValue(a, sortKey);
    const bv = contestApplicationSortValue(b, sortKey);
    if (sortKey === 'student_number') {
      return (av - bv) * direction;
    }
    return String(av).localeCompare(String(bv), 'ja') * direction;
  });
}

function getVisibleContestApplications() {
  const filtered = filterContestApplicationsBySearch(
    contestApplications,
    contestApplicationsSearchQuery
  );
  return sortContestApplicationsList(
    filtered,
    contestApplicationsSort.key,
    contestApplicationsSort.dir
  );
}

function syncContestApplicationsMobileSortSelect() {
  const select = document.getElementById('contest-applications-sort-mobile');
  if (!select) return;
  const value = `${contestApplicationsSort.key}:${contestApplicationsSort.dir}`;
  if ([...select.options].some((opt) => opt.value === value)) {
    select.value = value;
  }
}

function updateContestApplicationsCount(visibleCount) {
  const el = document.getElementById('contest-applications-count');
  if (!el) return;
  const total = contestApplications.length;
  if (total === 0) {
    el.textContent = '';
    return;
  }
  if (visibleCount === total) {
    el.textContent = `${total}件`;
    return;
  }
  el.textContent = `${visibleCount}件 / 全${total}件`;
}

/** Wires search and mobile sort controls for participation applications. */
function setupContestApplicationsToolbar() {
  if (contestApplicationsToolbarBound) return;
  const searchInput = document.getElementById('contest-applications-search');
  const sortMobile = document.getElementById('contest-applications-sort-mobile');
  if (!searchInput && !sortMobile) return;
  contestApplicationsToolbarBound = true;

  searchInput?.addEventListener('input', (e) => {
    contestApplicationsSearchQuery = e.target.value;
    renderContestApplicationsResults();
  });

  sortMobile?.addEventListener('change', (e) => {
    const [key, dir] = String(e.target.value).split(':');
    if (!key || (dir !== 'asc' && dir !== 'desc')) return;
    contestApplicationsSort = { key, dir };
    renderContestApplicationsResults();
  });
}

function setContestApplicationSort(sortKey) {
  if (contestApplicationsSort.key === sortKey) {
    contestApplicationsSort.dir = contestApplicationsSort.dir === 'asc' ? 'desc' : 'asc';
  } else {
    contestApplicationsSort.key = sortKey;
    contestApplicationsSort.dir = 'asc';
  }
  syncContestApplicationsMobileSortSelect();
}

/** Binds sortable column headers in the applications table. */
function bindContestApplicationSortButtons(container) {
  container.querySelectorAll('th.contest-app-sort-th[data-sort-key]').forEach((th) => {
    const activate = () => {
      setContestApplicationSort(th.dataset.sortKey);
      renderContestApplicationsResults();
    };
    th.addEventListener('click', activate);
    th.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    });
  });
}

/** Column definitions for the participation applications admin table. */
function contestAdminApplicationTableColumns() {
  return [
    { label: 'HR', cell: (app) => escapeHtml(app.homeroom) },
    { label: '番', cell: (app) => escapeHtml(String(app.student_number)) },
    { label: '代表', cell: (app) => escapeHtml(app.student_name) },
    { label: 'タイトル', cell: (app) => escapeHtml(app.title) },
    { label: '区分', cell: (app) => escapeHtml(CONTEST_SCHEDULE_LABELS[app.schedule_type] ?? app.schedule_type) },
    {
      label: '参加者',
      cell: (app) => formatContestMembersCompactCell(app.members, 1),
    },
    {
      label: 'ステータス',
      cell: (app) => {
        const date =
          app.submission_status?.desired_date != null
            ? `<span class="contest-submission-date-inline">${escapeHtml(app.submission_status.desired_date)}</span>`
            : '';
        return `<div class="contest-admin-status-cell">${formatContestSubmissionStatusBadge(app)}${date}</div>`;
      },
    },
    { label: '申請者', cell: (app) => escapeHtml(app.applicant_email ?? '—') },
    { label: '', cell: (app) => contestAdminApplicationActionsCell(app) },
  ];
}

/** Desktop table with clickable sortable column headers. */
function contestAdminApplicationSortableTableHtml(apps) {
  const columns = contestAdminApplicationTableColumns();
  const head = columns
    .map((col, index) => {
      const sortKey = CONTEST_APPLICATION_SORT_KEYS[index];
      if (!sortKey) {
        return `<th scope="col">${col.label}</th>`;
      }
      const active = contestApplicationsSort.key === sortKey;
      const arrow = active ? (contestApplicationsSort.dir === 'asc' ? ' ↑' : ' ↓') : '';
      const ariaSort =
        active && contestApplicationsSort.dir === 'asc'
          ? 'ascending'
          : active
            ? 'descending'
            : 'none';
      return `<th scope="col" class="contest-app-sort-th${active ? ' is-active' : ''}" data-sort-key="${sortKey}" tabindex="0" aria-sort="${ariaSort}"><span class="contest-app-sort-label">${col.label}${arrow}</span></th>`;
    })
    .join('');

  const body = apps
    .map((app) => {
      const cells = columns.map((c) => `<td>${c.cell(app)}</td>`).join('');
      return `<tr>${cells}</tr>`;
    })
    .join('');

  return `
    <div class="table-wrap admin-table-wrap contest-applications-table-wrap">
      <table>
        <thead><tr>${head}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>`;
}

/** Renders one participation applications list (desktop table or mobile cards). */
function renderContestApplicationsListHtml(apps) {
  if (isMobileAdminView()) {
    return `<div class="contest-admin-application-compact-list">${apps
      .map((app) => {
        const impressions = app.impressions
          ? `<p class="hint contest-admin-impressions-truncate">${escapeHtml(app.impressions)}</p>`
          : '';
        return `
        <article class="contest-admin-application-compact card">
          <div class="contest-admin-application-compact-head">
            <strong>${escapeHtml(app.title)}</strong>
            ${formatContestSubmissionStatusBadge(app)}
          </div>
          <p class="hint contest-admin-application-compact-meta">
            ${escapeHtml(app.homeroom)} · ${escapeHtml(String(app.student_number))}番 · ${escapeHtml(app.student_name)}
            · ${escapeHtml(CONTEST_SCHEDULE_LABELS[app.schedule_type] ?? app.schedule_type)}
            ${app.self_print ? ' · 自己印刷' : ''}
          </p>
          <p class="hint">参加者: ${formatContestMembersCompactCell(app.members, 2)}</p>
          ${impressions}
          <div class="contest-admin-application-compact-actions">${contestAdminApplicationActionsCell(app)}</div>
        </article>`;
      })
      .join('')}</div>`;
  }
  return contestAdminApplicationSortableTableHtml(apps);
}

/** Renders filtered/sorted participation application rows. */
function renderContestApplicationsResults() {
  const mount = document.getElementById('applications-results-mount');
  if (!mount) return;

  const toolbar = document.getElementById('contest-applications-toolbar');
  if (!contestApplications.length) {
    toolbar?.classList.add('hidden');
    mount.innerHTML = '<p class="hint admin-list-empty">参加申請はまだありません</p>';
    updateContestApplicationsCount(0);
    return;
  }

  toolbar?.classList.remove('hidden');
  syncContestApplicationsMobileSortSelect();

  const visible = getVisibleContestApplications();
  updateContestApplicationsCount(visible.length);

  if (!visible.length) {
    mount.innerHTML =
      '<p class="hint admin-list-empty">検索条件に一致する参加申請はありません</p>';
    return;
  }

  mount.innerHTML = renderContestApplicationsListHtml(visible);
  bindContestApplicationDeleteButtons(mount);
  bindContestApplicationDetailButtons(mount);
  bindContestApplicationSortButtons(mount);
}

/** Renders contest participation applications in a single list. */
function renderContestApplications() {
  const searchInput = document.getElementById('contest-applications-search');
  if (searchInput && searchInput.value !== contestApplicationsSearchQuery) {
    searchInput.value = contestApplicationsSearchQuery;
  }
  renderContestApplicationsResults();
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
      { label: '規模', cell: (r) => SCALE_LABELS[r.print_scale] },
      { label: 'ステータス', cell: (r) => `<span class="status-badge status-${r.status}">${STATUS_LABELS[r.status]}</span>` },
      { label: '担当者', cell: (r) => formatStaffCell(r.print_staff_label) },
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

/** Sends a test reservation notification email to the address entered in admin. */
async function sendReservationTestEmail() {
  const resultEl = document.getElementById('email-test-result');
  const input = document.getElementById('email-test-to');
  const to = input?.value?.trim() ?? '';
  if (!to) {
    resultEl.innerHTML = '<div class="alert alert-error">送信先メールアドレスを入力してください</div>';
    return;
  }

  resultEl.innerHTML = '<p class="hint">送信中...</p>';
  const btn = document.getElementById('email-test-send-btn');
  if (btn) btn.disabled = true;

  try {
    const data = await apiRequest('admin/settings/test-email', {
      method: 'POST',
      body: JSON.stringify({ to }),
    });
    resultEl.innerHTML = `<div class="alert alert-success">送信しました（${escapeHtml(data.to)}）</div>`;
  } catch (err) {
    resultEl.innerHTML = `<div class="alert alert-error">${escapeHtml(err.message)}</div>`;
  } finally {
    if (btn) btn.disabled = false;
  }
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

/** Sends print-reject notification (email + participant message). */
async function submitPrintReject(reservationId) {
  const reasonEl = document.getElementById('contest-print-reject-reason');
  const statusEl = document.getElementById('contest-print-reject-status');
  const btn = document.getElementById('contest-print-reject-btn');
  if (!reasonEl || !statusEl || !btn) return;

  const reason = reasonEl.value.trim();
  if (!reason) {
    statusEl.textContent = '印刷不能の理由を入力してください';
    statusEl.className = 'hint contest-email-send-err';
    statusEl.classList.remove('hidden');
    return;
  }

  if (
    !window.confirm(
      '印刷不能として依頼者に通知します。印刷依頼はキャンセルされ、メールとコンテストページに理由が表示されます。よろしいですか？'
    )
  ) {
    return;
  }

  btn.disabled = true;
  statusEl.textContent = '送信中…';
  statusEl.className = 'hint';
  statusEl.classList.remove('hidden');

  try {
    const staffId = document.getElementById('edit-print-staff')?.value?.trim() || null;
    await apiRequest(`admin/reservations/${reservationId}/print-reject`, {
      method: 'POST',
      body: JSON.stringify({
        reason,
        ...(staffId ? { print_staff_member_id: staffId } : {}),
      }),
    });
    document.getElementById('detail-modal')?.classList.remove('open');
    await refreshAll();
  } catch (err) {
    statusEl.textContent = err.message || '送信に失敗しました';
    statusEl.className = 'hint contest-email-send-err';
    btn.disabled = false;
  }
}

/** Sends a custom email to the applicant from the detail modal. */
async function sendCustomEmailToApplicant(reservationId) {
  const messageEl = document.getElementById('contest-email-message');
  const statusEl = document.getElementById('contest-email-send-status');
  const btn = document.getElementById('contest-send-custom-email-btn');
  if (!messageEl || !statusEl || !btn) return;

  const message = messageEl.value.trim();
  if (!message) {
    statusEl.textContent = '送信内容を入力してください';
    statusEl.className = 'hint contest-email-send-err';
    statusEl.classList.remove('hidden');
    return;
  }

  btn.disabled = true;
  statusEl.textContent = '送信中…';
  statusEl.className = 'hint';
  statusEl.classList.remove('hidden');

  try {
    const staffId = document.getElementById('edit-print-staff')?.value?.trim() || null;
    await apiRequest(`admin/reservations/${reservationId}/custom-email`, {
      method: 'POST',
      body: JSON.stringify({
        message,
        ...(staffId ? { print_staff_member_id: staffId } : {}),
      }),
    });
    statusEl.textContent = 'メールを送信しました';
    statusEl.className = 'hint contest-email-send-ok';
    messageEl.value = '';
  } catch (err) {
    statusEl.textContent = err.message || '送信に失敗しました';
    statusEl.className = 'hint contest-email-send-err';
  } finally {
    btn.disabled = !emailComposeSettings.email_configured;
  }
}

/** Opens the reservation detail modal. */
async function openDetail(id) {
  currentReservationId = id;
  const modal = document.getElementById('detail-modal');
  const body = document.getElementById('modal-body');

  try {
    const data = await apiRequest(`admin/reservations/${id}`);
    const r = data.reservation;
    const stlSubmissionLogs = data.stl_submission_logs ?? [];
    const compose = data.email_compose ?? emailComposeSettings;
    currentReservationData = r.status === 'cancelled' ? null : r;
    const availableStaff = data.available_staff ?? allMembers;

    const isApplication = r.status === 'applied';
    const statusField = isApplication
      ? `<div class="form-group" style="margin-top:1.5rem">
          <label>ステータス</label>
          <p><span class="status-badge status-applied">${STATUS_LABELS.applied}</span></p>
          <p class="hint">印刷担当を選び「予約を受領」で受領済みになります。</p>
        </div>`
      : `<div class="form-group" style="margin-top:1.5rem">
          <label for="edit-status">ステータス</label>
          <select id="edit-status">
            ${['accepted', 'printing', 'delivered', 'failed', 'cancelled']
              .map((k) => `<option value="${k}" ${r.status === k ? 'selected' : ''}>${STATUS_LABELS[k]}</option>`)
              .join('')}
          </select>
        </div>
        <div class="form-group">
          <label for="edit-status-comment">ステータスコメント</label>
          <textarea id="edit-status-comment" rows="3" maxlength="500" placeholder="例: サポート材が足りず印刷に失敗しました">${escapeHtml(r.status_comment ?? '')}</textarea>
          <p class="hint">印刷失敗などの理由を記入できます。依頼者の予約詳細にも表示されます。</p>
        </div>`;

    const printStaffField = isApplication
      ? `<div class="form-group">
          <label for="edit-print-staff">印刷担当は</label>
          <select id="edit-print-staff" required>
            ${buildPrintStaffOptions(null, availableStaff, { placeholder: '選択してください' })}
          </select>
        </div>`
      : `<div class="form-group">
          <label for="edit-print-staff">印刷担当は</label>
          <select id="edit-print-staff">
            ${buildPrintStaffOptions(r.print_staff_member_id, availableStaff)}
          </select>
        </div>`;

    body.innerHTML = `
      <div class="detail-grid">
        <div class="detail-row"><span class="detail-label">タイトル</span><span>${escapeHtml(r.title)}</span></div>
        <div class="detail-row"><span class="detail-label">希望印刷日</span><span>${r.desired_date}</span></div>
        <div class="detail-row"><span class="detail-label">HR・出席番号</span><span>${escapeHtml(r.homeroom)} ${r.student_number}番</span></div>
        <div class="detail-row"><span class="detail-label">名前</span><span>${escapeHtml(r.student_name)}</span></div>
        <div class="detail-row"><span class="detail-label">目的</span><span>${PURPOSE_LABELS[r.purpose]}${r.purpose_other ? `（${escapeHtml(r.purpose_other)}）` : ''}</span></div>
        <div class="detail-row"><span class="detail-label">概要</span><span>${escapeHtml(r.summary)}</span></div>
        <div class="detail-row"><span class="detail-label">印刷規模</span><span>${SCALE_LABELS[r.print_scale]}</span></div>
        <div class="detail-row"><span class="detail-label">印刷機種</span><span>${escapeHtml(r.printer_name ?? '未指定')}${r.printer_capabilities ? `（ノズル ${escapeHtml(formatNozzleSizes(r.printer_capabilities.nozzle_sizes_mm))}${r.printer_capabilities.can_record_print_video ? '・動画撮影可' : ''}）` : ''}</span></div>
        ${r.print_notes ? `<div class="detail-row"><span class="detail-label">印刷時の注意点</span><span>${escapeHtml(r.print_notes).replace(/\n/g, '<br>')}</span></div>` : ''}
        ${r.request_print_video ? `<div class="detail-row"><span class="detail-label">動画撮影</span><span>依頼者が希望</span></div>` : ''}
        <div class="detail-row"><span class="detail-label">ファイル</span><span>${escapeHtml(r.stl_filename)} (${formatSize(r.stl_size_bytes)})</span></div>
        <div class="detail-row"><span class="detail-label">申請日時</span><span>${r.created_at}</span></div>
      </div>
      ${renderContestStlSubmissionLogsHtml(stlSubmissionLogs)}
      ${statusField}
      ${printStaffField}
      ${
        ['applied', 'accepted'].includes(r.status)
          ? `<div class="contest-admin-print-reject card" style="margin-top:1rem;padding:1rem">
          <h3 class="contest-admin-email-heading">印刷不能（負荷判定など）</h3>
          <p class="hint">STL の印刷負荷判定の結果、印刷できない場合は理由を記入して依頼者へ通知します（メールとコンテストページに表示）。依頼はキャンセルされ、依頼者は STL を再提出できます。</p>
          <div class="form-group">
            <label for="contest-print-reject-reason">印刷不能の理由</label>
            <textarea id="contest-print-reject-reason" rows="4" maxlength="4000" placeholder="例: 造形時間が上限を大幅に超えるため、学校プリンターでは印刷できません"></textarea>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" id="contest-print-reject-btn">印刷不能として通知する</button>
          <p class="hint hidden" id="contest-print-reject-status" role="status"></p>
        </div>`
          : ''
      }
      <div class="form-group" style="margin-top:1rem">
        <label>印刷動画（クラウドストレージ）</label>
        ${r.print_video_storage_path
          ? `<p class="hint">${escapeHtml(r.print_video_filename ?? '動画')} (${formatSize(r.print_video_size_bytes ?? 0)})</p>
             <a href="/api/contest/admin/reservations/${r.id}/print-video/download" class="btn btn-secondary btn-sm" download>動画をダウンロード</a>
             <button type="button" class="btn btn-secondary btn-sm" id="delete-print-video-btn">動画を削除</button>`
          : '<p class="hint">まだアップロードされていません。</p>'}
        <input type="file" id="admin-print-video-file" accept="video/*,.mp4,.mov,.webm,.mkv,.m4v" style="margin-top:0.5rem" />
        <button type="button" class="btn btn-primary btn-sm" id="upload-print-video-btn" style="margin-top:0.5rem">動画をアップロード</button>
        <p class="hint">mp4 / mov / webm など（最大500MB）。保存先はプリンター管理の「印刷動画の保存先」で設定します。</p>
        <p class="hint hidden" id="print-video-upload-status"></p>
      </div>
      <div class="contest-admin-email-compose">
        <h3 class="contest-admin-email-heading">依頼者へメール</h3>
        <p class="hint">送信内容のみ入力します。メール担当者名は「印刷担当」で選んだ登録メンバーの名前が使われます（未選択時は「担当者」）。</p>
        <div class="form-group">
          <label for="contest-email-staff-name">メール担当者名</label>
          <input type="text" id="contest-email-staff-name" readonly value="${escapeHtml(compose.staff_name ?? '担当者')}" aria-readonly="true" />
        </div>
        <div class="form-group">
          <label for="contest-email-message">送信内容</label>
          <textarea id="contest-email-message" rows="5" maxlength="4000" placeholder="依頼者へのメッセージを入力してください" ${r.status === 'cancelled' || !compose.email_configured ? 'disabled' : ''}></textarea>
          ${!compose.email_configured ? '<p class="hint contest-email-send-err">メール送信が未設定のため送信できません（PRINT_3D_EMAIL_FROM 等）。</p>' : ''}
        </div>
        <button type="button" class="btn btn-secondary btn-sm" id="contest-send-custom-email-btn" ${r.status === 'cancelled' || !compose.email_configured ? 'disabled' : ''}>依頼者にメールを送信</button>
        <p class="hint hidden" id="contest-email-send-status" role="status"></p>
      </div>
      <a href="/api/contest/admin/stl/${r.id}" class="btn btn-secondary btn-sm" download>ファイルをダウンロード</a>
    `;

    document.getElementById('upload-print-video-btn')?.addEventListener('click', () =>
      handleUploadPrintVideo(r.id)
    );
    document.getElementById('delete-print-video-btn')?.addEventListener('click', () =>
      handleDeletePrintVideo(r.id)
    );
    document.getElementById('contest-send-custom-email-btn')?.addEventListener('click', () =>
      sendCustomEmailToApplicant(r.id)
    );
    document.getElementById('contest-print-reject-btn')?.addEventListener('click', () =>
      submitPrintReject(r.id)
    );

    const staffSelect = document.getElementById('edit-print-staff');
    const staffNameInput = document.getElementById('contest-email-staff-name');
    const fallbackStaffName = compose.staff_name ?? '担当者';
    const syncEmailStaffNameFromSelect = () => {
      if (!staffNameInput || !staffSelect) return;
      const id = staffSelect.value?.trim();
      if (!id) {
        staffNameInput.value = fallbackStaffName;
        return;
      }
      const member = allMembers.find((m) => m.id === id);
      staffNameInput.value = member?.name ?? fallbackStaffName;
    };
    staffSelect?.addEventListener('change', syncEmailStaffNameFromSelect);
    syncEmailStaffNameFromSelect();

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
    alert('印刷担当者を選択してください');
    return;
  }

  try {
    const data = await apiRequest(`admin/reservations/${currentReservationId}/accept`, {
      method: 'POST',
      body: JSON.stringify({ print_staff_member_id: staffId }),
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
        print_staff_member_id: document.getElementById('edit-print-staff').value || null,
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

/** Populates the admin printer select dropdown. */
function populateAdminPrinterSelect(selectedId = '') {
  const select = document.getElementById('admin-printer-select');
  if (!select) return;

  if (!allPrinters.length) {
    select.innerHTML = '<option value="">プリンターが登録されていません</option>';
    select.disabled = true;
    return;
  }

  select.disabled = false;
  select.innerHTML = allPrinters
    .map(
      (p) =>
        `<option value="${escapeHtml(p.id)}"${p.id === selectedId ? ' selected' : ''}>${escapeHtml(p.name)}</option>`
    )
    .join('');
}

/** 印刷動画保存先設定のイベントを登録 */
function setupPrintVideoSettings() {
  const saveBtn = document.getElementById('print-video-settings-save');
  const browseBtn = document.getElementById('print-video-browse-btn');

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
  const input = document.getElementById('print-video-storage-path');
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

/** 提出ファイル集約先（クラウドストレージ）設定 */
function setupContestStorageSettings() {
  document.getElementById('contest-storage-settings-save')?.addEventListener('click', saveContestStorageSettings);
  document.getElementById('contest-storage-group-slug')?.addEventListener('change', (e) => {
    contestStorageGroupSlug = e.target.value;
    updateContestStoragePathHint();
  });
}

function updateContestStorageGroupSelect() {
  const select = document.getElementById('contest-storage-group-slug');
  if (!select) return;

  if (!contestStorageGroupRoots.length) {
    select.innerHTML = '<option value="">利用可能なチームがありません</option>';
    select.disabled = true;
    return;
  }

  select.disabled = false;
  const options = [
    '<option value="">未設定</option>',
    ...contestStorageGroupRoots.map(
      (root) =>
        `<option value="${escapeHtml(root.key)}"${
          root.key === contestStorageGroupSlug ? ' selected' : ''
        }>${escapeHtml(root.label)}</option>`
    ),
  ];
  select.innerHTML = options.join('');
}

function updateContestStoragePathHint() {
  const hint = document.getElementById('contest-storage-path-hint');
  if (!hint) return;
  if (!contestStorageGroupSlug) {
    hint.textContent = '未設定の間は提出ファイルはクラウドストレージへコピーされません。';
    return;
  }
  const path =
    contestStorageSubmissionsPath ||
    `g/${contestStorageGroupSlug}/.造形物コンテスト/提出ファイル`;
  hint.textContent = `保存先: ${path}`;
}

async function loadContestStorageSettings() {
  const alertEl = document.getElementById('contest-storage-settings-alert');
  if (!document.getElementById('contest-storage-group-slug')) return;

  try {
    const data = await apiRequest('admin/settings/contest-storage');
    contestStorageGroupRoots = data.group_roots ?? [];
    contestStorageGroupSlug = data.group_slug ?? '';
    contestStorageSubmissionsPath = data.submissions_path ?? '';
    if (alertEl) alertEl.innerHTML = '';
    updateContestStorageGroupSelect();
    updateContestStoragePathHint();
  } catch (err) {
    if (alertEl) {
      alertEl.innerHTML = `<p class="alert alert-error">${escapeHtml(err.message)}</p>`;
    }
  }
}

async function saveContestStorageSettings() {
  const alertEl = document.getElementById('contest-storage-settings-alert');
  const select = document.getElementById('contest-storage-group-slug');
  if (!select) return;

  const slug = select.value.trim();
  if (!slug) {
    alert('集約先のチームを選択してください');
    return;
  }

  try {
    const data = await apiRequest('admin/settings/contest-storage', {
      method: 'PATCH',
      body: JSON.stringify({ group_slug: slug }),
    });
    contestStorageGroupSlug = data.group_slug ?? slug;
    contestStorageSubmissionsPath = data.submissions_path ?? '';
    if (alertEl) {
      alertEl.innerHTML = '<p class="alert alert-success">提出ファイルの集約先を保存しました</p>';
    }
    updateContestStoragePathHint();
  } catch (err) {
    if (alertEl) {
      alertEl.innerHTML = `<p class="alert alert-error">${escapeHtml(err.message)}</p>`;
    }
  }
}

/** 印刷動画の保存先設定を読み込む */
async function loadPrintVideoSettings() {
  const alertEl = document.getElementById('print-video-settings-alert');
  if (!document.getElementById('print-video-storage-path')) return;

  try {
    const data = await apiRequest('admin/settings/print-video');
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

/** 印刷動画の保存先設定を保存 */
async function savePrintVideoSettings() {
  const alertEl = document.getElementById('print-video-settings-alert');

  if (!printVideoStoragePath) {
    alert('保存先フォルダを選択してください');
    return;
  }

  try {
    const data = await apiRequest('admin/settings/print-video', {
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

/** 予約詳細から印刷動画をアップロード */
async function handleUploadPrintVideo(reservationId) {
  const fileInput = document.getElementById('admin-print-video-file');
  const statusEl = document.getElementById('print-video-upload-status');
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
    await apiFormRequest(`admin/reservations/${reservationId}/print-video`, formData, {
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

/** 予約詳細から印刷動画を削除 */
async function handleDeletePrintVideo(reservationId) {
  if (!confirm('印刷動画を削除しますか？')) return;

  try {
    await apiRequest(`admin/reservations/${reservationId}/print-video`, { method: 'DELETE' });
    await openDetail(reservationId);
    await refreshAll();
  } catch (err) {
    alert(err.message);
  }
}

/** Renders the printer management list. */
function renderPrinters() {
  const mount = document.getElementById('printers-mount');
  if (!mount) return;

  if (!allPrinters.length) {
    mount.innerHTML = '<p class="hint admin-list-empty">登録されているプリンターはありません</p>';
    return;
  }

  mount.innerHTML = `<div class="printer-admin-grid">${allPrinters.map(printerAdminCardHtml).join('')}</div>`;

  mount.querySelectorAll('[data-printer-delete]').forEach((btn) => {
    btn.addEventListener('click', () => handleDeletePrinter(btn.dataset.printerDelete));
  });

  mount.querySelectorAll('[data-printer-edit]').forEach((btn) => {
    btn.addEventListener('click', () => openPrinterEditModal(btn.dataset.printerEdit));
  });
}

/** Builds HTML for a printer admin card. */
function printerAdminCardHtml(printer) {
  const caps = normalizePrinterCapabilities(printer.capabilities);
  const imageHtml = printer.image_url
    ? `<img class="printer-admin-image" src="${escapeHtml(printer.image_url)}" alt="" loading="lazy" />`
    : `<div class="printer-admin-image printer-admin-image-placeholder" aria-hidden="true">🖨️</div>`;

  const videoLabel = caps.can_record_print_video ? '動画撮影可' : '動画撮影不可';
  const statusBadge = buildPrinterStatusBadge(printer.status ?? 'available', { escapeHtml });

  return `
    <article class="printer-admin-card">
      ${imageHtml}
      <div class="printer-admin-body">
        <div class="printer-admin-title-row">
          <h3 class="printer-admin-title">${escapeHtml(printer.name)}</h3>
          ${statusBadge}
        </div>
        ${buildPrinterCapabilityBadges(caps, { escapeHtml })}
        <p class="hint printer-admin-cap-summary">ノズル径: ${escapeHtml(formatNozzleSizes(caps.nozzle_sizes_mm))} / ${videoLabel}</p>
        <div class="printer-admin-actions">
          <button class="btn btn-primary btn-sm" data-printer-edit="${printer.id}" type="button">編集</button>
          <button class="btn btn-secondary btn-sm" data-printer-delete="${printer.id}" type="button">削除</button>
        </div>
      </div>
    </article>`;
}

/** Sets up the printer edit modal. */
function setupPrinterEditModal() {
  const modal = document.getElementById('printer-edit-modal');
  const form = document.getElementById('printer-edit-form');
  const closeBtn = document.getElementById('printer-edit-modal-close');
  const cancelBtn = document.getElementById('printer-edit-cancel-btn');

  const closeModal = () => {
    modal.classList.remove('open');
    editingPrinterId = null;
    form.reset();
    document.getElementById('printer-edit-alert').innerHTML = '';
  };

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  form.addEventListener('submit', handlePrinterEditSave);
}

/** Applies daily capacity fields to the printer edit form. */
function applyDailyCapacityToForm(capacity) {
  const cap = capacity ?? {
    max_small: 2,
    max_small_with_main: 0,
    max_medium: 1,
    max_large: 1,
  };
  document.getElementById('printer-edit-cap-max-small').value = cap.max_small ?? 2;
  document.getElementById('printer-edit-cap-max-small-with-main').value = cap.max_small_with_main ?? 0;
  document.getElementById('printer-edit-cap-max-medium').value = cap.max_medium ?? 1;
  document.getElementById('printer-edit-cap-max-large').value = cap.max_large ?? 1;
}

/** Reads daily capacity from the printer edit form. */
function readDailyCapacityFromForm() {
  return {
    max_small: Number(document.getElementById('printer-edit-cap-max-small').value),
    max_small_with_main: Number(document.getElementById('printer-edit-cap-max-small-with-main').value),
    max_medium: Number(document.getElementById('printer-edit-cap-max-medium').value),
    max_large: Number(document.getElementById('printer-edit-cap-max-large').value),
  };
}

/** Opens the printer edit modal for a printer. */
function openPrinterEditModal(id) {
  const printer = allPrinters.find((p) => p.id === id);
  if (!printer) return;

  editingPrinterId = id;
  const caps = normalizePrinterCapabilities(printer.capabilities);
  const preview = document.getElementById('printer-edit-image-preview');
  const alertEl = document.getElementById('printer-edit-alert');

  alertEl.innerHTML = '';
  document.getElementById('printer-edit-id').value = id;
  document.getElementById('printer-edit-name').value = printer.name;
  document.getElementById('printer-edit-status').value = printer.status ?? 'available';
  document.getElementById('printer-edit-can-record-video').checked = caps.can_record_print_video;
  document.getElementById('printer-edit-nozzle-sizes').value = nozzleSizesToInputValue(caps.nozzle_sizes_mm);
  document.getElementById('printer-edit-image').value = '';
  applyDailyCapacityToForm(printer.daily_capacity);

  if (printer.image_url) {
    preview.innerHTML = `<img src="${escapeHtml(printer.image_url)}" alt="" />`;
  } else {
    preview.textContent = '🖨️';
  }

  document.getElementById('printer-edit-modal-title').textContent = `${printer.name} を編集`;
  document.getElementById('printer-edit-modal').classList.add('open');
}

/** Saves printer edits from the modal. */
async function handlePrinterEditSave(e) {
  e.preventDefault();
  if (!editingPrinterId) return;

  const alertEl = document.getElementById('printer-edit-alert');
  alertEl.innerHTML = '';

  const name = document.getElementById('printer-edit-name').value.trim();
  const status = document.getElementById('printer-edit-status').value;
  const nozzleSizes = parseNozzleSizesInput(document.getElementById('printer-edit-nozzle-sizes').value);
  const canRecordVideo = document.getElementById('printer-edit-can-record-video').checked;
  const dailyCapacity = readDailyCapacityFromForm();
  const imageInput = document.getElementById('printer-edit-image');

  if (!name) {
    alertEl.innerHTML = '<div class="alert alert-error">プリンター名を入力してください</div>';
    return;
  }

  if (!nozzleSizes.length) {
    alertEl.innerHTML = '<div class="alert alert-error">ノズル径を1つ以上入力してください</div>';
    return;
  }

  const saveBtn = document.getElementById('printer-edit-save-btn');
  saveBtn.disabled = true;

  try {
    await apiRequest(`admin/printers/${editingPrinterId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name,
        status,
        daily_capacity: dailyCapacity,
        capabilities: {
          can_record_print_video: canRecordVideo,
          nozzle_sizes_mm: nozzleSizes,
        },
      }),
    });

    if (imageInput.files?.[0]) {
      const formData = new FormData();
      formData.append('image', imageInput.files[0]);
      await apiFormRequest(`admin/printers/${editingPrinterId}/image`, formData, { method: 'PUT' });
    }

    await refreshAll();
    document.getElementById('printer-edit-modal').classList.remove('open');
    editingPrinterId = null;
  } catch (err) {
    alertEl.innerHTML = `<div class="alert alert-error">${escapeHtml(err.message)}</div>`;
  } finally {
    saveBtn.disabled = false;
  }
}

/** Handles adding a new printer. */
async function handleAddPrinter(e) {
  e.preventDefault();
  const alertEl = document.getElementById('printer-add-alert');
  alertEl.innerHTML = '';

  const name = document.getElementById('printer-name').value.trim();
  const imageInput = document.getElementById('printer-image');
  const formData = new FormData();
  formData.append('name', name);
  if (imageInput.files?.[0]) {
    formData.append('image', imageInput.files[0]);
  }

  try {
    await apiFormRequest('admin/printers', formData);
    document.getElementById('printer-add-form').reset();
    await refreshAll();
    alertEl.innerHTML = '<div class="alert alert-success">プリンターを追加しました</div>';
  } catch (err) {
    alertEl.innerHTML = `<div class="alert alert-error">${escapeHtml(err.message)}</div>`;
  }
}

/** Deletes a printer. */
async function handleDeletePrinter(id) {
  const printer = allPrinters.find((p) => p.id === id);
  if (!printer) return;
  if (!confirm(`「${printer.name}」を削除しますか？`)) return;

  try {
    await apiRequest(`admin/printers/${id}`, { method: 'DELETE' });
    await refreshAll();
  } catch (err) {
    alert(err.message);
  }
}

document.addEventListener('DOMContentLoaded', init);
