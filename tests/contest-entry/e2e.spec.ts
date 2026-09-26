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

  test("編集時は在籍区分 fieldset が読み取り専用", async ({ page }) => {
    const title = uniqueContestTitle("edit");
    await openNewApplicationForm(page);
    await submitNewApplication(page, { title });

    const card = applicationCardByTitle(page, title);
    await card.locator(".contest-card-edit").click();
    await expect(page.locator("#view-apply")).toBeVisible();

    await expect(page.locator("#apply-heading")).toHaveText("参加申請の編集");
    const fieldset = page.locator("#application-form fieldset").first();
    await expect(fieldset).toHaveClass(/contest-fieldset-readonly/);
    await expect(page.locator('input[name="schedule_type"]').first()).toBeDisabled();
    await expect(page.locator("#self-print-field")).toBeHidden();

    const updated = `${title}-改`;
    await page.locator("#title").fill(updated);
    await page.locator("#application-submit-btn").click();
    await expect(page.locator("#view-list")).toBeVisible();
    await expect(applicationCardByTitle(page, updated)).toBeVisible();
  });
});
