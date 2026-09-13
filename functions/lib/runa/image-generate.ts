/**
 * Runa — Cloudflare Workers AI (Grok Imagine) 画像生成
 */

import { getFiles } from "../r2";
import type { Env, SessionUser } from "../types";
import {
  buildLogicalPath,
  fileMetaKey,
  parseLogicalPath,
  sanitizeFilename,
  toR2Key,
} from "../storage/keys";
import { STORAGE_APP_SLUG } from "../storage/constants";
import { authorizeStoragePath } from "../storage/permissions";
import {
  createFileMeta,
  resolveEffectivePermissions,
  writeMetaJson,
} from "../storage/meta";
import {
  addUsedBytes,
  canAllocateBytes,
  subtractUsedBytes,
} from "../storage/quota";
import { resolveRootForPath } from "../storage/roots";
import {
  initiateStorageUpload,
  simpleStorageUpload,
} from "../storage/upload";
import { canUserAccessApp } from "../apps";
import { runaAiGatewayId, runaOpenAiApiKey } from "./env";
import {
  assertRunaDailyImageLimit,
  incrementRunaDailyImages,
} from "./image-limits";
import type { RunaFileItem, ToolRunResult } from "./tools";

const CLOUDFLARE_AI_RUN_PREFIX =
  "https://api.cloudflare.com/client/v4/accounts/";

const MODEL_DRAFT = "xai/grok-imagine-image";
const MODEL_FINAL = "xai/grok-imagine-image-quality";

const ASPECT_RATIOS = new Set([
  "1:1",
  "3:4",
  "4:3",
  "9:16",
  "16:9",
  "2:3",
  "3:2",
  "9:19.5",
  "19.5:9",
  "9:20",
  "20:9",
  "1:2",
  "2:1",
  "auto",
]);

export type ImageGenerateMode = "draft" | "final" | "edit";

interface ImageGenerateArgs {
  prompt: string;
  mode: ImageGenerateMode;
  dest_path: string;
  aspect_ratio: string;
  source_path: string;
  mask_path: string;
  count: number;
}

interface WorkersAiImageInput {
  prompt: string;
  aspect_ratio?: string;
  quality?: "low" | "medium" | "high";
  resolution?: "1k" | "2k";
  response_format?: "url" | "b64_json";
  n?: number;
  image?: { image: string };
  images?: Array<{ image: string }>;
  mask?: { image: string };
}

interface SavedImageResult {
  path: string;
  sizeBytes: number;
}

function resolveAccountId(env: Env): string {
  const accountId =
    env.CLOUDFLARE_ACCOUNT_ID?.trim() || env.R2_ACCOUNT_ID?.trim() || "";
  if (!accountId) {
    throw new Error(
      "CLOUDFLARE_ACCOUNT_ID（または R2_ACCOUNT_ID）が未設定です"
    );
  }
  return accountId;
}

function resolveApiKey(env: Env): string {
  const key = runaOpenAiApiKey(env) || env.CLOUDFLARE_API_TOKEN?.trim();
  if (!key) {
    throw new Error(
      "RUNA_OPENAI_API_KEY または CLOUDFLARE_API_TOKEN が未設定です"
    );
  }
  return key;
}

function buildAiRunHeaders(env: Env): Record<string, string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${resolveApiKey(env)}`,
    "Content-Type": "application/json",
  };
  const gatewayId = runaAiGatewayId(env);
  if (gatewayId) {
    headers["cf-aig-gateway-id"] = gatewayId;
  }
  return headers;
}

function parseMode(raw: string): ImageGenerateMode {
  if (raw === "final" || raw === "edit") return raw;
  return "draft";
}

function parseArgs(args: Record<string, unknown>): ImageGenerateArgs {
  const mode = parseMode(
    typeof args.mode === "string" ? args.mode.trim() : "draft"
  );
  const aspectRaw =
    typeof args.aspect_ratio === "string" ? args.aspect_ratio.trim() : "auto";
  const aspect_ratio = ASPECT_RATIOS.has(aspectRaw) ? aspectRaw : "auto";
  const countRaw =
    typeof args.count === "number" && Number.isFinite(args.count)
      ? Math.floor(args.count)
      : typeof args.n === "number" && Number.isFinite(args.n)
        ? Math.floor(args.n)
        : 1;
  const maxCount = mode === "draft" ? 3 : 1;
  const count = Math.min(maxCount, Math.max(1, countRaw));

  return {
    prompt: typeof args.prompt === "string" ? args.prompt.trim() : "",
    mode,
    dest_path: typeof args.dest_path === "string" ? args.dest_path.trim() : "",
    aspect_ratio,
    source_path:
      typeof args.source_path === "string" ? args.source_path.trim() : "",
    mask_path: typeof args.mask_path === "string" ? args.mask_path.trim() : "",
    count,
  };
}

function resolveModel(mode: ImageGenerateMode): string {
  return mode === "draft" ? MODEL_DRAFT : MODEL_FINAL;
}

function buildModelInput(
  args: ImageGenerateArgs,
  referenceImages: string[]
): WorkersAiImageInput {
  const input: WorkersAiImageInput = {
    prompt: args.prompt,
    aspect_ratio: args.aspect_ratio,
    response_format: "b64_json",
  };

  if (args.mode === "draft") {
    input.resolution = "1k";
    input.quality = "medium";
    if (args.count > 1) input.n = args.count;
  } else {
    input.resolution = "2k";
    input.quality = "high";
  }

  if (referenceImages.length === 1) {
    input.image = { image: referenceImages[0] };
  } else if (referenceImages.length > 1) {
    input.images = referenceImages.map((image) => ({ image }));
  }

  return input;
}

function extractApiError(body: unknown, status: number): string {
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    const errors = record.errors;
    if (Array.isArray(errors) && errors.length > 0) {
      const first = errors[0];
      if (first && typeof first === "object" && "message" in first) {
        return String((first as { message: unknown }).message);
      }
    }
    const error = record.error;
    if (error && typeof error === "object" && "message" in error) {
      return String((error as { message: unknown }).message);
    }
  }
  return `画像生成 API エラー (${status})`;
}

function looksLikeImagePayload(value: string): boolean {
  const trimmed = value.trim();
  return (
    trimmed.startsWith("data:image/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.length > 256
  );
}

function collectImagePayloads(
  value: unknown,
  out: string[],
  depth = 0
): void {
  if (depth > 8) return;

  if (typeof value === "string" && looksLikeImagePayload(value)) {
    out.push(value.trim());
    return;
  }
  if (!value || typeof value !== "object") return;

  const record = value as Record<string, unknown>;
  if (typeof record.image === "string" && looksLikeImagePayload(record.image)) {
    out.push(record.image.trim());
  }
  if (
    typeof record.b64_json === "string" &&
    looksLikeImagePayload(record.b64_json)
  ) {
    out.push(record.b64_json.trim());
  }
  if (typeof record.url === "string" && looksLikeImagePayload(record.url)) {
    out.push(record.url.trim());
  }
  if (Array.isArray(record.images)) {
    for (const item of record.images) {
      collectImagePayloads(item, out, depth + 1);
    }
  }
  if (Array.isArray(record.data)) {
    for (const item of record.data) {
      collectImagePayloads(item, out, depth + 1);
    }
  }
  if (record.result !== undefined) {
    collectImagePayloads(record.result, out, depth + 1);
  }
  if (record.output !== undefined) {
    collectImagePayloads(record.output, out, depth + 1);
  }
}

function extractRunState(body: Record<string, unknown>): string | null {
  const payload = body.result;
  if (!payload || typeof payload !== "object") return null;
  const state = (payload as Record<string, unknown>).state;
  return typeof state === "string" ? state : null;
}

function extractImagesFromResponse(body: unknown): string[] {
  const images: string[] = [];
  if (!body || typeof body !== "object") return images;

  const root = body as Record<string, unknown>;
  if (root.success === false) {
    return images;
  }

  collectImagePayloads(root.result ?? root, images);
  if (!images.length) {
    collectImagePayloads(root, images);
  }
  return images;
}

function decodeDataUri(dataUri: string): { bytes: ArrayBuffer; mime: string } {
  const match = /^data:([^;]+);base64,(.+)$/i.exec(dataUri);
  if (!match) {
    throw new Error("画像データの形式が不正です");
  }
  const mime = match[1];
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return { bytes: bytes.buffer, mime };
}

async function decodeImagePayload(payload: string): Promise<{
  bytes: ArrayBuffer;
  mime: string;
}> {
  if (payload.startsWith("data:")) {
    return decodeDataUri(payload);
  }
  if (payload.startsWith("http://") || payload.startsWith("https://")) {
    const response = await fetch(payload);
    if (!response.ok) {
      throw new Error("生成画像の取得に失敗しました");
    }
    const bytes = await response.arrayBuffer();
    const mime = response.headers.get("content-type") || "image/png";
    return { bytes, mime };
  }

  const binary = atob(payload);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return { bytes: bytes.buffer, mime: "image/png" };
}

function extensionForMime(mime: string): string {
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("avif")) return "avif";
  return "png";
}

function defaultDestPath(user: SessionUser, ext: string, index: number): string {
  const stamp = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  const suffix = index > 0 ? `-${String(index + 1).padStart(2, "0")}` : "";
  return `u/${user.username}/generated/runa-${stamp}${suffix}.${ext}`;
}

function applyDestIndex(destPath: string, index: number): string {
  if (index <= 0) return destPath;
  const dot = destPath.lastIndexOf(".");
  if (dot <= destPath.lastIndexOf("/")) {
    return `${destPath}-${String(index + 1).padStart(2, "0")}`;
  }
  const base = destPath.slice(0, dot);
  const ext = destPath.slice(dot);
  return `${base}-${String(index + 1).padStart(2, "0")}${ext}`;
}

async function readImageReference(
  env: Env,
  db: D1Database,
  user: SessionUser,
  logicalPath: string,
  maxBytes = 10 * 1024 * 1024
): Promise<string> {
  const parsed = parseLogicalPath(logicalPath);
  if (!parsed || !parsed.relativePath) {
    throw new Error("画像パスが不正です");
  }

  const auth = await authorizeStoragePath(
    env,
    db,
    user,
    logicalPath,
    "read",
    false
  );
  if (typeof auth === "string") throw new Error(auth);

  const bucket = getFiles(env);
  const obj = await bucket.get(
    toR2Key(parsed.rootType, parsed.rootKey, parsed.relativePath)
  );
  if (!obj) throw new Error(`参照画像が見つかりません: ${logicalPath}`);

  const sizeBytes = obj.size;
  if (sizeBytes > maxBytes) {
    throw new Error(
      `参照画像が大きすぎます（上限 ${Math.floor(maxBytes / (1024 * 1024))}MB）`
    );
  }

  const bytes = new Uint8Array(await obj.arrayBuffer());
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const mime = obj.httpMetadata?.contentType || "image/png";
  return `data:${mime};base64,${btoa(binary)}`;
}

async function callWorkersAiImage(
  env: Env,
  model: string,
  input: WorkersAiImageInput
): Promise<string[]> {
  const accountId = resolveAccountId(env);
  const response = await fetch(
    `${CLOUDFLARE_AI_RUN_PREFIX}${accountId}/ai/run`,
    {
      method: "POST",
      headers: buildAiRunHeaders(env),
      body: JSON.stringify({ model, input }),
    }
  );

  const body = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) {
    throw new Error(extractApiError(body, response.status));
  }

  if (body && typeof body === "object") {
    const root = body as Record<string, unknown>;
    if (root.success === false) {
      throw new Error(extractApiError(body, response.status));
    }
    const state = extractRunState(root);
    if (state && state !== "Completed") {
      throw new Error(`画像生成が完了しませんでした（state: ${state}）`);
    }
  }

  const images = extractImagesFromResponse(body);
  if (!images.length) {
    throw new Error(
      "画像生成 API から画像が返されませんでした（レスポンス形式を解釈できませんでした）"
    );
  }
  return images;
}

async function saveGeneratedImage(
  env: Env,
  db: D1Database,
  user: SessionUser,
  destPath: string,
  bytes: ArrayBuffer,
  mime: string
): Promise<SavedImageResult> {
  const parsed = parseLogicalPath(destPath);
  if (!parsed || !parsed.relativePath) {
    throw new Error("保存先パスが不正です");
  }

  const bucket = getFiles(env);
  const existing = await bucket.head(
    toR2Key(parsed.rootType, parsed.rootKey, parsed.relativePath)
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
    if (typeof writeAuth === "string") throw new Error(writeAuth);

    const root = await resolveRootForPath(
      db,
      parsed.rootType,
      parsed.rootKey
    );
    if (!root) throw new Error("ストレージルートが見つかりません");

    const delta = bytes.byteLength - existing.size;
    if (delta > 0 && !canAllocateBytes(root, delta)) {
      throw new Error("割り当て領域不足です");
    }

    await bucket.put(
      toR2Key(parsed.rootType, parsed.rootKey, parsed.relativePath),
      bytes,
      { httpMetadata: { contentType: mime } }
    );
    const perms = await resolveEffectivePermissions(
      env,
      parsed.rootType,
      parsed.rootKey,
      parsed.relativePath,
      false
    );
    await writeMetaJson(
      bucket,
      fileMetaKey(parsed.rootType, parsed.rootKey, parsed.relativePath),
      createFileMeta(user.username, bytes.byteLength, perms)
    );
    if (delta > 0) await addUsedBytes(db, root.id, delta);
    else if (delta < 0) await subtractUsedBytes(db, root.id, -delta);
    return { path: destPath, sizeBytes: bytes.byteLength };
  }

  const dir = parsed.relativePath.includes("/")
    ? parsed.relativePath.slice(0, parsed.relativePath.lastIndexOf("/"))
    : "";
  const filename = sanitizeFilename(
    parsed.relativePath.split("/").pop() ?? "generated.png"
  );

  const init = await initiateStorageUpload(
    env,
    db,
    user,
    parsed.rootType,
    parsed.rootKey,
    dir,
    filename,
    bytes.byteLength
  );
  if (init.mode !== "simple") {
    throw new Error("生成画像が大きすぎて保存できません");
  }
  const uploaded = await simpleStorageUpload(env, db, user, init.sessionId, bytes);
  return { path: uploaded.path, sizeBytes: bytes.byteLength };
}

/** Grok Imagine で画像を生成してストレージに保存 */
export async function runImageGenerate(
  env: Env,
  db: D1Database,
  user: SessionUser,
  args: Record<string, unknown>
): Promise<ToolRunResult> {
  const parsed = parseArgs(args);
  if (!parsed.prompt) {
    return { text: "prompt が必要です", files: [] };
  }
  if (parsed.mode === "edit" && !parsed.source_path) {
    return {
      text: "edit モードでは source_path（編集元画像）が必要です",
      files: [],
    };
  }

  const allowed = await canUserAccessApp(db, user.id, STORAGE_APP_SLUG);
  if (!allowed) {
    return { text: "クラウドストレージへのアクセス権限がありません", files: [] };
  }

  await assertRunaDailyImageLimit(db, user.id, env, parsed.count);

  const referenceImages: string[] = [];
  if (parsed.source_path) {
    referenceImages.push(
      await readImageReference(env, db, user, parsed.source_path)
    );
  }

  const model = resolveModel(parsed.mode);
  const input = buildModelInput(parsed, referenceImages);
  if (parsed.mask_path) {
    input.mask = {
      image: await readImageReference(env, db, user, parsed.mask_path),
    };
  }

  const payloads = await callWorkersAiImage(env, model, input);
  return await persistGeneratedImages(env, db, user, parsed, payloads, model);
}

async function persistGeneratedImages(
  env: Env,
  db: D1Database,
  user: SessionUser,
  args: ImageGenerateArgs,
  payloads: string[],
  model: string
): Promise<ToolRunResult> {
  const saved: RunaFileItem[] = [];
  const capped = payloads.slice(0, args.count);

  for (let i = 0; i < capped.length; i++) {
    const { bytes, mime } = await decodeImagePayload(capped[i]);
    const ext = extensionForMime(mime);
    let destPath = args.dest_path
      ? applyDestIndex(args.dest_path, i)
      : defaultDestPath(user, ext, i);

    if (args.dest_path) {
      const destParsed = parseLogicalPath(destPath);
      if (!destParsed || !destParsed.relativePath) {
        return { text: "dest_path が不正です", files: saved };
      }
      const writeAuth = await authorizeStoragePath(
        env,
        db,
        user,
        destPath,
        "write",
        false
      );
      if (typeof writeAuth === "string") {
        return { text: writeAuth, files: saved };
      }
    } else {
      const destParsed = parseLogicalPath(destPath);
      if (!destParsed) {
        return { text: "保存先パスを決定できません", files: saved };
      }
      const parentPath = buildLogicalPath(
        destParsed.rootType,
        destParsed.rootKey,
        destParsed.relativePath.includes("/")
          ? destParsed.relativePath.slice(
              0,
              destParsed.relativePath.lastIndexOf("/")
            )
          : ""
      );
      const parentAuth = await authorizeStoragePath(
        env,
        db,
        user,
        parentPath,
        "write",
        true
      );
      if (typeof parentAuth === "string") {
        return { text: parentAuth, files: saved };
      }
    }

    const result = await saveGeneratedImage(
      env,
      db,
      user,
      destPath,
      bytes,
      mime
    );
    saved.push({
      name: result.path.split("/").pop() ?? result.path,
      path: result.path,
      type: "file",
      sizeBytes: result.sizeBytes,
      updatedAt: Date.now(),
    });
  }

  await incrementRunaDailyImages(db, user.id, saved.length);

  const modeLabel =
    args.mode === "draft"
      ? "下書き"
      : args.mode === "edit"
        ? "編集"
        : "完成";
  const lines = saved.map(
    (file) => `- \`${file.path}\` (${file.sizeBytes ?? 0} bytes)`
  );

  return {
    text:
      `画像を生成しました（${modeLabel} / ${model} / ${saved.length} 枚）:\n` +
      lines.join("\n"),
    files: saved,
  };
}
