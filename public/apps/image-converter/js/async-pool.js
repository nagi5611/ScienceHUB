/**
 * 非同期タスクを最大 concurrency 件まで並行実行
 * @template T, R
 * @param {T[]} items
 * @param {number} concurrency
 * @param {(item: T, index: number) => Promise<R>} fn
 * @returns {Promise<R[]>}
 */
export async function mapPool(items, concurrency, fn) {
  if (items.length === 0) return [];
  const limit = Math.max(1, Math.min(concurrency, items.length));
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await fn(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: limit }, () => worker()));
  return results;
}

/** メインスレッドに制御を返す */
export function yieldToMain() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve(undefined));
  });
}
