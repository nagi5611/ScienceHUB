// functions/lib/simulation/openfoam-ec2-runner.ts
import type { Env } from "../types";
import { describeEc2Image, describeEc2Instance, isAwsEc2Configured, runEc2Instance, terminateEc2Instance, waitForEc2AmiAvailable } from "../aws/ec2";
import { presignGetObject, presignPutObject } from "../r2-presign";
import {
  OPENFOAM_DEFAULT_INSTANCE_TYPE,
  OPENFOAM_JOB_MAX_RUNTIME_HOURS,
  generateOpenfoamLogR2Key,
  generateOpenfoamOutputR2Key,
  getOpenfoamJobById,
  markOpenfoamJobLaunching,
  updateOpenfoamJobStatus,
  type OpenfoamJob,
} from "./openfoam-jobs";
import { syncOpenfoamJobArtifacts } from "./openfoam-job-artifacts";

/** One step in the EC2 launch pipeline (for admin UI logs). */
export interface OpenfoamLaunchStep {
  at: string;
  message: string;
}

export interface OpenfoamLaunchResult {
  job: OpenfoamJob;
  steps: OpenfoamLaunchStep[];
}

export interface OpenfoamAwsConfig {
  configured: boolean;
  region: string;
  instanceType: string;
  amiConfigured: boolean;
  networkConfigured: boolean;
}

export interface OpenfoamAmiStatus {
  ami_id: string | null;
  state: string | null;
  state_reason: string | null;
  runnable: boolean;
}

/** Returns live AMI state for the configured OpenFOAM image. */
export async function fetchOpenfoamAmiStatus(env: Env): Promise<OpenfoamAmiStatus> {
  const amiId = env.AWS_EC2_OPENFOAM_AMI_ID?.trim() ?? null;
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

/** Returns whether OpenFOAM EC2 runner prerequisites are configured. */
export function getOpenfoamAwsConfig(env: Env): OpenfoamAwsConfig {
  const region = env.AWS_REGION?.trim() || "ap-northeast-1";
  const instanceType = env.AWS_EC2_INSTANCE_TYPE?.trim() || OPENFOAM_DEFAULT_INSTANCE_TYPE;
  const amiConfigured = Boolean(env.AWS_EC2_OPENFOAM_AMI_ID?.trim());
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

/** Builds EC2 user-data script for an OpenFOAM job. */
export function buildOpenfoamUserDataScript(options: {
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
  const maxRuntimeSec = options.maxRuntimeHours * 3600;

  return `#!/bin/bash
set -euo pipefail
exec > >(tee /var/log/sciencehub-openfoam-runner.log) 2>&1

JOB_ID="${options.jobId}"
WORKDIR="/tmp/sciencehub-openfoam-\${JOB_ID}"
INPUT_FILE="${options.inputFilename}"
CALLBACK_URL="${options.callbackUrl}"
CALLBACK_SECRET="${options.callbackSecret}"
MAX_RUNTIME_SEC=${maxRuntimeSec}
MPI_PROCESSES=${Math.max(1, Math.floor(options.mpiProcesses))}
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
  if [ -f /var/log/sciencehub-openfoam-runner.log ]; then
    curl -fsS -X PUT -T /var/log/sciencehub-openfoam-runner.log "${options.logUrl}" || true
  fi
}

build_results_zip() {
  rm -f results.zip
  zip -qr results.zip . -x "results.zip"
  echo "results.zip contents:"
  unzip -l results.zip | tail -n +4 | head -n 40 || true
}

cleanup() {
  upload_log
  shutdown -h now
}
trap cleanup EXIT

notify "running" "EC2 上で OpenFOAM 実行を開始します"

mkdir -p "$WORKDIR"
cd "$WORKDIR"

curl -fsS -o "$INPUT_FILE" "${options.inputUrl}"

if ! command -v unzip >/dev/null 2>&1; then
  notify "failed" "unzip コマンドがありません。AMI に unzip をインストールしてください"
  exit 1
fi

unzip -q "$INPUT_FILE" || {
  notify "failed" "ケース ZIP の展開に失敗しました"
  exit 1
}

# 単一トップレベルディレクトリならケースルートとして移動
TOP_DIRS=(\$(find . -maxdepth 1 -mindepth 1 -type d ! -name '.*'))
if [ "\${#TOP_DIRS[@]}" -eq 1 ] && [ ! -f system/controlDict ]; then
  cd "\${TOP_DIRS[0]}"
fi

if [ ! -f system/controlDict ]; then
  notify "failed" "system/controlDict が見つかりません。ケース ZIP の構造を確認してください"
  exit 1
fi

# OpenFOAM 環境（AMI ごとにパスが異なる場合あり）
for rc in /opt/openfoam/etc/bashrc /opt/openfoam*/etc/bashrc /usr/lib/openfoam/openfoam*/etc/bashrc; do
  if [ -f "$rc" ]; then
    # shellcheck source=/dev/null
    source "$rc"
    break
  fi
done

export PATH="/usr/lib64/openmpi/bin:\${PATH}"
export LD_LIBRARY_PATH="/usr/lib64/openmpi/lib:\${LD_LIBRARY_PATH:-}"
export OMPI_ALLOW_RUN_AS_ROOT=1
export OMPI_ALLOW_RUN_AS_ROOT_CONFIRM=1

if [ -x ./Allrun ]; then
  RUN_CMD=( bash ./Allrun )
elif command -v foamRun >/dev/null 2>&1; then
  if [ "\$MPI_PROCESSES" -gt 1 ] && command -v decomposePar >/dev/null 2>&1; then
    decomposePar -force > decompose.log 2>&1 || true
    RUN_CMD=( "\$MPIEXEC" -np "\$MPI_PROCESSES" foamRun -parallel )
  else
    RUN_CMD=( foamRun )
  fi
else
  SOLVER=\$(grep -E '^[[:space:]]*application[[:space:]]+' system/controlDict | tail -1 | awk '{print \$2}' | tr -d '[:space:];')
  if [ -z "\$SOLVER" ] || ! command -v "\$SOLVER" >/dev/null 2>&1; then
    notify "failed" "ソルバー \$SOLVER が見つかりません。Allrun または foamRun を用意してください"
    exit 1
  fi
  if [ "\$MPI_PROCESSES" -gt 1 ] && command -v decomposePar >/dev/null 2>&1; then
    decomposePar -force > decompose.log 2>&1 || true
    RUN_CMD=( "\$MPIEXEC" -np "\$MPI_PROCESSES" "\$SOLVER" -parallel )
  else
    RUN_CMD=( "\$SOLVER" )
  fi
fi

timeout --signal=TERM "\$MAX_RUNTIME_SEC" "\${RUN_CMD[@]}" > openfoam.stdout.log 2> openfoam.stderr.log || {
  code=$?
  if [ -f openfoam.stderr.log ]; then cat openfoam.stderr.log >&2 || true; fi
  build_results_zip
  if [ -f results.zip ]; then
    curl -fsS -X PUT -T results.zip "${options.outputUrl}" || true
  fi
  if [ "$code" -eq 124 ]; then
    notify "timed_out" "実行時間が ${options.maxRuntimeHours} 時間を超えました"
    exit 124
  fi
  notify "failed" "OpenFOAM の実行に失敗しました (exit $code)"
  exit "$code"
}

build_results_zip
curl -fsS -X PUT -T results.zip "${options.outputUrl}"
upload_log

for attempt in 1 2 3 4 5; do
  if curl -fsS -X POST "$CALLBACK_URL" \\
    -H "Content-Type: application/json" \\
    -H "Authorization: Bearer $CALLBACK_SECRET" \\
    -d "$(printf '{"job_id":"%s","status":"%s","message":"%s"}' "$JOB_ID" "succeeded" "OpenFOAM の実行が完了しました")"; then
    break
  fi
  sleep 2
done
`;
}

/** Launches an EC2 instance for an OpenFOAM job. */
export async function launchOpenfoamJobOnEc2(
  env: Env,
  job: OpenfoamJob,
  callbackBaseUrl: string
): Promise<OpenfoamLaunchResult> {
  const steps: OpenfoamLaunchStep[] = [];
  const pushStep = (message: string) => {
    steps.push({ at: new Date().toISOString(), message });
  };

  pushStep("EC2 起動処理を開始します");

  const config = getOpenfoamAwsConfig(env);
  if (!config.configured) {
    throw new Error(
      "AWS EC2 の設定が不足しています。AWS 認証情報・AMI・サブネット・セキュリティグループを設定してください"
    );
  }
  pushStep("AWS 認証情報・ネットワーク設定を確認しました");

  if (!env.OPENFOAM_JOB_CALLBACK_SECRET?.trim()) {
    throw new Error("OPENFOAM_JOB_CALLBACK_SECRET が設定されていません");
  }
  if (!isR2PresignReady(env)) {
    throw new Error("R2 presigned URL 用の設定が不足しています（R2_ACCESS_KEY_ID など）");
  }
  pushStep("コールバック秘密鍵と R2 presign 設定を確認しました");

  const outputR2Key = generateOpenfoamOutputR2Key(job.id);
  const logR2Key = generateOpenfoamLogR2Key(job.id);
  const maxRuntimeHours = job.max_runtime_hours ?? OPENFOAM_JOB_MAX_RUNTIME_HOURS;
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

  const callbackUrl = `${callbackBaseUrl.replace(/\/$/, "")}/api/simulation/openfoam-jobs/callback`;
  pushStep(`コールバック URL: ${callbackUrl}`);
  const userData = buildOpenfoamUserDataScript({
    jobId: job.id,
    inputUrl,
    outputUrl,
    logUrl,
    callbackUrl,
    callbackSecret: env.OPENFOAM_JOB_CALLBACK_SECRET.trim(),
    inputFilename: job.input_filename,
    maxRuntimeHours,
    mpiProcesses,
  });

  const imageId = env.AWS_EC2_OPENFOAM_AMI_ID!.trim();
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
    env.OPENFOAM_SOLVER_VERSION?.trim() || "AMI 同梱（/opt/openfoam）";
  await markOpenfoamJobLaunching(env.DB, job.id, instanceId, launchedAt);
  await updateOpenfoamJobStatus(env.DB, job.id, "running", {
    outputR2Key,
    outputFilename: "results.zip",
    logR2Key,
    openfoamAmiId: imageId,
    openfoamSolverVersion: solverVersion,
  });
  pushStep("ジョブ状態を running に更新しました");

  const updated = await getOpenfoamJobById(env.DB, job.id);
  if (!updated) throw new Error("ジョブの更新に失敗しました");
  return { job: updated, steps };
}

/** Fetches current EC2 instance state for a job (DescribeInstances). */
export async function fetchLiveEc2StateForOpenfoamJob(
  env: Env,
  job: OpenfoamJob
): Promise<{ state: string; launchTime: string | null } | null> {
  if (!job.ec2_instance_id || !isAwsEc2Configured(env)) {
    return null;
  }
  const info = await describeEc2Instance(env, job.ec2_instance_id);
  if (!info) return null;
  return { state: info.state, launchTime: info.launchTime };
}

/** Syncs job state from EC2 and applies timeout rules. */
export async function syncOpenfoamJobFromEc2(env: Env, job: OpenfoamJob): Promise<OpenfoamJob> {
  if (!job.ec2_instance_id || !isAwsEc2Configured(env)) {
    return job;
  }

  if (job.status !== "launching" && job.status !== "running") {
    return job;
  }

  const info = await describeEc2Instance(env, job.ec2_instance_id);
  if (!info) {
    await updateOpenfoamJobStatus(env.DB, job.id, "failed", {
      statusMessage: "EC2 インスタンスが見つかりませんでした",
      finishedAt: new Date().toISOString(),
    });
    return (await getOpenfoamJobById(env.DB, job.id)) ?? job;
  }

  if (info.state === "terminated" || info.state === "shutting-down") {
    const current = await getOpenfoamJobById(env.DB, job.id);
    if (current && (current.status === "launching" || current.status === "running")) {
      const { artifacts } = await syncOpenfoamJobArtifacts(env, current);
      const finishedAt = new Date().toISOString();
      if (artifacts.hasOutput) {
        await updateOpenfoamJobStatus(env.DB, job.id, "succeeded", {
          statusMessage: "OpenFOAM の実行が完了しました",
          finishedAt,
        });
      } else {
        await updateOpenfoamJobStatus(env.DB, job.id, "failed", {
          statusMessage:
            "EC2 インスタンスが終了しましたが、結果 ZIP を R2 で確認できませんでした",
          finishedAt,
        });
      }
    }
  }

  if (job.launched_at && isOpenfoamJobTimedOut(job.launched_at)) {
    try {
      await terminateEc2Instance(env, job.ec2_instance_id);
    } catch {
      // Instance may already be gone.
    }
    await updateOpenfoamJobStatus(env.DB, job.id, "timed_out", {
      statusMessage: `実行時間が ${OPENFOAM_JOB_MAX_RUNTIME_HOURS} 時間を超えました`,
      finishedAt: new Date().toISOString(),
    });
  }

  return (await getOpenfoamJobById(env.DB, job.id)) ?? job;
}

/** Cancels a running OpenFOAM job and terminates its EC2 instance. */
export async function cancelOpenfoamJob(env: Env, job: OpenfoamJob): Promise<OpenfoamJob> {
  if (job.ec2_instance_id && isAwsEc2Configured(env)) {
    try {
      await terminateEc2Instance(env, job.ec2_instance_id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "EC2 終了に失敗しました";
      throw new Error(message);
    }
  }

  await updateOpenfoamJobStatus(env.DB, job.id, "cancelled", {
    statusMessage: "管理者によりキャンセルされました",
    finishedAt: new Date().toISOString(),
  });

  const updated = await getOpenfoamJobById(env.DB, job.id);
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

function isOpenfoamJobTimedOut(launchedAt: string): boolean {
  const launchedMs = Date.parse(launchedAt);
  if (Number.isNaN(launchedMs)) return false;
  return Date.now() - launchedMs > OPENFOAM_JOB_MAX_RUNTIME_HOURS * 60 * 60 * 1000;
}
