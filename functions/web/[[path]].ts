/**
 * 公開静的サイト配信 — /web/{path_slug}/...
 */

import type { Env } from "../lib/types";
import { getDb } from "../lib/db";
import { getFiles } from "../lib/r2";
import { getActiveWebSiteByPathSlug } from "../lib/website-publish/sites";
import {
  isPageViewServePath,
  recordSitePageView,
} from "../lib/website-publish/analytics";
import {
  parseWebServePath,
  resolveServeRelativePath,
  r2ObjectResponse,
  webNotFoundResponse,
} from "../lib/website-publish/serve";

export const onRequest: PagesFunction<Env> = async (context) => {
  const pathParam = context.params.path;
  const rawPath =
    typeof pathParam === "string"
      ? pathParam
      : Array.isArray(pathParam)
        ? pathParam.join("/")
        : "";

  const parsed = parseWebServePath(rawPath);
  if (!parsed) {
    return webNotFoundResponse();
  }

  const db = getDb(context.env);
  const site = await getActiveWebSiteByPathSlug(db, parsed.pathSlug);
  if (!site) {
    return webNotFoundResponse();
  }

  const relativePath = resolveServeRelativePath(parsed.relativePath);
  const r2Key = `${site.r2_prefix}${relativePath}`;
  const bucket = getFiles(context.env);

  if (isPageViewServePath(parsed.relativePath)) {
    context.waitUntil(recordSitePageView(db, site.id));
  }

  let obj = await bucket.get(r2Key);
  if (!obj && relativePath !== "index.html") {
    obj = await bucket.get(`${site.r2_prefix}index.html`);
    if (obj) {
      return r2ObjectResponse(obj, "index.html");
    }
  }

  if (!obj) {
    return webNotFoundResponse();
  }

  return r2ObjectResponse(obj, relativePath);
};
