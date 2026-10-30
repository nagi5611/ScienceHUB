import React from 'react';
import { createAdminReservation, forceAdminReservation, fetchDayAvailability, fetchAdminPrinters } from '../admin-api';
import { uploadPrintFile } from '@shared/upload';

export function ForceReservationModal({
  open,
  date,
  onClose,
  onSaved,
  onToast,
}: {
  open: boolean;
  date: string;
  onClose: () => void;
  onSaved: () => void;
  onToast: (msg: string) => void;
}) {
  const [homeroom, setHomeroom] = React.useState('');
  const [studentNumber, setStudentNumber] = React.useState('');
  const [studentName, setStudentName] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [printScale, setPrintScale] = React.useState('small');
  const [printerId, setPrinterId] = React.useState('');
  const [scales, setScales] = React.useState<string[]>(['small', 'medium', 'large']);
  const [printers, setPrinters] = React.useState<{ id: string; name: string }[]>([]);
  const [file, setFile] = React.useState<File | null>(null);
  const [force, setForce] = React.useState(true);
  const [purpose, setPurpose] = React.useState('club');
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (!open || !date) return;
    void (async () => {
      try {
        const [av, pr] = await Promise.all([fetchDayAvailability(date), fetchAdminPrinters()]);
        if (av.availableScales?.length) {
          setScales(av.availableScales);
          setPrintScale(av.availableScales[0]);
        }
        setPrinters(pr.printers.map((p) => ({ id: p.id, name: p.name })));
        if (pr.printers[0]) setPrinterId(pr.printers[0].id);
      } catch (e) {
        onToast(e instanceof Error ? e.message : '空き情報の取得に失敗');
      }
    })();
  }, [open, date, onToast]);

  if (!open) return null;

  const submit = async () => {
    setBusy(true);
    try {
      let upload: { r2_key: string; filename: string; size_bytes: number } | null = null;
      if (file) upload = await uploadPrintFile(file);
      if (force) {
        await forceAdminReservation({
          desired_date: date,
          homeroom: homeroom.trim() || null,
          student_number: studentNumber.trim() ? Number(studentNumber) : null,
          student_name: studentName.trim() || null,
          title: title.trim() || null,
          purpose,
          print_scale: printScale || null,
          printer_id: printerId || null,
          ...(upload
            ? {
                stl_r2_key: upload.r2_key,
                stl_filename: upload.filename,
                stl_size_bytes: upload.size_bytes,
              }
            : {}),
        });
        onToast('仮予約をカレンダーに追加しました');
      } else {
        if (!upload) throw new Error('ファイルをアップロードしてください');
        await createAdminReservation({
          desired_date: date,
          homeroom: homeroom.trim(),
          student_number: Number(studentNumber),
          student_name: studentName.trim(),
          title: title.trim(),
          purpose,
          print_scale: printScale,
          printer_id: printerId,
          stl_r2_key: upload.r2_key,
          stl_filename: upload.filename,
          stl_size_bytes: upload.size_bytes,
        });
        onToast('予約を追加しました');
      }
      onSaved();
      onClose();
    } catch (e) {
      onToast(e instanceof Error ? e.message : '保存に失敗しました');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="legacy-modal open" role="dialog" aria-modal="true">
      <div className="legacy-modal-scrim" onClick={onClose} />
      <div className="legacy-modal-body card">
        <h2>{force ? '仮予約（管理者）' : '通常予約'} — {date}</h2>
        <label className="chk">
          <input type="checkbox" checked={force} onChange={(e) => setForce(e.target.checked)} />
          必須を緩めて仮予約（legacy force）
        </label>
        <div className="form-grid">
          <label>
            HR
            <input className="input" value={homeroom} onChange={(e) => setHomeroom(e.target.value)} placeholder="101" />
          </label>
          <label>
            番号
            <input className="input" value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)} />
          </label>
          <label>
            氏名
            <input className="input" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
          </label>
          <label>
            タイトル
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            規模
            <select className="input" value={printScale} onChange={(e) => setPrintScale(e.target.value)}>
              {scales.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label>
            プリンター
            <select className="input" value={printerId} onChange={(e) => setPrinterId(e.target.value)}>
              {printers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            目的
            <select className="input" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
              <option value="ss_s_tan">SS・S探</option>
              <option value="club">部活</option>
              <option value="other">その他</option>
            </select>
          </label>
          <label>
            STL{force ? '（任意）' : '（必須）'}
            <input type="file" accept=".stl,.3mf,.obj,.gcode" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
        </div>
        <div className="legacy-modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            キャンセル
          </button>
          <button type="button" className="btn btn-primary" disabled={busy} onClick={() => void submit()}>
            {force ? '仮予約を追加' : '予約を追加'}
          </button>
        </div>
      </div>
    </div>
  );
}
