import React from 'react';
import {
  WD, pad2, ymd, parseYmd, addDays, startOfDay, isWeekday, weekStart, mdLabel, TODAY, todayDate,
  dateLabel, dateLabelW, slotStart, minsLabel, durationLabel, slotIndex, spanOf, hrLabel,
  DAY_START, DAY_END, SLOT_MIN, SLOT_COUNT, SHIFT_START, SHIFT_END, SHIFT_SLOT_START, SHIFT_SLOTS,
  STATUS, KIND, MACHINE_STATE, MACHINE_IDS, MACHINE_MAP, MACHINES,
  CANCEL_REASONS, REJECT_REASONS, NOTE_TEMPLATES, HR_LIST, MEMBER_COLORS,
  setMembers, getMembers, memberById, memberName, memberColor, memberLabel, newMemberId, nextColor,
  setAvailability, getAvailability, isAvailable, staffIdsOn, staffNamesOn, defaultAvailability,
  planShiftRule, toggleAvailability, setManyAvailability, stripMemberAvailability, memberDatesInRange,
  seedApps, pendingQueue, isLate, activeStatus, dayOcc, daySummary,
  moveCheck, moveAppTo, monthGrid,
  readJSON, writeJSON, K, loadApps, saveApps, loadMembers, saveMembers, loadAvail, saveAvail,
  loadPrefs, savePrefs, loadLog, saveLog, DEFAULT_INTEG, loadIntegrations, saveIntegrations,
  loadPrinters, savePrinters, exportCSV,
  slotListOf, splitOffSlots, splitWithStatus,
} from '../admin-design-domain';;
import { useCalPeriodNav } from '../../hooks/useCalPeriodNav';

const LOGO = '/apps/3dprint-management/assets/icon-192.png';

const machineColor = id => (id === 'ke' ? 'var(--color-primary)' : 'var(--color-tip)');

function MDot({ id, size }) {
  return <span className="dot" style={{ background: machineColor(id), width: size || 6, height: size || 6 }} />;
}

/* 依頼 / 予約 */
function KindBadge({ kind, size }) {
  return (
    <span className={'kbadge ' + kind + (size === 'sm' ? ' sm' : '')}>
      <span className="kmark" />
      {KIND[kind]}
    </span>
  );
}

/* ダウンロード記号（DSはアイコンを使わない方針だが、DLは矢印文字で代替） */
function DLIcon() {
  return <span aria-hidden="true" className="dlic">↓</span>;
}

/* 申請1件をテキストファイルとして保存 */
function downloadAppFile(app, mode) {
  const sp = spanOf(app);
  if (mode === 'file') {
    const name = app.file || `${app.title}.stl`;
    const body = [
      'ScienceHUB 3Dプリント — 印刷データ',
      '',
      `ファイル名: ${name}`,
      `作品名: ${app.title}`,
      `申請者: ${app.who.name}（${hrLabel(app.who.hr)}・${app.who.num}番）`,
      `機種: ${MACHINE_MAP[app.machine].name}`,
      `種別: ${KIND[app.kind]}`,
      `日付: ${app.date}`,
      `時間: ${minsLabel(sp.start)}〜${minsLabel(sp.end)}`,
      `サイズ: ${app.fileSize ? (app.fileSize / 1048576).toFixed(2) + ' MB' : '—'}`,
      '',
      '※ このファイルはデザイン確認用のプレースホルダです。本番では署名付きURLから取得します。',
    ].join('\r\n');
    saveText(name.replace(/\.[^.]+$/, '') + '.txt', body);
    return;
  }
  const lines = [
    'ScienceHUB 3Dプリント 申請書',
    '=============================',
    `作品名      : ${app.title}`,
    `日付        : ${app.date}（${WD[parseYmd(app.date).getDay()]}）`,
    `時間        : ${minsLabel(sp.start)}〜${minsLabel(sp.end)}（${durationLabel(sp.end - sp.start)}）`,
    `機種        : ${MACHINE_MAP[app.machine].name}（${MACHINE_MAP[app.machine].maker}）`,
    `種別        : ${KIND[app.kind]}${app.kind === 'request' ? '（依頼枠を丸ごと占有）' : '（データ提出なし）'}`,
    `状態        : ${STATUS[app.status]}`,
    `担当        : ${staffNamesOn(app.date).join(' / ') || '休み'}`,
    `申請者      : ${app.who.name}（${hrLabel(app.who.hr)}・${app.who.num}番）`,
    `印刷データ  : ${app.file || '—'}${app.fileSize ? '（' + (app.fileSize / 1048576).toFixed(2) + ' MB）' : ''}`,
    `備考        : ${app.note || '—'}`,
    `担当者メモ  : ${app.adminNote || '—'}`,
    '',
    '出力: ScienceHUB 3Dプリント管理',
  ];
  const fname = `${app.date}_${app.title.split(/[\\/:*?"<>|]/).join('_')}.txt`;
  saveText(fname, lines.join('\r\n'));
}

function saveText(filename, text) {
  const blob = new Blob(['\uFEFF' + text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* その日の申請をすべてまとめて1ファイルに */
function downloadDay(apps, ds) {
  const rows = apps.filter(a => a.date === ds)
    .sort((a, b) => spanOf(a).start - spanOf(b).start || MACHINE_IDS.indexOf(a.machine) - MACHINE_IDS.indexOf(b.machine));
  const staff = staffNamesOn(ds).join(' / ') || '休み';
  const lines = [
    `ScienceHUB 3Dプリント 申請一覧 — ${ds}（${WD[parseYmd(ds).getDay()]}）`,
    `担当: ${staff}`,
    `件数: ${rows.length}`,
    '='.repeat(48),
  ];
  rows.forEach((a, i) => {
    const sp = spanOf(a);
    lines.push(
      '',
      `[${i + 1}] ${a.title}`,
      `  時間   : ${minsLabel(sp.start)}〜${minsLabel(sp.end)}（${durationLabel(sp.end - sp.start)}）`,
      `  機種   : ${MACHINE_MAP[a.machine].name}`,
      `  種別   : ${KIND[a.kind]}`,
      `  状態   : ${STATUS[a.status]}`,
      `  申請者 : ${a.who.name}（${hrLabel(a.who.hr)}・${a.who.num}番）`,
      `  データ : ${a.file || '—'}`,
      `  備考   : ${a.note || '—'}`,
    );
  });
  saveText(`${ds}_申請一覧.txt`, lines.join('\r\n'));
  return rows.length;
}

function Tag({ status }) {
  return <span className={'tag ' + status}>{STATUS[status]}</span>;
}

function Chip({ tone, children }) {
  return <span className={'chip' + (tone ? ' ' + tone : '')}>{children}</span>;
}

/* メンバーの丸アバター＋名前 */
function MemberTag({ id, small }) {
  const m = memberById(id);
  if (!m) return <span className="mtag none">休み</span>;
  return (
    <span className={'mtag' + (small ? ' sm' : '')}>
      <span className="mtag-av" style={{ background: m.color }}>{m.name.slice(0, 1)}</span>
      {m.name}
    </span>
  );
}

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
const logTime = iso => { const d = new Date(iso); return pad2(d.getHours()) + ':' + pad2(d.getMinutes()); };

/* ── ヘッダー ── */
function Header({ screen, setScreen, operatorSession, pendingCount, onCsv }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="/">
          <img src={LOGO} alt="" />
          ScienceHUB
          <span className="sep" />
          <span className="crumb">3Dプリント管理</span>
        </a>
        <span className="adm-pill">管理者</span>

        <nav className="screens" aria-label="画面">
          <button type="button" aria-current={screen === 'reserve' ? 'page' : undefined}
            className={screen === 'reserve' ? 'on' : ''} onClick={() => setScreen('reserve')}>
            申請の管理
            {pendingCount > 0 && <span className="nav-count num">{pendingCount}</span>}
          </button>
          <button type="button" aria-current={screen === 'settings' ? 'page' : undefined}
            className={screen === 'settings' ? 'on' : ''} onClick={() => setScreen('settings')}>
            シフト・設定
          </button>
          <button type="button" aria-current={screen === 'ops' ? 'page' : undefined}
            className={screen === 'ops' ? 'on' : ''} onClick={() => setScreen('ops')}>
            運用
          </button>
        </nav>

        <div className="hdr-right">
          <div className="actor actor-readonly" title={operatorSession?.user.username ?? ''}>
            <span>ログイン</span>
            <strong>{operatorSession?.user.display_name ?? '—'}</strong>
            {operatorSession?.linked_member ? (
              <span className="actor-staff">／印刷担当 {operatorSession.linked_member.name}</span>
            ) : (
              <span className="actor-staff actor-staff-warn">／印刷担当未紐づけ</span>
            )}
          </div>
          {screen === 'reserve' && <button type="button" className="hdr-link" onClick={onCsv}>CSV出力</button>}
          <a className="hdr-link" href="/apps/3dprint-reservation/">申請フォーム</a>
        </div>
      </div>
    </header>
  );
}

/* ── カレンダー（月表示） ── */
function dayHint(apps, ds) {
  const s = daySummary(apps, ds);
  return { req: s.requests.length, res: s.reserves.length, pending: s.pending };
}

function CalDay({ d, ds, apps, staffIds, selected, onPick, dense }) {
  const wd = d.getDay();
  const h = dayHint(apps, ds);
  const cls = ['day'];
  if (wd === 0) cls.push('sun');
  if (wd === 6) cls.push('sat');
  if (ds === TODAY) cls.push('today');
  if (ds === selected) cls.push('sel');
  if (!staffIds.length) cls.push('closed');

  return (
    <button type="button" className={cls.join(' ')} onClick={() => onPick(ds)} aria-pressed={ds === selected}
      aria-label={`${d.getMonth() + 1}月${d.getDate()}日 依頼${h.req}件 予約${h.res}件 ${staffIds.length ? '担当あり' : '担当なし'}`}>
      <span className="d-top">
        <span className="d num">{d.getDate()}</span>
        <span className={'d-staffflag' + (staffIds.length ? ' on' : '')}>
          {staffIds.length ? '担当あり' : '休み'}
        </span>
      </span>

      <span className="c-kinds">
        <span className={'c-k req' + (h.req ? '' : ' zero')}><i />依頼<b className="num">{h.req}</b></span>
        <span className={'c-k res' + (h.res ? '' : ' zero')}><i />予約<b className="num">{h.res}</b></span>
      </span>

      <span className="c-pend">
        {h.pending > 0 ? <span className="pend num">申請中 {h.pending}</span> : null}
      </span>
    </button>
  );
}

function Calendar({ apps, avail, selected, onPick }) {
  const { run, enterClass } = useCalPeriodNav();
  const anchor = parseYmd(selected);
  const year = anchor.getFullYear();
  const month = anchor.getMonth() + 1;
  const periodKey = `${year}-${pad2(month)}`;
  const monthLabel = `${year}年 ${pad2(month)}月`;
  const cells = monthGrid(year, month);

  const stepMonth = (delta: number) => {
    run(delta, () => {
      const target = new Date(year, month - 1 + delta, 1);
      const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
      const day = Math.min(anchor.getDate(), lastDay);
      onPick(ymd(new Date(target.getFullYear(), target.getMonth(), day)));
    });
  };

  return (
    <div className="card cal-card">
      <div className="cal-head">
        <div className={enterClass} key={`label-${periodKey}`}>
          <div className="cal-month">
            <span>{monthLabel}</span>
          </div>
        </div>
        <div className="cal-nav">
          <button type="button" className="cal-today" onClick={() => onPick(TODAY)}>今日</button>
        </div>
      </div>

      <div className="cal-body">
        <button type="button" className="cal-side prev" onClick={() => stepMonth(-1)} aria-label="前の月">
          <span aria-hidden="true">‹</span>
          <span className="cal-side-lbl">前へ</span>
        </button>

        <div className="cal-main">
          <div className="cal-period-shell">
            <div className={enterClass} key={periodKey}>
              <div className="cal-wds">
                {WD.map((w, i) => (
                  <div key={w} className={'cal-wd' + (i === 0 ? ' sun' : i === 6 ? ' sat' : '')}>{w}</div>
                ))}
              </div>
              <div className="cal-grid cal-grid-month">
                {cells.map((d, i) => {
                  if (!d) {
                    return <span key={`pad-${periodKey}-${i}`} className="day pad" aria-hidden="true" />;
                  }
                  const ds = ymd(d);
                  return (
                    <CalDay key={ds} d={d} ds={ds} apps={apps} staffIds={staffIdsOn(ds)}
                      selected={ds === selected} onPick={onPick} />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <button type="button" className="cal-side next" onClick={() => stepMonth(1)} aria-label="次の月">
          <span aria-hidden="true">›</span>
          <span className="cal-side-lbl">次へ</span>
        </button>
      </div>
    </div>
  );
}

/* ── ドロワー / ダイアログ ── */
function Drawer({ open, title, sub, onClose, children, footer }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <div className={'scrim' + (open ? ' on' : '')} onClick={onClose} aria-hidden="true" />
      <aside className={'sheet' + (open ? ' on' : '')} role="dialog" aria-modal="true" aria-label={title} aria-hidden={!open}>
        <div className="sheet-h">
          <div style={{ minWidth: 0 }}>
            <h2>{title}</h2>
            {sub && <p>{sub}</p>}
          </div>
          <button type="button" className="x" onClick={onClose} aria-label="閉じる">×</button>
        </div>
        <div className="sheet-b">{open ? children : null}</div>
        {footer && <div className="sheet-f">{footer}</div>}
      </aside>
    </>
  );
}

function Modal({ open, title, sub, onClose, children, footer, wide }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-wrap" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-scrim" onClick={onClose} />
      <div className={'modal' + (wide ? ' wide' : '')}>
        <div className="modal-h">
          <div>
            <h2>{title}</h2>
            {sub && <p>{sub}</p>}
          </div>
          <button type="button" className="x" onClick={onClose} aria-label="閉じる">×</button>
        </div>
        <div className="modal-b">{children}</div>
        {footer && <div className="modal-f">{footer}</div>}
      </div>
    </div>
  );
}

function Toast({ toast }) {
  return (
    <div className={'toast' + (toast ? ' show' : '')} role="status" aria-live="polite">
      {toast && <>{toast.text}{toast.mark && <b>{toast.mark}</b>}</>}
    </div>
  );
}
export {
  LOGO,
  machineColor,
  MDot,
  KindBadge,
  DLIcon,
  downloadAppFile,
  saveText,
  downloadDay,
  Tag,
  Chip,
  MemberTag,
  agoLabel,
  logTime,
  Header,
  dayHint,
  CalDay,
  Calendar,
  Drawer,
  Modal,
  Toast,
};
