import { test, expect } from "@playwright/test";
import path from "node:path";
import fs from "node:fs/promises";
import {
  FIXTURES_DIR,
  addFilesViaInput,
  hasMp4Fixture,
  mockServerConvert,
  openImageConverter,
  selectOutputFormat,
  waitForConversion,
  waitForVideoConversion,
} from "./helpers";

test.beforeAll(async () => {
  const { spawn } = await import("node:child_process");
  const projectRoot = process.cwd();
  await new Promise<void>((resolve, reject) => {
    const child = spawn("node", ["tests/image-converter/generate-fixtures.mjs"], {
      cwd: projectRoot,
      stdio: "inherit",
    });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`fixtures exit ${code}`))));
  });
});

test.describe("画像変換 E2E", () => {
  test("ループ1: 形式セレクト UI と WebP 変換", async ({ page }) => {
    await openImageConverter(page);
    const optionCount = await page.locator("#format-select option").count();
    expect(optionCount).toBeGreaterThanOrEqual(8);
    await expect(page.locator("#format-select")).toBeVisible();
    await expect(page.locator("#quality-field")).toBeHidden();
    await expect(page.locator("#ico-sizes-field")).toBeHidden();
    await addFilesViaInput(page, ["sample.png"]);
    await selectOutputFormat(page, "webp");
    await expect(page.locator("#format-select")).toHaveValue("webp");
    await expect(page.locator("#quality-field")).toBeVisible();
    await page.locator("#convert-btn").click();
    await waitForConversion(page);
    await expect(page.locator(".icv-result-name")).toContainText(".webp");
  });

  test("ループ1: ドロップゾーンにファイルをドロップ", async ({ page }) => {
    await openImageConverter(page);
    const filePath = path.join(FIXTURES_DIR, "sample.jpg");
    const buffer = await fs.readFile(filePath);

    const dataTransfer = await page.evaluateHandle((data) => {
      const dt = new DataTransfer();
      const file = new File([new Uint8Array(data)], "dropped.jpg", { type: "image/jpeg" });
      dt.items.add(file);
      return dt;
    }, [...buffer]);

    await page.locator("#drop-zone").dispatchEvent("drop", { dataTransfer });
    await page.waitForSelector(".icv-file");
    await expect(page.locator(".icv-file-name")).toHaveText("dropped.jpg");
  });

  test("ループ2: BMP・GIF・SVG を PNG に変換", async ({ page }) => {
    await openImageConverter(page);
    for (const name of ["sample.bmp", "sample.gif", "sample.svg"]) {
      await addFilesViaInput(page, [name]);
    }
    await selectOutputFormat(page, "png");
    await page.locator("#convert-btn").click();
    await waitForConversion(page);
    await expect(page.locator(".icv-file-state--done")).toHaveCount(3);
  });

  test("ループ2: 大文字拡張子 JPEG を受理", async ({ page }) => {
    await openImageConverter(page);
    await addFilesViaInput(page, ["PHOTO.JPEG"]);
    await expect(page.locator(".icv-file")).toHaveCount(1);
    await page.locator("#convert-btn").click();
    await waitForConversion(page);
  });

  test("ループ2: 複数ファイルを ZIP でダウンロード", async ({ page }) => {
    await openImageConverter(page);
    await addFilesViaInput(page, ["sample.png", "sample.jpg"]);
    await selectOutputFormat(page, "png");
    await page.locator("#convert-btn").click();
    await waitForConversion(page);

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.locator("#download-zip-btn").click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.zip$/i);
  });

  test("ループ3: 同名出力は自動ナンバリング", async ({ page }) => {
    await openImageConverter(page);
    const pngBuf = await fs.readFile(path.join(FIXTURES_DIR, "sample.png"));

    const dataTransfer = await page.evaluateHandle((data) => {
      const dt = new DataTransfer();
      const bytes = new Uint8Array(data);
      const blob = new Blob([bytes], { type: "image/png" });
      dt.items.add(new File([blob], "photo.png", { type: "image/png" }));
      dt.items.add(new File([blob], "photo.png", { type: "image/png" }));
      return dt;
    }, [...pngBuf]);

    await page.locator("#drop-zone").dispatchEvent("drop", { dataTransfer });
    await page.waitForSelector(".icv-file", { timeout: 10_000 });
    await expect(page.locator(".icv-file")).toHaveCount(2);
    await selectOutputFormat(page, "png");
    await page.locator("#convert-btn").click();
    await waitForConversion(page);

    const names = await page.locator(".icv-result-name").allTextContents();
    expect(names.some((text) => /photo\.png/i.test(text))).toBeTruthy();
    expect(names.some((text) => /photo \(2\)\.png/i.test(text))).toBeTruthy();
  });

  test("ループ3: HEIC（拡張子のみ）をサーバー変換", async ({ page }) => {
    await openImageConverter(page);
    await mockServerConvert(page);
    await addFilesViaInput(page, ["sample.heic"]);
    await expect(page.locator(".icv-file-meta")).toContainText("サーバー変換");
    await page.locator("#convert-btn").click();
    await waitForConversion(page);
    await expect(page.locator(".icv-result-name")).toContainText(".png");
  });

  test("ループ3: 再変換ボタンで別形式に変換", async ({ page }) => {
    await openImageConverter(page);
    await addFilesViaInput(page, ["sample.png"]);
    await page.locator("#convert-btn").click();
    await waitForConversion(page);
    await selectOutputFormat(page, "jpeg");
    await page.locator(".icv-btn--reconvert").first().click();
    await waitForConversion(page);
    await expect(page.locator(".icv-result-name").first()).toContainText(".jpg");
  });

  test("ループ4: PDF 1ページ目を PNG に変換", async ({ page }) => {
    await openImageConverter(page);
    await addFilesViaInput(page, ["sample.pdf"]);
    await page.locator("#pdf-pages").selectOption("first");
    await selectOutputFormat(page, "png");
    await page.locator("#convert-btn").click();
    await waitForConversion(page);
    await expect(page.locator(".icv-result-name")).toContainText("-p1.png");
  });

  test("ループ4: 画像を PDF に変換", async ({ page }) => {
    await openImageConverter(page);
    await addFilesViaInput(page, ["sample.png"]);
    await selectOutputFormat(page, "pdf");
    await page.locator("#convert-btn").click();
    await waitForConversion(page);
    await expect(page.locator(".icv-result-name")).toContainText(".pdf");
  });

  test("ループ4: クリップボード貼り付けで画像追加", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await openImageConverter(page);
    const pngBuf = await fs.readFile(path.join(FIXTURES_DIR, "sample.png"));

    await page.evaluate(async (bytes) => {
      const blob = new Blob([new Uint8Array(bytes)], { type: "image/png" });
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    }, [...pngBuf]);

    await page.locator("#drop-zone").click();
    await page.keyboard.press("Control+v");
    await page.waitForSelector(".icv-file", { timeout: 10_000 });
    await expect(page.locator(".icv-file-name")).toContainText("clipboard");
  });

  test("ループ5: 非対応ファイルはスキップ", async ({ page }) => {
    await openImageConverter(page);
    const txtPath = path.join(FIXTURES_DIR, "not-supported.txt");
    await fs.writeFile(txtPath, "hello", "utf8");
    await page.locator("#file-input").setInputFiles(txtPath);
    await expect(page.locator("#status")).toContainText(/非対応|スキップ|対応していない/);
    await expect(page.locator(".icv-file")).toHaveCount(0);
  });

  test("ループ5: 個別保存ボタンが表示される", async ({ page }) => {
    await openImageConverter(page);
    await addFilesViaInput(page, ["sample.png"]);
    await page.locator("#convert-btn").click();
    await waitForConversion(page);
    await expect(page.locator(".icv-result-item .icv-btn")).toHaveText("保存");
  });

  test("ループ5: 形式に応じてオプションが切り替わる", async ({ page }) => {
    await openImageConverter(page);
    await expect(page.locator("#quality-field")).toBeHidden();
    await expect(page.locator("#ico-sizes-field")).toBeHidden();
    await expect(page.locator("#format-context")).toBeHidden();

    await selectOutputFormat(page, "jpeg");
    await expect(page.locator("#quality-field")).toBeVisible();
    await expect(page.locator("#ico-sizes-field")).toBeHidden();

    await selectOutputFormat(page, "ico");
    await expect(page.locator("#quality-field")).toBeHidden();
    await expect(page.locator("#ico-sizes-field")).toBeVisible();

    await selectOutputFormat(page, "svg");
    await expect(page.locator("#svg-note-field")).toBeVisible();
    await expect(page.locator("#ico-sizes-field")).toBeHidden();

    await selectOutputFormat(page, "png");
    await expect(page.locator("#quality-field")).toBeHidden();
    await expect(page.locator("#format-context")).toBeHidden();
  });

  test("ループ5: GIF・ICO・SVG への変換", async ({ page }) => {
    await openImageConverter(page);
    await addFilesViaInput(page, ["sample.png"]);

    await selectOutputFormat(page, "gif");
    await page.locator("#convert-btn").click();
    await waitForConversion(page);
    await expect(page.locator(".icv-result-name")).toContainText(".gif");

    await selectOutputFormat(page, "ico");
    await expect(page.locator("#ico-sizes-field")).toBeVisible();
    await page.locator(".icv-btn--reconvert").first().click();
    await waitForConversion(page);
    await expect(page.locator(".icv-result-name").first()).toContainText(".ico");

    await selectOutputFormat(page, "svg");
    await expect(page.locator("#svg-note-field")).toBeVisible();
    await page.locator(".icv-btn--reconvert").first().click();
    await waitForConversion(page);
    await expect(page.locator(".icv-result-name").first()).toContainText(".svg");
  });

  test("ループ5: 変換中オーバーレイは表示されない", async ({ page }) => {
    await openImageConverter(page);
    await addFilesViaInput(page, ["sample.png", "sample.jpg"]);
    await page.locator("#convert-btn").click();
    await expect(page.locator("#convert-overlay")).toBeHidden();
    await waitForConversion(page);
    await expect(page.locator("#convert-overlay")).toBeHidden();
  });

  test("動画: キュー追加でフレーム形式のみ表示", async ({ page }) => {
    if (!(await hasMp4Fixture())) {
      test.skip(true, "sample.mp4 fixture なし");
    }

    await openImageConverter(page);
    await addFilesViaInput(page, ["sample.mp4"]);
    await expect(page.locator(".icv-file-meta")).toContainText("動画");
    const values = await page.locator("#format-select option").allTextContents();
    expect(values.join(" ")).toMatch(/PNG|JPEG|GIF/);
    expect(values.join(" ")).not.toMatch(/WebP|PDF/);
    await expect(page.locator("#max-edge").locator("xpath=ancestor::label")).toBeHidden();
  });

  test("動画: MP4 を PNG 連番フレームに変換", async ({ page }) => {
    test.setTimeout(150_000);

    if (!(await hasMp4Fixture())) {
      test.skip(true, "sample.mp4 fixture なし");
    }

    await openImageConverter(page);
    await addFilesViaInput(page, ["sample.mp4"]);
    await selectOutputFormat(page, "png");
    await page.locator("#convert-btn").click();
    await waitForVideoConversion(page);

    await expect(page.locator(".icv-file-state--done")).toContainText(/フレーム/);
    await expect(page.locator(".icv-result-name").first()).toContainText("sample_000001.png");
    await expect(page.locator(".icv-result-name")).toHaveCount(3);
    await expect(page.locator("#download-zip-btn")).toBeEnabled();
  });
});
