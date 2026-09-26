import { test, expect } from "@playwright/test";
import {
  ensureAdminPrintProfile,
  getEarliestBookableDate,
  getTodayJst,
  syncAdminSession,
} from "./helpers";

test.describe("3D印刷予約 — 一覧・取消・プリンターバッジ", () => {
  test.beforeEach(async ({ context, request }) => {
    await syncAdminSession(context, request);
    await ensureAdminPrintProfile(request);
  });

  test("一覧に予約が表示されステータスバッジがある", async ({ page, request }) => {
    const bookableDate = getEarliestBookableDate();
    const title = `E2E-Badge-${Date.now().toString(36)}`;
    const forceRes = await request.post("/api/3dprint/admin/reservations/force", {
      data: {
        desired_date: bookableDate,
        title,
        homeroom: "301",
        student_number: 2,
        student_name: "バッジテスト",
        print_scale: "small",
      },
    });
    expect(forceRes.ok()).toBeTruthy();

    await page.goto("/apps/3dprint-reservation/");
    await page.waitForSelector("#user-list-mount .status-badge", { timeout: 30_000 });
    await expect(page.locator("#user-list-mount")).toContainText(title);

    const listRes = await request.get(
      `/api/3dprint/calendar/reservation-list?today=${getTodayJst()}`,
    );
    expect(listRes.ok()).toBeTruthy();
  });
});
