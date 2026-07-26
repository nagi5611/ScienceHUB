// functions/lib/simulation/ec2-simulator-catalog.ts
import { C7A_INSTANCE_SIZES } from './fds-instance-sizing';
import {
  createSimulator,
  getAllSimulators,
  type Simulator,
} from './simulators';
import {
  parseSimulatorCapabilities,
  type SimulatorCapabilities,
} from './simulator-capabilities';

export interface Ec2InstanceCatalogRow {
  instance_type: string;
  vcpus: number;
  memory_gib: number;
  registered: boolean;
  simulator_id: string | null;
  simulator_name: string | null;
}

/** Returns EC2 instance types with registration status from sim_simulators. */
export async function buildEc2InstanceCatalog(db: D1Database): Promise<Ec2InstanceCatalogRow[]> {
  const simulators = await getAllSimulators(db);
  const byType = new Map<string, Simulator>();

  for (const simulator of simulators) {
    const caps = parseSimulatorCapabilities(simulator.capabilities_json);
    const type = caps.ec2_instance_type?.trim();
    if (type) byType.set(type, simulator);
  }

  return C7A_INSTANCE_SIZES.map((row) => {
    const registered = byType.get(row.instanceType);
    return {
      instance_type: row.instanceType,
      vcpus: row.vcpus,
      memory_gib: row.memory_gib,
      registered: Boolean(registered),
      simulator_id: registered?.id ?? null,
      simulator_name: registered?.name ?? null,
    };
  });
}

/** Finds a simulator registered for the given EC2 instance type. */
export async function findSimulatorByEc2InstanceType(
  db: D1Database,
  instanceType: string
): Promise<Simulator | null> {
  const normalized = instanceType.trim();
  if (!normalized) return null;

  const simulators = await getAllSimulators(db);
  for (const simulator of simulators) {
    const caps = parseSimulatorCapabilities(simulator.capabilities_json);
    if (caps.ec2_instance_type === normalized) return simulator;
  }
  return null;
}

/** Validates instance type against the FDS c7a catalog. */
export function resolveEc2CatalogEntry(instanceType: string): { instanceType: string; vcpus: number } | null {
  const normalized = instanceType.trim();
  const row = C7A_INSTANCE_SIZES.find((entry) => entry.instanceType === normalized);
  if (!row) return null;
  return { instanceType: row.instanceType, vcpus: row.vcpus };
}

/** Default capabilities for an EC2-backed simulator row. */
export function ec2SimulatorCapabilities(instanceType: string, vcpus: number): SimulatorCapabilities {
  return {
    can_record_result_video: false,
    nozzle_sizes_mm: [],
    ec2_instance_type: instanceType,
    vcpus,
  };
}

/** Registers one catalog instance type as an available simulator. */
export async function registerEc2InstanceAsSimulator(
  db: D1Database,
  instanceType: string
): Promise<Simulator> {
  const entry = resolveEc2CatalogEntry(instanceType);
  if (!entry) {
    throw new Error('サポートされていない EC2 インスタンスタイプです');
  }

  const existing = await findSimulatorByEc2InstanceType(db, entry.instanceType);
  if (existing) {
    throw new Error(`${entry.instanceType} は既に登録されています`);
  }

  const id = crypto.randomUUID();
  const name = `EC2 ${entry.instanceType} (${entry.vcpus} vCPU)`;

  return createSimulator(db, {
    id,
    name,
    capabilities: ec2SimulatorCapabilities(entry.instanceType, entry.vcpus),
    status: 'available',
  });
}
