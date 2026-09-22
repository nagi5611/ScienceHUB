// public/apps/contest-entry/js/main.js
import { apiRequest } from './api.js';
import { uploadPrintFile } from './upload/simple.js';
import { HOMEROOMS } from '../../3dprint-reservation/js/homeroom.js';
import { checkAppAccess, initAuth } from './contest-auth.js';
import {
  applyContestDraft,
  extractContestDraft,
  loadContestDraft,
  parseScheduleType,
  saveContestDraft,
} from './entry-draft.js';
import { setPrintFlowOverlay } from './print-flow-overlay.js';

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
  part_time: '定時制',
};

let currentYear;
let currentMonth;
let calendarReservations = [];
let uploadResult = null;
let scheduleType = 'full_time';
let applications = [];
let selectedApplicationId = null;
/** @type {'create' | 'edit'} */
let applicationFormMode = 'create';
let editingApplicationId = null;

/** @typedef {{ homeroom: string, student_number: string, student_name: string }} ParticipantRow */

/** @returns {ParticipantRow} */
function createEmptyParticipant() {
  return { homeroom: '', student_number: '', student_name: '' };
}

/** @type {ParticipantRow[]} */
let participants = [createEmptyParticipant()];

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

function populateHomeroomDatalist() {
  const datalist = document.getElementById('homeroom-datalist');
  if (!datalist) return;
  datalist.innerHTML = HOMEROOMS.map((h) => `<option value="${escapeHtml(h)}"></option>`).join('');
}

function syncParticipantsFromDom() {
  const list = document.getElementById('participant-list');
  if (!list) return;
  list.querySelectorAll('.contest-participant-row').forEach((row, index) => {
    if (!participants[index]) participants[index] = createEmptyParticipant();
    participants[index].homeroom =
      row.querySelector('.participant-homeroom')?.value.trim() ?? '';
    participants[index].student_number =
      row.querySelector('.participant-number')?.value.trim() ?? '';
    participants[index].student_name =
      row.querySelector('.participant-name')?.value.trim() ?? '';
  });
}

function isParticipantRowValid(row) {
  const homeroom = row.homeroom.trim();
  const num = row.student_number.trim();
  const name = row.student_name.trim();
  let homeroomOk = false;
  if (scheduleType === 'full_time') {
    homeroomOk = homeroom.length > 0 && HOMEROOMS.includes(homeroom);
  } else {
    homeroomOk = homeroom.length >= 1 && homeroom.length <= 20;
  }
  const numOk = /^\d+$/.test(num) && Number(num) >= 1 && Number(num) <= 99;
  const nameOk = name.length >= 1 && name.length <= 50;
  return homeroomOk && numOk && nameOk;
}

function renderParticipantList() {
  const list = document.getElementById('participant-list');
  if (!list) return;

  list.innerHTML = '';
  const isFull = scheduleType === 'full_time';
  const lockPrimary = applicationFormMode === 'edit';

  participants.forEach((row, index) => {
    const li = document.createElement('li');
    li.className = 'contest-participant-row';
    if (lockPrimary && index === 0) li.classList.add('contest-participant-row--locked');
    const homeroomAttrs = isFull
      ? 'list="homeroom-datalist" maxlength="3" placeholder="101"'
      : 'maxlength="20" placeholder="クラス"';
    const lockAttrs = lockPrimary && index === 0 ? ' readonly disabled' : '';
    let removeBtn = '<span class="participant-remove-placeholder" aria-hidden="true"></span>';
    if (!(lockPrimary && index === 0) && participants.length > 1) {
      removeBtn = `<button type="button" class="btn btn-secondary btn-sm participant-remove" data-index="${index}" aria-label="削除">×</button>`;
    }

    li.innerHTML = `
      <input type="text" class="participant-homeroom" ${homeroomAttrs}${lockAttrs} value="${escapeHtml(row.homeroom)}" autocomplete="off" />
      <input type="number" class="participant-number" min="1" max="99" placeholder="番号"${lockAttrs} value="${escapeHtml(row.student_number)}" />
      <input type="text" class="participant-name" maxlength="50" placeholder="名前"${lockAttrs} value="${escapeHtml(row.student_name)}" />
      ${removeBtn}
    `;
    list.appendChild(li);
  });

  list.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', () => {
      syncParticipantsFromDom();
      persistApplicationDraft();
      updateApplicationSubmitState();
    });
  });
  list.querySelectorAll('.participant-remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.index);
      participants.splice(idx, 1);
      if (participants.length === 0) participants.push(createEmptyParticipant());
      renderParticipantList();
      persistApplicationDraft();
      updateApplicationSubmitState();
    });
  });
}

function updateScheduleTypeUi() {
  renderParticipantList();
  updateApplicationSubmitState();
}

function formatParticipantSummary(members) {
  if (!members?.length) return '';
  return members
    .map((m) => {
      const cls = m.homeroom ?? '';
      const num = m.student_number != null ? `${m.student_number}番` : '';
      const name = m.member_name ?? '';
      return [cls, num, name].filter(Boolean).join(' ');
    })
    .join('、');
}

function participantsFromApplication(app) {
  if (app.members?.length) {
    return app.members.map((m) => ({
      homeroom: String(m.homeroom ?? app.homeroom ?? ''),
      student_number: String(m.student_number ?? app.student_number ?? ''),
      student_name: String(m.member_name ?? ''),
    }));
  }
  return [
    {
      homeroom: String(app.homeroom ?? ''),
      student_number: String(app.student_number ?? ''),
      student_name: String(app.student_name ?? ''),
    },
  ];
}

function setApplicationFormMode(mode) {
  applicationFormMode = mode;
  const heading = document.getElementById('apply-heading');
  const submitBtn = document.getElementById('application-submit-btn');
  const hint = document.getElementById('participant-hint');
  const scheduleFieldset = document.querySelector('#application-form fieldset');
  if (mode === 'edit') {
    if (heading) heading.textContent = '参加申請の編集';
    if (submitBtn) submitBtn.textContent = '変更を保存';
    if (hint) {
      hint.textContent =
        '1行目（代表者）は変更できません。タイトル・感想と、2行目以降のメンバーを編集できます';
    }
    scheduleFieldset?.classList.add('contest-fieldset-readonly');
    document.getElementById('self-print-field')?.classList.add('hidden');
  } else {
    if (heading) heading.textContent = '参加申請';
    if (submitBtn) submitBtn.textContent = '参加申請する';
    if (hint) hint.textContent = 'クラス・出席番号・名前。1行目が印刷依頼の代表者です';
    scheduleFieldset?.classList.remove('contest-fieldset-readonly');
    document.getElementById('self-print-field')?.classList.remove('hidden');
    document.getElementById('self-print-readonly-hint')?.classList.add('hidden');
  }
  document.querySelectorAll('#application-form input[name="schedule_type"]').forEach((input) => {
    input.disabled = mode === 'edit';
  });
}

function resetApplicationFormForCreate() {
  editingApplicationId = null;
  setApplicationFormMode('create');
  scheduleType = 'full_time';
  document.querySelectorAll('#application-form input[name="schedule_type"]').forEach((input) => {
    input.checked = input.value === 'full_time';
  });
  const form = document.getElementById('application-form');
  form?.reset();
  const selfPrint = document.getElementById('self_print');
  if (selfPrint instanceof HTMLInputElement) selfPrint.checked = false;
  participants = [createEmptyParticipant()];
}

function submissionStatusLabel(app) {
  if (app.self_print) {
    if (app.stl_submitted_at) return '提出済み（自己印刷）';
    return 'STL 未提出';
  }
  if (!app.reservation) return 'STL 未提出';
  const status = app.reservation.status;
  if (status === 'delivered') return '印刷完了';
  return STATUS_LABELS[status] ?? status;
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
        ? `<p class="hint">参加者: ${escapeHtml(formatParticipantSummary(app.members))}</p>`
        : '';
    const selfPrintLine = app.self_print
      ? '<p class="hint">印刷: 自分で行う（学校プリンター予約なし）</p>'
      : '';
    const submitBtn = app.can_submit_stl
      ? `<button type="button" class="btn btn-primary btn-sm contest-card-submit" data-id="${escapeHtml(app.id)}">STL を提出</button>`
      : `<span class="contest-card-status">${escapeHtml(submissionStatusLabel(app))}</span>`;
    const editBtn =
      app.status === 'approved'
        ? `<button type="button" class="btn btn-secondary btn-sm contest-card-edit" data-id="${escapeHtml(app.id)}">編集</button>`
        : '';
    const withdrawBtn = app.can_withdraw
      ? `<button type="button" class="btn btn-secondary btn-sm contest-card-withdraw" data-id="${escapeHtml(app.id)}">参加取り消し</button>`
      : '';

    li.innerHTML = `
      <div class="contest-application-card-body">
        <h3 class="contest-application-title">${escapeHtml(app.title)}</h3>
        <p class="hint">${escapeHtml(SCHEDULE_LABELS[app.schedule_type] ?? app.schedule_type)} · ${escapeHtml(app.homeroom)} · ${escapeHtml(app.student_name)}</p>
        ${memberLine}
        ${selfPrintLine}
        <p class="contest-application-submission">${escapeHtml(submissionStatusLabel(app))}</p>
      </div>
      <div class="contest-application-card-actions">
        ${editBtn}
        ${withdrawBtn}
        ${submitBtn}
      </div>
    `;
    listEl.appendChild(li);
  }

  listEl.querySelectorAll('.contest-card-submit').forEach((btn) => {
    btn.addEventListener('click', () => openSubmitView(btn.dataset.id));
  });
  listEl.querySelectorAll('.contest-card-edit').forEach((btn) => {
    btn.addEventListener('click', () => openEditView(btn.dataset.id));
  });
  listEl.querySelectorAll('.contest-card-withdraw').forEach((btn) => {
    btn.addEventListener('click', () => handleWithdrawApplication(btn.dataset.id));
  });
}

async function handleWithdrawApplication(applicationId) {
  const app = applications.find((a) => a.id === applicationId);
  if (!app?.can_withdraw) {
    showToast('この作品は参加取り消しできません', 'error');
    return;
  }
  const message = app.reservation
    ? 'この作品の参加を取り消しますか？関連する印刷予約も取り消されます。'
    : 'この作品の参加を取り消しますか？';
  if (!window.confirm(message)) return;

  try {
    await apiRequest(`applications/${applicationId}/withdraw`, { method: 'POST' });
    showToast('参加を取り消しました', 'success');
    await loadApplications();
    await loadCalendar();
  } catch (err) {
    showToast(err.message || '参加取り消しに失敗しました', 'error');
  }
}

async function loadApplications() {
  const data = await apiRequest('applications');
  applications = data.applications ?? [];
  renderApplicationsList();
}

function openApplyView() {
  resetApplicationFormForCreate();
  showView('apply');
  renderParticipantList();
  updateApplicationSubmitState();
}

function openEditView(applicationId) {
  const app = applications.find((a) => a.id === applicationId);
  if (!app) {
    showToast('参加申請が見つかりません', 'error');
    return;
  }
  editingApplicationId = applicationId;
  scheduleType = app.schedule_type === 'part_time' ? 'part_time' : 'full_time';
  setApplicationFormMode('edit');
  document.querySelectorAll('#application-form input[name="schedule_type"]').forEach((input) => {
    input.checked = input.value === scheduleType;
  });
  const form = document.getElementById('application-form');
  if (form) {
    form.title.value = app.title ?? '';
    form.impressions.value = app.impressions ?? '';
  }
  document.getElementById('self-print-readonly-hint')?.classList.toggle('hidden', !app.self_print);
  participants = participantsFromApplication(app);
  showView('apply');
  renderParticipantList();
  updateApplicationSubmitState();
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
  document.getElementById('submit-target-label').textContent = app.self_print
    ? `提出先: ${app.title}（自己印刷・予約なし）`
    : `提出先: ${app.title}`;
  showView('submit');
  updateSubmitState();
}

function persistApplicationDraft() {
  if (applicationFormMode === 'edit') return;
  const form = document.getElementById('application-form');
  if (!form) return;
  syncParticipantsFromDom();
  saveContestDraft(extractContestDraft(form, participants));
}

function updateApplicationSubmitState() {
  const btn = document.getElementById('application-submit-btn');
  const form = document.getElementById('application-form');
  if (!btn || !form) return;

  syncParticipantsFromDom();
  const formData = new FormData(form);
  const title = String(formData.get('title') ?? '').trim();
  const titleOk = title.length >= 1 && title.length <= 40;
  const rowsToValidate =
    applicationFormMode === 'edit' ? participants.slice(1) : participants;
  const participantsOk =
    participants.length > 0 &&
    (applicationFormMode === 'edit' || participants.every((row) => isParticipantRowValid(row))) &&
    rowsToValidate.every((row) => isParticipantRowValid(row));

  btn.disabled = !(participantsOk && titleOk);
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
  syncParticipantsFromDom();
  const formData = new FormData(form);

  if (applicationFormMode === 'create') {
    if (!participants.every((row) => isParticipantRowValid(row))) {
      showToast('メンバーのクラス・出席番号・名前をすべて入力してください', 'error');
      return;
    }
  } else if (participants.slice(1).some((row) => !isParticipantRowValid(row))) {
    showToast('追加メンバーのクラス・出席番号・名前をすべて入力してください', 'error');
    return;
  }

  const payloadParticipants = participants.map((row) => ({
    homeroom: row.homeroom.trim(),
    student_number: Number(row.student_number),
    student_name: row.student_name.trim(),
  }));

  btn.disabled = true;
  try {
    if (applicationFormMode === 'edit' && editingApplicationId) {
      await apiRequest(`applications/${editingApplicationId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: String(formData.get('title')).trim(),
          impressions: String(formData.get('impressions') ?? '').trim() || null,
          participants: payloadParticipants,
        }),
      });
      showToast('参加申請を更新しました', 'success');
    } else {
      await apiRequest('applications', {
        method: 'POST',
        body: JSON.stringify({
          schedule_type: scheduleType,
          title: String(formData.get('title')).trim(),
          impressions: String(formData.get('impressions') ?? '').trim() || null,
          participants: payloadParticipants,
          self_print: form.querySelector('#self_print')?.checked === true,
        }),
      });
      persistApplicationDraft();
      showToast('参加申請を受け付けました。STL を提出してください', 'success');
    }
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
    statusEl.textContent = '';

    const overlayHints = {
      認証中: 'アップロードの準備をしています',
      処理中: 'ファイルを送信しています',
    };

    try {
      setPrintFlowOverlay(true, '認証中…', overlayHints['認証中']);
      uploadResult = await uploadPrintFile(
        file,
        (pct) => {
          progressBar.style.width = `${pct}%`;
        },
        (stage) => {
          const hint = overlayHints[stage] ?? '';
          setPrintFlowOverlay(true, `${stage}…`, hint);
          statusEl.textContent = `${stage}…`;
        }
      );
      statusEl.textContent = 'アップロード完了';
      updateSubmitState();
    } catch (err) {
      fileNameEl.textContent = '';
      statusEl.textContent = err.message || 'アップロードに失敗しました';
      progress.classList.add('hidden');
    } finally {
      setPrintFlowOverlay(false);
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
  const app = applications.find((a) => a.id === selectedApplicationId);
  const selfPrint = app?.self_print === true;

  btn.disabled = true;
  try {
    setPrintFlowOverlay(true, '認証中…', '提出内容を確認しています');
    await new Promise((resolve) => {
      requestAnimationFrame(() => resolve());
    });
    setPrintFlowOverlay(true, '処理中…', 'STL ファイルを確認しています');
    await new Promise((resolve) => {
      requestAnimationFrame(() => resolve());
    });
    if (!selfPrint) {
      setPrintFlowOverlay(
        true,
        '予約確認中…',
        '印刷日の割り当てと依頼登録を行っています'
      );
    }

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
    showToast(data.message || (data.self_print ? 'STL を提出しました' : '印刷依頼を受け付けました'), 'success');
    selectedApplicationId = null;
    showView('list');
    await loadApplications();
    await loadCalendar();
  } catch (err) {
    showToast(err.message || '提出に失敗しました', 'error');
  } finally {
    setPrintFlowOverlay(false);
    updateSubmitState();
  }
}

async function init() {
  const allowed = await checkAppAccess();
  if (!allowed) return;

  populateHomeroomDatalist();
  const now = new Date();
  currentYear = now.getFullYear();
  currentMonth = now.getMonth() + 1;

  document.getElementById('prev-month')?.addEventListener('click', () => changeMonth(-1));
  document.getElementById('next-month')?.addEventListener('click', () => changeMonth(1));
  document.getElementById('prev-month-mobile')?.addEventListener('click', () => changeMonth(-1));
  document.getElementById('next-month-mobile')?.addEventListener('click', () => changeMonth(1));
  document.getElementById('go-today-btn')?.addEventListener('click', goToToday);

  document.getElementById('btn-new-application')?.addEventListener('click', openApplyView);
  document.getElementById('btn-back-from-apply')?.addEventListener('click', () => {
    resetApplicationFormForCreate();
    showView('list');
  });
  document.getElementById('btn-back-from-submit')?.addEventListener('click', () => {
    selectedApplicationId = null;
    showView('list');
  });

  document.getElementById('btn-add-participant')?.addEventListener('click', () => {
    syncParticipantsFromDom();
    participants.push(createEmptyParticipant());
    renderParticipantList();
    persistApplicationDraft();
    const rows = document.querySelectorAll('.contest-participant-row');
    rows[rows.length - 1]?.querySelector('.participant-homeroom')?.focus();
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
    if (Array.isArray(draft.participants) && draft.participants.length > 0) {
      participants = draft.participants.map((p) => ({
        homeroom: String(p.homeroom ?? ''),
        student_number: String(p.student_number ?? ''),
        student_name: String(p.student_name ?? p.name ?? ''),
      }));
    } else {
      participants = [createEmptyParticipant()];
    }
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
