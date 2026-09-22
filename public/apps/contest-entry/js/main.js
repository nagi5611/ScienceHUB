// public/apps/contest-entry/js/main.js
import { apiRequest } from './api.js';
import { indexReservationOccurrencesByDate, getCalendarScalePrintLabel } from '../../../js/print-reservation-calendar-span.js';
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
import { initContestPublicGallery } from './gallery.js';

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

function formatSubmittedAt(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function submittedStlDownloadUrl(applicationId) {
  return `/api/contest/applications/${encodeURIComponent(applicationId)}/stl`;
}

let currentYear;
let currentMonth;
let calendarReservations = [];
/** @type {Array<{ r2Key: string, filename: string, size: number }>} */
let uploadResults = [];
let stlFileLimit = 1;
let calendarNavLock = false;
let calendarLoading = false;
let lastWheelMonthNavAt = 0;
const WHEEL_MONTH_COOLDOWN_MS = 420;
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
    document.getElementById('multi-part-field')?.classList.add('hidden');
    document.getElementById('part-count-field')?.classList.add('hidden');
  } else {
    if (heading) heading.textContent = '参加申請';
    if (submitBtn) submitBtn.textContent = '参加申請する';
    if (hint) hint.textContent = 'クラス・出席番号・名前。1行目が印刷依頼の代表者です';
    scheduleFieldset?.classList.remove('contest-fieldset-readonly');
    document.getElementById('self-print-field')?.classList.remove('hidden');
    document.getElementById('self-print-readonly-hint')?.classList.add('hidden');
    document.getElementById('multi-part-field')?.classList.remove('hidden');
    document.getElementById('part-count-field')?.classList.add('hidden');
    document.getElementById('multi-part-readonly-hint')?.classList.add('hidden');
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
  const multiPart = document.getElementById('uses_multiple_parts');
  if (multiPart instanceof HTMLInputElement) multiPart.checked = false;
  const partCount = document.getElementById('part_count');
  if (partCount instanceof HTMLInputElement) partCount.value = '';
  updateMultiPartFieldVisibility();
  participants = [createEmptyParticipant()];
}

function updateMultiPartFieldVisibility() {
  const checkbox = document.getElementById('uses_multiple_parts');
  const partCountField = document.getElementById('part-count-field');
  const checked = checkbox instanceof HTMLInputElement && checkbox.checked;
  partCountField?.classList.toggle('hidden', !checked);
}

function isPartCountValid(raw) {
  const n = Number(String(raw).trim());
  return Number.isInteger(n) && n >= 2 && n <= 20;
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
    const multiPartLine = app.uses_multiple_parts && app.part_count
      ? `<p class="hint">パーツ数: ${escapeHtml(String(app.part_count))}（複数 STL）</p>`
      : '';
    const submittedAtLine =
      app.can_download_submitted_stl && app.submitted_stl_at
        ? `<p class="hint contest-submitted-at">提出日時: ${escapeHtml(formatSubmittedAt(app.submitted_stl_at))}</p>`
        : '';
    const downloadBtn = app.can_download_submitted_stl
      ? `<a href="${escapeHtml(submittedStlDownloadUrl(app.id))}" class="btn btn-secondary btn-sm" download>提出 STL を確認</a>`
      : '';
    const submitBtn = app.can_submit_stl
      ? `<button type="button" class="btn btn-primary btn-sm contest-card-submit" data-id="${escapeHtml(app.id)}">${app.can_download_submitted_stl ? 'STL を再提出' : 'STL を提出'}</button>`
      : !app.can_download_submitted_stl
        ? `<span class="contest-card-status">${escapeHtml(submissionStatusLabel(app))}</span>`
        : '';
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
        ${multiPartLine}
        <p class="contest-application-submission">${escapeHtml(submissionStatusLabel(app))}</p>
        ${submittedAtLine}
      </div>
      <div class="contest-application-card-actions">
        ${editBtn}
        ${withdrawBtn}
        ${downloadBtn}
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
  document.getElementById('multi-part-field')?.classList.add('hidden');
  document.getElementById('part-count-field')?.classList.add('hidden');
  const multiHint = document.getElementById('multi-part-readonly-hint');
  if (multiHint) {
    if (app.uses_multiple_parts && app.part_count) {
      multiHint.textContent = `この作品は ${app.part_count} パーツ（複数 STL）で登録されています`;
      multiHint.classList.remove('hidden');
    } else {
      multiHint.textContent = '';
      multiHint.classList.add('hidden');
    }
  }
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
  uploadResults = [];
  stlFileLimit = app.stl_file_limit ?? (app.uses_multiple_parts && app.part_count ? app.part_count : 1);
  const fileInput = document.getElementById('file-input');
  if (fileInput instanceof HTMLInputElement) {
    fileInput.multiple = stlFileLimit > 1;
  }
  const uploadHint = document.getElementById('upload-file-hint');
  if (uploadHint) {
    uploadHint.textContent =
      stlFileLimit > 1
        ? `またはクリックしてファイルを選択（最大 ${stlFileLimit} 件・.stl .gcode .gco .nc）`
        : 'またはクリックしてファイルを選択（.stl .gcode .gco .nc）';
  }
  document.getElementById('selected-file-name').textContent = '';
  document.getElementById('upload-progress')?.classList.add('hidden');
  document.getElementById('upload-status').textContent = '';
  document.getElementById('submit-target-label').textContent = app.self_print
    ? `提出先: ${app.title}（自己印刷・予約なし）`
    : `提出先: ${app.title}`;
  const existingPanel = document.getElementById('existing-submission-panel');
  const existingSummary = document.getElementById('existing-submission-summary');
  const existingDownload = document.getElementById('existing-submission-download');
  if (existingPanel && existingSummary && existingDownload) {
    if (app.can_download_submitted_stl) {
      const when = formatSubmittedAt(app.submitted_stl_at);
      const name = app.submitted_stl_filename ? `（${app.submitted_stl_filename}）` : '';
      existingSummary.textContent = when
        ? `現在の提出: ${when}${name}`
        : `提出済みのファイル${name}`;
      existingDownload.href = submittedStlDownloadUrl(app.id);
      existingPanel.classList.remove('hidden');
    } else {
      existingPanel.classList.add('hidden');
    }
  }
  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) {
    submitBtn.textContent = app.can_download_submitted_stl ? 'STL を再提出する' : 'STL を提出する';
  }
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

  let multiPartOk = true;
  if (applicationFormMode === 'create') {
    const usesMulti = form.querySelector('#uses_multiple_parts')?.checked === true;
    if (usesMulti) {
      multiPartOk = isPartCountValid(formData.get('part_count'));
    }
  }

  btn.disabled = !(participantsOk && titleOk && multiPartOk);
}

function getSelectedSubmitApplication() {
  return applications.find((a) => a.id === selectedApplicationId) ?? null;
}

function updateSubmitButtonLabel(btn, app) {
  const uploaded = uploadResults.length;
  const limit = stlFileLimit;
  if (!app) {
    btn.textContent = '提出する';
    return;
  }
  if (app.self_print) {
    btn.textContent =
      uploaded >= limit
        ? `STL を提出する（${limit} 件）`
        : `STL を提出する（${uploaded} / ${limit} 件）`;
    return;
  }
  btn.textContent =
    uploaded >= limit
      ? `印刷予約する（${limit} パーツ）`
      : `印刷予約（${uploaded} / ${limit} 件の STL）`;
}

function updateSubmitState() {
  const btn = document.getElementById('submit-btn');
  if (!btn) return;
  const countOk = uploadResults.length === stlFileLimit;
  btn.disabled = !countOk || !selectedApplicationId;
  updateSubmitButtonLabel(btn, getSelectedSubmitApplication());
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
      const usesMultipleParts = form.querySelector('#uses_multiple_parts')?.checked === true;
      const partCountRaw = String(formData.get('part_count') ?? '').trim();
      if (usesMultipleParts && !isPartCountValid(partCountRaw)) {
        showToast('パーツ数は2〜20の整数で入力してください', 'error');
        btn.disabled = false;
        return;
      }
      await apiRequest('applications', {
        method: 'POST',
        body: JSON.stringify({
          schedule_type: scheduleType,
          title: String(formData.get('title')).trim(),
          impressions: String(formData.get('impressions') ?? '').trim() || null,
          participants: payloadParticipants,
          self_print: form.querySelector('#self_print')?.checked === true,
          uses_multiple_parts: usesMultipleParts,
          part_count: usesMultipleParts ? Number(partCountRaw) : null,
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

/** CSS トランジション完了を待つ */
function waitForTransition(el, ms = 320) {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.removeEventListener('transitionend', onEnd);
      resolve();
    };
    const onEnd = (e) => {
      if (e.target !== el) return;
      finish();
    };
    el.addEventListener('transitionend', onEnd);
    setTimeout(finish, ms);
  });
}

function applyMonthDelta(delta) {
  currentMonth += delta;
  if (currentMonth > 12) {
    currentMonth = 1;
    currentYear += 1;
  } else if (currentMonth < 1) {
    currentMonth = 12;
    currentYear -= 1;
  }
}

async function loadCalendar() {
  if (calendarLoading) return;
  calendarLoading = true;
  try {
    const data = await apiRequest(`calendar?year=${currentYear}&month=${currentMonth}`);
    calendarReservations = (data.reservations ?? []).filter((r) =>
      CALENDAR_STATUSES.includes(r.status)
    );
    renderCalendar();
  } finally {
    calendarLoading = false;
  }
}

async function changeMonth(delta) {
  applyMonthDelta(delta);
  await loadCalendar();
}

/** スライドアニメーション付きで月を移動 */
async function navigateMonthWithSlide(delta) {
  if (calendarNavLock || calendarLoading) return;

  const grid = document.getElementById('calendar-grid');
  if (!grid) {
    await changeMonth(delta);
    return;
  }

  calendarNavLock = true;
  const exitClass = delta > 0 ? 'is-sliding-out-next' : 'is-sliding-out-prev';
  const enterClass = delta > 0 ? 'is-sliding-in-from-next' : 'is-sliding-in-from-prev';

  try {
    grid.classList.add(exitClass);
    await waitForTransition(grid);

    grid.classList.remove(exitClass);
    grid.classList.add(enterClass);
    await changeMonth(delta);

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

function onCalendarMonthNav(delta) {
  navigateMonthWithSlide(delta).catch((err) => showToast(err.message, 'error'));
}

/** スワイプで月を移動（モバイル） */
function initContestCalendarSwipeNavigation() {
  const wrap = document.querySelector('#calendar-section .calendar-grid-wrap');
  if (!wrap || wrap.dataset.swipeBound === '1') return;
  wrap.dataset.swipeBound = '1';

  let startX = 0;
  let tracking = false;

  wrap.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      tracking = true;
    },
    { passive: true }
  );

  wrap.addEventListener(
    'touchend',
    (e) => {
      if (!tracking) return;
      tracking = false;
      const touch = e.changedTouches[0];
      if (!touch) return;
      const dx = touch.clientX - startX;
      if (Math.abs(dx) < 48) return;
      if (Date.now() - lastWheelMonthNavAt < WHEEL_MONTH_COOLDOWN_MS) return;
      onCalendarMonthNav(dx < 0 ? 1 : -1);
    },
    { passive: true }
  );
}

/** カレンダー上のホイールで月を移動 */
function initContestCalendarWheelNavigation() {
  const section = document.getElementById('calendar-section');
  if (!section || section.dataset.wheelBound === '1') return;
  section.dataset.wheelBound = '1';

  section.addEventListener(
    'wheel',
    (e) => {
      const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(raw) < 15) return;

      e.preventDefault();

      if (Date.now() - lastWheelMonthNavAt < WHEEL_MONTH_COOLDOWN_MS) return;
      if (calendarNavLock || calendarLoading) return;

      const delta = raw > 0 ? 1 : -1;
      navigateMonthWithSlide(delta).catch((err) => showToast(err.message, 'error'));
    },
    { passive: false }
  );
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

  const monthPrefix = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
  const byDate = indexReservationOccurrencesByDate(
    calendarReservations.filter((r) => {
      const end = r.calendar_end_date || r.desired_date;
      return r.desired_date.slice(0, 7) <= monthPrefix && end.slice(0, 7) >= monthPrefix;
    })
  );

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

  const dayEntries = dateStr && byDate[dateStr] ? byDate[dateStr] : [];
  if (dayEntries.length) {
    const slotsWrap = document.createElement('div');
    slotsWrap.className = 'calendar-slots';
    for (const { reservation: r, occurrence } of dayEntries) {
      const slot = document.createElement('div');
      const statusClass = CALENDAR_STATUSES.includes(r.status) ? r.status : 'applied';
      slot.className = `calendar-slot calendar-slot--readonly status-${statusClass} ${occurrence.printScale}`;
      slot.classList.add(`calendar-slot-segment-${occurrence.segment}`);
      if (occurrence.segment !== 'start' && occurrence.segment !== 'single') {
        slot.classList.add('calendar-slot-span-continue');
      }
      const statusLabel = STATUS_LABELS[statusClass] ?? statusClass;
      const scaleLabel = getCalendarScalePrintLabel(occurrence.partCount);
      const primary =
        occurrence.displayLabel ||
        (scaleLabel && occurrence.segment === 'start' ? scaleLabel : r.title ?? '');
      const label = `${statusLabel} ${truncateForCell(primary, 4)}`;
      slot.innerHTML = `<span class="calendar-slot-compact-label">${escapeHtml(label)}</span>`;
      slot.title = `${statusLabel} — ${primary || r.title || ''}`;
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

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList ?? []).slice(0, stlFileLimit);
    if (!files.length) return;
    if (files.length > stlFileLimit) {
      showToast(`ファイルは最大 ${stlFileLimit} 件まで選択できます`, 'error');
      return;
    }
    uploadResults = [];
    updateSubmitState();
    progress.classList.remove('hidden');
    progressBar.style.width = '0%';
    statusEl.textContent = 'アップロード中…';
    fileNameEl.textContent = '';

    const overlayHints = {
      認証中: 'アップロードの準備をしています',
      処理中: 'ファイルを送信しています',
    };

    try {
      setPrintFlowOverlay(true, '認証中…', overlayHints['認証中']);
      const uploaded = [];
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        const label = files.length > 1 ? `（${i + 1}/${files.length}）` : '';
        statusEl.textContent = `アップロード中…${label}`;
        const result = await uploadPrintFile(
          file,
          (pct) => {
            const overall = ((i + pct / 100) / files.length) * 100;
            progressBar.style.width = `${overall}%`;
          },
          (stage) => {
            const hint = overlayHints[stage] ?? '';
            setPrintFlowOverlay(true, `${stage}…`, hint);
            statusEl.textContent = `${stage}…${label}`;
          }
        );
        uploaded.push({
          r2Key: result.r2Key,
          filename: result.filename,
          size: result.size,
        });
      }
      uploadResults = uploaded;
      fileNameEl.textContent = uploaded.map((u) => u.filename).join('、 ');
      progressBar.style.width = '100%';
      statusEl.textContent =
        stlFileLimit > 1
          ? `${uploaded.length} / ${stlFileLimit} 件アップロード完了`
          : 'アップロード完了';
      updateSubmitState();
    } catch (err) {
      uploadResults = [];
      fileNameEl.textContent = '';
      statusEl.textContent = err.message || 'アップロードに失敗しました';
      progress.classList.add('hidden');
      updateSubmitState();
    } finally {
      setPrintFlowOverlay(false);
    }
  };

  zone.addEventListener('click', () => input.click());
  input.addEventListener('change', () => handleFiles(input.files));
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    if (e.dataTransfer?.files?.length) handleFiles(e.dataTransfer.files);
  });
}

async function handleStlSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const form = document.getElementById('submit-form');
  if (uploadResults.length !== stlFileLimit || !selectedApplicationId) {
    showToast(
      stlFileLimit > 1
        ? `STL ファイルを ${stlFileLimit} 件アップロードしてください`
        : 'ファイルをアップロードしてください',
      'error'
    );
    return;
  }

  const printNotesRaw = String(new FormData(form).get('print_notes') ?? '').trim();
  const app = applications.find((a) => a.id === selectedApplicationId);
  const selfPrint = app?.self_print === true;

  btn.disabled = true;
  try {
    const payload =
      uploadResults.length === 1
        ? {
            contest_application_id: selectedApplicationId,
            stl_r2_key: uploadResults[0].r2Key,
            stl_filename: uploadResults[0].filename,
            stl_size_bytes: uploadResults[0].size,
          }
        : {
            contest_application_id: selectedApplicationId,
            stl_files: uploadResults.map((u) => ({
              stl_r2_key: u.r2Key,
              stl_filename: u.filename,
              stl_size_bytes: u.size,
            })),
          };

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
        ...payload,
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

  document.getElementById('prev-month')?.addEventListener('click', () => onCalendarMonthNav(-1));
  document.getElementById('next-month')?.addEventListener('click', () => onCalendarMonthNav(1));
  document.getElementById('prev-month-mobile')?.addEventListener('click', () => onCalendarMonthNav(-1));
  document.getElementById('next-month-mobile')?.addEventListener('click', () => onCalendarMonthNav(1));
  document.getElementById('go-today-btn')?.addEventListener('click', goToToday);
  initContestCalendarWheelNavigation();
  initContestCalendarSwipeNavigation();

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
  document.getElementById('uses_multiple_parts')?.addEventListener('change', () => {
    updateMultiPartFieldVisibility();
    persistApplicationDraft();
    updateApplicationSubmitState();
  });

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
  updateMultiPartFieldVisibility();

  try {
    await loadApplications();
    await loadCalendar();
    await initContestPublicGallery();
  } catch (err) {
    showToast(err.message, 'error');
  }
  showView('list');
}

init();
