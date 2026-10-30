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
import { useCalPeriodNav } from '../../hooks/useCalPeriodNav';

function MoveMonth({ year, month, app, apps, onChangeMonth, onJumpToday }) {
  const { run, enterClass } = useCalPeriodNav();
  const periodKey = `${year}-${pad2(month)}`;
  const cells = monthGrid(year, month);
  return (
    <div className="mm">
      <div className="mm-h">
        <button type="button" onClick={() => run(-1, () => onChangeMonth(-1))} aria-label="前の月">‹</button>
        <div className={enterClass} key={`label-${periodKey}`}>
          <b className="num">{year}年 {month}月</b>
        </div>
        <button type="button" onClick={() => run(1, () => onChangeMonth(1))} aria-label="次の月">›</button>
        <button type="button" className="mini" onClick={onJumpToday}>今月</button>
      </div>
      <div className="cal-period-shell">
        <div className={enterClass} key={periodKey}>
          <div className="mm-wds">
            {WD.map((w, i) => (
              <span key={w} className={'mm-wd' + (i === 0 ? ' sun' : i === 6 ? ' sat' : '')}>{w}</span>
            ))}
          </div>
          <div className="mm-grid">
            {cells.map((d, i) => {
              if (!d) return <span className="mm-cell pad" key={'p' + i} />;
              const ds = ymd(d);
              const c = moveCheck(apps, app, ds);
              const tone = c.sameDay ? 'current' : c.past ? 'past' : c.full ? 'full' : c.noStaff ? 'nostaff' : 'ok';
              return (
                <button type="button" key={ds} data-date={ds}
                  className={'mm-cell ' + tone}
                  onClick={() => !c.past && !c.sameDay && onChangeMonth(0, ds)}
                  aria-label={`${d.getMonth() + 1}月${d.getDate()}日 ${c.full ? '埋まり' : c.noStaff ? '担当なし' : '空き'}`}>
                  <span className="num mm-d">{d.getDate()}</span>
                  <span className="mm-meta">
                    {c.sameDay ? '現在'
                      : c.past ? '—'
                        : c.noStaff ? '担当なし'
                          : c.full ? '満枠'
                            : `空き ${c.free}枠`}
                  </span>
                  {c.liveCount > 0 && !c.past && <span className="mm-count num">{c.liveCount}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* 変更ダイアログ */
function MoveDialog({ open, app, apps, onClose, onMove }) {
  const [ym, setYm] = React.useState(() => {
    const d = app ? parseYmd(app.date) : new Date();
    return { y: d.getFullYear(), m: d.getMonth() + 1 };
  });
  const [picked, setPicked] = React.useState(null);
  const [force, setForce] = React.useState(false);

  React.useEffect(() => {
    if (!app) return;
    const d = parseYmd(app.date);
    setYm({ y: d.getFullYear(), m: d.getMonth() + 1 });
    setPicked(null);
    setForce(false);
  }, [app && app.id, open]);

  if (!open || !app) return null;

  const changeMonth = (n, ds) => {
    if (ds) { setPicked(ds); return; }
    if (n === 0) {
      const d = new Date();
      setYm({ y: d.getFullYear(), m: d.getMonth() + 1 });
      return;
    }
    setYm(prev => {
      let y = prev.y, m = prev.m + n;
      if (m < 1) { m = 12; y -= 1; }
      if (m > 12) { m = 1; y += 1; }
      return { y, m };
    });
  };

  const info = picked ? moveCheck(apps, app, picked) : null;
  const blocked = info && (info.full || info.noStaff);
  const needForce = !!blocked;
  const sp = spanOf(app);

  const done = () => {
    onMove(app, picked, { forced: needForce && force, info });
    setPicked(null);
    setForce(false);
  };

  return (
    <Modal open={open} wide
      title="別の日へ変更"
      sub={<>
        <span>{app.title}</span><span>·</span>
        <span className="num">{dateLabelW(app.date)}</span><span>·</span>
        <span>{KIND[app.kind]}</span>
      </>}
      onClose={onClose}
      footer={<>
        <button type="button" className="btn btn-secondary" onClick={onClose}>閉じる</button>
        <button type="button" className="btn btn-primary"
          disabled={!picked || (needForce && !force)} onClick={done}>
          {picked ? `${dateLabel(picked)} に変更` : '日付を選択'}
        </button>
      </>}>
      <div className="mv-body">
        <div className="mv-note">
          <b>{minsLabel(sp.start)}〜{minsLabel(sp.end)}</b>
          <span className="mv-sep">|</span>
          <span>{MACHINE_MAP[app.machine].name} ・ {app.status === 'approved' ? '確定済みでも変更できます' : '時間帯はそのまま移動します'}</span>
        </div>

        <MoveMonth year={ym.y} month={ym.m} app={app} apps={apps}
          onChangeMonth={changeMonth} onJumpToday={() => changeMonth(0)} />

        <div className="mv-legend">
          <span className="mv-lg ok">空き</span>
          <span className="mv-lg nostaff">担当なし</span>
          <span className="mv-lg full">満枠</span>
          <span className="mv-lg past">過ぎた日</span>
        </div>

        {picked && info && (
          <div className={'mv-picked ' + (info.full ? 'full' : info.noStaff ? 'nostaff' : 'ok')}>
            <div className="mvp-h">
              <b className="num">{dateLabel(info.date)}（{WD[parseYmd(info.date).getDay()]}）</b>
              <span className="mvp-state">
                {info.noStaff ? '担当者がいません' : info.full ? '満枠です' : `空き ${info.free}/${info.total}枠`}
              </span>
            </div>
            <div className="mvp-meta">
              <span>担当：{info.staffs.length ? info.staffs.map(id => memberName(id)).join(' / ') : 'なし'}</span>
              <span>この日の申請：<span className="num">{info.liveCount}件</span></span>
            </div>
            {needForce && (
              <label className="mv-force">
                <input type="checkbox" checked={force} onChange={e => setForce(e.target.checked)} />
                <span>
                  <b>{info.noStaff ? '担当者がいない日にも変更する' : '満枠でも強制的に変更する'}</b>
                  <span className="fl-h">
                    {info.noStaff
                      ? '担当者のいない日は本来受け付けていません。必要な場合だけ強制します。'
                      : '同じ時間帯の申請と重なります。両方を残したまま、この申請を確定・申請中にします。'}
                  </span>
                </span>
              </label>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
export { MoveMonth, MoveDialog };
