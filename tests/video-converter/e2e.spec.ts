import { test, expect } from "@playwright/test";
import path from "node:path";
import { FIXTURES_DIR } from "./helpers";

test.describe("動画変換 E2E", () => {
  test("sample.mp4 を MP4 に変換（e2e harness）", async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto("/video-converter-e2e.html");
    await page
      .locator("#file-input")
      .setInputFiles(path.join(FIXTURES_DIR, "sample.mp4"));
    await page.locator("#convert-btn").click();
    await page.waitForFunction(
      () => document.querySelector("#status")?.dataset.done === "1",
      { timeout: 45_000 },
    );
    await expect(page.locator("#status")).toContainText(/完了/);
  });
});
