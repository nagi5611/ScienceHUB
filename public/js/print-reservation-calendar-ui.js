// public/js/print-reservation-calendar-ui.js
import {
  SCALE_SHORT,
  getCalendarScalePrintLabel,
  indexReservationOccurrencesByDate,
} from './print-reservation-calendar-span.js';

export { indexReservationOccurrencesByDate };

/**
 * Sun-first week rows for a month grid, including leading/trailing adjacent-month days.
 * @param {number} year Full year (e.g. 2026)
 * @param {number} month 1–12
 * @returns {{ dayNum: number, otherMonth: boolean, dateStr: string }[]}
 */
export function buildCalendarMonthGridDays(year, month) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0).getDate();
  const startWeekday = firstDay.getDay();
  const days = [];

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevMonthLast = new Date(year, month - 1, 0).getDate();

  for (let i = 0; i < startWeekday; i++) {
    const dayNum = prevMonthLast - startWeekday + 1 + i;
    days.push({
      dayNum,
      otherMonth: true,
      dateStr: `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`,
    });
  }

  for (let day = 1; day <= lastDay; day++) {
    days.push({
      dayNum: day,
      otherMonth: false,
      dateStr: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    });
  }

  const totalCells = startWeekday + lastDay;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  for (let day = 1; day <= remaining; day++) {
    days.push({
      dayNum: day,
      otherMonth: true,
      dateStr: `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    });
  }

  return days;
}

export function createCalendarOccurrenceSlot(options) {
  const {
    reservation: r,
    occurrence,
    onOpenDetail,
    draggable = false,
    dragBusy = false,
    bindDrag,
    compact = false,
    truncateForCell = (t) => t,
    escapeHtml = (t) => t,
    /** 'scale' (default) colors slots by S/M/L; 'status' colors by reservation status. */
    colorMode = 'scale',
    /** When colorMode is 'status', optional override (e.g. contest self-print). Returns class without "status-" prefix or full suffix like "self-print". */
    getStatusColorClass = null,
  } = options;

  const slot = document.createElement('button');
  slot.type = 'button';
  let colorClass;
  if (colorMode === 'status') {
    const resolved =
      typeof getStatusColorClass === 'function'
        ? getStatusColorClass(r)
        : r.status || 'applied';
    colorClass = resolved.startsWith('status-') ? resolved.slice('status-'.length) : resolved;
    colorClass = `status-${colorClass}`;
  } else {
    colorClass = occurrence.printScale;
  }
  slot.className = `calendar-slot admin-calendar-slot ${colorClass}`;
  slot.classList.add(`calendar-slot--${occurrence.mode}`);
  if (occurrence.segment !== 'single' && occurrence.segment !== 'start') {
    slot.classList.add('calendar-slot-span-continue');
  } else {
    slot.classList.add('calendar-slot-span-head');
  }
  slot.classList.add(`calendar-slot-segment-${occurrence.segment}`);

  const staffLabel = r.print_staff_label ? `担当者: ${r.print_staff_label}` : '';
  const scalePrintLabel = getCalendarScalePrintLabel(occurrence.partCount);
  const scaleShort = SCALE_SHORT[occurrence.printScale] ?? occurrence.printScale;

  let primaryLabel = occurrence.displayLabel || r.title;
  if (occurrence.mode === 'span' && occurrence.segment !== 'start' && occurrence.segment !== 'single') {
    primaryLabel = scalePrintLabel ?? '';
  }

  if (compact) {
    slot.classList.add('calendar-slot-compact');
    const compactText =
      primaryLabel.trim().length > 0
        ? `${scaleShort} ${truncateForCell(primaryLabel, 5)}`
        : `${scaleShort} …`;
    slot.innerHTML = `<span class="calendar-slot-compact-label">${escapeHtml(compactText)}</span>`;
    slot.title = [primaryLabel || r.title, staffLabel].filter(Boolean).join(' / ');
  } else {
    const titleLine =
      primaryLabel.trim().length > 0
        ? `<span class="calendar-slot-title-text">${escapeHtml(primaryLabel)}</span>`
        : '';
    slot.innerHTML = [
      `<span class="calendar-slot-scale">${escapeHtml(scaleShort)}</span>`,
      scalePrintLabel && occurrence.segment === 'start'
        ? `<span class="calendar-slot-scale-print-label">${escapeHtml(scalePrintLabel)}</span>`
        : '',
      titleLine,
      staffLabel && occurrence.segment === 'start'
        ? `<span class="calendar-slot-staff">${escapeHtml(staffLabel)}</span>`
        : '',
    ]
      .filter(Boolean)
      .join('');
    slot.title = [primaryLabel || r.title, staffLabel].filter(Boolean).join(' / ');
  }

  if (r.id) slot.dataset.reservationId = r.id;
  if (occurrence.partIndex != null) slot.dataset.partIndex = String(occurrence.partIndex);

  slot.draggable = draggable && !dragBusy;
  if (bindDrag) bindDrag(r.id, slot);

  slot.addEventListener('click', (e) => {
    e.stopPropagation();
    onOpenDetail?.(r.id);
  });

  return slot;
}
