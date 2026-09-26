import { test, expect } from "@playwright/test";
import { openContestEntry, openNewApplicationForm, syncAdminSession } from "./helpers";

test.describe("contest-entry — 印刷種別とカレンダー", () => {
  test.beforeEach(async ({ context, request }) => {
    await syncAdminSession(context, request);
  });

  test("自己印刷選択で学校印刷向け UI が変わる", async ({ page }) => {
    await openContestEntry(page);
    await openNewApplicationForm(page);
    await page.locator("#self-print-checkbox").check();
    await expect(page.locator("#submit-target-label")).toContainText(/自分|自己/);
    await expect(page.locator("#calendar-section")).toHaveAttribute("aria-readonly", "true");
    await expect(page.locator(".contest-readonly-calendar")).toBeVisible();
  });
});
