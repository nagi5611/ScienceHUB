/**
 * サードパーティ — 切れた編集プラン JSON の salvage
 */

import { parseJsonFromModelText } from "../gemini/generate";
import type { MaintainEditPlanResult } from "./schemas";
import { normalizeWorkspaceEdits } from "./workspace-edits";

function tryParseEditPlan(raw: string): MaintainEditPlanResult | null {
  try {
    const parsed = parseJsonFromModelText(raw) as MaintainEditPlanResult;
    const edits = normalizeWorkspaceEdits(parsed?.edits);
    if (!edits?.length) return null;
    return {
      assistant_message: parsed.assistant_message ?? "",
      edits: parsed.edits,
      target_path: parsed.target_path,
    };
  } catch {
    return null;
  }
}

/** 閉じ括弧を補完してパースを試す */
function tryCloseAndParse(raw: string): MaintainEditPlanResult | null {
  const trimmed = raw.trim();
  const suffixes = ["}", "]", "}", "}", "]}", "}]}", "}]}"];
  for (const suffix of suffixes) {
    const attempt = tryParseEditPlan(trimmed + suffix);
    if (attempt) return attempt;
  }
  return null;
}

/** edits 配列内の完成オブジェクトを抽出 */
function extractCompleteEditObjects(raw: string): MaintainEditPlanResult | null {
  const start = raw.search(/"edits"\s*:\s*\[/);
  if (start < 0) return null;

  const arrayStart = raw.indexOf("[", start);
  if (arrayStart < 0) return null;

  const objects: unknown[] = [];
  let i = arrayStart + 1;
  while (i < raw.length) {
    const objStart = raw.indexOf("{", i);
    if (objStart < 0) break;

    let depth = 0;
    let inString = false;
    let escaped = false;
    let objEnd = -1;

    for (let j = objStart; j < raw.length; j++) {
      const ch = raw[j];
      if (inString) {
        if (escaped) {
          escaped = false;
          continue;
        }
        if (ch === "\\") {
          escaped = true;
          continue;
        }
        if (ch === '"') inString = false;
        continue;
      }
      if (ch === '"') {
        inString = true;
        continue;
      }
      if (ch === "{") depth++;
      if (ch === "}") {
        depth--;
        if (depth === 0) {
          objEnd = j;
          break;
        }
      }
    }

    if (objEnd < 0) break;

    const slice = raw.slice(objStart, objEnd + 1);
    try {
      objects.push(JSON.parse(slice));
    } catch {
      break;
    }
    i = objEnd + 1;
  }

  if (!objects.length) return null;
  const edits = normalizeWorkspaceEdits(
    objects as MaintainEditPlanResult["edits"]
  );
  if (!edits?.length) return null;

  const assistantMatch = raw.match(
    /"assistant_message"\s*:\s*"((?:\\.|[^"\\])*)"/
  );
  const targetMatch = raw.match(/"target_path"\s*:\s*"([^"]*)"/);

  return {
    assistant_message: assistantMatch?.[1] ?? "",
    edits: objects as MaintainEditPlanResult["edits"],
    target_path: targetMatch?.[1],
  };
}

/** 切れた JSON から利用可能な edits を salvage */
export function salvageEditsFromTruncatedJson(
  raw: string
): MaintainEditPlanResult | null {
  if (!raw.trim()) return null;
  return (
    tryParseEditPlan(raw) ??
    tryCloseAndParse(raw) ??
    extractCompleteEditObjects(raw)
  );
}
