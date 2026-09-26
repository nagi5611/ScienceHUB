import { test, expect } from "@playwright/test";
import { openContestEntry, openNewApplicationForm, syncAdminSession } from "./helpers";

test.describe("contest-entry — 新規申請", () => {
  test.beforeEach(async ({ context, request }) => {
    await syncAdminSession(context, request);
  });

  test("新規参加申請フォームを開ける", async ({ page }) => {
    await openContestEntry(page);
    await openNewApplicationForm(page);
    await expect(page.locator("#application-submit-btn")).toBeVisible();
  });

  test("必須入力不足では参加申請ボタンが無効", async ({ page }) => {
    await openContestEntry(page);
    await openNewApplicationForm(page);
    await page.locator("#title").fill("");
    await expect(page.locator("#application-submit-btn")).toBeDisabled();
  });
});
