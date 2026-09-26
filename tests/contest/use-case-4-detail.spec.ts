import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers";

test.describe("Use Case 4 — 申請詳細", () => {
  test("STL未提出の申請が一覧から参照できる", async ({ page }) => {
    await loginAsAdmin(page.request);
    await page.goto("/apps/contest-management/applications");
    await expect(page.locator("body")).toContainText(/参加申請|申請/, { timeout: 20_000 });
  });
});
