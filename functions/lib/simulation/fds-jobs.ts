// functions/lib/simulation/fds-jobs.ts

export type FdsJobStatus =
  | "pending"
  | "launching"
  | "running"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "timed_out";

export interface FdsJob {
  id: string;
  title: string;
  input_r2_key: string;
  input_filename: string;
  input_size_bytes: number;
  output_r2_key: string | null;
  output_filename: string | null;
  output_size_bytes: number | null;
  log_r2_key: string | null;
  status: FdsJobStatus;
  status_message: string | null;
  ec2_instance_id: string | null;
  ec2_instance_type: string;
  launched_at: string | null;
  finished_at: string | null;
  created_by_user_id: string;
  created_at: string;
}

export interface FdsJobApiModel {
  id: string;
  title: string;
  input_filename: string;
  input_size_bytes: number;
  output_filename: string | null;
  output_size_bytes: number | null;
  status: FdsJobStatus;
  status_message: string | null;
  ec2_instance_id: string | null;
  ec2_instance_type: string;
  launched_at: string | null;
  finished_at: string | null;
  created_at: string;
  has_output: boolean;
  has_log: boolean;
}

export const FDS_JOB_MAX_RUNTIME_HOURS = 10;
export const FDS_DEFAULT_INSTANCE_TYPE = "t3.micro";
export const FDS_MAX_INPUT_BYTES = 50 * 1024 * 1024;

/** Validates an FDS input filename. */
export function validateFdsFilename(filename: string): string | null {
  const trimmed = filename.trim();
  if (!trimmed.toLowerCase().endsWith(".fds")) {
    return ".fds ファイルのみアップロードできます";
  }
  if (trimmed.length > 200) {
    return "ファイル名が長すぎます";
  }
  return null;
}

/** Sanitizes an FDS filename for R2 storage. */
export function sanitizeFdsFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 200);
}

/** Generates an R2 key for an FDS job input file. */
export function generateFdsInputR2Key(jobId: string, filename: string): string {
  return `fds-jobs/${jobId}/input/${sanitizeFdsFilename(filename)}`;
}

/** Generates an R2 key for FDS job output archive. */
export function generateFdsOutputR2Key(jobId: string): string {
  return `fds-jobs/${jobId}/output/results.zip`;
}

/** Generates an R2 key for FDS job runner log. */
export function generateFdsLogR2Key(jobId: string): string {
  return `fds-jobs/${jobId}/output/runner.log`;
}

/** Formats a job for API responses. */
export function formatFdsJobForApi(job: FdsJob): FdsJobApiModel {
  return {
    id: job.id,
    title: job.title,
    input_filename: job.input_filename,
    input_size_bytes: job.input_size_bytes,
    output_filename: job.output_filename,
    output_size_bytes: job.output_size_bytes,
    status: job.status,
    status_message: job.status_message,
    ec2_instance_id: job.ec2_instance_id,
    ec2_instance_type: job.ec2_instance_type,
    launched_at: job.launched_at,
    finished_at: job.finished_at,
    created_at: job.created_at,
    has_output: Boolean(job.output_r2_key),
    has_log: Boolean(job.log_r2_key),
  };
}

/** Fetches an FDS job by ID. */
export async function getFdsJobById(db: D1Database, id: string): Promise<FdsJob | null> {
  return db.prepare(`SELECT * FROM sim_fds_jobs WHERE id = ?`).bind(id).first<FdsJob>();
}

/** Lists recent FDS jobs. */
export async function listFdsJobs(db: D1Database, limit = 30): Promise<FdsJob[]> {
  const result = await db
    .prepare(`SELECT * FROM sim_fds_jobs ORDER BY created_at DESC LIMIT ?`)
    .bind(limit)
    .all<FdsJob>();
  return result.results ?? [];
}

/** Creates a pending FDS job record. */
export async function createFdsJob(
  db: D1Database,
  data: {
    id: string;
    title: string;
    inputR2Key: string;
    inputFilename: string;
    inputSizeBytes: number;
    instanceType: string;
    createdByUserId: string;
    createdAt: string;
  }
): Promise<FdsJob> {
  await db
    .prepare(
      `INSERT INTO sim_fds_jobs (
        id, title, input_r2_key, input_filename, input_size_bytes,
        status, ec2_instance_type, created_by_user_id, created_at
      ) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?)`
    )
    .bind(
      data.id,
      data.title,
      data.inputR2Key,
      data.inputFilename,
      data.inputSizeBytes,
      data.instanceType,
      data.createdByUserId,
      data.createdAt
    )
    .run();

  const job = await getFdsJobById(db, data.id);
  if (!job) throw new Error("FDS ジョブの作成に失敗しました");
  return job;
}

/** Marks a job as launching with an EC2 instance ID. */
export async function markFdsJobLaunching(
  db: D1Database,
  jobId: string,
  instanceId: string,
  launchedAt: string
): Promise<void> {
  await db
    .prepare(
      `UPDATE sim_fds_jobs
       SET status = 'launching', ec2_instance_id = ?, launched_at = ?, status_message = NULL
       WHERE id = ?`
    )
    .bind(instanceId, launchedAt, jobId)
    .run();
}

/** Updates job status fields. */
export async function updateFdsJobStatus(
  db: D1Database,
  jobId: string,
  status: FdsJobStatus,
  options: {
    statusMessage?: string | null;
    finishedAt?: string | null;
    outputR2Key?: string | null;
    outputFilename?: string | null;
    outputSizeBytes?: number | null;
    logR2Key?: string | null;
  } = {}
): Promise<void> {
  const fields: string[] = ["status = ?"];
  const values: Array<string | number | null> = [status];

  if (options.statusMessage !== undefined) {
    fields.push("status_message = ?");
    values.push(options.statusMessage);
  }
  if (options.finishedAt !== undefined) {
    fields.push("finished_at = ?");
    values.push(options.finishedAt);
  }
  if (options.outputR2Key !== undefined) {
    fields.push("output_r2_key = ?");
    values.push(options.outputR2Key);
  }
  if (options.outputFilename !== undefined) {
    fields.push("output_filename = ?");
    values.push(options.outputFilename);
  }
  if (options.outputSizeBytes !== undefined) {
    fields.push("output_size_bytes = ?");
    values.push(options.outputSizeBytes);
  }
  if (options.logR2Key !== undefined) {
    fields.push("log_r2_key = ?");
    values.push(options.logR2Key);
  }

  values.push(jobId);
  await db
    .prepare(`UPDATE sim_fds_jobs SET ${fields.join(", ")} WHERE id = ?`)
    .bind(...values)
    .run();
}

/** Returns active jobs that may need EC2 sync or timeout handling. */
export async function listActiveFdsJobs(db: D1Database): Promise<FdsJob[]> {
  const result = await db
    .prepare(
      `SELECT * FROM sim_fds_jobs
       WHERE status IN ('launching', 'running')
       ORDER BY launched_at ASC`
    )
    .all<FdsJob>();
  return result.results ?? [];
}

/** Deletes an FDS job record. */
export async function deleteFdsJob(db: D1Database, jobId: string): Promise<void> {
  await db.prepare(`DELETE FROM sim_fds_jobs WHERE id = ?`).bind(jobId).run();
}
