// functions/lib/simulation/fds-job-artifacts.ts
import { sha256HexFromBuffer } from "./fds-content-hash";
import { getFdsJobById, updateFdsJobStatus, type FdsJob, type FdsJobArtifactFlags } from "./fds-jobs";

export type { FdsJobArtifactFlags };

const MAX_OUTPUT_HASH_BYTES = 200 * 1024 * 1024;

/** Syncs output size from R2 and returns whether artifacts are downloadable. */
export async function syncFdsJobArtifacts(
  env: { FILES: R2Bucket; DB: D1Database },
  job: FdsJob
): Promise<{ job: FdsJob; artifacts: FdsJobArtifactFlags }> {
  let hasOutput = false;
  let hasLog = false;
  let outputSha256: string | null | undefined;

  if (job.output_r2_key) {
    const head = await env.FILES.head(job.output_r2_key);
    if (head && head.size > 0) {
      hasOutput = true;
      const sizeChanged = head.size !== job.output_size_bytes;
      const needsHash = !job.output_sha256 && head.size <= MAX_OUTPUT_HASH_BYTES;
      if (needsHash) {
        const object = await env.FILES.get(job.output_r2_key);
        if (object) {
          outputSha256 = await sha256HexFromBuffer(await object.arrayBuffer());
        }
      }
      if (sizeChanged || outputSha256) {
        await updateFdsJobStatus(env.DB, job.id, job.status, {
          outputSizeBytes: head.size,
          outputSha256: outputSha256 ?? undefined,
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

/** Reads a short tail of the runner log for failure classification. */
export async function readFdsJobLogSnippet(
  bucket: R2Bucket,
  logR2Key: string | null,
  maxBytes = 16_000
): Promise<string | null> {
  if (!logR2Key) return null;
  const object = await bucket.get(logR2Key);
  if (!object) return null;
  const buffer = await object.arrayBuffer();
  if (buffer.byteLength <= maxBytes) {
    return new TextDecoder("utf-8").decode(buffer);
  }
  return new TextDecoder("utf-8").decode(buffer.slice(buffer.byteLength - maxBytes));
}
