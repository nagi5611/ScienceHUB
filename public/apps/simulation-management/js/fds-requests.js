// public/apps/simulation-management/js/fds-requests.js
import { apiRequest } from '../../simulation-request/js/api.js';
import {
  mountFdsRequestChat,
  isFdsRequestChatAvailable,
  canStaffReplaceFdsInputStatus,
} from '../../simulation-request/js/fds-request-chat.js';

const STATUS_LABELS = {
  format_failed: '形式審査で却下',
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
function mountExpandedAdminChats(rows, { preserveExisting = false } = {}) {
  const activeIds = new Set();

  for (const row of rows) {
    if (!expandedAdminRequestIds.has(row.id) || !isFdsRequestChatAvailable(row.status)) continue;
    activeIds.add(row.id);

    const mount = document.querySelector(
      `.fds-request-admin-chat-mount[data-request-id="${CSS.escape(row.id)}"]`
    );
    if (!mount) continue;

    if (preserveExisting && adminChatDestroyers.has(row.id) && mount.querySelector('.fds-chat-panel')) {
      continue;
    }

    adminChatDestroyers.get(row.id)?.();
    adminChatDestroyers.delete(row.id);

    const destroy = mountFdsRequestChat(mount, {
      requestId: row.id,
      apiPrefix: 'admin/fds-requests',
      isStaff: true,
      canReplaceInput: canStaffReplaceFdsInputStatus(row.status),
      requestStatus: row.status,
    });
    adminChatDestroyers.set(row.id, destroy);
  }

  for (const [id, destroy] of adminChatDestroyers.entries()) {
    if (!activeIds.has(id)) {
      destroy?.();
      adminChatDestroyers.delete(id);
    }
  }
}

/** Returns whether the admin queue DOM can be updated in place. */
function canUpdateAdminRequestQueueInPlace(rows) {
  const mount = document.getElementById('fds-requests-queue-mount');
  const list = mount?.querySelector('.fds-request-admin-list');
  if (!list) return false;

  const existingIds = [...list.querySelectorAll('.fds-request-admin-item[data-request-id]')].map((el) =>
    el.getAttribute('data-request-id')
  );
  const rowIds = rows.map((row) => row.id);
  if (existingIds.length !== rowIds.length) return false;
  return existingIds.every((id, index) => id === rowIds[index]);
}

/** Replaces admin detail panel while preserving mounted chat DOM. */
function replaceAdminRequestDetailPreservingChat(listItem, row) {
  const expanded = expandedAdminRequestIds.has(row.id);
  const detail = listItem.querySelector('.fds-request-admin-detail');
  const existingChatMount = detail?.querySelector('.fds-request-admin-chat-mount');
  const chatPreserve =
    existingChatMount && adminChatDestroyers.has(row.id) ? existingChatMount : null;

  if (!expanded) {
    detail?.remove();
    if (adminChatDestroyers.has(row.id)) {
      adminChatDestroyers.get(row.id)?.();
      adminChatDestroyers.delete(row.id);
    }
    return;
  }

  const tmp = document.createElement('div');
  tmp.innerHTML = renderAdminRequestDetail(row);
  const newDetail = tmp.firstElementChild;
  if (!newDetail) return;

  if (chatPreserve) {
    const newChatMount = newDetail.querySelector('.fds-request-admin-chat-mount');
    if (newChatMount) {
      newChatMount.replaceWith(chatPreserve);
    }
  }

  if (detail) {
    detail.replaceWith(newDetail);
    return;
  }

  listItem.querySelector('.fds-request-admin-toggle')?.insertAdjacentElement('afterend', newDetail);
}

/** Binds admin queue action buttons. */
function bindAdminRequestQueueActions(mount) {
  mount.querySelectorAll('.fds-request-admin-toggle').forEach((btn) => {
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
}

/** Updates admin queue rows without remounting chat panels. */
function updateAdminRequestQueueInPlace(rows) {
  const mount = document.getElementById('fds-requests-queue-mount');
  if (!mount) return;

  for (const row of rows) {
    const listItem = mount.querySelector(
      `.fds-request-admin-item[data-request-id="${CSS.escape(row.id)}"]`
    );
    if (!listItem) return;

    const expanded = expandedAdminRequestIds.has(row.id);
    listItem.className = `fds-request-admin-item${expanded ? ' is-expanded' : ''}`;

    const statusEl = listItem.querySelector('.fds-request-status');
    if (statusEl) {
      statusEl.textContent = STATUS_LABELS[row.status] ?? row.status;
    }

    const toggle = listItem.querySelector('.fds-request-admin-toggle');
    toggle?.setAttribute('aria-expanded', expanded ? 'true' : 'false');

    replaceAdminRequestDetailPreservingChat(listItem, row);
  }

  bindAdminRequestQueueActions(mount);
  mountExpandedAdminChats(rows, { preserveExisting: true });
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
  renderFdsRequestQueue().catch(() => {});
}

/** Renders expanded detail panel for an admin queue item. */
function renderAdminRequestDetail(row) {
  const canApprove = row.status === 'pending_approval';
  const canReplace = canStaffReplaceFdsInputStatus(row.status);
  const chatAvailable = isFdsRequestChatAvailable(row.status);

  return `
    <div class="fds-request-admin-detail">
      ${row.review_message ? `<p class="hint">却下理由: ${escapeHtml(row.review_message)}</p>` : ''}
      <div class="fds-request-admin-actions">
        <a class="btn btn-secondary btn-sm" href="/api/simulation/admin/fds-requests/${escapeHtml(row.id)}/input/download" download>入力 .fds をダウンロード</a>
        ${
          canApprove
            ? `<button type="button" class="btn btn-primary btn-sm" data-action="approve">認可して実行</button>
               <button type="button" class="btn btn-secondary btn-sm" data-action="reject">却下</button>`
            : ''
        }
      </div>
      ${
        chatAvailable
          ? `<div class="fds-request-admin-chat-mount" data-request-id="${escapeHtml(row.id)}"></div>`
          : ''
      }
      ${
        !canReplace && row.status === 'approved'
          ? '<p class="hint fds-chat-replace-disabled">承認済みのため .fds の置き換えはできません。</p>'
          : ''
      }
      <div class="fds-request-admin-result" hidden></div>
    </div>
  `;
}

/** Renders the pending FDS request queue. */
export async function renderFdsRequestQueue() {
  const mount = document.getElementById('fds-requests-queue-mount');
  if (!mount) return;

  try {
    const data = await apiRequest('admin/fds-requests');
    const rows = (data.requests ?? []).filter(
      (row) => row.status !== 'approved' && row.status !== 'cancelled'
    );
    if (!rows.length) {
      destroyAllAdminChats();
      mount.innerHTML = '<p class="hint">対応中の依頼はありません。</p>';
      return;
    }

    if (canUpdateAdminRequestQueueInPlace(rows)) {
      updateAdminRequestQueueInPlace(rows);
      return;
    }

    destroyAllAdminChats();

    mount.innerHTML = `
      <ul class="fds-request-admin-list">
        ${rows
          .map((row) => {
            const expanded = expandedAdminRequestIds.has(row.id);
            return `
          <li class="fds-request-admin-item${expanded ? ' is-expanded' : ''}" data-request-id="${escapeHtml(row.id)}">
            <button type="button" class="fds-request-admin-toggle" aria-expanded="${expanded ? 'true' : 'false'}">
              <div class="fds-request-admin-head">
                <strong>${escapeHtml(row.title)}</strong>
                <span class="fds-request-status">${STATUS_LABELS[row.status] ?? row.status}</span>
                <span class="fds-request-admin-chevron" aria-hidden="true">▶</span>
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

    bindAdminRequestQueueActions(mount);
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
    expandedAdminRequestIds.delete(requestId);
    adminChatDestroyers.get(requestId)?.();
    adminChatDestroyers.delete(requestId);
    document.dispatchEvent(new CustomEvent('fds-request-approved'));
    await renderFdsRequestQueue();
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
    expandedAdminRequestIds.delete(requestId);
    adminChatDestroyers.get(requestId)?.();
    adminChatDestroyers.delete(requestId);
    await renderFdsRequestQueue();
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
  window.addEventListener('fds-request-input-replaced', () => {
    renderFdsRequestQueue().catch(() => {});
  });
}
