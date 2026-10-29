// src/js/auth.js — main reservation page auth (header + session)
import {
  refreshAuthSession,
  updateAuthHeader,
  updateIdentitySections,
  logoutUser,
} from './auth-core.js';

/** Initializes auth on the reservation page. */
export async function initAuth() {
  document.getElementById('auth-open-btn')?.addEventListener('click', () => {
    window.location.href = '/login/';
  });
  document.getElementById('auth-logout-btn')?.addEventListener('click', handleLogout);
  document.getElementById('auth-profile-btn')?.addEventListener('click', () => {
    window.location.href = '/login/?profile=1';
  });

  await refreshAuthSession();
  updateAuthHeader();
  updateIdentitySections();
}

async function handleLogout() {
  await logoutUser();
  updateAuthHeader();
  updateIdentitySections();
  showAuthToast('ログアウトしました');
}

function showAuthToast(message) {
  const toast = document.getElementById('page-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(showAuthToast._timer);
  showAuthToast._timer = setTimeout(() => toast.classList.add('hidden'), 3500);
}

export {
  getAuthUser,
  canSkipIdentity,
  applyUserToReservationForm,
  applyUserToEditForm,
  identityPayload,
  ensureCanBook,
  updateIdentitySections,
  refreshAuthSession,
} from './auth-core.js';
