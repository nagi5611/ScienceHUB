import React from 'react';
import { MACHINES } from '@shared/domain';
import { DndPickGrid, DndPickTile } from '@components/DndPickTile';
import { ImageDropzone } from '@components/ImageDropzone';
import {
  createPrinter,
  deletePrinter,
  fetchAdminPrinters,
  getPrintVideoSettings,
  listStorageFolders,
  patchPrintVideoSettings,
  patchPrinter,
  uploadPrinterImage,
} from '../admin-api';

type Printer = Awaited<ReturnType<typeof fetchAdminPrinters>>['printers'][number];
type PrinterAvailability = 'available' | 'unavailable';

/** Maps API `status` to the 2-option admin select (maintenance → 不可). */
function printerAvailabilityValue(status?: string | null): PrinterAvailability {
  return status === 'available' ? 'available' : 'unavailable';
}

function PrinterAvailabilitySelect({
  printerId,
  value,
  onChange,
}: {
  printerId: string;
  value: PrinterAvailability;
  onChange: (status: PrinterAvailability) => void;
}) {
  return (
    <select
      id={`printer-availability-${printerId}`}
      className="input printer-availability-select"
      value={value}
      onChange={(e) => onChange(e.target.value as PrinterAvailability)}
      aria-label="利用可否"
    >
      <option value="available">利用可</option>
      <option value="unavailable">不可</option>
    </select>
  );
}

function PrinterInlineEditForm({
  draft,
  setDraft,
  onCancel,
  onSave,
}: {
  draft: Printer;
  setDraft: React.Dispatch<React.SetStateAction<Printer | null>>;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="printer-admin-inline-form">
      <label className="form-group" htmlFor={`printer-availability-edit-${draft.id}`}>
        <span className="printer-add-label">利用可否</span>
        <PrinterAvailabilitySelect
          printerId={`edit-${draft.id}`}
          value={printerAvailabilityValue(draft.status)}
          onChange={(status) => setDraft((d) => (d ? { ...d, status } : d))}
        />
      </label>
      <label className="form-group">
        <span className="printer-add-label">名前</span>
        <input
          className="input"
          value={draft.name}
          onChange={(e) => setDraft((d) => (d ? { ...d, name: e.target.value } : d))}
        />
      </label>
      <label className="form-group">
        <span className="printer-add-label">ノズル径（カンマ区切り）</span>
        <input
          className="input"
          value={(draft.capabilities?.nozzle_sizes_mm ?? []).join(', ')}
          onChange={(e) =>
            setDraft((d) =>
              d
                ? {
                    ...d,
                    capabilities: {
                      ...d.capabilities,
                      nozzle_sizes_mm: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    },
                  }
                : d
            )
          }
        />
      </label>
      <label className="chk">
        <input
          type="checkbox"
          checked={!!draft.capabilities?.can_record_print_video}
          onChange={(e) =>
            setDraft((d) =>
              d
                ? {
                    ...d,
                    capabilities: { ...d.capabilities, can_record_print_video: e.target.checked },
                  }
                : d
            )
          }
        />
        動画撮影可
      </label>
      <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
        {(['max_small', 'max_small_with_main', 'max_medium', 'max_large'] as const).map((key) => (
          <label key={key}>
            <span className="printer-add-label">{key}</span>
            <input
              className="input"
              type="number"
              value={draft.daily_capacity?.[key] ?? 0}
              onChange={(e) =>
                setDraft((d) =>
                  d
                    ? {
                        ...d,
                        daily_capacity: { ...d.daily_capacity, [key]: Number(e.target.value) },
                      }
                    : d
                )
              }
            />
          </label>
        ))}
      </div>
      <div className="printer-admin-inline-actions">
        <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>
          キャンセル
        </button>
        <button type="button" className="btn btn-primary btn-sm" onClick={onSave}>
          保存
        </button>
      </div>
    </div>
  );
}

export function PrintersPanel({ onToast, onReload }: { onToast: (m: string) => void; onReload?: () => void }) {
  const [printers, setPrinters] = React.useState<
    Awaited<ReturnType<typeof fetchAdminPrinters>>['printers']
  >([]);
  const [name, setName] = React.useState('');
  const [lane, setLane] = React.useState<'ke' | 'cc' | null>(null);
  const [description, setDescription] = React.useState('');
  const [image, setImage] = React.useState<File | null>(null);
  const [videoPath, setVideoPath] = React.useState('');
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editDraft, setEditDraft] = React.useState<Printer | null>(null);
  const [picker, setPicker] = React.useState(false);
  const [roots, setRoots] = React.useState<{ path: string; label: string }[]>([]);
  const [browsePath, setBrowsePath] = React.useState('');
  const [folders, setFolders] = React.useState<{ path: string; name: string }[]>([]);

  const load = React.useCallback(async () => {
    const [pr, vid] = await Promise.all([fetchAdminPrinters(), getPrintVideoSettings()]);
    setPrinters(pr.printers);
    setVideoPath(vid.storage_path ?? '');
    setRoots(vid.group_roots ?? []);
  }, []);

  React.useEffect(() => {
    void load().catch((e) => onToast(e instanceof Error ? e.message : '読み込み失敗'));
  }, [load, onToast]);

  const openEdit = (p: Printer) => {
    setEditingId(p.id);
    setEditDraft({ ...p, capabilities: { ...p.capabilities }, daily_capacity: { ...p.daily_capacity } });
  };

  const closeEdit = () => {
    setEditingId(null);
    setEditDraft(null);
  };

  const add = async () => {
    if (!lane) {
      onToast('機種ライン（KE / CC）を選んでください');
      return;
    }
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      await createPrinter(trimmed, {
        machine_lane: lane,
        description: description.trim() || undefined,
        image: image ?? undefined,
      });
      setName('');
      setLane(null);
      setDescription('');
      setImage(null);
      await load();
      onReload?.();
      onToast('プリンターを追加しました');
    } catch (e) {
      onToast(e instanceof Error ? e.message : '追加失敗');
    }
  };

  const saveVideoPath = async () => {
    try {
      await patchPrintVideoSettings(videoPath.trim());
      onToast('印刷動画の保存先を更新しました');
    } catch (e) {
      onToast(e instanceof Error ? e.message : '保存失敗');
    }
  };

  const saveEdit = async () => {
    if (!editDraft || !editingId) return;
    const nozzles = (editDraft.capabilities?.nozzle_sizes_mm ?? ['0.4']).map(String).filter(Boolean);
    try {
      await patchPrinter(editDraft.id, {
        name: editDraft.name.trim(),
        status: printerAvailabilityValue(editDraft.status),
        capabilities: {
          can_record_print_video: !!editDraft.capabilities?.can_record_print_video,
          nozzle_sizes_mm: nozzles,
        },
        daily_capacity: editDraft.daily_capacity,
      });
      closeEdit();
      await load();
      onToast('更新しました');
    } catch (e) {
      onToast(e instanceof Error ? e.message : '更新失敗');
    }
  };

  const openPicker = async () => {
    setPicker(true);
    setBrowsePath('');
    setFolders([]);
  };

  const loadFolders = async (path: string) => {
    setBrowsePath(path);
    if (!path) {
      setFolders([]);
      return;
    }
    const data = await listStorageFolders(path);
    setFolders(data.items.map((i) => ({ path: i.path, name: i.name })));
  };

  const setPrinterAvailability = async (printerId: string, status: PrinterAvailability) => {
    try {
      await patchPrinter(printerId, { status });
      setPrinters((prev) =>
        prev.map((row) => (row.id === printerId ? { ...row, status } : row))
      );
      if (editDraft?.id === printerId) {
        setEditDraft((d) => (d ? { ...d, status } : d));
      }
      onReload?.();
      onToast(status === 'available' ? '利用可にしました' : '不可にしました');
    } catch (e) {
      onToast(e instanceof Error ? e.message : '利用可否の更新に失敗');
      await load();
    }
  };

  return (
    <div className="legacy-panel ops-printers">
      <section className="card ops-card" id="print-video-settings-section">
        <h2 className="section-heading">印刷動画の保存先</h2>
        <p className="hint">管理画面からアップロードする印刷動画のクラウドストレージフォルダ（legacy 同等）。</p>
        <div className="form-group">
          <label htmlFor="print-video-storage-path">保存先フォルダ</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              id="print-video-storage-path"
              className="input"
              value={videoPath}
              readOnly
              placeholder="未設定（参照から選択）"
            />
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => void openPicker()}>
              参照…
            </button>
          </div>
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => void saveVideoPath()}>
          保存先を保存
        </button>
      </section>

      <section className="card ops-card">
        <h2 className="section-heading">プリンター管理</h2>
        <p className="hint ops-lead">登録済みプリンターの編集・削除、および新規追加ができます。</p>
        <div className="printer-admin-grid">
          {printers.map((p) => {
            const isEditing = editingId === p.id && editDraft;
            return (
              <article
                key={p.id}
                className={`printer-admin-card${isEditing ? ' printer-admin-card-editing' : ''}`}
              >
                {p.image_url ? (
                  <img className="printer-admin-image" src={p.image_url} alt="" />
                ) : (
                  <div className="printer-admin-image printer-admin-image-placeholder">🖨️</div>
                )}
                <div className="printer-admin-body">
                  {isEditing ? (
                    <>
                      <h3 className="printer-admin-title">{editDraft.name} を編集</h3>
                      <PrinterInlineEditForm
                        draft={editDraft}
                        setDraft={setEditDraft}
                        onCancel={closeEdit}
                        onSave={() => void saveEdit()}
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="printer-admin-title">{p.name}</h3>
                      <p className="hint printer-admin-cap-summary">
                        {p.machine_lane?.toUpperCase() ?? '—'} / ノズル{' '}
                        {(p.capabilities?.nozzle_sizes_mm ?? []).join(', ') || '—'} /{' '}
                        {p.capabilities?.can_record_print_video ? '動画撮影可' : '動画撮影不可'}
                      </p>
                      {p.description ? (
                        <p className="hint printer-admin-desc">{p.description}</p>
                      ) : null}
                      <div className="printer-admin-actions">
                        <PrinterAvailabilitySelect
                          printerId={p.id}
                          value={printerAvailabilityValue(p.status)}
                          onChange={(status) => void setPrinterAvailability(p.id, status)}
                        />
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => openEdit(p)}>
                          編集
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            if (confirm(`「${p.name}」を削除しますか？`)) {
                              if (editingId === p.id) closeEdit();
                              void deletePrinter(p.id)
                                .then(load)
                                .then(() => onToast('削除しました'))
                                .catch((e) => onToast(e instanceof Error ? e.message : '削除失敗'));
                            }
                          }}
                        >
                          削除
                        </button>
                        <label className="btn btn-secondary btn-sm">
                          画像
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                void uploadPrinterImage(p.id, f)
                                  .then(load)
                                  .catch((err) => onToast(err instanceof Error ? err.message : '画像失敗'));
                              }
                              e.target.value = '';
                            }}
                          />
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        <div className="printer-add-card" data-testid="printer-add-form">
          <div className="printer-add-head">
            <h3>機種（プリンター）を追加</h3>
            <p className="hint">
              物理プリンター本体を新規登録します。ここで選ぶ「機種」は、予約カレンダーの時間枠への割当ではなく、
              そのプリンターが属する機種ライン（KE 系 / CC 系）の分類です。
            </p>
          </div>

          <div className="printer-add-block">
            <span className="printer-add-label">機種ライン（KE / CC）</span>
            <DndPickGrid>
              {MACHINES.map((m) => (
                <DndPickTile
                  key={m.id}
                  selected={lane === m.id}
                  badge={m.short}
                  accent={m.id === 'ke' ? 'var(--color-primary)' : 'var(--color-tip)'}
                  title={m.name}
                  description={`${m.maker} ・ ${m.hint}`}
                  onSelect={() => {
                    setLane(m.id);
                    if (!name.trim()) setName(`${m.short} `);
                  }}
                />
              ))}
            </DndPickGrid>
          </div>

          <div className="printer-add-block">
            <label className="printer-add-label" htmlFor="printer-add-description">
              説明書き（任意）
            </label>
            <textarea
              id="printer-add-description"
              className="input printer-add-description"
              rows={3}
              maxLength={2000}
              placeholder="設置場所、フィラメント、注意事項など（機種・プリンターに関する説明）"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="printer-add-block">
            <label className="printer-add-label" htmlFor="printer-add-name">
              表示名
            </label>
            <input
              id="printer-add-name"
              className="input printer-add-name"
              placeholder={lane ? `${MACHINES.find((x) => x.id === lane)?.short ?? ''} 3号機` : '例: KE 3号機'}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="printer-add-block">
            <ImageDropzone file={image} onFile={setImage} />
          </div>

          <div className="printer-add-actions">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              disabled={!lane || !name.trim()}
              onClick={() => void add()}
            >
              プリンターを追加
            </button>
          </div>
        </div>
      </section>

      {picker && (
        <div className="legacy-modal open" role="dialog" aria-modal="true">
          <div className="legacy-modal-scrim" onClick={() => setPicker(false)} />
          <div className="legacy-modal-body card">
            <h2>保存先フォルダ</h2>
            <p className="hint">{browsePath || 'チームを選んでください'}</p>
            <div style={{ display: 'grid', gap: 6, maxHeight: 280, overflow: 'auto' }}>
              {!browsePath &&
                roots.map((r) => (
                  <button key={r.path} type="button" className="btn btn-secondary" onClick={() => void loadFolders(r.path)}>
                    {r.label}
                  </button>
                ))}
              {browsePath && (
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => void loadFolders('')}>
                  チームへ戻る
                </button>
              )}
              {folders.map((f) => (
                <button key={f.path} type="button" className="btn btn-secondary" onClick={() => void loadFolders(f.path)}>
                  {f.name}
                </button>
              ))}
            </div>
            <div className="legacy-modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setPicker(false)}>
                閉じる
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!browsePath}
                onClick={() => {
                  setVideoPath(browsePath);
                  setPicker(false);
                }}
              >
                このフォルダを選択
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
