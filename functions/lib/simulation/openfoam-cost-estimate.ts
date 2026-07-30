// functions/lib/simulation/openfoam-cost-estimate.ts

import {
  estimateFdsRunCost,
  estimateFdsStorage,
  type FdsRunCostEstimate,
  type FdsStorageEstimate,
} from "./fds-cost-estimate";

export type OpenfoamRunCostEstimate = FdsRunCostEstimate;
export type OpenfoamStorageEstimate = FdsStorageEstimate;

/** 最大実行時間までフル稼働した場合の EC2 インスタンス料金概算。 */
export function estimateOpenfoamRunCost(
  instanceType: string,
  maxRuntimeHours: number
): OpenfoamRunCostEstimate {
  return estimateFdsRunCost(instanceType, maxRuntimeHours);
}

/** 入出力ストレージの目安。 */
export function estimateOpenfoamStorage(inputBytes: number): OpenfoamStorageEstimate {
  return estimateFdsStorage(inputBytes);
}
