/**
 * サードパーティ — R2 アーティファクトと dir_name
 */

import { normalizeSlug } from "../auth";
import { createId } from "../types";

export const ARTIFACT_REQUIREMENTS = "requirements.md";
export const ARTIFACT_PLAN = "implementation-plan.md";
export const ARTIFACT_REVIEW = "review-last.json";
export const ARTIFACT_INDEX = "index.html";

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
}

export async function getArtifact(
  bucket: R2Bucket,
  dirName: string,
  name: string
): Promise<string | null> {
  const obj = await bucket.get(artifactKey(dirName, name));
  if (!obj) return null;
  return await obj.text();
}

export async function artifactExists(
  bucket: R2Bucket,
  dirName: string,
  name: string
): Promise<boolean> {
  const head = await bucket.head(artifactKey(dirName, name));
  return head !== null;
}
