// src/js/upload/simple.js
import { apiRequest, apiUpload } from '../api.js';

const MULTIPART_THRESHOLD = 20 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['.stl', '.gcode', '.gco', '.nc'];

/** Checks if a filename is an allowed print file. */
function isAllowedPrintFile(filename) {
  const lower = filename.toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

/** Uploads a file using simple or multipart strategy based on size. */
export async function uploadSimFile(file, onProgress) {
  if (!isAllowedPrintFile(file.name)) {
    throw new Error('STL（.stl）またはGコード（.gcode / .gco / .nc）のみアップロードできます');
  }

  const initiate = await apiRequest('upload/initiate', {
    method: 'POST',
    body: JSON.stringify({ filename: file.name, size: file.size }),
  });

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
  return multipart(file, initiate, onProgress);
}

export { MULTIPART_THRESHOLD };
