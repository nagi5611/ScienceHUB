import type { AdminApplication, AdminMember, IntegrationsState } from './admin-domain';

type ApplicationApiModel = {
  id: string;
  date: string;
  machine: 'ke' | 'cc';
  kind: 'request' | 'reserve';
  start: number;
  end: number;
  title: string;
  file: string;
  file_size?: number;
  note: string;
  who: { name: string; hr: string; num: string };
  status: AdminApplication['status'];
  created_at?: string;
  printer_id: string;
  status_comment?: string | null;
};

const API = '/api/3dprint';

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}/${path}`, {
    credentials: 'include',
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers as Record<string, string>) },
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string; code?: string; date?: string; reservations?: unknown[] };
  if (!res.ok) {
    const err = new Error(data.error || `HTTP ${res.status}`) as Error & {
      status?: number;
      payload?: typeof data;
    };
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data as T;
}

export async function checkManagementAccess(): Promise<'ok' | 'login' | 'denied'> {
  const res = await fetch('/api/apps/3dprint-management/access', { credentials: 'include' });
  if (res.status === 401) return 'login';
  if (res.status === 403) return 'denied';
  return res.ok ? 'ok' : 'denied';
}

export function mapApiApplication(a: ApplicationApiModel & { status_comment?: string | null }): AdminApplication {
  return {
    id: a.id,
    date: a.date,
    machine: a.machine,
    kind: a.kind,
    start: a.start,
    end: a.end,
    title: a.title,
    file: a.file,
    fileSize: a.file_size,
    note: a.note,
    who: a.who,
    status: a.status,
    createdAt: a.created_at,
    adminNote: a.status_comment ?? undefined,
    printer_id: a.printer_id,
  };
}

export async function fetchApplicationsRange(from: string, to: string): Promise<AdminApplication[]> {
  const data = await apiFetch<{ applications: ApplicationApiModel[] }>(
    `calendar/applications?from=${from}&to=${to}`
  );
  return data.applications.map((a) => mapApiApplication(a));
}

export async function fetchMembers(): Promise<AdminMember[]> {
  const data = await apiFetch<{ members: { id: string; name: string; homeroom: string; student_number: number }[] }>(
    'admin/members'
  );
  return data.members.map((m) => ({
    id: m.id,
    name: m.name,
    homeroom: m.homeroom,
    student_number: m.student_number,
  }));
}

export async function createMember(body: {
  homeroom: string;
  student_number: number;
  name: string;
  discord_user_id?: string | null;
}) {
  return apiFetch<{ member: AdminMember }>('admin/members', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function deleteMember(id: string) {
  return apiFetch<{ ok: boolean }>(`admin/members/${id}`, { method: 'DELETE' });
}

export type ShiftAvailabilityRow = { member_id: string; date: string };

export async function fetchShifts(year: number, month: number) {
  return apiFetch<{
    members: { id: string; name: string; homeroom: string; student_number: number; color_index: number }[];
    availability: ShiftAvailabilityRow[];
  }>(`admin/shifts?year=${year}&month=${month}`);
}

export async function setMemberDatesAvailability(memberId: string, dates: string[], available: boolean) {
  return apiFetch<{ ok: boolean }>('admin/shifts/availability', {
    method: 'PUT',
    body: JSON.stringify({ member_id: memberId, dates, available }),
  });
}

export async function toggleMemberShift(memberId: string, date: string) {
  return apiFetch<{ available: boolean }>('admin/shifts/toggle', {
    method: 'POST',
    body: JSON.stringify({ member_id: memberId, date }),
  });
}

/** Apply handoff-style single-duty shift for each day. */
export async function applyShiftPlan(
  members: AdminMember[],
  plan: { date: string; memberId: string | null }[],
  availability: ShiftAvailabilityRow[]
) {
  const onDate = new Map<string, Set<string>>();
  for (const row of availability) {
    if (!onDate.has(row.date)) onDate.set(row.date, new Set());
    onDate.get(row.date)!.add(row.member_id);
  }

  for (const { date, memberId } of plan) {
    const current = onDate.get(date) ?? new Set<string>();
    if (memberId) {
      for (const mid of current) {
        if (mid !== memberId) {
          await setMemberDatesAvailability(mid, [date], false);
        }
      }
      await setMemberDatesAvailability(memberId, [date], true);
      onDate.set(date, new Set([memberId]));
    } else {
      for (const mid of [...current]) {
        await setMemberDatesAvailability(mid, [date], false);
      }
      onDate.set(date, new Set());
    }
  }
}

export async function acceptReservation(id: string, printStaffMemberId: string) {
  return apiFetch<{ reservation: unknown; calendar?: { ok: boolean; error?: string } }>(
    `admin/reservations/${id}/accept`,
    { method: 'POST', body: JSON.stringify({ print_staff_member_id: printStaffMemberId }) }
  );
}

export async function patchReservation(
  id: string,
  body: { status?: string; status_comment?: string | null; print_staff_member_id?: string }
) {
  return apiFetch<{ reservation: unknown; calendar?: { ok: boolean; error?: string } }>(
    `admin/reservations/${id}`,
    { method: 'PATCH', body: JSON.stringify(body) }
  );
}

export async function testGoogleCalendar() {
  return apiFetch<{ ok: boolean; calendarId?: string; error?: string }>('admin/calendar/status');
}

export async function testDiscordWebhook(integrations: IntegrationsState) {
  const url = (integrations.discord.webhook || '').trim();
  if (!url) throw new Error('Webhook URLを入力してください');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: `${integrations.discord.mention || ''} ScienceHUB 3Dプリント管理のテスト通知です。`.trim(),
      username: 'ScienceHUB 3Dプリント',
    }),
  });
  if (!res.ok) throw new Error(`送信に失敗しました（HTTP ${res.status}）`);
}

export function stlAdminUrl(reservationId: string) {
  return `${API}/admin/stl/${reservationId}`;
}
