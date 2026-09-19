// public/apps/contest-management/js/api.js
import { ApiError, apiRequest, apiUpload } from '../../contest-entry/js/api.js';

export { ApiError, apiRequest, apiUpload };

const API_BASE = '/api/contest';

/** Performs a multipart form API request. */
export async function apiFormRequest(path, formData, options = {}) {
  const res = await fetch(`${API_BASE}/${path}`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.error || `リクエストに失敗しました (${res.status})`, res.status, data);
  }

  return data;
}
