// functions/lib/simulation/fds-instance-sizing.ts

/** C7a インスタンスタイプ（vCPU / メモリは ap-northeast-1 の一般的な仕様） */
export const C7A_INSTANCE_SIZES: ReadonlyArray<{
  instanceType: string;
  vcpus: number;
  memory_gib: number;
}> = [
  { instanceType: "c7a.medium", vcpus: 1, memory_gib: 2 },
  { instanceType: "c7a.large", vcpus: 2, memory_gib: 4 },
  { instanceType: "c7a.xlarge", vcpus: 4, memory_gib: 8 },
  { instanceType: "c7a.2xlarge", vcpus: 8, memory_gib: 16 },
  { instanceType: "c7a.4xlarge", vcpus: 16, memory_gib: 32 },
  { instanceType: "c7a.8xlarge", vcpus: 32, memory_gib: 64 },
  { instanceType: "c7a.12xlarge", vcpus: 48, memory_gib: 96 },
  { instanceType: "c7a.16xlarge", vcpus: 64, memory_gib: 128 },
  { instanceType: "c7a.24xlarge", vcpus: 96, memory_gib: 192 },
  { instanceType: "c7a.48xlarge", vcpus: 192, memory_gib: 384 },
];

export const FDS_MIN_MPI_PROCESSES = 1;
export const FDS_MAX_MPI_PROCESSES = 192;

/** 依頼 MPI プロセス数を許容範囲に収める */
export function clampMpiProcesses(value: number): number {
  if (!Number.isFinite(value)) return FDS_MIN_MPI_PROCESSES;
  return Math.min(FDS_MAX_MPI_PROCESSES, Math.max(FDS_MIN_MPI_PROCESSES, Math.floor(value)));
}

/** 指定コア数以上を満たす最小の c7a インスタンスタイプを選ぶ */
export function pickC7aInstanceType(requestedCores: number): {
  instanceType: string;
  vcpus: number;
  requestedCores: number;
} {
  const cores = clampMpiProcesses(requestedCores);
  const match =
    C7A_INSTANCE_SIZES.find((row) => row.vcpus >= cores) ??
    C7A_INSTANCE_SIZES[C7A_INSTANCE_SIZES.length - 1]!;
  return {
    instanceType: match.instanceType,
    vcpus: match.vcpus,
    requestedCores: cores,
  };
}

/** クライアント向け sizing 一覧 */
export function listC7aSizingOptions(): Array<{
  mpi_processes: number;
  instance_type: string;
  vcpus: number;
}> {
  return C7A_INSTANCE_SIZES.map((row) => ({
    mpi_processes: row.vcpus,
    instance_type: row.instanceType,
    vcpus: row.vcpus,
  }));
}
