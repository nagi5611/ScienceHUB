// public/apps/contest-entry/js/main.js
import { apiRequest } from './api.js';
import { uploadPrintFile } from './upload/simple.js';
import { setupHomeroomCombobox, HOMEROOMS } from '../../3dprint-reservation/js/homeroom.js';
import { checkAppAccess, initAuth } from './contest-auth.js';
import {
  applyContestDraft,
  extractContestDraft,
  loadContestDraft,
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

let currentYear;
let currentMonth;
let calendarReservations = [];
let uploadResult = null;
let homeroomField = null;
let scheduleType = 'full_time';

const FREE_CLASS_SCHEDULE_TYPES = new Set(['part_time', 'hekibunko']);

/** Parses schedule_type radio value. */
function parseScheduleType(value) {
  if (value === 'part_time' || value === 'hekibunko') return value;
  return 'full_time';
}

function usesFreeClassInput(type) {
  return FREE_CLASS_SCHEDULE_TYPES.has(type);
}

/** Returns today's date in JST (YYYY-MM-DD). */
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
  updateSubmitState();
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

function updateSubmitState() {
  const btn = document.getElementById('submit-btn');
  const form = document.getElementById('entry-form');
  if (!btn || !form) return;

  const formData = new FormData(form);
  const studentNumber = String(formData.get('student_number') ?? '').trim();
  const studentName = String(formData.get('student_name') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim();
  const homeroom = getHomeroomValue();

  let homeroomOk = false;
  if (scheduleType === 'full_time') {
    homeroomOk = homeroom.length > 0 && isValidHomeroom(homeroom);
  } else {
    homeroomOk = homeroom.length >= 1 && homeroom.length <= 20;
  }

  const numOk = /^\d+$/.test(studentNumber) && Number(studentNumber) >= 1 && Number(studentNumber) <= 99;
  const nameOk = studentName.length >= 1 && studentName.length <= 50;
  const titleOk = title.length >= 1 && title.length <= 40;
  const fileOk = Boolean(uploadResult?.r2Key);

  btn.disabled = !(homeroomOk && numOk && nameOk && titleOk && fileOk);
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

function persistDraftFromForm() {
  const form = document.getElementById('entry-form');
  saveContestDraft(extractContestDraft(form, getHomeroomValue()));
}

async function handleSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('entry-form');
  const btn = document.getElementById('submit-btn');
  const homeroom = getHomeroomValue();
  const formData = new FormData(form);

  if (scheduleType === 'full_time' && !isValidHomeroom(homeroom)) {
    showToast('クラスは 101〜109、201〜209、301〜309 から選択してください', 'error');
    return;
  }
  const title = String(formData.get('title') ?? '').trim();
  if (!title || title.length > 40) {
    showToast('タイトルを入力してください（40文字以内）', 'error');
    return;
  }
  if (!uploadResult?.r2Key) {
    showToast('ファイルをアップロードしてください', 'error');
    return;
  }

  btn.disabled = true;
  try {
    const titleRaw = String(formData.get('title') ?? '').trim();
    const summaryRaw = String(formData.get('summary') ?? '').trim();
    const printNotesRaw = String(formData.get('print_notes') ?? '').trim();
    const payload = {
      schedule_type: scheduleType,
      homeroom,
      student_number: Number(formData.get('student_number')),
      student_name: String(formData.get('student_name')).trim(),
      title: titleRaw,
      stl_r2_key: uploadResult.r2Key,
      stl_filename: uploadResult.filename,
      stl_size_bytes: uploadResult.size,
      ...(summaryRaw ? { summary: summaryRaw } : {}),
      ...(printNotesRaw ? { print_notes: printNotesRaw } : {}),
    };
    const data = await apiRequest('entries', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    saveContestDraft(extractContestDraft(form, homeroom));
    showToast(data.message || '印刷依頼を受け付けました。担当者の承認をお待ちください', 'success');
    uploadResult = null;
    document.getElementById('selected-file-name').textContent = '';
    document.getElementById('upload-progress').classList.add('hidden');
    document.getElementById('upload-status').textContent = '';
    await loadCalendar();
    updateSubmitState();
  } catch (err) {
    showToast(err.message || '登録に失敗しました', 'error');
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

  document.querySelectorAll('input[name="schedule_type"]').forEach((input) => {
    input.addEventListener('change', () => {
      scheduleType = parseScheduleType(input.value);
      updateScheduleTypeUi();
      persistDraftFromForm();
    });
  });

  const form = document.getElementById('entry-form');
  form.addEventListener('input', () => {
    persistDraftFromForm();
    updateSubmitState();
  });
  form.addEventListener('submit', handleSubmit);

  setupUploadZone();
  await initAuth();

  const draft = loadContestDraft();
  if (draft) {
    applyContestDraft(form, draft);
    scheduleType = parseScheduleType(draft.schedule_type);
  }
  updateScheduleTypeUi();

  try {
    await loadCalendar();
  } catch (err) {
    showToast(err.message, 'error');
  }
  updateSubmitState();
}

init();
