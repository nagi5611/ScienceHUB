import { ApiError } from './api';

const API_BASE = '/api/3dprint';

const ALLOWED = ['.stl', '.gcode', '.gco', '.nc', '.3mf', '.obj'];

function isAllowed(name: string) {
  const lower = name.toLowerCase();
  return ALLOWED.some((ext) => lower.endsWith(ext));
}

export async function uploadPrintFile(file: File): Promise<{
  r2_key: string;
  filename: string;
  size_bytes: number;
}> {
  if (!isAllowed(file.name)) {
    throw new ApiError('対応していないファイル形式です', 400);
  }

  const initRes = await fetch(`${API_BASE}/upload/initiate`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, size: file.size }),
  });
  const init = (await initRes.json()) as {
    error?: string;
    mode?: string;
    r2Key?: string;
    sessionId?: string;
  };
  if (!initRes.ok) throw new ApiError(init.error || 'upload init failed', initRes.status);

  if (init.mode === 'simple' && init.r2Key) {
    const qs = new URLSearchParams({ r2Key: init.r2Key, filename: file.name });
    const put = await fetch(`${API_BASE}/upload/simple?${qs}`, {
      method: 'PUT',
      credentials: 'include',
      body: file,
    });
    const putData = (await put.json()) as { error?: string; r2_key?: string; filename?: string; size_bytes?: number };
    if (!put.ok) throw new ApiError(putData.error || 'upload failed', put.status);
    return {
      r2_key: putData.r2_key ?? init.r2Key,
      filename: putData.filename ?? file.name,
      size_bytes: putData.size_bytes ?? file.size,
    };
  }

  throw new ApiError('大容量ファイルのマルチパートは未対応（20MB未満で試してください）', 400);
}
