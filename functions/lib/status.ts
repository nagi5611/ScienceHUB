/**
 * 外部サービス稼働監視
 */

export interface StatusService {
  id: string;
  name: string;
  url: string;
}

export interface StatusCheckResult extends StatusService {
  ok: boolean;
  statusCode: number | null;
  latencyMs: number;
  error: string | null;
}

/** 監視対象サービス一覧 */
export const STATUS_SERVICES: StatusService[] = [
  { id: "main", name: "メインHP", url: "https://mmh-virtual.jp" },
  {
    id: "tech",
    name: "ばーちゃるず専用ファイル共有サービス",
    url: "https://tech.mmh-virtual.jp",
  },
  {
    id: "diorama",
    name: "空港ジオラマ作成用ファイル共有サービス",
    url: "https://diorama.mmh-virtual.jp",
  },
  {
    id: "meta",
    name: "南高校メタバースサーバー",
    url: "https://meta.mmh-virtual.jp",
  },
  {
    id: "metair",
    name: "松山空港メタバースサーバー",
    url: "https://metair.mmh-virtual.jp",
  },
];

const CHECK_TIMEOUT_MS = 10_000;

/** 単一サービスの HTTP 到達性を確認する */
async function checkService(service: StatusService): Promise<StatusCheckResult> {
  const started = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);

    const response = await fetch(service.url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "ScienceHUB-StatusChecker/1.0",
      },
    });

    clearTimeout(timeoutId);

    const latencyMs = Date.now() - started;
    const ok = response.status >= 200 && response.status < 400;

    return {
      ...service,
      ok,
      statusCode: response.status,
      latencyMs,
      error: ok ? null : `HTTP ${response.status}`,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "タイムアウト"
        : error instanceof Error
          ? error.message
          : "チェック失敗";

    return {
      ...service,
      ok: false,
      statusCode: null,
      latencyMs: Date.now() - started,
      error: message,
    };
  }
}

/** 全サービスの稼働状況を取得する */
export async function runStatusChecks(): Promise<{
  checkedAt: string;
  results: StatusCheckResult[];
}> {
  const results = await Promise.all(STATUS_SERVICES.map((service) => checkService(service)));

  return {
    checkedAt: new Date().toISOString(),
    results,
  };
}
