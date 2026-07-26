// public/apps/simulation-management/js/phone-verification-admin.js
import { apiRequest } from '../../simulation-request/js/api.js';

/** Escapes HTML text. */
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Formats ISO date for admin list (ja-JP). */
function formatDate(iso) {
  if (!iso) return '—';
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return '—';
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Returns status label for a user row. */
function statusLabel(row) {
  if (row.verified) return '<span class="sim-phone-admin-status sim-phone-admin-status--ok">有効</span>';
  if (row.expired) return '<span class="sim-phone-admin-status sim-phone-admin-status--expired">期限切れ</span>';
  return '<span class="sim-phone-admin-status sim-phone-admin-status--none">未認証</span>';
}

let phoneAdminInitialized = false;

/** Binds refresh control once. */
export function initPhoneVerificationAdminPanel() {
  if (phoneAdminInitialized) return;
  phoneAdminInitialized = true;
  document.getElementById('sim-phone-admin-refresh-btn')?.addEventListener('click', () => {
    renderPhoneVerificationAdminPanel();
  });
}

/** Loads and renders users with sim phone verification records. */
export async function renderPhoneVerificationAdminPanel() {
  const mount = document.getElementById('sim-phone-admin-mount');
  const alertEl = document.getElementById('sim-phone-admin-alert');
  if (!mount) return;

  if (alertEl) {
    alertEl.textContent = '';
    alertEl.hidden = true;
    alertEl.classList.add('hidden');
  }

  mount.innerHTML = '<p class="hint">読み込み中...</p>';

  try {
    const data = await apiRequest('admin/phone-verifications');
    const users = data.users ?? [];

    if (!users.length) {
      mount.innerHTML =
        '<p class="hint">電話認証の記録があるユーザーはいません。</p>';
      return;
    }

    mount.innerHTML = `
      <div class="sim-phone-admin-table-wrap">
        <table class="sim-phone-admin-table">
          <thead>
            <tr>
              <th scope="col">ユーザー</th>
              <th scope="col">メール</th>
              <th scope="col">電話番号</th>
              <th scope="col">状態</th>
              <th scope="col">認証日時</th>
              <th scope="col">有効期限</th>
              <th scope="col">操作</th>
            </tr>
          </thead>
          <tbody>
            ${users
              .map(
                (row) => `
              <tr data-user-id="${escapeHtml(row.user_id)}">
                <td>
                  <span class="sim-phone-admin-user-name">${escapeHtml(row.display_name || row.username)}</span>
                  <span class="sim-phone-admin-user-meta">@${escapeHtml(row.username)}</span>
                </td>
                <td>${escapeHtml(row.email || '—')}</td>
                <td>${escapeHtml(row.phone_masked || '—')}</td>
                <td>${statusLabel(row)}</td>
                <td>${escapeHtml(formatDate(row.verified_at))}</td>
                <td>${escapeHtml(formatDate(row.expires_at))}</td>
                <td>
                  <button type="button" class="btn btn-secondary btn-sm sim-phone-revoke-btn" data-user-id="${escapeHtml(row.user_id)}" data-user-label="${escapeHtml(row.display_name || row.username)}">
                    認証を取り消す
                  </button>
                </td>
              </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>`;

    mount.querySelectorAll('.sim-phone-revoke-btn').forEach((btn) => {
      btn.addEventListener('click', () => handleRevokePhoneVerification(btn, alertEl));
    });
  } catch (err) {
    mount.innerHTML = '';
    if (alertEl) {
      alertEl.textContent = err.message ?? '一覧の取得に失敗しました';
      alertEl.hidden = false;
      alertEl.classList.remove('hidden');
    }
  }
}

/** Revokes phone verification for one user after confirm. */
async function handleRevokePhoneVerification(btn, alertEl) {
  const userId = btn.getAttribute('data-user-id');
  const label = btn.getAttribute('data-user-label') || userId;
  if (!userId) return;

  const ok = window.confirm(
    `「${label}」の電話番号認証を取り消しますか？\n\n登録済みの電話番号と認証日時が削除され、FDS 依頼前に再度 SMS 認証が必要になります。`
  );
  if (!ok) return;

  btn.disabled = true;
  if (alertEl) {
    alertEl.textContent = '';
    alertEl.hidden = true;
    alertEl.classList.add('hidden');
  }

  try {
    await apiRequest(`admin/phone-verifications/${encodeURIComponent(userId)}/revoke`, {
      method: 'POST',
    });
    await renderPhoneVerificationAdminPanel();
    if (alertEl) {
      alertEl.textContent = `${label} の電話認証を取り消しました。`;
      alertEl.classList.remove('alert-error');
      alertEl.classList.add('alert-success');
      alertEl.hidden = false;
      alertEl.classList.remove('hidden');
    }
  } catch (err) {
    if (alertEl) {
      alertEl.textContent = err.message ?? '取り消しに失敗しました';
      alertEl.classList.remove('alert-success');
      alertEl.classList.add('alert-error');
      alertEl.hidden = false;
      alertEl.classList.remove('hidden');
    }
    btn.disabled = false;
  }
}
