/**
 * アップロード進捗バナーと詳細ダイアログ
 */

function formatBytes(bytes) {
  if (bytes == null || Number.isNaN(bytes)) return "—";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

function formatSpeed(bps) {
  if (!bps || bps <= 0) return "—";
  return `${formatBytes(bps)}/s`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fileKey(file) {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

/** アップロード進捗 UI を管理 */
export function createUploadProgress() {
  const banner = document.getElementById("cs-upload-banner");
  const bannerBar = document.getElementById("cs-upload-banner-bar");
  const bannerLabel = document.getElementById("cs-upload-banner-label");
  const detailsBtn = document.getElementById("cs-upload-details-btn");
  const dialog = document.getElementById("cs-upload-dialog");
  const dialogBody = document.getElementById("cs-upload-dialog-body");
  const dialogClose = document.getElementById("cs-upload-dialog-close");
  const dialogCloseBtn = document.getElementById("cs-upload-dialog-close-btn");

  const files = new Map();
  let batchInfo = null;
  let finishedCount = 0;
  let totalCount = 0;

  function getAggregate() {
    let bytesUploaded = 0;
    let totalBytes = 0;
    for (const entry of files.values()) {
      bytesUploaded += entry.bytesUploaded ?? 0;
      totalBytes += entry.totalBytes ?? 0;
    }
    const percent = totalBytes > 0 ? Math.round((bytesUploaded / totalBytes) * 100) : 0;
    return { bytesUploaded, totalBytes, percent };
  }

  function renderBanner() {
    if (!banner || !bannerBar || !bannerLabel) return;
    const { bytesUploaded, totalBytes, percent } = getAggregate();
    bannerBar.style.width = `${percent}%`;
    bannerLabel.textContent = `アップロード中… ${finishedCount}/${totalCount} 件完了（${percent}%・${formatBytes(bytesUploaded)} / ${formatBytes(totalBytes)}）`;
  }

  function modeLabel(entry) {
    if (entry.status === "waiting") return "待機中";
    if (entry.status === "error") return "失敗";
    if (entry.status === "done") return "完了";
    const route = entry.directUpload ? "R2直" : "Worker経由";
    if (entry.mode === "simple") return `一括アップロード（${route}）`;
    return `マルチパート（${formatBytes(entry.partSize)}/パート・${entry.parallel} 並列・${route}）`;
  }

  function renderDialog() {
    if (!dialogBody) return;

    const batchLine = batchInfo
      ? `<p class="cs-upload-dialog-batch">${escapeHtml(batchInfo.label)}</p>`
      : "";

    const rows = [...files.values()]
      .map((entry) => {
        const pct = entry.percent ?? 0;
        const statusClass =
          entry.status === "done"
            ? "is-done"
            : entry.status === "error"
              ? "is-error"
              : entry.status === "uploading"
                ? "is-active"
                : "is-waiting";

        const detailParts = [
          `${pct}%`,
          `${formatBytes(entry.bytesUploaded)} / ${formatBytes(entry.totalBytes)}`,
        ];

        if (entry.status === "uploading" && entry.speedBps > 0) {
          detailParts.push(formatSpeed(entry.speedBps));
        }

        if (entry.mode === "multipart" && entry.totalParts > 1) {
          detailParts.push(`パート ${entry.completedParts ?? 0}/${entry.totalParts}`);
        }

        const errorLine = entry.error
          ? `<p class="cs-upload-file-error">${escapeHtml(entry.error)}</p>`
          : "";

        return `
          <article class="cs-upload-file ${statusClass}" data-file-key="${escapeHtml(entry.key)}">
            <div class="cs-upload-file-head">
              <p class="cs-upload-file-name">${escapeHtml(entry.name)}</p>
              <span class="cs-upload-file-mode">${escapeHtml(modeLabel(entry))}</span>
            </div>
            <div class="cs-upload-file-track" aria-hidden="true">
              <div class="cs-upload-file-bar" style="width:${pct}%"></div>
            </div>
            <p class="cs-upload-file-meta">${escapeHtml(detailParts.join(" · "))}</p>
            ${errorLine}
          </article>`;
      })
      .join("");

    dialogBody.innerHTML = `${batchLine}<div class="cs-upload-file-list">${rows}</div>`;
  }

  function render() {
    renderBanner();
    if (dialog?.open) renderDialog();
  }

  function openDialog() {
    if (!dialog) return;
    renderDialog();
    if (!dialog.open) dialog.showModal();
  }

  function closeDialog() {
    dialog?.close();
  }

  detailsBtn?.addEventListener("click", openDialog);
  dialogClose?.addEventListener("click", closeDialog);
  dialogCloseBtn?.addEventListener("click", closeDialog);

  return {
    start(fileList) {
      files.clear();
      batchInfo = null;
      finishedCount = 0;
      totalCount = fileList.length;

      for (const file of fileList) {
        files.set(fileKey(file), {
          key: fileKey(file),
          name: file.name,
          totalBytes: file.size,
          bytesUploaded: 0,
          percent: 0,
          speedBps: 0,
          status: "waiting",
          mode: "simple",
          partSize: file.size,
          totalParts: 1,
          parallel: 1,
          completedParts: 0,
        });
      }

      banner?.removeAttribute("hidden");
      render();
    },

    setBatch({ type, count, parallel }) {
      const label =
        type === "small"
          ? `小ファイル ${count} 件を最大 ${parallel} 件ずつ並列アップロード`
          : `大ファイル ${count} 件を順次アップロード（ファイル内マルチパート並列）`;
      batchInfo = { type, count, parallel, label };
      render();
    },

    fileStarted(file, init) {
      const key = fileKey(file);
      const entry = files.get(key);
      if (!entry) return;
      entry.status = "uploading";
      entry.mode = init.mode ?? "simple";
      entry.partSize = init.partSize ?? file.size;
      entry.totalParts = init.totalParts ?? 1;
      entry.parallel = init.parallel ?? 1;
      entry.directUpload = Boolean(init.directUpload);
      render();
    },

    fileProgress(file, detail) {
      const key = fileKey(file);
      const entry = files.get(key);
      if (!entry) return;
      entry.status = "uploading";
      entry.bytesUploaded = detail.bytesUploaded ?? 0;
      entry.percent = detail.percent ?? 0;
      entry.speedBps = detail.speedBps ?? 0;
      entry.completedParts = detail.completedParts ?? entry.completedParts;
      if (detail.directUpload !== undefined) {
        entry.directUpload = Boolean(detail.directUpload);
      }
      entry.mode = detail.mode ?? entry.mode;
      entry.partSize = detail.partSize ?? entry.partSize;
      entry.totalParts = detail.totalParts ?? entry.totalParts;
      entry.parallel = detail.parallel ?? entry.parallel;
      render();
    },

    fileComplete(file, outcome) {
      const key = fileKey(file);
      const entry = files.get(key);
      if (!entry) return;

      finishedCount += 1;
      if (outcome.ok) {
        entry.status = "done";
        entry.percent = 100;
        entry.bytesUploaded = entry.totalBytes;
      } else {
        entry.status = "error";
        entry.error = outcome.error?.message ?? "アップロードに失敗しました";
      }
      render();
    },

    finish() {
      render();
      setTimeout(() => {
        banner?.setAttribute("hidden", "");
        if (bannerBar) bannerBar.style.width = "0%";
        closeDialog();
        files.clear();
        batchInfo = null;
      }, 1200);
    },
  };
}
