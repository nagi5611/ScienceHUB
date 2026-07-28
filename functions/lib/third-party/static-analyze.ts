/**
 * サードパーティ — index.html 静的解析（JS 実行なし）
 */

export interface StaticAnalyzeReport {
  script_block_count: number;
  total_script_chars: number;
  has_clear_rect: boolean;
  has_clear_canvas_fn: boolean;
  clear_related_lines: string[];
  listener_hints: string[];
  redraw_hints: string[];
  brace_balance_warning: boolean;
  quote_balance_warning: boolean;
  summary: string;
}

/** inline script を抽出 */
export function extractInlineScripts(html: string): string[] {
  const scripts: string[] = [];
  const re = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const body = m[1]?.trim();
    if (body && !m[0].includes("src=")) {
      scripts.push(body);
    }
  }
  return scripts;
}

function countChar(s: string, ch: string): number {
  let n = 0;
  for (const c of s) {
    if (c === ch) n++;
  }
  return n;
}

/** HTML/JS の静的ヒューリスティック */
export function analyzeIndexHtml(html: string): StaticAnalyzeReport {
  const scripts = extractInlineScripts(html);
  const combined = scripts.join("\n\n");
  const lines = combined.split("\n");

  const clearRelated: string[] = [];
  const listenerHints: string[] = [];
  const redrawHints: string[] = [];

  const clearPatterns = [
    /clearRect/i,
    /clear\s*\(/i,
    /clearCanvas/i,
    /クリア/i,
  ];
  const listenerPatterns = [
    /addEventListener/i,
    /onclick/i,
    /onpointer/i,
  ];
  const redrawPatterns = [
    /redraw/i,
    /drawAll/i,
    /render/i,
    /requestAnimationFrame/i,
    /paths\s*\./i,
    /localStorage/i,
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (clearPatterns.some((p) => p.test(line))) {
      clearRelated.push(`L${i + 1}: ${line.trim().slice(0, 120)}`);
    }
    if (listenerPatterns.some((p) => p.test(line))) {
      listenerHints.push(`L${i + 1}: ${line.trim().slice(0, 120)}`);
    }
    if (redrawPatterns.some((p) => p.test(line))) {
      redrawHints.push(`L${i + 1}: ${line.trim().slice(0, 120)}`);
    }
  }

  const braces = countChar(combined, "{") - countChar(combined, "}");
  const quotes =
    countChar(combined, '"') % 2 !== 0 || countChar(combined, "'") % 2 !== 0;

  const hasClearRect = /clearRect/i.test(combined);
  const hasClearFn = /function\s+clear|clearCanvas|clearBtn/i.test(combined);

  const parts: string[] = [];
  parts.push(`script ブロック数: ${scripts.length}`);
  if (hasClearRect) parts.push("clearRect 使用あり");
  if (hasClearFn) parts.push("clear 関連関数/識別子あり");
  if (redrawHints.length > 0) {
    parts.push(
      "再描画・ストア関連の記述あり（クリア後に paths 再描画の可能性）"
    );
  }
  if (braces !== 0) parts.push("括弧 `{}` の数が不均衡の可能性");
  if (quotes) parts.push("引用符の閉じ忘れの可能性");

  return {
    script_block_count: scripts.length,
    total_script_chars: combined.length,
    has_clear_rect: hasClearRect,
    has_clear_canvas_fn: hasClearFn,
    clear_related_lines: clearRelated.slice(0, 15),
    listener_hints: listenerHints.slice(0, 10),
    redraw_hints: redrawHints.slice(0, 15),
    brace_balance_warning: braces !== 0,
    quote_balance_warning: quotes,
    summary: parts.join("。") || "特記事項なし",
  };
}

/** エージェント向けテキストレポート */
export function formatAnalyzeReport(report: StaticAnalyzeReport): string {
  const lines = [
    `概要: ${report.summary}`,
    `script ブロック: ${report.script_block_count}, 合計 ${report.total_script_chars} 文字`,
    `clearRect: ${report.has_clear_rect}, clear 関連: ${report.has_clear_canvas_fn}`,
  ];
  if (report.clear_related_lines.length) {
    lines.push("clear 関連行:");
    lines.push(...report.clear_related_lines.map((l) => `  ${l}`));
  }
  if (report.redraw_hints.length) {
    lines.push("再描画/ストア関連:");
    lines.push(...report.redraw_hints.map((l) => `  ${l}`));
  }
  if (report.listener_hints.length) {
    lines.push("リスナー関連:");
    lines.push(...report.listener_hints.map((l) => `  ${l}`));
  }
  return lines.join("\n");
}
