import { test, expect } from "@playwright/test";
import {
  MINIMAL_STL_PATH,
  ensureAdminPrintProfile,
  getEarliestBookableDate,
  getTodayJst,
  goToCalendarMonth,
  openReservationApp,
  preparePrintReservationDay,
  syncAdminSession,
} from "./helpers";

test.describe("3D印刷予約 — STL・新規予約", () => {
  test.beforeEach(async ({ context, request }) => {
    await syncAdminSession(context, request);
    await ensureAdminPrintProfile(request);
  });

  test("STL アップロードと印刷規模・注意点を含む新規予約", async ({
    page,
    request,
  }) => {
    const bookableDate = getEarliestBookableDate();
    const setup = await preparePrintReservationDay(request, bookableDate);
    const title = `E2E-STL-${Date.now().toString(36)}`;
    const notes = "充填率60%・treeサポーター（E2E）";

    await openReservationApp(page);
    await goToCalendarMonth(page, bookableDate);

    const dayCell = page.locator(
      `.calendar-day.clickable[data-date="${bookableDate}"]`,
    );
    await expect(dayCell).toBeVisible({ timeout: 15_000 });
    await dayCell.click();

    await expect(page.locator("#form-modal.open")).toBeVisible();
    await page.locator("#form-next-btn").click();
    await expect(page.locator("#reservation-form:not(.hidden)")).toBeVisible();

    await page.locator('input[name="purpose"][value="ss_s_tan"]').check();
    await page.locator("#title").fill(title);
    await page.locator('input[name="print_scale"][value="medium"]').check();
    await page.locator("#print_notes").fill(notes);

    await page.locator("#print-file").setInputFiles(MINIMAL_STL_PATH);
    await expect(page.locator("#upload-status")).toContainText("アップロード完了", {
      timeout: 30_000,
    });

    await page.locator("#submit-btn").click();
    await expect(page.locator("#form-alert")).toContainText("予約申請を送信しました", {
      timeout: 20_000,
    });

    await expect(page.locator("#user-list-mount")).toContainText(title, {
      timeout: 15_000,
    });
    await expect(page.locator("#user-list-mount")).toContainText("ミディアム");

    const listRes = await request.get(
      `/api/3dprint/calendar/reservation-list?today=${getTodayJst()}`,
    );
    expect(listRes.ok()).toBeTruthy();
    const { reservations } = await listRes.json();
    const created = (reservations as { title: string; id: string }[]).find(
      (r) => r.title === title,
    );
    expect(created).toBeTruthy();

    if (created) {
      const cancelRes = await request.post(
        `/api/3dprint/reservations/${created.id}/cancel`,
      );
      expect(cancelRes.ok()).toBeTruthy();
    }
  });
});
