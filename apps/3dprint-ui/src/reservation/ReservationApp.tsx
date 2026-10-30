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
  fetchCancelledApplications,
  restoreReservation,
  fetchPrinters,
  createTimeSlotReservation,
  cancelReservation,
  fetchAuthProfile,
} from '@shared/api';
import { uploadPrintFile } from '@shared/upload';
import { SiteHeader, SiteFooter, Toast } from '@components/Chrome';
import { Calendar } from '@components/Calendar';
import { readReservationRangeCache, writeReservationRangeCache } from './reservation-cache';
import { DayPanel } from '@components/Timetable';
import { ApplicationPopover } from '@components/Popover';
import { DetailSheet, MineSheet, CancelledSheet } from '@components/Sheets';

type Selection = { machine: 'ke' | 'cc'; start: number; end: number } | null;
type Draft = {
  date: string;
  machine: 'ke' | 'cc';
  start: number;
  end: number;
  kind: 'reserve' | 'request';
};

function initialRange(selected: string) {
  const firstWeek = weekStart(parseYmd(selected));
  return { from: ymd(firstWeek), to: ymd(addDays(firstWeek, 27)) };
}

export function ReservationApp() {
  const todayStr = ymd(startOfDay(new Date()));
  const prefs = loadPrefs();
  const initialSelected = prefs.selected || todayStr;
  const bootRange = initialRange(initialSelected);
  const bootCache = readReservationRangeCache(bootRange.from, bootRange.to);

  const [apps, setApps] = React.useState<Application[]>(() => bootCache?.applications ?? []);
  const [staffDates, setStaffDates] = React.useState<Record<string, boolean>>(() => bootCache?.staff_dates ?? {});
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
  const [cancelledOpen, setCancelledOpen] = React.useState(false);
  const [cancelledApps, setCancelledApps] = React.useState<Application[]>(() => bootCache?.cancelled ?? []);
  /** True once D1 data for the current 4-week range has been fetched successfully. */
  const [rangeLive, setRangeLive] = React.useState(false);
  const rangeFetchGen = React.useRef(0);

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

  const applyRangeCache = React.useCallback((from: string, to: string) => {
    const cached = readReservationRangeCache(from, to);
    if (cached) {
      setApps(cached.applications);
      setStaffDates(cached.staff_dates);
      setCancelledApps(cached.cancelled);
    } else {
      setApps([]);
      setStaffDates({});
      setCancelledApps([]);
    }
  }, []);

  const refreshRangeFromServer = React.useCallback(async () => {
    const { from, to } = rangeForSelected;
    const gen = ++rangeFetchGen.current;
    setRangeLive(false);
    try {
      const [data, cancelled] = await Promise.all([
        fetchApplications(from, to),
        fetchCancelledApplications(from, to),
      ]);
      if (rangeFetchGen.current !== gen) return;
      setApps(data.applications);
      setCancelledApps(cancelled.applications);
      setStaffDates(data.staff_dates);
      writeReservationRangeCache({
        from,
        to,
        applications: data.applications,
        staff_dates: data.staff_dates,
        cancelled: cancelled.applications,
      });
      setRangeLive(true);
    } catch (e) {
      if (rangeFetchGen.current !== gen) return;
      showToast(e instanceof Error ? e.message : '読み込みに失敗しました', 'エラー');
    }
  }, [rangeForSelected, showToast]);

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
      } catch (e) {
        showToast(e instanceof Error ? e.message : '読み込みに失敗しました', 'エラー');
      }
    })();
  }, [showToast]);

  React.useEffect(() => {
    const { from, to } = rangeForSelected;
    applyRangeCache(from, to);
    void refreshRangeFromServer();
  }, [rangeForSelected.from, rangeForSelected.to, applyRangeCache, refreshRangeFromServer]);

  React.useEffect(() => {
    if (!rangeLive && form.open) {
      setForm({ open: false, draft: null });
      setSelection(null);
    }
  }, [rangeLive, form.open]);

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
  const cancelledCount = cancelledApps.filter((a) => a.mine).length;

  const pickDate = (ds: string) => {
    setSelected(ds);
    setSelection(null);
    setForm({ open: false, draft: null });
  };

  const ensureBookingLive = () => {
    if (rangeLive) return true;
    showToast('担当情報をサーバーで確認中です。少し待ってから再度お試しください', '確認中');
    return false;
  };

  const pickRange = (range: { machine: 'ke' | 'cc'; start: number; end: number }) => {
    if (!ensureBookingLive()) return;
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
    if (!ensureBookingLive()) return;
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
      const created = await createTimeSlotReservation({
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
      await refreshRangeFromServer();
      const toastMsg =
        payload.kind === 'reserve'
          ? '予約が確定しました'
          : '依頼を受け付けました（担当者の受領待ち）';
      showToast(toastMsg, payload.title);
    } catch (e) {
      showToast(e instanceof Error ? e.message : '申請に失敗しました', 'エラー');
    }
  };

  const cancelApp = async (id: string) => {
    try {
      await cancelReservation(id);
      setDetail(null);
      await refreshRangeFromServer();
      showToast('申請を取り消しました');
    } catch (e) {
      showToast(e instanceof Error ? e.message : '取消に失敗しました', 'エラー');
    }
  };

  const restoreApp = async (id: string) => {
    try {
      await restoreReservation(id);
      setDetail(null);
      await refreshRangeFromServer();
      showToast('取り消しを取消しました', '復元');
    } catch (e) {
      showToast(e instanceof Error ? e.message : '復元に失敗しました', 'エラー');
    }
  };

  return (
    <>
      <SiteHeader
        mineCount={mineCount}
        cancelledCount={cancelledCount}
        onOpenMine={() => setMineOpen(true)}
        onOpenCancelled={() => setCancelledOpen(true)}
      />
      <div
        className="main-content"
        data-testid="reservation-app"
        data-range-live={rangeLive ? 'true' : 'false'}
      >
        <div className="page-head">
          <div style={{ minWidth: 0 }}>
            <span className="badge">自然科学部 3Dモデル班</span>
            <h1 className="page-heading">3Dプリントの依頼・予約</h1>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              data-testid="btn-new-application"
              disabled={!rangeLive}
              onClick={openNew}
            >
              新規申請
            </button>
          </div>
        </div>
        {!rangeLive && (
          <p className="res-sync-banner" data-testid="reservation-sync-banner" role="status">
            カレンダーは前回の表示です。担当の最新情報を確認しています…
          </p>
        )}
        <div className="workspace">
          <div className="cal-col">
            <Calendar selected={selected} onPick={pickDate} apps={apps} todayStr={todayStr} staffDates={staffDates} />
            {rangeLive && (
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
            )}
          </div>
          <DayPanel
            dateStr={selected}
            info={info}
            apps={apps}
            selection={selection}
            onSelect={setSelection}
            onPickRange={pickRange}
            onClearSel={() => setSelection(null)}
            onOpenApp={(app) => setDetail(app)}
            onJumpNext={pickDate}
            nextOpen={nextOpen}
            bookingLive={rangeLive}
          />
        </div>
      </div>
      <SiteFooter />
      <MineSheet open={mineOpen} apps={apps} onClose={() => setMineOpen(false)} onOpenApp={(app) => setDetail(app)} />
      <CancelledSheet
        open={cancelledOpen}
        apps={cancelledApps}
        onClose={() => setCancelledOpen(false)}
        onOpenApp={(app) => setDetail(app)}
        onRestore={restoreApp}
      />
      <DetailSheet
        open={!!detail}
        app={detail}
        onClose={() => setDetail(null)}
        onCancel={cancelApp}
        onRestore={restoreApp}
      />
      <Toast toast={toast} />
    </>
  );
}
