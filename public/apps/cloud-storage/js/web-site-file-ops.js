/**
 * クラウドストレージ — 公開サイト内ファイルの編集操作
 */

const API_BASE = "/api/website-publish";

const EDITABLE_EXTENSIONS = new Set([
  ".html",
  ".htm",
  ".css",
  ".js",
  ".mjs",
  ".json",
  ".svg",
  ".txt",
  ".xml",
  ".webmanifest",
  ".map",
]);

/** ウェブサイト公開 API を呼び出す */
async function api(path, options = {}) {
  const headers = { ...(options.headers ?? {}) };
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(`${API_BASE}/${path}`, {
    credentials: "same-origin",
    ...options,
    headers,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error ?? "リクエストに失敗しました");
  }
  return data;
}

/** テキスト編集可能な拡張子か */
export function isEditableWebSiteFilePath(path) {
  const base = path.split("/").pop() ?? path;
  const dot = base.lastIndexOf(".");
  if (dot <= 0) return false;
  return EDITABLE_EXTENSIONS.has(base.slice(dot).toLowerCase());
}

/** 相対ディレクトリを結合 */
function joinRelativeDir(baseDir, relativePath) {
  const rel = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!baseDir) return rel;
  if (!rel) return baseDir;
  return `${baseDir}/${rel}`;
}

/** 選択パスを削除対象ファイルパスに展開 */
export function expandWebSitePathsToFiles(paths, files) {
  const filePaths = paths.filter((p) => files.some((f) => f.path === p));
  const folderPrefixes = paths.filter((p) => !filePaths.includes(p));
  const toDelete = [...filePaths];
  for (const folder of folderPrefixes) {
    const prefix = `${folder}/`;
    for (const file of files) {
      if (file.path.startsWith(prefix) || file.path === folder) {
        toDelete.push(file.path);
      }
    }
  }
  return [...new Set(toDelete)];
}

/** 単一ファイルをアップロード */
export async function uploadWebSiteFile(siteId, file, relativeDir) {
  const init = await api(`sites/${siteId}/upload/init`, {
    method: "POST",
    body: JSON.stringify({
      filename: file.name,
      size: file.size,
      relative_dir: relativeDir,
    }),
  });

  if (init.mode === "simple" && init.directUpload) {
    const urlData = await api(`sites/${siteId}/upload/url`, {
      method: "POST",
      body: JSON.stringify({ session_id: init.sessionId }),
    });
    const putRes = await fetch(urlData.url, {
      method: "PUT",
      body: file,
    });
    if (!putRes.ok) throw new Error("アップロードに失敗しました");
    await api(`sites/${siteId}/upload/complete`, {
      method: "POST",
      body: JSON.stringify({
        session_id: init.sessionId,
        direct_upload: true,
      }),
    });
    return;
  }

  if (init.mode === "simple") {
    const buffer = await file.arrayBuffer();
    const res = await fetch(`${API_BASE}/sites/${siteId}/upload/simple`, {
      method: "POST",
      credentials: "same-origin",
      headers: { "X-Upload-Session": init.sessionId },
      body: buffer,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error ?? "アップロードに失敗しました");
    }
    return;
  }

  throw new Error("大容量ファイルは現在 Worker 経由のみ対応しています");
}

/** 複数ファイルをアップロード */
export async function uploadWebSiteFiles(siteId, fileList, baseDir, onProgress) {
  const files = [...fileList];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const webkitPath = file.webkitRelativePath || file.name;
    const segments = webkitPath.split("/");
    segments.pop();
    const innerDir = segments.join("/");
    const targetDir = joinRelativeDir(baseDir, innerDir);
    onProgress?.(i + 1, files.length, webkitPath);
    await uploadWebSiteFile(siteId, file, targetDir);
  }
}

/** ファイル一覧を取得 */
export async function listWebSiteFiles(siteId) {
  const data = await api(`sites/${encodeURIComponent(siteId)}/files`);
  return data.files ?? [];
}

/** ファイル削除 */
export async function deleteWebSitePaths(siteId, paths, files) {
  const toDelete = expandWebSitePathsToFiles(paths, files);
  if (toDelete.length === 0) return 0;
  for (const path of toDelete) {
    await api(
      `sites/${encodeURIComponent(siteId)}/files?path=${encodeURIComponent(path)}`,
      { method: "DELETE" }
    );
  }
  return toDelete.length;
}

/** 名称変更 */
export async function renameWebSitePath(siteId, path, kind, newName) {
  await api(`sites/${encodeURIComponent(siteId)}/files/rename`, {
    method: "PATCH",
    body: JSON.stringify({
      path,
      new_name: newName,
      kind,
    }),
  });
}

/** テキストファイル内容を取得 */
export async function fetchWebSiteFileContent(siteId, path) {
  return api(
    `sites/${encodeURIComponent(siteId)}/files/content?path=${encodeURIComponent(path)}`
  );
}

/** テキストファイル内容を保存 */
export async function saveWebSiteFileContent(siteId, path, content) {
  await api(`sites/${encodeURIComponent(siteId)}/files/content`, {
    method: "PUT",
    body: JSON.stringify({ path, content }),
  });
}
