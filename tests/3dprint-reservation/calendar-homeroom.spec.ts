import { test, expect } from "@playwright/test";
import {
  ensureAdminPrintProfile,
  getEarliestBookableDate,
  goToCalendarMonth,
  openReservationApp,
  preparePrintReservationDay,
  syncAdminSession,
} from "./helpers";

test.describe("3D印刷予約 — カレンダーと homeroom", () => {
  test.beforeEach(async ({ context, request }) => {
    await syncAdminSession(context, request);
    await ensureAdminPrintProfile(request);
  });

  test("予約可能日をクリックし homeroom コンボが表示される", async ({ page, request }) => {
    const bookableDate = getEarliestBookableDate();
    await preparePrintReservationDay(request, bookableDate);
    await openReservationApp(page);
    await goToCalendarMonth(page, bookableDate);

    const dayCell = page.locator(`.calendar-day.clickable[data-date="${bookableDate}"]`);
    await dayCell.click();
    await expect(page.locator("#form-modal.open")).toBeVisible();
    await expect(page.locator("#profile-homeroom")).toBeVisible();
  });
});
