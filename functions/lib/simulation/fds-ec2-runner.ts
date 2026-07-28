// functions/lib/simulation/fds-ec2-runner.ts
import type { Env } from "../types";
import { describeEc2Image, describeEc2Instance, isAwsEc2Configured, runEc2Instance, terminateEc2Instance, waitForEc2AmiAvailable } from "../aws/ec2";
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
import { syncFdsJobArtifacts } from "./fds-job-artifacts";

/** One step in the EC2 launch pipeline (for admin UI logs). */
export interface FdsLaunchStep {
  at: string;
  message: string;
}

export interface FdsLaunchResult {
  job: FdsJob;
  steps: FdsLaunchStep[];
}

export interface FdsAwsConfig {
  configured: boolean;
  region: string;
  instanceType: string;
  amiConfigured: boolean;
  networkConfigured: boolean;
}

export interface FdsAmiStatus {
  ami_id: string | null;
  state: string | null;
  state_reason: string | null;
  runnable: boolean;
}

/** Returns live AMI state for the configured FDS image. */
export async function fetchFdsAmiStatus(env: Env): Promise<FdsAmiStatus> {
  const amiId = env.AWS_EC2_FDS_AMI_ID?.trim() ?? null;
  if (!amiId || !isAwsEc2Configured(env)) {
    return { ami_id: amiId, state: null, state_reason: null, runnable: false };
  }

  try {
    const image = await describeEc2Image(env, amiId);
    if (!image) {
      return {
        ami_id: amiId,
        state: "not-found",
        state_reason: "DescribeImages で AMI が見つかりませんでした",
        runnable: false,
      };
    }
    return {
      ami_id: amiId,
      state: image.state,
      state_reason: image.stateReason,
      runnable: image.state === "available",
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "AMI 状態の取得に失敗しました";
    return { ami_id: amiId, state: "error", state_reason: message, runnable: false };
  }
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
  mpiProcesses: number;
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
MPI_PROCESSES=${Math.max(1, Math.floor(options.mpiProcesses))}
FDS_BIN="${fdsBinary}"
FDS_MPI_BIN="/opt/fds/lib/fds_ompi_gnu_linux"
MPIEXEC="/usr/lib64/openmpi/bin/mpiexec"

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

build_results_zip() {
  rm -f results.zip
  # Smokeview の smoke (.s3d)・スライス (.sf) などを漏らさないためワークディレクトリ一式を ZIP
  zip -qr results.zip . -x "results.zip"
  echo "results.zip contents:"
  unzip -l results.zip | tail -n +4 | head -n 40 || true
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

export PATH="/usr/lib64/openmpi/bin:/opt/fds/bin:\${PATH}"
export LD_LIBRARY_PATH="/usr/lib64/openmpi/lib:\${LD_LIBRARY_PATH:-}"
export OMPI_ALLOW_RUN_AS_ROOT=1
export OMPI_ALLOW_RUN_AS_ROOT_CONFIRM=1

if [ -x "\$MPIEXEC" ] && [ -x "\$FDS_MPI_BIN" ]; then
  FDS_CMD=( "\$MPIEXEC" -n "\$MPI_PROCESSES" "\$FDS_MPI_BIN" "\$INPUT_FILE" )
else
  FDS_CMD=( "\$FDS_BIN" "\$INPUT_FILE" )
fi

# timeout は PATH 上の実行ファイルしか起動できない（シェル関数は不可）
timeout --signal=TERM "\$MAX_RUNTIME_SEC" "\${FDS_CMD[@]}" > fds.stdout.log 2> fds.stderr.log || {
  code=$?
  if [ -f fds.stderr.log ]; then cat fds.stderr.log >&2 || true; fi
  build_results_zip
  if [ -f results.zip ]; then
    curl -fsS -X PUT -T results.zip "${options.outputUrl}" || true
  fi
  if [ "$code" -eq 124 ]; then
    notify "timed_out" "実行時間が ${options.maxRuntimeHours} 時間を超えました"
    exit 124
  fi
  notify "failed" "FDS の実行に失敗しました (exit $code)"
  exit "$code"
}

build_results_zip
curl -fsS -X PUT -T results.zip "${options.outputUrl}"

upload_log

for attempt in 1 2 3 4 5; do
  if curl -fsS -X POST "$CALLBACK_URL" \\
    -H "Content-Type: application/json" \\
    -H "Authorization: Bearer $CALLBACK_SECRET" \\
    -d "$(printf '{"job_id":"%s","status":"%s","message":"%s"}' "$JOB_ID" "succeeded" "FDS の実行が完了しました")"; then
    break
  fi
  if [ "$attempt" -eq 5 ]; then
    echo "完了コールバックの送信に失敗しました（結果 ZIP はアップロード済み）" >&2
  fi
  sleep 2
done
`;
}

/** Launches an EC2 instance for an FDS job. */
export async function launchFdsJobOnEc2(
  env: Env,
  job: FdsJob,
  callbackBaseUrl: string
): Promise<FdsLaunchResult> {
  const steps: FdsLaunchStep[] = [];
  const pushStep = (message: string) => {
    steps.push({ at: new Date().toISOString(), message });
  };

  pushStep("EC2 起動処理を開始します");

  const config = getFdsAwsConfig(env);
  if (!config.configured) {
    throw new Error(
      "AWS EC2 の設定が不足しています。AWS 認証情報・AMI・サブネット・セキュリティグループを設定してください"
    );
  }
  pushStep("AWS 認証情報・ネットワーク設定を確認しました");

  if (!env.FDS_JOB_CALLBACK_SECRET?.trim()) {
    throw new Error("FDS_JOB_CALLBACK_SECRET が設定されていません");
  }
  if (!isR2PresignReady(env)) {
    throw new Error("R2 presigned URL 用の設定が不足しています（R2_ACCESS_KEY_ID など）");
  }
  pushStep("コールバック秘密鍵と R2 presign 設定を確認しました");

  const outputR2Key = generateFdsOutputR2Key(job.id);
  const logR2Key = generateFdsLogR2Key(job.id);
  const maxRuntimeHours = job.max_runtime_hours ?? FDS_JOB_MAX_RUNTIME_HOURS;
  const mpiProcesses = job.mpi_processes ?? 1;
  const presignExpiresSec = 60 * 60 * (maxRuntimeHours + 2);

  pushStep("入出力用の presigned URL を生成しています…");
  const inputUrl = await presignGetObject(env, job.input_r2_key, { expiresSec: presignExpiresSec });
  const outputUrl = await presignPutObject(env, outputR2Key, {
    expiresSec: presignExpiresSec,
    query: { "Content-Type": "application/zip" },
  });
  const logUrl = await presignPutObject(env, logR2Key, {
    expiresSec: presignExpiresSec,
    query: { "Content-Type": "text/plain; charset=utf-8" },
  });
  pushStep("presigned URL の生成が完了しました");

  const callbackUrl = `${callbackBaseUrl.replace(/\/$/, "")}/api/simulation/fds-jobs/callback`;
  pushStep(`コールバック URL: ${callbackUrl}`);
  const userData = buildFdsUserDataScript({
    jobId: job.id,
    inputUrl,
    outputUrl,
    logUrl,
    callbackUrl,
    callbackSecret: env.FDS_JOB_CALLBACK_SECRET.trim(),
    inputFilename: job.input_filename,
    maxRuntimeHours,
    mpiProcesses,
  });

  const imageId = env.AWS_EC2_FDS_AMI_ID!.trim();
  pushStep(`AMI ${imageId} の状態を確認しています…`);
  try {
    await waitForEc2AmiAvailable(env, imageId, {
      maxWaitMs: 20_000,
      onStatus: (state) => {
        if (state !== "available") {
          pushStep(`AMI 状態: ${state}（利用可能になるまで待機中…）`);
        }
      },
    });
    pushStep("AMI は利用可能 (available) です");
  } catch (err) {
    if (err instanceof Error && err.message.includes("AMI")) {
      pushStep(err.message);
    }
    throw err;
  }

  pushStep(
    `RunInstances を送信します（AMI ${imageId} / ${job.ec2_instance_type || config.instanceType}）`
  );
  const instanceId = await runEc2Instance(env, {
    imageId,
    instanceType: job.ec2_instance_type || config.instanceType,
    subnetId: env.AWS_EC2_SUBNET_ID!.trim(),
    securityGroupId: env.AWS_EC2_SECURITY_GROUP_ID!.trim(),
    userData,
    jobId: job.id,
    maxRuntimeHours,
  });
  pushStep(`EC2 インスタンスを起動しました: ${instanceId}`);

  const launchedAt = new Date().toISOString();
  const solverVersion =
    env.FDS_SOLVER_VERSION?.trim() || "AMI 同梱（/opt/fds）";
  await markFdsJobLaunching(env.DB, job.id, instanceId, launchedAt);
  await updateFdsJobStatus(env.DB, job.id, "running", {
    outputR2Key,
    outputFilename: "results.zip",
    logR2Key,
    fdsAmiId: imageId,
    fdsSolverVersion: solverVersion,
  });
  pushStep("ジョブ状態を running に更新しました");

  const updated = await getFdsJobById(env.DB, job.id);
  if (!updated) throw new Error("ジョブの更新に失敗しました");
  return { job: updated, steps };
}

/** Fetches current EC2 instance state for a job (DescribeInstances). */
export async function fetchLiveEc2StateForJob(
  env: Env,
  job: FdsJob
): Promise<{ state: string; launchTime: string | null } | null> {
  if (!job.ec2_instance_id || !isAwsEc2Configured(env)) {
    return null;
  }
  const info = await describeEc2Instance(env, job.ec2_instance_id);
  if (!info) return null;
  return { state: info.state, launchTime: info.launchTime };
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
      const { artifacts } = await syncFdsJobArtifacts(env, current);
      const finishedAt = new Date().toISOString();
      if (artifacts.hasOutput) {
        await updateFdsJobStatus(env.DB, job.id, "succeeded", {
          statusMessage: "FDS の実行が完了しました",
          finishedAt,
        });
      } else {
        await updateFdsJobStatus(env.DB, job.id, "failed", {
          statusMessage:
            "EC2 インスタンスが終了しましたが、結果 ZIP を R2 で確認できませんでした",
          finishedAt,
        });
      }
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
