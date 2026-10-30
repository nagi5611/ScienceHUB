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

function SlotCell({ i, sel, first, last }) {
  const shift = inShiftSlot(i);
  const hourStart = slotStart(i) % 60 === 0;
  return (
    <div className={'slot' + (sel ? ' sel' : '') + (first ? ' first' : '') + (last ? ' last' : '') +
      (first && last ? ' both' : '') + (shift ? ' shift' : '') + (hourStart ? ' hour' : '')} data-slot={i}>
      {first && <span className="sel-tag num">{minsLabel(slotStart(i))}</span>}
    </div>
  );
}

function Block({ app, onOpen }) {
  const sp = spanOf(app);
  const s = Math.max(0, sp.s);
  const e = Math.min(SLOT_COUNT, sp.e);
  const h = (e - s) * ROW_H;
  const tall = h >= 80;
  const mid = h >= 40;
  return (
    <button type="button" className={'blk ' + app.status + (mid ? '' : ' short')}
      style={{ top: s * ROW_H, height: Math.max(h - 3, 20) }}
      onClick={ev => { ev.stopPropagation(); onOpen(app); }}
      onPointerDown={ev => ev.stopPropagation()}
      title={app.title + ' / ' + app.who.name + ' / ' + slotRangeLabel(sp.start, sp.end)}>
      {mid && <span className="st">{STATUS[app.status]}</span>}
      <span className="t">{app.title}</span>
      {tall && (
        <span className="m">
          <em className={app.kind === 'request' ? 'req' : 'res'}>{KIND[app.kind]}</em>
          <span className="num">
            {app.kind === 'request' ? '16:30–20:00' : minsLabel(app.start) + '–' + minsLabel(app.end)}
          </span>
        </span>
      )}
    </button>
  );
}

function Lane({ machineId, info, selection, onSelect, closed, onOpenApp, kind }) {
  const laneRef = React.useRef(null);
  const drag = React.useRef(null);
  const [ghost, setGhost] = React.useState(null);
  const blockedFn = React.useCallback(i => !!info.blocked[i], [info.blocked]);

  const idxAt = clientY => {
    const r = laneRef.current.getBoundingClientRect();
    const raw = Math.floor(((clientY - r.top) / r.height) * SLOT_COUNT);
    return Math.max(0, Math.min(SLOT_COUNT - 1, raw));
  };

  const onDown = ev => {
    if (closed) return;
    if (ev.button != null && ev.button !== 0) return;
    const i = idxAt(ev.clientY);
    if (info.blocked[i]) return;
    ev.preventDefault();
    try { laneRef.current.setPointerCapture(ev.pointerId); } catch (err) {}
    drag.current = { anchor: i, pointerId: ev.pointerId };
    setGhost({ start: i, end: i });
  };

  const onMove = ev => {
    const d = drag.current;
    if (!d) return;
    const i = idxAt(ev.clientY);
    const r = clampRange(d.anchor, i, blockedFn);
    setGhost(g => (g && g.start === r[0] && g.end === r[1] ? g : { start: r[0], end: r[1] }));
  };

  const finish = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    setGhost(g => {
      if (g) onSelect({ machine: machineId, start: g.start, end: g.end + 1 });
      return null;
    });
  };

  const view = ghost
    ? { start: ghost.start, end: ghost.end + 1 }
    : selection && selection.machine === machineId ? selection : null;

  return (
    <div className={'lane' + (closed ? ' closed' : '')} ref={laneRef}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={finish}
      onPointerCancel={() => { drag.current = null; setGhost(null); }}
      aria-label={MACHINE_MAP[machineId].name + ' の時間割'}>
      {Array.from({ length: SLOT_COUNT }).map((_, i) => (
        <SlotCell key={i} i={i} sel={!!view && i >= view.start && i < view.end}
          first={!!view && i === view.start} last={!!view && i === view.end - 1} />
      ))}
      {info.items.filter(a => a.status !== 'rejected').map(a => (
        <Block key={a.id} app={a} onOpen={onOpenApp} />
      ))}
    </div>
  );
}

function DayPanel({ dateStr, info, apps, selection, onSelect, onPickRange, onClearSel, onNew, onOpenApp, onJumpNext, nextOpen }) {
  const d = parseYmd(dateStr);
  const wd = d.getDay();
  const todayStr = ymd(startOfDay(new Date()));
  const isToday = dateStr === todayStr;
  const ttRef = React.useRef(null);

  const dayApps = [...info.list].sort((a, b) => spanOf(a).start - spanOf(b).start || MACHINE_IDS.indexOf(a.machine) - MACHINE_IDS.indexOf(b.machine));
  const totalFree = info.machines.ke.free + info.machines.cc.free;
  const totalSlots = SLOT_COUNT * 2;
  const selMachine = selection ? MACHINE_MAP[selection.machine] : null;
  const selOk = selection && info.shift && !info.machines[selection.machine].blocked
    .slice(selection.start, selection.end).some(Boolean);

  /* 日付が変わったら朝（6:00）から表示 */
  React.useEffect(() => {
    const el = ttRef.current;
    if (!el) return;
    el.scrollTop = 0;
  }, [dateStr]);

  return (
    <div className="card daypanel dp-anim" key={dateStr}>
      <div className="dp-head">
        <div className="dp-date">
          <span className="num big">{pad2(d.getMonth() + 1)}/{pad2(d.getDate())}</span>
          <span className={'wd' + (wd === 0 ? ' sun' : wd === 6 ? ' sat' : '')}>{WD[wd]}</span>
          {isToday && <span className="badge">今日</span>}
          <span className="dp-spacer" />
          {info.shift ? <Chip tone="orange">{info.staff}</Chip> : <Chip tone="gray">休み</Chip>}
          <Chip>空き <span className="num">{info.shift ? totalFree : 0}/{totalSlots}</span></Chip>
          {isToday && <Chip tone="blue">当日は予約のみ</Chip>}
        </div>
      </div>

      {!info.shift && (
        <Notice type="warn" label="休み" action={nextOpen ? (
          <button type="button" className="btn btn-secondary" onClick={() => onJumpNext(nextOpen)}>次の空き日へ</button>
        ) : null}>
          <b>この日は担当者のシフトがありません。</b>予約・依頼とも、担当者のいる平日のみ受け付けています。
        </Notice>
      )}

      {isToday && info.shift && (
        <Notice type="tip" label="当日">
          当日は<b>予約のみ</b>受け付けています。印刷依頼は前日までに申請してください。
        </Notice>
      )}

      {info.shift && info.full && (
        <Notice type="warn" label="満枠">
          <b>この日は両機種とも埋まっています。</b>追加の申請はできません。
        </Notice>
      )}

      <div className="tt-headrow">
        <span className="tt-haxis">時刻</span>
        {MACHINE_IDS.map(id => (
          <div className="lane-h" key={id}>
            <span className="dot" style={{ background: id === 'ke' ? 'var(--color-primary)' : 'var(--color-tip)' }} />
            <b>{MACHINE_MAP[id].name}</b>
            <span className="cnt num">{info.shift ? `空き${info.machines[id].free}` : '休み'}</span>
          </div>
        ))}
      </div>

      <div className="tt-scroll" ref={ttRef}>
        <div className="tt" style={{ '--row': ROW_H + 'px' }}>
          <div className="axis" aria-hidden="true">
            {Array.from({ length: SLOT_COUNT / 2 }).map((_, h) => {
              const m = DAY_START + h * 60;
              return (
                <span key={h} className={'num' + (m >= SHIFT_START && m < SHIFT_END ? ' hot' : '')}>
                  {minsLabel(m)}
                </span>
              );
            })}
            <span className="num axis-end">{minsLabel(DAY_END)}</span>
          </div>
          {MACHINE_IDS.map(id => (
            <Lane key={id} machineId={id} info={info.machines[id]} selection={selection}
              onSelect={onPickRange} closed={!info.shift} onOpenApp={onOpenApp} />
          ))}
        </div>
      </div>

      <div className="ttnote">
        <span>6:00〜20:00 ・ 担当者のいる日のみ</span>
        <span>空き枠をドラッグすると申請ポップが開きます</span>
      </div>

      <div className={'selbar' + (selection ? ' railfx' : ' empty')}>
        <div className="info">
          {selection && selMachine ? (
            <>
              <span className="sel-time">
                <b className="num">{slotRangeLabel(slotStart(selection.start), slotStart(selection.end - 1) + SLOT_MIN)}</b>
                <em className="num">{durationLabel((selection.end - selection.start) * SLOT_MIN)}</em>
              </span>
              <span>{selMachine.name} ・ <span className="num">{selection.end - selection.start}枠</span>を選択中</span>
            </>
          ) : (
            <>
              <b>時間帯を選ぶ</b>
              <span>空き枠をドラッグ → 予約は6:00〜20:00で指定できます</span>
            </>
          )}
        </div>
        <div className="btns">
          {selection ? (
            <>
              <div className="quick" aria-label="長さを変える">
                {[1, 2, 3, 4].map(n => {
                  const fits = selection.start + n <= SLOT_COUNT &&
                    !info.machines[selection.machine].blocked.slice(selection.start, selection.start + n).some(Boolean);
                  return (
                    <button key={n} type="button" disabled={!fits}
                      onClick={() => onSelect({ machine: selection.machine, start: selection.start, end: selection.start + n })}>
                      {durationLabel(n * SLOT_MIN)}
                    </button>
                  );
                })}
              </div>
              <button type="button" className="btn btn-ghost" onClick={onClearSel}>解除</button>
              <button type="button" className="btn btn-primary" disabled={!selOk} onClick={onNew}>申請へ進む</button>
            </>
          ) : (
            <button type="button" className="btn btn-primary" disabled={!info.shift || info.full} onClick={onNew}>申請へ進む</button>
          )}
        </div>
      </div>

      <div className="daylist">
        <div className="daylist-h">
          <b>この日の申請・予約</b>
          <span className="num">{dayApps.length}件</span>
        </div>
        {dayApps.length === 0 && (
          <div className="emptybox">
            {info.shift ? 'まだ申請はありません。' : '稼働日ではないため申請はありません。'}
          </div>
        )}
        {dayApps.map(a => {
          const sp = spanOf(a);
          return (
            <div className="row" key={a.id}>
              <div className="time num">
                <b>{minsLabel(sp.start)}</b>
                {minsLabel(sp.end)}
              </div>
              <div className="main">
                <div className="ti">{a.title}</div>
                <div className="meta">
                  <MachineDot id={a.machine} size={5} />
                  <span>{MACHINE_MAP[a.machine].short}</span>
                  <span>·</span>
                  <span>{whoLabel(a.who, true)}</span>
                  <span>·</span>
                  <span>{KIND[a.kind]}</span>
                  {a.file && <><span>·</span><span className="num" style={{ fontSize: 9 }}>{a.file.split('.').pop().toUpperCase()}</span></>}
                </div>
              </div>
              <div className="act">
                <StatusTag status={a.status} />
                <button type="button" className="iconbtn" onClick={() => onOpenApp(a)} aria-label="詳細">›</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { SlotCell, Block, Lane, DayPanel };
