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

/** Normalizes stored schedule_type for draft restore. */
function normalizeDraftScheduleType(value) {
  if (value === 'part_time' || value === 'towa_branch') return value;
  if (value === 'hekibunko') return 'towa_branch';
  return 'full_time';
}

/** Applies draft to form controls. */
export function applyContestDraft(form, draft) {
  if (!draft) return;

  const scheduleType = normalizeDraftScheduleType(draft.schedule_type);
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
  setField('title', draft.title);
  setField('summary', draft.summary);
  setField('print_notes', draft.print_notes);

  if (draft.class_free && form.querySelector('[name="class_free"]')) {
    form.querySelector('[name="class_free"]').value = draft.class_free;
  }
}

/** Extracts draft fields from the form. */
export function extractContestDraft(form, homeroomValue) {
  const formData = new FormData(form);
  const scheduleType = normalizeDraftScheduleType(formData.get('schedule_type'));
  return {
    schedule_type: scheduleType,
    homeroom: homeroomValue,
    class_free: String(formData.get('class_free') ?? ''),
    student_number: String(formData.get('student_number') ?? ''),
    student_name: String(formData.get('student_name') ?? ''),
    title: String(formData.get('title') ?? ''),
    summary: String(formData.get('summary') ?? ''),
    print_notes: String(formData.get('print_notes') ?? ''),
  };
}
