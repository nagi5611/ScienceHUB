import { test, expect } from "@playwright/test";

test.describe("ログイン — サインアップタブの可視性", () => {
  test("?tab=signup でサインアップフィールドが表示される", async ({ page }) => {
    await page.goto("/login/?tab=signup");
    await expect(page.locator("#signup-username")).toBeVisible();
    await expect(page.locator("#signup-email")).toBeEditable();
  });

  test("タブクリックでサインアップパネルが表示される", async ({ page }) => {
    await page.goto("/login/");
    await page.getByRole("tab", { name: "サインアップ" }).click();
    await expect(page.locator("#signup-display-name")).toBeVisible();
    await expect(page.locator("#login-email")).not.toBeVisible();
  });
});
