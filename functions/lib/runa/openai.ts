/**
 * Runa — Cloudflare AI / OpenAI 互換クライアント
 * - Workers AI 等: /chat/completions
 * - openai/gpt-5.6-luna 等: /responses（Chat Completions 非対応）
 */

import type { Env } from "../types";

export interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content?: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
  name?: string;
}

export interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

export interface ToolDefinition {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export interface CompletionResult {
  content: string | null;
  toolCalls: ToolCall[];
  finishReason: string | null;
}

const CLOUDFLARE_AI_V1_PREFIX =
  "https://api.cloudflare.com/client/v4/accounts/";

type ResponsesInputItem = Record<string, unknown>;

function resolveAccountId(env: Env): string {
  return (
    env.CLOUDFLARE_ACCOUNT_ID?.trim() ||
    env.R2_ACCOUNT_ID?.trim() ||
    ""
  );
}

function resolveBaseUrl(env: Env): string {
  const raw = env.RUNA_OPENAI_BASE_URL?.trim();
  if (raw) return raw.replace(/\/+$/, "");

  const accountId = resolveAccountId(env);
  if (!accountId) {
    throw new Error(
      "RUNA_OPENAI_BASE_URL または CLOUDFLARE_ACCOUNT_ID（または R2_ACCOUNT_ID）が未設定です"
    );
  }
  return `${CLOUDFLARE_AI_V1_PREFIX}${accountId}/ai/v1`;
}

function resolveGatewayId(env: Env): string | null {
  const gateway = env.RUNA_AI_GATEWAY_ID?.trim();
  return gateway || null;
}

/** Cloudflare AI 向けにモデル ID を正規化 */
export function resolveRunaModel(env: Env): string {
  const model = env.RUNA_MODEL?.trim() || "openai/gpt-5.6-luna";
  if (model.includes("/")) return model;
  if (/^gpt-5\.6-/i.test(model)) return `openai/${model}`;
  if (model.startsWith("@cf/")) return model;
  return model;
}

function resolveApiKey(env: Env): string {
  const key =
    env.RUNA_OPENAI_API_KEY?.trim() || env.CLOUDFLARE_API_TOKEN?.trim();
  if (!key) {
    throw new Error(
      "RUNA_OPENAI_API_KEY または CLOUDFLARE_API_TOKEN が未設定です"
    );
  }
  return key;
}

/** gpt-5.6-luna 等は Responses API 専用 */
function usesResponsesApi(model: string): boolean {
  const bare = model.includes("/") ? model.split("/").pop() ?? model : model;
  return /^gpt-5\.6-/i.test(bare);
}

function usesWorkersAiGatewayHeader(model: string): boolean {
  return model.startsWith("@cf/");
}

function extractApiError(body: unknown, status: number): string {
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    const errors = record.errors;
    if (Array.isArray(errors) && errors.length > 0) {
      const first = errors[0];
      if (first && typeof first === "object" && "message" in first) {
        return String((first as { message: unknown }).message);
      }
    }
    const error = record.error;
    if (error && typeof error === "object" && "message" in error) {
      const message = String((error as { message: unknown }).message);
      if (status === 402 && message.includes("Gateway authentication")) {
        return (
          "openai/gpt-5.6-luna には AI Gateway の認証（Unified Billing）が必要です。" +
          "Cloudflare ダッシュボードで AI Gateway の認証を有効にするか、" +
          "RUNA_MODEL=@cf/moonshotai/kimi-k2.6 など Chat Completions 対応モデルに変更してください。"
        );
      }
      return message;
    }
  }
  return `AI API エラー (${status})`;
}

function buildRequestHeaders(env: Env, model: string): Record<string, string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${resolveApiKey(env)}`,
    "Content-Type": "application/json",
  };
  const gatewayId = resolveGatewayId(env);
  if (gatewayId || usesWorkersAiGatewayHeader(model)) {
    headers["cf-aig-gateway-id"] = gatewayId || "default";
  }
  return headers;
}

function convertToolsForResponses(
  tools: ToolDefinition[]
): ResponsesInputItem[] {
  return tools.map((tool) => ({
    type: "function",
    name: tool.function.name,
    description: tool.function.description,
    parameters: tool.function.parameters,
    strict: false,
  }));
}

function buildResponsesInput(messages: ChatMessage[]): {
  instructions?: string;
  input: ResponsesInputItem[];
} {
  const systemText = messages
    .filter((message) => message.role === "system" && message.content)
    .map((message) => message.content)
    .join("\n\n");

  const input: ResponsesInputItem[] = [];
  for (const message of messages) {
    if (message.role === "system") continue;

    if (message.role === "user") {
      input.push({
        role: "user",
        content: message.content ?? "",
      });
      continue;
    }

    if (message.role === "assistant") {
      if (message.content) {
        input.push({
          role: "assistant",
          content: message.content,
        });
      }
      for (const call of message.tool_calls ?? []) {
        input.push({
          type: "function_call",
          call_id: call.id,
          name: call.function.name,
          arguments: call.function.arguments,
        });
      }
      continue;
    }

    if (message.role === "tool" && message.tool_call_id) {
      input.push({
        type: "function_call_output",
        call_id: message.tool_call_id,
        output: message.content ?? "",
      });
    }
  }

  return {
    instructions: systemText || undefined,
    input,
  };
}

function parseResponsesOutput(body: Record<string, unknown>): CompletionResult {
  const output = Array.isArray(body.output) ? body.output : [];
  let content = "";
  const toolCalls: ToolCall[] = [];

  for (const item of output) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;

    if (record.type === "message" && Array.isArray(record.content)) {
      for (const part of record.content) {
        if (!part || typeof part !== "object") continue;
        const partRecord = part as Record<string, unknown>;
        if (partRecord.type === "output_text" && typeof partRecord.text === "string") {
          content += partRecord.text;
        }
      }
      continue;
    }

    if (record.type === "function_call") {
      const callId =
        typeof record.call_id === "string"
          ? record.call_id
          : typeof record.id === "string"
            ? record.id
            : `call_${toolCalls.length}`;
      toolCalls.push({
        id: callId,
        type: "function",
        function: {
          name: String(record.name ?? ""),
          arguments: String(record.arguments ?? "{}"),
        },
      });
    }
  }

  const finishReason =
    typeof body.status === "string" ? body.status : null;

  return {
    content: content || null,
    toolCalls,
    finishReason,
  };
}

async function requestResponsesApi(
  env: Env,
  model: string,
  messages: ChatMessage[],
  tools: ToolDefinition[]
): Promise<CompletionResult> {
  const { instructions, input } = buildResponsesInput(messages);
  const body: Record<string, unknown> = {
    model,
    input,
    tools: convertToolsForResponses(tools),
    tool_choice: "auto",
    reasoning: { effort: "none" },
    max_output_tokens: 4096,
    store: false,
    parallel_tool_calls: true,
  };
  if (instructions) body.instructions = instructions;

  const response = await fetch(`${resolveBaseUrl(env)}/responses`, {
    method: "POST",
    headers: buildRequestHeaders(env, model),
    body: JSON.stringify(body),
  });

  const responseBody = (await response.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;

  if (!response.ok) {
    throw new Error(extractApiError(responseBody, response.status));
  }

  return parseResponsesOutput(responseBody);
}

async function requestChatCompletionsApi(
  env: Env,
  model: string,
  messages: ChatMessage[],
  tools: ToolDefinition[]
): Promise<CompletionResult> {
  const body: Record<string, unknown> = {
    model,
    messages,
    tools,
    tool_choice: "auto",
    stream: false,
  };
  if (/gpt-5\.6/i.test(model)) {
    body.reasoning_effort = "none";
  }

  const response = await fetch(`${resolveBaseUrl(env)}/chat/completions`, {
    method: "POST",
    headers: buildRequestHeaders(env, model),
    body: JSON.stringify(body),
  });

  const responseBody = (await response.json().catch(() => ({}))) as {
    error?: { message?: string };
    errors?: Array<{ message?: string }>;
    choices?: Array<{
      finish_reason?: string;
      message?: {
        content?: string | null;
        tool_calls?: ToolCall[];
      };
    }>;
  };

  if (!response.ok) {
    throw new Error(extractApiError(responseBody, response.status));
  }

  const choice = responseBody.choices?.[0];
  const message = choice?.message;
  return {
    content: message?.content ?? null,
    toolCalls: message?.tool_calls ?? [],
    finishReason: choice?.finish_reason ?? null,
  };
}

/** 非ストリーミング completion（ツールループ用） */
export async function runaChatCompletion(
  env: Env,
  messages: ChatMessage[],
  tools: ToolDefinition[]
): Promise<CompletionResult> {
  const model = resolveRunaModel(env);
  if (usesResponsesApi(model)) {
    return await requestResponsesApi(env, model, messages, tools);
  }
  return await requestChatCompletionsApi(env, model, messages, tools);
}
