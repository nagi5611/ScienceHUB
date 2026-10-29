// src/js/login.js
import { apiRequest } from './api.js';
import { setupHomeroomCombobox } from './homeroom.js';
import { GOOGLE_ICON, MICROSOFT_ICON } from './oauth-icons.js';
import { refreshAuthSession, setAuthUser } from './auth-core.js';

let activeTab = 'login';
let otpStep = 'form';
let pendingEmail = '';
let signupHomeroomField = null;
let profileHomeroomField = null;

async function init() {
  signupHomeroomField = setupHomeroomCombobox('signup-homeroom', 'signup-homeroom-list');
  profileHomeroomField = setupHomeroomCombobox('profile-homeroom', 'profile-homeroom-list');

  document.getElementById('auth-google-btn').innerHTML = `${GOOGLE_ICON}<span>Google</span>`;
  document.getElementById('auth-microsoft-btn').innerHTML = `${MICROSOFT_ICON}<span>Microsoft</span>`;

  document.querySelectorAll('.auth-tab').forEach((tab) => {
    tab.addEventListener('click', () => switchTab(tab.dataset.authTab));
  });

  document.getElementById('login-send-code-form')?.addEventListener('submit', handleLoginSendCode);
  document.getElementById('signup-send-code-form')?.addEventListener('submit', handleSignupSendCode);
  document.getElementById('verify-code-form')?.addEventListener('submit', handleVerifyCode);
  document.getElementById('resend-code-btn')?.addEventListener('click', handleResendCode);
  document.getElementById('back-to-form-btn')?.addEventListener('click', () => showOtpStep('form'));
  document.getElementById('auth-google-btn')?.addEventListener('click', () => startOAuth('google'));
  document.getElementById('auth-microsoft-btn')?.addEventListener('click', () => startOAuth('microsoft'));
  document.getElementById('profile-form')?.addEventListener('submit', handleProfileSave);

  const params = new URLSearchParams(window.location.search);
  const initialTab = params.get('tab') === 'signup' ? 'signup' : 'login';
  switchTab(initialTab);

  await refreshAuthSession();
  await handleAuthQueryParams(params);
}

/** Handles OAuth redirect query params. */
async function handleAuthQueryParams(params) {
  if (params.get('profile') === '1') {
    showProfilePanel();
    return;
  }

  if (params.get('auth_success') === '1') {
    showAlert('ログインしました', 'success');
    cleanAuthQuery();
    setTimeout(() => { window.location.href = '/'; }, 800);
    return;
  }

  if (params.get('auth_profile') === '1') {
    showAlert('ログインしました。プロフィールを入力してください', 'success');
    cleanAuthQuery();
    showProfilePanel();
    return;
  }

  const authError = params.get('auth_error');
  if (authError) {
    showAlert(decodeURIComponent(authError), 'error');
    cleanAuthQuery();
  }
}

function cleanAuthQuery() {
  const url = new URL(window.location.href);
  ['auth_success', 'auth_profile', 'auth_error', 'profile', 'tab'].forEach((k) => url.searchParams.delete(k));
  window.history.replaceState({}, '', url.pathname + url.search);
}

function switchTab(tab) {
  activeTab = tab;
  otpStep = 'form';
  document.querySelectorAll('.auth-tab').forEach((el) => {
    el.classList.toggle('active', el.dataset.authTab === tab);
  });
  document.getElementById('login-panel')?.classList.toggle('is-inactive', tab !== 'login');
  document.getElementById('signup-panel')?.classList.toggle('is-inactive', tab !== 'signup');
  document.getElementById('profile-panel')?.classList.add('hidden');
  document.getElementById('auth-main-card')?.classList.remove('hidden');
  updateVerifySubmitLabel();
  showOtpStep('form');
  document.getElementById('auth-alert').innerHTML = '';
}

/** Updates verify button label for login vs signup tab. */
function updateVerifySubmitLabel() {
  const btn = document.getElementById('verify-submit-btn');
  if (!btn) return;
  btn.textContent = activeTab === 'signup' ? 'アカウント作成' : 'ログイン';
}

function showProfilePanel() {
  document.getElementById('auth-main-card')?.classList.add('hidden');
  document.getElementById('profile-panel')?.classList.remove('hidden');
  document.querySelectorAll('.auth-tab').forEach((el) => el.classList.remove('active'));
}

function showOtpStep(step) {
  otpStep = step;
  const onCode = step === 'code';
  document.getElementById('login-form-step')?.classList.toggle('hidden', onCode || activeTab !== 'login');
  document.getElementById('signup-form-step')?.classList.toggle('hidden', onCode || activeTab !== 'signup');
  document.getElementById('code-step')?.classList.toggle('hidden', !onCode);
  document.querySelector('.auth-panels')?.classList.toggle('hidden', onCode);
  document.querySelector('.auth-oauth-row')?.classList.toggle('hidden', onCode);
  document.querySelector('.auth-divider')?.classList.toggle('hidden', onCode);
  if (onCode) {
    document.getElementById('verify-email-label').textContent = pendingEmail;
    document.getElementById('verify-code-input').value = '';
    document.getElementById('verify-code-input').focus();
    updateVerifySubmitLabel();
  }
}

function startOAuth(provider) {
  const mode = activeTab === 'signup' ? 'signup' : 'login';
  window.location.href = `/api/auth/${provider}/login?mode=${mode}`;
}

async function handleLoginSendCode(e) {
  e.preventDefault();
  pendingEmail = document.getElementById('login-email').value.trim();
  await sendCode({ email: pendingEmail, mode: 'login' });
}

async function handleSignupSendCode(e) {
  e.preventDefault();
  if (!signupHomeroomField?.isValid()) {
    showAlert('ホームルームは 101〜109、201〜209、301〜309 から選択してください', 'error');
    return;
  }
  pendingEmail = document.getElementById('signup-email').value.trim();
  await sendCode({
    email: pendingEmail,
    mode: 'signup',
    homeroom: signupHomeroomField.getValue(),
    student_number: Number(document.getElementById('signup-student-number').value),
    student_name: document.getElementById('signup-student-name').value.trim(),
  });
}

async function sendCode(payload) {
  document.getElementById('auth-alert').innerHTML = '';
  try {
    await apiRequest('auth/email/send-code', { method: 'POST', body: JSON.stringify(payload) });
    showAlert('認証コードを送信しました。メールを確認してください', 'success');
    showOtpStep('code');
  } catch (err) {
    showAlert(err.message, 'error');
  }
}

async function handleResendCode() {
  if (activeTab === 'login') {
    await sendCode({ email: pendingEmail, mode: 'login' });
    return;
  }
  if (!signupHomeroomField?.isValid()) {
    showAlert('ホームルームを正しく入力してください', 'error');
    return;
  }
  await sendCode({
    email: pendingEmail,
    mode: 'signup',
    homeroom: signupHomeroomField.getValue(),
    student_number: Number(document.getElementById('signup-student-number').value),
    student_name: document.getElementById('signup-student-name').value.trim(),
  });
}

async function handleVerifyCode(e) {
  e.preventDefault();
  document.getElementById('auth-alert').innerHTML = '';
  try {
    const data = await apiRequest('auth/email/verify', {
      method: 'POST',
      body: JSON.stringify({
        email: pendingEmail,
        code: document.getElementById('verify-code-input').value.trim(),
      }),
    });
    setAuthUser(data.user);
    if (!data.user.profileComplete) {
      showAlert('ログインしました。プロフィールを確認してください', 'success');
      showProfilePanel();
      return;
    }
    showAlert('ログインしました', 'success');
    setTimeout(() => { window.location.href = '/'; }, 800);
  } catch (err) {
    showAlert(err.message, 'error');
  }
}

async function handleProfileSave(e) {
  e.preventDefault();
  if (!profileHomeroomField?.isValid()) {
    showAlert('ホームルームは 101〜109、201〜209、301〜309 から選択してください', 'error');
    return;
  }
  try {
    const data = await apiRequest('auth/profile', {
      method: 'PATCH',
      body: JSON.stringify({
        homeroom: document.getElementById('profile-homeroom').value,
        student_number: Number(document.getElementById('profile-student-number').value),
        student_name: document.getElementById('profile-student-name').value,
      }),
    });
    setAuthUser(data.user);
    showAlert('プロフィールを保存しました', 'success');
    setTimeout(() => { window.location.href = '/'; }, 800);
  } catch (err) {
    showAlert(err.message, 'error');
  }
}

function showAlert(message, type) {
  const el = document.getElementById('auth-alert');
  if (!el) return;
  el.innerHTML = `<div class="alert alert-${type === 'error' ? 'error' : 'success'}">${escapeHtml(message)}</div>`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

init();
