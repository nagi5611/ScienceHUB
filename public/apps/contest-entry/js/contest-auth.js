/**
 * ScienceHUB 連携 — 造形物コンテスト（依頼）用
 */

let hubUser = null;

/** アプリアクセスを確認する */
export async function checkAppAccess() {
  const response = await fetch('/api/apps/contest-entry/access', {
    credentials: 'include',
  });
  if (response.status === 401) {
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/login/?next=${next}`;
    return false;
  }
  if (response.status === 403) {
    document.body.classList.add('contest-entry-denied');
    const denied = document.getElementById('access-denied');
    if (denied) denied.hidden = false;
    document.querySelector('.site-header')?.setAttribute('hidden', '');
    document.querySelector('.contest-entry-main')?.setAttribute('hidden', '');
    return false;
  }
  return response.ok;
}

/** ScienceHUB プロフィールを取得する */
export async function refreshAuthSession() {
  const res = await fetch('/api/auth/profile', { credentials: 'include' });
  if (!res.ok) throw new Error('ログインが必要です');
  const data = await res.json();
  hubUser = data.user;
  return hubUser;
}

/** ヘッダー表示を更新 */
export function updateAuthHeader() {
  const label = document.getElementById('auth-user-label');
  if (label && hubUser) {
    label.textContent = hubUser.display_name || hubUser.student_name || hubUser.email || 'ログイン中';
  }
}

/** 初期化（ログイン必須） */
export async function initAuth() {
  await refreshAuthSession();
  updateAuthHeader();
  document.getElementById('auth-dashboard-btn')?.addEventListener('click', () => {
    window.location.href = '/';
  });
}

export function getAuthUser() {
  return hubUser;
}
