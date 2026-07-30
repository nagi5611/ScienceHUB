/**
 * サードパーティ — R2 ワークスペース（メンテナンスエージェント用）
 */

import {
  ARTIFACT_INDEX,
  ARTIFACT_PLAN,
  ARTIFACT_REQUIREMENTS,
  ARTIFACT_TASKS,
  DOCS_GITKEEP,
  artifactExists,
  getArtifact,
  putArtifact,
} from "./artifacts";

export const WORKSPACE_ALLOWLIST = [
  ARTIFACT_INDEX,
  ARTIFACT_REQUIREMENTS,
  ARTIFACT_PLAN,
  ARTIFACT_TASKS,
  DOCS_GITKEEP,
] as const;

export type WorkspaceFileName = (typeof WORKSPACE_ALLOWLIST)[number];

const MAX_READ_CHARS = 24000;

/** 許可パスか検証（ルートまたは docs/ 配下1段） */
export function resolveWorkspacePath(path: string): WorkspaceFileName | null {
  const normalized = path.replace(/\\/g, "/").replace(/^\/+/, "").trim();
  if (!normalized || normalized.includes("..")) {
    return null;
  }
  if ((WORKSPACE_ALLOWLIST as readonly string[]).includes(normalized)) {
    return normalized as WorkspaceFileName;
  }
  return null;
}

export interface WorkspaceFileMeta {
  path: WorkspaceFileName;
  exists: boolean;
  size_bytes: number | null;
}

export interface WorkspaceTreeNode {
  name: string;
  path: string;
  type: "file" | "dir";
  children?: WorkspaceTreeNode[];
}

function artifactKey(dirName: string, name: string): string {
  return `third-party/${dirName}/${name}`;
}

/** ワークスペース内ファイル一覧 */
export async function listWorkspaceFiles(
  bucket: R2Bucket,
  dirName: string
): Promise<WorkspaceFileMeta[]> {
  const out: WorkspaceFileMeta[] = [];
  for (const path of WORKSPACE_ALLOWLIST) {
    const head = await bucket.head(artifactKey(dirName, path));
    out.push({
      path,
      exists: head !== null,
      size_bytes: head?.size ?? null,
    });
  }
  return out;
}

/** ファイルエクスプローラー用ツリー */
export async function buildWorkspaceTree(
  bucket: R2Bucket,
  dirName: string,
  rootLabel: string
): Promise<WorkspaceTreeNode> {
  const hasIndex = await artifactExists(bucket, dirName, ARTIFACT_INDEX);
  const hasReq = await artifactExists(bucket, dirName, ARTIFACT_REQUIREMENTS);
  const hasPlan = await artifactExists(bucket, dirName, ARTIFACT_PLAN);
  const hasTasks = await artifactExists(bucket, dirName, ARTIFACT_TASKS);
  const hasGitkeep = await bucket.head(artifactKey(dirName, DOCS_GITKEEP));

  const docChildren: WorkspaceTreeNode[] = [];
  if (hasReq) {
    docChildren.push({
      name: "requirements.md",
      path: ARTIFACT_REQUIREMENTS,
      type: "file",
    });
  }
  if (hasPlan) {
    docChildren.push({
      name: "implementation-plan.md",
      path: ARTIFACT_PLAN,
      type: "file",
    });
  }
  if (hasTasks) {
    docChildren.push({
      name: "implementation-tasks.json",
      path: ARTIFACT_TASKS,
      type: "file",
    });
  }
  if (!docChildren.length && hasGitkeep) {
    docChildren.push({
      name: "(空)",
      path: DOCS_GITKEEP,
      type: "file",
    });
  }

  const children: WorkspaceTreeNode[] = [];
  if (hasIndex) {
    children.push({
      name: "index.html",
      path: ARTIFACT_INDEX,
      type: "file",
    });
  }
  children.push({
    name: "docs",
    path: "docs",
    type: "dir",
    children: docChildren,
  });

  return {
    name: rootLabel,
    path: "",
    type: "dir",
    children,
  };
}

export interface ReadFileOptions {
  startLine?: number;
  endLine?: number;
  maxChars?: number;
}

export interface ReadFileResult {
  path: WorkspaceFileName;
  content: string;
  total_lines: number;
  truncated: boolean;
  start_line: number;
  end_line: number;
}

/** ファイル読取（行範囲・文字数上限） */
export async function readWorkspaceFile(
  bucket: R2Bucket,
  dirName: string,
  path: string,
  options: ReadFileOptions = {}
): Promise<ReadFileResult | { error: string }> {
  const resolved = resolveWorkspacePath(path);
  if (!resolved) return { error: "許可されていないパスです" };

  const text = await getArtifact(bucket, dirName, resolved);
  if (text === null && resolved === DOCS_GITKEEP) {
    return {
      path: resolved,
      content: "",
      total_lines: 0,
      truncated: false,
      start_line: 1,
      end_line: 0,
    };
  }
  if (!text) return { error: "ファイルが存在しません" };

  const lines = text.split("\n");
  const totalLines = lines.length;
  const start = Math.max(1, options.startLine ?? 1);
  const end = Math.min(totalLines, options.endLine ?? totalLines);
  const slice = lines.slice(start - 1, end);
  let content = slice.join("\n");
  const maxChars = options.maxChars ?? MAX_READ_CHARS;
  let truncated = false;
  if (content.length > maxChars) {
    content = content.slice(0, maxChars);
    truncated = true;
  }

  return {
    path: resolved,
    content,
    total_lines: totalLines,
    truncated,
    start_line: start,
    end_line: end,
  };
}

export interface GrepMatch {
  path: WorkspaceFileName;
  line_number: number;
  line_text: string;
}

/** ワークスペース内 grep（正規表現・行単位） */
export async function grepWorkspace(
  bucket: R2Bucket,
  dirName: string,
  pattern: string,
  options: { paths?: string[]; maxMatches?: number } = {}
): Promise<{ matches: GrepMatch[]; error?: string }> {
  const maxMatches = options.maxMatches ?? 40;
  let regex: RegExp;
  try {
    regex = new RegExp(pattern, "i");
  } catch {
    return { matches: [], error: "正規表現が無効です" };
  }

  const paths: WorkspaceFileName[] = [];
  if (options.paths?.length) {
    for (const p of options.paths) {
      const r = resolveWorkspacePath(p);
      if (r) paths.push(r);
    }
  } else {
    paths.push(...WORKSPACE_ALLOWLIST);
  }

  const matches: GrepMatch[] = [];
  for (const path of paths) {
    const text = await getArtifact(bucket, dirName, path);
    if (!text) continue;
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (regex.test(lines[i])) {
        matches.push({
          path,
          line_number: i + 1,
          line_text: lines[i].slice(0, 200),
        });
        if (matches.length >= maxMatches) {
          return { matches };
        }
      }
    }
  }
  return { matches };
}

/** index.html を R2 に保存 */
export async function writeWorkspaceIndexHtml(
  bucket: R2Bucket,
  dirName: string,
  r2Prefix: string,
  html: string
): Promise<void> {
  const trimmed = html.trim();
  if (!trimmed.includes("<!DOCTYPE") && !trimmed.includes("<html")) {
    throw new Error("index.html の形式が不正です");
  }
  await putArtifact(
    bucket,
    dirName,
    ARTIFACT_INDEX,
    html,
    "text/html; charset=utf-8"
  );
  const key = r2Prefix.endsWith("/")
    ? `${r2Prefix}index.html`
    : `${r2Prefix}/index.html`;
  await bucket.put(key, html, {
    httpMetadata: { contentType: "text/html; charset=utf-8" },
  });
}

/** index.html が存在するか */
export async function workspaceHasIndex(
  bucket: R2Bucket,
  dirName: string
): Promise<boolean> {
  return await artifactExists(bucket, dirName, ARTIFACT_INDEX);
}
