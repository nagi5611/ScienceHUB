/**
 * 設計アプリ — プロジェクト・バージョン管理
 */

import type { SessionUser } from "./types";
import { createId, now } from "./types";

export const DESIGN_APP_SLUG = "design";

export interface DesignElement {
  id: string;
  type: "line" | "rect" | "ellipse" | "polyline";
  stroke: string;
  strokeWidth: number;
  fill?: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
  points?: Array<{ x: number; y: number }>;
  closed?: boolean;
}

export interface DesignScene {
  version: number;
  width: number;
  height: number;
  elements: DesignElement[];
}

export interface ChangeLogEntry {
  action: "add" | "remove" | "modify" | "restore" | "import";
  elementType?: string;
  elementId?: string;
  detail?: string;
}

export interface DesignVersionSummary {
  id: string;
  version_number: number;
  thumbnail_data: string | null;
  change_log: ChangeLogEntry[];
  is_autosave: boolean;
  created_at: number;
}

export interface DesignProjectSummary {
  id: string;
  title: string;
  created_at: number;
  updated_at: number;
  version_count: number;
  thumbnail_data: string | null;
  cloud_storage_path: string | null;
}

export interface DesignProjectDetail extends DesignProjectSummary {
  scene: DesignScene;
  current_version_id: string | null;
}

interface ProjectRow {
  id: string;
  owner_user_id: string;
  title: string;
  current_version_id: string | null;
  cloud_storage_path: string | null;
  created_at: number;
  updated_at: number;
}

interface VersionRow {
  id: string;
  project_id: string;
  version_number: number;
  scene_json: string;
  thumbnail_data: string | null;
  change_log_json: string;
  is_autosave: number;
  created_at: number;
}

const DEFAULT_SCENE: DesignScene = {
  version: 1,
  width: 2000,
  height: 1500,
  elements: [],
};

const MAX_AUTOSAVE_VERSIONS = 80;

/** 空のシーン */
export function emptyScene(): DesignScene {
  return { ...DEFAULT_SCENE, elements: [] };
}

/** scene_json をパース */
export function parseScene(raw: string): DesignScene {
  try {
    const data = JSON.parse(raw) as Partial<DesignScene>;
    return normalizeScene(data);
  } catch {
    return emptyScene();
  }
}

/** シーンを正規化 */
export function normalizeScene(input: unknown): DesignScene {
  if (!input || typeof input !== "object") return emptyScene();
  const data = input as Partial<DesignScene>;
  return {
    version: typeof data.version === "number" ? data.version : 1,
    width: typeof data.width === "number" ? data.width : DEFAULT_SCENE.width,
    height: typeof data.height === "number" ? data.height : DEFAULT_SCENE.height,
    elements: Array.isArray(data.elements)
      ? (data.elements as DesignElement[]).filter(
          (e) => e && typeof e.id === "string" && typeof e.type === "string"
        )
      : [],
  };
}

/** シーンを JSON 文字列化 */
export function serializeScene(scene: DesignScene): string {
  return JSON.stringify(normalizeScene(scene));
}

/** 変更ログをパース */
export function parseChangeLog(raw: string): ChangeLogEntry[] {
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? (data as ChangeLogEntry[]) : [];
  } catch {
    return [];
  }
}

/** 前後のシーンから変更ログを生成 */
export function computeChangeLog(
  prev: DesignScene,
  next: DesignScene,
  action?: ChangeLogEntry["action"]
): ChangeLogEntry[] {
  if (action === "restore") {
    return [{ action: "restore", detail: "過去バージョンから復元" }];
  }
  if (action === "import") {
    return [{ action: "import", detail: "ファイルから読み込み" }];
  }

  const prevMap = new Map(prev.elements.map((e) => [e.id, e]));
  const nextMap = new Map(next.elements.map((e) => [e.id, e]));
  const entries: ChangeLogEntry[] = [];

  for (const el of next.elements) {
    if (!prevMap.has(el.id)) {
      entries.push({ action: "add", elementType: el.type, elementId: el.id });
    } else if (JSON.stringify(prevMap.get(el.id)) !== JSON.stringify(el)) {
      entries.push({
        action: "modify",
        elementType: el.type,
        elementId: el.id,
      });
    }
  }

  for (const el of prev.elements) {
    if (!nextMap.has(el.id)) {
      entries.push({ action: "remove", elementType: el.type, elementId: el.id });
    }
  }

  if (entries.length === 0) {
    entries.push({ action: "modify", detail: "変更なし（自動保存）" });
  }

  return entries;
}

/** プロジェクトの所有権を確認 */
async function getOwnedProject(
  db: D1Database,
  projectId: string,
  userId: string
): Promise<ProjectRow | null> {
  const row = await db
    .prepare(
      "SELECT id, owner_user_id, title, current_version_id, cloud_storage_path, created_at, updated_at FROM design_projects WHERE id = ?"
    )
    .bind(projectId)
    .first<ProjectRow>();
  if (!row || row.owner_user_id !== userId) return null;
  return row;
}

/** バージョン行をサマリに変換 */
function versionToSummary(row: VersionRow): DesignVersionSummary {
  return {
    id: row.id,
    version_number: row.version_number,
    thumbnail_data: row.thumbnail_data,
    change_log: parseChangeLog(row.change_log_json),
    is_autosave: row.is_autosave === 1,
    created_at: row.created_at,
  };
}

/** 古い自動保存バージョンを整理 */
async function pruneAutosaveVersions(
  db: D1Database,
  projectId: string
): Promise<void> {
  const rows = await db
    .prepare(
      `SELECT id FROM design_versions
       WHERE project_id = ? AND is_autosave = 1
       ORDER BY version_number DESC`
    )
    .bind(projectId)
    .all<{ id: string }>();

  const ids = rows.results ?? [];
  if (ids.length <= MAX_AUTOSAVE_VERSIONS) return;

  const toDelete = ids.slice(MAX_AUTOSAVE_VERSIONS).map((r) => r.id);
  for (const id of toDelete) {
    await db.prepare("DELETE FROM design_versions WHERE id = ?").bind(id).run();
  }
}

/** プロジェクト一覧 */
export async function listProjects(
  db: D1Database,
  userId: string
): Promise<DesignProjectSummary[]> {
  const rows = await db
    .prepare(
      `SELECT p.id, p.title, p.created_at, p.updated_at, p.cloud_storage_path,
              (SELECT COUNT(*) FROM design_versions v WHERE v.project_id = p.id) AS version_count,
              (SELECT v.thumbnail_data FROM design_versions v
               WHERE v.id = p.current_version_id) AS thumbnail_data
       FROM design_projects p
       WHERE p.owner_user_id = ?
       ORDER BY p.updated_at DESC`
    )
    .bind(userId)
    .all<DesignProjectSummary>();

  return (rows.results ?? []).map((r) => ({
    ...r,
    version_count: Number(r.version_count) || 0,
  }));
}

/** プロジェクト作成 */
export async function createProject(
  db: D1Database,
  user: SessionUser,
  title?: string
): Promise<DesignProjectDetail> {
  const ts = now();
  const projectId = createId("dproj");
  const versionId = createId("dver");
  const scene = emptyScene();
  const changeLog: ChangeLogEntry[] = [{ action: "add", detail: "プロジェクト作成" }];

  await db
    .prepare(
      `INSERT INTO design_projects (id, owner_user_id, title, current_version_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(
      projectId,
      user.id,
      (title ?? "無題の設計").trim() || "無題の設計",
      versionId,
      ts,
      ts
    )
    .run();

  await db
    .prepare(
      `INSERT INTO design_versions
       (id, project_id, version_number, scene_json, thumbnail_data, change_log_json, is_autosave, created_at)
       VALUES (?, ?, 1, ?, NULL, ?, 0, ?)`
    )
    .bind(
      versionId,
      projectId,
      serializeScene(scene),
      JSON.stringify(changeLog),
      ts
    )
    .run();

  return {
    id: projectId,
    title: (title ?? "無題の設計").trim() || "無題の設計",
    created_at: ts,
    updated_at: ts,
    version_count: 1,
    thumbnail_data: null,
    scene,
    current_version_id: versionId,
    cloud_storage_path: null,
  };
}

/** プロジェクト詳細（現在のシーン付き） */
export async function getProject(
  db: D1Database,
  userId: string,
  projectId: string
): Promise<DesignProjectDetail | null> {
  const project = await getOwnedProject(db, projectId, userId);
  if (!project) return null;

  let scene = emptyScene();
  let thumbnail: string | null = null;

  if (project.current_version_id) {
    const ver = await db
      .prepare(
        "SELECT scene_json, thumbnail_data FROM design_versions WHERE id = ?"
      )
      .bind(project.current_version_id)
      .first<{ scene_json: string; thumbnail_data: string | null }>();
    if (ver) {
      scene = parseScene(ver.scene_json);
      thumbnail = ver.thumbnail_data;
    }
  }

  const countRow = await db
    .prepare("SELECT COUNT(*) AS c FROM design_versions WHERE project_id = ?")
    .bind(projectId)
    .first<{ c: number }>();

  return {
    id: project.id,
    title: project.title,
    created_at: project.created_at,
    updated_at: project.updated_at,
    version_count: Number(countRow?.c) || 0,
    thumbnail_data: thumbnail,
    scene,
    current_version_id: project.current_version_id,
    cloud_storage_path: project.cloud_storage_path,
  };
}

/** プロジェクト設定を更新 */
export async function updateProject(
  db: D1Database,
  userId: string,
  projectId: string,
  input: { title?: string; cloud_storage_path?: string | null }
): Promise<{
  title: string;
  cloud_storage_path: string | null;
  updated_at: number;
} | null> {
  const project = await getOwnedProject(db, projectId, userId);
  if (!project) return null;

  const ts = now();
  const title =
    input.title !== undefined
      ? input.title.trim() || "無題の設計"
      : project.title;
  const cloudPath =
    input.cloud_storage_path !== undefined
      ? input.cloud_storage_path
      : project.cloud_storage_path;

  await db
    .prepare(
      "UPDATE design_projects SET title = ?, cloud_storage_path = ?, updated_at = ? WHERE id = ?"
    )
    .bind(title, cloudPath, ts, projectId)
    .run();

  return { title, cloud_storage_path: cloudPath, updated_at: ts };
}

/** タイトル更新 */
export async function updateProjectTitle(
  db: D1Database,
  userId: string,
  projectId: string,
  title: string
): Promise<{ title: string; updated_at: number } | null> {
  const result = await updateProject(db, userId, projectId, { title });
  if (!result) return null;
  return { title: result.title, updated_at: result.updated_at };
}

/** プロジェクト削除 */
export async function deleteProject(
  db: D1Database,
  userId: string,
  projectId: string
): Promise<boolean> {
  const project = await getOwnedProject(db, projectId, userId);
  if (!project) return false;
  await db.prepare("DELETE FROM design_projects WHERE id = ?").bind(projectId).run();
  return true;
}

/** 新バージョンを保存 */
export async function saveVersion(
  db: D1Database,
  userId: string,
  projectId: string,
  input: {
    scene: unknown;
    thumbnail_data?: string | null;
    is_autosave?: boolean;
    change_action?: ChangeLogEntry["action"];
  }
): Promise<DesignVersionSummary | null> {
  const project = await getOwnedProject(db, projectId, userId);
  if (!project) return null;

  const newScene = normalizeScene(input.scene);
  const ts = now();

  let prevScene = emptyScene();
  if (project.current_version_id) {
    const prev = await db
      .prepare("SELECT scene_json FROM design_versions WHERE id = ?")
      .bind(project.current_version_id)
      .first<{ scene_json: string }>();
    if (prev) prevScene = parseScene(prev.scene_json);
  }

  const maxRow = await db
    .prepare(
      "SELECT MAX(version_number) AS max_num FROM design_versions WHERE project_id = ?"
    )
    .bind(projectId)
    .first<{ max_num: number | null }>();

  const versionNumber = (Number(maxRow?.max_num) || 0) + 1;
  const versionId = createId("dver");
  const isAutosave = input.is_autosave !== false ? 1 : 0;
  const changeLog = computeChangeLog(
    prevScene,
    newScene,
    input.change_action
  );

  const thumbnail =
    input.thumbnail_data && input.thumbnail_data.length < 500_000
      ? input.thumbnail_data
      : null;

  await db
    .prepare(
      `INSERT INTO design_versions
       (id, project_id, version_number, scene_json, thumbnail_data, change_log_json, is_autosave, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      versionId,
      projectId,
      versionNumber,
      serializeScene(newScene),
      thumbnail,
      JSON.stringify(changeLog),
      isAutosave,
      ts
    )
    .run();

  await db
    .prepare(
      "UPDATE design_projects SET current_version_id = ?, updated_at = ? WHERE id = ?"
    )
    .bind(versionId, ts, projectId)
    .run();

  if (isAutosave) {
    await pruneAutosaveVersions(db, projectId);
  }

  return {
    id: versionId,
    version_number: versionNumber,
    thumbnail_data: thumbnail,
    change_log: changeLog,
    is_autosave: isAutosave === 1,
    created_at: ts,
  };
}

/** バージョン一覧 */
export async function listVersions(
  db: D1Database,
  userId: string,
  projectId: string
): Promise<DesignVersionSummary[] | null> {
  const project = await getOwnedProject(db, projectId, userId);
  if (!project) return null;

  const rows = await db
    .prepare(
      `SELECT id, project_id, version_number, scene_json, thumbnail_data,
              change_log_json, is_autosave, created_at
       FROM design_versions
       WHERE project_id = ?
       ORDER BY version_number DESC`
    )
    .bind(projectId)
    .all<VersionRow>();

  return (rows.results ?? []).map(versionToSummary);
}

/** 特定バージョンのシーン取得 */
export async function getVersionScene(
  db: D1Database,
  userId: string,
  projectId: string,
  versionId: string
): Promise<{ version: DesignVersionSummary; scene: DesignScene } | null> {
  const project = await getOwnedProject(db, projectId, userId);
  if (!project) return null;

  const row = await db
    .prepare(
      `SELECT id, project_id, version_number, scene_json, thumbnail_data,
              change_log_json, is_autosave, created_at
       FROM design_versions
       WHERE id = ? AND project_id = ?`
    )
    .bind(versionId, projectId)
    .first<VersionRow>();

  if (!row) return null;

  return {
    version: versionToSummary(row),
    scene: parseScene(row.scene_json),
  };
}

/** バージョンから復元（新バージョンとして保存） */
export async function restoreVersion(
  db: D1Database,
  userId: string,
  projectId: string,
  versionId: string,
  thumbnail_data?: string | null
): Promise<DesignVersionSummary | null> {
  const data = await getVersionScene(db, userId, projectId, versionId);
  if (!data) return null;

  return saveVersion(db, userId, projectId, {
    scene: data.scene,
    thumbnail_data,
    is_autosave: false,
    change_action: "restore",
  });
}
