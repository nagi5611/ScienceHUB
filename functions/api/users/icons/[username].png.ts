/**
 * ユーザーアイコン配信 API（R2: users/icons/<username>.png）
 */

import type { Env } from "../../../lib/types";
import { getUserIcon } from "../../../lib/user-icons";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const raw = context.params.username;
  const username = Array.isArray(raw) ? raw[0] : raw;
  if (!username || !/^[a-zA-Z0-9_-]+$/.test(username)) {
    return new Response("Not found", { status: 404 });
  }

  const object = await getUserIcon(context.env, username);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=3600");
  headers.set("ETag", object.httpEtag);

  const ifNoneMatch = context.request.headers.get("If-None-Match");
  if (ifNoneMatch && ifNoneMatch === object.httpEtag) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(object.body, { status: 200, headers });
};
