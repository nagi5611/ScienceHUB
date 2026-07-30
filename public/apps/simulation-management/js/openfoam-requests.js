// public/apps/simulation-management/js/openfoam-requests.js
import { apiRequest } from '../../simulation-request/js/api.js';
import {
  mountOpenfoamRequestChat,
  isOpenfoamRequestChatAvailable,
  canStaffReplaceOpenfoamInputStatus,
} from '../../simulation-request/js/openfoam-request-chat.js';

const STATUS_LABELS = {
  primary_reviewing: '一次審査中',
  primary_failed: '一次審査：指摘あり',
  primary_error: '一次審査エラー',
  pending_approval: '二次審査中',
  approved: '承認済み',
  rejected: '却下',
  cancelled: 'キャンセル',
};

const expandedAdminRequestIds = new Set();
const adminChatDestroyers = new Map();

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

/** Destroys mounted admin chat panels. */
function destroyAllAdminChats() {
  for (const destroy of adminChatDestroyers.values()) {
    destroy?.();
  }
  adminChatDestroyers.clear();
}

/** Mounts chat for expanded admin queue items. */
function mountExpandedAdminChats(rows) {
  destroyAllAdminChats();
  for (const row of rows) {
    if (!expandedAdminRequestIds.has(row.id) || !isOpenfoamRequestChatAvailable(row.status)) continue;
    const mount = document.querySelector(
      `.openfoam-request-admin-chat-mount[data-request-id="${CSS.escape(row.id)}"]`
    );
    if (!mount) continue;
    const destroy = mountOpenfoamRequestChat(mount, {
      requestId: row.id,
      apiPrefix: 'admin/openfoam-requests',
      isStaff: true,
      canReplaceInput: canStaffReplaceOpenfoamInputStatus(row.status),
      requestStatus: row.status,
    });
    adminChatDestroyers.set(row.id, destroy);
  }
}

/** Toggles expanded detail for an admin queue item. */
function toggleAdminRequestExpanded(requestId) {
  if (expandedAdminRequestIds.has(requestId)) {
    expandedAdminRequestIds.delete(requestId);
    adminChatDestroyers.get(requestId)?.();
    adminChatDestroyers.delete(requestId);
  } else {
    expandedAdminRequestIds.add(requestId);
  }
  renderOpenfoamRequestQueue().catch(() => {});
}

/** Renders expanded detail panel for an admin queue item. */
function renderAdminRequestDetail(row) {
  const canApprove = row.status === 'pending_approval';
  const canReplace = canStaffReplaceOpenfoamInputStatus(row.status);
  const chatAvailable = isOpenfoamRequestChatAvailable(row.status);

  return `
    <div class="openfoam-request-admin-detail">
      ${row.review_message ? `<p class="hint">却下理由: ${escapeHtml(row.review_message)}</p>` : ''}
      <div class="openfoam-request-admin-actions">
        <a class="btn btn-secondary btn-sm" href="/api/simulation/admin/openfoam-requests/${escapeHtml(row.id)}/input/download" download>入力 ZIP をダウンロード</a>
        ${
          canApprove
            ? `<button type="button" class="btn btn-primary btn-sm" data-action="approve">認可して実行</button>
               <button type="button" class="btn btn-secondary btn-sm" data-action="reject">却下</button>`
            : ''
        }
      </div>
      ${
        chatAvailable
          ? `<div class="openfoam-request-admin-chat-mount" data-request-id="${escapeHtml(row.id)}"></div>`
          : ''
      }
      ${
        !canReplace && row.status === 'approved'
          ? '<p class="hint openfoam-chat-replace-disabled">承認済みのため .openfoam の置き換えはできません。</p>'
          : ''
      }
      <div class="openfoam-request-admin-result" hidden></div>
    </div>
  `;
}

/** Renders the pending OpenFOAM request queue. */
export async function renderOpenfoamRequestQueue() {
  const mount = document.getElementById('openfoam-requests-queue-mount');
  if (!mount) return;

  try {
    const data = await apiRequest('admin/openfoam-requests');
    const rows = (data.requests ?? []).filter(
      (row) => row.status !== 'approved' && row.status !== 'cancelled'
    );
    if (!rows.length) {
      destroyAllAdminChats();
      mount.innerHTML = '<p class="hint">対応中の依頼はありません。</p>';
      return;
    }

    mount.innerHTML = `
      <ul class="openfoam-request-admin-list">
        ${rows
          .map((row) => {
            const expanded = expandedAdminRequestIds.has(row.id);
            return `
          <li class="openfoam-request-admin-item${expanded ? ' is-expanded' : ''}" data-request-id="${escapeHtml(row.id)}">
            <button type="button" class="openfoam-request-admin-toggle" aria-expanded="${expanded ? 'true' : 'false'}">
              <div class="openfoam-request-admin-head">
                <strong>${escapeHtml(row.title)}</strong>
                <span class="openfoam-request-status">${STATUS_LABELS[row.status] ?? row.status}</span>
                <span class="openfoam-request-admin-chevron" aria-hidden="true">▶</span>
              </div>
              <p class="hint">${escapeHtml(row.input_filename)} · ${formatBytes(row.input_size_bytes)}</p>
              <p class="hint">MPI ${row.mpi_processes} · ${escapeHtml(row.ec2_instance_type)} · 最大 ${row.max_runtime_hours} 時間</p>
            </button>
            ${expanded ? renderAdminRequestDetail(row) : ''}
          </li>
        `;
          })
          .join('')}
      </ul>
    `;

    mount.querySelectorAll('.openfoam-request-admin-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.closest('[data-request-id]')?.getAttribute('data-request-id');
        if (id) toggleAdminRequestExpanded(id);
      });
    });

    mount.querySelectorAll('[data-action="approve"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleApprove(btn);
      });
    });
    mount.querySelectorAll('[data-action="reject"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleReject(btn);
      });
    });

    mountExpandedAdminChats(rows);
  } catch (err) {
    mount.innerHTML = `<p class="alert alert-error">${escapeHtml(err.message ?? '読み込みに失敗しました')}</p>`;
  }
}

/** Approves a request and starts EC2 launch. */
async function handleApprove(button) {
  const item = button.closest('[data-request-id]');
  const requestId = item?.getAttribute('data-request-id');
  if (!requestId || !item) return;

  const resultEl = item.querySelector('.openfoam-request-admin-result');
  button.disabled = true;
  item.querySelector('[data-action="reject"]')?.setAttribute('disabled', 'true');

  if (resultEl) {
    resultEl.hidden = false;
    resultEl.innerHTML = '<p class="hint">承認して EC2 を起動しています…</p>';
  }

  try {
    const data = await apiRequest(`admin/openfoam-requests/${requestId}/approve`, { method: 'POST' });
    if (resultEl) {
      const steps = (data.launch_steps ?? [])
        .map((s) => `${s.at}: ${s.message}`)
        .join('\n');
      resultEl.innerHTML = `<p class="alert alert-success">承認しました。ジョブ ${escapeHtml(data.job?.id ?? '')} を起動しました。</p>${
        steps ? `<pre class="openfoam-run-log">${escapeHtml(steps)}</pre>` : ''
      }`;
    }
    item.querySelector('.openfoam-request-admin-actions')?.remove();
    expandedAdminRequestIds.delete(requestId);
    adminChatDestroyers.get(requestId)?.();
    adminChatDestroyers.delete(requestId);
    document.dispatchEvent(new CustomEvent('openfoam-request-approved'));
    await renderOpenfoamRequestQueue();
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
    await apiRequest(`admin/openfoam-requests/${requestId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    expandedAdminRequestIds.delete(requestId);
    adminChatDestroyers.get(requestId)?.();
    adminChatDestroyers.delete(requestId);
    await renderOpenfoamRequestQueue();
  } catch (err) {
    window.alert(err.message ?? '却下に失敗しました');
    button.disabled = false;
    item.querySelector('[data-action="approve"]')?.removeAttribute('disabled');
  }
}

/** Wires refresh button for the request queue. */
export function initOpenfoamRequestQueue() {
  document.getElementById('openfoam-requests-refresh-btn')?.addEventListener('click', () => {
    renderOpenfoamRequestQueue().catch(() => {});
  });
  document.addEventListener('openfoam-request-approved', () => {
    import('./openfoam-test.js').then((mod) => mod.renderOpenfoamTestPanel?.()).catch(() => {});
  });
  window.addEventListener('openfoam-request-input-replaced', () => {
    renderOpenfoamRequestQueue().catch(() => {});
  });
}
