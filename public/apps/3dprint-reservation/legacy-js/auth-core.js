// src/js/auth-core.js
import { apiRequest } from './api.js';

/** @typedef {{ id: string; email: string; provider: string; homeroom: string | null; student_number: number | null; student_name: string | null; profileComplete: boolean }} PublicUser */

/** @type {PublicUser | null} */
let currentUser = null;

/** Returns the current logged-in user, if any. */
export function getAuthUser() {
  return currentUser;
}

/** Sets current user (after login page success). */
export function setAuthUser(user) {
  currentUser = user;
}

/** Returns whether identity fields can be skipped (logged in with complete profile). */
export function canSkipIdentity() {
  return Boolean(currentUser?.profileComplete);
}

/** Loads session from API. */
export async function refreshAuthSession() {
  try {
    const data = await apiRequest('auth/session');
    currentUser = data.authenticated ? data.user : null;
  } catch {
    currentUser = null;
  }
  return currentUser;
}

/** Shows or hides identity input sections based on login state. */
export function updateIdentitySections() {
  const skip = canSkipIdentity();
  document.getElementById('requester-info-section')?.classList.toggle('hidden', skip);
  document.getElementById('edit-identity-section')?.classList.toggle('hidden', skip);
  document.getElementById('cancel-identity-section')?.classList.toggle('hidden', skip);
  document.getElementById('retry-identity-hint')?.classList.toggle(
    'hidden',
    skip || !document.getElementById('retry-identity-hint')?.dataset.forceShow
  );

  const loggedInNote = document.getElementById('logged-in-identity-note');
  if (loggedInNote) {
    loggedInNote.classList.toggle('hidden', !skip);
    if (skip && currentUser) {
      loggedInNote.textContent = `ログイン中: ${currentUser.homeroom} ${currentUser.student_number}番 ${currentUser.student_name}`;
    }
  }

  if (skip) removeIdentityRequired();
  else restoreIdentityRequired();
}

/** Removes required from identity fields when logged in. */
function removeIdentityRequired() {
  [
    'homeroom',
    'student_number',
    'student_name',
    'edit-homeroom',
    'edit-student-number',
    'edit-student-name',
    'cancel-homeroom',
    'cancel-student-number',
    'cancel-student-name',
  ].forEach((id) => document.getElementById(id)?.removeAttribute('required'));
}

/** Restores required on identity fields for guests. */
function restoreIdentityRequired() {
  [
    'homeroom',
    'student_number',
    'student_name',
    'edit-homeroom',
    'edit-student-number',
    'edit-student-name',
    'cancel-homeroom',
    'cancel-student-number',
    'cancel-student-name',
  ].forEach((id) => document.getElementById(id)?.setAttribute('required', ''));
}

/** Prefills reservation form from logged-in user profile. */
export function applyUserToReservationForm() {
  if (!currentUser?.profileComplete) return;
  document.getElementById('homeroom').value = currentUser.homeroom ?? '';
  document.getElementById('student_number').value = currentUser.student_number ?? '';
  document.getElementById('student_name').value = currentUser.student_name ?? '';
}

/** Prefills edit form identity from profile. */
export function applyUserToEditForm() {
  if (!currentUser?.profileComplete) return;
  document.getElementById('edit-homeroom').value = currentUser.homeroom ?? '';
  document.getElementById('edit-student-number').value = currentUser.student_number ?? '';
  document.getElementById('edit-student-name').value = currentUser.student_name ?? '';
}

/** Returns identity payload for API calls (empty when server uses session). */
export function identityPayload(formIds = { homeroom: 'homeroom', studentNumber: 'student_number', studentName: 'student_name' }) {
  if (canSkipIdentity()) return {};
  return {
    homeroom: document.getElementById(formIds.homeroom)?.value.trim() ?? '',
    student_number: Number(document.getElementById(formIds.studentNumber)?.value),
    student_name: document.getElementById(formIds.studentName)?.value.trim() ?? '',
  };
}

/** Redirects to login page for profile completion. */
export function redirectToProfileSetup() {
  window.location.href = '/login/?profile=1';
}

/** Prompts login if profile incomplete before booking. */
export function ensureCanBook() {
  if (currentUser && !currentUser.profileComplete) {
    redirectToProfileSetup();
    return false;
  }
  return true;
}

/** Updates main page header login / user display. */
export function updateAuthHeader() {
  const openBtn = document.getElementById('auth-open-btn');
  const userMenu = document.getElementById('auth-user-menu');
  const userLabel = document.getElementById('auth-user-label');

  if (!openBtn || !userMenu) return;

  if (currentUser) {
    openBtn.classList.add('hidden');
    userMenu.classList.remove('hidden');
    const name = currentUser.student_name || currentUser.email.split('@')[0];
    const hr = currentUser.homeroom ? ` (${currentUser.homeroom})` : '';
    userLabel.textContent = `${name}${hr}`;
  } else {
    openBtn.classList.remove('hidden');
    userMenu.classList.add('hidden');
  }
}

/** Logs out the current user. */
export async function logoutUser() {
  try {
    await apiRequest('auth/logout', { method: 'POST' });
  } catch {
    /* ignore */
  }
  currentUser = null;
}
