/* settings.jsx — 設定サイドバー（連携 / メンバー / シフト） */

/* ── Discord ─────────────────────────────────────────── */
function IntegrationDiscord({ value, onChange, onTest }) {
  const v = value || {};
  const set = patch => onChange({ ...v, ...patch });
  const setEvent = (k, on) => set({ events: { ...v.events, [k]: on } });
  const valid = /^https:\/\/discord(app)?\.com\/api\/webhooks\/\d+\/[\w-]+$/.test(v.webhook || '');

  return (
    <div className="intg">
      <div className="intg-h">
        <b>Discord 通知</b>
        <span className={'intg-state ' + (v.enabled ? (valid ? 'ok' : 'warn') : 'off')}>
          {v.enabled ? (valid ? '有効' : 'URL未設定') : '無効'}
        </span>
        <label className="sw">
          <input type="checkbox" checked={!!v.enabled} onChange={e => set({ enabled: e.target.checked })} />
          <span />
        </label>
      </div>

      <label className="fl">
        <span className="fl-l">Webhook URL<span className="req">必須</span></span>
        <input className="input mono" value={v.webhook || ''} spellCheck="false"
          onChange={e => set({ webhook: e.target.value.trim() })}
          placeholder="https://discord.com/api/webhooks/123.../abc..." />
        <span className="fl-h">Discordの「サーバー設定 → 連携サービス → ウェブフック」で作成したURLを貼ります。</span>
      </label>

      {!valid && (v.webhook || '').length > 0 && (
        <div className="note warn"><span>URLの形式が違います。<b>https://discord.com/api/webhooks/…</b> の形で貼り付けてください。</span></div>
      )}

      <div className="fl">
        <span className="fl-l">通知するタイミング</span>
        <div className="chk-grid">
          {[['pending', '新しい申請'], ['approved', '確定したとき'], ['rejected', '却下したとき']].map(([k, label]) => (
            <label className="chk" key={k}>
              <input type="checkbox" checked={!!(v.events && v.events[k])} onChange={e => setEvent(k, e.target.checked)} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <label className="fl">
        <span className="fl-l">メンション（任意）</span>
        <input className="input mono" value={v.mention || ''} spellCheck="false"
          onChange={e => set({ mention: e.target.value })}
          placeholder="@here  /  <@&1234567890>" />
        <span className="fl-h">通知時に本文の先頭へ付けます。空欄ならメンションなし。</span>
      </label>

      <div className="intg-f">
        <button type="button" className="btn btn-secondary btn-sm" onClick={onTest} disabled={!valid}>テスト送信</button>
        <span className="fl-h">保存は自動です。</span>
      </div>
    </div>
  );
}

/* ── Google カレンダー ───────────────────────────────── */
function IntegrationGcal({ value, onChange, onTest }) {
  const v = value || {};
  const set = patch => onChange({ ...v, ...patch });
  const valid = /^[\w.+-]+@[\w-]+\.(calendar\.google\.com|group\.calendar\.google\.com)$/.test(v.calendarId || '')
    || /^[a-z0-9_-]{20,}$/i.test(v.calendarId || '');

  return (
    <div className="intg">
      <div className="intg-h">
        <b>Google カレンダー</b>
        <span className={'intg-state ' + (v.enabled ? (valid ? 'ok' : 'warn') : 'off')}>
          {v.enabled ? (valid ? '有効' : 'ID未設定') : '無効'}
        </span>
        <label className="sw">
          <input type="checkbox" checked={!!v.enabled} onChange={e => set({ enabled: e.target.checked })} />
          <span />
        </label>
      </div>

      <label className="fl">
        <span className="fl-l">カレンダーID<span className="req">必須</span></span>
        <input className="input mono" value={v.calendarId || ''} spellCheck="false"
          onChange={e => set({ calendarId: e.target.value.trim() })}
          placeholder="xxxx@group.calendar.google.com" />
        <span className="fl-h">共有カレンダーの「設定 → カレンダーの統合」に載っているID。</span>
      </label>

      <label className="fl">
        <span className="fl-l">予定タイトルの書式</span>
        <input className="input" value={v.title || ''} onChange={e => set({ title: e.target.value })}
          placeholder="[3Dプリント] {title}" />
        <span className="fl-h">{'{title}'} は作品名、{'{who}'} は申請者、{'{machine}'} は機種に置き換わります。</span>
      </label>

      <div className="fl-2">
        <label className="fl">
          <span className="fl-l">所要時間</span>
          <select className="input" value={v.duration || 20} onChange={e => set({ duration: Number(e.target.value) })}>
            {[10, 15, 20, 30, 60, 90, 120].map(n => <option key={n} value={n}>{n}分</option>)}
          </select>
        </label>
        <label className="fl">
          <span className="fl-l">登録する時点</span>
          <select className="input" value={v.syncOn || 'approved'} onChange={e => set({ syncOn: e.target.value })}>
            <option value="pending">申請が届いた時点</option>
            <option value="approved">確定した時点</option>
          </select>
        </label>
      </div>

      <div className="intg-f">
        <button type="button" className="btn btn-secondary btn-sm" onClick={onTest} disabled={!valid}>接続テスト</button>
        <span className="fl-h">保存は自動です。</span>
      </div>
    </div>
  );
}

/* ── メンバー ────────────────────────────────────────── */
function MembersPanel({ members, apps, shifts, onAdd, onRename, onRemove }) {
  const [name, setName] = React.useState('');
  const [editing, setEditing] = React.useState(null);
  const [draft, setDraft] = React.useState('');

  const add = () => {
    const n = name.trim();
    if (!n) return;
    onAdd(n);
    setName('');
  };

  return (
    <div className="members">
      <div className="fl-h" style={{ marginBottom: 8 }}>
        印刷担当者。シフトの選択肢と「操作者」にそのまま出ます。削除するとその人のシフトは「休み」になります。
      </div>

      <div className="mem-list">
        {members.map(m => {
          const shiftCount = Object.values(shifts).filter(v => v === m.id).length;
          const handled = apps.filter(a => a.by === m.name).length;
          return (
            <div className="mem" key={m.id}>
              <span className="mem-av">{m.name.slice(0, 1)}</span>
              {editing === m.id ? (
                <input className="input mem-input" value={draft} autoFocus
                  onChange={e => setDraft(e.target.value)}
                  onBlur={() => {
                    const n = draft.trim();
                    if (n && n !== m.name) onRename(m.id, n);
                    setEditing(null);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') e.currentTarget.blur();
                    if (e.key === 'Escape') { setDraft(m.name); setEditing(null); }
                  }} />
              ) : (
                <span className="mem-tx">
                  <b>{m.name}</b>
                  <span className="num">シフト {shiftCount}日 ・ 処理 {handled}件</span>
                </span>
              )}
              <span className="mem-acts">
                {editing !== m.id && (
                  <button type="button" className="mini" onClick={() => { setEditing(m.id); setDraft(m.name); }}>変更</button>
                )}
                <button type="button" className="mini no" disabled={members.length <= 1}
                  onClick={() => { if (confirm(`${m.name} を削除します。担当していたシフトは「休み」になります。`)) onRemove(m.id); }}>
                  削除
                </button>
              </span>
            </div>
          );
        })}
      </div>

      <div className="mem-add">
        <input className="input" value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') add(); }}
          placeholder="名前を入力（例：佐々木）" maxLength={12} />
        <button type="button" className="btn btn-primary" onClick={add} disabled={!name.trim()}>追加</button>
      </div>
      {members.length <= 1 && (
        <div className="note warn" style={{ marginTop: 8 }}><span>担当者は最低1人必要です。</span></div>
      )}
    </div>
  );
}

/* ── シフト一括設定 ──────────────────────────────────── */
const WEEKS_PRESET = [1, 2, 4, 8];

function ShiftPlanner({ members, shifts, onApply, onClear }) {
  const [weekday, setWeekday] = React.useState(1);          // 0=日 … 6=土
  const [weeks, setWeeks] = React.useState(4);
  const [memberId, setMemberId] = React.useState(members[0] && members[0].id);
  const [startWeek, setStartWeek] = React.useState(0);
  const [skipExisting, setSkipExisting] = React.useState(false);
  const [mode, setMode] = React.useState('on');            // on | off

  React.useEffect(() => {
    if (!members.find(m => m.id === memberId)) setMemberId(members[0] && members[0].id);
  }, [members]);

  const base = weekStart(todayDate());
  const from = ymd(addDays(base, startWeek * 7));
  const plans = React.useMemo(() => {
    const out = [];
    for (let i = 0; i < weeks; i++) {
      const d = addDays(addDays(base, (startWeek + i) * 7), weekday);
      out.push({ date: ymd(d), d, past: ymd(d) < TODAY });
    }
    return out;
  }, [weekday, weeks, startWeek]);

  const existing = plans.filter(p => !p.past && shifts[p.date]);
  const willChange = plans.filter(p => !p.past).filter(p => (skipExisting ? !shifts[p.date] : true));
  const skipped = plans.filter(p => p.past).length;

  const apply = () => {
    onApply(willChange.map(p => ({ date: p.date, memberId: mode === 'on' ? memberId : null })));
  };

  return (
    <div className="planner">
      <div className="fl-h" style={{ marginBottom: 10 }}>
        曜日を選んで、何週間ぶんまとめて入れるかを決めます。「入れない」に切り替えるとその曜日を休みにできます。
      </div>

      <div className="fl">
        <span className="fl-l">曜日</span>
        <div className="wd-pick" role="group" aria-label="曜日">
          {WD.map((w, i) => (
            <button type="button" key={w} className={weekday === i ? 'on' : ''}
              data-wd={i} onClick={() => setWeekday(i)}>{w}</button>
          ))}
        </div>
      </div>

      <div className="fl">
        <span className="fl-l">開始する週</span>
        <div className="seg seg-wrap">
          {[0, 1, 2, 3].map(n => {
            const d = addDays(base, n * 7);
            return (
              <button type="button" key={n} className={startWeek === n ? 'on' : ''} onClick={() => setStartWeek(n)}>
                {n === 0 ? '今週' : n === 1 ? '来週' : `+${n}週`}
                <span className="seg-sub num">{mdLabel(d)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="fl">
        <span className="fl-l">何週間ぶん</span>
        <div className="weeks-pick">
          {WEEKS_PRESET.map(n => (
            <button type="button" key={n} className={weeks === n ? 'on' : ''} onClick={() => setWeeks(n)}>{n}週</button>
          ))}
          <input className="weeks-num num" type="number" min={1} max={52} value={weeks}
            onChange={e => setWeeks(Math.max(1, Math.min(52, Number(e.target.value) || 1)))} />
          <span className="fl-h" style={{ alignSelf: 'center' }}>週</span>
        </div>
      </div>

      <div className="fl">
        <span className="fl-l">設定</span>
        <div className="seg">
          <button type="button" className={mode === 'on' ? 'on' : ''} onClick={() => setMode('on')}>シフトに入れる</button>
          <button type="button" className={mode === 'off' ? 'on' : ''} onClick={() => setMode('off')}>入れない（休み）</button>
        </div>
      </div>

      {mode === 'on' && (
        <div className="fl">
          <span className="fl-l">担当</span>
          <div className="mem-pick">
            {members.map(m => (
              <button type="button" key={m.id} className={memberId === m.id ? 'on' : ''} onClick={() => setMemberId(m.id)}>
                <span className="mem-av sm">{m.name.slice(0, 1)}</span>{m.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <label className="chk" style={{ marginTop: 2 }}>
        <input type="checkbox" checked={skipExisting} onChange={e => setSkipExisting(e.target.checked)} />
        <span>すでに担当が入っている日は変更しない</span>
      </label>

      <div className="plan-preview">
        <div className="pp-head">
          <b>適用される日</b>
          <span className="num">{willChange.length}日</span>
          {existing.length > 0 && <span className="pp-warn num">既存 {existing.length}日</span>}
          {skipped > 0 && <span className="pp-skip num">過去 {skipped}日は除外</span>}
        </div>
        <div className="pp-days">
          {willChange.length === 0 && <span className="fl-h">適用対象がありません。</span>}
          {willChange.map(p => (
            <span className="pp-day" key={p.date}>
              <b className="num">{mdLabel(p.d)}</b>
              <span>({WD[p.d.getDay()]})</span>
              <em style={{ color: mode === 'on' ? 'var(--primary-dark)' : 'var(--faint)' }}>
                {mode === 'on' ? memberName(memberId) : '休み'}
              </em>
            </span>
          ))}
        </div>
      </div>

      <div className="pp-acts">
        <button type="button" className="btn btn-primary" onClick={apply} disabled={willChange.length === 0}>
          {willChange.length}日を適用
        </button>
      </div>
    </div>
  );
}

/* 2週間ぶんの個別調整グリッド */
function ShiftGrid({ members, shifts, onSet }) {
  const [offset, setOffset] = React.useState(0);
  const base = addDays(weekStart(todayDate()), offset * 14);
  const days = [];
  for (let i = 0; i < 14; i++) {
    const d = addDays(base, i);
    if (isWeekday(d)) days.push(d);
  }
  return (
    <div className="sgrid">
      <div className="sgrid-h">
        <b>個別に調整</b>
        <span className="fl-h num">{mdLabel(base)}〜</span>
        <div className="right">
          <button type="button" className="mini" onClick={() => setOffset(o => o - 1)}>‹ 前</button>
          <button type="button" className="mini" onClick={() => setOffset(0)}>今日</button>
          <button type="button" className="mini" onClick={() => setOffset(o => o + 1)}>次 ›</button>
        </div>
      </div>
      {days.map(d => {
        const ds = ymd(d);
        const cur = shifts[ds];
        return (
          <div className="srow" key={ds}>
            <span className="srow-d num">{mdLabel(d)}<span>{WD[d.getDay()]}</span></span>
            <span className="srow-opts">
              {members.map(m => (
                <button type="button" key={m.id} className={cur === m.id ? 'on' : ''}
                  onClick={() => onSet(ds, m.id)}>{m.name}</button>
              ))}
              <button type="button" className={'rest' + (!cur ? ' on' : '')} onClick={() => onSet(ds, null)}>休</button>
            </span>
          </div>
        );
      })}
    </div>
  );
}

function SettingsPanel({ tab, setTab, integrations, setIntegrations, members, apps, shifts,
  onAddMember, onRenameMember, onRemoveMember, onApplyShift, onSetShift, onTestDiscord, onTestGcal }) {

  return (
    <div className="settings-body">
        {tab === 'shifts' && (
          <>
            <ShiftPlanner members={members} shifts={shifts} onApply={onApplyShift} />
            <div className="hr-line" />
            <ShiftGrid members={members} shifts={shifts} onSet={onSetShift} />
          </>
        )}

        {tab === 'members' && (
          <MembersPanel members={members} apps={apps} shifts={shifts}
            onAdd={onAddMember} onRename={onRenameMember} onRemove={onRemoveMember} />
        )}

        {tab === 'integrations' && (
          <>
            <IntegrationDiscord value={integrations.discord}
              onChange={v => setIntegrations(p => ({ ...p, discord: v }))} onTest={onTestDiscord} />
            <div className="hr-line" />
            <IntegrationGcal value={integrations.gcal}
              onChange={v => setIntegrations(p => ({ ...p, gcal: v }))} onTest={onTestGcal} />
          </>
        )}
    </div>
  );
}

function SettingsTabs({ tab, setTab, pendingMembers }) {
  const tabs = [
    ['shifts', 'シフト'],
    ['members', 'メンバー'],
    ['integrations', '外部連携'],
  ];
  return (
    <div className="set-tabs" role="tablist">
      {tabs.map(([id, label]) => (
        <button type="button" key={id} role="tab" aria-selected={tab === id}
          className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{label}</button>
      ))}
    </div>
  );
}

Object.assign(window, {
  IntegrationDiscord, IntegrationGcal, MembersPanel, ShiftPlanner, ShiftGrid, SettingsPanel, SettingsTabs,
});
