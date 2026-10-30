/* core.js — 日付・データ・保存まわり（React非依存） */

const MACHINES = [
  { id: 'ke', name: 'Ender-3 V3 KE', maker: 'Creality', short: 'KE', hint: '小物・精度重視' },
  { id: 'cc', name: 'Centauri Carbon', maker: 'ELEGOO', short: 'CC', hint: '大型・タイムラプス' },
];
const MACHINE_IDS = MACHINES.map(m => m.id);
const MACHINE_MAP = {};
MACHINES.forEach(m => { MACHINE_MAP[m.id] = m; });

const WD = ['日', '月', '火', '水', '木', '金', '土'];

/* タイムラインは 6:00〜20:00 を30分刻みで表示。受付は 16:30〜20:00 のみ */
const DAY_START = 6 * 60;
const DAY_END = 20 * 60;
const SLOT_MIN = 30;
const SLOT_COUNT = (DAY_END - DAY_START) / SLOT_MIN;   // 28
const ROW_H = 24;                                       // 1枠(30分)の高さ
const SHIFT_START = 16 * 60 + 30;                       // 990
const SHIFT_END = 20 * 60;                              // 1200
const SHIFT_SLOT_START = (SHIFT_START - DAY_START) / SLOT_MIN;  // 33
const SHIFT_SLOT_END = (SHIFT_END - DAY_START) / SLOT_MIN;      // 40
const SHIFT_SLOTS = SHIFT_SLOT_END - SHIFT_SLOT_START;          // 7

const STATUS = { pending: '申請中', approved: '確定', rejected: '却下', done: '完了' };
const OCCUPYING = { pending: 1, approved: 1, done: 1 };
const KIND = { request: '依頼', reserve: '予約' };
const STAFF = ['金田', '田村', '藤原'];

const STORAGE_KEY = 'sh3d.reservations.v3';
const PROFILE_KEY = 'sh3d.profile.v2';
const PREF_KEY = 'sh3d.prefs.v3';

/* ── date utils ── */
const pad2 = n => String(n).padStart(2, '0');
const ymd = d => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
const parseYmd = s => { const p = s.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); };
const addDays = (d, n) => { const x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; };
const startOfDay = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const isWeekday = d => { const w = d.getDay(); return w >= 1 && w <= 5; };
const hasShift = str => isWeekday(parseYmd(str));
const staffFor = str => STAFF[(parseYmd(str).getDate() - 1) % 3];
const weekStart = d => addDays(startOfDay(d), -d.getDay());   // 日曜始まり
const mdLabel = d => (d.getMonth() + 1) + '/' + d.getDate();

/* ── time utils ── */
const slotStart = i => DAY_START + i * SLOT_MIN;
const minsLabel = m => pad2(Math.floor(m / 60)) + ':' + pad2(m % 60);
const rangeLabel = (a, b) => minsLabel(slotStart(a)) + '〜' + minsLabel(slotStart(b) + SLOT_MIN);
const slotRangeLabel = (start, end) => minsLabel(start) + '〜' + minsLabel(end);
const durationLabel = mins => {
  const h = Math.floor(mins / 60), m = mins % 60;
  if (h && m) return h + '時間' + m + '分';
  if (h) return h + '時間';
  return m + '分';
};
const slotIndex = mins => Math.round((mins - DAY_START) / SLOT_MIN);
const inShiftSlot = i => i >= SHIFT_SLOT_START && i < SHIFT_SLOT_END;
/* 依頼は時間指定なし。16:30〜20:00 の受付枠を丸ごと占有する */
const spanOf = a => (a.kind === 'request'
  ? { start: SHIFT_START, end: SHIFT_END, s: SHIFT_SLOT_START, e: SHIFT_SLOT_END }
  : { start: a.start, end: a.end, s: slotIndex(a.start), e: slotIndex(a.end) });

/* 連続した範囲にブロックがあれば手前で止める */
function clampRange(anchor, idx, blocked) {
  const dir = idx >= anchor ? 1 : -1;
  let end = anchor;
  for (let i = anchor + dir; dir > 0 ? i <= idx : i >= idx; i += dir) {
    if (blocked(i)) break;
    end = i;
  }
  const lo = Math.min(anchor, end), hi = Math.max(anchor, end);
  return [Math.max(lo, 0), Math.min(hi, SLOT_COUNT - 1)];
}

/* ── その日の状況 ── */
function computeDay(apps, dateStr) {
  const list = apps.filter(a => a.date === dateStr && a.status !== 'rejected');
  const machines = {};
  MACHINE_IDS.forEach(id => {
    const blocked = new Array(SLOT_COUNT).fill(null);
    const items = list.filter(a => a.machine === id);
    items.forEach(a => {
      if (!OCCUPYING[a.status]) return;
      const sp = spanOf(a);
      const s = Math.max(0, sp.s);
      const e = Math.min(SLOT_COUNT, sp.e);
      for (let i = s; i < e; i++) blocked[i] = a;
    });
    machines[id] = {
      blocked,
      items,
      free: blocked.filter(x => !x).length,
      approved: items.filter(a => a.status === 'approved').length,
    };
  });
  return {
    shift: hasShift(dateStr),
    staff: staffFor(dateStr),
    list,
    machines,
    full: machines.ke.free === 0 && machines.cc.free === 0,
  };
}

function hasOverlap(apps, cand) {
  const c = spanOf(cand);
  return apps.some(a => {
    if (a.id === cand.id || a.date !== cand.date || a.machine !== cand.machine) return false;
    if (!OCCUPYING[a.status]) return false;
    const p = spanOf(a);
    return c.start < p.end && p.start < c.end;
  });
}

function findNextOpenDate(apps, fromStr) {
  const d = parseYmd(fromStr);
  for (let i = 1; i <= 70; i++) {
    const x = addDays(d, i);
    if (!isWeekday(x)) continue;
    const info = computeDay(apps, ymd(x));
    if (info.machines.ke.free > 0 || info.machines.cc.free > 0) return ymd(x);
  }
  return null;
}

/* ── seed ── */
function seedApps() {
  const today = startOfDay(new Date());
  const past = [], future = [];
  for (let i = 1; i <= 24; i++) {
    const a = addDays(today, -i); if (isWeekday(a)) past.push(ymd(a));
    const b = addDays(today, i); if (isWeekday(b)) future.push(ymd(b));
  }
  const todayStr = ymd(today);
  const d0 = isWeekday(today) ? todayStr : future.shift();
  const [d1, d2, d3] = future;

  const A = []; let n = 0;
  const add = o => A.push(Object.assign({
    id: 'seed-' + (++n), mine: false, file: '', note: '', createdAt: '',
  }, o));

  if (past[0]) {
    add({ date: past[0], machine: 'ke', start: 1020, end: 1110, kind: 'request', title: 'ギアボックスの試作', who: { name: '南野 湊', hr: '203', num: '12' }, status: 'done', file: '2-3_南野_gear.stl' });
    add({ date: past[0], machine: 'cc', start: 990, end: 1080, kind: 'reserve', title: '文化祭 看板パーツ', who: { name: '大西 玲', hr: '102', num: '7' }, status: 'done', note: '2時間で完了。反りなし。' });
  }
  if (past[1]) {
    add({ date: past[1], machine: 'ke', start: 1080, end: 1140, kind: 'request', title: '名札ケース', who: { name: '山下 遥', hr: '104', num: '21' }, status: 'rejected', note: 'STLの向きが逆でした。修正して再提出してください。' });
  }
  if (d0) {
    add({ date: d0, machine: 'ke', start: 1020, end: 1080, kind: 'reserve', title: 'スマホスタンド', who: { name: '南野 湊', hr: '203', num: '12' }, status: 'approved', file: '2-3_南野_stand.stl' });
    add({ date: d0, machine: 'cc', start: 1110, end: 1170, kind: 'reserve', title: 'ペン立て', who: { name: '大西 玲', hr: '102', num: '7' }, status: 'pending' });
    add({ date: d0, machine: 'ke', start: 540, end: 660, kind: 'reserve', title: '朝の試し刷り', who: { name: '山下 遥', hr: '104', num: '21' }, status: 'approved' });
  }
  if (d1) {
    add({ date: d1, machine: 'ke', start: 990, end: 1050, kind: 'request', title: 'ロボット部品 A', who: { name: '藤原 陸', hr: '201', num: '3' }, status: 'pending' });
    add({ date: d1, machine: 'cc', start: 1050, end: 1170, kind: 'request', title: 'ドラゴンのフィギュア', who: { name: '南野 湊', hr: '203', num: '12' }, status: 'approved', file: '2-3_南野_dragon.stl' });
    add({ date: d1, machine: 'ke', start: 900, end: 1020, kind: 'reserve', title: '文化祭 小物の量産', who: { name: '大西 玲', hr: '102', num: '7' }, status: 'pending' });
  }
  if (d2) {
    add({ date: d2, machine: 'ke', start: 990, end: 1200, kind: 'request', title: '部室の棚フック（連続印刷）', who: { name: '藤原 陸', hr: '201', num: '3' }, status: 'approved' });
    add({ date: d2, machine: 'cc', start: 990, end: 1020, kind: 'reserve', title: '試し刷り', who: { name: '大西 玲', hr: '102', num: '7' }, status: 'pending' });
  }
  if (d3) {
    add({ date: d3, machine: 'cc', start: 1020, end: 1140, kind: 'request', title: '文化祭 トロフィー', who: { name: '山下 遥', hr: '104', num: '21' }, status: 'pending' });
  }
  return A;
}

/* ── 学年HR（101〜309）── */
const HR_LIST = (() => {
  const out = [];
  for (let g = 1; g <= 3; g++) for (let c = 1; c <= 9; c++) out.push(String(g) + pad2(c));
  return out;
})();
const isValidHR = v => HR_LIST.indexOf(String(v)) >= 0;
const hrLabel = v => (isValidHR(v) ? String(v).slice(0, 1) + '年' + String(v).slice(1) + 'HR' : v || '—');
const whoLabel = (w, withNum) => {
  if (!w) return '';
  const hr = w.hr || w.grade;
  if (!hr) return w.name;
  return w.name + '（' + (withNum && w.num ? hr + '・' + w.num + '番' : hrLabel(hr)) + '）';
};

/* 依頼は前日まで。当日・過去日は不可（予約は当日も可） */
const todayStrOf = () => ymd(startOfDay(new Date()));
const requestAllowed = dateStr => dateStr < todayStrOf();
const isPastDate = dateStr => dateStr < todayStrOf();

/* ── storage ── */
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) { return fallback; }
}
function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}
function loadApps() {
  const saved = readJSON(STORAGE_KEY, null);
  if (!saved || !Array.isArray(saved) || !saved.length) return seedApps();
  return saved;
}
function saveApps(apps) { writeJSON(STORAGE_KEY, apps); }
function loadProfile() { return readJSON(PROFILE_KEY, { hr: '', num: '', name: '' }); }
function saveProfile(p) { writeJSON(PROFILE_KEY, p); }
function loadPrefs() { return readJSON(PREF_KEY, {}); }
function savePrefs(p) { writeJSON(PREF_KEY, Object.assign(loadPrefs(), p)); }

Object.assign(window, {
  MACHINES, MACHINE_IDS, MACHINE_MAP, WD, DAY_START, DAY_END, SLOT_MIN, SLOT_COUNT, ROW_H,
  SHIFT_START, SHIFT_END, SHIFT_SLOT_START, SHIFT_SLOT_END, SHIFT_SLOTS,
  STATUS, OCCUPYING, KIND, STAFF,
  pad2, ymd, parseYmd, addDays, startOfDay, isWeekday, hasShift, staffFor, weekStart, mdLabel,
  slotStart, minsLabel, rangeLabel, slotRangeLabel, durationLabel, slotIndex, inShiftSlot, spanOf, clampRange,
  HR_LIST, isValidHR, hrLabel, whoLabel, requestAllowed, isPastDate, todayStrOf,
  computeDay, hasOverlap, findNextOpenDate, seedApps,
  loadApps, saveApps, loadProfile, saveProfile, loadPrefs, savePrefs,
});
