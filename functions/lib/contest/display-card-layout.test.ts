import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  DEFAULT_DISPLAY_CARD_LAYOUT,
  parseDisplayCardLayout,
} from './display-card-layout';

describe('display-card-layout', () => {
  it('returns defaults for null input', () => {
    const result = parseDisplayCardLayout(null);
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.deepEqual(result.layout.marks.full_time, DEFAULT_DISPLAY_CARD_LAYOUT.marks.full_time);
    }
  });

  it('merges partial overrides', () => {
    const result = parseDisplayCardLayout({
      name: { left: 70, top: 18, width: 25, fontSize: 14 },
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.layout.name.left, 70);
      assert.equal(result.layout.year.left, DEFAULT_DISPLAY_CARD_LAYOUT.year.left);
    }
  });

  it('rejects non-object input', () => {
    const result = parseDisplayCardLayout('bad');
    assert.equal(result.ok, false);
  });

  it('clamps comment line tops', () => {
    const result = parseDisplayCardLayout({
      comment: {
        lineTops: [40, 150, -5],
      },
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.deepEqual(result.layout.comment.lineTops, [40, 100, 0]);
    }
  });

  it('clamps comment max lines to 5', () => {
    const result = parseDisplayCardLayout({
      comment: { maxLines: 12 },
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.layout.comment.maxLines, 5);
    }
  });

  it('clamps comment line lefts', () => {
    const result = parseDisplayCardLayout({
      comment: {
        lineLefts: [22, 105],
      },
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.deepEqual(result.layout.comment.lineLefts, [22, 100]);
    }
  });

  it('clamps comment line rights', () => {
    const result = parseDisplayCardLayout({
      comment: {
        lineRights: [88, 110],
      },
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.deepEqual(result.layout.comment.lineRights, [88, 100]);
    }
  });
});
