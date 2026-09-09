/**
 * Luna — チャット SSE ヘルパー
 */

import type { LunaChatResult } from "./agent";

export type LunaSseSend = (event: string, data: unknown) => void;

/** SSE レスポンス用ストリームを生成 */
export function createLunaSseResponse(
  run: (send: LunaSseSend) => Promise<LunaChatResult | null>
): Response {
  const encoder = new TextEncoder();
  let streamController: ReadableStreamDefaultController<Uint8Array> | undefined;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      streamController = controller;
    },
  });

  const send: LunaSseSend = (event, data) => {
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
