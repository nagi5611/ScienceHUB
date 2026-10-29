import { test, expect } from "@playwright/test";
import {
  getEarliestBookableDate,
  openReservationApp,
  preparePrintReservationDay,
  loginAsAdminViaPage,
  ensureAdminPrintProfile,
} from "./helpers";

test.describe("3D印刷予約 — プリンター", () => {
  test.beforeEach(async ({ page, request }) => {
    await loginAsAdminViaPage(page);
    await ensureAdminPrintProfile(page.request);
  });

  test("タイムラインが表示される", async ({ page }) => {
    const date = getEarliestBookableDate();
    await preparePrintReservationDay(page.request, date);
    await openReservationApp(page);
    await expect(page.locator(".lane-grid, .lanes, .day-panel").first()).toBeVisible({ timeout: 15_000 }).catch(() =>
      expect(page.locator(".tt-scroll")).toBeVisible()
    );
  });
});
