import React from 'react';
import {
  WD, pad2, ymd, parseYmd, addDays, startOfDay, isWeekday, weekStart, mdLabel, TODAY, todayDate,
  dateLabel, dateLabelW, slotStart, minsLabel, durationLabel, slotIndex, spanOf, hrLabel,
  DAY_START, DAY_END, SLOT_MIN, SLOT_COUNT, SHIFT_START, SHIFT_END, SHIFT_SLOT_START, SHIFT_SLOTS,
  STATUS, KIND, MACHINE_STATE, MACHINE_IDS, MACHINE_MAP, MACHINES,
  CANCEL_REASONS, REJECT_REASONS, NOTE_TEMPLATES, HR_LIST, MEMBER_COLORS,
  setMembers, getMembers, memberById, memberName, memberColor, memberLabel, newMemberId, nextColor,
  setAvailability, getAvailability, isAvailable, staffIdsOn, staffNamesOn, defaultAvailability,
  planShiftRule, toggleAvailability, setManyAvailability, stripMemberAvailability, memberDatesInRange,
  seedApps, pendingQueue, isLate, activeStatus, dayOcc, daySummary,
  moveCheck, moveAppTo, monthGrid,
  readJSON, writeJSON, K, loadApps, saveApps, loadMembers, saveMembers, loadAvail, saveAvail,
  loadPrefs, savePrefs, loadLog, saveLog, DEFAULT_INTEG, loadIntegrations, saveIntegrations,
  loadPrinters, savePrinters, exportCSV,
  slotListOf, splitOffSlots, splitWithStatus,
} from '../admin-design-domain';
import { LOGO, Header, Toast, downloadAppFile, downloadDay } from './AdminDesignUi';
import { ReserveScreen, AppSheet } from './ReserveScreen';
import { MoveDialog } from './MoveDialog';
import { SettingsScreen } from './SettingsScreen';

export function AdminDesignApp() {
  const prefs = loadPrefs();
  const [members, setMembersState] = React.useState(() => loadMembers());
  setMembers(members);

  const [apps, setApps] = React.useState(() => loadApps());
  const [avail, setAvail] = React.useState(() => loadAvail(members));
  setAvailability(avail);

  const [screen, setScreen] = React.useState(() => prefs.screen || 'reserve');
  const [selected, setSelected] = React.useState(() => prefs.selected || TODAY);
  const [actor, setActor] = React.useState(() => prefs.actor || (loadMembers()[0] || {}).name || '');
  const [integrations, setIntegrations] = React.useState(() => loadIntegrations());
  const [log, setLog] = React.useState(() => loadLog());
  const [detail, setDetail] = React.useState(null);
  const [detailMode, setDetailMode] = React.useState(null);
  const [moving, setMoving] = React.useState(null);
  const [settingsPre, setSettingsPre] = React.useState(null);
  const [toast, setToast] = React.useState(null);

  React.useEffect(() => { saveMembers(members); }, [members]);
  React.useEffect(() => { saveApps(apps); }, [apps]);
  React.useEffect(() => { saveAvail(avail); }, [avail]);
  React.useEffect(() => { savePrefs({ screen, selected, actor }); }, [screen, selected, actor]);
  React.useEffect(() => { saveIntegrations(integrations); }, [integrations]);
  React.useEffect(() => { saveLog(log); }, [log]);

  React.useEffect(() => {
    if (!members.find(m => m.name === actor) && members[0]) setActor(members[0].name);
  }, [members]);

  const showToast = React.useCallback((text, mark) => {
    setToast({ text, mark });
    clearTimeout(showToast.t);
    showToast.t = setTimeout(() => setToast(null), 2600);
  }, []);

  const pushLog = React.useCallback((type, text, appId) => {
    setLog(prev => [{
      id: 'l' + Date.now() + Math.random().toString(36).slice(2, 5),
      at: new Date().toISOString(), actor, type, text, appId: appId || null,
    }, ...prev]);
  }, [actor]);

  const openDetail = (app, mode) => { setDetail(app); setDetailMode(mode || null); };
  const closeDetail = () => { setDetail(null); setDetailMode(null); };

  /* ── 申請の状態変更（全体 / 時間単位） ── */
  const replaceApp = (id, nextList) => {
    setApps(prev => prev.flatMap(a => (a.id === id ? nextList : [a])));
  };

  const setStatusAll = (app, status, extra, note) => {
    if (note !== undefined && status === null) {
      setApps(prev => prev.map(a => a.id === app.id ? { ...a, adminNote: note } : a));
      pushLog('approve', `「${app.title}」に担当者メモを追加`, app.id);
      showToast('担当者メモを保存しました');
      setDetail(d => (d && d.id === app.id ? { ...d, adminNote: note } : d));
      return;
    }
    setApps(prev => prev.map(a => (a.id === app.id ? { ...a, status, ...(extra || {}), by: actor } : a)));
    const label = STATUS[status];
    pushLog(status === 'cancelled' ? 'cancel' : 'approve', `「${app.title}」を${label}（${dateLabelW(app.date)}・${KIND[app.kind]}）`, app.id);
    showToast(`${app.title} を${label}にしました`, label);
    setDetail(d => (d && d.id === app.id ? { ...d, status, ...(extra || {}) } : d));
  };

  /* 指定枠だけを status に。残りは元の状態で分割して残す。 */
  const setStatusPartial = (app, slots, status, extra) => {
    const all = slotListOf(app);
    const whole = slots.length === all.length;
    if (whole) { setStatusAll(app, status, extra); return; }
    const parts = splitWithStatus(app, slots, status, extra);
    setApps(prev => prev.flatMap(a => (a.id === app.id ? parts : [a])));
    const label = STATUS[status];
    const range = `${minsLabel(slotStart(slots[0]))}〜${minsLabel(slotStart(slots[slots.length - 1]) + SLOT_MIN)}`;
    pushLog(status === 'cancelled' ? 'cancel' : 'approve',
      `「${app.title}」の ${range}（${slots.length}枠）を${label}`, app.id);
    showToast(`${range} を${label}にしました`, `${slots.length}枠`);
    setDetail(d => (d && d.id === app.id ? null : d));
  };

  /* 全体取り消し（理由つき） */
  const cancelAll = (app, reason, note, mode) => {
    if (mode === 'note') { setStatusAll(app, null, null, note); return; }
    if (mode === 'approved' || mode === 'pending' || mode === 'done') {
      setStatusAll(app, mode); return;
    }
    const extra = reason
      ? (reason.id === 'stl' || reason.id === 'size' || reason.id === 'deadline' || reason.id === 'time'
        ? { rejectReason: reason.id, adminNote: note || reason.body }
        : { cancelReason: reason.id, adminNote: note || reason.body })
      : {};
    setStatusAll(app, 'cancelled', extra);
  };

  /* ── 別の日へ変更 ── */
  const moveTo = (app, ds, meta) => {
    if (!ds || ds === app.date) return;
    const from = app.date;
    setApps(prev => prev.map(a => (a.id === app.id ? { ...a, date: ds, by: actor } : a)));
    pushLog('move', `「${app.title}」を ${dateLabelW(from)} → ${dateLabelW(ds)} に変更（${KIND[app.kind]}${meta && meta.forced ? '・強制' : ''}）`, app.id);
    showToast(`${app.title} を ${dateLabel(ds)} に変更しました`, meta && meta.forced ? '強制' : KIND[app.kind]);
    setSelected(ds);
    setDetail(d => (d && d.id === app.id ? { ...d, date: ds } : d));
    setMoving(null);
  };

  /* ── メンバー ── */
  const addMember = data => {
    const m = { id: newMemberId(), ...data };
    setMembersState(prev => [...prev, m]);
    setAvail(prev => ({ ...prev, [m.id]: [] }));
    pushLog('member', `担当者「${m.name}」を追加`, null);
    showToast(`${m.name} を追加しました`);
  };
  const updateMember = (id, data) => {
    const old = memberById(id);
    setMembersState(prev => prev.map(m => (m.id === id ? { ...m, ...data } : m)));
    pushLog('member', `担当者「${old ? old.name : id}」を更新`, null);
    showToast(`${data.name} を更新しました`);
  };
  const removeMember = id => {
    const old = memberById(id);
    setMembersState(prev => prev.filter(m => m.id !== id));
    setAvail(prev => stripMemberAvailability(prev, id));
    pushLog('member', `担当者「${old ? old.name : id}」を削除（シフトも削除）`, null);
    showToast(`${old ? old.name : '担当者'} を削除しました`);
  };

  /* ── シフト ── */
  const paintAvail = (mId, dates, on) => {
    setAvail(prev => setManyAvailability(prev, mId, dates, on));
    pushLog('shift', `${memberName(mId)} のシフトを${on ? '追加' : '削除'}（${dates.length}日）`, null);
    showToast(`${dates.length}日のシフトを${on ? '追加' : '削除'}しました`, memberName(mId));
  };
  const setOneAvail = (mId, ds, on) => {
    setAvail(prev => setManyAvailability(prev, mId, [ds], on));
    pushLog('shift', `${dateLabelW(ds)} の ${memberName(mId)} を${on ? '追加' : '削除'}`, null);
  };

  /* ── 連携 ── */
  const testDiscord = async () => {
    const url = (integrations.discord.webhook || '').trim();
    if (!url) { showToast('Webhook URLを入力してください'); return; }
    showToast('Discordへテスト送信しています…');
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'ScienceHUB 3Dプリント管理のテスト通知です。', username: 'ScienceHUB 3Dプリント' }),
      });
      if (res.ok) { pushLog('integ', 'Discordへテスト通知を送信', null); showToast('Discordへ送信しました', '成功'); }
      else showToast(`送信に失敗しました（HTTP ${res.status}）`);
    } catch (e) {
      showToast('送信できませんでした（URLまたはネットワークを確認）');
    }
  };
  const testGcal = () => {
    const id = (integrations.gcal.calendarId || '').trim();
    if (!id) { showToast('カレンダーIDを入力してください'); return; }
    pushLog('integ', `Googleカレンダー接続テスト（${id}）`, null);
    showToast('カレンダーIDの書式を確認しました', '接続OK');
  };

  const csv = () => {
    const from = weekStart(parseYmd(selected));
    const to = addDays(from, 27);
    const text = exportCSV(apps, ymd(from), ymd(to), members);
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `3dprint_${ymd(from)}_${ymd(to)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('CSVを書き出しました', `${mdLabel(from)}–${mdLabel(to)}`);
  };

  const pending = pendingQueue(apps);

  return (
    <>
      <Header screen={screen} setScreen={setScreen} actor={actor} setActor={setActor}
        members={members} pendingCount={pending.length} onCsv={csv} />

      <main className="main-content">
        <div className="page-head">
          <div style={{ minWidth: 0 }}>
            <span className="badge">校内設備 / 自然科学部 3Dモデル班</span>
            <h1 className="page-heading">{screen === 'reserve' ? '3Dプリント 申請の管理' : 'シフト・担当者・外部連携'}</h1>
          </div>
          {screen === 'reserve' && (
            <div className="head-right">
              <button type="button" className="btn btn-secondary" onClick={() => setScreen('settings')}>
                シフト・設定
              </button>
            </div>
          )}
        </div>

        {screen === 'reserve' ? (
          <ReserveScreen apps={apps} selected={selected} onPick={setSelected}
            onOpen={openDetail}
            onApprove={a => setStatusAll(a, 'approved')}
            onCancel={cancelAll}
            onPartial={setStatusPartial}
            log={log}
            onDownload={(a, mode) => { downloadAppFile(a, mode); showToast(`${a.title} をダウンロードしました`, mode === 'file' ? a.file : '申請書'); }}
            onDownloadAll={ds => { const n = downloadDay(apps, ds); showToast(`${dateLabelW(ds)} の申請 ${n}件を書き出しました`, '一括DL'); }}
            onMove={a => setMoving(a)} />
        ) : (
          <SettingsScreen members={members} avail={avail}
            onAddMember={addMember} onUpdateMember={updateMember} onRemoveMember={removeMember}
            onSetAvail={setOneAvail} onPaintAvail={paintAvail}
            integrations={integrations} setIntegrations={setIntegrations}
            onTestDiscord={testDiscord} onTestGcal={testGcal}
            log={log} pendingPre={settingsPre} />
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
            <button type="button" className="linkbtn"
              onClick={() => { if (confirm('デモ用のデータを初期状態に戻します。よろしいですか？')) { localStorage.clear(); location.reload(); } }}>
              データを初期化
            </button>
          </div>
        </div>
      </footer>

      <AppSheet app={detail} log={log} onClose={closeDetail}
        onPartial={setStatusPartial} onCancelAll={cancelAll} onMove={a => setMoving(a)} />

      <MoveDialog open={!!moving} app={moving} apps={apps}
        onClose={() => setMoving(null)} onMove={moveTo} />
      <Toast toast={toast} />
    </>
  );
}
