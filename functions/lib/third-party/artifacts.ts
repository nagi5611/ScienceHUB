/**
 * サードパーティ — R2 アーティファクトと dir_name
 */

import { normalizeSlug } from "../auth";
import { createId } from "../types";

export const LEGACY_REQUIREMENTS = "requirements.md";
export const LEGACY_PLAN = "implementation-plan.md";
export const ARTIFACT_REQUIREMENTS = "docs/requirements.md";
export const ARTIFACT_PLAN = "docs/implementation-plan.md";
export const ARTIFACT_TASKS = "docs/implementation-tasks.json";
export const ARTIFACT_REVIEW = "review-last.json";
export const ARTIFACT_INDEX = "index.html";
export const DOCS_GITKEEP = "docs/.gitkeep";
export const ARTIFACT_VERIFY_JSON = "verify/latest.json";
export const ARTIFACT_VERIFY_PNG = "verify/latest.png";

/** リビジョンスナップショットの R2 キー（dir_name 相対） */
export function revisionSnapshotPath(revisionNumber: number): string {
  return `revisions/${revisionNumber}/index.html`;
}

const DOC_LEGACY_FALLBACK: Record<string, string> = {
  [ARTIFACT_REQUIREMENTS]: LEGACY_REQUIREMENTS,
  [ARTIFACT_PLAN]: LEGACY_PLAN,
};

function prefixPath(dirName: string): string {
  return `third-party/${dirName}/`;
}

function artifactKey(dirName: string, name: string): string {
  return `${prefixPath(dirName)}${name}`;
}

/** 表示名からユニーク dir_name を割当 */
export async function allocateDirName(
  db: D1Database,
  title: string
): Promise<string> {
  const base = normalizeSlug(title || "app") || "app";
  let candidate = base.slice(0, 40);
  for (let i = 0; i < 30; i++) {
    const name = i === 0 ? candidate : `${candidate.slice(0, 36)}_${i}`;
    const dup = await db
      .prepare("SELECT id FROM tp_projects WHERE dir_name = ?")
      .bind(name)
      .first();
    if (!dup) return name;
  }
  return `app_${createId("d").slice(3, 12)}`;
}

/** dir_name 変更（未公開のみ） */
export async function reallocateDirNameIfDraft(
  db: D1Database,
  projectId: string,
  title: string,
  status: string
): Promise<string | null> {
  if (status === "published") return null;
  const newName = await allocateDirName(db, title);
  const current = await db
    .prepare("SELECT dir_name FROM tp_projects WHERE id = ?")
    .bind(projectId)
    .first<{ dir_name: string }>();
  if (current?.dir_name === newName) return null;
  await db
    .prepare(
      "UPDATE tp_projects SET dir_name = ?, r2_prefix = ? WHERE id = ? AND status = 'draft'"
    )
    .bind(newName, prefixPath(newName), projectId)
    .run();
  return newName;
}

/** 新規プロジェクト用 docs/ プレースホルダ */
export async function ensureDocsFolder(
  bucket: R2Bucket,
  dirName: string
): Promise<void> {
  const head = await bucket.head(artifactKey(dirName, DOCS_GITKEEP));
  if (head) return;
  await bucket.put(artifactKey(dirName, DOCS_GITKEEP), "", {
    httpMetadata: { contentType: "text/plain; charset=utf-8" },
  });
}

export async function putArtifact(
  bucket: R2Bucket,
  dirName: string,
  name: string,
  body: string,
  contentType: string
): Promise<void> {
  await bucket.put(artifactKey(dirName, name), body, {
    httpMetadata: { contentType },
  });
  const legacy = DOC_LEGACY_FALLBACK[name];
  if (legacy) {
    await bucket.delete(artifactKey(dirName, legacy));
  }
}

export async function getArtifact(
  bucket: R2Bucket,
  dirName: string,
  name: string
): Promise<string | null> {
  const obj = await bucket.get(artifactKey(dirName, name));
  if (obj) return await obj.text();

  const legacy = DOC_LEGACY_FALLBACK[name];
  if (!legacy) return null;
  const leg = await bucket.get(artifactKey(dirName, legacy));
  if (!leg) return null;
  return await leg.text();
}

export async function artifactExists(
  bucket: R2Bucket,
  dirName: string,
  name: string
): Promise<boolean> {
  const head = await bucket.head(artifactKey(dirName, name));
  if (head) return true;
  const legacy = DOC_LEGACY_FALLBACK[name];
  if (!legacy) return false;
  const legHead = await bucket.head(artifactKey(dirName, legacy));
  return legHead !== null;
}

/** フラット配置のドキュメントを docs/ へ移行（読み取り専用トリガー） */
export async function migrateLegacyDocsIfNeeded(
  bucket: R2Bucket,
  dirName: string
): Promise<void> {
  for (const [docPath, legacyPath] of Object.entries(DOC_LEGACY_FALLBACK)) {
    const hasDoc = await bucket.head(artifactKey(dirName, docPath));
    if (hasDoc) continue;
    const leg = await bucket.get(artifactKey(dirName, legacyPath));
    if (!leg) continue;
    const text = await leg.text();
    await bucket.put(artifactKey(dirName, docPath), text, {
      httpMetadata: { contentType: "text/markdown; charset=utf-8" },
    });
    await bucket.delete(artifactKey(dirName, legacyPath));
  }
  await ensureDocsFolder(bucket, dirName);
}

/** プロジェクト配下の R2 ファイルを削除 */
export async function deleteProjectArtifacts(
  bucket: R2Bucket,
  dirName: string
): Promise<void> {
  const names = [
    ARTIFACT_REQUIREMENTS,
    ARTIFACT_PLAN,
    LEGACY_REQUIREMENTS,
    LEGACY_PLAN,
    ARTIFACT_REVIEW,
    ARTIFACT_INDEX,
    DOCS_GITKEEP,
  ];
  for (const name of names) {
    await bucket.delete(artifactKey(dirName, name));
  }
}
