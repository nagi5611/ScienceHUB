/**
 * ffmpeg-core.wasm — R2 配置用の共有定数・ユーティリティ
 * Pages の 25–30 MiB 制限を避けるため wasm は public に置かない
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(__dirname, "..");

export const R2_KEY = "static/image-converter/ffmpeg/ffmpeg-core.wasm";
export const BUCKET = "sciencehub-files";
export const R2_OBJECT_PATH = `${BUCKET}/${R2_KEY}`;

export const PUBLIC_WASM_PATH = path.join(
  ROOT,
  "public/apps/image-converter/vendor/ffmpeg/ffmpeg-core.wasm",
);

const WASM_CANDIDATES = [
  path.join(ROOT, "node_modules/@ffmpeg/core/dist/umd/ffmpeg-core.wasm"),
  path.join(ROOT, "node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.wasm"),
];

/** node_modules から wasm ソースパスを解決 */
export async function resolveWasmSourcePath() {
  for (const candidate of WASM_CANDIDATES) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      /* try next */
    }
  }
  throw new Error(
    "ffmpeg-core.wasm が見つかりません。npm install を実行するか、@ffmpeg/core を確認してください。",
  );
}

/** public 配下の wasm コピーを削除（デプロイサイズ超過防止） */
export async function removePublicWasmCopy() {
  try {
    await fs.unlink(PUBLIC_WASM_PATH);
    console.log(`[ffmpeg-r2] removed public copy: ${PUBLIC_WASM_PATH}`);
  } catch {
    /* already absent */
  }
}

/** wrangler コマンドを実行 */
function runWrangler(args) {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", ["wrangler", ...args], {
      cwd: ROOT,
      stdio: "inherit",
      shell: true,
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve(undefined);
      else reject(new Error(`wrangler ${args.join(" ")} exited with ${code}`));
    });
  });
}

/** ローカル / リモート R2 にオブジェクトが存在するか（先頭数バイト取得で確認） */
export async function r2ObjectExists(local) {
  const checkPath = path.join(ROOT, ".wrangler/ffmpeg-core-check.wasm");
  try {
    await fs.unlink(checkPath);
  } catch {
    /* ignore */
  }

  const args = [
    "r2",
    "object",
    "get",
    R2_OBJECT_PATH,
    "--file",
    checkPath,
    local ? "--local" : "--remote",
  ];

  try {
    await new Promise((resolve, reject) => {
      const child = spawn("npx", ["wrangler", ...args], {
        cwd: ROOT,
        stdio: "pipe",
        shell: true,
      });
      child.on("error", reject);
      child.on("exit", (code) => {
        if (code === 0) resolve(undefined);
        else reject(new Error(`exit ${code}`));
      });
    });
    const stat = await fs.stat(checkPath);
    return stat.size > 1_000_000;
  } catch {
    return false;
  } finally {
    try {
      await fs.unlink(checkPath);
    } catch {
      /* ignore */
    }
  }
}

/** wasm を R2 にアップロード */
export async function uploadWasmToR2(local) {
  const wasmPath = await resolveWasmSourcePath();
  const stat = await fs.stat(wasmPath);
  const mib = (stat.size / (1024 * 1024)).toFixed(1);

  console.log(
    `[ffmpeg-r2] uploading ${wasmPath} (${mib} MiB) → ${R2_OBJECT_PATH} (${local ? "local" : "remote"})`,
  );

  await runWrangler([
    "r2",
    "object",
    "put",
    R2_OBJECT_PATH,
    "--file",
    wasmPath,
    "--content-type",
    "application/wasm",
    "--cache-control",
    "public,max-age=31536000,immutable",
    local ? "--local" : "--remote",
  ]);

  await removePublicWasmCopy();
  console.log("[ffmpeg-r2] upload complete.");
}
