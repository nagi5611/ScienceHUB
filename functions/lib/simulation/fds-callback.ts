// functions/lib/simulation/fds-callback.ts
import type { Env } from "../types";
import { terminateEc2Instance, isAwsEc2Configured } from "../aws/ec2";
import { getFdsJobById, updateFdsJobStatus, type FdsJobStatus } from "./fds-jobs";

const CALLBACK_STATUSES = new Set<FdsJobStatus>(["running", "succeeded", "failed", "timed_out"]);

/** Handles EC2 runner callback notifications. */
export async function handleFdsJobCallback(
  env: Env,
  request: Request
): Promise<Response> {
  const secret = env.FDS_JOB_CALLBACK_SECRET?.trim();
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
  const status = body.status?.trim() as FdsJobStatus | undefined;
  const message = body.message?.trim() || null;

  if (!jobId || !status || !CALLBACK_STATUSES.has(status)) {
    return Response.json({ error: "job_id または status が不正です" }, { status: 400 });
  }

  const job = await getFdsJobById(env.DB, jobId);
  if (!job) {
    return Response.json({ error: "ジョブが見つかりません" }, { status: 404 });
  }

  if (status === "running") {
    await updateFdsJobStatus(env.DB, jobId, "running", { statusMessage: message });
    return Response.json({ ok: true });
  }

  const finishedAt = new Date().toISOString();
  await updateFdsJobStatus(env.DB, jobId, status, {
    statusMessage: message,
    finishedAt,
  });

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
