/**
 * ScienceHUB ヘルスチェック API
 * D1・R2 バインディングの接続状態を返す
 */

interface Env {
  DB: D1Database;
  FILES: R2Bucket;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const checks: Record<string, { ok: boolean; detail?: string }> = {};

  try {
    const userCount = await context.env.DB.prepare(
      "SELECT COUNT(*) AS count FROM users"
    ).first<{ count: number }>();
    checks.d1 = { ok: true, detail: `users: ${userCount?.count ?? 0}` };
  } catch (error) {
    checks.d1 = {
      ok: false,
      detail: error instanceof Error ? error.message : "D1 error",
    };
  }

  try {
    const listed = await context.env.FILES.list({ limit: 1 });
    checks.r2 = { ok: true, detail: `objects: ${listed.objects.length}+` };
  } catch (error) {
    checks.r2 = {
      ok: false,
      detail: error instanceof Error ? error.message : "R2 error",
    };
  }

  const allOk = Object.values(checks).every((c) => c.ok);

  return Response.json(
    {
      service: "ScienceHUB",
      status: allOk ? "ok" : "degraded",
      timestamp: Date.now(),
      checks,
    },
    { status: allOk ? 200 : 503 }
  );
};
