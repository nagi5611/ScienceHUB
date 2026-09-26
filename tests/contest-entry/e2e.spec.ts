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

  test("自己印刷と学校印刷で STL 提出 UI が異なる", async ({ page }) => {
    const facilityTitle = uniqueContestTitle("facility");
    await openNewApplicationForm(page);
    await submitNewApplication(page, { title: facilityTitle, selfPrint: false });

    let card = applicationCardByTitle(page, facilityTitle);
    await expect(card).not.toContainText("自分で行う");
    await card.locator(".contest-card-submit").click();
    await page.waitForSelector("#view-submit:not(.hidden)");
    await expect(page.locator("#submit-target-label")).not.toContainText("自己印刷");
    await expect(page.locator("#submit-btn")).toContainText("印刷予約");
    await page.locator("#btn-back-from-submit").click();

    const selfTitle = uniqueContestTitle("self");
    await openNewApplicationForm(page);
    await submitNewApplication(page, { title: selfTitle, selfPrint: true });

    card = applicationCardByTitle(page, selfTitle);
    await expect(card).toContainText("自分で行う");
    await card.locator(".contest-card-edit").click();
    await expect(page.locator("#self-print-readonly-hint")).toBeVisible();
    await page.locator("#btn-back-from-apply").click();

    await card.locator(".contest-card-submit").click();
    await expect(page.locator("#submit-target-label")).toContainText("自己印刷");
    await expect(page.locator("#submit-btn")).toContainText("STL を提出する");
  });

  test("印刷予定カレンダーは読み取り専用", async ({ page }) => {
    const section = page.locator("#calendar-section");
    await expect(section).toHaveAttribute("aria-readonly", "true");
    await expect(section).toHaveClass(/contest-readonly-calendar/);
    await expect(page.locator("#calendar-grid .calendar-day").first()).toBeVisible({
      timeout: 15_000,
    });
    const readonlySlotCount = await page.locator(
      "#calendar-grid .calendar-slot--readonly"
    ).count();
    if (readonlySlotCount > 0) {
      await expect(
        page.locator("#calendar-grid .calendar-slot--readonly").first()
      ).toBeVisible();
    }
    await expect(page.locator("#prev-month")).toBeEnabled();
  });
});
