import { expect, test } from "@playwright/test";

test.describe("ffmpeg wasm resolution", () => {
  test("resolveFfmpegWasmUrl finds unpkg fallback when API is unavailable", async ({ page }) => {
    await page.goto("/video-editor-e2e.html");
    await page.waitForFunction(() => typeof window.__VE_E2E__ === "boolean");

    const url = await page.evaluate(async () => {
      const mod = await import("/js/ffmpeg-wasm-url.js");
      return mod.resolveFfmpegWasmUrl();
    });

    expect(url).toMatch(/ffmpeg-core\.wasm/);
  });
});
