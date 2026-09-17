/**
 * Runa — チャット SSE ヘルパー
 */

import type { RunaChatResult } from "./agent";
import { RunaAbortedError, RunaRunController } from "./run-control";

export type RunaSseSend = (event: string, data: unknown) => void;

/** SSE プロキシバッファ回避用（コメント行） */
const SSE_FLUSH_COMMENT = `: ${" ".repeat(1800)}\n\n`;

/** SSE レスポンス用ストリームを生成 */
export function createRunaSseResponse(
  run: (
    send: RunaSseSend,
    control: RunaRunController
  ) => Promise<RunaChatResult | null>,
  signal?: AbortSignal
): Response {
  const encoder = new TextEncoder();
  let streamController: ReadableStreamDefaultController<Uint8Array> | undefined;
  const control = new RunaRunController(signal);

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      streamController = controller;
    },
  });

  const send: RunaSseSend = (event, data) => {
    if (!streamController || control.isAborted) return;
    streamController.enqueue(
      encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
    );
    streamController.enqueue(encoder.encode(SSE_FLUSH_COMMENT));
  };

  void (async () => {
    try {
      const result = await run(send, control);
      if (control.isAborted) {
        send("aborted", { message: "推論を停止しました" });
        return;
      }
      if (!result) {
        send("error", { message: "処理に失敗しました" });
        return;
      }
      send("done", result);
    } catch (error) {
      if (error instanceof RunaAbortedError || control.isAborted) {
        send("aborted", { message: "推論を停止しました" });
        return;
      }
      const message =
        error instanceof Error ? error.message : "処理に失敗しました";
      send("error", { message });
    } finally {
      streamController?.close();
    }
  })();

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
