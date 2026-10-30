import type { Application, Kind, UiStatus } from '@shared/types';
import {
  WD,
  pad2,
  ymd,
  parseYmd,
  addDays,
  startOfDay,
  isWeekday,
  weekStart,
  mdLabel,
  minsLabel,
  durationLabel,
  spanOf,
  whoLabel,
  KIND,
  STATUS,
  MACHINE_MAP,
  SHIFT_START,
  SHIFT_END,
  SLOT_COUNT,
  OCCUPYING,
} from '@shared/domain';

export type AdminMember = { id: string; name: string; homeroom?: string; student_number?: number };

export type RejectReasonId = 'stl' | 'size' | 'deadline' | 'time';

export type AdminApplication = Application & {
  rejectReason?: RejectReasonId;
  adminNote?: string;
  by?: string;
  createdAt?: string;
};

export const REJECT_REASONS = [
  {
    id: 'stl' as const,
    label: 'STLの不備',
    body: 'STLの形状に不備があり印刷できません。メッシュの穴・法線を確認して再提出してください。',
  },
  {
    id: 'size' as const,
    label: 'サイズ超過',
    body: '造形サイズが機種のビルドボリュームを超えています。縮小または分割して再提出してください。',
  },
  {
    id: 'deadline' as const,
    label: '締切超過',
    body: '印刷依頼の受付は前日までです。当日の依頼は受け付けられません。',
  },
  {
    id: 'time' as const,
    label: '時間不足',
    body: 'この時間帯はすでに埋まっており、印刷時間を確保できません。別の日時に再申請してください。',
  },
];

export const NOTE_TEMPLATES = [
  '16:20までに物理実験室へ来てください。',
  'フィラメントは白PLAを使用します。',
  'サポート材を付けています。剥がす作業もお願いします。',
  '印刷後に実寸を確認します。終わったら声をかけてください。',
];

export const TODAY = ymd(startOfDay(new Date()));
export const todayDate = () => parseYmd(TODAY);

export const dateLabel = (s: string) => {
  const d = parseYmd(s);
  return d.getMonth() + 1 + '/' + d.getDate();
};
export const dateLabelW = (s: string) => {
  const d = parseYmd(s);
  return dateLabel(s) + '（' + WD[d.getDay()] + '）';
};

export const hrLabel = (v: string) => (v ? String(v).slice(0, 1) + '年' + String(v).slice(1) + 'HR' : '—');

export function memberName(members: AdminMember[], id: string | null | undefined) {
  if (!id) return null;
  return members.find((m) => m.id === id)?.name ?? null;
}

export function availabilityToShiftMap(
  availability: { member_id: string; date: string }[]
): Record<string, string | null> {
  const byDate: Record<string, string[]> = {};
  for (const row of availability) {
    if (!byDate[row.date]) byDate[row.date] = [];
    byDate[row.date].push(row.member_id);
  }
  const out: Record<string, string | null> = {};
  for (const [date, ids] of Object.entries(byDate)) {
    out[date] = ids[0] ?? null;
  }
  return out;
}

/** Merge API availability into a dense date→memberId map for calendar display. */
export function buildShiftDisplayMap(
  members: AdminMember[],
  availability: { member_id: string; date: string }[],
  from: Date,
  days: number
): Record<string, string | null> {
  const saved = availabilityToShiftMap(availability);
  const out: Record<string, string | null> = {};
  for (let i = 0; i < days; i++) {
    const d = addDays(from, i);
    const ds = ymd(d);
    if (saved[ds] !== undefined) {
      out[ds] = saved[ds];
      continue;
    }
    if (!isWeekday(d) || !members.length) {
      out[ds] = null;
      continue;
    }
    out[ds] = members[(d.getDate() - 1) % members.length].id;
  }
  return out;
}

export function planShiftRule(opts: {
  weekday: number;
  weeks: number;
  memberId: string | null;
  from?: string;
  skipExisting?: boolean;
  shiftMap: Record<string, string | null>;
}) {
  const base = weekStart(opts.from ? parseYmd(opts.from) : todayDate());
  const out: { date: string; memberId: string | null }[] = [];
  for (let i = 0; i < opts.weeks; i++) {
    const first = addDays(base, i * 7);
    const d = addDays(first, opts.weekday);
    const ds = ymd(d);
    if (ds < TODAY) continue;
    if (opts.skipExisting && opts.shiftMap[ds]) continue;
    out.push({ date: ds, memberId: opts.memberId });
  }
  return out;
}

export function isLate(a: AdminApplication) {
  return a.kind === 'request' && a.date <= TODAY;
}

export function pendingQueue(apps: AdminApplication[]) {
  return apps
    .filter((a) => a.status === 'pending')
    .sort((a, b) =>
      (a.date + pad2(Math.floor(spanOf(a).start / 60))).localeCompare(
        b.date + pad2(Math.floor(spanOf(b).start / 60))
      )
    );
}

export function daySummary(apps: AdminApplication[], ds: string) {
  const all = apps.filter((a) => a.date === ds);
  const live = all.filter((a) => a.status !== 'rejected');
  return {
    all,
    live,
    requests: live.filter((a) => a.kind === 'request'),
    reserves: live.filter((a) => a.kind === 'reserve'),
    pending: live.filter((a) => a.status === 'pending').length,
  };
}

/** One row for admin CSV / Excel export (column order tuned for spreadsheets). */
export type ApplicationExportRow = {
  date: string;
  weekday: string;
  title: string;
  machine: string;
  kind: string;
  status: string;
  applicant: string;
  homeroom: string;
  studentNumber: string;
  start: string;
  end: string;
  printFile: string;
  fileSizeMb: string;
  note: string;
  staff: string;
};

export const APPLICATION_EXPORT_HEADERS: { key: keyof ApplicationExportRow; label: string }[] = [
  { key: 'date', label: '日付' },
  { key: 'weekday', label: '曜日' },
  { key: 'title', label: '作品名' },
  { key: 'machine', label: '機種' },
  { key: 'kind', label: '種別' },
  { key: 'status', label: '状態' },
  { key: 'applicant', label: '申請者' },
  { key: 'homeroom', label: '学年HR' },
  { key: 'studentNumber', label: '番号' },
  { key: 'start', label: '開始' },
  { key: 'end', label: '終了' },
  { key: 'printFile', label: '印刷データ' },
  { key: 'fileSizeMb', label: 'サイズ(MB)' },
  { key: 'note', label: '備考' },
  { key: 'staff', label: '担当' },
];

export function buildApplicationExportRows(
  apps: AdminApplication[],
  fromStr: string,
  toStr: string,
  members: AdminMember[],
  shiftMap: Record<string, string | null> = {}
): ApplicationExportRow[] {
  return apps
    .filter((a) => a.date >= fromStr && a.date <= toStr)
    .sort((a, b) => (a.date + String(a.start)).localeCompare(b.date + String(b.start)))
    .map((a) => {
      const sp = spanOf(a);
      const d = parseYmd(a.date);
      const staffId = shiftMap[a.date];
      return {
        date: a.date,
        weekday: WD[d.getDay()],
        title: a.title,
        machine: MACHINE_MAP[a.machine]?.name ?? a.machine,
        kind: KIND[a.kind],
        status: STATUS[a.status],
        applicant: a.who.name,
        homeroom: a.who.hr,
        studentNumber: String(a.who.num),
        start: minsLabel(sp.start),
        end: minsLabel(sp.end),
        printFile: a.file,
        fileSizeMb: a.fileSize ? (a.fileSize / 1048576).toFixed(2) : '',
        note: a.note,
        staff: staffId ? memberName(members, staffId) || '' : '',
      };
    });
}

export function exportCSV(
  apps: AdminApplication[],
  fromStr: string,
  toStr: string,
  members: AdminMember[],
  shiftMap: Record<string, string | null> = {}
) {
  const rows = buildApplicationExportRows(apps, fromStr, toStr, members, shiftMap);
  const esc = (v: unknown) => {
    const s = String(v == null ? '' : v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const lines = [APPLICATION_EXPORT_HEADERS.map((h) => h.label).join(',')];
  for (const row of rows) {
    lines.push(
      APPLICATION_EXPORT_HEADERS.map((h) => esc(row[h.key]))
        .join(',')
    );
  }
  return '\uFEFF' + lines.join('\r\n');
}

export const K_PREFS = 'sh3d.admin.prefs.v2';
export const K_INTEG = 'sh3d.admin.integrations.v2';
export const K_LOG = 'sh3d.admin.log.v2';

export type AdminLogItem = {
  id: string;
  at: string;
  actor: string;
  type: string;
  text: string;
  appId: string | null;
};

export type IntegrationsState = {
  discord: {
    webhook: string;
    enabled: boolean;
    events: { pending: boolean; approved: boolean; rejected: boolean };
    mention: string;
  };
  gcal: {
    calendarId: string;
    enabled: boolean;
    title: string;
    duration: number;
    syncOn: string;
  };
};

export const DEFAULT_INTEG: IntegrationsState = {
  discord: {
    webhook: '',
    enabled: true,
    events: { pending: true, approved: true, rejected: true },
    mention: '',
  },
  gcal: {
    calendarId: '',
    enabled: false,
    title: '[3Dプリント] {title}',
    duration: 20,
    syncOn: 'approved',
  },
};

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, v: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* ignore */
  }
}

export function loadPrefs() {
  return readJSON<{ selected?: string; actor?: string }>(K_PREFS, {});
}

export function savePrefs(p: { selected?: string; actor?: string }) {
  writeJSON(K_PREFS, { ...loadPrefs(), ...p });
}

export function loadIntegrations(): IntegrationsState {
  const s = readJSON<Partial<IntegrationsState> | null>(K_INTEG, null);
  if (!s) return JSON.parse(JSON.stringify(DEFAULT_INTEG)) as IntegrationsState;
  return {
    discord: {
      ...DEFAULT_INTEG.discord,
      ...(s.discord || {}),
      events: { ...DEFAULT_INTEG.discord.events, ...((s.discord || {}).events || {}) },
    },
    gcal: { ...DEFAULT_INTEG.gcal, ...(s.gcal || {}) },
  };
}

export function saveIntegrations(v: IntegrationsState) {
  writeJSON(K_INTEG, v);
}

export function loadLog(): AdminLogItem[] {
  return readJSON<AdminLogItem[]>(K_LOG, []);
}

export function saveLog(l: AdminLogItem[]) {
  writeJSON(K_LOG, l);
}

export function spanOfApp(a: Pick<AdminApplication, 'kind' | 'start' | 'end'>) {
  return spanOf(a);
}

export {
  WD,
  pad2,
  ymd,
  parseYmd,
  addDays,
  startOfDay,
  isWeekday,
  weekStart,
  mdLabel,
  minsLabel,
  durationLabel,
  whoLabel,
  KIND,
  STATUS,
  SLOT_COUNT,
  OCCUPYING,
  SHIFT_START,
  SHIFT_END,
};
