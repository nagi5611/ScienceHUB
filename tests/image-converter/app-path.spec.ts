import { test, expect } from "@playwright/test";
import path from "node:path";
import { FIXTURES_DIR } from "./helpers";

test.describe("画像変換 — 本番パス", () => {
  test("PWA 登録スクリプト付きで /apps/image-converter/ を開ける", async ({ page }) => {
    await page.route("**/api/image-converter/convert", async (route) => {
      const png = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQWR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
        "base64",
      );
      await route.fulfill({ status: 200, contentType: "image/png", body: png });
    });

    await page.goto("/apps/image-converter/");
    await page.waitForSelector("#app-main #drop-zone", { timeout: 20_000 });
    const hasPwaScript = await page.evaluate(() =>
      Boolean(document.querySelector('script[src="/js/pwa-register.js"]')),
    );
    expect(hasPwaScript).toBe(true);

    await page.locator("#file-input").setInputFiles(path.join(FIXTURES_DIR, "sample.png"));
    await page.waitForSelector(".icv-file", { timeout: 10_000 });
    await page.locator("#format-select").selectOption("webp");
    await page.locator("#convert-btn").click();
    await page.locator("#status").filter({ hasText: /完了/ }).waitFor({ timeout: 30_000 });

    const queueBeforeReload = await page.locator(".icv-file").count();
    expect(queueBeforeReload).toBeGreaterThan(0);
    await page.reload({ waitUntil: "load" });
    const queueAfterReload = await page.locator(".icv-file").count();
    expect(queueAfterReload).toBe(0);
  });
});
