// functions/lib/simulation/openfoam-instance-sizing.ts

export interface Ec2InstanceSize {
  instanceType: string;
  vcpus: number;
  memory_gib: number;
  family: "c7a" | "hpc6a";
}

/** C7a インスタンスタイプ（medium〜12xlarge、ap-northeast-1 の一般的な仕様） */
export const C7A_INSTANCE_SIZES: ReadonlyArray<Ec2InstanceSize> = [
  { instanceType: "c7a.medium", vcpus: 1, memory_gib: 2, family: "c7a" },
  { instanceType: "c7a.large", vcpus: 2, memory_gib: 4, family: "c7a" },
  { instanceType: "c7a.xlarge", vcpus: 4, memory_gib: 8, family: "c7a" },
  { instanceType: "c7a.2xlarge", vcpus: 8, memory_gib: 16, family: "c7a" },
  { instanceType: "c7a.4xlarge", vcpus: 16, memory_gib: 32, family: "c7a" },
  { instanceType: "c7a.8xlarge", vcpus: 32, memory_gib: 64, family: "c7a" },
  { instanceType: "c7a.12xlarge", vcpus: 48, memory_gib: 96, family: "c7a" },
];

/** c7a.12xlarge を超える MPI 数向け Hpc6a（ap-northeast-1 の一般的な仕様） */
export const HPC6A_INSTANCE_SIZES: ReadonlyArray<Ec2InstanceSize> = [
  { instanceType: "hpc6a.48xlarge", vcpus: 96, memory_gib: 384, family: "hpc6a" },
];

/** シミュレーション割当で使える EC2 インスタンス一覧（C7a + Hpc6a） */
export const SIMULATION_EC2_INSTANCE_SIZES: ReadonlyArray<Ec2InstanceSize> = [
  ...C7A_INSTANCE_SIZES,
  ...HPC6A_INSTANCE_SIZES,
];

export const FDS_INSTANCE_FAMILY = "c7a,hpc6a";

export const FDS_MIN_MPI_PROCESSES = 1;
/** hpc6a.48xlarge の vCPU 数が上限 */
export const FDS_MAX_MPI_PROCESSES = 96;

/** 依頼 MPI プロセス数を許容範囲に収める */
export function clampMpiProcesses(value: number): number {
  if (!Number.isFinite(value)) return FDS_MIN_MPI_PROCESSES;
  return Math.min(FDS_MAX_MPI_PROCESSES, Math.max(FDS_MIN_MPI_PROCESSES, Math.floor(value)));
}

/** 指定コア数以上を満たす最小の EC2 インスタンスタイプを選ぶ（C7a → Hpc6a） */
export function pickEc2InstanceType(requestedCores: number): {
  instanceType: string;
  vcpus: number;
  requestedCores: number;
  family: "c7a" | "hpc6a";
} {
  const cores = clampMpiProcesses(requestedCores);
  const c7aMatch = C7A_INSTANCE_SIZES.find((row) => row.vcpus >= cores) ?? null;

  if (c7aMatch) {
    return {
      instanceType: c7aMatch.instanceType,
      vcpus: c7aMatch.vcpus,
      requestedCores: cores,
      family: c7aMatch.family,
    };
  }

  const hpc6aMatch = HPC6A_INSTANCE_SIZES[HPC6A_INSTANCE_SIZES.length - 1]!;
  return {
    instanceType: hpc6aMatch.instanceType,
    vcpus: hpc6aMatch.vcpus,
    requestedCores: cores,
    family: hpc6aMatch.family,
  };
}

/** @deprecated pickEc2InstanceType を使用してください */
export const pickC7aInstanceType = pickEc2InstanceType;

/** @deprecated pickEc2InstanceType の別名 */
export const pickFdsInstanceType = pickEc2InstanceType;

/** クライアント向け sizing 一覧 */
export function listEc2SizingOptions(): Array<{
  mpi_processes: number;
  instance_type: string;
  vcpus: number;
  family: "c7a" | "hpc6a";
}> {
  return SIMULATION_EC2_INSTANCE_SIZES.map((row) => ({
    mpi_processes: row.vcpus,
    instance_type: row.instanceType,
    vcpus: row.vcpus,
    family: row.family,
  }));
}

/** @deprecated listEc2SizingOptions を使用してください */
export const listC7aSizingOptions = listEc2SizingOptions;

/** @deprecated listEc2SizingOptions の別名 */
export const listFdsSizingOptions = listEc2SizingOptions;

/** @deprecated SIMULATION_EC2_INSTANCE_SIZES を使用 */
export const FDS_INSTANCE_SIZES = SIMULATION_EC2_INSTANCE_SIZES;
