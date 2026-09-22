/**
 * 共有リンク公開ページ（ログイン不要）
 */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatBytes(bytes) {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value < 0) return "—";
  if (value < 1024) return `${value} B`;
  if (value < 1024 ** 2) return `${(value / 1024).toFixed(1)} KB`;
  if (value < 1024 ** 3) return `${(value / 1024 ** 2).toFixed(1)} MB`;
  return `${(value / 1024 ** 3).toFixed(2)} GB`;
}

function getShareToken() {
  return new URL(window.location.href).searchParams.get("t")?.trim() ?? "";
}

async function fetchShareInfo(token) {
  const response = await fetch(
    `/api/storage/share/info?token=${encodeURIComponent(token)}`,
    { method: "GET" }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? "共有リンクが見つかりません");
  }
  return data;
}

function setVisible(id, visible) {
  const el = document.getElementById(id);
  if (el) el.hidden = !visible;
}

/** レスポンスを読み込みつつ進捗を通知 */
async function readBlobWithProgress(response, onProgress, knownTotalBytes) {
  const headerTotal = Number(response.headers.get("Content-Length"));
  const totalFromHeader =
    Number.isFinite(headerTotal) && headerTotal > 0 ? headerTotal : null;
  const total =
    totalFromHeader ??
    (typeof knownTotalBytes === "number" && knownTotalBytes > 0
      ? knownTotalBytes
      : null);

  if (!response.body || typeof onProgress !== "function") {
    const blob = await response.blob();
    onProgress({ loaded: blob.size, total: total ?? blob.size, percent: 100 });
    return blob;
  }

  const reader = response.body.getReader();
  const chunks = [];
  let loaded = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.byteLength;
    const percent =
      total != null ? Math.min(100, Math.round((loaded / total) * 100)) : null;
    onProgress({ loaded, total, percent });
  }

  const blob = new Blob(chunks);
  onProgress({ loaded: blob.size, total: total ?? blob.size, percent: 100 });
  return blob;
}

function setShareDownloadProgress(itemEl, detail) {
  const wrap = itemEl.querySelector(".share-download-progress");
  const bar = itemEl.querySelector(".share-download-progress-bar");
  const label = itemEl.querySelector(".share-download-progress-label");
  if (!wrap || !bar || !label) return;

  wrap.hidden = false;
  itemEl.classList.add("is-downloading");

  const { loaded, total, percent } = detail;
  if (percent == null) {
    bar.style.width = "30%";
    bar.classList.add("is-indeterminate");
    label.textContent = `${formatBytes(loaded)} を受信中…`;
    return;
  }

  bar.classList.remove("is-indeterminate");
  bar.style.width = `${percent}%`;
  wrap.setAttribute("aria-valuenow", String(percent));
  const totalLabel = total != null ? formatBytes(total) : "—";
  label.textContent = `${percent}% · ${formatBytes(loaded)} / ${totalLabel}`;
}

function resetShareDownloadProgress(itemEl) {
  itemEl.classList.remove("is-downloading");
  const wrap = itemEl.querySelector(".share-download-progress");
  const bar = itemEl.querySelector(".share-download-progress-bar");
  const label = itemEl.querySelector(".share-download-progress-label");
  if (wrap) wrap.hidden = true;
  if (bar) {
    bar.style.width = "0%";
    bar.classList.remove("is-indeterminate");
  }
  if (label) label.textContent = "";
}

function renderSharePage(info, token) {
  setVisible("share-loading", false);
  setVisible("share-error", false);
  setVisible("share-content", true);

  const meta = document.getElementById("share-meta");
  if (meta) {
    if (info.downloads_exhausted) {
      meta.textContent = "ダウンロード回数の上限に達しています";
      meta.classList.add("is-exhausted");
    } else {
      meta.textContent = `残りダウンロード回数: ${info.remaining_downloads} / ${info.max_downloads}`;
      meta.classList.remove("is-exhausted");
    }
  }

  const list = document.getElementById("share-file-list");
  if (!list) return;

  list.innerHTML = info.files
    .map((file) => {
      const disabled = info.downloads_exhausted ? " disabled" : "";
      return `<li class="share-file-item" data-file-id="${escapeHtml(file.id)}">
        <div class="share-file-row">
          <div class="share-file-info">
            <span class="share-file-name">${escapeHtml(file.filename)}</span>
            <span class="share-file-size">${escapeHtml(formatBytes(file.size_bytes))}</span>
          </div>
          <button type="button" class="share-download-btn" data-file-id="${escapeHtml(file.id)}" data-file-size="${escapeHtml(String(file.size_bytes ?? ""))}"${disabled}>
            ダウンロード
          </button>
        </div>
        <div class="share-download-progress" hidden role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="ダウンロード進捗">
          <div class="share-download-progress-track" aria-hidden="true">
            <div class="share-download-progress-bar"></div>
          </div>
          <p class="share-download-progress-label"></p>
        </div>
      </li>`;
    })
    .join("");

  list.querySelectorAll(".share-download-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const fileId = btn.dataset.fileId;
      if (!fileId || btn.disabled) return;

      const itemEl = btn.closest(".share-file-item");
      const knownSize = Number(btn.dataset.fileSize);
      const knownTotalBytes =
        Number.isFinite(knownSize) && knownSize > 0 ? knownSize : null;

      btn.disabled = true;
      const originalLabel = btn.textContent;
      btn.textContent = "ダウンロード中…";
      if (itemEl) {
        setShareDownloadProgress(itemEl, { loaded: 0, total: knownTotalBytes, percent: 0 });
      }

      try {
        const url = `/api/storage/share/download?token=${encodeURIComponent(token)}&file=${encodeURIComponent(fileId)}`;
        const response = await fetch(url, { method: "GET" });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error ?? "ダウンロードに失敗しました");
        }

        const blob = await readBlobWithProgress(
          response,
          (detail) => {
            if (itemEl) setShareDownloadProgress(itemEl, detail);
          },
          knownTotalBytes
        );
        const disposition = response.headers.get("Content-Disposition") ?? "";
        const match = disposition.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i);
        const filename = match?.[1]
          ? decodeURIComponent(match[1].replace(/"/g, ""))
          : "download";

        const objectUrl = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = objectUrl;
        anchor.download = filename;
        anchor.rel = "noopener";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(objectUrl);

        if (itemEl) {
          setShareDownloadProgress(itemEl, {
            loaded: blob.size,
            total: knownTotalBytes ?? blob.size,
            percent: 100,
          });
        }

        const refreshed = await fetchShareInfo(token);
        renderSharePage(refreshed, token);
      } catch (error) {
        if (itemEl) resetShareDownloadProgress(itemEl);
        btn.disabled = false;
        btn.textContent = originalLabel;
        alert(error instanceof Error ? error.message : "ダウンロードに失敗しました");
      }
    });
  });
}

async function init() {
  const token = getShareToken();
  if (!token) {
    setVisible("share-loading", false);
    setVisible("share-error", true);
    const errorText = document.getElementById("share-error-text");
    if (errorText) errorText.textContent = "共有リンクが無効です";
    return;
  }

  try {
    const info = await fetchShareInfo(token);
    renderSharePage(info, token);
  } catch (error) {
    setVisible("share-loading", false);
    setVisible("share-error", true);
    const errorText = document.getElementById("share-error-text");
    if (errorText) {
      errorText.textContent =
        error instanceof Error ? error.message : "共有リンクの読み込みに失敗しました";
    }
  }
}

init();
