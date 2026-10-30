import React from 'react';
import { buildCalendarMonthGridDays, todayJst } from '../admin-calendar';
import {
  AdminApiError,
  applyShiftAvailabilityDraft,
  fetchShiftsFull,
  hasShiftDraftChanges,
  patchMemberColor,
  rescheduleReservation,
  type PrinterAvailabilityRow,
  type ShiftAvailabilityRow,
} from '../admin-api';

const WD = ['日', '月', '火', '水', '木', '金', '土'];
const COLORS = 8;

type Block = {
  kind: 'member' | 'printer';
  id: string;
  date: string;
  reservations: { id: string; title?: string; desired_date?: string }[];
};

type ShiftsData = Awaited<ReturnType<typeof fetchShiftsFull>>;

function cloneMemberAvailability(rows: ShiftAvailabilityRow[]): ShiftAvailabilityRow[] {
  return rows.map((r) => ({ member_id: r.member_id, date: r.date }));
}

function clonePrinterAvailability(rows: PrinterAvailabilityRow[]): PrinterAvailabilityRow[] {
  return rows.map((r) => ({ printer_id: r.printer_id, date: r.date }));
}

function memberHasDate(rows: ShiftAvailabilityRow[], memberId: string, date: string): boolean {
  return rows.some((r) => r.member_id === memberId && r.date === date);
}

function printerHasDate(rows: PrinterAvailabilityRow[], printerId: string, date: string): boolean {
  return rows.some((r) => r.printer_id === printerId && r.date === date);
}

function setMemberDate(rows: ShiftAvailabilityRow[], memberId: string, date: string, on: boolean): ShiftAvailabilityRow[] {
  const has = memberHasDate(rows, memberId, date);
  if (on && !has) return [...rows, { member_id: memberId, date }];
  if (!on && has) return rows.filter((r) => !(r.member_id === memberId && r.date === date));
  return rows;
}

function setPrinterDate(
  rows: PrinterAvailabilityRow[],
  printerId: string,
  date: string,
  on: boolean
): PrinterAvailabilityRow[] {
  const has = printerHasDate(rows, printerId, date);
  if (on && !has) return [...rows, { printer_id: printerId, date }];
  if (!on && has) return rows.filter((r) => !(r.printer_id === printerId && r.date === date));
  return rows;
}

export function ShiftMonthPanel({ onToast }: { onToast: (m: string) => void }) {
  const now = new Date();
  const [year, setYear] = React.useState(now.getFullYear());
  const [month, setMonth] = React.useState(now.getMonth() + 1);
  const [mode, setMode] = React.useState<'member' | 'printer'>('member');
  const [selectedMember, setSelectedMember] = React.useState<string | null>(null);
  const [selectedPrinter, setSelectedPrinter] = React.useState<string | null>(null);
  const [data, setData] = React.useState<ShiftsData | null>(null);
  const [savedMemberAvailability, setSavedMemberAvailability] = React.useState<ShiftAvailabilityRow[]>([]);
  const [savedPrinterAvailability, setSavedPrinterAvailability] = React.useState<PrinterAvailabilityRow[]>([]);
  const [draftMemberAvailability, setDraftMemberAvailability] = React.useState<ShiftAvailabilityRow[]>([]);
  const [draftPrinterAvailability, setDraftPrinterAvailability] = React.useState<PrinterAvailabilityRow[]>([]);
  const [painting, setPainting] = React.useState<string[]>([]);
  const [block, setBlock] = React.useState<Block | null>(null);
  const [dates, setDates] = React.useState<Record<string, string>>({});
  const [applying, setApplying] = React.useState(false);
  const drag = React.useRef<{ on: boolean; dates: Set<string>; start: string | null }>({
    on: false,
    dates: new Set(),
    start: null,
  });

  const pending = hasShiftDraftChanges(
    savedMemberAvailability,
    draftMemberAvailability,
    savedPrinterAvailability,
    draftPrinterAvailability
  );

  const resetDraftFromSaved = React.useCallback(() => {
    setDraftMemberAvailability(cloneMemberAvailability(savedMemberAvailability));
    setDraftPrinterAvailability(clonePrinterAvailability(savedPrinterAvailability));
  }, [savedMemberAvailability, savedPrinterAvailability]);

  const load = React.useCallback(async () => {
    const d = await fetchShiftsFull(year, month);
    setData(d);
    const members = cloneMemberAvailability(d.availability);
    const printers = clonePrinterAvailability(d.printer_availability);
    setSavedMemberAvailability(members);
    setSavedPrinterAvailability(printers);
    setDraftMemberAvailability(members);
    setDraftPrinterAvailability(printers);
    setSelectedMember((cur) => cur ?? d.members[0]?.id ?? null);
    setSelectedPrinter((cur) => cur ?? d.printers[0]?.id ?? null);
  }, [year, month]);

  React.useEffect(() => {
    void load().catch((e) => onToast(e instanceof Error ? e.message : 'シフト読込失敗'));
  }, [load, onToast]);

  const openBlock = (err: unknown, kind: 'member' | 'printer', id: string) => {
    if (!(err instanceof AdminApiError)) return false;
    if (err.code !== 'RESERVATIONS_ON_DATE' && err.code !== 'RESERVATIONS_ON_PRINTER_DATE') return false;
    const next: Record<string, string> = {};
    for (const r of err.reservations ?? []) next[r.id] = '';
    setDates(next);
    setBlock({ kind, id, date: err.date ?? '', reservations: err.reservations ?? [] });
    return true;
  };

  const applyLocalEdit = React.useCallback(
    (touched: string[]) => {
      if (!touched.length) return;
      if (mode === 'printer' && selectedPrinter) {
        setDraftPrinterAvailability((prev) => {
          let next = prev;
          if (touched.length === 1) {
            const date = touched[0];
            const on = !printerHasDate(prev, selectedPrinter, date);
            next = setPrinterDate(prev, selectedPrinter, date, on);
          } else {
            for (const date of touched) {
              next = setPrinterDate(next, selectedPrinter, date, true);
            }
          }
          return next;
        });
      } else if (selectedMember) {
        setDraftMemberAvailability((prev) => {
          let next = prev;
          if (touched.length === 1) {
            const date = touched[0];
            const on = !memberHasDate(prev, selectedMember, date);
            next = setMemberDate(prev, selectedMember, date, on);
          } else {
            for (const date of touched) {
              next = setMemberDate(next, selectedMember, date, true);
            }
          }
          return next;
        });
      }
      setPainting([]);
    },
    [mode, selectedMember, selectedPrinter]
  );

  React.useEffect(() => {
    const up = () => {
      if (!drag.current.on) return;
      drag.current.on = false;
      const touched = [...drag.current.dates];
      drag.current.dates = new Set();
      drag.current.start = null;
      applyLocalEdit(touched);
    };
    window.addEventListener('pointerup', up);
    return () => window.removeEventListener('pointerup', up);
  }, [applyLocalEdit]);

  const confirmApply = async () => {
    if (!pending || applying) return;
    setApplying(true);
    try {
      await applyShiftAvailabilityDraft(
        savedMemberAvailability,
        draftMemberAvailability,
        savedPrinterAvailability,
        draftPrinterAvailability
      );
      await load();
      onToast('シフトを保存しました');
    } catch (e) {
      const kind = mode === 'printer' ? 'printer' : 'member';
      const id = (mode === 'printer' ? selectedPrinter : selectedMember) ?? '';
      if (id && openBlock(e, kind, id)) return;
      onToast(e instanceof Error ? e.message : 'シフト保存失敗');
      await load();
    } finally {
      setApplying(false);
    }
  };

  const changeMonth = (nextYear: number, nextMonth: number) => {
    if (pending && !window.confirm('未保存のシフト変更があります。破棄して月を移動しますか？')) return;
    setYear(nextYear);
    setMonth(nextMonth);
  };

  const saveReschedule = async () => {
    if (!block) return;
    try {
      for (const r of block.reservations) {
        const desired = dates[r.id];
        if (!desired) throw new Error('すべての予約に新しい日付を入力してください');
        await rescheduleReservation(r.id, desired);
      }
      if (block.kind === 'member') {
        setDraftMemberAvailability((prev) => setMemberDate(prev, block.id, block.date, false));
      } else {
        setDraftPrinterAvailability((prev) => setPrinterDate(prev, block.id, block.date, false));
      }
      setBlock(null);
      onToast('予約の日付を変更しました。シフトの変更は「変更を確定」で保存してください');
    } catch (e) {
      onToast(e instanceof Error ? e.message : 'リスケ失敗');
    }
  };

  if (!data) return <p className="hint">読み込み中…</p>;

  const memberByDate: Record<string, typeof data.members> = {};
  for (const row of draftMemberAvailability) {
    const m = data.members.find((x) => x.id === row.member_id);
    if (!m) continue;
    (memberByDate[row.date] ??= []).push(m);
  }
  const printerByDate: Record<string, typeof data.printers> = {};
  for (const row of draftPrinterAvailability) {
    const p = data.printers.find((x) => x.id === row.printer_id);
    if (!p) continue;
    (printerByDate[row.date] ??= []).push(p);
  }

  const days = buildCalendarMonthGridDays(year, month);
  const today = todayJst();

  const startDrag = (date: string, e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    drag.current = { on: true, dates: new Set([date]), start: date };
    setPainting([date]);
  };

  const enter = (date: string) => {
    if (!drag.current.on || drag.current.dates.has(date)) return;
    drag.current.dates.add(date);
    setPainting([...drag.current.dates]);
  };

  return (
    <div className="card legacy-panel">
      <div className="legacy-month-head">
        <h2>
          {year}年 {month}月 — シフト
        </h2>
        <div className="cal-nav">
          <button
            type="button"
            onClick={() => {
              if (month === 1) changeMonth(year - 1, 12);
              else changeMonth(year, month - 1);
            }}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => {
              if (pending && !window.confirm('未保存のシフト変更があります。破棄して今月へ移動しますか？')) return;
              setYear(now.getFullYear());
              setMonth(now.getMonth() + 1);
            }}
          >
            今日
          </button>
          <button
            type="button"
            onClick={() => {
              if (month === 12) changeMonth(year + 1, 1);
              else changeMonth(year, month + 1);
            }}
          >
            ›
          </button>
        </div>
        <div className="seg">
          <button type="button" className={mode === 'member' ? 'on' : ''} onClick={() => setMode('member')}>
            担当者
          </button>
          <button type="button" className={mode === 'printer' ? 'on' : ''} onClick={() => setMode('printer')}>
            プリンター
          </button>
        </div>
      </div>

      {pending && (
        <div className="shift-confirm-bar" role="status">
          <span className="shift-confirm-bar-text">未保存のシフト変更があります</span>
          <div className="shift-confirm-bar-actions">
            <button type="button" className="btn btn-secondary btn-sm" disabled={applying} onClick={resetDraftFromSaved}>
              変更を破棄
            </button>
            <button type="button" className="btn btn-primary btn-sm" disabled={applying} onClick={() => void confirmApply()}>
              {applying ? '保存中…' : '変更を確定'}
            </button>
          </div>
        </div>
      )}

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

      <p className="hint">
        日付をクリックで切替、ドラッグで複数日を稼働にします。編集後は「変更を確定」でまとめて保存します。予約がある日は日付変更後に外せます。
      </p>

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
          const cls = ['calendar-day', 'shift-day', 'shift-day-editable'];
          if (otherMonth) cls.push('other-month');
          if (dateStr === today) cls.push('today');
          if (painting.includes(dateStr)) cls.push('shift-day-painting');
          return (
            <div
              key={dateStr}
              className={cls.join(' ')}
              data-date={dateStr}
              onPointerDown={(e) => startDrag(dateStr, e)}
              onPointerEnter={() => enter(dateStr)}
            >
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

      {block && (
        <div className="legacy-modal open" role="dialog" aria-modal="true">
          <div className="legacy-modal-scrim" onClick={() => setBlock(null)} />
          <div className="legacy-modal-body card">
            <h2>予約の日付を変更</h2>
            <p className="hint">{block.date} には予約があるため、先に別日へ移してください。</p>
            {block.reservations.map((r) => (
              <label key={r.id} className="form-group">
                {r.title || r.id}
                <input
                  className="input"
                  type="date"
                  value={dates[r.id] ?? ''}
                  onChange={(e) => setDates((prev) => ({ ...prev, [r.id]: e.target.value }))}
                />
              </label>
            ))}
            <div className="legacy-modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setBlock(null)}>
                キャンセル
              </button>
              <button type="button" className="btn btn-primary" onClick={() => void saveReschedule()}>
                予約日を変更
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
