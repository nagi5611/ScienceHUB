import { test, expect } from "@playwright/test";

test.describe("3dprint-reservation 認証ゲート", () => {
  test("未ログインで予約アプリにアクセスすると login に next 付きでリダイレクト", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.goto("/apps/3dprint-reservation/");
    await page.waitForURL(/\/login\/?(\?|$)/);
    const url = new URL(page.url());
    expect(url.pathname.replace(/\/$/, "")).toBe("/login");
    const next = url.searchParams.get("next");
    expect(next).toBeTruthy();
    expect(decodeURIComponent(next!)).toMatch(/\/apps\/3dprint-reservation\/?/);
  });
});
