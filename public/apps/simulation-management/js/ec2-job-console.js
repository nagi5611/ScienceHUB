// public/apps/simulation-management/js/ec2-job-console.js

/** Fetches EC2 instance console output for an admin job. */
export async function fetchEc2JobConsole(apiRequest, apiPrefix, jobId) {
  const data = await apiRequest(`${apiPrefix}/${encodeURIComponent(jobId)}/console`);
  return {
    output: typeof data.output === 'string' ? data.output : '',
    timestamp: data.timestamp ?? null,
    instanceState: data.instance_state ?? null,
    message: data.message ?? null,
  };
}

/** Returns whether a job may still receive console updates. */
export function ec2ConsolePollActive(job) {
  if (!job?.ec2_instance_id) return false;
  if (['launching', 'running', 'pending'].includes(job.status)) return true;
  if (!['succeeded', 'failed', 'timed_out', 'cancelled'].includes(job.status)) return false;
  const finishedMs = job.finished_at ? Date.parse(job.finished_at) : NaN;
  if (Number.isNaN(finishedMs)) return false;
  return Date.now() - finishedMs < 120_000;
}

/** Escapes HTML for safe pre rendering. */
export function escapeConsoleHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

/** Renders console text into a pre element and auto-scrolls to bottom. */
export function renderEc2ConsolePre(pre, output, { emptyHint } = {}) {
  if (!pre) return;
  const text = output?.trim() ? output : emptyHint ?? '（まだコンソール出力がありません。起動直後は数分かかることがあります）';
  pre.textContent = text;
  pre.scrollTop = pre.scrollHeight;
}

/** Shows or hides a console wrap element. */
export function setEc2ConsoleWrapVisible(wrap, visible) {
  if (!wrap) return;
  wrap.hidden = !visible;
}
