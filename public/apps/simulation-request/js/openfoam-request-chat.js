// public/apps/simulation-request/js/openfoam-request-chat.js

import { apiFormRequest, apiRequest } from './api.js';

const CHAT_ATTACHMENT_MAX_BYTES = 100 * 1024 * 1024;
const CHAT_POLL_MS = 5000;

/** Escapes HTML for safe insertion. */
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Formats byte size for display. */
function formatBytes(bytes) {
  const n = Number(bytes);
  if (!Number.isFinite(n) || n < 0) return '—';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

/** Formats ISO timestamp for chat display. */
function formatChatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Builds attachment HTML for a message. */
function renderAttachment(message) {
  const att = message.attachment;
  if (!att) return '';

  if (att.expired) {
    return `<p class="fds-chat-attachment fds-chat-attachment-expired">📎 ${escapeHtml(att.filename)}（保存期限切れ）</p>`;
  }

  return `<p class="fds-chat-attachment"><a href="${escapeHtml(att.download_url)}" download>📎 ${escapeHtml(att.filename)}</a> <span class="hint">(${formatBytes(att.size_bytes)} · ${formatChatTime(att.expires_at)} まで)</span></p>`;
}

/** Builds one chat message bubble. */
function renderMessage(message) {
  const sideClass = message.is_own ? 'fds-chat-message-own' : 'fds-chat-message-other';
  const roleClass = message.is_staff ? 'fds-chat-message-staff' : 'fds-chat-message-requester';
  const systemClass = message.body.startsWith('[システム]') ? ' fds-chat-message-system' : '';

  return `
    <li class="fds-chat-message ${sideClass} ${roleClass}${systemClass}" data-message-id="${escapeHtml(message.id)}">
      <div class="fds-chat-message-meta">
        <span class="fds-chat-message-author">${escapeHtml(message.sender_display_name)}</span>
        <span class="fds-chat-message-time">${escapeHtml(formatChatTime(message.created_at))}</span>
      </div>
      ${message.body ? `<p class="fds-chat-message-body">${escapeHtml(message.body)}</p>` : ''}
      ${renderAttachment(message)}
    </li>
  `;
}

/** Mounts OpenFOAM request chat UI into a container. */
export function mountOpenfoamRequestChat(container, options) {
  if (!container) return () => {};

  const {
    requestId,
    apiPrefix,
    isStaff = false,
    canReplaceInput = false,
    requestStatus = null,
  } = options;

  let pollTimer = null;
  let lastMessageId = null;
  let sending = false;
  let destroyed = false;

  container.innerHTML = `
    <div class="fds-chat-panel" data-request-id="${escapeHtml(requestId)}">
      <div class="fds-chat-header">
        <h3 class="fds-chat-title">担当者とのチャット</h3>
        <p class="hint fds-chat-hint">OpenFOAM ケースや実行条件について相談できます。添付は最大 100MB・7 日間保存。</p>
      </div>
      <ul class="fds-chat-messages" aria-live="polite"></ul>
      <div class="fds-chat-compose">
        <textarea class="fds-chat-input" rows="3" maxlength="4000" placeholder="メッセージを入力…"></textarea>
        <div class="fds-chat-compose-actions">
          <label class="fds-chat-file-label btn btn-secondary btn-sm">
            ファイル添付
            <input type="file" class="fds-chat-file-input" hidden />
          </label>
          <span class="hint fds-chat-file-name"></span>
          <button type="button" class="btn btn-primary btn-sm fds-chat-send-btn">送信</button>
        </div>
      </div>
      ${
        isStaff && canReplaceInput
          ? `<div class="fds-chat-replace-input">
              <p class="fds-chat-replace-label">依頼の入力 .zip を置き換え</p>
              <div class="fds-chat-replace-actions">
                <label class="btn btn-secondary btn-sm">
                  .zip を選択
                  <input type="file" class="fds-chat-replace-file" accept=".zip,application/zip" hidden />
                </label>
                <span class="hint fds-chat-replace-file-name"></span>
                <button type="button" class="btn btn-primary btn-sm fds-chat-replace-btn">置き換えて一次審査を再実行</button>
              </div>
              <p class="hint">承認前のみ可能です。置き換え後、AI 一次審査が自動で再実行されます。</p>
            </div>`
          : isStaff && requestStatus === 'approved'
            ? `<p class="hint fds-chat-replace-disabled">承認済みのため入力 .zip の置き換えはできません。</p>`
            : ''
      }
      <p class="alert alert-error fds-chat-error hidden"></p>
    </div>
  `;

  const messagesEl = container.querySelector('.fds-chat-messages');
  const inputEl = container.querySelector('.fds-chat-input');
  const fileInputEl = container.querySelector('.fds-chat-file-input');
  const fileNameEl = container.querySelector('.fds-chat-file-name');
  const sendBtn = container.querySelector('.fds-chat-send-btn');
  const errorEl = container.querySelector('.fds-chat-error');
  const replaceFileEl = container.querySelector('.fds-chat-replace-file');
  const replaceFileNameEl = container.querySelector('.fds-chat-replace-file-name');
  const replaceBtn = container.querySelector('.fds-chat-replace-btn');

  /** Shows or hides chat error text. */
  function showError(message) {
    if (!errorEl) return;
    if (!message) {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
      return;
    }
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
  }

  /** Scrolls message list to bottom. */
  function scrollToBottom() {
    if (!messagesEl) return;
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  /** Loads messages from API. */
  async function loadMessages(initial = false) {
    if (destroyed) return;
    try {
      const params = lastMessageId && !initial ? `?after=${encodeURIComponent(lastMessageId)}` : '';
      const data = await apiRequest(`${apiPrefix}/${requestId}/messages${params}`);
      const incoming = data.messages ?? [];
      if (!incoming.length) return;

      if (initial) {
        messagesEl.innerHTML = incoming.map(renderMessage).join('');
      } else {
        const existingIds = new Set(
          [...messagesEl.querySelectorAll('[data-message-id]')].map((el) => el.getAttribute('data-message-id'))
        );
        for (const message of incoming) {
          if (existingIds.has(message.id)) continue;
          messagesEl.insertAdjacentHTML('beforeend', renderMessage(message));
        }
      }

      lastMessageId = incoming[incoming.length - 1]?.id ?? lastMessageId;
      scrollToBottom();
      showError('');
    } catch {
      if (initial) {
        messagesEl.innerHTML = '<li class="hint">チャットの読み込みに失敗しました。</li>';
      }
    }
  }

  /** Sends a chat message. */
  async function sendMessage() {
    if (sending || !inputEl) return;
    const body = inputEl.value.trim();
    const file = fileInputEl?.files?.[0] ?? null;

    if (!body && !file) {
      showError('メッセージまたはファイルを指定してください');
      return;
    }
    if (file && file.size > CHAT_ATTACHMENT_MAX_BYTES) {
      showError('添付ファイルは 100MB 以下にしてください');
      return;
    }

    sending = true;
    sendBtn.disabled = true;
    showError('');

    try {
      const formData = new FormData();
      if (body) formData.set('body', body);
      if (file) formData.set('file', file);

      await apiFormRequest(`${apiPrefix}/${requestId}/messages`, formData);
      inputEl.value = '';
      if (fileInputEl) fileInputEl.value = '';
      if (fileNameEl) fileNameEl.textContent = '';
      await loadMessages(false);
    } catch (err) {
      showError(err.message ?? '送信に失敗しました');
    } finally {
      sending = false;
      sendBtn.disabled = false;
    }
  }

  /** Replaces request input .zip (staff only). */
  async function replaceInput() {
    const file = replaceFileEl?.files?.[0];
    if (!file) {
      showError('.zip ファイルを選択してください');
      return;
    }
    if (!/\.zip$/i.test(file.name)) {
      showError('.zip ファイルを選択してください');
      return;
    }

    if (
      !window.confirm(
        '依頼の入力 .zip を置き換え、一次審査を再実行します。よろしいですか？'
      )
    ) {
      return;
    }

    replaceBtn.disabled = true;
    showError('');

    try {
      const formData = new FormData();
      formData.set('file', file);
      await apiFormRequest(`${apiPrefix}/${requestId}/replace-input`, formData);
      if (replaceFileEl) replaceFileEl.value = '';
      if (replaceFileNameEl) replaceFileNameEl.textContent = '';
      await loadMessages(false);
      showError('');
      window.dispatchEvent(
        new CustomEvent('openfoam-request-input-replaced', { detail: { requestId } })
      );
    } catch (err) {
      showError(err.message ?? '置き換えに失敗しました');
    } finally {
      replaceBtn.disabled = false;
    }
  }

  fileInputEl?.addEventListener('change', () => {
    const file = fileInputEl.files?.[0];
    if (fileNameEl) {
      fileNameEl.textContent = file ? `${file.name} (${formatBytes(file.size)})` : '';
    }
  });

  replaceFileEl?.addEventListener('change', () => {
    const file = replaceFileEl.files?.[0];
    if (replaceFileNameEl) {
      replaceFileNameEl.textContent = file ? file.name : '';
    }
  });

  sendBtn?.addEventListener('click', () => {
    sendMessage().catch(() => {});
  });

  inputEl?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      sendMessage().catch(() => {});
    }
  });

  replaceBtn?.addEventListener('click', () => {
    replaceInput().catch(() => {});
  });

  loadMessages(true).catch(() => {});
  pollTimer = window.setInterval(() => {
    loadMessages(false).catch(() => {});
  }, CHAT_POLL_MS);

  return () => {
    destroyed = true;
    if (pollTimer) window.clearInterval(pollTimer);
    container.innerHTML = '';
  };
}

/** Returns whether chat is available for a request status. */
export function isOpenfoamRequestChatAvailable(status) {
  return status !== 'cancelled';
}

/** Returns whether staff can replace input for a request status. */
export function canStaffReplaceOpenfoamInputStatus(status) {
  return (
    status === 'primary_reviewing' ||
    status === 'primary_failed' ||
    status === 'primary_error' ||
    status === 'pending_approval' ||
    status === 'rejected'
  );
}
