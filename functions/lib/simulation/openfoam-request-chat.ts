// functions/lib/simulation/openfoam-request-chat.ts

import type { Env } from "../types";
import { createId } from "../types";
import { canUserAccessApp } from "../apps";
import { getOpenfoamRequestById, type OpenfoamRequest } from "./openfoam-requests";

export const CHAT_ATTACHMENT_MAX_BYTES = 100 * 1024 * 1024;
export const CHAT_ATTACHMENT_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const CHAT_MESSAGE_BODY_MAX_LENGTH = 4000;
export const CHAT_MESSAGES_DEFAULT_LIMIT = 100;

const MANAGEMENT_APP = "simulation-management";

export interface OpenfoamRequestMessageRow {
  id: string;
  request_id: string;
  sender_user_id: string;
  body: string;
  attachment_r2_key: string | null;
  attachment_filename: string | null;
  attachment_size_bytes: number | null;
  attachment_content_type: string | null;
  attachment_expires_at: string | null;
  created_at: string;
}

export interface OpenfoamRequestMessageApiModel {
  id: string;
  request_id: string;
  sender_user_id: string;
  sender_display_name: string;
  is_staff: boolean;
  is_own: boolean;
  body: string;
  attachment: {
    filename: string;
    size_bytes: number;
    content_type: string | null;
    expires_at: string;
    expired: boolean;
    download_url: string;
  } | null;
  created_at: string;
}

export class OpenfoamRequestChatAccessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OpenfoamRequestChatAccessError";
  }
}

/** Builds R2 key for a chat attachment. */
export function generateOpenfoamChatAttachmentR2Key(
  requestId: string,
  messageId: string,
  filename: string
): string {
  const safe = filename.replace(/[^\w.\-()]/g, "_").slice(0, 200) || "attachment";
  return `openfoam-requests/${requestId}/chat/${messageId}/${safe}`;
}

/** Returns whether the user may access chat on this request. */
export async function canAccessOpenfoamRequestChat(
  db: D1Database,
  userId: string,
  request: OpenfoamRequest
): Promise<{ allowed: boolean; isStaff: boolean; isOwner: boolean }> {
  if (request.status === "cancelled") {
    return { allowed: false, isStaff: false, isOwner: false };
  }

  const isOwner = request.user_id === userId;
  const isStaff = await canUserAccessApp(db, userId, MANAGEMENT_APP);
  return { allowed: isOwner || isStaff, isStaff, isOwner };
}

/** Verifies chat access; throws if denied. */
export async function assertOpenfoamRequestChatAccess(
  db: D1Database,
  userId: string,
  requestId: string
): Promise<{ request: OpenfoamRequest; isStaff: boolean; isOwner: boolean }> {
  const request = await getOpenfoamRequestById(db, requestId);
  if (!request) {
    throw new OpenfoamRequestChatAccessError("依頼が見つかりません");
  }

  const access = await canAccessOpenfoamRequestChat(db, userId, request);
  if (!access.allowed) {
    throw new OpenfoamRequestChatAccessError("依頼が見つかりません");
  }

  return { request, isStaff: access.isStaff, isOwner: access.isOwner };
}

/** Loads sender display names for message rows. */
async function loadSenderDisplayNames(
  db: D1Database,
  userIds: string[]
): Promise<Map<string, string>> {
  const unique = [...new Set(userIds.filter(Boolean))];
  const map = new Map<string, string>();
  if (!unique.length) return map;

  const placeholders = unique.map(() => "?").join(", ");
  const rows = await db
    .prepare(
      `SELECT id, display_name, username FROM users WHERE id IN (${placeholders})`
    )
    .bind(...unique)
    .all<{ id: string; display_name: string | null; username: string }>();

  for (const row of rows.results ?? []) {
    const label = row.display_name?.trim() || row.username?.trim() || row.id;
    map.set(row.id, label);
  }
  return map;
}

/** Returns true if attachment metadata is still valid (not expired). */
function isAttachmentActive(row: OpenfoamRequestMessageRow, nowMs: number): boolean {
  if (!row.attachment_r2_key || !row.attachment_expires_at) return false;
  const expiresMs = Date.parse(row.attachment_expires_at);
  return Number.isFinite(expiresMs) && expiresMs > nowMs;
}

/** Clears expired attachment fields on a message row. */
async function clearExpiredAttachment(db: D1Database, messageId: string): Promise<void> {
  await db
    .prepare(
      `UPDATE sim_openfoam_request_messages
       SET attachment_r2_key = NULL,
           attachment_filename = NULL,
           attachment_size_bytes = NULL,
           attachment_content_type = NULL,
           attachment_expires_at = NULL
       WHERE id = ?`
    )
    .bind(messageId)
    .run();
}

/** Expires attachment on a message if past TTL (lazy cleanup). */
async function expireAttachmentIfNeeded(
  env: Env,
  db: D1Database,
  row: OpenfoamRequestMessageRow
): Promise<OpenfoamRequestMessageRow> {
  if (!row.attachment_r2_key || !row.attachment_expires_at) return row;

  const nowMs = Date.now();
  if (isAttachmentActive(row, nowMs)) return row;

  try {
    await env.FILES.delete(row.attachment_r2_key);
  } catch {
    // ignore missing object
  }
  await clearExpiredAttachment(db, row.id);
  return {
    ...row,
    attachment_r2_key: null,
    attachment_filename: null,
    attachment_size_bytes: null,
    attachment_content_type: null,
    attachment_expires_at: null,
  };
}

/** Formats a message row for API responses. */
export function formatOpenfoamRequestMessageForApi(
  row: OpenfoamRequestMessageRow,
  options: {
    viewerUserId: string;
    requestOwnerUserId: string;
    staffUserIds: Set<string>;
    apiPrefix: string;
    nowMs?: number;
  }
): OpenfoamRequestMessageApiModel {
  const nowMs = options.nowMs ?? Date.now();
  const isStaff = options.staffUserIds.has(row.sender_user_id);
  const attachmentActive = isAttachmentActive(row, nowMs);
  const hadAttachment = Boolean(row.attachment_filename && row.attachment_expires_at);

  let attachment: OpenfoamRequestMessageApiModel["attachment"] = null;
  if (hadAttachment) {
    if (attachmentActive && row.attachment_filename && row.attachment_expires_at) {
      attachment = {
        filename: row.attachment_filename,
        size_bytes: row.attachment_size_bytes ?? 0,
        content_type: row.attachment_content_type,
        expires_at: row.attachment_expires_at,
        expired: false,
        download_url: `/api/simulation/${options.apiPrefix}/${row.request_id}/messages/${row.id}/attachment/download`,
      };
    } else {
      attachment = {
        filename: row.attachment_filename ?? "attachment",
        size_bytes: row.attachment_size_bytes ?? 0,
        content_type: row.attachment_content_type,
        expires_at: row.attachment_expires_at ?? "",
        expired: true,
        download_url: `/api/simulation/${options.apiPrefix}/${row.request_id}/messages/${row.id}/attachment/download`,
      };
    }
  }

  return {
    id: row.id,
    request_id: row.request_id,
    sender_user_id: row.sender_user_id,
    sender_display_name: "",
    is_staff: isStaff,
    is_own: row.sender_user_id === options.viewerUserId,
    body: row.body,
    attachment,
    created_at: row.created_at,
  };
}

/** Lists chat messages for a request (ascending). */
export async function listOpenfoamRequestMessages(
  env: Env,
  db: D1Database,
  requestId: string,
  options: {
    after?: string | null;
    limit?: number;
  } = {}
): Promise<OpenfoamRequestMessageRow[]> {
  const limit = Math.min(
    Math.max(1, options.limit ?? CHAT_MESSAGES_DEFAULT_LIMIT),
    200
  );
  const after = options.after?.trim() || null;

  let rows: OpenfoamRequestMessageRow[];
  if (after) {
    const cursor = await getOpenfoamRequestMessageById(db, after);
    if (!cursor || cursor.request_id !== requestId) {
      rows =
        (
          await db
            .prepare(
              `SELECT * FROM sim_openfoam_request_messages
               WHERE request_id = ?
               ORDER BY created_at ASC, id ASC
               LIMIT ?`
            )
            .bind(requestId, limit)
            .all<OpenfoamRequestMessageRow>()
        ).results ?? [];
    } else {
      rows =
        (
          await db
            .prepare(
              `SELECT * FROM sim_openfoam_request_messages
               WHERE request_id = ?
                 AND (created_at > ? OR (created_at = ? AND id > ?))
               ORDER BY created_at ASC, id ASC
               LIMIT ?`
            )
            .bind(requestId, cursor.created_at, cursor.created_at, cursor.id, limit)
            .all<OpenfoamRequestMessageRow>()
        ).results ?? [];
    }
  } else {
    rows =
      (
        await db
          .prepare(
            `SELECT * FROM sim_openfoam_request_messages
             WHERE request_id = ?
             ORDER BY created_at ASC, id ASC
             LIMIT ?`
          )
          .bind(requestId, limit)
          .all<OpenfoamRequestMessageRow>()
      ).results ?? [];
  }

  const refreshed: OpenfoamRequestMessageRow[] = [];
  for (const row of rows) {
    refreshed.push(await expireAttachmentIfNeeded(env, db, row));
  }
  return refreshed;
}

/** Loads a single message by id. */
export async function getOpenfoamRequestMessageById(
  db: D1Database,
  messageId: string
): Promise<OpenfoamRequestMessageRow | null> {
  return db
    .prepare(`SELECT * FROM sim_openfoam_request_messages WHERE id = ?`)
    .bind(messageId)
    .first<OpenfoamRequestMessageRow>();
}

/** Creates a chat message (text and/or attachment). */
export async function createOpenfoamRequestMessage(
  env: Env,
  db: D1Database,
  params: {
    requestId: string;
    senderUserId: string;
    body: string;
    attachment?: {
      buffer: ArrayBuffer;
      filename: string;
      contentType: string;
      sizeBytes: number;
    } | null;
  }
): Promise<OpenfoamRequestMessageRow> {
  const body = params.body.trim();
  const attachment = params.attachment ?? null;

  if (!body && !attachment) {
    throw new Error("メッセージ本文または添付ファイルが必要です");
  }
  if (body.length > CHAT_MESSAGE_BODY_MAX_LENGTH) {
    throw new Error(`メッセージは ${CHAT_MESSAGE_BODY_MAX_LENGTH} 文字以内で入力してください`);
  }
  if (attachment) {
    if (attachment.sizeBytes <= 0 || attachment.sizeBytes > CHAT_ATTACHMENT_MAX_BYTES) {
      throw new Error(
        `添付ファイルは 1 バイト以上 ${CHAT_ATTACHMENT_MAX_BYTES / (1024 * 1024)}MB 以下である必要があります`
      );
    }
    const filename = attachment.filename.trim();
    if (!filename) throw new Error("添付ファイル名が不正です");
  }

  const messageId = createId("ofmsg");
  const createdAt = new Date().toISOString();
  const expiresAt = attachment
    ? new Date(Date.now() + CHAT_ATTACHMENT_TTL_MS).toISOString()
    : null;
  const r2Key = attachment
    ? generateOpenfoamChatAttachmentR2Key(params.requestId, messageId, attachment.filename)
    : null;

  if (attachment && r2Key) {
    await env.FILES.put(r2Key, attachment.buffer, {
      httpMetadata: {
        contentType: attachment.contentType || "application/octet-stream",
      },
    });
  }

  await db
    .prepare(
      `INSERT INTO sim_openfoam_request_messages (
        id, request_id, sender_user_id, body,
        attachment_r2_key, attachment_filename, attachment_size_bytes,
        attachment_content_type, attachment_expires_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      messageId,
      params.requestId,
      params.senderUserId,
      body,
      r2Key,
      attachment?.filename ?? null,
      attachment?.sizeBytes ?? null,
      attachment?.contentType ?? null,
      expiresAt,
      createdAt
    )
    .run();

  const row = await getOpenfoamRequestMessageById(db, messageId);
  if (!row) throw new Error("メッセージの保存に失敗しました");
  return row;
}

/** Posts a system-style chat notice from staff. */
export async function postOpenfoamRequestSystemChatMessage(
  db: D1Database,
  params: {
    requestId: string;
    senderUserId: string;
    body: string;
  }
): Promise<OpenfoamRequestMessageRow> {
  const messageId = createId("ofmsg");
  const createdAt = new Date().toISOString();
  const body = params.body.trim();
  if (!body) throw new Error("システムメッセージ本文が空です");

  await db
    .prepare(
      `INSERT INTO sim_openfoam_request_messages (
        id, request_id, sender_user_id, body, created_at
      ) VALUES (?, ?, ?, ?, ?)`
    )
    .bind(messageId, params.requestId, params.senderUserId, body, createdAt)
    .run();

  const row = await getOpenfoamRequestMessageById(db, messageId);
  if (!row) throw new Error("システムメッセージの保存に失敗しました");
  return row;
}

/** Resolves attachment download after access and expiry checks. */
export async function getOpenfoamRequestAttachmentForDownload(
  env: Env,
  db: D1Database,
  params: {
    requestId: string;
    messageId: string;
    userId: string;
  }
): Promise<{
  r2Key: string;
  filename: string;
  contentType: string;
}> {
  await assertOpenfoamRequestChatAccess(db, params.userId, params.requestId);

  let row = await getOpenfoamRequestMessageById(db, params.messageId);
  if (!row || row.request_id !== params.requestId) {
    throw new OpenfoamRequestChatAccessError("メッセージが見つかりません");
  }

  row = await expireAttachmentIfNeeded(env, db, row);
  if (!row.attachment_r2_key || !row.attachment_filename) {
    throw new Error("添付ファイルの保存期限が切れているか、存在しません");
  }

  const obj = await env.FILES.head(row.attachment_r2_key);
  if (!obj) {
    await clearExpiredAttachment(db, row.id);
    throw new Error("添付ファイルの保存期限が切れているか、存在しません");
  }

  return {
    r2Key: row.attachment_r2_key,
    filename: row.attachment_filename,
    contentType: row.attachment_content_type || "application/octet-stream",
  };
}

/** Builds enriched API message list for a viewer. */
export async function listOpenfoamRequestMessagesForApi(
  env: Env,
  db: D1Database,
  params: {
    requestId: string;
    viewerUserId: string;
    requestOwnerUserId: string;
    apiPrefix: string;
    after?: string | null;
    limit?: number;
  }
): Promise<OpenfoamRequestMessageApiModel[]> {
  const rows = await listOpenfoamRequestMessages(env, db, params.requestId, {
    after: params.after,
    limit: params.limit,
  });

  const senderIds = rows.map((r) => r.sender_user_id);
  const nameMap = await loadSenderDisplayNames(db, senderIds);
  const staffUserIds = new Set<string>();
  for (const id of senderIds) {
    if (await canUserAccessApp(db, id, MANAGEMENT_APP)) {
      staffUserIds.add(id);
    }
  }

  const nowMs = Date.now();
  return rows.map((row) => {
    const formatted = formatOpenfoamRequestMessageForApi(row, {
      viewerUserId: params.viewerUserId,
      requestOwnerUserId: params.requestOwnerUserId,
      staffUserIds,
      apiPrefix: params.apiPrefix,
      nowMs,
    });
    formatted.sender_display_name = nameMap.get(row.sender_user_id) ?? row.sender_user_id;
    return formatted;
  });
}

/** Purges expired chat attachments from R2 and D1 (cron). */
export async function purgeExpiredFdsChatAttachments(
  env: Env,
  db: D1Database
): Promise<{ purged: number }> {
  const now = new Date().toISOString();
  const rows = await db
    .prepare(
      `SELECT id, attachment_r2_key FROM sim_openfoam_request_messages
       WHERE attachment_r2_key IS NOT NULL
         AND attachment_expires_at IS NOT NULL
         AND attachment_expires_at <= ?
       LIMIT 200`
    )
    .bind(now)
    .all<{ id: string; attachment_r2_key: string }>();

  let purged = 0;
  for (const row of rows.results ?? []) {
    try {
      await env.FILES.delete(row.attachment_r2_key);
    } catch {
      // ignore
    }
    await clearExpiredAttachment(db, row.id);
    purged += 1;
  }
  return { purged };
}
