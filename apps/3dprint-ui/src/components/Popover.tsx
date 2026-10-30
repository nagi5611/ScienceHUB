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

const WHEEL_ITEM = 36;

/* ── ホイール（縦スクロールで値を選ぶ） ── */
function Wheel({ label, options, value, onChange, disabled }) {
  const boxRef = React.useRef(null);
  const last = React.useRef(null);
  const programmatic = React.useRef(false);

  /* 外部（value）が変わったら、その位置へスクロールを合わせる */
  React.useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const idx = Math.max(0, options.findIndex(o => o.value === value));
    if (last.current === idx) return;
    last.current = idx;
    const target = idx * WHEEL_ITEM;
    programmatic.current = true;
    const apply = () => { el.scrollTop = target; };
    apply();
    const raf = requestAnimationFrame(apply);
    const t1 = setTimeout(apply, 120);
    const t2 = setTimeout(apply, 300);
    const t3 = setTimeout(() => { programmatic.current = false; }, 380);
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [value, options]);

  /* ユーザーのスクロールを値に反映 */
  React.useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    let raf = 0;
    const handler = () => {
      if (programmatic.current) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const idx = Math.max(0, Math.min(options.length - 1, Math.round(el.scrollTop / WHEEL_ITEM)));
        if (idx !== last.current) {
          last.current = idx;
          onChange(options[idx].value);
        }
      });
    };
    el.addEventListener('scroll', handler, { passive: true });
    return () => { el.removeEventListener('scroll', handler); cancelAnimationFrame(raf); };
  }, [options, onChange]);

  const step = dir => {
    const cur = Math.max(0, options.findIndex(o => o.value === value));
    const nx = Math.max(0, Math.min(options.length - 1, cur + dir));
    onChange(options[nx].value);
  };

  return (
    <div className="wheel-field">
      <span className="flabel">{label}</span>
      <div className="wheel-outer">
        <div className="wheel-band" aria-hidden="true" />
        <div className="wheel" ref={boxRef} role="listbox"
          aria-label={label} tabIndex={disabled ? -1 : 0}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') { e.preventDefault(); step(1); }
            if (e.key === 'ArrowUp') { e.preventDefault(); step(-1); }
          }}>
          <div className="wheel-pad" />
          {options.map(o => (
            <div key={o.value} role="option" aria-selected={o.value === value}
              className={'wheel-item' + (o.value === value ? ' on' : '') + (o.banned ? ' banned' : '')}
              onClick={() => !o.banned && onChange(o.value)}>
              {o.label}
            </div>
          ))}
          <div className="wheel-pad" />
        </div>
      </div>
    </div>
  );
}

/* ── ファイルのドラッグ＆ドロップ ── */
const ACCEPT = ['.stl', '.gcode', '.gco', '.3mf', '.obj'];
function FileDrop({ file, setFile, error }) {
  const inputRef = React.useRef(null);
  const [over, setOver] = React.useState(false);

  const take = list => {
    const f = list && list[0];
    if (!f) return;
    const ok = ACCEPT.some(ext => f.name.toLowerCase().endsWith(ext));
    setFile({ name: f.name, size: f.size, ok, raw: f });
  };

  return (
    <div className="filedrop-wrap">
      <div className={'filedrop' + (over ? ' over' : '') + (error ? ' bad' : '') + (file ? ' filled' : '')}
        onDragOver={e => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={e => { e.preventDefault(); setOver(false); take(e.dataTransfer.files); }}
        onClick={() => inputRef.current && inputRef.current.click()}
        role="button" tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current.click(); } }}>
        <input ref={inputRef} type="file" accept={ACCEPT.join(',')} className="sr"
          onChange={e => take(e.target.files)} />
        {file ? (
          <>
            <span className="fd-icon num">{file.name.split('.').pop().toUpperCase()}</span>
            <span className="fd-main">
              <b>{file.name}</b>
              <span className="num">{(file.size / 1024 / 1024).toFixed(2)} MB ・ クリックで差し替え</span>
            </span>
            <button type="button" className="iconbtn" aria-label="ファイルを外す"
              onClick={e => { e.stopPropagation(); setFile(null); }}>×</button>
          </>
        ) : (
          <>
            <span className="fd-icon empty">+</span>
            <span className="fd-main">
              <b>STL / GCODE をドラッグ＆ドロップ</b>
              <span>またはクリックして選択（.stl .gcode .3mf .obj）</span>
            </span>
          </>
        )}
      </div>
      {file && !file.ok && <span className="help" style={{ color: 'var(--color-warn-ink)' }}>対応していない形式です。STL か GCODE を選んでください。</span>}
    </div>
  );
}

/* ── 申請ポップ ── */
function ApplicationPopover({ open, draft, apps, profile, setProfile, onClose, onSubmit, onChangeRange }) {
  const [kind, setKind] = React.useState('reserve');
  const [machine, setMachine] = React.useState('ke');
  const [startMin, setStartMin] = React.useState(DAY_START + 60);
  const [endMin, setEndMin] = React.useState(DAY_START + 180);
  const [title, setTitle] = React.useState('');
  const [file, setFile] = React.useState(null);
  const [note, setNote] = React.useState('');
  const [name, setName] = React.useState('');
  const [hr, setHr] = React.useState('');
  const [num, setNum] = React.useState('');
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    if (!open || !draft) return;
    setTouched(false);
    setKind(draft.kind || 'reserve');
    setMachine(draft.machine || 'ke');
    setStartMin(slotStart(draft.start));
    setEndMin(slotStart(draft.end - 1) + SLOT_MIN);
    setTitle(''); setFile(null); setNote('');
    setName(profile.name || ''); setHr(profile.hr || ''); setNum(profile.num || '');
  }, [open, draft]);

  if (!open || !draft) return null;

  const date = draft.date;
  const d = parseYmd(date);
  const info = computeDay(apps, date);
  const blocked = info.machines[machine].blocked;
  const isReserve = kind === 'reserve';

  const startIdx = slotIndex(startMin);
  const endIdx = slotIndex(endMin);
  const len = Math.max(1, endIdx - startIdx);

  /* 予約は 6:00〜20:00 の全枠から選べる。占有済みの枠は選べない */
  const times = [];
  for (let m = DAY_START; m <= DAY_END; m += SLOT_MIN) times.push(m);

  const startOpts = times.slice(0, -1).map(m => ({ value: m, label: minsLabel(m), banned: !!blocked[slotIndex(m)] }));
  const endOpts = times.slice(1).map(m => ({ value: m, label: minsLabel(m), banned: !!blocked[slotIndex(m) - 1] }));

  const rangeBlocked = isReserve ? blocked.slice(startIdx, endIdx).some(Boolean) : blocked.slice(SHIFT_SLOT_START, SHIFT_SLOT_END).some(Boolean);
  const dateErr = !hasShift(date);
  const nameErr = !name.trim() || !isValidHR(hr) || !/^\d{1,2}$/.test(String(num).trim());
  const titleErr = !title.trim();
  const fileErr = !file || !file.ok;
  const lenErr = isReserve && endIdx <= startIdx;
  const deadlineErr = !isReserve && !requestAllowed(date);
  const canSubmit = !rangeBlocked && !dateErr && !nameErr && !titleErr && !fileErr && !lenErr && !deadlineErr;

  const pushRange = (m, s, e) => {
    if (onChangeRange) onChangeRange(m, s, e);
  };

  const setStart = v => {
    setStartMin(v);
    const s = slotIndex(v);
    if (slotIndex(endMin) <= s) {
      const ne = Math.min(DAY_END, slotStart(s) + SLOT_MIN);
      setEndMin(ne);
      pushRange(machine, s, slotIndex(ne));
    } else pushRange(machine, s, slotIndex(endMin));
  };
  const setEnd = v => {
    setEndMin(v);
    pushRange(machine, startIdx, slotIndex(v));
  };
  const setMachineSafe = m => {
    setMachine(m);
    if (isReserve) pushRange(m, startIdx, endIdx);
    else pushRange(m, SHIFT_SLOT_START, SHIFT_SLOT_END);
  };
  const setKindSafe = k => {
    setKind(k);
    if (k === 'request') pushRange(machine, SHIFT_SLOT_START, SHIFT_SLOT_END);
    else pushRange(machine, startIdx, endIdx);
  };

  const submit = () => {
    setTouched(true);
    if (!canSubmit) return;
    onSubmit({
      date, machine, kind,
      start: isReserve ? startMin : SHIFT_START,
      end: isReserve ? endMin : SHIFT_END,
      title: title.trim(),
      file: file.name,
      fileSize: file.size,
      fileRaw: file.raw,
      note: note.trim(),
      who: { name: name.trim(), hr, num: String(num).trim() },
    });
    setProfile({ name: name.trim(), hr, num: String(num).trim() });
  };

  return (
    <div className="pop-layer" role="presentation">
      <div className="pop-scrim" onClick={onClose} />
      <div className="pop" role="dialog" aria-modal="true" aria-label="3Dプリントの申請">
        <div className="pop-h">
          <div className="pop-title">
            <span className="badge">申請</span>
            <b className="num">{d.getFullYear()}/{pad2(d.getMonth() + 1)}/{pad2(d.getDate())}</b>
            <span className={'wd' + (d.getDay() === 0 ? ' sun' : d.getDay() === 6 ? ' sat' : '')}>{WD[d.getDay()]}曜日</span>
          </div>
          <button type="button" className="iconbtn" onClick={onClose} aria-label="閉じる">×</button>
        </div>

        <div className="pop-body">
          {dateErr && (
            <div className="alertbox warn">
              <div><b>この日は担当者のシフトがありません。</b>予約・依頼とも、平日の稼働日のみ受け付けています。</div>
            </div>
          )}
          {!isReserve && !requestAllowed(date) && (
            <div className="alertbox warn">
              <div><b>印刷依頼は前日までです。</b>当日の依頼は受け付けていません。予約を使うか、明日以降の日付を選んでください。</div>
            </div>
          )}

          <div className="field">
            <span className="flabel">申請の種類<span className="req">必須</span></span>
            <div className="seg" role="tablist">
              <button type="button" role="tab" aria-selected={isReserve}
                className={isReserve ? 'on' : ''} onClick={() => setKindSafe('reserve')}>予約</button>
              <button type="button" role="tab" aria-selected={!isReserve}
                className={!isReserve ? 'on' : ''} onClick={() => setKindSafe('request')}
                disabled={!requestAllowed(date)}
                title={!requestAllowed(date) ? '印刷依頼は前日までです' : undefined}>依頼{!requestAllowed(date) ? '（前日まで）' : ''}</button>
            </div>
            <span className="help">
              {isReserve
                ? 'プリンター時間の予約（空きがあれば自動確定）。6:00〜20:00 で開始・終了を指定します。'
                : '印刷依頼（STL）：担当者が受領するまで申請中。16:30〜20:00 の枠・受付は前日まで。'}
            </span>
          </div>

          <div className="field">
            <span className="flabel">機種<span className="req">必須</span></span>
            <div className="mach-row">
              {MACHINES.map(m => {
                const mi = info.machines[m.id];
                const okSlots = isReserve ? mi.free : mi.blocked.slice(SHIFT_SLOT_START, SHIFT_SLOT_END).filter(x => !x).length;
                return (
                  <button type="button" key={m.id} className={'mach' + (machine === m.id ? ' on' : '')}
                    onClick={() => setMachineSafe(m.id)} aria-pressed={machine === m.id}>
                    <i style={{ background: m.id === 'ke' ? 'var(--color-primary)' : 'var(--color-tip)' }} />
                    <span className="mach-tx">
                      <b>{m.name}</b>
                      <span className="num">{!info.shift ? 'この日は休み' : okSlots ? `空き ${okSlots}` : '満枠'}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {isReserve ? (
            <div className="field">
              <span className="flabel">
                利用時間<span className="req">必須</span>
                <span className="flabel-num num">{minsLabel(startMin)}〜{minsLabel(endMin)}（{durationLabel(len * SLOT_MIN)}）</span>
              </span>
              <div className="wheelwrap">
                <Wheel label="開始" options={startOpts} value={startMin} onChange={setStart} disabled={dateErr} />
                <Wheel label="終了" options={endOpts} value={endMin} onChange={setEnd} disabled={dateErr} />
              </div>
              {rangeBlocked && (
                <div className="alertbox warn"><div><b>この範囲は埋まっています。</b>空いている時間帯に動かしてください。</div></div>
              )}
            </div>
          ) : (
            <div className="field">
              <span className="flabel">印刷時間</span>
              <div className="fixslot">
                <b className="num">16:30〜20:00</b>
                <span>依頼はこの枠をまとめて確保します（時間の指定はできません）</span>
              </div>
              {rangeBlocked && (
                <div className="alertbox warn"><div><b>この機種の 16:30〜20:00 はすでに埋まっています。</b>別の機種か別の日を選んでください。</div></div>
              )}
            </div>
          )}

          <div className="field">
            <span className="flabel">{isReserve ? '用途' : '作品名'}<span className="req">必須</span></span>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)}
              placeholder={isReserve ? '例：部品の試し刷り' : '例：スマホスタンド'} maxLength={40} />
          </div>

          <div className="field">
            <span className="flabel">印刷データ<span className="req">必須</span></span>
            <FileDrop file={file} setFile={setFile} error={touched && !file} />
            <span className="help num">ファイル名は「HR_番号_名前_作品名」にしてください（例：203_12_南野_stand.stl）。</span>
          </div>

          <div className="field">
            <span className="flabel">申請者<span className="req">必須</span>{profile.name && <span className="flabel-auto">前回の入力から復元</span>}</span>
            <div className="who-row">
              <select className="input" value={isValidHR(hr) ? hr : ''}
                onChange={e => setHr(e.target.value)} aria-label="HR（学年・組）">
                <option value="">HR</option>
                {HR_LIST.map(v => <option key={v} value={v}>{hrLabel(v)}</option>)}
              </select>
              <input className="input" value={num} onChange={e => setNum(e.target.value.replace(/[^0-9]/g, '').slice(0, 2))}
                placeholder="番号" maxLength={2} inputMode="numeric" aria-label="出席番号" />
              <input className="input" value={name} onChange={e => setName(e.target.value)}
                placeholder="名前" maxLength={20} aria-label="名前" />
            </div>
          </div>

          <div className="field">
            <span className="flabel">備考</span>
            <textarea className="input" value={note} onChange={e => setNote(e.target.value)}
              placeholder="サポートの有無、フィラメントの色など" maxLength={200} />
          </div>

          <dl className="dl">
            <div><dt>日付</dt><dd className="num">{d.getFullYear()}/{pad2(d.getMonth() + 1)}/{pad2(d.getDate())}（{WD[d.getDay()]}）</dd></div>
            <div><dt>機種</dt><dd>{MACHINE_MAP[machine].name}</dd></div>
            <div><dt>時間</dt><dd className="num">{isReserve ? `${minsLabel(startMin)}〜${minsLabel(endMin)}` : '16:30〜20:00'}</dd></div>
            <div><dt>担当</dt><dd>{info.shift ? info.staff : '—'}</dd></div>
            <div><dt>申請者</dt><dd>{whoLabel({ name: name || '—', hr, num }, true)}</dd></div>
          </dl>

          {touched && !canSubmit && (
            <div className="alertbox warn">
              <div><b>入力内容を確認してください。</b><br />
                {dateErr && '日付が稼働日ではありません。 '}
                {lenErr && '終了が開始より前です。 '}
                {titleErr && '用途（作品名）を入力してください。 '}
                {fileErr && '印刷データを添付してください。 '}
                {nameErr && 'HR（101〜309）・番号・名前を入力してください。 '}
              </div>
            </div>
          )}
        </div>

        <div className="pop-f">
          <button type="button" className="btn btn-secondary" onClick={onClose}>キャンセル</button>
          <button type="button" className="btn btn-primary" data-testid="btn-submit-application" onClick={submit} disabled={!canSubmit}>申請する</button>
        </div>
      </div>
    </div>
  );
}

export { Wheel, FileDrop, ApplicationPopover };
