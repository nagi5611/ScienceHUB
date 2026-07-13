// functions/lib/3dprint/printer-status.ts

export const PRINTER_STATUSES = ['available', 'unavailable', 'maintenance'] as const;
export type PrinterStatus = (typeof PRINTER_STATUSES)[number];

export const PRINTER_STATUS_LABELS: Record<PrinterStatus, string> = {
  available: '印刷可能',
  unavailable: '印刷不能',
  maintenance: 'メンテナンス中',
};

/** Returns whether a printer accepts new reservations. */
export function isPrinterBookable(status: string | null | undefined): boolean {
  return status === 'available';
}

/** Normalizes printer status input. */
export function normalizePrinterStatus(status: string | null | undefined): PrinterStatus {
  if (status && PRINTER_STATUSES.includes(status as PrinterStatus)) {
    return status as PrinterStatus;
  }
  return 'available';
}

/** Validates printer status. Returns error message or null. */
export function validatePrinterStatusInput(status: unknown): string | null {
  if (typeof status !== 'string' || !PRINTER_STATUSES.includes(status as PrinterStatus)) {
    return 'プリンターステータスが不正です';
  }
  return null;
}

/** Returns a user-facing message when booking is blocked by status. */
export function getPrinterBookingBlockMessage(status: PrinterStatus): string {
  if (status === 'maintenance') {
    return 'この機種はメンテナンス中のため、現在予約できません';
  }
  if (status === 'unavailable') {
    return 'この機種は印刷不能のため、現在予約できません';
  }
  return 'この機種は現在予約できません';
}
