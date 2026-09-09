/**
 * ScienceHUB Storage API クライアント
 */

import type { McpStorageConfig } from "./config.js";

export class StorageApiError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "StorageApiError";
    this.status = status;
  }
}

export class StorageApiClient {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor(config: McpStorageConfig) {
    this.baseUrl = `${config.apiUrl}/api/storage`;
    this.token = config.token;
  }

  /** 認証付き JSON API リクエスト */
  async request<T>(
    path: string,
    options: RequestInit & { json?: unknown } = {}
  ): Promise<T> {
    const headers = new Headers(options.headers);
    headers.set("Authorization", `Bearer ${this.token}`);

    let body = options.body;
    if (options.json !== undefined) {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify(options.json);
    }

    const response = await fetch(`${this.baseUrl}/${path}`, {
      ...options,
      headers,
      body,
    });

    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    if (!response.ok) {
      throw new StorageApiError(
        data.error ?? `API error (${response.status})`,
        response.status
      );
    }

    return data as T;
  }

  /** バイナリ PUT（Worker プロキシ経由） */
  async uploadSimple(
    sessionId: string,
    body: ArrayBuffer | Uint8Array
  ): Promise<unknown> {
    const url = `${this.baseUrl}/upload/simple?sessionId=${encodeURIComponent(sessionId)}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: body instanceof Uint8Array ? Buffer.from(body) : body,
    });

    const data = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      throw new StorageApiError(
        data.error ?? `Upload failed (${response.status})`,
        response.status
      );
    }
    return data;
  }

  /** presigned URL へ PUT */
  async putPresigned(url: string, body: ArrayBuffer | Uint8Array): Promise<string | null> {
    const response = await fetch(url, {
      method: "PUT",
      body: body instanceof Uint8Array ? Buffer.from(body) : body,
    });
    if (!response.ok) {
      throw new StorageApiError(`Presigned upload failed (${response.status})`, response.status);
    }
    return response.headers.get("ETag");
  }

  /** ダウンロード Blob 取得 */
  async downloadBlob(storagePath: string): Promise<{
    blob: ArrayBuffer;
    contentType: string;
  }> {
    const info = await this.request<{ mode?: string; url?: string }>(
      `download/url?path=${encodeURIComponent(storagePath)}`
    );

    if (info.mode === "direct" && info.url) {
      const response = await fetch(info.url, { method: "GET" });
      if (!response.ok) {
        throw new StorageApiError("ダウンロードに失敗しました", response.status);
      }
      const blob = await response.arrayBuffer();
      return {
        blob,
        contentType: response.headers.get("Content-Type") ?? "application/octet-stream",
      };
    }

    const response = await fetch(
      `${this.baseUrl}/download?path=${encodeURIComponent(storagePath)}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      throw new StorageApiError(
        data.error ?? "ダウンロードに失敗しました",
        response.status
      );
    }
    const blob = await response.arrayBuffer();
    return {
      blob,
      contentType: response.headers.get("Content-Type") ?? "application/octet-stream",
    };
  }
}
