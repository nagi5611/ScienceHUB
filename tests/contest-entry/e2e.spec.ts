import { test, expect } from "@playwright/test";
import {
  createContestApplicationViaApi,
  loginAsAdmin,
  uniqueContestTitle,
} from "./helpers";

test.describe("造形物コンテスト entry E2E", () => {
  test("参加取り消しで一覧から消える", async ({ page }) => {
    const title = uniqueContestTitle();
    await loginAsAdmin(page);
    const application = await createContestApplicationViaApi(page, { title });
    expect(application.can_withdraw).toBe(true);

    await page.goto("/apps/contest-entry/");
    await expect(page.locator("#applications-list")).toContainText(title);
    await page.reload();
    await expect(page.locator("#applications-list")).toContainText(title);

    page.once("dialog", (dialog) => {
      expect(dialog.type()).toBe("confirm");
      void dialog.accept();
    });

    const card = page.locator(".contest-application-card", {
      has: page.getByRole("heading", { name: title }),
    });
    await card.getByRole("button", { name: "参加取り消し" }).click();

    await expect(page.locator("#page-toast")).toContainText("参加を取り消しました");
    await expect(page.locator("#applications-list")).not.toContainText(title);
  });
});
