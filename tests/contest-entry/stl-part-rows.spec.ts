import { test, expect } from "@playwright/test";
import {
  applicationCardByTitle,
  createSelfPrintApplicationViaApi,
  openContestEntry,
  openSubmitViewForApplicationId,
  submitStlForm,
  uniqueContestTitle,
  uploadStlPartAt,
} from "./helpers";

test.describe("造形物コンテスト — 複数パーツ STL 行 UI", () => {
  test.beforeEach(async ({ page }) => {
    await openContestEntry(page);
  });

  test("複数パーツ行を追加して2件の STL を提出できる", async ({ page }) => {
    test.setTimeout(120_000);
    const title = uniqueContestTitle("stl-multi");
    const applicationId = await createSelfPrintApplicationViaApi(page, title);

    await openSubmitViewForApplicationId(page, applicationId);
    await page.getByRole("button", { name: "パーツを追加" }).click();
    await expect(page.locator(".contest-stl-part-row")).toHaveCount(2);

    await uploadStlPartAt(page, 0);
    await uploadStlPartAt(page, 1);
    const submitBtn = page.locator("#view-submit #submit-btn");
    await expect(submitBtn).toBeEnabled({ timeout: 30_000 });
    await expect(submitBtn).toContainText("2 件");
    await submitStlForm(page);

    const card = applicationCardByTitle(page, title);
    await expect(card).toContainText("パーツ数: 2（複数 STL）");
    await expect(card.locator(".contest-application-submission")).toHaveText(
      "提出済み（自己印刷）"
    );
  });
});
