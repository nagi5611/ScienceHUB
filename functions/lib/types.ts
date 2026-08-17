/**
 * ScienceHUB 共通型・ユーティリティ
 */

export interface Env {
  DB: D1Database;
  FILES: R2Bucket;
  sciencehub_db?: D1Database;
  sciencehub_files?: R2Bucket;
  /** Excalidraw 共同編集 Durable Object（workers/excalidraw-collab） */
  EXCALIDRAW_COLLAB?: DurableObjectNamespace;
  /** 設計アプリ共同編集 Durable Object（workers/design-collab） */
  DESIGN_COLLAB?: DurableObjectNamespace;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  /** Google カレンダー連携用 OAuth クライアント（ログイン用とは別） */
  GOOGLE_CALENDAR_CLIENT_ID?: string;
  GOOGLE_CALENDAR_CLIENT_SECRET?: string;
  /** Google Calendar 連携用リフレッシュトークン（calendar スコープ） */
  GOOGLE_CALENDAR_REFRESH_TOKEN?: string;
  /** 全グループ共通カレンダー ID（「自然科学部」） */
  GOOGLE_CALENDAR_ALL_GROUPS_ID?: string;
  /** @deprecated GOOGLE_CALENDAR_ALL_GROUPS_ID を使用 */
  HUB_ALL_GROUPS_CALENDAR_ID?: string;
  MICROSOFT_CLIENT_ID?: string;
  MICROSOFT_CLIENT_SECRET?: string;
  MICROSOFT_TENANT_ID?: string;
  OAUTH_REDIRECT_BASE?: string;
  ADMIN_BASIC_USER?: string;
  ADMIN_BASIC_PASSWORD?: string;
  /** 3D印刷 Google Calendar（Service Account） */
  GOOGLE_3DPRINT_CALENDAR_ID?: string;
  GOOGLE_3DPRINT_SERVICE_ACCOUNT_EMAIL?: string;
  GOOGLE_3DPRINT_PRIVATE_KEY?: string;
  /** シミュレーション Google Calendar（Service Account） */
  GOOGLE_SIMULATION_CALENDAR_ID?: string;
  GOOGLE_SIMULATION_SERVICE_ACCOUNT_EMAIL?: string;
  GOOGLE_SIMULATION_PRIVATE_KEY?: string;
  /** 3D印刷 Discord 通知 */
  DISCORD_WEBHOOK_URL?: string;
  /** シミュレーション Discord 通知 */
  DISCORD_SIMULATION_WEBHOOK_URL?: string;
  /** R2 S3 API（presigned URL 用・Cloudflare ダッシュボードで発行） */
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
  R2_ACCOUNT_ID?: string;
  R2_BUCKET_NAME?: string;
  /** AWS EC2（FDS テスト実行） */
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AWS_REGION?: string;
  /** FDS 入り AMI（/opt/fds/bin/fds があること） */
  AWS_EC2_FDS_AMI_ID?: string;
  /** 既定: t3.micro */
  AWS_EC2_INSTANCE_TYPE?: string;
  AWS_EC2_SUBNET_ID?: string;
  AWS_EC2_SECURITY_GROUP_ID?: string;
  /** EC2 user-data → ScienceHUB 完了通知用 */
  FDS_JOB_CALLBACK_SECRET?: string;
  /** Firebase / Identity Platform（シミュレーション電話認証） */
  FIREBASE_PROJECT_ID?: string;
  FIREBASE_WEB_API_KEY?: string;
  FIREBASE_APP_ID?: string;
  FIREBASE_AUTH_DOMAIN?: string;
  /** 同意文バージョン ID（docs/legal/sim-sms-consent-ja.md と一致） */
  SIM_SMS_CONSENT_VERSION?: string;
  /** Google Gemini API（FDS 一次審査） */
  GEMINI_API_KEY?: string;
  GEMINI_FDS_REVIEW_MODEL?: string;
  /** サードパーティ対話・要件（既定 gemini-2.0-flash-lite 等） */
  GEMINI_TP_LITE_MODEL?: string;
  /** サードパーティレビュー・計画・通常編集（既定 gemini-2.5-flash 等） */
  GEMINI_TP_FLASH_MODEL?: string;
  /** サードパーティリトライ編集・全文 patch（既定 gemini-3.5-flash 等） */
  GEMINI_TP_HIGH_MODEL?: string;
  /** サードパーティ実装/検証 Worker のベース URL */
  TP_PIPELINE_WORKER_URL?: string;
  /** サードパーティ実装/検証 Worker 内部認証 */
  TP_PIPELINE_WORKER_SECRET?: string;
  /** サードパーティ AI 1日あたりのユーザーメッセージ上限（既定 30） */
  TP_MAX_DAILY_TURNS?: string;
  /** 実装タスクの並列バッチ上限（1〜3、既定 1） */
  TP_IMPLEMENT_PARALLEL?: string;
  /** メンテエージェント 1 ターンあたりのツールラウンド上限（既定 6） */
  TP_MAX_MAINTAIN_TOOL_ROUNDS?: string;
  /** ジョブ記録用 FDS バージョン表示 */
  FDS_SOLVER_VERSION?: string;
  /** 一次審査プロンプト用 FDS 構文リファレンス全文の上書き（未設定時は組み込み要約） */
  FDS_REVIEW_SYNTAX_REFERENCE?: string;
  /** OpenFOAM 入り AMI（/opt/openfoam 等） */
  AWS_EC2_OPENFOAM_AMI_ID?: string;
  /** EC2 user-data → ScienceHUB 完了通知用（OpenFOAM） */
  OPENFOAM_JOB_CALLBACK_SECRET?: string;
  /** ジョブ記録用 OpenFOAM バージョン表示 */
  OPENFOAM_SOLVER_VERSION?: string;
  /** Google Gemini API（OpenFOAM 一次審査） */
  GEMINI_OPENFOAM_REVIEW_MODEL?: string;
  /** 一次審査プロンプト用 OpenFOAM 構文リファレンス全文の上書き */
  OPENFOAM_REVIEW_SYNTAX_REFERENCE?: string;
  /** 画像変換 Worker（Cloudflare Images） */
  IMAGE_CONVERTER?: Fetcher;
  /** 画像変換 Worker 内部認証 */
  IMAGE_CONVERTER_WORKER_SECRET?: string;
}

export interface RoleRow {
  slug: string;
  display_name: string;
  is_admin: number;
  color?: string;
  position?: number;
  weight?: number;
  created_at: number;
}

export interface UserRow {
  id: string;
  username: string;
  email: string;
  display_name: string;
  role_slug: string;
  password_hash: string;
  avatar_url: string | null;
  homeroom: string | null;
  student_number: number | null;
  student_name: string | null;
  phone_e164?: string | null;
  sim_phone_verified_at?: string | null;
  created_at: number;
  updated_at: number;
}

export interface SessionUser {
  id: string;
  username: string;
  email: string;
  display_name: string;
  role_slug: string;
  avatar_url: string | null;
  roles: Array<{ slug: string; display_name: string; color: string; is_admin: boolean }>;
  is_admin: boolean;
}

export const SESSION_COOKIE = "sciencehub_session";
export const OAUTH_STATE_COOKIE = "sciencehub_oauth_state";
export const OAUTH_STATE_TTL_SEC = 600;
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

/** JSON エラーレスポンスを返す */
export function jsonError(message: string, status = 400): Response {
  return Response.json({ error: message }, { status });
}

/** ランダム ID を生成する */
export function createId(prefix: string): string {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${prefix}_${hex}`;
}

/** クッキー文字列からセッション ID を取得する */
export function getSessionIdFromCookie(request: Request): string | null {
  const cookie = request.headers.get("Cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

/** セッションクッキーをセットする */
export function setSessionCookie(
  sessionId: string,
  maxAgeSec: number,
  secure = false
): string {
  const secureFlag = secure ? "; Secure" : "";
  return `${SESSION_COOKIE}=${encodeURIComponent(sessionId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSec}${secureFlag}`;
}

/** セッションクッキーを削除する */
export function clearSessionCookie(secure = false): string {
  const secureFlag = secure ? "; Secure" : "";
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureFlag}`;
}

/** OAuth state Cookie をセットする */
export function setOAuthStateCookie(
  value: string,
  maxAgeSec: number,
  secure = false
): string {
  const secureFlag = secure ? "; Secure" : "";
  return `${OAUTH_STATE_COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSec}${secureFlag}`;
}

/** OAuth state Cookie を削除する */
export function clearOAuthStateCookie(secure = false): string {
  const secureFlag = secure ? "; Secure" : "";
  return `${OAUTH_STATE_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureFlag}`;
}

/** 現在時刻（ミリ秒） */
export function now(): number {
  return Date.now();
}
