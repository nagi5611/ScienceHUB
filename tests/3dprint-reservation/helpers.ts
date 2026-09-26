import type { Page } from "@playwright/test";

const LEAD_TIME_DAYS = 2;

/** Returns today's date string in JST (YYYY-MM-DD). */
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

/** Earliest user-bookable date (matches LEAD_TIME_DAYS in 3dprint constants). */
export function getEarliestBookableDate(): string {
  return addDays(getTodayJst(), LEAD_TIME_DAYS);
}

/** Parses YYYY-MM-DD into year and month (1–12). */
export function yearMonthFromIso(isoDate: string): { year: number; month: number } {
  const [year, month] = isoDate.split("-").map(Number);
  return { year, month };
}

/** Logs in as the seeded admin user (uses page cookie jar). */
export async function loginAsAdmin(page: Page): Promise<void> {
  const response = await page.request.post("/api/auth/login", {
    data: {
      username: "admin",
      password: "mmh@2048@5431",
    },
  });
  if (!response.ok()) {
    throw new Error(`ログイン失敗: ${response.status()}`);
  }
}

/** Ensures the session user has a complete 3D print profile. */
export async function ensurePrintProfile(page: Page): Promise<void> {
  const response = await page.request.patch("/api/auth/profile", {
    data: {
      homeroom: "301",
      student_number: 1,
      student_name: "E2Eテスト",
    },
  });
  if (!response.ok()) {
    const body = await response.text();
    throw new Error(`プロフィール更新失敗: ${response.status()} ${body}`);
  }
}

/** Opens the reservation app with auth cookies on the page context. */
export async function openReservationApp(page: Page): Promise<void> {
  await loginAsAdmin(page);
  await ensurePrintProfile(page);
  await page.goto("/apps/3dprint-reservation/");
  await page.locator("#calendar-grid").waitFor({ state: "visible" });
}

/**
 * Mocks calendar list + availability so one day is clickable in the UI.
 * Other /api/3dprint/* requests pass through to the local server.
 */
export async function mockBookableCalendarDay(
  page: Page,
  bookableDate: string
): Promise<void> {
  const { year, month } = yearMonthFromIso(bookableDate);

  await page.route(`**/api/3dprint/calendar?year=${year}&month=${month}*`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        year,
        month,
        earliestBookable: getEarliestBookableDate(),
        staffAvailableDates: [bookableDate],
        staffCountByDate: { [bookableDate]: 1 },
        printerAvailableDates: [bookableDate],
        printerCountByDate: { [bookableDate]: 1 },
        reservations: [],
      }),
    });
  });

  await page.route(
    `**/api/3dprint/calendar/availability?date=${bookableDate}*`,
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          date: bookableDate,
          bookable: true,
          remaining: 1,
          canBook: true,
          isFull: false,
          staffAvailable: true,
          printerAvailable: true,
          availableScales: ["small", "medium", "large"],
          count: 0,
          scales: [],
          printers: [],
        }),
      });
    }
  );
}

/** Navigates the calendar UI to the month containing the given ISO date. */
export async function goToCalendarMonth(page: Page, isoDate: string): Promise<void> {
  const target = yearMonthFromIso(isoDate);
  const maxSteps = 24;

  for (let i = 0; i < maxSteps; i++) {
    const label = await page.locator("#calendar-month-label").textContent();
    const match = label?.match(/(\d{4})年(\d{1,2})月/);
    if (!match) break;
    const year = Number(match[1]);
    const month = Number(match[2]);
    if (year === target.year && month === target.month) return;
    const goForward = year < target.year || (year === target.year && month < target.month);
    await page.locator(goForward ? "#next-month" : "#prev-month").click();
    await page.waitForTimeout(150);
  }
}
