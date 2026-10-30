import { test, expect } from "@playwright/test";
import { openReservationApp, loginAsAdminViaPage, ensureAdminPrintProfile } from "./helpers";

test.describe("3D印刷予約 — シート", () => {
  test.beforeEach(async ({ page, request }) => {
    await loginAsAdminViaPage(page);
    await ensureAdminPrintProfile(page.request);
  });

  test("Mine シートを開ける", async ({ page }) => {
    await openReservationApp(page);
    await page.getByRole("button", { name: /申請一覧/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});
