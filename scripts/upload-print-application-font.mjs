#!/usr/bin/env node
/**
 * Upload Noto Sans JP woff2 to R2 for application-form PDF generation.
 *
 * Usage:
 *   npm run print-application-font:upload
 *   npm run print-application-font:upload:local
 */
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const R2_KEY = 'print/assets/noto-sans-jp-japanese-400-normal.woff2';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fontPath = join(
  root,
  'node_modules/@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-400-normal.woff2'
);

const local = process.argv.includes('--local');
/** Production R2 unless --local (wrangler defaults to local storage). */
const remoteFlag = local ? ['--local'] : ['--remote'];
const bucket = 'sciencehub-files';

let font;
try {
  font = readFileSync(fontPath);
} catch {
  console.error(
    `Font file not found at ${fontPath}. Run: npm install --legacy-peer-deps`
  );
  process.exit(1);
}

const tmp = join(root, '.tmp-noto-sans-jp.woff2');
writeFileSync(tmp, font);

const args = [
  'r2',
  'object',
  'put',
  `${bucket}/${R2_KEY}`,
  '--file',
  tmp,
  '--content-type',
  'font/woff2',
  '-c',
  'wrangler.jsonc',
  ...remoteFlag,
];

const result = spawnSync('npx', ['wrangler', ...args], {
  cwd: root,
  stdio: 'inherit',
});

try {
  unlinkSync(tmp);
} catch {
  /* ignore */
}

process.exit(result.status ?? 1);
