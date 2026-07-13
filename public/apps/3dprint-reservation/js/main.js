// src/js/main.js
import { apiRequest } from './api.js';
import { uploadPrintFile } from './upload/simple.js';
import { setupHomeroomCombobox } from './homeroom.js';
import {
  initAuth,
  canSkipIdentity,
  applyUserToReservationForm,
  applyUserToEditForm,
  identityPayload,
  ensureCanBook,
  updateIdentitySections,
  setupProfileGateForm,
  checkAppAccess,
} from './sciencehub-auth.js';
import {
  DRAFT_STORAGE_KEYS,
  applyReservationDraft,
  applyRetryFormSnapshot,
  extractReservationDraft,
  loadReservationDraft,
  saveReservationDraft,
  updateDraftRestoreButton,
} from './reservation-draft.js';
import {
  buildPrinterCapabilityBadges,
  buildPrinterWaitingBadge,
  formatNozzleSizes,
  formatPrinterWaitingLabel,
  normalizePrinterCapabilities,
} from './printer-capabilities.js';
import {
  buildPrinterStatusBadge,
  isPrinterBookable,
  isPrinterOperational,
  getPrinterStatusLabel,
} from './printer-status.js';

const SCALE_LABELS = { small: 'スモール', medium: 'ミディアム', large: 'ラージ' };
const SCALE_SHORT = { small: 'S', medium: 'M', large: 'L' };
const STATUS_LABELS = {
  applied: '申請中',
  accepted: '受領済み',
  printing: '印刷中',
  delivered: '印刷済み',
  failed: '印刷失敗',
  cancelled: 'キャンセル',
};
const PURPOSE_LABELS = { ss_s_tan: 'SS・S探', club: '部活', other: 'その他' };
const CONTACT_EMAIL = 'diorama@mmh-virtual.jp';
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

let currentYear;
let currentMonth;
let earliestBookable = '';
let selectedDate = '';
let uploadResult = null;
let calendarData = null;
let staffCountByDate = {};
let printerCountByDate = {};
let homeroomField = null;
let editHomeroomField = null;
let currentDetailId = null;
let currentEditSnapshot = null;
let editUploadResult = null;
let reservationListData = null;
let olderPastBatches = [];
let olderPastHasMore = false;
let olderPastCursor = null;
let olderPastLoading = false;
let retryReservationId = null;
let retryFormSnapshot = null;
let retryExistingFile = null;
let lastMobileCalendarView = null;
let availablePrinters = [];
let selectedPrinterId = '';
let formStep = 'printer';
let printerWaitingDateScoped = false;

const MOBILE_CALENDAR_MQ = window.matchMedia('(max-width: 768px)');

/** Returns whether the compact mobile calendar layout is active. */
function isMobileCalendarView() {
  return MOBILE_CALENDAR_MQ.matches;
}

/** Truncates a title for a narrow calendar cell. */
function truncateForCell(text, maxLen = 6) {
  const trimmed = String(text).trim();
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, Math.max(1, maxLen - 1))}…`;
}

/** Returns today's date in JST (YYYY-MM-DD). */
function todayJst() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo' }).format(new Date());
}
/** Syncs CSS offset for stacked sticky headers. */
function updateStickyOffsets() {
  const siteHeader = document.querySelector('.site-header');
  if (!siteHeader) return;
  document.documentElement.style.setProperty('--site-header-offset', `${siteHeader.offsetHeight}px`);
}

async function init() {
  const allowed = await checkAppAccess();
  if (!allowed) return;

  homeroomField = setupHomeroomCombobox('homeroom', 'homeroom-list');
  editHomeroomField = setupHomeroomCombobox('edit-homeroom', 'edit-homeroom-list');
  const now = new Date();
  currentYear = now.getFullYear();
  currentMonth = now.getMonth() + 1;

  document.getElementById('prev-month').addEventListener('click', () => changeMonth(-1));
  document.getElementById('next-month').addEventListener('click', () => changeMonth(1));
  document.getElementById('prev-month-mobile')?.addEventListener('click', () => changeMonth(-1));
  document.getElementById('next-month-mobile')?.addEventListener('click', () => changeMonth(1));
  document.getElementById('go-today-btn')?.addEventListener('click', goToToday);
  document.getElementById('calendar-month-label-mobile')?.addEventListener('click', () => {
    document.getElementById('calendar-month-chips')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  document.getElementById('retry-mode-cancel')?.addEventListener('click', clearRetryMode);

  setupFormModal();
  setupEditModal();
  setupDetailModal();
  setupProfileGateForm(setupHomeroomCombobox);
  await initAuth();
  lastMobileCalendarView = isMobileCalendarView();
  MOBILE_CALENDAR_MQ.addEventListener('change', () => {
    const mobile = isMobileCalendarView();
    if (lastMobileCalendarView !== mobile) {
      lastMobileCalendarView = mobile;
      render();
      if (reservationListData) renderReservationList();
    }
    updateStickyOffsets();
  });
  window.addEventListener('resize', updateStickyOffsets);
  updateStickyOffsets();
  await Promise.all([render(), loadReservationList(), loadPrinters(), loadPrintVideos()]);
  updateStickyOffsets();
}

/** Loads available printers for reservation. */
async function loadPrinters(dateStr = '') {
  try {
    const query = dateStr ? `printers?date=${encodeURIComponent(dateStr)}` : 'printers';
    const data = await apiRequest(query);
    availablePrinters = data.printers ?? [];
    printerWaitingDateScoped = Boolean(dateStr);
  } catch {
    availablePrinters = [];
    printerWaitingDateScoped = false;
  }
}

/** Returns whether the desktop layout should use the large printer picker modal. */
function useLargePrinterModal() {
  return !isMobileCalendarView();
}

/** Updates modal width class for the printer selection step. */
function updateFormModalSize() {
  const dialog = document.getElementById('form-modal-dialog');
  if (!dialog) return;
  dialog.classList.toggle('modal-xl', useLargePrinterModal() && formStep === 'printer');
}

/** Shows the reservation form step (printer or details). */
function showFormStep(step) {
  formStep = step;
  document.getElementById('form-step-printer')?.classList.toggle('hidden', step !== 'printer');
  document.getElementById('reservation-form')?.classList.toggle('hidden', step !== 'details');
  document.getElementById('form-back-btn')?.classList.toggle('hidden', step !== 'details');
  document.getElementById('form-next-btn')?.classList.toggle('hidden', step !== 'printer');
  document.getElementById('submit-btn')?.classList.toggle('hidden', step !== 'details');
  updateFormModalSize();
}

/** Renders the printer picker cards. */
function renderPrinterPicker(preselectedId = '') {
  const picker = document.getElementById('printer-picker');
  const emptyEl = document.getElementById('printer-picker-empty');
  const allUnavailableEl = document.getElementById('printer-picker-all-unavailable');
  const nextBtn = document.getElementById('form-next-btn');
  if (!picker || !emptyEl) return;

  const bookablePrinters = availablePrinters.filter((printer) => isPrinterOperational(printer));

  if (!availablePrinters.length) {
    picker.innerHTML = '';
    emptyEl.classList.remove('hidden');
    allUnavailableEl?.classList.add('hidden');
    selectedPrinterId = '';
    document.getElementById('printer_id').value = '';
    if (nextBtn) nextBtn.disabled = true;
    return;
  }

  emptyEl.classList.add('hidden');

  if (!bookablePrinters.length) {
    picker.innerHTML = availablePrinters
      .map((printer) => {
        const imageHtml = printer.image_url
          ? `<img class="printer-picker-image" src="${escapeHtml(printer.image_url)}" alt="" loading="lazy" />`
          : `<div class="printer-picker-image printer-picker-image-placeholder" aria-hidden="true">🖨️</div>`;
        const statusHtml = buildPrinterStatusBadge(printer.status ?? 'available', { escapeHtml });
        return `
          <div class="printer-picker-card printer-picker-card-unavailable" role="option" aria-disabled="true">
            ${imageHtml}
            <span class="printer-picker-name">${escapeHtml(printer.name)}</span>
            ${statusHtml}
          </div>`;
      })
      .join('');
    allUnavailableEl?.classList.remove('hidden');
    selectedPrinterId = '';
    document.getElementById('printer_id').value = '';
    if (nextBtn) nextBtn.disabled = true;
    return;
  }

  allUnavailableEl?.classList.add('hidden');

  if (preselectedId) {
    const preselected = availablePrinters.find((p) => p.id === preselectedId);
    selectedPrinterId = preselected && isPrinterOperational(preselected) ? preselectedId : '';
  }

  if (selectedPrinterId && !isPrinterOperational(availablePrinters.find((p) => p.id === selectedPrinterId))) {
    selectedPrinterId = '';
  }

  if (!selectedPrinterId) {
    selectedPrinterId = bookablePrinters[0]?.id ?? '';
    document.getElementById('printer_id').value = selectedPrinterId;
  }

  picker.innerHTML = availablePrinters
    .map((printer) => {
      const bookable = isPrinterOperational(printer);
      const selected = bookable && printer.id === selectedPrinterId;
      const imageHtml = printer.image_url
        ? `<img class="printer-picker-image" src="${escapeHtml(printer.image_url)}" alt="" loading="lazy" />`
        : `<div class="printer-picker-image printer-picker-image-placeholder" aria-hidden="true">🖨️</div>`;
      const capabilityHtml = bookable
        ? buildPrinterCapabilityBadges(printer.capabilities, { escapeHtml })
        : '';
      const waitingHtml = bookable
        ? buildPrinterWaitingBadge(printer.waiting_count ?? 0, {
            escapeHtml,
            dateScoped: printerWaitingDateScoped,
          })
        : '';
      const statusHtml = buildPrinterStatusBadge(printer.status ?? 'available', { escapeHtml });
      const unavailableNote = bookable
        ? ''
        : `<p class="printer-picker-unavailable-note">${escapeHtml(
            printer.shift_available === false
              ? 'この日は稼働予定がありません'
              : `${getPrinterStatusLabel(printer.status)}のため予約できません`
          )}</p>`;

      if (!bookable) {
        return `
          <div class="printer-picker-card printer-picker-card-unavailable" role="option" aria-disabled="true">
            ${imageHtml}
            <span class="printer-picker-name">${escapeHtml(printer.name)}</span>
            ${statusHtml}
            ${unavailableNote}
          </div>`;
      }

      return `
        <button type="button" class="printer-picker-card${selected ? ' selected' : ''}" data-printer-id="${escapeHtml(printer.id)}" role="option" aria-selected="${selected ? 'true' : 'false'}">
          ${imageHtml}
          <span class="printer-picker-name">${escapeHtml(printer.name)}</span>
          ${statusHtml}
          ${waitingHtml}
          ${capabilityHtml}
        </button>`;
    })
    .join('');

  picker.querySelectorAll('[data-printer-id]').forEach((btn) => {
    btn.addEventListener('click', () => selectPrinter(btn.dataset.printerId));
  });

  const selectedPrinter = availablePrinters.find((p) => p.id === selectedPrinterId);
  if (nextBtn) nextBtn.disabled = !selectedPrinterId || !isPrinterOperational(selectedPrinter);
}

/** Loads available scales for the selected printer and updates the form. */
async function updateScaleOptionsForSelectedPrinter() {
  const desiredDate = document.getElementById('desired_date')?.value;
  if (!desiredDate || !selectedPrinterId) return;

  const excludeParam = retryReservationId
    ? `&exclude_reservation_id=${encodeURIComponent(retryReservationId)}`
    : '';

  try {
    const availability = await apiRequest(
      `calendar/availability?date=${encodeURIComponent(desiredDate)}&printer_id=${encodeURIComponent(selectedPrinterId)}${excludeParam}`
    );
    setScaleOptions(availability.availableScales ?? []);

    const hint = document.getElementById('scale-restriction-hint');
    if (availability.scales?.includes('small') && availability.availableScales?.length === 1) {
      hint.textContent = 'この機種・この日はスモール印刷が入っているため、スモールのみ選択できます。';
      hint.classList.remove('hidden');
    } else {
      hint.classList.add('hidden');
    }
  } catch (err) {
    showFormAlert(err.message, 'error');
  }
}

/** Selects a printer in the picker. */
async function selectPrinter(printerId) {
  const printer = availablePrinters.find((p) => p.id === printerId);
  if (!printer || !isPrinterOperational(printer)) {
    showFormAlert(
      printer?.shift_available === false
        ? 'この日は選択したプリンターの稼働予定がありません'
        : `${getPrinterStatusLabel(printer?.status)}の機種は予約できません`,
      'error'
    );
    return;
  }
  selectedPrinterId = printerId;
  document.getElementById('printer_id').value = printerId;
  renderPrinterPicker(printerId);
  updateSelectedPrinterDisplay();
  if (formStep === 'details') {
    await updateScaleOptionsForSelectedPrinter();
  }
}

/** Updates the selected printer summary in the details step. */
function updateSelectedPrinterDisplay() {
  const display = document.getElementById('selected-printer-display');
  if (!display) return;

  const printer = availablePrinters.find((p) => p.id === selectedPrinterId);
  if (!printer) {
    display.innerHTML = '';
    display.classList.add('hidden');
    return;
  }

  const caps = normalizePrinterCapabilities(printer.capabilities);
  const imageHtml = printer.image_url
    ? `<img class="selected-printer-thumb" src="${escapeHtml(printer.image_url)}" alt="" loading="lazy" />`
    : `<span class="selected-printer-thumb selected-printer-thumb-placeholder" aria-hidden="true">🖨️</span>`;

  const waitingCount = printer.waiting_count ?? 0;
  const waitingLabel = formatPrinterWaitingLabel(waitingCount, { dateScoped: printerWaitingDateScoped });
  const waitingClass =
    waitingCount > 0 ? 'printer-waiting-summary printer-waiting-summary-busy' : 'printer-waiting-summary';

  display.innerHTML = `
    <div class="selected-printer-summary">
      ${imageHtml}
      <div>
        <p class="selected-printer-label">選択中の機種</p>
        <p class="selected-printer-name">${escapeHtml(printer.name)}</p>
        <p class="${waitingClass}">${escapeHtml(waitingLabel)}</p>
        ${buildPrinterCapabilityBadges(caps, { escapeHtml })}
        <p class="hint selected-printer-spec">ノズル径 ${escapeHtml(formatNozzleSizes(caps.nozzle_sizes_mm))}${caps.can_record_print_video ? ' / 印刷中の動画撮影可' : ''}</p>
      </div>
      <button type="button" class="btn btn-secondary btn-sm" id="change-printer-btn">変更</button>
    </div>`;
  display.classList.remove('hidden');
  document.getElementById('change-printer-btn')?.addEventListener('click', () => showFormStep('printer'));
  updatePrintVideoCheckboxVisibility();
}

/** 動画撮影希望チェックボックスの表示をプリンター能力に合わせて切り替え */
function updatePrintVideoCheckboxVisibility() {
  const group = document.getElementById('request-print-video-group');
  const checkbox = document.getElementById('request_print_video');
  if (!group || !checkbox) return;

  const printer = availablePrinters.find((p) => p.id === selectedPrinterId);
  const canRecord = Boolean(normalizePrinterCapabilities(printer?.capabilities).can_record_print_video);
  group.classList.toggle('hidden', !canRecord);
  if (!canRecord) checkbox.checked = false;
}

/** 修正フォームの動画撮影チェックボックス表示を切り替え */
function updateEditPrintVideoCheckboxVisibility(printerId, checked = false) {
  const group = document.getElementById('edit-request-print-video-group');
  const checkbox = document.getElementById('edit-request-print-video');
  if (!group || !checkbox) return;

  const printer = availablePrinters.find((p) => p.id === printerId);
  const canRecord = Boolean(normalizePrinterCapabilities(printer?.capabilities).can_record_print_video);
  group.classList.toggle('hidden', !canRecord);
  checkbox.checked = canRecord && Boolean(checked);
  if (!canRecord) checkbox.checked = false;
}

/** Advances from printer selection to reservation details. */
async function goToFormDetailsStep() {
  if (!selectedPrinterId) {
    showFormAlert('印刷機種を選択してください', 'error');
    return;
  }

  const printer = availablePrinters.find((p) => p.id === selectedPrinterId);
  if (!printer || !isPrinterOperational(printer)) {
    showFormAlert(
      printer?.shift_available === false
        ? 'この日は選択したプリンターの稼働予定がありません'
        : `${getPrinterStatusLabel(printer?.status)}の機種は予約できません`,
      'error'
    );
    return;
  }

  document.getElementById('printer_id').value = selectedPrinterId;
  updateSelectedPrinterDisplay();
  await updateScaleOptionsForSelectedPrinter();
  updatePrintVideoCheckboxVisibility();
  showFormStep('details');
}

/** Sets up detail modal cancel toggle. */
function setupDetailModal() {
  const modal = document.getElementById('detail-modal');
  const close = () => {
    modal.classList.remove('open');
    currentDetailId = null;
  };

  document.getElementById('detail-modal-close').addEventListener('click', close);
  document.getElementById('detail-close-btn').addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  document.getElementById('detail-cancel-toggle-btn').addEventListener('click', () => {
    handleLoggedInCancel();
  });

  document.getElementById('detail-edit-toggle-btn').addEventListener('click', () => {
    if (!currentEditSnapshot) return;
    document.getElementById('detail-modal').classList.remove('open');
    openEditModal(currentEditSnapshot);
  });
}

/** Sets up the reservation form modal. */
function setupFormModal() {
  const modal = document.getElementById('form-modal');
  const form = document.getElementById('reservation-form');
  const closeBtn = document.getElementById('form-modal-close');
  const cancelBtn = document.getElementById('form-cancel-btn');
  const scaleInputs = document.querySelectorAll('input[name="print_scale"]');
  const purposeInputs = document.querySelectorAll('input[name="purpose"]');
  const purposeOtherGroup = document.getElementById('purpose-other-group');
  const smallWarning = document.getElementById('small-warning');
  const uploadZone = document.getElementById('upload-zone');
  const fileInput = document.getElementById('print-file');
  const progressBar = document.getElementById('upload-progress');
  const progressFill = document.getElementById('upload-progress-fill');
  const uploadStatus = document.getElementById('upload-status');

  const closeModal = () => {
    modal.classList.remove('open');
    selectedDate = '';
    selectedPrinterId = '';
    formStep = 'printer';
    document.querySelectorAll('.calendar-day.selected').forEach((el) => el.classList.remove('selected'));
    clearRetryFormUi();
    showFormStep('printer');
    document.getElementById('form-modal-dialog')?.classList.remove('modal-xl');
  };

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  document.getElementById('form-back-btn')?.addEventListener('click', () => showFormStep('printer'));
  document.getElementById('form-next-btn')?.addEventListener('click', goToFormDetailsStep);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  purposeInputs.forEach((input) => {
    input.addEventListener('change', () => {
      purposeOtherGroup.classList.toggle('hidden', input.value !== 'other' || !input.checked);
    });
  });

  scaleInputs.forEach((input) => {
    input.addEventListener('change', () => {
      smallWarning.classList.toggle('hidden', input.value !== 'small' || !input.checked);
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
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) handleFile(fileInput.files[0]);
  });

  const restoreDraftBtn = document.getElementById('restore-draft-btn');
  restoreDraftBtn.addEventListener('click', () => {
    const draft = loadReservationDraft(DRAFT_STORAGE_KEYS.public);
    if (!draft) {
      updateDraftRestoreButton(restoreDraftBtn, DRAFT_STORAGE_KEYS.public);
      return;
    }
    applyReservationDraft(form, draft, {
      homeroomInputId: 'homeroom',
      purposeOtherGroupId: 'purpose-other-group',
      onApplied: ({ print_scale }) => {
        smallWarning.classList.toggle('hidden', print_scale !== 'small');
      },
    });
    showFormAlert('前回の入力内容を反映しました', 'success');
  });

  /** Handles print file upload. */
  async function handleFile(file) {
    uploadResult = null;
    document.getElementById('form-alert').innerHTML = '';
    progressBar.classList.remove('hidden');
    progressFill.style.width = '0%';
    uploadStatus.textContent = `アップロード中: ${file.name} (${formatSize(file.size)})`;

    try {
      uploadResult = await uploadPrintFile(file, (pct) => {
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
    const alertBox = document.getElementById('form-alert');
    alertBox.innerHTML = '';

    if (!formData.get('printer_id')) {
      showFormAlert('印刷機種を選択してください', 'error');
      return;
    }

    if (!uploadResult && !retryReservationId) {
      showFormAlert('ファイルをアップロードしてください', 'error');
      return;
    }

    if (retryReservationId && !uploadResult && !retryExistingFile) {
      showFormAlert('ファイル情報が見つかりません。ファイルを再アップロードしてください', 'error');
      return;
    }

    const formData = new FormData(form);
    const purpose = formData.get('purpose');
    const printScale = formData.get('print_scale');
    const desiredDate = formData.get('desired_date');

    if (purpose === 'other' && !formData.get('purpose_other')?.trim()) {
      showFormAlert('目的が「その他」の場合は内容を入力してください', 'error');
      return;
    }

    if (!canSkipIdentity() && !homeroomField.isValid()) {
      showFormAlert('ホームルームは 101〜109、201〜209、301〜309 から選択してください', 'error');
      return;
    }

    if (!ensureCanBook()) {
      showFormAlert('プロフィールを登録してから予約してください', 'error');
      return;
    }

    try {
      const excludeParam = retryReservationId
        ? `&exclude_reservation_id=${encodeURIComponent(retryReservationId)}`
        : '';
      const availability = await apiRequest(
        `calendar/availability?date=${desiredDate}&scale=${printScale}&printer_id=${encodeURIComponent(formData.get('printer_id'))}${excludeParam}`
      );

      if (availability.isFull) {
        showFormAlert('この日はもう満杯です。別の日付を選んでください', 'error');
        return;
      }

      if (!availability.staffAvailable) {
        showFormAlert('この日は対応可能な印刷担当者がいないため予約できません', 'error');
        return;
      }

      if (!availability.canBook) {
        showFormAlert('選択した印刷規模はこの日付では予約できません', 'error');
        return;
      }

      const submitBtn = document.getElementById('submit-btn');
      submitBtn.disabled = true;

      const payload = {
        ...identityPayload(),
        title: formData.get('title').trim(),
        purpose,
        purpose_other: purpose === 'other' ? formData.get('purpose_other') : null,
        summary: formData.get('summary')?.trim() || null,
        print_notes: formData.get('print_notes')?.trim() || null,
        request_print_video: document.getElementById('request_print_video')?.checked ?? false,
        print_scale: printScale,
        printer_id: formData.get('printer_id'),
        desired_date: desiredDate,
      };

      if (uploadResult) {
        payload.stl_r2_key = uploadResult.r2Key;
        payload.stl_filename = uploadResult.filename;
        payload.stl_size_bytes = uploadResult.size;
      }

      if (retryReservationId) {
        await apiRequest(`reservations/${retryReservationId}/retry`, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        showFormAlert('再予約を申請しました。受領後に確定します。', 'success');
        clearRetryMode();
      } else {
        await apiRequest('reservations', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        saveReservationDraft(
          DRAFT_STORAGE_KEYS.public,
          extractReservationDraft(form, homeroomField)
        );
        showFormAlert('予約申請を送信しました。受領後に確定します。', 'success');
      }

      submitBtn.disabled = false;
      resetForm();
      await Promise.all([render(), loadReservationList(), loadPrintVideos()]);
      setTimeout(closeModal, 1500);
    } catch (err) {
      showFormAlert(err.message, 'error');
      document.getElementById('submit-btn').disabled = false;
    }
  });

  /** Resets the form fields. */
  function resetForm() {
    form.reset();
    uploadResult = null;
    progressBar.classList.add('hidden');
    uploadStatus.textContent = '';
    smallWarning.classList.add('hidden');
    purposeOtherGroup.classList.add('hidden');
    document.getElementById('scale-restriction-hint').classList.add('hidden');
    setScaleOptions(['small', 'medium', 'large']);
    document.getElementById('submit-btn').textContent = '予約を申請';
    selectedPrinterId = '';
    showFormStep('printer');
    renderPrinterPicker();
    clearRetryFormUi();
  }
}

/** Clears retry mode and related UI state. */
function clearRetryMode() {
  retryReservationId = null;
  retryFormSnapshot = null;
  retryExistingFile = null;
  document.getElementById('retry-mode-banner')?.classList.add('hidden');
  document.getElementById('calendar-section')?.classList.remove('retry-mode');
  clearRetryFormUi();
}

/** Resets retry-specific form UI without ending retry mode. */
function clearRetryFormUi() {
  document.getElementById('retry-identity-hint')?.classList.add('hidden');
  document.getElementById('restore-draft-btn')?.classList.remove('hidden');
  document.getElementById('submit-btn').textContent = retryReservationId ? '再予約を申請' : '予約を申請';
}

/** Starts guest retry flow for a failed reservation. */
function startRetryFlow(reservation) {
  if (!reservation?.retryable) return;

  retryReservationId = reservation.id;
  retryFormSnapshot = {
    title: reservation.title,
    purpose: reservation.purpose,
    purpose_other: reservation.purpose_other ?? '',
    summary: reservation.summary ?? '',
    print_notes: reservation.print_notes ?? '',
    print_scale: reservation.print_scale,
    printer_id: reservation.printer_id ?? '',
  };
  retryExistingFile = reservation.stl_filename
    ? { filename: reservation.stl_filename, size: reservation.stl_size_bytes }
    : null;

  document.getElementById('detail-modal').classList.remove('open');
  currentDetailId = null;
  document.getElementById('retry-mode-banner')?.classList.remove('hidden');
  document.getElementById('calendar-section')?.classList.add('retry-mode');
  document.getElementById('calendar-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  showPageToast('再予約する日付をカレンダーから選んでください');
}

/** Starts retry flow after fetching reservation details. */
async function startRetryFlowFromId(id) {
  try {
    const data = await apiRequest(`reservations/${id}`);
    if (!data.reservation?.retryable) {
      showPageToast('この予約は再予約できません');
      return;
    }
    startRetryFlow(data.reservation);
  } catch (err) {
    showPageToast(err.message);
  }
}

/** Opens the reservation form for a selected date. */
async function openFormForDate(dateStr) {
  if (dateStr < earliestBookable) {
    showPageToast(`${formatDateJa(earliestBookable)} 以降の日付のみ予約できます`);
    return;
  }

  let availability;
  try {
    const excludeParam = retryReservationId
      ? `&exclude_reservation_id=${encodeURIComponent(retryReservationId)}`
      : '';
    availability = await apiRequest(`calendar/availability?date=${dateStr}${excludeParam}`);
  } catch (err) {
    showPageToast(err.message);
    return;
  }

  if (!availability.staffAvailable) {
    showPageToast('この日は対応可能な印刷担当者がいません');
    return;
  }

  if (!availability.printerAvailable) {
    showPageToast('この日は稼働予定のプリンターがありません');
    return;
  }

  if (availability.isFull) {
    showPageToast('この日はもう満杯です');
    return;
  }

  selectedDate = dateStr;
  document.querySelectorAll('.calendar-day.selected').forEach((el) => el.classList.remove('selected'));
  document.querySelector(`.calendar-day[data-date="${dateStr}"]`)?.classList.add('selected');

  document.getElementById('desired_date').value = dateStr;
  document.getElementById('selected-date-display').textContent = `希望印刷日: ${formatDateJa(dateStr)}`;
  document.getElementById('form-modal-title').textContent = retryReservationId
    ? `再予約 — ${formatDateJa(dateStr)}`
    : `${formatDateJa(dateStr)} の予約`;
  document.getElementById('form-alert').innerHTML = '';

  disableScaleOptions();

  const form = document.getElementById('reservation-form');
  const uploadStatus = document.getElementById('upload-status');
  const progressBar = document.getElementById('upload-progress');

  if (retryReservationId && retryFormSnapshot) {
    applyRetryFormSnapshot(form, retryFormSnapshot, {
      purposeOtherGroupId: 'purpose-other-group',
      onApplied: ({ print_scale }) => {
        document.getElementById('small-warning').classList.toggle('hidden', print_scale !== 'small');
      },
    });

    document.getElementById('homeroom').value = '';
    document.getElementById('student_number').value = '';
    document.getElementById('student_name').value = '';
    if (canSkipIdentity()) {
      applyUserToReservationForm();
      document.getElementById('retry-identity-hint')?.classList.add('hidden');
    } else {
      document.getElementById('retry-identity-hint')?.classList.remove('hidden');
    }
    document.getElementById('restore-draft-btn')?.classList.add('hidden');
    document.getElementById('submit-btn').textContent = '再予約を申請';

    uploadResult = null;
    progressBar.classList.add('hidden');
    if (retryExistingFile) {
      uploadStatus.textContent = `前回のファイル: ${retryExistingFile.filename}（変更しない場合はそのまま使用）`;
      uploadStatus.style.color = 'var(--color-text-muted)';
    } else {
      uploadStatus.textContent = '';
    }

    const preferredScale = retryFormSnapshot.print_scale;
    const scaleInput = form.querySelector(`input[name="print_scale"][value="${preferredScale}"]`);
    if (scaleInput && !scaleInput.disabled) {
      scaleInput.checked = true;
      document.getElementById('small-warning').classList.toggle('hidden', preferredScale !== 'small');
    }
  } else {
    document.getElementById('retry-identity-hint')?.classList.add('hidden');
    document.getElementById('submit-btn').textContent = '予約を申請';
    updateDraftRestoreButton(document.getElementById('restore-draft-btn'), DRAFT_STORAGE_KEYS.public);
  }

  const hint = document.getElementById('scale-restriction-hint');
  hint.classList.add('hidden');

  document.getElementById('form-modal').classList.add('open');
  await loadPrinters(dateStr);
  selectedPrinterId = retryFormSnapshot?.printer_id || '';
  renderPrinterPicker(selectedPrinterId);
  showFormStep('printer');
  applyUserToReservationForm();
  if (!retryReservationId) {
    updateDraftRestoreButton(document.getElementById('restore-draft-btn'), DRAFT_STORAGE_KEYS.public);
  }
}

/** Disables all print scale options until a printer is chosen. */
function disableScaleOptions() {
  ['small', 'medium', 'large'].forEach((scale) => {
    const label = document.getElementById(`scale-label-${scale}`);
    const input = label?.querySelector('input');
    if (!input) return;
    input.disabled = true;
    input.checked = false;
    label.classList.add('disabled');
  });
  document.getElementById('small-warning')?.classList.add('hidden');
}

/** Enables/disables print scale options based on availability. */
function setScaleOptions(availableScales) {
  const scales = ['small', 'medium', 'large'];
  let firstEnabled = null;

  scales.forEach((scale) => {
    const label = document.getElementById(`scale-label-${scale}`);
    const input = label.querySelector('input');
    const enabled = availableScales.includes(scale);
    input.disabled = !enabled;
    label.classList.toggle('disabled', !enabled);
    if (enabled && !firstEnabled) firstEnabled = input;
  });

  document.querySelectorAll('input[name="print_scale"]').forEach((i) => (i.checked = false));
  if (firstEnabled) {
    firstEnabled.checked = true;
    document.getElementById('small-warning').classList.toggle('hidden', firstEnabled.value !== 'small');
  }
}

/** Sets up the guest reservation edit modal. */
function setupEditModal() {
  const modal = document.getElementById('edit-modal');
  const form = document.getElementById('edit-reservation-form');
  const purposeInputs = form.querySelectorAll('input[name="purpose"]');
  const purposeOtherGroup = document.getElementById('edit-purpose-other-group');
  const uploadZone = document.getElementById('edit-upload-zone');
  const fileInput = document.getElementById('edit-print-file');
  const progressBar = document.getElementById('edit-upload-progress');
  const progressFill = document.getElementById('edit-upload-progress-fill');
  const uploadStatus = document.getElementById('edit-upload-status');

  const closeModal = () => {
    modal.classList.remove('open');
    editUploadResult = null;
  };

  document.getElementById('edit-modal-close').addEventListener('click', closeModal);
  document.getElementById('edit-cancel-btn').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  purposeInputs.forEach((input) => {
    input.addEventListener('change', () => {
      purposeOtherGroup.classList.toggle('hidden', input.value !== 'other' || !input.checked);
    });
  });

  document.getElementById('edit-desired-date').addEventListener('change', async () => {
    const dateStr = document.getElementById('edit-desired-date').value;
    const printerId = document.getElementById('edit-printer-select')?.value;
    if (!dateStr || !currentDetailId || !printerId) return;
    try {
      const availability = await apiRequest(
        `calendar/availability?date=${dateStr}&printer_id=${encodeURIComponent(printerId)}&exclude_reservation_id=${currentDetailId}`
      );
      setEditScaleOptions(availability.availableScales);
    } catch (err) {
      showEditAlert(err.message, 'error');
    }
  });

  document.getElementById('edit-printer-select')?.addEventListener('change', (e) => {
    updateEditPrintVideoCheckboxVisibility(e.target.value, false);
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
    if (e.dataTransfer.files.length) handleEditFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) handleEditFile(fileInput.files[0]);
  });

  /** Handles file upload for edit form. */
  async function handleEditFile(file) {
    editUploadResult = null;
    document.getElementById('edit-alert').innerHTML = '';
    progressBar.classList.remove('hidden');
    progressFill.style.width = '0%';
    uploadStatus.textContent = `アップロード中: ${file.name} (${formatSize(file.size)})`;

    try {
      editUploadResult = await uploadPrintFile(file, (pct) => {
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
    if (!currentDetailId) return;

    document.getElementById('edit-alert').innerHTML = '';
    const formData = new FormData(form);
    const purpose = formData.get('purpose');
    const printScale = formData.get('print_scale');
    const desiredDate = formData.get('desired_date');

    if (purpose === 'other' && !formData.get('purpose_other')?.trim()) {
      showEditAlert('目的が「その他」の場合は内容を入力してください', 'error');
      return;
    }

    if (!canSkipIdentity() && !editHomeroomField.isValid()) {
      showEditAlert('ホームルームは 101〜109、201〜209、301〜309 から選択してください', 'error');
      return;
    }

    try {
      const printerId = formData.get('printer_id') || document.getElementById('edit-printer-select')?.value;
      const availability = await apiRequest(
        `calendar/availability?date=${desiredDate}&scale=${printScale}&printer_id=${encodeURIComponent(printerId)}&exclude_reservation_id=${currentDetailId}`
      );

      if (availability.isFull) {
        showEditAlert('この日はもう満杯です。別の日付を選んでください', 'error');
        return;
      }

      if (!availability.staffAvailable) {
        showEditAlert('この日は対応可能な印刷担当者がいないため予約できません', 'error');
        return;
      }

      if (!availability.canBook) {
        showEditAlert('選択した印刷規模はこの日付では予約できません', 'error');
        return;
      }

      const payload = {
        ...identityPayload({
          homeroom: 'edit-homeroom',
          studentNumber: 'edit-student-number',
          studentName: 'edit-student-name',
        }),
        title: formData.get('title').trim(),
        purpose,
        purpose_other: purpose === 'other' ? formData.get('purpose_other') : null,
        summary: formData.get('summary')?.trim() || null,
        print_notes: formData.get('print_notes')?.trim() || null,
        request_print_video: document.getElementById('edit-request-print-video')?.checked ?? false,
        print_scale: printScale,
        printer_id: formData.get('printer_id'),
        desired_date: desiredDate,
      };

      if (editUploadResult) {
        payload.stl_r2_key = editUploadResult.r2Key;
        payload.stl_filename = editUploadResult.filename;
        payload.stl_size_bytes = editUploadResult.size;
      }

      const submitBtn = document.getElementById('edit-submit-btn');
      submitBtn.disabled = true;

      await apiRequest(`reservations/${currentDetailId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      showEditAlert('予約内容を修正しました。再承認をお待ちください', 'success');
      submitBtn.disabled = false;
      currentDetailId = null;
      currentEditSnapshot = null;
      await Promise.all([render(), loadReservationList(), loadPrintVideos()]);
      setTimeout(closeModal, 1500);
    } catch (err) {
      showEditAlert(err.message, 'error');
      document.getElementById('edit-submit-btn').disabled = false;
    }
  });
}

/** Populates printer select elements. */
function populatePrinterSelect(selectId, selectedId = '') {
  const select = document.getElementById(selectId);
  if (!select) return;

  if (!availablePrinters.length) {
    select.innerHTML = '<option value="">プリンターが登録されていません</option>';
    select.disabled = true;
    return;
  }

  select.disabled = false;
  select.innerHTML = availablePrinters
    .map(
      (p) =>
        `<option value="${escapeHtml(p.id)}"${p.id === selectedId ? ' selected' : ''}>${escapeHtml(p.name)}</option>`
    )
    .join('');
}

/** Opens the guest edit modal with reservation data pre-filled. */
async function openEditModal(r) {
  currentDetailId = r.id;
  editUploadResult = null;

  const form = document.getElementById('edit-reservation-form');
  form.reset();
  document.getElementById('edit-alert').innerHTML = '';
  document.getElementById('edit-upload-progress').classList.add('hidden');
  document.getElementById('edit-upload-status').textContent = '';
  document.getElementById('edit-current-file').textContent =
    `現在のファイル: ${r.stl_filename}（変更しない場合はそのまま）`;

  document.getElementById('edit-desired-date').value = r.desired_date;
  document.getElementById('edit-title').value = r.title;
  document.getElementById('edit-summary').value = r.summary ?? '';
  document.getElementById('edit-print-notes').value = r.print_notes ?? '';
  document.getElementById('edit-purpose-other').value = r.purpose_other ?? '';

  const purposeRadio = form.querySelector(`input[name="purpose"][value="${r.purpose}"]`);
  if (purposeRadio) purposeRadio.checked = true;
  document.getElementById('edit-purpose-other-group').classList.toggle('hidden', r.purpose !== 'other');

  populatePrinterSelect('edit-printer-select', r.printer_id ?? '');
  updateEditPrintVideoCheckboxVisibility(r.printer_id, r.request_print_video);

  try {
    const printerParam = r.printer_id
      ? `&printer_id=${encodeURIComponent(r.printer_id)}`
      : '';
    const availability = await apiRequest(
      `calendar/availability?date=${r.desired_date}&exclude_reservation_id=${r.id}${printerParam}`
    );
    setEditScaleOptions(availability.availableScales);
    const scaleRadio = form.querySelector(`input[name="print_scale"][value="${r.print_scale}"]`);
    if (scaleRadio && !scaleRadio.disabled) scaleRadio.checked = true;

    const hint = document.getElementById('edit-scale-restriction-hint');
    if (availability.scales.includes('small') && availability.availableScales.length === 1) {
      hint.textContent = 'この日はスモール印刷が入っているため、スモールのみ選択できます。';
      hint.classList.remove('hidden');
    } else {
      hint.classList.add('hidden');
    }
  } catch (err) {
    showEditAlert(err.message, 'error');
  }

  document.getElementById('edit-modal-title').textContent = `${escapeHtml(r.title)} を修正`;
  applyUserToEditForm();
  document.getElementById('edit-modal').classList.add('open');
}

/** Enables/disables print scale options in the edit form. */
function setEditScaleOptions(availableScales) {
  const scales = ['small', 'medium', 'large'];
  let firstEnabled = null;

  scales.forEach((scale) => {
    const label = document.getElementById(`edit-scale-label-${scale}`);
    const input = label.querySelector('input');
    const enabled = availableScales.includes(scale);
    input.disabled = !enabled;
    label.classList.toggle('disabled', !enabled);
    if (enabled && !firstEnabled) firstEnabled = input;
  });

  document.querySelectorAll('#edit-reservation-form input[name="print_scale"]').forEach((i) => {
    i.checked = false;
  });
  if (firstEnabled) firstEnabled.checked = true;
}

/** Shows an alert in the edit modal. */
function showEditAlert(message, type) {
  document.getElementById('edit-alert').innerHTML =
    `<div class="alert alert-${type}">${escapeHtml(message)}</div>`;
}

/** Opens reservation detail view (PII hidden). */
async function openReservationDetail(id) {
  const modal = document.getElementById('detail-modal');
  const body = document.getElementById('detail-modal-body');
  currentDetailId = id;

  try {
    const data = await apiRequest(`reservations/${id}`);
    const r = data.reservation;
    currentEditSnapshot = r.editable ? r : null;

    document.getElementById('detail-modal-title').textContent = escapeHtml(r.title);
    document.getElementById('detail-edit-toggle-btn').classList.toggle('hidden', !r.editable);

    body.innerHTML = `
      <div class="detail-grid">
        <div class="detail-row"><span class="detail-label">タイトル</span><span class="calendar-title-display">${escapeHtml(r.title)}</span></div>
        <div class="detail-row"><span class="detail-label">希望印刷日</span><span>${r.desired_date}</span></div>
        <div class="detail-row"><span class="detail-label">印刷規模</span><span>${SCALE_LABELS[r.print_scale]}</span></div>
        <div class="detail-row"><span class="detail-label">印刷機種</span><span>${escapeHtml(r.printer_name ?? '未指定')}${r.printer_capabilities ? `（ノズル ${escapeHtml(formatNozzleSizes(r.printer_capabilities.nozzle_sizes_mm))}${r.printer_capabilities.can_record_print_video ? '・動画撮影可' : ''}）` : ''}</span></div>
        <div class="detail-row"><span class="detail-label">ステータス</span><span class="status-with-action"><span class="status-badge status-${r.status}">${STATUS_LABELS[r.status] || r.status}</span>${r.retryable ? `<button type="button" class="btn btn-secondary btn-sm" id="retry-reservation-btn">再予約</button>` : ''}</span></div>
        ${r.status_comment ? `<div class="detail-row"><span class="detail-label">コメント</span><span>${escapeHtml(r.status_comment).replace(/\n/g, '<br>')}</span></div>` : ''}
        ${r.print_staff ? `<div class="detail-row"><span class="detail-label">担当者</span><span>担当者: ${escapeHtml(r.print_staff)}</span></div>` : ''}
        ${r.summary ? `<div class="detail-row"><span class="detail-label">概要</span><span>${escapeHtml(r.summary)}</span></div>` : ''}
        ${r.print_notes ? `<div class="detail-row"><span class="detail-label">印刷時の注意点</span><span>${escapeHtml(r.print_notes).replace(/\n/g, '<br>')}</span></div>` : ''}
        ${r.request_print_video ? `<div class="detail-row"><span class="detail-label">動画撮影</span><span>希望あり</span></div>` : ''}
        ${r.stl_filename ? `<div class="detail-row"><span class="detail-label">ファイル</span><span>${escapeHtml(r.stl_filename)}</span></div>` : ''}
        ${r.has_print_video ? `<div class="detail-row"><span class="detail-label">印刷動画</span><span><a href="/api/3dprint/reservations/${r.id}/print-video/download" class="btn btn-secondary btn-sm" download>${escapeHtml(r.print_video_filename ?? 'ダウンロード')}</a></span></div>` : ''}
      </div>
      <div id="guest-cancel-alert"></div>
    `;

    document.getElementById('retry-reservation-btn')?.addEventListener('click', () => startRetryFlow(r));
    updateIdentitySections();

    modal.classList.add('open');
  } catch (err) {
    showPageToast(err.message);
  }
}

/** Handles guest reservation cancel with identity verification. */
async function handleGuestCancel(e) {
  e.preventDefault();
  if (!currentDetailId) return;

  const alertEl = document.getElementById('guest-cancel-alert');
  alertEl.innerHTML = '';

  const body = canSkipIdentity()
    ? {}
    : {
        homeroom: document.getElementById('cancel-homeroom').value.trim(),
        student_number: Number(document.getElementById('cancel-student-number').value),
        student_name: document.getElementById('cancel-student-name').value.trim(),
      };

  try {
    await apiRequest(`reservations/${currentDetailId}/cancel`, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    document.getElementById('detail-modal').classList.remove('open');
    currentDetailId = null;
    showPageToast('予約を取り消しました');
    await Promise.all([render(), loadReservationList()]);
  } catch (err) {
    alertEl.innerHTML = `<div class="alert alert-error">${escapeHtml(err.message)}<br>お問い合わせ: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></div>`;
  }
}

/** Cancels a reservation for a logged-in user without identity form. */
async function handleLoggedInCancel() {
  if (!currentDetailId) return;
  if (!window.confirm('この予約を取り消しますか？')) return;

  const alertEl = document.getElementById('guest-cancel-alert');
  alertEl.innerHTML = '';

  try {
    await apiRequest(`reservations/${currentDetailId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({}),
    });

    document.getElementById('detail-modal').classList.remove('open');
    currentDetailId = null;
    showPageToast('予約を取り消しました');
    await Promise.all([render(), loadReservationList()]);
  } catch (err) {
    alertEl.innerHTML = `<div class="alert alert-error">${escapeHtml(err.message)}<br>お問い合わせ: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></div>`;
  }
}

/** Jumps the calendar to the current month (JST). */
function goToToday() {
  const parts = todayJst().split('-').map(Number);
  currentYear = parts[0];
  currentMonth = parts[1];
  render();
}

/** Updates the mobile "today" shortcut button label. */
function updateTodayButton() {
  const dayNum = document.getElementById('today-day-num');
  if (!dayNum) return;
  dayNum.textContent = String(Number(todayJst().split('-')[2]));
}

/** Renders horizontal month chips for mobile month switching. */
function renderMonthChips() {
  const container = document.getElementById('calendar-month-chips');
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
      render();
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

/** Renders weekday headers in a dedicated row above day cells. */
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

/** Changes the displayed month. */
function changeMonth(delta) {
  currentMonth += delta;
  if (currentMonth > 12) {
    currentMonth = 1;
    currentYear++;
  } else if (currentMonth < 1) {
    currentMonth = 12;
    currentYear--;
  }
  render();
}

/** Renders calendar and user list. */
async function render() {
  const monthLabel = `${currentYear}年${currentMonth}月`;
  document.getElementById('calendar-month-label').textContent = monthLabel;
  const mobileLabel = document.getElementById('calendar-month-label-mobile-text');
  if (mobileLabel) mobileLabel.textContent = monthLabel;
  updateTodayButton();
  renderMonthChips();

  const grid = document.getElementById('calendar-grid');
  grid.innerHTML = '';
  renderWeekdayHeaders();

  try {
    calendarData = await apiRequest(`calendar?year=${currentYear}&month=${currentMonth}`);
    earliestBookable = calendarData.earliestBookable;
    staffCountByDate = calendarData.staffCountByDate ?? {};
    printerCountByDate = calendarData.printerCountByDate ?? {};
  } catch (err) {
    grid.innerHTML = `<div class="alert alert-error" style="grid-column:1/-1">${err.message}</div>`;
    return;
  }

  const reservationsByDate = {};
  for (const r of calendarData.reservations) {
    if (!reservationsByDate[r.desired_date]) reservationsByDate[r.desired_date] = [];
    reservationsByDate[r.desired_date].push(r);
  }

  const firstDay = new Date(currentYear, currentMonth - 1, 1);
  const lastDay = new Date(currentYear, currentMonth, 0).getDate();
  const startWeekday = firstDay.getDay();
  const todayStr = todayJst();

  const prevMonthLast = new Date(currentYear, currentMonth - 1, 0).getDate();
  for (let i = startWeekday - 1; i >= 0; i--) {
    grid.appendChild(createDayCell(prevMonthLast - i, true, {}, todayStr));
  }

  for (let day = 1; day <= lastDay; day++) {
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    grid.appendChild(createDayCell(day, false, reservationsByDate, todayStr, dateStr));
  }

  const totalCells = startWeekday + lastDay;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let day = 1; day <= remaining; day++) {
    grid.appendChild(createDayCell(day, true, {}, todayStr));
  }

  updateStickyOffsets();
}

/** Loads the public reservation list (upcoming + recent past). */
async function loadReservationList() {
  olderPastBatches = [];
  olderPastHasMore = false;
  olderPastCursor = null;

  const mount = document.getElementById('user-list-mount');
  mount.innerHTML = '<p class="hint">読み込み中...</p>';

  try {
    reservationListData = await apiRequest(`calendar/reservation-list?today=${todayJst()}`);
    renderReservationList();
  } catch (err) {
    mount.innerHTML = `<div class="alert alert-error">${escapeHtml(err.message)}</div>`;
  }
}

/** Loads the next page of older past reservations. */
async function loadOlderPastReservations() {
  if (olderPastLoading) return;
  olderPastLoading = true;
  renderReservationList();

  const params = new URLSearchParams({ today: todayJst() });
  if (olderPastCursor) {
    params.set('cursor_date', olderPastCursor.desired_date);
    params.set('cursor_created_at', olderPastCursor.created_at);
    params.set('cursor_id', olderPastCursor.id);
  }

  try {
    const data = await apiRequest(`calendar/reservation-list/older?${params}`);
    if (data.reservations?.length) {
      olderPastBatches.push(data.reservations);
    }
    olderPastHasMore = !!data.hasMore;
    olderPastCursor = data.cursor ?? null;
  } catch (err) {
    showPageToast(err.message);
  } finally {
    olderPastLoading = false;
    renderReservationList();
  }
}

/** Builds HTML for one reservation table row (desktop). */
function reservationListRowHtml(r) {
  return `
    <tr class="user-list-row" data-id="${r.id}" style="cursor:pointer">
      <td>${r.desired_date}</td>
      <td class="calendar-title-display">${escapeHtml(r.title)}</td>
      <td>${SCALE_LABELS[r.print_scale] || r.print_scale}</td>
      <td class="user-list-status-cell"><span class="status-badge status-${r.status}">${STATUS_LABELS[r.status] || r.status}</span>${r.status === 'failed' ? `<button type="button" class="btn btn-secondary btn-sm user-list-retry-btn" data-id="${r.id}">再予約</button>` : ''}</td>
    </tr>`;
}

/** Builds HTML for one reservation card (mobile). */
function reservationListCardHtml(r) {
  const scaleLabel = SCALE_LABELS[r.print_scale] || r.print_scale;
  return `
    <article class="reservation-card user-list-row" data-id="${r.id}" tabindex="0">
      <div class="reservation-card-header">
        <time class="reservation-card-date" datetime="${r.desired_date}">${r.desired_date}</time>
        <span class="status-badge status-${r.status}">${STATUS_LABELS[r.status] || r.status}</span>
      </div>
      <div class="reservation-card-main">
        <span class="reservation-card-title">${escapeHtml(r.title)}</span>
        <span class="reservation-card-scale" title="${escapeHtml(scaleLabel)}">${escapeHtml(scaleLabel)}</span>
        ${r.status === 'failed' ? `<button type="button" class="btn btn-secondary btn-sm user-list-retry-btn" data-id="${r.id}">再予約</button>` : ''}
      </div>
    </article>`;
}

/** Builds a reservation list block for the current viewport. */
function reservationListBlockHtml(reservations, emptyMessage) {
  if (!reservations.length) {
    return emptyMessage ? `<p class="user-list-empty hint">${escapeHtml(emptyMessage)}</p>` : '';
  }

  if (isMobileCalendarView()) {
    return `
      <div class="reservation-card-list">
        ${reservations.map((r) => reservationListCardHtml(r)).join('')}
      </div>`;
  }

  return reservationListTableHtml(reservations);
}

/** Builds a reservation table block (desktop). */
function reservationListTableHtml(reservations) {
  return `
    <div class="table-wrap user-list-table-wrap">
      <table>
        <thead>
          <tr>
            <th>希望印刷日</th>
            <th>タイトル</th>
            <th>印刷規模</th>
            <th>ステータス</th>
          </tr>
        </thead>
        <tbody>
          ${reservations.map((r) => reservationListRowHtml(r)).join('')}
        </tbody>
      </table>
    </div>`;
}

/** Renders the public reservation list with upcoming, older past, and recent past. */
function renderReservationList() {
  const mount = document.getElementById('user-list-mount');
  if (!reservationListData) return;

  const { upcoming = [], recentPast = [], hasOlderPast = false } = reservationListData;
  const showOlderButton =
    (hasOlderPast && olderPastBatches.length === 0) || olderPastHasMore;
  const hasPastSection =
    showOlderButton || olderPastBatches.length > 0 || recentPast.length > 0;
  const isEmpty = !upcoming.length && !hasPastSection;

  if (isEmpty) {
    mount.innerHTML = '<p class="user-list-empty hint">表示できる予約はありません</p>';
    return;
  }

  const parts = [];

  if (upcoming.length) {
    parts.push('<h3 class="user-list-section-label">これからの予約</h3>');
    parts.push(reservationListBlockHtml(upcoming));
  }

  if (hasPastSection) {
    parts.push('<h3 class="user-list-section-label">過去の予約</h3>');

    if (showOlderButton) {
      const label =
        olderPastBatches.length === 0 ? 'さらに過去の予約一覧' : 'さらに過去を見る';
      parts.push(`
        <div class="user-list-load-older">
          <button type="button" class="btn btn-secondary btn-sm" id="user-list-load-older-btn"${olderPastLoading ? ' disabled' : ''}>
            ${olderPastLoading ? '読み込み中...' : escapeHtml(label)}
          </button>
        </div>`);
    }

    for (let i = olderPastBatches.length - 1; i >= 0; i--) {
      parts.push(reservationListBlockHtml(olderPastBatches[i]));
    }

    if (recentPast.length) {
      parts.push('<h3 class="user-list-section-label">過去1週間</h3>');
      parts.push(reservationListBlockHtml(recentPast));
    }
  }

  mount.innerHTML = parts.join('');

  mount.querySelector('#user-list-load-older-btn')?.addEventListener('click', loadOlderPastReservations);
  mount.querySelectorAll('.user-list-row').forEach((row) => {
    row.addEventListener('click', (e) => {
      if (e.target.closest('.user-list-retry-btn')) return;
      openReservationDetail(row.dataset.id);
    });
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openReservationDetail(row.dataset.id);
      }
    });
  });

  mount.querySelectorAll('.user-list-retry-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      startRetryFlowFromId(btn.dataset.id);
    });
  });
}

/** Creates a calendar day cell. */
function createDayCell(dayNum, otherMonth, reservationsByDate, todayStr, dateStr) {
  const cell = document.createElement('div');
  cell.className = 'calendar-day';
  if (otherMonth) cell.classList.add('other-month');
  if (dateStr === todayStr) cell.classList.add('today');
  if (dateStr === selectedDate) cell.classList.add('selected');

  const dayReservations = dateStr && reservationsByDate[dateStr] ? reservationsByDate[dateStr] : [];

  const hasStaff = dateStr ? (staffCountByDate[dateStr] ?? 0) > 0 : false;
  const hasPrinter = dateStr ? (printerCountByDate[dateStr] ?? 0) > 0 : false;

  if (dateStr && !otherMonth && dateStr >= earliestBookable) {
    cell.classList.add(hasStaff && hasPrinter ? 'shift-covered' : 'shift-empty');
  }

  if (dateStr && !otherMonth) {
    cell.dataset.date = dateStr;
    if (dateStr >= earliestBookable && !hasStaff) {
      cell.classList.add('no-staff');
      cell.addEventListener('click', () => showPageToast('この日は対応可能な印刷担当者がいません'));
    } else if (dateStr >= earliestBookable && !hasPrinter) {
      cell.classList.add('no-printer');
      cell.addEventListener('click', () => showPageToast('この日は稼働予定のプリンターがありません'));
    } else if (dateStr >= earliestBookable && hasStaff && hasPrinter) {
      cell.classList.add('clickable');
      cell.addEventListener('click', () => openFormForDate(dateStr));
    } else {
      cell.classList.add('disabled');
    }
  }

  const num = document.createElement('div');
  num.className = 'calendar-day-number';
  num.textContent = dayNum;
  cell.appendChild(num);

  if (dateStr && dayReservations.length) {
    const slotsWrap = document.createElement('div');
    slotsWrap.className = 'calendar-slots';

    const sorted = [...dayReservations].sort((a, b) => {
      const order = { small: 0, medium: 1, large: 2 };
      return (order[a.print_scale] ?? 9) - (order[b.print_scale] ?? 9);
    });

    for (const r of sorted) {
      const slot = document.createElement('button');
      slot.type = 'button';
      const status = r.status || 'applied';
      slot.className = `calendar-slot status-${status}`;
      const staffLine = r.print_staff ? `\n担当者: ${r.print_staff}` : '';
      slot.title = `${STATUS_LABELS[status] || status} / ${SCALE_LABELS[r.print_scale]} / ${r.title}${staffLine}`;

      if (isMobileCalendarView()) {
        slot.classList.add('calendar-slot-compact');
        slot.innerHTML = `<span class="calendar-slot-compact-label">${escapeHtml(`${SCALE_SHORT[r.print_scale]} ${truncateForCell(r.title, 5)}`)}</span>`;
      } else {
        slot.innerHTML = `<span class="calendar-slot-scale">${SCALE_SHORT[r.print_scale]}</span><span class="calendar-slot-title-text">${escapeHtml(r.title)}</span><span class="calendar-slot-status">（${escapeHtml(STATUS_LABELS[status] || status)}）</span>${r.print_staff ? `<span class="calendar-slot-staff">担当者: ${escapeHtml(r.print_staff)}</span>` : ''}`;
      }

      slot.addEventListener('click', (e) => {
        e.stopPropagation();
        openReservationDetail(r.id);
      });
      slotsWrap.appendChild(slot);
    }

    cell.appendChild(slotsWrap);
  }

  return cell;
}

/** Shows an alert in the form modal. */
function showFormAlert(message, type) {
  document.getElementById('form-alert').innerHTML =
    `<div class="alert alert-${type}">${message}</div>`;
}

/** Shows a temporary page-level toast. */
function showPageToast(message) {
  const toast = document.getElementById('page-toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(showPageToast._timer);
  showPageToast._timer = setTimeout(() => toast.classList.add('hidden'), 3500);
}

/** Escapes HTML special characters. */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

/** Formats a date string for Japanese display. */
function formatDateJa(isoDate) {
  const [y, m, d] = isoDate.split('-');
  return `${y}年${Number(m)}月${Number(d)}日`;
}

/** Formats byte size for display. */
function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** 印刷動画一覧を読み込んで表示 */
async function loadPrintVideos() {
  const mount = document.getElementById('print-videos-mount');
  if (!mount) return;

  try {
    const data = await apiRequest('print-videos');
    const videos = data.videos ?? [];

    if (!videos.length) {
      mount.innerHTML = '<p class="hint">ダウンロード可能な印刷動画はまだありません。</p>';
      return;
    }

    mount.innerHTML = `
      <div class="table-wrap user-list-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>タイトル</th>
              <th>希望印刷日</th>
              <th>ファイル</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${videos
              .map(
                (v) => `<tr>
              <td>${escapeHtml(v.title)}</td>
              <td>${escapeHtml(v.desired_date)}</td>
              <td>${escapeHtml(v.print_video_filename ?? '動画')}${v.print_video_size_bytes ? ` (${formatSize(v.print_video_size_bytes)})` : ''}</td>
              <td><a href="${escapeHtml(v.download_url)}" class="btn btn-secondary btn-sm" download>ダウンロード</a></td>
            </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>`;
  } catch (err) {
    mount.innerHTML = `<p class="alert alert-error">${escapeHtml(err.message)}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', init);
