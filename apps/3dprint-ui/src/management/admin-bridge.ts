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
  userId: string | null;
};

export function toDesignMembers(rows: AdminMemberRow[]): DesignMember[] {
  return rows.map((m) => ({
    id: m.id,
    name: m.name,
    hr: m.homeroom ?? '',
    num: m.student_number ?? 0,
    discord: m.discord_user_id ?? '',
    color: MEMBER_COLORS[(m.color_index ?? 0) % MEMBER_COLORS.length],
    userId: m.user_id ?? null,
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

function datesInMonth(year: number, month: number): string[] {
  const total = new Date(year, month, 0).getDate();
  const out: string[] = [];
  for (let d = 1; d <= total; d++) {
    out.push(
      `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    );
  }
  return out;
}

/** Load a month from the server without overwriting in-progress draft edits. */
export function mergeMonthMemberAvailabilityPreservingDraft(
  avail: Record<string, string[]>,
  saved: Record<string, string[]>,
  monthRows: ShiftAvailabilityRow[],
  year: number,
  month: number
): { avail: Record<string, string[]>; saved: Record<string, string[]> } {
  const server = availabilityRowsToMemberAvail(monthRows);
  const memberIds = new Set([
    ...Object.keys(avail),
    ...Object.keys(saved),
    ...Object.keys(server),
  ]);
  const monthDates = datesInMonth(year, month);
  const nextAvail: Record<string, string[]> = {};
  const nextSaved: Record<string, string[]> = {};

  for (const id of memberIds) {
    const a0 = new Set(avail[id] || []);
    const s0 = new Set(saved[id] || []);
    const srv = new Set(server[id] || []);
    const a = new Set([...a0].filter((ds) => !isAvailabilityDateInMonth(ds, year, month)));
    const s = new Set([...s0].filter((ds) => !isAvailabilityDateInMonth(ds, year, month)));

    for (const ds of monthDates) {
      const drafted = s0.has(ds) !== a0.has(ds);
      if (drafted) {
        if (a0.has(ds)) a.add(ds);
        if (s0.has(ds)) s.add(ds);
      } else if (srv.has(ds)) {
        a.add(ds);
        s.add(ds);
      }
    }
    nextAvail[id] = [...a].sort();
    nextSaved[id] = [...s].sort();
  }
  return { avail: nextAvail, saved: nextSaved };
}

export type ShiftDraftSummary = {
  addedSlots: number;
  removedSlots: number;
  addedDates: number;
  removedDates: number;
};

export function summarizeMemberShiftDraft(
  saved: Record<string, string[]>,
  draft: Record<string, string[]>
): ShiftDraftSummary {
  const before = memberAvailToRows(saved);
  const after = memberAvailToRows(draft);
  const beforeKeys = new Set(before.map((r) => `${r.member_id}\0${r.date}`));
  const afterKeys = new Set(after.map((r) => `${r.member_id}\0${r.date}`));
  const added = after.filter((r) => !beforeKeys.has(`${r.member_id}\0${r.date}`));
  const removed = before.filter((r) => !afterKeys.has(`${r.member_id}\0${r.date}`));
  return {
    addedSlots: added.length,
    removedSlots: removed.length,
    addedDates: new Set(added.map((r) => r.date)).size,
    removedDates: new Set(removed.map((r) => r.date)).size,
  };
}

export function shiftMapForCalendar(
  members: AdminMember[],
  availability: ShiftAvailabilityRow[],
  selected: string
): Record<string, string | null> {
  const from = weekStart(addDays(parseYmd(selected), -28));
  return buildShiftDisplayMap(members, availability, from, 140);
}

/** Print staff member id for reservation accept (linked ScienceHUB account). */
export function resolveOperatorStaffMemberId(
  members: Pick<DesignMember, 'id'>[],
  linkedMemberId: string | null
): string | null {
  if (!linkedMemberId) return null;
  return members.some((m) => m.id === linkedMemberId) ? linkedMemberId : null;
}

export function formatOperatorDisplayLabel(session: {
  user: { display_name: string };
  linked_member: { name: string } | null;
}): string {
  if (session.linked_member) {
    return `${session.user.display_name}（印刷担当: ${session.linked_member.name}）`;
  }
  return session.user.display_name;
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
