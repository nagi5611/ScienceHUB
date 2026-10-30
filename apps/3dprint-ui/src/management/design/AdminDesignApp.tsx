import React from 'react';
import {
  WD,
  ymd,
  parseYmd,
  addDays,
  weekStart,
  mdLabel,
  TODAY,
  slotStart,
  minsLabel,
  SLOT_MIN,
  STATUS,
  KIND,
  setMembers,
  setAvailability,
  memberById,
  memberName,
  pendingQueue,
  slotListOf,
  loadPrefs,
  savePrefs,
  loadLog,
  saveLog,
  loadIntegrations,
  saveIntegrations,
} from '../admin-design-domain';
import { dateLabel, dateLabelW } from '../admin-domain';
import {
  calendarRangeForSelected,
  mapAdminAppToDesign,
  designStatusToDbStatus,
  availabilityRowsToMemberAvail,
  memberAvailToRows,
  mergeMonthMemberAvailability,
  resolveOperatorStaffMemberId,
  formatOperatorDisplayLabel,
  toDesignMembers,
  colorIndexFromDesign,
  applicationsToCsv,
  defaultIntegrationsState,
  type DesignApplication,
  type DesignMember,
} from '../admin-bridge';
import {
  acceptReservation,
  patchReservation,
  rescheduleReservation,
  splitApplicationSlots,
  fetchApplicationsRange,
  fetchCancelledApplicationsRange,
  restoreAdminReservation,
  fetchMembers,
  createMember,
  deleteMember,
  fetchShifts,
  applyShiftAvailabilityDraft,
  hasShiftDraftChanges,
  patchMemberColor,
  patchMemberDiscord,
  fetchIntegrationsStatus,
  testDiscordIntegration,
  testDiscordMention,
  testGoogleCalendar,
  testAdminEmail,
  appendAdminLog,
  fetchAdminLog,
  fetchManagementSession,
  patchMemberUserLink,
  type ManagementSession,
} from '../admin-api';
import { LOGO, Header, Toast, downloadAppFile, downloadDay } from './AdminDesignUi';
import { ReserveScreen, AppSheet } from './ReserveScreen';
import { MoveDialog } from './MoveDialog';
import { SettingsScreen } from './SettingsScreen';
import { AdminOpsScreen } from './AdminOpsScreen';

export function AdminDesignApp() {
  const prefs = loadPrefs();
  const [loading, setLoading] = React.useState(true);
  const [members, setMembersState] = React.useState<DesignMember[]>([]);
  const [apps, setApps] = React.useState<DesignApplication[]>([]);
  const [avail, setAvail] = React.useState<Record<string, string[]>>({});
  const [savedAvail, setSavedAvail] = React.useState<Record<string, string[]>>({});
  const [shiftApplying, setShiftApplying] = React.useState(false);
  const [screen, setScreen] = React.useState(() => prefs.screen || 'reserve');
  const [selected, setSelected] = React.useState(() => prefs.selected || TODAY);
  const [operatorSession, setOperatorSession] = React.useState<ManagementSession | null>(null);
  const [integrations, setIntegrations] = React.useState(() => loadIntegrations() ?? defaultIntegrationsState());
  const [log, setLog] = React.useState(() => loadLog());
  const [detail, setDetail] = React.useState<DesignApplication | null>(null);
  const [detailMode, setDetailMode] = React.useState<string | null>(null);
  const [moving, setMoving] = React.useState<DesignApplication | null>(null);
  const [settingsPre, setSettingsPre] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState<{ text: string; mark?: string } | null>(null);
  const [emailConfigured, setEmailConfigured] = React.useState(false);
  const [discordConfigured, setDiscordConfigured] = React.useState(false);

  const syncGlobals = React.useCallback((m: DesignMember[], a: Record<string, string[]>) => {
    setMembers(m);
    setAvailability(a);
  }, []);

  const reloadApps = React.useCallback(async (anchor: string) => {
    const { from, to } = calendarRangeForSelected(anchor);
    const [{ applications }, cancelled] = await Promise.all([
      fetchApplicationsRange(from, to),
      fetchCancelledApplicationsRange(from, to),
    ]);
    const merged = new Map<string, DesignApplication>();
    for (const row of applications) merged.set(row.id, mapAdminAppToDesign(row));
    for (const row of cancelled.applications) merged.set(row.id, mapAdminAppToDesign(row));
    setApps([...merged.values()]);
  }, []);

  const refreshAll = React.useCallback(async () => {
    const memberRows = await fetchMembers();
    const designMembers = toDesignMembers(memberRows);
    setMembersState(designMembers);
    const d = parseYmd(selected);
    const shiftData = await fetchShifts(d.getFullYear(), d.getMonth() + 1);
    const a = availabilityRowsToMemberAvail(shiftData.availability);
    setAvail(a);
    setSavedAvail(a);
    syncGlobals(designMembers, a);
    try {
      setOperatorSession(await fetchManagementSession());
    } catch {
      /* session optional until API ready */
    }
    await reloadApps(selected);
    try {
      const status = await fetchIntegrationsStatus();
      setEmailConfigured(Boolean(status.email.configured));
      setDiscordConfigured(Boolean(status.discord.configured));
      setIntegrations((prev) => ({
        ...prev,
        discord: { ...prev.discord, webhook: status.discord.configured ? '(サーバー設定)' : '' },
        gcal: { ...prev.gcal, calendarId: status.gcal.configured ? '(サーバー設定)' : '' },
      }));
    } catch {
      /* optional */
    }
    try {
      const remoteLog = await fetchAdminLog(80);
      if (remoteLog.log?.length) {
        setLog(
          remoteLog.log.map((l) => ({
            id: l.id,
            at: l.at,
            actor: l.actor,
            type: l.type,
            text: l.text,
            appId: l.app_id,
          }))
        );
      }
    } catch {
      /* optional */
    }
  }, [reloadApps, selected, syncGlobals]);

  React.useEffect(() => {
    void (async () => {
      try {
        await refreshAll();
      } catch (e) {
        showToastRef.current(e instanceof Error ? e.message : '読み込みに失敗しました', 'エラー');
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshAll]);

  React.useEffect(() => {
    if (loading) return;
    const params = new URLSearchParams(window.location.search);
    const sel = params.get('selected');
    const appId = params.get('app');
    if (sel && /^\d{4}-\d{2}-\d{2}$/.test(sel)) setSelected(sel);
    if (appId) {
      const found = apps.find((a) => a.id === appId);
      if (found) {
        setSelected(found.date);
        setDetail(found);
        setDetailMode('view');
      }
    }
  }, [loading, apps]);

  React.useEffect(() => {
    savePrefs({ screen, selected });
  }, [screen, selected]);
  React.useEffect(() => {
    saveIntegrations(integrations);
  }, [integrations]);
  React.useEffect(() => {
    saveLog(log);
  }, [log]);

  const operatorLabel = operatorSession ? formatOperatorDisplayLabel(operatorSession) : '—';

  const showToastRef = React.useRef<(text: string, mark?: string) => void>(() => {});
  const showToast = React.useCallback((text: string, mark?: string) => {
    setToast({ text, mark });
    window.setTimeout(() => setToast(null), 2600);
  }, []);
  showToastRef.current = showToast;

  const pushLog = React.useCallback(
    (type: string, text: string, appId: string | null = null) => {
      setLog((prev) => [
        {
          id: 'l' + Date.now() + Math.random().toString(36).slice(2, 5),
          at: new Date().toISOString(),
          actor: operatorLabel,
          type,
          text,
          appId,
        },
        ...prev,
      ]);
      void appendAdminLog({ type, text, app_id: appId }).catch(() => {});
    },
    [operatorLabel]
  );

  const openDetail = (app: DesignApplication, mode?: string | null) => {
    setDetail(app);
    setDetailMode(mode ?? null);
  };
  const closeDetail = () => {
    setDetail(null);
    setDetailMode(null);
  };

  const patchLocalApp = (id: string, patch: Partial<DesignApplication>) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    setDetail((d) => (d && d.id === id ? { ...d, ...patch } : d));
  };

  const setStatusAll = async (app: DesignApplication, status: DesignApplication['status'] | null, extra?: Record<string, unknown>, note?: string) => {
    if (note !== undefined && status === null) {
      try {
        await patchReservation(app.id, { status_comment: note });
        patchLocalApp(app.id, { adminNote: note });
        pushLog('approve', `「${app.title}」に担当者メモを追加`, app.id);
        showToast('担当者メモを保存しました');
      } catch (e) {
        showToast(e instanceof Error ? e.message : '保存に失敗しました', 'エラー');
      }
      return;
    }
    if (!status) return;
    const staffId = resolveOperatorStaffMemberId(
      members,
      operatorSession?.linked_member?.id ?? null
    );
    try {
      if (status === 'approved' && app.status === 'pending') {
        if (!staffId) {
          throw new Error(
            '予約を受領するには、担当者タブで ScienceHUB アカウントと印刷担当者を紐づけてください'
          );
        }
        await acceptReservation(app.id, staffId);
      } else if (app.status === 'cancelled' && status === 'pending') {
        await restoreAdminReservation(app.id);
      } else {
        await patchReservation(app.id, { status: designStatusToDbStatus(status) });
      }
      patchLocalApp(app.id, { status, ...(extra || {}), by: operatorLabel });
      const label = STATUS[status];
      pushLog(status === 'cancelled' ? 'cancel' : 'approve', `「${app.title}」を${label}（${dateLabelW(app.date)}・${KIND[app.kind]}）`, app.id);
      showToast(`${app.title} を${label}にしました`, label);
      await reloadApps(selected);
    } catch (e) {
      showToast(e instanceof Error ? e.message : '更新に失敗しました', 'エラー');
    }
  };

  const setStatusPartial = async (
    app: DesignApplication,
    slots: number[],
    status: DesignApplication['status'],
    extra?: Record<string, unknown>
  ) => {
    const all = slotListOf(app);
    const whole = slots.length === all.length;
    if (whole) {
      await setStatusAll(app, status, extra);
      return;
    }
    try {
      await splitApplicationSlots(app.id, {
        slot_indexes: slots,
        target_status: status,
      });
      const label = STATUS[status];
      const range = `${minsLabel(slotStart(slots[0]))}〜${minsLabel(slotStart(slots[slots.length - 1]) + SLOT_MIN)}`;
      pushLog(status === 'cancelled' ? 'cancel' : 'approve', `「${app.title}」の ${range}（${slots.length}枠）を${label}`, app.id);
      showToast(`${range} を${label}にしました`, `${slots.length}枠`);
      closeDetail();
      await reloadApps(selected);
    } catch (e) {
      showToast(e instanceof Error ? e.message : '部分更新に失敗しました', 'エラー');
    }
  };

  const cancelAll = async (
    app: DesignApplication,
    reason: { id: string; body: string } | null,
    note: string,
    mode: string
  ) => {
    if (mode === 'note') {
      await setStatusAll(app, null, undefined, note);
      return;
    }
    if (mode === 'approved' || mode === 'pending' || mode === 'done') {
      await setStatusAll(app, mode as DesignApplication['status']);
      return;
    }
    const adminNote = reason
      ? note || reason.body
      : note;
    await setStatusAll(app, 'cancelled', reason ? { rejectReason: reason.id, adminNote } : { adminNote });
  };

  const moveTo = async (app: DesignApplication, ds: string, meta?: { forced?: boolean }) => {
    if (!ds || ds === app.date) return;
    const from = app.date;
    try {
      await rescheduleReservation(app.id, ds, Boolean(meta?.forced));
      pushLog(
        'move',
        `「${app.title}」を ${dateLabelW(from)} → ${dateLabelW(ds)} に変更（${KIND[app.kind]}${meta?.forced ? '・強制' : ''}）`,
        app.id
      );
      showToast(`${app.title} を ${dateLabel(ds)} に変更しました`, meta?.forced ? '強制' : KIND[app.kind]);
      setSelected(ds);
      setMoving(null);
      closeDetail();
      await reloadApps(ds);
    } catch (e) {
      showToast(e instanceof Error ? e.message : '移動に失敗しました', 'エラー');
    }
  };

  const addMember = async (data: { name: string; hr: string; num: number; discord: string; color: string }) => {
    try {
      await createMember({
        name: data.name,
        homeroom: data.hr,
        student_number: data.num,
        discord_user_id: data.discord || null,
      });
      await refreshAll();
      pushLog('member', `担当者「${data.name}」を追加`, null);
      showToast(`${data.name} を追加しました`);
    } catch (e) {
      showToast(e instanceof Error ? e.message : '追加に失敗しました', 'エラー');
    }
  };

  const updateMember = async (
    id: string,
    data: { name: string; hr: string; num: number; discord: string; color: string; hubUserId: string | null }
  ) => {
    try {
      await patchMemberColor(id, colorIndexFromDesign(data.color));
      await patchMemberDiscord(id, data.discord.trim() || null);
      await patchMemberUserLink(id, data.hubUserId);
      await refreshAll();
      try {
        setOperatorSession(await fetchManagementSession());
      } catch {
        /* ignore */
      }
      const old = memberById(id);
      pushLog('member', `担当者「${old ? old.name : id}」を更新`, null);
      showToast(`${data.name} を更新しました`);
    } catch (e) {
      showToast(e instanceof Error ? e.message : '更新に失敗しました', 'エラー');
    }
  };

  const removeMember = async (id: string) => {
    try {
      const old = memberById(id);
      await deleteMember(id);
      await refreshAll();
      pushLog('member', `担当者「${old ? old.name : id}」を削除（シフトも削除）`, null);
      showToast(`${old ? old.name : '担当者'} を削除しました`);
    } catch (e) {
      showToast(e instanceof Error ? e.message : '削除に失敗しました', 'エラー');
    }
  };

  const paintAvail = (mId: string, dates: string[], on: boolean) => {
    setAvail((prev) => {
      const cur = new Set(prev[mId] || []);
      dates.forEach((ds) => (on ? cur.add(ds) : cur.delete(ds)));
      const next = { ...prev, [mId]: [...cur].sort() };
      setAvailability(next);
      return next;
    });
  };

  const shiftDraftPending = hasShiftDraftChanges(
    memberAvailToRows(savedAvail),
    memberAvailToRows(avail),
    [],
    []
  );

  const discardShiftDraft = () => {
    const next: Record<string, string[]> = {};
    for (const [id, dates] of Object.entries(savedAvail)) next[id] = [...dates];
    setAvail(next);
    setAvailability(next);
  };

  const confirmShiftDraft = async () => {
    if (!shiftDraftPending || shiftApplying) return;
    setShiftApplying(true);
    try {
      await applyShiftAvailabilityDraft(
        memberAvailToRows(savedAvail),
        memberAvailToRows(avail),
        [],
        []
      );
      setSavedAvail(() => {
        const next: Record<string, string[]> = {};
        for (const [id, dates] of Object.entries(avail)) next[id] = [...dates];
        return next;
      });
      pushLog('shift', 'シフト表を一括保存', null);
      showToast('シフトを保存しました', '確定');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'シフト保存に失敗しました', 'エラー');
      await refreshAll();
    } finally {
      setShiftApplying(false);
    }
  };

  const loadSettingsShiftMonth = React.useCallback(
    async (year: number, month: number) => {
      try {
        const shiftData = await fetchShifts(year, month);
        const merge = (prev: Record<string, string[]>) =>
          mergeMonthMemberAvailability(prev, shiftData.availability, year, month);
        setSavedAvail((prev) => merge(prev));
        setAvail((prev) => {
          const next = merge(prev);
          setAvailability(next);
          return next;
        });
      } catch (e) {
        showToastRef.current(e instanceof Error ? e.message : 'シフト読込に失敗しました', 'エラー');
      }
    },
    []
  );

  const testDiscord = async () => {
    showToast('Discordへテスト送信しています…');
    try {
      await testDiscordIntegration();
      pushLog('integ', 'Discordへテスト通知を送信', null);
      showToast('Discordへ送信しました', '成功');
    } catch (e) {
      showToast(e instanceof Error ? e.message : '送信に失敗しました', 'エラー');
    }
  };

  const testDiscordMentionFor = async (memberIds: string[]) => {
    const result = await testDiscordMention(memberIds);
    const names = result.sent.map((m) => m.name).join('・');
    pushLog('integ', `Discordメンションテスト: ${names}`, null);
    return result;
  };

  const testGcal = async () => {
    try {
      const res = await testGoogleCalendar();
      if (res.ok) {
        pushLog('integ', 'Googleカレンダー接続テスト成功', null);
        showToast('Googleカレンダーに接続できました', '接続OK');
      } else showToast(res.error || '接続に失敗しました', 'エラー');
    } catch (e) {
      showToast(e instanceof Error ? e.message : '接続テストに失敗しました', 'エラー');
    }
  };

  const testEmail = async (to: string) => {
    const result = await testAdminEmail(to);
    pushLog('integ', `テストメールを ${result.to} に送信`, null);
    return result;
  };

  const csv = () => {
    const from = weekStart(parseYmd(selected));
    const to = addDays(from, 27);
    const text = applicationsToCsv(apps, ymd(from), ymd(to), members.map((m) => ({ id: m.id, name: m.name })));
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

  const pending = pendingQueue(apps);

  if (loading) {
    return (
      <main className="main-content" style={{ padding: '2rem' }}>
        <p>読み込み中…</p>
      </main>
    );
  }

  return (
    <>
      <Header
        screen={screen}
        setScreen={setScreen}
        operatorSession={operatorSession}
        pendingCount={pending.length}
        onCsv={csv}
      />

      <main className="main-content" data-testid="management-app">
        <div className="page-head">
          <div style={{ minWidth: 0 }}>
            <span className="badge">自然科学部 3Dモデル班</span>
            <h1 className="page-heading">
              {screen === 'reserve'
                ? '3Dプリント 申請の管理'
                : screen === 'settings'
                  ? 'シフト・担当者・外部連携'
                  : '運用（プリンター・履歴）'}
            </h1>
          </div>
        </div>

        {screen === 'reserve' ? (
          <ReserveScreen
            apps={apps}
            selected={selected}
            onPick={setSelected}
            onOpen={openDetail}
            onApprove={(a) => void setStatusAll(a, 'approved')}
            onCancel={(a, r, n, m) => void cancelAll(a, r, n, m)}
            onPartial={(a, s, st, ex) => void setStatusPartial(a, s, st, ex)}
            log={log}
            onDownload={(a, mode) => {
              if (mode === 'file') {
                window.open(`/api/3dprint/admin/stl/${a.id}`, '_blank');
              } else {
                downloadAppFile(a, mode);
              }
              showToast(`${a.title} をダウンロードしました`, mode === 'file' ? a.file : '申請書');
            }}
            onDownloadAll={(ds) => {
              const n = downloadDay(apps, ds);
              showToast(`${dateLabelW(ds)} の申請 ${n}件を書き出しました`, '一括DL');
            }}
            onMove={(a) => setMoving(a)}
          />
        ) : screen === 'settings' ? (
          <SettingsScreen
            members={members}
            avail={avail}
            onAddMember={(d) => void addMember(d)}
            onUpdateMember={(id, d) => void updateMember(id, d)}
            onRemoveMember={(id) => void removeMember(id)}
            onPaintAvail={paintAvail}
            shiftDraftPending={shiftDraftPending}
            shiftApplying={shiftApplying}
            onConfirmShiftDraft={() => void confirmShiftDraft()}
            onDiscardShiftDraft={discardShiftDraft}
            onLoadShiftMonth={loadSettingsShiftMonth}
            integrations={integrations}
            setIntegrations={setIntegrations}
            onTestDiscord={() => void testDiscord()}
            onTestDiscordMention={testDiscordMentionFor}
            onTestGcal={() => void testGcal()}
            onTestEmail={testEmail}
            emailConfigured={emailConfigured}
            discordConfigured={discordConfigured}
            log={log}
            pendingPre={settingsPre}
          />
        ) : (
          <AdminOpsScreen showToast={showToast} />
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <img src={LOGO} alt="" />
          <div className="club">
            <b>松山南高校 自然科学部 / 3Dモデル班</b>
            <span>承認・取り消しは担当者のみ。操作は記録されます。</span>
          </div>
          <div className="right">
            <a href="/apps/3dprint-reservation/">申請フォーム（生徒用）</a>
            <a href="mailto:diorama@mmh-virtual.jp">diorama@mmh-virtual.jp</a>
          </div>
        </div>
      </footer>

      <AppSheet
        app={detail}
        log={log}
        onClose={closeDetail}
        onPartial={(a, s, st, ex) => void setStatusPartial(a, s, st, ex)}
        onCancelAll={(a, r, n, m) => void cancelAll(a, r, n, m)}
        onMove={(a) => setMoving(a)}
      />

      <MoveDialog open={!!moving} app={moving} apps={apps} onClose={() => setMoving(null)} onMove={moveTo} />
      <Toast toast={toast} />
    </>
  );
}
