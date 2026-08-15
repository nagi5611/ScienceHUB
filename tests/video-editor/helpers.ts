import type { Page } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const FIXTURES_DIR = path.join(__dirname, "fixtures");

/** E2E ハーネスを開く */
export async function openVideoEditor(page: Page) {
  page.on("pageerror", (error) => {
    console.error("pageerror:", error.message);
  });
  await page.goto("/video-editor-e2e.html", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => {
      const landing = document.getElementById("landing-view");
      return (
        typeof /** @type {Window & { __VE_E2E__?: boolean }} */ (window).__VE_E2E__ ===
          "boolean" &&
        landing instanceof HTMLElement &&
        !landing.hidden
      );
    },
    undefined,
    { timeout: 15_000 }
  );
}

async function resolveFixturePath(filename: string) {
  let fixturePath = path.join(FIXTURES_DIR, filename);
  try {
    await fs.access(fixturePath);
  } catch {
    fixturePath = path.join(path.dirname(__dirname), "image-converter", "fixtures", filename);
  }
  return fixturePath;
}

/** サンプル動画を読み込む */
export async function loadSampleVideo(page: Page, filename = "sample.mp4") {
  const fixturePath = await resolveFixturePath(filename);

  const chooserPromise = page.waitForEvent("filechooser");
  await page.locator("#select-file-btn").click();
  const chooser = await chooserPromise;
  await chooser.setFiles(fixturePath);

  await page.waitForFunction(
    () => {
      const editor = document.getElementById("editor-view");
      const name = document.getElementById("file-name");
      return (
        editor instanceof HTMLElement &&
        !editor.hidden &&
        document.body.classList.contains("ve-app--editing") &&
        name instanceof HTMLElement &&
        name.textContent !== "—" &&
        name.textContent.trim().length > 0
      );
    },
    undefined,
    { timeout: 60_000 }
  );
}

/** Trim モードを有効化 */
export async function enableTrimMode(page: Page) {
  await page.keyboard.press("t");
  await page.waitForFunction(() => document.body.classList.contains("ve-trim-mode"));
}
