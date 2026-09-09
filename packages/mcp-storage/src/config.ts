/**
 * MCP サーバー設定
 */

export interface McpStorageConfig {
  apiUrl: string;
  token: string;
}

const INLINE_DOWNLOAD_MAX_BYTES = 512 * 1024;

export { INLINE_DOWNLOAD_MAX_BYTES };

/** 環境変数から設定を読み込む */
export function loadConfig(): McpStorageConfig {
  const apiUrl = process.env.SCIENCEHUB_API_URL?.trim().replace(/\/$/, "");
  const token = process.env.SCIENCEHUB_TOKEN?.trim();

  if (!apiUrl) {
    throw new Error("SCIENCEHUB_API_URL が設定されていません");
  }
  if (!token) {
    throw new Error("SCIENCEHUB_TOKEN が設定されていません");
  }

  return { apiUrl, token };
}
