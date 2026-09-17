/**
 * Runa — クライアント切断 / 停止ボタンによる実行中断
 */

export class RunaAbortedError extends Error {
  constructor(message = "推論を停止しました") {
    super(message);
    this.name = "RunaAbortedError";
  }
}

/** チャット 1 ターンの中断フラグ（AbortSignal と連動） */
export class RunaRunController {
  private aborted = false;

  constructor(private readonly signal?: AbortSignal) {
    if (signal) {
      if (signal.aborted) this.aborted = true;
      signal.addEventListener("abort", () => {
        this.aborted = true;
      });
    }
  }

  get isAborted(): boolean {
    return this.aborted || this.signal?.aborted === true;
  }

  throwIfAborted(): void {
    if (this.isAborted) {
      throw new RunaAbortedError();
    }
  }
}
