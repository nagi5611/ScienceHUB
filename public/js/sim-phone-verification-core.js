// public/js/sim-phone-verification-core.js
const FIREBASE_SDK_VERSION = '11.6.0';
const SIM_API_BASE = '/api/simulation';

/** Performs a JSON API request to simulation phone-verification endpoints. */
async function simPhoneApiRequest(path, options = {}) {
  const res = await fetch(`${SIM_API_BASE}/${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `リクエストに失敗しました (${res.status})`);
  }
  return data;
}

/** Normalizes domestic input to E.164 +81... */
export function normalizeJapanPhoneInput(raw) {
  const digits = String(raw).replace(/\D/g, '');
  if (!digits) return null;
  let national = digits;
  if (national.startsWith('81')) national = national.slice(2);
  if (national.startsWith('0')) national = national.slice(1);
  if (!/^[789]0\d{8}$/.test(national)) return null;
  return `+81${national}`;
}

/**
 * @param {Record<string, string>} ids — DOM element ids
 * @param {{ openClass?: string, bodyOpenClass?: string, firebaseAppName?: string, onVerified?: () => void | Promise<void> }} options
 */
export function createSimPhoneVerification(ids, options = {}) {
  const openClass = options.openClass ?? 'open';
  const bodyOpenClass = options.bodyOpenClass ?? '';
  const firebaseAppName = options.firebaseAppName ?? 'sim-phone-default';

  let phoneVerified = false;
  let phoneVerificationExpired = false;
  let verificationConfig = null;
  let confirmationResult = null;
  let lastSentE164 = null;
  let resendCooldownUntil = 0;
  let recaptchaVerifier = null;
  let recaptchaSolved = false;
  let recaptchaRenderPromise = null;
  let firebaseAuth = null;

  const el = (key) => document.getElementById(ids[key]);

  /** Toggles visibility (class + HTML hidden attribute — hub modal uses both). */
  function setStepVisible(element, visible) {
    if (!element) return;
    if (visible) {
      element.classList.remove('hidden');
      element.hidden = false;
    } else {
      element.classList.add('hidden');
      element.hidden = true;
    }
  }

  function maskJapanE164(e164) {
    const digits = String(e164).replace(/\D/g, '');
    if (!digits.startsWith('81')) return e164;
    const national = `0${digits.slice(2)}`;
    if (national.length < 11) return e164;
    return `${national.slice(0, 3)}-****-${national.slice(-4)}`;
  }

  function showPhoneAlert(message) {
    const alertEl = el('alert');
    if (!alertEl) return;
    alertEl.textContent = message;
    alertEl.classList.remove('hidden', 'alert-success', 'hub-profile-alert--success');
    alertEl.classList.add('alert-error', 'hub-profile-alert--error');
    alertEl.hidden = false;
  }

  function showPhoneSuccess(message) {
    const alertEl = el('alert');
    if (!alertEl) return;
    alertEl.textContent = message;
    alertEl.classList.remove('hidden', 'alert-error', 'hub-profile-alert--error');
    alertEl.classList.add('alert-success', 'hub-profile-alert--success');
    alertEl.hidden = false;
  }

  function resetPhoneVerificationForm() {
    setStepVisible(el('codeStep'), false);
    setStepVisible(el('phoneStep'), true);
    const codeInput = el('codeInput');
    if (codeInput) codeInput.value = '';
    const alertEl = el('alert');
    if (alertEl) {
      alertEl.textContent = '';
      alertEl.classList.add('hidden');
      alertEl.hidden = true;
      alertEl.classList.remove('alert-error', 'alert-success', 'hub-profile-alert--error', 'hub-profile-alert--success');
    }
    confirmationResult = null;
    lastSentE164 = null;
    const sentTo = el('sentTo');
    if (sentTo) {
      sentTo.textContent = '';
      sentTo.classList.add('hidden');
      sentTo.hidden = true;
    }
  }

  function resetRecaptcha() {
    recaptchaSolved = false;
    recaptchaRenderPromise = null;
    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.clear();
      } catch {
        /* ignore */
      }
      recaptchaVerifier = null;
    }
    const container = el('recaptcha');
    if (container) container.replaceChildren();
  }

  async function loadFirebaseAuth() {
    if (firebaseAuth) return firebaseAuth;

    if (!verificationConfig) {
      verificationConfig = await simPhoneApiRequest('phone-verification/config');
    }

    const { firebase } = verificationConfig;
    const { initializeApp, getApps } = await import(
      `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app.js`
    );
    const {
      getAuth,
      RecaptchaVerifier,
      signInWithPhoneNumber,
      signOut,
    } = await import(
      `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-auth.js`
    );

    const app =
      getApps().find((a) => a.name === firebaseAppName) ??
      initializeApp(
        {
          apiKey: firebase.apiKey,
          authDomain: firebase.authDomain,
          projectId: firebase.projectId,
          appId: firebase.appId,
        },
        firebaseAppName
      );
    const auth = getAuth(app);
    auth.languageCode = 'ja';
    firebaseAuth = { auth, RecaptchaVerifier, signInWithPhoneNumber, signOut };
    return firebaseAuth;
  }

  async function ensureRecaptchaWidget() {
    const container = el('recaptcha');
    if (!container || recaptchaVerifier) return;

    const { auth, RecaptchaVerifier } = await loadFirebaseAuth();

    recaptchaVerifier = new RecaptchaVerifier(auth, container, {
      size: 'normal',
      callback: () => {
        recaptchaSolved = true;
      },
      'expired-callback': () => {
        recaptchaSolved = false;
        showPhoneAlert('reCAPTCHA の有効期限が切れました。もう一度チェックしてください。');
        resetRecaptcha();
        void ensureRecaptchaWidget();
      },
    });

    if (!recaptchaRenderPromise) {
      recaptchaRenderPromise = recaptchaVerifier.render().finally(() => {
        recaptchaRenderPromise = null;
      });
    }
    await recaptchaRenderPromise;
  }

  function formatFirebasePhoneError(err) {
    const code = err?.code ?? '';
    const messages = {
      'auth/captcha-check-failed':
        'reCAPTCHA の確認に失敗しました。Chrome の通常ウィンドウで試すか、Cookie を許可してください。',
      'auth/invalid-phone-number': '電話番号の形式が正しくありません（090/080/070 など）。',
      'auth/too-many-requests': '試行回数が多すぎます。しばらく待ってから再度お試しください。',
      'auth/quota-exceeded': 'SMS の送信上限に達しました。管理者に連絡してください。',
      'auth/operation-not-allowed': '電話番号認証が Firebase で有効になっていません。',
      'auth/missing-phone-number': '電話番号を入力してください。',
    };
    if (messages[code]) return messages[code];
    if (/recaptcha/i.test(String(err?.message))) {
      return messages['auth/captcha-check-failed'];
    }
    return err?.message ?? 'SMS の送信に失敗しました';
  }

  async function refreshStatus() {
    const data = await simPhoneApiRequest('phone-verification/status');
    phoneVerificationExpired = Boolean(data.phone?.expired);
    phoneVerified = Boolean(data.phone?.verified);
    return data.phone;
  }

  function open() {
    const modal = el('modal');
    if (!modal) return;
    modal.classList.add(openClass);
    modal.setAttribute('aria-hidden', 'false');
    if (bodyOpenClass) document.body.classList.add(bodyOpenClass);
    resetPhoneVerificationForm();
    ensureRecaptchaWidget().catch((err) => {
      showPhoneAlert(err.message ?? 'reCAPTCHA の読み込みに失敗しました');
    });
  }

  function close() {
    const modal = el('modal');
    modal?.classList.remove(openClass);
    modal?.setAttribute('aria-hidden', 'true');
    if (bodyOpenClass) document.body.classList.remove(bodyOpenClass);
    resetRecaptcha();
  }

  async function recordSmsConsentAttempt(phoneE164) {
    if (!verificationConfig) {
      verificationConfig = await simPhoneApiRequest('phone-verification/config');
    }
    await simPhoneApiRequest('phone-verification/consent', {
      method: 'POST',
      body: JSON.stringify({
        consent_version: verificationConfig.consent_version,
        phone_e164: phoneE164,
      }),
    });
  }

  async function handleResendCode() {
    const now = Date.now();
    if (now < resendCooldownUntil) {
      const sec = Math.ceil((resendCooldownUntil - now) / 1000);
      showPhoneAlert(`再送信は ${sec} 秒後にお試しください`);
      return;
    }
    if (!lastSentE164) {
      showPhoneAlert('先に認証コードを送信してください');
      return;
    }

    resetRecaptcha();
    await ensureRecaptchaWidget();
    if (!recaptchaSolved) {
      showPhoneAlert('再送信の前に reCAPTCHA にチェックしてください');
      return;
    }

    await recordSmsConsentAttempt(lastSentE164);

    const { auth, signInWithPhoneNumber } = await loadFirebaseAuth();
    const resendBtn = el('resendBtn');
    if (resendBtn) resendBtn.disabled = true;

    try {
      confirmationResult = await signInWithPhoneNumber(auth, lastSentE164, recaptchaVerifier);
      resendCooldownUntil = Date.now() + 60_000;
      showPhoneSuccess('認証コードを再送信しました。');
    } catch (err) {
      resetRecaptcha();
      await ensureRecaptchaWidget();
      throw new Error(formatFirebasePhoneError(err));
    } finally {
      if (resendBtn) resendBtn.disabled = false;
    }
  }

  async function handleSendCode() {
    const consent = el('consent');
    if (!consent?.checked) {
      showPhoneAlert('SMS 送信に同意してください');
      return;
    }

    if (!verificationConfig) {
      verificationConfig = await simPhoneApiRequest('phone-verification/config');
    }

    const e164 = normalizeJapanPhoneInput(el('number')?.value ?? '');
    if (!e164) {
      showPhoneAlert('日本国内の携帯電話番号（090/080/070 など）を入力してください');
      return;
    }

    await recordSmsConsentAttempt(e164);

    if (!recaptchaVerifier || !recaptchaSolved) {
      showPhoneAlert('送信の前に「私はロボットではありません」にチェックしてください');
      if (!recaptchaVerifier) await ensureRecaptchaWidget();
      return;
    }

    const { auth, signInWithPhoneNumber } = await loadFirebaseAuth();
    const sendBtn = el('sendBtn');
    if (sendBtn) sendBtn.disabled = true;

    try {
      confirmationResult = await signInWithPhoneNumber(auth, e164, recaptchaVerifier);
      lastSentE164 = e164;
      resendCooldownUntil = Date.now() + 60_000;
      const sentTo = el('sentTo');
      if (sentTo) {
        sentTo.textContent = `送信先: ${maskJapanE164(e164)}`;
        sentTo.classList.remove('hidden');
        sentTo.hidden = false;
      }
      showPhoneSuccess('認証コードを送信しました。');
      setStepVisible(el('phoneStep'), false);
      setStepVisible(el('codeStep'), true);
      el('codeInput')?.focus();
    } catch (err) {
      resetRecaptcha();
      await ensureRecaptchaWidget();
      throw new Error(formatFirebasePhoneError(err));
    } finally {
      if (sendBtn) sendBtn.disabled = false;
    }
  }

  async function handleConfirmCode() {
    if (!confirmationResult) {
      showPhoneAlert('先に SMS を送信してください');
      return;
    }

    const code = el('codeInput')?.value?.trim() ?? '';
    if (!code) {
      showPhoneAlert('認証コードを入力してください');
      return;
    }

    if (!verificationConfig) {
      verificationConfig = await simPhoneApiRequest('phone-verification/config');
    }

    const credential = await confirmationResult.confirm(code);
    const idToken = await credential.user.getIdToken();

    try {
      await simPhoneApiRequest('phone-verification/complete', {
        method: 'POST',
        body: JSON.stringify({
          id_token: idToken,
          consent_version: verificationConfig.consent_version,
        }),
      });
    } finally {
      const { auth, signOut } = await loadFirebaseAuth();
      await signOut(auth).catch(() => {});
      resetRecaptcha();
    }

    phoneVerified = true;
    phoneVerificationExpired = false;
    close();
    await refreshStatus();
    if (options.onVerified) await options.onVerified();
  }

  function init() {
    el('close')?.addEventListener('click', close);
    el('backdrop')?.addEventListener('click', close);
    el('sendBtn')?.addEventListener('click', () => {
      handleSendCode().catch((err) => showPhoneAlert(err.message ?? 'SMS の送信に失敗しました'));
    });
    el('codeForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      handleConfirmCode().catch((err) => showPhoneAlert(err.message ?? '認証に失敗しました'));
    });
    el('resendBtn')?.addEventListener('click', () => {
      handleResendCode().catch((err) => showPhoneAlert(err.message ?? '再送信に失敗しました'));
    });
    el('backBtn')?.addEventListener('click', () => {
      resetPhoneVerificationForm();
      resetRecaptcha();
      ensureRecaptchaWidget().catch((err) => {
        showPhoneAlert(err.message ?? 'reCAPTCHA の読み込みに失敗しました');
      });
    });
  }

  return {
    init,
    open,
    close,
    refreshStatus,
    isVerified: () => phoneVerified,
    isExpired: () => phoneVerificationExpired,
  };
}
