// functions/lib/simulation/fds-instance-sizing.ts

/** FDS ジョブで使う EC2 ファミリー（HPC 向け・コスト重視） */
export const FDS_INSTANCE_FAMILY = "hpc6a";

/**
 * Hpc6a インスタンスタイプ（ap-northeast-1）。
 * このファミリーは hpc6a.48xlarge のみ。MPI は実コア数まで（最大 96）。
 */
export const FDS_INSTANCE_SIZES: ReadonlyArray<{
  instanceType: string;
  vcpus: number;
  memory_gib: number;
}> = [{ instanceType: "hpc6a.48xlarge", vcpus: 96, memory_gib: 384 }];

export const FDS_MIN_MPI_PROCESSES = 1;
/** Hpc6a.48xlarge の物理コア数 */
export const FDS_MAX_MPI_PROCESSES = 96;

/** 依頼 MPI プロセス数を許容範囲に収める */
export function clampMpiProcesses(value: number): number {
  if (!Number.isFinite(value)) return FDS_MIN_MPI_PROCESSES;
  return Math.min(FDS_MAX_MPI_PROCESSES, Math.max(FDS_MIN_MPI_PROCESSES, Math.floor(value)));
}

/** MPI プロセス数に応じた FDS 用インスタンスタイプ（Hpc6a は常に 48xlarge、MPI は指定値で実行） */
export function pickFdsInstanceType(requestedCores: number): {
  instanceType: string;
  vcpus: number;
  requestedCores: number;
} {
  const cores = clampMpiProcesses(requestedCores);
  const row = FDS_INSTANCE_SIZES[0]!;
  return {
    instanceType: row.instanceType,
    vcpus: row.vcpus,
    requestedCores: cores,
  };
}

/** @deprecated pickFdsInstanceType を使用 */
export const pickC7aInstanceType = pickFdsInstanceType;

/** クライアント向け sizing 一覧 */
export function listFdsSizingOptions(): Array<{
  mpi_processes: number;
  instance_type: string;
  vcpus: number;
}> {
  return FDS_INSTANCE_SIZES.map((row) => ({
    mpi_processes: row.vcpus,
    instance_type: row.instanceType,
    vcpus: row.vcpus,
  }));
}

/** @deprecated listFdsSizingOptions を使用 */
export const listC7aSizingOptions = listFdsSizingOptions;

/** @deprecated FDS_INSTANCE_SIZES を使用 */
export const C7A_INSTANCE_SIZES = FDS_INSTANCE_SIZES;
