// tests/contest-entry/display-card-pdf-filename.unit.test.ts
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildDisplayCardPdfFilename,
  sanitizeDisplayCardPdfFilenamePart,
} from '../../public/apps/contest-management/js/display-card-pdf-export.js';

test('sanitizeDisplayCardPdfFilenamePart removes illegal path characters', () => {
  assert.equal(sanitizeDisplayCardPdfFilenamePart('a/b:c*d?'), 'a_b_c_d_');
});

test('buildDisplayCardPdfFilename joins schedule, class, number, name, title', () => {
  const name = buildDisplayCardPdfFilename({
    schedule_type: 'full_time',
    homeroom: '102',
    student_number: 15,
    student_name: '山田太郎',
    title: '球場歯車',
    impressions: '',
    members: [],
  });
  assert.equal(name, '全日制_102_15_山田太郎_球場歯車.pdf');
});
