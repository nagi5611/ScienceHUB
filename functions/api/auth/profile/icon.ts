/**
 * プロフィールアイコンアップロード API
 */

import type { Env } from "../../../lib/types";
import { jsonError } from "../../../lib/types";
import { requireUser } from "../../../lib/auth";
import { markUserIconUploaded } from "../../../lib/profile";
import { putUserIcon } from "../../../lib/user-icons";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const auth = await requireUser(context.request, context.env);
  if (auth instanceof Response) return auth;

  const contentType = context.request.headers.get("Content-Type") ?? "";

  let buffer: ArrayBuffer;

  if (contentType.includes("multipart/form-data")) {
    let formData: FormData;
    try {
      formData = await context.request.formData();
    } catch {
      return jsonError("フォームデータの解析に失敗しました", 400);
    }

    const file = formData.get("icon");
    if (!(file instanceof File)) {
      return jsonError("icon ファイルを指定してください", 400);
    }
    buffer = await file.arrayBuffer();
  } else if (contentType.includes("image/png")) {
    buffer = await context.request.arrayBuffer();
  } else {
    return jsonError("PNG 画像を送信してください", 400);
  }

  if (!buffer.byteLength) {
    return jsonError("空の画像はアップロードできません", 400);
  }

  try {
    await putUserIcon(context.env, auth.username, buffer);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "アイコンのアップロードに失敗しました";
    return jsonError(message, 400);
  }

  const avatarUrl = await markUserIconUploaded(context.env, auth.id);
  if (!avatarUrl) {
    return jsonError("アイコン情報の保存に失敗しました", 500);
  }

  return Response.json({ ok: true, avatar_url: avatarUrl });
};
