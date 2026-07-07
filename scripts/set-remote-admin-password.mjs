/**
 * リモート admin パスワードを更新する
 * 使い方: node scripts/set-remote-admin-password.mjs <username> <password>
 */

import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ITERATIONS = 10000;
const username = process.argv[2] ?? "admin";
const password = process.argv[3];

if (!password) {
  console.error("Usage: node scripts/set-remote-admin-password.mjs <username> <password>");
  process.exit(1);
}

const salt = crypto.getRandomValues(new Uint8Array(16));
const enc = new TextEncoder();
const key = await crypto.subtle.importKey(
  "raw",
  enc.encode(password),
  "PBKDF2",
  false,
  ["deriveBits"]
);
const bits = await crypto.subtle.deriveBits(
  { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
  key,
  256
);
const b64 = (u8) => Buffer.from(u8).toString("base64url");
const hash = `$pbkdf2-sha256$${ITERATIONS}$${b64(salt)}$${b64(new Uint8Array(bits))}`;
const updatedAt = Date.now();
const safeUsername = username.replace(/'/g, "''");

const sql = `UPDATE users SET password_hash = '${hash}', updated_at = ${updatedAt} WHERE username = '${safeUsername}';`;

const tempDir = mkdtempSync(join(tmpdir(), "sciencehub-sql-"));
const sqlFile = join(tempDir, "update-password.sql");
writeFileSync(sqlFile, sql, "utf8");

console.log(`Updating remote password for user: ${username}`);

const result = spawnSync(
  "npx",
  ["wrangler", "d1", "execute", "sciencehub-db", "--remote", "--file", sqlFile, "-y"],
  { stdio: "inherit", shell: true }
);

rmSync(tempDir, { recursive: true, force: true });
process.exit(result.status ?? 1);
