// functions/lib/3dprint/availability.ts
import {
  getAvailableScalesWithCapacity,
  canBookSlotWithCapacity,
  getScaleBookingConflictMessage,
  isPrinterDayFull,
  parsePrinterDailyCapacity,
  type PrinterDailyCapacity,
} from './printer-daily-capacity';
import { isPrinterAvailableOnDate } from './printer-availability';
import { getAllPrinters, getPrinterById, type Printer } from './printers';
import {
  getReservationsByDate,
  getReservationsByDateAndPrinter,
  hasStaffOnDate,
} from './reservations';
import {
  canBookSlot,
  getRemainingCapacity,
  isDayFull,
  isDateBookable,
  isAdminDateBookable,
  type PrintScale,
} from './slots';
import { isPrinterBookable, normalizePrinterStatus } from './printer-status';

export interface PrinterDateAvailability {
  printer_id: string;
  printer_name: string;
  printer_available: boolean;
  printer_bookable: boolean;
  available_scales: PrintScale[];
  is_full: boolean;
}

export interface DateAvailabilityResult {
  date: string;
  bookable: boolean;
  staff_available: boolean;
  printer_available: boolean;
  can_book: boolean;
  is_full: boolean;
  available_scales: PrintScale[];
  scales: PrintScale[];
  remaining: number;
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
  const capacity = parsePrinterDailyCapacity(printer.daily_capacity_json);
  const shiftOk =
    !requireShift || (await isPrinterAvailableOnDate(db, printer.id, date));
  const statusOk = isPrinterBookable(status);

  const reservations = await getReservationsByDateAndPrinter(db, date, printer.id);
  const filtered = options.excludeReservationId
    ? reservations.filter((r) => r.id !== options.excludeReservationId)
    : reservations;
  const existingScales = filtered.map((r) => r.print_scale);
  const availableScales =
    shiftOk && statusOk
      ? getAvailableScalesWithCapacity(existingScales, capacity)
      : [];

  return {
    printer_id: printer.id,
    printer_name: printer.name,
    printer_available: shiftOk,
    printer_bookable: statusOk,
    available_scales: availableScales,
    is_full: shiftOk && statusOk ? isPrinterDayFull(existingScales, capacity) : true,
  };
}

/** Resolves day-level availability, optionally scoped to one printer. */
export async function getDateAvailability(
  db: D1Database,
  date: string,
  options: {
    printerId?: string | null;
    scale?: PrintScale | null;
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

    const reservations = await getReservationsByDateAndPrinter(db, date, printer.id);
    const filtered = options.excludeReservationId
      ? reservations.filter((r) => r.id !== options.excludeReservationId)
      : reservations;
    const existingScales = filtered.map((r) => r.print_scale);
    const capacity = parsePrinterDailyCapacity(printer.daily_capacity_json);
    const slotOk = options.scale
      ? canBookSlotWithCapacity(existingScales, options.scale, capacity)
      : printerAvailability.available_scales.length > 0;

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
      available_scales: printerAvailability.available_scales,
      scales: existingScales,
      remaining: getRemainingCapacity(existingScales),
      count: filtered.length,
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

  const unionScales = new Set<PrintScale>();
  for (const printer of printers) {
    for (const scale of printer.available_scales) {
      unionScales.add(scale);
    }
  }
  const availableScales = [...unionScales];
  const anyPrinterOperational = printers.some(
    (p) => p.printer_available && p.printer_bookable && p.available_scales.length > 0
  );
  const slotOk = options.scale
    ? availableScales.includes(options.scale)
    : anyPrinterOperational;

  return {
    date,
    bookable,
    staff_available: staffAvailable,
    printer_available: printers.some((p) => p.printer_available && p.printer_bookable),
    can_book: bookable && staffAvailable && anyPrinterOperational && slotOk,
    is_full: !anyPrinterOperational,
    available_scales: availableScales,
    scales: filteredAll.map((r) => r.print_scale),
    remaining: getRemainingCapacity(filteredAll.map((r) => r.print_scale)),
    count: filteredAll.length,
    printers,
  };
}

/** Validates whether a reservation slot can be booked on a printer. */
export async function validatePrinterReservationSlot(
  db: D1Database,
  desiredDate: string,
  printerId: string,
  printScale: PrintScale,
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

  const capacity = parsePrinterDailyCapacity(printer.daily_capacity_json);
  const reservations = await getReservationsByDateAndPrinter(db, desiredDate, printerId);
  const existingScales = reservations
    .filter((r) => r.id !== excludeReservationId)
    .map((r) => r.print_scale);

  if (isPrinterDayFull(existingScales, capacity)) {
    return 'このプリンターはこの日もう満杯です。別の日付または機種を選んでください';
  }

  return getScaleBookingConflictMessage(existingScales, printScale, capacity);
}

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
    available_scales: [],
    scales: [],
    remaining: 0,
    count: 0,
    printers: [],
  };
}

/** Legacy day-level slot validation using global default capacity. */
export function validateLegacyDaySlot(
  existingScales: PrintScale[],
  printScale: PrintScale,
  capacity?: PrinterDailyCapacity
): string | null {
  if (isDayFull(existingScales, capacity)) {
    return 'この日はもう満杯です。別の日付を選んでください';
  }
  if (!canBookSlot(existingScales, printScale, capacity)) {
    if (
      existingScales.includes('small') &&
      (printScale === 'medium' || printScale === 'large')
    ) {
      return 'この日はスモール印刷が入っているため、ミディアム・ラージは選択できません';
    }
    return '選択した日付の予約枠がいっぱいです。別の日付を選んでください';
  }
  return null;
}
