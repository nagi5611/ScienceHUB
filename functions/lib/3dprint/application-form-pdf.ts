import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, rgb } from 'pdf-lib';
import type { Printer } from './printers';
import type { Reservation } from './reservations';
import { buildPrintApplicationFormText } from './application-form-text';

const FONT_URL =
  'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@5.2.8/files/noto-sans-jp-japanese-400-normal.woff';

let cachedFontBytes: ArrayBuffer | undefined;

/** Loads Noto Sans JP (woff) for pdf-lib + fontkit. */
async function loadJapaneseFontBytes(): Promise<ArrayBuffer> {
  if (cachedFontBytes) return cachedFontBytes;
  const res = await fetch(FONT_URL);
  if (!res.ok) {
    throw new Error(`application form font fetch failed: ${res.status}`);
  }
  cachedFontBytes = await res.arrayBuffer();
  return cachedFontBytes;
}

/** Renders plain-text application form lines into a PDF byte array. */
export async function buildApplicationFormPdfBytes(text: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const font = await pdfDoc.embedFont(await loadJapaneseFontBytes());

  const fontSize = 10;
  const lineHeight = 14;
  const margin = 48;
  const maxWidth = 595 - margin * 2;

  let page = pdfDoc.addPage([595, 842]);
  let y = page.getHeight() - margin;

  const lines = text.replace(/\r\n/g, '\n').split('\n');
  for (const rawLine of lines) {
    const chunks = wrapLine(rawLine, font, fontSize, maxWidth);
    for (const line of chunks.length ? chunks : ['']) {
      if (y < margin) {
        page = pdfDoc.addPage([595, 842]);
        y = page.getHeight() - margin;
      }
      page.drawText(line, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0.1, 0.1, 0.12),
      });
      y -= lineHeight;
    }
  }

  return pdfDoc.save();
}

function wrapLine(
  line: string,
  font: Awaited<ReturnType<PDFDocument['embedFont']>>,
  fontSize: number,
  maxWidth: number
): string[] {
  if (!line) return [''];
  const out: string[] = [];
  let current = '';
  for (const char of line) {
    const next = current + char;
    if (font.widthOfTextAtSize(next, fontSize) > maxWidth && current) {
      out.push(current);
      current = char;
    } else {
      current = next;
    }
  }
  if (current) out.push(current);
  return out;
}

export function applicationFormPdfR2Key(reservationId: string): string {
  return `print/applications/${reservationId}/application-form.pdf`;
}

/** Generates PDF from reservation snapshot and stores it in R2; updates D1 key. */
export async function persistApplicationFormPdf(
  env: { FILES: R2Bucket },
  db: D1Database,
  reservation: Reservation,
  printer: Printer | undefined
): Promise<{ r2Key: string; bytes: Uint8Array } | null> {
  try {
    const text = await buildPrintApplicationFormText(db, reservation, printer);
    const bytes = await buildApplicationFormPdfBytes(text);
    const r2Key = applicationFormPdfR2Key(reservation.id);
    await env.FILES.put(r2Key, bytes, {
      httpMetadata: { contentType: 'application/pdf' },
    });
    await db
      .prepare(
        'UPDATE print_reservations SET application_form_pdf_r2_key = ? WHERE id = ?'
      )
      .bind(r2Key, reservation.id)
      .run();
    return { r2Key, bytes };
  } catch (err) {
    console.error('persistApplicationFormPdf failed', err);
    return null;
  }
}
