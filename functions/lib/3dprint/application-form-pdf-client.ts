import {
  APPLICATION_FORM_FONT_R2_KEY,
  buildApplicationFormHtml,
  bytesToBase64,
} from './application-form-html';

export type ApplicationFormPdfRenderEnv = {
  FILES: R2Bucket;
  PRINT_APPLICATION_PDF?: Fetcher;
  PRINT_APPLICATION_PDF_WORKER_SECRET?: string;
};

function logRenderFailure(
  stage: string,
  reservationId: string | undefined,
  err: unknown,
  extra?: Record<string, unknown>
): void {
  const error =
    err instanceof Error
      ? { message: err.message, name: err.name, stack: err.stack }
      : { message: String(err) };
  console.error(
    JSON.stringify({
      event: 'application_form_pdf_failed',
      stage,
      reservationId,
      ...extra,
      error,
    })
  );
}

async function loadFontWoff2Base64(files: R2Bucket): Promise<string> {
  const obj = await files.get(APPLICATION_FORM_FONT_R2_KEY);
  if (!obj) {
    throw new Error(
      `application form font missing in R2 at ${APPLICATION_FORM_FONT_R2_KEY} (run scripts/upload-print-application-font.mjs)`
    );
  }
  const bytes = new Uint8Array(await obj.arrayBuffer());
  return bytesToBase64(bytes);
}

/** Renders application form plain text to PDF bytes via the print-application-pdf Worker. */
export async function renderApplicationFormPdfBytes(
  env: ApplicationFormPdfRenderEnv,
  applicationText: string,
  reservationId?: string
): Promise<Uint8Array> {
  if (!env.PRINT_APPLICATION_PDF) {
    throw new Error('PRINT_APPLICATION_PDF service binding is not configured');
  }

  let fontBase64: string;
  try {
    fontBase64 = await loadFontWoff2Base64(env.FILES);
  } catch (err) {
    logRenderFailure('load_font_r2', reservationId, err);
    throw err;
  }

  const html = buildApplicationFormHtml(applicationText, fontBase64);
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const secret = env.PRINT_APPLICATION_PDF_WORKER_SECRET?.trim();
  if (secret) {
    headers['X-Print-Application-Pdf-Secret'] = secret;
  }

  let workerRes: Response;
  try {
    workerRes = await env.PRINT_APPLICATION_PDF.fetch(
      new Request('https://print-application-pdf.internal/render', {
        method: 'POST',
        headers,
        body: JSON.stringify({ html }),
      })
    );
  } catch (err) {
    logRenderFailure('worker_fetch', reservationId, err);
    throw err;
  }

  if (!workerRes.ok) {
    const detail = (await workerRes.text()).slice(0, 800);
    const err = new Error(
      `print-application-pdf worker returned ${workerRes.status}: ${detail}`
    );
    logRenderFailure('worker_http', reservationId, err, {
      status: workerRes.status,
      browserMsUsed: workerRes.headers.get('X-Browser-Ms-Used'),
    });
    throw err;
  }

  const ct = workerRes.headers.get('Content-Type') ?? '';
  if (!ct.includes('pdf') && !ct.includes('octet-stream')) {
    const snippet = (await workerRes.clone().text()).slice(0, 200);
    throw new Error(`unexpected PDF worker content-type ${ct}: ${snippet}`);
  }

  const browserMs = workerRes.headers.get('X-Browser-Ms-Used');
  if (browserMs) {
    console.log(
      JSON.stringify({
        event: 'application_form_pdf_rendered',
        reservationId,
        browserMsUsed: browserMs,
      })
    );
  }

  return new Uint8Array(await workerRes.arrayBuffer());
}
