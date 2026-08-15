import type { APIRequestContext, BrowserContext, Page } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loginAsAdmin } from "../website-publish/helpers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const FIXTURES_DIR = path.join(__dirname, "fixtures");

/** API ログインの Cookie をブラウザコンテキストへ同期 */
export async function syncAuthCookies(
  context: BrowserContext,
  request: APIRequestContext,
) {
  await loginAsAdmin(request);
  const { cookies } = await request.storageState();
  await context.addCookies(cookies);
}

/** 管理者ログイン後に動画変換アプリを開く */
export async function openVideoConverter(page: Page) {
  await page.goto("/apps/video-converter/");
  await page.waitForSelector("#app-main:not([hidden])", { timeout: 20_000 });
}

/** サンプル動画を追加 */
export async function addSampleVideo(page: Page, filename = "sample.mp4") {
  const filePath = path.join(FIXTURES_DIR, filename);
  await page.locator("#file-input").setInputFiles(filePath);
  await page.locator(".vcv-file").first().waitFor({ timeout: 15_000 });
}

/** 変換完了またはエラーまで待つ */
export async function waitForConvertResult(page: Page, timeoutMs = 180_000) {
  const status = page.locator("#status");
  await status
    .filter({ hasText: /完了|失敗|エラー|できません/ })
    .waitFor({ timeout: timeoutMs });
  const text = (await status.textContent()) ?? "";
  const errorRow = page.locator(".vcv-file-state--error");
  if (await errorRow.count() > 0) {
    const errText = await errorRow.first().textContent();
    throw new Error(`変換エラー: ${errText ?? text}`);
  }
  if (!/完了/.test(text)) {
    throw new Error(`変換未完了: ${text}`);
  }
  await page.locator(".vcv-file-state--done").first().waitFor({ timeout: 10_000 });
}

export { loginAsAdmin };
