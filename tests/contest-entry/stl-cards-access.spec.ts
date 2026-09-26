import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { openContestEntry, syncAdminSession } from "./helpers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MINIMAL_STL = path.join(__dirname, "fixtures/minimal.stl");

test.describe("contest-entry — STL カード", () => {
  test.beforeEach(async ({ context, request }) => {
    await syncAdminSession(context, request);
  });

  test("自己印刷で STL 提出後にダウンロードリンクが出る", async ({ page, request }) => {
    const title = `E2E-STL-${Date.now().toString(36)}`;
    const createRes = await request.post("/api/contest/applications", {
      data: {
        title,
        schedule_type: "full_time",
        homeroom: "301",
        student_number: 4,
        student_name: "STLテスト",
        self_print: true,
        members: [],
      },
    });
    expect(createRes.ok()).toBeTruthy();
    const { application } = await createRes.json();
    await request.patch(`/api/contest/applications/${application.id}`, {
      data: { status: "approved" },
    });

    await openContestEntry(page);
    await page.locator(`.contest-card-submit[data-id="${application.id}"]`).click();
    await page.locator("#stl-file-input").setInputFiles(MINIMAL_STL);
    await page.locator("#submit-btn").click();
    await expect(page.locator("#page-toast")).toContainText(/提出|完了/, { timeout: 30_000 });

    await openContestEntry(page);
    const card = page.locator(".contest-application-card", { hasText: title });
    await expect(card.getByRole("link", { name: /提出 STL/ })).toBeVisible();
    await expect(card).toContainText(/自己印刷|提出済/);
  });
});
