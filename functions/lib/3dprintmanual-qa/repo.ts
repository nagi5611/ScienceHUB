/**
 * Q&A D1 操作と API 向け DTO
 */

import type { Env } from "../types";
import { createId, now } from "../types";
import { getDb } from "../db";
import {
  isManualQaDraftKeyForUser,
  manualMediaUrl,
} from "../3dprintmanual-content";
import { getFiles } from "../r2";
import {
  ASKER_DISPLAY_ROLE,
  MAX_QA_ATTACHMENTS,
  MAX_QA_BODY_LEN,
  MAX_QA_TITLE_LEN,
  QA_CATEGORY_IDS,
  QA_LIST_LIMIT,
  QA_MACHINES,
  STAFF_DISPLAY_NAME,
} from "./constants";
import { moderateQaContent } from "./moderation";

export interface QaAttachmentDto {
  id: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
  url: string;
}

export interface QaPostDto {
  id: string;
  by: string;
  role: string;
  date: string;
  text: string;
  kind: "staff" | "asker";
}

export interface QaQuestionListItem {
  id: string;
  cat: string;
  machine: string;
  status: "answered" | "open";
  resolved: boolean;
  pinned: boolean;
  title: string;
  body: string;
  author: string;
  date: string;
  answerCount: number;
}

export interface QaQuestionDetail extends QaQuestionListItem {
  answers: QaPostDto[];
  attachments: QaAttachmentDto[];
  userId: string;
}

type QuestionRow = {
  id: string;
  user_id: string;
  category_id: string;
  machine: string;
  title: string;
  body: string;
  pinned: number;
  resolved: number;
  moderation_status: string;
  created_at: number;
};

/** JST の日付文字列 */
export function formatQaDateJst(ts: number): string {
  return new Date(ts).toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

/** 質問者の表示ラベル */
export async function askerLabelForUser(
  db: D1Database,
  userId: string
): Promise<string> {
  const row = await db
    .prepare("SELECT display_name, homeroom FROM users WHERE id = ?")
    .bind(userId)
    .first<{ display_name: string; homeroom: string | null }>();
  if (!row) return "質問者";
  const hr = row.homeroom?.trim() ?? "";
  if (/^[1-3]/.test(hr)) {
    return `${hr.charAt(0)}年`;
  }
  const name = row.display_name?.trim();
  return name ? name.split(/\s+/)[0] : "質問者";
}

function validateCategory(cat: string): void {
  if (!QA_CATEGORY_IDS.has(cat)) throw new Error("カテゴリが不正です");
}

function validateMachine(machine: string): void {
  if (!QA_MACHINES.has(machine)) throw new Error("機種が不正です");
}

function validateTitle(title: string): string {
  const t = title.trim();
  if (!t) throw new Error("タイトルを入力してください");
  if (t.length > MAX_QA_TITLE_LEN) throw new Error("タイトルが長すぎます");
  return t;
}

function validateBody(body: string): string {
  const b = body.trim();
  if (b.length > MAX_QA_BODY_LEN) throw new Error("本文が長すぎます");
  return b;
}

async function loadPosts(db: D1Database, questionId: string): Promise<QaPostDto[]> {
  const { results } = await db
    .prepare(
      `SELECT id, user_id, kind, body, created_at
       FROM manual_qa_posts
       WHERE question_id = ?
       ORDER BY created_at ASC`
    )
    .bind(questionId)
    .all<{
      id: string;
      user_id: string;
      kind: "staff" | "asker";
      body: string;
      created_at: number;
    }>();

  const posts = results ?? [];
  const labels = new Map<string, string>();
  for (const post of posts) {
    if (post.kind === "asker" && !labels.has(post.user_id)) {
      labels.set(post.user_id, await askerLabelForUser(db, post.user_id));
    }
  }

  return posts.map((post) => ({
    id: post.id,
    by: post.kind === "staff" ? STAFF_DISPLAY_NAME : labels.get(post.user_id) ?? "質問者",
    role: post.kind === "staff" ? STAFF_DISPLAY_NAME : ASKER_DISPLAY_ROLE,
    date: formatQaDateJst(post.created_at),
    text: post.body,
    kind: post.kind,
  }));
}

async function loadAttachments(
  db: D1Database,
  questionId: string
): Promise<QaAttachmentDto[]> {
  const { results } = await db
    .prepare(
      `SELECT id, r2_key, filename, content_type, size_bytes
       FROM manual_qa_attachments
       WHERE question_id = ?
       ORDER BY created_at ASC`
    )
    .bind(questionId)
    .all<{
      id: string;
      r2_key: string;
      filename: string;
      content_type: string;
      size_bytes: number;
    }>();

  return (results ?? []).map((row) => ({
    id: row.id,
    filename: row.filename,
    contentType: row.content_type,
    sizeBytes: row.size_bytes,
    url: manualMediaUrl(row.r2_key),
  }));
}

async function rowToListItem(
  db: D1Database,
  row: QuestionRow,
  answerCount: number,
  author: string
): Promise<QaQuestionListItem> {
  const staff = answerCount > 0
    ? await db
        .prepare(
          `SELECT 1 FROM manual_qa_posts WHERE question_id = ? AND kind = 'staff' LIMIT 1`
        )
        .bind(row.id)
        .first()
    : null;

  return {
    id: row.id,
    cat: row.category_id,
    machine: row.machine,
    status: staff ? "answered" : "open",
    resolved: row.resolved === 1,
    pinned: row.pinned === 1,
    title: row.title,
    body: row.body,
    author,
    date: formatQaDateJst(row.created_at),
    answerCount,
  };
}

export interface ListQuestionsOptions {
  categoryId?: string;
  machine?: string;
  status?: "all" | "answered" | "open";
  resolved?: "all" | "0" | "1";
  ids?: string[];
  limit?: number;
  offset?: number;
}

/** 公開一覧 */
export async function listPublicQuestions(
  db: D1Database,
  options: ListQuestionsOptions
): Promise<QaQuestionListItem[]> {
  const limit = Math.min(options.limit ?? QA_LIST_LIMIT, QA_LIST_LIMIT);
  const offset = Math.max(0, options.offset ?? 0);

  let sql = `SELECT q.*,
    (SELECT COUNT(*) FROM manual_qa_posts p WHERE p.question_id = q.id) AS answer_count
    FROM manual_qa_questions q
    WHERE q.moderation_status = 'approved'`;
  const binds: unknown[] = [];

  if (options.categoryId && options.categoryId !== "all") {
    sql += " AND q.category_id = ?";
    binds.push(options.categoryId);
  }
  if (options.machine && options.machine !== "all") {
    sql += " AND (q.machine = ? OR q.machine = 'both')";
    binds.push(options.machine);
  }
  if (options.resolved === "0" || options.resolved === "1") {
    sql += " AND q.resolved = ?";
    binds.push(Number(options.resolved));
  }
  if (options.ids?.length) {
    const placeholders = options.ids.map(() => "?").join(",");
    sql += ` AND q.id IN (${placeholders})`;
    binds.push(...options.ids);
  }

  sql += " ORDER BY q.pinned DESC, q.created_at DESC LIMIT ? OFFSET ?";
  binds.push(limit, offset);

  const { results } = await db
    .prepare(sql)
    .bind(...binds)
    .all<QuestionRow & { answer_count: number }>();

  const rows = results ?? [];
  const items: QaQuestionListItem[] = [];

  for (const row of rows) {
    const author = await askerLabelForUser(db, row.user_id);
    const item = await rowToListItem(db, row, row.answer_count, author);

    if (options.status === "answered" && item.status !== "answered") continue;
    if (options.status === "open" && item.status !== "open") continue;

    items.push(item);
  }

  return items;
}

/** 管理用一覧（承認済みのみ、フィルタ強化） */
export async function listAdminQuestions(
  db: D1Database,
  options: ListQuestionsOptions
): Promise<QaQuestionListItem[]> {
  return listPublicQuestions(db, options);
}

/** 質問詳細 */
export async function getQuestionDetail(
  db: D1Database,
  questionId: string,
  viewerUserId: string,
  isAdmin: boolean
): Promise<QaQuestionDetail | null> {
  const row = await db
    .prepare("SELECT * FROM manual_qa_questions WHERE id = ?")
    .bind(questionId)
    .first<QuestionRow>();
  if (!row) return null;
  if (row.moderation_status !== "approved" && row.user_id !== viewerUserId && !isAdmin) {
    return null;
  }

  const posts = await loadPosts(db, questionId);
  const attachments = await loadAttachments(db, questionId);
  const author = await askerLabelForUser(db, row.user_id);
  const staff = posts.some((p) => p.kind === "staff");

  return {
    id: row.id,
    cat: row.category_id,
    machine: row.machine,
    status: staff ? "answered" : "open",
    resolved: row.resolved === 1,
    pinned: row.pinned === 1,
    title: row.title,
    body: row.body,
    author,
    date: formatQaDateJst(row.created_at),
    answerCount: posts.length,
    answers: posts,
    attachments,
    userId: row.user_id,
  };
}

async function bindAttachments(
  db: D1Database,
  env: Env,
  questionId: string,
  userId: string,
  keys: string[]
): Promise<void> {
  if (!keys.length) return;
  if (keys.length > MAX_QA_ATTACHMENTS) {
    throw new Error(`添付は最大 ${MAX_QA_ATTACHMENTS} 件です`);
  }

  const bucket = getFiles(env);
  const ts = now();

  for (const key of keys) {
    if (!isManualQaDraftKeyForUser(key, userId)) {
      throw new Error("添付ファイルの参照が不正です");
    }
    const head = await bucket.head(key);
    if (!head) throw new Error("添付ファイルが見つかりません");

    const filename = key.split("/").pop() ?? "file";
    await db
      .prepare(
        `INSERT INTO manual_qa_attachments
         (id, question_id, r2_key, filename, content_type, size_bytes, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        createId("mqa"),
        questionId,
        key,
        filename,
        head.httpMetadata?.contentType ?? "application/octet-stream",
        head.size,
        ts
      )
      .run();
  }
}

export interface CreateQuestionInput {
  userId: string;
  categoryId: string;
  machine: string;
  title: string;
  body: string;
  attachmentKeys?: string[];
}

/** 質問を作成（精査後に保存） */
export async function createQuestion(
  env: Env,
  input: CreateQuestionInput
): Promise<{ id: string } | { rejected: true; userMessage: string }> {
  validateCategory(input.categoryId);
  validateMachine(input.machine);
  const title = validateTitle(input.title);
  const body = validateBody(input.body);

  const moderation = await moderateQaContent(env, { title, body });
  if (!moderation.approved) {
    const db = getDb(env);
    const ts = now();
    const id = createId("mq");
    await db
      .prepare(
        `INSERT INTO manual_qa_questions
         (id, user_id, category_id, machine, title, body, pinned, resolved,
          moderation_status, moderation_detail, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 0, 0, 'rejected', ?, ?, ?)`
      )
      .bind(id, input.userId, input.categoryId, input.machine, title, body, moderation.userMessage, ts, ts)
      .run();
    return { rejected: true, userMessage: moderation.userMessage };
  }

  const db = getDb(env);
  const ts = now();
  const id = createId("mq");
  await db
    .prepare(
      `INSERT INTO manual_qa_questions
       (id, user_id, category_id, machine, title, body, pinned, resolved,
        moderation_status, moderation_detail, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 0, 0, 'approved', NULL, ?, ?)`
    )
    .bind(id, input.userId, input.categoryId, input.machine, title, body, ts, ts)
    .run();

  const keys = (input.attachmentKeys ?? []).filter((k) => typeof k === "string");
  await bindAttachments(db, env, id, input.userId, keys);

  return { id };
}

/** 質問者追記 */
export async function addAskerPost(
  env: Env,
  questionId: string,
  userId: string,
  bodyRaw: string
): Promise<{ id: string } | { rejected: true; userMessage: string }> {
  const body = validateBody(bodyRaw);
  if (!body) throw new Error("本文を入力してください");

  const db = getDb(env);
  const question = await db
    .prepare("SELECT user_id, moderation_status FROM manual_qa_questions WHERE id = ?")
    .bind(questionId)
    .first<{ user_id: string; moderation_status: string }>();
  if (!question || question.moderation_status !== "approved") {
    throw new Error("質問が見つかりません");
  }
  if (question.user_id !== userId) {
    throw new Error("この質問に追記する権限がありません");
  }

  const moderation = await moderateQaContent(env, { body });
  if (!moderation.approved) {
    return { rejected: true, userMessage: moderation.userMessage };
  }

  const ts = now();
  const id = createId("mqp");
  await db
    .prepare(
      `INSERT INTO manual_qa_posts (id, question_id, user_id, kind, body, created_at)
       VALUES (?, ?, ?, 'asker', ?, ?)`
    )
    .bind(id, questionId, userId, body, ts)
    .run();
  await db
    .prepare("UPDATE manual_qa_questions SET updated_at = ? WHERE id = ?")
    .bind(ts, questionId)
    .run();

  return { id };
}

/** スタッフ返信 */
export async function addStaffReply(
  env: Env,
  questionId: string,
  staffUserId: string,
  bodyRaw: string
): Promise<{ id: string }> {
  const body = validateBody(bodyRaw);
  if (!body) throw new Error("本文を入力してください");

  const db = getDb(env);
  const question = await db
    .prepare("SELECT moderation_status FROM manual_qa_questions WHERE id = ?")
    .bind(questionId)
    .first<{ moderation_status: string }>();
  if (!question || question.moderation_status !== "approved") {
    throw new Error("質問が見つかりません");
  }

  const ts = now();
  const id = createId("mqp");
  await db
    .prepare(
      `INSERT INTO manual_qa_posts (id, question_id, user_id, kind, body, created_at)
       VALUES (?, ?, ?, 'staff', ?, ?)`
    )
    .bind(id, questionId, staffUserId, body, ts)
    .run();
  await db
    .prepare("UPDATE manual_qa_questions SET updated_at = ? WHERE id = ?")
    .bind(ts, questionId)
    .run();

  return { id };
}

/** 解決済み・ピン留め更新 */
export async function patchQuestionAdmin(
  db: D1Database,
  questionId: string,
  patch: { resolved?: boolean; pinned?: boolean }
): Promise<void> {
  const row = await db
    .prepare("SELECT id FROM manual_qa_questions WHERE id = ?")
    .bind(questionId)
    .first();
  if (!row) throw new Error("質問が見つかりません");

  const sets: string[] = [];
  const binds: unknown[] = [];
  if (patch.resolved !== undefined) {
    sets.push("resolved = ?");
    binds.push(patch.resolved ? 1 : 0);
  }
  if (patch.pinned !== undefined) {
    sets.push("pinned = ?");
    binds.push(patch.pinned ? 1 : 0);
  }
  if (!sets.length) return;

  sets.push("updated_at = ?");
  binds.push(now());
  binds.push(questionId);

  await db
    .prepare(`UPDATE manual_qa_questions SET ${sets.join(", ")} WHERE id = ?`)
    .bind(...binds)
    .run();
}

/** 質問を削除（添付 R2 → D1。posts/attachments は CASCADE） */
export async function deleteQuestionAdmin(env: Env, questionId: string): Promise<void> {
  const db = getDb(env);
  const row = await db
    .prepare("SELECT id FROM manual_qa_questions WHERE id = ?")
    .bind(questionId)
    .first();
  if (!row) throw new Error("質問が見つかりません");

  const attachments = await db
    .prepare("SELECT r2_key FROM manual_qa_attachments WHERE question_id = ?")
    .bind(questionId)
    .all<{ r2_key: string }>();

  const files = getFiles(env);
  for (const att of attachments.results ?? []) {
    try {
      await files.delete(att.r2_key);
    } catch (error) {
      console.error("manual_qa delete r2", att.r2_key, error);
    }
  }

  await db
    .prepare("DELETE FROM manual_qa_questions WHERE id = ?")
    .bind(questionId)
    .run();
}
