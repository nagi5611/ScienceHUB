// functions/lib/simulation/fds-failure-category.ts

import type { FdsJobStatus } from "./fds-jobs";

export type FdsFailureCategory =
  | "input_invalid"
  | "resource_limit"
  | "convergence"
  | "timeout"
  | "infrastructure"
  | "unknown";

const USER_MESSAGES: Record<FdsFailureCategory, string> = {
  input_invalid:
    "入力ファイル（.fds）の内容に問題があり、実行を完了できませんでした。一次審査の指摘や実行ログを確認し、入力を修正してください。",
  resource_limit:
    "割り当てた計算リソース（メモリやプロセス数）では処理が足りませんでした。MPI プロセス数やメッシュ規模を見直すか、より大きいインスタンスが必要か担当者に相談してください。",
  convergence:
    "計算が収束せず、または FDS が異常終了しました。時間刻み・境界条件・停止条件（T_END など）を見直してください。",
  timeout:
    "指定した最大実行時間を超えたため、計算を打ち切りました。メッシュを粗くする、T_END を短くする、MPI 数を増やすなどを検討してください。",
  infrastructure:
    "サーバー側の起動や結果の受け渡しで問題が発生しました。しばらく待ってから再実行するか、担当者にお問い合わせください。",
  unknown:
    "実行中にエラーが発生しました。実行ログを確認するか、担当者にお問い合わせください。",
};

/** ユーザー向けの失敗説明文。 */
export function fdsFailureCategoryUserMessage(category: FdsFailureCategory): string {
  return USER_MESSAGES[category];
}

/** ジョブ状態とメッセージ・ログ断片から失敗カテゴリを推定する。 */
export function classifyFdsJobFailure(
  status: FdsJobStatus,
  statusMessage: string | null,
  logSnippet?: string | null
): FdsFailureCategory | null {
  if (status !== "failed" && status !== "timed_out") {
    return null;
  }
  if (status === "timed_out") {
    return "timeout";
  }

  const text = `${statusMessage ?? ""}\n${logSnippet ?? ""}`.toLowerCase();

  if (
    text.includes("バイナリが見つかりません") ||
    text.includes("ami") ||
    text.includes("コールバック") ||
    text.includes("presign") ||
    text.includes("curl")
  ) {
    return "infrastructure";
  }
  if (
    text.includes("out of memory") ||
    text.includes("oom") ||
    text.includes("cannot allocate") ||
    text.includes("mpi") && text.includes("rank")
  ) {
    return "resource_limit";
  }
  if (
    text.includes("convergence") ||
    text.includes("stop") ||
    text.includes("diverg") ||
    text.includes("error exit") ||
    text.includes("numerical")
  ) {
    return "convergence";
  }
  if (
    text.includes(".fds") ||
    text.includes("syntax") ||
    text.includes("line") ||
    text.includes("入力")
  ) {
    return "input_invalid";
  }

  return "unknown";
}
