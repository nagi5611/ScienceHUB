// functions/lib/simulation/fds-ec2-runner.ts
import type { Env } from "../types";
import { describeEc2Instance, isAwsEc2Configured, runEc2Instance, terminateEc2Instance } from "../aws/ec2";
import { presignGetObject, presignPutObject } from "../r2-presign";
import {
  FDS_DEFAULT_INSTANCE_TYPE,
  FDS_JOB_MAX_RUNTIME_HOURS,
  generateFdsLogR2Key,
  generateFdsOutputR2Key,
  getFdsJobById,
  markFdsJobLaunching,
  updateFdsJobStatus,
  type FdsJob,
} from "./fds-jobs";

export interface FdsAwsConfig {
  configured: boolean;
  region: string;
  instanceType: string;
  amiConfigured: boolean;
  networkConfigured: boolean;
}

/** Returns whether FDS EC2 runner prerequisites are configured. */
export function getFdsAwsConfig(env: Env): FdsAwsConfig {
  const region = env.AWS_REGION?.trim() || "ap-northeast-1";
  const instanceType = env.AWS_EC2_INSTANCE_TYPE?.trim() || FDS_DEFAULT_INSTANCE_TYPE;
  const amiConfigured = Boolean(env.AWS_EC2_FDS_AMI_ID?.trim());
  const networkConfigured = Boolean(
    env.AWS_EC2_SUBNET_ID?.trim() && env.AWS_EC2_SECURITY_GROUP_ID?.trim()
  );

  return {
    configured: isAwsEc2Configured(env) && amiConfigured && networkConfigured,
    region,
    instanceType,
    amiConfigured,
    networkConfigured,
  };
}

/** Builds EC2 user-data script for an FDS test job. */
export function buildFdsUserDataScript(options: {
  jobId: string;
  inputUrl: string;
  outputUrl: string;
  logUrl: string;
  callbackUrl: string;
  callbackSecret: string;
  inputFilename: string;
  maxRuntimeHours: number;
}): string {
  const fdsBinary = "/opt/fds/bin/fds";
  const maxRuntimeSec = options.maxRuntimeHours * 3600;

  return `#!/bin/bash
set -euo pipefail
exec > >(tee /var/log/sciencehub-fds-runner.log) 2>&1

JOB_ID="${options.jobId}"
WORKDIR="/tmp/sciencehub-fds-\${JOB_ID}"
INPUT_FILE="${options.inputFilename}"
CALLBACK_URL="${options.callbackUrl}"
CALLBACK_SECRET="${options.callbackSecret}"
MAX_RUNTIME_SEC=${maxRuntimeSec}
FDS_BIN="${fdsBinary}"

notify() {
  local status="$1"
  local message="$2"
  curl -fsS -X POST "$CALLBACK_URL" \\
    -H "Content-Type: application/json" \\
    -H "Authorization: Bearer $CALLBACK_SECRET" \\
    -d "$(printf '{"job_id":"%s","status":"%s","message":"%s"}' "$JOB_ID" "$status" "$message")" \\
    || true
}

upload_log() {
  if [ -f /var/log/sciencehub-fds-runner.log ]; then
    curl -fsS -X PUT -T /var/log/sciencehub-fds-runner.log "${options.logUrl}" || true
  fi
}

cleanup() {
  upload_log
  shutdown -h now
}
trap cleanup EXIT

notify "running" "EC2 上で FDS 実行を開始します"

mkdir -p "$WORKDIR"
cd "$WORKDIR"

curl -fsS -o "$INPUT_FILE" "${options.inputUrl}"

if [ ! -x "$FDS_BIN" ]; then
  notify "failed" "FDS バイナリが見つかりません ($FDS_BIN)。AMI のセットアップを確認してください"
  exit 1
fi

timeout --signal=TERM "$MAX_RUNTIME_SEC" "$FDS_BIN" "$INPUT_FILE" > fds.stdout.log 2> fds.stderr.log || {
  code=$?
  if [ "$code" -eq 124 ]; then
    notify "timed_out" "実行時間が ${options.maxRuntimeHours} 時間を超えました"
    exit 124
  fi
  cat fds.stderr.log >&2 || true
  notify "failed" "FDS の実行に失敗しました (exit $code)"
  exit "$code"
}

zip -qr results.zip ./*.out ./*.smv ./*.csv fds.stdout.log fds.stderr.log 2>/dev/null || zip -qr results.zip .
curl -fsS -X PUT -T results.zip "${options.outputUrl}"

notify "succeeded" "FDS の実行が完了しました"
`;
}

/** Launches an EC2 instance for an FDS job. */
export async function launchFdsJobOnEc2(
  env: Env,
  job: FdsJob,
  callbackBaseUrl: string
): Promise<FdsJob> {
  const config = getFdsAwsConfig(env);
  if (!config.configured) {
    throw new Error(
      "AWS EC2 の設定が不足しています。AWS 認証情報・AMI・サブネット・セキュリティグループを設定してください"
    );
  }
  if (!env.FDS_JOB_CALLBACK_SECRET?.trim()) {
    throw new Error("FDS_JOB_CALLBACK_SECRET が設定されていません");
  }
  if (!isR2PresignReady(env)) {
    throw new Error("R2 presigned URL 用の設定が不足しています（R2_ACCESS_KEY_ID など）");
  }

  const outputR2Key = generateFdsOutputR2Key(job.id);
  const logR2Key = generateFdsLogR2Key(job.id);
  const presignExpiresSec = 60 * 60 * (FDS_JOB_MAX_RUNTIME_HOURS + 2);

  const inputUrl = await presignGetObject(env, job.input_r2_key, { expiresSec: presignExpiresSec });
  const outputUrl = await presignPutObject(env, outputR2Key, {
    expiresSec: presignExpiresSec,
    query: { "Content-Type": "application/zip" },
  });
  const logUrl = await presignPutObject(env, logR2Key, {
    expiresSec: presignExpiresSec,
    query: { "Content-Type": "text/plain; charset=utf-8" },
  });

  const callbackUrl = `${callbackBaseUrl.replace(/\/$/, "")}/api/simulation/fds-jobs/callback`;
  const userData = buildFdsUserDataScript({
    jobId: job.id,
    inputUrl,
    outputUrl,
    logUrl,
    callbackUrl,
    callbackSecret: env.FDS_JOB_CALLBACK_SECRET.trim(),
    inputFilename: job.input_filename,
    maxRuntimeHours: FDS_JOB_MAX_RUNTIME_HOURS,
  });

  const instanceId = await runEc2Instance(env, {
    imageId: env.AWS_EC2_FDS_AMI_ID!.trim(),
    instanceType: job.ec2_instance_type || config.instanceType,
    subnetId: env.AWS_EC2_SUBNET_ID!.trim(),
    securityGroupId: env.AWS_EC2_SECURITY_GROUP_ID!.trim(),
    userData,
    jobId: job.id,
    maxRuntimeHours: FDS_JOB_MAX_RUNTIME_HOURS,
  });

  const launchedAt = new Date().toISOString();
  await markFdsJobLaunching(env.DB, job.id, instanceId, launchedAt);
  await updateFdsJobStatus(env.DB, job.id, "running", {
    outputR2Key,
    outputFilename: "results.zip",
    logR2Key,
  });

  const updated = await getFdsJobById(env.DB, job.id);
  if (!updated) throw new Error("ジョブの更新に失敗しました");
  return updated;
}

/** Syncs job state from EC2 and applies timeout rules. */
export async function syncFdsJobFromEc2(env: Env, job: FdsJob): Promise<FdsJob> {
  if (!job.ec2_instance_id || !isAwsEc2Configured(env)) {
    return job;
  }

  if (job.status !== "launching" && job.status !== "running") {
    return job;
  }

  const info = await describeEc2Instance(env, job.ec2_instance_id);
  if (!info) {
    await updateFdsJobStatus(env.DB, job.id, "failed", {
      statusMessage: "EC2 インスタンスが見つかりませんでした",
      finishedAt: new Date().toISOString(),
    });
    return (await getFdsJobById(env.DB, job.id)) ?? job;
  }

  if (info.state === "terminated" || info.state === "shutting-down") {
    const current = await getFdsJobById(env.DB, job.id);
    if (current && (current.status === "launching" || current.status === "running")) {
      await updateFdsJobStatus(env.DB, job.id, "failed", {
        statusMessage: "EC2 インスタンスが終了しましたが、完了通知を受信できませんでした",
        finishedAt: new Date().toISOString(),
      });
    }
  }

  if (job.launched_at && isFdsJobTimedOut(job.launched_at)) {
    try {
      await terminateEc2Instance(env, job.ec2_instance_id);
    } catch {
      // Instance may already be gone.
    }
    await updateFdsJobStatus(env.DB, job.id, "timed_out", {
      statusMessage: `実行時間が ${FDS_JOB_MAX_RUNTIME_HOURS} 時間を超えました`,
      finishedAt: new Date().toISOString(),
    });
  }

  return (await getFdsJobById(env.DB, job.id)) ?? job;
}

/** Cancels a running FDS job and terminates its EC2 instance. */
export async function cancelFdsJob(env: Env, job: FdsJob): Promise<FdsJob> {
  if (job.ec2_instance_id && isAwsEc2Configured(env)) {
    try {
      await terminateEc2Instance(env, job.ec2_instance_id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "EC2 終了に失敗しました";
      throw new Error(message);
    }
  }

  await updateFdsJobStatus(env.DB, job.id, "cancelled", {
    statusMessage: "管理者によりキャンセルされました",
    finishedAt: new Date().toISOString(),
  });

  const updated = await getFdsJobById(env.DB, job.id);
  if (!updated) throw new Error("ジョブの更新に失敗しました");
  return updated;
}

function isR2PresignReady(env: Env): boolean {
  return Boolean(
    env.R2_ACCESS_KEY_ID?.trim() &&
      env.R2_SECRET_ACCESS_KEY?.trim() &&
      env.R2_ACCOUNT_ID?.trim()
  );
}

function isFdsJobTimedOut(launchedAt: string): boolean {
  const launchedMs = Date.parse(launchedAt);
  if (Number.isNaN(launchedMs)) return false;
  return Date.now() - launchedMs > FDS_JOB_MAX_RUNTIME_HOURS * 60 * 60 * 1000;
}
