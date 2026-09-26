import { test, expect } from "@playwright/test";
import { isolatedContext, loginAsAdmin, signupGuest } from "./helpers";

test.describe("Use Case 4 — 管理削除の権限", () => {
  test("権限のないゲストは DELETE admin/applications で 400/403", async ({ browser }) => {
    const adminCtx = await isolatedContext(browser);
    await loginAsAdmin(adminCtx.request);
    const createRes = await adminCtx.request.post("/api/contest/applications", {
      data: {
        schedule_type: "full_time",
        title: `del-${Date.now().toString(36)}`,
        homeroom: "101",
        student_number: 1,
        student_name: "削除テスト",
        self_print: true,
      },
    });
    expect(createRes.ok()).toBeTruthy();
    const { application } = await createRes.json();

    const guestCtx = await isolatedContext(browser);
    await signupGuest(guestCtx.request, "delete-deny");
    const delRes = await guestCtx.request.delete(
      `/api/contest/admin/applications/${application.id}`
    );
    expect([400, 403]).toContain(delRes.status());
    const body = await delRes.json();
    expect(body.error).toMatch(/権限|アクセス/);

    await adminCtx.close();
    await guestCtx.close();
  });
});
