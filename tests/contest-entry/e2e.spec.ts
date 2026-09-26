import { test, expect } from "@playwright/test";
import { openContestEntry, syncAdminSession } from "./helpers";

test.describe("contest-entry — 参加取り消し", () => {
  test.beforeEach(async ({ context, request }) => {
    await syncAdminSession(context, request);
  });

  test("参加取り消しで一覧から消える", async ({ page, request }) => {
    const title = `E2E-Cancel-${Date.now().toString(36)}`;
    const createRes = await request.post("/api/contest/applications", {
      data: {
        title,
        schedule_type: "full_time",
        homeroom: "301",
        student_number: 1,
        student_name: "取消テスト",
        self_print: true,
        members: [],
      },
    });
    expect(createRes.ok()).toBeTruthy();

    await openContestEntry(page);
    const card = page.locator(".contest-application-card", { hasText: title });
    await expect(card).toBeVisible({ timeout: 15_000 });
    page.once("dialog", (dialog) => dialog.accept());
    await card.locator(".contest-card-withdraw").click();
    await expect(page.locator("#page-toast")).toContainText(/取り消/, { timeout: 15_000 });
    await expect(card).toHaveCount(0, { timeout: 15_000 });
  });
});
