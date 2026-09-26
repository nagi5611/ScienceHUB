import { test, expect } from "@playwright/test";
import {
  ensurePrintProfile,
  getEarliestBookableDate,
  goToCalendarMonth,
  loginAsAdmin,
  mockBookableCalendarDay,
  openReservationApp,
} from "./helpers";

test.describe("3D印刷予約 E2E", () => {
  test("カレンダー: 予約可能日をクリックすると予約フォームが開く", async ({
    page,
  }) => {
    const bookableDate = getEarliestBookableDate();
    await mockBookableCalendarDay(page, bookableDate);
    await openReservationApp(page);
    await goToCalendarMonth(page, bookableDate);

    const dayCell = page.locator(
      `.calendar-day.clickable[data-date="${bookableDate}"]`
    );
    await expect(dayCell).toBeVisible();
    await dayCell.click();

    await expect(page.locator("#form-modal")).toHaveClass(/open/);
    await expect(page.locator("#desired_date")).toHaveValue(bookableDate);
    await expect(page.locator("#form-modal-title")).toContainText("予約");
  });

  test("profile-homeroom: コンボボックスでホームルームを選択できる", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await ensurePrintProfile(page);
    await page.goto("/apps/3dprint-reservation/");

    await page.locator("#auth-profile-btn").click();
    await expect(page.locator("#profile-gate-modal")).toHaveClass(/open/);

    const homeroom = page.locator("#profile-homeroom");
    await homeroom.fill("");
    await homeroom.fill("30");
    const list = page.locator("#profile-homeroom-list");
    await expect(list).not.toHaveClass(/hidden/);
    await list.locator('button[data-value="301"]').click();
    await expect(homeroom).toHaveValue("301");
  });
});
