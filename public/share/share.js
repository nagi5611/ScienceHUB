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
      return `<li class="share-file-item">
        <div class="share-file-info">
          <span class="share-file-name">${escapeHtml(file.filename)}</span>
          <span class="share-file-size">${escapeHtml(formatBytes(file.size_bytes))}</span>
        </div>
        <button type="button" class="share-download-btn" data-file-id="${escapeHtml(file.id)}"${disabled}>
          ダウンロード
        </button>
      </li>`;
    })
    .join("");

  list.querySelectorAll(".share-download-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const fileId = btn.dataset.fileId;
      if (!fileId || btn.disabled) return;

      btn.disabled = true;
      const originalLabel = btn.textContent;
      btn.textContent = "準備中…";

      try {
        const url = `/api/storage/share/download?token=${encodeURIComponent(token)}&file=${encodeURIComponent(fileId)}`;
        const response = await fetch(url, { method: "GET" });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error ?? "ダウンロードに失敗しました");
        }

        const blob = await response.blob();
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

        const refreshed = await fetchShareInfo(token);
        renderSharePage(refreshed, token);
      } catch (error) {
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
