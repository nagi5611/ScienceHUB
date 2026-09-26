import { expect, type Page } from "@playwright/test";
import { loginAsAdmin } from "../website-publish/helpers";

export { loginAsAdmin };

/** 一意な作品タイトル */
export function uniqueContestTitle(prefix = "e2e") {
  return `${prefix}-${Date.now().toString(36)}`;
}

/** 管理者セッションで contest-entry を開く（page.request で Cookie を共有） */
export async function openContestEntry(page: Page) {
  await loginAsAdmin(page.request);
  const applicationsLoaded = page.waitForResponse(
    (res) =>
      res.url().includes("/api/contest/applications") &&
      res.request().method() === "GET" &&
      res.ok(),
    { timeout: 20_000 }
  );
  const response = await page.goto("/apps/contest-entry/", {
    waitUntil: "domcontentloaded",
  });
  if (!response?.ok()) {
    throw new Error(`contest-entry 読み込み失敗: ${response?.status()}`);
  }
  await applicationsLoaded;
  await page.waitForSelector("#auth-user-label:not(:empty)", { timeout: 15_000 });
  await page.waitForSelector("#btn-new-application", { state: "visible" });
}

/** 一覧ビューに戻す */
async function ensureContestListView(page: Page) {
  if (
    (await page.locator("#view-apply").isHidden()) &&
    (await page.locator("#view-submit").isHidden())
  ) {
    return;
  }
  const backSubmit = page.locator("#btn-back-from-submit");
  if (await backSubmit.isVisible()) {
    await backSubmit.click();
  }
  const backApply = page.locator("#btn-back-from-apply");
  if (await backApply.isVisible()) {
    await backApply.click();
  }
  await page.waitForSelector("#view-apply.hidden", { timeout: 10_000 });
  await page.waitForSelector("#view-submit.hidden", { timeout: 10_000 });
}

/** 参加申請フォームを開く（新規） */
export async function openNewApplicationForm(page: Page) {
  await ensureContestListView(page);
  const newBtn = page.locator("#btn-new-application");
  for (let attempt = 0; attempt < 3; attempt++) {
    await newBtn.click();
    try {
      await expect(page.locator("#view-apply")).toBeVisible({ timeout: 5_000 });
      await expect(page.locator("#apply-heading")).toHaveText("参加申請");
      await expect(page.locator(".participant-homeroom").first()).toBeVisible();
      return;
    } catch {
      await page.waitForTimeout(300);
    }
  }
  await expect(page.locator("#view-apply")).toBeVisible({ timeout: 10_000 });
  await expect(page.locator("#apply-heading")).toHaveText("参加申請");
}

/** 1行目のメンバー入力 */
export async function fillPrimaryParticipant(
  page: Page,
  opts: { homeroom?: string; number?: string; name?: string } = {}
) {
  const homeroom = opts.homeroom ?? "101";
  const number = opts.number ?? "1";
  const name = opts.name ?? "テスト太郎";
  const row = page.locator(".contest-participant-row").first();
  await row.locator(".participant-homeroom").fill(homeroom);
  await row.locator(".participant-number").fill(number);
  await row.locator(".participant-name").fill(name);
}

async function expectSubmitEnabled(page: Page) {
  await page.waitForFunction(() => {
    const btn = document.getElementById("application-submit-btn");
    return btn instanceof HTMLButtonElement && !btn.disabled;
  });
}

/** 参加申請を送信（新規） */
export async function submitNewApplication(
  page: Page,
  opts: {
    title: string;
    selfPrint?: boolean;
    impressions?: string;
  }
) {
  await fillPrimaryParticipant(page);
  await page.locator("#title").fill(opts.title);
  if (opts.impressions) {
    await page.locator("#impressions").fill(opts.impressions);
  }
  const selfPrint = page.locator("#self_print");
  if (opts.selfPrint) {
    await selfPrint.check();
  } else {
    await selfPrint.uncheck();
  }
  await expectSubmitEnabled(page);
  const submitBtn = page.locator("#application-submit-btn");
  await submitBtn.scrollIntoViewIfNeeded();
  await expect(submitBtn).toBeVisible();
  await submitBtn.click();
  await expect(page.locator("#view-apply")).toBeHidden({ timeout: 15_000 });
  await page
    .waitForSelector("#page-toast:not(.hidden)", { timeout: 10_000 })
    .catch(() => {});
}

/** 一覧からタイトルでカードを取得 */
export function applicationCardByTitle(page: Page, title: string) {
  return page.locator(".contest-application-card", {
    has: page.locator(".contest-application-title", { hasText: title }),
  });
}
