import type { Printer } from './printers';
import type { Reservation } from './reservations';
import { buildPrintApplicationFormText } from './application-form-text';
import {
  renderApplicationFormPdfBytes,
  type ApplicationFormPdfRenderEnv,
} from './application-form-pdf-client';

export function applicationFormPdfR2Key(reservationId: string): string {
  return `print/applications/${reservationId}/application-form.pdf`;
}

/** Discord attachment filename for the application-form PDF. */
export function applicationFormPdfDiscordFilename(reservationId: string): string {
  const safe = reservationId.replace(/[^\w.-]/g, '_');
  return `application-form-${safe || 'reservation'}.pdf`;
}

function logPersistFailure(
  stage: string,
  reservationId: string,
  err: unknown,
  extra?: Record<string, unknown>
): void {
  const error =
    err instanceof Error
      ? { message: err.message, name: err.name, stack: err.stack }
      : { message: String(err) };
  console.error(
    JSON.stringify({
      event: 'persistApplicationFormPdf_failed',
      stage,
      reservationId,
      ...extra,
      error,
    })
  );
}

/** Generates PDF via Browser Run and stores it in R2; updates D1 key. */
export async function persistApplicationFormPdf(
  env: ApplicationFormPdfRenderEnv,
  db: D1Database,
  reservation: Reservation,
  printer: Printer | undefined
): Promise<{ r2Key: string; bytes: Uint8Array } | null> {
  const reservationId = reservation.id;
  try {
    const text = await buildPrintApplicationFormText(db, reservation, printer);
    const bytes = await renderApplicationFormPdfBytes(env, text, reservationId);
    const r2Key = applicationFormPdfR2Key(reservationId);
    await env.FILES.put(r2Key, bytes, {
      httpMetadata: { contentType: 'application/pdf' },
    });
    await db
      .prepare(
        'UPDATE print_reservations SET application_form_pdf_r2_key = ? WHERE id = ?'
      )
      .bind(r2Key, reservationId)
      .run();
    console.log(
      JSON.stringify({
        event: 'persistApplicationFormPdf_ok',
        reservationId,
        r2Key,
        bytes: bytes.byteLength,
      })
    );
    return { r2Key, bytes };
  } catch (err) {
    logPersistFailure('persist', reservationId, err);
    return null;
  }
}

/** Loads application-form PDF from R2, generating and persisting if missing. */
export async function ensureApplicationFormPdfBytes(
  env: ApplicationFormPdfRenderEnv,
  db: D1Database,
  reservation: Reservation,
  printer: Printer | undefined
): Promise<{ bytes: Uint8Array; filename: string } | null> {
  const filename = applicationFormPdfDiscordFilename(reservation.id);
  const r2Key =
    reservation.application_form_pdf_r2_key ?? applicationFormPdfR2Key(reservation.id);
  try {
    const obj = await env.FILES.get(r2Key);
    if (obj) {
      const bytes = new Uint8Array(await obj.arrayBuffer());
      return { bytes, filename };
    }
  } catch (err) {
    logPersistFailure('load_r2', reservation.id, err, { r2Key });
  }

  const persisted = await persistApplicationFormPdf(env, db, reservation, printer);
  if (!persisted) return null;
  return { bytes: persisted.bytes, filename };
}
