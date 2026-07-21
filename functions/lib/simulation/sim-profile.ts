/**
 * シミュレーション依頼用のユーザープロフィール（HR・出席番号・名前）
 */

import { isValidHomeroom } from "./homeroom";

export interface PrintUserProfile {
  homeroom: string | null;
  student_number: number | null;
  student_name: string | null;
}

export interface PrintProfileInput {
  homeroom: string;
  student_number: number;
  student_name: string;
}

/** プロフィールが予約可能な状態か */
export function isSimProfileComplete(profile: PrintUserProfile): boolean {
  return Boolean(
    profile.homeroom &&
      profile.student_number != null &&
      profile.student_number > 0 &&
      profile.student_name?.trim()
  );
}

/** 出席番号のバリデーション */
export function validateStudentNumber(value: number): string | null {
  if (!Number.isInteger(value) || value < 1 || value > 99) {
    return "出席番号は 1〜99 の整数で入力してください";
  }
  return null;
}

/** 生徒名のバリデーション */
export function validateStudentName(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "名前を入力してください";
  if (trimmed.length > 50) return "名前は50文字以内で入力してください";
  return null;
}

/** シミュレーションプロフィール入力のバリデーション */
export function validatePrintProfileInput(input: PrintProfileInput): string | null {
  if (!isValidHomeroom(String(input.homeroom))) {
    return "ホームルームは 101〜109、201〜209、301〜309 から選択してください";
  }
  const numError = validateStudentNumber(Number(input.student_number));
  if (numError) return numError;
  const nameError = validateStudentName(String(input.student_name));
  if (nameError) return nameError;
  return null;
}

/** users テーブルからシミュレーションプロフィールを取得 */
export async function getSimUserProfile(
  db: D1Database,
  userId: string
): Promise<PrintUserProfile | null> {
  const row = await db
    .prepare(
      "SELECT homeroom, student_number, student_name FROM users WHERE id = ?"
    )
    .bind(userId)
    .first<PrintUserProfile>();

  return row ?? null;
}

/** users テーブルのシミュレーションプロフィールを更新 */
export async function updatePrintUserProfile(
  db: D1Database,
  userId: string,
  input: PrintProfileInput
): Promise<PrintUserProfile> {
  const validationError = validatePrintProfileInput(input);
  if (validationError) {
    throw new Error(validationError);
  }

  await db
    .prepare(
      `UPDATE users SET homeroom = ?, student_number = ?, student_name = ?, updated_at = ? WHERE id = ?`
    )
    .bind(
      String(input.homeroom),
      Number(input.student_number),
      String(input.student_name).trim(),
      Date.now(),
      userId
    )
    .run();

  const profile = await getSimUserProfile(db, userId);
  if (!profile) {
    throw new Error("プロフィールの更新に失敗しました");
  }
  return profile;
}
