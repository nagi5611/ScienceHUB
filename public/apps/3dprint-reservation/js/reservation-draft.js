// src/js/reservation-draft.js

export const DRAFT_STORAGE_KEYS = {
  public: '3dprinter-reservation-draft-v1',
  admin: '3dprinter-admin-reservation-draft-v1',
};

/** Extracts cacheable form fields (excludes date and file). */
export function extractReservationDraft(form, homeroomField) {
  const formData = new FormData(form);
  return {
    homeroom: homeroomField.getValue(),
    student_number: String(formData.get('student_number') ?? ''),
    student_name: String(formData.get('student_name') ?? ''),
    purpose: String(formData.get('purpose') ?? ''),
    purpose_other: String(formData.get('purpose_other') ?? ''),
    title: String(formData.get('title') ?? ''),
    summary: String(formData.get('summary') ?? ''),
    print_scale: String(formData.get('print_scale') ?? ''),
    print_notes: String(formData.get('print_notes') ?? ''),
  };
}

/** Saves reservation draft to localStorage. */
export function saveReservationDraft(storageKey, draft) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(draft));
  } catch {
    // Ignore quota or privacy mode errors.
  }
}

/** Loads reservation draft from localStorage. */
export function loadReservationDraft(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    if (!draft || typeof draft !== 'object') return null;
    return draft;
  } catch {
    return null;
  }
}

/** Returns whether a saved draft exists. */
export function hasReservationDraft(storageKey) {
  return loadReservationDraft(storageKey) !== null;
}

/** Shows or hides the restore-draft button. */
export function updateDraftRestoreButton(button, storageKey) {
  if (!button) return;
  button.classList.toggle('hidden', !hasReservationDraft(storageKey));
}

/** Applies a saved draft to the form (text fields and selections only). */
export function applyReservationDraft(form, draft, { homeroomInputId, purposeOtherGroupId, onApplied } = {}) {
  if (!draft) return false;

  const homeroomInput = homeroomInputId ? document.getElementById(homeroomInputId) : null;
  if (homeroomInput && draft.homeroom) {
    homeroomInput.value = draft.homeroom;
  }

  applyReservationFormFields(form, draft, { purposeOtherGroupId, onApplied });

  const setField = (name, value) => {
    const el = form.querySelector(`[name="${name}"]`);
    if (el && value !== undefined && value !== null) el.value = value;
  };
  setField('student_number', draft.student_number);
  setField('student_name', draft.student_name);
  return true;
}

/** Applies retry form fields without identity (HR / student number / name). */
export function applyRetryFormSnapshot(form, snapshot, { purposeOtherGroupId, onApplied } = {}) {
  if (!snapshot) return false;
  applyReservationFormFields(form, snapshot, { purposeOtherGroupId, onApplied });
  return true;
}

/** Applies shared reservation form fields (excludes identity). */
function applyReservationFormFields(form, data, { purposeOtherGroupId, onApplied } = {}) {
  const setField = (name, value) => {
    const el = form.querySelector(`[name="${name}"]`);
    if (el && value !== undefined && value !== null) el.value = value;
  };

  setField('title', data.title);
  setField('summary', data.summary);
  setField('purpose_other', data.purpose_other);
  setField('print_notes', data.print_notes);

  if (data.purpose) {
    const purposeRadio = form.querySelector(`input[name="purpose"][value="${data.purpose}"]`);
    if (purposeRadio) purposeRadio.checked = true;
  }

  const purposeOtherGroup = purposeOtherGroupId ? document.getElementById(purposeOtherGroupId) : null;
  if (purposeOtherGroup) {
    purposeOtherGroup.classList.toggle('hidden', data.purpose !== 'other');
  }

  if (data.print_scale) {
    const scaleRadio = form.querySelector(`input[name="print_scale"][value="${data.print_scale}"]`);
    if (scaleRadio && !scaleRadio.disabled) {
      scaleRadio.checked = true;
    }
  }

  onApplied?.({ purpose: data.purpose, print_scale: data.print_scale });
}
