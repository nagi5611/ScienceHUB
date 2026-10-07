import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers";
import { uniqueContestTitle } from "../contest-entry/helpers";
import { DISPLAY_CARD_LAYOUT } from "../../public/apps/contest-entry/js/display-card-preview.js";

test.describe("contest-management — 展示カード PDF プレビュー", () => {
  test.use({ serviceWorkers: "block" });

  test("参加申請一覧の PDF ボタンでプレビューモーダルが開く", async ({ page }) => {
    test.setTimeout(120_000);
    await loginAsAdmin(page.request);
    const title = uniqueContestTitle("pdf-preview");

    const createRes = await page.request.post("/api/contest/applications", {
      data: {
        schedule_type: "full_time",
        homeroom: "101",
        student_number: 7,
        student_name: "山田太郎",
        title,
        impressions: "テストコメント。PDFプレビュー用の短文です。",
        members: [{ homeroom: "101", member_name: "山田太郎" }],
      },
    });
    expect(createRes.ok()).toBeTruthy();

    const layoutRes = await page.request.patch("/api/contest/admin/settings/display-card-layout", {
      data: { layout: DISPLAY_CARD_LAYOUT },
    });
    expect(layoutRes.ok()).toBeTruthy();

    const appsLoaded = page.waitForResponse(
      (res) =>
        res.url().includes("/api/contest/admin/applications") &&
        res.request().method() === "GET" &&
        res.ok(),
      { timeout: 30_000 }
    );
    await page.goto("/apps/contest-management/", { waitUntil: "domcontentloaded" });
    await appsLoaded;
    await expect(page.locator("body")).not.toContainText("アクセス拒否", { timeout: 20_000 });

    await page.locator('.admin-menu-item[data-panel="applications"]').click();

    const panel = page.locator("#panel-applications");
    await expect(panel).toBeVisible({ timeout: 20_000 });
    await expect(panel).not.toHaveClass(/hidden/);
    await expect(page.locator("#contest-applications-toolbar")).toBeVisible({ timeout: 30_000 });

    const row = page.locator("#applications-results-mount tr", { hasText: title }).first();
    await expect(row).toBeVisible({ timeout: 20_000 });

    const modal = page.locator("#contest-display-card-pdf-modal");
    await page.evaluate((rowTitle) => {
      const row = [...document.querySelectorAll("#applications-results-mount tr")].find((tr) =>
        tr.textContent?.includes(rowTitle)
      );
      const btn = row?.querySelector(".contest-admin-app-display-card-pdf");
      if (btn instanceof HTMLButtonElement) btn.click();
    }, title);

    await expect(page.locator("#contest-applications-pdf-status")).toContainText("PDFプレビュー生成中", {
      timeout: 20_000,
    });

    await expect(modal).toHaveClass(/open/, { timeout: 90_000 });
    const img = modal.locator("[data-display-card-pdf-preview-img]");
    await expect(img).toBeVisible();
    await expect
      .poll(async () => img.getAttribute("src"), { timeout: 30_000 })
      .toMatch(/^data:image\/png/);

    const previewHasInk = await page.evaluate(async (expectedTitle) => {
      const pdfMod = await import("/apps/contest-management/js/display-card-pdf-export.js");
      const previewMod = await import("/apps/contest-entry/js/display-card-preview.js");
      const layout = previewMod.getDisplayCardLayout?.() ?? previewMod.DISPLAY_CARD_LAYOUT;
      const img = document.querySelector("[data-display-card-pdf-preview-img]");
      if (!(img instanceof HTMLImageElement) || !img.src.startsWith("data:image/png")) return false;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return false;
      ctx.drawImage(img, 0, 0);
      try {
        pdfMod.assertDisplayCardCanvasHasOverlayInk(canvas, layout);
      } catch {
        return false;
      }
      return (img.alt?.length ?? 0) >= 0 && expectedTitle.length > 0;
    }, title);
    expect(previewHasInk).toBe(true);

    await modal.locator("[data-display-card-pdf-dismiss]").click();
    await expect(modal).not.toHaveClass(/open/);
  });
});
