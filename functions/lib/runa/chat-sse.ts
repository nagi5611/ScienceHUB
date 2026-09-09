/**
 * Runa — チャット SSE ヘルパー
 */

import type { RunaChatResult } from "./agent";

export type RunaSseSend = (event: string, data: unknown) => void;

/** SSE レスポンス用ストリームを生成 */
export function createRunaSseResponse(
  run: (send: RunaSseSend) => Promise<RunaChatResult | null>
): Response {
  const encoder = new TextEncoder();
  let streamController: ReadableStreamDefaultController<Uint8Array> | undefined;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      streamController = controller;
    },
  });

  const send: RunaSseSend = (event, data) => {
    if (!streamController) return;
    streamController.enqueue(
      encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
    );
  };

  void (async () => {
    try {
      const result = await run(send);
      if (!result) {
        send("error", { message: "処理に失敗しました" });
        return;
      }
      send("done", result);
    } catch (error) {
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
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
