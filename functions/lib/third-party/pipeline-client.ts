/**
 * サードパーティ — tp-pipeline Worker 呼び出し
 */

import type { Env } from "../types";

export interface TpPipelineInvokeResult {
  ok: boolean;
  status: number;
  body: unknown;
}

/** Worker が利用可能か */
export function isTpPipelineWorkerConfigured(env: Env): boolean {
  return Boolean(env.TP_PIPELINE_WORKER_URL?.trim());
}

/** 内部認証付きで tp-pipeline Worker を呼ぶ */
export async function invokeTpPipelineWorker(
  env: Env,
  path: string,
  body: Record<string, unknown>
): Promise<TpPipelineInvokeResult> {
  const base = env.TP_PIPELINE_WORKER_URL?.trim();
  if (!base) {
    return { ok: false, status: 0, body: { error: "worker_not_configured" } };
  }

  const url = `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Tp-Pipeline-Secret": env.TP_PIPELINE_WORKER_SECRET ?? "",
    },
    body: JSON.stringify(body),
  });

  let parsed: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { raw: text.slice(0, 500) };
    }
  }

  return { ok: response.ok, status: response.status, body: parsed };
}

/** 実装ジョブを Worker に非同期起動 */
export async function triggerImplementJobOnWorker(
  env: Env,
  jobId: string,
  projectId: string
): Promise<void> {
  const result = await invokeTpPipelineWorker(env, "/implement", {
    job_id: jobId,
    project_id: projectId,
  });
  if (!result.ok && result.status !== 0 && result.status !== 202) {
    throw new Error(
      typeof result.body === "object" &&
        result.body !== null &&
        "error" in result.body
        ? String((result.body as { error: string }).error)
        : "実装 Worker の起動に失敗しました"
    );
  }
}

/** 検証を Worker で実行 */
export async function triggerVerifyOnWorker(
  env: Env,
  projectId: string,
  dirName: string,
  options?: { autoRepair?: boolean; userReport?: string }
): Promise<TpPipelineInvokeResult> {
  return await invokeTpPipelineWorker(env, "/verify", {
    project_id: projectId,
    dir_name: dirName,
    auto_repair: options?.autoRepair ?? false,
    user_report: options?.userReport ?? "",
  });
}
