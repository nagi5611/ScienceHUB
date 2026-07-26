// functions/lib/simulation/fds-job-artifacts.ts
import { getFdsJobById, updateFdsJobStatus, type FdsJob, type FdsJobArtifactFlags } from "./fds-jobs";

export type { FdsJobArtifactFlags };

/** Syncs output size from R2 and returns whether artifacts are downloadable. */
export async function syncFdsJobArtifacts(
  env: { FILES: R2Bucket; DB: D1Database },
  job: FdsJob
): Promise<{ job: FdsJob; artifacts: FdsJobArtifactFlags }> {
  let hasOutput = false;
  let hasLog = false;

  if (job.output_r2_key) {
    const head = await env.FILES.head(job.output_r2_key);
    if (head && head.size > 0) {
      hasOutput = true;
      if (head.size !== job.output_size_bytes) {
        await updateFdsJobStatus(env.DB, job.id, job.status, {
          outputSizeBytes: head.size,
        });
      }
    }
  }

  if (job.log_r2_key) {
    const head = await env.FILES.head(job.log_r2_key);
    hasLog = Boolean(head && head.size > 0);
  }

  const refreshed = (await getFdsJobById(env.DB, job.id)) ?? job;
  return { job: refreshed, artifacts: { hasOutput, hasLog } };
}
