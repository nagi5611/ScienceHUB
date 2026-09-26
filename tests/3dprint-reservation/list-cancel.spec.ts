import { test, expect } from "@playwright/test";
import {
  ensureAdminPrintProfile,
  getEarliestBookableDate,
  getTodayJst,
  syncAdminSession,
} from "./helpers";

test.describe("3D印刷予約 — 一覧と取消", () => {
  test.beforeEach(async ({ context, request }) => {
    await syncAdminSession(context, request);
    await ensureAdminPrintProfile(request);
  });

  test("直近一覧から詳細を開き取り消せる", async ({ page, request }) => {
    const bookableDate = getEarliestBookableDate();
    const title = `E2E-List-${Date.now().toString(36)}`;
    const forceRes = await request.post("/api/3dprint/admin/reservations/force", {
      data: {
        desired_date: bookableDate,
        title,
        homeroom: "301",
        student_number: 1,
        student_name: "一覧テスト",
        print_scale: "medium",
      },
    });
    expect(forceRes.ok()).toBeTruthy();
    const { reservation } = await forceRes.json();

    await page.goto("/apps/3dprint-reservation/");
    await page.waitForSelector("#user-list-mount", { timeout: 30_000 });
    await expect(page.locator("#user-list-mount")).toContainText(title);
    await page.locator(`.user-list-row[data-id="${reservation.id}"]`).click();
    await expect(page.locator("#detail-modal.open")).toBeVisible();
    page.once("dialog", (d) => d.accept());
    await page.locator("#detail-cancel-btn").click();
    await expect(page.locator("#page-toast")).toContainText(/取消|キャンセル/, {
      timeout: 15_000,
    });

    const listRes = await request.get(
      `/api/3dprint/calendar/reservation-list?today=${getTodayJst()}`,
    );
    const { reservations } = await listRes.json();
    const found = (reservations as { id: string; status: string }[]).find(
      (r) => r.id === reservation.id,
    );
    expect(found?.status).toBe("cancelled");
  });
});
