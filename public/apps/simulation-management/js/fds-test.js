// public/apps/simulation-management/js/fds-test.js
import { apiFormRequest, apiRequest } from '../../simulation-request/js/api.js';

const FDS_STATUS_LABELS = {
  pending: '待機中',
  launching: '起動中',
  running: '実行中',
  succeeded: '完了',
  failed: '失敗',
  cancelled: 'キャンセル',
  timed_out: 'タイムアウト',
};

let fdsPollTimer = null;

/** Escapes HTML special characters. */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

/** Formats byte size for display. */
function formatSize(bytes) {
  if (!bytes || bytes < 1024) return `${bytes ?? 0} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Renders AWS / R2 configuration status. */
async function renderFdsConfig() {
  const mount = document.getElementById('fds-config-mount');
  if (!mount) return;

  try {
    const data = await apiRequest('admin/fds-jobs/config');
    const aws = data.aws ?? {};
    const items = [
      { label: 'AWS 認証情報', ok: aws.configured || (aws.amiConfigured && aws.networkConfigured) },
      { label: 'FDS AMI', ok: aws.amiConfigured },
      { label: 'VPC（サブネット / SG）', ok: aws.networkConfigured },
      { label: 'R2 presigned URL', ok: data.r2_presign },
      { label: 'コールバック秘密鍵', ok: data.callback_secret },
    ];

    const allOk = items.every((item) => item.ok);
    mount.innerHTML = `
      <p class="hint">リージョン: <strong>${escapeHtml(aws.region ?? 'ap-northeast-1')}</strong> /
      インスタンス: <strong>${escapeHtml(data.default_instance_type ?? 't3.micro')}</strong> /
      最大実行: <strong>${data.max_runtime_hours ?? 10} 時間</strong></p>
      <ul class="fds-config-list">
        ${items
          .map(
            (item) =>
              `<li class="${item.ok ? 'fds-config-ok' : 'fds-config-ng'}">${item.ok ? '✓' : '✗'} ${escapeHtml(item.label)}</li>`
          )
          .join('')}
      </ul>
      ${
        allOk
          ? '<p class="hint fds-config-ready">テスト実行の準備ができています。</p>'
          : `<p class="alert alert-error">設定が不足しています。<code>infra/fds-test/README.md</code> を参照して AWS / Wrangler シークレットを設定してください。</p>`
      }
    `;
  } catch (err) {
    mount.innerHTML = `<p class="alert alert-error">${escapeHtml(err.message)}</p>`;
  }
}

/** Builds action buttons for a job row. */
function buildFdsJobActions(job) {
  const actions = [];
  if (job.has_output) {
    actions.push(
      `<a class="btn btn-secondary btn-sm" href="/api/simulation/admin/fds-jobs/${job.id}/output/download" download>結果 ZIP</a>`
    );
  }
  if (job.has_log) {
    actions.push(
      `<a class="btn btn-secondary btn-sm" href="/api/simulation/admin/fds-jobs/${job.id}/log/download" download>ログ</a>`
    );
  }
  if (['pending', 'failed', 'cancelled'].includes(job.status)) {
    actions.push(
      `<button type="button" class="btn btn-secondary btn-sm fds-job-rerun" data-id="${escapeHtml(job.id)}">再実行</button>`
    );
  }
  if (['launching', 'running', 'pending'].includes(job.status)) {
    actions.push(
      `<button type="button" class="btn btn-secondary btn-sm fds-job-cancel" data-id="${escapeHtml(job.id)}">キャンセル</button>`
    );
  }
  return actions.join(' ');
}

/** Renders FDS job history table. */
async function renderFdsJobs() {
  const mount = document.getElementById('fds-jobs-mount');
  if (!mount) return;

  try {
    const data = await apiRequest('admin/fds-jobs');
    const jobs = data.jobs ?? [];

    if (!jobs.length) {
      mount.innerHTML = '<p class="hint">まだジョブがありません。</p>';
      return;
    }

    mount.innerHTML = `
      <div class="fds-jobs-table-wrap">
        <table class="admin-table fds-jobs-table">
          <thead>
            <tr>
              <th>タイトル</th>
              <th>状態</th>
              <th>ファイル</th>
              <th>EC2</th>
              <th>作成</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            ${jobs
              .map(
                (job) => `
              <tr>
                <td>
                  <strong>${escapeHtml(job.title)}</strong>
                  ${job.status_message ? `<div class="hint">${escapeHtml(job.status_message)}</div>` : ''}
                </td>
                <td><span class="status-badge status-${job.status}">${FDS_STATUS_LABELS[job.status] ?? job.status}</span></td>
                <td>${escapeHtml(job.input_filename)}<br><span class="hint">${formatSize(job.input_size_bytes)}</span></td>
                <td><span class="hint">${escapeHtml(job.ec2_instance_type)}</span>${job.ec2_instance_id ? `<br><code>${escapeHtml(job.ec2_instance_id)}</code>` : ''}</td>
                <td><span class="hint">${escapeHtml(job.created_at)}</span></td>
                <td class="fds-job-actions">${buildFdsJobActions(job)}</td>
              </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `;

    mount.querySelectorAll('.fds-job-cancel').forEach((btn) => {
      btn.addEventListener('click', () => handleFdsCancel(btn.dataset.id));
    });
    mount.querySelectorAll('.fds-job-rerun').forEach((btn) => {
      btn.addEventListener('click', () => handleFdsRerun(btn.dataset.id));
    });

    const hasActive = jobs.some((job) => ['launching', 'running'].includes(job.status));
    if (hasActive) {
      scheduleFdsPoll();
    } else {
      stopFdsPoll();
    }
  } catch (err) {
    mount.innerHTML = `<p class="alert alert-error">${escapeHtml(err.message)}</p>`;
  }
}

/** Submits a new FDS test run. */
async function handleFdsRunSubmit(event) {
  event.preventDefault();
  const alertEl = document.getElementById('fds-run-alert');
  const submitBtn = document.getElementById('fds-run-btn');
  const fileInput = document.getElementById('fds-file');
  const titleInput = document.getElementById('fds-title');

  const file = fileInput?.files?.[0];
  if (!file) {
    alertEl.innerHTML = '<p class="alert alert-error">.fds ファイルを選択してください</p>';
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  if (titleInput?.value?.trim()) {
    formData.append('title', titleInput.value.trim());
  }

  submitBtn.disabled = true;
  alertEl.innerHTML = '<p class="hint">アップロードして EC2 を起動しています…</p>';

  try {
    await apiFormRequest('admin/fds-jobs/run', formData);
    alertEl.innerHTML = '<p class="alert alert-success">テスト実行を開始しました。</p>';
    fileInput.value = '';
    if (titleInput) titleInput.value = '';
    await Promise.all([renderFdsJobs(), renderFdsConfig()]);
  } catch (err) {
    const extra = err.payload?.job ? `（ジョブ ID: ${err.payload.job.id}）` : '';
    alertEl.innerHTML = `<p class="alert alert-error">${escapeHtml(err.message)}${escapeHtml(extra)}</p>`;
    await renderFdsJobs();
  } finally {
    submitBtn.disabled = false;
  }
}

/** Cancels an active FDS job. */
async function handleFdsCancel(jobId) {
  if (!jobId || !confirm('このジョブをキャンセルしますか？')) return;
  try {
    await apiRequest(`admin/fds-jobs/${jobId}/cancel`, { method: 'POST' });
    await renderFdsJobs();
  } catch (err) {
    alert(err.message);
  }
}

/** Re-runs a pending/failed FDS job. */
async function handleFdsRerun(jobId) {
  if (!jobId || !confirm('このジョブを再実行しますか？')) return;
  try {
    await apiRequest(`admin/fds-jobs/${jobId}/run`, { method: 'POST' });
    await renderFdsJobs();
  } catch (err) {
    alert(err.message);
  }
}

/** Polls job list while runs are active. */
function scheduleFdsPoll() {
  if (fdsPollTimer) return;
  fdsPollTimer = window.setInterval(() => {
    if (document.getElementById('panel-fds-test')?.classList.contains('hidden')) {
      stopFdsPoll();
      return;
    }
    renderFdsJobs().catch(() => {});
  }, 15000);
}

/** Stops polling for active FDS jobs. */
function stopFdsPoll() {
  if (!fdsPollTimer) return;
  window.clearInterval(fdsPollTimer);
  fdsPollTimer = null;
}

/** Initializes the FDS test panel. */
export function initFdsTestPanel() {
  document.getElementById('fds-run-form')?.addEventListener('submit', handleFdsRunSubmit);
  document.getElementById('fds-refresh-btn')?.addEventListener('click', () => {
    renderFdsConfig();
    renderFdsJobs();
  });
}

/** Loads and renders the FDS test panel. */
export async function renderFdsTestPanel() {
  await Promise.all([renderFdsConfig(), renderFdsJobs()]);
}
