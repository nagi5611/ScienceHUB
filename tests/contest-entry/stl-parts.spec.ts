import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { openContestEntry, syncAdminSession } from "./helpers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MINIMAL_STL = path.join(__dirname, "fixtures/minimal.stl");

test.describe("contest-entry — 複数 STL パーツ", () => {
  test.beforeEach(async ({ context, request }) => {
    await syncAdminSession(context, request);
  });

  test("STL パーツ行を追加できる", async ({ page, request }) => {
    const title = `E2E-Parts-${Date.now().toString(36)}`;
    const createRes = await request.post("/api/contest/applications", {
      data: {
        title,
        schedule_type: "full_time",
        homeroom: "301",
        student_number: 3,
        student_name: "パーツテスト",
        self_print: true,
        uses_multiple_parts: true,
        part_count: 2,
        members: [],
      },
    });
    expect(createRes.ok()).toBeTruthy();
    const { application } = await createRes.json();
    const approveRes = await request.patch(`/api/contest/applications/${application.id}`, {
      data: { status: "approved" },
    });
    expect(approveRes.ok()).toBeTruthy();

    await openContestEntry(page);
    await page.locator(`.contest-card-submit[data-id="${application.id}"]`).click();
    await page.locator("#btn-add-stl-part").click();
    await expect(page.locator(".contest-stl-part-row")).toHaveCount(2);
    await page.locator(".stl-part-file-input").first().setInputFiles(MINIMAL_STL);
    await expect(page.locator(".contest-stl-part-row").first()).toContainText(/完了|アップロード/, {
      timeout: 30_000,
    });
  });
});
