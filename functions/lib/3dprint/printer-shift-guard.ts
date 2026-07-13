// functions/lib/3dprint/printer-shift-guard.ts
import { getReservationsByDateAndPrinter, type Reservation } from './reservations';
import { isPrinterAvailableOnDate } from './printer-availability';

export interface PrinterShiftBlockReservation {
  id: string;
  title: string;
  print_scale: string;
  desired_date: string;
  status: string;
  printer_id: string | null;
}

/** Checks if removing a printer shift on a date should be blocked. */
export async function checkPrinterShiftRemovalBlocked(
  db: D1Database,
  printerId: string,
  date: string
): Promise<{ blocked: boolean; reservations: PrinterShiftBlockReservation[] }> {
  const isAvailable = await isPrinterAvailableOnDate(db, printerId, date);
  if (!isAvailable) {
    return { blocked: false, reservations: [] };
  }

  const reservations = await getReservationsByDateAndPrinter(db, date, printerId);
  if (!reservations.length) {
    return { blocked: false, reservations: [] };
  }

  return {
    blocked: true,
    reservations: reservations.map(toPrinterShiftBlockReservation),
  };
}

/** Validates printer shift removal for multiple dates. */
export async function checkPrinterShiftRemovalBlockedForDates(
  db: D1Database,
  printerId: string,
  dates: string[]
): Promise<{ blocked: boolean; date?: string; reservations: PrinterShiftBlockReservation[] }> {
  for (const date of dates) {
    const result = await checkPrinterShiftRemovalBlocked(db, printerId, date);
    if (result.blocked) {
      return { blocked: true, date, reservations: result.reservations };
    }
  }
  return { blocked: false, reservations: [] };
}

function toPrinterShiftBlockReservation(r: Reservation): PrinterShiftBlockReservation {
  return {
    id: r.id,
    title: r.title,
    print_scale: r.print_scale,
    desired_date: r.desired_date,
    status: r.status,
    printer_id: r.printer_id,
  };
}
