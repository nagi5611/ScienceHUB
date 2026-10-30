import React from 'react';
import type { AdminApplication, AdminMember } from '../admin-domain';
import {
  WD, pad2, ymd, parseYmd, addDays, startOfDay, isWeekday, weekStart, mdLabel, TODAY,
  dateLabel, dateLabelW, minsLabel, durationLabel, spanOfApp as spanOf, hrLabel, whoLabel, todayDate,
  memberName, planShiftRule, daySummary, pendingQueue, REJECT_REASONS, NOTE_TEMPLATES,
  loadIntegrations, saveIntegrations, DEFAULT_INTEG, loadLog, saveLog,
  type IntegrationsState, type AdminLogItem,
} from '../admin-domain';
import { KIND, STATUS, MACHINE_MAP, MACHINES } from '@shared/domain';

const LOGO = '/apps/3dprint-management/assets/icon-192.png';

const machineColor = id => (id === 'ke' ? 'var(--primary)' : 'var(--tip)');

function MDot({ id, size }) {
  return <span className="dot" style={{ background: machineColor(id), width: size, height: size }} />;
}

/* 依頼 / 予約 を一目で区別するバッジ */
function KindBadge({ kind, size }) {
  return (
    <span className={'kbadge ' + kind + (size === 'sm' ? ' sm' : '')}>
      <span className="kmark" />
      {KIND[kind]}
    </span>
  );
}

function Tag({ status }) {
  return <span className={'tag ' + status}>{STATUS[status]}</span>;
}

function Chip({ tone, children }) {
  return <span className={'chip' + (tone ? ' ' + tone : '')}>{children}</span>;
}

const KIND_TONE = {
  request: { text: 'var(--primary-dark)', bg: 'var(--primary-soft)', line: 'var(--primary-line)' },
  reserve: { text: 'var(--tip-ink)', bg: 'var(--tip-bg)', line: 'var(--tip-line)' },
};

function agoLabel(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  const base = startOfDay(todayDate());
  const diff = Math.round((base - startOfDay(d)) / 86400000);
  const hm = pad2(d.getHours()) + ':' + pad2(d.getMinutes());
  if (diff <= 0) return '今日 ' + hm;
  if (diff === 1) return '昨日 ' + hm;
  if (diff < 7) return diff + '日前';
  return (d.getMonth() + 1) + '/' + d.getDate();
}

function logTime(iso) {
  const d = new Date(iso);
  return pad2(d.getHours()) + ':' + pad2(d.getMinutes());
}

/* ── header ───────────────────────────────────────────── */
function Header({ actor, setActor, members, pendingCount, onOpenSettings, onCsv, narrow }) {
  return (
    <header className="ad-header">
      <div className="ad-header-in">
        <a className="brand" href="/">
          <img src={LOGO} alt="" />
          ScienceHUB
          <span className="sep" />
          <span className="crumb">3Dプリント管理</span>
        </a>
        <span className="adm-pill">管理者</span>
        <div className="hdr-right">
          <label className="actor">
            <span>操作者</span>
            <select value={actor} onChange={e => setActor(e.target.value)}>
              {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
            </select>
          </label>
          <button type="button" className="hdr-link" onClick={onCsv}>CSV出力</button>
          <a className="hdr-link" href="/apps/3dprint-reservation/" target="_top">申請フォーム</a>
          <button type="button" className="hdr-link hdr-settings" onClick={onOpenSettings}
            style={narrow ? undefined : { display: 'none' }}>
            設定
          </button>
          <span className="chip orange" style={{ fontSize: 10 }}>
            承認待ち <b className="num" style={{ marginLeft: 3 }}>{pendingCount}</b>
          </span>
        </div>
      </div>
    </header>
  );
}

/* ── 選択日のサマリ（稼働率ではなく件数） ── */
function DayStrip({ apps, date, staff, onOpenSettings }: { apps: AdminApplication[]; date: string; staff: string | null; onOpenSettings: () => void }) {
  const s = daySummary(apps, date);
  return (
    <div className="daystrip">
      <div className="ds-main">
        <span className="ds-date num">{dateLabel(date)}</span>
        <span className="ds-wd">{WD[parseYmd(date).getDay()]}</span>
        {date === TODAY && <Chip tone="orange">今日</Chip>}
      </div>
      <div className="ds-counts">
        <span className="ds-c req">
          <KindBadge kind="request" size="sm" />
          <b className="num">{s.requests.length}</b>
          <span className="ds-pend num">{s.requests.filter(a => a.status === 'pending').length ? `申請中 ${s.requests.filter(a => a.status === 'pending').length}` : ''}</span>
        </span>
        <span className="ds-c res">
          <KindBadge kind="reserve" size="sm" />
          <b className="num">{s.reserves.length}</b>
          <span className="ds-pend num">{s.reserves.filter(a => a.status === 'pending').length ? `申請中 ${s.reserves.filter(a => a.status === 'pending').length}` : ''}</span>
        </span>
        <span className="ds-c staff">
          担当
          <b>{staff || '休み'}</b>
        </span>
      </div>
      <button type="button" className="btn btn-secondary btn-sm ds-set" onClick={onOpenSettings}>
        シフト・メンバー
      </button>
    </div>
  );
}

/* ── カレンダー ───────────────────────────────────────── */
function occCounts(apps, ds) {
  const live = apps.filter(a => a.date === ds && a.status !== 'rejected');
  const c = { request: live.filter(a => a.kind === 'request').length, reserve: live.filter(a => a.kind === 'reserve').length };
  c.pending = live.filter(a => a.status === 'pending').length;
  c.total = c.request + c.reserve;
  return c;
}

function CalDay({ d, ds, counts, staff, selected, today, onPick }) {
  const wd = d.getDay();
  const cls = ['ad-day'];
  if (wd === 0) cls.push('sun');
  if (wd === 6) cls.push('sat');
  if (today) cls.push('today');
  if (selected) cls.push('sel');
  if (!staff) cls.push('closed');

  return (
    <button type="button" className={cls.join(' ')} onClick={() => onPick(ds)} aria-pressed={selected}
      aria-label={`${d.getMonth() + 1}月${d.getDate()}日 依頼${counts.request}件 予約${counts.reserve}件`}>
      <span className="d-top">
        <span className="d num">{d.getDate()}</span>
        {staff ? <span className="staff">{staff}</span> : <span className="staff none">休</span>}
      </span>

      <span className="c-kinds">
        <span className={'c-k req' + (counts.request ? '' : ' zero')}>
          <i />依頼 <b className="num">{counts.request}</b>
        </span>
        <span className={'c-k res' + (counts.reserve ? '' : ' zero')}>
          <i />予約 <b className="num">{counts.reserve}</b>
        </span>
      </span>

      {counts.pending > 0 && (
        <span className="c-pend">
          <span className="pend num">申請中 {counts.pending}</span>
        </span>
      )}
    </button>
  );
}

function CalAdmin({ apps, shifts, selected, onPick, members }: { apps: AdminApplication[]; shifts: Record<string, string | null>; selected: string; onPick: (d: string) => void; members: AdminMember[] }) {
  const first = weekStart(parseYmd(selected));
  const weeks = [];
  for (let i = 0; i < 4; i++) {
    const row = [];
    for (let j = 0; j < 7; j++) row.push(addDays(first, i * 7 + j));
    weeks.push(row);
  }
  const flat = weeks.flat();
  const lastDay = flat[flat.length - 1];
  const sameMonth = flat[0].getMonth() === lastDay.getMonth();
  const monthLabel = sameMonth
    ? `${flat[0].getFullYear()}年 ${pad2(flat[0].getMonth() + 1)}月`
    : `${pad2(flat[0].getMonth() + 1)}月 → ${pad2(lastDay.getMonth() + 1)}月`;

  const keys = flat.map(ymd);
  const rangeApps = apps.filter(a => keys.indexOf(a.date) >= 0 && a.status !== 'rejected');
  const req = rangeApps.filter(a => a.kind === 'request').length;
  const res = rangeApps.length - req;

  const step = n => onPick(ymd(addDays(parseYmd(selected), n * 28)));

  return (
    <div className="card cal-card">
      <div className="cal-head">
        <div>
          <div className="cal-month">
            <span>{monthLabel}</span>
            <small>4週表示</small>
          </div>
          <div className="cal-sub num">
            {mdLabel(flat[0])}〜{mdLabel(lastDay)} ／ 依頼 {req}件 ・ 予約 {res}件
          </div>
        </div>
        <div className="cal-nav">
          <button type="button" onClick={() => step(-1)} aria-label="前の4週間">‹</button>
          <button type="button" className="cal-today" onClick={() => onPick(TODAY)}>今日</button>
          <button type="button" onClick={() => step(1)} aria-label="次の4週間">›</button>
        </div>
      </div>

      <div className="cal-body">
        <div className="cal-wds">
          {WD.map((w, i) => (
            <div key={w} className={'cal-wd' + (i === 0 ? ' sun' : i === 6 ? ' sat' : '')}>{w}</div>
          ))}
        </div>
        <div className="cal-grid">
          {weeks.map(row => row.map(d => {
            const ds = ymd(d);
            return (
              <CalDay key={ds} d={d} ds={ds} counts={occCounts(apps, ds)} staff={shifts[ds] ? memberName(members, shifts[ds]) : null}
                selected={ds === selected} today={ds === TODAY} onPick={onPick} />
            );
          }))}
        </div>
      </div>
    </div>
  );
}

/* ── drawer ───────────────────────────────────────────── */
function Drawer({ open, title, sub, onClose, children, footer, wide, tabs }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <div className={'scrim' + (open ? ' on' : '')} onClick={onClose} aria-hidden="true" />
      <aside className={'sheet' + (open ? ' on' : '') + (wide ? ' wide' : '')} role="dialog" aria-modal="true" aria-label={title} aria-hidden={!open}>
        <div className="sheet-h">
          <div style={{ minWidth: 0 }}>
            <h2>{title}</h2>
            {sub && <p>{sub}</p>}
          </div>
          <button type="button" className="x" onClick={onClose} aria-label="閉じる">×</button>
        </div>
        {tabs}
        <div className="sheet-b">{open ? children : null}</div>
        {footer && <div className="sheet-f">{footer}</div>}
      </aside>
    </>
  );
}

function Toast({ toast }) {
  return (
    <div className={'toast' + (toast ? ' show' : '')} role="status" aria-live="polite">
      {toast && <>{toast.text}{toast.mark && <b>{toast.mark}</b>}</>}
    </div>
  );
}

/* 設定ダイアログ（広い画面で常設サイドバーが使えないときのフォールバック） */
function SettingsDialog({ open, onClose, children }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="dlg-wrap" role="dialog" aria-modal="true" aria-label="設定">
      <div className="dlg-scrim" onClick={onClose} />
      <div className="dlg">
        <div className="dlg-h">
          <div>
            <h2>設定</h2>
            <p>シフト・メンバー・外部連携</p>
          </div>
          <button type="button" className="x" onClick={onClose} aria-label="閉じる">×</button>
        </div>
        <div className="dlg-b">{children}</div>
      </div>
    </div>
  );
}

export { MDot, KindBadge, Tag, Chip, agoLabel, logTime, Header, DayStrip, occCounts, CalDay, CalAdmin, Drawer, Toast, SettingsDialog, LOGO, KIND_TONE };
