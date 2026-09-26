import { test, expect } from "@playwright/test";
import {
  ensureAdminPrintProfile,
  ensurePrinterStatusTestPrinters,
  getEarliestBookableDate,
  goToCalendarMonth,
  openReservationApp,
  syncAdminSession,
} from "./helpers";

test.describe("3D印刷予約 — プリンターステータス UI", () => {
  test.beforeEach(async ({ context, request }) => {
    await syncAdminSession(context, request);
    await ensureAdminPrintProfile(request);
  });

  test("プリンター選択で印刷可能・メンテナンス中バッジが表示される", async ({ page, request }) => {
    const bookableDate = getEarliestBookableDate();
    const printers = await ensurePrinterStatusTestPrinters(request, bookableDate);

    await openReservationApp(page);
    await goToCalendarMonth(page, bookableDate);

    const dayCell = page.locator(
      `#calendar-grid .calendar-day.clickable[data-date="${bookableDate}"]`
    );
    await expect(dayCell).toBeVisible({ timeout: 15_000 });
    const printersLoaded = page.waitForResponse(
      (response) =>
        response.url().includes("/api/3dprint/printers") &&
        response.request().method() === "GET" &&
        response.ok(),
      { timeout: 20_000 }
    );
    await dayCell.locator(".calendar-day-number").click();
    await printersLoaded;

    await expect(page.locator("#form-modal.open")).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("#form-step-printer:not(.hidden)")).toBeVisible();
    await expect(page.locator("#printer-picker .printer-picker-card").first()).toBeVisible({
      timeout: 15_000,
    });

    const picker = page.locator("#printer-picker");

    const activeCard = picker.locator(
      `button.printer-picker-card[data-printer-id="${printers.availableId}"]`
    );
    const maintenanceCard = picker.locator(".printer-picker-card", {
      hasText: printers.maintenanceName,
    });

    await expect(activeCard).toContainText("印刷可能");
    await expect(maintenanceCard).toContainText("メンテナンス中");
    await expect(maintenanceCard).toHaveClass(/printer-picker-card-unavailable/);
  });
});
