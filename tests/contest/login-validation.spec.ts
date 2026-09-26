import { test, expect } from "@playwright/test";

test.describe("ログイン — クライアントバリデーション", () => {
  test("空のログイン送信で role=alert のエラーが表示される", async ({ page }) => {
    await page.goto("/login/");
    await page.locator("#login-submit-btn").click();
    const alert = page.locator("#auth-alert [role='alert']");
    await expect(alert).toBeVisible();
    await expect(alert).toContainText(/必須|入力/);
  });
});
