/**
 * サードパーティ — プロジェクト・公開・スタブチャット
 */

import type { Env, SessionUser } from "./types";
import { createId, now } from "./types";
import { normalizeSlug } from "./auth";
import {
  canUserAccessApp,
  createApp,
  getAppById,
  getAppBySlug,
  setAppAccessRules,
  updateApp,
} from "./apps";
import { getUserGroupMemberships } from "./groups";
import {
  allocateDirName,
  artifactExists,
  getArtifact,
  reallocateDirNameIfDraft,
  ARTIFACT_PLAN,
  ARTIFACT_REQUIREMENTS,
} from "./third-party/artifacts";
import {
  runTpGeminiChat,
  runTpStubFallback,
  type GeminiChatResult,
} from "./third-party/gemini-pipeline";
import type { StructuredForm, TpWorkflowPhase } from "./third-party/schemas";
import { EMPTY_PLACEHOLDER_HTML } from "./third-party/stub-chat";

export const THIRD_PARTY_APP_SLUG = "third-party";

const INDEX_KEY = "index.html";
const RESERVED_SLUGS = new Set([
  "third-party",
  "design",
  "image-editor",
  "cloud-storage",
]);

export interface TpProjectRow {
  id: string;
  owner_user_id: string;
  title: string;
  slug: string;
  description: string | null;
  icon_emoji: string | null;
  color: string;
  status: string;
  visibility_group_id: string | null;
  hub_app_id: string | null;
  r2_prefix: string;
  dir_name: string;
  workflow_phase: string;
  published_at: number | null;
  created_at: number;
  updated_at: number;
}

const PROJECT_SELECT =
  "id, owner_user_id, title, slug, description, icon_emoji, color, status," +
  " visibility_group_id, hub_app_id, r2_prefix, dir_name, workflow_phase," +
  " published_at, created_at, updated_at";

export interface TpProjectSummary {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  icon_emoji: string | null;
  color: string;
  status: "draft" | "published";
  published_at: number | null;
  created_at: number;
  updated_at: number;
  workflow_phase?: TpWorkflowPhase;
  dir_name?: string;
  has_requirements?: boolean;
  has_plan?: boolean;
}

export interface TpGalleryItem {
  slug: string;
  title: string;
  description: string | null;
  icon_emoji: string | null;
  color: string;
  owner_display_name: string;
  published_at: number;
  updated_at: number;
  view_href: string;
}

export interface TpChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: number;
}

function toSummary(row: TpProjectRow): TpProjectSummary {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    icon_emoji: row.icon_emoji,
    color: row.color ?? "#F38020",
    status: row.status === "published" ? "published" : "draft",
    published_at: row.published_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    workflow_phase: row.workflow_phase as TpWorkflowPhase,
    dir_name: row.dir_name,
  };
}

function indexR2Key(prefix: string): string {
  const p = prefix.endsWith("/") ? prefix : `${prefix}/`;
  return `${p}${INDEX_KEY}`;
}

/** R2 に index.html を保存 */
export async function putProjectHtml(
  bucket: R2Bucket,
  r2Prefix: string,
  html: string
): Promise<void> {
  await bucket.put(indexR2Key(r2Prefix), html, {
    httpMetadata: { contentType: "text/html; charset=utf-8" },
  });
}

/** R2 から index.html を取得 */
export async function getProjectHtml(
  bucket: R2Bucket,
  r2Prefix: string
): Promise<string | null> {
  const obj = await bucket.get(indexR2Key(r2Prefix));
  if (!obj) return null;
  return await obj.text();
}

/** ユニーク slug（tp_ プレフィックス） */
async function allocateProjectSlug(
  db: D1Database,
  baseTitle: string
): Promise<string> {
  const base = normalizeSlug(baseTitle || "app") || "app";
  let candidate = `tp_${base}`.slice(0, 40);
  for (let i = 0; i < 20; i++) {
    const slug = i === 0 ? candidate : `${candidate.slice(0, 36)}_${i}`;
    const dupTp = await db
      .prepare("SELECT id FROM tp_projects WHERE slug = ?")
      .bind(slug)
      .first();
    const dupHub = await getAppBySlug(db, slug);
    if (!dupTp && !dupHub && !RESERVED_SLUGS.has(slug.replace(/^tp_/, ""))) {
      return slug;
    }
  }
  return `tp_${createId("s").slice(3, 15)}`;
}

/** 自分のプロジェクト一覧 */
export async function listMyProjects(
  db: D1Database,
  userId: string
): Promise<TpProjectSummary[]> {
  const result = await db
    .prepare(
      `SELECT ${PROJECT_SELECT}
       FROM tp_projects WHERE owner_user_id = ?
       ORDER BY updated_at DESC`
    )
    .bind(userId)
    .all<TpProjectRow>();

  return (result.results ?? []).map(toSummary);
}

/** プロジェクト取得（所有者のみ） */
export async function getOwnedProject(
  db: D1Database,
  userId: string,
  projectId: string
): Promise<TpProjectRow | null> {
  const row = await db
    .prepare(
      `SELECT ${PROJECT_SELECT}
       FROM tp_projects WHERE id = ? AND owner_user_id = ?`
    )
    .bind(projectId, userId)
    .first<TpProjectRow>();

  return row ?? null;
}

/** slug で公開プロジェクト取得 */
export async function getPublishedBySlug(
  db: D1Database,
  slug: string
): Promise<TpProjectRow | null> {
  const row = await db
    .prepare(
      `SELECT ${PROJECT_SELECT}
       FROM tp_projects WHERE slug = ? AND status = 'published'`
    )
    .bind(slug)
    .first<TpProjectRow>();

  return row ?? null;
}

/** チャット履歴 */
export async function listChatMessages(
  db: D1Database,
  projectId: string
): Promise<TpChatMessage[]> {
  const result = await db
    .prepare(
      `SELECT id, role, content, created_at FROM tp_chat_messages
       WHERE project_id = ? ORDER BY created_at ASC`
    )
    .bind(projectId)
    .all<{
      id: string;
      role: string;
      content: string;
      created_at: number;
    }>();

  return (result.results ?? []).map((r) => ({
    id: r.id,
    role: r.role === "assistant" ? "assistant" : "user",
    content: r.content,
    created_at: r.created_at,
  }));
}

/** 新規プロジェクト */
export async function createTpProject(
  db: D1Database,
  bucket: R2Bucket,
  user: SessionUser,
  title?: string
): Promise<TpProjectSummary> {
  const trimmedTitle = (title?.trim() || "無題のアプリ").slice(0, 120);
  const id = createId("tp");
  const slug = await allocateProjectSlug(db, trimmedTitle);
  const dirName = await allocateDirName(db, trimmedTitle);
  const r2Prefix = `third-party/${dirName}/`;
  const timestamp = now();

  await db
    .prepare(
      `INSERT INTO tp_projects (
        id, owner_user_id, title, slug, description, icon_emoji, color, status,
        visibility_group_id, hub_app_id, r2_prefix, dir_name, workflow_phase,
        context_summary, pending_form_json, review_passed, implement_attempts,
        review_loop_count, awaiting_implement_confirm, published_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, NULL, '🧩', '#F38020', 'draft', NULL, NULL, ?, ?, 'discovery',
        NULL, NULL, NULL, 0, 0, 0, NULL, ?, ?)`
    )
    .bind(
      id,
      user.id,
      trimmedTitle,
      slug,
      r2Prefix,
      dirName,
      timestamp,
      timestamp
    )
    .run();

  await putProjectHtml(bucket, r2Prefix, EMPTY_PLACEHOLDER_HTML);

  const welcome =
    "こんにちは。作りたいアプリを教えてください。目的や誰が使うかを話すと、こちらから質問フォームを出します。";
  await insertChatMessage(db, id, "assistant", welcome);

  const row = await getOwnedProject(db, user.id, id);
  if (!row) throw new Error("プロジェクトの作成に失敗しました");
  return toSummary(row);
}

async function insertChatMessage(
  db: D1Database,
  projectId: string,
  role: "user" | "assistant",
  content: string
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO tp_chat_messages (id, project_id, role, content, created_at)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(createId("tpmsg"), projectId, role, content, now())
    .run();
}

/** プロジェクト更新 */
export async function updateTpProject(
  db: D1Database,
  userId: string,
  projectId: string,
  input: {
    title?: string;
    description?: string | null;
    icon_emoji?: string | null;
    color?: string;
  }
): Promise<TpProjectSummary | null> {
  const project = await getOwnedProject(db, userId, projectId);
  if (!project) return null;

  const updates: string[] = [];
  const values: (string | number | null)[] = [];

  if (input.title !== undefined) {
    const t = input.title.trim();
    if (!t) throw new Error("タイトルを入力してください");
    updates.push("title = ?");
    values.push(t.slice(0, 120));
    await reallocateDirNameIfDraft(db, projectId, t, project.status);
  }
  if (input.description !== undefined) {
    updates.push("description = ?");
    values.push(input.description?.trim() || null);
  }
  if (input.icon_emoji !== undefined) {
    updates.push("icon_emoji = ?");
    values.push(input.icon_emoji?.trim() || null);
  }
  if (input.color !== undefined) {
    updates.push("color = ?");
    values.push(input.color.trim() || "#F38020");
  }

  if (updates.length === 0) return toSummary(project);

  updates.push("updated_at = ?");
  values.push(now());
  values.push(projectId);

  await db
    .prepare(`UPDATE tp_projects SET ${updates.join(", ")} WHERE id = ?`)
    .bind(...values)
    .run();

  const row = await getOwnedProject(db, userId, projectId);
  return row ? toSummary(row) : null;
}

/** プロジェクト削除 */
export async function deleteTpProject(
  db: D1Database,
  bucket: R2Bucket,
  userId: string,
  projectId: string
): Promise<boolean> {
  const project = await getOwnedProject(db, userId, projectId);
  if (!project) return false;

  if (project.hub_app_id) {
    await db
      .prepare("DELETE FROM hub_apps WHERE id = ?")
      .bind(project.hub_app_id)
      .run();
  }

  await bucket.delete(indexR2Key(project.r2_prefix));
  await db.prepare("DELETE FROM tp_projects WHERE id = ?").bind(projectId).run();
  return true;
}

/** Gemini チャット（スタブフォールバック付き） */
export async function postGeminiChat(
  env: Env,
  db: D1Database,
  bucket: R2Bucket,
  userId: string,
  projectId: string,
  input: {
    message?: string;
    form_responses?: Record<string, string | string[]>;
  }
): Promise<GeminiChatResult | null> {
  const hasKey = env.GEMINI_API_KEY?.trim();
  if (!hasKey) {
    const msg = input.message?.trim() ?? "";
    if (input.form_responses) {
      throw new Error("GEMINI_API_KEY が未設定のためフォーム送信は使えません");
    }
    return await runTpStubFallback(db, bucket, userId, projectId, msg);
  }
  return await runTpGeminiChat(env, db, bucket, userId, projectId, input);
}

/** プロジェクト詳細（アーティファクト有無付き） */
export async function getOwnedProjectDetail(
  db: D1Database,
  bucket: R2Bucket,
  userId: string,
  projectId: string
): Promise<{
  project: TpProjectSummary;
  pending_form: StructuredForm | null;
} | null> {
  const row = await getOwnedProject(db, userId, projectId);
  if (!row) return null;
  const summary = toSummary(row);
  summary.has_requirements = await artifactExists(
    bucket,
    row.dir_name,
    ARTIFACT_REQUIREMENTS
  );
  summary.has_plan = await artifactExists(bucket, row.dir_name, ARTIFACT_PLAN);
  let pending_form: StructuredForm | null = null;
  const pending = await db
    .prepare("SELECT pending_form_json FROM tp_projects WHERE id = ?")
    .bind(projectId)
    .first<{ pending_form_json: string | null }>();
  if (pending?.pending_form_json) {
    try {
      pending_form = JSON.parse(pending.pending_form_json) as StructuredForm;
    } catch {
      pending_form = null;
    }
  }
  return { project: summary, pending_form };
}

/** Markdown アーティファクト取得（所有者のみ） */
export async function getOwnedArtifactText(
  db: D1Database,
  bucket: R2Bucket,
  userId: string,
  projectId: string,
  kind: "requirements" | "plan"
): Promise<string | null> {
  const row = await getOwnedProject(db, userId, projectId);
  if (!row) return null;
  const name =
    kind === "requirements" ? ARTIFACT_REQUIREMENTS : ARTIFACT_PLAN;
  return await getArtifact(bucket, row.dir_name, name);
}

function viewHref(slug: string): string {
  return `/apps/third-party/view/?slug=${encodeURIComponent(slug)}`;
}

/** 公開 */
export async function publishTpProject(
  db: D1Database,
  bucket: R2Bucket,
  userId: string,
  projectId: string,
  groupId: string
): Promise<TpProjectSummary | null> {
  const project = await getOwnedProject(db, userId, projectId);
  if (!project) return null;

  const html = await getProjectHtml(bucket, project.r2_prefix);
  if (!html || html === EMPTY_PLACEHOLDER_HTML) {
    throw new Error(
      "プレビュー用の HTML がまだありません。チャットで実装まで完了してください。"
    );
  }
  if (project.workflow_phase !== "draft_ready") {
    throw new Error(
      "実装が完了していません。チャットでプレビューが表示できるまで進めてください。"
    );
  }

  const memberships = await getUserGroupMemberships(db, userId);
  if (!memberships.some((m) => m.group_id === groupId)) {
    throw new Error("選択したグループに所属していません");
  }

  const group = await db
    .prepare("SELECT id FROM hub_groups WHERE id = ?")
    .bind(groupId)
    .first();
  if (!group) throw new Error("グループが見つかりません");

  const timestamp = now();
  const href = viewHref(project.slug);
  const displayName = project.title;
  const description =
    project.description?.trim() ||
    "ユーザー作成アプリ（サードパーティ）";

  let hubAppId = project.hub_app_id;

  if (hubAppId) {
    await updateApp(db, hubAppId, {
      display_name: displayName,
      description,
      href,
      icon_emoji: project.icon_emoji,
      color: project.color,
    });
    await setAppAccessRules(db, hubAppId, [
      { group_id: groupId, enabled: true, group_role_ids: [] },
    ]);
  } else {
    const hubSlug = project.slug;
    const existingHub = await getAppBySlug(db, hubSlug);
    if (existingHub && existingHub.id !== hubAppId) {
      throw new Error("この公開識別子は既に使用されています");
    }

    const created = await createApp(db, {
      display_name: displayName,
      slug: hubSlug,
      description,
      href,
      icon_emoji: project.icon_emoji ?? "🧩",
      color: project.color,
    });
    if (!created) throw new Error("アプリ登録に失敗しました");
    hubAppId = created.id;
    await setAppAccessRules(db, hubAppId, [
      { group_id: groupId, enabled: true, group_role_ids: [] },
    ]);
  }

  await db
    .prepare(
      `UPDATE tp_projects SET status = 'published', visibility_group_id = ?, hub_app_id = ?,
       published_at = ?, updated_at = ? WHERE id = ?`
    )
    .bind(groupId, hubAppId, timestamp, timestamp, projectId)
    .run();

  const row = await getOwnedProject(db, userId, projectId);
  return row ? toSummary(row) : null;
}

/** ギャラリー（ACL 済み） */
export async function listGallery(
  db: D1Database,
  viewerUserId: string
): Promise<TpGalleryItem[]> {
  const result = await db
    .prepare(
      `SELECT p.slug, p.title, p.description, p.icon_emoji, p.color, p.published_at, p.updated_at,
              p.hub_app_id, u.display_name AS owner_display_name
       FROM tp_projects p
       JOIN users u ON u.id = p.owner_user_id
       WHERE p.status = 'published' AND p.hub_app_id IS NOT NULL
       ORDER BY p.published_at DESC`
    )
    .all<{
      slug: string;
      title: string;
      description: string | null;
      icon_emoji: string | null;
      color: string;
      published_at: number;
      updated_at: number;
      hub_app_id: string;
      owner_display_name: string;
    }>();

  const items: TpGalleryItem[] = [];
  for (const row of result.results ?? []) {
    const hubApp = await getAppById(db, row.hub_app_id);
    if (!hubApp) continue;
    const allowed = await canUserAccessApp(db, viewerUserId, hubApp.slug);
    if (!allowed) continue;
    items.push({
      slug: row.slug,
      title: row.title,
      description: row.description,
      icon_emoji: row.icon_emoji,
      color: row.color ?? "#F38020",
      owner_display_name: row.owner_display_name,
      published_at: row.published_at,
      updated_at: row.updated_at,
      view_href: viewHref(row.slug),
    });
  }
  return items;
}

/** 公開 HTML の閲覧可否 */
export async function canViewPublished(
  db: D1Database,
  viewerUserId: string,
  slug: string
): Promise<TpProjectRow | null> {
  const project = await getPublishedBySlug(db, slug);
  if (!project?.hub_app_id) return null;

  const hubApp = await getAppById(db, project.hub_app_id);
  if (!hubApp) return null;

  const allowed = await canUserAccessApp(db, viewerUserId, hubApp.slug);
  if (!allowed) return null;

  return project;
}

/** プレビュー HTML レスポンス用 CSP */
export function htmlResponse(html: string): Response {
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy":
        "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src 'self' data:; base-uri 'none'; form-action 'none'",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/** 公開用メタ（viewer） */
export async function getPublishedMeta(
  db: D1Database,
  viewerUserId: string,
  slug: string
): Promise<{
  title: string;
  slug: string;
  owner_display_name: string;
} | null> {
  const project = await canViewPublished(db, viewerUserId, slug);
  if (!project) return null;

  const owner = await db
    .prepare("SELECT display_name FROM users WHERE id = ?")
    .bind(project.owner_user_id)
    .first<{ display_name: string }>();

  return {
    title: project.title,
    slug: project.slug,
    owner_display_name: owner?.display_name ?? "ユーザー",
  };
}

/** 公開用グループ一覧（所属のみ） */
export async function listPublishGroups(
  db: D1Database,
  userId: string
): Promise<Array<{ id: string; display_name: string }>> {
  const memberships = await getUserGroupMemberships(db, userId);
  return memberships.map((m) => ({
    id: m.group_id,
    display_name: m.group_display_name,
  }));
}
