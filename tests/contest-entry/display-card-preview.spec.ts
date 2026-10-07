import { test, expect } from "@playwright/test";
import { fillPrimaryParticipant, openContestEntry, openNewApplicationForm } from "./helpers";

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

    const preview = page.getByTestId("display-card-root");
    await expect(preview).toBeVisible();

    await expect(page.getByTestId("display-card-title")).toHaveText("テストタイトル");
    await expect(page.getByTestId("display-card-name")).toHaveText("山田太郎");
    await expect(page.getByTestId("display-card-year")).toHaveText("1");
    await expect(page.getByTestId("display-card-class")).toHaveText("1");

    await expect(page.getByTestId("display-card-comment-line-0")).toContainText("テストコメント");
    await expect(page.getByTestId("display-card-mark-full_time")).toHaveClass(/is-active/);
    await expect(page.getByTestId("display-card-mark-part_time")).not.toHaveClass(/is-active/);

    if (process.env.SAVE_DISPLAY_CARD_SCREENSHOT === "1") {
      await preview.screenshot({
        path: "test-results/contest-display-card-preview-sample.png",
      });
    }
  });

  test("在籍区分を定時制にするとプレビューの丸印が切り替わる", async ({ page }) => {
    await page.locator('input[name="schedule_type"][value="part_time"]').check();
    await expect(page.getByTestId("display-card-mark-part_time")).toHaveClass(/is-active/);
    await expect(page.getByTestId("display-card-mark-full_time")).not.toHaveClass(/is-active/);
  });

  test("展示カードプレビューがフォーム下の領域とビューポート内に収まる", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await fillPrimaryParticipant(page);
    await page.locator("#title").fill("テストタイトル");

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
      const domLines = [...document.querySelectorAll('[data-testid^="display-card-comment-line-"]')].map(
        (el) => el.textContent ?? ""
      );
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
      pdfMod.assertDisplayCardCanvasHasOverlayInk(canvas, layout);
      return {
        domLines,
        stateLines: state.commentLines,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
      };
    });

    expect(pipeline.canvasWidth).toBe(1600);
    expect(pipeline.canvasHeight).toBe(900);
    expect(pipeline.domLines.join("|")).toBe(pipeline.stateLines.join("|"));
  });

  test("サンプルテンプレート画像が読み込まれる", async ({ page }) => {
    const img = page.locator(".contest-display-card-bg");
    await expect(img).toHaveAttribute("src", /display-card-template\.png/);
    await expect
      .poll(async () => img.evaluate((el) => (el instanceof HTMLImageElement ? el.naturalWidth : 0)))
      .toBeGreaterThan(0);
    await expect(img).toHaveAttribute("width", "800");
  });
});
