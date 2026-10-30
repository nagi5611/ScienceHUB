/* daylist.jsx — 選択日の申請を「依頼 / 予約」で分けて全件表示 */

function DayRow({ a, onOpen, onAct }) {
  const sp = spanOf(a);
  const tone = KIND_TONE[a.kind];
  return (
    <div className={'drow ' + a.kind + (a.status === 'rejected' ? ' is-rejected' : '')}>
      <div className="dr-time num">
        <b>{minsLabel(sp.start)}</b>
        <span>{minsLabel(sp.end)}</span>
      </div>
      <div className="dr-kind">
        <KindBadge kind={a.kind} size="sm" />
        <span className="dr-mach"><MDot id={a.machine} />{MACHINE_MAP[a.machine].short}</span>
      </div>
      <div className="dr-main">
        <div className="dr-title">{a.title}</div>
        <div className="dr-sub">
          <span>{a.who.name}</span>
          <span className="num">{hrLabel(a.who.hr)}・{a.who.num}番</span>
          {a.file && <><span>·</span><span className="num">{a.file}</span></>}
          {a.adminNote && <><span>·</span><span style={{ color: 'var(--primary-dark)' }}>メモあり</span></>}
        </div>
      </div>
      <div className="dr-acts">
        <Tag status={a.status} />
        {a.status === 'pending' && (
          <>
            <button type="button" className="mini ok" onClick={() => onAct(a, 'approve')}>確定</button>
            <button type="button" className="mini no" onClick={() => onOpen(a, 'reject')}>却下</button>
          </>
        )}
        <button type="button" className="mini arrow" onClick={() => onOpen(a)} aria-label="詳細">›</button>
      </div>
    </div>
  );
}

function DayGroup({ kind, rows, onOpen, onAct }) {
  const tone = KIND_TONE[kind];
  const pending = rows.filter(a => a.status === 'pending').length;
  return (
    <div className="dgroup">
      <div className="dg-head" style={{ background: tone.bg, borderColor: tone.line }}>
        <KindBadge kind={kind} />
        <span className="dg-count num">{rows.length}件</span>
        {pending > 0 && <span className="dg-pend num">申請中 {pending}</span>}
        <span className="dg-note">
          {kind === 'request'
            ? 'STLを提出して 16:30〜20:00 の枠を丸ごと使う'
            : 'プリンターの時間だけを確保（データ提出なし）'}
        </span>
        {pending > 1 && (
          <button type="button" className="btn btn-secondary btn-sm dg-bulk"
            onClick={() => rows.filter(a => a.status === 'pending').forEach(a => onAct(a, 'approve'))}>
            まとめて確定
          </button>
        )}
      </div>
      {rows.length === 0
        ? <div className="dg-empty">この日の{KIND[kind]}はありません。</div>
        : rows.map(a => <DayRow key={a.id} a={a} onOpen={onOpen} onAct={onAct} />)}
    </div>
  );
}

function DayList({ apps, date, onOpen, onAct }) {
  const all = apps.filter(a => a.date === date)
    .sort((a, b) => spanOf(a).start - spanOf(b).start || MACHINE_IDS.indexOf(a.machine) - MACHINE_IDS.indexOf(b.machine));
  const s = daySummary(apps, date);
  const rejected = all.filter(a => a.status === 'rejected');
  const past = date < TODAY;

  return (
    <div className="card daylist-card">
      <div className="card-h">
        <b>この日の申請</b>
        <span className="meta num">
          {dateLabelW(date)} ・ 全 {all.length}件（依頼 {s.requests.length} / 予約 {s.reserves.length}）
        </span>
        {past && <span style={{ marginLeft: 'auto' }}><Chip>過ぎた日</Chip></span>}
      </div>

      <div className="dgroups">
        <DayGroup kind="request" rows={s.requests} onOpen={onOpen} onAct={onAct} />
        <DayGroup kind="reserve" rows={s.reserves} onOpen={onOpen} onAct={onAct} />
        {rejected.length > 0 && (
          <details className="drej">
            <summary className="num">却下 {rejected.length}件を表示</summary>
            {rejected.map(a => <DayRow key={a.id} a={a} onOpen={onOpen} onAct={onAct} />)}
          </details>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { DayList, DayRow, DayGroup });
