import type { UiStatus } from '@shared/types';
import { ymd, parseYmd, addDays, weekStart } from '@shared/domain';
import type { AdminApplication, AdminMember } from './admin-domain';
import { buildShiftDisplayMap, exportCSV, DEFAULT_INTEG, type IntegrationsState } from './admin-domain';
import { mapApiApplication } from './admin-api';
import type { AdminMemberRow, ShiftAvailabilityRow } from './admin-api';
import { MEMBER_COLORS } from './admin-design-domain';

export type DesignMember = {
  id: string;
  name: string;
  hr: string;
  num: number;
  discord: string;
  color: string;
};

export function toDesignMembers(rows: AdminMemberRow[]): DesignMember[] {
  return rows.map((m) => ({
    id: m.id,
    name: m.name,
    hr: m.homeroom ?? '',
    num: m.student_number ?? 0,
    discord: m.discord_user_id ?? '',
    color: MEMBER_COLORS[(m.color_index ?? 0) % MEMBER_COLORS.length],
  }));
}

export function colorIndexFromDesign(color: string): number {
  const i = MEMBER_COLORS.indexOf(color);
  return i >= 0 ? i : 0;
}

/** Design prototype uses `cancelled`; shared/API UI uses `rejected` for cancelled/failed rows. */
export type DesignStatus = 'pending' | 'approved' | 'done' | 'cancelled';

export type DesignApplication = Omit<AdminApplication, 'status'> & {
  status: DesignStatus;
  rejectReason?: string;
  cancelReason?: string;
};

export function apiStatusToDesign(status: UiStatus): DesignStatus {
  return status === 'rejected' ? 'cancelled' : status;
}

export function designStatusToDbStatus(status: DesignStatus): string {
  switch (status) {
    case 'pending':
      return 'applied';
    case 'approved':
      return 'accepted';
    case 'done':
      return 'delivered';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'applied';
  }
}

export function mapAdminAppToDesign(app: AdminApplication): DesignApplication {
  return {
    ...app,
    status: apiStatusToDesign(app.status),
  };
}

export function calendarRangeForSelected(selected: string): { from: string; to: string } {
  const from = ymd(weekStart(parseYmd(selected)));
  const to = ymd(addDays(parseYmd(from), 27));
  return { from, to };
}

export function availabilityRowsToMemberAvail(
  rows: ShiftAvailabilityRow[]
): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const row of rows) {
    if (!out[row.member_id]) out[row.member_id] = [];
    out[row.member_id].push(row.date);
  }
  for (const id of Object.keys(out)) {
    out[id].sort();
  }
  return out;
}

export function memberAvailToRows(avail: Record<string, string[]>): ShiftAvailabilityRow[] {
  const rows: ShiftAvailabilityRow[] = [];
  for (const [member_id, dates] of Object.entries(avail)) {
    for (const date of dates) rows.push({ member_id, date });
  }
  return rows;
}

export function isAvailabilityDateInMonth(ds: string, year: number, month: number): boolean {
  const d = parseYmd(ds);
  return d.getFullYear() === year && d.getMonth() + 1 === month;
}

/** Replace one calendar month in local availability maps with server rows. */
export function mergeMonthMemberAvailability(
  prev: Record<string, string[]>,
  monthRows: ShiftAvailabilityRow[],
  year: number,
  month: number
): Record<string, string[]> {
  const fromRows = availabilityRowsToMemberAvail(monthRows);
  const ids = new Set([...Object.keys(prev), ...Object.keys(fromRows)]);
  const next: Record<string, string[]> = {};
  for (const id of ids) {
    const kept = (prev[id] || []).filter((ds) => !isAvailabilityDateInMonth(ds, year, month));
    const added = fromRows[id] || [];
    next[id] = [...new Set([...kept, ...added])].sort();
  }
  return next;
}

export function shiftMapForCalendar(
  members: AdminMember[],
  availability: ShiftAvailabilityRow[],
  selected: string
): Record<string, string | null> {
  const from = weekStart(addDays(parseYmd(selected), -28));
  return buildShiftDisplayMap(members, availability, from, 140);
}

export function resolveActorMemberId(members: AdminMember[], actorName: string): string | null {
  const m = members.find((x) => x.name === actorName);
  return m?.id ?? members[0]?.id ?? null;
}

export function defaultIntegrationsState(): IntegrationsState {
  return JSON.parse(JSON.stringify(DEFAULT_INTEG)) as IntegrationsState;
}

export function applicationsToCsv(
  apps: DesignApplication[],
  from: string,
  to: string,
  members: AdminMember[]
): string {
  const mapped = apps.map((a) => ({
    ...a,
    status: a.status === 'cancelled' ? ('rejected' as UiStatus) : (a.status as UiStatus),
  })) as AdminApplication[];
  return exportCSV(mapped, from, to, members);
}
