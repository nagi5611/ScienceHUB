/**
 * フォルダ選択・ドロップからファイル一覧を収集
 */

/** ディレクトリエントリの子をすべて読み込む */
function readAllDirectoryEntries(reader) {
  return new Promise((resolve, reject) => {
    const entries = [];

    function readBatch() {
      reader.readEntries(
        (batch) => {
          if (!batch.length) {
            resolve(entries);
            return;
          }
          entries.push(...batch);
          readBatch();
        },
        reject
      );
    }

    readBatch();
  });
}

/** FileSystemFileEntry から File を取得 */
function fileEntryToFile(entry) {
  return new Promise((resolve, reject) => {
    entry.file(resolve, reject);
  });
}

/** ファイルツリーを再帰的に走査（個別エントリの失敗はスキップ） */
async function traverseFileTree(entry, prefix = "") {
  if (entry.isFile) {
    try {
      const file = await fileEntryToFile(entry);
      const relativePath = prefix ? `${prefix}/${file.name}` : file.name;
      file._relativePath = relativePath;
      return [file];
    } catch (err) {
      console.warn("[folder-upload] skip file:", entry.name, err);
      return [];
    }
  }

  if (entry.isDirectory) {
    const nextPrefix = prefix ? `${prefix}/${entry.name}` : entry.name;
    try {
      const reader = entry.createReader();
      const children = await readAllDirectoryEntries(reader);
      const nested = await Promise.all(children.map((child) => traverseFileTree(child, nextPrefix)));
      return nested.flat();
    } catch (err) {
      console.warn("[folder-upload] skip directory:", entry.name, err);
      return [];
    }
  }

  return [];
}

/** dataTransfer.files にフォルダ構造が含まれているか */
function hasRelativePaths(files) {
  return files.some((file) => (file.webkitRelativePath || file._relativePath || "").includes("/"));
}

/** DataTransfer からファイル一覧を収集（フォルダドロップ対応） */
export async function collectFilesFromDataTransfer(dataTransfer) {
  const fileList = [...(dataTransfer?.files ?? [])];

  // フォルダドロップ時は webkitRelativePath が付くため、Entry API を使わない（空白入り名で NotFoundError になりやすい）
  if (fileList.length > 0 && hasRelativePaths(fileList)) {
    return fileList;
  }

  const items = dataTransfer?.items;
  let hasDirectoryEntry = false;
  const entries = [];
  if (items?.length) {
    for (const item of items) {
      if (item.kind !== "file") continue;
      const entry = item.webkitGetAsEntry?.();
      if (!entry) continue;
      if (entry.isDirectory) hasDirectoryEntry = true;
      entries.push(entry);
    }
  }

  // 単一ファイルのドロップは files をそのまま使う（空白入りファイル名の Entry API 不具合回避）
  if (!hasDirectoryEntry && fileList.length > 0) {
    return fileList;
  }

  if (entries.length > 0) {
    try {
      const nested = await Promise.all(entries.map((entry) => traverseFileTree(entry)));
      const collected = nested.flat();
      if (collected.length > 0) return collected;
    } catch (err) {
      console.warn("[folder-upload] entry traversal failed, falling back to files:", err);
    }
  }

  return fileList;
}

/** ファイルの相対パスを取得 */
export function getFileRelativePath(file) {
  const rel = file._relativePath || file.webkitRelativePath || "";
  if (rel) return rel.replace(/\\/g, "/");
  return file.name;
}

/** フォルダ構造付きアップロードかどうか */
export function isFolderUpload(files) {
  return files.some((file) => getFileRelativePath(file).includes("/"));
}

/** ベースパスと相対パスからアップロード先ディレクトリとファイル名を決定 */
export function resolveUploadTarget(basePath, relativePath) {
  const normalized = relativePath.replace(/\\/g, "/");
  const slash = normalized.lastIndexOf("/");
  if (slash < 0) {
    return { directoryPath: basePath, filename: normalized };
  }
  const subDir = normalized.slice(0, slash);
  const filename = normalized.slice(slash + 1);
  const directoryPath = subDir ? `${basePath}/${subDir}` : basePath;
  return { directoryPath, filename };
}

/** アップロード前に必要なサブディレクトリを作成 */
export async function ensureStorageDirectories(basePath, directoryPaths, mkdirFn) {
  const relativeDirs = new Set();

  for (const fullPath of directoryPaths) {
    if (fullPath === basePath) continue;
    const prefix = `${basePath}/`;
    if (!fullPath.startsWith(prefix)) continue;
    const rel = fullPath.slice(prefix.length);
    if (!rel) continue;
    const parts = rel.split("/").filter(Boolean);
    for (let i = 1; i <= parts.length; i += 1) {
      relativeDirs.add(parts.slice(0, i).join("/"));
    }
  }

  const sorted = [...relativeDirs].sort(
    (a, b) => a.split("/").length - b.split("/").length
  );

  for (const relDir of sorted) {
    const parts = relDir.split("/");
    const name = parts[parts.length - 1];
    const parentRel = parts.slice(0, -1).join("/");
    const parentPath = parentRel ? `${basePath}/${parentRel}` : basePath;
    try {
      await mkdirFn(parentPath, name);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (!message.includes("同名")) throw err;
    }
  }
}
