// functions/lib/simulation/fds-cost-estimate.ts

/**
 * On-demand 概算（USD/時間・東京リージョン hpc6a の目安）。
 * 正確な請求額ではなく、実行前の目安表示用。
 */
const HPC6A_USD_PER_HOUR: Record<string, number> = {
  "hpc6a.48xlarge": 3.93,
};

const DEFAULT_USD_PER_HOUR = 3.93;
const USD_TO_JPY_HINT = 150;

export interface FdsRunCostEstimate {
  instance_type: string;
  max_runtime_hours: number;
  estimated_cost_usd_max: number;
  estimated_cost_jpy_max: number;
  cost_note: string;
}

export interface FdsStorageEstimate {
  input_bytes: number;
  output_bytes_hint_min: number;
  storage_note: string;
}

/** 最大実行時間までフル稼働した場合の EC2 インスタンス料金概算。 */
export function estimateFdsRunCost(
  instanceType: string,
  maxRuntimeHours: number
): FdsRunCostEstimate {
  const hours = Math.max(1, Math.min(10, Math.floor(maxRuntimeHours)));
  const rate = HPC6A_USD_PER_HOUR[instanceType] ?? DEFAULT_USD_PER_HOUR;
  const usd = Math.round(rate * hours * 100) / 100;
  const jpy = Math.round(usd * USD_TO_JPY_HINT);
  return {
    instance_type: instanceType,
    max_runtime_hours: hours,
    estimated_cost_usd_max: usd,
    estimated_cost_jpy_max: jpy,
    cost_note:
      "hpc6a.48xlarge は 96 コア固定課金です（MPI が少なくてもインスタンス全体の料金）。データ転送・ストレージ・税は含みません。",
  };
}

/** 入出力ストレージの目安（出力は入力の数倍〜最低 50MB と仮定）。 */
export function estimateFdsStorage(inputBytes: number): FdsStorageEstimate {
  const input = Math.max(0, Math.floor(inputBytes));
  const minOutput = 50 * 1024 * 1024;
  const scaled = Math.max(minOutput, input * 5);
  return {
    input_bytes: input,
    output_bytes_hint_min: scaled,
    storage_note: "出力 ZIP のサイズは計算内容により大きく変動します。",
  };
}
