import { expect, type Page } from "@playwright/test";
import { loginAsAdmin } from "../website-publish/helpers";

export { loginAsAdmin };

export { loginAsAdmin };

/** 一意な作品タイトル */
export function uniqueContestTitle(prefix = "e2e") {
  return `${prefix}-${Date.now().toString(36)}`;
}

/** JST の YYYY-MM-DD（offset 日） */
export function jstDateOffset(days: number): string {
  const d = new Date(Date.now() + days * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo" }).format(d);
}

/** ゲストユーザーを API サインアップ */
export async function signupGuest(request: APIRequestContext) {
  const suffix = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const response = await request.post("/api/auth/signup", {
    data: {
      username: `e2e_${suffix}`,
      display_name: `E2E Guest ${suffix}`,
      email: `e2e_${suffix}@example.com`,
      password: "testpass12345",
    },
  });
  if (!response.ok()) {
    throw new Error(`ゲストサインアップ失敗: ${response.status()} ${await response.text()}`);
  }
}

/** 管理者セッションで contest-entry を開く */
export async function openContestEntry(page: Page) {
  await loginAsAdmin(page.request);
  const applicationsLoaded = page.waitForResponse(
    (res) =>
      res.url().includes("/api/contest/applications") &&
      res.request().method() === "GET" &&
      res.ok(),
    { timeout: 20_000 }
  );
  const response = await page.goto("/apps/contest-entry/", { waitUntil: "domcontentloaded" });
  if (!response?.ok()) {
    throw new Error(`contest-entry 読み込み失敗: ${response?.status()}`);
  }
  await applicationsLoaded.catch(() => {});
  await page.waitForSelector("#auth-user-label:not(:empty)", { timeout: 15_000 });
  await page.waitForSelector("#btn-new-application", { state: "visible" });
}

/** 一覧ビューに戻す */
export async function ensureContestListView(page: Page) {
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
  await expect(page.locator("#view-apply")).toBeHidden({ timeout: 10_000 });
  await expect(page.locator("#view-submit")).toBeHidden({ timeout: 10_000 });
}

/** 参加申請フォームを開く（新規） */
export async function openNewApplicationForm(page: Page) {
  await ensureContestListView(page);
  const newBtn = page.locator("#btn-new-application");
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await newBtn.click();
    try {
      await page.waitForSelector("#view-apply:not(.hidden)", { timeout: 3000 });
      await expect(page.locator("#apply-heading")).toHaveText("参加申請");
      return;
    } catch {
      await ensureContestListView(page);
    }
  }
  await page.waitForSelector("#view-apply:not(.hidden)", { timeout: 5000 });
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

/** 参加申請を送信（新規・UI） */
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
  await page.locator("#application-submit-btn").click();
  await expect(page.locator("#view-apply")).toBeHidden({ timeout: 15_000 });
  await expect(applicationCardByTitle(page, opts.title)).toBeVisible({
    timeout: 15_000,
  });
}

/** 一覧からタイトルでカードを取得 */
export function applicationCardByTitle(page: Page, title: string) {
  return page.locator(".contest-application-card", {
    has: page.locator(".contest-application-title", { hasText: title }),
  });
}
