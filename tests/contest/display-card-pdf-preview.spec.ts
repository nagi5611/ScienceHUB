import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers";
import { uniqueContestTitle } from "../contest-entry/helpers";
import {
  DISPLAY_CARD_LAYOUT,
  DISPLAY_CARD_WIDTH_PX,
} from "../../public/apps/contest-entry/js/display-card-preview.js";

test.describe("contest-management — 展示カード PDF プレビュー", () => {
  test.use({ serviceWorkers: "block" });

  test("参加申請一覧の PDF ボタンでプレビューモーダルが開く", async ({ page }) => {
    test.setTimeout(120_000);
    await loginAsAdmin(page.request);
    const title = uniqueContestTitle("pdf-preview");

    const createRes = await page.request.post("/api/contest/applications", {
      data: {
        schedule_type: "full_time",
        homeroom: "101",
        student_number: 7,
        student_name: "山田太郎",
        title,
        impressions: "テストコメント。PDFプレビュー用の短文です。",
        members: [{ homeroom: "101", member_name: "山田太郎" }],
      },
    });
    expect(createRes.ok()).toBeTruthy();

    const layoutRes = await page.request.patch("/api/contest/admin/settings/display-card-layout", {
      data: { layout: DISPLAY_CARD_LAYOUT },
    });
    expect(layoutRes.ok()).toBeTruthy();

    const appsLoaded = page.waitForResponse(
      (res) =>
        res.url().includes("/api/contest/admin/applications") &&
        res.request().method() === "GET" &&
        res.ok(),
      { timeout: 30_000 }
    );
    await page.goto("/apps/contest-management/", { waitUntil: "domcontentloaded" });
    await appsLoaded;
    await expect(page.locator("body")).not.toContainText("アクセス拒否", { timeout: 20_000 });

    await page.locator('.admin-menu-item[data-panel="applications"]').click();

    const panel = page.locator("#panel-applications");
    await expect(panel).toBeVisible({ timeout: 20_000 });
    await expect(panel).not.toHaveClass(/hidden/);
    await expect(page.locator("#contest-applications-toolbar")).toBeVisible({ timeout: 30_000 });

    const row = page.locator("#applications-results-mount tr", { hasText: title }).first();
    await expect(row).toBeVisible({ timeout: 20_000 });

    const modal = page.locator("#contest-display-card-pdf-modal");
    await page.evaluate((rowTitle) => {
      const row = [...document.querySelectorAll("#applications-results-mount tr")].find((tr) =>
        tr.textContent?.includes(rowTitle)
      );
      const btn = row?.querySelector(".contest-admin-app-display-card-pdf");
      if (btn instanceof HTMLButtonElement) btn.click();
    }, title);

    await expect(page.locator("#contest-applications-pdf-status")).toContainText("PDFプレビュー生成中", {
      timeout: 20_000,
    });

    await expect(modal).toHaveClass(/open/, { timeout: 90_000 });
    const previewHost = modal.locator("[data-display-card-pdf-preview-host]");
    await expect(previewHost).toBeVisible();
    const previewCard = modal.getByTestId("display-card-root");
    await expect(previewCard).toBeVisible({ timeout: 30_000 });
    await expect(modal.getByTestId("display-card-title")).toContainText(title);

    const previewChecks = await page.evaluate(async (expectedTitle) => {
      const pdfMod = await import("/apps/contest-management/js/display-card-pdf-export.js");
      const previewMod = await import("/apps/contest-entry/js/display-card-preview.js");
      const layout = previewMod.getDisplayCardLayout?.() ?? previewMod.DISPLAY_CARD_LAYOUT;

      const measureFieldFraction = (host: HTMLElement, testId: string) => {
        const card = host.querySelector('[data-testid="display-card-root"]');
        const field = host.querySelector(`[data-testid="${testId}"]`);
        if (!(card instanceof HTMLElement) || !(field instanceof HTMLElement)) return null;
        const cardRect = card.getBoundingClientRect();
        const fieldRect = field.getBoundingClientRect();
        if (cardRect.width < 1 || cardRect.height < 1) return null;
        return {
          left: (fieldRect.left - cardRect.left) / cardRect.width,
          top: (fieldRect.top - cardRect.top) / cardRect.height,
        };
      };

      const modalHost = document.querySelector("[data-display-card-pdf-preview-host]");
      if (!(modalHost instanceof HTMLElement)) return { ok: false as const };

      const hasScaleWrap = Boolean(modalHost.querySelector(".contest-display-card-scale-wrap"));
      const modalTitle = measureFieldFraction(modalHost, "display-card-title");
      const expectedLeft = layout.title.left / 100;
      const expectedTop = layout.title.top / 100;

      const app = {
        schedule_type: "full_time",
        homeroom: "101",
        student_number: 7,
        student_name: "山田太郎",
        title: expectedTitle,
        impressions: "テストコメント。PDFプレビュー用の短文です。",
        members: [{ homeroom: "101", member_name: "山田太郎" }],
      };
      const cardBefore = modalHost.querySelector('[data-testid="display-card-root"]');
      const cardRectBefore =
        cardBefore instanceof HTMLElement ? cardBefore.getBoundingClientRect() : null;

      const canvas = await pdfMod.renderDisplayCardPreviewCanvasFromHost(modalHost, layout);
      try {
        pdfMod.assertDisplayCardCanvasHasOverlayInk(canvas, layout);
      } catch {
        return { ok: false as const };
      }

      const cardAfter = modalHost.querySelector('[data-testid="display-card-root"]');
      const cardRectAfter =
        cardAfter instanceof HTMLElement ? cardAfter.getBoundingClientRect() : null;
      const scaleWrapAfter = modalHost.querySelector(".contest-display-card-scale-wrap");
      const scaleWrapWidthAfter =
        scaleWrapAfter instanceof HTMLElement ? scaleWrapAfter.getBoundingClientRect().width : 0;

      const sampleCanvasTitleInk = () => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return 0;
        const scale = canvas.width / previewMod.DISPLAY_CARD_WIDTH_PX;
        const left = Math.floor((layout.title.left / 100) * previewMod.DISPLAY_CARD_WIDTH_PX * scale);
        const top = Math.floor((layout.title.top / 100) * previewMod.DISPLAY_CARD_HEIGHT_PX * scale);
        const width = Math.max(
          8,
          Math.floor((layout.title.width / 100) * previewMod.DISPLAY_CARD_WIDTH_PX * scale)
        );
        const height = Math.max(8, Math.ceil(layout.title.fontSize * scale * 1.4));
        const region = ctx.getImageData(left, top, width, height);
        let dark = 0;
        for (let i = 0; i < region.data.length; i += 4) {
          const alpha = region.data[i + 3];
          const lum = region.data[i] + region.data[i + 1] + region.data[i + 2];
          if (alpha > 16 && lum < 720) dark += 1;
        }
        return dark;
      };

      const titleInkPixels = sampleCanvasTitleInk();
      const visibleToDesignScale =
        cardRectBefore && cardRectBefore.width > 0
          ? cardRectBefore.width / previewMod.DISPLAY_CARD_WIDTH_PX
          : 0;

      const pdfBlob = pdfMod.displayCardCanvasToPdfBlob(canvas);
      const pdfFromModalUrl = document
        .getElementById("contest-display-card-pdf-modal")
        ?.getAttribute("data-download-url");

      const input = pdfMod.applicationToDisplayCardInput(app);
      const state = previewMod.buildDisplayCardPreviewState(input, layout, {
        cardWidthPx: previewMod.DISPLAY_CARD_WIDTH_PX,
      });
      const mount = previewMod.mountDisplayCardPreviewCaptureHost();
      previewMod.renderDisplayCardPreview(mount.host, state, { layout });
      mount.host.style.width = `${modalHost.clientWidth}px`;
      previewMod.fitDisplayCardPreviewToHost(mount.host);
      const entryTitle = measureFieldFraction(mount.host, "display-card-title");
      mount.dispose();

      const titleDelta =
        modalTitle && entryTitle
          ? Math.max(
              Math.abs(modalTitle.left - entryTitle.left),
              Math.abs(modalTitle.top - entryTitle.top)
            )
          : 1;

      return {
        ok: true as const,
        hasScaleWrap,
        modalTitle,
        entryTitle,
        titleDelta,
        expectedLeft,
        expectedTop,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        pdfBlobSize: pdfBlob.size,
        hasModalPdfUrl: Boolean(pdfFromModalUrl),
        titleInkPixels,
        visibleToDesignScale,
        cardWidthAfterCapture: cardRectAfter?.width ?? 0,
        scaleWrapWidthAfter,
        fitRestored:
          cardRectAfter &&
          cardRectBefore &&
          Math.abs(cardRectAfter.width - cardRectBefore.width) < 2,
      };
    }, title);

    expect(previewChecks.ok).toBe(true);
    if (previewChecks.ok) {
      expect(previewChecks.hasScaleWrap).toBe(true);
      expect(previewChecks.canvasWidth).toBe(1600);
      expect(previewChecks.canvasHeight).toBe(900);
      expect(previewChecks.titleInkPixels).toBeGreaterThan(8);
      expect(previewChecks.fitRestored).toBe(true);
      if (previewChecks.visibleToDesignScale > 0 && previewChecks.visibleToDesignScale < 1) {
        expect(previewChecks.scaleWrapWidthAfter).toBeLessThan(DISPLAY_CARD_WIDTH_PX);
      }
      expect(previewChecks.pdfBlobSize).toBeGreaterThan(1000);
      expect(previewChecks.hasModalPdfUrl).toBe(true);
      expect(previewChecks.titleDelta).toBeLessThan(0.02);
      expect(Math.abs((previewChecks.modalTitle?.left ?? 0) - previewChecks.expectedLeft)).toBeLessThan(
        0.08
      );
    }

    await modal.locator("[data-display-card-pdf-dismiss]").click();
    await expect(modal).not.toHaveClass(/open/);
  });
});
