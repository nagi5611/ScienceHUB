// src/js/api.js

/** API error with structured response payload. */
export class ApiError extends Error {
  constructor(message, status, payload = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = payload.code;
    this.payload = payload;
  }
}

const API_BASE = '/api/3dprint';

/** Performs a JSON API request. */
export async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE}/${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.error || `リクエストに失敗しました (${res.status})`, res.status, data);
  }

  return data;
}

/** Performs a multipart form API request. */
export async function apiFormRequest(path, formData, options = {}) {
  const res = await fetch(`${API_BASE}/${path}`, {
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

/** Performs a binary upload request. */
export async function apiUpload(path, body, params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `${API_BASE}/${path}${qs ? `?${qs}` : ''}`;

  const res = await fetch(url, {
    method: 'PUT',
    credentials: 'include',
    body,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.error || `アップロードに失敗しました (${res.status})`, res.status, data);
  }

  return data;
}
