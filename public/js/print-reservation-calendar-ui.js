// public/js/print-reservation-calendar-ui.js
import {
  SCALE_SHORT,
  getCalendarScalePrintLabel,
  indexReservationOccurrencesByDate,
} from './print-reservation-calendar-span.js';

export { indexReservationOccurrencesByDate };

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
  } = options;

  const slot = document.createElement('button');
  slot.type = 'button';
  slot.className = `calendar-slot admin-calendar-slot ${occurrence.printScale}`;
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
