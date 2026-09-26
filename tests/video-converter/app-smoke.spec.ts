import { test, expect } from "@playwright/test";
import {
  addSampleVideo,
  openVideoConverter,
  syncAuthCookies,
  waitForConvertResult,
} from "./helpers";

test.describe("動画変換 — 本番 UI smoke", () => {
  test.beforeEach(async ({ context, request }) => {
    await syncAuthCookies(context, request);
  });

  test("ログイン後 /apps/video-converter/ で変換まで", async ({ page }) => {
    test.setTimeout(180_000);
    await openVideoConverter(page);
    await expect(page.locator("#file-list")).toBeVisible();
    await addSampleVideo(page);
    await page.locator("#convert-btn").click();
    await waitForConvertResult(page);
  });
});
