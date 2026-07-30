// functions/lib/simulation/openfoam-jobs.ts

import {
  openfoamFailureCategoryUserMessage,
  type OpenfoamFailureCategory,
} from "./openfoam-failure-category";

export type OpenfoamJobStatus =
  | "pending"
  | "launching"
  | "running"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "timed_out";

/** User-facing label when an OpenFOAM job run has finished or is in progress. */
export function openfoamJobStatusDisplayLabel(status: OpenfoamJobStatus): string {
  switch (status) {
    case "pending":
      return "待機中";
    case "launching":
      return "起動中";
    case "running":
      return "実行中";
    case "succeeded":
      return "完了_成功";
    case "failed":
    case "timed_out":
      return "完了_失敗";
    case "cancelled":
      return "キャンセル";
    default:
      return status;
  }
}

export interface OpenfoamJob {
  id: string;
  title: string;
  input_r2_key: string;
  input_filename: string;
  input_size_bytes: number;
  output_r2_key: string | null;
  output_filename: string | null;
  output_size_bytes: number | null;
  log_r2_key: string | null;
  status: OpenfoamJobStatus;
  status_message: string | null;
  ec2_instance_id: string | null;
  ec2_instance_type: string;
  max_runtime_hours: number;
  mpi_processes: number;
  launched_at: string | null;
  finished_at: string | null;
  created_by_user_id: string;
  created_at: string;
  input_sha256: string | null;
  output_sha256: string | null;
  openfoam_ami_id: string | null;
  openfoam_solver_version: string | null;
  failure_category: string | null;
}

export interface OpenfoamJobApiModel {
  id: string;
  title: string;
  input_filename: string;
  input_size_bytes: number;
  output_filename: string | null;
  output_size_bytes: number | null;
  status: OpenfoamJobStatus;
  status_message: string | null;
  ec2_instance_id: string | null;
  ec2_instance_type: string;
  max_runtime_hours: number;
  mpi_processes: number;
  launched_at: string | null;
  finished_at: string | null;
  created_at: string;
  has_output: boolean;
  has_log: boolean;
  ec2_instance_state: string | null;
  ec2_launch_time: string | null;
  input_sha256: string | null;
  output_sha256: string | null;
  openfoam_ami_id: string | null;
  openfoam_solver_version: string | null;
  failure_category: OpenfoamFailureCategory | null;
  failure_message: string | null;
}

export const OPENFOAM_JOB_MAX_RUNTIME_HOURS = 10;
export const OPENFOAM_DEFAULT_INSTANCE_TYPE = "hpc6a.48xlarge";
export const OPENFOAM_MAX_INPUT_BYTES = 50 * 1024 * 1024;

/** Artifact availability flags for API formatting. */
export interface OpenfoamJobArtifactFlags {
  hasOutput: boolean;
  hasLog: boolean;
}

/** Validates an OpenFOAM input filename. */
export function validateOpenfoamFilename(filename: string): string | null {
  const trimmed = filename.trim();
  if (!trimmed.toLowerCase().endsWith(".zip")) {
    return ".zip ファイルのみアップロードできます";
  }
  if (trimmed.length > 200) {
    return "ファイル名が長すぎます";
  }
  return null;
}

/** Sanitizes an OpenFOAM filename for R2 storage. */
export function sanitizeOpenfoamFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 200);
}

/** Generates an R2 key for an OpenFOAM job input file. */
export function generateOpenfoamInputR2Key(jobId: string, filename: string): string {
  return `openfoam-jobs/${jobId}/input/${sanitizeOpenfoamFilename(filename)}`;
}

/** Generates an R2 key for OpenFOAM job output archive. */
export function generateOpenfoamOutputR2Key(jobId: string): string {
  return `openfoam-jobs/${jobId}/output/results.zip`;
}

/** Generates an R2 key for OpenFOAM job runner log. */
export function generateOpenfoamLogR2Key(jobId: string): string {
  return `openfoam-jobs/${jobId}/output/runner.log`;
}

/** Live EC2 fields attached on detail API responses. */
export interface OpenfoamJobLiveEc2 {
  ec2_instance_state: string | null;
  ec2_launch_time: string | null;
}

/** Formats a job for API responses. */
export function formatOpenfoamJobForApi(
  job: OpenfoamJob,
  artifacts?: Partial<OpenfoamJobArtifactFlags>,
  liveEc2?: Partial<OpenfoamJobLiveEc2>
): OpenfoamJobApiModel {
  const hasOutput =
    artifacts?.hasOutput ?? (job.output_size_bytes !== null && job.output_size_bytes > 0);
  const hasLog = artifacts?.hasLog ?? false;

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
    max_runtime_hours: job.max_runtime_hours ?? OPENFOAM_JOB_MAX_RUNTIME_HOURS,
    mpi_processes: job.mpi_processes ?? 1,
    launched_at: job.launched_at,
    finished_at: job.finished_at,
    created_at: job.created_at,
    has_output: hasOutput,
    has_log: hasLog,
    ec2_instance_state: liveEc2?.ec2_instance_state ?? null,
    ec2_launch_time: liveEc2?.ec2_launch_time ?? null,
    input_sha256: job.input_sha256 ?? null,
    output_sha256: job.output_sha256 ?? null,
    openfoam_ami_id: job.openfoam_ami_id ?? null,
    openfoam_solver_version: job.openfoam_solver_version ?? null,
    failure_category: (job.failure_category as OpenfoamFailureCategory | null) ?? null,
    failure_message: job.failure_category
      ? openfoamFailureCategoryUserMessage(job.failure_category as OpenfoamFailureCategory)
      : null,
  };
}

/** Fetches an OpenFOAM job by ID. */
export async function getOpenfoamJobById(db: D1Database, id: string): Promise<OpenfoamJob | null> {
  return db.prepare(`SELECT * FROM sim_openfoam_jobs WHERE id = ?`).bind(id).first<OpenfoamJob>();
}

/** Lists recent OpenFOAM jobs. */
export async function listOpenfoamJobs(db: D1Database, limit = 30): Promise<OpenfoamJob[]> {
  const result = await db
    .prepare(`SELECT * FROM sim_openfoam_jobs ORDER BY created_at DESC LIMIT ?`)
    .bind(limit)
    .all<OpenfoamJob>();
  return result.results ?? [];
}

/** Creates a pending OpenFOAM job record. */
export async function createOpenfoamJob(
  db: D1Database,
  data: {
    id: string;
    title: string;
    inputR2Key: string;
    inputFilename: string;
    inputSizeBytes: number;
    instanceType: string;
    maxRuntimeHours?: number;
    mpiProcesses?: number;
    inputSha256?: string | null;
    createdByUserId: string;
    createdAt: string;
  }
): Promise<OpenfoamJob> {
  const maxRuntimeHours = data.maxRuntimeHours ?? OPENFOAM_JOB_MAX_RUNTIME_HOURS;
  const mpiProcesses = data.mpiProcesses ?? 1;

  await db
    .prepare(
      `INSERT INTO sim_openfoam_jobs (
        id, title, input_r2_key, input_filename, input_size_bytes,
        status, ec2_instance_type, max_runtime_hours, mpi_processes,
        created_by_user_id, created_at, input_sha256
      ) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      data.id,
      data.title,
      data.inputR2Key,
      data.inputFilename,
      data.inputSizeBytes,
      data.instanceType,
      maxRuntimeHours,
      mpiProcesses,
      data.createdByUserId,
      data.createdAt,
      data.inputSha256 ?? null
    )
    .run();

  const job = await getOpenfoamJobById(db, data.id);
  if (!job) throw new Error("OpenFOAM ジョブの作成に失敗しました");
  return job;
}

/** Marks a job as launching with an EC2 instance ID. */
export async function markOpenfoamJobLaunching(
  db: D1Database,
  jobId: string,
  instanceId: string,
  launchedAt: string
): Promise<void> {
  await db
    .prepare(
      `UPDATE sim_openfoam_jobs
       SET status = 'launching', ec2_instance_id = ?, launched_at = ?, status_message = NULL
       WHERE id = ?`
    )
    .bind(instanceId, launchedAt, jobId)
    .run();
}

/** Updates job status fields. */
export async function updateOpenfoamJobStatus(
  db: D1Database,
  jobId: string,
  status: OpenfoamJobStatus,
  options: {
    statusMessage?: string | null;
    finishedAt?: string | null;
    outputR2Key?: string | null;
    outputFilename?: string | null;
    outputSizeBytes?: number | null;
    logR2Key?: string | null;
    failureCategory?: OpenfoamFailureCategory | null;
    outputSha256?: string | null;
    openfoamAmiId?: string | null;
    openfoamSolverVersion?: string | null;
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
  if (options.failureCategory !== undefined) {
    fields.push("failure_category = ?");
    values.push(options.failureCategory);
  }
  if (options.outputSha256 !== undefined) {
    fields.push("output_sha256 = ?");
    values.push(options.outputSha256);
  }
  if (options.openfoamAmiId !== undefined) {
    fields.push("openfoam_ami_id = ?");
    values.push(options.openfoamAmiId);
  }
  if (options.openfoamSolverVersion !== undefined) {
    fields.push("openfoam_solver_version = ?");
    values.push(options.openfoamSolverVersion);
  }

  values.push(jobId);
  await db
    .prepare(`UPDATE sim_openfoam_jobs SET ${fields.join(", ")} WHERE id = ?`)
    .bind(...values)
    .run();
}

/** Returns active jobs that may need EC2 sync or timeout handling. */
export async function listActiveOpenfoamJobs(db: D1Database): Promise<OpenfoamJob[]> {
  const result = await db
    .prepare(
      `SELECT * FROM sim_openfoam_jobs
       WHERE status IN ('launching', 'running')
       ORDER BY launched_at ASC`
    )
    .all<OpenfoamJob>();
  return result.results ?? [];
}

/** Deletes an OpenFOAM job record. */
export async function deleteOpenfoamJob(db: D1Database, jobId: string): Promise<void> {
  await db.prepare(`DELETE FROM sim_openfoam_jobs WHERE id = ?`).bind(jobId).run();
}
