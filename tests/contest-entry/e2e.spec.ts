import { test, expect } from "@playwright/test";
import {
  applicationCardByTitle,
  openContestEntry,
  openNewApplicationForm,
  submitNewApplication,
  uniqueContestTitle,
} from "./helpers";

test.describe("造形物コンテスト（contest-entry）E2E", () => {
  test.beforeEach(async ({ page }) => {
    await openContestEntry(page);
  });

  test("新規参加申請フォームを表示して送信できる", async ({ page }) => {
    const title = uniqueContestTitle("new");
    await openNewApplicationForm(page);
    await expect(page.locator("#self_print")).toBeVisible();
    await submitNewApplication(page, { title });
    await expect(applicationCardByTitle(page, title)).toBeVisible();
    await expect(applicationCardByTitle(page, title)).toContainText("STL 未提出");
  });

  test("必須入力が不足している間は送信ボタンが無効", async ({ page }) => {
    await openNewApplicationForm(page);
    const submit = page.locator("#application-submit-btn");
    await expect(submit).toBeDisabled();
    await page.locator("#title").fill("タイトルのみ");
    await expect(submit).toBeDisabled();
    await page.locator(".participant-homeroom").first().fill("101");
    await page.locator(".participant-number").first().fill("5");
    await expect(submit).toBeDisabled();
    await page.locator(".participant-name").first().fill("名前");
    await expect(submit).toBeEnabled();
  });
});
