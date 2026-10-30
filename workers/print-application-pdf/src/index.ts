/**
 * print-application-pdf — Browser Run Quick Action /pdf for 3D print application forms.
 */

interface WorkerEnv {
  /** Browser Run binding (quickAction pdf). */
  BROWSER: Fetcher & {
    quickAction(action: 'pdf', options: Record<string, unknown>): Promise<Response>;
  };
  PRINT_APPLICATION_PDF_WORKER_SECRET?: string;
}

function unauthorized(): Response {
  return Response.json({ error: 'unauthorized' }, { status: 401 });
}

function checkSecret(request: Request, env: WorkerEnv): boolean {
  const secret = env.PRINT_APPLICATION_PDF_WORKER_SECRET?.trim();
  if (!secret) return true;
  return request.headers.get('X-Print-Application-Pdf-Secret') === secret;
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }
    if (!checkSecret(request, env)) {
      return unauthorized();
    }

    const url = new URL(request.url);
    if (url.pathname !== '/render' && url.pathname !== '/') {
      return new Response('Not Found', { status: 404 });
    }

    let html: string;
    try {
      const body = (await request.json()) as { html?: string };
      html = typeof body.html === 'string' ? body.html : '';
    } catch {
      return Response.json({ error: 'invalid JSON body' }, { status: 400 });
    }

    if (!html.trim()) {
      return Response.json({ error: 'html is required' }, { status: 400 });
    }

    try {
      const pdfResponse = await env.BROWSER.quickAction('pdf', {
        html,
        gotoOptions: {
          waitUntil: 'domcontentloaded',
          timeout: 15_000,
        },
        waitForSelector: {
          selector: 'pre.form-body',
          visible: true,
          timeout: 10_000,
        },
        pdfOptions: {
          format: 'a4',
          printBackground: true,
          margin: { top: '0', right: '0', bottom: '0', left: '0' },
        },
        actionTimeout: 25_000,
      });

      if (!pdfResponse.ok) {
        const detail = (await pdfResponse.text()).slice(0, 800);
        console.error(
          JSON.stringify({
            event: 'browser_run_pdf_failed',
            status: pdfResponse.status,
            detail,
          })
        );
        return Response.json(
          { error: 'browser pdf failed', status: pdfResponse.status, detail },
          { status: 502 }
        );
      }

      const pdfBytes = await pdfResponse.arrayBuffer();
      const headers = new Headers({
        'Content-Type': 'application/pdf',
        'Cache-Control': 'no-store',
      });
      const browserMs = pdfResponse.headers.get('X-Browser-Ms-Used');
      if (browserMs) {
        headers.set('X-Browser-Ms-Used', browserMs);
      }
      return new Response(pdfBytes, { headers });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(JSON.stringify({ event: 'browser_run_pdf_exception', error: message }));
      return Response.json({ error: message }, { status: 500 });
    }
  },
} satisfies ExportedHandler<WorkerEnv>;
