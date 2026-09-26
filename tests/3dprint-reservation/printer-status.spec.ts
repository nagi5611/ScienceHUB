import { test, expect } from "@playwright/test";
import {
  ensureAdminPrintProfile,
  getEarliestBookableDate,
  goToCalendarMonth,
  openReservationApp,
  syncAdminSession,
} from "./helpers";

test.describe("3D印刷予約 — プリンターステータス", () => {
  test.beforeEach(async ({ context, request }) => {
    await syncAdminSession(context, request);
    await ensureAdminPrintProfile(request);
  });

  test("稼働とメンテのバッジがフォームに表示される", async ({ page, request }) => {
    const bookableDate = getEarliestBookableDate();
    const tag = Date.now().toString(36);

    const activeRes = await request.post("/api/3dprint/admin/printers", {
      data: { name: `E2E-Active-${tag}` },
    });
    const maintRes = await request.post("/api/3dprint/admin/printers", {
      data: { name: `E2E-Maint-${tag}`, status: "maintenance" },
    });
    expect(activeRes.ok() && maintRes.ok()).toBeTruthy();
    const { printer: activePrinter } = await activeRes.json();

    await request.put("/api/3dprint/admin/shifts/printer-availability", {
      data: {
        printer_id: activePrinter.id,
        dates: [bookableDate],
        available: true,
      },
    });

    await openReservationApp(page);
    await goToCalendarMonth(page, bookableDate);
    await page.locator(`.calendar-day.clickable[data-date="${bookableDate}"]`).click();
    await page.locator("#form-next-btn").click();
    await expect(page.locator(".printer-status-badge")).toContainText(/印刷可能|メンテナンス/);
  });
});
