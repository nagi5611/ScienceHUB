import { test, expect } from "@playwright/test";
import {
  applicationCardByTitle,
  createSelfPrintApplicationViaApi,
  openContestEntry,
  openSubmitViewForTitle,
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
    await createSelfPrintApplicationViaApi(page, title);

    await openSubmitViewForTitle(page, title);
    await page.locator("#btn-add-stl-part").click();
    await expect(page.locator(".contest-stl-part-row")).toHaveCount(2);

    await uploadStlPartAt(page, 0);
    await uploadStlPartAt(page, 1);
    await expect(page.locator("#submit-btn")).toContainText("2 件");
    await submitStlForm(page);

    const card = applicationCardByTitle(page, title);
    await expect(card).toContainText("パーツ数: 2（複数 STL）");
    await expect(card.locator(".contest-application-submission")).toHaveText(
      "提出済み（自己印刷）"
    );
  });
});
