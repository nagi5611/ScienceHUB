import type { Env } from '../types';
import type { Reservation } from './reservations';
import type { PrintReservationFileInput } from './print-reservation-files';
import { replacePrintReservationFiles } from './print-reservation-files';
import { persistApplicationFormPdf } from './application-form-pdf';
import { buildPrintApplicationFormText, formatPrinterMachineLabel } from './application-form-text';
import { getPrinterById, type Printer } from './printers';
import {
  notifyReservationApplicationImmediate,
  notifyReservationApplicationPdfReady,
} from './discord';

export type SubmissionAsyncContext = {
  env: Env;
  db: D1Database;
  request: Request;
  reservation: Reservation;
  applicantUserId: string;
  printFiles: PrintReservationFileInput[];
  adminDeepLink: string;
  buildPdfUrl: (reservationId: string) => string;
};

/** Formats reservation created_at in JST for Discord. */
export function formatApplicationSubmittedAtJst(iso: string): string {
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso));
}

/** Persists print files + application PDF to R2 (off the HTTP critical path). */
export async function persistReservationArtifacts(
  ctx: SubmissionAsyncContext
): Promise<{ printer: Printer | undefined; pdfUrl: string | null }> {
  const { env, db, reservation, printFiles } = ctx;
  await replacePrintReservationFiles(db, reservation.id, printFiles, reservation.created_at);
  const printer = reservation.printer_id
    ? await getPrinterById(db, reservation.printer_id)
    : null;
  const pdfResult = await persistApplicationFormPdf(
    env,
    db,
    reservation,
    printer ?? undefined
  );
  const pdfUrl = pdfResult ? ctx.buildPdfUrl(reservation.id) : null;
  return { printer: printer ?? undefined, pdfUrl };
}

/** Background pipeline: files + PDF, then optional Discord phases. */
export async function runReservationSubmissionAsync(
  ctx: SubmissionAsyncContext,
  opts: { immediateDiscord: boolean; pdfFollowUpDiscord: boolean }
): Promise<void> {
  const { env, reservation } = ctx;
  const webhook = env.DISCORD_WEBHOOK_URL;

  if (opts.immediateDiscord) {
    const printer = reservation.printer_id
      ? await getPrinterById(ctx.db, reservation.printer_id)
      : null;
    await notifyReservationApplicationImmediate(webhook, {
      adminDeepLink: ctx.adminDeepLink,
      applicantName: reservation.student_name,
      title: reservation.title,
      submittedAtJst: formatApplicationSubmittedAtJst(reservation.created_at),
      machineLabel: formatPrinterMachineLabel(printer ?? undefined),
    });
  }

  let pdfUrl: string | null = null;
  try {
    const persisted = await persistReservationArtifacts(ctx);
    pdfUrl = persisted.pdfUrl;
  } catch (err) {
    console.error('persistReservationArtifacts failed', reservation.id, err);
  }

  if (opts.pdfFollowUpDiscord && pdfUrl) {
    await notifyReservationApplicationPdfReady(webhook, {
      title: reservation.title,
      pdfUrl,
      adminDeepLink: ctx.adminDeepLink,
    });
  }
}

/** Builds full application form text after artifacts exist (e.g. email). */
export async function buildApplicationFormTextForReservation(
  db: D1Database,
  reservation: Reservation
): Promise<string> {
  const printer = reservation.printer_id
    ? await getPrinterById(db, reservation.printer_id)
    : undefined;
  return buildPrintApplicationFormText(db, reservation, printer ?? undefined);
}
