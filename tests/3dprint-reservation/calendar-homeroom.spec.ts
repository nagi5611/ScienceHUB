import { test, expect } from "@playwright/test";
import {
  getEarliestBookableDate,
  openReservationApp,
  preparePrintReservationDay,
  loginAsAdminViaPage,
  ensureAdminPrintProfile,
} from "./helpers";

test.describe("3D印刷予約 — カレンダー", () => {
  test.beforeEach(async ({ page, request }) => {
    await loginAsAdminViaPage(page);
    await ensureAdminPrintProfile(page.request);
  });

  test("平日セルが表示される", async ({ page }) => {
    const bookableDate = getEarliestBookableDate();
    await preparePrintReservationDay(page.request, bookableDate);
    await openReservationApp(page);
    await expect(page.locator(".cal-grid")).toBeVisible();
  });
});
