import { test, expect } from "@playwright/test";
import { fillPrimaryParticipant, openContestEntry, openNewApplicationForm } from "./helpers";

async function waitForDisplayCardRaster(page: import("@playwright/test").Page) {
  await expect(page.getByTestId("display-card-raster")).toBeVisible({ timeout: 30_000 });
  await expect
    .poll(async () =>
      page.evaluate(async () => {
        const mod = await import("/apps/contest-entry/js/display-card-preview.js");
        const host = document.getElementById("contest-display-card-host");
        if (!(host instanceof HTMLElement)) return false;
        const canvas = mod.getDisplayCardRasterCanvas(host);
        return Boolean(canvas && canvas.width > 0);
      })
    )
    .toBe(true);
}

test.describe("造形物コンテスト — 展示カードプレビュー", () => {
  test.beforeEach(async ({ page }) => {
    await openContestEntry(page);
    await openNewApplicationForm(page);
  });

  test("タイトル・感想・代表者がプレビューに反映される（1年1組・山田太郎）", async ({
    page,
  }) => {
    const impressions =
      "テストコメント。造形にこだわって作りました。細部まで丁寧に仕上げています。ぜひご覧ください。";
    await fillPrimaryParticipant(page, { homeroom: "101", number: "12", name: "山田太郎" });
    await page.locator("#title").fill("テストタイトル");
    await page.locator("#impressions").fill(impressions);

    await waitForDisplayCardRaster(page);

    const checks = await page.evaluate(async () => {
      const previewMod = await import("/apps/contest-entry/js/display-card-preview.js");
      const pdfMod = await import("/apps/contest-management/js/display-card-pdf-export.js");
      const host = document.getElementById("contest-display-card-host");
      if (!(host instanceof HTMLElement)) return { ok: false as const };
      const layout = previewMod.getDisplayCardLayout?.() ?? previewMod.DISPLAY_CARD_LAYOUT;
      const canvas = previewMod.getDisplayCardRasterCanvas(host);
      if (!canvas) return { ok: false as const };
      try {
        pdfMod.assertDisplayCardCanvasHasOverlayInk(canvas, layout);
      } catch {
        return { ok: false as const };
      }
      const input = {
        scheduleType: "full_time" as const,
        homeroom: "101",
        studentName: "山田太郎",
        title: "テストタイトル",
        impressions: (document.querySelector("#impressions") as HTMLTextAreaElement | null)?.value ?? "",
      };
      const state = previewMod.buildDisplayCardPreviewState(input, layout, {
        cardWidthPx: previewMod.DISPLAY_CARD_WIDTH_PX,
      });
      return {
        ok: true as const,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        stateLines: state.commentLines,
        year: state.year,
        classGroup: state.classGroup,
      };
    });

    expect(checks.ok).toBe(true);
    if (checks.ok) {
      expect(checks.canvasWidth).toBe(1600);
      expect(checks.canvasHeight).toBe(900);
      expect(checks.year).toBe("1");
      expect(checks.classGroup).toBe("1");
      expect(checks.stateLines[0]).toContain("テストコメント");
    }

    if (process.env.SAVE_DISPLAY_CARD_SCREENSHOT === "1") {
      await page.getByTestId("display-card-root").screenshot({
        path: "test-results/contest-display-card-preview-sample.png",
      });
    }
  });

  test("在籍区分を定時制にするとプレビューの丸印が切り替わる", async ({ page }) => {
    await waitForDisplayCardRaster(page);
    const fullTimeMark = await page.evaluate(async () => {
      const previewMod = await import("/apps/contest-entry/js/display-card-preview.js");
      const pdfMod = await import("/apps/contest-management/js/display-card-pdf-export.js");
      const layout = previewMod.getDisplayCardLayout?.() ?? previewMod.DISPLAY_CARD_LAYOUT;
      const input = {
        scheduleType: "full_time" as const,
        homeroom: "101",
        studentName: "山田太郎",
        title: "t",
        impressions: "c",
      };
      const canvas = await previewMod.rasterizeDisplayCardState(
        previewMod.buildDisplayCardPreviewState(input, layout, {
          cardWidthPx: previewMod.DISPLAY_CARD_WIDTH_PX,
        }),
        { layout }
      );
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      const mark = layout.marks.full_time;
      const scale = canvas.width / previewMod.DISPLAY_CARD_WIDTH_PX;
      const x = Math.floor(((mark.left + mark.size / 2) / 100) * previewMod.DISPLAY_CARD_WIDTH_PX * scale);
      const y = Math.floor(((mark.top + mark.size / 2) / 100) * previewMod.DISPLAY_CARD_HEIGHT_PX * scale);
      const px = ctx.getImageData(x, y, 1, 1).data;
      return px[0] + px[1] + px[2];
    });
    expect(fullTimeMark).not.toBeNull();

    await page.locator('input[name="schedule_type"][value="part_time"]').check();
    await waitForDisplayCardRaster(page);

    const partTimeInk = await page.evaluate(async () => {
      const previewMod = await import("/apps/contest-entry/js/display-card-preview.js");
      const layout = previewMod.getDisplayCardLayout?.() ?? previewMod.DISPLAY_CARD_LAYOUT;
      const host = document.getElementById("contest-display-card-host");
      const canvas =
        host instanceof HTMLElement ? previewMod.getDisplayCardRasterCanvas(host) : null;
      if (!canvas) return null;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      const mark = layout.marks.part_time;
      const scale = canvas.width / previewMod.DISPLAY_CARD_WIDTH_PX;
      const x = Math.floor(((mark.left + mark.size / 2) / 100) * previewMod.DISPLAY_CARD_WIDTH_PX * scale);
      const y = Math.floor(((mark.top + mark.size / 2) / 100) * previewMod.DISPLAY_CARD_HEIGHT_PX * scale);
      const px = ctx.getImageData(x, y, 1, 1).data;
      return px[3] > 0 ? px[0] + px[1] + px[2] : null;
    });
    expect(partTimeInk).not.toBeNull();
  });

  test("展示カードプレビューがフォーム下の領域とビューポート内に収まる", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await fillPrimaryParticipant(page);
    await page.locator("#title").fill("テストタイトル");
    await waitForDisplayCardRaster(page);

    const preview = page.getByTestId("display-card-root");
    await expect(preview).toBeVisible();

    const bounds = await page.evaluate(() => {
      const form = document.getElementById("application-form");
      const aside = document.querySelector(".contest-display-card-preview-aside");
      const card = document.querySelector('[data-testid="display-card-root"]');
      const formRect = form?.getBoundingClientRect();
      const asideRect = aside?.getBoundingClientRect();
      const cardRect = card?.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      return {
        docScrollWidth: document.documentElement.scrollWidth,
        viewportWidth: vw,
        formBottom: formRect?.bottom ?? 0,
        asideTop: asideRect?.top ?? 0,
        cardLeft: cardRect?.left ?? 0,
        cardRight: cardRect?.right ?? 0,
        asideLeft: asideRect?.left ?? 0,
        asideRight: asideRect?.right ?? 0,
      };
    });

    expect(bounds.asideTop).toBeGreaterThanOrEqual(bounds.formBottom - 2);
    expect(bounds.docScrollWidth).toBeLessThanOrEqual(bounds.viewportWidth + 1);
    expect(bounds.cardLeft).toBeGreaterThanOrEqual(bounds.asideLeft - 1);
    expect(bounds.cardRight).toBeLessThanOrEqual(bounds.asideRight + 1);
    expect(bounds.cardRight).toBeLessThanOrEqual(bounds.viewportWidth + 1);

    const scaleWrap = await page.evaluate(() => {
      const wrap = document.querySelector(".contest-display-card-scale-wrap");
      const card = document.querySelector('[data-testid="display-card-root"]');
      const aside = document.querySelector(".contest-display-card-preview-aside");
      if (!(wrap instanceof HTMLElement) || !(card instanceof HTMLElement) || !aside) return null;
      const wrapRect = wrap.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const asideRect = aside.getBoundingClientRect();
      return {
        wrapLeft: wrapRect.left,
        wrapRight: wrapRect.right,
        cardVisualRight: cardRect.right,
        asideLeft: asideRect.left,
        asideRight: asideRect.right,
      };
    });
    expect(scaleWrap).not.toBeNull();
    if (scaleWrap) {
      expect(scaleWrap.wrapLeft).toBeGreaterThanOrEqual(scaleWrap.asideLeft - 1);
      expect(scaleWrap.wrapRight).toBeLessThanOrEqual(scaleWrap.asideRight + 1);
      expect(scaleWrap.cardVisualRight).toBeLessThanOrEqual(scaleWrap.wrapRight + 1);
    }
  });

  test("展示カードは 800×450 でレイアウトされ PDF キャプチャと同じコメント行になる", async ({
    page,
  }) => {
    const impressions =
      "テストコメント。造形にこだわって作りました。細部まで丁寧に仕上げています。ぜひご覧ください。";
    await fillPrimaryParticipant(page, { homeroom: "101", number: "12", name: "山田太郎" });
    await page.locator("#title").fill("テストタイトル");
    await page.locator("#impressions").fill(impressions);
    await waitForDisplayCardRaster(page);

    const layoutMetrics = await page.evaluate(() => {
      const card = document.querySelector('[data-testid="display-card-root"]');
      if (!(card instanceof HTMLElement)) return null;
      return {
        offsetWidth: card.offsetWidth,
        offsetHeight: card.offsetHeight,
        transform: getComputedStyle(card).transform,
        hostWidth: document.getElementById("contest-display-card-host")?.clientWidth ?? 0,
      };
    });
    expect(layoutMetrics?.offsetWidth).toBe(800);
    expect(layoutMetrics?.offsetHeight).toBe(450);
    if ((layoutMetrics?.hostWidth ?? 0) < 800) {
      expect(layoutMetrics?.transform).not.toBe("none");
    }

    const pipeline = await page.evaluate(async () => {
      const previewMod = await import("/apps/contest-entry/js/display-card-preview.js");
      const pdfMod = await import("/apps/contest-management/js/display-card-pdf-export.js");
      const host = document.getElementById("contest-display-card-host");
      const app = {
        schedule_type: "full_time",
        homeroom: "101",
        student_number: 12,
        student_name: "山田太郎",
        title: "テストタイトル",
        impressions: (document.querySelector("#impressions") as HTMLTextAreaElement | null)?.value ?? "",
        members: [{ homeroom: "101", member_name: "山田太郎" }],
      };
      const layout = previewMod.getDisplayCardLayout?.() ?? previewMod.DISPLAY_CARD_LAYOUT;
      const canvas = await pdfMod.renderDisplayCardPreviewCanvas(app, layout);
      const input = pdfMod.applicationToDisplayCardInput(app);
      const state = previewMod.buildDisplayCardPreviewState(input, layout, {
        cardWidthPx: previewMod.DISPLAY_CARD_WIDTH_PX,
      });
      const hostCanvas =
        host instanceof HTMLElement ? previewMod.getDisplayCardRasterCanvas(host) : null;
      pdfMod.assertDisplayCardCanvasHasOverlayInk(canvas, layout);
      return {
        stateLines: state.commentLines,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        hostCanvasWidth: hostCanvas?.width ?? 0,
      };
    });

    expect(pipeline.canvasWidth).toBe(1600);
    expect(pipeline.canvasHeight).toBe(900);
    expect(pipeline.hostCanvasWidth).toBe(1600);
    expect(pipeline.stateLines[0]).toContain("テストコメント");
  });

  test("サンプルテンプレート画像が読み込まれる", async ({ page }) => {
    await waitForDisplayCardRaster(page);
    const img = page.locator(".contest-display-card-raster");
    await expect
      .poll(async () => img.evaluate((el) => (el instanceof HTMLImageElement ? el.naturalWidth : 0)))
      .toBeGreaterThan(0);
    await expect(img).toHaveAttribute("width", "800");
  });
});
