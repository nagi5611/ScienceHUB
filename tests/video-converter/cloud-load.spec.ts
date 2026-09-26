import { test, expect } from "@playwright/test";
import { openVideoConverter, syncAuthCookies } from "./helpers";

test.describe("動画変換 — クラウド読み込み", () => {
  test.beforeEach(async ({ context, request }) => {
    // ストレージ API はセッション Cookie 必須（未ログインは /api/storage/access → 401）
    await syncAuthCookies(context, request);
  });

  test("クラウド読み込みモーダルを開きログインページへ遷移しない", async ({ page }) => {
    await openVideoConverter(page);
    await page.locator("#cloud-load-btn").click();
    await expect(page.locator("#vcv-cloud-open-dialog")).toBeVisible();
    await expect(page).toHaveURL(/\/apps\/video-converter\//);
    await page.getByRole("button", { name: "キャンセル" }).click();
    await expect(page.locator("#vcv-cloud-open-dialog")).toBeHidden();
  });
});
