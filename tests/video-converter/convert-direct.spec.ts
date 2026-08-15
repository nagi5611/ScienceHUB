import { test, expect } from "@playwright/test";
import path from "node:path";
import { FIXTURES_DIR } from "./helpers";

test("convertVideoFile via e2e harness", async ({ page }) => {
  page.on("console", (msg) => console.log("BROWSER:", msg.text()));
  page.on("pageerror", (err) => console.log("PAGEERROR:", err.message));

  await page.goto("/video-converter-e2e.html");
  const filePath = path.join(FIXTURES_DIR, "sample.mp4");
  await page.locator("#file-input").setInputFiles(filePath);
  await page.locator("#convert-btn").click();

  await page.waitForFunction(
    () => {
      const el = document.querySelector("#status");
      return el?.dataset.done === "1" || el?.dataset.error === "1";
    },
    { timeout: 120_000 },
  );

  const status = await page.locator("#status").textContent();
  const error = await page.evaluate(() => document.querySelector("#status")?.dataset.error);
  console.log("STATUS:", status, "error=", error);
  expect(error).not.toBe("1");
  expect(status).toMatch(/完了/);
});
