import { expect, test } from "@playwright/test";
import path from "node:path";
import { loadSampleVideo, openVideoEditor } from "./helpers.js";

const FIXTURE_MP3 = path.join(path.dirname(new URL(import.meta.url).pathname), "../image-converter/fixtures/sample.mp3");

test.describe("NLE operations", () => {
  test.beforeEach(async ({ page }) => {
    await openVideoEditor(page);
    await loadSampleVideo(page);
  });

  test("split creates two clips and undo restores one", async ({ page }) => {
    await page.locator("#timeline-split-btn").click();
    await expect(page.locator("#multi-track .ve-track-clip")).toHaveCount(2);

    await page.locator("#undo-btn").click();
    await expect(page.locator("#multi-track .ve-track-clip")).toHaveCount(1);
    await expect(page.locator("#redo-btn")).toBeEnabled();
  });

  test("clip handles are rendered", async ({ page }) => {
    await expect(page.locator(".ve-clip-handle--start").first()).toBeVisible();
    await expect(page.locator(".ve-clip-handle--end").first()).toBeVisible();
  });

  test("undo redo buttons exist in topbar", async ({ page }) => {
    await expect(page.locator("#undo-btn")).toBeVisible();
    await expect(page.locator("#redo-btn")).toBeVisible();
  });

  test("multi-clip seek updates playhead", async ({ page }) => {
    await page.locator("#timeline-split-btn").click();
    const clips = page.locator(".ve-track-clip");
    const box = await clips.nth(1).boundingBox();
    if (!box) throw new Error("second clip missing");
    await page.mouse.click(box.x + box.width * 0.5, box.y + box.height / 2);
    await page.waitForFunction(() => {
      const el = document.getElementById("timeline-timecode");
      if (!(el instanceof HTMLElement) || !el.textContent?.includes("/")) return false;
      const current = el.textContent.split("/")[0]?.trim() ?? "";
      return current !== "0:00.0" && current !== "0:00";
    });
  });

  test("second video places at playhead on v1 track", async ({ page }) => {
    const fixturePath = path.join(path.dirname(new URL(import.meta.url).pathname), "fixtures/sample.mp4");
    const clip = page.locator("#multi-track .ve-track-clip").first();
    const box = await clip.boundingBox();
    if (!box) throw new Error("clip not found");
    await page.mouse.click(box.x + box.width * 0.75, box.y + box.height / 2);

    const chooserPromise = page.waitForEvent("filechooser");
    await page.locator("#add-video-btn").click();
    const chooser = await chooserPromise;
    await chooser.setFiles(fixturePath);

    await expect(page.locator("#multi-track .ve-track-clip")).toHaveCount(2, { timeout: 15_000 });
    await expect(page.locator("#media-bin .ve-media-bin-item")).toHaveCount(2);
  });

  test("shift click places overlay on v2 track", async ({ page }) => {
    const fixturePath = path.join(path.dirname(new URL(import.meta.url).pathname), "fixtures/sample.mp4");
    const chooserPromise = page.waitForEvent("filechooser");
    await page.locator("#add-video-btn").click();
    const chooser = await chooserPromise;
    await chooser.setFiles(fixturePath);
    await expect(page.locator("#media-bin .ve-media-bin-item")).toHaveCount(2, { timeout: 15_000 });

    await page.keyboard.down("Shift");
    await page.locator("#media-bin .ve-media-bin-item").nth(1).click();
    await page.keyboard.up("Shift");

    await expect(page.locator('[data-testid="track-v2"] .ve-track-clip')).toHaveCount(1, { timeout: 10_000 });
    await expect(page.locator("#pip-inspector")).toBeVisible();
  });
});

test.describe("NLE media import", () => {
  test("add audio before video shows BGM track", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "audio fixture setup");
    await openVideoEditor(page);

    const audioChooserPromise = page.waitForEvent("filechooser");
    await page.locator("#add-audio-btn").click();
    const chooser = await audioChooserPromise;
    await chooser.setFiles(FIXTURE_MP3);

    await expect(page.locator(".ve-track-row--bgm")).toBeVisible({ timeout: 15_000 });
    await expect(page.locator(".ve-track-row--bgm .ve-track-clip")).toHaveCount(1);
  });
});
