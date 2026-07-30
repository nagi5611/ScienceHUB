/**
 * サードパーティ — HTML リビジョン（スナップショット + 復元）
 */

import { createId, now } from "../types";
import {
  ARTIFACT_INDEX,
  revisionSnapshotPath,
  putArtifact,
  getArtifact,
} from "./artifacts";
import { writeProjectIndexHtml, type ProjectHtmlTarget } from "./project-html";

export interface TpRevisionSummary {
  revision_number: number;
  summary: string;
  created_at: number;
  has_snapshot: boolean;
  job_id: string | null;
}

export interface TpRevisionDetail extends TpRevisionSummary {
  html: string | null;
}

async function nextRevisionNumber(
  db: D1Database,
  projectId: string
): Promise<number> {
  const max = await db
    .prepare(
      "SELECT COALESCE(MAX(revision_number), 0) AS n FROM tp_revisions WHERE project_id = ?"
    )
    .bind(projectId)
    .first<{ n: number }>();
  return (max?.n ?? 0) + 1;
}

/** HTML スナップショット付きリビジョンを記録 */
export async function recordHtmlRevision(
  db: D1Database,
  bucket: R2Bucket,
  project: ProjectHtmlTarget & { id: string },
  html: string,
  summary: string,
  jobId?: string | null
): Promise<number> {
  const revisionNumber = await nextRevisionNumber(db, project.id);
  const snapshotRel = revisionSnapshotPath(revisionNumber);
  await putArtifact(
    bucket,
    project.dir_name,
    snapshotRel,
    html,
    "text/html; charset=utf-8"
  );
  await db
    .prepare(
      `INSERT INTO tp_revisions (
        id, project_id, revision_number, summary, created_at,
        r2_snapshot_key, job_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      createId("tpver"),
      project.id,
      revisionNumber,
      summary.slice(0, 200),
      now(),
      `third-party/${project.dir_name}/${snapshotRel}`,
      jobId ?? null
    )
    .run();
  return revisionNumber;
}

/** リビジョン一覧 */
export async function listRevisions(
  db: D1Database,
  projectId: string
): Promise<TpRevisionSummary[]> {
  const result = await db
    .prepare(
      `SELECT revision_number, summary, created_at, r2_snapshot_key, job_id
       FROM tp_revisions WHERE project_id = ?
       ORDER BY revision_number DESC`
    )
    .bind(projectId)
    .all<{
      revision_number: number;
      summary: string;
      created_at: number;
      r2_snapshot_key: string | null;
      job_id: string | null;
    }>();

  return (result.results ?? []).map((r) => ({
    revision_number: r.revision_number,
    summary: r.summary,
    created_at: r.created_at,
    has_snapshot: Boolean(r.r2_snapshot_key),
    job_id: r.job_id,
  }));
}

/** リビジョン詳細（HTML 含む） */
export async function getRevisionDetail(
  db: D1Database,
  bucket: R2Bucket,
  project: ProjectHtmlTarget & { id: string },
  revisionNumber: number
): Promise<TpRevisionDetail | null> {
  const row = await db
    .prepare(
      `SELECT revision_number, summary, created_at, r2_snapshot_key, job_id
       FROM tp_revisions WHERE project_id = ? AND revision_number = ?`
    )
    .bind(project.id, revisionNumber)
    .first<{
      revision_number: number;
      summary: string;
      created_at: number;
      r2_snapshot_key: string | null;
      job_id: string | null;
    }>();
  if (!row) return null;

  let html: string | null = null;
  if (row.r2_snapshot_key) {
    const rel = revisionSnapshotPath(revisionNumber);
    html = await getArtifact(bucket, project.dir_name, rel);
  }

  return {
    revision_number: row.revision_number,
    summary: row.summary,
    created_at: row.created_at,
    has_snapshot: Boolean(row.r2_snapshot_key),
    job_id: row.job_id,
    html,
  };
}

/** スナップショットを現行 index.html に復元 */
export async function restoreRevision(
  db: D1Database,
  bucket: R2Bucket,
  project: ProjectHtmlTarget & { id: string },
  revisionNumber: number
): Promise<{ revision_number: number }> {
  const detail = await getRevisionDetail(
    db,
    bucket,
    project,
    revisionNumber
  );
  if (!detail?.html) {
    throw new Error("復元対象のスナップショットがありません");
  }

  await writeProjectIndexHtml(bucket, project, detail.html);
  const newNum = await recordHtmlRevision(
    db,
    bucket,
    project,
    detail.html,
    `復元: revision ${revisionNumber}`
  );
  return { revision_number: newNum };
}

/** 現行 HTML をリビジョンとして記録（スナップショットのみ） */
export async function snapshotCurrentHtml(
  db: D1Database,
  bucket: R2Bucket,
  project: ProjectHtmlTarget & { id: string },
  summary: string,
  jobId?: string | null
): Promise<number | null> {
  const html = await getArtifact(bucket, project.dir_name, ARTIFACT_INDEX);
  if (!html?.trim()) return null;
  return await recordHtmlRevision(
    db,
    bucket,
    project,
    html,
    summary,
    jobId
  );
}
