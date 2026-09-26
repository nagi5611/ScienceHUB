import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers";

test.describe("contest-management 認証", () => {
  test("未ログインはログインへリダイレクト", async ({ page }) => {
    await page.goto("/apps/contest-management/");
    await expect(page).toHaveURL(/\/login\/\?next=/);
  });

  test("管理者は管理画面を開ける", async ({ page }) => {
    await loginAsAdmin(page.request);
    const response = await page.goto("/apps/contest-management/", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator("body")).not.toContainText("アクセス拒否");
  });
});
