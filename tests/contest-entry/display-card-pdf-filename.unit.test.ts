// tests/contest-entry/display-card-pdf-filename.unit.test.ts
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildDisplayCardPdfFilename,
  buildDisplayCardPngCaptureFilename,
  sanitizeDisplayCardPdfFilenamePart,
  getDisplayCardTwoUpPageCount,
  getDisplayCardTwoUpPageSizePx,
  DISPLAY_CARD_2UP_GUTTER_PX,
  DISPLAY_CARD_2UP_PAGE_MARGIN_X_PX,
  DISPLAY_CARD_2UP_PAGE_MARGIN_Y_PX,
} from '../../public/apps/contest-management/js/display-card-pdf-export.js';
import {
  DISPLAY_CARD_HEIGHT_PX,
  DISPLAY_CARD_WIDTH_PX,
} from '../../public/apps/contest-entry/js/display-card-preview.js';

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

test('buildDisplayCardPngCaptureFilename uses PDF stem with _pre-pdf.png', () => {
  assert.equal(
    buildDisplayCardPngCaptureFilename('全日制_102_15_山田太郎_球場歯車.pdf'),
    '全日制_102_15_山田太郎_球場歯車_pre-pdf.png'
  );
});

test('getDisplayCardTwoUpPageCount pairs cards for portrait stack', () => {
  assert.equal(getDisplayCardTwoUpPageCount(0), 0);
  assert.equal(getDisplayCardTwoUpPageCount(1), 1);
  assert.equal(getDisplayCardTwoUpPageCount(2), 1);
  assert.equal(getDisplayCardTwoUpPageCount(3), 2);
});

test('getDisplayCardTwoUpPageSizePx fits two design-size cards vertically', () => {
  const { pageW, pageH } = getDisplayCardTwoUpPageSizePx();
  assert.equal(pageW, DISPLAY_CARD_WIDTH_PX + DISPLAY_CARD_2UP_PAGE_MARGIN_X_PX * 2);
  assert.equal(
    pageH,
    DISPLAY_CARD_HEIGHT_PX * 2 +
      DISPLAY_CARD_2UP_GUTTER_PX +
      DISPLAY_CARD_2UP_PAGE_MARGIN_Y_PX * 2
  );
});
