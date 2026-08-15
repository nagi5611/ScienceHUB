import { expect, test } from "@playwright/test";

test.describe("encode acceleration", () => {
  test("buildVideoEncodeArgs uses multithread x264 settings", async ({ page }) => {
    await page.goto("/video-editor-e2e.html");
    await page.waitForFunction(() => typeof window.__VE_E2E__ === "boolean");

    const result = await page.evaluate(async () => {
      const exp = await import("/apps/video-editor/js/export-video.js");
      const cpuMax = exp.buildVideoEncodeArgs(
        { format: "mp4", quality: 23 },
        "cpu-max",
      );
      const auto = exp.buildVideoEncodeArgs({ format: "mp4", quality: 23 }, "auto");
      return { cpuMax, auto };
    });

    expect(result.cpuMax).toContain("-threads");
    expect(result.cpuMax).toContain("0");
    expect(result.cpuMax).toContain("libx264");
    expect(result.cpuMax).toContain("veryfast");
    expect(result.auto).toContain("libx264");
  });

  test("canUseWebCodecsGpuExport rejects complex timelines", async ({ page }) => {
    await page.goto("/video-editor-e2e.html");
    await page.waitForFunction(() => typeof window.__VE_E2E__ === "boolean");

    const result = await page.evaluate(async () => {
      const model = await import("/apps/video-editor/js/timeline-model.js");
      const gpu = await import("/apps/video-editor/js/export-webcodecs-gpu.js");
      const file = new File(["x"], "v.mp4", { type: "video/mp4" });
      const timeline = model.createTimelineFromFile(file, 10, "blob:v");
      const overlayId = model.addMediaToBin(timeline, file, 5, "blob:v2", "video");
      model.placeOnTop(timeline, overlayId, 1, 0, 5);

      const simple = gpu.canUseWebCodecsGpuExport({
        format: "mp4",
        inverse: false,
        rotation: 0,
        flipH: false,
        flipV: false,
        cropEnabled: false,
        textEnabled: false,
        volume: 100,
        speed: 100,
        fadeIn: 0,
        fadeOut: 0,
        slipOffset: 0,
        timeline: model.createTimelineFromFile(file, 10, "blob:v"),
        start: 0,
        end: 10,
        quality: 23,
      });

      const withV2 = gpu.canUseWebCodecsGpuExport({
        format: "mp4",
        inverse: false,
        rotation: 0,
        flipH: false,
        flipV: false,
        cropEnabled: false,
        textEnabled: false,
        volume: 100,
        speed: 100,
        fadeIn: 0,
        fadeOut: 0,
        slipOffset: 0,
        timeline,
        start: 0,
        end: 10,
        quality: 23,
      });

      return { simple, withV2 };
    });

    expect(result.simple).toBe(true);
    expect(result.withV2).toBe(false);
  });

  test("getEncodeCapabilities reports cross-origin isolation", async ({ page }) => {
    await page.goto("/video-editor-e2e.html");
    await page.waitForFunction(() => typeof window.__VE_E2E__ === "boolean");

    const caps = await page.evaluate(async () => {
      const mod = await import("/js/ffmpeg-capabilities.js");
      return mod.getEncodeCapabilities(1280, 720);
    });

    expect(caps).toHaveProperty("ffmpegMultithread");
    expect(caps).toHaveProperty("hardwareVideoEncoder");
    expect(caps.cpuCores).toBeGreaterThan(0);
  });

  test("getFfmpegCoreUrls returns multithread URLs when requested", async ({ page }) => {
    await page.goto("/video-editor-e2e.html");
    await page.waitForFunction(() => typeof window.__VE_E2E__ === "boolean");

    const urls = await page.evaluate(async () => {
      const mod = await import("/js/ffmpeg-wasm-url.js");
      return mod.getFfmpegCoreUrls({ multithread: true });
    });

    expect(urls.multithread).toBe(true);
    expect(urls.coreJs).toContain("core-mt");
    expect(urls.coreWorkerJs).toContain("worker.js");
    expect(urls.wasm).toMatch(/ffmpeg-core\.wasm/);
  });
});
