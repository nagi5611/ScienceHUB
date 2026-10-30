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
} from '../admin-design-domain';;
import {
  LOGO, machineColor, MDot, KindBadge, Tag, Chip, MemberTag, agoLabel, logTime,
  Header, Calendar, CalDay, dayHint, Drawer, Modal, Toast,
  DLIcon, downloadAppFile, downloadDay, saveText,
} from './AdminDesignUi';;

/* 月カレンダー（シフト塗り用）。
   - 日付をドラッグでなぞる：触れた日をまとめて追加／削除
   - 曜日見出しをクリック：その月の同じ曜日を一括トグル */
function ShiftCalendar({ year, month, avail, memberId, onPaint, onChangeMonth }) {
  const first = new Date(year, month - 1, 1);
  const lead = first.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month - 1, d));

  const gridRef = React.useRef(null);
  const drag = React.useRef(null);
  const [preview, setPreview] = React.useState(null);   // { dates:Set, on:boolean }

  const daysOfWeekday = wd => cells.filter(Boolean).filter(d => d.getDay() === wd).map(ymd);
  const editable = ds => ds >= TODAY;

  const begin = (ds, ev) => {
    if (!memberId || !editable(ds)) return;
    if (ev.pointerType === 'mouse' && ev.button !== 0) return;
    ev.preventDefault();
    const on = !isAvailable(memberId, ds);
    drag.current = { mode: on, touched: [ds] };
    setPreview({ dates: new Set([ds]), on });
  };

  /* なぞった位置のセルを elementFromPoint で拾う（capture すると
     他のセルの enter が来なくなるため使わない） */
  const sample = (x, y) => {
    const el = document.elementFromPoint(x, y);
    const cell = el && el.closest ? el.closest('.scal-cell[data-date]') : null;
    if (!cell) return null;
    return cell.getAttribute('data-date');
  };

  React.useEffect(() => {
    const onMove = ev => {
      const d = drag.current;
      if (!d) return;
      ev.preventDefault();
      const ds = sample(ev.clientX, ev.clientY);
      if (!ds || !editable(ds) || d.touched.indexOf(ds) >= 0) return;
      d.touched.push(ds);
      setPreview(p => {
        const next = new Set(p ? p.dates : []);
        next.add(ds);
        return { dates: next, on: d.mode };
      });
    };
    const onUp = () => {
      const d = drag.current;
      if (!d) return;
      drag.current = null;
      const dates = d.touched.filter(editable).slice();
      setPreview(null);
      if (dates.length) onPaint(dates, d.mode);
    };
    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [onPaint, memberId]);

  const paintOf = ds => (preview && preview.dates.has(ds)) ? preview.on : null;
  const onOf = ds => {
    const pv = paintOf(ds);
    if (pv !== null) return pv;
    return memberId ? isAvailable(memberId, ds) : false;
  };
  /* その日に誰が入っているか（担当者ごとの色を出すため） */
  const staffIdsOf = ds => getMembers().filter(m => (avail[m.id] || []).indexOf(ds) >= 0).map(m => m.id);
  const curColor = (memberById(memberId) || {}).color || 'var(--color-primary)';

  /* 曜日見出し：その月の同じ曜日が全部入っていれば削除、そうでなければ追加 */
  const toggleWeekday = wd => {
    if (!memberId) return;
    const list = daysOfWeekday(wd).filter(editable);
    if (!list.length) return;
    const allOn = list.every(ds => isAvailable(memberId, ds));
    onPaint(list, !allOn);
  };
  const weekdayState = wd => {
    const list = daysOfWeekday(wd).filter(editable);
    if (!memberId || !list.length) return 'idle';
    const on = list.filter(ds => isAvailable(memberId, ds)).length;
    if (on === 0) return 'idle';
    return on === list.length ? 'all' : 'some';
  };

  return (
    <div className="scal" ref={gridRef}>
      <div className="scal-h">
        <b className="num">{year}年 {month}月</b>
        <button type="button" className="mini" onClick={() => onChangeMonth(0)}>今月</button>
      </div>

      <div className="scal-body">
        <button type="button" className="scal-side prev" onClick={() => onChangeMonth(-1)} aria-label="前の月">
          <span aria-hidden="true">‹</span>
          <span className="scal-side-lbl">前へ</span>
        </button>

        <div className="scal-main">
          <div className="scal-wds">
            {WD.map((w, i) => {
              const st = weekdayState(i);
              return (
                <button type="button" key={w} data-wd={i}
                  className={'scal-wd' + (i === 0 ? ' sun' : i === 6 ? ' sat' : '') + (st === 'all' ? ' all' : st === 'some' ? ' some' : '')}
                  onClick={() => toggleWeekday(i)}
                  title={`${w}曜日をこの月すべて${st === 'all' ? '削除' : '追加'}`}
                  aria-label={`${w}曜日をこの月すべて${st === 'all' ? '削除' : '追加'}`}>
                  {w}
                </button>
              );
            })}
          </div>

          <div className={'scal-grid' + (preview ? ' painting' : '')}>
            {Array.from({ length: Math.ceil(cells.length / 7) * 7 }).map((_, i) => {
              const d = cells[i];
              if (!d) return <span className="scal-cell pad" key={'p' + i} />;
              const ds = ymd(d);
              const on = onOf(ds);
              const pv = paintOf(ds);
              const wd = d.getDay();
              const past = !editable(ds);
              const ids = staffIdsOf(ds);
              const mine = memberId ? ids.indexOf(memberId) >= 0 : false;
              return (
                <button type="button" key={ds} data-date={ds}
                  className={'scal-cell' + (on ? ' on' : '') + (wd === 0 ? ' sun' : wd === 6 ? ' sat' : '')
                    + (ds === TODAY ? ' today' : '') + (past ? ' past' : '')
                    + (pv === true ? ' pv-on' : pv === false ? ' pv-off' : '') + (mine ? ' mine' : '')}
                  style={mine || (pv === true && memberId) ? { background: curColor + '1f', borderColor: curColor } : undefined}
                  onPointerDown={e => begin(ds, e)}
                  aria-pressed={on}
                  aria-label={`${d.getMonth() + 1}月${d.getDate()}日 ${ids.length ? ids.map(memberName).join('・') : '担当なし'}`}>
                  <span className="num">{d.getDate()}</span>
                  <span className="scal-dots">
                    {ids.slice(0, 3).map(id => (
                      <span key={id} className="scal-dot" style={{ background: memberColor(id) }} />
                    ))}
                    {ids.length > 3 && <span className="scal-dot more num">+{ids.length - 3}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button type="button" className="scal-side next" onClick={() => onChangeMonth(1)} aria-label="次の月">
          <span aria-hidden="true">›</span>
          <span className="scal-side-lbl">次へ</span>
        </button>
      </div>

      <div className="scal-foot">
        <span>日付をドラッグでなぞると、通った日をまとめて追加／削除します。曜日をクリックすると、その月の同じ曜日を一括で切り替えます。</span>
        {!memberId && <span className="scal-warn">先に担当者を選んでください。</span>}
      </div>
    </div>
  );
}

/* メンバー管理 */
function MemberForm({ members, onAdd, onUpdate, onRemove }) {
  const [editing, setEditing] = React.useState(null);      // memberId | 'new'
  const [form, setForm] = React.useState({ name: '', hr: '101', num: '', discord: '', color: MEMBER_COLORS[0] });
  const [error, setError] = React.useState('');

  const startEdit = m => {
    setEditing(m.id);
    setForm({ name: m.name, hr: m.hr, num: String(m.num), discord: m.discord || '', color: m.color });
    setError('');
  };
  const startNew = () => {
    setEditing('new');
    setForm({ name: '', hr: '101', num: '', discord: '', color: MEMBER_COLORS[members.length % MEMBER_COLORS.length] });
    setError('');
  };

  const valid = () => {
    if (!form.name.trim()) return '名前を入力してください';
    if (!HR_LIST.includes(form.hr)) return 'HRは 101〜309 から選んでください';
    const n = Number(form.num);
    if (!n || n < 1 || n > 40) return '番号は 1〜40 で入力してください';
    if (form.discord && !/^\d{15,25}$/.test(form.discord.trim())) return 'Discord のユーザーIDは数字15〜25桁です';
    return '';
  };

  const save = () => {
    const err = valid();
    if (err) { setError(err); return; }
    const payload = {
      name: form.name.trim(),
      hr: form.hr,
      num: Number(form.num),
      discord: form.discord.trim(),
      color: form.color,
    };
    if (editing === 'new') onAdd(payload);
    else onUpdate(editing, payload);
    setEditing(null);
    setError('');
  };

  return (
    <div className="mform">
      <div className="mform-h">
        <b>印刷担当者</b>
        <span className="num">{members.length}人</span>
        {editing !== 'new' && (
          <button type="button" className="btn btn-primary btn-sm" onClick={startNew}>担当者を追加</button>
        )}
      </div>

      <div className="mtable">
        <div className="mtr mtr-h">
          <span />
          <span>名前</span>
          <span>HR</span>
          <span>番号</span>
          <span>Discord ID</span>
          <span />
        </div>
        {members.map(m => (
          <div className="mtr" key={m.id}>
            <span className="mtd-av" style={{ background: m.color }}>{m.name.slice(0, 1)}</span>
            <span className="mtd-name">{m.name}</span>
            <span className="num">{hrLabel(m.hr)}</span>
            <span className="num">{m.num}番</span>
            <span className="num mtd-discord">{m.discord || <em className="mtd-none">未設定</em>}</span>
            <span className="mtd-acts">
              <button type="button" className="mini" onClick={() => startEdit(m)}>編集</button>
              <button type="button" className="mini no" disabled={members.length <= 1}
                onClick={() => { if (confirm(`${m.name} を削除します。この人のシフトも消えます。`)) onRemove(m.id); }}>
                削除
              </button>
            </span>
          </div>
        ))}
      </div>

      {(editing === 'new' || editing) && (
        <div className="medit">
          <div className="medit-h">
            <b>{editing === 'new' ? '担当者を追加' : '担当者を編集'}</b>
            <button type="button" className="linkbtn" onClick={() => { setEditing(null); setError(''); }}>閉じる</button>
          </div>
          <div className="medit-grid">
            <label className="fl">
              <span className="fl-l">名前<span className="req">必須</span></span>
              <input className="input" value={form.name} maxLength={12}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="例：佐々木" />
            </label>
            <label className="fl">
              <span className="fl-l">HR<span className="req">必須</span></span>
              <select className="input" value={form.hr} onChange={e => setForm(f => ({ ...f, hr: e.target.value }))}>
                {HR_LIST.map(h => <option key={h} value={h}>{hrLabel(h)}</option>)}
              </select>
            </label>
            <label className="fl">
              <span className="fl-l">番号<span className="req">必須</span></span>
              <input className="input num" type="number" min={1} max={40} value={form.num}
                onChange={e => setForm(f => ({ ...f, num: e.target.value }))} placeholder="12" />
            </label>
            <label className="fl">
              <span className="fl-l">Discord ID<span className="fl-opt">任意</span></span>
              <input className="input num" value={form.discord} inputMode="numeric"
                onChange={e => setForm(f => ({ ...f, discord: e.target.value }))} placeholder="朝6時のメンション用" />
            </label>
          </div>
          <div className="fl">
            <span className="fl-l">シフト表の色</span>
            <div className="color-pick">
              {MEMBER_COLORS.map(c => (
                <button type="button" key={c} className={form.color === c ? 'on' : ''}
                  style={{ background: c }} onClick={() => setForm(f => ({ ...f, color: c }))}
                  aria-label={`色 ${c}`} aria-pressed={form.color === c} />
              ))}
            </div>
          </div>
          {error && <div className="note warn"><span>{error}</span></div>}
          <div className="actrow end">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setEditing(null); setError(''); }}>キャンセル</button>
            <button type="button" className="btn btn-primary btn-sm" onClick={save}>
              {editing === 'new' ? '追加する' : '保存する'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* 外部連携 */
function Integrations({ value, onChange, onTestDiscord, onTestGcal, onTestEmail }) {
  const d = value.discord || {};
  const g = value.gcal || {};
  const setD = patch => onChange({ ...value, discord: { ...d, ...patch } });
  const setG = patch => onChange({ ...value, gcal: { ...g, ...patch } });
  const serverWebhook = (d.webhook || '').includes('サーバー設定');
  const webhookOk = serverWebhook || /^https:\/\/discord(app)?\.com\/api\/webhooks\/\d+\/[\w-]+$/.test(d.webhook || '');
  const serverGcal = (g.calendarId || '').includes('サーバー設定');
  const calOk = serverGcal || /^[\w.+-]+@[\w-]+\.(calendar\.google\.com|group\.calendar\.google\.com)$/.test(g.calendarId || '');

  return (
    <div className="integ">
      <section className="intg">
        <div className="intg-h">
          <b>Discord 通知</b>
          <span className={'intg-state ' + (d.enabled ? (webhookOk ? 'ok' : 'warn') : 'off')}>
            {d.enabled ? (webhookOk ? '有効' : 'URL未設定') : '無効'}
          </span>
          <label className="sw">
            <input type="checkbox" checked={!!d.enabled} onChange={e => setD({ enabled: e.target.checked })} />
            <span />
          </label>
        </div>

        <label className="fl">
          <span className="fl-l">Webhook URL<span className="req">必須</span></span>
          <input className="input mono" value={d.webhook || ''} spellCheck="false"
            onChange={e => setD({ webhook: e.target.value.trim() })}
            placeholder="https://discord.com/api/webhooks/123.../abc..." />
          <span className="fl-h">Discordの「サーバー設定 → 連携サービス → ウェブフック」で作成したURL。</span>
        </label>
        {!webhookOk && (d.webhook || '') && (
          <div className="note warn"><span>URLの形式が違います。<b>https://discord.com/api/webhooks/…</b> の形で貼り付けてください。</span></div>
        )}

        <div className="fl">
          <span className="fl-l">通知するタイミング</span>
          <div className="chk-grid">
            {[['pending', '新しい申請'], ['approved', '確定したとき'], ['cancelled', '取り消したとき']].map(([k, label]) => (
              <label className="chk" key={k}>
                <input type="checkbox" checked={!!(d.events && d.events[k])}
                  onChange={e => setD({ events: { ...d.events, [k]: e.target.checked } })} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        <label className="chk" style={{ alignSelf: 'flex-start' }}>
          <input type="checkbox" checked={!!d.dailyMention}
            onChange={e => setD({ dailyMention: e.target.checked })} />
          <span>当日の担当者を朝6:00にメンションする</span>
        </label>
        <span className="fl-h" style={{ marginTop: -6 }}>
          メンバーに登録した Discord ID を使います。未設定の人はメンションされません。
        </span>

        <div className="intg-f">
          <button type="button" className="btn btn-secondary btn-sm" onClick={onTestDiscord} disabled={!webhookOk}>テスト送信</button>
          <span className="fl-h">保存は自動です。</span>
        </div>
      </section>

      <section className="intg">
        <div className="intg-h">
          <b>Google カレンダー</b>
          <span className={'intg-state ' + (g.enabled ? (calOk ? 'ok' : 'warn') : 'off')}>
            {g.enabled ? (calOk ? '有効' : 'ID未設定') : '無効'}
          </span>
          <label className="sw">
            <input type="checkbox" checked={!!g.enabled} onChange={e => setG({ enabled: e.target.checked })} />
            <span />
          </label>
        </div>

        <label className="fl">
          <span className="fl-l">カレンダーID<span className="req">必須</span></span>
          <input className="input mono" value={g.calendarId || ''} spellCheck="false"
            onChange={e => setG({ calendarId: e.target.value.trim() })}
            placeholder="xxxx@group.calendar.google.com" />
          <span className="fl-h">共有カレンダーの「設定 → カレンダーの統合」に載っているID。</span>
        </label>

        <label className="fl">
          <span className="fl-l">予定タイトルの書式</span>
          <input className="input" value={g.title || ''} onChange={e => setG({ title: e.target.value })}
            placeholder="[3Dプリント] {title}" />
          <span className="fl-h">{'{title}'} 作品名 / {'{who}'} 申請者 / {'{machine}'} 機種 に置き換わります。</span>
        </label>

        <div className="fl-2">
          <label className="fl">
            <span className="fl-l">所要時間</span>
            <select className="input" value={g.duration || 20} onChange={e => setG({ duration: Number(e.target.value) })}>
              {[10, 15, 20, 30, 60, 90, 120].map(n => <option key={n} value={n}>{n}分</option>)}
            </select>
          </label>
          <label className="fl">
            <span className="fl-l">登録する時点</span>
            <select className="input" value={g.syncOn || 'approved'} onChange={e => setG({ syncOn: e.target.value })}>
              <option value="pending">申請が届いた時点</option>
              <option value="approved">確定した時点</option>
            </select>
          </label>
        </div>

        <div className="intg-f">
          <button type="button" className="btn btn-secondary btn-sm" onClick={onTestGcal} disabled={!calOk}>接続テスト</button>
          <span className="fl-h">保存は自動です。</span>
        </div>
      </section>

      {onTestEmail && (
        <section className="intg">
          <div className="intg-h">
            <b>予約者向けメール</b>
          </div>
          <p className="fl-h">Cloudflare Email Service（サーバー環境変数）で申請・受領通知を送信します。</p>
          <div className="intg-f">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onTestEmail}>
              テスト送信
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
export { ShiftCalendar, MemberForm, Integrations };
