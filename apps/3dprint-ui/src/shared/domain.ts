import type { Application, Kind, UiStatus } from './types';

export const MACHINES = [
  { id: 'ke' as const, name: 'Ender-3 V3 KE', maker: 'Creality', short: 'KE', hint: '小物・精度重視' },
  { id: 'cc' as const, name: 'Centauri Carbon', maker: 'ELEGOO', short: 'CC', hint: '大型・タイムラプス' },
];
export const MACHINE_IDS = MACHINES.map((m) => m.id);
export const MACHINE_MAP = Object.fromEntries(MACHINES.map((m) => [m.id, m])) as Record<
  'ke' | 'cc',
  (typeof MACHINES)[0]
>;

export const WD = ['日', '月', '火', '水', '木', '金', '土'];

export const DAY_START = 6 * 60;
export const DAY_END = 20 * 60;
export const SLOT_MIN = 30;
export const SLOT_COUNT = (DAY_END - DAY_START) / SLOT_MIN;
export const ROW_H = 24;
export const SHIFT_START = 16 * 60 + 30;
export const SHIFT_END = 20 * 60;
export const SHIFT_SLOT_START = (SHIFT_START - DAY_START) / SLOT_MIN;
export const SHIFT_SLOT_END = (SHIFT_END - DAY_START) / SLOT_MIN;
export const SHIFT_SLOTS = SHIFT_SLOT_END - SHIFT_SLOT_START;

export const STATUS: Record<UiStatus, string> = {
  pending: '申請中',
  approved: '確定',
  rejected: '却下',
  done: '完了',
};
export const OCCUPYING: Record<UiStatus, number> = { pending: 1, approved: 1, done: 1, rejected: 0 };
export const KIND: Record<Kind, string> = { request: '依頼', reserve: '予約' };

export const PROFILE_KEY = 'sh3d.profile.v2';
export const PREF_KEY = 'sh3d.prefs.v3';

export const pad2 = (n: number) => String(n).padStart(2, '0');
export const ymd = (d: Date) => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
export const parseYmd = (s: string) => {
  const p = s.split('-').map(Number);
  return new Date(p[0], p[1] - 1, p[2]);
};
export const addDays = (d: Date, n: number) => {
  const x = new Date(d.getTime());
  x.setDate(x.getDate() + n);
  return x;
};
export const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
export const isWeekday = (d: Date) => {
  const w = d.getDay();
  return w >= 1 && w <= 5;
};
export const hasShift = (str: string, staffDates?: Record<string, boolean>) => {
  if (staffDates && str in staffDates) return staffDates[str];
  return isWeekday(parseYmd(str));
};
export const staffFor = (str: string) => {
  const STAFF = ['金田', '田村', '藤原'];
  return STAFF[(parseYmd(str).getDate() - 1) % 3];
};
export const weekStart = (d: Date) => addDays(startOfDay(d), -d.getDay());
export const mdLabel = (d: Date) => d.getMonth() + 1 + '/' + d.getDate();

export const slotStart = (i: number) => DAY_START + i * SLOT_MIN;
export const minsLabel = (m: number) => pad2(Math.floor(m / 60)) + ':' + pad2(m % 60);
export const rangeLabel = (a: number, b: number) =>
  minsLabel(slotStart(a)) + '〜' + minsLabel(slotStart(b) + SLOT_MIN);
export const slotRangeLabel = (start: number, end: number) => minsLabel(start) + '〜' + minsLabel(end);
export const durationLabel = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return h + '時間' + m + '分';
  if (h) return h + '時間';
  return m + '分';
};
export const slotIndex = (mins: number) => Math.round((mins - DAY_START) / SLOT_MIN);
export const inShiftSlot = (i: number) => i >= SHIFT_SLOT_START && i < SHIFT_SLOT_END;

export const spanOf = (a: Pick<Application, 'kind' | 'start' | 'end'>) =>
  a.kind === 'request'
    ? { start: SHIFT_START, end: SHIFT_END, s: SHIFT_SLOT_START, e: SHIFT_SLOT_END }
    : { start: a.start, end: a.end, s: slotIndex(a.start), e: slotIndex(a.end) };

export function clampRange(anchor: number, idx: number, blocked: (i: number) => boolean): [number, number] {
  const dir = idx >= anchor ? 1 : -1;
  let end = anchor;
  for (let i = anchor + dir; dir > 0 ? i <= idx : i >= idx; i += dir) {
    if (blocked(i)) break;
    end = i;
  }
  const lo = Math.min(anchor, end);
  const hi = Math.max(anchor, end);
  return [Math.max(lo, 0), Math.min(hi, SLOT_COUNT - 1)];
}

export function computeDay(
  apps: Application[],
  dateStr: string,
  staffDates?: Record<string, boolean>
) {
  const list = apps.filter((a) => a.date === dateStr && a.status !== 'rejected');
  const machines: Record<
    'ke' | 'cc',
    { blocked: (Application | null)[]; items: Application[]; free: number; approved: number }
  > = {} as never;
  for (const id of MACHINE_IDS) {
    const blocked: (Application | null)[] = new Array(SLOT_COUNT).fill(null);
    const items = list.filter((a) => a.machine === id);
    for (const a of items) {
      if (!OCCUPYING[a.status]) continue;
      const sp = spanOf(a);
      const s = Math.max(0, sp.s);
      const e = Math.min(SLOT_COUNT, sp.e);
      for (let i = s; i < e; i++) blocked[i] = a;
    }
    machines[id] = {
      blocked,
      items,
      free: blocked.filter((x) => !x).length,
      approved: items.filter((a) => a.status === 'approved').length,
    };
  }
  return {
    shift: hasShift(dateStr, staffDates),
    staff: staffFor(dateStr),
    list,
    machines,
    full: machines.ke.free === 0 && machines.cc.free === 0,
  };
}

export function hasOverlap(apps: Application[], cand: Application) {
  const c = spanOf(cand);
  return apps.some((a) => {
    if (a.id === cand.id || a.date !== cand.date || a.machine !== cand.machine) return false;
    if (!OCCUPYING[a.status]) return false;
    const p = spanOf(a);
    return c.start < p.end && p.start < c.end;
  });
}

export function findNextOpenDate(apps: Application[], fromStr: string) {
  const d = parseYmd(fromStr);
  for (let i = 1; i <= 70; i++) {
    const x = addDays(d, i);
    if (!isWeekday(x)) continue;
    const info = computeDay(apps, ymd(x));
    if (info.machines.ke.free > 0 || info.machines.cc.free > 0) return ymd(x);
  }
  return null;
}

export const HR_LIST = (() => {
  const out: string[] = [];
  for (let g = 1; g <= 3; g++) for (let c = 1; c <= 9; c++) out.push(String(g) + pad2(c));
  return out;
})();
export const isValidHR = (v: string) => HR_LIST.indexOf(String(v)) >= 0;
export const hrLabel = (v: string) => (isValidHR(v) ? String(v).slice(0, 1) + '年' + String(v).slice(1) + 'HR' : v || '—');
export const whoLabel = (w: Who | undefined, withNum?: boolean) => {
  if (!w) return '';
  const hr = w.hr;
  if (!hr) return w.name;
  return w.name + '（' + (withNum && w.num ? hr + '・' + w.num + '番' : hrLabel(hr)) + '）';
};

type Who = Application['who'];

export const todayStrOf = () => ymd(startOfDay(new Date()));
export const requestAllowed = (dateStr: string) => dateStr > todayStrOf();
export const isPastDate = (dateStr: string) => dateStr < todayStrOf();
/** User restore eligibility: print date strictly after today (依頼・予約共通). */
export const canRestoreCancelledApplication = (dateStr: string, _kind?: Kind) => dateStr > todayStrOf();

export const restoreCancelledBlockedMessage = (kind: Kind) =>
  kind === 'request'
    ? '印刷日当日以降は取り消しを元に戻せません'
    : '過ぎた日（当日を含む）の申請は取り消しを元に戻せません';

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}
export function loadProfile() {
  return readJSON(PROFILE_KEY, { hr: '', num: '', name: '' });
}
export function saveProfile(p: { hr: string; num: string; name: string }) {
  writeJSON(PROFILE_KEY, p);
}
export function loadPrefs() {
  return readJSON<{ selected?: string }>(PREF_KEY, {});
}
export function savePrefs(p: Record<string, unknown>) {
  writeJSON(PREF_KEY, { ...loadPrefs(), ...p });
}
