// functions/lib/3dprint/availability.ts
import {
  canBookPrinterDayByCount,
  getPrinterDailySlotTotal,
  getRemainingPrinterDaySlots,
  getPrinterDayFullMessage,
  isPrinterDayFullByCount,
  parsePrinterDailyCapacity,
} from './printer-daily-capacity';
import { isPrinterAvailableOnDate } from './printer-availability';
import { getAllPrinters, getPrinterById, type Printer } from './printers';
import {
  getReservationsByDate,
  getReservationsByDateAndPrinter,
  hasStaffOnDate,
} from './reservations';
import { isDateBookable, isAdminDateBookable } from './slots';
import {
  computeCalendarEndDate,
  listDatesInclusive,
  normalizePartCount,
  resolveReservationCalendarEndDate,
} from './calendar-span';
import { isPrinterBookable, normalizePrinterStatus } from './printer-status';

export interface PrinterDateAvailability {
  printer_id: string;
  printer_name: string;
  printer_available: boolean;
  printer_bookable: boolean;
  is_full: boolean;
  remaining: number;
  capacity: number;
  count: number;
}

export interface DateAvailabilityResult {
  date: string;
  bookable: boolean;
  staff_available: boolean;
  printer_available: boolean;
  can_book: boolean;
  is_full: boolean;
  remaining: number;
  capacity: number;
  count: number;
  printers: PrinterDateAvailability[];
}

/** Resolves availability for a specific printer on a date. */
export async function getPrinterDateAvailability(
  db: D1Database,
  date: string,
  printer: Printer,
  options: {
    excludeReservationId?: string | null;
    requireShift?: boolean;
  } = {}
): Promise<PrinterDateAvailability> {
  const requireShift = options.requireShift !== false;
  const status = normalizePrinterStatus(printer.status);
  const capacityConfig = parsePrinterDailyCapacity(printer.daily_capacity_json);
  const capacity = getPrinterDailySlotTotal(capacityConfig);
  const shiftOk =
    !requireShift || (await isPrinterAvailableOnDate(db, printer.id, date));
  const statusOk = isPrinterBookable(status);

  const reservations = await getReservationsByDateAndPrinter(db, date, printer.id);
  const filtered = options.excludeReservationId
    ? reservations.filter((r) => r.id !== options.excludeReservationId)
    : reservations;
  const count = filtered.length;
  const operational = shiftOk && statusOk;
  const remaining = operational ? getRemainingPrinterDaySlots(count, capacityConfig) : 0;
  const isFull = !operational || isPrinterDayFullByCount(count, capacityConfig);

  return {
    printer_id: printer.id,
    printer_name: printer.name,
    printer_available: shiftOk,
    printer_bookable: statusOk,
    is_full: isFull,
    remaining,
    capacity,
    count,
  };
}

/** Resolves day-level availability, optionally scoped to one printer. */
export async function getDateAvailability(
  db: D1Database,
  date: string,
  options: {
    printerId?: string | null;
    excludeReservationId?: string | null;
    isAdmin?: boolean;
  } = {}
): Promise<DateAvailabilityResult> {
  const isAdmin = options.isAdmin === true;
  const bookable = isAdmin ? isAdminDateBookable(date) : isDateBookable(date);
  const staffAvailable = isAdmin ? true : await hasStaffOnDate(db, date);
  const requireShift = !isAdmin;

  if (options.printerId) {
    const printer = await getPrinterById(db, options.printerId);
    if (!printer) {
      return emptyAvailability(date, bookable, staffAvailable);
    }

    const printerAvailability = await getPrinterDateAvailability(db, date, printer, {
      excludeReservationId: options.excludeReservationId,
      requireShift,
    });

    const slotOk = !printerAvailability.is_full;

    return {
      date,
      bookable,
      staff_available: staffAvailable,
      printer_available: printerAvailability.printer_available && printerAvailability.printer_bookable,
      can_book:
        bookable &&
        staffAvailable &&
        printerAvailability.printer_available &&
        printerAvailability.printer_bookable &&
        slotOk,
      is_full: printerAvailability.is_full,
      remaining: printerAvailability.remaining,
      capacity: printerAvailability.capacity,
      count: printerAvailability.count,
      printers: [printerAvailability],
    };
  }

  const allReservations = await getReservationsByDate(db, date);
  const filteredAll = options.excludeReservationId
    ? allReservations.filter((r) => r.id !== options.excludeReservationId)
    : allReservations;

  const printers = await getPrintersForAvailability(db, date, {
    excludeReservationId: options.excludeReservationId,
    requireShift,
  });

  const anyPrinterOperational = printers.some(
    (p) => p.printer_available && p.printer_bookable && !p.is_full
  );
  const totalCapacity = printers.reduce((sum, p) => sum + p.capacity, 0);
  const totalRemaining = printers.reduce((sum, p) => sum + p.remaining, 0);

  return {
    date,
    bookable,
    staff_available: staffAvailable,
    printer_available: printers.some((p) => p.printer_available && p.printer_bookable),
    can_book: bookable && staffAvailable && anyPrinterOperational,
    is_full: !anyPrinterOperational,
    remaining: totalRemaining,
    capacity: totalCapacity,
    count: filteredAll.length,
    printers,
  };
}

/** Validates whether a reservation slot can be booked on a printer. */
export async function validatePrinterReservationSlot(
  db: D1Database,
  desiredDate: string,
  printerId: string,
  excludeReservationId: string,
  options: { isAdmin?: boolean } = {}
): Promise<string | null> {
  const isAdmin = options.isAdmin === true;
  const printer = await getPrinterById(db, printerId);
  if (!printer) return '指定されたプリンターが見つかりません';

  const status = normalizePrinterStatus(printer.status);
  if (!isPrinterBookable(status)) {
    return 'この機種は現在予約できません';
  }

  if (!isAdmin) {
    const staffAvailable = await hasStaffOnDate(db, desiredDate);
    if (!staffAvailable) {
      return 'この日は対応可能な印刷担当者がいないため予約できません';
    }

    const shiftOk = await isPrinterAvailableOnDate(db, printerId, desiredDate);
    if (!shiftOk) {
      return 'この日は選択したプリンターが稼働予定に入っていません';
    }
  }

  const capacityConfig = parsePrinterDailyCapacity(printer.daily_capacity_json);
  const reservations = await getReservationsByDateAndPrinter(db, desiredDate, printerId);
  const count = reservations.filter((r) => r.id !== excludeReservationId).length;

  if (isPrinterDayFullByCount(count, capacityConfig)) {
    return getPrinterDayFullMessage();
  }

  if (!canBookPrinterDayByCount(count, capacityConfig)) {
    return '選択した日付の予約枠がいっぱいです。別の日付を選んでください';
  }

  return null;
}

/** Validates each day in a multi-part / multi-day reservation span. */
export async function validatePrinterReservationSpan(
  db: D1Database,
  startDate: string,
  printerId: string,
  partCountInput: unknown,
  excludeReservationId: string,
  options: { isAdmin?: boolean } = {}
): Promise<string | null> {
  const partCount = normalizePartCount(partCountInput);
  const endDate = computeCalendarEndDate(startDate, partCount);
  const dates = listDatesInclusive(startDate, endDate);

  for (const date of dates) {
    const slotError = await validatePrinterReservationSlot(
      db,
      date,
      printerId,
      excludeReservationId,
      options
    );
    if (slotError) {
      if (dates.length > 1) {
        return `${date}: ${slotError}`;
      }
      return slotError;
    }
  }
  return null;
}

export { resolveReservationCalendarEndDate };

async function getPrintersForAvailability(
  db: D1Database,
  date: string,
  options: {
    excludeReservationId?: string | null;
    requireShift?: boolean;
  }
): Promise<PrinterDateAvailability[]> {
  const allPrinters = await getAllPrinters(db);
  const results: PrinterDateAvailability[] = [];

  for (const printer of allPrinters) {
    results.push(
      await getPrinterDateAvailability(db, date, printer, {
        excludeReservationId: options.excludeReservationId,
        requireShift: options.requireShift,
      })
    );
  }

  return results;
}

function emptyAvailability(
  date: string,
  bookable: boolean,
  staffAvailable: boolean
): DateAvailabilityResult {
  return {
    date,
    bookable,
    staff_available: staffAvailable,
    printer_available: false,
    can_book: false,
    is_full: true,
    remaining: 0,
    capacity: 0,
    count: 0,
    printers: [],
  };
}
