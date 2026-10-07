import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers";
import {
  DISPLAY_CARD_LAYOUT,
  DISPLAY_CARD_WIDTH_PX,
  DISPLAY_CARD_HEIGHT_PX,
  DISPLAY_CARD_CAPTURE_SCALE,
} from "../../public/apps/contest-entry/js/display-card-preview.js";

test.describe("contest — 展示カード PDF ピクセル一致", () => {
  test.use({ serviceWorkers: "block" });

  test("キャプチャ bitmap と PDF 1 ページが一致する（サンプル文言）", async ({ page }) => {
    test.setTimeout(120_000);
    await loginAsAdmin(page.request);
    await page.goto("/apps/contest-management/", { waitUntil: "domcontentloaded" });

    const result = await page.evaluate(
      async ({
        layout,
        designW,
        designH,
        captureScale,
      }: {
        layout: typeof DISPLAY_CARD_LAYOUT;
        designW: number;
        designH: number;
        captureScale: number;
      }) => {
        const previewMod = await import("/apps/contest-entry/js/display-card-preview.js");
        const pdfMod = await import("/apps/contest-management/js/display-card-pdf-export.js");
        const pdfjs = await import(
          "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.mjs"
        );
        pdfjs.GlobalWorkerOptions.workerSrc =
          "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";

        const impressions =
          "テストコメント。造形にこだわって作りました。細部まで丁寧に仕上げています。ぜひご覧ください。長めの感想文で折り返しと行配置を確認します。";
        const input = {
          scheduleType: "full_time" as const,
          homeroom: "301",
          studentName: "山田太郎",
          title: "禁断の果実",
          impressions,
        };
        const state = previewMod.buildDisplayCardPreviewState(input, layout, {
          cardWidthPx: designW,
        });
        const mount = previewMod.mountDisplayCardPreviewCaptureHost(designW);
        mount.host.style.width = "380px";
        await previewMod.renderDisplayCardRasterPreview(mount.host, state, { layout });
        const visualSize = previewMod.measureDisplayCardVisualCaptureSize(mount.host);

        const measureInkCenter = (
          canvas: HTMLCanvasElement,
          leftPct: number,
          topPct: number,
          widthPct: number,
          heightPx: number
        ) => {
          const ctx = canvas.getContext("2d");
          if (!ctx) return null;
          const scale = canvas.width / designW;
          const x0 = Math.floor((leftPct / 100) * designW * scale);
          const y0 = Math.floor((topPct / 100) * designH * scale);
          const w = Math.max(8, Math.floor((widthPct / 100) * designW * scale));
          const h = Math.max(8, Math.ceil(heightPx * scale * 1.5));
          const region = ctx.getImageData(
            Math.min(x0, canvas.width - 1),
            Math.min(y0, canvas.height - 1),
            Math.min(w, canvas.width - x0),
            Math.min(h, canvas.height - y0)
          );
          let sumX = 0;
          let sumY = 0;
          let mass = 0;
          for (let y = 0; y < region.height; y++) {
            for (let x = 0; x < region.width; x++) {
              const i = (y * region.width + x) * 4;
              const alpha = region.data[i + 3];
              const lum = region.data[i] + region.data[i + 1] + region.data[i + 2];
              if (alpha > 16 && lum < 720) {
                sumX += x0 + x;
                sumY += y0 + y;
                mass += 1;
              }
            }
          }
          if (mass < 4) return null;
          return { x: sumX / mass, y: sumY / mass, mass };
        };

        const canvas = await previewMod.captureDisplayCardForExport(mount.host, layout);
        pdfMod.assertDisplayCardCanvasHasOverlayInk(canvas, layout);

        const mark = layout.marks.full_time;
        const markCenter = measureInkCenter(
          canvas,
          mark.left,
          mark.top,
          mark.size,
          mark.size * (designH / designW)
        );
        const titleCenter = measureInkCenter(
          canvas,
          layout.title.left,
          layout.title.top,
          layout.title.width,
          layout.title.fontSize
        );

        const pdfBlob = pdfMod.displayCardCanvasToPdfBlob(canvas);
        const pdf = await pdfjs.getDocument({ data: await pdfBlob.arrayBuffer() }).promise;
        const page = await pdf.getPage(1);
        const viewportBase = page.getViewport({ scale: 1 });
        const renderScale = canvas.width / viewportBase.width;
        const viewport = page.getViewport({ scale: renderScale });
        const pdfCanvas = document.createElement("canvas");
        pdfCanvas.width = Math.round(viewport.width);
        pdfCanvas.height = Math.round(viewport.height);
        const pdfCtx = pdfCanvas.getContext("2d");
        if (!pdfCtx) throw new Error("pdf canvas ctx");
        pdfCtx.fillStyle = "#ffffff";
        pdfCtx.fillRect(0, 0, pdfCanvas.width, pdfCanvas.height);
        await page.render({ canvasContext: pdfCtx, viewport }).promise;
        page.cleanup();

        let maxChannelDiff = 0;
        let mismatched = 0;
        const dimensionOk =
          Math.abs(canvas.width - pdfCanvas.width) <= 1 &&
          Math.abs(canvas.height - pdfCanvas.height) <= 1;
        if (!dimensionOk) {
          mount.dispose();
          return {
            ok: false as const,
            reason: "dimension-mismatch",
            canvasW: canvas.width,
            canvasH: canvas.height,
            pdfW: pdfCanvas.width,
            pdfH: pdfCanvas.height,
          };
        }
        const a = canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height).data;
        const b = pdfCtx.getImageData(0, 0, pdfCanvas.width, pdfCanvas.height).data;
        for (let i = 0; i < a.length; i += 4) {
          const d =
            Math.abs(a[i] - b[i]) +
            Math.abs(a[i + 1] - b[i + 1]) +
            Math.abs(a[i + 2] - b[i + 2]) +
            Math.abs(a[i + 3] - b[i + 3]);
          maxChannelDiff = Math.max(maxChannelDiff, d);
          if (d > 24) mismatched += 1;
        }

        const titleFromPdf = measureInkCenter(
          pdfCanvas,
          layout.title.left,
          layout.title.top,
          layout.title.width,
          layout.title.fontSize
        );

        mount.dispose();

        const titleDeltaPx =
          titleCenter && titleFromPdf
            ? Math.hypot(titleCenter.x - titleFromPdf.x, titleCenter.y - titleFromPdf.y)
            : 999;

        return {
          ok: true as const,
          canvasWidth: canvas.width,
          canvasHeight: canvas.height,
          visualWidth: visualSize.width,
          visualHeight: visualSize.height,
          maxChannelDiff,
          mismatched,
          mismatchRatio: mismatched / (canvas.width * canvas.height),
          markCenterMass: markCenter?.mass ?? 0,
          titleDeltaPx,
          pdfBlobSize: pdfBlob.size,
        };
      },
      {
        layout: DISPLAY_CARD_LAYOUT,
        designW: DISPLAY_CARD_WIDTH_PX,
        designH: DISPLAY_CARD_HEIGHT_PX,
        captureScale: DISPLAY_CARD_CAPTURE_SCALE,
      }
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.visualWidth).toBeLessThanOrEqual(DISPLAY_CARD_WIDTH_PX);
    expect(result.canvasWidth).toBe(DISPLAY_CARD_WIDTH_PX * DISPLAY_CARD_CAPTURE_SCALE);
    expect(result.canvasHeight).toBe(DISPLAY_CARD_HEIGHT_PX * DISPLAY_CARD_CAPTURE_SCALE);
    expect(result.markCenterMass).toBeGreaterThan(20);
    expect(result.titleDeltaPx).toBeLessThan(3);
    expect(result.mismatchRatio).toBeLessThan(0.002);
    expect(result.pdfBlobSize).toBeGreaterThan(1000);
  });
});
