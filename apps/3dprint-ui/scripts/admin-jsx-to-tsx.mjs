import fs from 'node:fs';
import path from 'node:path';

const domainImports = `
import React from 'react';
import type { AdminApplication, AdminMember } from '../admin-domain';
import {
  WD, pad2, ymd, parseYmd, addDays, startOfDay, isWeekday, weekStart, mdLabel, TODAY,
  dateLabel, dateLabelW, minsLabel, durationLabel, spanOfApp as spanOf, hrLabel, whoLabel,
  memberName, planShiftRule, daySummary, pendingQueue, REJECT_REASONS, NOTE_TEMPLATES,
  loadIntegrations, saveIntegrations, DEFAULT_INTEG, loadLog, saveLog,
  type IntegrationsState, type AdminLogItem,
} from '../admin-domain';
import { KIND, STATUS, MACHINE_MAP, MACHINES } from '@shared/domain';
`.trim();

const uiImports = `
import {
  LOGO, machineColor, MDot, KindBadge, KIND_TONE, Tag, Chip, agoLabel, logTime,
  Header, DayStrip, CalAdmin, Drawer, Toast, SettingsDialog,
} from './AdminUi';
`.trim();

const dir = path.resolve(import.meta.dirname, '../src/management/source');
const outDir = path.resolve(import.meta.dirname, '../src/management/components');
fs.mkdirSync(outDir, { recursive: true });

const fileMap = {
  'ui.jsx': { out: 'AdminUi.tsx', extra: '' },
  'daylist.jsx': { out: 'DayList.tsx', extra: uiImports },
  'review.jsx': { out: 'ReviewSheet.tsx', extra: uiImports },
  'settings.jsx': { out: 'SettingsPanel.tsx', extra: uiImports },
};

for (const [file, { out, extra }] of Object.entries(fileMap)) {
  let body = fs.readFileSync(path.join(dir, file), 'utf8');
  body = body.replace(/^\/\*[\s\S]*?\*\/\n/, '');
  body = body.replace(/\nObject\.assign\(window,[\s\S]*$/m, '');
  body = body.replace(/\.\.\/3Dプリント予約\.html/g, '/apps/3dprint-reservation/');
  body = body.replace(/assets\/icon-192\.png/g, '/apps/3dprint-management/assets/icon-192.png');
  body = body.replace(/\bmemberName\(/g, 'memberName(members, ');
  body = body.replace(/shifts\[ds\] \? memberName\(shifts\[ds\]\)/g, 'shifts[ds] ? memberName(members, shifts[ds])');
  body = body.replace(/memberName\(shifts\[ds\]\)/g, 'memberName(members, shifts[ds])');
  body = body.replace(/memberName\(on\[0\]\.memberId\)/g, 'memberName(members, on[0].memberId)');
  body = body.replace(/memberName\(memberId\)/g, 'memberName(members, memberId)');
  body = body.replace(/memberById\(/g, 'members.find(m => m.id === ');
  body = body.replace(/newMemberId\(\)/g, "''");
  body = body.replace(/\bspanOf\(/g, 'spanOf(');
  body = body.replace(/buildShifts\(/g, 'shiftMapProp(');
  body = body.replace(/setShiftMap\(/g, '// setShiftMap(');
  body = body.replace(/SHIFT_MAP/g, 'shiftMap');

  const exports = [];
  for (const m of body.matchAll(/^function (\w+)/gm)) exports.push(m[1]);
  for (const m of body.matchAll(/^const (\w+) = /gm)) {
    if (['LOGO', 'KIND_TONE'].includes(m[1])) exports.push(m[1]);
  }

  const needsMembers = /memberName\(members/.test(body) || file === 'ui.jsx';
  const membersParam = needsMembers && file === 'ui.jsx' ? '' : '';

  if (file === 'ui.jsx') {
    body = body.replace(
      /function CalAdmin\(\{ apps, shifts, selected, onPick \}\)/,
      'function CalAdmin({ apps, shifts, selected, onPick, members }: { apps: AdminApplication[]; shifts: Record<string, string | null>; selected: string; onPick: (d: string) => void; members: AdminMember[] })'
    );
    body = body.replace(
      /function DayStrip\(\{ apps, date, staff, onOpenSettings \}\)/,
      'function DayStrip({ apps, date, staff, onOpenSettings }: { apps: AdminApplication[]; date: string; staff: string | null; onOpenSettings: () => void })'
    );
  }

  if (file === 'settings.jsx') {
    body = body.replace(
      /function MembersPanel\(\{ members, apps, shifts, onAdd, onRename, onRemove \}\)/,
      'function MembersPanel({ members, apps, shifts, onAdd, onRename, onRemove, onAddFull }: { members: AdminMember[]; apps: AdminApplication[]; shifts: Record<string, string | null>; onAdd: (name: string) => void; onRename: (id: string, name: string) => void; onRemove: (id: string) => void; onAddFull?: (body: { name: string; homeroom: string; student_number: number }) => void })'
    );
    body = body.replace(
      /onAdd\(name\)/,
      'onAddFull ? onAddFull({ name, homeroom: addHr, student_number: addNum }) : onAdd(name)'
    );
    if (!body.includes('addHr')) {
      body = body.replace(
        /function MembersPanel\(/,
        `function MembersPanel(`
      );
    }
  }

  const exportBlock = exports.length ? `\nexport { ${[...new Set(exports)].join(', ')} };\n` : '';
  const header = extra ? `${domainImports}\n${extra}\n\n` : `${domainImports}\n\n`;
  fs.writeFileSync(path.join(outDir, out), `${header}${body.trim()}\n${exportBlock}`);
  console.log('wrote', out, exports);
}
