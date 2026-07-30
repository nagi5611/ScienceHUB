/**
 * tp-pipeline Worker — 実装ジョブ + ブラウザ検証
 */

import puppeteer from "@cloudflare/puppeteer";
import type { Env } from "../../functions/lib/types";
import {
  ARTIFACT_INDEX,
  ARTIFACT_VERIFY_JSON,
  ARTIFACT_VERIFY_PNG,
  getArtifact,
  putArtifact,
} from "../../functions/lib/third-party/artifacts";
import { verifyHtmlStatic } from "../../functions/lib/third-party/browser-verify";
import {
  failImplementJob,
  runImplementJob,
} from "../../functions/lib/third-party/implement-runner";
import { getTpJob, markJobRunning } from "../../functions/lib/third-party/jobs";
import type { TpProjectPipelineRow } from "../../functions/lib/third-party/gemini-pipeline";

interface WorkerEnv extends Env {
  BROWSER: Fetcher;
}

function unauthorized(): Response {
  return Response.json({ error: "unauthorized" }, { status: 401 });
}

function checkSecret(request: Request, env: WorkerEnv): boolean {
  const secret = env.TP_PIPELINE_WORKER_SECRET;
  if (!secret) return false;
  return request.headers.get("X-Tp-Pipeline-Secret") === secret;
}

async function loadProjectForJob(
  db: D1Database,
  projectId: string
): Promise<TpProjectPipelineRow | null> {
  const row = await db
    .prepare(
      `SELECT id, owner_user_id, title, slug, status, r2_prefix, dir_name,
              workflow_phase, context_summary, pending_form_json, review_passed,
              implement_attempts, review_loop_count, awaiting_implement_confirm,
              COALESCE(maintain_attempts, 0) AS maintain_attempts
       FROM tp_projects WHERE id = ?`
    )
    .bind(projectId)
    .first<TpProjectPipelineRow>();
  return row ?? null;
}

async function runBrowserVerify(
  env: WorkerEnv,
  dirName: string,
  html: string
): Promise<{
  passed: boolean;
  errors: string[];
  warnings: string[];
  title?: string;
  bodyLength?: number;
  screenshotStored?: boolean;
}> {
  const staticFallback = verifyHtmlStatic(html);

  try {
    const browser = await puppeteer.launch(env.BROWSER);
    const page = await browser.newPage();
    const errors: string[] = [...staticFallback.errors];
    const warnings: string[] = [...staticFallback.warnings];

    page.on("pageerror", (err) => {
      errors.push(`pageerror: ${err.message}`);
    });
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(`console: ${msg.text()}`);
      }
    });

    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });
    const title = await page.title();
    const bodyLength = await page.evaluate(
      () => document.body?.innerHTML?.length ?? 0
    );

    let screenshotStored = false;
    try {
      const screenshot = await page.screenshot({ type: "png" });
      const key = `third-party/${dirName}/${ARTIFACT_VERIFY_PNG}`;
      await env.FILES.put(key, screenshot, {
        httpMetadata: { contentType: "image/png" },
      });
      screenshotStored = true;
    } catch {
      warnings.push("スクリーンショットの保存に失敗しました");
    }

    await browser.close();

    return {
      passed: errors.length === 0,
      errors,
      warnings,
      title,
      bodyLength,
      screenshotStored,
    };
  } catch (error) {
    warnings.push(
      `Browser Run 失敗: ${error instanceof Error ? error.message : String(error)}`
    );
    return {
      ...staticFallback,
      warnings,
    };
  }
}

async function handleVerify(
  request: Request,
  env: WorkerEnv
): Promise<Response> {
  const body = (await request.json()) as {
    project_id?: string;
    dir_name?: string;
  };
  const dirName = body.dir_name?.trim();
  if (!dirName) {
    return Response.json({ error: "dir_name required" }, { status: 400 });
  }

  const html = await getArtifact(env.FILES, dirName, ARTIFACT_INDEX);
  if (!html?.trim()) {
    return Response.json({
      passed: false,
      errors: ["index.html が空です"],
      warnings: [],
      source: "worker",
    });
  }

  const result = await runBrowserVerify(env, dirName, html);
  const payload = {
    version: 1,
    at: Date.now(),
    passed: result.passed,
    errors: result.errors,
    warnings: result.warnings,
    title: result.title,
    bodyLength: result.bodyLength,
    screenshotStored: result.screenshotStored ?? false,
    source: "browser",
  };
  await putArtifact(
    env.FILES,
    dirName,
    ARTIFACT_VERIFY_JSON,
    JSON.stringify(payload, null, 2),
    "application/json; charset=utf-8"
  );

  return Response.json({
    ...result,
    source: "browser",
  });
}

async function handleImplement(
  request: Request,
  env: WorkerEnv
): Promise<Response> {
  const body = (await request.json()) as {
    job_id?: string;
    project_id?: string;
  };
  const jobId = body.job_id?.trim();
  const projectId = body.project_id?.trim();
  if (!jobId || !projectId) {
    return Response.json({ error: "job_id and project_id required" }, {
      status: 400,
    });
  }

  const job = await getTpJob(env.DB, jobId);
  if (!job || job.project_id !== projectId) {
    return Response.json({ error: "job not found" }, { status: 404 });
  }

  const project = await loadProjectForJob(env.DB, projectId);
  if (!project) {
    await failImplementJob(env.DB, jobId, projectId, "プロジェクトが見つかりません");
    return Response.json({ error: "project not found" }, { status: 404 });
  }

  try {
    await markJobRunning(env.DB, jobId);
    const result = await runImplementJob(
      env,
      env.DB,
      env.FILES,
      project,
      jobId
    );
    return Response.json({ ok: true, ...result });
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "実装ジョブに失敗しました";
    await failImplementJob(env.DB, jobId, projectId, msg);
    return Response.json({ error: msg }, { status: 500 });
  }
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    if (!checkSecret(request, env)) return unauthorized();

    const url = new URL(request.url);
    if (request.method !== "POST") {
      return Response.json({ error: "method not allowed" }, { status: 405 });
    }

    if (url.pathname === "/verify") {
      return await handleVerify(request, env);
    }
    if (url.pathname === "/implement") {
      return await handleImplement(request, env);
    }

    return Response.json({ error: "not found" }, { status: 404 });
  },
};
