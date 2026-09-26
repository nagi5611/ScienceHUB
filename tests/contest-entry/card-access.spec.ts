import { test, expect } from "@playwright/test";
import { openContestEntry, syncAdminSession } from "./helpers";

test.describe("contest-entry — カードとアクセス", () => {
  test("ログイン済みで作品カード操作列が表示される", async ({ page, context, request }) => {
    await syncAdminSession(context, request);
    await openContestEntry(page);
    const cards = page.locator(".contest-application-card");
    if ((await cards.count()) === 0) {
      test.skip(true, "作品なし");
    }
    await expect(cards.first().locator(".contest-application-card-actions")).toBeVisible();
    await expect(cards.first().locator(".contest-application-submission")).toBeVisible();
  });

  test("ゲストはアクセス拒否", async ({ page }) => {
    await page.context().clearCookies();
    await page.route("**/api/apps/contest-entry/access", (route) =>
      route.fulfill({ status: 403, contentType: "application/json", body: '{"allowed":false}' }),
    );
    await page.goto("/apps/contest-entry/");
    await expect(page.getByRole("heading", { name: "アクセス拒否" })).toBeVisible({
      timeout: 15_000,
    });
  });
});
