import { test, expect } from "@playwright/test";
import { openReservationApp, loginAsAdminViaPage, ensureAdminPrintProfile } from "./helpers";

test.describe("3D印刷予約 — モバイル", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page, request }) => {
    await loginAsAdminViaPage(page);
    await ensureAdminPrintProfile(page.request);
  });

  test("モバイルでアプリが表示される", async ({ page }) => {
    await openReservationApp(page);
    await expect(page.getByTestId("reservation-app")).toBeVisible();
  });
});
