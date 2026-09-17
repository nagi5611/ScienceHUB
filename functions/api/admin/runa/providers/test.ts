/**
 * POST /api/admin/runa/providers/test — 検索プロバイダ API 接続テスト
 */

import type { Env } from "../../../../lib/types";
import { jsonError } from "../../../../lib/types";
import {
  parseSearchProviderId,
  runSearchProviderTest,
} from "../../../../lib/runa/search-provider-test";

interface TestBody {
  provider?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: TestBody;
  try {
    body = await context.request.json<TestBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  const provider = parseSearchProviderId(body.provider);
  if (!provider) {
    return jsonError(
      "provider は serpbase / serper / brave / exa のいずれかを指定してください",
      400
    );
  }

  try {
    const result = await runSearchProviderTest(context.env, provider);
    if (!result.ok && !result.configured) {
      return Response.json(result, { status: 200 });
    }
    if (!result.ok) {
      return jsonError(result.message, 400);
    }
    return Response.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "接続テストに失敗しました";
    return jsonError(message, 400);
  }
};
