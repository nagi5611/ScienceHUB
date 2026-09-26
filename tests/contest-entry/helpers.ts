import { expect, type APIRequestContext, type Page } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loginAsAdmin } from "../website-publish/helpers";
import { bookableDateWithOffset, ensureTestPrinters } from "../3dprint-reservation/helpers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const STL_FIXTURE_PATH = path.join(__dirname, "fixtures", "minimal.stl");

export { loginAsAdmin };

export function uniqueContestTitle(prefix = "e2e") {
  return `${prefix}-${Date.now().toString(36)}`;
}

export async function openContestEntry(page: Page) {
  await loginAsAdmin(page.request);
  const applicationsLoaded = page.waitForResponse(
    (res) =>
      res.url().includes("/api/contest/applications") &&
      res.request().method() === "GET" &&
      res.ok(),
    { timeout: 20_000 }
  );
  const response = await page.goto("/apps/contest-entry/", { waitUntil: "domcontentloaded" });
  if (!response?.ok()) {
    throw new Error(`contest-entry 読み込み失敗: ${response?.status()}`);
  }
  await applicationsLoaded.catch(() => {});
  await page.waitForSelector("#view-list:not(.hidden)", { timeout: 20_000 });
  await page.waitForSelector("#btn-new-application", { state: "visible" });
}

export async function ensureContestListView(page: Page) {
  if (await page.locator("#view-list:not(.hidden)").isVisible()) {
    return;
  }
  const backSubmit = page.locator("#btn-back-from-submit");
  if (await backSubmit.isVisible()) {
    await backSubmit.click();
  }
  const backApply = page.locator("#btn-back-from-apply");
  if (await backApply.isVisible()) {
    await backApply.click();
  }
  await page.waitForSelector("#view-list:not(.hidden)", { timeout: 10_000 });
}

export async function openNewApplicationForm(page: Page) {
  await ensureContestListView(page);
  await page.locator("#btn-new-application").click();
  await page.waitForSelector("#view-apply:not(.hidden)", { timeout: 15_000 });
  await expect(page.locator("#apply-heading")).toHaveText("参加申請");
}

function applyFormRoot(page: Page) {
  return page.locator("#view-apply:not(.hidden)");
}

export async function fillPrimaryParticipant(
  page: Page,
  opts: { homeroom?: string; number?: string; name?: string } = {}
) {
  const homeroom = opts.homeroom ?? "101";
  const number = opts.number ?? "1";
  const name = opts.name ?? "テスト太郎";
  const root = applyFormRoot(page);
  await expect(root).toBeVisible({ timeout: 10_000 });
  const row = root.locator(".contest-participant-row").first();
  await row.locator(".participant-homeroom").fill(homeroom);
  await row.locator(".participant-number").fill(number);
  await row.locator(".participant-name").fill(name);
}

async function expectSubmitEnabled(page: Page) {
  await page.waitForFunction(() => {
    const btn = document.getElementById("application-submit-btn");
    return btn instanceof HTMLButtonElement && !btn.disabled;
  });
}

export async function submitNewApplication(
  page: Page,
  opts: {
    title: string;
    selfPrint?: boolean;
    impressions?: string;
  }
) {
  if (!(await applyFormRoot(page).isVisible())) {
    await openNewApplicationForm(page);
  }
  const root = applyFormRoot(page);
  await fillPrimaryParticipant(page);
  await root.locator("#title").fill(opts.title);
  if (opts.impressions) {
    await root.locator("#impressions").fill(opts.impressions);
  }
  const selfPrint = root.locator("#self_print");
  if (opts.selfPrint) {
    await selfPrint.check();
  } else {
    await selfPrint.uncheck();
  }
  await expectSubmitEnabled(page);
  await root.locator("#application-submit-btn").click();
  await page.waitForSelector("#view-list:not(.hidden)");
  await page.waitForSelector("#page-toast:not(.hidden)", { timeout: 10_000 }).catch(() => {});
}

export function applicationCardByTitle(page: Page, title: string) {
  return page.locator(".contest-application-card", {
    has: page.locator(".contest-application-title", { hasText: title }),
  });
}

export async function openSubmitViewForTitle(page: Page, title: string) {
  const card = applicationCardByTitle(page, title);
  await expect(card.locator(".contest-card-submit")).toBeVisible({ timeout: 10_000 });
  await card.locator(".contest-card-submit").click();
  await page.waitForSelector("#view-submit:not(.hidden)", { timeout: 15_000 });
}

export async function uploadStlPartAt(
  page: Page,
  index: number,
  filePath: string = STL_FIXTURE_PATH
) {
  const root = page.locator("#view-submit:not(.hidden)");
  await expect(root).toBeVisible({ timeout: 10_000 });
  const row = root.locator(".contest-stl-part-row").nth(index);
  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    row.locator(".stl-part-choose-file").click(),
  ]);
  await fileChooser.setFiles(filePath);
  await expect(row.locator(".stl-part-file-name--done")).toContainText(
    path.basename(filePath),
    { timeout: 45_000 }
  );
}

export async function submitStlForm(page: Page) {
  const btn = page.locator("#submit-btn");
  await expect(btn).toBeEnabled({ timeout: 15_000 });
  await btn.click();
  await page.waitForSelector("#view-list:not(.hidden)", { timeout: 30_000 });
}

export async function ensureContestAutoScheduleSlots(
  request: APIRequestContext,
  label: string,
  dayCount = 14
): Promise<{ printerId: string; staffMemberId: string }> {
  const printers = await ensureTestPrinters(request, label);
  const dates = Array.from({ length: dayCount }, (_, i) => bookableDateWithOffset(i));

  const memberRes = await request.post("/api/3dprint/admin/members", {
    data: {
      homeroom: "301",
      student_number: Math.floor(Math.random() * 40) + 1,
      name: `E2E Contest ${label} ${Date.now().toString(36)}`,
    },
  });
  if (!memberRes.ok()) {
    throw new Error(`メンバー作成失敗: ${memberRes.status()} ${await memberRes.text()}`);
  }
  const { member } = await memberRes.json();
  const staffMemberId = member.id as string;

  const staffRes = await request.put("/api/3dprint/admin/shifts/availability", {
    data: {
      member_id: staffMemberId,
      dates,
      available: true,
    },
  });
  if (!staffRes.ok()) {
    throw new Error(`スタッフシフト失敗: ${staffRes.status()}`);
  }

  const printerRes = await request.put("/api/3dprint/admin/shifts/printer-availability", {
    data: {
      printer_id: printers.availableId,
      dates,
      available: true,
    },
  });
  if (!printerRes.ok()) {
    throw new Error(`プリンターシフト失敗: ${printerRes.status()}`);
  }

  return { printerId: printers.availableId, staffMemberId };
}
