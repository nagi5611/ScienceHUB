// functions/lib/simulation/openfoam-failure-category.ts

import type { OpenfoamJobStatus } from "./openfoam-jobs";

export type OpenfoamFailureCategory =
  | "input_invalid"
  | "resource_limit"
  | "convergence"
  | "timeout"
  | "infrastructure"
  | "unknown";

const USER_MESSAGES: Record<OpenfoamFailureCategory, string> = {
  input_invalid:
    "ケース ZIP の内容に問題があり、実行を完了できませんでした。system/controlDict 等を確認してください。",
  resource_limit:
    "割り当てた計算リソースでは処理が足りませんでした。MPI プロセス数やメッシュ規模を見直してください。",
  convergence:
    "計算が収束せず、または OpenFOAM が異常終了しました。時間刻み・境界条件を見直してください。",
  timeout:
    "指定した最大実行時間を超えたため、計算を打ち切りました。endTime を短くするか MPI 数を増やすことを検討してください。",
  infrastructure:
    "サーバー側の起動や結果の受け渡しで問題が発生しました。しばらく待ってから再実行するか、担当者にお問い合わせください。",
  unknown:
    "実行中にエラーが発生しました。実行ログを確認するか、担当者にお問い合わせください。",
};

export function openfoamFailureCategoryUserMessage(category: OpenfoamFailureCategory): string {
  return USER_MESSAGES[category];
}

export function classifyOpenfoamJobFailure(
  status: OpenfoamJobStatus,
  statusMessage: string | null,
  logSnippet?: string | null
): OpenfoamFailureCategory | null {
  if (status !== "failed" && status !== "timed_out") return null;
  if (status === "timed_out") return "timeout";

  const text = `${statusMessage ?? ""}\n${logSnippet ?? ""}`.toLowerCase();

  if (
    text.includes("ami") ||
    text.includes("コールバック") ||
    text.includes("presign") ||
    text.includes("unzip") && text.includes("失敗")
  ) {
    return "infrastructure";
  }
  if (
    text.includes("out of memory") ||
    text.includes("oom") ||
    text.includes("cannot allocate")
  ) {
    return "resource_limit";
  }
  if (
    text.includes("foam fatal") ||
    text.includes("floating point exception") ||
    text.includes("convergence")
  ) {
    return "convergence";
  }
  if (
    text.includes("controlDict") ||
    text.includes("cannot find file") ||
    text.includes("ケース")
  ) {
    return "input_invalid";
  }

  return "unknown";
}
