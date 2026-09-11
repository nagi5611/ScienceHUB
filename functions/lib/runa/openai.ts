/**
 * Runa — Cloudflare AI / OpenAI 互換クライアント
 * - Workers AI 等: /chat/completions
 * - openai/gpt-5.6-luna 等: /responses（Chat Completions 非対応）
 */

import type { Env } from "../types";
import {
  runaAiGatewayId,
  runaModel,
  runaOpenAiApiKey,
  runaOpenAiBaseUrl,
} from "./env";

export interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content?: string | null;
  /** vision 用 data URL（最後の user メッセージのみ） */
  images?: string[];
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
  reasoning: string | null;
  toolCalls: ToolCall[];
  finishReason: string | null;
}

export interface CompletionCallbacks {
  onTextDelta?: (text: string) => void;
  onReasoningDelta?: (text: string) => void;
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
  const raw = runaOpenAiBaseUrl(env);
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
  const gateway = runaAiGatewayId(env);
  return gateway || null;
}

/** Cloudflare AI 向けにモデル ID を正規化 */
export function resolveRunaModel(env: Env): string {
  const model = runaModel(env) || "openai/gpt-5.6-luna";
  if (model.includes("/")) return model;
  if (/^gpt-5\.6-/i.test(model)) return `openai/${model}`;
  if (model.startsWith("@cf/")) return model;
  return model;
}

function resolveApiKey(env: Env): string {
  const key = runaOpenAiApiKey(env) || env.CLOUDFLARE_API_TOKEN?.trim();
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
      if (message.images?.length) {
        input.push({
          role: "user",
          content: [
            { type: "input_text", text: message.content ?? "" },
            ...message.images.map((imageUrl) => ({
              type: "input_image",
              image_url: imageUrl,
              detail: "auto",
            })),
          ],
        });
      } else {
        input.push({
          role: "user",
          content: message.content ?? "",
        });
      }
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

function appendReasoningParts(
  parts: unknown[],
  reasoning: string,
  onReasoningDelta?: (text: string) => void
): string {
  let out = reasoning;
  for (const part of parts) {
    if (!part || typeof part !== "object") continue;
    const partRecord = part as Record<string, unknown>;
    if (
      partRecord.type === "reasoning_text" &&
      typeof partRecord.text === "string" &&
      partRecord.text
    ) {
      out += partRecord.text;
      onReasoningDelta?.(partRecord.text);
    }
  }
  return out;
}

function parseResponsesOutput(
  body: Record<string, unknown>,
  onReasoningDelta?: (text: string) => void
): CompletionResult {
  const output = Array.isArray(body.output) ? body.output : [];
  let content = "";
  let reasoning = "";
  const toolCalls: ToolCall[] = [];

  for (const item of output) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;

    if (record.type === "reasoning" && Array.isArray(record.content)) {
      reasoning = appendReasoningParts(
        record.content,
        reasoning,
        onReasoningDelta
      );
      continue;
    }

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
    reasoning: reasoning || null,
    toolCalls,
    finishReason,
  };
}

type ToolCallDraft = {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
};

/** OpenAI Chat Completions の SSE チャンクを1件処理 */
function mergeChatCompletionChunk(
  chunk: Record<string, unknown>,
  content: string,
  reasoning: string,
  toolDrafts: ToolCallDraft[],
  callbacks?: CompletionCallbacks
): { content: string; reasoning: string; finishReason: string | null } {
  const choices = Array.isArray(chunk.choices) ? chunk.choices : [];
  const choice = choices[0];
  if (!choice || typeof choice !== "object") {
    return { content, reasoning, finishReason: null };
  }
  const choiceRecord = choice as Record<string, unknown>;
  const delta =
    choiceRecord.delta && typeof choiceRecord.delta === "object"
      ? (choiceRecord.delta as Record<string, unknown>)
      : null;

  if (delta?.content && typeof delta.content === "string" && delta.content) {
    content += delta.content;
    callbacks?.onTextDelta?.(delta.content);
  }

  const reasoningDelta =
    (typeof delta?.reasoning_content === "string" && delta.reasoning_content) ||
    (typeof delta?.reasoning === "string" && delta.reasoning) ||
    "";
  if (reasoningDelta) {
    reasoning += reasoningDelta;
    callbacks?.onReasoningDelta?.(reasoningDelta);
  }

  const deltaToolCalls = Array.isArray(delta?.tool_calls) ? delta.tool_calls : [];
  for (const raw of deltaToolCalls) {
    if (!raw || typeof raw !== "object") continue;
    const tc = raw as Record<string, unknown>;
    const index =
      typeof tc.index === "number" ? tc.index : toolDrafts.length;
    if (!toolDrafts[index]) {
      toolDrafts[index] = {
        id: "",
        type: "function",
        function: { name: "", arguments: "" },
      };
    }
    const draft = toolDrafts[index];
    if (typeof tc.id === "string" && tc.id) draft.id = tc.id;
    const fn =
      tc.function && typeof tc.function === "object"
        ? (tc.function as Record<string, unknown>)
        : null;
    if (fn?.name && typeof fn.name === "string") {
      draft.function.name += fn.name;
    }
    if (fn?.arguments && typeof fn.arguments === "string") {
      draft.function.arguments += fn.arguments;
    }
  }

  const finishReason =
    typeof choiceRecord.finish_reason === "string"
      ? choiceRecord.finish_reason
      : null;
  return { content, reasoning, finishReason };
}

/** SSE 行をパースして completion チャンクを処理 */
async function consumeOpenAiSseStream(
  body: ReadableStream<Uint8Array>,
  onChunk: (chunk: Record<string, unknown>) => void
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        onChunk(JSON.parse(data) as Record<string, unknown>);
      } catch {
        /* skip malformed chunk */
      }
    }
  }
}

function formatMessagesForChatCompletions(
  messages: ChatMessage[]
): Array<Record<string, unknown>> {
  return messages.map((message) => {
    if (message.role === "user" && message.images?.length) {
      return {
        role: "user",
        content: [
          { type: "text", text: message.content ?? "" },
          ...message.images.map((imageUrl) => ({
            type: "image_url",
            image_url: { url: imageUrl },
          })),
        ],
      };
    }

    const formatted: Record<string, unknown> = {
      role: message.role,
      content: message.content ?? "",
    };
    if (message.tool_calls) formatted.tool_calls = message.tool_calls;
    if (message.tool_call_id) formatted.tool_call_id = message.tool_call_id;
    if (message.name) formatted.name = message.name;
    return formatted;
  });
}

async function requestChatCompletionsApi(
  env: Env,
  model: string,
  messages: ChatMessage[],
  tools: ToolDefinition[],
  callbacks?: CompletionCallbacks
): Promise<CompletionResult> {
  const body: Record<string, unknown> = {
    model,
    messages: formatMessagesForChatCompletions(messages),
    tools,
    tool_choice: "auto",
    stream: Boolean(callbacks?.onTextDelta),
  };
  if (/gpt-5\.6/i.test(model)) {
    body.reasoning_effort = "low";
  }

  const response = await fetch(`${resolveBaseUrl(env)}/chat/completions`, {
    method: "POST",
    headers: buildRequestHeaders(env, model),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const responseBody = (await response.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    throw new Error(extractApiError(responseBody, response.status));
  }

  if (!callbacks?.onTextDelta || !response.body) {
    const responseBody = (await response.json()) as {
      choices?: Array<{
        finish_reason?: string;
        message?: {
          content?: string | null;
          tool_calls?: ToolCall[];
        };
      }>;
    };
    const choice = responseBody.choices?.[0];
    const message = choice?.message;
    const messageRecord = message as Record<string, unknown> | undefined;
    const reasoningRaw =
      messageRecord?.reasoning_content ?? messageRecord?.reasoning;
    const reasoning =
      typeof reasoningRaw === "string" && reasoningRaw.trim()
        ? reasoningRaw.trim()
        : null;
    return {
      content: message?.content ?? null,
      reasoning,
      toolCalls: message?.tool_calls ?? [],
      finishReason: choice?.finish_reason ?? null,
    };
  }

  let content = "";
  let reasoning = "";
  let finishReason: string | null = null;
  const toolDrafts: ToolCallDraft[] = [];

  await consumeOpenAiSseStream(response.body, (chunk) => {
    const merged = mergeChatCompletionChunk(
      chunk,
      content,
      reasoning,
      toolDrafts,
      callbacks
    );
    content = merged.content;
    reasoning = merged.reasoning;
    if (merged.finishReason) finishReason = merged.finishReason;
  });

  const toolCalls = toolDrafts.filter((draft) => draft.function.name);
  return {
    content: content || null,
    reasoning: reasoning || null,
    toolCalls,
    finishReason,
  };
}

/** Responses API のストリームイベントからテキスト差分を抽出 */
function extractResponsesStreamDelta(event: Record<string, unknown>): string {
  if (event.type === "response.output_text.delta") {
    const delta = event.delta;
    if (typeof delta === "string") return delta;
    if (delta && typeof delta === "object" && "text" in delta) {
      const text = (delta as { text?: unknown }).text;
      if (typeof text === "string") return text;
    }
  }
  return "";
}

async function requestResponsesApi(
  env: Env,
  model: string,
  messages: ChatMessage[],
  tools: ToolDefinition[],
  callbacks?: CompletionCallbacks
): Promise<CompletionResult> {
  const { instructions, input } = buildResponsesInput(messages);
  const body: Record<string, unknown> = {
    model,
    input,
    tools: convertToolsForResponses(tools),
    tool_choice: "auto",
    reasoning: { effort: "low" },
    max_output_tokens: 4096,
    store: false,
    parallel_tool_calls: true,
    stream: Boolean(callbacks?.onTextDelta || callbacks?.onReasoningDelta),
  };
  if (instructions) body.instructions = instructions;

  const response = await fetch(`${resolveBaseUrl(env)}/responses`, {
    method: "POST",
    headers: buildRequestHeaders(env, model),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const responseBody = (await response.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    throw new Error(extractApiError(responseBody, response.status));
  }

  if (
    (!callbacks?.onTextDelta && !callbacks?.onReasoningDelta) ||
    !response.body
  ) {
    const responseBody = (await response.json()) as Record<string, unknown>;
    return parseResponsesOutput(responseBody, callbacks?.onReasoningDelta);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/event-stream")) {
    const responseBody = (await response.json()) as Record<string, unknown>;
    const parsed = parseResponsesOutput(
      responseBody,
      callbacks.onReasoningDelta
    );
    if (parsed.content) callbacks.onTextDelta?.(parsed.content);
    return parsed;
  }

  let content = "";
  let reasoning = "";
  const toolCalls: ToolCall[] = [];
  let finishReason: string | null = null;

  await consumeOpenAiSseStream(response.body, (event) => {
    const delta = extractResponsesStreamDelta(event);
    if (delta) {
      content += delta;
      callbacks.onTextDelta?.(delta);
    }

    if (event.type === "response.reasoning_text.delta") {
      const reasoningDelta =
        typeof event.delta === "string"
          ? event.delta
          : event.delta &&
              typeof event.delta === "object" &&
              typeof (event.delta as { text?: unknown }).text === "string"
            ? String((event.delta as { text: string }).text)
            : "";
      if (reasoningDelta) {
        reasoning += reasoningDelta;
        callbacks.onReasoningDelta?.(reasoningDelta);
      }
    }

    if (event.type === "response.completed" && event.response) {
      const parsed = parseResponsesOutput(
        event.response as Record<string, unknown>,
        callbacks.onReasoningDelta
      );
      if (!content && parsed.content) {
        content = parsed.content;
        callbacks.onTextDelta?.(parsed.content);
      }
      toolCalls.push(...parsed.toolCalls);
      finishReason = parsed.finishReason;
      if (!reasoning && parsed.reasoning) reasoning = parsed.reasoning;
    }

    if (event.type === "response.output_item.done") {
      const item = event.item;
      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        if (record.type === "function_call") {
          toolCalls.push({
            id: String(record.call_id ?? record.id ?? `call_${toolCalls.length}`),
            type: "function",
            function: {
              name: String(record.name ?? ""),
              arguments: String(record.arguments ?? "{}"),
            },
          });
        }
      }
    }
  });

  if (!toolCalls.length && !content) {
    return await requestResponsesApi(env, model, messages, tools);
  }

  return {
    content: content || null,
    reasoning: reasoning || null,
    toolCalls,
    finishReason,
  };
}

/** completion（ストリーミング時は onTextDelta でトークン単位に通知） */
export async function runaChatCompletion(
  env: Env,
  messages: ChatMessage[],
  tools: ToolDefinition[],
  callbacks?: CompletionCallbacks
): Promise<CompletionResult> {
  const model = resolveRunaModel(env);
  if (usesResponsesApi(model)) {
    return await requestResponsesApi(env, model, messages, tools, callbacks);
  }
  return await requestChatCompletionsApi(env, model, messages, tools, callbacks);
}
