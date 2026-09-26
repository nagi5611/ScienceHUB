import { test, expect } from "@playwright/test";
import { openContestEntry, syncAdminSession } from "./helpers";

test.describe("contest-entry — 編集 readonly fieldset", () => {
  test.beforeEach(async ({ context, request }) => {
    await syncAdminSession(context, request);
  });

  test("承認済み作品の編集フォームは在籍区分が readonly", async ({ page, request }) => {
    const title = `E2E-Edit-${Date.now().toString(36)}`;
    const createRes = await request.post("/api/contest/applications", {
      data: {
        title,
        schedule_type: "full_time",
        homeroom: "301",
        student_number: 2,
        student_name: "編集テスト",
        self_print: true,
        members: [],
      },
    });
    expect(createRes.ok()).toBeTruthy();
    const { application } = await createRes.json();
    const approveRes = await request.patch(`/api/contest/applications/${application.id}`, {
      data: { status: "approved" },
    });
    expect(approveRes.ok()).toBeTruthy();

    await openContestEntry(page);
    const card = page.locator(".contest-application-card", { hasText: title });
    await card.locator(".contest-card-edit").click();
    await expect(page.locator("#apply-heading")).toContainText("編集");
    await expect(page.locator("#application-form fieldset")).toHaveClass(/contest-fieldset-readonly/);
    await expect(page.locator('input[name="schedule_type"]').first()).toBeDisabled();
    await expect(page.locator("#self-print-field")).toBeHidden();
  });
});
