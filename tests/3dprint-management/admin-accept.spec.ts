import { test, expect } from "@playwright/test";
import {
  getEarliestBookableDate,
  preparePrintReservationDay,
  loginAsAdminViaPage,
  ensureAdminPrintProfile,
} from "../3dprint-reservation/helpers";

test.describe("3D印刷管理", () => {
  test.beforeEach(async ({ page, request }) => {
    await loginAsAdminViaPage(page);
    await ensureAdminPrintProfile(page.request);
  });

  test("管理 UI が表示される", async ({ page }) => {
    const date = getEarliestBookableDate();
    await preparePrintReservationDay(page.request, date);
    await page.goto("/apps/3dprint-management/");
    await expect(page.getByTestId("management-app")).toBeVisible({ timeout: 60_000 });
  });
});
