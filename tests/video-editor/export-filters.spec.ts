import { expect, test } from "@playwright/test";

test.describe("export color filters", () => {
  test("buildEqFilter returns null for defaults and eq for adjustments", async ({ page }) => {
    await page.goto("/video-editor-e2e.html");
    await page.waitForFunction(() => typeof window.__VE_E2E__ === "boolean");

    const result = await page.evaluate(async () => {
      const exp = await import("/apps/video-editor/js/export-video.js");
      return {
        none: exp.buildEqFilter({ brightness: 0, contrast: 0, saturation: 0 }),
        vivid: exp.buildEqFilter({ brightness: 5, contrast: 10, saturation: 35 }),
      };
    });

    expect(result.none).toBeNull();
    expect(result.vivid).toContain("eq=brightness=");
    expect(result.vivid).toContain("contrast=");
    expect(result.vivid).toContain("saturation=");
  });

  test("placeOnTop adds v2 clip with pip effects", async ({ page }) => {
    await page.goto("/video-editor-e2e.html");
    await page.waitForFunction(() => typeof window.__VE_E2E__ === "boolean");

    const result = await page.evaluate(async () => {
      const model = await import("/apps/video-editor/js/timeline-model.js");
      const file = new File(["x"], "v.mp4", { type: "video/mp4" });
      const timeline = model.createTimelineFromFile(file, 10, "blob:v");
      const overlayId = model.addMediaToBin(timeline, file, 5, "blob:v2", "video");
      const clipId = model.placeOnTop(timeline, overlayId, 1, 0, 5);
      const v2 = timeline.tracks.find((t) => t.id === "v2");
      const clip = v2?.clips.find((c) => c.id === clipId);
      return {
        v2Count: v2?.clips.length ?? 0,
        hasPip: Boolean(clip?.effects?.pip),
        pipX: clip?.effects?.pip?.x,
      };
    });

    expect(result.v2Count).toBe(1);
    expect(result.hasPip).toBe(true);
    expect(result.pipX).toBeCloseTo(0.62, 2);
  });

  test("buildTimelineGraph includes v2 overlay chain", async ({ page }) => {
    await page.goto("/video-editor-e2e.html");
    await page.waitForFunction(() => typeof window.__VE_E2E__ === "boolean");

    const result = await page.evaluate(async () => {
      const model = await import("/apps/video-editor/js/timeline-model.js");
      const exp = await import("/apps/video-editor/js/export-video.js");
      const file = new File(["x"], "v.mp4", { type: "video/mp4" });
      const timeline = model.createTimelineFromFile(file, 10, "blob:v");
      const overlayId = model.addMediaToBin(timeline, file, 5, "blob:v2", "video");
      model.placeOnTop(timeline, overlayId, 1, 0, 5);
      const paths = new Map(timeline.mediaBin.map((m) => [m.id, `/in/${m.name}`]));
      const graph = exp.buildTimelineGraph(timeline, paths);
      return graph?.filter ?? "";
    });

    expect(result).toContain("overlay=x=main_w*");
    expect(result).toContain("enable='between(t,");
  });
});
