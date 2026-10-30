import React from 'react';
import type { AdminReservation } from '../admin-api';
import { buildCalendarMonthGridDays, todayJst } from '../admin-calendar';
import { fetchDayAvailability } from '../admin-api';

const WD = ['日', '月', '火', '水', '木', '金', '土'];

export function MonthCalendarPanel({
  reservations,
  onPickDate,
  onOpenReservation,
  onToast,
}: {
  reservations: AdminReservation[];
  onPickDate: (date: string) => void;
  onOpenReservation: (r: AdminReservation) => void;
  onToast: (msg: string) => void;
}) {
  const now = new Date();
  const [year, setYear] = React.useState(now.getFullYear());
  const [month, setMonth] = React.useState(now.getMonth() + 1);

  const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
  const byDate = React.useMemo(() => {
    const map: Record<string, AdminReservation[]> = {};
    for (const r of reservations) {
      const end = r.calendar_end_date || r.desired_date;
      if (r.desired_date.slice(0, 7) > monthPrefix && end.slice(0, 7) < monthPrefix) continue;
      const d = r.desired_date;
      if (!map[d]) map[d] = [];
      map[d].push(r);
    }
    return map;
  }, [reservations, monthPrefix]);

  const days = buildCalendarMonthGridDays(year, month);
  const today = todayJst();

  const changeMonth = (delta: number) => {
    let m = month + delta;
    let y = year;
    if (m > 12) {
      m = 1;
      y++;
    } else if (m < 1) {
      m = 12;
      y--;
    }
    setMonth(m);
    setYear(y);
  };

  const onDayClick = async (dateStr: string, isFull: boolean) => {
    if (dateStr < today) {
      onToast('当日より前の日付には予約できません');
      return;
    }
    if (isFull) {
      onToast('この日はもう満杯です');
      return;
    }
    try {
      const av = await fetchDayAvailability(dateStr);
      if (av.isFull) {
        onToast('この日はもう満杯です');
        return;
      }
      onPickDate(dateStr);
    } catch (e) {
      onToast(e instanceof Error ? e.message : '空き確認に失敗');
    }
  };

  return (
    <div className="card legacy-panel">
      <div className="cal-head legacy-month-head">
        <h2 className="page-heading" style={{ margin: 0 }}>
          {year}年 {month}月
        </h2>
        <div className="cal-nav">
          <button type="button" onClick={() => changeMonth(-1)}>
            ‹
          </button>
          <button type="button" className="cal-today" onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth() + 1); }}>
            今日
          </button>
          <button type="button" onClick={() => changeMonth(1)}>
            ›
          </button>
        </div>
      </div>
      <div className="calendar-weekdays-row">
        {WD.map((w) => (
          <div key={w} className="calendar-weekday">
            {w}
          </div>
        ))}
      </div>
      <div className="calendar-grid" id="calendar-grid">
        {days.map(({ dayNum, otherMonth, dateStr }) => {
          const list = byDate[dateStr] ?? [];
          const isFull = false;
          const cls = ['calendar-day'];
          if (otherMonth) cls.push('other-month');
          if (dateStr === today) cls.push('today');
          if (dateStr >= today) cls.push('clickable');
          return (
            <div
              key={dateStr}
              className={cls.join(' ')}
              data-date={dateStr}
              onClick={() => void onDayClick(dateStr, isFull)}
              onKeyDown={() => {}}
              role="button"
              tabIndex={0}
            >
              <div className="calendar-day-number">{dayNum}</div>
              {list.length > 0 && (
                <div className="calendar-slots">
                  {list.slice(0, 3).map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className="calendar-slot"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenReservation(r);
                      }}
                    >
                      {r.title.slice(0, 8)}
                    </button>
                  ))}
                  {list.length > 3 && <span className="hint">他 {list.length - 3}件</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
