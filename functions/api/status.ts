/**
 * サービス稼働状況 API
 */

import type { Env } from "../lib/types";
import { runStatusChecks } from "../lib/status";

export const onRequestGet: PagesFunction<Env> = async () => {
  const data = await runStatusChecks();
  return Response.json(data, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
};
