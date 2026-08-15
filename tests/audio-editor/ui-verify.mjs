/**
 * 音声編集 UI 検証（10項目）
 * 使い方: node tests/audio-editor/ui-verify.mjs [baseUrl]
 */
import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:8788";
const fixture = path.join(path.dirname(fileURLToPath(import.meta.url)), "sample.wav");

const CHECKS = [
  {
    id: 1,
    name: "JSエラーなし",
    run: async (page) => page.evaluate(() => window.__aeUiErrors ?? []) ,
    pass: (errors) => errors.length === 0,
  },
  {
    id: 2,
    name: "不要ボタン非表示",
    run: async (page) =>
      page.evaluate(() => ({
        in: !!document.getElementById("set-in-btn"),
        out: !!document.getElementById("set-out-btn"),
      })),
    pass: (r) => !r.in && !r.out,
  },
  {
    id: 3,
    name: "編集画面表示",
    run: async (page) => page.locator("#editor-view").isVisible(),
    pass: (v) => v === true,
  },
  {
    id: 4,
    name: "波形ヒント表示",
    run: async (page) => page.locator(".ae-wave-hint").isVisible(),
    pass: (v) => v === true,
  },
  {
    id: 5,
    name: "切り出し3統計",
    run: async (page) => page.locator(".ae-stat").count(),
    pass: (n) => n >= 3,
  },
  {
    id: 6,
    name: "切り取りボタン有効",
    run: async (page) => page.locator("#export-btn").isEnabled(),
    pass: (v) => v === true,
  },
  {
    id: 7,
    name: "波形ライト背景",
    run: async (page) =>
      page.evaluate(() => {
        const el = document.querySelector(".ae-wave-stage");
        if (!el) return null;
        return getComputedStyle(el).backgroundColor;
      }),
    pass: (bg) => bg && !bg.includes("27") && !bg.includes("36"),
  },
  {
    id: 8,
    name: "プライマリボタンオレンジ",
    run: async (page) =>
      page.evaluate(() => {
        const btn = document.getElementById("export-btn");
        if (!btn) return null;
        return getComputedStyle(btn).backgroundColor;
      }),
    pass: (bg) => bg && (bg.includes("243") || bg.includes("f38020") || bg.includes("228")),
  },
  {
    id: 9,
    name: "セクション見出し",
    run: async (page) => page.locator(".ae-section-title").count(),
    pass: (n) => n >= 3,
  },
  {
    id: 10,
    name: "ファイル名表示",
    run: async (page) => page.locator("#file-name").textContent(),
    pass: (t) => t?.includes("sample.wav"),
  },
  {
    id: 11,
    name: "用途プリセット",
    run: async (page) => page.locator(".ae-preset-row button").count(),
    pass: (n) => n >= 4,
  },
  {
    id: 12,
    name: "書き出しサマリー",
    run: async (page) => page.locator("#export-summary").textContent(),
    pass: (t) => !!t && t !== "—" && t.includes("MP3"),
  },
];

async function loadEditor(page) {
  await page.goto(`${baseUrl}/audio-editor-e2e.html`, { waitUntil: "networkidle" });
  await page.locator("#file-input").setInputFiles(fixture);
  await page.waitForFunction(() => {
    const editor = document.getElementById("editor-view");
    return editor && !editor.hidden;
  });
  await page.waitForFunction(() => {
    const ph = document.getElementById("wave-placeholder");
    return ph && ph.hidden;
  });
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const jsErrors = [];
  page.on("pageerror", (err) => jsErrors.push(err.message));
  await page.addInitScript(() => {
    window.__aeUiErrors = [];
    window.addEventListener("error", (e) => window.__aeUiErrors.push(String(e.message)));
  });

  await loadEditor(page);
  await page.evaluate((errs) => {
    window.__aeUiErrors = errs;
  }, jsErrors);

  let passed = 0;
  console.log(`\n音声編集 UI 検証 @ ${baseUrl}\n${"=".repeat(40)}`);
  for (const check of CHECKS) {
    const result = await check.run(page);
    const ok = check.pass(result);
    if (ok) passed += 1;
    console.log(`${ok ? "✓" : "✗"} ${check.id}. ${check.name}${ok ? "" : ` → ${JSON.stringify(result)}`}`);
  }
  console.log(`${"=".repeat(40)}\n${passed}/${CHECKS.length} passed\n`);
  await browser.close();
  process.exit(passed === CHECKS.length ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
