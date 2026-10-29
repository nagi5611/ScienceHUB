// public/apps/3dprint-reservation/js/printer-status.js

export const PRINTER_STATUS_LABELS = {
  available: '印刷可能',
  unavailable: '印刷不能',
  maintenance: 'メンテナンス中',
};

/** Returns whether a printer status allows booking. */
export function isPrinterBookable(printer) {
  return printer?.bookable === true || printer?.status === 'available';
}

/** Returns whether a printer accepts new reservations (status + shift). */
export function isPrinterOperational(printer) {
  if (!isPrinterBookable(printer)) return false;
  if (printer?.shift_available === false) return false;
  return true;
}

/** Returns display label for a printer status. */
export function getPrinterStatusLabel(status) {
  return PRINTER_STATUS_LABELS[status] ?? PRINTER_STATUS_LABELS.available;
}

/** Builds a status badge for printer cards. */
export function buildPrinterStatusBadge(status, { escapeHtml }) {
  const normalized = status in PRINTER_STATUS_LABELS ? status : 'available';
  const label = getPrinterStatusLabel(normalized);
  return `<span class="printer-status-badge printer-status-${normalized}">${escapeHtml(label)}</span>`;
}
