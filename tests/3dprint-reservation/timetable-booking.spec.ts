import { test, expect } from "@playwright/test";
import {
  getEarliestBookableDate,
  openReservationApp,
  preparePrintReservationDay,
  loginAsAdminViaPage,
  ensureAdminPrintProfile,
} from "./helpers";

test.describe("3D印刷予約 — タイムライン", () => {
  test.beforeEach(async ({ page, request }) => {
    await loginAsAdminViaPage(page);
    await ensureAdminPrintProfile(page.request);
  });

  test("新規申請でポップが開く", async ({ page }) => {
    const date = getEarliestBookableDate();
    await preparePrintReservationDay(page.request, date);
    await openReservationApp(page);
    await page.getByTestId("btn-new-application").click();
    await expect(page.getByRole("dialog", { name: /申請/i })).toBeVisible();
  });
});
