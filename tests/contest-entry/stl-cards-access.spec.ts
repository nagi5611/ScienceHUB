import { test, expect } from "@playwright/test";
import {
  applicationCardByTitle,
  ensureContestAutoScheduleSlots,
  openContestEntry,
  openNewApplicationForm,
  openSubmitViewForTitle,
  submitNewApplication,
  submitStlForm,
  uniqueContestTitle,
  uploadStlPartAt,
} from "./helpers";

test.describe("造形物コンテスト — STL 提出・再提出", () => {
  test.beforeEach(async ({ page }) => {
    await openContestEntry(page);
  });

  test("自己印刷で STL を提出すると提出済みステータスとダウンロードリンクが出る", async ({
    page,
  }) => {
    const title = uniqueContestTitle("stl-self");
    await openNewApplicationForm(page);
    await submitNewApplication(page, { title, selfPrint: true });

    const card = applicationCardByTitle(page, title);
    await expect(card.locator(".contest-application-submission")).toHaveText("STL 未提出");
    await expect(card.locator(".contest-card-submit")).toHaveText("STL を提出");

    await openSubmitViewForTitle(page, title);
    await expect(page.locator("#submit-btn")).toContainText("STL を提出する");
    await uploadStlPartAt(page, 0);
    await submitStlForm(page);

    await expect(page.locator("#page-toast")).toContainText("STL を提出しました", {
      timeout: 15_000,
    });

    const updated = applicationCardByTitle(page, title);
    await expect(updated.locator(".contest-application-submission")).toHaveText(
      "提出済み（自己印刷）"
    );
    await expect(updated.locator('a[download]:has-text("提出 STL を確認")')).toBeVisible();
    await expect(updated.locator(".contest-card-submit")).toHaveCount(0);
  });

  test("学校印刷で STL 提出後に再提出できる（印刷中）", async ({ page }) => {
    const { staffMemberId } = await ensureContestAutoScheduleSlots(page.request, "contest-stl");

    const title = uniqueContestTitle("stl-facility");
    await openNewApplicationForm(page);
    await submitNewApplication(page, { title, selfPrint: false });

    await openSubmitViewForTitle(page, title);
    await uploadStlPartAt(page, 0);
    await submitStlForm(page);
    await expect(page.locator("#page-toast")).toContainText("印刷依頼を受け付けました", {
      timeout: 15_000,
    });

    const card = applicationCardByTitle(page, title);
    await expect(card.locator(".contest-application-submission")).toHaveText("申請中");

    const listRes = await page.request.get("/api/contest/applications");
    const { applications } = await listRes.json();
    const app = applications.find((a: { title: string }) => a.title === title);
    const reservationId = app?.reservation?.id as string | undefined;
    expect(reservationId).toBeTruthy();

    const acceptRes = await page.request.post(
      `/api/contest/admin/reservations/${reservationId}/accept`,
      { data: { print_staff_member_id: staffMemberId } }
    );
    expect(acceptRes.ok()).toBeTruthy();

    const printingRes = await page.request.patch(
      `/api/contest/admin/reservations/${reservationId}`,
      { data: { status: "printing" } }
    );
    expect(printingRes.ok()).toBeTruthy();

    const applicationsLoaded = page.waitForResponse(
      (res) =>
        res.url().includes("/api/contest/applications") &&
        res.request().method() === "GET" &&
        res.ok(),
      { timeout: 20_000 }
    );
    await page.reload();
    await applicationsLoaded;
    await page.waitForSelector("#view-list:not(.hidden)", { timeout: 15_000 });

    const printingCard = applicationCardByTitle(page, title);
    await expect(printingCard.locator(".contest-card-submit")).toHaveText("STL を再提出");
    await expect(printingCard.locator(".contest-application-submission")).toHaveText("印刷中");

    await openSubmitViewForTitle(page, title);
    await expect(page.locator("#existing-submission-panel:not(.hidden)")).toBeVisible();
    await expect(page.locator("#submit-btn")).toContainText("印刷予約");
    await uploadStlPartAt(page, 0);
    await submitStlForm(page);
    await expect(page.locator("#page-toast")).toContainText("印刷依頼を受け付けました", {
      timeout: 15_000,
    });
  });
});
