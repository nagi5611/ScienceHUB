import { expect, test } from "@playwright/test";
import { loadSampleVideo, openVideoEditor } from "./helpers.js";

test.describe("Color and PiP controls", () => {
  test.beforeEach(async ({ page }) => {
    await openVideoEditor(page);
    await loadSampleVideo(page);
    await page.locator(".ve-track-clip").first().click();
  });

  test("color slider updates brightness value", async ({ page }) => {
    await page.locator('.cc-rail-btn[data-tool="color"]').click();
    await page.locator("#color-brightness").evaluate((el) => {
      if (el instanceof HTMLInputElement) {
        el.value = "25";
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
    await expect(page.locator("#color-brightness-value")).toHaveText("25");
    await expect(page.locator("#color-clip-hint")).toContainText("V1");
  });

  test("cinema preset sets color sliders", async ({ page }) => {
    await page.locator('.cc-rail-btn[data-tool="color"]').click();
    await page.locator("#color-preset-cinema").click();
    await expect(page.locator("#color-brightness-value")).toHaveText("-8");
    await expect(page.locator("#color-contrast-value")).toHaveText("15");
    await expect(page.locator("#color-saturation-value")).toHaveText("-20");
  });

  test("mono preset zeroes saturation", async ({ page }) => {
    await page.locator('.cc-rail-btn[data-tool="color"]').click();
    await page.locator("#color-preset-mono").click();
    await expect(page.locator("#color-saturation-value")).toHaveText("-100");
  });

  test("timeline zoom in widens clip relative to lane", async ({ page }) => {
    const clip = page.locator('[data-testid="track-v1"] .ve-track-clip').first();
    const lane = page.locator('[data-testid="track-v1"] .ve-track-lane');
    const before = await clip.evaluate((el, laneEl) => {
      const laneWidth = laneEl instanceof HTMLElement ? laneEl.clientWidth : 1;
      return (el.clientWidth / laneWidth) * 100;
    }, await lane.elementHandle());

    await page.locator("#timeline-zoom-in").click();
    await page.locator("#timeline-zoom-in").click();

    const after = await clip.evaluate((el, laneEl) => {
      const laneWidth = laneEl instanceof HTMLElement ? laneEl.clientWidth : 1;
      return (el.clientWidth / laneWidth) * 100;
    }, await lane.elementHandle());

    expect(after).toBeGreaterThan(before);
  });
});
