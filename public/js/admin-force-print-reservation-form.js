/** Admin calendar: optional-field force registration from the reservation modal. */

const FORCE_HINT_ID = 'admin-force-create-hint';
let fieldsThatHadRequired = [];

export function setAdminForcePrintCreateMode(enabled) {
  const form = document.getElementById('admin-reservation-form');
  const hint = document.getElementById(FORCE_HINT_ID);
  if (!form) return;

  if (enabled) {
    if (fieldsThatHadRequired.length === 0) {
      fieldsThatHadRequired = [...form.querySelectorAll('[required]')];
    }
    for (const el of form.querySelectorAll('[required]')) {
      if (el.id === 'admin-desired-date' || el.name === 'desired_date') continue;
      el.removeAttribute('required');
    }
    hint?.classList.remove('hidden');
    form.dataset.forceCreate = '1';
  } else {
    hint?.classList.add('hidden');
    delete form.dataset.forceCreate;
    for (const el of fieldsThatHadRequired) {
      if (el.isConnected) el.setAttribute('required', '');
    }
  }
}

export function isAdminForcePrintCreateMode() {
  return document.getElementById('admin-reservation-form')?.dataset.forceCreate === '1';
}

export function buildAdminForceReservationPayload({
  formData,
  desiredDate,
  homeroomValue,
  uploadResult,
}) {
  const purpose = formData.get('purpose');
  const printScale = formData.get('print_scale');
  const studentNumberRaw = formData.get('student_number');
  return {
    desired_date: desiredDate,
    homeroom: homeroomValue?.trim() ? homeroomValue : null,
    student_number:
      studentNumberRaw != null && String(studentNumberRaw).trim() !== ''
        ? Number(studentNumberRaw)
        : null,
    student_name: String(formData.get('student_name') ?? '').trim() || null,
    title: String(formData.get('title') ?? '').trim() || null,
    purpose: purpose || null,
    purpose_other: purpose === 'other' ? formData.get('purpose_other') : null,
    summary: formData.get('summary')?.trim() || null,
    print_notes: formData.get('print_notes')?.trim() || null,
    print_scale: printScale || null,
    printer_id: formData.get('printer_id') || null,
    ...(uploadResult
      ? {
          stl_r2_key: uploadResult.r2Key,
          stl_filename: uploadResult.filename,
          stl_size_bytes: uploadResult.size,
        }
      : {}),
  };
}
