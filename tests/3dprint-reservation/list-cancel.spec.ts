import { test, expect } from "@playwright/test";
import {
  ensureAdminPrintProfile,
  getEarliestBookableDate,
  getTodayJst,
  preparePrintReservationDay,
  syncAdminSession,
} from "./helpers";

test.describe("3D印刷予約 — 直近一覧・取り消し", () => {
  test.beforeEach(async ({ context, request }) => {
    await syncAdminSession(context, request);
    await ensureAdminPrintProfile(request);
  });

  test("ログイン済みユーザーが一覧から詳細を開き取り消せる", async ({ page, request }) => {
    const bookableDate = getEarliestBookableDate();
    const { printerId } = await preparePrintReservationDay(request, bookableDate);
    const title = `E2E-List-${Date.now().toString(36)}`;

    const forceRes = await request.post("/api/3dprint/admin/reservations/force", {
      data: {
        desired_date: bookableDate,
        printer_id: printerId,
        title,
        homeroom: "301",
        student_number: 1,
        student_name: "一覧テスト",
        print_scale: "small",
      },
    });
    if (!forceRes.ok()) {
      throw new Error(`仮予約作成失敗: ${await forceRes.text()}`);
    }
    const { reservation } = await forceRes.json();

    await page.goto("/apps/3dprint-reservation/");
    await page.waitForSelector("#user-list-mount", { timeout: 30_000 });
    await expect(page.locator("#user-list-mount")).toContainText(title);

    await page.locator(`.user-list-row[data-id="${reservation.id}"]`).click();
    await expect(page.locator("#detail-modal.open")).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await page.locator("#detail-cancel-toggle-btn").click();

    await expect(page.locator("#page-toast")).toContainText("予約を取り消しました", {
      timeout: 15_000,
    });
    await expect(
      page.locator(`.user-list-row[data-id="${reservation.id}"]`),
    ).toHaveCount(0, { timeout: 15_000 });

    const listRes = await request.get(
      `/api/3dprint/calendar/reservation-list?today=${getTodayJst()}`,
    );
    expect(listRes.ok()).toBeTruthy();
    const listBody = await listRes.json();
    const listed = [...(listBody.upcoming ?? []), ...(listBody.recentPast ?? [])] as {
      id: string;
    }[];
    expect(listed.some((row) => row.id === reservation.id)).toBe(false);
  });
});
