import { test, expect } from "@playwright/test";
import {
  applicationCardByTitle,
  createApplicationViaApi,
  ensureContestAutoScheduleSlots,
  openContestEntry,
  openSubmitViewForTitle,
  signupGuest,
  submitStlForm,
  uniqueContestTitle,
  uploadStlPartAt,
} from "./helpers";

test.describe("造形物コンテスト — カード操作・ステータス", () => {
  test.beforeEach(async ({ page }) => {
    await openContestEntry(page);
  });

  test("承認済みカードに編集・取り消し・STL提出と STL 未提出ラベル", async ({ page }) => {
    const title = uniqueContestTitle("card-actions");
    await createApplicationViaApi(page, { title, selfPrint: false });
    await page.reload();
    await page.waitForSelector("#btn-new-application", { state: "visible", timeout: 15_000 });

    const card = applicationCardByTitle(page, title);
    await expect(card.locator(".contest-card-edit")).toBeVisible();
    await expect(card.locator(".contest-card-withdraw")).toBeVisible();
    await expect(card.locator(".contest-card-submit")).toHaveText("STL を提出");
    await expect(card.locator(".contest-application-submission")).toHaveText("STL 未提出");
  });

  test("編集ボタンで参加申請の編集画面を開く", async ({ page }) => {
    const title = uniqueContestTitle("card-edit");
    await createApplicationViaApi(page, { title });
    await page.reload();
    await page.waitForSelector("#btn-new-application", { state: "visible", timeout: 15_000 });

    await applicationCardByTitle(page, title).locator(".contest-card-edit").click();
    await page.waitForSelector("#view-apply:not(.hidden)");
    await expect(page.locator("#apply-heading")).toHaveText("参加申請の編集");
  });

  test("STL 提出ボタンで提出画面を開く", async ({ page }) => {
    const title = uniqueContestTitle("card-submit");
    await createApplicationViaApi(page, { title });
    await page.reload();
    await page.waitForSelector("#btn-new-application", { state: "visible", timeout: 15_000 });

    await openSubmitViewForTitle(page, title);
    await expect(page.locator("#submit-heading")).toBeVisible();
    await expect(page.locator("#submit-btn")).toBeVisible();
  });

  test("学校印刷で提出後は申請中、印刷中では再提出できる", async ({ page }) => {
    const { staffMemberId } = await ensureContestAutoScheduleSlots(page.request);

    const title = uniqueContestTitle("card-status");
    await createApplicationViaApi(page, { title, selfPrint: false });
    await page.reload();
    await page.waitForSelector("#btn-new-application", { state: "visible", timeout: 15_000 });

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

    await page.reload();
    await page.waitForSelector("#btn-new-application", { state: "visible", timeout: 15_000 });

    const printingCard = applicationCardByTitle(page, title);
    await expect(printingCard.locator(".contest-application-submission")).toHaveText("印刷中");
    await expect(printingCard.locator(".contest-card-submit")).toHaveText("STL を再提出");
  });
});

test.describe("造形物コンテスト — アクセス拒否", () => {
  test("ゲストは access API が 403 でアクセス拒否画面", async ({ browser }) => {
    const guestContext = await browser.newContext();
    const guestPage = await guestContext.newPage();
    await signupGuest(guestContext.request);

    const accessRes = await guestContext.request.get("/api/apps/contest-entry/access");
    expect(accessRes.status()).toBe(403);

    await guestPage.goto("/apps/contest-entry/");
    await guestPage.waitForFunction(
      () => document.body?.textContent?.includes("アクセス拒否") === true,
      { timeout: 15_000 }
    );

    await guestContext.close();
  });
});
