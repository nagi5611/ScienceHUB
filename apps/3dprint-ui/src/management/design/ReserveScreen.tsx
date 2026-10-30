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

function SlotGrid({ app, selected, onToggle, disabled }) {
  const sp = spanOf(app);
  const slots = slotListOf(app);
  return (
    <div className="slotgrid" role="group" aria-label="時間帯（30分単位）">
      {slots.map(i => {
        const on = selected.indexOf(i) >= 0;
        return (
          <button type="button" key={i} disabled={disabled}
            className={'slot-chip' + (on ? ' on' : '')}
            onClick={() => onToggle(i)}
            aria-pressed={on}>
            <span className="num">{minsLabel(slotStart(i))}</span>
            <span className="slot-dur num">30分</span>
          </button>
        );
      })}
    </div>
  );
}

/* 時間単位の操作パネル */
function SlotActions({ app, onPartial, onCancelAll, onMove }) {
  const [sel, setSel] = React.useState([]);
  const [mode, setMode] = React.useState(null);   // 'cancel' | 'reject' | 'note'
  const [reason, setReason] = React.useState(null);
  const [noteText, setNoteText] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => { setSel([]); setMode(null); setReason(null); setError(''); setNoteText(app.adminNote || ''); }, [app.id]);

  const slots = slotListOf(app);
  const toggle = i => setSel(s => (s.indexOf(i) >= 0 ? s.filter(x => x !== i) : s.concat(i).sort((a, b) => a - b)));
  const all = sel.length === slots.length;
  const pickAll = () => setSel(all ? [] : slots.slice());
  const canAct = app.status === 'pending' || app.status === 'approved';
  const partial = sel.length > 0 && !all;

  const selLabel = sel.length
    ? `${minsLabel(slotStart(sel[0]))}〜${minsLabel(slotStart(sel[sel.length - 1]) + SLOT_MIN)}（${sel.length}枠・${durationLabel(sel.length * SLOT_MIN)}）`
    : '';

  const doCancel = () => {
    if (!reason) { setError('理由を1つ選んでください'); return; }
    const r = CANCEL_REASONS.find(x => x.id === reason);
    if (!sel.length) onCancelAll(app, r, noteText);
    else onPartial(app, sel, 'cancelled', { cancelReason: r.id, adminNote: noteText || r.body, reason: r });
  };

  const doReject = () => {
    if (!reason) { setError('理由を1つ選んでください'); return; }
    const r = REJECT_REASONS.find(x => x.id === reason);
    if (!sel.length) onCancelAll(app, r, noteText, 'rejected');
    else onPartial(app, sel, 'rejected', { rejectReason: r.id, adminNote: noteText || r.body, reason: r });
  };

  return (
    <div className="slotacts">
      <div className="ftitle" style={{ marginBottom: 6 }}>
        <span>時間単位で操作</span>
        <button type="button" className="linkbtn" onClick={pickAll}>
          {all ? '選択を解除' : 'すべて選択'}
        </button>
      </div>

      <SlotGrid app={app} selected={sel} onToggle={toggle} disabled={!canAct} />

      <div className={'selbar' + (sel.length ? ' on' : '')}>
        {sel.length
          ? <><b className="num">{selLabel}</b><span>{partial ? 'この枠だけを操作します（残りはそのまま）' : '申請全体を操作します'}</span></>
          : <span>枠を選ぶと、その時間だけを取り消し・確定できます。未選択なら申請全体が対象です。</span>}
      </div>

      {canAct && (
        <div className="actrow">
          {app.status === 'pending' && (
            <button type="button" className="btn btn-primary"
              onClick={() => (sel.length ? onPartial(app, sel, 'approved', {}) : onCancelAll(app, null, '', 'approved'))}>
              確定{partial ? `（${sel.length}枠）` : ''}
            </button>
          )}
          <button type="button" className="btn btn-secondary move"
            onClick={() => onMove && onMove(app)}>
            別の日へ変更
          </button>
          <button type="button" className="btn btn-danger"
            onClick={() => { setMode(mode === 'cancel' ? null : 'cancel'); setReason(null); setError(''); }}>
            取り消し…
          </button>
          {app.status === 'pending' && (
            <button type="button" className="btn btn-secondary"
              onClick={() => { setMode(mode === 'reject' ? null : 'reject'); setReason(null); setError(''); }}>
              却下…
            </button>
          )}
        </div>
      )}

      {!canAct && (
        <div className="note tip"><span>この申請は <b>{STATUS[app.status]}</b> です。必要なら「申請中に戻す」で復帰できます。</span></div>
      )}

      {canAct && mode === 'cancel' && (
        <div className="reasonblock">
          <div className="ftitle">取り消しの理由<span className="req">必須</span></div>
          <div className="reasons">
            {CANCEL_REASONS.map(r => (
              <button type="button" key={r.id} className={'reason' + (reason === r.id ? ' on' : '')}
                onClick={() => { setReason(r.id); setError(''); }}>
                <i /><span><b>{r.label}</b><span>{r.body}</span></span>
              </button>
            ))}
          </div>
          <div className="ftitle" style={{ marginTop: 8 }}>申請者への連絡（任意）</div>
          <textarea className="textarea" value={noteText} maxLength={200}
            onChange={e => setNoteText(e.target.value)} placeholder="理由に補足があれば書きます" />
          {error && <div className="note warn" style={{ marginTop: 6 }}><span>{error}</span></div>}
          <div className="actrow end">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setMode(null); setError(''); }}>やめる</button>
            <button type="button" className="btn btn-primary btn-sm" onClick={doCancel}>
              {partial ? `${sel.length}枠を取り消す` : 'この申請を取り消す'}
            </button>
          </div>
        </div>
      )}

      {canAct && mode === 'reject' && (
        <div className="reasonblock">
          <div className="ftitle">却下の理由<span className="req">必須</span></div>
          <div className="reasons">
            {REJECT_REASONS.map(r => (
              <button type="button" key={r.id} className={'reason' + (reason === r.id ? ' on' : '')}
                onClick={() => { setReason(r.id); setError(''); }}>
                <i /><span><b>{r.label}</b><span>{r.body}</span></span>
              </button>
            ))}
          </div>
          <div className="ftitle" style={{ marginTop: 8 }}>申請者へのメッセージ（任意）</div>
          <textarea className="textarea" value={noteText} maxLength={200}
            onChange={e => setNoteText(e.target.value)} placeholder="選んだ理由に補足があれば書きます" />
          {error && <div className="note warn" style={{ marginTop: 6 }}><span>{error}</span></div>}
          <div className="actrow end">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setMode(null); setError(''); }}>やめる</button>
            <button type="button" className="btn btn-primary btn-sm" onClick={doReject}>
              {partial ? `${sel.length}枠を却下` : 'この申請を却下'}
            </button>
          </div>
        </div>
      )}

      {app.status !== 'pending' && (
        <div className="actrow">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => onCancelAll(app, null, '', 'pending')}>
            申請中に戻す
          </button>
          {app.status === 'approved' && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => onCancelAll(app, null, '', 'done')}>
              完了にする
            </button>
          )}
        </div>
      )}

      <div className="memo">
        <div className="ftitle" style={{ justifyContent: 'space-between' }}>
          <span>担当者メモ{app.adminNote ? '（保存済み）' : ''}</span>
          <button type="button" className="linkbtn" onClick={() => setMode(mode === 'note' ? null : 'note')}>
            {mode === 'note' ? '閉じる' : '書く'}
          </button>
        </div>
        {app.adminNote && mode !== 'note' && <div className="note tip"><span>{app.adminNote}</span></div>}
        {mode === 'note' && (
          <div style={{ display: 'grid', gap: 6 }}>
            <textarea className="textarea" value={noteText} maxLength={200}
              onChange={e => setNoteText(e.target.value)} placeholder="印刷条件や受け取りの指示" />
            <div className="presets">
              {NOTE_TEMPLATES.map(t => (
                <button type="button" key={t} className="preset" onClick={() => setNoteText(t)}>{t.slice(0, 12)}…</button>
              ))}
            </div>
            <div className="actrow end">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setMode(null)}>キャンセル</button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => { onCancelAll(app, null, noteText.trim(), null, 'note'); setMode(null); }}>
                メモを保存
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StlBlock({ app }) {
  const size = app.fileSize ? (app.fileSize / 1048576).toFixed(2) + ' MB' : null;
  return (
    <div className="stl">
      <div className="stl-canvas">
        <span className="stl-tag">{app.kind === 'request' ? 'STL' : 'RESERVE'}</span>
        <span className="stl-note">{app.kind === 'request' ? 'サムネイル未生成' : 'データ提出なし'}</span>
      </div>
      <div className="stl-meta">
        <span className="stl-ext">{app.file ? app.file.split('.').pop().toUpperCase() : '—'}</span>
        <span className="stl-name">
          <b className="num">{app.file || 'データなし（予約のみ）'}</b>
          <span>{size ? `${size} ・ 更新 ${agoLabel(app.createdAt)}` : '予約枠のみの申請'}</span>
        </span>
        <span className="stl-actions">
          <button type="button" className="mini" disabled={!app.file}>DL</button>
          <button type="button" className="mini" disabled={!app.file}>開く</button>
        </span>
      </div>
    </div>
  );
}

/* 申請の詳細（ドロワー） */
function AppSheet({ app, onClose, onPartial, onCancelAll, onMove, log }) {
  if (!app) return null;
  const sp = spanOf(app);
  const staffs = staffIdsOn(app.date);
  const hist = log.filter(l => l.appId === app.id).sort((a, b) => b.at.localeCompare(a.at));

  return (
    <Drawer open={!!app} title={app.title} onClose={onClose}
      sub={<>
        <span className="num" style={{ whiteSpace: 'nowrap' }}>{dateLabelW(app.date)}</span>
        <span>·</span>
        <span style={{ whiteSpace: 'nowrap' }}>{MACHINE_MAP[app.machine].name}</span>
      </>}
      footer={<button type="button" className="btn btn-secondary" onClick={onClose}>閉じる</button>}>
      <div className="rv-flags">
        <KindBadge kind={app.kind} />
        <Tag status={app.status} />
        {isLate(app) && <Chip tone="warn">当日・締切超過</Chip>}
        <Chip>申請 {agoLabel(app.createdAt)}</Chip>
      </div>

      <dl className="kv">
        <div><dt>時間</dt><dd className="num">
          {app.kind === 'request' ? '16:30〜20:00' : `${minsLabel(sp.start)}〜${minsLabel(sp.end)}`}
          <small>{app.kind === 'request' ? '（依頼枠を丸ごと占有）' : `（${durationLabel(sp.end - sp.start)}）`}</small>
        </dd></div>
        <div><dt>機種</dt><dd>{MACHINE_MAP[app.machine].name}<small>／ {MACHINE_MAP[app.machine].maker}</small></dd></div>
        <div><dt>担当</dt><dd>{staffs.length ? staffs.map(id => memberLabel(id)).join(' / ') : '休み'}</dd></div>
        <div><dt>申請者</dt><dd>{app.who.name}<small>（{hrLabel(app.who.hr)}・{app.who.num}番）</small></dd></div>
        <div><dt>種別</dt><dd>{KIND[app.kind]}<small>{app.kind === 'request' ? 'STL提出あり' : 'データ提出なし'}</small></dd></div>
      </dl>

      <div>
        <div className="ftitle">印刷データ</div>
        <StlBlock app={app} />
      </div>

      {app.note && (
        <div>
          <div className="ftitle">申請者の備考</div>
          <div className="note tip"><span>{app.note}</span></div>
        </div>
      )}

      <SlotActions app={app} onPartial={onPartial} onCancelAll={onCancelAll} onMove={onMove} />

      {hist.length > 0 && (
        <div>
          <div className="ftitle">この申請の履歴</div>
          {hist.map(l => (
            <div key={l.id} className={'log-item ' + l.type}>
              <span className="bd" />
              <span className="tx">{l.text}
                <span className="at"><span className="who">{l.actor}</span>{logTime(l.at)}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  );
}

/* 画面1 */
function ReserveScreen({ apps, selected, onPick, onOpen, onApprove, onCancel, onPartial, log, onDownload, onDownloadAll, onMove }) {
  const s = daySummary(apps, selected);
  const staffs = staffIdsOn(selected);
  const past = selected < TODAY;
  const allCount = s.live.length;
  return (
    <div className="rs-grid">
      <div className="rs-main">
        <Calendar apps={apps} avail={null} selected={selected} onPick={onPick} />
      </div>

      <div className="rs-side">
        <div className="card daycard">
          <div className="daycard-h">
            <span className="dc-date num">{dateLabel(selected)}</span>
            <span className="dc-wd">{WD[parseYmd(selected).getDay()]}</span>
            {selected === TODAY && <Chip tone="orange">今日</Chip>}
            {past && <Chip>過ぎた日</Chip>}
            <span className="dc-staff">
              {staffs.length ? staffs.map(id => <MemberTag key={id} id={id} small />) : <span className="mtag none">休み</span>}
            </span>
          </div>

          <div className="daycard-counts">
            <span className="dc-c req"><KindBadge kind="request" size="sm" /><b className="num">{s.requests.length}</b></span>
            <span className="dc-c res"><KindBadge kind="reserve" size="sm" /><b className="num">{s.reserves.length}</b></span>
            {s.pending > 0 && <span className="dc-pend num">申請中 {s.pending}</span>}
            {allCount > 0 && (
              <button type="button" className="btn btn-dl btn-sm dc-dl" onClick={() => onDownloadAll(selected)}>
                <DLIcon />この日の申請を一括DL（{allCount}件）
              </button>
            )}
          </div>

          <div className="dgroups">
            {['request', 'reserve'].map(kind => {
              const rows = (kind === 'request' ? s.requests : s.reserves)
                .sort((a, b) => spanOf(a).start - spanOf(b).start || MACHINE_IDS.indexOf(a.machine) - MACHINE_IDS.indexOf(b.machine));
              const pend = rows.filter(a => a.status === 'pending').length;
              return (
                <div className="dgroup" key={kind}>
                  <div className={'dg-head ' + kind}>
                    <KindBadge kind={kind} />
                    <span className="num">{rows.length}件</span>
                    {pend > 0 && <span className="dg-pend num">申請中 {pend}</span>}
                  </div>
                  {rows.length === 0
                    ? <div className="dg-empty">この日の{KIND[kind]}はありません。</div>
                    : rows.map(a => {
                      const sp = spanOf(a);
                      return (
                        <div className={'drow ' + a.status} key={a.id}>
                          <span className="dr-time num">
                            <b>{minsLabel(sp.start)}</b>
                            <span>{minsLabel(sp.end)}</span>
                          </span>
                          <span className="dr-main">
                            <span className="dr-title">{a.title}</span>
                            <span className="dr-sub">
                              <Tag status={a.status} />
                              <MDot id={a.machine} />{MACHINE_MAP[a.machine].short}
                              <span>·</span>{a.who.name}
                              {a.file && <><span>·</span><span className="num">{a.file}</span></>}
                            </span>
                          </span>
                          <span className="dr-acts">
                            {a.status === 'pending' && (
                              <button type="button" className="mini ok" onClick={() => onApprove(a)}>確定</button>
                            )}
                            {(a.status === 'pending' || a.status === 'approved' || a.status === 'done') && (
                              <button type="button" className="mini move" onClick={() => onMove(a)}>変更</button>
                            )}
                            {(a.status === 'pending' || a.status === 'approved') && (
                              <button type="button" className="mini no" onClick={() => onOpen(a, 'cancel')}>取り消し</button>
                            )}
                            <span className="dr-dl">
                              <button type="button" className="mini dl" onClick={() => onDownload(a)}
                                title="この申請のテキストをダウンロード" aria-label={`${a.title} をダウンロード`}>
                                <DLIcon />DL
                              </button>
                              {a.file && (
                                <button type="button" className="mini dl icon-only" onClick={() => onDownload(a, 'file')}
                                  title={`${a.file} をダウンロード`} aria-label={`${a.file} をダウンロード`}>
                                  <DLIcon />
                                </button>
                              )}
                            </span>
                            <button type="button" className="mini arrow" onClick={() => onOpen(a)} aria-label="詳細">›</button>
                          </span>
                        </div>
                      );
                    })}
                </div>
              );
            })}

            {s.cancelled.length > 0 && (
              <details className="dcan">
                <summary className="num">取り消し・却下 {s.cancelled.length}件</summary>
                {s.cancelled.map(a => {
                  const sp = spanOf(a);
                  return (
                    <div className="drow cancelled" key={a.id}>
                      <span className="dr-time num"><b>{minsLabel(sp.start)}</b><span>{minsLabel(sp.end)}</span></span>
                      <span className="dr-main">
                        <span className="dr-title">{a.title}</span>
                        <span className="dr-sub"><Tag status={a.status} /><span>{a.who.name}</span><span>·</span><span>{a.adminNote || '理由なし'}</span></span>
                      </span>
                      <span className="dr-acts">
                        <button type="button" className="mini" onClick={() => onCancel(a, null, '', 'pending')}>戻す</button>
                        <button type="button" className="mini arrow" onClick={() => onOpen(a)}>›</button>
                      </span>
                    </div>
                  );
                })}
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export { SlotGrid, SlotActions, StlBlock, AppSheet, ReserveScreen };
