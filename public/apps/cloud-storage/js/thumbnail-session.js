/**
 * 一覧サムネイル読み込みの世代管理と中断
 */

let activeGeneration = 0;
/** @type {Set<AbortController>} */
const activeAbortControllers = new Set();

/** フォルダ移動・一覧再読み込み時に進行中の取得を中断 */
export function resetThumbnailLoads(generation) {
  activeGeneration = generation ?? activeGeneration + 1;
  for (const controller of activeAbortControllers) {
    controller.abort();
  }
  activeAbortControllers.clear();
}

/** 指定世代が現在有効か */
export function isActiveThumbnailGeneration(generation) {
  return generation === activeGeneration;
}

/** サムネイル取得タスク用の中断スコープ */
export function createThumbnailTask(generation) {
  if (generation !== activeGeneration) return null;

  const controller = new AbortController();
  activeAbortControllers.add(controller);

  const isStale = () => generation !== activeGeneration;
  const dispose = () => {
    activeAbortControllers.delete(controller);
  };

  return { signal: controller.signal, isStale, dispose };
}
