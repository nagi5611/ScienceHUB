/**
 * Runa — 各アプリ連携ツール（ユーザー権限と同じ）
 */

import type { Env, SessionUser } from "../types";
import { canUserAccessApp, getDashboardForUser } from "../apps";
import { listPublishedAnnouncements } from "../announcements";
import { createScheduleEvent, listScheduleEvents } from "../schedule";
import {
  completeTask,
  createTask,
  getProjectDashboard,
  PROJECT_APP_SLUG,
} from "../project-management";
import { getUserUpcomingReservations as getPrintReservations } from "../3dprint/reservations";
import { getTodayJst } from "../3dprint/slots";
import { getUserUpcomingReservations as getSimReservations } from "../simulation/reservations";
import { listFdsRequestsForUser } from "../simulation/fds-requests";
import { listOpenfoamRequestsForUser } from "../simulation/openfoam-requests";
import { listMyProjects, THIRD_PARTY_APP_SLUG } from "../third-party";
import {
  createWebSite,
  getOwnedWebSite,
  listUserWebSites,
} from "../website-publish/sites";
import { WEBSITE_PUBLISH_APP_SLUG, MAX_SITES_PER_USER } from "../website-publish/constants";
import { writeSiteFileText } from "../website-publish/file-ops";
import { listSiteFiles } from "../website-publish/r2-ops";
import { importStorageFilesToWebSite } from "./web-bridge";
import { buildRunaPublicWebUrl } from "./origin";
import { listNotes, EXCALIDRAW_APP_SLUG } from "../excalidraw-notes";
import { listProjects as listDesignProjects, DESIGN_APP_SLUG } from "../design";
import { STORAGE_APP_SLUG } from "../storage/constants";
import { getFiles } from "../r2";
import { fileMetaKey, parseLogicalPath, sanitizeFilename, toR2Key } from "../storage/keys";
import { authorizeStoragePath } from "../storage/permissions";
import { createFileMeta, resolveEffectivePermissions, writeMetaJson } from "../storage/meta";
import {
  addUsedBytes,
  subtractUsedBytes,
} from "../storage/quota";
import { canAllocateStorageBytes } from "../storage/user-combined-quota";
import { resolveRootForPath } from "../storage/roots";
import {
  initiateStorageUpload,
  simpleStorageUpload,
} from "../storage/upload";
import {
  IMAGE_CONVERTER_APP_SLUG,
  getServerOutputMime,
  isServerConvertFile,
  parseServerOutputFormat,
} from "../image-converter/cloudflare-images";
import { runImageGenerate } from "./image-generate";
import type { ToolDefinition } from "./openai";
import type { RunaFileItem, ToolRunResult } from "./tools";
import { searchUsersForRuna } from "./user-search";
import {
  formatSerpBaseResultsForRuna,
  isSerpBaseConfigured,
  searchWebWithSerpBase,
} from "./serpbase";

const PRINT_APP_SLUG = "3dprint-reservation";
const SIM_APP_SLUG = "simulation-request";

export const HUB_TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    type: "function",
    function: {
      name: "hub_list_apps",
      description:
        "ユーザーが使える ScienceHUB アプリ一覧（グループ別）。ブラウザ専用アプリは href を案内する",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "hub_list_announcements",
      description: "ダッシュボードのお知らせ一覧",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "hub_search_users",
      description:
        "表示名または username でユーザーを検索する（同一グループメンバー。管理者は全ユーザー）",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "検索語（表示名・username の部分一致）",
          },
          limit: { type: "number", description: "最大件数（既定 20）" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "web_search",
      description:
        "インターネット（SerpBase / Google 検索結果）を検索する。ScienceHUB 内のファイル検索ではなく、一般知識・最新情報・外部サイトの確認に使う",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "検索クエリ" },
          num: {
            type: "number",
            description: "取得件数（1〜10、既定 8）",
          },
          tbs: {
            type: "string",
            enum: ["qdr:h", "qdr:d", "qdr:w", "qdr:m", "qdr:y"],
            description:
              "期間絞り込み（任意）: SerpBase 公式 API 未対応のため現在は無視される",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "hub_list_schedule",
      description: "カレンダー予定を期間指定で取得する",
      parameters: {
        type: "object",
        properties: {
          from: { type: "string", description: "開始日 YYYY-MM-DD（省略時は今日）" },
          to: { type: "string", description: "終了日 YYYY-MM-DD（省略時は今日+14日）" },
          scope: {
            type: "string",
            enum: ["mine", "all"],
            description: "mine=自分のグループ, all=全グループ",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "hub_create_schedule",
      description: "グループの予定を作成する（作成権限があるグループのみ）",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          group_id: { type: "string", description: "グループ ID（hub_list_apps の group.id）" },
          event_date: { type: "string", description: "YYYY-MM-DD" },
          description: { type: "string" },
          is_all_day: { type: "boolean" },
          start_time: { type: "string", description: "HH:MM" },
          end_time: { type: "string", description: "HH:MM" },
        },
        required: ["title", "group_id", "event_date"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "pm_list_tasks",
      description: "プロジェクト管理の自分のタスク・プロジェクト一覧",
      parameters: {
        type: "object",
        properties: {
          group_id: { type: "string", description: "グループ ID（省略時は先頭グループ）" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "pm_create_task",
      description: "プロジェクト管理でタスクを作成する",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          group_id: { type: "string" },
          description: { type: "string" },
          due_date: { type: "string", description: "YYYY-MM-DD" },
          parent_project_id: { type: "string" },
        },
        required: ["title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "pm_complete_task",
      description: "自分のタスクを完了にする",
      parameters: {
        type: "object",
        properties: { task_id: { type: "string" } },
        required: ["task_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "print_list_reservations",
      description: "自分の今後の 3D 印刷予約一覧",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "sim_list_jobs",
      description: "自分のシミュレーション予約・FDS/OpenFOAM 依頼一覧",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "tp_list_projects",
      description: "サードパーティで自分が作ったアプリ/プロジェクト一覧",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "web_list_sites",
      description:
        "ウェブサイト公開の自分のサイト一覧。公開 URL は https://s.mmh-virtual.jp/web/{slug}/ 形式",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "web_create_site",
      description:
        "ウェブサイト公開に新しいサイトを作成する。公開 URL は https://s.mmh-virtual.jp/web/{path_slug}/",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "サイトの表示名" },
          path_slug: {
            type: "string",
            description: "URL 用スラッグ（英数字・ハイフン、例: my-landing）",
          },
        },
        required: ["title", "path_slug"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "web_write_file",
      description:
        "ウェブサイト公開のサイト内にテキストファイル（HTML/CSS/JS 等）を書き込む。公開後の URL は https://s.mmh-virtual.jp/web/{slug}/...",
      parameters: {
        type: "object",
        properties: {
          site_id: { type: "string", description: "サイト ID（web_list_sites で取得）" },
          path: {
            type: "string",
            description: "サイト内の相対パス（例: index.html, css/style.css）",
          },
          content: { type: "string", description: "書き込む内容" },
        },
        required: ["site_id", "path", "content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "web_list_site_files",
      description: "ウェブサイト公開のサイト内ファイル一覧",
      parameters: {
        type: "object",
        properties: {
          site_id: { type: "string", description: "サイト ID" },
        },
        required: ["site_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "web_import_from_storage",
      description:
        "クラウドストレージのファイルまたはフォルダをウェブサイト公開サイトへ取り込む。公開 URL は https://s.mmh-virtual.jp/web/{slug}/",
      parameters: {
        type: "object",
        properties: {
          site_id: { type: "string", description: "サイト ID" },
          storage_paths: {
            type: "array",
            items: { type: "string" },
            description: "ストレージの論理パス（ファイルまたはフォルダ）",
          },
          dest_prefix: {
            type: "string",
            description: "サイト内の配置先プレフィックス（任意、例: assets）",
          },
        },
        required: ["site_id", "storage_paths"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "excalidraw_list_notes",
      description: "ホワイトボード（Excalidraw）の自分のノート一覧",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "design_list_projects",
      description: "設計アプリの自分のプロジェクト一覧",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "image_generate",
      description:
        "Runa の画像生成能力。draft=下書き（速い）、final=完成品（高精細・文字向き）、edit=既存画像の編集（source_path 必須）。生成した画像はストレージに保存する",
      parameters: {
        type: "object",
        properties: {
          prompt: { type: "string", description: "生成・編集の指示（日本語可）" },
          mode: {
            type: "string",
            enum: ["draft", "final", "edit"],
            description:
              "draft=試行・複数案, final=保存・提出用, edit=参照画像の編集",
          },
          dest_path: {
            type: "string",
            description:
              "保存先の論理パス（省略時は u/{username}/generated/ に自動保存）",
          },
          aspect_ratio: {
            type: "string",
            enum: [
              "auto",
              "1:1",
              "3:4",
              "4:3",
              "9:16",
              "16:9",
              "2:3",
              "3:2",
            ],
            description: "アスペクト比（既定 auto）",
          },
          source_path: {
            type: "string",
            description: "edit 時の編集元画像の論理パス",
          },
          mask_path: {
            type: "string",
            description: "編集マスク画像の論理パス（任意）",
          },
          count: {
            type: "number",
            description: "生成枚数（draft のみ最大 3、既定 1）",
          },
        },
        required: ["prompt"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "image_convert_storage",
      description:
        "ストレージ上の HEIC/TIFF/RAW を JPEG/PNG/WebP/AVIF に変換して保存する（サーバー変換対応形式のみ）",
      parameters: {
        type: "object",
        properties: {
          source_path: { type: "string", description: "変換元の論理パス" },
          dest_path: {
            type: "string",
            description: "保存先パス（省略時は同フォルダに拡張子変更）",
          },
          format: {
            type: "string",
            enum: ["jpeg", "png", "webp", "avif"],
            description: "出力形式（既定 jpeg）",
          },
          quality: { type: "number", description: "40-100（既定 85）" },
        },
        required: ["source_path"],
      },
    },
  },
];

const HUB_TOOL_NAMES = new Set(HUB_TOOL_DEFINITIONS.map((t) => t.function.name));

export function isHubTool(name: string): boolean {
  return HUB_TOOL_NAMES.has(name);
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

function boolArg(args: Record<string, unknown>, key: string, fallback = false): boolean {
  const v = args[key];
  if (typeof v === "boolean") return v;
  return fallback;
}

function numArg(args: Record<string, unknown>, key: string, fallback: number): number {
  const v = args[key];
  if (typeof v === "number" && Number.isFinite(v)) return v;
  return fallback;
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

function todayJst(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

async function requireApp(
  db: D1Database,
  userId: string,
  slug: string
): Promise<void> {
  const allowed = await canUserAccessApp(db, userId, slug);
  if (!allowed) {
    throw new Error(`アプリ「${slug}」へのアクセス権限がありません`);
  }
}

/** ハブ／アプリツールを実行 */
export async function executeHubTool(
  env: Env,
  db: D1Database,
  user: SessionUser,
  toolName: string,
  argsJson: string
): Promise<ToolRunResult> {
  const args = parseArgs(argsJson);
  try {
    switch (toolName) {
      case "hub_list_apps":
        return await runHubListApps(db, user);
      case "hub_list_announcements":
        return await runHubAnnouncements(db, user);
      case "hub_search_users":
        return await runHubSearchUsers(db, user, args);
      case "web_search":
        return await runWebSearch(env, args);
      case "hub_list_schedule":
        return await runHubListSchedule(env, db, user, args);
      case "hub_create_schedule":
        return await runHubCreateSchedule(env, db, user, args);
      case "pm_list_tasks":
        return await runPmListTasks(db, user, args);
      case "pm_create_task":
        return await runPmCreateTask(db, user, args);
      case "pm_complete_task":
        return await runPmCompleteTask(db, user, args);
      case "print_list_reservations":
        return await runPrintList(db, user);
      case "sim_list_jobs":
        return await runSimList(db, user);
      case "tp_list_projects":
        return await runTpList(db, user);
      case "web_list_sites":
        return await runWebList(env, db, user);
      case "web_create_site":
        return await runWebCreateSite(env, db, user, args);
      case "web_write_file":
        return await runWebWriteFile(env, db, user, args);
      case "web_list_site_files":
        return await runWebListSiteFiles(env, db, user, args);
      case "web_import_from_storage":
        return await runWebImportFromStorage(env, db, user, args);
      case "excalidraw_list_notes":
        return await runExcalidrawList(db, user);
      case "design_list_projects":
        return await runDesignList(db, user);
      case "image_convert_storage":
        return await runImageConvert(env, db, user, args);
      case "image_generate":
        return await runImageGenerate(env, db, user, args);
      default:
        return { text: `不明なツール: ${toolName}`, files: [] };
    }
  } catch (error) {
    const raw =
      error instanceof Error ? error.message : "ツール実行に失敗しました";
    if (toolName === "image_generate") {
      const text =
        raw.startsWith("画像生成") ||
        raw.startsWith("Runa") ||
        raw.includes("prompt") ||
        raw.includes("source_path") ||
        raw.includes("クラウドストレージ")
          ? raw
          : "画像生成に失敗しました";
      return { text, files: [] };
    }
    return { text: `エラー: ${raw}`, files: [] };
  }
}

async function runHubListApps(
  db: D1Database,
  user: SessionUser
): Promise<ToolRunResult> {
  const groups = await getDashboardForUser(db, user.id);
  if (!groups.length) {
    return { text: "利用可能なアプリがありません。", files: [] };
  }
  const lines: string[] = [];
  for (const g of groups) {
    lines.push(`# ${g.display_name} (id=${g.id}, slug=${g.slug})`);
    for (const app of g.apps) {
      lines.push(`- ${app.display_name} [${app.slug}] ${app.href}`);
    }
  }
  lines.push(
    "\nブラウザ内処理のみのアプリ（Runa では実行不可、リンク案内）: image-editor, uvcreator, tennis-motion, video-editor, video-converter, audio-editor, audio-converter"
  );
  return { text: lines.join("\n"), files: [] };
}

async function runWebSearch(
  env: Env,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  if (!isSerpBaseConfigured(env)) {
    return {
      text: "Web 検索は現在利用できません（SERPBASE_APIKEY が未設定）",
      files: [],
    };
  }

  const query = strArg(args, "query");
  if (!query) {
    return { text: "query を指定してください", files: [] };
  }

  const num = numArg(args, "num", 8);
  // tbs: SerpBase 公式 API 未対応 — ツール互換のため引数のみ受け取り無視

  const payload = await searchWebWithSerpBase(env, {
    query,
    num,
  });

  return {
    text: formatSerpBaseResultsForRuna(payload),
    files: [],
  };
}

async function runHubAnnouncements(
  db: D1Database,
  user: SessionUser
): Promise<ToolRunResult> {
  const items = await listPublishedAnnouncements(db, user.id);
  if (!items.length) return { text: "お知らせはありません。", files: [] };
  const lines = items.map(
    (a) => `- ${new Date(a.published_at).toLocaleString("ja-JP")}: ${a.body}`
  );
  return { text: `お知らせ（${items.length} 件）:\n${lines.join("\n")}`, files: [] };
}

async function runHubSearchUsers(
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  const query = strArg(args, "query");
  const limit = Math.min(30, numArg(args, "limit", 20));
  if (!query) {
    return { text: "query を指定してください", files: [] };
  }

  const hits = await searchUsersForRuna(db, user, query, limit);
  if (!hits.length) {
    return {
      text: `「${query}」に一致するユーザーは見つかりませんでした（同一グループ内で検索）`,
      files: [],
    };
  }

  const lines = hits.map(
    (hit) =>
      `- ${hit.displayName}（username: \`${hit.username}\`, id: ${hit.id}）`
  );
  return {
    text: `ユーザー検索「${query}」（${hits.length} 件）:\n${lines.join("\n")}\n\nファイル検索には username を storage_files_by_user に渡してください。`,
    files: [],
  };
}

async function runHubListSchedule(
  env: Env,
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  const from = strArg(args, "from") || todayJst();
  const to = strArg(args, "to") || addDays(from, 14);
  const scope = strArg(args, "scope") === "all" ? "all" : "mine";
  const data = await listScheduleEvents(db, env, user.id, from, to, scope);
  const events = data.events ?? [];
  if (!events.length) {
    return { text: `${from}〜${to} の予定はありません。`, files: [] };
  }
  const lines = events.map((e) => {
    const time = e.time_label ?? (e.is_all_day ? "終了" : "");
    const manage = e.can_manage ? " [編集可]" : "";
    return `- ${e.event_date} ${time} ${e.title} (${e.group_display_name}) id=${e.id}${manage}`;
  });
  return {
    text: `予定 ${from}〜${to}（${events.length} 件）:\n${lines.join("\n")}`,
    files: [],
  };
}

async function runHubCreateSchedule(
  env: Env,
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  const title = strArg(args, "title");
  const groupId = strArg(args, "group_id");
  const eventDate = strArg(args, "event_date");
  if (!title || !groupId || !eventDate) {
    return { text: "title, group_id, event_date が必要です", files: [] };
  }
    const { event, sync_warnings } = await createScheduleEvent(db, env, user.id, {
    title,
    group_id: groupId,
    event_date: eventDate,
    description: strArg(args, "description") || undefined,
    is_all_day: strArg(args, "start_time") ? false : boolArg(args, "is_all_day", true),
    start_time: strArg(args, "start_time") || null,
    end_time: strArg(args, "end_time") || null,
  });
  const warn = sync_warnings.length
    ? `\n同期警告: ${sync_warnings.join(", ")}`
    : "";
  return {
    text: `予定を作成しました: ${event.title} ${event.event_date} id=${event.id}${warn}`,
    files: [],
  };
}

async function runPmListTasks(
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  await requireApp(db, user.id, PROJECT_APP_SLUG);
  const groupId = strArg(args, "group_id") || undefined;
  const dash = await getProjectDashboard(db, user.id, groupId || null);
  const taskLines = dash.tasks.map(
    (t) =>
      `- [${t.status}] ${t.title} due=${t.due_date ?? "なし"} id=${t.id} project=${t.parent_name ?? "-"}`
  );
  const projectLines = dash.projects.slice(0, 20).map(
    (p) => `- ${p.name} id=${p.id} due=${p.due_date ?? "なし"}`
  );
  return {
    text: [
      `グループ: ${dash.group.display_name} (${dash.group.id})`,
      `未完了タスク（${dash.tasks.length}）:`,
      taskLines.length ? taskLines.join("\n") : "（なし）",
      `プロジェクト（最大20）:`,
      projectLines.length ? projectLines.join("\n") : "（なし）",
    ].join("\n"),
    files: [],
  };
}

async function runPmCreateTask(
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  await requireApp(db, user.id, PROJECT_APP_SLUG);
  const title = strArg(args, "title");
  if (!title) return { text: "title が必要です", files: [] };
  const result = await createTask(db, user.id, {
    title,
    group_id: strArg(args, "group_id") || undefined,
    description: strArg(args, "description") || undefined,
    due_date: strArg(args, "due_date") || null,
    parent_project_id: strArg(args, "parent_project_id") || null,
  });
  const created = result.tasks.find((t) => t.title === title) ?? result.tasks[0];
  return {
    text: `タスクを作成しました: ${created?.title ?? title} id=${created?.id ?? "?"}`,
    files: [],
  };
}

async function runPmCompleteTask(
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  await requireApp(db, user.id, PROJECT_APP_SLUG);
  const taskId = strArg(args, "task_id");
  if (!taskId) return { text: "task_id が必要です", files: [] };
  await completeTask(db, user.id, taskId);
  return { text: `タスクを完了にしました: ${taskId}`, files: [] };
}

async function runPrintList(
  db: D1Database,
  user: SessionUser
): Promise<ToolRunResult> {
  await requireApp(db, user.id, PRINT_APP_SLUG);
  const rows = await getPrintReservations(db, user.id, getTodayJst());
  if (!rows.length) return { text: "今後の 3D 印刷予約はありません。", files: [] };
  const lines = rows.map(
    (r) =>
      `- ${r.desired_date} [${r.status}] ${r.title} ${r.stl_filename} id=${r.id}`
  );
  return { text: `3D印刷予約（${rows.length} 件）:\n${lines.join("\n")}`, files: [] };
}

async function runSimList(
  db: D1Database,
  user: SessionUser
): Promise<ToolRunResult> {
  await requireApp(db, user.id, SIM_APP_SLUG);
  const [reservations, fds, of] = await Promise.all([
    getSimReservations(db, user.id, getTodayJst()),
    listFdsRequestsForUser(db, user.id, 20),
    listOpenfoamRequestsForUser(db, user.id, 20),
  ]);
  const resLines = reservations.map(
    (r) => `- 予約 ${r.desired_date} [${r.status}] ${r.title} id=${r.id}`
  );
  const fdsLines = fds.map(
    (r) => `- FDS [${r.status}] ${r.title} ${r.input_filename} id=${r.id}`
  );
  const ofLines = of.map(
    (r) => `- OpenFOAM [${r.status}] ${r.title} ${r.input_filename} id=${r.id}`
  );
  return {
    text: [
      `シミュレーション予約: ${resLines.length ? resLines.join("\n") : "なし"}`,
      `FDS 依頼: ${fdsLines.length ? fdsLines.join("\n") : "なし"}`,
      `OpenFOAM 依頼: ${ofLines.length ? ofLines.join("\n") : "なし"}`,
    ].join("\n"),
    files: [],
  };
}

async function runTpList(
  db: D1Database,
  user: SessionUser
): Promise<ToolRunResult> {
  await requireApp(db, user.id, THIRD_PARTY_APP_SLUG);
  const projects = await listMyProjects(db, user.id);
  if (!projects.length) return { text: "サードパーティのプロジェクトはありません。", files: [] };
  const lines = projects.map(
    (p) =>
      `- [${p.status}] ${p.title} phase=${p.workflow_phase ?? "-"} slug=${p.slug} id=${p.id}`
  );
  return { text: `サードパーティ（${projects.length} 件）:\n${lines.join("\n")}`, files: [] };
}

async function runWebList(
  env: Env,
  db: D1Database,
  user: SessionUser
): Promise<ToolRunResult> {
  await requireApp(db, user.id, WEBSITE_PUBLISH_APP_SLUG);
  const sites = await listUserWebSites(db, getFiles(env), user.id);
  if (!sites.length) return { text: "公開サイトはありません。", files: [] };
  const lines = sites.map(
    (s) =>
      `- ${s.title} ${buildRunaPublicWebUrl(env, s.path_slug)} [${s.status}] id=${s.id}`
  );
  return { text: `ウェブサイト（${sites.length} 件）:\n${lines.join("\n")}`, files: [] };
}

async function runWebCreateSite(
  env: Env,
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  await requireApp(db, user.id, WEBSITE_PUBLISH_APP_SLUG);

  const title = strArg(args, "title");
  const pathSlug = strArg(args, "path_slug");
  if (!title || !pathSlug) {
    return { text: "title と path_slug が必要です", files: [] };
  }

  const site = await createWebSite(db, user.id, title, pathSlug);
  const count = await db
    .prepare("SELECT COUNT(*) AS n FROM web_sites WHERE owner_user_id = ?")
    .bind(user.id)
    .first<{ n: number }>();
  const remaining = Math.max(0, MAX_SITES_PER_USER - (count?.n ?? 0));

  return {
    text:
      `サイトを作成しました。\n` +
      `タイトル: ${site.title}\n` +
      `公開 URL: ${buildRunaPublicWebUrl(env, site.path_slug)}\n` +
      `site_id: ${site.id}\n` +
      `残り作成可能: ${remaining} 件`,
    files: [],
  };
}

async function runWebWriteFile(
  env: Env,
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  await requireApp(db, user.id, WEBSITE_PUBLISH_APP_SLUG);

  const siteId = strArg(args, "site_id");
  const path = strArg(args, "path");
  const content = typeof args.content === "string" ? args.content : "";
  if (!siteId || !path) {
    return { text: "site_id と path が必要です", files: [] };
  }

  const site = await getOwnedWebSite(db, user.id, siteId);
  if (!site) return { text: "サイトが見つかりません", files: [] };

  const result = await writeSiteFileText(env, db, site, path, content);
  return {
    text:
      `サイトにファイルを保存しました: ${result.path} (${result.size} bytes)\n` +
      `公開 URL: ${buildRunaPublicWebUrl(env, site.path_slug, result.path)}`,
    files: [],
    siteFileUpdate: {
      siteId: site.id,
      path: result.path,
      content,
    },
  };
}

async function runWebListSiteFiles(
  env: Env,
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  await requireApp(db, user.id, WEBSITE_PUBLISH_APP_SLUG);

  const siteId = strArg(args, "site_id");
  if (!siteId) return { text: "site_id が必要です", files: [] };

  const site = await getOwnedWebSite(db, user.id, siteId);
  if (!site) return { text: "サイトが見つかりません", files: [] };

  const files = await listSiteFiles(getFiles(env), site.r2_prefix);
  if (!files.length) {
    return { text: `サイト ${site.title} にはファイルがありません`, files: [] };
  }

  const lines = files.map(
    (file) => `- ${file.path} (${file.size} bytes)`
  );
  const hasIndex = files.some((file) => file.path === "index.html");

  return {
    text:
      `サイト ${site.title}（${buildRunaPublicWebUrl(env, site.path_slug)}）のファイル:\n` +
      `${lines.join("\n")}\n` +
      `index.html: ${hasIndex ? "あり（公開可能）" : "なし（追加が必要）"}`,
    files: [],
  };
}

async function runWebImportFromStorage(
  env: Env,
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  await requireApp(db, user.id, WEBSITE_PUBLISH_APP_SLUG);
  await requireApp(db, user.id, STORAGE_APP_SLUG);

  const siteId = strArg(args, "site_id");
  const storagePaths = pathsArg(args, "storage_paths");
  const destPrefix = strArg(args, "dest_prefix");
  if (!siteId) return { text: "site_id が必要です", files: [] };
  if (!storagePaths.length) {
    return { text: "storage_paths を指定してください", files: [] };
  }

  const site = await getOwnedWebSite(db, user.id, siteId);
  if (!site) return { text: "サイトが見つかりません", files: [] };

  const result = await importStorageFilesToWebSite(
    env,
    db,
    user,
    site,
    storagePaths,
    destPrefix
  );

  const importedLines = result.imported
    .map((file) => `- ${file.storage_path} → ${file.site_path} (${file.size} bytes)`)
    .join("\n");
  const skippedLines = result.skipped.length
    ? `\nスキップ:\n${result.skipped.map((line) => `- ${line}`).join("\n")}`
    : "";

  return {
    text:
      `${result.imported.length} 件をサイトへ取り込みました。\n` +
      `公開 URL: ${buildRunaPublicWebUrl(env, site.path_slug)}\n` +
      `${importedLines}${skippedLines}`,
    files: [],
  };
}

async function runExcalidrawList(
  db: D1Database,
  user: SessionUser
): Promise<ToolRunResult> {
  await requireApp(db, user.id, EXCALIDRAW_APP_SLUG);
  const dummy = new Request("https://s.mmh-virtual.jp/");
  const notes = await listNotes(db, user.id, dummy);
  if (!notes.length) return { text: "ホワイトボードのノートはありません。", files: [] };
  const lines = notes.map((n) => `- ${n.title} id=${n.id}`);
  return { text: `ホワイトボード（${notes.length} 件）:\n${lines.join("\n")}`, files: [] };
}

async function runDesignList(
  db: D1Database,
  user: SessionUser
): Promise<ToolRunResult> {
  await requireApp(db, user.id, DESIGN_APP_SLUG);
  const projects = await listDesignProjects(db, user.id);
  if (!projects.length) return { text: "設計プロジェクトはありません。", files: [] };
  const lines = projects.map((p) => `- ${p.title} id=${p.id} versions=${p.version_count}`);
  return { text: `設計（${projects.length} 件）:\n${lines.join("\n")}`, files: [] };
}

async function runImageConvert(
  env: Env,
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  await requireApp(db, user.id, IMAGE_CONVERTER_APP_SLUG);
  await requireApp(db, user.id, STORAGE_APP_SLUG);

  const sourcePath = strArg(args, "source_path");
  if (!sourcePath) return { text: "source_path が必要です", files: [] };

  const format =
    parseServerOutputFormat(strArg(args, "format") || "jpeg") ?? "jpeg";
  const quality = Math.min(100, Math.max(40, Math.floor(numArg(args, "quality", 85))));

  const parsed = parseLogicalPath(sourcePath);
  if (!parsed || !parsed.relativePath) {
    return { text: "source_path が不正です", files: [] };
  }

  const auth = await authorizeStoragePath(env, db, user, sourcePath, "read", false);
  if (typeof auth === "string") return { text: auth, files: [] };

  const filename = parsed.relativePath.split("/").pop() ?? "image";
  if (!isServerConvertFile(filename)) {
    return {
      text: "この形式はサーバー変換できません（HEIC/TIFF/RAW のみ）。JPEG 等は画像変換アプリで処理してください。",
      files: [],
    };
  }

  if (!env.IMAGE_CONVERTER) {
    return { text: "画像変換 Worker が未設定です", files: [] };
  }

  const bucket = getFiles(env);
  const obj = await bucket.get(
    toR2Key(parsed.rootType, parsed.rootKey, parsed.relativePath)
  );
  if (!obj) return { text: "ファイルが見つかりません", files: [] };

  const srcBytes = await obj.arrayBuffer();
  const form = new FormData();
  form.append("file", new File([srcBytes], filename));
  form.append("format", format);
  form.append("quality", String(quality));
  form.append("maxEdge", "0");

  const headers = new Headers();
  const secret = env.IMAGE_CONVERTER_WORKER_SECRET?.trim();
  if (secret) headers.set("X-Image-Converter-Secret", secret);

  const workerResponse = await env.IMAGE_CONVERTER.fetch(
    new Request("https://image-converter/convert", {
      method: "POST",
      headers,
      body: form,
    })
  );
  if (!workerResponse.ok) {
    let message = "変換に失敗しました";
    try {
      const data = (await workerResponse.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      /* ignore */
    }
    return { text: message, files: [] };
  }

  const outBytes = await workerResponse.arrayBuffer();
  const ext = format === "jpeg" ? "jpg" : format;
  let destPath = strArg(args, "dest_path");
  if (!destPath) {
    const dir = parsed.relativePath.includes("/")
      ? parsed.relativePath.slice(0, parsed.relativePath.lastIndexOf("/"))
      : "";
    const base = filename.replace(/\.[^.]+$/, "");
    const rel = dir ? `${dir}/${base}.${ext}` : `${base}.${ext}`;
    destPath = `${parsed.rootType === "user" ? "u" : "g"}/${parsed.rootKey}/${rel}`;
  }

  const destParsed = parseLogicalPath(destPath);
  if (!destParsed || !destParsed.relativePath) {
    return { text: "dest_path が不正です", files: [] };
  }

  const destDir = destParsed.relativePath.includes("/")
    ? destParsed.relativePath.slice(0, destParsed.relativePath.lastIndexOf("/"))
    : "";
  const destName = sanitizeFilename(
    destParsed.relativePath.split("/").pop() ?? `converted.${ext}`
  );

  const existing = await bucket.head(
    toR2Key(destParsed.rootType, destParsed.rootKey, destParsed.relativePath)
  );

  if (existing) {
    const writeAuth = await authorizeStoragePath(
      env,
      db,
      user,
      destPath,
      "write",
      false
    );
    if (typeof writeAuth === "string") return { text: writeAuth, files: [] };
    const root = await resolveRootForPath(db, destParsed.rootType, destParsed.rootKey);
    if (!root) return { text: "ストレージルートが見つかりません", files: [] };
    const oldSize = existing.size;
    const delta = outBytes.byteLength - oldSize;
    if (delta > 0 && !(await canAllocateStorageBytes(db, root, user.id, delta))) {
      return { text: "割り当て領域不足です", files: [] };
    }
    await bucket.put(
      toR2Key(destParsed.rootType, destParsed.rootKey, destParsed.relativePath),
      outBytes,
      { httpMetadata: { contentType: getServerOutputMime(format) } }
    );
    const perms = await resolveEffectivePermissions(
      env,
      destParsed.rootType,
      destParsed.rootKey,
      destParsed.relativePath,
      false
    );
    await writeMetaJson(
      bucket,
      fileMetaKey(destParsed.rootType, destParsed.rootKey, destParsed.relativePath),
      createFileMeta(user.username, outBytes.byteLength, perms)
    );
    if (delta > 0) await addUsedBytes(db, root.id, delta);
    else if (delta < 0) await subtractUsedBytes(db, root.id, -delta);
  } else {
    const init = await initiateStorageUpload(
      env,
      db,
      user,
      destParsed.rootType,
      destParsed.rootKey,
      destDir,
      destName,
      outBytes.byteLength
    );
    if (init.mode !== "simple") {
      return { text: "変換結果が大きすぎます", files: [] };
    }
    const uploaded = await simpleStorageUpload(env, db, user, init.sessionId, outBytes);
    destPath = uploaded.path;
  }

  const item: RunaFileItem = {
    name: destPath.split("/").pop() ?? destPath,
    path: destPath,
    type: "file",
    sizeBytes: outBytes.byteLength,
    updatedAt: Date.now(),
  };
  return {
    text: `変換しました: ${sourcePath} → ${destPath} (${format}, ${outBytes.byteLength} bytes)`,
    files: [item],
  };
}
