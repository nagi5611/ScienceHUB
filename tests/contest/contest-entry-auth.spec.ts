import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers";

test.describe("contest-entry 認証", () => {
  test("未ログインはログインへリダイレクト", async ({ page }) => {
    await page.goto("/apps/contest-entry/");
    await expect(page).toHaveURL(/\/login\/\?next=/);
    await expect(page).toHaveTitle(/ログイン/);
  });

  test("管理者ログイン後は contest-entry を表示", async ({ page }) => {
    await loginAsAdmin(page.request);
    const response = await page.goto("/apps/contest-entry/", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator("#view-list, #btn-new-application").first()).toBeVisible({
      timeout: 20_000,
    });
  });
});
