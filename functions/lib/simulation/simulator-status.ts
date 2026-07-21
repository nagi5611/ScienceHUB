// functions/lib/simulation/simulator-status.ts

export const SIMULATOR_STATUSES = ['available', 'unavailable', 'maintenance'] as const;
export type SimulatorStatus = (typeof SIMULATOR_STATUSES)[number];

export const SIMULATOR_STATUS_LABELS: Record<SimulatorStatus, string> = {
  available: '利用可能',
  unavailable: '利用不可',
  maintenance: 'メンテナンス中',
};

/** Returns whether a simulator accepts new reservations. */
export function isSimulatorBookable(status: string | null | undefined): boolean {
  return status === 'available';
}

/** Normalizes simulator status input. */
export function normalizeSimulatorStatus(status: string | null | undefined): SimulatorStatus {
  if (status && SIMULATOR_STATUSES.includes(status as SimulatorStatus)) {
    return status as SimulatorStatus;
  }
  return 'available';
}

/** Validates simulator status. Returns error message or null. */
export function validateSimulatorStatusInput(status: unknown): string | null {
  if (typeof status !== 'string' || !SIMULATOR_STATUSES.includes(status as SimulatorStatus)) {
    return 'シミュレーターステータスが不正です';
  }
  return null;
}

/** Returns a user-facing message when booking is blocked by status. */
export function getSimulatorBookingBlockMessage(status: SimulatorStatus): string {
  if (status === 'maintenance') {
    return 'この機種はメンテナンス中のため、現在予約できません';
  }
  if (status === 'unavailable') {
    return 'この機種は利用不可のため、現在予約できません';
  }
  return 'この機種は現在予約できません';
}
