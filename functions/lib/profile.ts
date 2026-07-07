/**
 * プロフィール更新
 */

import { emailExists } from "./auth";
import { getDb } from "./db";
import type { Env, UserRow } from "./types";
import { jsonError, now } from "./types";
import { userIconPublicUrl } from "./user-icons";
import { validateDisplayName, validatePassword } from "./users";
import { hashPassword, verifyPassword } from "./password";
import {
  validatePrintProfileInput,
  type PrintProfileInput,
} from "./3dprint/print-profile";

export function validateEmail(email: string): string | null {
  const value = email.trim();
  if (!value) {
    return "メールアドレスを入力してください";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "有効なメールアドレスを入力してください";
  }
  if (value.length > 254) {
    return "メールアドレスが長すぎます";
  }
  return null;
}

export interface ProfileUpdateInput {
  display_name?: string;
  email?: string;
  homeroom?: string;
  student_number?: number;
  student_name?: string;
}

export interface PasswordChangeInput {
  current_password: string;
  new_password: string;
}

/** ログインパスワードを変更する */
export async function changeUserPassword(
  env: Env,
  userId: string,
  input: PasswordChangeInput
): Promise<{ ok: true } | Response> {
  const db = getDb(env);
  const user = await db
    .prepare("SELECT password_hash FROM users WHERE id = ?")
    .bind(userId)
    .first<{ password_hash: string }>();

  if (!user) {
    return jsonError("ユーザーが見つかりません", 404);
  }

  if (!user.password_hash) {
    return jsonError("パスワードが設定されていないアカウントです", 400);
  }

  const currentPassword = input.current_password ?? "";
  const newPassword = input.new_password ?? "";

  if (!currentPassword) {
    return jsonError("現在のパスワードを入力してください", 400);
  }

  const valid = await verifyPassword(currentPassword, user.password_hash);
  if (!valid) {
    return jsonError("現在のパスワードが正しくありません", 401);
  }

  const passwordError = validatePassword(newPassword);
  if (passwordError) {
    return jsonError(passwordError, 400);
  }

  if (currentPassword === newPassword) {
    return jsonError("新しいパスワードは現在のパスワードと異なる必要があります", 400);
  }

  const passwordHash = await hashPassword(newPassword);
  await db
    .prepare("UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?")
    .bind(passwordHash, now(), userId)
    .run();

  return { ok: true };
}

/** プロフィールを更新する */
export async function updateUserProfile(
  env: Env,
  userId: string,
  input: ProfileUpdateInput
): Promise<{ user: UserRow; avatar_url: string | null } | Response> {
  const db = getDb(env);

  const current = await db
    .prepare(
      `SELECT id, username, email, display_name, role_slug, password_hash, avatar_url,
              homeroom, student_number, student_name, created_at, updated_at
       FROM users WHERE id = ?`
    )
    .bind(userId)
    .first<UserRow>();

  if (!current) {
    return jsonError("ユーザーが見つかりません", 404);
  }

  const displayName =
    input.display_name !== undefined
      ? input.display_name.trim()
      : current.display_name;
  const email =
    input.email !== undefined ? input.email.trim().toLowerCase() : current.email;

  if (input.display_name !== undefined) {
    const nameError = validateDisplayName(displayName);
    if (nameError) return jsonError(nameError, 400);
  }

  if (input.email !== undefined) {
    const emailError = validateEmail(email);
    if (emailError) return jsonError(emailError, 400);
    if (await emailExists(db, email, userId)) {
      return jsonError("このメールアドレスは既に登録されています", 400);
    }
  }

  let homeroom = current.homeroom;
  let studentNumber = current.student_number;
  let studentName = current.student_name;

  const hasPrintFields =
    input.homeroom !== undefined ||
    input.student_number !== undefined ||
    input.student_name !== undefined;

  if (hasPrintFields) {
    const printInput: PrintProfileInput = {
      homeroom: input.homeroom ?? current.homeroom ?? "",
      student_number: input.student_number ?? current.student_number ?? 0,
      student_name: input.student_name ?? current.student_name ?? "",
    };
    const printError = validatePrintProfileInput(printInput);
    if (printError) return jsonError(printError, 400);
    homeroom = printInput.homeroom;
    studentNumber = printInput.student_number;
    studentName = printInput.student_name.trim();
  }

  const timestamp = now();
  await db
    .prepare(
      `UPDATE users SET display_name = ?, email = ?, homeroom = ?, student_number = ?, student_name = ?, updated_at = ? WHERE id = ?`
    )
    .bind(displayName, email, homeroom, studentNumber, studentName, timestamp, userId)
    .run();

  const user = await db
    .prepare(
      `SELECT id, username, email, display_name, role_slug, password_hash, avatar_url,
              homeroom, student_number, student_name, created_at, updated_at
       FROM users WHERE id = ?`
    )
    .bind(userId)
    .first<UserRow>();

  if (!user) {
    return jsonError("プロフィールの更新に失敗しました", 500);
  }

  const avatarUrl = user.avatar_url;

  return { user, avatar_url: avatarUrl };
}

/** アイコンアップロード後に avatar_url を更新する */
export async function markUserIconUploaded(
  env: Env,
  userId: string
): Promise<string | null> {
  const db = getDb(env);
  const user = await db
    .prepare("SELECT username FROM users WHERE id = ?")
    .bind(userId)
    .first<{ username: string }>();

  if (!user) return null;

  const timestamp = now();
  const avatarUrl = userIconPublicUrl(user.username, timestamp);

  await db
    .prepare(
      "UPDATE users SET avatar_url = ?, updated_at = ? WHERE id = ?"
    )
    .bind(avatarUrl, timestamp, userId)
    .run();

  return avatarUrl;
}
