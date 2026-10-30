import { test, expect } from "@playwright/test";
import {
  getEarliestBookableDate,
  openReservationApp,
  preparePrintReservationDay,
  loginAsAdminViaPage,
  ensureAdminPrintProfile,
} from "./helpers";
import path from "node:path";
import { fileURLToPath } from "node:url";

const fixtureStl = path.join(path.dirname(fileURLToPath(import.meta.url)), "fixtures/minimal.stl");

test.describe("3D印刷予約 — STL", () => {
  test.beforeEach(async ({ page, request }) => {
    await loginAsAdminViaPage(page);
    await ensureAdminPrintProfile(page.request);
  });

  test("新規申請ポップにファイル入力がある", async ({ page }) => {
    const date = getEarliestBookableDate();
    await preparePrintReservationDay(page.request, date);
    await openReservationApp(page);
    await page.getByTestId("btn-new-application").click();
    const dialog = page.getByRole("dialog", { name: /申請/i });
    await expect(dialog).toBeVisible();
    await dialog.locator('input[type="file"]').setInputFiles(fixtureStl);
    await expect(dialog.getByText(/minimal\.stl/i)).toBeVisible();
  });

  test("STL添付後に申請するとアップロード API が呼ばれる", async ({ page }) => {
    const date = getEarliestBookableDate();
    await preparePrintReservationDay(page.request, date);
    await openReservationApp(page);
    let uploadInitiated = false;
    page.on("request", (req) => {
      if (req.url().includes("/api/3dprint/upload/initiate")) uploadInitiated = true;
    });
    await page.getByTestId("btn-new-application").click();
    const dialog = page.getByRole("dialog", { name: /申請/i });
    await dialog.locator('input[type="file"]').setInputFiles(fixtureStl);
    await dialog.getByPlaceholder(/試し刷り|スマホスタンド/).fill("E2E test part");
    await dialog.getByLabel("HR（学年・組）").selectOption("301");
    await dialog.getByLabel("出席番号").fill("1");
    await dialog.getByLabel("名前").fill("E2E");
    await dialog.getByTestId("btn-submit-application").click();
    await expect.poll(() => uploadInitiated, { timeout: 15_000 }).toBe(true);
    await expect(page.getByRole("status")).not.toContainText(/印刷データを選択/i);
  });
});
