import fs from 'node:fs';
import path from 'node:path';

const pkgRoot = process.argv[2] || '/tmp/3dprint-package';
const uiRoot = path.resolve(import.meta.dirname, '..');

function cp(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log('copy', path.relative(uiRoot, dest));
}

function stripJsx(body) {
  body = body.replace(/^\/\*[\s\S]*?\*\/\n/, '');
  body = body.replace(/\nObject\.assign\(window,[\s\S]*$/m, '');
  body = body.replace(/\.\.\/3Dプリント予約\.html/g, '/apps/3dprint-reservation/');
  body = body.replace(/3Dプリント予約\.html/g, '/apps/3dprint-reservation/');
  body = body.replace(/assets\/icon-192\.png/g, '/apps/3dprint-management/assets/icon-192.png');
  body = body.replace(/ds\/assets\/icon-192\.png/g, '/apps/3dprint-management/assets/icon-192.png');
  return body.trim();
}

function coreJsToTs(srcPath, destPath) {
  let raw = fs.readFileSync(srcPath, 'utf8');
  const assign = raw.match(/Object\.assign\(window,\s*\{([\s\S]*?)\}\);/);
  const namesFromAssign = assign
    ? assign[1]
        .split(',')
        .map((s) => s.trim().split(/\s+/)[0])
        .filter(Boolean)
    : [];
  let body = raw.replace(/^\/\*[\s\S]*?\*\/\n/, '');
  body = body.replace(/\nObject\.assign\(window,[\s\S]*$/m, '');
  const names = [...namesFromAssign];
  for (const m of body.matchAll(/^const ([A-Za-z_][A-Za-z0-9_]*) =/gm)) names.push(m[1]);
  for (const m of body.matchAll(/^function ([a-zA-Z_][a-zA-Z0-9_]*)/gm)) names.push(m[1]);
  const uniq = [...new Set(names)];
  const out = `/* Auto-imported from 3dprint-package admin/core.js — design prototype domain */\n\n${body.trim()}\n\nexport {\n  ${uniq.join(',\n  ')},\n};\n`;
  fs.writeFileSync(destPath, out);
  console.log('wrote', path.relative(uiRoot, destPath), uniq.length, 'exports');
}

const domainImports = `
import React from 'react';
import type { Application } from '@shared/types';
import {
  WD, pad2, ymd, parseYmd, addDays, startOfDay, isWeekday, hasShift, staffFor, weekStart, mdLabel,
  slotStart, minsLabel, rangeLabel, slotRangeLabel, durationLabel, slotIndex, inShiftSlot, spanOf, clampRange,
  HR_LIST, isValidHR, hrLabel, whoLabel, requestAllowed, isPastDate, todayStrOf,
  computeDay, hasOverlap, findNextOpenDate, saveProfile,
  STATUS, KIND, MACHINE_IDS, MACHINE_MAP, MACHINES, SLOT_COUNT, ROW_H, SHIFT_START, SHIFT_END,
  SHIFT_SLOT_START, SHIFT_SLOT_END, SHIFT_SLOTS, DAY_START, DAY_END, SLOT_MIN,
} from '@shared/domain';
`.trim();

function convertReservationComponents() {
  const compDir = path.join(uiRoot, 'src/components');
  for (const name of ['Chrome', 'Calendar', 'Timetable', 'Sheets', 'Popover']) {
    const src = path.join(pkgRoot, 'js', `${name}.jsx`);
    if (!fs.existsSync(src)) continue;
    fs.writeFileSync(path.join(compDir, `${name}.jsx`), fs.readFileSync(src, 'utf8'));
  }
  for (const file of fs.readdirSync(compDir).filter((f) => f.endsWith('.jsx'))) {
    let body = stripJsx(fs.readFileSync(path.join(compDir, file), 'utf8'));
    const exports = [];
    for (const m of body.matchAll(/^function (\w+)/gm)) exports.push(m[1]);
    const exportBlock = exports.length ? `\nexport { ${exports.join(', ')} };\n` : '';
    fs.writeFileSync(
      path.join(compDir, file.replace('.jsx', '.tsx')),
      `${domainImports}\n\n${body}\n${exportBlock}`
    );
    fs.unlinkSync(path.join(compDir, file));
    console.log('reservation component', file.replace('.jsx', '.tsx'), exports);
  }
}

const adminDomainImport = `import {
  WD, pad2, ymd, parseYmd, addDays, startOfDay, isWeekday, weekStart, mdLabel, TODAY, todayDate,
  dateLabel, dateLabelW, slotStart, minsLabel, durationLabel, slotIndex, spanOf, hrLabel,
  DAY_START, DAY_END, SLOT_MIN, SLOT_COUNT, SHIFT_START, SHIFT_END, SHIFT_SLOT_START, SHIFT_SLOTS,
  STATUS, KIND, MACHINE_STATE, MACHINE_IDS, MACHINE_MAP, MACHINES,
  CANCEL_REASONS, REJECT_REASONS, NOTE_TEMPLATES, HR_LIST, MEMBER_COLORS,
  setMembers, getMembers, memberById, memberName, memberColor, memberLabel, newMemberId, nextColor,
  setAvailability, getAvailability, isAvailable, staffIdsOn, staffNamesOn, defaultAvailability,
  planShiftRule, toggleAvailability, setManyAvailability, stripMemberAvailability, memberDatesInRange,
  seedApps, pendingQueue, isLate, activeStatus, dayOcc, daySummary,
  moveCheck, moveAppTo, monthGrid,
  readJSON, writeJSON, K, loadApps, saveApps, loadMembers, saveMembers, loadAvail, saveAvail,
  loadPrefs, savePrefs, loadLog, saveLog, DEFAULT_INTEG, loadIntegrations, saveIntegrations,
  loadPrinters, savePrinters, exportCSV,
  slotListOf, splitOffSlots, splitWithStatus,
} from '../admin-design-domain';`;

const uiImport = `import {
  LOGO, machineColor, MDot, KindBadge, Tag, Chip, MemberTag, agoLabel, logTime,
  Header, Calendar, CalDay, dayHint, Drawer, Modal, Toast,
  DLIcon, downloadAppFile, downloadDay, saveText,
} from './AdminDesignUi';`;

function convertAdminModule(file, out, extraImports = '') {
  const src = path.join(pkgRoot, 'admin', file);
  let body = stripJsx(fs.readFileSync(src, 'utf8'));
  const exports = [];
  const assign = body.match(/Object\.assign\(window,\s*\{([\s\S]*?)\}\);/);
  if (assign) {
    for (const name of assign[1].split(',').map((s) => s.trim()).filter(Boolean)) exports.push(name);
  }
  for (const m of body.matchAll(/^function (\w+)/gm)) exports.push(m[1]);
  for (const m of body.matchAll(/^const (\w+) =/gm)) exports.push(m[1]);
  const exportBlock = exports.length ? `\nexport { ${[...new Set(exports)].join(', ')} };\n` : '';
  const header =
    file === 'ui.jsx'
      ? `import React from 'react';\n${adminDomainImport};\n\n`
      : file === 'App.jsx'
        ? `import React from 'react';\n${adminDomainImport};\nimport { LOGO, Header, Toast, downloadAppFile, downloadDay } from './AdminDesignUi';\nimport { ReserveScreen, AppSheet } from './ReserveScreen';\nimport { MoveDialog } from './MoveDialog';\nimport { SettingsScreen } from './SettingsScreen';\n\n`
        : `import React from 'react';\n${adminDomainImport};\n${extraImports ? `${extraImports};\n` : ''}\n`;
  const outPath = path.join(uiRoot, 'src/management/design', out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  if (file === 'App.jsx') {
    body = body.replace(/^function useMedia[\s\S]*?^}\n/m, '');
    body = body.replace(/^function App\(\)/m, 'export function AdminDesignApp()');
    body = body.replace(/\nReactDOM\.createRoot[\s\S]*$/m, '');
    body = body.replace(/^export \{ useMedia, App \};?\s*$/m, '');
  }
  fs.writeFileSync(outPath, `${header}${body}${exportBlock}`);
  console.log('admin module', out, exports);
}

// ── assets & css ──
cp(path.join(pkgRoot, 'css/colors_and_type.css'), path.join(uiRoot, 'src/styles/colors_and_type.css'));
cp(path.join(pkgRoot, 'css/app.css'), path.join(uiRoot, 'src/styles/app.css'));
cp(path.join(pkgRoot, 'admin/admin.css'), path.join(uiRoot, 'src/styles/admin.css'));
cp(path.join(pkgRoot, 'assets/icon-192.png'), path.join(uiRoot, 'public/assets/icon-192.png'));

coreJsToTs(path.join(pkgRoot, 'admin/core.js'), path.join(uiRoot, 'src/management/admin-design-domain.ts'));

convertReservationComponents();

convertAdminModule('ui.jsx', 'AdminDesignUi.tsx');
convertAdminModule('reserve.jsx', 'ReserveScreen.tsx', uiImport);
convertAdminModule('move.jsx', 'MoveDialog.tsx', uiImport);
convertAdminModule('shifts.jsx', 'ShiftsPanels.tsx', uiImport);
convertAdminModule('settingsScreen.jsx', 'SettingsScreen.tsx', `${uiImport}\nimport { ShiftCalendar, MemberForm, Integrations } from './ShiftsPanels'`);
convertAdminModule('App.jsx', 'AdminDesignApp.tsx');

console.log('done');
