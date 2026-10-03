/**
 * 3Dプリンター利用ガイド本文の取得・保存
 */

import type { Env } from "../../lib/types";
import { jsonError } from "../../lib/types";
import {
  manualEditorDenied,
  manualUserDenied,
  parseManualContent,
  readManualContent,
  writeManualContent,
} from "../../lib/3dprintmanual-content";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const denied = await manualUserDenied(context.request, context.env);
  if (denied) return denied;

  try {
    const content = await readManualContent(context.env);
    return Response.json({ content });
  } catch (error) {
    const message = error instanceof Error ? error.message : "本文の読み込みに失敗しました";
    return jsonError(message, 500);
  }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const denied = await manualEditorDenied(context.request, context.env);
  if (denied) return denied;

  const length = Number(context.request.headers.get("content-length") ?? "0");
  if (length > 1_000_000) return jsonError("本文が大きすぎます", 413);

  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return jsonError("JSON を読み取れませんでした", 400);
  }

  try {
    const content = parseManualContent(body);
    await writeManualContent(context.env, content);
    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "本文の保存に失敗しました";
    return jsonError(message, 400);
  }
};
