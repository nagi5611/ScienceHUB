/* core.js — 管理コンソールのドメインロジック（React非依存） */

const MACHINES = [
  { id: 'ke', name: 'Ender-3 V3 KE', maker: 'Creality', short: 'KE', hint: '小物・精度重視' },
  { id: 'cc', name: 'Centauri Carbon', maker: 'ELEGOO', short: 'CC', hint: '大型・タイムラプス' },
];
const MACHINE_IDS = MACHINES.map(m => m.id);
const MACHINE_MAP = {};
MACHINES.forEach(m => { MACHINE_MAP[m.id] = m; });

const WD = ['日', '月', '火', '水', '木', '金', '土'];

const DAY_START = 360, DAY_END = 1200, SLOT_MIN = 30, SLOT_COUNT = 28;
const SHIFT_START = 990, SHIFT_END = 1200;
const SHIFT_SLOT_START = (SHIFT_START - DAY_START) / SLOT_MIN;   // 13
const SHIFT_SLOTS = 7;

const STATUS = { pending: '申請中', approved: '確定', rejected: '却下', done: '完了' };
const OCCUPYING = { pending: 1, approved: 1, done: 1 };
const KIND = { request: '依頼', reserve: '予約' };
const MACHINE_STATE = { running: '稼働中', stopped: '停止', maintenance: 'メンテ' };

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
  '印刷後に実寸を確認します。終わったら声をかけてください。',
];

/* ── date utils ── */
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

/* ── time utils ── */
const slotStart = i => DAY_START + i * SLOT_MIN;
const minsLabel = m => pad2(Math.floor(m / 60)) + ':' + pad2(m % 60);
const durationLabel = mins => {
  const h = Math.floor(mins / 60), m = mins % 60;
  if (h && m) return h + '時間' + m + '分';
  if (h) return h + '時間';
  return m + '分';
};
const slotIndex = mins => Math.round((mins - DAY_START) / SLOT_MIN);
/* 依頼は 16:30〜20:00 の受付枠を丸ごと占有 */
const spanOf = a => (a.kind === 'request'
  ? { start: SHIFT_START, end: SHIFT_END, s: SHIFT_SLOT_START, e: SHIFT_SLOT_START + SHIFT_SLOTS }
  : { start: a.start, end: a.end, s: slotIndex(a.start), e: slotIndex(a.end) });

const HR_LIST = (() => {
  const out = [];
  for (let g = 1; g <= 3; g++) for (let c = 1; c <= 9; c++) out.push(String(g) + pad2(c));
  return out;
})();
const hrLabel = v => (v ? String(v).slice(0, 1) + '年' + String(v).slice(1) + 'HR' : '—');
const whoLabel = (w, withNum) => {
  if (!w) return '';
  const hr = w.hr || '';
  if (!hr) return w.name;
  return w.name + '（' + (withNum && w.num ? hrLabel(hr) + '・' + w.num + '番' : hrLabel(hr)) + '）';
};

/* ── 担当者（メンバー）── */
const DEFAULT_MEMBERS = [
  { id: 'm1', name: '金田' },
  { id: 'm2', name: '田村' },
  { id: 'm3', name: '藤原' },
];
let MEMBERS = DEFAULT_MEMBERS.slice();
const setMembers = list => { MEMBERS = (list && list.length ? list : DEFAULT_MEMBERS).slice(); };
const getMembers = () => MEMBERS;
const memberById = id => MEMBERS.find(m => m.id === id) || null;
const memberName = id => (id ? (memberById(id) || {}).name || '—' : null);
const newMemberId = () => 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 4);

/* 指定日 → 担当者ID（シフト未設定なら平日のローテーション） */
let SHIFT_MAP = {};
const setShiftMap = m => { SHIFT_MAP = m || {}; };
function staffIdOn(ds) {
  if (SHIFT_MAP[ds] !== undefined) return SHIFT_MAP[ds];
  const d = parseYmd(ds);
  if (!isWeekday(d) || !MEMBERS.length) return null;
  return MEMBERS[(d.getDate() - 1) % MEMBERS.length].id;
}
function staffOn(ds) {
  const id = staffIdOn(ds);
  return id ? memberName(id) : null;
}

/* 140日ぶんの既定シフト＋保存値 */
function buildShifts(saved) {
  const out = {};
  const start = addDays(weekStart(todayDate()), -28);
  for (let i = 0; i < 140; i++) {
    const d = addDays(start, i);
    if (!isWeekday(d) || !MEMBERS.length) { out[ymd(d)] = null; continue; }
    out[ymd(d)] = MEMBERS[(d.getDate() - 1) % MEMBERS.length].id;
  }
  Object.keys(saved || {}).forEach(k => { out[k] = saved[k]; });
  return out;
}

/* 曜日×連続週の一括設定。from=起点の週（日曜始まり） */
function planShiftRule({ weekday, weeks, memberId, from, skipExisting }) {
  const base = weekStart(from ? parseYmd(from) : todayDate());
  const out = [];
  for (let i = 0; i < weeks; i++) {
    const first = addDays(base, i * 7);
    const d = addDays(first, weekday);
    const ds = ymd(d);
    if (skipExisting && SHIFT_MAP[ds]) continue;
    out.push({ date: ds, memberId });
  }
  return out;
}

/* メンバー削除時、その担当のシフトを外す */
function stripMember(shifts, memberId) {
  const next = { ...shifts };
  Object.keys(next).forEach(k => { if (next[k] === memberId) next[k] = null; });
  return next;
}

/* ── 署名データ（実運用に近い件数。同一機種で時間が重ならないように生成）── */
function seedApps() {
  const titles = ['スマホスタンド', 'ペン立て', 'ギアボックスの試作', 'ロボット部品 A', '文化祭 看板パーツ',
    'ドラゴンのフィギュア', '部室の棚フック', '名札ケース', '文化祭 トロフィー', '歯車の噛み合わせ試験',
    'ミニ四駆のボディ', 'アルミフレーム用ブラケット', '理科室の小物トレー', 'ロケット模型ノズル', '分光器の筐体'];
  const who = [
    { name: '南野 湊', hr: '203', num: '12' }, { name: '大西 玲', hr: '102', num: '7' },
    { name: '山下 遥', hr: '104', num: '21' }, { name: '藤原 陸', hr: '201', num: '3' },
    { name: '石川 栞', hr: '207', num: '18' }, { name: '三浦 悠真', hr: '305', num: '9' },
    { name: '岡田 千尋', hr: '302', num: '2' }, { name: '藤本 蒼', hr: '108', num: '24' },
    { name: '河野 凛', hr: '205', num: '15' }, { name: '山本 湊', hr: '106', num: '5' },
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
        if (past) status = (seq % 6 === 0) ? 'rejected' : 'done';
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
          rejectReason: status === 'rejected' ? 'stl' : null,
          adminNote: status === 'rejected' ? REJECT_REASONS[0].body : '',
          by: DEFAULT_MEMBERS[n % 3].name,
          createdAt: addDays(todayDate(), -((n * 2) % 7) - 1).toISOString().replace(/T.*/, 'T' + pad2(8 + (n % 9)) + ':' + pad2((n * 7) % 60) + ':00'),
        });
        dayIdx++;
      }
    });
  }
  return out;
}

/* ── 承認キュー ── */
function pendingQueue(apps) {
  return apps.filter(a => a.status === 'pending')
    .sort((a, b) => (a.date + pad2(Math.floor(spanOf(a).start / 60))).localeCompare(b.date + pad2(Math.floor(spanOf(b).start / 60))));
}
const isLate = a => a.kind === 'request' && a.date <= TODAY;

/* ── その日の状況 ── */
function dayOcc(apps, dateStr) {
  const list = apps.filter(a => a.date === dateStr && a.status !== 'rejected');
  const machines = {};
  MACHINE_IDS.forEach(id => {
    const slots = new Array(SLOT_COUNT).fill(null);
    list.filter(a => a.machine === id).forEach(a => {
      if (!OCCUPYING[a.status]) return;
      const sp = spanOf(a);
      for (let i = Math.max(0, sp.s); i < Math.min(SLOT_COUNT, sp.e); i++) slots[i] = a;
    });
    machines[id] = { slots, items: list.filter(a => a.machine === id) };
  });
  const p = list.filter(a => a.status === 'pending').length;
  return { list, machines, pending: p };
}

/* 1日のサマリ（件数と種別内訳） */
function daySummary(apps, ds) {
  const all = apps.filter(a => a.date === ds);
  const live = all.filter(a => a.status !== 'rejected');
  return {
    all,
    live,
    requests: live.filter(a => a.kind === 'request'),
    reserves: live.filter(a => a.kind === 'reserve'),
    pending: live.filter(a => a.status === 'pending').length,
  };
}

/* ── storage ── */
function readJSON(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; }
}
function writeJSON(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }

const K_APPS = 'sh3d.admin.apps.v2';
const K_PREFS = 'sh3d.admin.prefs.v2';
const K_MACH = 'sh3d.admin.machines.v2';
const K_SHIFT = 'sh3d.admin.shifts.v2';
const K_LOG = 'sh3d.admin.log.v2';
const K_MEMBERS = 'sh3d.admin.members.v2';
const K_INTEG = 'sh3d.admin.integrations.v2';

const loadApps = () => { const s = readJSON(K_APPS, null); return Array.isArray(s) && s.length ? s : seedApps(); };
const saveApps = a => writeJSON(K_APPS, a);
const loadPrefs = () => readJSON(K_PREFS, {});
const savePrefs = p => writeJSON(K_PREFS, Object.assign(loadPrefs(), p));

const loadMachines = () => readJSON(K_MACH, {
  ke: { state: 'running', job: '文化祭 看板パーツ', actor: '大西 玲', until: '19:10' },
  cc: { state: 'maintenance', job: 'ノズル清掃・ベッド水平出し', actor: '藤原', until: '17:30' },
});
const saveMachines = m => writeJSON(K_MACH, m);

const loadMembers = () => {
  const s = readJSON(K_MEMBERS, null);
  return Array.isArray(s) && s.length ? s : DEFAULT_MEMBERS.slice();
};
const saveMembers = m => writeJSON(K_MEMBERS, m);

const loadShifts = () => readJSON(K_SHIFT, null);
const saveShifts = s => writeJSON(K_SHIFT, s);

const loadLog = () => readJSON(K_LOG, [
  { id: 'l1', at: addDays(todayDate(), -1).toISOString().replace(/T.*/, 'T17:42:00'), actor: '金田', type: 'approve', text: '「文化祭 トロフィー」を確定', appId: null },
  { id: 'l2', at: addDays(todayDate(), -1).toISOString().replace(/T.*/, 'T17:12:00'), actor: '田村', type: 'reject', text: '「名札ケース」を却下（STLの不備）', appId: null },
  { id: 'l3', at: addDays(todayDate(), -1).toISOString().replace(/T.*/, 'T16:58:00'), actor: '藤原', type: 'machine', text: 'Centauri Carbon をメンテ中に変更', appId: null },
]);
const saveLog = l => writeJSON(K_LOG, l);

const DEFAULT_INTEG = {
  discord: { webhook: '', enabled: true, events: { pending: true, approved: true, rejected: true }, mention: '' },
  gcal: { calendarId: '', enabled: false, title: '[3Dプリント] {title}', duration: 20, syncOn: 'approved' },
};
const loadIntegrations = () => {
  const s = readJSON(K_INTEG, null);
  if (!s) return JSON.parse(JSON.stringify(DEFAULT_INTEG));
  return {
    discord: { ...DEFAULT_INTEG.discord, ...(s.discord || {}), events: { ...DEFAULT_INTEG.discord.events, ...((s.discord || {}).events || {}) } },
    gcal: { ...DEFAULT_INTEG.gcal, ...(s.gcal || {}) },
  };
};
const saveIntegrations = v => writeJSON(K_INTEG, v);

/* CSV 出力 */
function exportCSV(apps, fromStr, toStr) {
  const rows = apps
    .filter(a => a.date >= fromStr && a.date <= toStr)
    .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
  const head = ['日付', '曜日', '開始', '終了', '機種', '種別', '作品名', '申請者', '学年HR', '番号', '状態', '印刷データ', 'サイズ(MB)', '備考', '担当'];
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
      STATUS[a.status], a.file, a.fileSize ? (a.fileSize / 1048576).toFixed(2) : '', a.note, staffOn(a.date) || '',
    ].map(esc).join(','));
  });
  return '\uFEFF' + lines.join('\r\n');
}

Object.assign(window, {
  MACHINES, MACHINE_IDS, MACHINE_MAP, WD, DAY_START, DAY_END, SLOT_MIN, SLOT_COUNT,
  SHIFT_START, SHIFT_END, SHIFT_SLOT_START, SHIFT_SLOTS, STATUS, OCCUPYING, KIND,
  REJECT_REASONS, NOTE_TEMPLATES, MACHINE_STATE, HR_LIST,
  pad2, ymd, parseYmd, addDays, startOfDay, isWeekday, weekStart, mdLabel, TODAY, todayDate,
  dateLabel, dateLabelW, slotStart, minsLabel, durationLabel, slotIndex, spanOf, hrLabel, whoLabel,
  DEFAULT_MEMBERS, setMembers, getMembers, memberById, memberName, newMemberId,
  setShiftMap, staffIdOn, staffOn, buildShifts, planShiftRule, stripMember,
  seedApps, pendingQueue, isLate, dayOcc, daySummary, readJSON, writeJSON,
  loadApps, saveApps, loadPrefs, savePrefs, loadMachines, saveMachines, loadMembers, saveMembers,
  loadShifts, saveShifts, loadLog, saveLog, DEFAULT_INTEG, loadIntegrations, saveIntegrations, exportCSV,
});
