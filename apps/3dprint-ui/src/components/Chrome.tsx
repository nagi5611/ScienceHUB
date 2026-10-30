import React from 'react';
import type { Application } from '@shared/types';
import {
  WD, pad2, ymd, parseYmd, addDays, startOfDay, isWeekday, hasShift, staffFor, weekStart, mdLabel,
  slotStart, minsLabel, rangeLabel, slotRangeLabel, durationLabel, slotIndex, inShiftSlot, spanOf, clampRange,
  HR_LIST, isValidHR, hrLabel, whoLabel, requestAllowed, isPastDate, todayStrOf,
  computeDay, hasOverlap, findNextOpenDate, saveProfile,
  STATUS, KIND, MACHINE_IDS, MACHINE_MAP, MACHINES, SLOT_COUNT, ROW_H, SHIFT_START, SHIFT_END,
  SHIFT_SLOT_START, SHIFT_SLOT_END, SHIFT_SLOTS, DAY_START, DAY_END, SLOT_MIN,
} from '@shared/domain';

const LOGO = '/apps/3dprint-management/assets/icon-192.png';

function SiteHeader({ mineCount, onOpenMine, onNew }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="#" className="site-title" onClick={e => e.preventDefault()}>
          <img src={LOGO} alt="" />
          ScienceHUB <span>3Dプリントの依頼・予約</span>
        </a>
        <div className="hdr-actions">
          <button type="button" className="hdr-link" onClick={onOpenMine}>
            申請一覧 {mineCount > 0 && <span className="hdr-count num">{mineCount}</span>}
          </button>
          <button type="button" className="btn btn-primary" onClick={onNew}>新規申請</button>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-club">
          <img src={LOGO} alt="自然科学部" />
          <div>
            <b>松山南高校 自然科学部 / 3Dモデル班</b>
            <span>予約の変更・取消は担当者（金田・田村・藤原）まで</span>
          </div>
        </div>
        <div className="footer-meta">
          <a href="mailto:diorama@mmh-virtual.jp">diorama@mmh-virtual.jp</a>
          <span className="num">稼働 平日 16:30〜20:00</span>
        </div>
      </div>
    </footer>
  );
}

function Notice({ type, label, children, action }) {
  return (
    <div className={'notice ' + (type || 'tip')}>
      <i>{label || (type === 'warn' ? '注意' : 'ヒント')}</i>
      <div className="grow">{children}</div>
      {action}
    </div>
  );
}

function Chip({ tone, children }) {
  return <span className={'chip' + (tone ? ' ' + tone : '')}>{children}</span>;
}

function StatusTag({ status }) {
  return <span className={'tag ' + status}>{STATUS[status]}</span>;
}

function MachineDot({ id, size }) {
  return <span className="mdot" style={{ background: id === 'ke' ? 'var(--color-primary)' : 'var(--color-tip)', width: size, height: size }} />;
}

function Toast({ toast }) {
  return (
    <div className={'toast' + (toast ? ' show' : '')} role="status" aria-live="polite">
      {toast && <>{toast.text}{toast.mark && <b>{toast.mark}</b>}</>}
    </div>
  );
}

/* 右ドロワー（デスクトップは右から、モバイルは下から） */
function Sheet({ open, title, sub, onClose, children, footer, labelledBy }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <div className={'scrim' + (open ? ' on' : '')} onClick={onClose} aria-hidden="true" />
      <aside className={'sheet' + (open ? ' on' : '')} role="dialog" aria-modal="true"
        aria-label={title} aria-hidden={!open}>
        <div className="sheet-h">
          <div>
            <h2>{title}</h2>
            {sub && <p>{sub}</p>}
          </div>
          <button type="button" className="iconbtn" onClick={onClose} aria-label="閉じる">×</button>
        </div>
        <div className="sheet-body">{children}</div>
        {footer && <div className="sheet-f">{footer}</div>}
      </aside>
    </>
  );
}

export { SiteHeader, SiteFooter, Notice, Chip, StatusTag, MachineDot, Toast, Sheet };
