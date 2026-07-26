// public/apps/simulation-request/js/phone-verification.js
import { createSimPhoneVerification, normalizeJapanPhoneInput } from '/js/sim-phone-verification-core.js';

export { normalizeJapanPhoneInput };

const SIM_IDS = {
  modal: 'phone-verification-modal',
  close: 'phone-verification-close',
  alert: 'phone-verification-alert',
  phoneStep: 'phone-verify-phone-step',
  codeStep: 'phone-verify-code-step',
  number: 'phone-verify-number',
  consent: 'phone-sms-consent',
  recaptcha: 'recaptcha-container',
  sendBtn: 'phone-send-code-btn',
  sentTo: 'phone-verify-sent-to',
  resendBtn: 'phone-resend-code-btn',
  codeForm: 'phone-verify-code-form',
  codeInput: 'phone-verify-code-input',
  backBtn: 'phone-verify-back-btn',
};

const phoneFlow = createSimPhoneVerification(SIM_IDS, {
  openClass: 'open',
  firebaseAppName: 'sim-request-phone',
  onVerified: async () => {
    applyPhoneVerificationUi();
  },
});

/** Returns whether the user has completed sim phone verification. */
export function isSimPhoneVerified() {
  return phoneFlow.isVerified();
}

/** Refreshes verification status from the API. */
export async function refreshPhoneVerificationStatus() {
  return phoneFlow.refreshStatus();
}

/** Opens the phone verification modal. */
export function openPhoneVerificationModal() {
  phoneFlow.open();
}

/** Closes the phone verification modal. */
export function closePhoneVerificationModal() {
  phoneFlow.close();
}

/** Blocks FDS submit when phone is not verified. */
export function ensureSimPhoneVerified() {
  if (phoneFlow.isVerified()) return true;
  openPhoneVerificationModal();
  return false;
}

/** Updates banner and form disabled state from verification status. */
export function applyPhoneVerificationUi() {
  const banner = document.getElementById('phone-verification-banner');
  const intro = document.getElementById('phone-verification-banner-intro');
  const panel = document.getElementById('fds-request-panel');
  const openBtn = document.getElementById('phone-verification-open-btn');
  const phoneVerified = phoneFlow.isVerified();
  const phoneVerificationExpired = phoneFlow.isExpired();

  if (intro) {
    if (phoneVerificationExpired) {
      intro.textContent =
        '電話番号の認証の有効期限（1年）が切れています。FDS 依頼の前に再度 SMS 認証してください（日本国内番号のみ）。';
    } else {
      intro.innerHTML =
        'FDS 依頼の前に携帯電話番号の SMS 認証が必要です（日本国内番号のみ）。認証の有効期限は <strong>1年</strong>で、期限後は再認証が必要です。';
    }
  }

  if (banner) {
    banner.classList.toggle('hidden', phoneVerified);
  }
  if (openBtn) {
    openBtn.classList.toggle('hidden', phoneVerified);
    openBtn.textContent = phoneVerificationExpired ? '電話番号を再認証する' : '電話番号を認証する';
  }
  if (panel) {
    panel.classList.toggle('fds-panel--locked', !phoneVerified);
  }
}

/** Initializes modal handlers and loads status. */
export async function initPhoneVerification() {
  if (window.location.protocol === 'https:' && window.location.port === '443') {
    const target = `https://${window.location.hostname}${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.location.replace(target);
    return;
  }

  phoneFlow.init();

  document.getElementById('phone-verification-open-btn')?.addEventListener('click', () => {
    openPhoneVerificationModal();
  });

  try {
    await refreshPhoneVerificationStatus();
  } catch {
    /* ignore */
  }
  applyPhoneVerificationUi();
}
