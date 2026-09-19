// functions/lib/contest/auto-schedule.ts
import { getDateAvailability, validatePrinterReservationSlot } from '../3dprint/availability';
import { getAllPrinters } from '../3dprint/printers';
import { getAvailableMemberIdsOnDate } from '../3dprint/reservations';
import { addDays, getEarliestBookableDate, type PrintScale } from '../3dprint/slots';

const CONTEST_SCALE: PrintScale = 'small';
const MAX_LOOKAHEAD_DAYS = 60;

export interface AutoScheduleResult {
  desired_date: string;
  printer_id: string;
}

/** Picks the earliest bookable date and printer (担当は管理側の承認時に割当). */
export async function findAutoScheduleSlot(
  db: D1Database
): Promise<AutoScheduleResult | null> {
  const startDate = getEarliestBookableDate();
  const printers = await getAllPrinters(db);
  const sortedPrinters = [...printers].sort((a, b) => a.position - b.position);

  for (let offset = 0; offset < MAX_LOOKAHEAD_DAYS; offset++) {
    const date = addDays(startDate, offset);
    const staffIds = await getAvailableMemberIdsOnDate(db, date);
    if (!staffIds.length) continue;

    const dayAvailability = await getDateAvailability(db, date, {
      scale: CONTEST_SCALE,
      isAdmin: false,
    });
    if (!dayAvailability.can_book) continue;

    for (const printer of sortedPrinters) {
      const printerDay = dayAvailability.printers.find((p) => p.printer_id === printer.id);
      if (!printerDay?.available_scales.includes(CONTEST_SCALE)) continue;

      const slotError = await validatePrinterReservationSlot(
        db,
        date,
        printer.id,
        CONTEST_SCALE,
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
