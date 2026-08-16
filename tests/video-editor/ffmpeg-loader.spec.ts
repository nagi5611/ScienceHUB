import { expect, test } from "@playwright/test";

test.describe("ffmpeg loader", () => {
  test("getFfmpeg completes within 30 seconds", async ({ page }) => {
    await page.goto("/video-editor-e2e.html");
    await page.waitForFunction(() => typeof window.__VE_E2E__ === "boolean");

    const result = await page.evaluate(async () => {
      const t0 = performance.now();
      const loader = await import("/js/ffmpeg-loader.js");
      await Promise.race([
        loader.getFfmpeg(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 30_000)),
      ]);
      const ffmpeg = await loader.getFfmpeg();
      return {
        ms: Math.round(performance.now() - t0),
        loaded: ffmpeg.loaded,
      };
    });

    expect(result.loaded).toBe(true);
    expect(result.ms).toBeLessThan(30_000);
  });
});
