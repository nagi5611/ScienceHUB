import { test, expect } from "@playwright/test";
import {
  addFilesViaInput,
  dispatchPwaControllerChange,
  openImageConverterApp,
  selectOutputFormat,
  waitForConversion,
} from "./helpers";

test.describe("画像変換 — 本番 UI / PWA", () => {
  test("本番パス: WebP 変換スモーク", async ({ page, context, request }) => {
    await openImageConverterApp(page, context, request);
    await addFilesViaInput(page, ["sample.png"]);
    await selectOutputFormat(page, "webp");
    await page.locator("#convert-btn").click();
    await waitForConversion(page);
    await expect(page.locator(".icv-result-name")).toContainText(".webp");
  });

  test("本番パス: 変換中の PWA controllerchange でもキューが消えない", async ({ page, context, request }) => {
    await openImageConverterApp(page, context, request);
    await addFilesViaInput(page, ["sample.png"]);
    await selectOutputFormat(page, "png");

    await page.waitForFunction(() => window.__scienceHubDeferPwaReload === true, undefined, {
      timeout: 5_000,
    });

    await page.locator("#convert-btn").click();
    await dispatchPwaControllerChange(page);

    await expect(page).toHaveURL(/\/apps\/image-converter\/?$/);
    await waitForConversion(page);
    await expect(page.locator(".icv-file")).toHaveCount(1);
    await expect(page.locator(".icv-result-name")).toContainText(".png");
  });
});
