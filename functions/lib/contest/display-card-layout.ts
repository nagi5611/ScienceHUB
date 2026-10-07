// functions/lib/contest/display-card-layout.ts

export const CONTEST_DISPLAY_CARD_LAYOUT_KEY = 'contest_display_card_layout';

export type DisplayCardMarkKey = 'full_time' | 'part_time' | 'tobe_branch';

export type DisplayCardMarkLayout = {
  left: number;
  top: number;
  size: number;
};

export type DisplayCardTextFieldLayout = {
  left: number;
  top: number;
  width: number;
  fontSize: number;
};

export type DisplayCardTitleLayout = DisplayCardTextFieldLayout & {
  maxLines: number;
};

export type DisplayCardCommentLayout = DisplayCardTextFieldLayout & {
  lineHeight: number;
  maxLines: number;
  /** Optional absolute top (% of card) per comment line index */
  lineTops?: number[];
  /** Optional absolute left (% of card) per comment line index */
  lineLefts?: number[];
  /** Optional absolute right edge (% of card) per comment line — wrap width */
  lineRights?: number[];
};

export const DISPLAY_CARD_COMMENT_MAX_LINES = 6;

export type DisplayCardLayout = {
  marks: Record<DisplayCardMarkKey, DisplayCardMarkLayout>;
  year: DisplayCardTextFieldLayout;
  classGroup: DisplayCardTextFieldLayout;
  name: DisplayCardTextFieldLayout;
  title: DisplayCardTitleLayout;
  comment: DisplayCardCommentLayout;
};

/** Default overlay (% of 800×450 card). Kept in sync with display-card-preview.js */
export const DEFAULT_DISPLAY_CARD_LAYOUT: DisplayCardLayout = {
  marks: {
    full_time: { left: 20.5, top: 20, size: 7.5 },
    part_time: { left: 32, top: 20, size: 7.5 },
    tobe_branch: { left: 42.5, top: 20, size: 7.5 },
  },
  year: { left: 58.5, top: 19.2, width: 4, fontSize: 16 },
  classGroup: { left: 66, top: 19.2, width: 6, fontSize: 16 },
  name: { left: 74, top: 19.2, width: 22, fontSize: 16 },
  title: { left: 22, top: 29.2, width: 74, fontSize: 15, maxLines: 1 },
  comment: {
    left: 22,
    top: 37,
    width: 74,
    fontSize: 13,
    lineHeight: 1.52,
    maxLines: DISPLAY_CARD_COMMENT_MAX_LINES,
  },
};

const MARK_KEYS: DisplayCardMarkKey[] = ['full_time', 'part_time', 'tobe_branch'];

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function clampPercent(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

function readTextField(
  raw: unknown,
  fallback: DisplayCardTextFieldLayout,
  extra?: {
    maxLines?: number;
    lineHeight?: number;
    lineTops?: number[];
    lineLefts?: number[];
    lineRights?: number[];
    maxLinesCap?: number;
  }
): DisplayCardTextFieldLayout & {
  maxLines?: number;
  lineHeight?: number;
  lineTops?: number[];
  lineLefts?: number[];
  lineRights?: number[];
} {
  const obj = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const out: DisplayCardTextFieldLayout & {
    maxLines?: number;
    lineHeight?: number;
    lineTops?: number[];
    lineLefts?: number[];
    lineRights?: number[];
  } = {
    left: isFiniteNumber(obj.left) ? clampPercent(obj.left) : fallback.left,
    top: isFiniteNumber(obj.top) ? clampPercent(obj.top) : fallback.top,
    width: isFiniteNumber(obj.width) ? clampPercent(obj.width, 1, 100) : fallback.width,
    fontSize: isFiniteNumber(obj.fontSize)
      ? clampPercent(obj.fontSize, 6, 48)
      : fallback.fontSize,
  };
  if (extra?.maxLines !== undefined) {
    const ml = isFiniteNumber(obj.maxLines) ? Math.round(obj.maxLines) : extra.maxLines;
    const cap = extra.maxLinesCap ?? 12;
    out.maxLines = Math.min(cap, Math.max(1, ml));
  }
  if (extra?.lineHeight !== undefined) {
    out.lineHeight = isFiniteNumber(obj.lineHeight)
      ? clampPercent(obj.lineHeight, 0.8, 3)
      : extra.lineHeight;
  }
  if (Array.isArray(obj.lineTops)) {
    const tops: number[] = [];
    for (const entry of obj.lineTops) {
      if (!isFiniteNumber(entry)) continue;
      tops.push(clampPercent(entry));
      if (tops.length >= (out.maxLines ?? extra?.maxLines ?? 6)) break;
    }
    if (tops.length > 0) out.lineTops = tops;
  } else if (extra?.lineTops) {
    out.lineTops = extra.lineTops;
  }
  if (Array.isArray(obj.lineLefts)) {
    const lefts: number[] = [];
    for (const entry of obj.lineLefts) {
      if (!isFiniteNumber(entry)) continue;
      lefts.push(clampPercent(entry));
      if (lefts.length >= (out.maxLines ?? extra?.maxLines ?? 6)) break;
    }
    if (lefts.length > 0) out.lineLefts = lefts;
  } else if (extra?.lineLefts) {
    out.lineLefts = extra.lineLefts;
  }
  if (Array.isArray(obj.lineRights)) {
    const rights: number[] = [];
    for (const entry of obj.lineRights) {
      if (!isFiniteNumber(entry)) continue;
      rights.push(clampPercent(entry));
      if (rights.length >= (out.maxLines ?? extra?.maxLines ?? DISPLAY_CARD_COMMENT_MAX_LINES)) break;
    }
    if (rights.length > 0) out.lineRights = rights;
  } else if (extra?.lineRights) {
    out.lineRights = extra.lineRights;
  }
  return out;
}

/**
 * Parses stored JSON into a validated layout merged with defaults.
 * @returns layout or an error message for API responses
 */
export function parseDisplayCardLayout(
  input: unknown
): { ok: true; layout: DisplayCardLayout } | { ok: false; error: string } {
  if (input === null || input === undefined) {
    return { ok: true, layout: DEFAULT_DISPLAY_CARD_LAYOUT };
  }
  if (typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, error: 'レイアウトの形式が不正です' };
  }

  const raw = input as Record<string, unknown>;
  const defaultMarks = DEFAULT_DISPLAY_CARD_LAYOUT.marks;
  const marksRaw =
    raw.marks && typeof raw.marks === 'object' && !Array.isArray(raw.marks)
      ? (raw.marks as Record<string, unknown>)
      : {};

  const marks: Record<DisplayCardMarkKey, DisplayCardMarkLayout> = {
    full_time: { ...defaultMarks.full_time },
    part_time: { ...defaultMarks.part_time },
    tobe_branch: { ...defaultMarks.tobe_branch },
  };

  for (const key of MARK_KEYS) {
    const m = marksRaw[key];
    if (!m || typeof m !== 'object' || Array.isArray(m)) continue;
    const mo = m as Record<string, unknown>;
    marks[key] = {
      left: isFiniteNumber(mo.left) ? clampPercent(mo.left) : marks[key].left,
      top: isFiniteNumber(mo.top) ? clampPercent(mo.top) : marks[key].top,
      size: isFiniteNumber(mo.size) ? clampPercent(mo.size, 1, 30) : marks[key].size,
    };
  }

  const titleParsed = readTextField(raw.title, DEFAULT_DISPLAY_CARD_LAYOUT.title, {
    maxLines: DEFAULT_DISPLAY_CARD_LAYOUT.title.maxLines,
  });
  const commentParsed = readTextField(raw.comment, DEFAULT_DISPLAY_CARD_LAYOUT.comment, {
    maxLines: DEFAULT_DISPLAY_CARD_LAYOUT.comment.maxLines,
    maxLinesCap: DISPLAY_CARD_COMMENT_MAX_LINES,
    lineHeight: DEFAULT_DISPLAY_CARD_LAYOUT.comment.lineHeight,
  });

  const layout: DisplayCardLayout = {
    marks,
    year: readTextField(raw.year, DEFAULT_DISPLAY_CARD_LAYOUT.year) as DisplayCardTextFieldLayout,
    classGroup: readTextField(
      raw.classGroup,
      DEFAULT_DISPLAY_CARD_LAYOUT.classGroup
    ) as DisplayCardTextFieldLayout,
    name: readTextField(raw.name, DEFAULT_DISPLAY_CARD_LAYOUT.name) as DisplayCardTextFieldLayout,
    title: {
      left: titleParsed.left,
      top: titleParsed.top,
      width: titleParsed.width,
      fontSize: titleParsed.fontSize,
      maxLines: titleParsed.maxLines ?? DEFAULT_DISPLAY_CARD_LAYOUT.title.maxLines,
    },
    comment: {
      left: commentParsed.left,
      top: commentParsed.top,
      width: commentParsed.width,
      fontSize: commentParsed.fontSize,
      lineHeight: commentParsed.lineHeight ?? DEFAULT_DISPLAY_CARD_LAYOUT.comment.lineHeight,
      maxLines: commentParsed.maxLines ?? DEFAULT_DISPLAY_CARD_LAYOUT.comment.maxLines,
      lineTops: commentParsed.lineTops,
      lineLefts: commentParsed.lineLefts,
      lineRights: commentParsed.lineRights,
    },
  };

  return { ok: true, layout };
}

/** Reads layout from print_app_settings or returns defaults. */
export async function getDisplayCardLayout(db: D1Database): Promise<DisplayCardLayout> {
  const row = await db
    .prepare('SELECT value FROM print_app_settings WHERE key = ?')
    .bind(CONTEST_DISPLAY_CARD_LAYOUT_KEY)
    .first<{ value: string }>();
  const raw = row?.value?.trim();
  if (!raw) return DEFAULT_DISPLAY_CARD_LAYOUT;
  try {
    const parsed = parseDisplayCardLayout(JSON.parse(raw));
    return parsed.ok ? parsed.layout : DEFAULT_DISPLAY_CARD_LAYOUT;
  } catch {
    return DEFAULT_DISPLAY_CARD_LAYOUT;
  }
}

/** Persists validated layout JSON. */
export async function setDisplayCardLayout(db: D1Database, layout: DisplayCardLayout): Promise<void> {
  const ts = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO print_app_settings (key, value, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
    )
    .bind(CONTEST_DISPLAY_CARD_LAYOUT_KEY, JSON.stringify(layout), ts)
    .run();
}
