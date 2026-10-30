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
} from './AdminDesignUi';
import { ShiftCalendar, MemberForm, Integrations } from './ShiftsPanels';

function SettingsScreen({ members, avail, onAddMember, onUpdateMember, onRemoveMember, onSetAvail, onPaintAvail,
  integrations, setIntegrations, onTestDiscord, onTestGcal, onTestEmail, emailConfigured, log, pendingPre }) {
  const [tab, setTab] = React.useState(pendingPre || 'shift');
  const [memberId, setMemberId] = React.useState(members[0] ? members[0].id : null);
  const [month, setMonth] = React.useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() + 1 }; });

  React.useEffect(() => { if (pendingPre) setTab(pendingPre); }, [pendingPre]);
  React.useEffect(() => {
    if (members.length && !members.find(m => m.id === memberId)) setMemberId(members[0].id);
  }, [members]);

  const tabs = [
    ['shift', 'シフト表'],
    ['member', '担当者'],
    ['integ', '外部連携'],
  ];

  const changeMonth = n => {
    if (n === 0) { const d = new Date(); setMonth({ y: d.getFullYear(), m: d.getMonth() + 1 }); return; }
    setMonth(prev => {
      let y = prev.y, m = prev.m + n;
      if (m < 1) { m = 12; y -= 1; }
      if (m > 12) { m = 1; y += 1; }
      return { y, m };
    });
  };

  const cur = members.find(m => m.id === memberId);

  return (
    <div className="set-wrap">
      <div className="set-tabs" role="tablist">
        {tabs.map(([id, label]) => (
          <button type="button" key={id} role="tab" aria-selected={tab === id}
            className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {tab === 'shift' && (
        <div className="shifttab">
          <div className="card memberpick">
            <div className="mp-h">
              <b>担当者を選んで、日付を塗る</b>
              <span className="fl-h">選択した担当者の稼働日をカレンダー上で直接追加・削除できます。</span>
            </div>
            <div className="mp-list">
              {members.map(m => {
                const count = (avail[m.id] || []).filter(ds => ds >= TODAY).length;
                return (
                  <button type="button" key={m.id} className={'mp' + (memberId === m.id ? ' on' : '')}
                    style={memberId === m.id ? { borderColor: m.color, background: m.color + '14' } : undefined}
                    onClick={() => setMemberId(m.id)}>
                    <span className="mp-av" style={{ background: m.color }}>{m.name.slice(0, 1)}</span>
                    <span className="mp-tx">
                      <b>{m.name}</b>
                      <span className="num">{hrLabel(m.hr)}・{m.num}番</span>
                    </span>
                    <span className="mp-count num">{count}日</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card">
            <div className="card-h">
              <b>シフト表</b>
              <span className="meta">{cur ? `${cur.name} の稼働日` : '担当者を選択'}</span>
              {cur && <span className="chip" style={{ marginLeft: 'auto', borderColor: cur.color, color: cur.color }}>ドラッグで追加</span>}
            </div>
            <div className="shifttab-body">
              <ShiftCalendar year={month.y} month={month.m} avail={avail} memberId={memberId}
                onPaint={(dates, on) => onPaintAvail(memberId, dates, on)} onChangeMonth={changeMonth} />

              <div className="srule-wrap">
                <div className="srule-h">
                  <b>この月の担当</b>
                  <span className="fl-h">日付をドラッグでなぞるか、上の曜日をクリックすると一括で切り替わります。</span>
                </div>
                <ShiftLegend members={members} avail={avail} month={month} onPickMember={setMemberId} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-h"><b>この4週間のシフト</b><span className="meta">日付ごとの担当</span></div>
            <ShiftOverview members={members} avail={avail} onSetAvail={onSetAvail} />
          </div>
        </div>
      )}

      {tab === 'member' && (
        <MemberForm members={members} onAdd={onAddMember} onUpdate={onUpdateMember} onRemove={onRemoveMember} />
      )}

      {tab === 'integ' && (
        <Integrations value={integrations} onChange={setIntegrations}
          onTestDiscord={onTestDiscord} onTestGcal={onTestGcal} onTestEmail={onTestEmail}
          emailConfigured={emailConfigured} />
      )}
    </div>
  );
}

/* 月内の担当者別の日数（凡例を兼ねる） */
function ShiftLegend({ members, avail, month, onPickMember }) {
  const days = [];
  const total = new Date(month.y, month.m, 0).getDate();
  for (let d = 1; d <= total; d++) days.push(ymd(new Date(month.y, month.m - 1, d)));
  return (
    <div className="slegend">
      {members.map(m => {
        const list = days.filter(ds => (avail[m.id] || []).indexOf(ds) >= 0);
        return (
          <button type="button" className="sl" key={m.id} onClick={() => onPickMember(m.id)}>
            <span className="sl-dot" style={{ background: m.color }} />
            <span className="sl-tx">
              <b>{m.name}</b>
              <span className="num">{list.length}日</span>
            </span>
          </button>
        );
      })}
      <p className="sl-note">日付の下の点が、その日に入っている担当者の色です。</p>
    </div>
  );
}

/* 日付ごとの担当（横断表示・その場で切替） */
function ShiftOverview({ members, avail, onSetAvail }) {
  const [offset, setOffset] = React.useState(0);
  const base = addDays(weekStart(todayDate()), offset * 28);
  const days = [];
  for (let i = 0; i < 28; i++) days.push(addDays(base, i));

  return (
    <div className="sover">
      <div className="sover-h">
        <span className="num">{mdLabel(days[0])}〜{mdLabel(days[27])}</span>
        <div className="right">
          <button type="button" className="mini" onClick={() => setOffset(o => o - 1)}>‹ 前</button>
          <button type="button" className="mini" onClick={() => setOffset(0)}>今日</button>
          <button type="button" className="mini" onClick={() => setOffset(o => o + 1)}>次 ›</button>
        </div>
      </div>
      <div className="sover-list">
        {days.map(d => {
          const ds = ymd(d);
          const wd = d.getDay();
          const ids = staffIdsOn(ds);
          const past = ds < TODAY;
          return (
            <div className={'sover-row' + (wd === 0 || wd === 6 ? ' we' : '') + (past ? ' past' : '') + (ds === TODAY ? ' today' : '')} key={ds}>
              <span className="sover-d num">{mdLabel(d)}<span>{WD[wd]}</span></span>
              <span className="sover-opts">
                {members.map(m => (
                  <button type="button" key={m.id} className={ids.indexOf(m.id) >= 0 ? 'on' : ''}
                    style={ids.indexOf(m.id) >= 0 ? { color: m.color, borderColor: m.color, background: m.color + '14' } : undefined}
                    onClick={() => onSetAvail(m.id, ds, ids.indexOf(m.id) < 0)}>
                    {m.name}
                  </button>
                ))}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export { SettingsScreen, ShiftLegend, ShiftOverview };
