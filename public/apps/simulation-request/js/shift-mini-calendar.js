// public/apps/simulation-request/js/shift-mini-calendar.js
import { apiRequest } from './api.js';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

/** Returns today's date string in JST (YYYY-MM-DD). */
function todayJstDateString() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/** Builds YYYY-MM-DD for a calendar cell. */
function dateStringFor(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Renders weekday header row. */
function renderWeekdays(container) {
  container.innerHTML = WEEKDAYS.map(
    (label, i) =>
      `<span class="sr-mini-weekday${i === 0 ? ' is-sun' : ''}${i === 6 ? ' is-sat' : ''}">${label}</span>`
  ).join('');
}

/** Renders the compact staff-availability calendar. */
export function createShiftMiniCalendar(mount) {
  const todayStr = todayJstDateString();
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let staffDates = new Set();
  let onDateSelect = null;

  mount.innerHTML = `
    <div class="sr-mini-cal">
      <div class="sr-mini-cal-toolbar">
        <button type="button" class="btn btn-secondary btn-sm" data-action="prev" aria-label="前月">‹</button>
        <span class="sr-mini-cal-month" data-month-label></span>
        <button type="button" class="btn btn-secondary btn-sm" data-action="next" aria-label="翌月">›</button>
      </div>
      <div class="sr-mini-cal-weekdays" data-weekdays></div>
      <div class="sr-mini-cal-grid" data-grid></div>
      <p class="hint sr-mini-cal-hint">緑＝担当がいる日の目安。実施日の参考にしてください。</p>
    </div>
  `;

  const monthLabel = mount.querySelector('[data-month-label]');
  const weekdaysEl = mount.querySelector('[data-weekdays]');
  const gridEl = mount.querySelector('[data-grid]');
  renderWeekdays(weekdaysEl);

  /** Loads shift availability for the current month. */
  async function loadMonth() {
    const data = await apiRequest(`calendar?year=${year}&month=${month}`);
    staffDates = new Set(data.staffAvailableDates ?? []);
    renderGrid();
  }

  /** Paints day cells for the month grid. */
  function renderGrid() {
    monthLabel.textContent = `${year}年${month}月`;
    const first = new Date(year, month - 1, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const cells = [];

    for (let i = 0; i < startPad; i++) {
      cells.push('<div class="sr-mini-day is-pad" aria-hidden="true"></div>');
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = dateStringFor(year, month, day);
      const covered = staffDates.has(dateStr);
      const classes = ['sr-mini-day'];
      if (dateStr === todayStr) classes.push('is-today');
      if (covered) classes.push('is-covered');
      else classes.push('is-empty');
      cells.push(
        `<button type="button" class="${classes.join(' ')}" data-date="${dateStr}" title="${dateStr}">${day}</button>`
      );
    }

    gridEl.innerHTML = cells.join('');

    gridEl.querySelectorAll('[data-date]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const date = btn.getAttribute('data-date');
        gridEl.querySelectorAll('.sr-mini-day.is-selected').forEach((el) => {
          el.classList.remove('is-selected');
        });
        btn.classList.add('is-selected');
        onDateSelect?.(date);
      });
    });
  }

  mount.querySelector('[data-action="prev"]').addEventListener('click', () => {
    month -= 1;
    if (month < 1) {
      month = 12;
      year -= 1;
    }
    loadMonth().catch(() => {});
  });

  mount.querySelector('[data-action="next"]').addEventListener('click', () => {
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
    loadMonth().catch(() => {});
  });

  return {
    load: loadMonth,
    onDateSelect(callback) {
      onDateSelect = callback;
    },
    getSelectedDate() {
      const selected = gridEl.querySelector('.sr-mini-day.is-selected');
      return selected?.getAttribute('data-date') ?? null;
    },
  };
}
