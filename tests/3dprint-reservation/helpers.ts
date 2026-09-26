import type { APIRequestContext } from "@playwright/test";

const LEAD_TIME_DAYS = 2;

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

/** 一般ユーザーがカレンダーから選べる最早日 */
export function earliestUserBookableDate(): string {
  return addDays(todayJst(), LEAD_TIME_DAYS);
}

/** 予約可能日からのオフセット日 */
export function bookableDateWithOffset(offsetDays: number): string {
  return addDays(earliestUserBookableDate(), offsetDays);
}

export interface TestPrinterPair {
  availableId: string;
  maintenanceId: string;
}

/** E2E 用プリンター2台（稼働可・メンテ）を用意 */
export async function ensureTestPrinters(
  request: APIRequestContext,
  label: string
): Promise<TestPrinterPair> {
  const suffix = `${label}-${Date.now().toString(36)}`;
  const create = async (name: string) => {
    const res = await request.post("/api/3dprint/admin/printers", {
      data: { name },
    });
    if (!res.ok()) {
      throw new Error(`プリンター作成失敗: ${res.status()} ${await res.text()}`);
    }
    const body = await res.json();
    return body.printer.id as string;
  };

  const availableId = await create(`E2E 稼働 ${suffix}`);
  const maintenanceId = await create(`E2E メンテ ${suffix}`);

  const patchRes = await request.patch(`/api/3dprint/admin/printers/${maintenanceId}`, {
    data: { status: "maintenance" },
  });
  if (!patchRes.ok()) {
    throw new Error(`プリンターステータス更新失敗: ${patchRes.status()}`);
  }

  return { availableId, maintenanceId };
}

/** 指定日のスタッフ・プリンターシフトを有効化 */
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
  if (!memberRes.ok()) {
    throw new Error(`メンバー作成失敗: ${memberRes.status()} ${await memberRes.text()}`);
  }
  const { member } = await memberRes.json();

  const staffRes = await request.put("/api/3dprint/admin/shifts/availability", {
    data: {
      member_id: member.id,
      dates: [date],
      available: true,
    },
  });
  if (!staffRes.ok()) {
    throw new Error(`スタッフシフト失敗: ${staffRes.status()}`);
  }

  for (const printerId of printerIds) {
    const printerRes = await request.put("/api/3dprint/admin/shifts/printer-availability", {
      data: {
        printer_id: printerId,
        dates: [date],
        available: true,
      },
    });
    if (!printerRes.ok()) {
      throw new Error(`プリンターシフト失敗: ${printerRes.status()}`);
    }
  }
}
