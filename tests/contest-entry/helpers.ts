import type { APIRequestContext, BrowserContext, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { loginAsAdmin } from "../website-publish/helpers";

/** API ログイン Cookie をブラウザへ同期 */
export async function syncAdminSession(
  context: BrowserContext,
  request: APIRequestContext,
) {
  await loginAsAdmin(request);
  const { cookies } = await request.storageState();
  await context.addCookies(cookies);
}

/** 一覧 API 応答後にコンテスト依頼アプリを開く */
export async function openContestEntry(page: Page) {
  const listResponse = page.waitForResponse(
    (res) =>
      res.url().includes("/api/contest/applications") &&
      res.request().method() === "GET" &&
      res.status() === 200,
    { timeout: 30_000 },
  );
  await page.goto("/apps/contest-entry/");
  await listResponse;
  await page.waitForSelector("#app-main:not([hidden])", { timeout: 20_000 });
}

/** 新規参加申請フォームを開く */
export async function openNewApplicationForm(page: Page) {
  await page.locator("#btn-new-application").click();
  await expect(page.locator("#view-apply")).not.toHaveClass(/hidden/);
}

/** 必須項目を埋めて参加申請を送信 */
export async function submitNewApplication(page: Page, title: string) {
  await page.locator("#title").fill(title);
  await page.locator("#homeroom").selectOption({ index: 1 });
  await page.locator("#student_number").fill("1");
  await page.locator("#student_name").fill("E2Eテスト");
  await page.locator("#application-submit-btn").click();
  await expect(page.locator("#page-toast")).toContainText(/申請|送信|完了/, {
    timeout: 20_000,
  });
}
