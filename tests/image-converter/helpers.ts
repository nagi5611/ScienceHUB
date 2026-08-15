import type { Page } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const FIXTURES_DIR = path.join(__dirname, "fixtures");

/** アクセス権を確認して E2E ハーネスを開く */
export async function openImageConverter(page: Page) {
  await page.route("**/api/image-converter/convert", async (route) => {
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64",
    );
    await route.fulfill({ status: 200, contentType: "image/png", body: png });
  });

  await page.goto("/image-converter-e2e.html");
  await page.waitForSelector("#app-main #drop-zone", { timeout: 15_000 });
}

/** 出力形式を選択 */
export async function selectOutputFormat(page: Page, formatId: string) {
  await page.locator("#format-select").selectOption(formatId);
}

/** ファイルを file input 経由で追加 */
export async function addFilesViaInput(page: Page, filenames: string[]) {
  const paths = filenames.map((name) => path.join(FIXTURES_DIR, name));
  await page.locator("#file-input").setInputFiles(paths);
  await page.waitForSelector(".icv-file", { timeout: 10_000 });
}

/** 変換完了を待つ */
export async function waitForConversion(page: Page, expectSuccess = true) {
  const overlay = page.locator("#convert-overlay");
  if (expectSuccess) {
    await overlay.waitFor({ state: "hidden", timeout: 30_000 }).catch(() => undefined);
  }
  const status = page.locator("#status");
  if (expectSuccess) {
    await status.filter({ hasText: /完了/ }).waitFor({ timeout: 30_000 });
    await page.locator(".icv-file-state--done").first().waitFor({ timeout: 5_000 });
  } else {
    await status.filter({ hasText: /失敗|スキップ|非対応/ }).waitFor({ timeout: 30_000 });
  }
}

/** 動画フレーム抽出の完了を待つ（ffmpeg/WebCodecs 初回ロードを考慮して長め） */
export async function waitForVideoConversion(page: Page) {
  const overlay = page.locator("#convert-overlay");
  await overlay.waitFor({ state: "hidden", timeout: 120_000 });
  await page.locator("#status").filter({ hasText: /完了/ }).waitFor({ timeout: 15_000 });
  await page.locator(".icv-file-state--done").first().waitFor({ timeout: 10_000 });
  await page.locator(".icv-result-name").first().waitFor({ timeout: 10_000 });
}

/** sample.mp4 フィクスチャの有無を確認 */
export async function hasMp4Fixture() {
  try {
    await fs.access(path.join(FIXTURES_DIR, "sample.mp4"));
    return true;
  } catch {
    return false;
  }
}

/** サーバー変換 API をモック */
export async function mockServerConvert(page: Page) {
  await page.route("**/api/image-converter/convert", async (route) => {
    const request = route.request();
    const body = request.postDataBuffer();
    if (!body) {
      await route.fulfill({ status: 400, body: JSON.stringify({ error: "no body" }) });
      return;
    }
    // 1x1 PNG を返す
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64",
    );
    await route.fulfill({
      status: 200,
      contentType: "image/png",
      body: png,
    });
  });
}
