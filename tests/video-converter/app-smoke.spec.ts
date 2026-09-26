import { test, expect } from "@playwright/test";
import {
  addSampleVideo,
  openVideoConverter,
  syncAuthCookies,
  waitForConvertResult,
} from "./helpers";

test.describe("動画変換アプリ smoke (/apps/video-converter/)", () => {
  test.beforeEach(async ({ context, request }) => {
    await syncAuthCookies(context, request);
  });

  test("ログイン後に本番 UI の主要要素が表示される", async ({ page }) => {
    await openVideoConverter(page);

    await expect(page.locator("h1.vcv-page-title")).toHaveText("動画変換");
    await expect(page.locator("#drop-zone")).toBeVisible();
    await expect(page.locator("#format-select")).toBeVisible();
    await expect(page.locator("#convert-btn")).toBeDisabled();
    await expect(page.locator("#file-list")).toBeAttached();
    await expect(page.locator("#status")).toContainText(/動画ファイルを追加|追加/);
    await expect(page.locator("#file-empty")).toBeVisible();
    await expect(page.locator("#cloud-load-btn")).toBeEnabled();
  });

  test("sample.mp4 を追加して MP4 変換が完了する", async ({ page }) => {
    test.setTimeout(200_000);

    await openVideoConverter(page);
    await addSampleVideo(page);
    await expect(page.locator("#file-list .vcv-file")).toHaveCount(1);
    await expect(page.locator("#convert-btn")).toBeEnabled();

    await page.locator("#convert-btn").click();
    await waitForConvertResult(page);

    await expect(page.locator("#status")).toContainText(/完了/);
    await expect(page.locator(".vcv-file-state--done")).toHaveCount(1);
    await expect(page.locator("#download-all-btn")).toBeEnabled();
  });

  test("クラウド読み込みダイアログを開ける", async ({ page }) => {
    await openVideoConverter(page);
    await page.locator("#cloud-load-btn").click();

    const dialog = page.locator("#vcv-cloud-open-dialog");
    await expect(dialog).toBeVisible();

    const body = dialog.locator("#vcv-cloud-open-body");
    const denied = dialog.locator("#vcv-cloud-open-denied");
    await expect(body.or(denied)).toBeVisible({ timeout: 15_000 });

    await dialog.getByRole("button", { name: "キャンセル" }).click();
    await expect(dialog).not.toHaveAttribute("open", "");
  });
});
