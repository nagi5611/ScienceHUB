import React from 'react';
import type { Application } from '@shared/types';
import {
  WD, pad2, ymd, parseYmd, addDays, startOfDay, isWeekday, hasShift, staffFor, weekStart, mdLabel,
  slotStart, minsLabel, rangeLabel, slotRangeLabel, durationLabel, slotIndex, inShiftSlot, spanOf, clampRange,
  HR_LIST, isValidHR, hrLabel, whoLabel, requestAllowed, isPastDate, todayStrOf,
  computeDay, hasOverlap, findNextOpenDate, saveProfile,
  STATUS, KIND, MACHINE_IDS, MACHINE_MAP, MACHINES, SLOT_COUNT, ROW_H, SHIFT_START, SHIFT_END,
  SHIFT_SLOT_START, SHIFT_SLOT_END, SHIFT_SLOTS, DAY_START, DAY_END, SLOT_MIN,
} from '@shared/domain';
import { Chip, Sheet, StatusTag } from '@components/Chrome';

function Field({ label, required, help, children }) {
  return (
    <div className="field">
      <span className="flabel">{label}{required && <span className="req">必須</span>}</span>
      {children}
      {help && <span className="help">{help}</span>}
    </div>
  );
}

function NewApplicationSheet({ open, onClose, draft, apps, profile, setProfile, onSubmit }) {
  const [kind, setKind] = React.useState('request');
  const [machine, setMachine] = React.useState('ke');
  const [date, setDate] = React.useState('');
  const [start, setStart] = React.useState(0);
  const [end, setEnd] = React.useState(1);
  const [title, setTitle] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const [note, setNote] = React.useState('');
  const [name, setName] = React.useState(profile.name || '');
  const [grade, setGrade] = React.useState(profile.grade || '');
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const base = draft && draft.date ? draft.date : ymd(startOfDay(new Date()));
    const safeDate = hasShift(base) ? base : (findNextOpenDate(apps, base) || base);
    setTouched(false);
    setKind(draft && draft.kind ? draft.kind : 'request');
    setMachine(draft && draft.machine ? draft.machine : 'ke');
    setDate(safeDate);
    setName(profile.name || ''); setGrade(profile.grade || '');
    setTitle(''); setFileName(''); setNote('');
    if (draft && draft.start != null) {
      setStart(draft.start); setEnd(draft.end);
    } else {
      const inf = computeDay(apps, safeDate);
      const m = draft && draft.machine ? draft.machine : 'ke';
      const b = inf.machines[m].blocked;
      const firstFree = b.findIndex((x, i) => !x && inShiftSlot(i));
      if (firstFree < 0) { setStart(SHIFT_SLOT_START); setEnd(SHIFT_SLOT_START + 2); }
      else {
        let e = firstFree + 1;
        while (e < SHIFT_SLOT_END && e < firstFree + 2 && !b[e]) e++;
        setStart(firstFree); setEnd(Math.max(firstFree + 1, e));
      }
    }
  }, [open, draft]);

  if (!open) return null;

  const info = computeDay(apps, date);
  const machineInfo = info.machines[machine];
  const blocked = machineInfo.blocked;
  const len = Math.max(1, end - start);
  const rangeBlocked = blocked.slice(start, end).some(Boolean);
  const tooLong = end > SHIFT_SLOT_END;
  const nameErr = !name.trim() || !grade.trim();
  const titleErr = !title.trim();
  const fileErr = kind === 'request' && !fileName.trim();
  const dateErr = !date || !info.shift;
  const canSubmit = !rangeBlocked && !tooLong && !nameErr && !titleErr && !fileErr && !dateErr && len > 0;

  const setStartSafe = v => {
    setStart(v);
    if (end <= v) setEnd(Math.min(SHIFT_SLOT_END, v + 1));
  };
  const setEndSafe = v => { setEnd(Math.max(start + 1, v)); };

  const submit = () => {
    setTouched(true);
    if (!canSubmit) return;
    onSubmit({
      date, machine, kind,
      start: slotStart(start),
      end: slotStart(end - 1) + SLOT_MIN,
      title: title.trim(),
      file: kind === 'request' ? fileName.trim() : '',
      note: note.trim(),
      who: { name: name.trim(), grade: grade.trim() },
    });
    setProfile({ name: name.trim(), grade: grade.trim() });
  };

  const shiftDays = (() => {
    const out = [];
    const base = startOfDay(new Date());
    for (let i = 0; i < 28 && out.length < 10; i++) {
      const d = addDays(base, i);
      if (isWeekday(d)) out.push(ymd(d));
    }
    if (date && hasShift(date) && !out.includes(date)) out.push(date);
    return out.sort();
  })();

  const d = date ? parseYmd(date) : new Date();

  return (
    <Sheet open={open} onClose={onClose}
      title="3Dプリントの申請"
      sub="依頼＝データを出して印刷時間の割当を申請 / 予約＝プリンター時間の確保"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>キャンセル</button>
          <button type="button" className="btn btn-primary" onClick={submit} disabled={!canSubmit}>申請する</button>
        </>
      }>

      <Field label="申請の種類" required>
        <div className="seg" role="tablist">
          <button type="button" role="tab" aria-selected={kind === 'request'} className={kind === 'request' ? 'on' : ''}
            onClick={() => setKind('request')}>依頼（STL提出）</button>
          <button type="button" role="tab" aria-selected={kind === 'reserve'} className={kind === 'reserve' ? 'on' : ''}
            onClick={() => setKind('reserve')}>予約のみ</button>
        </div>
        <span className="help">
          {kind === 'request'
            ? 'STLデータを提出し、印刷時間の割当を申請します。担当者が内容を確認して確定します。'
            : '自分で印刷する時間を確保します。データ提出はありません。'}
        </span>
      </Field>

      <Field label="機種" required>
        <div style={{ display: 'grid', gap: 6 }}>
          {MACHINES.map(m => {
            const mi = info.machines[m.id];
            const ok = mi.free > 0;
            return (
              <button type="button" key={m.id} className={'optcard' + (machine === m.id ? ' on' : '')}
                onClick={() => setMachine(m.id)} aria-pressed={machine === m.id}>
                <span className="rd" aria-hidden="true" />
                <span className="tx">
                  <b><span className="mdot" style={{ background: m.id === 'ke' ? 'var(--color-primary)' : 'var(--color-tip)' }} />{m.name}</b>
                  <span>{m.maker} · {m.hint}</span>
                  <span className={'stt ' + (ok ? 'ok' : 'no')}>
                    {!info.shift ? 'この日は稼働していません' : ok ? `空き枠 ${mi.free} / ${SHIFT_SLOTS}` : '満枠（選択不可）'}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="日付" required help={dateErr && touched ? '担当者のシフトがある平日を選んでください。' : '平日（月〜金）16:30〜20:00 のみ受付'}>
        <select className="input" value={date} onChange={e => setDate(e.target.value)}>
          {shiftDays.map(s => {
            const dd = parseYmd(s);
            const inf = computeDay(apps, s);
            const free = inf.machines.ke.free + inf.machines.cc.free;
            return (
              <option key={s} value={s}>
                {dd.getMonth() + 1}/{dd.getDate()}（{WD[dd.getDay()]}）— 空き {free}枠
              </option>
            );
          })}
        </select>
      </Field>

      <Field label="時間" required
        help={rangeBlocked ? '選んだ範囲にすでに申請が入っています。' : `受付 16:30〜20:00 / ${durationLabel(len * SLOT_MIN)}`}>
        <div className="field-row">
          <select className="input" value={start} onChange={e => setStartSafe(Number(e.target.value))}>
            {Array.from({ length: SHIFT_SLOTS }).map((_, k) => {
              const i = SHIFT_SLOT_START + k;
              return <option key={i} value={i} disabled={!!blocked[i]}>{minsLabel(slotStart(i))} 開始</option>;
            })}
          </select>
          <select className="input" value={end} onChange={e => setEndSafe(Number(e.target.value))}>
            {Array.from({ length: SHIFT_SLOTS }).map((_, k) => {
              const i = SHIFT_SLOT_START + k;
              return <option key={i} value={i + 1} disabled={i + 1 <= start}>{minsLabel(slotStart(i) + SLOT_MIN)} 終了</option>;
            })}
          </select>
        </div>
        {rangeBlocked && (
          <div className="alertbox warn"><b>この範囲は埋まっています。</b>空いている時間帯に変更してください。<br />
            <span className="num">{rangeLabel(start, end - 1)}</span> のいずれかの枠に申請があります。
          </div>
        )}
      </Field>

      <Field label={kind === 'request' ? '作品名' : '用途'} required>
        <input className="input" value={title} onChange={e => setTitle(e.target.value)}
          placeholder={kind === 'request' ? '例：スマホスタンド' : '例：部品の試し刷り'}
          maxLength={40} />
      </Field>

      {kind === 'request' && (
        <Field label="STLファイル名" required help="「学年組番号_名前_作品名.stl」の形式にしてください。">
          <input className="input" value={fileName} onChange={e => setFileName(e.target.value)}
            placeholder="例：2-3_南野_stand.stl" maxLength={60} />
        </Field>
      )}

      <Field label="申請者" required>
        <div className="field-row">
          <input className="input" value={grade} onChange={e => setGrade(e.target.value)} placeholder="学年組番号（2-3）" maxLength={10} />
          <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="名前" maxLength={20} />
        </div>
      </Field>

      <Field label="備考" help="サポートの有無、使用フィラメントの色など。">
        <textarea className="input" value={note} onChange={e => setNote(e.target.value)} placeholder="例：白のPLAで印刷したい" maxLength={200} />
      </Field>

      <div className="dl">
        <div><dt>日時</dt><dd className="num">{d.getFullYear()}/{pad2(d.getMonth() + 1)}/{pad2(d.getDate())} {slotRangeLabel(slotStart(start), slotStart(end - 1) + SLOT_MIN)}</dd></div>
        <div><dt>機種</dt><dd>{MACHINE_MAP[machine].name}</dd></div>
        <div><dt>印刷時間</dt><dd className="num">{durationLabel(len * SLOT_MIN)}</dd></div>
        <div><dt>担当</dt><dd>{info.shift ? info.staff : '—'}</dd></div>
      </div>

      {touched && !canSubmit && (
        <div className="alertbox warn">
          <div><b>入力内容を確認してください。</b><br />
            {dateErr && '日付が稼働日ではありません。'}
            {nameErr && '申請者を入力してください。'}
            {titleErr && '作品名を入力してください。'}
            {fileErr && 'STLファイル名を入力してください。'}
          </div>
        </div>
      )}
    </Sheet>
  );
}

function DetailSheet({ open, onClose, app, onCancel }) {
  if (!open || !app) return null;
  const d = parseYmd(app.date);
  const st = app.status;
  return (
    <Sheet open={open} onClose={onClose} title={app.title}
      sub={`${d.getFullYear()}/${pad2(d.getMonth() + 1)}/${pad2(d.getDate())}（${WD[d.getDay()]}）`}
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>閉じる</button>
          {app.mine && (st === 'pending' || st === 'approved') && (
            <button type="button" className="btn btn-primary" onClick={() => { onCancel(app.id); }}>申請を取り消す</button>
          )}
        </>
      }>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <StatusTag status={st} />
        <Chip tone={app.kind === 'request' ? 'orange' : 'blue'}>{KIND[app.kind]}</Chip>
        {app.mine && <Chip>自分の申請</Chip>}
      </div>

      <dl className="dl">
        <div><dt>機種</dt><dd>{MACHINE_MAP[app.machine].name}</dd></div>
        <div><dt>時間</dt><dd className="num">{app.kind === 'request' ? '16:30〜20:00（依頼枠）' : `${minsLabel(app.start)}〜${minsLabel(app.end)}（${durationLabel(app.end - app.start)}）`}</dd></div>
        <div><dt>担当</dt><dd>{hasShift(app.date) ? staffFor(app.date) : '—'}</dd></div>
        <div><dt>申請者</dt><dd>{whoLabel(app.who, true)}</dd></div>
        {app.file && <div><dt>印刷データ</dt><dd className="num" style={{ wordBreak: 'break-all' }}>{app.file}{app.fileSize ? `（${(app.fileSize / 1024 / 1024).toFixed(2)} MB）` : ''}</dd></div>}
      </dl>

      {app.note && (
        <Field label="備考"><p style={{ fontSize: 13, color: 'var(--color-text)', lineHeight: 1.7 }}>{app.note}</p></Field>
      )}

      {st === 'pending' && (
        <div className="alertbox tip"><div>担当者の確認待ちです。確定するとこの枠が他の人の申請で埋まります。</div></div>
      )}
      {st === 'approved' && (
        <div className="alertbox tip"><div><b>申請は確定しています。</b>開始時刻の5分前までに物理実験室へ来てください。</div></div>
      )}
      {st === 'rejected' && (
        <div className="alertbox warn"><div><b>却下されました。</b>{app.note || '内容を確認して再申請してください。'}</div></div>
      )}
      {st === 'done' && (
        <div className="alertbox tip"><div>印刷は完了しています。記録の記入を忘れずに。</div></div>
      )}
    </Sheet>
  );
}

function MineSheet({ open, onClose, apps, onOpenApp }) {
  const mine = apps.filter(a => a.mine).sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
  const active = mine.filter(a => a.status === 'pending' || a.status === 'approved');
  const other = mine.filter(a => a.status !== 'pending' && a.status !== 'approved');

  return (
    <Sheet open={open} onClose={onClose} title="自分の申請"
      sub={`進行中 ${active.length}件 / 履歴 ${other.length}件`}>
      {mine.length === 0 && (
        <div className="emptybox">まだ申請はありません。カレンダーから日付を選んで申請できます。</div>
      )}
      {active.length > 0 && (
        <>
          <div className="flabel">進行中</div>
          {active.map(a => <MineItem key={a.id} app={a} onOpen={onOpenApp} />)}
        </>
      )}
      {other.length > 0 && (
        <>
          <div className="flabel" style={{ marginTop: 4 }}>履歴</div>
          {other.map(a => <MineItem key={a.id} app={a} onOpen={onOpenApp} />)}
        </>
      )}
    </Sheet>
  );
}

function MineItem({ app, onOpen }) {
  const d = parseYmd(app.date);
  return (
    <div className="mine-item">
      <div className="top">
        <b>{app.title}</b>
        <StatusTag status={app.status} />
      </div>
      <div className="l2">
        <span className="num">{d.getMonth() + 1}/{d.getDate()}（{WD[d.getDay()]}）{app.kind === 'request' ? '16:30〜20:00' : `${minsLabel(app.start)}〜${minsLabel(app.end)}`}</span>
        <span>·</span>
        <span>{MACHINE_MAP[app.machine].short}</span>
        <span>·</span>
        <span>{KIND[app.kind]}</span>
      </div>
      {app.status === 'rejected' && app.note && <div className="note">{app.note}</div>}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-secondary" style={{ minHeight: 32, padding: '4px 10px', fontSize: 12 }} onClick={() => onOpen(app)}>詳細</button>
      </div>
    </div>
  );
}

export { Field, NewApplicationSheet, DetailSheet, MineSheet, MineItem };
