/**
 * サードパーティ — index.html の統一書き込み
 */

import { ARTIFACT_INDEX, putArtifact } from "./artifacts";

export interface ProjectHtmlTarget {
  dir_name: string;
  r2_prefix: string;
}

/** index.html を R2 に二重書き込み（putArtifact + r2_prefix） */
export async function writeProjectIndexHtml(
  bucket: R2Bucket,
  project: ProjectHtmlTarget,
  html: string
): Promise<void> {
  await putArtifact(
    bucket,
    project.dir_name,
    ARTIFACT_INDEX,
    html,
    "text/html; charset=utf-8"
  );
  await bucket.put(`${project.r2_prefix}index.html`, html, {
    httpMetadata: { contentType: "text/html; charset=utf-8" },
  });
}
