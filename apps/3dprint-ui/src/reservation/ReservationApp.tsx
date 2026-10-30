import React from 'react';
import type { Application } from '@shared/types';
import {
  ymd,
  startOfDay,
  parseYmd,
  addDays,
  weekStart,
  hasShift,
  isPastDate,
  computeDay,
  hasOverlap,
  findNextOpenDate,
  saveProfile,
  savePrefs,
  loadPrefs,
  loadProfile,
  SLOT_COUNT,
  slotStart,
  todayStrOf,
} from '@shared/domain';
import {
  fetchApplications,
  fetchPrinters,
  createTimeSlotReservation,
  cancelReservation,
  fetchAuthProfile,
} from '@shared/api';
import { uploadPrintFile } from '@shared/upload';
import { SiteHeader, SiteFooter, Toast } from '@components/Chrome';
import { Calendar } from '@components/Calendar';
import { DayPanel } from '@components/Timetable';
import { ApplicationPopover } from '@components/Popover';
import { DetailSheet, MineSheet } from '@components/Sheets';

type Selection = { machine: 'ke' | 'cc'; start: number; end: number } | null;
type Draft = {
  date: string;
  machine: 'ke' | 'cc';
  start: number;
  end: number;
  kind: 'reserve' | 'request';
};

export function ReservationApp() {
  const todayStr = ymd(startOfDay(new Date()));
  const prefs = loadPrefs();

  const [apps, setApps] = React.useState<Application[]>([]);
  const [staffDates, setStaffDates] = React.useState<Record<string, boolean>>({});
  const [printerByMachine, setPrinterByMachine] = React.useState<Record<'ke' | 'cc', string>>({
    ke: '',
    cc: '',
  });
  const [selected, setSelected] = React.useState(prefs.selected || todayStr);
  const [selection, setSelection] = React.useState<Selection>(null);
  const [profile, setProfileState] = React.useState(loadProfile);
  const [toast, setToast] = React.useState<{ text: string; mark?: string } | null>(null);
  const [form, setForm] = React.useState<{ open: boolean; draft: Draft | null }>({
    open: false,
    draft: null,
  });
  const [detail, setDetail] = React.useState<Application | null>(null);
  const [mineOpen, setMineOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const showToast = React.useCallback((text: string, mark?: string) => {
    setToast({ text, mark });
    window.setTimeout(() => setToast(null), 2400);
  }, []);

  const rangeForSelected = React.useMemo(() => {
    const firstWeek = weekStart(parseYmd(selected));
    const from = ymd(firstWeek);
    const to = ymd(addDays(firstWeek, 27));
    return { from, to };
  }, [selected]);

  const reloadApps = React.useCallback(async () => {
    const { from, to } = rangeForSelected;
    const data = await fetchApplications(from, to);
    setApps(data.applications);
    setStaffDates(data.staff_dates);
  }, [rangeForSelected]);

  React.useEffect(() => {
    void (async () => {
      try {
        const printers = await fetchPrinters();
        const map = { ke: '', cc: '' } as Record<'ke' | 'cc', string>;
        for (const p of printers) {
          if (p.machine_lane === 'ke' && !map.ke) map.ke = p.id;
          if (p.machine_lane === 'cc' && !map.cc) map.cc = p.id;
        }
        if (!map.ke && printers[0]) map.ke = printers[0].id;
        if (!map.cc && printers[1]) map.cc = printers[1].id;
        setPrinterByMachine(map);
        const auth = await fetchAuthProfile();
        if (auth.homeroom && auth.student_name) {
          setProfileState({
            hr: auth.homeroom,
            num: auth.student_number ? String(auth.student_number) : '',
            name: auth.student_name,
          });
        }
        await reloadApps();
      } catch (e) {
        showToast(e instanceof Error ? e.message : '読み込みに失敗しました', 'エラー');
      } finally {
        setLoading(false);
      }
    })();
  }, [reloadApps, showToast]);

  React.useEffect(() => {
    if (!loading) void reloadApps();
  }, [selected, loading, reloadApps]);

  React.useEffect(() => {
    savePrefs({ selected });
  }, [selected]);

  const info = React.useMemo(
    () => computeDay(apps, selected, staffDates),
    [apps, selected, staffDates]
  );
  const nextOpen = React.useMemo(() => findNextOpenDate(apps, selected), [apps, selected]);
  const mineCount = apps.filter(
    (a) => a.mine && (a.status === 'pending' || a.status === 'approved')
  ).length;

  const pickDate = (ds: string) => {
    setSelected(ds);
    setSelection(null);
    setForm({ open: false, draft: null });
  };

  const pickRange = (range: { machine: 'ke' | 'cc'; start: number; end: number }) => {
    setSelection(range);
    if (!hasShift(selected, staffDates)) {
      showToast('この日は担当者がいません', '休み');
      return;
    }
    if (isPastDate(selected)) {
      showToast('過ぎた日には申請できません', '不可');
      return;
    }
    setForm({
      open: true,
      draft: {
        date: selected,
        machine: range.machine,
        start: range.start,
        end: range.end,
        kind: 'reserve',
      },
    });
  };

  const syncRange = (machine: 'ke' | 'cc', start: number, end: number) => {
    setSelection({ machine, start, end });
  };

  const openNew = () => {
    if (!hasShift(selected, staffDates)) {
      showToast('この日は担当者がいません', '休み');
      return;
    }
    if (isPastDate(selected)) {
      showToast('過ぎた日には申請できません', '不可');
      return;
    }
    const first = (() => {
      for (let i = 0; i < SLOT_COUNT; i++) if (!info.machines.ke.blocked[i]) return i;
      return 0;
    })();
    const base = selection || { machine: 'ke' as const, start: first, end: Math.min(first + 2, SLOT_COUNT) };
    setSelection(base);
    setForm({
      open: true,
      draft: {
        date: selected,
        machine: base.machine,
        start: base.start,
        end: base.end,
        kind: 'reserve',
      },
    });
  };

  const submitApp = async (payload: Application & { fileRaw?: File }) => {
    const cand = {
      id: 'new',
      date: payload.date,
      machine: payload.machine,
      kind: payload.kind,
      start: payload.start,
      end: payload.end,
      title: payload.title,
      file: payload.file,
      note: payload.note,
      who: payload.who,
      status: 'pending' as const,
    };
    if (hasOverlap(apps, cand)) {
      showToast('同じ時間帯にすでに申請があります', '重複');
      return;
    }
    const printerId = printerByMachine[payload.machine];
    if (!printerId) {
      showToast('プリンターが設定されていません', 'エラー');
      return;
    }
    if (!payload.fileRaw) {
      showToast('印刷データを選択してください', 'エラー');
      return;
    }
    try {
      saveProfile(payload.who);
      const uploaded = await uploadPrintFile(payload.fileRaw);
      await createTimeSlotReservation({
        title: payload.title,
        printer_id: printerId,
        desired_date: payload.date,
        booking_kind: payload.kind,
        start_minute: payload.kind === 'reserve' ? payload.start : undefined,
        end_minute: payload.kind === 'reserve' ? payload.end : undefined,
        stl_r2_key: uploaded.r2_key,
        stl_filename: uploaded.filename,
        stl_size_bytes: uploaded.size_bytes,
        print_notes: payload.note,
      });
      setForm({ open: false, draft: null });
      setSelection(null);
      await reloadApps();
      showToast(
        payload.kind === 'request' ? '依頼を受け付けました（申請中）' : '予約を申請しました（申請中）',
        payload.title
      );
    } catch (e) {
      showToast(e instanceof Error ? e.message : '申請に失敗しました', 'エラー');
    }
  };

  const cancelApp = async (id: string) => {
    try {
      await cancelReservation(id);
      setDetail(null);
      await reloadApps();
      showToast('申請を取り消しました');
    } catch (e) {
      showToast(e instanceof Error ? e.message : '取消に失敗しました', 'エラー');
    }
  };

  return (
    <>
      <SiteHeader mineCount={mineCount} onOpenMine={() => setMineOpen(true)} onNew={openNew} />
      <div className="main-content" data-testid="reservation-app">
        {loading && <p data-testid="reservation-loading">読み込み中…</p>}
        <div className="page-head">
          <div style={{ minWidth: 0 }}>
            <span className="badge">校内設備の予約 / 自然科学部 3Dモデル班</span>
            <h1 className="page-heading">3Dプリントの依頼・予約</h1>
            <div className="page-sub">
              4週表示のカレンダーから日付を選び、6:00〜20:00 のタイムラインで空いている時間を指定すると申請ポップが開きます。
              予約は時間を指定して確保、依頼は時間指定なしで 16:30〜20:00 の枠を使います。どちらも担当者のいる日のみ。
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-secondary btn-lg" data-testid="btn-new-application" onClick={openNew}>
              新規申請
            </button>
          </div>
        </div>
        <div className="workspace">
          <div className="cal-col">
            <Calendar selected={selected} onPick={pickDate} apps={apps} todayStr={todayStr} />
            <ApplicationPopover
              open={form.open}
              draft={form.draft}
              apps={apps}
              profile={profile}
              setProfile={setProfileState}
              onChangeRange={syncRange}
              onClose={() => setForm({ open: false, draft: null })}
              onSubmit={submitApp}
            />
          </div>
          <DayPanel
            dateStr={selected}
            info={info}
            apps={apps}
            selection={selection}
            onSelect={setSelection}
            onPickRange={pickRange}
            onClearSel={() => setSelection(null)}
            onNew={openNew}
            onOpenApp={(app) => setDetail(app)}
            onJumpNext={pickDate}
            nextOpen={nextOpen}
          />
        </div>
      </div>
      <SiteFooter />
      <DetailSheet open={!!detail} app={detail} onClose={() => setDetail(null)} onCancel={cancelApp} />
      <MineSheet open={mineOpen} apps={apps} onClose={() => setMineOpen(false)} onOpenApp={(app) => setDetail(app)} />
      <Toast toast={toast} />
    </>
  );
}
