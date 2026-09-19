// public/apps/contest-entry/js/entry-draft.js

export const CONTEST_DRAFT_KEY = 'contest-entry-draft-v1';

/** Saves contest entry form draft (no file). */
export function saveContestDraft(draft) {
  try {
    localStorage.setItem(CONTEST_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // ignore
  }
}

/** Loads contest entry draft. */
export function loadContestDraft() {
  try {
    const raw = localStorage.getItem(CONTEST_DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    return draft && typeof draft === 'object' ? draft : null;
  } catch {
    return null;
  }
}

/** Applies draft to form controls. */
export function applyContestDraft(form, draft) {
  if (!draft) return;

  const scheduleType = draft.schedule_type === 'part_time' ? 'part_time' : 'full_time';
  const radio = form.querySelector(`input[name="schedule_type"][value="${scheduleType}"]`);
  if (radio) radio.checked = true;

  const homeroomEl = form.querySelector('[name="homeroom"]');
  if (homeroomEl && draft.homeroom) homeroomEl.value = draft.homeroom;

  const setField = (name, value) => {
    const el = form.querySelector(`[name="${name}"]`);
    if (el && value != null) el.value = value;
  };
  setField('student_number', draft.student_number);
  setField('student_name', draft.student_name);
}

/** Extracts draft fields from the form. */
export function extractContestDraft(form, homeroomValue) {
  const formData = new FormData(form);
  const scheduleType = formData.get('schedule_type') === 'part_time' ? 'part_time' : 'full_time';
  return {
    schedule_type: scheduleType,
    homeroom: homeroomValue,
    student_number: String(formData.get('student_number') ?? ''),
    student_name: String(formData.get('student_name') ?? ''),
  };
}
