import { test, expect } from "@playwright/test";
import { signupGuest } from "./helpers";

test.describe("Contest Entry 申請フォーム構造", () => {
  test("新規申請フォームの主要フィールドが存在", async ({ page }) => {
    await signupGuest(page.request, "form-structure");
    await page.goto("/apps/contest-entry/");
    await page.locator("#btn-new-application").click();
    await expect(page.locator("#field-title, [name=title]").first()).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("#field-homeroom, [name=homeroom]").first()).toBeVisible();
  });
});
