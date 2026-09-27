/**
 * Excalidraw 要素マージ（クライアント / DO と同一ロジック）
 */

type ElementRecord = Record<string, unknown>;

/** 要素を version / versionNonce でマージ（isDeleted tombstone を保持） */
export function reconcileElements(
  local: unknown[],
  remote: unknown[]
): unknown[] {
  const map = new Map<string, ElementRecord>();

  for (const el of local ?? []) {
    if (!el || typeof el !== "object") continue;
    const item = el as ElementRecord;
    if (typeof item.id === "string") map.set(item.id, item);
  }

  for (const el of remote ?? []) {
    if (!el || typeof el !== "object") continue;
    const item = el as ElementRecord;
    if (typeof item.id !== "string") continue;
    const existing = map.get(item.id);
    if (!existing) {
      map.set(item.id, item);
      continue;
    }
    const ev = Number(existing.version ?? 0);
    const rv = Number(item.version ?? 0);
    if (rv > ev) {
      map.set(item.id, item);
    } else if (rv === ev) {
      const en = Number(existing.versionNonce ?? 0);
      const rn = Number(item.versionNonce ?? 0);
      if (rn > en) map.set(item.id, item);
    }
  }

  return [...map.values()];
}

/** 描画用に isDeleted 要素を除外 */
export function visibleElements(elements: unknown[]): unknown[] {
  return (elements ?? []).filter(
    (el) =>
      el &&
      typeof el === "object" &&
      !(el as ElementRecord).isDeleted
  );
}
