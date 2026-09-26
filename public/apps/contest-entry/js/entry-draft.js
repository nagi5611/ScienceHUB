// public/apps/contest-entry/js/entry-draft.js
const DRAFT_KEY = 'sciencehub_contest_application_draft_v2';

/** Parses schedule_type from stored draft. */
function parseScheduleType(value) {
  if (value === 'part_time') return 'part_time';
  return 'full_time';
}

/** Reads saved application form draft from localStorage. */
export function loadContestDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Persists application form draft. */
export function saveContestDraft(draft) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* ignore quota errors */
  }
}

/** Removes saved application form draft from localStorage. */
export function clearContestDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

/** Builds draft object from application form fields. */
export function extractContestDraft(form, participants) {
  const formData = new FormData(form);
  return {
    schedule_type: parseScheduleType(formData.get('schedule_type')),
    participants: participants.map((p) => ({
      homeroom: p.homeroom ?? '',
      student_number: p.student_number ?? '',
      student_name: p.student_name ?? '',
    })),
    title: String(formData.get('title') ?? ''),
    impressions: String(formData.get('impressions') ?? ''),
    self_print: form.querySelector('#self_print')?.checked === true,
  };
}

/** Applies draft values to the application form. */
export function applyContestDraft(form, draft) {
  if (!draft) return;
  const schedule = parseScheduleType(draft.schedule_type);
  const radio = form.querySelector(`input[name="schedule_type"][value="${schedule}"]`);
  if (radio) radio.checked = true;

  const title = form.querySelector('[name="title"]');
  if (title && draft.title != null) title.value = draft.title;
  const impressions = form.querySelector('[name="impressions"]');
  if (impressions && draft.impressions != null) impressions.value = draft.impressions;
  const selfPrint = form.querySelector('#self_print');
  if (selfPrint instanceof HTMLInputElement) {
    selfPrint.checked = Boolean(draft.self_print);
  }
}

export { parseScheduleType };
