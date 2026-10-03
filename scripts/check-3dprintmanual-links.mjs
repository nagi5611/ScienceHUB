// One-off: verify 3dprintmanual asset and relative link targets exist
import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "public/apps/3dprintmanual");
const data = fs.readFileSync(path.join(root, "js/data.js"), "utf8");
const paths = new Set();
for (const m of data.matchAll(/['"]((?:images|videoes|screenshots)\/[^'"]+)['"]/g)) {
  paths.add(m[1]);
}
const htmlFiles = ["index.html", "questions/index.html"];
for (const rel of htmlFiles) {
  const html = fs.readFileSync(path.join(root, rel), "utf8");
  const base = path.dirname(rel);
  for (const m of html.matchAll(/(?:href|src)="([^"#?]+)"/g)) {
    const u = m[1];
    if (u.startsWith("http") || u.startsWith("/")) continue;
    const joined = path.normalize(path.join(base, u)).replace(/\\/g, "/");
    paths.add(joined);
  }
}
for (const m of fs.readFileSync(path.join(root, "questions/qa.js"), "utf8").matchAll(
  /['"]((?:\.\.\/)?(?:images|videoes)[^'"]+)['"]/g,
)) {
  paths.add(m[1].replace(/^\.\.\//, ""));
}
for (const m of fs.readFileSync(path.join(root, "js/main.js"), "utf8").matchAll(
  /href="([^"]+)"/g,
)) {
  const u = m[1];
  if (!u.startsWith("questions")) continue;
  paths.add(u);
}

const missing = [...paths]
  .sort()
  .filter((p) => !p.includes("/xxx."))
  .filter((p) => !fs.existsSync(path.join(root, p)));
console.log(`Checked ${paths.size} local paths`);
if (missing.length) {
  console.error("Missing:\n" + missing.join("\n"));
  process.exit(1);
}
console.log("All local paths OK");
