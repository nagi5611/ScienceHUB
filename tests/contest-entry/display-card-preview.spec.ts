import { test, expect } from "@playwright/test";
import { fillPrimaryParticipant, openContestEntry, openNewApplicationForm } from "./helpers";

test.describe("造形物コンテスト — 展示カードプレビュー", () => {
  test.beforeEach(async ({ page }) => {
    await openContestEntry(page);
    await openNewApplicationForm(page);
  });

  test("タイトル・感想・代表者がプレビューに反映される（1年1組・山田太郎）", async ({
    page,
  }) => {
    const impressions =
      "テストコメント。造形にこだわって作りました。細部まで丁寧に仕上げています。ぜひご覧ください。";
    await fillPrimaryParticipant(page, { homeroom: "101", number: "12", name: "山田太郎" });
    await page.locator("#title").fill("テストタイトル");
    await page.locator("#impressions").fill(impressions);

    const preview = page.getByTestId("display-card-root");
    await expect(preview).toBeVisible();

    await expect(page.getByTestId("display-card-title")).toHaveText("テストタイトル");
    await expect(page.getByTestId("display-card-name")).toHaveText("山田太郎");
    await expect(page.getByTestId("display-card-year")).toHaveText("1");
    await expect(page.getByTestId("display-card-class")).toHaveText("1");

    await expect(page.getByTestId("display-card-comment-line-0")).toContainText("テストコメント");
    await expect(page.getByTestId("display-card-mark-full_time")).toHaveClass(/is-active/);
    await expect(page.getByTestId("display-card-mark-part_time")).not.toHaveClass(/is-active/);

    if (process.env.SAVE_DISPLAY_CARD_SCREENSHOT === "1") {
      await preview.screenshot({
        path: "test-results/contest-display-card-preview-sample.png",
      });
    }
  });

  test("在籍区分を定時制にするとプレビューの丸印が切り替わる", async ({ page }) => {
    await page.locator('input[name="schedule_type"][value="part_time"]').check();
    await expect(page.getByTestId("display-card-mark-part_time")).toHaveClass(/is-active/);
    await expect(page.getByTestId("display-card-mark-full_time")).not.toHaveClass(/is-active/);
  });

  test("サンプルテンプレート画像が読み込まれる", async ({ page }) => {
    const img = page.locator(".contest-display-card-bg");
    await expect(img).toHaveAttribute("src", /display-card-template\.png/);
    await expect
      .poll(async () => img.evaluate((el) => (el instanceof HTMLImageElement ? el.naturalWidth : 0)))
      .toBe(800);
  });
});
