import { expect, test } from "@playwright/test";
import { loadSampleVideo, openVideoEditor } from "./helpers.js";

test.describe("export progress ETA", () => {
  test.beforeEach(async ({ page }) => {
    await openVideoEditor(page);
    await page.waitForFunction(() => typeof window.__VE_E2E__ === "boolean");
  });

  test("formatEtaRemaining formats seconds and minutes", async ({ page }) => {
    const labels = await page.evaluate(async () => {
      const mod = await import("/apps/video-editor/js/export-progress.js");
      return {
        short: mod.formatEtaRemaining(3),
        seconds: mod.formatEtaRemaining(45),
        minutes: mod.formatEtaRemaining(95),
      };
    });

    expect(labels.short).toBe("残り約数秒");
    expect(labels.seconds).toBe("残り約 45 秒");
    expect(labels.minutes).toContain("1 分");
  });

  test("createExportProgressTracker estimates remaining time", async ({ page }) => {
    const result = await page.evaluate(async () => {
      const mod = await import("/apps/video-editor/js/export-progress.js");
      const tracker = mod.createExportProgressTracker();
      tracker.report(0.1, "準備中…");
      await new Promise((resolve) => setTimeout(resolve, 80));
      return tracker.report(0.4, "エンコード中…");
    });

    expect(result.percentLabel).toBe("40%");
    expect(result.etaText).toMatch(/残り約/);
  });
});

test.describe("video-editor buttons", () => {
  test.beforeEach(async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await openVideoEditor(page);
    await loadSampleVideo(page);
    await page.evaluate(() => {
      (window as Window & { __VE_PAGE_ERRORS__?: string[] }).__VE_PAGE_ERRORS__ = [];
      window.addEventListener("error", (event) => {
        const list = (window as Window & { __VE_PAGE_ERRORS__?: string[] }).__VE_PAGE_ERRORS__;
        list?.push(event.message);
      });
    });
  });

  async function assertNoPageErrors(page: import("@playwright/test").Page) {
    const errors = await page.evaluate(
      () => (window as Window & { __VE_PAGE_ERRORS__?: string[] }).__VE_PAGE_ERRORS__ ?? [],
    );
    expect(errors).toEqual([]);
  }

  test("rail tools open correct inspector panels", async ({ page }) => {
    const tools: Array<{ tool: string; title: string; selector: string }> = [
      { tool: "crop", title: "クロップ", selector: "#crop-enabled" },
      { tool: "rotate", title: "回転", selector: ".ve-rotate-btn" },
      { tool: "volume", title: "音量", selector: "#volume" },
      { tool: "speed", title: "速度", selector: "#speed" },
      { tool: "flip", title: "反転", selector: "#flip-h" },
      { tool: "color", title: "カラー", selector: "#color-brightness" },
      { tool: "text", title: "テキスト", selector: "#panel-text" },
      { tool: "cut", title: "トリム", selector: "#panel-media" },
    ];

    for (const { tool, title, selector } of tools) {
      await page.locator(`.cc-rail-btn[data-tool="${tool}"]`).click();
      await expect(page.locator("#inspector-title")).toHaveText(title);
      await expect(page.locator(selector).first()).toBeVisible();
    }
    await assertNoPageErrors(page);
  });

  test("trim mode, play, and timeline transport buttons work", async ({ page }) => {
    await page.locator("#trim-mode-btn").click();
    await expect(page.locator("body")).toHaveClass(/ve-trim-mode/);

    await page.locator("#play-btn").click();
    await page.waitForFunction(() => {
      const v = document.querySelector("#preview");
      return v instanceof HTMLVideoElement && !v.paused;
    });
    await page.locator("#timeline-play-btn").click();
    await page.waitForFunction(() => {
      const v = document.querySelector("#preview");
      return v instanceof HTMLVideoElement && v.paused;
    });
    await assertNoPageErrors(page);
  });

  test("format picker and rotation buttons update state", async ({ page }) => {
    await page.locator("#format-picker-btn").click();
    await expect(page.locator("#format-dropdown")).toBeVisible();
    await page.locator('.ve-format-option[data-format="webm"]').click();
    await expect(page.locator("#format-picker-label")).toHaveText("WebM");

    await page.locator('.cc-rail-btn[data-tool="rotate"]').click();
    await page.locator('.ve-rotate-btn[data-rotation="90"]').click();
    const rotation = await page.evaluate(() => {
      const preview = document.getElementById("preview");
      return preview instanceof HTMLElement ? preview.style.transform : "";
    });
    expect(rotation).toContain("rotate(90deg)");
    await assertNoPageErrors(page);
  });

  test("color presets and stepper arrows adjust values", async ({ page }) => {
    await page.locator(".ve-track-clip").first().click();
    await page.locator('.cc-rail-btn[data-tool="color"]').click();
    await page.locator("#color-preset-cinema").click();
    await expect(page.locator("#color-contrast-value")).not.toHaveText("0");

    await page.locator('.cc-rail-btn[data-tool="cut"]').click();
    const startBefore = await page.inputValue("#start-time");
    await page.locator('.ve-stepper-arrow[data-target="start"][data-dir="1"]').click();
    const startAfter = await page.inputValue("#start-time");
    expect(startAfter).not.toBe(startBefore);
    await assertNoPageErrors(page);
  });

  test("NLE and timeline buttons respond without errors", async ({ page }) => {
    await page.locator("#blade-btn").click();
    await expect(page.locator("#multi-track .ve-track-clip")).toHaveCount(2);

    await page.locator("#undo-btn").click();
    await expect(page.locator("#multi-track .ve-track-clip")).toHaveCount(1);

    await page.locator("#redo-btn").click();
    await expect(page.locator("#multi-track .ve-track-clip")).toHaveCount(2);

    await page.locator("#timeline-zoom-in").click();
    await page.locator("#timeline-zoom-out").click();
    await page.locator("#timeline-zoom-fit").click();

    await page.locator("#roll-left-btn").click();
    await page.locator("#roll-right-btn").click();
    await page.locator("#slide-left-btn").click();
    await page.locator("#slide-right-btn").click();
    await assertNoPageErrors(page);
  });

  test("text tool buttons add and style text", async ({ page }) => {
    await page.locator('.cc-rail-btn[data-tool="text"]').click();
    await page.locator("#add-text-btn").click();
    await expect(page.locator("#texts-container .ve-txt")).toHaveCount(1);

    await page.locator("#text-bold-btn").click();
    await page.locator("#text-italic-btn").click();
    await page.locator("#text-font-btn").click();
    await expect(page.locator("#text-font-menu")).toBeVisible();
    await page.locator("#text-size-btn").click();
    await expect(page.locator("#text-size-menu")).toBeVisible();
    await assertNoPageErrors(page);
  });

  test("reset edits and cloud dialogs open", async ({ page }) => {
    await page.locator('.cc-rail-btn[data-tool="rotate"]').click();
    await page.locator('.ve-rotate-btn[data-rotation="90"]').click();
    await page.locator("#reset-edits-btn").click();
    const rotation = await page.evaluate(() => {
      const preview = document.getElementById("preview");
      return preview instanceof HTMLElement ? preview.style.transform : "";
    });
    expect(rotation).not.toContain("rotate(90deg)");

    await page.locator("#cloud-load-btn").click();
    await expect(page.locator("#ve-cloud-open-dialog")).toBeVisible();
    await page.getByRole("button", { name: "キャンセル" }).click();
    await assertNoPageErrors(page);
  });
});
