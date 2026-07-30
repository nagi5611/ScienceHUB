// public/apps/simulation-request/js/openfoam-request.js
import { apiFormRequest, apiRequest } from './api.js';
// import { createShiftMiniCalendar } from './shift-mini-calendar.js';
import { setupHomeroomCombobox } from './homeroom.js';
import {
  initPhoneVerification,
  ensureSimPhoneVerified,
  applyPhoneVerificationUi,
} from './phone-verification.js';
import { ensureCanBook } from './sciencehub-auth.js';
import {
  mountFdsRequestChat,
  isFdsRequestChatAvailable,
} from './openfoam-request-chat.js';

const REQUEST_STATUS_LABELS = {
  primary_reviewing: '一次審査中…',
  primary_failed: '一次審査で指摘あり',
  primary_error: '一次審査失敗',
  pending_approval: '二次審査中',
  approved: '承認済み（実行中または完了）',
  rejected: '二次審査：却下',
  cancelled: 'キャンセル',
};

let pendingForceSubmit = null;
let pendingForceRequestId = null;
let expandedRequestIds = new Set();
let requestsPollTimer = null;
let lastSubmittedRequestId = null;

let openfoamConfig = null;
let selectedSimType = null;
const openfoamChatDestroyers = new Map();

/** Returns display label and CSS badge key for a request row. */
function openfoamRequestStatusUi(row) {
  const badge = row.status_badge ?? row.status;
  const label = row.status_display ?? REQUEST_STATUS_LABELS[row.status] ?? row.status;
  return { badge, label };
}

/** Returns whether the request row has an expandable detail panel. */
function requestHasDetailPanel(row) {
  return (
    row.status === 'primary_reviewing' ||
    row.status === 'primary_failed' ||
    row.status === 'primary_error' ||
    row.status === 'pending_approval' ||
    row.status === 'rejected' ||
    row.status === 'approved'
  );
}

/** Shortens a SHA-256 hex string for display. */
function formatSha256Short(hex) {
  if (!hex || hex.length < 16) return hex || '—';
  return `${hex.slice(0, 12)}…${hex.slice(-8)}`;
}

/** Builds HTML for the expandable detail panel under a request row. */
function renderRequestDetailPanel(row) {
  const parts = [];

  if (row.status === 'primary_reviewing') {
    parts.push('<p class="hint">AI が .zip 入力を確認しています。しばらくお待ちください。</p>');
  }

  if (row.primary_review_issues?.length) {
    parts.push(
      `<p class="openfoam-request-detail-label">一次審査の指摘</p><ul class="openfoam-primary-review-issues">${row.primary_review_issues
        .map((issue) => `<li>${escapeHtml(issue)}</li>`)
        .join('')}</ul>`
    );
  }

  if (row.primary_review_error) {
    parts.push(
      `<p class="openfoam-request-detail-label">一次審査エラー</p><p class="alert alert-error openfoam-request-detail-error">${escapeHtml(row.primary_review_error)}</p>`
    );
  }

  if (row.status === 'rejected' && row.review_message) {
    parts.push(
      `<p class="openfoam-request-detail-label">二次審査（却下理由）</p><p class="hint">${escapeHtml(row.review_message)}</p>`
    );
  }

  if (row.status === 'pending_approval') {
    parts.push(
      '<p class="hint">担当者の承認後にシミュレーションが実行されます。</p>'
    );
  }

  if (row.execution_failure_message) {
    parts.push(
      `<p class="openfoam-request-detail-label">実行結果の説明</p><p class="alert alert-error openfoam-request-detail-error">${escapeHtml(row.execution_failure_message)}</p>`
    );
  }

  if (row.status === 'approved') {
    const repro = [];
    if (row.input_sha256) {
      repro.push(`入力 SHA-256: <code>${escapeHtml(formatSha256Short(row.input_sha256))}</code>`);
    }
    if (row.output_sha256) {
      repro.push(`出力 SHA-256: <code>${escapeHtml(formatSha256Short(row.output_sha256))}</code>`);
    }
    if (row.zip_solver_version) {
      repro.push(`OpenFOAM: ${escapeHtml(row.zip_solver_version)}`);
    }
    if (row.zip_ami_id) {
      repro.push(`AMI: <code>${escapeHtml(row.zip_ami_id)}</code>`);
    }
    if (row.ec2_instance_type) {
      repro.push(`インスタンス: ${escapeHtml(row.ec2_instance_type)} · MPI ${row.mpi_processes}`);
    }
    if (row.job_launched_at || row.job_finished_at) {
      repro.push(
        `実行: ${escapeHtml(row.job_launched_at ?? '—')} 〜 ${escapeHtml(row.job_finished_at ?? '—')}`
      );
    }
    if (repro.length) {
      parts.push(
        `<p class="openfoam-request-detail-label">再現性情報</p><ul class="openfoam-primary-review-issues">${repro
          .map((line) => `<li>${line}</li>`)
          .join('')}</ul>`
      );
    }

    if (row.has_output_download) {
      parts.push(
        `<p class="openfoam-request-detail-actions"><a class="btn btn-primary btn-sm" href="/api/simulation/openfoam-requests/${escapeHtml(row.id)}/output/download" download>結果 ZIP をダウンロード</a></p>`
      );
    }

    if (row.can_rerun) {
      parts.push(
        `<p class="openfoam-request-detail-actions"><button type="button" class="btn btn-secondary btn-sm openfoam-rerun-btn" data-request-id="${escapeHtml(row.id)}">同条件で再依頼</button></p>`
      );
    }
  }

  if (row.primary_review_model) {
    parts.push(`<p class="hint">一次審査モデル: ${escapeHtml(row.primary_review_model)}</p>`);
  }

  appendPrimaryReviewActions(parts, row);

  if (isFdsRequestChatAvailable(row.status)) {
    parts.push(
      `<div class="openfoam-request-chat-mount" data-request-id="${escapeHtml(row.id)}" data-request-status="${escapeHtml(row.status)}"></div>`
    );
  }

  if (!parts.length) {
    parts.push('<p class="hint">詳細情報はありません。</p>');
  }

  return `<div class="openfoam-request-detail-panel">${parts.join('')}</div>`;
}

/** Returns how many primary review attempts remain for this request. */
function primaryReviewAttemptsRemaining(row) {
  const max = row.primary_review_max_attempts ?? openfoamConfig?.primary_review_max_attempts ?? 3;
  const used = row.primary_review_attempt_count ?? 0;
  return Math.max(0, max - used);
}

/** Appends primary-review retry / limit hints and action buttons to a detail panel. */
function appendPrimaryReviewActions(parts, row) {
  if (row.status !== 'primary_failed' && row.status !== 'primary_error') return;

  const max = row.primary_review_max_attempts ?? openfoamConfig?.primary_review_max_attempts ?? 3;
  const used = row.primary_review_attempt_count ?? 0;
  parts.push(
    `<p class="hint openfoam-primary-attempts-hint">一次審査: ${used} / ${max} 回実施済み</p>`
  );

  if (row.primary_review_can_retry) {
    const remaining = primaryReviewAttemptsRemaining(row);
    parts.push(
      `<p class="hint">あと ${remaining} 回まで修正ファイルで再審できます。</p>`,
      `<button type="button" class="btn btn-primary btn-sm openfoam-retry-primary-btn" data-request-id="${escapeHtml(row.id)}">修正ファイルで再審</button>`
    );
  } else {
    parts.push(
      '<p class="hint">再審の上限に達しました。二次審査へ強制申請するか、新しい依頼を作成してください。</p>'
    );
  }

  parts.push(
    `<button type="button" class="btn btn-secondary btn-sm openfoam-force-secondary-list-btn" data-request-id="${escapeHtml(row.id)}">二次審査へ強制申請する</button>`
  );
}

/** Stops polling the request list. */
function stopRequestsPoll() {
  if (requestsPollTimer) {
    window.clearInterval(requestsPollTimer);
    requestsPollTimer = null;
  }
}

/** Polls the request list while primary review or OpenFOAM execution is in progress. */
function startRequestsPollIfNeeded(rows) {
  const needsPoll = (rows ?? []).some((r) => {
    if (r.status === 'primary_reviewing') return true;
    if (r.status !== 'approved') return false;
    if (!r.zip_job_id) return true;
    const jobStatus = r.zip_job_status;
    if (!jobStatus) return true;
    return jobStatus === 'pending' || jobStatus === 'launching' || jobStatus === 'running';
  });
  if (!needsPoll) {
    stopRequestsPoll();
    return;
  }
  if (requestsPollTimer) return;
  requestsPollTimer = window.setInterval(() => {
    renderMyOpenfoamRequests().catch(() => {});
  }, 2500);
}

/** Destroys all mounted OpenFOAM chat panels. */
function destroyAllOpenfoamChats() {
  for (const destroy of openfoamChatDestroyers.values()) {
    destroy?.();
  }
  openfoamChatDestroyers.clear();
}

/** Mounts chat panels for currently expanded request rows. */
function mountExpandedOpenfoamChats(rows) {
  destroyAllOpenfoamChats();
  for (const row of rows) {
    if (!expandedRequestIds.has(row.id) || !isFdsRequestChatAvailable(row.status)) continue;
    const mount = document.querySelector(
      `.openfoam-request-chat-mount[data-request-id="${CSS.escape(row.id)}"]`
    );
    if (!mount) continue;
    const destroy = mountFdsRequestChat(mount, {
      requestId: row.id,
      apiPrefix: 'openfoam-requests',
      isStaff: false,
      canReplaceInput: false,
      requestStatus: row.status,
    });
    openfoamChatDestroyers.set(row.id, destroy);
  }
}

/** Toggles expanded detail for a request row. */
function toggleRequestExpanded(requestId) {
  if (expandedRequestIds.has(requestId)) {
    expandedRequestIds.delete(requestId);
    openfoamChatDestroyers.get(requestId)?.();
    openfoamChatDestroyers.delete(requestId);
  } else {
    expandedRequestIds.add(requestId);
  }
  renderMyOpenfoamRequests().catch(() => {});
}

/** Prompts for a .zip file and retries primary review for a request. */
function promptOpenfoamRetryPrimaryFile(requestId) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.zip';
  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (file) retryOpenfoamPrimaryWithFile(requestId, file);
  });
  input.click();
}

/** POSTs a revised .zip for primary re-review. */
async function retryOpenfoamPrimaryWithFile(requestId, file) {
  if (!/\.zip$/i.test(file.name)) {
    showToast('.zip ファイルのみ選択できます', true);
    return;
  }
  if (!ensureCanBook()) return;
  if (!ensureSimPhoneVerified()) return;

  const formData = new FormData();
  formData.set('file', file);

  setPrimaryReviewOverlay(true, '再審を送信中…');
  try {
    await apiFormRequest(`openfoam-requests/${encodeURIComponent(requestId)}/retry-primary`, formData);
    lastSubmittedRequestId = requestId;
    expandedRequestIds.add(requestId);
    showToast('再審を受け付けました。結果は「自分の依頼」に表示されます。');
    await renderMyOpenfoamRequests();
  } catch (err) {
    showToast(err.message ?? '再審の送信に失敗しました', true);
  } finally {
    setPrimaryReviewOverlay(false);
  }
}

/** Submits force-secondary for an existing primary_failed request. */
async function forceOpenfoamSecondaryById(requestId) {
  if (!ensureCanBook()) return;
  if (!ensureSimPhoneVerified()) return;

  setPrimaryReviewOverlay(true, '二次審査へ申請中…');
  try {
    await apiRequest(`openfoam-requests/${encodeURIComponent(requestId)}/force-secondary`, {
      method: 'POST',
    });
    hidePrimaryReviewBlock();
    pendingForceSubmit = null;
    pendingForceRequestId = null;
    showToast('二次審査へ申請しました。担当者の確認後にシミュレーションが開始されます。');
    await renderMyOpenfoamRequests();
  } catch (err) {
    showToast(err.message ?? '二次審査への申請に失敗しました', true);
  } finally {
    setPrimaryReviewOverlay(false);
  }
}
let selectedDesiredDate = null;
let instancePreviewTimer = null;

/** Shows a transient toast message. */
function showToast(message, isError = false) {
  const el = document.getElementById('page-toast');
  if (!el) return;
  el.textContent = message;
  el.classList.toggle('is-error', isError);
  el.classList.remove('hidden');
  window.clearTimeout(showToast._timer);
  showToast._timer = window.setTimeout(() => el.classList.add('hidden'), 5000);
}

/** Formats byte size for display. */
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Updates EC2 instance preview from MPI process count. */
async function refreshInstancePreview() {
  const mpiInput = document.getElementById('openfoam-mpi-processes');
  const runtimeInput = document.getElementById('openfoam-max-runtime-hours');
  const fileInput = document.getElementById('openfoam-input-file');
  const previewEl = document.getElementById('openfoam-instance-preview');
  const costEl = document.getElementById('openfoam-cost-estimate-hint');
  if (!mpiInput || !previewEl) return;

  const mpi = parseInt(mpiInput.value, 10);
  if (!Number.isFinite(mpi) || mpi < 1) {
    previewEl.textContent = '—';
    if (costEl) costEl.textContent = '';
    return;
  }

  const maxRuntime = runtimeInput ? parseInt(runtimeInput.value, 10) : 10;
  const file = fileInput?.files?.[0];
  const inputSize = file?.size ?? 0;

  try {
    const params = new URLSearchParams({
      mpi_processes: String(mpi),
      max_runtime_hours: String(Number.isFinite(maxRuntime) ? maxRuntime : 10),
      input_size_bytes: String(inputSize),
    });
    const data = await apiRequest(`openfoam-requests/instance-preview?${params}`);
    previewEl.textContent = `${data.instance_type}（MPI ${mpi} / 最大 ${data.vcpus} vCPU）`;
    if (costEl && data.estimated_cost_jpy_max != null) {
      const storage = data.estimated_storage;
      const storageHint = storage
        ? ` · ストレージ目安 入力 ${formatBytes(storage.input_bytes)} / 出力 ${formatBytes(storage.output_bytes_hint_min)} 以上`
        : '';
      costEl.textContent = `概算料金（最大 ${data.max_runtime_hours} 時間フル稼働）: 約 ${data.estimated_cost_jpy_max.toLocaleString('ja-JP')} 円（$${data.estimated_cost_usd_max}）${storageHint}。${data.cost_note ?? ''}`;
    }
  } catch {
    previewEl.textContent = '取得できませんでした';
    if (costEl) costEl.textContent = '';
  }
}

/** Schedules instance preview refresh. */
function scheduleInstancePreview() {
  window.clearTimeout(instancePreviewTimer);
  instancePreviewTimer = window.setTimeout(() => {
    refreshInstancePreview().catch(() => {});
  }, 200);
}

/** Returns whether the file has a .zip extension. */
function isOpenfoamZipFile(file) {
  return /\.zip$/i.test(file.name);
}

/** Assigns a File to a file input for form submission. */
function assignFileToInput(fileInput, file) {
  const dt = new DataTransfer();
  dt.items.add(file);
  fileInput.files = dt.files;
}

/** Updates the OpenFOAM drop zone status line. */
function updateOpenfoamFileStatus(file) {
  const statusEl = document.getElementById('openfoam-file-status');
  if (!statusEl) return;
  statusEl.textContent = file ? `${file.name}（${formatBytes(file.size)}）` : '未選択';
}

/** Wires drag-and-drop and click-to-select for the OpenFOAM upload zone. */
function setupOpenfoamFileDropZone() {
  const uploadZone = document.getElementById('openfoam-upload-zone');
  const fileInput = document.getElementById('openfoam-input-file');
  const alertEl = document.getElementById('openfoam-form-alert');
  if (!uploadZone || !fileInput) return;

  const applyFile = (file) => {
    if (!isOpenfoamZipFile(file)) {
      if (alertEl) {
        alertEl.textContent = '.zip ファイルのみ選択できます';
        alertEl.classList.remove('hidden');
      }
      return;
    }
    alertEl?.classList.add('hidden');
    assignFileToInput(fileInput, file);
    updateOpenfoamFileStatus(file);
    scheduleInstancePreview();
  };

  uploadZone.addEventListener('click', () => fileInput.click());
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    const file = e.dataTransfer.files?.[0];
    if (file) applyFile(file);
  });
  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (file) applyFile(file);
    else updateOpenfoamFileStatus(null);
  });
}

/** Loads OpenFOAM config and user requests. */
async function loadOpenfoamConfigAndRequests() {
  openfoamConfig = await apiRequest('openfoam-requests/config');
  const mpiInput = document.getElementById('openfoam-mpi-processes');
  const runtimeInput = document.getElementById('openfoam-max-runtime-hours');
  if (runtimeInput && openfoamConfig?.max_runtime_hours) {
    runtimeInput.max = String(openfoamConfig.max_runtime_hours);
    runtimeInput.placeholder = `1〜${openfoamConfig.max_runtime_hours}`;
  }
  if (mpiInput && openfoamConfig) {
    mpiInput.min = String(openfoamConfig.min_mpi_processes ?? 1);
    mpiInput.max = String(openfoamConfig.max_mpi_processes ?? 96);
  }
  await refreshInstancePreview();
  await renderMyOpenfoamRequests();
}

/** Syncs form primary-review block when the latest submitted request fails primary review. */
function syncFormPrimaryReviewFromRow(row) {
  if (!row || row.id !== lastSubmittedRequestId) return;
  if (row.status === 'primary_failed' || row.status === 'primary_error') {
    showPrimaryReviewBlock(row);
    pendingForceRequestId = row.id;
    pendingForceSubmit = () => forceOpenfoamSecondaryById(row.id);
    expandedRequestIds.add(row.id);
  } else if (row.status === 'pending_approval') {
    hidePrimaryReviewBlock();
    pendingForceRequestId = null;
  }
}

/** Renders the user's OpenFOAM request list. */
async function renderMyOpenfoamRequests() {
  const mount = document.getElementById('my-openfoam-requests');
  if (!mount) return;

  try {
    const data = await apiRequest('openfoam-requests');
    const rows = data.requests ?? [];
    startRequestsPollIfNeeded(rows);

    if (!rows.length) {
      mount.innerHTML = '<p class="hint">まだ依頼はありません。</p>';
      return;
    }

    const tracked =
      lastSubmittedRequestId != null
        ? rows.find((r) => r.id === lastSubmittedRequestId)
        : rows[0];
    syncFormPrimaryReviewFromRow(tracked);

    mount.innerHTML = `
      <ul class="openfoam-request-list">
        ${rows
          .map((row) => {
            const expandable = requestHasDetailPanel(row);
            const expanded = expandedRequestIds.has(row.id);
            const statusUi = openfoamRequestStatusUi(row);
            const statusLabel = statusUi.label;
            const statusBadge = statusUi.badge;
            return `
          <li class="openfoam-request-list-item openfoam-request-list-item--${row.status}${expanded ? ' is-expanded' : ''}" data-request-id="${escapeHtml(row.id)}">
            <button type="button" class="openfoam-request-list-toggle${expandable ? '' : ' openfoam-request-list-toggle--static'}" ${
              expandable ? '' : 'disabled'
            } aria-expanded="${expanded ? 'true' : 'false'}">
              <div class="openfoam-request-list-head">
                <strong>${escapeHtml(row.title)}</strong>
                <span class="openfoam-request-status openfoam-request-status--${statusBadge}">${escapeHtml(statusLabel)}</span>
              </div>
              <p class="hint openfoam-request-list-summary">${escapeHtml(row.input_filename)} · ${formatBytes(row.input_size_bytes)} · MPI ${row.mpi_processes}</p>
              <p class="hint">依頼日時: ${escapeHtml(row.created_at)}${row.desired_date ? ` · 希望日: ${escapeHtml(row.desired_date)}` : ''}</p>
              ${expandable ? '<span class="openfoam-request-list-chevron" aria-hidden="true"></span>' : ''}
            </button>
            ${expanded && expandable ? renderRequestDetailPanel(row) : ''}
            ${row.zip_job_id ? `<p class="hint openfoam-request-list-meta">ジョブ ID: <code>${escapeHtml(row.zip_job_id)}</code></p>` : ''}
          </li>
        `;
          })
          .join('')}
      </ul>
    `;

    mount.querySelectorAll('.openfoam-request-list-toggle:not([disabled])').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.closest('[data-request-id]')?.getAttribute('data-request-id');
        if (id) toggleRequestExpanded(id);
      });
    });

    mount.querySelectorAll('.openfoam-force-secondary-list-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-request-id');
        if (id) forceOpenfoamSecondaryById(id);
      });
    });

    mount.querySelectorAll('.openfoam-rerun-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-request-id');
        if (id) rerunOpenfoamRequest(id);
      });
    });

    mount.querySelectorAll('.openfoam-retry-primary-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-request-id');
        if (id) promptOpenfoamRetryPrimaryFile(id);
      });
    });

    mountExpandedOpenfoamChats(rows);
  } catch (err) {
    mount.innerHTML = `<p class="alert alert-error">${escapeHtml(err.message ?? '一覧の取得に失敗しました')}</p>`;
  }
}

/** Escapes HTML for safe insertion. */
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Shows or hides the primary review loading overlay. */
function setPrimaryReviewOverlay(visible, message = '一次審査中…') {
  const overlay = document.getElementById('openfoam-primary-review-overlay');
  const textEl = document.getElementById('openfoam-primary-review-overlay-text');
  if (textEl) textEl.textContent = message;
  if (!overlay) return;
  overlay.classList.toggle('hidden', !visible);
  overlay.setAttribute('aria-hidden', visible ? 'false' : 'true');
}

/** Shows primary review failure UI with issue list and retry controls. */
function showPrimaryReviewBlock(row) {
  const block = document.getElementById('openfoam-primary-review-block');
  const list = document.getElementById('openfoam-primary-review-issues');
  const alertEl = document.getElementById('openfoam-form-alert');
  const attemptsHint = document.getElementById('openfoam-primary-review-attempts-hint');
  const retryBtn = document.getElementById('openfoam-retry-primary-form-btn');
  if (alertEl) alertEl.classList.add('hidden');
  if (!block || !list) return;

  const issues = row?.primary_review_issues ?? [];
  list.innerHTML = issues.map((issue) => `<li>${escapeHtml(issue)}</li>`).join('');

  if (row?.primary_review_error && !issues.length) {
    list.innerHTML = `<li>${escapeHtml(row.primary_review_error)}</li>`;
  }

  const max = row?.primary_review_max_attempts ?? openfoamConfig?.primary_review_max_attempts ?? 3;
  const used = row?.primary_review_attempt_count ?? 0;
  if (attemptsHint) {
    if (row?.primary_review_can_retry) {
      const remaining = primaryReviewAttemptsRemaining(row);
      attemptsHint.textContent = `一次審査: ${used} / ${max} 回実施済み。あと ${remaining} 回まで再審できます。`;
      attemptsHint.classList.remove('hidden');
    } else if (row?.status === 'primary_failed' || row?.status === 'primary_error') {
      attemptsHint.textContent = `一次審査: ${used} / ${max} 回実施済み。再審の上限に達しました。`;
      attemptsHint.classList.remove('hidden');
    } else {
      attemptsHint.classList.add('hidden');
    }
  }

  if (retryBtn) {
    if (row?.primary_review_can_retry) {
      retryBtn.classList.remove('hidden');
    } else {
      retryBtn.classList.add('hidden');
    }
  }

  block.classList.remove('hidden');
}

/** Hides primary review failure UI. */
function hidePrimaryReviewBlock() {
  document.getElementById('openfoam-primary-review-block')?.classList.add('hidden');
  pendingForceSubmit = null;
  pendingForceRequestId = null;
}

/** Submits the OpenFOAM request form (optional forced secondary on same upload). */
async function submitOpenfoamRequest(form, { forceSecondary = false } = {}) {
  const submitBtn = form.querySelector('[type="submit"]');
  const alertEl = document.getElementById('openfoam-form-alert');
  const fileInput = document.getElementById('openfoam-input-file');
  const file = fileInput?.files?.[0];

  if (!file) {
    if (alertEl) {
      alertEl.textContent = '.zip ファイルを選択してください';
      alertEl.classList.remove('hidden');
    }
    return;
  }

  if (!ensureCanBook()) return;
  if (!ensureSimPhoneVerified()) return;

  const formData = new FormData(form);
  formData.set('file', file);
  if (selectedDesiredDate) {
    formData.set('desired_date', selectedDesiredDate);
  }
  if (forceSecondary) {
    formData.set('force_secondary', '1');
  }

  submitBtn.disabled = true;
  alertEl?.classList.add('hidden');
  if (!forceSecondary) hidePrimaryReviewBlock();

  setPrimaryReviewOverlay(true, forceSecondary ? '依頼を送信中…' : '依頼を送信中…');

  try {
    const result = await apiFormRequest('openfoam-requests', formData);
    const requestId = result.request?.id;
    if (requestId) {
      lastSubmittedRequestId = requestId;
      expandedRequestIds.add(requestId);
    }
    form.reset();
    if (fileInput) fileInput.value = '';
    updateOpenfoamFileStatus(null);
    if (!forceSecondary) hidePrimaryReviewBlock();
    showToast('依頼を受け付けました。一次審査の結果は「自分の依頼」に表示されます。');
    await renderMyOpenfoamRequests();
  } catch (err) {
    if (alertEl) {
      alertEl.textContent = err.message ?? '依頼の送信に失敗しました';
      alertEl.classList.remove('hidden');
    }
  } finally {
    setPrimaryReviewOverlay(false);
    submitBtn.disabled = false;
  }
}

/** Re-submits a finished request with the same input and parameters. */
async function rerunOpenfoamRequest(requestId) {
  const ok = window.confirm(
    '同じ入力・MPI・最大実行時間で新しい依頼を作成します（一次審査から）。よろしいですか？'
  );
  if (!ok) return;
  try {
    await ensureSimPhoneVerified();
    const data = await apiRequest(`openfoam-requests/${requestId}/rerun`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
    if (data.request?.id) {
      lastSubmittedRequestId = data.request.id;
      expandedRequestIds.add(data.request.id);
    }
    await renderMyOpenfoamRequests();
  } catch (err) {
    const alertEl = document.getElementById('openfoam-form-alert');
    if (alertEl) {
      alertEl.textContent = err instanceof Error ? err.message : '再依頼に失敗しました';
      alertEl.classList.remove('hidden');
    }
  }
}

async function handleOpenfoamSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  await submitOpenfoamRequest(form, { forceSecondary: false });
}

/** Initializes the simulation request hub page. */
export async function initOpenfoamRequestPanel(deps = {}) {
  const { onDesiredDateSelect } = deps;

  const allowed = true;
  if (!allowed) return;

  
  
  await initPhoneVerification();

  document.getElementById('openfoam-mpi-processes')?.addEventListener('input', scheduleInstancePreview);
  document.getElementById('openfoam-max-runtime-hours')?.addEventListener('input', scheduleInstancePreview);
  setupOpenfoamFileDropZone();
  document.getElementById('openfoam-request-form')?.addEventListener('submit', handleOpenfoamSubmit);
  document.getElementById('openfoam-force-secondary-btn')?.addEventListener('click', () => {
    if (pendingForceRequestId) {
      forceOpenfoamSecondaryById(pendingForceRequestId);
      return;
    }
    if (pendingForceSubmit) {
      pendingForceSubmit();
      return;
    }
    const form = document.getElementById('openfoam-request-form');
    if (form) submitOpenfoamRequest(form, { forceSecondary: true });
  });

  document.getElementById('openfoam-retry-primary-form-btn')?.addEventListener('click', () => {
    if (pendingForceRequestId) promptOpenfoamRetryPrimaryFile(pendingForceRequestId);
  });

  window.addEventListener('openfoam-request-input-replaced', () => {
    renderMyOpenfoamRequests().catch(() => {});
  });

  await loadOpenfoamConfigAndRequests();
  applyPhoneVerificationUi();
}

