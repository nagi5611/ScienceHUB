/**
 * サードパーティスタジオ — 10回検証ループ（s.mmh-virtual.jp）
 */
import { writeFileSync } from "fs";

const BASE = process.env.TP_BASE_URL || "https://s.mmh-virtual.jp";
const EMAIL = process.env.TP_EMAIL || "guest";
const PASSWORD = process.env.TP_PASSWORD || "guest1234";
const MAX_ROUNDS = Number(process.env.TP_ROUNDS || "10");
const CHAT_TIMEOUT_MS = Number(process.env.TP_CHAT_TIMEOUT || "120000");
const JOB_TIMEOUT_MS = Number(process.env.TP_JOB_TIMEOUT || "300000");

let cookieHeader = "";

const APP_SPECS = [
  { title: "R1 カウンター", prompt: "0から始まるカウンター。+と-ボタンで増減。" },
  { title: "R2 Todo", prompt: "Todoリスト。追加・削除・チェックで完了。" },
  { title: "R3 タイマー", prompt: "カウントダウンタイマー。開始・停止・リセット。" },
  { title: "R4 電卓", prompt: "四則演算できるシンプル電卓。" },
  { title: "R5 メモ", prompt: "テキストメモ。入力して保存・クリア。" },
  { title: "R6 色変更", prompt: "背景色をクリックでランダム変更するアプリ。" },
  { title: "R7 単位変換", prompt: "kmとmの単位変換フォーム。" },
  { title: "R8 パスワード", prompt: "ランダムパスワード生成ボタン。" },
  { title: "R9 投票", prompt: "A/B/Cの投票ボタンと票数表示。" },
  { title: "R10 クイズ", prompt: "1問クイズ。正解で「正解」表示。" },
];

const allIssues = [];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJson(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
      ...(opts.headers || {}),
    },
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { res, data };
}

async function login() {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: EMAIL, password: PASSWORD }),
  });
  const setCookie = res.headers.getSetCookie?.() || [];
  cookieHeader = setCookie.map((c) => c.split(";")[0]).join("; ");
  const data = await res.json();
  if (!res.ok) throw new Error(`Login failed: ${JSON.stringify(data)}`);
  return data.user;
}

async function waitForJob(projectId) {
  const start = Date.now();
  while (Date.now() - start < JOB_TIMEOUT_MS) {
    const { res, data } = await fetchJson(`/api/third-party/projects/${projectId}/job`);
    if (res.status === 404) {
      const detail = await getDetail(projectId);
      const phase = detail.project?.workflow_phase;
      if (["draft_ready", "app_maintain", "app_maintain_done"].includes(phase)) {
        return null;
      }
      if (!["flash_implement", "flash_implement_tasks", "flash_review", "write_req_and_plan"].includes(phase)) {
        return null;
      }
    } else {
      const job = data.job;
      if (!job) return null;
      if (job.status === "succeeded" || job.status === "failed" || job.status === "cancelled") {
        if (job.status === "failed") {
          throw new Error(job.error_message || "job failed");
        }
        return job;
      }
    }
    await sleep(3000);
  }
  throw new Error("job timeout");
}

async function chat(projectId, body, label = "") {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS);
  const events = [];
  const start = Date.now();
  let sseJobId = null;

  try {
    const res = await fetch(
      `${BASE}/api/third-party/projects/${projectId}/chat?stream=1`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: cookieHeader },
        body: JSON.stringify(body),
        signal: controller.signal,
      }
    );
    if (!res.ok) throw new Error(`Chat HTTP ${res.status}: ${await res.text()}`);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() || "";
      for (const block of parts) {
        const lines = block.split("\n");
        let event = "message";
        let dataLine = "";
        for (const line of lines) {
          if (line.startsWith("event:")) event = line.slice(6).trim();
          if (line.startsWith("data:")) dataLine = line.slice(5).trim();
        }
        if (dataLine) {
          try {
            const parsed = JSON.parse(dataLine);
            events.push({ event, data: parsed });
            if (event === "job" && parsed.jobId) sseJobId = parsed.jobId;
          } catch {
            events.push({ event, data: dataLine });
          }
        }
      }
    }
  } finally {
    clearTimeout(timer);
  }

  const done = events.find((e) => e.event === "done");
  const err = events.find((e) => e.event === "error");
  const jobId = done?.data?.active_job?.jobId || sseJobId;

  if (jobId) {
    await waitForJob(projectId);
    const detail = await getDetail(projectId);
    return {
      done: {
        data: {
          phase: detail.project?.workflow_phase,
          active_job: null,
        },
      },
      err,
      waitedJob: true,
    };
  }

  if (label) {
    console.log(
      `  [chat ${label}] ${Date.now() - start}ms phase=${done?.data?.phase ?? "err"}`
    );
  }
  return { done, err, waitedJob: false };
}

function buildFormResponses(form) {
  const responses = {};
  if (!form?.questions) return responses;
  for (const q of form.questions) {
    const opts = q.options || [];
    const pick =
      opts.find((o) => /実装|進む|build|このまま|はい/i.test(String(o))) || opts[0];
    responses[q.id] = pick ?? "はい";
  }
  return responses;
}

async function getDetail(projectId) {
  const { data } = await fetchJson(`/api/third-party/projects/${projectId}`);
  return data;
}

async function driveToDraft(projectId, initialPrompt) {
  let detail = await getDetail(projectId);
  let phase = detail.project?.workflow_phase;

  if (["discovery", "clarify"].includes(phase)) {
    await chat(projectId, { message: initialPrompt }, "initial");
    detail = await getDetail(projectId);
    phase = detail.project?.workflow_phase;
  }

  for (let i = 0; i < 3 && detail.pending_form; i++) {
    await chat(projectId, { form_responses: buildFormResponses(detail.pending_form) }, `form-${i}`);
    detail = await getDetail(projectId);
    phase = detail.project?.workflow_phase;
  }

  if (phase === "gate_deepen_or_build") {
    await chat(projectId, { message: "実装に進んでください" }, "gate-build");
    detail = await getDetail(projectId);
    phase = detail.project?.workflow_phase;
  }

  if (phase === "await_implement_confirm") {
    await chat(projectId, { message: "実装開始" }, "implement-confirm");
    detail = await getDetail(projectId);
    phase = detail.project?.workflow_phase;
  }

  // ジョブ実行中なら待機
  const { data: jobData } = await fetchJson(`/api/third-party/projects/${projectId}/job`);
  if (jobData.job?.status === "pending" || jobData.job?.status === "running") {
    await waitForJob(projectId);
    detail = await getDetail(projectId);
    phase = detail.project?.workflow_phase;
  }

  return { phase, detail };
}

async function getPreview(projectId) {
  const res = await fetch(`${BASE}/api/third-party/projects/${projectId}/preview`, {
    headers: { Cookie: cookieHeader },
  });
  return await res.text();
}

function analyzePreview(html) {
  const issues = [];
  if (html.length < 400) issues.push("preview_too_short");
  if (!/<button/i.test(html)) issues.push("no_button");
  if (!/<script/i.test(html) || /<script>\s*<\/script>/i.test(html)) issues.push("empty_script");
  return issues;
}

async function runRound(roundIndex, spec) {
  console.log(`\n========== Round ${roundIndex + 1}: ${spec.title} ==========`);
  const issues = [];

  const { data: createData, res: createRes } = await fetchJson("/api/third-party/projects", {
    method: "POST",
    body: JSON.stringify({ title: `${spec.title} ${Date.now()}` }),
  });
  if (!createRes.ok) {
    issues.push({ type: "create_failed", detail: createData });
    return { issues };
  }

  const projectId = createData.project.id;
  console.log("  project:", projectId);

  const { phase } = await driveToDraft(projectId, spec.prompt);
  console.log("  final phase:", phase);

  const preview = await getPreview(projectId);
  const previewIssues = analyzePreview(preview);
  console.log("  preview bytes:", preview.length, "issues:", previewIssues);

  if (!["draft_ready", "app_maintain", "app_maintain_done"].includes(phase)) {
    issues.push({ type: "phase_not_ready", phase });
  }
  issues.push(...previewIssues.map((t) => ({ type: t })));

  const { res: revRes, data: revData } = await fetchJson(
    `/api/third-party/projects/${projectId}/revisions`
  );
  console.log("  revisions:", revRes.status, revData?.revisions?.length ?? 0);
  if (revRes.status === 404) issues.push({ type: "revisions_api_missing" });
  if (preview.length > 500 && (revData?.revisions?.length ?? 0) === 0) {
    issues.push({ type: "revisions_empty_after_build" });
  }

  const { res: forkRes, data: forkData } = await fetchJson(
    `/api/third-party/projects/${projectId}/fork`,
    { method: "POST", body: "{}" }
  );
  console.log("  fork:", forkRes.status, forkData.project?.id ?? "none");
  if (forkRes.status === 404) issues.push({ type: "fork_api_missing" });

  if (phase === "draft_ready") {
    const { done } = await chat(projectId, { message: "ボタンを青にしてください" }, "maintain");
    if (!done) issues.push({ type: "maintain_failed" });
  }

  return { projectId, phase, previewLen: preview.length, issues };
}

async function main() {
  const user = await login();
  console.log("Logged in:", user.username);

  const results = [];
  for (let i = 0; i < MAX_ROUNDS; i++) {
    try {
      const r = await runRound(i, APP_SPECS[i]);
      results.push({ round: i + 1, ...r });
      allIssues.push(...(r.issues || []).map((iss) => ({ round: i + 1, ...iss })));
    } catch (e) {
      console.error("  ROUND FAILED:", e.message);
      allIssues.push({ round: i + 1, type: "round_exception", detail: e.message });
    }
  }

  const issueCounts = {};
  for (const iss of allIssues) {
    issueCounts[iss.type] = (issueCounts[iss.type] || 0) + 1;
  }
  console.log("\n========== SUMMARY ==========");
  console.log(JSON.stringify(issueCounts, null, 2));

  writeFileSync(
    "/tmp/tp-verify-results.json",
    JSON.stringify({ results, allIssues, issueCounts }, null, 2)
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
