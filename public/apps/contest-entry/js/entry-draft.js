// public/apps/contest-entry/js/entry-draft.js
const DRAFT_KEY = 'sciencehub_contest_application_draft_v1';

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

/** Builds draft object from application form fields. */
export function extractContestDraft(form, homeroomValue, memberNames) {
  const formData = new FormData(form);
  return {
    schedule_type: parseScheduleType(formData.get('schedule_type')),
    homeroom: homeroomValue,
    student_number: String(formData.get('student_number') ?? ''),
    student_name: String(formData.get('student_name') ?? ''),
    title: String(formData.get('title') ?? ''),
    impressions: String(formData.get('impressions') ?? ''),
    members: memberNames,
  };
}

/** Applies draft values to the application form. */
export function applyContestDraft(form, draft) {
  if (!draft) return;
  const schedule = parseScheduleType(draft.schedule_type);
  const radio = form.querySelector(`input[name="schedule_type"][value="${schedule}"]`);
  if (radio) radio.checked = true;

  if (schedule === 'full_time') {
    const homeroom = form.querySelector('#homeroom');
    if (homeroom) homeroom.value = draft.homeroom ?? '';
  } else {
    const classFree = form.querySelector('#class_free');
    if (classFree) classFree.value = draft.homeroom ?? draft.class_free ?? '';
  }

  const fields = ['student_number', 'student_name', 'title', 'impressions'];
  for (const name of fields) {
    const el = form.querySelector(`[name="${name}"]`);
    if (el && draft[name] != null) el.value = draft[name];
  }
}

export { parseScheduleType };
