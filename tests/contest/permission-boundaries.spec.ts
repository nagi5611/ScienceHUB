import { test, expect } from "@playwright/test";
import { isolatedContext, loginAsAdmin, signupGuest } from "./helpers";

test.describe("コンテスト API 権限境界", () => {
  test("未ログインは保護 API で 401", async ({ browser }) => {
    const ctx = await isolatedContext(browser);
    const response = await ctx.request.get("/api/contest/applications");
    expect(response.status()).toBe(401);
    await ctx.close();
  });

  test("一般ゲストは管理 API で 403", async ({ browser }) => {
    const ctx = await isolatedContext(browser);
    await signupGuest(ctx.request, "no-mgmt");
    const response = await ctx.request.get("/api/contest/admin/applications");
    expect(response.status()).toBe(403);
    const body = await response.json();
    expect(body.error).toContain("アクセス権限がありません");
    await ctx.close();
  });

  test("ゲストは contest-management 画面でアクセス拒否", async ({ browser }) => {
    const ctx = await isolatedContext(browser);
    await signupGuest(ctx.request, "no-mgmt-ui");
    const page = await ctx.newPage();
    await page.goto("/apps/contest-management/");
    await expect(page.getByRole("heading", { name: "アクセス拒否" })).toBeVisible();
    await ctx.close();
  });

  test("他ユーザーの申請 ID は 404", async ({ browser }) => {
    const adminCtx = await isolatedContext(browser);
    await loginAsAdmin(adminCtx.request);
    const guestCtx = await isolatedContext(browser);
    await signupGuest(guestCtx.request, "owner");

    const createRes = await adminCtx.request.post("/api/contest/applications", {
      data: {
        schedule_type: "full_time",
        title: `perm-${Date.now().toString(36)}`,
        homeroom: "101",
        student_number: 1,
        student_name: "管理者作成",
        self_print: true,
      },
    });
    expect(createRes.ok()).toBeTruthy();
    const { application } = await createRes.json();
    const otherRes = await guestCtx.request.get(
      `/api/contest/applications/${application.id}`
    );
    expect(otherRes.status()).toBe(404);
    await adminCtx.close();
    await guestCtx.close();
  });

  test("管理者は管理 API にアクセスできる", async ({ request }) => {
    await loginAsAdmin(request);
    const response = await request.get("/api/contest/admin/applications");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.applications)).toBe(true);
  });
});
