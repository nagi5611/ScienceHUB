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

const CELL_EVENTS = 2;

function DayCell({ date, dateStr, info, selected, today, dim, onPick }) {
  const wd = date.getDay();
  const cls = ['day'];
  if (wd === 0) cls.push('sun');
  if (wd === 6) cls.push('sat');
  if (today) cls.push('today');
  if (selected) cls.push('sel');
  if (info.shift) cls.push('staff-on');
  else cls.push('closed');
  if (dim) cls.push('dim');

  const evs = [...info.list].sort((a, b) => spanOf(a).start - spanOf(b).start);
  const shown = evs.slice(0, CELL_EVENTS);
  const more = evs.length - shown.length;

  return (
    <button type="button" className={cls.join(' ')} onClick={() => onPick(dateStr)}
      aria-pressed={selected}
      aria-label={`${date.getMonth() + 1}月${date.getDate()}日 ${info.shift ? '担当あり' : '担当なし'} 申請${evs.length}件`}>
      <span className="d-top">
        <span className="d num">{date.getDate()}</span>
        <span className="d-sub num">{date.getMonth() + 1}月</span>
      </span>
      <span className="evs" aria-hidden="true">
        {shown.map(a => (
          <span className={'ev ' + a.status} key={a.id}>
            <i style={{ background: a.machine === 'ke' ? 'var(--color-primary)' : 'var(--color-tip)' }} />
            <b className="num">{minsLabel(spanOf(a).start)}</b>
            <span className="t">{a.title}</span>
          </span>
        ))}
        {more > 0 && <span className="ev more num">他 {more}件</span>}
      </span>
      <span className="evcount num">{evs.length ? evs.length + '件' : ''}</span>
    </button>
  );
}

function Calendar({ anchor, setAnchor, selected, onPick, apps, todayStr, staffDates }) {
  /* 選択日を含む週（日曜始まり）を第1週として4週分 */
  const firstWeek = weekStart(parseYmd(selected));
  const weeks = [];
  for (let i = 0; i < 4; i++) {
    const row = [];
    for (let j = 0; j < 7; j++) row.push(addDays(firstWeek, i * 7 + j));
    weeks.push(row);
  }
  const headMonth = parseYmd(selected);
  const lastDay = weeks[3][6];
  const sameMonth = headMonth.getMonth() === lastDay.getMonth() && headMonth.getFullYear() === lastDay.getFullYear();
  const monthLabel = sameMonth
    ? `${headMonth.getFullYear()}年 ${pad2(headMonth.getMonth() + 1)}月`
    : `${pad2(headMonth.getMonth() + 1)}月 → ${pad2(lastDay.getMonth() + 1)}月`;

  const flat = weeks.flat();
  const inRange = ds => flat.some(d => ymd(d) === ds);
  const rangeApps = apps.filter(a => inRange(a.date) && a.status !== 'rejected');
  const shiftDays = flat.filter(d => isWeekday(d)).length;
  const pending = rangeApps.filter(a => a.status === 'pending').length;
  const anchorMonth = parseYmd(selected).getMonth();

  const shift = n => {
    const x = addDays(parseYmd(selected), n * 28);
    onPick(ymd(x));
  };

  return (
    <div className="card cal">
      <div className="cal-top">
        <div>
          <div className="cal-month">
            <span>{monthLabel}</span>
          </div>
          <div className="cal-sub num">
            期間 {mdLabel(flat[0])}〜{mdLabel(lastDay)} ／ 稼働 {shiftDays}日 ／ 申請 {rangeApps.length}件（申請中 {pending}）
          </div>
        </div>
        <div className="cal-nav">
          <button type="button" className="cal-today" onClick={() => onPick(todayStr)}>今日</button>
        </div>
      </div>

      <div className="cal-body">
        <button type="button" className="cal-side prev" onClick={() => shift(-1)} aria-label="前の4週間">
          <span aria-hidden="true">‹</span>
          <span className="cal-side-lbl">前へ</span>
        </button>

        <div className="cal-main">
          <div className="cal-wdays">
            {WD.map((w, i) => (
              <div key={w} className={'cal-wd' + (i === 0 ? ' sun' : i === 6 ? ' sat' : '')}>{w}</div>
            ))}
          </div>

          <div className="cal-grid">
            {weeks.map((row) =>
              row.map(d => {
                const ds = ymd(d);
                return (
              <DayCell key={ds} date={d} dateStr={ds} info={computeDay(apps, ds, staffDates)}
                selected={ds === selected} today={ds === todayStr}
                dim={d.getMonth() !== anchorMonth} onPick={onPick} />
                );
              })
            )}
          </div>
        </div>

        <button type="button" className="cal-side next" onClick={() => shift(1)} aria-label="次の4週間">
          <span aria-hidden="true">›</span>
          <span className="cal-side-lbl">次へ</span>
        </button>
      </div>

      <div className="cal-foot">
        <div className="lg"><span className="stf-sample staff-dot">●</span><span>担当あり（明るいマス）</span></div>
        <div className="lg"><span className="stf-sample closed staff-dot">●</span><span>担当なし（暗いマス）</span></div>
        <div className="lg"><span className="stf-sample due">前日</span><span className="lg-txt">印刷依頼の締切（当日不可）</span></div>
      </div>
    </div>
  );
}

export { DayCell, Calendar };
