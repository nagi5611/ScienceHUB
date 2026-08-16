import { expect, test } from "@playwright/test";
import { loadSampleVideo, openVideoEditor } from "./helpers.js";

test.describe("video-editor UI — Clipchamp", () => {
  test.beforeEach(async ({ page }) => {
    await openVideoEditor(page);
  });

  test("opens directly in editor with empty project", async ({ page }) => {
    await expect(page.locator("#editor-view")).toBeVisible();
    await expect(page.locator("#landing-view")).toBeHidden();
    await expect(page.locator("#file-name")).toHaveText("新規プロジェクト");
    await expect(page.locator("#add-video-btn")).toHaveText("動画を追加");
  });

  test("add video button is visible in media panel", async ({ page }) => {
    await expect(page.locator("#add-video-btn")).toBeVisible();
    await expect(page.locator("#add-audio-btn")).toHaveText("音楽を追加");
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

  test("export button uses ScienceHUB orange", async ({ page }) => {
    await loadSampleVideo(page);
    const bg = await page.locator("#export-btn").evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toMatch(/rgb\(243,\s*128,\s*32\)|rgb\(243, 128, 32\)/);
    await expect(page.locator("#export-btn")).toHaveText("エクスポート");
  });

  test("editor body uses dark theme", async ({ page }) => {
    await loadSampleVideo(page);
    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bodyBg).toMatch(/rgb\(26,\s*26,\s*26\)|rgb\(26, 26, 26\)/);
  });

  test("trim handles use orange accent", async ({ page }) => {
    await loadSampleVideo(page);
    const trimColor = await page.locator("#handle-start").evaluate((el) =>
      getComputedStyle(el).backgroundColor
    );
    expect(trimColor).toMatch(/rgb\(243,\s*128,\s*32\)|rgb\(243, 128, 32\)/);
  });
});
