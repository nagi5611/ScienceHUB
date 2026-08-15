import { expect, test } from "@playwright/test";
import { enableTrimMode, loadSampleVideo, openVideoEditor } from "./helpers.js";

test.describe("video-editor Resolve-style trim", () => {
  test.beforeEach(async ({ page }) => {
    await openVideoEditor(page);
  });

  test("loads video and shows dual timeline", async ({ page }) => {
    await loadSampleVideo(page);
    await expect(page.locator("#storyboard")).toBeAttached();
    await expect(page.locator("#trim-zoom-track")).toBeAttached();
    await expect(page.locator("#waveform-canvas")).toBeAttached();
    await expect(page.locator("#trim-editor")).toBeAttached();
  });

  test("trim mode toggles with T key", async ({ page }) => {
    await loadSampleVideo(page);
    await page.keyboard.press("t");
    await expect(page.locator("body")).toHaveClass(/ve-trim-mode/);
    await page.keyboard.press("t");
    await expect(page.locator("body")).not.toHaveClass(/ve-trim-mode/);
  });

  test("JKL transport responds", async ({ page }) => {
    await loadSampleVideo(page);
    const before = await page.evaluate(() => {
      const v = document.querySelector("#preview");
      return v instanceof HTMLVideoElement ? v.currentTime : 0;
    });
    await page.keyboard.press("l");
    await page.waitForFunction(
      (start) => {
        const v = document.querySelector("#preview");
        return v instanceof HTMLVideoElement && v.currentTime > start;
      },
      before,
      { timeout: 5000 }
    );
    await page.keyboard.press("k");
  });

  test("media bin and multi-track render after load", async ({ page }) => {
    await loadSampleVideo(page);
    await expect(page.locator("#media-bin .ve-media-bin-item")).toHaveCount(1);
    await expect(page.locator("#multi-track .ve-track-row")).toHaveCount(2);
    await expect(page.locator('[data-testid="track-v2"]')).toBeVisible();
    await expect(page.locator('[data-testid="track-v1"]')).toBeVisible();
  });

  test("trim mode button activates slip UI hint", async ({ page }) => {
    await loadSampleVideo(page);
    await page.keyboard.press("t");
    await expect(page.locator("body")).toHaveClass(/ve-trim-mode/);
    await expect(page.locator("#trim-mode-hint")).toContainText("スリップ");
  });
});
