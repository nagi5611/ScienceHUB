/* App.jsx — 状態管理とレイアウト */

function App() {
  const todayStr = ymd(startOfDay(new Date()));
  const prefs = loadPrefs();

  const [apps, setApps] = React.useState(() => loadApps());
  const [selected, setSelected] = React.useState(() => prefs.selected || todayStr);
  const [selection, setSelection] = React.useState(null);
  const [profile, setProfileState] = React.useState(() => loadProfile());
  const [toast, setToast] = React.useState(null);

  const [form, setForm] = React.useState({ open: false, draft: null });
  const [detail, setDetail] = React.useState(null);
  const [mineOpen, setMineOpen] = React.useState(false);

  React.useEffect(() => { saveApps(apps); }, [apps]);
  React.useEffect(() => { savePrefs({ selected }); }, [selected]);

  const showToast = React.useCallback((text, mark) => {
    setToast({ text, mark });
    clearTimeout(showToast.t);
    showToast.t = setTimeout(() => setToast(null), 2400);
  }, []);

  const info = React.useMemo(() => computeDay(apps, selected), [apps, selected]);
  const nextOpen = React.useMemo(() => findNextOpenDate(apps, selected), [apps, selected]);
  const mineCount = apps.filter(a => a.mine && (a.status === 'pending' || a.status === 'approved')).length;

  const pickDate = ds => {
    setSelected(ds);
    setSelection(null);
    setForm({ open: false, draft: null });
  };

  /* タイムラインで範囲を選んだ瞬間にポップを開く */
  const pickRange = range => {
    setSelection(range);
    if (!hasShift(selected)) {
      showToast('この日は担当者がいません', '休み');
      return;
    }
    if (isPastDate(selected)) {
      showToast('過ぎた日には申請できません', '不可');
      return;
    }
    setForm({ open: true, draft: { date: selected, machine: range.machine, start: range.start, end: range.end, kind: 'reserve' } });
  };

  /* ポップのホイール操作をタイムラインへ反映 */
  const syncRange = (machine, start, end) => {
    setSelection({ machine, start, end });
  };

  /* ヘッダーの「新規申請」：時間未選択なら空き枠を1つ探して開く */
  const openNew = () => {
    if (!hasShift(selected)) {
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
    const base = selection || { machine: 'ke', start: first, end: Math.min(first + 2, SLOT_COUNT) };
    setSelection(base);
    setForm({ open: true, draft: { date: selected, machine: base.machine, start: base.start, end: base.end, kind: 'reserve' } });
  };

  const submitApp = payload => {
    if (hasOverlap(apps, { id: 'new-' + Date.now(), ...payload })) {
      showToast('同じ時間帯にすでに申請があります', '重複');
      return;
    }
    const id = 'app-' + Date.now();
    const app = Object.assign({ id, mine: true, status: 'pending', createdAt: new Date().toISOString() }, payload);
    setApps(prev => [...prev, app]);
    setForm({ open: false, draft: null });
    setSelection(null);
    showToast(payload.kind === 'request' ? '依頼を受け付けました（申請中）' : '予約を申請しました（申請中）', payload.title);
  };

  const cancelApp = id => {
    setApps(prev => prev.filter(a => a.id !== id));
    setDetail(null);
    showToast('申請を取り消しました');
  };

  const openDetail = app => {
    setMineOpen(false);
    setDetail(app);
  };

  return (
    <>
      <SiteHeader mineCount={mineCount} onOpenMine={() => setMineOpen(true)} onNew={openNew} />

      <div className="main-content">
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
            <button type="button" className="btn btn-secondary btn-lg" onClick={openNew}>新規申請</button>
          </div>
        </div>

        <div className="workspace">
          <div className="cal-col">
            <Calendar selected={selected} onPick={pickDate} apps={apps} todayStr={todayStr} />
            <ApplicationPopover open={form.open} draft={form.draft} apps={apps}
              profile={profile} setProfile={setProfileState}
              onChangeRange={syncRange}
              onClose={() => setForm({ open: false, draft: null })}
              onSubmit={submitApp} />
          </div>

          <DayPanel dateStr={selected} info={info} apps={apps}
            selection={selection} onSelect={setSelection} onPickRange={pickRange}
            onClearSel={() => setSelection(null)}
            onNew={openNew} onOpenApp={openDetail} onJumpNext={pickDate} nextOpen={nextOpen} />
        </div>
      </div>

      <SiteFooter />

      <DetailSheet open={!!detail} app={detail} onClose={() => setDetail(null)} onCancel={cancelApp} />
      <MineSheet open={mineOpen} apps={apps} onClose={() => setMineOpen(false)} onOpenApp={openDetail} />

      <Toast toast={toast} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
