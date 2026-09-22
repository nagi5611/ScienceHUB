// functions/lib/contest/auto-schedule.ts
import {
  getDateAvailability,
  validatePrinterReservationSpan,
} from '../3dprint/availability';
import { derivePrintScaleFromPartCount, normalizePartCount } from '../3dprint/calendar-span';
import { getAllPrinters } from '../3dprint/printers';
import { getAvailableMemberIdsOnDate } from '../3dprint/reservations';
import { addDays, getEarliestBookableDate } from '../3dprint/slots';

const MAX_LOOKAHEAD_DAYS = 60;

export interface AutoScheduleResult {
  desired_date: string;
  printer_id: string;
}

/** Picks the earliest bookable date and printer for a multi-part job. */
export async function findAutoScheduleSlot(
  db: D1Database,
  partCountInput = 1
): Promise<AutoScheduleResult | null> {
  const partCount = normalizePartCount(partCountInput);
  const printScale = derivePrintScaleFromPartCount(partCount);
  const startDate = getEarliestBookableDate();
  const printers = await getAllPrinters(db);
  const sortedPrinters = [...printers].sort((a, b) => a.position - b.position);

  for (let offset = 0; offset < MAX_LOOKAHEAD_DAYS; offset++) {
    const date = addDays(startDate, offset);
    const staffIds = await getAvailableMemberIdsOnDate(db, date);
    if (!staffIds.length) continue;

    const dayAvailability = await getDateAvailability(db, date, {
      scale: printScale,
      isAdmin: false,
    });
    if (!dayAvailability.can_book) continue;

    for (const printer of sortedPrinters) {
      const printerDay = dayAvailability.printers.find((p) => p.printer_id === printer.id);
      if (!printerDay?.available_scales.includes(printScale)) continue;

      const slotError = await validatePrinterReservationSpan(
        db,
        date,
        printer.id,
        printScale,
        partCount,
        '',
        { isAdmin: false }
      );
      if (slotError) continue;

      return {
        desired_date: date,
        printer_id: printer.id,
      };
    }
  }

  return null;
}
