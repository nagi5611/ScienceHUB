// functions/lib/contest/contest-validation.ts
import { gradeFromHomeroom, isValidHomeroom } from '../3dprint/homeroom';

export type ContestScheduleType = 'full_time' | 'part_time';

export const CONTEST_TITLE_MAX_LEN = 40;
export const CONTEST_IMPRESSIONS_MAX_LEN = 8000;
export const CONTEST_MEMBER_NAME_MAX_LEN = 50;
export const CONTEST_STUDENT_NAME_MAX_LEN = 50;
export const CONTEST_PART_COUNT_MIN = 2;
export const CONTEST_PART_COUNT_MAX = 20;

/** Validates multi-part options for a contest application. */
export function parseContestMultiPartOptions(
  usesMultipleParts: boolean,
  partCountRaw: unknown
): { uses_multiple_parts: boolean; part_count: number | null } {
  if (!usesMultipleParts) {
    return { uses_multiple_parts: false, part_count: null };
  }
  const partCount = Number(partCountRaw);
  if (
    !Number.isInteger(partCount) ||
    partCount < CONTEST_PART_COUNT_MIN ||
    partCount > CONTEST_PART_COUNT_MAX
  ) {
    throw new Error(
      `パーツ数は${CONTEST_PART_COUNT_MIN}〜${CONTEST_PART_COUNT_MAX}の整数で入力してください`
    );
  }
  return { uses_multiple_parts: true, part_count: partCount };
}

export interface ContestApplicationFieldsInput {
  schedule_type: ContestScheduleType;
  homeroom: string;
  student_number: number;
  student_name: string;
  title: string;
  impressions?: string | null;
}

function normalizeOptionalText(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** Validates homeroom/class for contest schedule type. */
export function validateContestClass(
  scheduleType: ContestScheduleType,
  homeroom: string
): string | null {
  const trimmed = homeroom.trim();
  if (!trimmed) return 'クラスを入力してください';
  if (scheduleType === 'full_time') {
    if (!isValidHomeroom(trimmed)) return 'ホームルームの形式が不正です（例: 301）';
    return null;
  }
  if (trimmed.length > 20) return 'クラスは20文字以内で入力してください';
  return null;
}

/** Normalizes and validates contest application field input. */
export function parseContestApplicationFields(
  input: ContestApplicationFieldsInput
): {
  schedule_type: ContestScheduleType;
  homeroom: string;
  student_number: number;
  student_name: string;
  title: string;
  impressions: string | null;
  grade: number;
} {
  if (!['full_time', 'part_time'].includes(input.schedule_type)) {
    throw new Error('在籍区分が不正です');
  }

  const classError = validateContestClass(input.schedule_type, input.homeroom);
  if (classError) throw new Error(classError);

  if (
    !Number.isInteger(input.student_number) ||
    input.student_number < 1 ||
    input.student_number > 50
  ) {
    throw new Error('出席番号が不正です');
  }

  const studentName = input.student_name.trim();
  if (!studentName) throw new Error('名前を入力してください');
  if (studentName.length > CONTEST_STUDENT_NAME_MAX_LEN) {
    throw new Error('名前が長すぎます');
  }

  const title = normalizeOptionalText(input.title);
  if (!title) throw new Error('タイトルを入力してください');
  if (title.length > CONTEST_TITLE_MAX_LEN) {
    throw new Error('タイトルは40文字以内で入力してください');
  }

  const impressions = normalizeOptionalText(input.impressions ?? null);
  if (impressions && impressions.length > CONTEST_IMPRESSIONS_MAX_LEN) {
    throw new Error('感想が長すぎます');
  }

  const homeroom = input.homeroom.trim();
  const grade =
    input.schedule_type === 'full_time' ? gradeFromHomeroom(homeroom) : 0;

  return {
    schedule_type: input.schedule_type,
    homeroom,
    student_number: input.student_number,
    student_name: studentName,
    title,
    impressions,
    grade,
  };
}

/** Parses member name list from API input. */
export function parseContestMemberNames(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const names: string[] = [];
  for (const item of raw) {
    if (typeof item !== 'string') continue;
    const name = item.trim();
    if (!name) continue;
    if (name.length > CONTEST_MEMBER_NAME_MAX_LEN) {
      throw new Error(`メンバー名は${CONTEST_MEMBER_NAME_MAX_LEN}文字以内にしてください`);
    }
    names.push(name);
  }
  if (names.length > 20) throw new Error('メンバーは20人までです');
  return names;
}

export interface ContestParticipantFields {
  homeroom: string;
  student_number: number;
  student_name: string;
}

function parseParticipantRow(
  scheduleType: ContestScheduleType,
  item: unknown,
  index: number
): ContestParticipantFields {
  if (typeof item !== 'object' || item === null) {
    throw new Error(`参加者${index + 1}の形式が不正です`);
  }
  const row = item as Record<string, unknown>;
  const homeroom = String(row.homeroom ?? row.class ?? '').trim();
  const studentNumber = Number(row.student_number);
  const studentName = String(row.student_name ?? row.name ?? '').trim();

  const classError = validateContestClass(scheduleType, homeroom);
  if (classError) {
    throw new Error(`参加者${index + 1}: ${classError}`);
  }
  if (!Number.isInteger(studentNumber) || studentNumber < 1 || studentNumber > 50) {
    throw new Error(`参加者${index + 1}: 出席番号が不正です`);
  }
  if (!studentName) throw new Error(`参加者${index + 1}: 名前を入力してください`);
  if (studentName.length > CONTEST_STUDENT_NAME_MAX_LEN) {
    throw new Error(`参加者${index + 1}: 名前が長すぎます`);
  }

  return {
    homeroom,
    student_number: studentNumber,
    student_name: studentName,
  };
}

/** Validates participant list (class, number, name per row). */
export function parseContestParticipants(
  scheduleType: ContestScheduleType,
  raw: unknown
): ContestParticipantFields[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error('参加者を1人以上追加してください');
  }
  if (raw.length > 20) throw new Error('参加者は20人までです');
  return raw.map((item, index) => parseParticipantRow(scheduleType, item, index));
}
