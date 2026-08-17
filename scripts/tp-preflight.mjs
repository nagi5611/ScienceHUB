/**
 * サードパーティ本番検証の事前チェック（デプロイ・TP_MAX_DAILY_TURNS 確認）
 */
const BASE = process.env.TP_BASE_URL || "https://s.mmh-virtual.jp";
const EMAIL = process.env.TP_EMAIL || "guest";
const PASSWORD = process.env.TP_PASSWORD || "guest1234";

let cookie = "";

async function login() {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: EMAIL, password: PASSWORD }),
  });
  cookie = (res.headers.getSetCookie?.() || [])
    .map((c) => c.split(";")[0])
    .join("; ");
  const data = await res.json();
  if (!res.ok) throw new Error(`login failed: ${JSON.stringify(data)}`);
  return data.user;
}

async function main() {
  const user = await login();
  console.log("OK login:", user.username);

  const create = await fetch(`${BASE}/api/third-party/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ title: `preflight ${Date.now()}` }),
  });
  const { project } = await create.json();
  const pid = project.id;
  console.log("OK project:", pid);

  const jobRes = await fetch(`${BASE}/api/third-party/projects/${pid}/job`, {
    headers: { Cookie: cookie },
  });
  const jobBody = await jobRes.json();
  if (jobRes.status === 404 && jobBody.error?.includes("不正")) {
    console.error(
      "FAIL job API: 404 — PR #13 未デプロイ。npm run deploy を実行してください。"
    );
    process.exit(1);
  }
  if (!jobRes.ok) {
    console.error("FAIL job API:", jobRes.status, jobBody);
    process.exit(1);
  }
  console.log("OK job API:", jobRes.status);

  const chatRes = await fetch(
    `${BASE}/api/third-party/projects/${pid}/chat?stream=1`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({ message: "preflight ping" }),
    }
  );
  const chatText = await chatRes.text();
  if (chatText.includes("AI 利用上限")) {
    console.error(
      "FAIL daily limit: TP_MAX_DAILY_TURNS が未反映（既定30）。\n" +
        "  Cloudflare Pages → Variables → TP_MAX_DAILY_TURNS=200\n" +
        "  設定後に npm run deploy を再実行してください。"
    );
    process.exit(1);
  }
  if (!chatRes.ok || chatText.includes("event: error")) {
    console.error("FAIL chat:", chatText.slice(0, 500));
    process.exit(1);
  }
  console.log("OK chat (no daily limit)");
  console.log("\nPreflight passed — 検証ループを実行できます。");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
