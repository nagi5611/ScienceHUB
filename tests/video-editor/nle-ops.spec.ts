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

  test("add audio shows BGM track", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "audio fixture setup");

    const hasMp3 = await page.evaluate(async (mp3Path) => {
      try {
        const res = await fetch(mp3Path.replace(/.*\/fixtures/, "/tests/image-converter/fixtures"));
        return res.ok;
      } catch {
        return false;
      }
    }, FIXTURE_MP3);

    if (!hasMp3) {
      await page.evaluate(async () => {
        const ctx = new AudioContext();
        const sampleRate = 44100;
        const duration = 0.5;
        const frames = Math.floor(sampleRate * duration);
        const buffer = ctx.createBuffer(1, frames, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < frames; i += 1) data[i] = Math.sin((i / sampleRate) * 440 * Math.PI * 2) * 0.2;
        const dest = ctx.createMediaStreamDestination();
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        src.connect(dest);
        src.start();
        const recorder = new MediaRecorder(dest.stream);
        const chunks = [];
        recorder.ondataavailable = (e) => chunks.push(e.data);
        await new Promise((resolve) => {
          recorder.onstop = resolve;
          recorder.start();
          setTimeout(() => recorder.stop(), 600);
        });
        return new Blob(chunks, { type: "audio/webm" });
      });
    }

    const audioChooserPromise = page.waitForEvent("filechooser");
    await page.locator("#add-audio-btn").click();
    const chooser = await audioChooserPromise;

    try {
      await chooser.setFiles(FIXTURE_MP3);
    } catch {
      const webmPath = path.join(path.dirname(FIXTURE_MP3), "sample-bgm.webm");
      await chooser.setFiles(webmPath);
    }

    await expect(page.locator(".ve-track-row--bgm")).toBeVisible({ timeout: 15_000 });
    await expect(page.locator(".ve-track-row--bgm .ve-track-clip")).toHaveCount(1);
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
});
