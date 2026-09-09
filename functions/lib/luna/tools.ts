/**
 * Luna — ストレージツール定義・実行
 */

import type { Env, SessionUser } from "../types";
import { parseLogicalPath } from "../storage/keys";
import { authorizeStoragePath } from "../storage/permissions";
import { buildVisibleRoots, listDirectory } from "../storage/list";
import { searchStorageFiles, parseSearchDateFrom, parseSearchDateTo } from "../storage/search";
import { getFileMeta, getFolderMeta } from "../storage/meta";
import {
  deleteWithAuth,
  mkdirWithAuth,
  moveItemsWithAuth,
  renameWithAuth,
} from "../storage/operations";
import {
  readStorageFileForLuna,
  writeStorageFileForLuna,
} from "./storage-io";
import { searchAllRootsForLuna } from "./search-all";
import type { ToolDefinition } from "./openai";

export interface LunaFileItem {
  name: string;
  path: string;
  type: "file" | "folder";
  sizeBytes: number | null;
  updatedAt: number | null;
  location?: string;
}

export const LUNA_TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    type: "function",
    function: {
      name: "storage_list_roots",
      description: "ユーザーがアクセスできるストレージルート（個人・グループ）一覧を取得する",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "storage_list",
      description: "指定フォルダ内のファイル・フォルダ一覧を取得する",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "論理パス（例: u/alice または u/alice/docs）",
          },
          sort: {
            type: "string",
            enum: ["name", "updatedAt", "size", "createdAt"],
            description: "ソート項目（既定 name）",
          },
          order: {
            type: "string",
            enum: ["asc", "desc"],
            description: "昇順/降順（既定 asc）",
          },
          limit: { type: "number", description: "最大件数（既定 50）" },
          offset: { type: "number", description: "オフセット（既定 0）" },
        },
        required: ["path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "storage_stat",
      description: "ファイルまたはフォルダのメタデータ（サイズ・更新日時等）を取得する",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "論理パス" },
          item_type: {
            type: "string",
            enum: ["file", "folder", "auto"],
            description: "種別（auto=自動判定）",
          },
        },
        required: ["path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "storage_read_file",
      description: "ファイルの内容を読み込む（テキストは UTF-8、バイナリは base64）",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "ファイルの論理パス" },
          max_bytes: {
            type: "number",
            description: "最大読み込みバイト（既定 512KB）",
          },
        },
        required: ["path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "storage_write_file",
      description: "テキストファイルを新規作成または上書きする",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "ファイルの論理パス（例: u/alice/notes.txt）",
          },
          content: { type: "string", description: "書き込むテキスト内容" },
          overwrite: {
            type: "boolean",
            description: "既存ファイルを上書きする場合 true",
          },
        },
        required: ["path", "content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "storage_search",
      description: "指定ルート/フォルダ内でファイル名を検索する（部分一致・日付絞り込み可）",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "検索起点の論理パス（ルートまたはフォルダ）",
          },
          query: { type: "string", description: "検索語（空の場合は日付のみ）" },
          scope: {
            type: "string",
            enum: ["folder", "subtree", "root"],
            description: "folder=直下のみ, subtree=配下全体, root=ルート全体",
          },
          updated_from: {
            type: "string",
            description: "更新日時の開始（YYYY-MM-DD または ISO）",
          },
          updated_to: {
            type: "string",
            description: "更新日時の終了（YYYY-MM-DD または ISO）",
          },
          limit: { type: "number", description: "最大件数（既定 30）" },
        },
        required: ["path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "storage_search_all",
      description: "アクセス可能な全ストレージを横断してファイルを検索する",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "検索語（部分一致）" },
          days: {
            type: "number",
            description: "過去 N 日以内に更新されたファイルに限定（任意）",
          },
          limit: { type: "number", description: "最大件数（既定 40）" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "storage_recent",
      description: "最近更新されたファイルを取得する",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "ルートまたはフォルダの論理パス",
          },
          days: {
            type: "number",
            description: "過去何日分（既定 30）",
          },
          limit: { type: "number", description: "最大件数（既定 20）" },
        },
        required: ["path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "storage_mkdir",
      description: "フォルダを作成する",
      parameters: {
        type: "object",
        properties: {
          parent_path: {
            type: "string",
            description: "親フォルダの論理パス",
          },
          folder_name: { type: "string", description: "新しいフォルダ名" },
        },
        required: ["parent_path", "folder_name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "storage_move",
      description: "ファイルまたはフォルダを移動する",
      parameters: {
        type: "object",
        properties: {
          source_path: { type: "string", description: "移動元の論理パス" },
          source_type: {
            type: "string",
            enum: ["file", "folder"],
            description: "移動元の種別",
          },
          dest_path: {
            type: "string",
            description: "移動先フォルダの論理パス",
          },
        },
        required: ["source_path", "source_type", "dest_path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "storage_rename",
      description: "ファイルまたはフォルダの名前を変更する",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "対象の論理パス" },
          item_type: {
            type: "string",
            enum: ["file", "folder"],
            description: "種別",
          },
          new_name: { type: "string", description: "新しい名前" },
        },
        required: ["path", "item_type", "new_name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "storage_delete",
      description: "ファイルまたはフォルダをごみ箱へ移動する（ユーザーの削除権限が必要）",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "対象の論理パス" },
          item_type: {
            type: "string",
            enum: ["file", "folder"],
            description: "種別",
          },
        },
        required: ["path", "item_type"],
      },
    },
  },
];

function toFileItems(
  items: Array<{
    name: string;
    path: string;
    type: "file" | "folder";
    sizeBytes: number | null;
    updatedAt: number | null;
    location?: string;
  }>
): LunaFileItem[] {
  return items.map((item) => ({
    name: item.name,
    path: item.path,
    type: item.type,
    sizeBytes: item.sizeBytes,
    updatedAt: item.updatedAt,
    location: item.location,
  }));
}

function parseArgs(raw: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function strArg(args: Record<string, unknown>, key: string): string {
  const v = args[key];
  return typeof v === "string" ? v.trim() : "";
}

function numArg(args: Record<string, unknown>, key: string, fallback: number): number {
  const v = args[key];
  if (typeof v === "number" && Number.isFinite(v)) return Math.max(1, Math.floor(v));
  if (typeof v === "string") {
    const n = Number.parseInt(v, 10);
    if (Number.isFinite(n)) return Math.max(1, n);
  }
  return fallback;
}

function boolArg(args: Record<string, unknown>, key: string, fallback = false): boolean {
  const v = args[key];
  if (typeof v === "boolean") return v;
  if (v === "true" || v === 1) return true;
  if (v === "false" || v === 0) return false;
  return fallback;
}

function offsetArg(args: Record<string, unknown>, key: string): number {
  const v = args[key];
  if (typeof v === "number" && Number.isFinite(v)) return Math.max(0, Math.floor(v));
  return 0;
}

export interface ToolRunResult {
  text: string;
  files: LunaFileItem[];
}

/** ツールを実行して結果テキストとファイル一覧を返す */
export async function executeLunaTool(
  env: Env,
  db: D1Database,
  user: SessionUser,
  toolName: string,
  argsJson: string
): Promise<ToolRunResult> {
  const args = parseArgs(argsJson);

  try {
    switch (toolName) {
      case "storage_list_roots":
        return await runStorageListRoots(db, user);
      case "storage_list":
        return await runStorageList(env, db, user, args);
      case "storage_stat":
        return await runStorageStat(env, db, user, args);
      case "storage_read_file":
        return await runStorageReadFile(env, db, user, args);
      case "storage_write_file":
        return await runStorageWriteFile(env, db, user, args);
      case "storage_search":
        return await runStorageSearch(env, db, user, args);
      case "storage_search_all":
        return await runStorageSearchAll(env, db, user, args);
      case "storage_recent":
        return await runStorageRecent(env, db, user, args);
      case "storage_mkdir":
        return await runStorageMkdir(env, db, user, args);
      case "storage_move":
        return await runStorageMove(env, db, user, args);
      case "storage_rename":
        return await runStorageRename(env, db, user, args);
      case "storage_delete":
        return await runStorageDelete(env, db, user, args);
      default:
        return { text: `不明なツール: ${toolName}`, files: [] };
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "ツール実行に失敗しました";
    return { text: `エラー: ${message}`, files: [] };
  }
}

async function authorizeRead(
  env: Env,
  db: D1Database,
  user: SessionUser,
  path: string,
  isDirectory: boolean
): Promise<string | null> {
  const auth = await authorizeStoragePath(
    env,
    db,
    user,
    path,
    "read",
    isDirectory
  );
  if (typeof auth === "string") return auth;
  return null;
}

async function runStorageListRoots(
  db: D1Database,
  user: SessionUser
): Promise<ToolRunResult> {
  const roots = await buildVisibleRoots(
    db,
    user.id,
    user.username,
    user.is_admin
  );
  const lines = roots.map(
    (r) => `${r.path} — ${r.type === "user" ? "個人" : "グループ"}: ${r.label}`
  );
  return {
    text: `アクセス可能なルート（${roots.length} 件）:\n${lines.join("\n")}`,
    files: [],
  };
}

async function runStorageList(
  env: Env,
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  const path = strArg(args, "path");
  const limit = Math.min(100, numArg(args, "limit", 50));
  const offset = offsetArg(args, "offset");
  const sortRaw = strArg(args, "sort") || "name";
  const sortField =
    sortRaw === "updatedAt" ||
    sortRaw === "size" ||
    sortRaw === "createdAt"
      ? sortRaw
      : "name";
  const sortOrder = strArg(args, "order") === "desc" ? "desc" : "asc";
  const parsed = parseLogicalPath(path);
  if (!parsed) return { text: "パスが不正です", files: [] };

  const err = await authorizeRead(env, db, user, path, true);
  if (err) return { text: err, files: [] };

  const result = await listDirectory(
    env,
    parsed.rootType,
    parsed.rootKey,
    parsed.relativePath,
    { limit, offset, sortField, sortOrder }
  );

  const files = toFileItems(result.items);
  const summary = files.length
    ? files
        .map(
          (f) =>
            `${f.type === "folder" ? "[DIR]" : "[FILE]"} ${f.path}${
              f.sizeBytes != null ? ` (${f.sizeBytes} bytes)` : ""
            }`
        )
        .join("\n")
    : "（空です）";

  return {
    text: `一覧 ${result.path}（${result.total} 件、表示 ${files.length} 件、offset ${offset}）:\n${summary}`,
    files,
  };
}

async function runStorageStat(
  env: Env,
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  const path = strArg(args, "path");
  const typeArg = strArg(args, "item_type") || "auto";
  const parsed = parseLogicalPath(path);
  if (!parsed) return { text: "パスが不正です", files: [] };

  const isFolder =
    typeArg === "folder" ||
    (typeArg === "auto" && !parsed.relativePath.includes("."));

  const err = await authorizeRead(env, db, user, path, isFolder);
  if (err) return { text: err, files: [] };

  if (isFolder || !parsed.relativePath) {
    const folderMeta = await getFolderMeta(
      env,
      parsed.rootType,
      parsed.rootKey,
      parsed.relativePath
    );
    const item: LunaFileItem = {
      name: parsed.relativePath.split("/").pop() || parsed.rootKey,
      path,
      type: "folder",
      sizeBytes: null,
      updatedAt: folderMeta?.updatedAt ?? null,
    };
    return {
      text: `フォルダ ${path}\n更新: ${item.updatedAt ?? "不明"}\n作成者: ${folderMeta?.createdBy ?? "不明"}`,
      files: [item],
    };
  }

  const fileMeta = await getFileMeta(
    env,
    parsed.rootType,
    parsed.rootKey,
    parsed.relativePath
  );
  const name = parsed.relativePath.split("/").pop() ?? path;
  const item: LunaFileItem = {
    name,
    path,
    type: "file",
    sizeBytes: fileMeta?.sizeBytes ?? null,
    updatedAt: fileMeta?.updatedAt ?? null,
  };
  return {
    text: `ファイル ${path}\nサイズ: ${item.sizeBytes ?? "不明"} bytes\n更新: ${item.updatedAt ?? "不明"}\n作成者: ${fileMeta?.createdBy ?? "不明"}`,
    files: [item],
  };
}

async function runStorageReadFile(
  env: Env,
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  const path = strArg(args, "path");
  const maxBytes = Math.min(
    1024 * 1024,
    numArg(args, "max_bytes", 512 * 1024)
  );
  if (!path) return { text: "path が必要です", files: [] };

  const result = await readStorageFileForLuna(env, db, user, path, maxBytes);
  const preview =
    result.encoding === "utf-8"
      ? result.content.slice(0, 8000)
      : `[base64 ${result.content.length} chars]`;
  const item: LunaFileItem = {
    name: path.split("/").pop() ?? path,
    path: result.path,
    type: "file",
    sizeBytes: result.sizeBytes,
    updatedAt: null,
  };
  return {
    text: `読み込み ${result.path}（${result.sizeBytes} bytes, ${result.encoding}${result.truncated ? ", 切り詰め" : ""}）:\n${preview}`,
    files: [item],
  };
}

async function runStorageWriteFile(
  env: Env,
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  const path = strArg(args, "path");
  const content = typeof args.content === "string" ? args.content : "";
  const overwrite = boolArg(args, "overwrite", false);
  if (!path) return { text: "path が必要です", files: [] };

  const result = await writeStorageFileForLuna(
    env,
    db,
    user,
    path,
    content,
    overwrite
  );
  const item: LunaFileItem = {
    name: result.path.split("/").pop() ?? result.path,
    path: result.path,
    type: "file",
    sizeBytes: result.sizeBytes,
    updatedAt: Date.now(),
  };
  return {
    text: `${result.created ? "作成" : "上書き"}しました: ${result.path}（${result.sizeBytes} bytes）`,
    files: [item],
  };
}

async function runStorageSearchAll(
  env: Env,
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  const query = strArg(args, "query");
  const days = numArg(args, "days", 0);
  const limit = Math.min(80, numArg(args, "limit", 40));
  if (!query) return { text: "検索語を指定してください", files: [] };

  const { items } = await searchAllRootsForLuna(env, db, user, {
    query,
    days: days > 0 ? days : undefined,
    totalLimit: limit,
  });

  const summary = items.length
    ? items.map((f) => `${f.path} (更新: ${f.updatedAt ?? "不明"})`).join("\n")
    : "（該当なし）";

  return {
    text: `全ルート横断検索「${query}」: ${items.length} 件\n${summary}`,
    files: items,
  };
}

async function runStorageSearch(
  env: Env,
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  const path = strArg(args, "path");
  const query = strArg(args, "query");
  const scopeRaw = strArg(args, "scope") || "subtree";
  const scope =
    scopeRaw === "folder" || scopeRaw === "root" ? scopeRaw : "subtree";
  const limit = Math.min(80, numArg(args, "limit", 30));
  const updatedFrom = parseSearchDateFrom(strArg(args, "updated_from") || null);
  const updatedTo = parseSearchDateTo(strArg(args, "updated_to") || null);

  if (!query && updatedFrom === null && updatedTo === null) {
    return { text: "検索語または updated_from/updated_to を指定してください", files: [] };
  }

  const parsed = parseLogicalPath(path);
  if (!parsed) return { text: "パスが不正です", files: [] };

  const err = await authorizeRead(env, db, user, path, true);
  if (err) return { text: err, files: [] };

  const result = await searchStorageFiles(
    env,
    parsed.rootType,
    parsed.rootKey,
    parsed.relativePath,
    {
      query,
      scope,
      updatedFrom,
      updatedTo,
      limit,
      sortField: "updatedAt",
      sortOrder: "desc",
    }
  );

  const files = toFileItems(result.items);
  const summary = files.length
    ? files.map((f) => `${f.path} (更新: ${f.updatedAt ?? "不明"})`).join("\n")
    : "（該当なし）";

  return {
    text: `検索「${query}」: ${result.total} 件ヒット、表示 ${files.length} 件\n${summary}`,
    files,
  };
}

async function runStorageRecent(
  env: Env,
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  const path = strArg(args, "path");
  const days = Math.min(90, numArg(args, "days", 30));
  const limit = Math.min(50, numArg(args, "limit", 20));

  const parsed = parseLogicalPath(path);
  if (!parsed) return { text: "パスが不正です", files: [] };

  const err = await authorizeRead(env, db, user, path, true);
  if (err) return { text: err, files: [] };

  const updatedFrom = Date.now() - days * 24 * 60 * 60 * 1000;

  const result = await searchStorageFiles(
    env,
    parsed.rootType,
    parsed.rootKey,
    parsed.relativePath,
    {
      query: "",
      scope: "root",
      updatedFrom,
      limit,
      sortField: "updatedAt",
      sortOrder: "desc",
    }
  );

  const files = toFileItems(result.items);
  const summary = files.length
    ? files.map((f) => `${f.path} (更新: ${f.updatedAt ?? "不明"})`).join("\n")
    : "（該当なし）";

  return {
    text: `過去 ${days} 日の更新ファイル（${files.length} 件）:\n${summary}`,
    files,
  };
}

async function runStorageMkdir(
  env: Env,
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  const parentPath = strArg(args, "parent_path");
  const folderName = strArg(args, "folder_name");
  if (!parentPath || !folderName) {
    return { text: "parent_path と folder_name が必要です", files: [] };
  }

  const result = await mkdirWithAuth(env, db, user, parentPath, folderName);
  const item: LunaFileItem = {
    name: folderName,
    path: result.path,
    type: "folder",
    sizeBytes: null,
    updatedAt: Date.now(),
  };
  return {
    text: `フォルダを作成しました: ${result.path}`,
    files: [item],
  };
}

async function runStorageMove(
  env: Env,
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  const sourcePath = strArg(args, "source_path");
  const destPath = strArg(args, "dest_path");
  const sourceType = strArg(args, "source_type") === "folder" ? "folder" : "file";

  if (!sourcePath || !destPath) {
    return { text: "source_path と dest_path が必要です", files: [] };
  }

  const result = await moveItemsWithAuth(env, db, user, [
    { path: sourcePath, type: sourceType },
  ], destPath);

  const files: LunaFileItem[] = result.moved.map((m) => ({
    name: m.to.split("/").pop() ?? m.to,
    path: m.to,
    type: sourceType,
    sizeBytes: null,
    updatedAt: Date.now(),
  }));

  const summary = result.moved
    .map((m) => `${m.from} → ${m.to}${m.renamed ? " (リネームあり)" : ""}`)
    .join("\n");

  return { text: `移動しました:\n${summary}`, files };
}

async function runStorageRename(
  env: Env,
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  const path = strArg(args, "path");
  const newName = strArg(args, "new_name");
  const itemType = strArg(args, "item_type") === "folder" ? "folder" : "file";

  if (!path || !newName) {
    return { text: "path と new_name が必要です", files: [] };
  }

  const result = await renameWithAuth(env, db, user, path, newName, itemType === "folder");
  const item: LunaFileItem = {
    name: newName,
    path: result.path,
    type: itemType,
    sizeBytes: null,
    updatedAt: Date.now(),
  };
  return {
    text: `リネームしました: ${path} → ${result.path}`,
    files: [item],
  };
}

async function runStorageDelete(
  env: Env,
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  const path = strArg(args, "path");
  const itemType = strArg(args, "item_type") === "folder" ? "folder" : "file";
  if (!path) return { text: "path が必要です", files: [] };

  const result = await deleteWithAuth(env, db, user, path, itemType === "folder");
  return {
    text: `ごみ箱へ移動しました: ${path} (trashId=${result.trashId})`,
    files: [],
  };
}
