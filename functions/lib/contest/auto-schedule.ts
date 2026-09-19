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
  print_staff_member_id: string;
}

/** Picks the earliest bookable date, printer, and staff member for a contest entry. */
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

    const staffId = await pickStaffMemberId(db, date, staffIds);
    if (!staffId) continue;

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
        print_staff_member_id: staffId,
      };
    }
  }

  return null;
}

/** Chooses staff with the fewest assignments on the given date. */
async function pickStaffMemberId(
  db: D1Database,
  date: string,
  staffIds: string[]
): Promise<string | null> {
  if (!staffIds.length) return null;

  const counts = await Promise.all(
    staffIds.map(async (id) => {
      const row = await db
        .prepare(
          `SELECT COUNT(*) AS c FROM print_reservations
           WHERE desired_date = ? AND print_staff_member_id = ? AND status != 'cancelled'`
        )
        .bind(date, id)
        .first<{ c: number }>();
      return { id, count: row?.c ?? 0 };
    })
  );

  counts.sort((a, b) => a.count - b.count || a.id.localeCompare(b.id));
  return counts[0]?.id ?? null;
}
