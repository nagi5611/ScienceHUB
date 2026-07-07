/**
 * クラウドストレージ API クライアント
 */

function handleUnauthorized() {
  window.location.href = "/?next=" + encodeURIComponent(window.location.pathname);
  throw new Error("ログインが必要です");
}

/** ダウンロード情報（presigned またはプロキシ） */
export async function fetchDownloadInfo(storagePath, options = {}) {
  const { signal } = options;
  const response = await fetch(
    `/api/storage/download/url?path=${encodeURIComponent(storagePath)}`,
    {
      credentials: "same-origin",
      method: "GET",
      signal,
    }
  );

  if (response.status === 401) {
    handleUnauthorized();
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? "ダウンロード URL の取得に失敗しました");
  }
  return data;
}

/** 認証付きでファイル Blob を取得（presigned 優先） */
export async function fetchDownloadBlob(storagePath, options = {}) {
  const { signal } = options;
  const info = await fetchDownloadInfo(storagePath, { signal });

  if (info.mode === "direct" && info.url) {
    const response = await fetch(info.url, { method: "GET", signal });
    if (!response.ok) {
      throw new Error("ダウンロードに失敗しました");
    }
    return response.blob();
  }

  const response = await fetch(
    `/api/storage/download?path=${encodeURIComponent(storagePath)}`,
    {
      credentials: "same-origin",
      method: "GET",
      signal,
    }
  );

  if (response.status === 401) {
    handleUnauthorized();
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error ?? "ダウンロードに失敗しました");
  }

  return response.blob();
}

/**
 * XHR PUT（upload.onprogress で転送中の進捗を取得）
 * @param {(loaded: number, total: number) => void} [options.onProgress]
 */
function xhrPut(url, body, options = {}) {
  const { onProgress, withCredentials = false, parseJson = false } = options;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    if (withCredentials) {
      xhr.withCredentials = true;
    }

    xhr.upload.addEventListener("progress", (event) => {
      if (!onProgress) return;
      onProgress(event.loaded, event.lengthComputable ? event.total : 0);
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 401 && withCredentials) {
        handleUnauthorized();
        return;
      }
      if (xhr.status < 200 || xhr.status >= 300) {
        let message = `アップロードに失敗しました (${xhr.status})`;
        if (parseJson && xhr.responseText) {
          try {
            const data = JSON.parse(xhr.responseText);
            if (data.error) message = data.error;
          } catch {
            /* ignore */
          }
        }
        reject(new Error(message));
        return;
      }

      if (parseJson) {
        try {
          resolve(JSON.parse(xhr.responseText || "{}"));
          return;
        } catch {
          reject(new Error("アップロード応答の解析に失敗しました"));
          return;
        }
      }

      resolve({ etag: xhr.getResponseHeader("ETag") });
    });

    xhr.addEventListener("error", () => reject(new Error("アップロードに失敗しました")));
    xhr.addEventListener("abort", () => reject(new Error("アップロードが中断されました")));
    xhr.send(body);
  });
}

/** presigned URL へ PUT */
export async function putToPresignedUrl(url, body, options = {}) {
  return xhrPut(url, body, { onProgress: options.onProgress });
}

/** JSON API リクエスト */
export async function apiRequest(path, options = {}) {
  const response = await fetch(`/api/storage/${path}`, {
    credentials: "same-origin",
    ...options,
    headers: {
      ...(options.body instanceof ArrayBuffer ? {} : { "Content-Type": "application/json" }),
      ...(options.headers ?? {}),
    },
  });

  if (response.status === 401) {
    handleUnauthorized();
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? "リクエストに失敗しました");
  }
  return data;
}

/** バイナリアップロード（Worker プロキシ・フォールバック） */
export async function apiUpload(path, body, params = {}, options = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `/api/storage/${path}${query ? `?${query}` : ""}`;
  return xhrPut(url, body, {
    onProgress: options.onProgress,
    withCredentials: true,
    parseJson: true,
  });
}
