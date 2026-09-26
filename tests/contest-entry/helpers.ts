import { expect, type Page } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loginAsAdmin } from "../website-publish/helpers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const STL_FIXTURE_PATH = path.join(__dirname, "fixtures", "minimal.stl");

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
  await applicationsLoaded.catch(() => {});
  await page.waitForSelector("#auth-user-label:not(:empty)", { timeout: 15_000 });
  await page.waitForSelector("#btn-new-application", { state: "visible" });
}

/** 一覧からタイトルでカードを取得 */
export function applicationCardByTitle(page: Page, title: string) {
  return page.locator(".contest-application-card", {
    has: page.locator(".contest-application-title", { hasText: title }),
  });
}

/** 自己印刷の参加申請を API で作成し一覧を更新する */
export async function createSelfPrintApplicationViaApi(
  page: Page,
  title: string
): Promise<string> {
  const res = await page.request.post("/api/contest/applications", {
    data: {
      schedule_type: "full_time",
      title,
      participants: [
        {
          homeroom: "101",
          student_number: 1,
          student_name: "テスト太郎",
        },
      ],
      self_print: true,
    },
  });
  expect(res.ok()).toBeTruthy();
  const { application } = await res.json();
  const applicationId = String(application.id);
  const applicationsLoaded = page.waitForResponse(
    (r) =>
      r.url().includes("/api/contest/applications") &&
      r.request().method() === "GET" &&
      r.ok(),
    { timeout: 20_000 }
  );
  await page.goto("/apps/contest-entry/", { waitUntil: "domcontentloaded" });
  await applicationsLoaded;
  await expect(applicationCardByTitle(page, title)).toBeVisible({ timeout: 15_000 });
  return applicationId;
}

/** 作品 ID から STL 提出画面を開く */
export async function openSubmitViewForApplicationId(
  page: Page,
  applicationId: string
) {
  const submit = page.locator(`.contest-card-submit[data-id="${applicationId}"]`);
  await expect(submit).toBeVisible();
  await submit.click();
  await expect(page.locator("#view-list")).toHaveClass(/hidden/, { timeout: 15_000 });
  await expect(page.getByRole("button", { name: "パーツを追加" })).toBeVisible({
    timeout: 15_000,
  });
}

/** 指定インデックスの STL パーツ行にファイルをアップロードする */
export async function uploadStlPartAt(
  page: Page,
  index: number,
  filePath: string = STL_FIXTURE_PATH
) {
  const row = page.locator(".contest-stl-part-row").nth(index);
  await row.locator(".stl-part-file-input").setInputFiles(filePath);
  await expect(page.locator("#print-flow-overlay")).toHaveClass(/hidden/, {
    timeout: 45_000,
  });
  await expect(row.locator(".stl-part-file-name")).toHaveClass(/stl-part-file-name--done/, {
    timeout: 45_000,
  });
  await expect(row.locator(".stl-part-file-name")).toContainText(/\.stl$/i);
}

/** 提出フォームを送信（全パーツアップロード済み前提） */
export async function submitStlForm(page: Page) {
  const btn = page.locator("#submit-btn");
  await expect(btn).toBeEnabled({ timeout: 30_000 });
  const entryPost = page.waitForResponse(
    (res) =>
      res.url().includes("/api/contest/entries") &&
      res.request().method() === "POST" &&
      res.ok(),
    { timeout: 60_000 }
  );
  await page.evaluate(() => {
    document.getElementById("submit-form")?.requestSubmit();
  });
  await entryPost;
  await page.waitForSelector("#view-list:not(.hidden)", { timeout: 30_000 });
}
