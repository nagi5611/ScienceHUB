// public/apps/simulation-management/js/fds-requests.js
import { apiRequest } from '../../simulation-request/js/api.js';

const STATUS_LABELS = {
  pending_approval: '二次審査中',
  approved: '承認済み',
  rejected: '却下',
  cancelled: 'キャンセル',
};

/** Formats bytes for display. */
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Escapes HTML text. */
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Renders the pending FDS request queue. */
export async function renderFdsRequestQueue() {
  const mount = document.getElementById('fds-requests-queue-mount');
  if (!mount) return;

  try {
    const data = await apiRequest('admin/fds-requests?pending=1');
    const rows = data.requests ?? [];
    if (!rows.length) {
      mount.innerHTML = '<p class="hint">二次審査待ちの依頼はありません。</p>';
      return;
    }

    mount.innerHTML = `
      <ul class="fds-request-admin-list">
        ${rows
          .map(
            (row) => `
          <li class="fds-request-admin-item" data-request-id="${escapeHtml(row.id)}">
            <div class="fds-request-admin-head">
              <strong>${escapeHtml(row.title)}</strong>
              <span class="fds-request-status">${STATUS_LABELS[row.status] ?? row.status}</span>
            </div>
            <p class="hint">${escapeHtml(row.input_filename)} · ${formatBytes(row.input_size_bytes)}</p>
            <p class="hint">MPI ${row.mpi_processes} · ${escapeHtml(row.ec2_instance_type)} · 最大 ${row.max_runtime_hours} 時間</p>
            ${row.desired_date ? `<p class="hint">希望日: ${escapeHtml(row.desired_date)}</p>` : ''}
            ${row.notes ? `<p class="hint">メモ: ${escapeHtml(row.notes)}</p>` : ''}
            ${row.primary_review_forced && row.primary_review_issues?.length ? `<details class="fds-primary-review-admin-details"><summary>一次審査の指摘（強制申請）</summary><ul class="fds-primary-review-issues">${row.primary_review_issues.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul></details>` : ''}
            ${row.primary_review_passed && !row.primary_review_forced ? `<p class="hint">一次審査: 問題なし（AI）</p>` : ''}
            <p class="hint">依頼日時: ${escapeHtml(row.created_at)}</p>
            <div class="fds-request-admin-actions">
              <a class="btn btn-secondary btn-sm" href="/api/simulation/admin/fds-requests/${escapeHtml(row.id)}/input/download" download>入力 .fds をダウンロード</a>
              <button type="button" class="btn btn-primary btn-sm" data-action="approve">認可して実行</button>
              <button type="button" class="btn btn-secondary btn-sm" data-action="reject">却下</button>
            </div>
            <div class="fds-request-admin-result" hidden></div>
          </li>
        `
          )
          .join('')}
      </ul>
    `;

    mount.querySelectorAll('[data-action="approve"]').forEach((btn) => {
      btn.addEventListener('click', () => handleApprove(btn));
    });
    mount.querySelectorAll('[data-action="reject"]').forEach((btn) => {
      btn.addEventListener('click', () => handleReject(btn));
    });
  } catch (err) {
    mount.innerHTML = `<p class="alert alert-error">${escapeHtml(err.message ?? '読み込みに失敗しました')}</p>`;
  }
}

/** Approves a request and starts EC2 launch. */
async function handleApprove(button) {
  const item = button.closest('[data-request-id]');
  const requestId = item?.getAttribute('data-request-id');
  if (!requestId || !item) return;

  const resultEl = item.querySelector('.fds-request-admin-result');
  button.disabled = true;
  item.querySelector('[data-action="reject"]')?.setAttribute('disabled', 'true');

  if (resultEl) {
    resultEl.hidden = false;
    resultEl.innerHTML = '<p class="hint">承認して EC2 を起動しています…</p>';
  }

  try {
    const data = await apiRequest(`admin/fds-requests/${requestId}/approve`, { method: 'POST' });
    if (resultEl) {
      const steps = (data.launch_steps ?? [])
        .map((s) => `${s.at}: ${s.message}`)
        .join('\n');
      resultEl.innerHTML = `<p class="alert alert-success">承認しました。ジョブ ${escapeHtml(data.job?.id ?? '')} を起動しました。</p>${
        steps ? `<pre class="fds-run-log">${escapeHtml(steps)}</pre>` : ''
      }`;
    }
    item.querySelector('.fds-request-admin-actions')?.remove();
    document.dispatchEvent(new CustomEvent('fds-request-approved'));
  } catch (err) {
    if (resultEl) {
      resultEl.innerHTML = `<p class="alert alert-error">${escapeHtml(err.message ?? '承認に失敗しました')}</p>`;
    }
    button.disabled = false;
    item.querySelector('[data-action="reject"]')?.removeAttribute('disabled');
  }
}

/** Rejects a pending request. */
async function handleReject(button) {
  const item = button.closest('[data-request-id]');
  const requestId = item?.getAttribute('data-request-id');
  if (!requestId || !item) return;

  const message = window.prompt('却下理由（任意）', '') ?? '';
  button.disabled = true;
  item.querySelector('[data-action="approve"]')?.setAttribute('disabled', 'true');

  try {
    await apiRequest(`admin/fds-requests/${requestId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    item.remove();
    const mount = document.getElementById('fds-requests-queue-mount');
    if (mount && !mount.querySelector('.fds-request-admin-item')) {
      mount.innerHTML = '<p class="hint">二次審査待ちの依頼はありません。</p>';
    }
  } catch (err) {
    window.alert(err.message ?? '却下に失敗しました');
    button.disabled = false;
    item.querySelector('[data-action="approve"]')?.removeAttribute('disabled');
  }
}

/** Wires refresh button for the request queue. */
export function initFdsRequestQueue() {
  document.getElementById('fds-requests-refresh-btn')?.addEventListener('click', () => {
    renderFdsRequestQueue().catch(() => {});
  });
  document.addEventListener('fds-request-approved', () => {
    import('./fds-test.js').then((mod) => mod.renderFdsTestPanel?.()).catch(() => {});
  });
}
