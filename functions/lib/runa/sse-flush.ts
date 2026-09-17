/**
 * Runa — SSE をクライアントへ逐次届けるためのイベントループ譲渡
 */

/** enqueue 直後に呼び、Workers / プロキシのバッファを避ける */
export async function flushSseYield(): Promise<void> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 0);
  });
}
