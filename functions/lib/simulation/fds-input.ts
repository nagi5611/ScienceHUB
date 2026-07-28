// functions/lib/simulation/fds-input.ts

import { sha256HexFromBuffer } from "./fds-content-hash";
import { generateFdsInputR2Key, sanitizeFdsFilename } from "./fds-jobs";

/** Copies an FDS input object in R2 for a new request id. */
export async function duplicateFdsInputFile(
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
  const safeName = sanitizeFdsFilename(filename);
  const r2Key = generateFdsInputR2Key(newRequestId, safeName);

  await bucket.put(r2Key, buffer, {
    httpMetadata: object.httpMetadata ?? { contentType: "text/plain; charset=utf-8" },
  });

  return { r2Key, filename: safeName, size: buffer.byteLength, sha256 };
}
