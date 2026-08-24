// functions/lib/simulation/fds-callback.ts
import type { Env } from "../types";
import { terminateEc2Instance, isAwsEc2Configured } from "../aws/ec2";
import {
  getFdsJobById,
  updateFdsJobProgress,
  updateFdsJobStatus,
  type FdsJobProgressPhase,
  type FdsJobStatus,
} from "./fds-jobs";
import { readFdsJobLogSnippet, syncFdsJobArtifacts } from "./fds-job-artifacts";
import { classifyFdsJobFailure } from "./fds-failure-category";
import { computeFdsProgressPct } from "./fds-format-review";

const CALLBACK_STATUSES = new Set<FdsJobStatus>(["running", "succeeded", "failed", "timed_out"]);
const PROGRESS_PHASES = new Set<FdsJobProgressPhase>(["computing", "finalizing"]);

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

  let body: {
    job_id?: string;
    status?: string;
    message?: string;
    simulation_time?: number;
    phase?: string;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON が不正です" }, { status: 400 });
  }

  const jobId = body.job_id?.trim();
  const status = body.status?.trim();
  const message = body.message?.trim() || null;

  if (!jobId || !status) {
    return Response.json({ error: "job_id または status が不正です" }, { status: 400 });
  }

  const job = await getFdsJobById(env.DB, jobId);
  if (!job) {
    return Response.json({ error: "ジョブが見つかりません" }, { status: 404 });
  }

  if (status === "progress") {
    const simulationTime = Number(body.simulation_time);
    if (!Number.isFinite(simulationTime) || simulationTime < 0) {
      return Response.json({ error: "simulation_time が不正です" }, { status: 400 });
    }

    const tEnd = job.t_end_seconds;
    if (tEnd == null || !Number.isFinite(tEnd) || tEnd <= 0) {
      return Response.json({ ok: true, skipped: "no_t_end" });
    }

    const phaseRaw = body.phase?.trim() as FdsJobProgressPhase | undefined;
    const progressPhase: FdsJobProgressPhase =
      phaseRaw && PROGRESS_PHASES.has(phaseRaw) ? phaseRaw : "computing";
    const progressPct =
      progressPhase === "finalizing"
        ? 95
        : computeFdsProgressPct(simulationTime, tEnd);

    await updateFdsJobProgress(env.DB, jobId, {
      simulationTimeSeconds: simulationTime,
      progressPct,
      progressPhase,
      progressUpdatedAt: new Date().toISOString(),
    });

    if (job.status === "launching") {
      await updateFdsJobStatus(env.DB, jobId, "running", {
        statusMessage: message ?? "FDS 実行中",
      });
    }

    return Response.json({ ok: true });
  }

  if (!CALLBACK_STATUSES.has(status as FdsJobStatus)) {
    return Response.json({ error: "job_id または status が不正です" }, { status: 400 });
  }

  const jobStatus = status as FdsJobStatus;

  if (jobStatus === "running") {
    await updateFdsJobStatus(env.DB, jobId, "running", { statusMessage: message });
    return Response.json({ ok: true });
  }

  const finishedAt = new Date().toISOString();
  let failureCategory = null;
  if (jobStatus === "failed" || jobStatus === "timed_out") {
    const logSnippet = await readFdsJobLogSnippet(env.FILES, job.log_r2_key);
    failureCategory = classifyFdsJobFailure(jobStatus, message, logSnippet);
  }

  await updateFdsJobStatus(env.DB, jobId, jobStatus, {
    statusMessage: message,
    finishedAt,
    failureCategory,
    progressPct: jobStatus === "succeeded" ? 100 : job.progress_pct,
    progressPhase: null,
    simulationTimeSeconds:
      jobStatus === "succeeded" && job.t_end_seconds != null ? job.t_end_seconds : job.simulation_time_seconds,
    progressUpdatedAt: finishedAt,
  });

  await syncFdsJobArtifacts(env, (await getFdsJobById(env.DB, jobId)) ?? job);

  if (
    job.ec2_instance_id &&
    isAwsEc2Configured(env) &&
    (jobStatus === "succeeded" || jobStatus === "failed" || jobStatus === "timed_out")
  ) {
    try {
      await terminateEc2Instance(env, job.ec2_instance_id);
    } catch {
      // Instance may already be shutting down via user-data trap.
    }
  }

  return Response.json({ ok: true });
}
