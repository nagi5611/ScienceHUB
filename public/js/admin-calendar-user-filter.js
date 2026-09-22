/** Admin calendar — per-user / applicant text filter (shared across management apps). */

let calendarUserFilterQuery = '';

/** Current filter text. */
export function getCalendarUserFilterQuery() {
  return calendarUserFilterQuery;
}

/** Whether a reservation matches the calendar user filter. */
export function reservationMatchesCalendarUserFilter(reservation, query) {
  const normalized = String(query ?? '').trim().toLowerCase();
  if (!normalized) return true;
  const parts = [
    reservation.student_name,
    reservation.homeroom,
    reservation.student_number != null ? String(reservation.student_number) : '',
    reservation.title,
    reservation.user_id,
    reservation.print_staff_label,
  ];
  const haystack = parts
    .filter((part) => part != null && String(part).trim() !== '')
    .join(' ')
    .toLowerCase();
  return haystack.includes(normalized);
}

/** Filters reservations for calendar / today tasks. */
export function filterReservationsForCalendar(reservations, query) {
  const q = query ?? calendarUserFilterQuery;
  return reservations.filter((r) => reservationMatchesCalendarUserFilter(r, q));
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

/** Fills datalist with distinct reservation owners (by user_id). */
export function updateAdminCalendarUserFilterOptions(reservations) {
  const datalist = document.getElementById('admin-calendar-user-filter-options');
  if (!datalist) return;
  const byUser = new Map();
  for (const r of reservations) {
    const userId = r.user_id;
    if (!userId) continue;
    if (!byUser.has(userId)) {
      const label = `${r.student_name ?? ''}（${r.homeroom ?? ''}）`.trim();
      byUser.set(userId, label || userId);
    }
  }
  const options = [...byUser.entries()]
    .sort((a, b) => a[1].localeCompare(b[1], 'ja'))
    .map(([, label]) => `<option value="${escapeAttr(label)}"></option>`)
    .join('');
  datalist.innerHTML = options;
}

/** Binds calendar user filter controls; onChange re-renders calendar views. */
export function bindAdminCalendarUserFilter({ onChange }) {
  const input = document.getElementById('admin-calendar-user-filter');
  const clearBtn = document.getElementById('admin-calendar-user-filter-clear');
  const statusEl = document.getElementById('admin-calendar-user-filter-status');
  if (!input) return;

  const notify = () => {
    calendarUserFilterQuery = input.value;
    if (statusEl) {
      const q = calendarUserFilterQuery.trim();
      statusEl.textContent = q ? `絞り込み: 「${q}」` : '';
      statusEl.hidden = !q;
    }
    onChange();
  };

  input.addEventListener('input', notify);
  clearBtn?.addEventListener('click', () => {
    calendarUserFilterQuery = '';
    input.value = '';
    notify();
  });
}
