/**
 * Runa — ストレージツール定義・実行
 */

import type { Env, SessionUser } from "../types";
import { canUserAccessApp } from "../apps";
import { parseLogicalPath, type StorageRootType } from "../storage/keys";
import { authorizeStoragePath } from "../storage/permissions";
import { STORAGE_APP_SLUG } from "../storage/constants";
import { createStorageShareLink } from "../storage/share";
import { buildRunaOriginRequest } from "./origin";
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
  formatFileProbeForRuna,
  probeStorageFileForRuna,
  readStorageFileForRuna,
  writeStorageFileForRuna,
} from "./storage-io";
import { listRecentFilesInRoot } from "../storage/recent";
import {
  isRootIndexReady,
  queryFilesByOperatorAcrossRoots,
  type IndexedRecentFile,
} from "../storage/file-index";
import { resolveRootForPath } from "../storage/roots";
import { searchAllRootsForRuna } from "./search-all";
import type { ToolDefinition } from "./openai";

export interface RunaFileItem {
  name: string;
  path: string;
  type: "file" | "folder";
  sizeBytes: number | null;
  updatedAt: number | null;
  createdAt?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  location?: string;
}

export const RUNA_TOOL_DEFINITIONS: ToolDefinition[] = [
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
      name: "storage_probe_file",
      description:
        "ファイルの概要（サイズ・形式・推定行数・先頭数行）を取得する。大きいファイルを読む前に必ず使う",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "ファイルの論理パス" },
        },
        required: ["path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "storage_read_file",
      description:
        "ファイル内容を読む。大きいテキストは grep または line_start/line_limit で部分読み。全文読みは small 分類のみ",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "ファイルの論理パス" },
          max_bytes: {
            type: "number",
            description: "最大読み込みバイト（既定 512KB）",
          },
          offset_bytes: {
            type: "number",
            description: "読み始めバイト位置（バイト単位の続き読み）",
          },
          line_start: {
            type: "number",
            description: "1始まりの行番号（部分読み）",
          },
          line_limit: {
            type: "number",
            description: "読む行数（既定 200、最大 500）",
          },
          grep: {
            type: "string",
            description: "行内容にマッチする正規表現（行番号付きで返る）",
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
          updated_by: {
            type: "string",
            description: "最終更新者の username（インデックス上のメタデータ）",
          },
          created_by: {
            type: "string",
            description: "作成者の username",
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
      name: "storage_files_by_user",
      description:
        "指定ユーザー（username）が作成または更新したファイルを、アクセス可能な全ルートから検索する。操作履歴ログではなくファイルメタデータの created_by / updated_by に基づく",
      parameters: {
        type: "object",
        properties: {
          username: {
            type: "string",
            description: "対象ユーザーの username（hub_search_users で特定）",
          },
          field: {
            type: "string",
            enum: ["either", "updated", "created"],
            description: "either=作成または更新, updated=最終更新者, created=作成者",
          },
          days: {
            type: "number",
            description: "過去 N 日以内に更新されたファイルに限定（任意）",
          },
          limit: { type: "number", description: "最大件数（既定 30）" },
        },
        required: ["username"],
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
  {
    type: "function",
    function: {
      name: "storage_create_share_link",
      description:
        "クラウドストレージのファイルに共有リンクを作成する（ダウンロード上限付きの公開 URL）。ファイルのみ対応",
      parameters: {
        type: "object",
        properties: {
          paths: {
            type: "array",
            items: { type: "string" },
            description: "共有するファイルの論理パス（例: u/alice/report.pdf）",
          },
          max_downloads: {
            type: "number",
            description: "ダウンロード上限（1〜1000、省略時 10）",
          },
        },
        required: ["paths"],
      },
    },
  },
];

function indexedToRunaItem(item: IndexedRecentFile): RunaFileItem {
  return {
    name: item.name,
    path: item.path,
    type: item.type,
    sizeBytes: item.sizeBytes,
    updatedAt: item.updatedAt,
    createdAt: item.createdAt,
    createdBy: item.createdBy,
    updatedBy: item.updatedBy,
    location: item.location,
  };
}

function toFileItems(
  items: Array<{
    name: string;
    path: string;
    type: "file" | "folder";
    sizeBytes: number | null;
    updatedAt: number | null;
    createdAt?: number | null;
    createdBy?: string | null;
    updatedBy?: string | null;
    location?: string;
  }>
): RunaFileItem[] {
  return items.map((item) => ({
    name: item.name,
    path: item.path,
    type: item.type,
    sizeBytes: item.sizeBytes,
    updatedAt: item.updatedAt,
    createdAt: item.createdAt ?? null,
    createdBy: item.createdBy ?? null,
    updatedBy: item.updatedBy ?? null,
    location: item.location,
  }));
}

function formatFileOperatorSummary(file: RunaFileItem): string {
  const updated =
    file.updatedAt != null
      ? new Date(file.updatedAt).toLocaleString("ja-JP", {
          timeZone: "Asia/Tokyo",
        })
      : "不明";
  const operator = file.updatedBy || file.createdBy;
  const operatorPart = operator ? ` · 操作者: ${operator}` : "";
  return `${file.path} (更新: ${updated}${operatorPart})`;
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

function pathsArg(args: Record<string, unknown>, key: string): string[] {
  const v = args[key];
  if (Array.isArray(v)) {
    return v
      .filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
      .map((item) => item.trim());
  }
  if (typeof v === "string" && v.trim()) return [v.trim()];
  return [];
}

export interface ToolRunResult {
  text: string;
  files: RunaFileItem[];
}

/** ツールを実行して結果テキストとファイル一覧を返す */
export async function executeRunaTool(
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
      case "storage_probe_file":
        return await runStorageProbeFile(env, db, user, args);
      case "storage_read_file":
        return await runStorageReadFile(env, db, user, args);
      case "storage_write_file":
        return await runStorageWriteFile(env, db, user, args);
      case "storage_search":
        return await runStorageSearch(env, db, user, args);
      case "storage_files_by_user":
        return await runStorageFilesByUser(env, db, user, args);
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
      case "storage_create_share_link":
        return await runStorageCreateShareLink(env, db, user, args);
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
    const item: RunaFileItem = {
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
  const item: RunaFileItem = {
    name,
    path,
    type: "file",
    sizeBytes: fileMeta?.sizeBytes ?? null,
    updatedAt: fileMeta?.updatedAt ?? null,
    createdAt: fileMeta?.createdAt ?? null,
    createdBy: fileMeta?.createdBy ?? null,
    updatedBy: fileMeta?.updatedBy ?? null,
  };
  return {
    text: `ファイル ${path}\nサイズ: ${item.sizeBytes ?? "不明"} bytes\n更新: ${item.updatedAt ?? "不明"}\n作成者: ${fileMeta?.createdBy ?? "不明"}\n最終更新者: ${fileMeta?.updatedBy ?? "不明"}`,
    files: [item],
  };
}

async function runStorageProbeFile(
  env: Env,
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  const path = strArg(args, "path");
  if (!path) return { text: "path が必要です", files: [] };

  const probe = await probeStorageFileForRuna(env, db, user, path);
  const item: RunaFileItem = {
    name: probe.name,
    path: probe.path,
    type: "file",
    sizeBytes: probe.sizeBytes,
    updatedAt: null,
  };
  return {
    text: formatFileProbeForRuna(probe),
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
  if (!path) return { text: "path が必要です", files: [] };

  const maxBytes = Math.min(
    1024 * 1024,
    numArg(args, "max_bytes", 512 * 1024)
  );
  const offsetBytes =
    typeof args.offset_bytes === "number" && Number.isFinite(args.offset_bytes)
      ? Math.max(0, Math.floor(args.offset_bytes))
      : undefined;
  const lineStart =
    typeof args.line_start === "number" && Number.isFinite(args.line_start)
      ? Math.max(1, Math.floor(args.line_start))
      : undefined;
  const lineLimit =
    typeof args.line_limit === "number" && Number.isFinite(args.line_limit)
      ? Math.max(1, Math.floor(args.line_limit))
      : undefined;
  const grep = strArg(args, "grep") || undefined;

  const result = await readStorageFileForRuna(env, db, user, path, {
    maxBytes,
    offsetBytes,
    lineStart,
    lineLimit,
    grep,
  });

  const preview =
    result.encoding === "utf-8"
      ? result.content.slice(0, 8000)
      : `[base64 ${result.content.length} chars]`;
  const modeLabel = result.readMode ?? "full";
  const extra =
    result.lineRange != null
      ? `, 行 ${result.lineRange.start}-${result.lineRange.end}`
      : result.grepMatchCount != null
        ? `, grep ${result.grepMatchCount} 件`
        : "";
  const item: RunaFileItem = {
    name: path.split("/").pop() ?? path,
    path: result.path,
    type: "file",
    sizeBytes: result.sizeBytes,
    updatedAt: null,
  };
  return {
    text: `読み込み ${result.path}（${result.sizeBytes} bytes, ${result.encoding}, ${modeLabel}${extra}${result.truncated ? ", 切り詰め" : ""}）:\n${preview}`,
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

  const result = await writeStorageFileForRuna(
    env,
    db,
    user,
    path,
    content,
    overwrite
  );
  const item: RunaFileItem = {
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

  const { items } = await searchAllRootsForRuna(env, db, user, {
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

async function runStorageFilesByUser(
  _env: Env,
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  const username = strArg(args, "username");
  const fieldRaw = strArg(args, "field") || "either";
  const field =
    fieldRaw === "updated" || fieldRaw === "created" ? fieldRaw : "either";
  const days = numArg(args, "days", 0);
  const limit = Math.min(80, numArg(args, "limit", 30));

  if (!username) {
    return { text: "username を指定してください", files: [] };
  }

  const roots = await buildVisibleRoots(
    db,
    user.id,
    user.username,
    user.is_admin
  );
  const resolvedRoots: Array<{
    id: string;
    type: StorageRootType;
    key: string;
  }> = [];
  for (const root of roots) {
    const rootType: StorageRootType =
      root.type === "user" ? "user" : "group";
    const row = await resolveRootForPath(db, rootType, root.key);
    if (!row || !(await isRootIndexReady(db, row.id))) continue;
    resolvedRoots.push({ id: row.id, type: rootType, key: root.key });
  }

  if (!resolvedRoots.length) {
    return {
      text: `ユーザー \`${username}\` のファイルを検索できません（ファイルインデックスが未整備です）`,
      files: [],
    };
  }

  const updatedFrom =
    days > 0 ? Date.now() - days * 24 * 60 * 60 * 1000 : null;

  const items = await queryFilesByOperatorAcrossRoots(db, resolvedRoots, {
    username,
    field,
    updatedFrom,
    limit,
  });

  const files = items.map(indexedToRunaItem);
  const summary = files.length
    ? files.map(formatFileOperatorSummary).join("\n")
    : "（該当なし — メタデータに操作者情報がない古いファイルは含まれません）";

  const fieldLabel =
    field === "updated"
      ? "最終更新者"
      : field === "created"
        ? "作成者"
        : "作成または更新";

  return {
    text: `\`${username}\` が${fieldLabel}のファイル（${files.length} 件）:\n${summary}`,
    files,
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
  const updatedBy = strArg(args, "updated_by");
  const createdBy = strArg(args, "created_by");

  if (
    !query &&
    updatedFrom === null &&
    updatedTo === null &&
    !updatedBy &&
    !createdBy
  ) {
    return {
      text: "検索語、updated_from/updated_to、または updated_by/created_by を指定してください",
      files: [],
    };
  }

  const parsed = parseLogicalPath(path);
  if (!parsed) return { text: "パスが不正です", files: [] };

  const err = await authorizeRead(env, db, user, path, true);
  if (err) return { text: err, files: [] };

  const result = await searchStorageFiles(
    env,
    db,
    parsed.rootType,
    parsed.rootKey,
    parsed.relativePath,
    {
      query,
      scope,
      updatedFrom,
      updatedTo,
      updatedBy: updatedBy || null,
      createdBy: createdBy || null,
      limit,
      sortField: "updatedAt",
      sortOrder: "desc",
    }
  );

  const files = toFileItems(result.items);
  const summary = files.length
    ? files.map(formatFileOperatorSummary).join("\n")
    : "（該当なし）";

  const label = query || updatedBy || createdBy || "条件指定";
  return {
    text: `検索「${label}」: ${result.total} 件ヒット、表示 ${files.length} 件\n${summary}`,
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

  const entries = await listRecentFilesInRoot(env, db, parsed.rootType, parsed.rootKey, {
    updatedFrom,
    limit,
  });
  const logicalPrefix = path.replace(/\/$/, "");
  const scoped = parsed.relativePath
    ? entries.filter(
        (item) =>
          item.path === logicalPrefix ||
          item.path.startsWith(`${logicalPrefix}/`)
      )
    : entries;
  const files = toFileItems(scoped);
  const summary = files.length
    ? files.map(formatFileOperatorSummary).join("\n")
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
  const item: RunaFileItem = {
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

  const files: RunaFileItem[] = result.moved.map((m) => ({
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
  const item: RunaFileItem = {
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

async function runStorageCreateShareLink(
  env: Env,
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  const allowed = await canUserAccessApp(db, user.id, STORAGE_APP_SLUG);
  if (!allowed) {
    return { text: "クラウドストレージへのアクセス権限がありません", files: [] };
  }

  const paths = pathsArg(args, "paths");
  if (!paths.length) {
    return { text: "paths に共有するファイルを指定してください", files: [] };
  }

  const maxDownloads = args.max_downloads;
  const result = await createStorageShareLink(
    env,
    db,
    user,
    paths,
    maxDownloads,
    buildRunaOriginRequest(env)
  );

  const fileLines = result.files
    .map((file) => `- ${file.filename} (${file.size_bytes} bytes)`)
    .join("\n");

  return {
    text:
      `共有リンクを作成しました。\n` +
      `URL: ${result.url}\n` +
      `ダウンロード上限: ${result.max_downloads} 回\n` +
      `ファイル:\n${fileLines}`,
    files: result.files.map((file) => ({
      name: file.filename,
      path: paths.find((p) => p.endsWith(file.filename)) ?? file.filename,
      type: "file",
      sizeBytes: file.size_bytes,
      updatedAt: null,
    })),
  };
}
