import type { Page } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const FIXTURES_DIR = path.join(__dirname, "fixtures");

const VE_DIAG_ATTACHED = Symbol.for("sciencehub.veE2eDiagnostics");

type VeE2eDiagnostics = {
  pageErrors: string[];
  failedRequests: string[];
};

/** 失敗時の trace / ログ用に pageerror と 4xx を収集（テストごとに1回だけ登録） */
function attachVeDiagnostics(page: Page): VeE2eDiagnostics {
  const tagged = page as Page & { [VE_DIAG_ATTACHED]?: VeE2eDiagnostics };
  if (tagged[VE_DIAG_ATTACHED]) {
    return tagged[VE_DIAG_ATTACHED];
  }
  const diagnostics: VeE2eDiagnostics = { pageErrors: [], failedRequests: [] };
  tagged[VE_DIAG_ATTACHED] = diagnostics;

  page.on("pageerror", (error) => {
    diagnostics.pageErrors.push(error.message);
    console.error("pageerror:", error.message);
  });
  page.on("requestfailed", (request) => {
    const failure = request.failure();
    const line = `${request.method()} ${request.url()} — ${failure?.errorText ?? "failed"}`;
    diagnostics.failedRequests.push(line);
  });
  page.on("response", (response) => {
    if (response.status() === 401) {
      const line = `401 ${response.request().method()} ${response.url()}`;
      diagnostics.failedRequests.push(line);
      console.error("response 401:", line);
    }
  });

  return diagnostics;
}

function formatVeDiagnostics(diagnostics: VeE2eDiagnostics): string {
  const parts: string[] = [];
  if (diagnostics.pageErrors.length) {
    parts.push(`pageerrors:\n${diagnostics.pageErrors.map((e) => `  - ${e}`).join("\n")}`);
  }
  if (diagnostics.failedRequests.length) {
    parts.push(
      `failed requests:\n${diagnostics.failedRequests.slice(0, 12).map((e) => `  - ${e}`).join("\n")}`,
    );
  }
  return parts.length ? `\n${parts.join("\n")}` : "";
}

async function sleep(ms: number) {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** E2E ハーネス URL へ遷移（dev server 負荷時の ERR_ABORTED 向けにリトライ） */
async function gotoVideoEditorHarness(page: Page) {
  const maxAttempts = 3;
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await page.goto("/video-editor-e2e.html", {
        waitUntil: "commit",
        timeout: 45_000,
      });
      await page.waitForLoadState("domcontentloaded");
      return;
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        await sleep(400 * attempt);
      }
    }
  }
  throw lastError;
}

/** E2E ハーネスを開く（編集画面が初期表示） */
export async function openVideoEditor(page: Page) {
  const diagnostics = attachVeDiagnostics(page);
  await gotoVideoEditorHarness(page);

  try {
    await page.waitForFunction(
      () => {
        const editor = document.getElementById("editor-view");
        const win = /** @type {Window & { __VE_E2E_READY__?: boolean }} */ (window);
        return (
          win.__VE_E2E_READY__ === true &&
          editor instanceof HTMLElement &&
          !editor.hidden &&
          document.body.classList.contains("ve-app--editing")
        );
      },
      undefined,
      { timeout: 45_000 },
    );
    await page.locator("#add-video-btn").waitFor({ state: "visible", timeout: 10_000 });
  } catch (error) {
    const detail = formatVeDiagnostics(diagnostics);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`openVideoEditor: harness not ready (${message})${detail}`);
  }
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
  await page.locator("#add-video-btn").click();
  const chooser = await chooserPromise;
  await chooser.setFiles(fixturePath);

  await page.waitForFunction(
    () => {
      const name = document.getElementById("file-name");
      return (
        name instanceof HTMLElement &&
        name.textContent !== "—" &&
        name.textContent !== "新規プロジェクト" &&
        name.textContent.trim().length > 0
      );
    },
    undefined,
    { timeout: 60_000 },
  );
}

/** Trim モードを有効化 */
export async function enableTrimMode(page: Page) {
  await page.keyboard.press("t");
  await page.waitForFunction(() => document.body.classList.contains("ve-trim-mode"));
}
