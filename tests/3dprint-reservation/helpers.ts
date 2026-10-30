import { expect, type APIRequestContext, type Page } from "@playwright/test";

/** JST の今日 (YYYY-MM-DD) */
export function todayJst(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo" }).format(new Date());
}

/** ISO 日付に日数を加算 */
export function addDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function parseYmdUtc(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** 次の平日（当日含む） */
export function nextWeekdayOnOrAfter(isoDate: string): string {
  let cur = isoDate;
  for (let i = 0; i < 14; i++) {
    const w = parseYmdUtc(cur).getUTCDay();
    if (w >= 1 && w <= 5) return cur;
    cur = addDays(cur, 1);
  }
  return isoDate;
}

/** 新 UI: 予約（reserve）は当日以降の平日 */
export function getEarliestBookableDate(): string {
  return nextWeekdayOnOrAfter(todayJst());
}

export function earliestUserBookableDate(): string {
  return getEarliestBookableDate();
}

export function bookableDateWithOffset(offsetDays: number): string {
  let d = getEarliestBookableDate();
  let left = offsetDays;
  while (left > 0) {
    d = addDays(d, 1);
    const w = parseYmdUtc(d).getUTCDay();
    if (w >= 1 && w <= 5) left--;
  }
  return d;
}

export async function loginAsAdminViaPage(page: Page) {
  const login = await page.request.post("/api/auth/login", {
    data: { username: "admin", password: "mmh@2048@5431" },
  });
  if (!login.ok()) {
    throw new Error(`login failed: ${login.status()}`);
  }
}

export async function ensureAdminPrintProfile(request: APIRequestContext) {
  await request.patch("/api/auth/profile", {
    data: {
      homeroom: "301",
      student_number: 1,
      student_name: "E2E Admin",
    },
  });
}

export async function openReservationApp(page: Page) {
  await page.goto("/apps/3dprint-reservation/?e2e=1");
  await page.getByTestId("reservation-app").waitFor({ state: "visible", timeout: 60_000 });
  await expect(page.getByTestId("reservation-app")).toHaveAttribute("data-range-live", "true", {
    timeout: 60_000,
  });
}

export async function goToCalendarMonth(_page: Page, _date: string) {
  /* 4週表示のため月移動は不要 */
}

export async function mockBookableCalendarDay(_page: Page, _date: string) {
  /* preparePrintReservationDay を使用 */
}

export interface TestPrinterPair {
  availableId: string;
  maintenanceId: string;
}

export async function ensureTestPrinters(
  request: APIRequestContext,
  label: string
): Promise<TestPrinterPair> {
  const suffix = `${label}-${Date.now().toString(36)}`;
  const create = async (name: string) => {
    const res = await request.post("/api/3dprint/admin/printers", {
      data: { name },
    });
    if (!res.ok()) throw new Error(`プリンター作成失敗: ${res.status()}`);
    const body = await res.json();
    return body.printer.id as string;
  };
  const availableId = await create(`Ender-3 V3 KE E2E ${suffix}`);
  const maintenanceId = await create(`Centauri Carbon E2E ${suffix}`);
  await request.patch(`/api/3dprint/admin/printers/${maintenanceId}`, {
    data: { status: "maintenance" },
  });
  return { availableId, maintenanceId };
}

export async function enableShiftsForDate(
  request: APIRequestContext,
  date: string,
  printerIds: string[]
): Promise<void> {
  const memberRes = await request.post("/api/3dprint/admin/members", {
    data: {
      homeroom: "301",
      student_number: Math.floor(Math.random() * 40) + 1,
      name: `E2E Staff ${Date.now().toString(36)}`,
    },
  });
  if (!memberRes.ok()) throw new Error(`メンバー作成失敗: ${memberRes.status()}`);
  const { member } = await memberRes.json();
  await request.put("/api/3dprint/admin/shifts/availability", {
    data: { member_id: member.id, dates: [date], available: true },
  });
  for (const printerId of printerIds) {
    await request.put("/api/3dprint/admin/shifts/printer-availability", {
      data: { printer_id: printerId, dates: [date], available: true },
    });
  }
}

export async function preparePrintReservationDay(request: APIRequestContext, date: string) {
  const printers = await ensureTestPrinters(request, "day");
  await enableShiftsForDate(request, date, [printers.availableId, printers.maintenanceId]);
  return printers;
}
