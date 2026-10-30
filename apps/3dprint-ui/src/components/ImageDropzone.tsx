import React from 'react';

type ImageDropzoneProps = {
  file: File | null;
  onFile: (file: File | null) => void;
  label?: string;
  hint?: string;
  accept?: string;
};

export function ImageDropzone({
  file,
  onFile,
  label = 'プリンター画像',
  hint = 'PNG / JPG をドラッグ＆ドロップ、またはクリックして選択',
  accept = 'image/*',
}: ImageDropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [over, setOver] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const take = (list: FileList | null) => {
    const f = list?.[0];
    if (!f || !f.type.startsWith('image/')) return;
    onFile(f);
  };

  return (
    <div className="imgdrop-wrap">
      <span className="imgdrop-label">{label}</span>
      <div
        className={'imgdrop' + (over ? ' over' : '') + (file ? ' filled' : '')}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          take(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr"
          onChange={(e) => take(e.target.files)}
        />
        {preview ? (
          <>
            <img className="imgdrop-preview" src={preview} alt="" />
            <span className="imgdrop-meta">
              <b>{file?.name}</b>
              <span>{((file?.size ?? 0) / 1024).toFixed(0)} KB ・ クリックで差し替え</span>
            </span>
            <button
              type="button"
              className="imgdrop-clear"
              aria-label="画像を外す"
              onClick={(e) => {
                e.stopPropagation();
                onFile(null);
              }}
            >
              ×
            </button>
          </>
        ) : (
          <>
            <span className="imgdrop-icon" aria-hidden="true">
              🖼
            </span>
            <span className="imgdrop-meta">
              <b>{hint}</b>
              <span>一覧サムネイルに表示されます（任意）</span>
            </span>
          </>
        )}
      </div>
    </div>
  );
}
