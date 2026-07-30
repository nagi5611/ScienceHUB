/**
 * 段階実装 — 編集先ファイルと行範囲の形式化
 */

import type { ImplementationTask } from "./schemas";
import type { WorkspaceEditOp } from "./workspace-edits";

export const IMPLEMENT_EDIT_TARGET_PATH = "index.html";

const PARALLEL_SAFE_TARGETS = new Set(["markup", "styles"]);
const MAX_PARALLEL_BATCH = 3;

/** 2 タスクを同一バッチで並列実行可能か */
export function canParallelizeTargets(
  a: ImplementationTask["target"],
  b: ImplementationTask["target"]
): boolean {
  if (a === b) return false;
  if (a === "skeleton" || b === "skeleton") return false;
  if (a === "polish" || b === "polish") return false;
  if (a === "script" || b === "script") return false;
  return PARALLEL_SAFE_TARGETS.has(a) && PARALLEL_SAFE_TARGETS.has(b);
}

export function maxParallelBatchSize(): number {
  return MAX_PARALLEL_BATCH;
}

type LineBlock = { open: number; close: number };

function findStyleBlock(lines: string[]): LineBlock | null {
  const open = lines.findIndex((l) => /<style\b/i.test(l));
  if (open < 0) return null;
  const close = lines.findIndex((l, i) => i > open && /<\/style>/i.test(l));
  if (close < 0) return null;
  return { open, close };
}

function findLastScriptBlock(lines: string[]): LineBlock | null {
  let last: LineBlock | null = null;
  for (let i = 0; i < lines.length; i++) {
    if (/<script\b/i.test(lines[i] ?? "")) {
      const close = lines.findIndex(
        (l, j) => j > i && /<\/script>/i.test(l)
      );
      if (close >= 0) {
        last = { open: i, close };
      }
    }
  }
  return last;
}

function findMainBlock(lines: string[]): LineBlock | null {
  const open = lines.findIndex((l) => /<main\b/i.test(l));
  if (open < 0) return null;
  if (/<\/main>/i.test(lines[open] ?? "")) {
    return { open, close: open };
  }
  const close = lines.findIndex((l, i) => i > open && /<\/main>/i.test(l));
  if (close < 0) return null;
  return { open, close };
}

function blockInnerLines1Based(block: LineBlock): { start: number; end: number } {
  const open1 = block.open + 1;
  const close1 = block.close + 1;
  if (close1 <= open1 + 1) {
    return { start: open1, end: close1 };
  }
  return { start: open1 + 1, end: close1 - 1 };
}

function formatLineRange(label: string, start: number, end: number): string {
  return `${label}: L${start}–L${end}`;
}

/** プロンプト用: 編集先と許可行範囲を明示 */
export function describeImplementEditScopes(
  html: string,
  taskTarget: ImplementationTask["target"]
): string {
  const lines = html.split("\n");
  const parts: string[] = [
    `編集対象ファイル: ${IMPLEMENT_EDIT_TARGET_PATH}`,
    "行番号は以下の全文の L001: 形式と一致すること。",
  ];

  const style = findStyleBlock(lines);
  const script = findLastScriptBlock(lines);
  const main = findMainBlock(lines);

  if (style) {
    const inner = blockInnerLines1Based(style);
    parts.push(
      formatLineRange(
        `<style> 内（styles 用）`,
        inner.start,
        inner.end
      )
    );
  }
  if (script) {
    const inner = blockInnerLines1Based(script);
    parts.push(
      formatLineRange(
        `<script> 内（script 用）`,
        inner.start,
        inner.end
      )
    );
  }
  if (main) {
    const inner = blockInnerLines1Based(main);
    parts.push(
      formatLineRange(`<main> 内（markup 用）`, inner.start, inner.end)
    );
  }

  switch (taskTarget) {
    case "styles":
      parts.push("今回のタスク: styles — edits は <style> 内の行のみ触ること。");
      break;
    case "script":
      parts.push(
        "今回のタスク: script — edits は最後の <script> 内の行のみ触ること。"
      );
      break;
    case "markup":
      parts.push("今回のタスク: markup — edits は <main> 内の行のみ触ること。");
      break;
    case "polish":
      parts.push(
        "今回のタスク: polish — 小さな修正。骨格タグの削除や全文置換は禁止。"
      );
      break;
    default:
      break;
  }

  return parts.join("\n");
}

function lineInRange(line: number, start: number, end: number): boolean {
  return line >= start && line <= end;
}

function contentForbiddenForTarget(
  content: string,
  taskTarget: ImplementationTask["target"]
): string | null {
  const c = content;
  if (/<!DOCTYPE/i.test(c) || /<html\b/i.test(c)) {
    return "content にドキュメント骨格を含めないでください";
  }
  if (taskTarget === "styles") {
    if (/<script\b/i.test(c)) {
      return "styles タスクの content に <script> を含めないでください";
    }
    if (/<style\b/i.test(c)) {
      return "styles タスクでは <style> タグではなく中身だけを edits に書く";
    }
  }
  if (taskTarget === "script") {
    if (/<style\b/i.test(c)) {
      return "script タスクの content に <style> を含めないでください";
    }
    if (/<script\b/i.test(c)) {
      return "script タスクでは <script> タグではなく中身だけを edits に書く";
    }
  }
  if (taskTarget === "markup") {
    if (/<style\b/i.test(c) || /<script\b/i.test(c)) {
      return "markup タスクでは CSS/JS を書かず HTML フラグメントのみ";
    }
  }
  return null;
}

/** サーバー側: 形式化 edits がタスク範囲を守っているか */
export function validateImplementEdits(
  html: string,
  edits: WorkspaceEditOp[],
  taskTarget: ImplementationTask["target"]
): string | null {
  if (taskTarget === "skeleton") {
    return "骨格タスクは edits を使いません";
  }

  const lines = html.split("\n");
  const lineCount = lines.length;

  for (let i = 0; i < edits.length; i++) {
    const op = edits[i];
    const content =
      op.op === "replace_lines" || op.op === "insert_after" || op.op === "insert_before"
        ? op.content
        : "";
    const forbidden = contentForbiddenForTarget(content, taskTarget);
    if (forbidden) {
      return `編集 ${i + 1}: ${forbidden}`;
    }

    if (op.op === "replace_lines" && op.start_line === 1 && op.end_line >= lineCount) {
      return `編集 ${i + 1}: 全文 replace は禁止です`;
    }
  }

  if (taskTarget === "polish") {
    return null;
  }

  const linesArr = html.split("\n");
  let allowed: { start: number; end: number } | null = null;
  if (taskTarget === "styles") {
    const block = findStyleBlock(linesArr);
    if (!block) return "HTML に <style> がありません";
    allowed = blockInnerLines1Based(block);
  } else if (taskTarget === "script") {
    const block = findLastScriptBlock(linesArr);
    if (!block) return "HTML に <script> がありません";
    allowed = blockInnerLines1Based(block);
  } else if (taskTarget === "markup") {
    const block = findMainBlock(linesArr);
    if (!block) return "HTML に <main> がありません";
    allowed = blockInnerLines1Based(block);
  }

  if (!allowed) return null;

  for (let i = 0; i < edits.length; i++) {
    const op = edits[i];
    const refLines: number[] = [];
    switch (op.op) {
      case "replace_lines":
        for (let L = op.start_line; L <= op.end_line; L++) refLines.push(L);
        break;
      case "delete_lines":
        for (let L = op.start_line; L <= op.end_line; L++) refLines.push(L);
        break;
      case "insert_after":
        refLines.push(op.line);
        break;
      case "insert_before":
        refLines.push(op.line);
        break;
    }
    for (const L of refLines) {
      if (!lineInRange(L, allowed.start, allowed.end)) {
        return `編集 ${i + 1}: 行 ${L} は許可範囲 L${allowed.start}–L${allowed.end} 外です`;
      }
    }
    if (op.op === "insert_after" || op.op === "insert_before") {
      if (!lineInRange(op.line, allowed.start - 1, allowed.end + 1)) {
        return `編集 ${i + 1}: 挿入基準行 ${op.line} が許可範囲外です`;
      }
    }
  }

  return null;
}
