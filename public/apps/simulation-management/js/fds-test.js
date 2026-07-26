// public/apps/simulation-management/js/fds-test.js
import { apiFormRequest, apiRequest } from '../../simulation-request/js/api.js';
import { initFdsRequestQueue, renderFdsRequestQueue } from './fds-requests.js';

const FDS_STATUS_LABELS = {
  pending: '待機中',
  launching: '起動中',
  running: '実行中',
  succeeded: '完了_成功',
  failed: '完了_失敗',
  cancelled: 'キャンセル',
  timed_out: '完了_失敗',
};

const EC2_STATE_LABELS = {
  pending: '起動待ち',
  running: '稼働中',
  stopping: '停止中',
  stopped: '停止済み',
  'shutting-down': '終了中',
  terminated: '終了済み',
};

const AMI_STATE_LABELS = {
  available: '利用可能',
  pending: '準備中（コピー中）',
  failed: '失敗（使えません）',
  invalid: '無効',
  error: '状態取得エラー',
  'not-found': '見つかりません',
  unknown: '不明（API 応答を確認）',
};

/** Fetches configured AMI status from the config API. */
async function fetchFdsAmiFromConfig() {
  const data = await apiRequest('admin/fds-jobs/config');
  return data.ami ?? null;
}

/** Returns whether AMI is in a terminal bad state (no point retrying). */
function isAmiTerminalFailure(state) {
  return state === 'failed' || state === 'invalid' || state === 'not-found';
}

const FDS_ACTIVE_STATUSES = new Set(['pending', 'launching', 'running']);
const FDS_LIVE_POLL_MS = 4000;
const FDS_LAUNCH_RETRY_MAX = 24;
const FDS_LAUNCH_RETRY_DELAY_MS = 15_000;

/** Returns whether an API error is due to AMI still pending. */
function isAmiPendingLaunchError(err) {
  if (err?.payload?.code === 'AMI_NOT_READY') return true;
  const msg = err?.message ?? '';
  if (/failed|invalid/i.test(msg) && /AMI/i.test(msg)) return false;
  return /AMI/i.test(msg) && /pending|利用可能/i.test(msg);
}

/** Sleeps for the given milliseconds. */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Calls EC2 launch API and appends server launch_steps to the run log. */
async function requestFdsJobLaunch(jobId) {
  const launchData = await apiRequest(`admin/fds-jobs/${jobId}/run`, { method: 'POST' });
  appendFdsRunSteps(launchData.launch_steps);
  return launchData;
}

/** Retries launch while AWS reports the AMI is still pending. */
async function requestFdsJobLaunchWithAmiRetry(jobId) {
  for (let attempt = 1; attempt <= FDS_LAUNCH_RETRY_MAX; attempt++) {
    const ami = await fetchFdsAmiFromConfig();
    if (ami?.ami_id && ami.state) {
      const label = AMI_STATE_LABELS[ami.state] ?? ami.state;
      if (isAmiTerminalFailure(ami.state)) {
        const reason = ami.state_reason ? ` — ${ami.state_reason}` : '';
        throw new Error(`AMI ${ami.ami_id} は ${label} です${reason}。新しい AMI を作成し AWS_EC2_FDS_AMI_ID を更新してください。`);
      }
      if (ami.state !== 'available') {
        appendFdsRunLog(`AMI ${ami.ami_id}: ${label}`);
      }
    }

    try {
      return await requestFdsJobLaunch(jobId);
    } catch (err) {
      if (!isAmiPendingLaunchError(err) || attempt >= FDS_LAUNCH_RETRY_MAX) {
        throw err;
      }
      appendFdsRunLog(
        `AMI がまだ利用可能ではありません。${FDS_LAUNCH_RETRY_DELAY_MS / 1000} 秒後に再試行 (${attempt}/${FDS_LAUNCH_RETRY_MAX})…`
      );
      await sleep(FDS_LAUNCH_RETRY_DELAY_MS);
    }
  }
  throw new Error('AMI が利用可能になるまで待ちましたがタイムアウトしました。EC2 コンソールで AMI が「利用可能」か確認し、「再実行」を押してください。');
}

/** Applies launch API response to UI state. */
function applyFdsLaunchResult(launchData) {
  if (!launchData?.job) return;
  upsertFdsJobInList(launchData.job);
  fdsSelectedJobDetail = launchData.job;
  fdsDetailUpdatedAt = Date.now();
  traceFdsJobProgress(launchData.job);
  renderFdsJobsList();
  renderFdsJobDetail();
}

/** Formats ISO time for log lines. */
function formatLogTime(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '--:--:--';
  return date.toLocaleTimeString('ja-JP', { hour12: false });
}

/** Appends a line to the on-page run log. */
function appendFdsRunLog(message, { level = 'info', at } = {}) {
  const stamp = at ?? new Date().toISOString();
  fdsRunLogLines.push({ at: stamp, message, level });
  renderFdsRunLog();
}

/** Renders the run log panel. */
function renderFdsRunLog() {
  const wrap = document.getElementById('fds-run-log-wrap');
  const pre = document.getElementById('fds-run-log');
  if (!wrap || !pre) return;
  if (!fdsRunLogLines.length) {
    wrap.hidden = true;
    pre.textContent = '';
    return;
  }
  wrap.hidden = false;
  pre.innerHTML = fdsRunLogLines
    .map((line) => {
      const cls =
        line.level === 'error' ? 'fds-run-log-line-error' : line.level === 'ok' ? 'fds-run-log-line-ok' : '';
      return `<span class="${cls}">[${formatLogTime(line.at)}] ${escapeHtml(line.message)}</span>`;
    })
    .join('\n');
  pre.scrollTop = pre.scrollHeight;
}

/** Clears the run log and optional trace target. */
function clearFdsRunLog() {
  fdsRunLogLines.length = 0;
  fdsRunTraceJobId = null;
  fdsLastTraceSnapshot = null;
  renderFdsRunLog();
}

/** Merges server step objects into the run log. */
function appendFdsRunSteps(steps) {
  if (!Array.isArray(steps)) return;
  for (const step of steps) {
    if (!step?.message) continue;
    appendFdsRunLog(step.message, { at: step.at, level: 'info' });
  }
}

/** Logs job / EC2 changes while tracing a submitted job. */
function traceFdsJobProgress(job) {
  if (!job || job.id !== fdsRunTraceJobId) return;
  const snap = {
    status: job.status,
    status_message: job.status_message ?? '',
    ec2_instance_id: job.ec2_instance_id ?? '',
    ec2_instance_state: job.ec2_instance_state ?? '',
  };
  if (!fdsLastTraceSnapshot) {
    fdsLastTraceSnapshot = snap;
    appendFdsRunLog(`ジョブ状態: ${FDS_STATUS_LABELS[job.status] ?? job.status}`, { level: 'info' });
    if (job.ec2_instance_id) {
      appendFdsRunLog(`EC2: ${job.ec2_instance_id}`, { level: 'info' });
    }
    if (job.ec2_instance_state) {
      appendFdsRunLog(`EC2 状態 (AWS): ${EC2_STATE_LABELS[job.ec2_instance_state] ?? job.ec2_instance_state}`, {
        level: 'info',
      });
    }
    return;
  }
  if (snap.status !== fdsLastTraceSnapshot.status) {
    appendFdsRunLog(`ジョブ状態が更新: ${FDS_STATUS_LABELS[snap.status] ?? snap.status}`, {
      level: ['succeeded', 'failed', 'timed_out', 'cancelled'].includes(snap.status) ? 'ok' : 'info',
    });
    if (snap.status === 'succeeded') {
      appendFdsRunLog('完了_成功 — 詳細パネルの「実行結果 ZIP」からダウンロードできます。', {
        level: 'ok',
      });
    }
    if (snap.status === 'failed' || snap.status === 'timed_out') {
      appendFdsRunLog('完了_失敗 — 実行ログを確認してください。', { level: 'error' });
    }
  }
  if (snap.status_message !== fdsLastTraceSnapshot.status_message && snap.status_message) {
    appendFdsRunLog(snap.status_message, { level: 'info' });
  }
  if (snap.ec2_instance_id && snap.ec2_instance_id !== fdsLastTraceSnapshot.ec2_instance_id) {
    appendFdsRunLog(`EC2 インスタンス ID: ${snap.ec2_instance_id}`, { level: 'info' });
  }
  if (snap.ec2_instance_state && snap.ec2_instance_state !== fdsLastTraceSnapshot.ec2_instance_state) {
    appendFdsRunLog(
      `EC2 状態 (AWS): ${EC2_STATE_LABELS[snap.ec2_instance_state] ?? snap.ec2_instance_state}`,
      { level: 'info' }
    );
  }
  fdsLastTraceSnapshot = snap;
}
let fdsLiveTimer = null;
let fdsJobs = [];
let fdsSelectedJobId = null;
let fdsSelectedJobDetail = null;
let fdsDetailUpdatedAt = null;
let fdsListLoading = false;
let fdsRunTraceJobId = null;
let fdsLastTraceSnapshot = null;
const fdsRunLogLines = [];

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

/** Formats ISO timestamps for the admin UI. */
function formatDateTime(iso) {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return escapeHtml(iso);
  return date.toLocaleString('ja-JP', { hour12: false });
}

/** Returns whether a job is still in progress. */
function isFdsJobActive(job) {
  return job && FDS_ACTIVE_STATUSES.has(job.status);
}

/** Returns whether we should keep polling (active, or waiting for R2 artifacts after finish). */
function fdsJobNeedsLiveUpdates(job) {
  if (!job) return false;
  if (isFdsJobActive(job)) return true;
  if (job.status === 'succeeded' && !job.has_output) return true;
  if (job.id === fdsRunTraceJobId && ['succeeded', 'failed', 'timed_out'].includes(job.status)) {
    const finishedMs = job.finished_at ? Date.parse(job.finished_at) : NaN;
    if (!Number.isNaN(finishedMs) && Date.now() - finishedMs < 120_000) return true;
  }
  return false;
}

/** Renders AWS / R2 configuration status. */
async function renderFdsConfig() {
  const mount = document.getElementById('fds-config-mount');
  if (!mount) return;

  try {
    const data = await apiRequest('admin/fds-jobs/config');
    const aws = data.aws ?? {};
    const ami = data.ami ?? {};
    const amiStateLabel = ami.state ? AMI_STATE_LABELS[ami.state] ?? ami.state : '未確認';
    const amiOk = ami.runnable === true;
    const items = [
      { label: 'AWS 認証情報', ok: aws.configured || (aws.amiConfigured && aws.networkConfigured) },
      {
        label: 'FDS AMI',
        ok: amiOk,
        detail: ami.ami_id
          ? `${ami.ami_id} — ${amiStateLabel}${ami.state_reason && !amiOk ? `（${ami.state_reason}）` : ''}`
          : 'AWS_EC2_FDS_AMI_ID 未設定',
      },
      { label: 'VPC（サブネット / SG）', ok: aws.networkConfigured },
      { label: 'R2 presigned URL', ok: data.r2_presign },
      { label: 'コールバック秘密鍵', ok: data.callback_secret },
    ];

    const secretsOk = items.filter((item) => item.label !== 'FDS AMI').every((item) => item.ok);
    const allOk = secretsOk && amiOk;
    mount.innerHTML = `
      <p class="hint">リージョン: <strong>${escapeHtml(aws.region ?? 'ap-northeast-1')}</strong> /
      インスタンス: <strong>${escapeHtml(data.default_instance_type ?? 't3.micro')}</strong> /
      最大実行: <strong>${data.max_runtime_hours ?? 10} 時間</strong></p>
      <ul class="fds-config-list">
        ${items
          .map(
            (item) =>
              `<li class="${item.ok ? 'fds-config-ok' : 'fds-config-ng'}">${item.ok ? '✓' : '✗'} ${escapeHtml(item.label)}${
                item.detail ? `<br><span class="hint">${escapeHtml(item.detail)}</span>` : ''
              }</li>`
          )
          .join('')}
      </ul>
      ${
        allOk
          ? '<p class="hint fds-config-ready">テスト実行の準備ができています。</p>'
          : secretsOk && ami.ami_id && !amiOk
            ? '<p class="alert alert-error">AMI が「利用可能」になるまで実行できません。failed の場合は AMI を作り直し、Wrangler の <code>AWS_EC2_FDS_AMI_ID</code> を更新してください。</p>'
            : `<p class="alert alert-error">設定が不足しています。<code>infra/fds-test/README.md</code> を参照して AWS / Wrangler シークレットを設定してください。</p>`
      }
    `;
  } catch (err) {
    mount.innerHTML = `<p class="alert alert-error">${escapeHtml(err.message)}</p>`;
  }
}

/** Builds download and action controls for a job. */
function buildFdsJobActions(job) {
  const actions = [];
  actions.push(
    `<a class="btn btn-secondary btn-sm" href="/api/simulation/admin/fds-jobs/${job.id}/input/download" download>入力 .fds</a>`
  );
  if (job.has_output) {
    const sizeHint = job.output_size_bytes ? ` (${formatSize(job.output_size_bytes)})` : '';
    actions.push(
      `<a class="btn btn-primary btn-sm" href="/api/simulation/admin/fds-jobs/${job.id}/output/download" download>実行結果 ZIP${sizeHint}</a>`
    );
  } else if (['succeeded', 'failed', 'timed_out'].includes(job.status)) {
    actions.push(`<span class="hint">結果 ZIP 準備中…</span>`);
  }
  if (job.has_log) {
    actions.push(
      `<a class="btn btn-secondary btn-sm" href="/api/simulation/admin/fds-jobs/${job.id}/log/download" download>実行ログ</a>`
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

/** Merges a job into the in-memory list (by id). */
function upsertFdsJobInList(job) {
  if (!job?.id) return;
  const index = fdsJobs.findIndex((item) => item.id === job.id);
  if (index >= 0) {
    fdsJobs[index] = job;
  } else {
    fdsJobs = [job, ...fdsJobs];
  }
}

/** Selects a job and loads its live detail. */
async function selectFdsJob(jobId) {
  fdsSelectedJobId = jobId;
  renderFdsJobsList();
  await refreshFdsJobDetail();
  syncFdsLivePolling();
}

/** Renders the job list from in-memory state. */
function renderFdsJobsList() {
  const mount = document.getElementById('fds-jobs-list-mount');
  if (!mount) return;

  if (fdsListLoading && !fdsJobs.length) {
    mount.innerHTML = '<p class="hint">読み込み中...</p>';
    return;
  }

  if (!fdsJobs.length) {
    mount.innerHTML = '<p class="hint">まだジョブがありません。上のフォームから投入してください。</p>';
    return;
  }

  mount.innerHTML = `
    <div class="fds-jobs-table-wrap">
      <table class="admin-table fds-jobs-table">
        <thead>
          <tr>
            <th>タイトル</th>
            <th>状態</th>
            <th>結果</th>
            <th>作成</th>
          </tr>
        </thead>
        <tbody>
          ${fdsJobs
            .map((job) => {
              const selected = job.id === fdsSelectedJobId;
              const resultCell =
                job.status === 'succeeded' && job.has_output
                  ? `<a class="btn btn-primary btn-sm fds-job-list-dl" href="/api/simulation/admin/fds-jobs/${escapeHtml(job.id)}/output/download" download onclick="event.stopPropagation()">ZIP</a>`
                  : job.status === 'succeeded'
                    ? '<span class="hint">準備中</span>'
                    : '—';
              return `
              <tr class="fds-job-row${selected ? ' fds-job-row-selected' : ''}" data-job-id="${escapeHtml(job.id)}" tabindex="0" role="button">
                <td>
                  <strong>${escapeHtml(job.title)}</strong>
                  <div class="hint">${escapeHtml(job.input_filename)}</div>
                </td>
                <td><span class="status-badge status-${job.status}">${FDS_STATUS_LABELS[job.status] ?? job.status}</span></td>
                <td>${resultCell}</td>
                <td><span class="hint">${formatDateTime(job.created_at)}</span></td>
              </tr>`;
            })
            .join('')}
        </tbody>
      </table>
    </div>
  `;

  mount.querySelectorAll('.fds-job-row').forEach((row) => {
    const jobId = row.dataset.jobId;
    row.addEventListener('click', () => {
      selectFdsJob(jobId).catch(() => {});
    });
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectFdsJob(jobId).catch(() => {});
      }
    });
  });
}

/** Renders the selected job detail panel. */
function renderFdsJobDetail() {
  const mount = document.getElementById('fds-job-detail-mount');
  if (!mount) return;

  if (!fdsSelectedJobId) {
    mount.innerHTML = '<p class="hint fds-job-detail-placeholder">ジョブを選択してください。</p>';
    return;
  }

  const job = fdsSelectedJobDetail;
  if (!job || job.id !== fdsSelectedJobId) {
    mount.innerHTML = '<p class="hint">状態を取得しています…</p>';
    return;
  }

  const ec2StateLabel = job.ec2_instance_state
    ? EC2_STATE_LABELS[job.ec2_instance_state] ?? job.ec2_instance_state
    : job.ec2_instance_id
      ? '確認中…'
      : '—';

  const showLive = fdsJobNeedsLiveUpdates(job);

  mount.innerHTML = `
    ${showLive ? '<p class="fds-job-detail-live">ライブ更新中</p>' : ''}
    ${job.status === 'succeeded' ? '<p class="alert alert-success fds-job-complete-banner">完了_成功 — 下のボタンから実行結果をダウンロードできます。</p>' : ''}
    ${job.status === 'failed' || job.status === 'timed_out' ? '<p class="alert alert-error fds-job-complete-banner">完了_失敗 — ログを確認してください。</p>' : ''}
    <h3>${escapeHtml(job.title)}</h3>
    <p><span class="status-badge status-${job.status}">${FDS_STATUS_LABELS[job.status] ?? job.status}</span></p>
    ${job.status_message ? `<p class="hint">${escapeHtml(job.status_message)}</p>` : ''}
    <dl class="fds-job-detail-meta">
      <dt>ジョブ ID</dt>
      <dd><code>${escapeHtml(job.id)}</code></dd>
      <dt>入力ファイル</dt>
      <dd>${escapeHtml(job.input_filename)} (${formatSize(job.input_size_bytes)})</dd>
      <dt>EC2 インスタンス</dt>
      <dd>
        ${job.ec2_instance_id ? `<code>${escapeHtml(job.ec2_instance_id)}</code>` : '<span class="hint">未割当</span>'}
        <br><span class="hint">${escapeHtml(job.ec2_instance_type)}</span>
      </dd>
      <dt>EC2 状態（AWS）</dt>
      <dd>${escapeHtml(ec2StateLabel)}${
        job.ec2_launch_time ? `<br><span class="hint">起動: ${formatDateTime(job.ec2_launch_time)}</span>` : ''
      }</dd>
      <dt>ジョブ開始</dt>
      <dd>${formatDateTime(job.launched_at)}</dd>
      <dt>ジョブ終了</dt>
      <dd>${formatDateTime(job.finished_at)}</dd>
      <dt>作成</dt>
      <dd>${formatDateTime(job.created_at)}</dd>
    </dl>
    <div class="fds-job-detail-dl fds-job-actions">${buildFdsJobActions(job)}</div>
    ${
      fdsDetailUpdatedAt
        ? `<p class="hint fds-job-detail-updated">最終更新: ${formatDateTime(new Date(fdsDetailUpdatedAt).toISOString())}</p>`
        : ''
    }
  `;

  mount.querySelectorAll('.fds-job-cancel').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      handleFdsCancel(btn.dataset.id);
    });
  });
  mount.querySelectorAll('.fds-job-rerun').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      handleFdsRerun(btn.dataset.id);
    });
  });
}

/** Fetches all jobs and updates the list. */
async function refreshFdsJobList({ silent = false } = {}) {
  const mount = document.getElementById('fds-jobs-list-mount');
  if (!silent && mount && !fdsJobs.length) {
    fdsListLoading = true;
    renderFdsJobsList();
  }

  try {
    const data = await apiRequest('admin/fds-jobs');
    fdsJobs = data.jobs ?? [];
    fdsListLoading = false;

    if (fdsSelectedJobId && !fdsJobs.some((job) => job.id === fdsSelectedJobId)) {
      fdsSelectedJobId = fdsJobs[0]?.id ?? null;
    }

    renderFdsJobsList();
    syncFdsLivePolling();
  } catch (err) {
    fdsListLoading = false;
    if (mount) {
      mount.innerHTML = `<p class="alert alert-error">${escapeHtml(err.message)}</p>`;
    }
    throw err;
  }
}

/** Fetches live detail for the selected job. */
async function refreshFdsJobDetail() {
  if (!fdsSelectedJobId) {
    fdsSelectedJobDetail = null;
    renderFdsJobDetail();
    return;
  }

  try {
    const data = await apiRequest(`admin/fds-jobs/${fdsSelectedJobId}`);
    fdsSelectedJobDetail = data.job ?? null;
    fdsDetailUpdatedAt = Date.now();
    if (fdsSelectedJobDetail) {
      upsertFdsJobInList(fdsSelectedJobDetail);
      traceFdsJobProgress(fdsSelectedJobDetail);
      renderFdsJobsList();
    }
    renderFdsJobDetail();
    syncFdsLivePolling();
  } catch (err) {
    const mount = document.getElementById('fds-job-detail-mount');
    if (mount) {
      mount.innerHTML = `<p class="alert alert-error">${escapeHtml(err.message)}</p>`;
    }
    throw err;
  }
}

/** One live polling tick (list + detail). */
async function tickFdsLive() {
  const panel = document.getElementById('panel-fds-test');
  if (!panel || panel.classList.contains('hidden')) {
    stopFdsLivePolling();
    return;
  }

  const tasks = [refreshFdsJobList({ silent: true })];
  if (fdsSelectedJobId) {
    tasks.push(refreshFdsJobDetail());
  }
  await Promise.allSettled(tasks);
}

/** Starts or stops polling based on active jobs. */
function syncFdsLivePolling() {
  const panel = document.getElementById('panel-fds-test');
  if (!panel || panel.classList.contains('hidden')) {
    stopFdsLivePolling();
    return;
  }

  const detailActive = fdsSelectedJobDetail && fdsJobNeedsLiveUpdates(fdsSelectedJobDetail);
  const anyActive = fdsJobs.some(fdsJobNeedsLiveUpdates);
  if (!detailActive && !anyActive) {
    stopFdsLivePolling();
    return;
  }

  if (!fdsLiveTimer) {
    fdsLiveTimer = window.setInterval(() => {
      tickFdsLive().catch(() => {});
    }, FDS_LIVE_POLL_MS);
  }
}

/** Stops live polling. */
function stopFdsLivePolling() {
  if (!fdsLiveTimer) return;
  window.clearInterval(fdsLiveTimer);
  fdsLiveTimer = null;
}

/** Submits a new FDS test run (stays on page; logs each step). */
async function handleFdsRunSubmit(event) {
  event?.preventDefault?.();
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

  clearFdsRunLog();
  submitBtn.disabled = true;
  alertEl.innerHTML = '<p class="hint">処理中です。この画面のままログを確認できます。</p>';
  appendFdsRunLog(`ファイルを選択: ${file.name} (${formatSize(file.size)})`);

  try {
    const ami = await fetchFdsAmiFromConfig();
    if (ami?.ami_id && !ami.runnable) {
      const label = AMI_STATE_LABELS[ami.state] ?? ami.state ?? '不明';
      const reason = ami.state_reason ? ` ${ami.state_reason}` : '';
      alertEl.innerHTML = `<p class="alert alert-error">AMI が起動可能な状態ではありません（${escapeHtml(label)}）。${escapeHtml(reason)}</p>`;
      appendFdsRunLog(`中止: AMI ${ami.ami_id} は ${label} です。${reason}`, { level: 'error' });
      return;
    }

    appendFdsRunLog('R2 へアップロードしてジョブを作成しています…');
    const uploadData = await apiFormRequest('admin/fds-jobs/run', formData);
    appendFdsRunSteps(uploadData.upload_steps);
    const job = uploadData.job;
    if (!job?.id) {
      throw new Error('ジョブ ID を取得できませんでした');
    }

    fdsRunTraceJobId = job.id;
    fdsSelectedJobId = job.id;
    upsertFdsJobInList(job);
    renderFdsJobsList();
    fdsSelectedJobDetail = job;
    fdsDetailUpdatedAt = Date.now();
    traceFdsJobProgress(job);
    renderFdsJobDetail();

    appendFdsRunLog('EC2 起動 API を呼び出しています…（AMI が pending の場合は自動で待機・再試行します）');
    const launchData = await requestFdsJobLaunchWithAmiRetry(job.id);
    applyFdsLaunchResult(launchData);

    alertEl.innerHTML = '<p class="alert alert-success">EC2 の起動リクエストまで完了しました。ログと右側の詳細で追跡してください。</p>';
    appendFdsRunLog('起動処理が完了しました。ジョブ状態をポーリングします。', { level: 'ok' });
    fileInput.value = '';
    if (titleInput) titleInput.value = '';

    syncFdsLivePolling();
    await refreshFdsJobList({ silent: true });
    await refreshFdsJobDetail();
  } catch (err) {
    appendFdsRunLog(err.message || 'エラーが発生しました', { level: 'error' });
    const extra = err.payload?.job ? `（ジョブ ID: ${err.payload.job.id}）` : '';
    alertEl.innerHTML = `<p class="alert alert-error">${escapeHtml(err.message)}${escapeHtml(extra)}</p>`;
    if (err.payload?.job) {
      fdsRunTraceJobId = err.payload.job.id;
      fdsSelectedJobId = err.payload.job.id;
      upsertFdsJobInList(err.payload.job);
      renderFdsJobsList();
      await refreshFdsJobDetail();
    } else {
      await refreshFdsJobList({ silent: true });
    }
  } finally {
    submitBtn.disabled = false;
  }
}

/** Cancels an active FDS job. */
async function handleFdsCancel(jobId) {
  if (!jobId || !confirm('このジョブをキャンセルしますか？')) return;
  try {
    const data = await apiRequest(`admin/fds-jobs/${jobId}/cancel`, { method: 'POST' });
    if (data.job) {
      upsertFdsJobInList(data.job);
      if (fdsSelectedJobId === jobId) {
        fdsSelectedJobDetail = data.job;
        fdsDetailUpdatedAt = Date.now();
      }
    }
    renderFdsJobsList();
    renderFdsJobDetail();
    await refreshFdsJobDetail();
  } catch (err) {
    alert(err.message);
  }
}

/** Re-runs a pending/failed FDS job. */
async function handleFdsRerun(jobId) {
  if (!jobId || !confirm('このジョブを再実行しますか？')) return;
  try {
    fdsRunTraceJobId = jobId;
    fdsSelectedJobId = jobId;
    fdsLastTraceSnapshot = null;
    appendFdsRunLog('再実行: EC2 起動 API を呼び出します…');
    const data = await requestFdsJobLaunchWithAmiRetry(jobId);
    applyFdsLaunchResult(data);
    await refreshFdsJobDetail();
    syncFdsLivePolling();
  } catch (err) {
    appendFdsRunLog(err.message, { level: 'error' });
    alert(err.message);
  }
}

/** Initializes the FDS test panel. */
export function initFdsTestPanel() {
  initFdsRequestQueue();
  const form = document.getElementById('fds-run-form');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    handleFdsRunSubmit(event);
  });
  document.getElementById('fds-run-btn')?.addEventListener('click', (event) => {
    handleFdsRunSubmit(event);
  });
  document.getElementById('fds-refresh-btn')?.addEventListener('click', () => {
    renderFdsConfig();
    refreshFdsJobList().then(() => refreshFdsJobDetail());
  });
}

/** Loads and renders the FDS test panel. */
export async function renderFdsTestPanel() {
  await renderFdsRequestQueue();
  await renderFdsConfig();
  await refreshFdsJobList();
  if (fdsSelectedJobId) {
    await refreshFdsJobDetail();
  } else {
    renderFdsJobDetail();
  }
  syncFdsLivePolling();
}

export { stopFdsLivePolling };
