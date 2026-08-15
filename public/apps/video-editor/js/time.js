/**
 * 動画編集 — 時間表示・パース
 */

/** 秒を M:SS.s 形式に整形 */
export function formatTimePrecise(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00.0";
  const totalTenths = Math.round(seconds * 10);
  const tenths = totalTenths % 10;
  const totalSeconds = Math.floor(totalTenths / 10);
  const s = totalSeconds % 60;
  const m = Math.floor(totalSeconds / 60) % 60;
  const h = Math.floor(totalSeconds / 3600);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${tenths}`;
  }
  return `${m}:${String(s).padStart(2, "0")}.${tenths}`;
}

/** 秒を M:SS 形式に整形（タイムラインラベル用） */
export function formatTimeShort(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const totalSeconds = Math.floor(seconds);
  const s = totalSeconds % 60;
  const m = Math.floor(totalSeconds / 60) % 60;
  const h = Math.floor(totalSeconds / 3600);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * ユーザー入力を秒に変換（0:00.0 / 1:23.5 / 90 など）
 * @param {string} value
 * @returns {number | null}
 */
export function parseTimeInput(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return null;

  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }

  const parts = trimmed.split(":").map((part) => part.trim());
  if (parts.length === 1) {
    const n = Number(parts[0]);
    return Number.isFinite(n) ? n : null;
  }

  let h = 0;
  let m = 0;
  let s = 0;

  if (parts.length === 2) {
    m = Number(parts[0]);
    s = Number(parts[1]);
  } else if (parts.length === 3) {
    h = Number(parts[0]);
    m = Number(parts[1]);
    s = Number(parts[2]);
  } else {
    return null;
  }

  if (![h, m, s].every((n) => Number.isFinite(n))) return null;
  return h * 3600 + m * 60 + s;
}

/** 値を min〜max に収める */
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/** バイト数を表示用に整形 */
export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
