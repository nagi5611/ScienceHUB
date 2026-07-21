#!/usr/bin/env node
/** シミュレーションアプリの残存用語を一括修正する */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const targets = [
  path.join(root, 'functions/lib/simulation'),
  path.join(root, 'functions/api/simulation'),
  path.join(root, 'public/apps/simulation-request'),
  path.join(root, 'public/apps/simulation-management'),
  path.join(root, 'public/css/apps/simulation-request.css'),
  path.join(root, 'public/css/apps/simulation-management.css'),
];

const replacements = [
  ['can_record_print_video', 'can_record_result_video'],
  ['has_print_video', 'has_result_video'],
  ['PRINTER_STATUSES', 'SIMULATOR_STATUSES'],
  ['PRINTER_STATUS_LABELS', 'SIMULATOR_STATUS_LABELS'],
  ['edit-print-notes', 'edit-sim-notes'],
  ['admin-print-notes', 'admin-sim-notes'],
  ['印刷履歴', '依頼履歴'],
  ['印刷規模', 'シミュレーション規模'],
  ['印刷機種', 'シミュレーター機種'],
  ['印刷設定', 'シミュレーション設定'],
  ['印刷時の注意点', '実行時の注意点'],
  ['印刷済み', '完了'],
  ['印刷失敗', '実行失敗'],
  ['印刷可能', '利用可能'],
  ['印刷不能', '利用不可'],
  ['スモール印刷', 'スモール依頼'],
  ['印刷物の概要', 'シミュレーション内容の概要'],
  ['印刷に失敗', '実行に失敗'],
  ['印刷規模が不正', 'シミュレーション規模が不正'],
  ['1日の印刷キャパ', '1日の処理キャパ'],
  ['受け付けられる印刷規模', '受け付けられるシミュレーション規模'],
  ['印刷時間', '実行時間'],
  ['印刷規模', 'シミュレーション規模'],
  ['3Dシミュレーター', 'シミュレーター'],
];

function walkFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(full));
    else files.push(full);
  }
  return files;
}

for (const target of targets) {
  const files = fs.statSync(target).isDirectory() ? walkFiles(target) : [target];
  for (const file of files) {
    if (!/\.(ts|js|html|css)$/.test(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    for (const [from, to] of replacements) {
      content = content.split(from).join(to);
    }
    fs.writeFileSync(file, content);
  }
}

console.log('Simulation terminology fixes applied.');
