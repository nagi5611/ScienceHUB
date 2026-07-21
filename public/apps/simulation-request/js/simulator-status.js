// public/apps/simulation-request/js/simulator-status.js

export const SIMULATOR_STATUS_LABELS = {
  available: '利用可能',
  unavailable: '利用不可',
  maintenance: 'メンテナンス中',
};

/** Returns whether a simulator status allows booking. */
export function isSimulatorBookable(simulator) {
  return simulator?.bookable === true || simulator?.status === 'available';
}

/** Returns whether a simulator accepts new reservations (status + shift). */
export function isSimulatorOperational(simulator) {
  if (!isSimulatorBookable(simulator)) return false;
  if (simulator?.shift_available === false) return false;
  return true;
}

/** Returns display label for a simulator status. */
export function getSimulatorStatusLabel(status) {
  return SIMULATOR_STATUS_LABELS[status] ?? SIMULATOR_STATUS_LABELS.available;
}

/** Builds a status badge for simulator cards. */
export function buildSimulatorStatusBadge(status, { escapeHtml }) {
  const normalized = status in SIMULATOR_STATUS_LABELS ? status : 'available';
  const label = getSimulatorStatusLabel(normalized);
  return `<span class="simulator-status-badge simulator-status-${normalized}">${escapeHtml(label)}</span>`;
}
