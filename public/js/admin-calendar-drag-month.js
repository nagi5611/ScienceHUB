// public/js/admin-calendar-drag-month.js — prev/next month targets while drag-rescheduling

const EDGE_CLASS = 'calendar-drag-month-edge';

/**
 * Adds side drop zones and wires hover-to-navigate / drop-to-reschedule for admin calendars.
 */
export function setupAdminCalendarDragMonthNavigation(options) {
  const {
    wrapSelector,
    getDraggedReservationId,
    isRescheduleBusy,
    getCurrentMonth,
    changeMonth,
    onDropToMonth,
  } = options;

  const wrap = document.querySelector(wrapSelector);
  if (!wrap) return;

  ensureMonthEdges(wrap);

  let armedEdgeDelta = null;
  /** @type {{ year: number; month: number } | null} */
  let pendingDropTarget = null;

  const resetEdgeUi = () => {
    armedEdgeDelta = null;
    pendingDropTarget = null;
    wrap.querySelectorAll(`.${EDGE_CLASS}`).forEach((el) => {
      el.classList.remove('is-hover');
    });
  };

  wrap.addEventListener(
    'dragstart',
    (e) => {
      if (!e.target.closest('.admin-calendar-slot[draggable="true"]')) return;
      wrap.classList.add('is-calendar-dragging');
    },
    true
  );

  wrap.addEventListener(
    'dragend',
    () => {
      wrap.classList.remove('is-calendar-dragging');
      resetEdgeUi();
    },
    true
  );

  wrap.querySelectorAll(`.${EDGE_CLASS}`).forEach((edge) => {
    const delta = Number(edge.dataset.monthDelta);
    if (delta !== 1 && delta !== -1) return;

    edge.addEventListener('dragenter', (e) => {
      if (isRescheduleBusy() || !getDraggedReservationId()) return;
      e.preventDefault();
      edge.classList.add('is-hover');
      const { year, month } = getCurrentMonth();
      pendingDropTarget = calendarMonthAfterDelta(year, month, delta);
      if (armedEdgeDelta === delta) return;
      armedEdgeDelta = delta;
      changeMonth(delta);
    });

    edge.addEventListener('dragover', (e) => {
      if (isRescheduleBusy() || !getDraggedReservationId()) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    edge.addEventListener('dragleave', (e) => {
      if (edge.contains(e.relatedTarget)) return;
      edge.classList.remove('is-hover');
      armedEdgeDelta = null;
    });

    edge.addEventListener('drop', async (e) => {
      e.preventDefault();
      edge.classList.remove('is-hover');
      const id = e.dataTransfer.getData('text/plain') || getDraggedReservationId();
      armedEdgeDelta = null;
      if (!id || isRescheduleBusy()) return;

      const { year, month } = getCurrentMonth();
      const target = pendingDropTarget ?? calendarMonthAfterDelta(year, month, delta);
      pendingDropTarget = null;
      await onDropToMonth(target.year, target.month, id);
    });
  });
}

/** Creates prev/next month edge elements once inside the calendar wrap. */
function ensureMonthEdges(wrap) {
  if (wrap.querySelector(`.${EDGE_CLASS}`)) return;

  const prev = document.createElement('div');
  prev.className = `${EDGE_CLASS} ${EDGE_CLASS}--prev`;
  prev.dataset.monthDelta = '-1';
  prev.setAttribute('aria-hidden', 'true');
  prev.innerHTML = '<span class="calendar-drag-month-edge-label">前月</span>';

  const next = document.createElement('div');
  next.className = `${EDGE_CLASS} ${EDGE_CLASS}--next`;
  next.dataset.monthDelta = '1';
  next.setAttribute('aria-hidden', 'true');
  next.innerHTML = '<span class="calendar-drag-month-edge-label">翌月</span>';

  wrap.insertBefore(prev, wrap.firstChild);
  wrap.appendChild(next);
}

/** Returns year/month after applying a calendar month delta (month is 1–12). */
export function calendarMonthAfterDelta(year, month, delta) {
  let y = year;
  let m = month + delta;
  if (m > 12) {
    m = 1;
    y += 1;
  } else if (m < 1) {
    m = 12;
    y -= 1;
  }
  return { year: y, month: m };
}
