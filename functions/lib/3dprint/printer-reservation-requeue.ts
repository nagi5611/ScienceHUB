// functions/lib/3dprint/printer-reservation-requeue.ts
import { validatePrinterReservationSpan } from './availability';
import { normalizePartCount } from './calendar-span';
import {
  createCalendarEventForReservation,
  deleteCalendarEvent,
  type GoogleCalendarEnv,
} from './google-calendar';
import { getAllPrinters } from './printers';
import {
  getAllMembers,
  getAvailableMemberIdsOnDate,
  getFutureReservationsByPrinter,
  getReservationById,
  setGoogleEventId,
  updateReservationSchedule,
  type Member,
  type Reservation,
} from './reservations';
import { addDays, getTodayJst, type PrintScale } from './slots';

const MAX_LOOKAHEAD_DAYS = 120;

export interface PrinterRequeueOptions {
  /** When false, reservations are moved to other bookable printers. */
  printerBookable: boolean;
}

/** Re-queues future reservations on a printer after capacity or availability changes. */
export async function requeuePrinterReservationsAfterChange(
  env: GoogleCalendarEnv & { DB: D1Database },
  printerId: string,
  options: PrinterRequeueOptions
): Promise<{ moved: number }> {
  const today = getTodayJst();
  const queue = await getFutureReservationsByPrinter(env.DB, printerId, today);
  let moved = 0;

  for (const reservation of queue) {
    const partCount = normalizePartCount(reservation.part_count ?? 1);
    const startDate =
      reservation.desired_date >= today ? reservation.desired_date : today;

    let targetDate: string | null = null;
    let targetPrinterId: string | null = null;

    if (options.printerBookable) {
      targetDate = await findEarliestDateOnPrinter(
        env.DB,
        printerId,
        reservation.print_scale,
        partCount,
        startDate,
        reservation.id
      );
      targetPrinterId = printerId;
      if (!targetDate) {
        throw new Error(
          `予約「${reservation.title}」を再配置できません。このプリンターに空き枠がありません。`
        );
      }
    } else {
      const slot = await findEarliestSlotOnAnyPrinter(
        env.DB,
        partCount,
        reservation.print_scale,
        startDate,
        reservation.id,
        printerId
      );
      if (!slot) {
        throw new Error(
          `予約「${reservation.title}」を再配置できません。他プリンターに空き枠がありません。`
        );
      }
      targetDate = slot.desired_date;
      targetPrinterId = slot.printer_id;
    }

    if (!targetDate || !targetPrinterId) {
      throw new Error(`予約「${reservation.title}」を再配置できません。空き枠がありません。`);
    }

    if (
      targetDate === reservation.desired_date &&
      targetPrinterId === reservation.printer_id
    ) {
      continue;
    }

    await applyReservationScheduleChange(env, reservation, targetDate, targetPrinterId);
    moved += 1;
  }

  return { moved };
}

async function findEarliestDateOnPrinter(
  db: D1Database,
  printerId: string,
  printScale: PrintScale,
  partCount: number,
  startDate: string,
  excludeReservationId: string
): Promise<string | null> {
  for (let offset = 0; offset < MAX_LOOKAHEAD_DAYS; offset++) {
    const date = addDays(startDate, offset);
    const slotError = await validatePrinterReservationSpan(
      db,
      date,
      printerId,
      printScale,
      partCount,
      excludeReservationId,
      { isAdmin: true }
    );
    if (!slotError) return date;
  }
  return null;
}

async function findEarliestSlotOnAnyPrinter(
  db: D1Database,
  partCount: number,
  printScale: PrintScale,
  startDate: string,
  excludeReservationId: string,
  excludePrinterId: string
): Promise<{ desired_date: string; printer_id: string } | null> {
  const printers = await getAllPrinters(db);
  const sortedPrinters = [...printers]
    .filter((p) => p.id !== excludePrinterId)
    .sort((a, b) => a.position - b.position);

  for (let offset = 0; offset < MAX_LOOKAHEAD_DAYS; offset++) {
    const date = addDays(startDate, offset);
    const staffIds = await getAvailableMemberIdsOnDate(db, date);
    if (!staffIds.length) continue;

    for (const printer of sortedPrinters) {
      const slotError = await validatePrinterReservationSpan(
        db,
        date,
        printer.id,
        printScale,
        partCount,
        excludeReservationId,
        { isAdmin: true }
      );
      if (!slotError) {
        return { desired_date: date, printer_id: printer.id };
      }
    }
  }

  return null;
}

async function applyReservationScheduleChange(
  env: GoogleCalendarEnv & { DB: D1Database },
  reservation: Reservation,
  newDate: string,
  newPrinterId: string
): Promise<void> {
  const hadCalendarEvent =
    (reservation.status === 'accepted' || reservation.status === 'printing') &&
    !!reservation.google_event_id;

  if (hadCalendarEvent && reservation.google_event_id) {
    await deleteCalendarEvent(env, reservation.google_event_id);
    await setGoogleEventId(env.DB, reservation.id, null);
  }

  await updateReservationSchedule(env.DB, reservation.id, newDate, newPrinterId);

  const updated = await getReservationById(env.DB, reservation.id);
  if (!updated) return;

  if (
    (updated.status === 'accepted' || updated.status === 'printing') &&
    updated.print_staff_member_id
  ) {
    const memberMap = await loadMemberMap(env.DB);
    const calendarResult = await createCalendarEventForReservation(env, updated, memberMap);
    if (calendarResult.ok && calendarResult.eventId) {
      await setGoogleEventId(env.DB, updated.id, calendarResult.eventId);
    }
  }
}

async function loadMemberMap(db: D1Database): Promise<Map<string, Member>> {
  const members = await getAllMembers(db);
  return new Map(members.map((m) => [m.id, m]));
}
