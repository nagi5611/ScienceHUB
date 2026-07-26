// public/js/sim-phone-profile.js
/** Formats ISO date for account UI (ja-JP). */
export function formatSimPhoneExpiryDate(iso) {
  if (!iso) return '—';
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return '—';
  return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
}

/** HTML-escapes text for innerHTML snippets. */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function hubVerifyButton(label) {
  return `<button type="button" class="hub-profile-sim-phone-btn" data-hub-phone-verify>${escapeHtml(label)}</button>`;
}

/**
 * Updates a container with sim phone verification status (verified users only).
 * @param {HTMLElement | null} el
 * @param {object | null | undefined} user — /api/auth/profile user
 * @param {{ variant?: 'hub' | 'app' }} options
 */
export function applySimPhoneAccountStatus(el, user, options = {}) {
  if (!el || !user) return;

  const variant = options.variant ?? 'hub';

  if (variant === 'hub') {
    const verified = Boolean(user.sim_phone_verified);
    const expired = Boolean(user.sim_phone_expired);
    const masked = user.sim_phone_masked ?? '';
    const expiresLabel = formatSimPhoneExpiryDate(user.sim_phone_expires_at);

    el.hidden = false;
    el.classList.add('is-visible');

    if (verified) {
      el.innerHTML = `
        <p class="hub-profile-sim-phone hub-profile-sim-phone--ok">
          <strong>電話番号認証（シミュレーション依頼）</strong><br />
          認証済み${masked ? ` — ${escapeHtml(masked)}` : ''}<br />
          <span class="profile-sim-phone-expiry">有効期限: ${escapeHtml(expiresLabel)}まで（1年ごとに再認証）</span>
        </p>
        ${hubVerifyButton('電話番号を再認証する')}`;
      return;
    }

    if (expired) {
      el.innerHTML = `
        <p class="hub-profile-sim-phone hub-profile-sim-phone--warn">
          <strong>電話番号認証（シミュレーション依頼）</strong><br />
          認証の有効期限（1年）が切れています。FDS 依頼の前に再度 SMS 認証してください。
          ${masked ? `<br />前回の番号: ${escapeHtml(masked)}` : ''}
        </p>
        ${hubVerifyButton('電話番号を再認証する')}`;
      return;
    }

    el.innerHTML = `
      <p class="hub-profile-sim-phone hub-profile-sim-phone--pending">
        <strong>電話番号認証（シミュレーション依頼）</strong><br />
        未認証です。FDS シミュレーション依頼には日本国内の携帯電話番号の SMS 認証が必要です（有効期限 1年）。
      </p>
      ${hubVerifyButton('電話番号を認証する')}`;
    return;
  }

  if (!user?.sim_phone_verified) {
    el.hidden = true;
    el.innerHTML = '';
    el.classList.remove('is-visible');
    return;
  }

  const masked = user.sim_phone_masked ?? '';
  const expiresLabel = formatSimPhoneExpiryDate(user.sim_phone_expires_at);
  const className = 'profile-sim-phone-status profile-sim-phone-status--ok';

  el.hidden = false;
  el.classList.add('is-visible');
  el.innerHTML = `
    <p class="${className}">
      <strong>電話番号認証（シミュレーション依頼）</strong><br />
      認証済み${masked ? ` — ${escapeHtml(masked)}` : ''}<br />
      <span class="profile-sim-phone-expiry">有効期限: ${escapeHtml(expiresLabel)}まで（1年ごとに再認証）</span>
    </p>`;
}
