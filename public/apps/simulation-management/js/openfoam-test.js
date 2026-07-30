// public/apps/simulation-management/js/openfoam-test.js
import { apiFormRequest, apiRequest } from '../../simulation-request/js/api.js';
import { initOpenfoamRequestQueue, renderOpenfoamRequestQueue } from './openfoam-requests.js';

const OpenFOAM_STATUS_LABELS = {
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
async function fetchOpenfoamAmiFromConfig() {
  const data = await apiRequest('admin/openfoam-jobs/config');
  return data.ami ?? null;
}

/** Returns whether AMI is in a terminal bad state (no point retrying). */
function isAmiTerminalFailure(state) {
  return state === 'failed' || state === 'invalid' || state === 'not-found';
}

const OpenFOAM_ACTIVE_STATUSES = new Set(['pending', 'launching', 'running']);
const OpenFOAM_LIVE_POLL_MS = 4000;
const OpenFOAM_LAUNCH_RETRY_MAX = 24;
const OpenFOAM_LAUNCH_RETRY_DELAY_MS = 15_000;

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
async function requestOpenfoamJobLaunch(jobId) {
  const launchData = await apiRequest(`admin/openfoam-jobs/${jobId}/run`, { method: 'POST' });
  appendOpenfoamRunSteps(launchData.launch_steps);
  return launchData;
}

/** Retries launch while AWS reports the AMI is still pending. */
async function requestOpenfoamJobLaunchWithAmiRetry(jobId) {
  for (let attempt = 1; attempt <= OpenFOAM_LAUNCH_RETRY_MAX; attempt++) {
    const ami = await fetchOpenfoamAmiFromConfig();
    if (ami?.ami_id && ami.state) {
      const label = AMI_STATE_LABELS[ami.state] ?? ami.state;
      if (isAmiTerminalFailure(ami.state)) {
        const reason = ami.state_reason ? ` — ${ami.state_reason}` : '';
        throw new Error(`AMI ${ami.ami_id} は ${label} です${reason}。新しい AMI を作成し AWS_EC2_OpenFOAM_AMI_ID を更新してください。`);
      }
      if (ami.state !== 'available') {
        appendOpenfoamRunLog(`AMI ${ami.ami_id}: ${label}`);
      }
    }

    try {
      return await requestOpenfoamJobLaunch(jobId);
    } catch (err) {
      if (!isAmiPendingLaunchError(err) || attempt >= OpenFOAM_LAUNCH_RETRY_MAX) {
        throw err;
      }
      appendOpenfoamRunLog(
        `AMI がまだ利用可能ではありません。${OpenFOAM_LAUNCH_RETRY_DELAY_MS / 1000} 秒後に再試行 (${attempt}/${OpenFOAM_LAUNCH_RETRY_MAX})…`
      );
      await sleep(OpenFOAM_LAUNCH_RETRY_DELAY_MS);
    }
  }
  throw new Error('AMI が利用可能になるまで待ちましたがタイムアウトしました。EC2 コンソールで AMI が「利用可能」か確認し、「再実行」を押してください。');
}

/** Applies launch API response to UI state. */
function applyOpenfoamLaunchResult(launchData) {
  if (!launchData?.job) return;
  upsertOpenfoamJobInList(launchData.job);
  openfoamSelectedJobDetail = launchData.job;
  openfoamDetailUpdatedAt = Date.now();
  traceOpenfoamJobProgress(launchData.job);
  renderOpenfoamJobsList();
  renderOpenfoamJobDetail();
}

/** Formats ISO time for log lines. */
function formatLogTime(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '--:--:--';
  return date.toLocaleTimeString('ja-JP', { hour12: false });
}

/** Appends a line to the on-page run log. */
function appendOpenfoamRunLog(message, { level = 'info', at } = {}) {
  const stamp = at ?? new Date().toISOString();
  openfoamRunLogLines.push({ at: stamp, message, level });
  renderOpenfoamRunLog();
}

/** Renders the run log panel. */
function renderOpenfoamRunLog() {
  const wrap = document.getElementById('openfoam-run-log-wrap');
  const pre = document.getElementById('openfoam-run-log');
  if (!wrap || !pre) return;
  if (!openfoamRunLogLines.length) {
    wrap.hidden = true;
    pre.textContent = '';
    return;
  }
  wrap.hidden = false;
  pre.innerHTML = openfoamRunLogLines
    .map((line) => {
      const cls =
        line.level === 'error' ? 'openfoam-run-log-line-error' : line.level === 'ok' ? 'openfoam-run-log-line-ok' : '';
      return `<span class="${cls}">[${formatLogTime(line.at)}] ${escapeHtml(line.message)}</span>`;
    })
    .join('\n');
  pre.scrollTop = pre.scrollHeight;
}

/** Clears the run log and optional trace target. */
function clearOpenfoamRunLog() {
  openfoamRunLogLines.length = 0;
  openfoamRunTraceJobId = null;
  openfoamLastTraceSnapshot = null;
  renderOpenfoamRunLog();
}

/** Merges server step objects into the run log. */
function appendOpenfoamRunSteps(steps) {
  if (!Array.isArray(steps)) return;
  for (const step of steps) {
    if (!step?.message) continue;
    appendOpenfoamRunLog(step.message, { at: step.at, level: 'info' });
  }
}

/** Logs job / EC2 changes while tracing a submitted job. */
function traceOpenfoamJobProgress(job) {
  if (!job || job.id !== openfoamRunTraceJobId) return;
  const snap = {
    status: job.status,
    status_message: job.status_message ?? '',
    ec2_instance_id: job.ec2_instance_id ?? '',
    ec2_instance_state: job.ec2_instance_state ?? '',
  };
  if (!openfoamLastTraceSnapshot) {
    openfoamLastTraceSnapshot = snap;
    appendOpenfoamRunLog(`ジョブ状態: ${OpenFOAM_STATUS_LABELS[job.status] ?? job.status}`, { level: 'info' });
    if (job.ec2_instance_id) {
      appendOpenfoamRunLog(`EC2: ${job.ec2_instance_id}`, { level: 'info' });
    }
    if (job.ec2_instance_state) {
      appendOpenfoamRunLog(`EC2 状態 (AWS): ${EC2_STATE_LABELS[job.ec2_instance_state] ?? job.ec2_instance_state}`, {
        level: 'info',
      });
    }
    return;
  }
  if (snap.status !== openfoamLastTraceSnapshot.status) {
    appendOpenfoamRunLog(`ジョブ状態が更新: ${OpenFOAM_STATUS_LABELS[snap.status] ?? snap.status}`, {
      level: ['succeeded', 'failed', 'timed_out', 'cancelled'].includes(snap.status) ? 'ok' : 'info',
    });
    if (snap.status === 'succeeded') {
      appendOpenfoamRunLog('完了_成功 — 詳細パネルの「実行結果 ZIP」からダウンロードできます。', {
        level: 'ok',
      });
    }
    if (snap.status === 'failed' || snap.status === 'timed_out') {
      appendOpenfoamRunLog('完了_失敗 — 実行ログを確認してください。', { level: 'error' });
    }
  }
  if (snap.status_message !== openfoamLastTraceSnapshot.status_message && snap.status_message) {
    appendOpenfoamRunLog(snap.status_message, { level: 'info' });
  }
  if (snap.ec2_instance_id && snap.ec2_instance_id !== openfoamLastTraceSnapshot.ec2_instance_id) {
    appendOpenfoamRunLog(`EC2 インスタンス ID: ${snap.ec2_instance_id}`, { level: 'info' });
  }
  if (snap.ec2_instance_state && snap.ec2_instance_state !== openfoamLastTraceSnapshot.ec2_instance_state) {
    appendOpenfoamRunLog(
      `EC2 状態 (AWS): ${EC2_STATE_LABELS[snap.ec2_instance_state] ?? snap.ec2_instance_state}`,
      { level: 'info' }
    );
  }
  openfoamLastTraceSnapshot = snap;
}
let openfoamLiveTimer = null;
let openfoamJobs = [];
let openfoamSelectedJobId = null;
let openfoamSelectedJobDetail = null;
let openfoamDetailUpdatedAt = null;
let openfoamListLoading = false;
let openfoamRunTraceJobId = null;
let openfoamLastTraceSnapshot = null;
const openfoamRunLogLines = [];

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
function isOpenfoamJobActive(job) {
  return job && OpenFOAM_ACTIVE_STATUSES.has(job.status);
}

/** Returns whether we should keep polling (active, or waiting for R2 artifacts after finish). */
function openfoamJobNeedsLiveUpdates(job) {
  if (!job) return false;
  if (isOpenfoamJobActive(job)) return true;
  if (job.status === 'succeeded' && !job.has_output) return true;
  if (job.id === openfoamRunTraceJobId && ['succeeded', 'failed', 'timed_out'].includes(job.status)) {
    const finishedMs = job.finished_at ? Date.parse(job.finished_at) : NaN;
    if (!Number.isNaN(finishedMs) && Date.now() - finishedMs < 120_000) return true;
  }
  return false;
}

/** Renders AWS / R2 configuration status. */
async function renderOpenfoamConfig() {
  const mount = document.getElementById('openfoam-config-mount');
  if (!mount) return;

  try {
    const data = await apiRequest('admin/openfoam-jobs/config');
    const aws = data.aws ?? {};
    const ami = data.ami ?? {};
    const amiStateLabel = ami.state ? AMI_STATE_LABELS[ami.state] ?? ami.state : '未確認';
    const amiOk = ami.runnable === true;
    const items = [
      { label: 'AWS 認証情報', ok: aws.configured || (aws.amiConfigured && aws.networkConfigured) },
      {
        label: 'OpenFOAM AMI',
        ok: amiOk,
        detail: ami.ami_id
          ? `${ami.ami_id} — ${amiStateLabel}${ami.state_reason && !amiOk ? `（${ami.state_reason}）` : ''}`
          : 'AWS_EC2_OpenFOAM_AMI_ID 未設定',
      },
      { label: 'VPC（サブネット / SG）', ok: aws.networkConfigured },
      { label: 'R2 presigned URL', ok: data.r2_presign },
      { label: 'コールバック秘密鍵', ok: data.callback_secret },
    ];

    const secretsOk = items.filter((item) => item.label !== 'OpenFOAM AMI').every((item) => item.ok);
    const allOk = secretsOk && amiOk;
    mount.innerHTML = `
      <p class="hint">リージョン: <strong>${escapeHtml(aws.region ?? 'ap-northeast-1')}</strong> /
      インスタンス: <strong>${escapeHtml(data.default_instance_type ?? 't3.micro')}</strong> /
      最大実行: <strong>${data.max_runtime_hours ?? 10} 時間</strong></p>
      <ul class="openfoam-config-list">
        ${items
          .map(
            (item) =>
              `<li class="${item.ok ? 'openfoam-config-ok' : 'openfoam-config-ng'}">${item.ok ? '✓' : '✗'} ${escapeHtml(item.label)}${
                item.detail ? `<br><span class="hint">${escapeHtml(item.detail)}</span>` : ''
              }</li>`
          )
          .join('')}
      </ul>
      ${
        allOk
          ? '<p class="hint openfoam-config-ready">テスト実行の準備ができています。</p>'
          : secretsOk && ami.ami_id && !amiOk
            ? '<p class="alert alert-error">AMI が「利用可能」になるまで実行できません。failed の場合は AMI を作り直し、Wrangler の <code>AWS_EC2_OpenFOAM_AMI_ID</code> を更新してください。</p>'
            : `<p class="alert alert-error">設定が不足しています。<code>infra/openfoam-test/README.md</code> を参照して AWS / Wrangler シークレットを設定してください。</p>`
      }
    `;
  } catch (err) {
    mount.innerHTML = `<p class="alert alert-error">${escapeHtml(err.message)}</p>`;
  }
}

/** Builds download and action controls for a job. */
function buildOpenfoamJobActions(job) {
  const actions = [];
  actions.push(
    `<a class="btn btn-secondary btn-sm" href="/api/simulation/admin/openfoam-jobs/${job.id}/input/download" download>入力 .openfoam</a>`
  );
  if (job.has_output) {
    const sizeHint = job.output_size_bytes ? ` (${formatSize(job.output_size_bytes)})` : '';
    actions.push(
      `<a class="btn btn-primary btn-sm" href="/api/simulation/admin/openfoam-jobs/${job.id}/output/download" download>実行結果 ZIP${sizeHint}</a>`
    );
  } else if (['succeeded', 'failed', 'timed_out'].includes(job.status)) {
    actions.push(`<span class="hint">結果 ZIP 準備中…</span>`);
  }
  if (job.has_log) {
    actions.push(
      `<a class="btn btn-secondary btn-sm" href="/api/simulation/admin/openfoam-jobs/${job.id}/log/download" download>実行ログ</a>`
    );
  }
  if (['pending', 'failed', 'cancelled'].includes(job.status)) {
    actions.push(
      `<button type="button" class="btn btn-secondary btn-sm openfoam-job-rerun" data-id="${escapeHtml(job.id)}">再実行</button>`
    );
  }
  if (['launching', 'running', 'pending'].includes(job.status)) {
    actions.push(
      `<button type="button" class="btn btn-secondary btn-sm openfoam-job-cancel" data-id="${escapeHtml(job.id)}">キャンセル</button>`
    );
  }
  return actions.join(' ');
}

/** Merges a job into the in-memory list (by id). */
function upsertOpenfoamJobInList(job) {
  if (!job?.id) return;
  const index = openfoamJobs.findIndex((item) => item.id === job.id);
  if (index >= 0) {
    openfoamJobs[index] = job;
  } else {
    openfoamJobs = [job, ...openfoamJobs];
  }
}

/** Selects a job and loads its live detail. */
async function selectOpenfoamJob(jobId) {
  openfoamSelectedJobId = jobId;
  renderOpenfoamJobsList();
  await refreshOpenfoamJobDetail();
  syncOpenfoamLivePolling();
}

/** Renders the job list from in-memory state. */
function renderOpenfoamJobsList() {
  const mount = document.getElementById('openfoam-jobs-list-mount');
  if (!mount) return;

  if (openfoamListLoading && !openfoamJobs.length) {
    mount.innerHTML = '<p class="hint">読み込み中...</p>';
    return;
  }

  if (!openfoamJobs.length) {
    mount.innerHTML = '<p class="hint">まだジョブがありません。上のフォームから投入してください。</p>';
    return;
  }

  mount.innerHTML = `
    <div class="openfoam-jobs-table-wrap">
      <table class="admin-table openfoam-jobs-table">
        <thead>
          <tr>
            <th>タイトル</th>
            <th>状態</th>
            <th>結果</th>
            <th>作成</th>
          </tr>
        </thead>
        <tbody>
          ${openfoamJobs
            .map((job) => {
              const selected = job.id === openfoamSelectedJobId;
              const resultCell =
                job.status === 'succeeded' && job.has_output
                  ? `<a class="btn btn-primary btn-sm openfoam-job-list-dl" href="/api/simulation/admin/openfoam-jobs/${escapeHtml(job.id)}/output/download" download onclick="event.stopPropagation()">ZIP</a>`
                  : job.status === 'succeeded'
                    ? '<span class="hint">準備中</span>'
                    : '—';
              return `
              <tr class="openfoam-job-row${selected ? ' openfoam-job-row-selected' : ''}" data-job-id="${escapeHtml(job.id)}" tabindex="0" role="button">
                <td>
                  <strong>${escapeHtml(job.title)}</strong>
                  <div class="hint">${escapeHtml(job.input_filename)}</div>
                </td>
                <td><span class="status-badge status-${job.status}">${OpenFOAM_STATUS_LABELS[job.status] ?? job.status}</span></td>
                <td>${resultCell}</td>
                <td><span class="hint">${formatDateTime(job.created_at)}</span></td>
              </tr>`;
            })
            .join('')}
        </tbody>
      </table>
    </div>
  `;

  mount.querySelectorAll('.openfoam-job-row').forEach((row) => {
    const jobId = row.dataset.jobId;
    row.addEventListener('click', () => {
      selectOpenfoamJob(jobId).catch(() => {});
    });
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectOpenfoamJob(jobId).catch(() => {});
      }
    });
  });
}

/** Renders the selected job detail panel. */
function renderOpenfoamJobDetail() {
  const mount = document.getElementById('openfoam-job-detail-mount');
  if (!mount) return;

  if (!openfoamSelectedJobId) {
    mount.innerHTML = '<p class="hint openfoam-job-detail-placeholder">ジョブを選択してください。</p>';
    return;
  }

  const job = openfoamSelectedJobDetail;
  if (!job || job.id !== openfoamSelectedJobId) {
    mount.innerHTML = '<p class="hint">状態を取得しています…</p>';
    return;
  }

  const ec2StateLabel = job.ec2_instance_state
    ? EC2_STATE_LABELS[job.ec2_instance_state] ?? job.ec2_instance_state
    : job.ec2_instance_id
      ? '確認中…'
      : '—';

  const showLive = openfoamJobNeedsLiveUpdates(job);

  mount.innerHTML = `
    ${showLive ? '<p class="openfoam-job-detail-live">ライブ更新中</p>' : ''}
    ${job.status === 'succeeded' ? '<p class="alert alert-success openfoam-job-complete-banner">完了_成功 — 下のボタンから実行結果をダウンロードできます。</p>' : ''}
    ${job.status === 'failed' || job.status === 'timed_out' ? '<p class="alert alert-error openfoam-job-complete-banner">完了_失敗 — ログを確認してください。</p>' : ''}
    <h3>${escapeHtml(job.title)}</h3>
    <p><span class="status-badge status-${job.status}">${OpenFOAM_STATUS_LABELS[job.status] ?? job.status}</span></p>
    ${job.status_message ? `<p class="hint">${escapeHtml(job.status_message)}</p>` : ''}
    <dl class="openfoam-job-detail-meta">
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
    <div class="openfoam-job-detail-dl openfoam-job-actions">${buildOpenfoamJobActions(job)}</div>
    ${
      openfoamDetailUpdatedAt
        ? `<p class="hint openfoam-job-detail-updated">最終更新: ${formatDateTime(new Date(openfoamDetailUpdatedAt).toISOString())}</p>`
        : ''
    }
  `;

  mount.querySelectorAll('.openfoam-job-cancel').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      handleOpenfoamCancel(btn.dataset.id);
    });
  });
  mount.querySelectorAll('.openfoam-job-rerun').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      handleOpenfoamRerun(btn.dataset.id);
    });
  });
}

/** Fetches all jobs and updates the list. */
async function refreshOpenfoamJobList({ silent = false } = {}) {
  const mount = document.getElementById('openfoam-jobs-list-mount');
  if (!silent && mount && !openfoamJobs.length) {
    openfoamListLoading = true;
    renderOpenfoamJobsList();
  }

  try {
    const data = await apiRequest('admin/openfoam-jobs');
    openfoamJobs = data.jobs ?? [];
    openfoamListLoading = false;

    if (openfoamSelectedJobId && !openfoamJobs.some((job) => job.id === openfoamSelectedJobId)) {
      openfoamSelectedJobId = openfoamJobs[0]?.id ?? null;
    }

    renderOpenfoamJobsList();
    syncOpenfoamLivePolling();
  } catch (err) {
    openfoamListLoading = false;
    if (mount) {
      mount.innerHTML = `<p class="alert alert-error">${escapeHtml(err.message)}</p>`;
    }
    throw err;
  }
}

/** Fetches live detail for the selected job. */
async function refreshOpenfoamJobDetail() {
  if (!openfoamSelectedJobId) {
    openfoamSelectedJobDetail = null;
    renderOpenfoamJobDetail();
    return;
  }

  try {
    const data = await apiRequest(`admin/openfoam-jobs/${openfoamSelectedJobId}`);
    openfoamSelectedJobDetail = data.job ?? null;
    openfoamDetailUpdatedAt = Date.now();
    if (openfoamSelectedJobDetail) {
      upsertOpenfoamJobInList(openfoamSelectedJobDetail);
      traceOpenfoamJobProgress(openfoamSelectedJobDetail);
      renderOpenfoamJobsList();
    }
    renderOpenfoamJobDetail();
    syncOpenfoamLivePolling();
  } catch (err) {
    const mount = document.getElementById('openfoam-job-detail-mount');
    if (mount) {
      mount.innerHTML = `<p class="alert alert-error">${escapeHtml(err.message)}</p>`;
    }
    throw err;
  }
}

/** One live polling tick (list + detail). */
async function tickOpenfoamLive() {
  const panel = document.getElementById('panel-openfoam-test');
  if (!panel || panel.classList.contains('hidden')) {
    stopOpenfoamLivePolling();
    return;
  }

  const tasks = [refreshOpenfoamJobList({ silent: true })];
  if (openfoamSelectedJobId) {
    tasks.push(refreshOpenfoamJobDetail());
  }
  await Promise.allSettled(tasks);
}

/** Starts or stops polling based on active jobs. */
function syncOpenfoamLivePolling() {
  const panel = document.getElementById('panel-openfoam-test');
  if (!panel || panel.classList.contains('hidden')) {
    stopOpenfoamLivePolling();
    return;
  }

  const detailActive = openfoamSelectedJobDetail && openfoamJobNeedsLiveUpdates(openfoamSelectedJobDetail);
  const anyActive = openfoamJobs.some(openfoamJobNeedsLiveUpdates);
  if (!detailActive && !anyActive) {
    stopOpenfoamLivePolling();
    return;
  }

  if (!openfoamLiveTimer) {
    openfoamLiveTimer = window.setInterval(() => {
      tickOpenfoamLive().catch(() => {});
    }, OpenFOAM_LIVE_POLL_MS);
  }
}

/** Stops live polling. */
function stopOpenfoamLivePolling() {
  if (!openfoamLiveTimer) return;
  window.clearInterval(openfoamLiveTimer);
  openfoamLiveTimer = null;
}

/** Submits a new OpenFOAM test run (stays on page; logs each step). */
async function handleOpenfoamRunSubmit(event) {
  event?.preventDefault?.();
  const alertEl = document.getElementById('openfoam-run-alert');
  const submitBtn = document.getElementById('openfoam-run-btn');
  const fileInput = document.getElementById('openfoam-file');
  const titleInput = document.getElementById('openfoam-title');

  const file = fileInput?.files?.[0];
  if (!file) {
    alertEl.innerHTML = '<p class="alert alert-error">.openfoam ファイルを選択してください</p>';
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  if (titleInput?.value?.trim()) {
    formData.append('title', titleInput.value.trim());
  }

  clearOpenfoamRunLog();
  submitBtn.disabled = true;
  alertEl.innerHTML = '<p class="hint">処理中です。この画面のままログを確認できます。</p>';
  appendOpenfoamRunLog(`ファイルを選択: ${file.name} (${formatSize(file.size)})`);

  try {
    const ami = await fetchOpenfoamAmiFromConfig();
    if (ami?.ami_id && !ami.runnable) {
      const label = AMI_STATE_LABELS[ami.state] ?? ami.state ?? '不明';
      const reason = ami.state_reason ? ` ${ami.state_reason}` : '';
      alertEl.innerHTML = `<p class="alert alert-error">AMI が起動可能な状態ではありません（${escapeHtml(label)}）。${escapeHtml(reason)}</p>`;
      appendOpenfoamRunLog(`中止: AMI ${ami.ami_id} は ${label} です。${reason}`, { level: 'error' });
      return;
    }

    appendOpenfoamRunLog('R2 へアップロードしてジョブを作成しています…');
    const uploadData = await apiFormRequest('admin/openfoam-jobs/run', formData);
    appendOpenfoamRunSteps(uploadData.upload_steps);
    const job = uploadData.job;
    if (!job?.id) {
      throw new Error('ジョブ ID を取得できませんでした');
    }

    openfoamRunTraceJobId = job.id;
    openfoamSelectedJobId = job.id;
    upsertOpenfoamJobInList(job);
    renderOpenfoamJobsList();
    openfoamSelectedJobDetail = job;
    openfoamDetailUpdatedAt = Date.now();
    traceOpenfoamJobProgress(job);
    renderOpenfoamJobDetail();

    appendOpenfoamRunLog('EC2 起動 API を呼び出しています…（AMI が pending の場合は自動で待機・再試行します）');
    const launchData = await requestOpenfoamJobLaunchWithAmiRetry(job.id);
    applyOpenfoamLaunchResult(launchData);

    alertEl.innerHTML = '<p class="alert alert-success">EC2 の起動リクエストまで完了しました。ログと右側の詳細で追跡してください。</p>';
    appendOpenfoamRunLog('起動処理が完了しました。ジョブ状態をポーリングします。', { level: 'ok' });
    fileInput.value = '';
    if (titleInput) titleInput.value = '';

    syncOpenfoamLivePolling();
    await refreshOpenfoamJobList({ silent: true });
    await refreshOpenfoamJobDetail();
  } catch (err) {
    appendOpenfoamRunLog(err.message || 'エラーが発生しました', { level: 'error' });
    const extra = err.payload?.job ? `（ジョブ ID: ${err.payload.job.id}）` : '';
    alertEl.innerHTML = `<p class="alert alert-error">${escapeHtml(err.message)}${escapeHtml(extra)}</p>`;
    if (err.payload?.job) {
      openfoamRunTraceJobId = err.payload.job.id;
      openfoamSelectedJobId = err.payload.job.id;
      upsertOpenfoamJobInList(err.payload.job);
      renderOpenfoamJobsList();
      await refreshOpenfoamJobDetail();
    } else {
      await refreshOpenfoamJobList({ silent: true });
    }
  } finally {
    submitBtn.disabled = false;
  }
}

/** Cancels an active OpenFOAM job. */
async function handleOpenfoamCancel(jobId) {
  if (!jobId || !confirm('このジョブをキャンセルしますか？')) return;
  try {
    const data = await apiRequest(`admin/openfoam-jobs/${jobId}/cancel`, { method: 'POST' });
    if (data.job) {
      upsertOpenfoamJobInList(data.job);
      if (openfoamSelectedJobId === jobId) {
        openfoamSelectedJobDetail = data.job;
        openfoamDetailUpdatedAt = Date.now();
      }
    }
    renderOpenfoamJobsList();
    renderOpenfoamJobDetail();
    await refreshOpenfoamJobDetail();
  } catch (err) {
    alert(err.message);
  }
}

/** Re-runs a pending/failed OpenFOAM job. */
async function handleOpenfoamRerun(jobId) {
  if (!jobId || !confirm('このジョブを再実行しますか？')) return;
  try {
    openfoamRunTraceJobId = jobId;
    openfoamSelectedJobId = jobId;
    openfoamLastTraceSnapshot = null;
    appendOpenfoamRunLog('再実行: EC2 起動 API を呼び出します…');
    const data = await requestOpenfoamJobLaunchWithAmiRetry(jobId);
    applyOpenfoamLaunchResult(data);
    await refreshOpenfoamJobDetail();
    syncOpenfoamLivePolling();
  } catch (err) {
    appendOpenfoamRunLog(err.message, { level: 'error' });
    alert(err.message);
  }
}

/** Initializes the OpenFOAM test panel. */
export function initOpenfoamTestPanel() {
  initOpenfoamRequestQueue();
  const form = document.getElementById('openfoam-run-form');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    handleOpenfoamRunSubmit(event);
  });
  document.getElementById('openfoam-run-btn')?.addEventListener('click', (event) => {
    handleOpenfoamRunSubmit(event);
  });
  document.getElementById('openfoam-refresh-btn')?.addEventListener('click', () => {
    renderOpenfoamConfig();
    refreshOpenfoamJobList().then(() => refreshOpenfoamJobDetail());
  });
}

/** Loads and renders the OpenFOAM test panel. */
export async function renderOpenfoamTestPanel() {
  await renderOpenfoamRequestQueue();
  await renderOpenfoamConfig();
  await refreshOpenfoamJobList();
  if (openfoamSelectedJobId) {
    await refreshOpenfoamJobDetail();
  } else {
    renderOpenfoamJobDetail();
  }
  syncOpenfoamLivePolling();
}

export { stopOpenfoamLivePolling };
