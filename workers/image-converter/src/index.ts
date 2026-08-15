/**
 * image-converter Worker — Cloudflare Images で HEIC / TIFF / RAW 等を変換
 */

import {
  MAX_SERVER_CONVERT_BYTES,
  getFileExtension,
  getServerOutputMime,
  isServerConvertFile,
  parseServerOutputFormat,
  transformWithCloudflareImages,
} from "../../../functions/lib/image-converter/cloudflare-images";

interface WorkerEnv {
  IMAGES: unknown;
  IMAGE_CONVERTER_WORKER_SECRET?: string;
}

function unauthorized(): Response {
  return Response.json({ error: "unauthorized" }, { status: 401 });
}

/** 内部呼び出しの認証 */
function checkSecret(request: Request, env: WorkerEnv): boolean {
  const secret = env.IMAGE_CONVERTER_WORKER_SECRET?.trim();
  if (!secret) return true;
  return request.headers.get("X-Image-Converter-Secret") === secret;
}

/** POST /convert */
async function handleConvert(request: Request, env: WorkerEnv): Promise<Response> {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "フォームデータの解析に失敗しました" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "file を指定してください" }, { status: 400 });
  }

  if (!file.size) {
    return Response.json({ error: "空のファイルは変換できません" }, { status: 400 });
  }

  if (file.size > MAX_SERVER_CONVERT_BYTES) {
    return Response.json(
      {
        error: `ファイルサイズは ${Math.round(MAX_SERVER_CONVERT_BYTES / (1024 * 1024))}MB 以下にしてください`,
      },
      { status: 400 }
    );
  }

  if (!isServerConvertFile(file.name, file.type)) {
    return Response.json({ error: "この API で変換できる形式ではありません" }, { status: 400 });
  }

  const format = parseServerOutputFormat(String(formData.get("format") ?? ""));
  if (!format) {
    return Response.json({ error: "出力形式が不正です" }, { status: 400 });
  }

  const quality = Number(formData.get("quality") ?? 85);
  const maxEdge = Number(formData.get("maxEdge") ?? 0);

  try {
    const converted = await transformWithCloudflareImages(env, file.stream(), {
      format,
      quality: Number.isFinite(quality) ? quality : 85,
      maxEdge: Number.isFinite(maxEdge) && maxEdge > 0 ? Math.round(maxEdge) : 0,
    });

    if (!converted.ok) {
      const detail = await converted.text().catch(() => "");
      console.error("Cloudflare Images conversion failed", {
        status: converted.status,
        detail: detail.slice(0, 500),
        inputExt: getFileExtension(file.name),
      });
      return Response.json(
        {
          error:
            "Cloudflare Images での変換に失敗しました（非対応形式の可能性があります）",
        },
        { status: 502 }
      );
    }

    const body = await converted.arrayBuffer();
    return new Response(body, {
      headers: {
        "Content-Type": getServerOutputMime(format),
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("image-converter worker error", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "変換に失敗しました" },
      { status: 500 }
    );
  }
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    if (!checkSecret(request, env)) {
      return unauthorized();
    }

    const url = new URL(request.url);
    if (request.method === "POST" && (url.pathname === "/convert" || url.pathname === "/")) {
      return handleConvert(request, env);
    }

    return Response.json({ error: "not_found" }, { status: 404 });
  },
};
