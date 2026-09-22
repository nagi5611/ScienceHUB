// public/apps/contest-entry/js/upload/simple.js
import { apiRequest, apiUpload } from '../api.js';

const ALLOWED_EXTENSIONS = ['.stl', '.gcode', '.gco', '.nc'];

function isAllowedPrintFile(filename) {
  const lower = filename.toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

/** Uploads a print file via the contest API. */
export async function uploadPrintFile(file, onProgress, onStatus) {
  if (!isAllowedPrintFile(file.name)) {
    throw new Error('STL（.stl）またはGコード（.gcode / .gco / .nc）のみアップロードできます');
  }

  onStatus?.('認証中');
  const initiate = await apiRequest('upload/initiate', {
    method: 'POST',
    body: JSON.stringify({ filename: file.name, size: file.size }),
  });

  onStatus?.('処理中');
  if (initiate.mode === 'simple') {
    onProgress?.(0);
    const result = await apiUpload('upload/simple', file, {
      r2Key: initiate.r2Key,
      filename: file.name,
    });
    onProgress?.(100);
    return result;
  }

  const { multipart } = await import('./multipart.js');
  return multipart(file, initiate, onProgress, onStatus);
}
