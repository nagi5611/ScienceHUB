import { expect, test } from "@playwright/test";

test.describe("timeline-model and export graph", () => {
  test("split, transition xfade, and BGM amix graph", async ({ page }) => {
    await page.goto("/video-editor-e2e.html");
    await page.waitForFunction(() => typeof window.__VE_E2E__ === "boolean");

    const result = await page.evaluate(async () => {
      const model = await import("/apps/video-editor/js/timeline-model.js");
      const exp = await import("/apps/video-editor/js/export-video.js");

      const file = new File(["x"], "v.mp4", { type: "video/mp4" });
      const timeline = model.createTimelineFromFile(file, 10, "blob:v");

      model.bladeSplit(timeline, "v1", 5);
      model.bladeSplit(timeline, "a1", 5);
      const vTrack = timeline.tracks.find((t) => t.id === "v1");
      const left = vTrack?.clips[0];
      if (!left) return { error: "no v1 clip" };
      model.setTransition(timeline, left.id, 0.5);

      const audioFile = new File(["a"], "bgm.mp3", { type: "audio/mpeg" });
      const audioId = model.addAudioMedia(timeline, audioFile, 8, "blob:a");
      model.appendBgmClip(timeline, audioId, 0, 0, 8);

      const paths = new Map(timeline.mediaBin.map((m) => [m.id, `/in/${m.name}`]));
      const graph = exp.buildTimelineGraph(timeline, paths);

      return {
        clipCount: vTrack?.clips.length ?? 0,
        transition: left.transitionOut,
        hasBgm: timeline.tracks.some((t) => t.id === "a2" && t.clips.length > 0),
        filter: graph?.filter ?? "",
        hasAudio: graph?.hasAudio ?? false,
      };
    });

    expect(result.clipCount).toBe(2);
    expect(result.transition).toBeGreaterThan(0);
    expect(result.hasBgm).toBe(true);
    expect(result.filter).toContain("xfade");
    expect(result.filter).toContain("amix");
    expect(result.hasAudio).toBe(true);
  });

  test("placeVideoClip adds clip at playhead", async ({ page }) => {
    await page.goto("/video-editor-e2e.html");
    await page.waitForFunction(() => typeof window.__VE_E2E__ === "boolean");

    const result = await page.evaluate(async () => {
      const model = await import("/apps/video-editor/js/timeline-model.js");
      const fileA = new File(["a"], "a.mp4", { type: "video/mp4" });
      const fileB = new File(["b"], "b.mp4", { type: "video/mp4" });
      const timeline = model.createTimelineFromFile(fileA, 5, "blob:a");
      const mediaB = model.addMediaToBin(timeline, fileB, 4, "blob:b", "video");
      model.placeVideoClip(timeline, mediaB, 2, 0, 4);
      return {
        clipCount: timeline.tracks.find((t) => t.id === "v1")?.clips.length ?? 0,
        secondStart: timeline.tracks.find((t) => t.id === "v1")?.clips[1]?.timelineStart ?? -1,
        duration: timeline.duration,
      };
    });

    expect(result.clipCount).toBe(2);
    expect(result.secondStart).toBe(2);
    expect(result.duration).toBe(6);
  });
});
