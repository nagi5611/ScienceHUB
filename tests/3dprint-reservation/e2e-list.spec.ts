import { test, expect } from "@playwright/test";
import { openReservationApp, loginAsAdminViaPage, ensureAdminPrintProfile } from "./helpers";

test.describe("3D印刷予約 — 一覧", () => {
  test.beforeEach(async ({ page, request }) => {
    await loginAsAdminViaPage(page);
    await ensureAdminPrintProfile(page.request);
  });

  test("申請一覧ボタンが表示される", async ({ page }) => {
    await openReservationApp(page);
    await expect(page.getByRole("button", { name: /申請一覧/i })).toBeVisible();
  });
});
