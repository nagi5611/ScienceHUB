// src/admin/js/shift.js — shift calendar management
import { apiRequest, ApiError } from '../../3dprint-reservation/js/api.js';
import { SHIFT_COLORS, shiftColorStyle } from '../../3dprint-reservation/js/shift-colors.js';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
const MOBILE_SHIFT_MQ = window.matchMedia('(max-width: 768px)');
const SCALE_LABELS = { small: 'S', medium: 'M', large: 'L' };

let shiftYear;
let shiftMonth;
let shiftMembers = [];
let shiftAvailability = [];
let shiftPrinters = [];
let shiftPrinterAvailability = [];
let shiftEditMode = 'member';
let selectedMemberId = null;
let selectedPrinterId = null;
let openColorMenuMemberId = null;
let isDragging = false;
let dragTouchedDates = new Set();
let dragStartDate = null;
let initialized = false;
let pendingShiftRemoval = null;
let pendingPrinterShiftRemoval = null;
let shiftBlockReservations = [];

/** Returns today's date in JST (YYYY-MM-DD). */
function todayJst() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo' }).format(new Date());
}

/** Returns whether mobile shift layout is active. */
function isMobileShiftView() {
  return MOBILE_SHIFT_MQ.matches;
}

/** Initializes the shift management panel. */
export function initShiftPanel() {
  if (initialized) return;
  initialized = true;

  const now = new Date();
  shiftYear = now.getFullYear();
  shiftMonth = now.getMonth() + 1;

  document.getElementById('shift-prev-month')?.addEventListener('click', () => changeShiftMonth(-1));
  document.getElementById('shift-next-month')?.addEventListener('click', () => changeShiftMonth(1));
  document.getElementById('shift-prev-month-mobile')?.addEventListener('click', () => changeShiftMonth(-1));
  document.getElementById('shift-next-month-mobile')?.addEventListener('click', () => changeShiftMonth(1));
  document.getElementById('shift-go-today-btn')?.addEventListener('click', goToShiftToday);
  document.getElementById('shift-month-label-mobile')?.addEventListener('click', () => {
    document.getElementById('shift-calendar-month-chips')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  document.getElementById('shift-reschedule-close')?.addEventListener('click', closeShiftRescheduleModal);
  document.getElementById('shift-reschedule-cancel')?.addEventListener('click', closeShiftRescheduleModal);
  document.getElementById('shift-reschedule-save')?.addEventListener('click', handleShiftRescheduleSave);

  document.addEventListener('mouseup', handleShiftMouseUp);
  document.addEventListener('touchend', handleShiftMouseUp);
  document.addEventListener('touchcancel', handleShiftMouseUp);
  document.addEventListener('click', closeColorMenuOnOutsideClick);
}

/** Closes the shift reschedule modal. */
function closeShiftRescheduleModal() {
  document.getElementById('shift-reschedule-modal')?.classList.add('hidden');
  pendingShiftRemoval = null;
  pendingPrinterShiftRemoval = null;
  shiftBlockReservations = [];
}

/** Opens the shift reschedule modal for blocked removal. */
function openShiftRescheduleModal(payload) {
  const modal = document.getElementById('shift-reschedule-modal');
  const list = document.getElementById('shift-reschedule-list');
  const intro = document.getElementById('shift-reschedule-intro');
  const alertEl = document.getElementById('shift-reschedule-alert');
  alertEl.innerHTML = '';

  shiftBlockReservations = payload.reservations ?? [];
  intro.textContent = `${payload.date} には予約が入っています。別の日付へリスケしてから、シフトを外してください。`;

  const minDate = todayJst();
  list.innerHTML = shiftBlockReservations
    .map((r) => {
      const scale = SCALE_LABELS[r.print_scale] ?? r.print_scale;
      return `
      <div class="shift-reschedule-item card" style="margin-bottom:0.75rem;padding:0.75rem 1rem">
        <p><strong>${escapeHtml(r.title)}</strong>（${scale}）</p>
        <p>現在の希望印刷日: ${escapeHtml(r.desired_date)}</p>
        <div class="form-group" style="margin-bottom:0">
          <label for="shift-reschedule-date-${r.id}">新しい希望印刷日</label>
          <input type="date" id="shift-reschedule-date-${r.id}" data-reservation-id="${r.id}" min="${minDate}" required />
        </div>
      </div>`;
    })
    .join('');

  modal?.classList.remove('hidden');
}

/** Saves reschedules then retries shift removal. */
async function handleShiftRescheduleSave() {
  const alertEl = document.getElementById('shift-reschedule-alert');
  const saveBtn = document.getElementById('shift-reschedule-save');
  alertEl.innerHTML = '';

  const inputs = document.querySelectorAll('#shift-reschedule-list input[type="date"]');
  const updates = [...inputs].map((input) => ({
    id: input.dataset.reservationId,
    desired_date: input.value,
  }));

  for (const u of updates) {
    if (!u.desired_date) {
      alertEl.innerHTML = '<div class="alert alert-error">すべての予約に新しい日付を入力してください</div>';
      return;
    }
  }

  saveBtn.disabled = true;
  try {
    for (const u of updates) {
      await apiRequest(`admin/reservations/${u.id}/reschedule`, {
        method: 'PATCH',
        body: JSON.stringify({ desired_date: u.desired_date }),
      });
    }

    if (pendingShiftRemoval) {
      await apiRequest('admin/shifts/toggle', {
        method: 'POST',
        body: JSON.stringify({
          member_id: pendingShiftRemoval.memberId,
          date: pendingShiftRemoval.date,
        }),
      });
    } else if (pendingPrinterShiftRemoval) {
      await apiRequest('admin/shifts/printer-toggle', {
        method: 'POST',
        body: JSON.stringify({
          printer_id: pendingPrinterShiftRemoval.printerId,
          date: pendingPrinterShiftRemoval.date,
        }),
      });
    }

    closeShiftRescheduleModal();
    await renderShiftPanel();
  } catch (err) {
    alertEl.innerHTML = `<div class="alert alert-error">${escapeHtml(err.message)}</div>`;
  } finally {
    saveBtn.disabled = false;
  }
}

/** Toggles shift; opens reschedule modal when blocked by reservations. */
async function toggleShiftAvailability(memberId, date) {
  try {
    await apiRequest('admin/shifts/toggle', {
      method: 'POST',
      body: JSON.stringify({ member_id: memberId, date }),
    });
    return true;
  } catch (err) {
    if (err instanceof ApiError && err.code === 'RESERVATIONS_ON_DATE') {
      pendingShiftRemoval = { memberId, date };
      openShiftRescheduleModal(err.payload);
      return false;
    }
    throw err;
  }
}

/** Loads and renders shift data for the current month. */
export async function renderShiftPanel() {
  if (!initialized) initShiftPanel();

  const monthLabel = `${shiftYear}年${shiftMonth}月`;
  document.getElementById('shift-month-label').textContent = monthLabel;
  const mobileLabel = document.getElementById('shift-month-label-mobile-text');
  if (mobileLabel) mobileLabel.textContent = monthLabel;
  updateShiftTodayButton();
  renderShiftMonthChips();

  try {
    const data = await apiRequest(`admin/shifts?year=${shiftYear}&month=${shiftMonth}`);
    shiftMembers = data.members;
    shiftAvailability = data.availability;
    shiftPrinters = data.printers ?? [];
    shiftPrinterAvailability = data.printer_availability ?? [];

    if (shiftEditMode === 'member') {
      if (!selectedMemberId && shiftMembers.length) {
        selectedMemberId = shiftMembers[0].id;
      }
      if (selectedMemberId && !shiftMembers.find((m) => m.id === selectedMemberId)) {
        selectedMemberId = shiftMembers[0]?.id ?? null;
      }
    }

    if (shiftEditMode === 'printer') {
      if (!selectedPrinterId && shiftPrinters.length) {
        selectedPrinterId = shiftPrinters[0].id;
      }
      if (selectedPrinterId && !shiftPrinters.find((p) => p.id === selectedPrinterId)) {
        selectedPrinterId = shiftPrinters[0]?.id ?? null;
      }
    }

    renderShiftToolbar();
    renderShiftPrinterToolbar();
    renderShiftCalendar();
  } catch (err) {
    document.getElementById('shift-member-toolbar').innerHTML =
      `<div class="alert alert-error">${escapeHtml(err.message)}</div>`;
    document.getElementById('shift-calendar-grid').innerHTML = '';
  }
}

/** Changes the shift calendar month. */
function changeShiftMonth(delta) {
  shiftMonth += delta;
  if (shiftMonth > 12) {
    shiftMonth = 1;
    shiftYear++;
  } else if (shiftMonth < 1) {
    shiftMonth = 12;
    shiftYear--;
  }
  renderShiftPanel();
}

/** Jumps the shift calendar to the current month. */
function goToShiftToday() {
  const now = new Date();
  shiftYear = now.getFullYear();
  shiftMonth = now.getMonth() + 1;
  renderShiftPanel();
}

/** Updates the shift mobile today button day number. */
function updateShiftTodayButton() {
  const dayNum = document.getElementById('shift-today-day-num');
  if (!dayNum) return;
  dayNum.textContent = String(Number(todayJst().split('-')[2]));
}

/** Renders horizontal month chips for shift mobile calendar. */
function renderShiftMonthChips() {
  const container = document.getElementById('shift-calendar-month-chips');
  if (!container) return;

  container.innerHTML = '';
  for (let month = 1; month <= 12; month++) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'calendar-month-chip';
    chip.setAttribute('role', 'tab');
    chip.setAttribute('aria-selected', month === shiftMonth ? 'true' : 'false');
    if (month === shiftMonth) chip.classList.add('active');
    chip.textContent = `${month}月`;
    chip.addEventListener('click', () => {
      if (shiftMonth === month) return;
      shiftMonth = month;
      renderShiftPanel();
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

/** Renders weekday headers for shift calendar. */
function renderShiftWeekdayHeaders() {
  const row = document.getElementById('shift-calendar-weekdays-row');
  if (!row) return;

  row.innerHTML = '';
  WEEKDAYS.forEach((day) => {
    const el = document.createElement('div');
    el.className = 'calendar-weekday';
    el.textContent = day;
    row.appendChild(el);
  });
}

/** Renders member toolbar with color pickers. */
function renderShiftToolbar() {
  const toolbar = document.getElementById('shift-member-toolbar');

  if (!shiftMembers.length) {
    toolbar.innerHTML =
      '<p class="hint">メンバー一覧で印刷担当者を登録してから、シフトを設定してください。</p>';
    return;
  }

  const cardsHtml = shiftMembers
    .map((m) => {
      const selected =
        shiftEditMode === 'member' && m.id === selectedMemberId ? ' shift-member-card-active' : '';
      const menuOpen = m.id === openColorMenuMemberId;

      return `
      <div class="shift-member-card${selected}" data-member-id="${m.id}">
        <button type="button" class="shift-color-card" data-member-id="${m.id}" style="${shiftColorStyle(m.color_index)}" aria-expanded="${menuOpen}" aria-label="${escapeHtml(m.name)}の色を変更"></button>
        <button type="button" class="shift-member-select" data-member-id="${m.id}">
          <span class="shift-member-name">${escapeHtml(m.name)}</span>
          <span class="shift-member-hr">${escapeHtml(m.homeroom)}</span>
        </button>
      </div>`;
    })
    .join('');

  const openMember = shiftMembers.find((m) => m.id === openColorMenuMemberId);
  const colorBarHtml = openMember
    ? `<div class="shift-color-menu-bar" role="menu" aria-label="${escapeHtml(openMember.name)}の色">
        ${SHIFT_COLORS.map(
          (c) =>
            `<button type="button" class="shift-color-menu-item${openMember.color_index === c.index ? ' is-current' : ''}" data-member-id="${openMember.id}" data-color="${c.index}" style="${shiftColorStyle(c.index)}" aria-label="色 ${c.index + 1}"></button>`
        ).join('')}
      </div>`
    : '';

  toolbar.innerHTML = `
    <div class="shift-member-toolbar-track">${cardsHtml}</div>
    ${colorBarHtml}`;

  toolbar.querySelectorAll('.shift-member-select').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedMemberId = btn.dataset.memberId;
      shiftEditMode = 'member';
      openColorMenuMemberId = null;
      renderShiftToolbar();
      renderShiftPrinterToolbar();
      renderShiftCalendar();
    });
  });

  toolbar.querySelectorAll('.shift-color-card').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const memberId = btn.dataset.memberId;
      openColorMenuMemberId = openColorMenuMemberId === memberId ? null : memberId;
      selectedMemberId = memberId;
      shiftEditMode = 'member';
      renderShiftToolbar();
      renderShiftPrinterToolbar();
      renderShiftCalendar();
    });
  });

  toolbar.querySelectorAll('.shift-color-menu-item').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      await handleColorChange(btn.dataset.memberId, Number(btn.dataset.color));
      openColorMenuMemberId = null;
    });
  });

  requestAnimationFrame(() => {
    toolbar
      .querySelector('.shift-member-toolbar-track .shift-member-card-active')
      ?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
  });
}

/** Builds printer icon HTML for the shift toolbar. */
function shiftPrinterIconHtml(printer) {
  if (printer.image_url) {
    return `<img class="shift-printer-icon" src="${escapeHtml(printer.image_url)}" alt="" loading="lazy" />`;
  }
  return `<span class="shift-printer-icon shift-printer-icon-placeholder" aria-hidden="true">🖨️</span>`;
}

/** Renders printer toolbar for shift editing. */
function renderShiftPrinterToolbar() {
  const toolbar = document.getElementById('shift-printer-toolbar');
  if (!toolbar) return;

  if (!shiftPrinters.length) {
    toolbar.innerHTML =
      '<p class="hint">プリンター管理で機種を登録してから、稼働日を設定してください。</p>';
    return;
  }

  toolbar.innerHTML = `
    <div class="shift-printer-toolbar-track">
      ${shiftPrinters
        .map((printer) => {
          const active =
            shiftEditMode === 'printer' && printer.id === selectedPrinterId
              ? ' shift-printer-card-active'
              : '';
          return `
            <button type="button" class="shift-printer-card${active}" data-printer-id="${printer.id}">
              ${shiftPrinterIconHtml(printer)}
              <span class="shift-printer-name">${escapeHtml(printer.name)}</span>
            </button>`;
        })
        .join('')}
    </div>`;

  toolbar.querySelectorAll('[data-printer-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedPrinterId = btn.dataset.printerId;
      shiftEditMode = 'printer';
      selectedMemberId = null;
      openColorMenuMemberId = null;
      renderShiftToolbar();
      renderShiftPrinterToolbar();
      renderShiftCalendar();
    });
  });
}

/** Updates a member's shift color. */
async function handleColorChange(memberId, colorIndex) {
  try {
    const data = await apiRequest(`admin/members/${memberId}`, {
      method: 'PATCH',
      body: JSON.stringify({ color_index: colorIndex }),
    });
    const idx = shiftMembers.findIndex((m) => m.id === memberId);
    if (idx >= 0) shiftMembers[idx] = data.member;
    openColorMenuMemberId = null;
    renderShiftToolbar();
    renderShiftCalendar();
  } catch (err) {
    alert(err.message);
  }
}

/** Builds availability lookup keyed by date. */
function availabilityByDate() {
  const map = {};
  const memberById = Object.fromEntries(shiftMembers.map((m) => [m.id, m]));

  for (const row of shiftAvailability) {
    if (!map[row.date]) map[row.date] = [];
    const member = memberById[row.member_id];
    if (member) map[row.date].push(member);
  }

  return map;
}

/** Builds printer availability lookup keyed by date. */
function printerAvailabilityByDate() {
  const map = {};
  const printerById = Object.fromEntries(shiftPrinters.map((p) => [p.id, p]));

  for (const row of shiftPrinterAvailability) {
    if (!map[row.date]) map[row.date] = [];
    const printer = printerById[row.printer_id];
    if (printer) map[row.date].push(printer);
  }

  return map;
}

/** Renders the shift calendar grid. */
function renderShiftCalendar() {
  const grid = document.getElementById('shift-calendar-grid');
  grid.innerHTML = '';
  renderShiftWeekdayHeaders();

  const byDate = availabilityByDate();
  const printersByDate = printerAvailabilityByDate();
  const firstDay = new Date(shiftYear, shiftMonth - 1, 1);
  const lastDay = new Date(shiftYear, shiftMonth, 0).getDate();
  const startWeekday = firstDay.getDay();
  const todayStr = todayJst();

  const prevMonthLast = new Date(shiftYear, shiftMonth - 1, 0).getDate();
  for (let i = startWeekday - 1; i >= 0; i--) {
    grid.appendChild(createShiftDayCell(prevMonthLast - i, true, {}, {}, todayStr));
  }

  for (let day = 1; day <= lastDay; day++) {
    const dateStr = `${shiftYear}-${String(shiftMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    grid.appendChild(createShiftDayCell(day, false, byDate, printersByDate, todayStr, dateStr));
  }

  const totalCells = startWeekday + lastDay;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let day = 1; day <= remaining; day++) {
    grid.appendChild(createShiftDayCell(day, true, {}, {}, todayStr));
  }
}

/** Creates a shift calendar day cell. */
function createShiftDayCell(dayNum, otherMonth, byDate, printersByDate, todayStr, dateStr) {
  const cell = document.createElement('div');
  cell.className = 'calendar-day shift-day';
  if (otherMonth) cell.classList.add('other-month');
  if (dateStr === todayStr) cell.classList.add('today');

  const num = document.createElement('div');
  num.className = 'calendar-day-number';
  num.textContent = dayNum;
  cell.appendChild(num);

  if (dateStr && !otherMonth) {
    cell.dataset.date = dateStr;
    const members = byDate[dateStr] ?? [];
    const printers = printersByDate[dateStr] ?? [];

    if (members.length) {
      const chips = document.createElement('div');
      chips.className = 'shift-day-chips';
      for (const m of members) {
        const chip = document.createElement('span');
        chip.className = 'shift-day-chip';
        if (isMobileShiftView()) chip.classList.add('shift-day-chip-compact');
        chip.style.cssText = shiftColorStyle(m.color_index);
        chip.textContent = isMobileShiftView() ? m.name.slice(0, 1) : m.name;
        chip.title = `${m.name}（${m.homeroom}）`;
        chips.appendChild(chip);
      }
      cell.appendChild(chips);
    }

    if (printers.length) {
      const printerChips = document.createElement('div');
      printerChips.className = 'shift-day-printer-chips';
      for (const p of printers) {
        const chip = document.createElement('span');
        chip.className = 'shift-day-printer-chip';
        chip.textContent = isMobileShiftView() ? p.name.slice(0, 2) : p.name;
        chip.title = p.name;
        printerChips.appendChild(chip);
      }
      cell.appendChild(printerChips);
    }

    const canEditMember = shiftEditMode === 'member' && selectedMemberId;
    const canEditPrinter = shiftEditMode === 'printer' && selectedPrinterId;
    if (canEditMember || canEditPrinter) {
      cell.classList.add('shift-day-editable');
      cell.addEventListener('mousedown', (e) => handleShiftDayMouseDown(e, dateStr, cell));
      cell.addEventListener('mouseenter', () => handleShiftDayMouseEnter(dateStr, cell));
      cell.addEventListener('touchstart', (e) => handleShiftDayTouchStart(e, dateStr, cell), { passive: false });
      cell.addEventListener('touchmove', (e) => handleShiftDayTouchMove(e), { passive: false });
    }
  }

  return cell;
}

/** Handles mousedown on a shift day cell. */
function handleShiftDayMouseDown(e, dateStr, cell) {
  if (shiftEditMode === 'member' && !selectedMemberId) return;
  if (shiftEditMode === 'printer' && !selectedPrinterId) return;
  if (e.button !== undefined && e.button !== 0) return;
  e.preventDefault();
  startShiftDrag(dateStr, cell);
}

/** Handles touchstart on a shift day cell. */
function handleShiftDayTouchStart(e, dateStr, cell) {
  if (shiftEditMode === 'member' && !selectedMemberId) return;
  if (shiftEditMode === 'printer' && !selectedPrinterId) return;
  e.preventDefault();
  startShiftDrag(dateStr, cell);
}

/** Starts shift drag painting on a day cell. */
function startShiftDrag(dateStr, cell) {
  isDragging = true;
  dragStartDate = dateStr;
  dragTouchedDates = new Set([dateStr]);
  cell.classList.add('shift-day-painting');
}

/** Resolves a shift day cell from touch coordinates. */
function shiftCellFromTouch(touch) {
  const el = document.elementFromPoint(touch.clientX, touch.clientY);
  return el?.closest?.('.shift-day-editable[data-date]') ?? null;
}

/** Handles touchmove while painting shift days. */
function handleShiftDayTouchMove(e) {
  if (!isDragging) return;
  if (shiftEditMode === 'member' && !selectedMemberId) return;
  if (shiftEditMode === 'printer' && !selectedPrinterId) return;
  e.preventDefault();
  for (const touch of e.changedTouches) {
    const cell = shiftCellFromTouch(touch);
    if (!cell?.dataset.date) continue;
    const dateStr = cell.dataset.date;
    if (dragTouchedDates.has(dateStr)) continue;
    dragTouchedDates.add(dateStr);
    applyDragPreview(dateStr, cell);
  }
}

/** Handles mouseenter while dragging on shift calendar. */
function handleShiftDayMouseEnter(dateStr, cell) {
  if (!isDragging || !dateStr) return;
  if (shiftEditMode === 'member' && !selectedMemberId) return;
  if (shiftEditMode === 'printer' && !selectedPrinterId) return;
  if (dragTouchedDates.has(dateStr)) return;
  dragTouchedDates.add(dateStr);
  applyDragPreview(dateStr, cell);
}

/** Applies visual preview during drag. */
function applyDragPreview(_dateStr, cell) {
  cell.classList.add('shift-day-painting');
}

/** Toggles printer shift; opens reschedule modal when blocked. */
async function togglePrinterShiftAvailability(printerId, date) {
  try {
    await apiRequest('admin/shifts/printer-toggle', {
      method: 'POST',
      body: JSON.stringify({ printer_id: printerId, date }),
    });
    return true;
  } catch (err) {
    if (err instanceof ApiError && err.code === 'RESERVATIONS_ON_PRINTER_DATE') {
      pendingPrinterShiftRemoval = { printerId, date };
      pendingShiftRemoval = null;
      openShiftRescheduleModal(err.payload);
      return false;
    }
    throw err;
  }
}

/** Finishes drag and syncs availability to the server. */
async function handleShiftMouseUp() {
  if (!isDragging) {
    isDragging = false;
    return;
  }

  if (shiftEditMode === 'member' && !selectedMemberId) {
    isDragging = false;
    return;
  }
  if (shiftEditMode === 'printer' && !selectedPrinterId) {
    isDragging = false;
    return;
  }

  isDragging = false;
  const dates = [...dragTouchedDates];
  dragTouchedDates = new Set();

  if (dates.length === 1 && dates[0] === dragStartDate) {
    try {
      if (shiftEditMode === 'printer') {
        await togglePrinterShiftAvailability(selectedPrinterId, dates[0]);
      } else {
        await toggleShiftAvailability(selectedMemberId, dates[0]);
      }
    } catch (err) {
      alert(err.message);
    }
  } else if (dates.length > 0) {
    try {
      if (shiftEditMode === 'printer') {
        await apiRequest('admin/shifts/printer-availability', {
          method: 'PUT',
          body: JSON.stringify({
            printer_id: selectedPrinterId,
            dates,
            available: true,
          }),
        });
      } else {
        await apiRequest('admin/shifts/availability', {
          method: 'PUT',
          body: JSON.stringify({
            member_id: selectedMemberId,
            dates,
            available: true,
          }),
        });
      }
    } catch (err) {
      if (err instanceof ApiError && err.code === 'RESERVATIONS_ON_PRINTER_DATE') {
        pendingPrinterShiftRemoval = { printerId: selectedPrinterId, date: err.payload.date };
        pendingShiftRemoval = null;
        openShiftRescheduleModal(err.payload);
      } else if (err instanceof ApiError && err.code === 'RESERVATIONS_ON_DATE') {
        pendingShiftRemoval = { memberId: selectedMemberId, date: err.payload.date };
        pendingPrinterShiftRemoval = null;
        openShiftRescheduleModal(err.payload);
      } else {
        alert(err.message);
      }
    }
  }

  dragStartDate = null;
  await renderShiftPanel();
}

/** Escapes HTML special characters. */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}
