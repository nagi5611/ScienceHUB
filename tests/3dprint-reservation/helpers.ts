// tests/3dprint-reservation/helpers.ts
import type { APIRequestContext, BrowserContext, Page } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loginAsAdmin } from "../website-publish/helpers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const FIXTURES_DIR = path.join(__dirname, "fixtures");
export const MINIMAL_STL_PATH = path.join(FIXTURES_DIR, "minimal.stl");

const LEAD_TIME_DAYS = 2;
const VALID_HOMEROOMS = ["101", "301"];

/** Returns today's date in JST (YYYY-MM-DD). */
export function getTodayJst(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Adds days to an ISO date string. */
export function addDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Earliest public reservation date (today JST + lead time). */
export function getEarliestBookableDate(): string {
  return addDays(getTodayJst(), LEAD_TIME_DAYS);
}

/** Syncs API login cookies into the browser context. */
export async function syncAdminSession(
  context: BrowserContext,
  request: APIRequestContext,
) {
  await loginAsAdmin(request);
  const { cookies } = await request.storageState();
  await context.addCookies(cookies);
}

/** Ensures the logged-in user has a complete print profile. */
export async function ensureAdminPrintProfile(request: APIRequestContext) {
  const current = await request.get("/api/auth/profile");
  if (current.ok()) {
    const { user } = await current.json();
    if (user?.print_profile_complete) return;
  }

  const res = await request.patch("/api/auth/profile", {
    data: {
      homeroom: "301",
      student_number: 1,
      student_name: "E2E予約テスト",
    },
  });
  if (!res.ok()) {
    throw new Error(`プロフィール更新失敗: ${res.status()}`);
  }
}

export interface PrintDaySetup {
  bookableDate: string;
  printerId: string;
  printerName: string;
  memberId: string;
}

/** Creates a printer, staff member, and shift rows for the given bookable date. */
export async function preparePrintReservationDay(
  request: APIRequestContext,
  bookableDate: string,
): Promise<PrintDaySetup> {
  const tag = Date.now().toString(36);
  const printerName = `E2Eプリンター-${tag}`;

  const printerRes = await request.post("/api/3dprint/admin/printers", {
    data: { name: printerName },
  });
  if (!printerRes.ok()) {
    throw new Error(`プリンター作成失敗: ${printerRes.status()}`);
  }
  const { printer } = await printerRes.json();
  const printerId = printer.id as string;

  const homeroom =
    VALID_HOMEROOMS[parseInt(tag.slice(-1), 36) % VALID_HOMEROOMS.length];
  const studentNumber = (Date.now() % 45) + 1;

  const memberRes = await request.post("/api/3dprint/admin/members", {
    data: {
      homeroom,
      student_number: studentNumber,
      name: `E2E担当-${tag}`,
    },
  });
  if (!memberRes.ok()) {
    throw new Error(`メンバー作成失敗: ${memberRes.status()}`);
  }
  const { member } = await memberRes.json();
  const memberId = member.id as string;

  const staffShift = await request.put("/api/3dprint/admin/shifts/availability", {
    data: {
      member_id: memberId,
      dates: [bookableDate],
      available: true,
    },
  });
  if (!staffShift.ok()) {
    throw new Error(`担当シフト設定失敗: ${staffShift.status()}`);
  }

  const printerShift = await request.put(
    "/api/3dprint/admin/shifts/printer-availability",
    {
      data: {
        printer_id: printerId,
        dates: [bookableDate],
        available: true,
      },
    },
  );
  if (!printerShift.ok()) {
    throw new Error(`プリンターシフト設定失敗: ${printerShift.status()}`);
  }

  return {
    bookableDate,
    printerId,
    printerName,
    memberId,
  };
}

/** Opens the reservation app after admin auth. */
export async function openReservationApp(page: Page) {
  await page.goto("/apps/3dprint-reservation/");
  await page.waitForSelector("#calendar-grid .calendar-day", { timeout: 30_000 });
}

/** Navigates the calendar to the month that contains `dateStr`. */
export async function goToCalendarMonth(page: Page, dateStr: string) {
  const [year, month] = dateStr.split("-").map(Number);
  const targetLabel = `${year}年${month}月`;

  for (let attempt = 0; attempt < 14; attempt++) {
    const label = await page.locator("#calendar-month-label").textContent();
    if (label?.includes(targetLabel)) return;
    await page.locator("#prev-month").click();
    await page.waitForTimeout(150);
  }

  throw new Error(`カレンダーを ${targetLabel} に移動できませんでした`);
}

export const earliestBookableDate = getEarliestBookableDate;

export type PrinterStatus = "available" | "maintenance" | "unavailable";

/** Logs in as admin with a complete print profile (API only). */
export async function loginAsPrintReservationUser(request: APIRequestContext) {
  await loginAsAdmin(request);
  await ensureAdminPrintProfile(request);
}

/** Returns the logged-in user id. */
export async function getCurrentUserId(request: APIRequestContext): Promise<string> {
  const res = await request.get("/api/auth/profile");
  if (!res.ok()) throw new Error(`プロフィール取得失敗: ${res.status()}`);
  const { user } = await res.json();
  return user.id as string;
}

let cachedStaffMemberId: string | null = null;

/** Ensures a print staff member exists for shift setup. */
async function ensurePrintStaffMember(request: APIRequestContext): Promise<string> {
  if (cachedStaffMemberId) return cachedStaffMemberId;

  const listRes = await request.get("/api/3dprint/admin/members");
  if (!listRes.ok()) throw new Error(`メンバー一覧失敗: ${listRes.status()}`);
  const { members } = await listRes.json();
  if (members?.length) {
    cachedStaffMemberId = members[0].id as string;
    return cachedStaffMemberId;
  }

  const createRes = await request.post("/api/3dprint/admin/members", {
    data: { homeroom: "301", student_number: 99, name: "E2E担当" },
  });
  if (!createRes.ok()) throw new Error(`メンバー作成失敗: ${createRes.status()}`);
  const { member } = await createRes.json();
  cachedStaffMemberId = member.id as string;
  return cachedStaffMemberId;
}

/** Enables staff and printer shifts on the given dates. */
export async function enableShiftsForDates(
  request: APIRequestContext,
  dates: string[],
  printerIds: string[],
) {
  const memberId = await ensurePrintStaffMember(request);

  const staffRes = await request.put("/api/3dprint/admin/shifts/availability", {
    data: { member_id: memberId, dates, available: true },
  });
  if (!staffRes.ok()) throw new Error(`担当シフト設定失敗: ${staffRes.status()}`);

  for (const printerId of printerIds) {
    const printerRes = await request.put("/api/3dprint/admin/shifts/printer-availability", {
      data: { printer_id: printerId, dates, available: true },
    });
    if (!printerRes.ok()) throw new Error(`プリンターシフト設定失敗: ${printerRes.status()}`);
  }
}

/** Creates a printer via admin API (optional status). */
export async function createPrinter(
  request: APIRequestContext,
  name: string,
  status: PrinterStatus = "available",
) {
  const res = await request.post("/api/3dprint/admin/printers", { data: { name } });
  if (!res.ok()) throw new Error(`プリンター作成失敗: ${res.status()}`);
  const { printer } = await res.json();

  if (status !== "available") {
    const patchRes = await request.patch(`/api/3dprint/admin/printers/${printer.id}`, {
      data: { status },
    });
    if (!patchRes.ok()) throw new Error(`プリンターステータス更新失敗: ${patchRes.status()}`);
  }

  return printer as { id: string; name: string };
}

/** Creates a force reservation owned by the given user. */
export async function forceReservation(
  request: APIRequestContext,
  opts: {
    userId: string;
    title: string;
    desiredDate: string;
    printerId?: string;
  },
) {
  const res = await request.post("/api/3dprint/admin/reservations/force", {
    data: {
      user_id: opts.userId,
      title: opts.title,
      desired_date: opts.desiredDate,
      printer_id: opts.printerId,
      homeroom: "301",
      student_number: 1,
      student_name: "E2E予約テスト",
    },
  });
  if (!res.ok()) throw new Error(`仮予約作成失敗: ${res.status()}`);
  const body = await res.json();
  return body.reservation as { id: string; title: string };
}

/** Clicks a bookable calendar day (navigates months if needed). */
export async function clickBookableCalendarDate(page: Page, dateStr: string) {
  await goToCalendarMonth(page, dateStr);

  for (let attempt = 0; attempt < 4; attempt++) {
    const cell = page.locator(`.calendar-day.clickable[data-date="${dateStr}"]`);
    if (await cell.count()) {
      await cell.click();
      return;
    }
    await page.locator("#next-month").click();
    await page.waitForTimeout(150);
  }

  throw new Error(`Bookable calendar cell not found for ${dateStr}`);
}
