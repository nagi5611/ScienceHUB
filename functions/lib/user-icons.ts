/**
 * ユーザーアイコン（R2: users/icons/<username>.png）
 */

import { getFiles } from "./r2";
import type { Env } from "./types";

export const ICON_MAX_BYTES = 1024 * 1024;

/** R2 オブジェクトキーを返す */
export function userIconR2Key(username: string): string {
  return `users/icons/${username}.png`;
}

/** 公開 URL を返す（キャッシュバスター任意） */
export function userIconPublicUrl(username: string, version?: number): string {
  const base = `/api/users/icons/${encodeURIComponent(username)}.png`;
  return version ? `${base}?v=${version}` : base;
}

/** PNG マジックバイトか検証する */
export function isPngBuffer(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  );
}

/** ユーザーアイコンを R2 に保存する */
export async function putUserIcon(
  env: Env,
  username: string,
  data: ArrayBuffer
): Promise<void> {
  const bytes = new Uint8Array(data);
  if (!isPngBuffer(bytes)) {
    throw new Error("PNG 形式の画像のみアップロードできます");
  }
  if (bytes.length > ICON_MAX_BYTES) {
    throw new Error("画像サイズが大きすぎます（最大 1MB）");
  }

  await getFiles(env).put(userIconR2Key(username), data, {
    httpMetadata: {
      contentType: "image/png",
      cacheControl: "public, max-age=3600",
    },
  });
}

/** R2 からユーザーアイコンを取得する */
export async function getUserIcon(
  env: Env,
  username: string
): Promise<R2ObjectBody | null> {
  const object = await getFiles(env).get(userIconR2Key(username));
  if (!object || !("body" in object)) {
    return null;
  }
  return object;
}

/** DB / R2 から公開アイコン URL を解決する */
export async function resolveUserAvatarUrl(
  env: Env,
  user: { username: string; avatar_url: string | null; updated_at: number }
): Promise<string | null> {
  if (user.avatar_url) {
    return user.avatar_url;
  }

  try {
    const head = await getFiles(env).head(userIconR2Key(user.username));
    if (head) {
      return userIconPublicUrl(user.username, user.updated_at);
    }
  } catch (error) {
    console.error("resolveUserAvatarUrl failed:", error);
  }

  return null;
}
