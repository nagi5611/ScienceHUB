import { expect, test } from "@playwright/test";
import { loadSampleVideo, openVideoEditor } from "./helpers.js";

test.describe("video-editor UI — Clipchamp", () => {
  test.beforeEach(async ({ page }) => {
    await openVideoEditor(page);
  });

  test("landing uses Clipchamp-style hero and purple CTA", async ({ page }) => {
    await expect(page.locator(".cc-landing-title")).toHaveText("動画をブラウザで編集");
    await expect(page.locator("#select-file-btn")).toHaveText("ファイルを参照");

    const accent = await page.locator("#select-file-btn").evaluate((el) =>
      getComputedStyle(el).backgroundColor
    );
    expect(accent).toMatch(/rgb\(144,\s*49,\s*99\)|rgb\(144, 49, 99\)/);
  });

  test("drop zone is visible on landing", async ({ page }) => {
    await expect(page.locator(".cc-drop-zone")).toBeVisible();
    await expect(page.locator(".cc-drop-title")).toHaveText("動画をインポート");
  });

  test("editor uses Clipchamp layout regions", async ({ page }) => {
    await loadSampleVideo(page);
    await expect(page.locator(".cc-topbar")).toBeVisible();
    await expect(page.locator(".cc-rail")).toBeVisible();
    await expect(page.locator(".cc-stage")).toBeVisible();
    await expect(page.locator(".cc-inspector")).toBeVisible();
    await expect(page.locator(".cc-timeline-dock")).toBeVisible();
  });

  test("timeline labels are Japanese", async ({ page }) => {
    await loadSampleVideo(page);
    await expect(page.locator(".ve-storyboard--overview .ve-timeline-label")).toHaveText("全体");
    await expect(page.locator(".ve-storyboard--trim-zoom .ve-timeline-label")).toHaveText("拡大トリム");
  });

  test("export button uses Clipchamp purple", async ({ page }) => {
    await loadSampleVideo(page);
    const bg = await page.locator("#export-btn").evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toMatch(/rgb\(144,\s*49,\s*99\)|rgb\(144, 49, 99\)/);
    await expect(page.locator("#export-btn")).toHaveText("エクスポート");
  });

  test("editor body uses dark theme", async ({ page }) => {
    await loadSampleVideo(page);
    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bodyBg).toMatch(/rgb\(26,\s*26,\s*26\)|rgb\(26, 26, 26\)/);
  });

  test("trim handles use purple accent", async ({ page }) => {
    await loadSampleVideo(page);
    const trimColor = await page.locator("#handle-start").evaluate((el) =>
      getComputedStyle(el).backgroundColor
    );
    expect(trimColor).toMatch(/rgb\(144,\s*49,\s*99\)|rgb\(144, 49, 99\)/);
  });
});
