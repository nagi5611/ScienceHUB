// scripts/stash-3dprintmanual-videos.mjs
// Pages の 25MiB 制限のため、デプロイ前に public 内の動画を退避する
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fromDir = path.join(root, "public/apps/3dprintmanual/videoes");
const toDir = path.join(root, ".local-assets/3dprintmanual/videoes");

if (!fs.existsSync(fromDir)) {
  process.exit(0);
}

fs.mkdirSync(toDir, { recursive: true });
for (const name of fs.readdirSync(fromDir)) {
  if (!name.toLowerCase().endsWith(".mp4")) continue;
  const src = path.join(fromDir, name);
  const dest = path.join(toDir, name);
  if (!fs.statSync(src).isFile()) continue;
  if (fs.existsSync(dest)) fs.unlinkSync(dest);
  fs.renameSync(src, dest);
  console.log(`stashed: ${name}`);
}
