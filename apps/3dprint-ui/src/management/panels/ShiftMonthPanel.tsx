import React from 'react';
import { buildCalendarMonthGridDays, todayJst } from '../admin-calendar';
import {
  fetchShiftsFull,
  toggleMemberShift,
  togglePrinterShift,
  patchMemberColor,
} from '../admin-api';

const WD = ['日', '月', '火', '水', '木', '金', '土'];
const COLORS = 8;

export function ShiftMonthPanel({ onToast }: { onToast: (m: string) => void }) {
  const now = new Date();
  const [year, setYear] = React.useState(now.getFullYear());
  const [month, setMonth] = React.useState(now.getMonth() + 1);
  const [mode, setMode] = React.useState<'member' | 'printer'>('member');
  const [selectedMember, setSelectedMember] = React.useState<string | null>(null);
  const [selectedPrinter, setSelectedPrinter] = React.useState<string | null>(null);
  const [data, setData] = React.useState<Awaited<ReturnType<typeof fetchShiftsFull>> | null>(null);

  const load = React.useCallback(async () => {
    const d = await fetchShiftsFull(year, month);
    setData(d);
    if (!selectedMember && d.members[0]) setSelectedMember(d.members[0].id);
    if (!selectedPrinter && d.printers[0]) setSelectedPrinter(d.printers[0].id);
  }, [year, month, selectedMember, selectedPrinter]);

  React.useEffect(() => {
    void load().catch((e) => onToast(e instanceof Error ? e.message : 'シフト読込失敗'));
  }, [load, onToast]);

  if (!data) return <p className="hint">読み込み中…</p>;

  const memberByDate: Record<string, typeof data.members> = {};
  for (const row of data.availability) {
    const m = data.members.find((x) => x.id === row.member_id);
    if (!m) continue;
    if (!memberByDate[row.date]) memberByDate[row.date] = [];
    memberByDate[row.date].push(m);
  }
  const printerByDate: Record<string, typeof data.printers> = {};
  for (const row of data.printer_availability) {
    const p = data.printers.find((x) => x.id === row.printer_id);
    if (!p) continue;
    if (!printerByDate[row.date]) printerByDate[row.date] = [];
    printerByDate[row.date].push(p);
  }

  const days = buildCalendarMonthGridDays(year, month);
  const today = todayJst();

  const toggleDay = async (date: string) => {
    try {
      if (mode === 'member' && selectedMember) {
        await toggleMemberShift(selectedMember, date);
      } else if (mode === 'printer' && selectedPrinter) {
        await togglePrinterShift(selectedPrinter, date);
      }
      await load();
    } catch (e) {
      onToast(e instanceof Error ? e.message : 'シフト更新失敗（予約がある日は不可）');
    }
  };

  return (
    <div className="card legacy-panel">
      <div className="legacy-month-head">
        <h2>
          {year}年 {month}月 — シフト
        </h2>
        <div className="seg">
          <button type="button" className={mode === 'member' ? 'on' : ''} onClick={() => setMode('member')}>
            担当者
          </button>
          <button type="button" className={mode === 'printer' ? 'on' : ''} onClick={() => setMode('printer')}>
            プリンター
          </button>
        </div>
      </div>

      {mode === 'member' ? (
        <div className="shift-member-toolbar-track">
          {data.members.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`shift-member-card${selectedMember === m.id ? ' shift-member-card-active' : ''}`}
              onClick={() => setSelectedMember(m.id)}
            >
              <span
                className="shift-color-card"
                style={{ background: `hsl(${(m.color_index * 40) % 360} 70% 45%)` }}
                onClick={(e) => {
                  e.stopPropagation();
                  void patchMemberColor(m.id, (m.color_index + 1) % COLORS)
                    .then(load)
                    .catch((err) => onToast(err instanceof Error ? err.message : '色変更失敗'));
                }}
              />
              <span>{m.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="shift-printer-toolbar-track">
          {data.printers.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`shift-printer-card${selectedPrinter === p.id ? ' shift-printer-card-active' : ''}`}
              onClick={() => setSelectedPrinter(p.id)}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      <p className="hint">日付をクリックして {mode === 'member' ? '担当' : 'プリンター'} の稼働を切り替えます。</p>

      <div className="calendar-weekdays-row">
        {WD.map((w) => (
          <div key={w} className="calendar-weekday">
            {w}
          </div>
        ))}
      </div>
      <div className="calendar-grid shift-calendar-grid" id="shift-calendar-grid">
        {days.map(({ dayNum, otherMonth, dateStr }) => {
          const members = memberByDate[dateStr] ?? [];
          const printers = printerByDate[dateStr] ?? [];
          const cls = ['calendar-day', 'shift-day'];
          if (otherMonth) cls.push('other-month');
          if (dateStr === today) cls.push('today');
          if ((mode === 'member' && selectedMember) || (mode === 'printer' && selectedPrinter)) {
            cls.push('shift-day-editable');
          }
          return (
            <div key={dateStr} className={cls.join(' ')} data-date={dateStr} onClick={() => void toggleDay(dateStr)}>
              <div className="calendar-day-number">{dayNum}</div>
              {members.length > 0 && (
                <div className="shift-day-chips">
                  {members.map((m) => (
                    <span key={m.id} className="shift-day-chip">
                      {m.name}
                    </span>
                  ))}
                </div>
              )}
              {printers.length > 0 && (
                <div className="shift-day-printer-chips">
                  {printers.map((p) => (
                    <span key={p.id} className="shift-day-printer-chip">
                      {p.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
