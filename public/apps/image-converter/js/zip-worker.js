/**
 * ZIP 生成 Worker（無圧縮 STORE）
 */

import { zip } from "https://esm.sh/fflate@0.8.2?target=es2022";

self.addEventListener("message", (event) => {
  const { jobId, files } = event.data ?? {};
  zip(files, { level: 0 }, (err, data) => {
    if (err) {
      self.postMessage({
        jobId,
        error: err instanceof Error ? err.message : String(err),
      });
      return;
    }
    self.postMessage({ jobId, buffer: data.buffer, mime: "application/zip" }, [data.buffer]);
  });
});
