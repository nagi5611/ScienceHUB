import fs from 'node:fs';
import path from 'node:path';

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

const dir = path.resolve(import.meta.dirname, '../src/components');
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.jsx'))) {
  let body = fs.readFileSync(path.join(dir, file), 'utf8');
  body = body.replace(/^\/\*[\s\S]*?\*\/\n/, '');
  body = body.replace(/\nObject\.assign\(window,[\s\S]*$/m, '');
  body = body.replace(/\bReact\.(useState|useEffect|useMemo|useCallback|useRef)\b/g, 'React.$1');
  const exports = [];
  for (const m of body.matchAll(/^function (\w+)/gm)) exports.push(m[1]);
  const exportBlock = exports.length
    ? `\nexport { ${exports.join(', ')} };\n`
    : '';
  const out = `${domainImports}\n\n${body.trim()}\n${exportBlock}`;
  fs.writeFileSync(path.join(dir, file.replace('.jsx', '.tsx')), out);
  console.log('wrote', file.replace('.jsx', '.tsx'), exports);
}
