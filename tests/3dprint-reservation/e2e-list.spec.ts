import { test, expect } from "@playwright/test";
import {
  clickBookableCalendarDate,
  createPrinter,
  earliestBookableDate,
  enableShiftsForDates,
  ensureAdminPrintProfile,
  forceReservation,
  getCurrentUserId,
  openReservationApp,
  syncAdminSession,
} from "./helpers";

test.describe("3D印刷予約 E2E — 一覧・取消・プリンターステータス", () => {
  test.beforeEach(async ({ context, page }) => {
    await syncAdminSession(context, page.request);
    await ensureAdminPrintProfile(page.request);
  });

  test("直近一覧に自分の予約が表示される", async ({ page }) => {
    const request = page.request;
    const userId = await getCurrentUserId(request);
    const bookableDate = earliestBookableDate();
    const title = `E2E一覧-${Date.now().toString(36)}`;

    const printer = await createPrinter(request, `E2E一覧プリンター-${Date.now().toString(36)}`);
    await enableShiftsForDates(request, [bookableDate], [printer.id]);
    await forceReservation(request, {
      userId,
      title,
      desiredDate: bookableDate,
      printerId: printer.id,
    });

    await openReservationApp(page);

    const list = page.locator("#user-list-mount");
    await expect(list.locator(".user-list-section-label", { hasText: "これからの予約" })).toBeVisible();
    await expect(list.getByText(title)).toBeVisible();
  });

  test("詳細モーダルから予約を取り消せる", async ({ page }) => {
    const request = page.request;
    const userId = await getCurrentUserId(request);
    const bookableDate = earliestBookableDate();
    const title = `E2E取消-${Date.now().toString(36)}`;

    const printer = await createPrinter(request, `E2E取消プリンター-${Date.now().toString(36)}`);
    await enableShiftsForDates(request, [bookableDate], [printer.id]);
    const reservation = await forceReservation(request, {
      userId,
      title,
      desiredDate: bookableDate,
      printerId: printer.id,
    });

    page.on("dialog", (dialog) => dialog.accept());

    await openReservationApp(page);
    await page.locator(`.user-list-row[data-id="${reservation.id}"]`).click();
    await expect(page.locator("#detail-modal")).toHaveClass(/open/);
    await expect(page.locator("#detail-modal-title")).toContainText(title);

    await page.locator("#detail-cancel-toggle-btn").click();
    await expect(page.locator("#page-toast")).toContainText("予約を取り消しました");

    await expect(page.locator("#detail-modal")).not.toHaveClass(/open/);
    await expect(page.locator(`#user-list-mount .user-list-row[data-id="${reservation.id}"]`)).toHaveCount(
      0
    );
  });

  test("プリンター選択で稼働・メンテナンスのステータスバッジが表示される", async ({ page }) => {
    const request = page.request;
    const bookableDate = earliestBookableDate();
    const suffix = Date.now().toString(36);

    const operational = await createPrinter(request, `E2E稼働-${suffix}`, "available");
    const maintenance = await createPrinter(request, `E2Eメンテ-${suffix}`, "maintenance");
    await enableShiftsForDates(request, [bookableDate], [operational.id, maintenance.id]);

    await openReservationApp(page);
    await clickBookableCalendarDate(page, bookableDate);

    await expect(page.locator("#form-modal")).toHaveClass(/open/);
    await expect(page.locator("#form-step-printer")).toBeVisible();

    const picker = page.locator("#printer-picker");
    await expect(picker.locator(".printer-status-available", { hasText: "印刷可能" })).toBeVisible();
    await expect(
      picker.locator(".printer-status-maintenance", { hasText: "メンテナンス中" })
    ).toBeVisible();

    await expect(
      picker.locator(`button.printer-picker-card[data-printer-id="${operational.id}"]`)
    ).toBeVisible();
    await expect(
      picker.locator(`.printer-picker-card-unavailable .printer-picker-name`, {
        hasText: maintenance.name,
      })
    ).toBeVisible();
  });
});
