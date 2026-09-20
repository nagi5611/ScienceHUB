// public/apps/contest-entry/js/main.js
import { apiRequest } from './api.js';
import { uploadPrintFile } from './upload/simple.js';
import { setupHomeroomCombobox, HOMEROOMS } from '../../3dprint-reservation/js/homeroom.js';
import { checkAppAccess, initAuth } from './contest-auth.js';
import {
  applyContestDraft,
  extractContestDraft,
  loadContestDraft,
  parseScheduleType,
  saveContestDraft,
} from './entry-draft.js';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
const CALENDAR_STATUSES = ['applied', 'accepted', 'printing', 'delivered'];
const STATUS_LABELS = {
  applied: '申請中',
  accepted: '受領済み',
  printing: '印刷中',
  delivered: '印刷完了',
};

const SCHEDULE_LABELS = {
  full_time: '全日制',
  part_time: '平日制',
};

let currentYear;
let currentMonth;
let calendarReservations = [];
let uploadResult = null;
let homeroomField = null;
let scheduleType = 'full_time';
let applications = [];
let selectedApplicationId = null;
let memberNames = [];

function usesFreeClassInput(type) {
  return type === 'part_time';
}

function todayJst() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo' }).format(new Date());
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function truncateForCell(text, maxLen = 5) {
  const trimmed = String(text).trim();
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, Math.max(1, maxLen - 1))}…`;
}

function showToast(message, type = 'info') {
  const el = document.getElementById('page-toast');
  if (!el) return;
  el.textContent = message;
  el.className = `page-toast page-toast--${type}`;
  el.classList.remove('hidden');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => el.classList.add('hidden'), 5000);
}

function showView(view) {
  document.getElementById('view-list')?.classList.toggle('hidden', view !== 'list');
  document.getElementById('view-apply')?.classList.toggle('hidden', view !== 'apply');
  document.getElementById('view-submit')?.classList.toggle('hidden', view !== 'submit');
}

function getHomeroomValue() {
  if (usesFreeClassInput(scheduleType)) {
    return document.getElementById('class_free')?.value.trim() ?? '';
  }
  return homeroomField?.getValue?.() ?? document.getElementById('homeroom')?.value.trim() ?? '';
}

function isValidHomeroom(value) {
  return HOMEROOMS.includes(value);
}

function updateScheduleTypeUi() {
  const fullGroup = document.getElementById('homeroom-fulltime-group');
  const partGroup = document.getElementById('homeroom-parttime-group');
  const homeroomInput = document.getElementById('homeroom');
  const classInput = document.getElementById('class_free');
  if (!fullGroup || !partGroup) return;

  const isFull = scheduleType === 'full_time';
  fullGroup.classList.toggle('hidden', !isFull);
  partGroup.classList.toggle('hidden', isFull);
  if (homeroomInput) homeroomInput.required = isFull;
  if (classInput) classInput.required = !isFull;
  updateApplicationSubmitState();
}

function submissionStatusLabel(app) {
  if (!app.reservation) return 'STL 未提出';
  const status = app.reservation.status;
  if (status === 'delivered') return '印刷完了';
  return STATUS_LABELS[status] ?? status;
}

function renderMemberInputs() {
  const list = document.getElementById('member-list');
  if (!list) return;
  list.innerHTML = '';
  memberNames.forEach((name, index) => {
    const li = document.createElement('li');
    li.className = 'contest-member-row';
    li.innerHTML = `
      <input type="text" class="contest-member-input" data-index="${index}" value="${escapeHtml(name)}" maxlength="50" placeholder="メンバー名" />
      <button type="button" class="btn btn-secondary btn-sm contest-member-remove" data-index="${index}" aria-label="削除">×</button>
    `;
    list.appendChild(li);
  });

  list.querySelectorAll('.contest-member-input').forEach((input) => {
    input.addEventListener('input', () => {
      const idx = Number(input.dataset.index);
      memberNames[idx] = input.value;
      persistApplicationDraft();
    });
  });
  list.querySelectorAll('.contest-member-remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.index);
      memberNames.splice(idx, 1);
      renderMemberInputs();
      persistApplicationDraft();
    });
  });
}

function renderApplicationsList() {
  const listEl = document.getElementById('applications-list');
  const emptyEl = document.getElementById('applications-empty');
  if (!listEl) return;

  listEl.innerHTML = '';
  emptyEl?.classList.toggle('hidden', applications.length > 0);

  for (const app of applications) {
    const li = document.createElement('li');
    li.className = 'contest-application-card';
    const memberCount = app.members?.length ?? 0;
    const memberLine =
      memberCount > 0
        ? `<p class="hint">制作者: ${escapeHtml(app.members.map((m) => m.member_name).join('、'))}</p>`
        : '';
    const submitBtn = app.can_submit_stl
      ? `<button type="button" class="btn btn-primary btn-sm contest-card-submit" data-id="${escapeHtml(app.id)}">STL を提出</button>`
      : `<span class="contest-card-status">${escapeHtml(submissionStatusLabel(app))}</span>`;

    li.innerHTML = `
      <div class="contest-application-card-body">
        <h3 class="contest-application-title">${escapeHtml(app.title)}</h3>
        <p class="hint">${escapeHtml(SCHEDULE_LABELS[app.schedule_type] ?? app.schedule_type)} · ${escapeHtml(app.homeroom)} · ${escapeHtml(app.student_name)}</p>
        ${memberLine}
        <p class="contest-application-submission">${escapeHtml(submissionStatusLabel(app))}</p>
      </div>
      <div class="contest-application-card-actions">${submitBtn}</div>
    `;
    listEl.appendChild(li);
  }

  listEl.querySelectorAll('.contest-card-submit').forEach((btn) => {
    btn.addEventListener('click', () => openSubmitView(btn.dataset.id));
  });
}

async function loadApplications() {
  const data = await apiRequest('applications');
  applications = data.applications ?? [];
  renderApplicationsList();
}

function openApplyView() {
  showView('apply');
  memberNames = [];
  renderMemberInputs();
  updateScheduleTypeUi();
}

function openSubmitView(applicationId) {
  const app = applications.find((a) => a.id === applicationId);
  if (!app || !app.can_submit_stl) {
    showToast('この作品には提出できません', 'error');
    return;
  }
  selectedApplicationId = applicationId;
  uploadResult = null;
  document.getElementById('selected-file-name').textContent = '';
  document.getElementById('upload-progress')?.classList.add('hidden');
  document.getElementById('upload-status').textContent = '';
  document.getElementById('submit-target-label').textContent = `提出先: ${app.title}`;
  showView('submit');
  updateSubmitState();
}

function persistApplicationDraft() {
  const form = document.getElementById('application-form');
  if (!form) return;
  saveContestDraft(extractContestDraft(form, getHomeroomValue(), memberNames));
}

function updateApplicationSubmitState() {
  const btn = document.getElementById('application-submit-btn');
  const form = document.getElementById('application-form');
  if (!btn || !form) return;

  const formData = new FormData(form);
  const homeroom = getHomeroomValue();
  const studentNumber = String(formData.get('student_number') ?? '').trim();
  const studentName = String(formData.get('student_name') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim();

  let homeroomOk = false;
  if (scheduleType === 'full_time') {
    homeroomOk = homeroom.length > 0 && isValidHomeroom(homeroom);
  } else {
    homeroomOk = homeroom.length >= 1 && homeroom.length <= 20;
  }

  const numOk = /^\d+$/.test(studentNumber) && Number(studentNumber) >= 1 && Number(studentNumber) <= 99;
  const nameOk = studentName.length >= 1 && studentName.length <= 50;
  const titleOk = title.length >= 1 && title.length <= 40;

  btn.disabled = !(homeroomOk && numOk && nameOk && titleOk);
}

function updateSubmitState() {
  const btn = document.getElementById('submit-btn');
  if (!btn) return;
  btn.disabled = !uploadResult?.r2Key || !selectedApplicationId;
}

async function handleApplicationSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('application-form');
  const btn = document.getElementById('application-submit-btn');
  const homeroom = getHomeroomValue();
  const formData = new FormData(form);

  if (scheduleType === 'full_time' && !isValidHomeroom(homeroom)) {
    showToast('クラスは 101〜109、201〜209、301〜309 から選択してください', 'error');
    return;
  }

  const members = memberNames.map((n) => n.trim()).filter(Boolean);
  btn.disabled = true;
  try {
    await apiRequest('applications', {
      method: 'POST',
      body: JSON.stringify({
        schedule_type: scheduleType,
        homeroom,
        student_number: Number(formData.get('student_number')),
        student_name: String(formData.get('student_name')).trim(),
        title: String(formData.get('title')).trim(),
        impressions: String(formData.get('impressions') ?? '').trim() || null,
        members,
      }),
    });
    persistApplicationDraft();
    showToast('参加申請を受け付けました。STL を提出してください', 'success');
    showView('list');
    await loadApplications();
  } catch (err) {
    showToast(err.message || '参加申請に失敗しました', 'error');
  } finally {
    updateApplicationSubmitState();
  }
}

async function loadCalendar() {
  const data = await apiRequest(`calendar?year=${currentYear}&month=${currentMonth}`);
  calendarReservations = (data.reservations ?? []).filter((r) =>
    CALENDAR_STATUSES.includes(r.status)
  );
  renderCalendar();
}

function changeMonth(delta) {
  currentMonth += delta;
  if (currentMonth > 12) {
    currentMonth = 1;
    currentYear += 1;
  } else if (currentMonth < 1) {
    currentMonth = 12;
    currentYear -= 1;
  }
  loadCalendar().catch((err) => showToast(err.message, 'error'));
}

function goToToday() {
  const now = new Date();
  currentYear = now.getFullYear();
  currentMonth = now.getMonth() + 1;
  loadCalendar().catch((err) => showToast(err.message, 'error'));
}

function renderWeekdayHeaders() {
  const row = document.getElementById('calendar-weekdays-row');
  if (!row) return;
  row.innerHTML = '';
  WEEKDAYS.forEach((day) => {
    const el = document.createElement('div');
    el.className = 'calendar-weekday';
    el.textContent = day;
    row.appendChild(el);
  });
}

function renderCalendar() {
  const monthLabel = `${currentYear}年${currentMonth}月`;
  document.getElementById('calendar-month-label').textContent = monthLabel;
  const mobileLabel = document.getElementById('calendar-month-label-mobile-text');
  if (mobileLabel) mobileLabel.textContent = monthLabel;

  renderWeekdayHeaders();
  const grid = document.getElementById('calendar-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const byDate = {};
  for (const r of calendarReservations) {
    if (!byDate[r.desired_date]) byDate[r.desired_date] = [];
    byDate[r.desired_date].push(r);
  }

  const firstDay = new Date(currentYear, currentMonth - 1, 1);
  const lastDay = new Date(currentYear, currentMonth, 0).getDate();
  const startWeekday = firstDay.getDay();
  const todayStr = todayJst();
  const prefix = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

  const prevMonthLast = new Date(currentYear, currentMonth - 1, 0).getDate();
  for (let i = startWeekday - 1; i >= 0; i--) {
    grid.appendChild(createDayCell(prevMonthLast - i, true, {}, todayStr));
  }

  for (let day = 1; day <= lastDay; day++) {
    const dateStr = `${prefix}-${String(day).padStart(2, '0')}`;
    grid.appendChild(createDayCell(day, false, byDate, todayStr, dateStr));
  }

  const totalCells = startWeekday + lastDay;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let day = 1; day <= remaining; day++) {
    grid.appendChild(createDayCell(day, true, {}, todayStr));
  }
}

function createDayCell(dayNum, otherMonth, byDate, todayStr, dateStr) {
  const cell = document.createElement('div');
  cell.className = 'calendar-day';
  if (otherMonth) cell.classList.add('other-month');
  if (dateStr === todayStr) cell.classList.add('today');

  const num = document.createElement('div');
  num.className = 'calendar-day-number';
  num.textContent = dayNum;
  cell.appendChild(num);

  const dayRes = dateStr && byDate[dateStr] ? byDate[dateStr] : [];
  if (dayRes.length) {
    const slotsWrap = document.createElement('div');
    slotsWrap.className = 'calendar-slots';
    for (const r of dayRes) {
      const slot = document.createElement('div');
      const statusClass = CALENDAR_STATUSES.includes(r.status) ? r.status : 'applied';
      slot.className = `calendar-slot calendar-slot--readonly status-${statusClass}`;
      const statusLabel = STATUS_LABELS[statusClass] ?? statusClass;
      const label = `${statusLabel} ${truncateForCell(r.title ?? '', 4)}`;
      slot.innerHTML = `<span class="calendar-slot-compact-label">${escapeHtml(label)}</span>`;
      slot.title = `${statusLabel} — ${r.title ?? ''}`;
      slotsWrap.appendChild(slot);
    }
    cell.appendChild(slotsWrap);
  }

  return cell;
}

function setupUploadZone() {
  const zone = document.getElementById('upload-zone');
  const input = document.getElementById('file-input');
  const fileNameEl = document.getElementById('selected-file-name');
  const progress = document.getElementById('upload-progress');
  const progressBar = document.getElementById('upload-progress-bar');
  const statusEl = document.getElementById('upload-status');
  if (!zone || !input) return;

  const handleFile = async (file) => {
    if (!file) return;
    uploadResult = null;
    updateSubmitState();
    fileNameEl.textContent = file.name;
    progress.classList.remove('hidden');
    progressBar.style.width = '0%';
    statusEl.textContent = 'アップロード中…';

    try {
      uploadResult = await uploadPrintFile(file, (pct) => {
        progressBar.style.width = `${pct}%`;
      });
      statusEl.textContent = 'アップロード完了';
      updateSubmitState();
    } catch (err) {
      fileNameEl.textContent = '';
      statusEl.textContent = err.message || 'アップロードに失敗しました';
      progress.classList.add('hidden');
    }
  };

  zone.addEventListener('click', () => input.click());
  input.addEventListener('change', () => handleFile(input.files?.[0]));
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  });
}

async function handleStlSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const form = document.getElementById('submit-form');
  if (!uploadResult?.r2Key || !selectedApplicationId) {
    showToast('ファイルをアップロードしてください', 'error');
    return;
  }

  const printNotesRaw = String(new FormData(form).get('print_notes') ?? '').trim();
  btn.disabled = true;
  try {
    const data = await apiRequest('entries', {
      method: 'POST',
      body: JSON.stringify({
        contest_application_id: selectedApplicationId,
        stl_r2_key: uploadResult.r2Key,
        stl_filename: uploadResult.filename,
        stl_size_bytes: uploadResult.size,
        ...(printNotesRaw ? { print_notes: printNotesRaw } : {}),
      }),
    });
    showToast(data.message || '印刷依頼を受け付けました', 'success');
    selectedApplicationId = null;
    showView('list');
    await loadApplications();
    await loadCalendar();
  } catch (err) {
    showToast(err.message || '提出に失敗しました', 'error');
  } finally {
    updateSubmitState();
  }
}

async function init() {
  const allowed = await checkAppAccess();
  if (!allowed) return;

  homeroomField = setupHomeroomCombobox('homeroom', 'homeroom-list');
  const now = new Date();
  currentYear = now.getFullYear();
  currentMonth = now.getMonth() + 1;

  document.getElementById('prev-month')?.addEventListener('click', () => changeMonth(-1));
  document.getElementById('next-month')?.addEventListener('click', () => changeMonth(1));
  document.getElementById('prev-month-mobile')?.addEventListener('click', () => changeMonth(-1));
  document.getElementById('next-month-mobile')?.addEventListener('click', () => changeMonth(1));
  document.getElementById('go-today-btn')?.addEventListener('click', goToToday);

  document.getElementById('btn-new-application')?.addEventListener('click', openApplyView);
  document.getElementById('btn-back-from-apply')?.addEventListener('click', () => showView('list'));
  document.getElementById('btn-back-from-submit')?.addEventListener('click', () => {
    selectedApplicationId = null;
    showView('list');
  });

  document.getElementById('btn-add-member')?.addEventListener('click', () => {
    memberNames.push('');
    renderMemberInputs();
    const inputs = document.querySelectorAll('.contest-member-input');
    inputs[inputs.length - 1]?.focus();
  });

  document.querySelectorAll('#application-form input[name="schedule_type"]').forEach((input) => {
    input.addEventListener('change', () => {
      scheduleType = parseScheduleType(input.value);
      updateScheduleTypeUi();
      persistApplicationDraft();
    });
  });

  const applicationForm = document.getElementById('application-form');
  applicationForm?.addEventListener('input', () => {
    persistApplicationDraft();
    updateApplicationSubmitState();
  });
  applicationForm?.addEventListener('submit', handleApplicationSubmit);

  document.getElementById('submit-form')?.addEventListener('submit', handleStlSubmit);

  setupUploadZone();
  await initAuth();

  const draft = loadContestDraft();
  if (draft && applicationForm) {
    applyContestDraft(applicationForm, draft);
    scheduleType = parseScheduleType(draft.schedule_type);
    memberNames = Array.isArray(draft.members) ? [...draft.members] : [];
    renderMemberInputs();
  }
  updateScheduleTypeUi();

  try {
    await loadApplications();
    await loadCalendar();
  } catch (err) {
    showToast(err.message, 'error');
  }
  showView('list');
}

init();
