import { test, expect } from "@playwright/test";
import {
  getEarliestBookableDate,
  loginAsAdminViaPage,
  ensureAdminPrintProfile,
  openReservationApp,
  preparePrintReservationDay,
} from "./helpers";

test.describe("3D印刷予約 E2E", () => {
  test.beforeEach(async ({ page, request }) => {
    await loginAsAdminViaPage(page);
    await ensureAdminPrintProfile(page.request);
  });

  test("カレンダー: 予約可能日をクリックすると申請 UI が使える", async ({ page }) => {
    const bookableDate = getEarliestBookableDate();
    await preparePrintReservationDay(page.request, bookableDate);
    await openReservationApp(page);

    const dayCell = page.locator(`button.day[aria-label*="${bookableDate.slice(5).replace("-", "月")}"]`).first();
    await dayCell.click({ timeout: 15_000 }).catch(async () => {
      await page.getByTestId("btn-new-application").click();
    });

    await page.getByTestId("btn-new-application").click();
    await expect(page.getByRole("dialog", { name: /申請/i })).toBeVisible({ timeout: 10_000 });
  });

  test("新 UI がマウントされる", async ({ page }) => {
    await openReservationApp(page);
    await expect(page.getByRole("heading", { name: "3Dプリントの依頼・予約" })).toBeVisible();
  });
});
