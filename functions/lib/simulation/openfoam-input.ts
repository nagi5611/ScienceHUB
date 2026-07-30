// functions/lib/simulation/openfoam-input.ts

import { sha256HexFromBuffer } from "./openfoam-content-hash";
import { generateOpenfoamInputR2Key, sanitizeOpenfoamFilename } from "./openfoam-jobs";

/** Copies an OpenFOAM input object in R2 for a new request id. */
export async function duplicateOpenfoamInputFile(
  bucket: R2Bucket,
  sourceKey: string,
  newRequestId: string,
  filename: string
): Promise<{ r2Key: string; filename: string; size: number; sha256: string }> {
  const object = await bucket.get(sourceKey);
  if (!object) {
    throw new Error("元の入力ファイルが見つかりません");
  }

  const buffer = await object.arrayBuffer();
  const sha256 = await sha256HexFromBuffer(buffer);
  const safeName = sanitizeOpenfoamFilename(filename);
  const r2Key = generateOpenfoamInputR2Key(newRequestId, safeName);

  await bucket.put(r2Key, buffer, {
    httpMetadata: object.httpMetadata ?? { contentType: "application/zip" },
  });

  return { r2Key, filename: safeName, size: buffer.byteLength, sha256 };
}
