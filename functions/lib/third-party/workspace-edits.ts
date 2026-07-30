/**
 * サードパーティ — index.html 行単位編集
 */

export const MAX_EDIT_OPS = 20;
export const MAX_EDIT_CONTENT_CHARS = 8192;

export type WorkspaceEditOp =
  | {
      op: "replace_lines";
      start_line: number;
      end_line: number;
      content: string;
    }
  | { op: "insert_after"; line: number; content: string }
  | { op: "insert_before"; line: number; content: string }
  | { op: "delete_lines"; start_line: number; end_line: number };

export type ApplyEditsResult =
  | { ok: true; text: string }
  | { ok: false; error: string; failedAt?: number };

/** プロンプト用 L001: 形式 */
export function formatNumberedLines(text: string): string {
  const lines = text.split("\n");
  const pad = String(lines.length).length;
  return lines
    .map((line, i) => {
      const n = String(i + 1).padStart(pad, "0");
      return `L${n}: ${line}`;
    })
    .join("\n");
}

/** 失敗時の周辺行プレビュー */
export function previewEditContext(
  text: string,
  startLine: number,
  endLine: number,
  padding = 3
): string {
  const lines = text.split("\n");
  const total = lines.length;
  const start = Math.max(1, startLine - padding);
  const end = Math.min(total, endLine + padding);
  return formatNumberedLines(lines.slice(start - 1, end).join("\n"));
}

function validateEditOp(
  op: WorkspaceEditOp,
  lineCount: number,
  index: number
): string | null {
  const contentLen = (c: string | undefined) => (c ?? "").length;

  switch (op.op) {
    case "replace_lines": {
      if (op.start_line < 1 || op.end_line < op.start_line) {
        return `編集 ${index + 1}: replace_lines の行範囲が不正です`;
      }
      if (op.end_line > lineCount) {
        return `編集 ${index + 1}: replace_lines の end_line (${op.end_line}) がファイル行数 (${lineCount}) を超えています`;
      }
      if (contentLen(op.content) > MAX_EDIT_CONTENT_CHARS) {
        return `編集 ${index + 1}: content が長すぎます（上限 ${MAX_EDIT_CONTENT_CHARS} 文字）`;
      }
      return null;
    }
    case "delete_lines": {
      if (op.start_line < 1 || op.end_line < op.start_line) {
        return `編集 ${index + 1}: delete_lines の行範囲が不正です`;
      }
      if (op.end_line > lineCount) {
        return `編集 ${index + 1}: delete_lines の end_line (${op.end_line}) がファイル行数 (${lineCount}) を超えています`;
      }
      return null;
    }
    case "insert_after":
    case "insert_before": {
      if (op.line < 0 || op.line > lineCount) {
        return `編集 ${index + 1}: ${op.op} の line (${op.line}) が範囲外です（1–${lineCount}）`;
      }
      if (contentLen(op.content) > MAX_EDIT_CONTENT_CHARS) {
        return `編集 ${index + 1}: content が長すぎます`;
      }
      return null;
    }
    default:
      return `編集 ${index + 1}: 不明な op`;
  }
}

/** 編集を降順で適用（行番号は元ファイル基準） */
export function applyWorkspaceEdits(
  text: string,
  edits: WorkspaceEditOp[]
): ApplyEditsResult {
  if (!edits.length) {
    return { ok: false, error: "edits が空です" };
  }
  if (edits.length > MAX_EDIT_OPS) {
    return { ok: false, error: `編集は最大 ${MAX_EDIT_OPS} 件までです` };
  }

  const lines = text.split("\n");
  const lineCount = lines.length;

  for (let i = 0; i < edits.length; i++) {
    const err = validateEditOp(edits[i], lineCount, i);
    if (err) return { ok: false, error: err, failedAt: i };
  }

  const sorted = [...edits].map((e, i) => ({ e, i })).sort((a, b) => {
    const keyA = editSortKey(a.e);
    const keyB = editSortKey(b.e);
    return keyB - keyA;
  });

  const working = [...lines];
  for (const { e, i } of sorted) {
    const currentCount = working.length;
    const err = validateEditOp(e, currentCount, i);
    if (err) {
      return { ok: false, error: `${err}（適用順で行数が変化した可能性）`, failedAt: i };
    }

    switch (e.op) {
      case "replace_lines": {
        const newLines = e.content.split("\n");
        working.splice(e.start_line - 1, e.end_line - e.start_line + 1, ...newLines);
        break;
      }
      case "delete_lines":
        working.splice(e.start_line - 1, e.end_line - e.start_line + 1);
        break;
      case "insert_after": {
        const ins = e.content.split("\n");
        working.splice(e.line, 0, ...ins);
        break;
      }
      case "insert_before": {
        const insBefore = e.content.split("\n");
        working.splice(e.line - 1, 0, ...insBefore);
        break;
      }
    }
  }

  return { ok: true, text: working.join("\n") };
}

function editSortKey(op: WorkspaceEditOp): number {
  switch (op.op) {
    case "replace_lines":
      return op.start_line;
    case "delete_lines":
      return op.start_line;
    case "insert_after":
      return op.line + 0.5;
    case "insert_before":
      return op.line - 0.5;
  }
}

/** 編集内容の短いサマリ（SSE activity 用） */
export function summarizeEdits(edits: WorkspaceEditOp[]): string {
  if (!edits.length) return "編集を適用中…";
  const parts = edits.slice(0, 3).map((e) => {
    switch (e.op) {
      case "replace_lines":
        return `行 ${e.start_line}–${e.end_line} を置換`;
      case "delete_lines":
        return `行 ${e.start_line}–${e.end_line} を削除`;
      case "insert_after":
        return `行 ${e.line} の後に挿入`;
      case "insert_before":
        return `行 ${e.line} の前に挿入`;
    }
  });
  const more = edits.length > 3 ? ` 他 ${edits.length - 3} 件` : "";
  return parts.join("、") + more;
}

/** Gemini JSON から編集配列を正規化 */
export function normalizeWorkspaceEdits(raw: unknown): WorkspaceEditOp[] | null {
  if (!Array.isArray(raw)) return null;
  const out: WorkspaceEditOp[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") return null;
    const rec = item as Record<string, unknown>;
    const op = rec.op;
    if (op === "replace_lines") {
      if (
        typeof rec.start_line !== "number" ||
        typeof rec.end_line !== "number" ||
        typeof rec.content !== "string"
      ) {
        return null;
      }
      out.push({
        op: "replace_lines",
        start_line: rec.start_line,
        end_line: rec.end_line,
        content: rec.content,
      });
    } else if (op === "delete_lines") {
      if (typeof rec.start_line !== "number" || typeof rec.end_line !== "number") {
        return null;
      }
      out.push({
        op: "delete_lines",
        start_line: rec.start_line,
        end_line: rec.end_line,
      });
    } else if (op === "insert_after" || op === "insert_before") {
      if (typeof rec.line !== "number" || typeof rec.content !== "string") {
        return null;
      }
      out.push({
        op,
        line: rec.line,
        content: rec.content,
      });
    } else {
      return null;
    }
  }
  return out;
}
