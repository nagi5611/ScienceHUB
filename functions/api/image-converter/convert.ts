/**
 * 画像変換 API（Cloudflare Images Worker へプロキシ）
 */

import type { Env } from "../../lib/types";
import { jsonError } from "../../lib/types";
import { getDb } from "../../lib/db";
import { requireUser } from "../../lib/auth";
import { canUserAccessApp } from "../../lib/apps";
import {
  IMAGE_CONVERTER_APP_SLUG,
  MAX_SERVER_CONVERT_BYTES,
  getServerOutputMime,
  isServerConvertFile,
  parseServerOutputFormat,
} from "../../lib/image-converter/cloudflare-images";

/** POST /api/image-converter/convert */
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const auth = await requireUser(context.request, context.env);
  if (auth instanceof Response) return auth;

  const db = getDb(context.env);
  const allowed = await canUserAccessApp(db, auth.id, IMAGE_CONVERTER_APP_SLUG);
  if (!allowed) {
    return jsonError("このアプリへのアクセス権限がありません", 403);
  }

  if (!context.env.IMAGE_CONVERTER) {
    return jsonError(
      "サーバー変換は現在利用できません（image-converter Worker 未設定）",
      503
    );
  }

  let formData: FormData;
  try {
    formData = await context.request.formData();
  } catch {
    return jsonError("フォームデータの解析に失敗しました", 400);
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return jsonError("file を指定してください", 400);
  }

  if (!file.size) {
    return jsonError("空のファイルは変換できません", 400);
  }

  if (file.size > MAX_SERVER_CONVERT_BYTES) {
    return jsonError(
      `ファイルサイズは ${Math.round(MAX_SERVER_CONVERT_BYTES / (1024 * 1024))}MB 以下にしてください`,
      400
    );
  }

  if (!isServerConvertFile(file.name, file.type)) {
    return jsonError("この API で変換できる形式ではありません", 400);
  }

  const format = parseServerOutputFormat(String(formData.get("format") ?? ""));
  if (!format) {
    return jsonError("出力形式が不正です", 400);
  }

  const forwardForm = new FormData();
  forwardForm.append("file", file);
  forwardForm.append("format", format);
  forwardForm.append("quality", String(formData.get("quality") ?? 85));
  forwardForm.append("maxEdge", String(formData.get("maxEdge") ?? 0));

  const headers = new Headers();
  const secret = context.env.IMAGE_CONVERTER_WORKER_SECRET?.trim();
  if (secret) {
    headers.set("X-Image-Converter-Secret", secret);
  }

  const workerResponse = await context.env.IMAGE_CONVERTER.fetch(
    new Request("https://image-converter/convert", {
      method: "POST",
      headers,
      body: forwardForm,
    })
  );

  if (!workerResponse.ok) {
    let message = "Cloudflare Images での変換に失敗しました";
    try {
      const data = (await workerResponse.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      /* ignore */
    }
    return jsonError(message, workerResponse.status === 401 ? 502 : workerResponse.status);
  }

  const body = await workerResponse.arrayBuffer();
  return new Response(body, {
    headers: {
      "Content-Type": getServerOutputMime(format),
      "Cache-Control": "private, no-store",
    },
  });
};
