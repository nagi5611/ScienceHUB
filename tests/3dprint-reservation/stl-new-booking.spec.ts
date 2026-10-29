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
});
