import React from 'react';
import type { AdminApplication, AdminMember } from '../admin-domain';
import {
  WD, pad2, ymd, parseYmd, addDays, startOfDay, isWeekday, weekStart, mdLabel, TODAY,
  dateLabel, dateLabelW, minsLabel, durationLabel, spanOfApp as spanOf, hrLabel, whoLabel,
  memberName, planShiftRule, daySummary, pendingQueue, REJECT_REASONS, NOTE_TEMPLATES, isLate, todayDate,
  loadIntegrations, saveIntegrations, DEFAULT_INTEG, loadLog, saveLog,
  type IntegrationsState, type AdminLogItem,
} from '../admin-domain';
import { KIND, STATUS, MACHINE_MAP } from '@shared/domain';
import { stlAdminUrl } from '../admin-api';
import {
  LOGO, machineColor, MDot, KindBadge, KIND_TONE, Tag, Chip, agoLabel, logTime,
  Header, DayStrip, CalAdmin, Drawer, Toast, SettingsDialog,
} from './AdminUi';

function StlBlock({ app }) {
  const name = app.file || 'データなし（予約のみ）';
  const size = app.fileSize ? (app.fileSize / 1048576).toFixed(2) + ' MB' : null;
  return (
    <div className="stl">
      <div className="stl-canvas" style={{
        backgroundImage: 'linear-gradient(var(--hair) 1px, transparent 1px), linear-gradient(90deg, var(--hair) 1px, transparent 1px)',
        backgroundSize: '14px 14px, 14px 14px',
        display: 'grid', placeItems: 'center',
      }}>
        <div style={{ textAlign: 'center', display: 'grid', gap: 3, justifyItems: 'center' }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: 'var(--faint)',
            border: '1px dashed var(--border-strong)', borderRadius: 4, padding: '2px 7px', background: 'rgba(255,255,255,.85)',
          }}>{app.kind === 'request' ? 'STL' : 'RESERVE'}</span>
          <span style={{ fontSize: 9.5, color: 'var(--faint)', background: 'rgba(255,255,255,.85)', padding: '0 4px' }}>
            {app.kind === 'request' ? 'サムネイル未生成 — ブラウザで開いて確認' : 'データ提出なし'}
          </span>
        </div>
      </div>
      <div className="stl-meta">
        <span className="stl-ext">{app.file ? app.file.split('.').pop().toUpperCase() : '—'}</span>
        <span className="stl-name">
          <b className="num">{name}</b>
          <span>{size ? `${size} ・ 更新 ${agoLabel(app.createdAt)}` : '予約枠のみの申請'}</span>
        </span>
        <span className="stl-actions">
          <a className="mini" href={stlAdminUrl(app.id)} download={app.file || undefined} style={{ textDecoration: 'none' }} aria-disabled={!app.file}>DL</a>
          <a className="mini" href={stlAdminUrl(app.id)} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', pointerEvents: app.file ? 'auto' : 'none', opacity: app.file ? 1 : 0.45 }}>開く</a>
        </span>
      </div>
    </div>
  );
}

function Kv({ rows }) {
  return (
    <dl className="kv" style={{ minWidth: 0 }}>
      {rows.map(([k, v, sub]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}{sub && <small> {sub}</small>}</dd>
        </div>
      ))}
    </dl>
  );
}

function AppLog({ log, appId }) {
  const items = log.filter(l => l.appId === appId).sort((a, b) => b.at.localeCompare(a.at));
  if (!items.length) return null;
  return (
    <div>
      <div className="ftitle">この申請の履歴</div>
      {items.map(l => (
        <div key={l.id} className={'log-item ' + l.type}>
          <span className="bd" />
          <span className="tx">
            {l.text}
            <span className="at"><span className="who">{l.actor}</span>{logTime(l.at)}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function ReviewActions({ app, onAct, initialMode }) {
  const [mode, setMode] = React.useState(initialMode || null);
  const [reason, setReason] = React.useState(null);
  const [noteText, setNoteText] = React.useState(app.adminNote || '');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    setMode(initialMode || null); setReason(null); setError('');
    setNoteText(app.adminNote || '');
  }, [app.id, initialMode]);

  const doReject = () => {
    if (!reason) { setError('理由を1つ選んでください'); return; }
    const r = REJECT_REASONS.find(x => x.id === reason);
    onAct('reject', { reason: r, note: noteText });
  };

  const doNote = () => {
    if (!noteText.trim()) { setError('メモを入力してください'); return; }
    onAct('note', { note: noteText.trim() });
    setMode(null);
  };

  return (
    <div style={{ display: 'grid', gap: 9 }}>
      {app.status === 'pending' && (
        <>
          <div className="note warn">
            <span><b>確認待ち。</b>内容に問題がなければ確定、無理なら理由を選んで却下します。確定すると枠が埋まり、他の人の申請は通りません。</span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={() => onAct('approve')} style={{ flex: 1, minWidth: 130 }}>確定する</button>
            <button type="button" className="btn btn-danger" onClick={() => setMode(mode === 'reject' ? null : 'reject')} style={{ flex: 1, minWidth: 110 }}>却下…</button>
          </div>
        </>
      )}

      {app.status !== 'pending' && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {app.status === 'approved' && (
            <button type="button" className="btn btn-primary" onClick={() => onAct('done')}>完了にする</button>
          )}
          <button type="button" className="btn btn-secondary" onClick={() => onAct('reopen')}>申請中に戻す</button>
        </div>
      )}

      {app.status === 'pending' && mode === 'reject' && (
        <div style={{ display: 'grid', gap: 8, borderTop: '1px solid var(--hair)', paddingTop: 9 }}>
          <div className="ftitle">却下の理由<span className="req">必須</span></div>
          <div className="reasons">
            {REJECT_REASONS.map(r => (
              <button type="button" key={r.id} className={'reason' + (reason === r.id ? ' on' : '')}
                onClick={() => { setReason(r.id); setError(''); }}>
                <i />
                <span>
                  <b>{r.label}</b>
                  <span>{r.body}</span>
                </span>
              </button>
            ))}
          </div>
          <div>
            <div className="ftitle">申請者へのメッセージ</div>
            <textarea className="textarea" value={noteText} maxLength={200}
              onChange={e => setNoteText(e.target.value)}
              placeholder="選んだ理由に補足がある場合だけ書きます（任意）" />
          </div>
          {error && <div className="note warn"><span>{error}</span></div>}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setMode(null); setError(''); }}>やめる</button>
            <button type="button" className="btn btn-primary btn-sm" onClick={doReject}>この理由で却下</button>
          </div>
        </div>
      )}

      <div style={{ borderTop: '1px solid var(--hair)', paddingTop: 9 }}>
        <div className="ftitle" style={{ justifyContent: 'space-between' }}>
          <span>担当者メモ{app.adminNote ? '（保存済み）' : ''}</span>
          <button type="button" className="linkbtn" onClick={() => setMode(mode === 'note' ? null : 'note')}>
            {mode === 'note' ? '閉じる' : '書く'}
          </button>
        </div>
        {app.adminNote && mode !== 'note' && (
          <div className="note tip" style={{ marginBottom: 4 }}><span>{app.adminNote}</span></div>
        )}
        {mode === 'note' && (
          <div style={{ display: 'grid', gap: 6 }}>
            <textarea className="textarea" value={noteText} maxLength={200}
              onChange={e => setNoteText(e.target.value)} placeholder="印刷条件や受け取りの指示など" />
            <div className="presets">
              {NOTE_TEMPLATES.map(t => (
                <button type="button" key={t} className="preset" onClick={() => setNoteText(t)}>{t.slice(0, 12)}…</button>
              ))}
            </div>
            {error && <div className="note warn"><span>{error}</span></div>}
            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setMode(null); setError(''); }}>キャンセル</button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={doNote}>メモを保存</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewSheet({
  app,
  log,
  onClose,
  onAct,
  initialMode,
  staffLabel,
}: {
  app: AdminApplication | null;
  log: AdminLogItem[];
  onClose: () => void;
  onAct: (app: AdminApplication, type: string, payload?: unknown) => void;
  initialMode?: string | null;
  staffLabel?: string | null;
}) {
  if (!app) return null;
  const sp = spanOf(app);
  const staff = staffLabel ?? null;
  const flags = [];
  if (isLate(app)) flags.push(['当日・締切超過', 'warn']);

  return (
    <Drawer open={!!app} title={app.title}
      sub={<>
        <span className="num" style={{ whiteSpace: 'nowrap' }}>{dateLabelW(app.date)}</span>
        <span>·</span>
        <span style={{ whiteSpace: 'nowrap' }}>{MACHINE_MAP[app.machine].name}</span>
      </>}
      onClose={onClose}
      footer={<button type="button" className="btn btn-secondary" onClick={onClose}>閉じる</button>}>
      <div className="rv-flags">
        <KindBadge kind={app.kind} />
        <Tag status={app.status} />
        {flags.map(([t, tone]) => <Chip key={t} tone={tone}>{t}</Chip>)}
        <Chip>申請 {agoLabel(app.createdAt)}</Chip>
      </div>

      <Kv rows={[
        ['時間', app.kind === 'request' ? '16:30〜20:00' : `${minsLabel(sp.start)}〜${minsLabel(sp.end)}`, app.kind === 'request' ? '（依頼枠を丸ごと占有）' : `（${durationLabel(sp.end - sp.start)}）`],
        ['機種', MACHINE_MAP[app.machine].name, `／ ${MACHINE_MAP[app.machine].maker}`],
        ['担当', staff || '休み'],
        ['申請者', whoLabel(app.who, true)],
        ['種別', KIND[app.kind], app.kind === 'request' ? 'STL提出あり' : 'データ提出なし'],
      ]} />

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

      <ReviewActions app={app} onAct={(type, payload) => onAct(app, type, payload)} initialMode={initialMode} />
      <AppLog log={log} appId={app.id} />
    </Drawer>
  );
}

export { StlBlock, Kv, AppLog, ReviewActions, ReviewSheet };
