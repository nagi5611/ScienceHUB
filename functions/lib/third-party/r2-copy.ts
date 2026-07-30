/**
 * サードパーティ — R2 プレフィックスコピー（フォーク用）
 */

import {
  ARTIFACT_INDEX,
  ARTIFACT_PLAN,
  ARTIFACT_REQUIREMENTS,
  ARTIFACT_REVIEW,
  ARTIFACT_TASKS,
  DOCS_GITKEEP,
  putArtifact,
} from "./artifacts";

const FORK_COPY_PATHS = [
  ARTIFACT_INDEX,
  ARTIFACT_REQUIREMENTS,
  ARTIFACT_PLAN,
  ARTIFACT_TASKS,
  ARTIFACT_REVIEW,
  DOCS_GITKEEP,
];

function prefixPath(dirName: string): string {
  return `third-party/${dirName}/`;
}

/** ソース dir_name から宛先 dir_name へファイルをコピー */
export async function copyProjectArtifacts(
  bucket: R2Bucket,
  sourceDirName: string,
  destDirName: string
): Promise<void> {
  const srcPrefix = prefixPath(sourceDirName);
  const destPrefix = prefixPath(destDirName);

  for (const rel of FORK_COPY_PATHS) {
    const obj = await bucket.get(`${srcPrefix}${rel}`);
    if (!obj) continue;
    const body = await obj.arrayBuffer();
    const contentType =
      obj.httpMetadata?.contentType ??
      (rel.endsWith(".html")
        ? "text/html; charset=utf-8"
        : rel.endsWith(".json")
          ? "application/json; charset=utf-8"
          : rel.endsWith(".md")
            ? "text/markdown; charset=utf-8"
            : "text/plain; charset=utf-8");
    await bucket.put(`${destPrefix}${rel}`, body, {
      httpMetadata: { contentType },
    });
  }

  // index.html を r2_prefix 直下にも（プレビュー用）
  const indexObj = await bucket.get(`${srcPrefix}${ARTIFACT_INDEX}`);
  if (indexObj) {
    const html = await indexObj.text();
    await putArtifact(
      bucket,
      destDirName,
      ARTIFACT_INDEX,
      html,
      "text/html; charset=utf-8"
    );
    await bucket.put(`${destPrefix}${ARTIFACT_INDEX}`, html, {
      httpMetadata: { contentType: "text/html; charset=utf-8" },
    });
  }
}
