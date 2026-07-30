// functions/lib/simulation/openfoam-callback.ts
import type { Env } from "../types";
import { terminateEc2Instance, isAwsEc2Configured } from "../aws/ec2";
import { getOpenfoamJobById, updateOpenfoamJobStatus, type OpenfoamJobStatus } from "./openfoam-jobs";
import { readOpenfoamJobLogSnippet, syncOpenfoamJobArtifacts } from "./openfoam-job-artifacts";
import { classifyOpenfoamJobFailure } from "./openfoam-failure-category";

const CALLBACK_STATUSES = new Set<OpenfoamJobStatus>(["running", "succeeded", "failed", "timed_out"]);

/** Handles EC2 runner callback notifications. */
export async function handleOpenfoamJobCallback(
  env: Env,
  request: Request
): Promise<Response> {
  const secret = env.OPENFOAM_JOB_CALLBACK_SECRET?.trim();
  if (!secret) {
    return Response.json({ error: "コールバックが設定されていません" }, { status: 503 });
  }

  const auth = request.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token || token !== secret) {
    return Response.json({ error: "認証に失敗しました" }, { status: 401 });
  }

  let body: { job_id?: string; status?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON が不正です" }, { status: 400 });
  }

  const jobId = body.job_id?.trim();
  const status = body.status?.trim() as OpenfoamJobStatus | undefined;
  const message = body.message?.trim() || null;

  if (!jobId || !status || !CALLBACK_STATUSES.has(status)) {
    return Response.json({ error: "job_id または status が不正です" }, { status: 400 });
  }

  const job = await getOpenfoamJobById(env.DB, jobId);
  if (!job) {
    return Response.json({ error: "ジョブが見つかりません" }, { status: 404 });
  }

  if (status === "running") {
    await updateOpenfoamJobStatus(env.DB, jobId, "running", { statusMessage: message });
    return Response.json({ ok: true });
  }

  const finishedAt = new Date().toISOString();
  let failureCategory = null;
  if (status === "failed" || status === "timed_out") {
    const logSnippet = await readOpenfoamJobLogSnippet(env.FILES, job.log_r2_key);
    failureCategory = classifyOpenfoamJobFailure(status, message, logSnippet);
  }

  await updateOpenfoamJobStatus(env.DB, jobId, status, {
    statusMessage: message,
    finishedAt,
    failureCategory,
  });

  await syncOpenfoamJobArtifacts(env, (await getOpenfoamJobById(env.DB, jobId)) ?? job);

  if (
    job.ec2_instance_id &&
    isAwsEc2Configured(env) &&
    (status === "succeeded" || status === "failed" || status === "timed_out")
  ) {
    try {
      await terminateEc2Instance(env, job.ec2_instance_id);
    } catch {
      // Instance may already be shutting down via user-data trap.
    }
  }

  return Response.json({ ok: true });
}
