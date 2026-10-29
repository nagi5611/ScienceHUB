import React from 'react';
import {
  Header,
  DayStrip,
  CalAdmin,
  Toast,
} from './components/AdminUi';
import { AdminSectionNav, type AdminSection } from './panels/AdminSectionNav';
import { HistoryPanel } from './panels/HistoryPanel';
import { MonthCalendarPanel } from './panels/MonthCalendarPanel';
import { ForceReservationModal } from './panels/ForceReservationModal';
import { PrintersPanel } from './panels/PrintersPanel';
import { ShiftMonthPanel } from './panels/ShiftMonthPanel';
import { LegacyReservationDrawer } from './panels/LegacyReservationDrawer';
import { DayList } from './components/DayList';
import { ReviewSheet } from './components/ReviewSheet';
import { SettingsPanel, SettingsTabs } from './components/SettingsPanel';
import {
  TODAY,
  ymd,
  parseYmd,
  addDays,
  weekStart,
  mdLabel,
  loadPrefs,
  savePrefs,
  loadIntegrations,
  saveIntegrations,
  loadLog,
  saveLog,
  pendingQueue,
  exportCSV,
  buildShiftDisplayMap,
  memberName,
  type AdminApplication,
  type AdminMember,
  type AdminLogItem,
  type IntegrationsState,
} from './admin-domain';
import {
  checkManagementAccess,
  fetchApplicationsRange,
  fetchMembers,
  createMember,
  deleteMember,
  fetchShifts,
  applyShiftPlan,
  setMemberDatesAvailability,
  acceptReservation,
  patchReservation,
  testGoogleCalendar,
  testDiscordWebhook,
  fetchAdminReservations,
  type ShiftAvailabilityRow,
  type AdminReservation,
} from './admin-api';

function useMedia(query: string) {
  const [match, setMatch] = React.useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  React.useEffect(() => {
    const mq = window.matchMedia(query);
    const on = (e: MediaQueryListEvent) => setMatch(e.matches);
    setMatch(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

export function AdminApp() {
  const prefs = loadPrefs();
  const [ready, setReady] = React.useState(false);
  const [members, setMembers] = React.useState<AdminMember[]>([]);
  const [apps, setApps] = React.useState<AdminApplication[]>([]);
  const [availability, setAvailability] = React.useState<ShiftAvailabilityRow[]>([]);
  const [selected, setSelected] = React.useState(() => prefs.selected || TODAY);
  const [actor, setActor] = React.useState(() => prefs.actor || '');
  const [integrations, setIntegrations] = React.useState<IntegrationsState>(() => loadIntegrations());
  const [log, setLog] = React.useState<AdminLogItem[]>(() => loadLog());
  const [detail, setDetail] = React.useState<AdminApplication | null>(null);
  const [detailMode, setDetailMode] = React.useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [settingsTab, setSettingsTab] = React.useState('shifts');
  const [toast, setToast] = React.useState<{ text: string; mark?: string } | null>(null);
  const [section, setSection] = React.useState<AdminSection>('requests');
  const [allReservations, setAllReservations] = React.useState<AdminReservation[]>([]);
  const [forceDate, setForceDate] = React.useState<string | null>(null);
  const [legacyDetail, setLegacyDetail] = React.useState<AdminReservation | null>(null);

  const narrow = useMedia('(max-width: 1079px)');

  const shiftFrom = weekStart(addDays(parseYmd(selected), -28));
  const shiftDays = 140;
  const shifts = React.useMemo(
    () => buildShiftDisplayMap(members, availability, shiftFrom, shiftDays),
    [members, availability, shiftFrom]
  );

  const showToast = React.useCallback((text: string, mark?: string) => {
    setToast({ text, mark });
    window.setTimeout(() => setToast(null), 2400);
  }, []);

  const pushLog = React.useCallback(
    (type: string, text: string, appId: string | null = null) => {
      setLog((prev) => {
        const next = [
          {
            id: 'l' + Date.now() + Math.random().toString(36).slice(2, 5),
            at: new Date().toISOString(),
            actor,
            type,
            text,
            appId,
          },
          ...prev,
        ];
        saveLog(next);
        return next;
      });
    },
    [actor]
  );

  const reloadShifts = React.useCallback(async (anchor: string) => {
    const d = parseYmd(anchor);
    const data = await fetchShifts(d.getFullYear(), d.getMonth() + 1);
    setAvailability(data.availability);
    const nextMonth = addDays(d, 20);
    if (nextMonth.getMonth() !== d.getMonth()) {
      const extra = await fetchShifts(nextMonth.getFullYear(), nextMonth.getMonth() + 1);
      setAvailability((prev) => {
        const map = new Map(prev.map((r) => [`${r.date}:${r.member_id}`, r]));
        for (const row of extra.availability) map.set(`${row.date}:${row.member_id}`, row);
        return [...map.values()];
      });
    }
  }, []);

  const reloadApps = React.useCallback(async (anchor: string) => {
    const from = ymd(weekStart(parseYmd(anchor)));
    const to = ymd(addDays(parseYmd(from), 27));
    const list = await fetchApplicationsRange(from, to);
    setApps(list);
  }, []);

  const refreshAll = React.useCallback(async () => {
    const m = await fetchMembers();
    setMembers(m);
    if (!actor && m[0]) setActor(m[0].name);
    const reservations = await fetchAdminReservations();
    setAllReservations(reservations);
    await Promise.all([reloadApps(selected), reloadShifts(selected)]);
  }, [actor, reloadApps, reloadShifts, selected]);

  React.useEffect(() => {
    void (async () => {
      const access = await checkManagementAccess();
      if (access === 'login') {
        const next = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/login/?next=${next}`;
        return;
      }
      if (access === 'denied') {
        document.body.innerHTML =
          '<main style="padding:2rem;font-family:Inter,sans-serif"><h1>アクセス拒否</h1><p>3D印刷管理アプリを利用する権限がありません。</p><p><a href="/">ダッシュボードに戻る</a></p></main>';
        return;
      }
      try {
        await refreshAll();
        setReady(true);
      } catch (e) {
        showToast(e instanceof Error ? e.message : '読み込みに失敗しました');
      }
    })();
  }, [refreshAll, showToast]);

  React.useEffect(() => {
    if (!ready) return;
    savePrefs({ selected, actor });
  }, [selected, actor, ready]);

  React.useEffect(() => {
    if (!ready) return;
    void reloadApps(selected).catch((e) => showToast(e instanceof Error ? e.message : '読み込み失敗'));
  }, [selected, ready, reloadApps, showToast]);

  React.useEffect(() => {
    if (!ready) return;
    void reloadShifts(selected).catch(() => {});
  }, [selected, ready, reloadShifts]);

  React.useEffect(() => {
    saveIntegrations(integrations);
  }, [integrations]);

  React.useEffect(() => {
    if (!members.find((m) => m.name === actor) && members[0]) setActor(members[0].name);
  }, [members, actor]);

  const actorMemberId = members.find((m) => m.name === actor)?.id;

  const act = async (app: AdminApplication, type: string, payload?: { reason?: { id: string; label: string; body: string }; note?: string }) => {
    const label = `「${app.title}」`;
    try {
      if (type === 'approve') {
        if (!actorMemberId) throw new Error('操作者を選択してください');
        const res = await acceptReservation(app.id, actorMemberId);
        if (res.calendar && !res.calendar.ok) {
          showToast(`確定しましたがカレンダー連携に失敗: ${res.calendar.error ?? ''}`, '注意');
        } else {
          showToast(`${app.title} を確定しました`, '確定');
        }
        pushLog('approve', `${label}を確定`, app.id);
      } else if (type === 'reject') {
        const body = payload?.reason?.body ?? '';
        await patchReservation(app.id, {
          status: 'cancelled',
          status_comment: payload?.note?.trim() || body,
        });
        pushLog('reject', `${label}を却下（${payload?.reason?.label ?? ''}）`, app.id);
        showToast(`${app.title} を却下しました`, payload?.reason?.label);
      } else if (type === 'done') {
        await patchReservation(app.id, { status: 'delivered' });
        pushLog('approve', `${label}を完了に変更`, app.id);
        showToast(`${app.title} を完了にしました`, '完了');
      } else if (type === 'reopen') {
        await patchReservation(app.id, { status: 'applied' });
        pushLog('approve', `${label}を申請中に戻した`, app.id);
        showToast(`${app.title} を申請中に戻しました`);
      } else if (type === 'note') {
        await patchReservation(app.id, { status_comment: payload?.note ?? '' });
        pushLog('approve', `${label}に担当者メモを追加`, app.id);
        showToast('担当者メモを保存しました');
      }
      await reloadApps(selected);
      setDetail(null);
      setDetailMode(null);
    } catch (e) {
      showToast(e instanceof Error ? e.message : '操作に失敗しました');
    }
  };

  const addMemberFull = async (body: { name: string; homeroom: string; student_number: number }) => {
    try {
      await createMember({
        name: body.name,
        homeroom: body.homeroom,
        student_number: body.student_number,
      });
      pushLog('member', `担当者「${body.name}」を追加`, null);
      showToast(`${body.name} を追加しました`);
      await refreshAll();
    } catch (e) {
      showToast(e instanceof Error ? e.message : '追加に失敗しました');
    }
  };

  const renameMember = (_id: string, _name: string) => {
    showToast('名前の変更は API 未対応です（Discord ID・色は従来管理から）');
  };

  const removeMember = async (id: string) => {
    const old = members.find((m) => m.id === id);
    try {
      await deleteMember(id);
      pushLog('member', `担当者「${old?.name ?? id}」を削除`, null);
      showToast(`${old?.name ?? '担当者'} を削除しました`, 'シフト解除');
      await refreshAll();
    } catch (e) {
      showToast(e instanceof Error ? e.message : '削除に失敗しました');
    }
  };

  const applyShiftPlanHandler = async (list: { date: string; memberId: string | null }[]) => {
    try {
      await applyShiftPlan(members, list, availability);
      pushLog('shift', `シフトを一括設定（${list.length}日）`, null);
      showToast(`${list.length}日のシフトを更新しました`);
      await reloadShifts(selected);
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'シフト更新に失敗しました');
    }
  };

  const setShiftDay = async (ds: string, memberId: string | null) => {
    try {
      if (memberId) {
        await applyShiftPlan(members, [{ date: ds, memberId }], availability);
      } else {
        const on = availability.filter((a) => a.date === ds).map((a) => a.member_id);
        for (const mid of on) {
          await setMemberDatesAvailability(mid, [ds], false);
        }
      }
      pushLog('shift', `${ds} の担当を ${memberId ? memberName(members, memberId) : '休み'} に変更`, null);
      await reloadShifts(selected);
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'シフト変更に失敗しました');
    }
  };

  const testDiscord = async () => {
    showToast('Discordへテスト送信しています…');
    try {
      await testDiscordWebhook(integrations);
      showToast('Discordへ送信しました', '成功');
      pushLog('integ', 'Discordへテスト通知を送信', null);
    } catch (e) {
      showToast(e instanceof Error ? e.message : '送信できませんでした');
    }
  };

  const testGcal = async () => {
    try {
      const status = await testGoogleCalendar();
      if (status.ok) {
        showToast('Googleカレンダー接続OK', status.calendarId ?? '');
        pushLog('integ', 'Googleカレンダー接続テスト成功', null);
      } else {
        showToast(status.error ?? '接続に失敗しました');
      }
    } catch (e) {
      showToast(e instanceof Error ? e.message : '接続テストに失敗しました');
    }
  };

  const csv = () => {
    const from = weekStart(parseYmd(selected));
    const to = addDays(from, 27);
    const text = exportCSV(apps, ymd(from), ymd(to), members, shifts);
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `3dprint_${ymd(from)}_${ymd(to)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('CSVを書き出しました', `${mdLabel(from)}–${mdLabel(to)}`);
  };

  if (!ready) {
    return (
      <main className="ad-main" data-testid="management-app" style={{ padding: 24 }}>
        <p>読み込み中…</p>
      </main>
    );
  }

  const pending = pendingQueue(apps);
  const selectedStaff = shifts[selected] ? memberName(members, shifts[selected]) : null;

  const settingsInner = (
    <>
      <SettingsTabs tab={settingsTab} setTab={setSettingsTab} pendingMembers={false} />
      <div className="side-body">
        <SettingsPanel
          tab={settingsTab}
          integrations={integrations}
          setIntegrations={setIntegrations}
          members={members}
          apps={apps}
          shifts={shifts}
          onAddMember={() => {}}
          onAddMemberFull={(b) => void addMemberFull(b)}
          onRenameMember={renameMember}
          onRemoveMember={(id) => void removeMember(id)}
          onApplyShift={(list) => void applyShiftPlanHandler(list)}
          onSetShift={(d, m) => void setShiftDay(d, m)}
          onTestDiscord={() => void testDiscord()}
          onTestGcal={() => void testGcal()}
        />
      </div>
    </>
  );

  return (
    <>
      <Header
        actor={actor}
        setActor={setActor}
        members={members}
        narrow={narrow}
        pendingCount={pending.length}
        onCsv={csv}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="ad-main" data-testid="management-app">
        <div className="head">
          <div style={{ minWidth: 0 }}>
            <span className="badge">校内設備 / 自然科学部 3Dモデル班</span>
            <h1>3Dプリント 依頼管理</h1>
            <AdminSectionNav section={section} onChange={setSection} />
          </div>
          <div className="head-right">
            <button type="button" className="btn btn-secondary btn-lg only-narrow" onClick={() => setSettingsOpen(true)}>
              シフト・メンバー・連携
            </button>
          </div>
        </div>

        {section === 'requests' && (
          <div className="work">
            <div className="col-main">
              <CalAdmin apps={apps} shifts={shifts} selected={selected} onPick={setSelected} members={members} />
              <DayStrip
                apps={apps}
                date={selected}
                staff={selectedStaff}
                onOpenSettings={() => {
                  setSettingsTab('shifts');
                  setSettingsOpen(true);
                }}
              />
              <DayList
                apps={apps}
                date={selected}
                onOpen={(a, mode) => {
                  setDetail(a);
                  setDetailMode(mode ?? null);
                }}
                onAct={(a, type) => void act(a, type)}
              />
            </div>
            {!narrow && (
              <aside className="col-side" aria-label="設定">
                <div className="card side-card">{settingsInner}</div>
              </aside>
            )}
          </div>
        )}

        {section === 'month' && (
          <MonthCalendarPanel
            reservations={allReservations}
            onPickDate={(d) => setForceDate(d)}
            onOpenReservation={(r) => setLegacyDetail(r)}
            onToast={(m) => showToast(m)}
          />
        )}

        {section === 'history' && (
          <HistoryPanel reservations={allReservations} onOpen={(r) => setLegacyDetail(r)} />
        )}

        {section === 'printers' && (
          <PrintersPanel onToast={(m) => showToast(m)} onReload={() => void refreshAll()} />
        )}

        {section === 'shifts' && <ShiftMonthPanel onToast={(m) => showToast(m)} />}
      </main>

      <footer className="ad-footer">
        <div className="footer-in">
          <img src="/apps/3dprint-management/assets/icon-192.png" alt="" />
          <div className="club">
            <b>松山南高校 自然科学部 / 3Dモデル班</b>
            <span>承認・却下は担当者のみ。操作は記録されます。</span>
          </div>
          <div className="right">
            <a href="/apps/3dprint-reservation/">申請フォーム（生徒用）</a>
            <a href="mailto:diorama@mmh-virtual.jp">diorama@mmh-virtual.jp</a>
          </div>
        </div>
      </footer>

      <Drawer open={settingsOpen && narrow} title="設定" sub="シフト・メンバー・外部連携" wide onClose={() => setSettingsOpen(false)}>
        {narrow ? settingsInner : null}
      </Drawer>

      <ReviewSheet
        app={detail}
        log={log}
        onClose={() => {
          setDetail(null);
          setDetailMode(null);
        }}
        onAct={(a, type, payload) => void act(a, type, payload as { reason?: { id: string; label: string; body: string }; note?: string })}
        initialMode={detailMode}
        staffLabel={detail ? selectedStaff : null}
        onToast={(m) => showToast(m)}
      />

      <LegacyReservationDrawer
        reservation={legacyDetail}
        onClose={() => setLegacyDetail(null)}
        onToast={(m) => showToast(m)}
        onUpdated={() => void refreshAll()}
      />

      <ForceReservationModal
        open={!!forceDate}
        date={forceDate ?? ''}
        onClose={() => setForceDate(null)}
        onSaved={() => void refreshAll()}
        onToast={(m) => showToast(m)}
      />

      <Toast toast={toast} />
    </>
  );
}
