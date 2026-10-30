import React from 'react';
import { isAvailable, dateLabelW, memberLabel } from '../admin-design-domain';
import type { DesignApplication, DesignMember } from '../admin-bridge';
import { Modal, MemberTag } from './AdminDesignUi';

type ApproveStaffModalProps = {
  open: boolean;
  app: DesignApplication | null;
  members: DesignMember[];
  busy: boolean;
  onClose: () => void;
  onConfirm: (staffMemberId: string) => void;
};

function staffOnDate(members: DesignMember[], date: string): DesignMember[] {
  return members.filter((m) => isAvailable(m.id, date));
}

export function ApproveStaffModal({
  open,
  app,
  members,
  busy,
  onClose,
  onConfirm,
}: ApproveStaffModalProps) {
  const [staffId, setStaffId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) setStaffId(null);
  }, [open, app?.id]);

  const candidates = React.useMemo(
    () => (app ? staffOnDate(members, app.date) : []),
    [app, members]
  );

  React.useEffect(() => {
    if (!open || !candidates.length) return;
    if (staffId && candidates.some((m) => m.id === staffId)) return;
    setStaffId(candidates[0].id);
  }, [open, candidates, staffId]);

  if (!app) return null;

  return (
    <Modal
      open={open}
      title="印刷担当者を選んで承認"
      sub={`${dateLabelW(app.date)} · ${app.title}`}
      onClose={busy ? () => {} : onClose}
      footer={
        <>
          <button type="button" className="btn btn-secondary" disabled={busy} onClick={onClose}>
            キャンセル
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={busy || !staffId || !candidates.length}
            data-testid="approve-staff-confirm"
            onClick={() => staffId && onConfirm(staffId)}
          >
            {busy ? '承認中…' : '承認する'}
          </button>
        </>
      }
    >
      <p className="hint" style={{ margin: '0 0 12px' }}>
        この日のシフトに入っている担当者のうち、承認後の印刷担当を選びます。
      </p>
      {candidates.length === 0 ? (
        <div className="note warn">
          <span>この日にシフトが入っている担当者がいません。シフト表で担当を追加してから承認してください。</span>
        </div>
      ) : (
        <div className="approve-staff-list" role="listbox" aria-label="当日の担当者">
          {candidates.map((m) => (
            <button
              type="button"
              key={m.id}
              role="option"
              aria-selected={staffId === m.id}
              className={'approve-staff-opt' + (staffId === m.id ? ' on' : '')}
              onClick={() => setStaffId(m.id)}
            >
              <MemberTag id={m.id} />
              <span>{memberLabel(m.id)}</span>
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
}
