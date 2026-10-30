import React from 'react';
import type { Application } from '@shared/types';
import {
  WD, pad2, ymd, parseYmd, addDays, startOfDay, isWeekday, hasShift, staffFor, mdLabel,
  slotStart, minsLabel, rangeLabel, slotRangeLabel, durationLabel, slotIndex, inShiftSlot, spanOf, clampRange,
  HR_LIST, isValidHR, hrLabel, whoLabel, requestAllowed, isPastDate, todayStrOf,
  computeDay, hasOverlap, findNextOpenDate, saveProfile,
  STATUS, KIND, MACHINE_IDS, MACHINE_MAP, MACHINES, SLOT_COUNT, ROW_H, SHIFT_START, SHIFT_END,
  SHIFT_SLOT_START, SHIFT_SLOT_END, SHIFT_SLOTS, DAY_START, DAY_END, SLOT_MIN,
  buildMonthGridCells, addCalendarMonths, calendarMonthLabel, monthIndexFromDateStr,
} from '@shared/domain';
import { useCalPeriodNav } from '../hooks/useCalPeriodNav';

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

type CalendarProps = {
  selected: string;
  onPick: (dateStr: string) => void;
  apps: Application[];
  todayStr: string;
  staffDates?: Record<string, boolean>;
  viewYear?: number;
  /** 0-indexed month */
  viewMonth?: number;
  onViewMonthChange?: (year: number, monthIndex: number) => void;
};

function Calendar({
  selected,
  onPick,
  apps,
  todayStr,
  staffDates,
  viewYear: viewYearProp,
  viewMonth: viewMonthProp,
  onViewMonthChange,
}: CalendarProps) {
  const { run, enterClass } = useCalPeriodNav();
  const selectedParts = monthIndexFromDateStr(selected);
  const [internalView, setInternalView] = React.useState(selectedParts);
  const viewYear = viewYearProp ?? internalView.y;
  const viewMonth = viewMonthProp ?? internalView.m;

  const setViewMonth = (y: number, m: number) => {
    onViewMonthChange?.(y, m);
    if (viewYearProp == null && viewMonthProp == null) {
      setInternalView({ y, m });
    }
  };

  const cells = buildMonthGridCells(viewYear, viewMonth);
  const periodKey = `${viewYear}-${pad2(viewMonth + 1)}`;
  const monthLabel = calendarMonthLabel(viewYear, viewMonth);
  const inMonthCells = cells.filter(c => c.inMonth);
  const rangeApps = apps.filter(
    a => cells.some(c => c.dateStr === a.date) && a.status !== 'rejected',
  );
  const shiftDays = inMonthCells.filter(c => isWeekday(c.date)).length;
  const pending = rangeApps.filter(a => a.status === 'pending').length;
  const monthFirst = inMonthCells[0]?.date;
  const monthLast = inMonthCells[inMonthCells.length - 1]?.date;

  const stepMonth = (delta: number) => {
    run(delta, () => {
      const next = addCalendarMonths(viewYear, viewMonth, delta);
      setViewMonth(next.y, next.m);
    });
  };

  const goToday = () => {
    const { y, m } = monthIndexFromDateStr(todayStr);
    setViewMonth(y, m);
    onPick(todayStr);
  };

  const weeks: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <div className="card cal">
      <div className="cal-top">
        <div>
          <div className={enterClass} key={`label-${periodKey}`}>
            <div className="cal-month">
              <span>{monthLabel}</span>
            </div>
          </div>
          <div className="cal-sub num">
            {monthFirst && monthLast
              ? <>期間 {mdLabel(monthFirst)}〜{mdLabel(monthLast)} ／ </>
              : null}
            稼働 {shiftDays}日 ／ 申請 {rangeApps.length}件（申請中 {pending}）
          </div>
        </div>
        <div className="cal-nav">
          <button type="button" className="cal-today" onClick={goToday}>今日</button>
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
              <div className="cal-wdays">
                {WD.map((w, i) => (
                  <div key={w} className={'cal-wd' + (i === 0 ? ' sun' : i === 6 ? ' sat' : '')}>{w}</div>
                ))}
              </div>

              <div className="cal-grid" data-week-rows={weeks.length}>
                {weeks.map((row) =>
                  row.map(({ date, dateStr, inMonth }) => (
                    <DayCell
                      key={dateStr}
                      date={date}
                      dateStr={dateStr}
                      info={computeDay(apps, dateStr, staffDates)}
                      selected={dateStr === selected}
                      today={dateStr === todayStr}
                      dim={!inMonth}
                      onPick={onPick}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <button type="button" className="cal-side next" onClick={() => stepMonth(1)} aria-label="次の月">
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
