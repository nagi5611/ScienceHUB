import { expect, test } from "@playwright/test";
import { loadSampleVideo, openVideoEditor } from "./helpers.js";

test.describe("Clipchamp-style operations", () => {
  test.beforeEach(async ({ page }) => {
    await openVideoEditor(page);
    await loadSampleVideo(page);
  });

  test("left rail switches inspector for crop", async ({ page }) => {
    await page.locator('.cc-rail-btn[data-tool="crop"]').click();
    await expect(page.locator("#tool-popover")).toBeVisible();
    await expect(page.locator("#crop-enabled")).toBeVisible();
    await expect(page.locator("#inspector-title")).toHaveText("クロップ");
  });

  test("left rail switches inspector for volume and speed", async ({ page }) => {
    await page.locator('.cc-rail-btn[data-tool="volume"]').click();
    await expect(page.locator("#volume")).toBeVisible();
    await expect(page.locator("#inspector-title")).toHaveText("音量");

    await page.locator('.cc-rail-btn[data-tool="speed"]').click();
    await expect(page.locator("#speed")).toBeVisible();
    await expect(page.locator("#inspector-title")).toHaveText("速度");
  });

  test("text rail shows text panel and add button", async ({ page }) => {
    await page.locator('.cc-rail-btn[data-tool="text"]').click();
    await expect(page.locator("#panel-text")).toBeVisible();
    await expect(page.locator("#add-text-btn")).toBeVisible();
    await expect(page.locator("#inspector-title")).toHaveText("テキスト");
  });

  test("play button toggles playback", async ({ page }) => {
    await expect(page.locator("#play-btn")).toBeEnabled();
    await page.locator("#play-btn").click();
    await page.waitForFunction(() => {
      const v = document.querySelector("#preview");
      return v instanceof HTMLVideoElement && !v.paused;
    });
    await expect(page.locator("#play-btn")).toHaveClass(/is-playing/);
    await page.locator("#play-btn").click();
    await page.waitForFunction(() => {
      const v = document.querySelector("#preview");
      return v instanceof HTMLVideoElement && v.paused;
    });
    await expect(page.locator("#play-btn")).not.toHaveClass(/is-playing/);
  });

  test("space key toggles playback", async ({ page }) => {
    await page.keyboard.press("Space");
    await expect(page.locator("#play-btn")).toHaveClass(/is-playing/);
    await page.keyboard.press("Space");
    await expect(page.locator("#play-btn")).not.toHaveClass(/is-playing/);
  });

  test("timeline split creates two clips", async ({ page }) => {
    const clip = page.locator(".ve-track-clip").first();
    const box = await clip.boundingBox();
    if (!box) throw new Error("clip not found");
    await page.mouse.click(box.x + box.width * 0.5, box.y + box.height / 2);
    await page.waitForFunction(() => {
      const v = document.querySelector("#preview");
      return v instanceof HTMLVideoElement && v.currentTime > 0.05;
    });
    await page.locator("#timeline-split-btn").click();
    await expect(page.locator("#multi-track .ve-track-clip")).toHaveCount(2);
  });

  test("I and O keys set trim in/out from playhead", async ({ page }) => {
    await page.evaluate(() => {
      const v = document.querySelector("#preview");
      if (v instanceof HTMLVideoElement && v.duration > 1) {
        v.currentTime = 0.5;
      }
    });
    await page.waitForTimeout(100);
    await page.keyboard.press("i");
    const start = await page.inputValue("#start-time");
    expect(start).not.toBe("0:00.0");

    await page.evaluate(() => {
      const v = document.querySelector("#preview");
      if (v instanceof HTMLVideoElement && v.duration > 1) {
        v.currentTime = Math.min(v.duration - 0.2, 1.5);
      }
    });
    await page.waitForTimeout(100);
    await page.keyboard.press("o");
    const end = await page.inputValue("#end-time");
    expect(end).not.toBe("0:00.0");
  });

  test("speed slider changes preview playback rate", async ({ page }) => {
    await page.locator('.cc-rail-btn[data-tool="speed"]').click();
    await page.locator("#speed").evaluate((el) => {
      if (el instanceof HTMLInputElement) {
        el.value = "150";
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
    const rate = await page.evaluate(() => {
      const v = document.querySelector("#preview");
      return v instanceof HTMLVideoElement ? v.playbackRate : 0;
    });
    expect(rate).toBeCloseTo(1.5, 1);
  });

  test("format picker opens export options", async ({ page }) => {
    await page.locator("#format-picker-btn").click();
    await expect(page.locator("#format-dropdown")).toBeVisible();
    await page.locator('.ve-format-option[data-format="webm"]').click();
    await expect(page.locator("#format-picker-label")).toHaveText("WebM");
  });

  test("exit resets to empty editor project", async ({ page }) => {
    await page.locator("#exit-btn").click();
    await expect(page.locator("#editor-view")).toBeVisible();
    await expect(page.locator("#landing-view")).toBeHidden();
    await expect(page.locator("#file-name")).toHaveText("新規プロジェクト");
  });

  test("timeline timecode updates on playhead move", async ({ page }) => {
    const clip = page.locator(".ve-track-clip").first();
    const box = await clip.boundingBox();
    if (!box) throw new Error("clip not found");
    await page.mouse.click(box.x + box.width * 0.3, box.y + box.height / 2);
    await page.waitForFunction(() => {
      const el = document.getElementById("timeline-timecode");
      return el instanceof HTMLElement && el.textContent !== "0:00.0 / 0:00.0";
    });
    const text = await page.locator("#timeline-timecode").textContent();
    expect(text).toMatch(/\//);
  });

  test("left rail switches inspector for color", async ({ page }) => {
    await page.locator('.cc-rail-btn[data-tool="color"]').click();
    await expect(page.locator("#tool-popover")).toBeVisible();
    await expect(page.locator("#color-brightness")).toBeVisible();
    await expect(page.locator("#inspector-title")).toHaveText("カラー");
  });

  test("timeline zoom controls are visible", async ({ page }) => {
    await expect(page.locator("#timeline-zoom-in")).toBeVisible();
    await expect(page.locator("#timeline-zoom-out")).toBeVisible();
    await expect(page.locator("#timeline-zoom-fit")).toBeVisible();
  });
});
