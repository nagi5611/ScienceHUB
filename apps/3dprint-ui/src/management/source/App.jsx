/* App.jsx — 管理コンソール本体（カレンダー中心 ＋ 常設サイドバー） */

function useMedia(query) {
  const [match, setMatch] = React.useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  React.useEffect(() => {
    const mq = window.matchMedia(query);
    const on = e => setMatch(e.matches);
    setMatch(mq.matches);
    if (mq.addEventListener) mq.addEventListener('change', on);
    else mq.addListener(on);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', on);
      else mq.removeListener(on);
    };
  }, [query]);
  return match;
}

function App() {
  const prefs = loadPrefs();
  const [members, setMembersState] = React.useState(() => loadMembers());
  const [apps, setApps] = React.useState(() => loadApps());
  const [selected, setSelected] = React.useState(() => prefs.selected || TODAY);
  const [actor, setActor] = React.useState(() => prefs.actor || (loadMembers()[0] || {}).name || '');
  const [shiftsSaved, setShiftsSaved] = React.useState(() => loadShifts() || {});
  const [integrations, setIntegrations] = React.useState(() => loadIntegrations());
  const [log, setLog] = React.useState(() => loadLog());
  const [detail, setDetail] = React.useState(null);
  const [detailMode, setDetailMode] = React.useState(null);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [settingsTab, setSettingsTab] = React.useState('shifts');
  const [toast, setToast] = React.useState(null);

  /* メンバー一覧をドメイン層へ反映してからシフトを組み立てる */
  setMembers(members);
  const shifts = React.useMemo(() => buildShifts(shiftsSaved), [shiftsSaved, members]);
  setShiftMap(shifts);

  React.useEffect(() => { saveMembers(members); }, [members]);
  React.useEffect(() => { saveApps(apps); }, [apps]);
  React.useEffect(() => { savePrefs({ selected, actor }); }, [selected, actor]);
  React.useEffect(() => { saveShifts(shiftsSaved); }, [shiftsSaved]);
  React.useEffect(() => { saveIntegrations(integrations); }, [integrations]);
  React.useEffect(() => { saveLog(log); }, [log]);

  React.useEffect(() => {
    if (!members.find(m => m.name === actor) && members[0]) setActor(members[0].name);
  }, [members]);

  const showToast = React.useCallback((text, mark) => {
    setToast({ text, mark });
    clearTimeout(showToast.t);
    showToast.t = setTimeout(() => setToast(null), 2400);
  }, []);

  const pushLog = React.useCallback((type, text, appId) => {
    setLog(prev => [{ id: 'l' + Date.now() + Math.random().toString(36).slice(2, 5), at: new Date().toISOString(), actor, type, text, appId: appId || null }, ...prev]);
  }, [actor]);

  const openDetail = (app, mode) => { setDetail(app); setDetailMode(mode || null); };
  const closeDetail = () => { setDetail(null); setDetailMode(null); };
  const openSettings = tab => { if (tab) setSettingsTab(tab); setSettingsOpen(true); };

  const act = (app, type, payload) => {
    const label = `「${app.title}」`;
    if (type === 'approve') {
      setApps(prev => prev.map(a => a.id === app.id ? { ...a, status: 'approved', by: actor } : a));
      pushLog('approve', `${label}を確定（${dateLabelW(app.date)}・${KIND[app.kind]}）`, app.id);
      showToast(`${app.title} を確定しました`, '確定');
      if (detail && detail.id === app.id) setDetail(d => ({ ...d, status: 'approved' }));
    } else if (type === 'reject') {
      const body = payload.reason.body;
      setApps(prev => prev.map(a => a.id === app.id
        ? { ...a, status: 'rejected', rejectReason: payload.reason.id, adminNote: payload.note || body, by: actor }
        : a));
      pushLog('reject', `${label}を却下（${payload.reason.label}）`, app.id);
      showToast(`${app.title} を却下しました`, payload.reason.label);
      if (detail && detail.id === app.id) setDetail(d => ({ ...d, status: 'rejected', adminNote: payload.note || body }));
    } else if (type === 'done') {
      setApps(prev => prev.map(a => a.id === app.id ? { ...a, status: 'done', by: actor } : a));
      pushLog('approve', `${label}を完了に変更`, app.id);
      showToast(`${app.title} を完了にしました`, '完了');
      if (detail && detail.id === app.id) setDetail(d => ({ ...d, status: 'done' }));
    } else if (type === 'reopen') {
      setApps(prev => prev.map(a => a.id === app.id ? { ...a, status: 'pending', by: actor } : a));
      pushLog('approve', `${label}を申請中に戻した`, app.id);
      showToast(`${app.title} を申請中に戻しました`);
      if (detail && detail.id === app.id) setDetail(d => ({ ...d, status: 'pending' }));
    } else if (type === 'note') {
      setApps(prev => prev.map(a => a.id === app.id ? { ...a, adminNote: payload.note } : a));
      pushLog('approve', `${label}に担当者メモを追加`, app.id);
      showToast('担当者メモを保存しました');
      if (detail && detail.id === app.id) setDetail(d => ({ ...d, adminNote: payload.note }));
    }
  };

  /* ── メンバー ── */
  const addMember = name => {
    const m = { id: newMemberId(), name };
    setMembersState(prev => [...prev, m]);
    pushLog('member', `担当者「${name}」を追加`, null);
    showToast(`${name} を追加しました`);
  };
  const renameMember = (id, name) => {
    const old = memberById(id);
    setMembersState(prev => prev.map(m => m.id === id ? { ...m, name } : m));
    pushLog('member', `担当者「${old ? old.name : id}」を「${name}」に変更`, null);
    showToast(`名前を「${name}」に変更しました`);
  };
  const removeMember = id => {
    const old = memberById(id);
    setMembersState(prev => prev.filter(m => m.id !== id));
    setShiftsSaved(prev => stripMember(prev, id));
    pushLog('member', `担当者「${old ? old.name : id}」を削除（シフトを休みに変更）`, null);
    showToast(`${old ? old.name : '担当者'} を削除しました`, 'シフト解除');
  };

  /* ── シフト ── */
  const applyShiftPlan = list => {
    setShiftsSaved(prev => {
      const next = { ...prev };
      list.forEach(({ date, memberId }) => { next[date] = memberId; });
      return next;
    });
    const on = list.filter(x => x.memberId);
    const off = list.filter(x => !x.memberId);
    const who = on.length ? memberName(on[0].memberId) : '';
    pushLog('shift', `シフトを一括設定（${list.length}日：${on.length}日${who ? ' ' + who : ''}${off.length ? ' / 休み ' + off.length + '日' : ''}）`, null);
    showToast(`${list.length}日のシフトを更新しました`, who || '休み');
  };
  const setShiftDay = (ds, memberId) => {
    setShiftsSaved(prev => ({ ...prev, [ds]: memberId }));
    pushLog('shift', `${dateLabelW(ds)} の担当を ${memberId ? memberName(memberId) : '休み'} に変更`, null);
  };

  /* ── 連携テスト ── */
  const testDiscord = async () => {
    const url = (integrations.discord.webhook || '').trim();
    if (!url) { showToast('Webhook URLを入力してください'); return; }
    showToast('Discordへテスト送信しています…');
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `${integrations.discord.mention || ''} ScienceHUB 3Dプリント管理のテスト通知です。`.trim(),
          username: 'ScienceHUB 3Dプリント',
        }),
      });
      if (res.ok) { showToast('Discordへ送信しました', '成功'); pushLog('integ', 'Discordへテスト通知を送信', null); }
      else showToast(`送信に失敗しました（HTTP ${res.status}）`);
    } catch (e) {
      showToast('送信できませんでした（URLまたはネットワークを確認）');
    }
  };
  const testGcal = () => {
    const id = (integrations.gcal.calendarId || '').trim();
    if (!id) { showToast('カレンダーIDを入力してください'); return; }
    showToast('カレンダーIDの書式を確認しました', '接続OK');
    pushLog('integ', `Googleカレンダー接続テスト（${id}）`, null);
  };

  const csv = () => {
    const from = weekStart(parseYmd(selected));
    const to = addDays(from, 27);
    const text = exportCSV(apps, ymd(from), ymd(to));
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
  const selectedStaff = shifts[selected] ? memberName(shifts[selected]) : null;
  const narrow = useMedia('(max-width: 1079px)');

  const settingsInner = (
    <>
      <SettingsTabs tab={settingsTab} setTab={setSettingsTab} />
      <div className="side-body">
        <SettingsPanel tab={settingsTab} setTab={setSettingsTab}
          integrations={integrations} setIntegrations={setIntegrations}
          members={members} apps={apps} shifts={shifts}
          onAddMember={addMember} onRenameMember={renameMember} onRemoveMember={removeMember}
          onApplyShift={applyShiftPlan} onSetShift={setShiftDay}
          onTestDiscord={testDiscord} onTestGcal={testGcal} />
      </div>
    </>
  );

  return (
    <>
      <Header actor={actor} setActor={setActor} members={members}
        narrow={narrow}
        pendingCount={pending.length} onCsv={csv} onOpenSettings={() => openSettings()} />

      <main className="ad-main" data-screen-label="管理コンソール">
        <div className="head">
          <div style={{ minWidth: 0 }}>
            <span className="badge">校内設備 / 自然科学部 3Dモデル班</span>
            <h1>3Dプリント 依頼管理</h1>
            <p className="sub">
              日付をクリックすると、その日の申請がすべて下に並びます。<b>依頼</b>（STLを提出して 16:30〜20:00 を使う）と
              <b>予約</b>（時間だけ確保）は色とマークで分けて表示しています。
            </p>
          </div>
          <div className="head-right">
            <button type="button" className="btn btn-secondary btn-lg only-narrow" onClick={() => openSettings()}>
              シフト・メンバー・連携
            </button>
          </div>
        </div>

        <div className="work">
          <div className="col-main">
            <CalAdmin apps={apps} shifts={shifts} selected={selected} onPick={setSelected} />
            <DayStrip apps={apps} date={selected} staff={selectedStaff} onOpenSettings={() => openSettings('shifts')} />
            <DayList apps={apps} date={selected} onOpen={openDetail} onAct={act} />
          </div>

          {!narrow && (
            <aside className="col-side" aria-label="設定">
              <div className="card side-card">
                {settingsInner}
              </div>
            </aside>
          )}
        </div>
      </main>

      <footer className="ad-footer">
        <div className="footer-in">
          <img src={LOGO} alt="" />
          <div className="club">
            <b>松山南高校 自然科学部 / 3Dモデル班</b>
            <span>承認・却下は担当者のみ。操作は記録されます。</span>
          </div>
          <div className="right">
            <a href="../3Dプリント予約.html" target="_top">申請フォーム（生徒用）</a>
            <a href="mailto:diorama@mmh-virtual.jp">diorama@mmh-virtual.jp</a>
            <button type="button" className="linkbtn"
              onClick={() => { if (confirm('デモ用のデータを初期状態に戻します。よろしいですか？')) { localStorage.clear(); location.reload(); } }}>
              データを初期化
            </button>
          </div>
        </div>
      </footer>

      <Drawer open={settingsOpen && narrow} title="設定" sub="シフト・メンバー・外部連携" wide
        onClose={() => setSettingsOpen(false)}>
        {narrow ? settingsInner : null}
      </Drawer>

      <SettingsDialog open={settingsOpen && !narrow} onClose={() => setSettingsOpen(false)}>
        {settingsInner}
      </SettingsDialog>

      <ReviewSheet app={detail} actor={actor} log={log} onClose={closeDetail} onAct={act} initialMode={detailMode} />
      <Toast toast={toast} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
