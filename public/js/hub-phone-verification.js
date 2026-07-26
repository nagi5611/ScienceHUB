// public/js/hub-phone-verification.js
import { createSimPhoneVerification } from './sim-phone-verification-core.js';

const HUB_IDS = {
  modal: 'hub-phone-verification-modal',
  backdrop: 'hub-phone-verification-backdrop',
  close: 'hub-phone-verification-close',
  alert: 'hub-phone-verification-alert',
  phoneStep: 'hub-phone-verify-phone-step',
  codeStep: 'hub-phone-verify-code-step',
  number: 'hub-phone-verify-number',
  consent: 'hub-phone-sms-consent',
  recaptcha: 'hub-recaptcha-container',
  sendBtn: 'hub-phone-send-code-btn',
  sentTo: 'hub-phone-verify-sent-to',
  resendBtn: 'hub-phone-resend-code-btn',
  codeForm: 'hub-phone-verify-code-form',
  codeInput: 'hub-phone-verify-code-input',
  backBtn: 'hub-phone-verify-back-btn',
};

let hubPhoneFlow = null;
let onVerifiedCallback = null;

/** Initializes hub account phone verification modal. */
export function initHubPhoneVerification({ onVerified } = {}) {
  onVerifiedCallback = onVerified ?? null;
  hubPhoneFlow = createSimPhoneVerification(HUB_IDS, {
    openClass: 'is-open',
    bodyOpenClass: 'hub-modal-open',
    firebaseAppName: 'hub-account-phone',
    onVerified: async () => {
      if (onVerifiedCallback) await onVerifiedCallback();
    },
  });
  hubPhoneFlow.init();
}

/** Opens phone verification from account settings. */
export function openHubPhoneVerificationModal() {
  hubPhoneFlow?.open();
}
