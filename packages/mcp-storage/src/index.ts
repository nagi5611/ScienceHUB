#!/usr/bin/env node
/**
 * ScienceHUB クラウドストレージ MCP サーバー（stdio）
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { INLINE_DOWNLOAD_MAX_BYTES, loadConfig } from "./config.js";
import { StorageApiClient, StorageApiError } from "./client.js";

const TEXT_CONTENT_TYPES = new Set([
  "text/plain",
  "text/html",
  "text/css",
  "text/csv",
  "text/markdown",
  "application/json",
  "application/xml",
  "application/javascript",
]);

function isProbablyText(contentType: string): boolean {
  if (contentType.startsWith("text/")) return true;
  return TEXT_CONTENT_TYPES.has(contentType);
}

function toolResultText(data: unknown): { content: Array<{ type: "text"; text: string }> } {
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
  };
}

function toolResultError(message: string): { content: Array<{ type: "text"; text: string }>; isError: true } {
  return {
    content: [{ type: "text", text: message }],
    isError: true,
  };
}

async function main(): Promise<void> {
  const config = loadConfig();
  const client = new StorageApiClient(config);

  const server = new Server(
    {
      name: "sciencehub-storage",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: "storage_list_roots",
        description: "List accessible cloud storage roots (user and group folders).",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "storage_list_directory",
        description: "List files and folders in a storage directory path (e.g. u/username/ or g/group-slug/docs/).",
        inputSchema: {
          type: "object",
          properties: {
            path: { type: "string", description: "Logical storage path" },
            offset: { type: "number", description: "Pagination offset" },
            limit: { type: "number", description: "Max items (default 40)" },
            sort: {
              type: "string",
              enum: ["name", "updatedAt", "createdAt", "createdBy", "updatedBy", "size"],
            },
            order: { type: "string", enum: ["asc", "desc"] },
          },
          required: ["path"],
        },
      },
      {
        name: "storage_search",
        description: "Search files under a storage path.",
        inputSchema: {
          type: "object",
          properties: {
            path: { type: "string", description: "Root path to search under" },
            q: { type: "string", description: "Search query" },
            scope: {
              type: "string",
              enum: ["folder", "subtree", "root"],
              description:
                "folder: current folder only; subtree: include subfolders; root: entire storage root",
            },
            offset: { type: "number" },
            limit: { type: "number" },
          },
          required: ["path"],
        },
      },
      {
        name: "storage_download",
        description:
          "Download a file. Returns inline text for small text files (<=512KB), otherwise a presigned download URL.",
        inputSchema: {
          type: "object",
          properties: {
            path: { type: "string", description: "File storage path" },
          },
          required: ["path"],
        },
      },
      {
        name: "storage_upload",
        description: "Upload a file to a directory path. Content must be UTF-8 text or base64 for binary.",
        inputSchema: {
          type: "object",
          properties: {
            path: { type: "string", description: "Destination directory path" },
            filename: { type: "string", description: "File name" },
            content: { type: "string", description: "File content (UTF-8 text)" },
            content_base64: { type: "string", description: "Base64-encoded binary content" },
          },
          required: ["path", "filename"],
        },
      },
      {
        name: "storage_mkdir",
        description: "Create a folder inside a storage path.",
        inputSchema: {
          type: "object",
          properties: {
            path: { type: "string", description: "Parent directory path" },
            name: { type: "string", description: "New folder name" },
          },
          required: ["path", "name"],
        },
      },
      {
        name: "storage_get_quota",
        description: "Get storage quota usage for a root path.",
        inputSchema: {
          type: "object",
          properties: {
            path: { type: "string", description: "Storage root path" },
          },
          required: ["path"],
        },
      },
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const input = (args ?? {}) as Record<string, unknown>;

    try {
      switch (name) {
        case "storage_list_roots": {
          const data = await client.request<{ roots: unknown[] }>("roots");
          return toolResultText(data);
        }

        case "storage_list_directory": {
          const path = String(input.path ?? "");
          const params = new URLSearchParams({ path });
          if (input.offset !== undefined) params.set("offset", String(input.offset));
          if (input.limit !== undefined) params.set("limit", String(input.limit));
          if (input.sort) params.set("sort", String(input.sort));
          if (input.order) params.set("order", String(input.order));
          const data = await client.request(`list?${params.toString()}`);
          return toolResultText(data);
        }

        case "storage_search": {
          const path = String(input.path ?? "");
          const params = new URLSearchParams({ path });
          if (input.q) params.set("q", String(input.q));
          if (input.scope) params.set("scope", String(input.scope));
          if (input.offset !== undefined) params.set("offset", String(input.offset));
          if (input.limit !== undefined) params.set("limit", String(input.limit));
          const data = await client.request(`search?${params.toString()}`);
          return toolResultText(data);
        }

        case "storage_download": {
          const path = String(input.path ?? "");
          const info = await client.request<{ mode?: string; url?: string }>(
            `download/url?path=${encodeURIComponent(path)}`
          );

          if (info.mode === "direct" && info.url) {
            const response = await fetch(info.url);
            if (!response.ok) {
              return toolResultError("Presigned download failed");
            }
            const blob = await response.arrayBuffer();
            const contentType = response.headers.get("Content-Type") ?? "application/octet-stream";

            if (blob.byteLength <= INLINE_DOWNLOAD_MAX_BYTES && isProbablyText(contentType)) {
              const text = new TextDecoder().decode(blob);
              return toolResultText({
                mode: "inline",
                path,
                contentType,
                sizeBytes: blob.byteLength,
                content: text,
              });
            }

            return toolResultText({
              mode: "url",
              path,
              contentType,
              sizeBytes: blob.byteLength,
              url: info.url,
            });
          }

          const { blob, contentType } = await client.downloadBlob(path);
          if (blob.byteLength <= INLINE_DOWNLOAD_MAX_BYTES && isProbablyText(contentType)) {
            const text = new TextDecoder().decode(blob);
            return toolResultText({
              mode: "inline",
              path,
              contentType,
              sizeBytes: blob.byteLength,
              content: text,
            });
          }

          return toolResultText({
            mode: "proxy_too_large",
            path,
            contentType,
            sizeBytes: blob.byteLength,
            message:
              "File exceeds inline limit. Use the ScienceHUB web UI or configure R2 presigned downloads.",
          });
        }

        case "storage_upload": {
          const dirPath = String(input.path ?? "").trim();
          const filename = String(input.filename ?? "").trim();
          if (!dirPath || !filename) {
            return toolResultError("path and filename are required");
          }

          let bytes: Uint8Array;
          if (typeof input.content_base64 === "string" && input.content_base64) {
            bytes = Uint8Array.from(Buffer.from(input.content_base64, "base64"));
          } else if (typeof input.content === "string") {
            bytes = new TextEncoder().encode(input.content);
          } else {
            return toolResultError("content or content_base64 is required");
          }

          const init = await client.request<{ sessionId: string }>("upload/init", {
            method: "POST",
            json: {
              path: dirPath,
              filename,
              size: bytes.byteLength,
            },
          });

          let usedPresigned = false;
          try {
            const urlInfo = await client.request<{ url: string }>(
              `upload/url?sessionId=${encodeURIComponent(init.sessionId)}`
            );
            await client.putPresigned(urlInfo.url, bytes);
            usedPresigned = true;
          } catch {
            await client.uploadSimple(init.sessionId, bytes);
          }

          const completed = await client.request("upload/complete", {
            method: "POST",
            json: {
              sessionId: init.sessionId,
              directUpload: usedPresigned,
            },
          });

          return toolResultText(completed);
        }

        case "storage_mkdir": {
          const data = await client.request("mkdir", {
            method: "POST",
            json: {
              path: String(input.path ?? ""),
              name: String(input.name ?? ""),
            },
          });
          return toolResultText(data);
        }

        case "storage_get_quota": {
          const path = String(input.path ?? "");
          const data = await client.request(
            `quota?path=${encodeURIComponent(path)}`
          );
          return toolResultText(data);
        }

        default:
          return toolResultError(`Unknown tool: ${name}`);
      }
    } catch (error) {
      if (error instanceof StorageApiError) {
        return toolResultError(error.message);
      }
      const message = error instanceof Error ? error.message : "Unknown error";
      return toolResultError(message);
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
