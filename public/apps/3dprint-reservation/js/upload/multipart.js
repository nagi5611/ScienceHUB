// src/js/upload/multipart.js
import { apiRequest, apiUpload } from '../api.js';

/** Uploads a large file via R2 multipart upload. */
export async function multipart(file, initiate, onProgress) {
  const { sessionId, partSize, totalParts } = initiate;
  let sessionToAbort = sessionId;

  try {
    for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
      const start = (partNumber - 1) * partSize;
      const end = Math.min(start + partSize, file.size);
      const chunk = file.slice(start, end);

      await apiUpload('upload/part', chunk, { sessionId, partNumber: String(partNumber) });

      const percent = Math.round((partNumber / totalParts) * 100);
      onProgress?.(percent);
    }

    const result = await apiRequest('upload/complete', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });

    sessionToAbort = null;
    return result;
  } catch (err) {
    if (sessionToAbort) {
      await apiRequest('upload/abort', {
        method: 'DELETE',
        body: JSON.stringify({ sessionId: sessionToAbort }),
      }).catch(() => {});
    }
    throw err;
  }
}
