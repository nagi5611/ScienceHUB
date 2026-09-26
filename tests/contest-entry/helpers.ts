import { expect, type APIRequestContext, type Page } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loginAsAdmin } from "../website-publish/helpers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const STL_FIXTURE_PATH = path.join(__dirname, "fixtures", "minimal.stl");

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
  await page.waitForSelector("#view-apply.hidden", { timeout: 10_000 });
  await page.waitForSelector("#view-submit.hidden", { timeout: 10_000 });
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
  await page.locator("#application-submit-btn").click();
  await page.waitForSelector("#view-list:not(.hidden)");
  await page.locator("#page-toast:not(.hidden)").waitFor({ timeout: 10_000 }).catch(() => {});
}

/** API で参加申請を1件作成 */
export async function createApplicationViaApi(
  page: Page,
  opts: {
    title: string;
    selfPrint?: boolean;
    homeroom?: string;
    studentNumber?: number;
    studentName?: string;
  }
) {
  const res = await page.request.post("/api/contest/applications", {
    data: {
      schedule_type: "full_time",
      title: opts.title,
      participants: [
        {
          homeroom: opts.homeroom ?? "101",
          student_number: opts.studentNumber ?? 1,
          student_name: opts.studentName ?? "テスト太郎",
        },
      ],
      self_print: opts.selfPrint ?? false,
    },
  });
  if (!res.ok()) {
    throw new Error(`参加申請 API 失敗: ${res.status()} ${await res.text()}`);
  }
  return res.json();
}

/** 一覧からタイトルでカードを取得 */
export function applicationCardByTitle(page: Page, title: string) {
  return page.locator(".contest-application-card", {
    has: page.locator(".contest-application-title", { hasText: title }),
  });
}

/** 作品カードから STL 提出画面を開く */
export async function openSubmitViewForTitle(page: Page, title: string) {
  const card = applicationCardByTitle(page, title);
  await card.locator(".contest-card-submit").click();
  await page.waitForSelector("#view-submit:not(.hidden)");
}

/** 指定インデックスの STL パーツ行にファイルをアップロードする */
export async function uploadStlPartAt(page: Page, index: number, filePath: string = STL_FIXTURE_PATH) {
  const row = page.locator(".contest-stl-part-row").nth(index);
  await row.locator(".stl-part-file-input").setInputFiles(filePath);
  await expect(row.locator(".stl-part-file-name--done")).toBeVisible({ timeout: 45_000 });
}

/** 提出フォームを送信（全パーツアップロード済み前提） */
export async function submitStlForm(page: Page) {
  const btn = page.locator("#submit-btn");
  await expect(btn).toBeEnabled({ timeout: 15_000 });
  await btn.click();
  await page.waitForSelector("#view-list:not(.hidden)", { timeout: 30_000 });
}

/** コンテスト自動割当用にプリンター稼働日を有効化 */
export async function ensureContestAutoScheduleSlots(
  request: APIRequestContext,
  dayCount = 14
): Promise<{ printerId: string; staffMemberId: string }> {
  const printersRes = await request.get("/api/3dprint/admin/printers");
  if (!printersRes.ok()) {
    throw new Error(`プリンター一覧取得失敗: ${printersRes.status()}`);
  }
  const printersBody = (await printersRes.json()) as {
    printers?: Array<{ id: string; status?: string }>;
  };
  const printer =
    printersBody.printers?.find((p) => p.status === "available") ?? printersBody.printers?.[0];
  if (!printer?.id) {
    throw new Error("テスト用プリンターが見つかりません");
  }

  const dates: string[] = [];
  for (let i = 0; i < dayCount; i++) {
    dates.push(jstDateOffset(i + 3));
  }
  const availRes = await request.put("/api/3dprint/admin/shifts/printer-availability", {
    data: { printer_id: printer.id, dates, available: true },
  });
  if (!availRes.ok()) {
    throw new Error(`シフト有効化失敗: ${availRes.status()} ${await availRes.text()}`);
  }

  const membersRes = await request.get("/api/3dprint/admin/members");
  if (!membersRes.ok()) {
    throw new Error(`メンバー一覧取得失敗: ${membersRes.status()}`);
  }
  const membersBody = (await membersRes.json()) as { members?: { id: string }[] };
  const staffMemberId = membersBody.members?.[0]?.id;
  if (!staffMemberId) {
    throw new Error("シフト用スタッフメンバーが見つかりません");
  }

  return { printerId: printer.id, staffMemberId };
}
