/**
 * computeContestAdminSubmissionStatus のユニットテスト
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { computeContestAdminSubmissionStatus } from "./applications";
import type { ContestApplication } from "./applications";

function baseApp(overrides: Partial<ContestApplication> = {}): ContestApplication {
  return {
    id: "app-1",
    user_id: "u1",
    schedule_type: "full_time",
    homeroom: "101",
    student_number: 1,
    student_name: "テスト",
    title: "作品",
    impressions: null,
    status: "approved",
    self_print: false,
    uses_multiple_parts: false,
    part_count: null,
    stl_r2_key: null,
    stl_filename: null,
    stl_size_bytes: null,
    stl_print_notes: null,
    stl_submitted_at: null,
    contest_storage_path: null,
    contest_storage_filename: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  } as ContestApplication;
}

describe("computeContestAdminSubmissionStatus", () => {
  it("自己印刷・未提出は STL未提出（自己印刷）", () => {
    const status = computeContestAdminSubmissionStatus(
      baseApp({ self_print: true, stl_submitted_at: null }),
      null
    );
    assert.equal(status.code, "stl_pending");
    assert.equal(status.label, "STL未提出");
    assert.equal(status.detail, "自己印刷");
  });

  it("印刷依頼なしは STL未提出", () => {
    const status = computeContestAdminSubmissionStatus(
      baseApp({ self_print: false }),
      null
    );
    assert.equal(status.code, "stl_pending");
    assert.equal(status.label, "STL未提出");
    assert.equal(status.detail, null);
  });

  it("予約ありは印刷ステータスラベル", () => {
    const status = computeContestAdminSubmissionStatus(baseApp({ self_print: false }), {
      id: "r1",
      status: "printing",
      desired_date: "2026-04-01",
      stl_filename: "part.stl",
      created_at: "2026-01-01T00:00:00.000Z",
    });
    assert.equal(status.code, "print_printing");
    assert.equal(status.label, "印刷中");
    assert.match(status.detail ?? "", /2026-04-01/);
  });
});
