/* Auto-imported from 3dprint-package admin/core.js — design prototype domain */

const MACHINES = [
  { id: 'ke', name: 'Ender-3 V3 KE', maker: 'Creality', short: 'KE' },
  { id: 'cc', name: 'Centauri Carbon', maker: 'ELEGOO', short: 'CC' },
];
const MACHINE_IDS = MACHINES.map(m => m.id);
const MACHINE_MAP = {};
MACHINES.forEach(m => { MACHINE_MAP[m.id] = m; });

const WD = ['日', '月', '火', '水', '木', '金', '土'];

/* 受付 16:30〜20:00。30分刻みで7枠 */
const DAY_START = 360, DAY_END = 1200, SLOT_MIN = 30, SLOT_COUNT = 28;
const SHIFT_START = 990, SHIFT_END = 1200;
const SHIFT_SLOT_START = (SHIFT_START - DAY_START) / SLOT_MIN;  // 13
const SHIFT_SLOTS = 7;

const STATUS = { pending: '申請中', approved: '確定', done: '完了', cancelled: '取り消し' };
const KIND = { request: '依頼', reserve: '予約' };
const MACHINE_STATE = { running: '稼働中', stopped: '停止', maintenance: 'メンテ' };

const CANCEL_REASONS = [
  { id: 'machine', label: '機材の不調', body: 'プリンターの不調により、この時間帯の印刷を中止しました。' },
  { id: 'maintenance', label: 'メンテナンス', body: 'メンテナンスのため、この時間帯の受付を停止しました。' },
  { id: 'duplicate', label: '重複申請', body: '同じ時間帯に別の申請が確定しているため、こちらを取り消しました。' },
  { id: 'no_show', label: '連絡なしの未実施', body: '開始時刻を過ぎても実施が確認できなかったため取り消しました。' },
];
const REJECT_REASONS = [
  { id: 'stl', label: 'STLの不備', body: 'STLの形状に不備があり印刷できません。メッシュの穴・法線を確認して再提出してください。' },
  { id: 'size', label: 'サイズ超過', body: '造形サイズが機種のビルドボリュームを超えています。縮小または分割して再提出してください。' },
  { id: 'deadline', label: '締切超過', body: '印刷依頼の受付は前日までです。当日の依頼は受け付けられません。' },
  { id: 'time', label: '時間不足', body: 'この時間帯はすでに埋まっており、印刷時間を確保できません。別の日時に再申請してください。' },
];
const NOTE_TEMPLATES = [
  '16:20までに物理実験室へ来てください。',
  'フィラメントは白PLAを使用します。',
  'サポート材を付けています。剥がす作業もお願いします。',
];

/* ── date ── */
const pad2 = n => String(n).padStart(2, '0');
const ymd = d => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
const parseYmd = s => { const p = s.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); };
const addDays = (d, n) => { const x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; };
const startOfDay = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const isWeekday = d => { const w = d.getDay(); return w >= 1 && w <= 5; };
const weekStart = d => addDays(startOfDay(d), -d.getDay());
const mdLabel = d => (d.getMonth() + 1) + '/' + d.getDate();
const TODAY = ymd(startOfDay(new Date()));
const todayDate = () => parseYmd(TODAY);
const dateLabel = s => { const d = parseYmd(s); return (d.getMonth() + 1) + '/' + d.getDate(); };
const dateLabelW = s => { const d = parseYmd(s); return (d.getMonth() + 1) + '/' + d.getDate() + '（' + WD[d.getDay()] + '）'; };

/* ── time ── */
const slotStart = i => DAY_START + i * SLOT_MIN;
const minsLabel = m => pad2(Math.floor(m / 60)) + ':' + pad2(m % 60);
const durationLabel = mins => {
  const h = Math.floor(mins / 60), m = mins % 60;
  if (h && m) return h + '時間' + m + '分';
  if (h) return h + '時間';
  return m + '分';
};
const slotIndex = mins => Math.round((mins - DAY_START) / SLOT_MIN);
/* 依頼は 16:30〜20:00 の帯を丸ごと占有 */
const spanOf = a => (a.kind === 'request'
  ? { start: SHIFT_START, end: SHIFT_END, s: SHIFT_SLOT_START, e: SHIFT_SLOT_START + SHIFT_SLOTS }
  : { start: a.start, end: a.end, s: slotIndex(a.start), e: slotIndex(a.end) });

/* ── HR（101〜309）── */
const HR_LIST = (() => {
  const out = [];
  for (let g = 1; g <= 3; g++) for (let c = 1; c <= 9; c++) out.push(String(g) + '0' + c);
  return out;
})();
const hrLabel = v => (v ? String(v).slice(0, 1) + '年' + String(v).slice(1) + 'HR' : '—');

/* ── メンバー ── */
const MEMBER_COLORS = ['#f38020', '#3b74e0', '#1f9d55', '#9a4a07', '#7c5cbf', '#b4776b', '#2f8f8f'];
const DEFAULT_MEMBERS = [
  { id: 'm1', name: '金田', hr: '203', num: 12, discord: '', color: '#f38020' },
  { id: 'm2', name: '田村', hr: '201', num: 3, discord: '', color: '#3b74e0' },
  { id: 'm3', name: '藤原', hr: '104', num: 21, discord: '', color: '#1f9d55' },
];
let MEMBERS = DEFAULT_MEMBERS.slice();
const setMembers = list => { MEMBERS = (list && list.length ? list : DEFAULT_MEMBERS).slice(); };
const getMembers = () => MEMBERS;
const memberById = id => MEMBERS.find(m => m.id === id) || null;
const memberName = id => { const m = memberById(id); return m ? m.name : null; };
const memberColor = id => { const m = memberById(id); return m ? m.color : 'var(--color-text-faint)'; };
const memberLabel = id => { const m = memberById(id); return m ? `${m.name}（${hrLabel(m.hr)}・${m.num}番）` : '—'; };
const newMemberId = () => 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 4);
const nextColor = () => MEMBER_COLORS[MEMBERS.length % MEMBER_COLORS.length];

/* ── シフト（メンバーごとの稼働日集合）──
   availability = { [memberId]: 'YYYY-MM-DD'[] } */
let AVAIL = {};
const setAvailability = a => { AVAIL = a || {}; };
const getAvailability = () => AVAIL;
const isAvailable = (memberId, ds) => (AVAIL[memberId] || []).indexOf(ds) >= 0;
const staffIdsOn = ds => MEMBERS.filter(m => isAvailable(m.id, ds)).map(m => m.id);
const staffNamesOn = ds => staffIdsOn(ds).map(id => memberName(id));

/* 既定シフト（平日：日付からローテーション）。初回のみ使う */
function defaultAvailability(members, spanDays) {
  const out = {};
  members.forEach(m => { out[m.id] = []; });
  const base = addDays(weekStart(todayDate()), -14);
  for (let i = 0; i < (spanDays || 120); i++) {
    const d = addDays(base, i);
    if (!isWeekday(d) || !members.length) continue;
    const who = members[(d.getDate() - 1) % members.length];
    out[who.id].push(ymd(d));
  }
  return out;
}

/* 一括：曜日 × 週数 */
function planShiftRule({ weekday, weeks, startWeek, memberIds, mode, existing }) {
  const base = weekStart(todayDate());
  const out = [];
  for (let i = 0; i < weeks; i++) {
    const d = addDays(addDays(base, (startWeek + i) * 7), weekday);
    const ds = ymd(d);
    const past = ds < TODAY;
    const has = (existing || []).some(e => e.date === ds);
    out.push({ date: ds, d, past, has });
  }
  return out;
}

function toggleAvailability(avail, memberId, ds) {
  const cur = avail[memberId] || [];
  const next = cur.indexOf(ds) >= 0 ? cur.filter(x => x !== ds) : cur.concat(ds).sort();
  return { ...avail, [memberId]: next };
}
function setManyAvailability(avail, memberId, dates, on) {
  const cur = new Set(avail[memberId] || []);
  dates.forEach(ds => { if (on) cur.add(ds); else cur.delete(ds); });
  return { ...avail, [memberId]: [...cur].sort() };
}
function stripMemberAvailability(avail, memberId) {
  const next = { ...avail };
  delete next[memberId];
  return next;
}
/* あるメンバーの、4週間ぶんの稼働日 */
function memberDatesInRange(avail, memberId, from, to) {
  return (avail[memberId] || []).filter(ds => ds >= from && ds <= to);
}

/* ── 申請 ── */
function seedApps() {
  const titles = ['スマホスタンド', 'ペン立て', 'ギアボックスの試作', 'ロボット部品 A', '文化祭 看板パーツ',
    'ドラゴンのフィギュア', '部室の棚フック', '名札ケース', '文化祭 トロフィー', '歯車の噛み合わせ試験',
    'ミニ四駆のボディ', 'アルミフレーム用ブラケット', '理科室の小物トレー', 'ロケット模型ノズル', '分光器の筐体'];
  const who = [
    { name: '南野 湊', hr: '203', num: 12 }, { name: '大西 玲', hr: '102', num: 7 },
    { name: '山下 遥', hr: '104', num: 21 }, { name: '藤原 陸', hr: '201', num: 3 },
    { name: '石川 栞', hr: '207', num: 18 }, { name: '三浦 悠真', hr: '305', num: 9 },
    { name: '岡田 千尋', hr: '302', num: 2 }, { name: '藤本 蒼', hr: '108', num: 24 },
    { name: '河野 凛', hr: '205', num: 15 }, { name: '山本 湊', hr: '106', num: 5 },
  ];
  const notes = ['白のPLAで印刷したい', '反りやすいので向きの指定をお願いします', '文化祭の締切が近いので早めに確認したい',
    '', '', 'サポート多めでお願いします', ''];

  const out = [];
  let n = 0, seq = 0;
  for (let off = -9; off <= 12; off++) {
    const d = addDays(todayDate(), off);
    if (!isWeekday(d)) continue;
    const ds = ymd(d);
    const past = ds < TODAY;
    let dayIdx = 0;

    MACHINE_IDS.forEach((mid, mi) => {
      const want = off === 0 ? 2 : (Math.abs(off) % 3 === 0 ? 2 : 1);
      let cursor = SHIFT_START;
      for (let k = 0; k < want; k++) {
        const kind = ((Math.abs(off) + mi * 2 + k) % 4 === 0) ? 'request' : 'reserve';
        let start, end;
        if (kind === 'request') {
          if (cursor > SHIFT_START) break;
          start = SHIFT_START; end = SHIFT_END; cursor = SHIFT_END;
        } else {
          const dur = [60, 90, 30][(Math.abs(off) + k + mi) % 3];
          if (cursor + dur > SHIFT_END) break;
          start = cursor; end = cursor + dur; cursor += dur;
        }
        let status = 'pending';
        if (past) status = (seq % 7 === 0) ? 'cancelled' : 'done';
        else if (ds === TODAY) status = (dayIdx === 0) ? 'approved' : 'pending';
        else if (dayIdx === 0 && off < 4) status = 'approved';

        n++; seq++;
        const person = who[n % who.length];
        out.push({
          id: 'a' + n,
          date: ds, machine: mid, kind, start, end,
          title: titles[(n * 3) % titles.length],
          file: kind === 'request' ? '2-3_' + person.name.split(' ')[0] + '_' + n + '.stl' : '',
          fileSize: 380000 + (n * 137277) % 8600000,
          note: notes[n % notes.length],
          who: person,
          status,
          cancelReason: status === 'cancelled' ? 'machine' : null,
          adminNote: status === 'cancelled' ? CANCEL_REASONS[0].body : '',
          by: DEFAULT_MEMBERS[n % 3].name,
          createdAt: addDays(todayDate(), -((n * 2) % 7) - 1).toISOString().replace(/T.*/, 'T' + pad2(8 + (n % 9)) + ':' + pad2((n * 7) % 60) + ':00'),
        });
        dayIdx++;
      }
    });
  }
  return out;
}

const pendingQueue = apps => apps.filter(a => a.status === 'pending')
  .sort((a, b) => (a.date + pad2(Math.floor(spanOf(a).start / 60))).localeCompare(b.date + pad2(Math.floor(spanOf(b).start / 60))));
const isLate = a => a.kind === 'request' && a.date <= TODAY;
const activeStatus = s => s === 'pending' || s === 'approved';

/* その日の占有（機種ごと 28枠） */
function dayOcc(apps, ds) {
  const list = apps.filter(a => a.date === ds);
  const machines = {};
  MACHINE_IDS.forEach(id => {
    const slots = new Array(SLOT_COUNT).fill(null);
    list.filter(a => a.machine === id && activeStatus(a.status)).forEach(a => {
      const sp = spanOf(a);
      for (let i = Math.max(0, sp.s); i < Math.min(SLOT_COUNT, sp.e); i++) slots[i] = a;
    });
    machines[id] = slots;
  });
  return { list, machines };
}
function daySummary(apps, ds) {
  const all = apps.filter(a => a.date === ds);
  const live = all.filter(a => a.status !== 'cancelled');
  return {
    all, live,
    requests: live.filter(a => a.kind === 'request'),
    reserves: live.filter(a => a.kind === 'reserve'),
    pending: live.filter(a => a.status === 'pending').length,
    cancelled: all.filter(a => a.status === 'cancelled'),
  };
}

/* ── 別の日への変更 ──
   依頼は 16:30〜20:00 の帯、予約は同じ時刻帯を移動先でも使う。
   「空き」だけでなく、担当なし・埋まりも強制変更できるように情報だけ返す。 */
function moveCheck(apps, app, ds, selfId) {
  const sp = spanOf(app);
  const occ = dayOcc(apps, ds);
  const slots = occ.machines[app.machine];
  let used = 0;
  for (let i = sp.s; i < sp.e; i++) {
    const hit = slots[i];
    if (hit && hit.id !== (selfId || app.id)) used++;
  }
  const total = sp.e - sp.s;
  const staffs = staffIdsOn(ds);
  return {
    date: ds,
    total,
    used,
    free: total - used,
    full: used >= total,
    staffs,
    noStaff: staffs.length === 0,
    past: ds < TODAY,
    sameDay: ds === app.date,
    liveCount: occ.list.filter(a => a.status !== 'cancelled').length,
  };
}

/* 申請の日付を移動（時刻はそのまま） */
function moveAppTo(app, ds) {
  return { ...app, date: ds };
}

/* 移動候補の月を組み立てる（月表示・日曜始まり） */
function monthGrid(y, m) {
  const first = new Date(y, m - 1, 1);
  const lead = first.getDay();
  const last = new Date(y, m, 0).getDate();
  const out = [];
  for (let i = 0; i < lead; i++) out.push(null);
  for (let d = 1; d <= last; d++) out.push(new Date(y, m - 1, d));
  while (out.length % 7 !== 0) out.push(null);
  return out;
}

/* ── 時間単位の操作 ──
   slots: その申請が占める 30分枠の番号配列（spanOf の s..e-1） */
function slotListOf(app) {
  const sp = spanOf(app);
  const out = [];
  for (let i = sp.s; i < sp.e; i++) out.push(i);
  return out;
}

/* 選んだ枠を取り除いた申請（前後で分割）。
   何も残らない場合は空配列（＝全取り消し）。 */
function splitOffSlots(app, removeSlots) {
  const all = slotListOf(app);
  const keep = all.filter(i => removeSlots.indexOf(i) < 0);
  if (!keep.length) return [];
  const groups = [];
  keep.forEach(i => {
    const g = groups[groups.length - 1];
    if (g && g[g.length - 1] + 1 === i) g.push(i);
    else groups.push([i]);
  });
  return groups.map((g, idx) => ({
    ...app,
    id: idx === 0 ? app.id : app.id + '-s' + Date.now().toString(36) + idx,
    start: slotStart(g[0]),
    end: slotStart(g[g.length - 1]) + SLOT_MIN,
  }));
}

/* 選んだ枠だけを別ステータスにした申請群（確定・取り消しの部分適用） */
function splitWithStatus(app, targetSlots, status, extra) {
  const all = slotListOf(app);
  const hit = all.filter(i => targetSlots.indexOf(i) >= 0);
  const rest = all.filter(i => targetSlots.indexOf(i) < 0);
  if (!hit.length) return [app];
  const build = (list, st, isNew) => {
    if (!list.length) return null;
    const groups = [];
    list.forEach(i => {
      const g = groups[groups.length - 1];
      if (g && g[g.length - 1] + 1 === i) g.push(i);
      else groups.push([i]);
    });
    return groups.map((g, idx) => ({
      ...app,
      id: isNew ? app.id + '-n' + Date.now().toString(36) + idx : (idx === 0 ? app.id : app.id + '-p' + Date.now().toString(36) + idx),
      start: slotStart(g[0]),
      end: slotStart(g[g.length - 1]) + SLOT_MIN,
      status: st,
      ...(extra || {}),
    }));
  };
  const out = [];
  const a = build(hit, status, true); if (a) out.push(...a);
  const b = build(rest, app.status, false); if (b) out.push(...b);
  return out;
}

/* ── storage ── */
function readJSON(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; }
}
function writeJSON(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }

const K = {
  apps: 'sh3dm.apps.v1',
  members: 'sh3dm.members.v1',
  avail: 'sh3dm.availability.v1',
  prefs: 'sh3dm.prefs.v1',
  log: 'sh3dm.log.v1',
  integ: 'sh3dm.integrations.v1',
  printers: 'sh3dm.printers.v1',
};

const loadApps = () => { const s = readJSON(K.apps, null); return Array.isArray(s) && s.length ? s : seedApps(); };
const saveApps = v => writeJSON(K.apps, v);
const loadMembers = () => { const s = readJSON(K.members, null); return Array.isArray(s) && s.length ? s : DEFAULT_MEMBERS.slice(); };
const saveMembers = v => writeJSON(K.members, v);
const loadAvail = members => {
  const s = readJSON(K.avail, null);
  if (s && typeof s === 'object' && Object.keys(s).length) return s;
  return defaultAvailability(members);
};
const saveAvail = v => writeJSON(K.avail, v);
const loadPrefs = () => readJSON(K.prefs, {});
const savePrefs = p => writeJSON(K.prefs, Object.assign(loadPrefs(), p));
const loadLog = () => readJSON(K.log, []);
const saveLog = v => writeJSON(K.log, v);

const DEFAULT_INTEG = {
  discord: { webhook: '', enabled: true, events: { pending: true, approved: true, cancelled: true }, dailyMention: true },
  gcal: { calendarId: '', enabled: false, title: '[3Dプリント] {title}', duration: 20, syncOn: 'approved' },
};
const loadIntegrations = () => {
  const s = readJSON(K.integ, null);
  if (!s) return JSON.parse(JSON.stringify(DEFAULT_INTEG));
  return {
    discord: { ...DEFAULT_INTEG.discord, ...(s.discord || {}), events: { ...DEFAULT_INTEG.discord.events, ...((s.discord || {}).events || {}) } },
    gcal: { ...DEFAULT_INTEG.gcal, ...(s.gcal || {}) },
  };
};
const saveIntegrations = v => writeJSON(K.integ, v);

const DEFAULT_PRINTERS = {
  ke: { state: 'running', job: '文化祭 看板パーツ', actor: '大西 玲', until: '19:10' },
  cc: { state: 'maintenance', job: 'ノズル清掃・ベッド水平出し', actor: '藤原', until: '17:30' },
};
const loadPrinters = () => Object.assign({}, DEFAULT_PRINTERS, readJSON(K.printers, {}));
const savePrinters = v => writeJSON(K.printers, v);

/* ── CSV ── */
function exportCSV(apps, fromStr, toStr, members) {
  const rows = apps.filter(a => a.date >= fromStr && a.date <= toStr)
    .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
  const head = ['日付', '曜日', '開始', '終了', '機種', '種別', '作品名', '申請者', 'HR', '番号', '状態', '印刷データ', 'サイズ(MB)', '備考', '担当'];
  const esc = v => {
    const s = String(v == null ? '' : v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const lines = [head.join(',')];
  rows.forEach(a => {
    const sp = spanOf(a);
    const d = parseYmd(a.date);
    lines.push([
      a.date, WD[d.getDay()], minsLabel(sp.start), minsLabel(sp.end),
      MACHINE_MAP[a.machine].name, KIND[a.kind], a.title, a.who.name, a.who.hr, a.who.num,
      STATUS[a.status], a.file, a.fileSize ? (a.fileSize / 1048576).toFixed(2) : '', a.note,
      staffNamesOn(a.date).join(' / '),
    ].map(esc).join(','));
  });
  return '\uFEFF' + lines.join('\r\n');
}

export {
  MACHINES,
  MACHINE_IDS,
  MACHINE_MAP,
  WD,
  DAY_START,
  DAY_END,
  SLOT_MIN,
  SLOT_COUNT,
  SHIFT_START,
  SHIFT_END,
  SHIFT_SLOT_START,
  SHIFT_SLOTS,
  STATUS,
  KIND,
  MACHINE_STATE,
  CANCEL_REASONS,
  REJECT_REASONS,
  NOTE_TEMPLATES,
  HR_LIST,
  MEMBER_COLORS,
  pad2,
  ymd,
  parseYmd,
  addDays,
  startOfDay,
  isWeekday,
  weekStart,
  mdLabel,
  TODAY,
  todayDate,
  dateLabel,
  dateLabelW,
  slotStart,
  minsLabel,
  durationLabel,
  slotIndex,
  spanOf,
  hrLabel,
  DEFAULT_MEMBERS,
  setMembers,
  getMembers,
  memberById,
  memberName,
  memberColor,
  memberLabel,
  newMemberId,
  nextColor,
  setAvailability,
  getAvailability,
  isAvailable,
  staffIdsOn,
  staffNamesOn,
  defaultAvailability,
  planShiftRule,
  toggleAvailability,
  setManyAvailability,
  stripMemberAvailability,
  memberDatesInRange,
  seedApps,
  pendingQueue,
  isLate,
  activeStatus,
  dayOcc,
  daySummary,
  moveCheck,
  moveAppTo,
  monthGrid,
  readJSON,
  writeJSON,
  K,
  loadApps,
  saveApps,
  loadMembers,
  saveMembers,
  loadAvail,
  saveAvail,
  loadPrefs,
  savePrefs,
  loadLog,
  saveLog,
  DEFAULT_INTEG,
  loadIntegrations,
  saveIntegrations,
  loadPrinters,
  savePrinters,
  exportCSV,
  slotListOf,
  splitOffSlots,
  splitWithStatus,
  DEFAULT_PRINTERS,
};
