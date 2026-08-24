// functions/lib/simulation/fds-format-review.ts

export const FDS_FORMAT_REVIEW_T_END_MISSING_ISSUE =
  "&TIME の T_END（シミュレーション終了時刻・秒）が見つかりません。例: &TIME T_END=100.0 /";

const T_END_PATTERN = /T_END\s*=\s*([0-9.eE+-]+)/gi;

export interface FdsFormatReviewResult {
  passed: boolean;
  tEndSeconds: number | null;
  issues: string[];
}

/** Parses the last T_END value from FDS input text (seconds). */
export function parseFdsTEndSeconds(text: string): number | null {
  if (!text.trim()) return null;

  let lastValue: number | null = null;
  for (const match of text.matchAll(T_END_PATTERN)) {
    const raw = match[1];
    if (!raw) continue;
    const value = Number(raw);
    if (!Number.isFinite(value) || value <= 0) continue;
    lastValue = value;
  }

  return lastValue;
}

/** Runs deterministic format review (T_END required). */
export function runFdsFormatReview(text: string): FdsFormatReviewResult {
  const tEndSeconds = parseFdsTEndSeconds(text);
  if (tEndSeconds == null) {
    return {
      passed: false,
      tEndSeconds: null,
      issues: [FDS_FORMAT_REVIEW_T_END_MISSING_ISSUE],
    };
  }

  return {
    passed: true,
    tEndSeconds,
    issues: [],
  };
}

/** Computes progress percent capped at 95% while computing. */
export function computeFdsProgressPct(
  simulationTimeSeconds: number,
  tEndSeconds: number
): number {
  if (!Number.isFinite(simulationTimeSeconds) || !Number.isFinite(tEndSeconds) || tEndSeconds <= 0) {
    return 0;
  }
  const ratio = simulationTimeSeconds / tEndSeconds;
  const pct = Math.min(100, Math.max(0, ratio * 100));
  return Math.min(95, Math.round(pct * 10) / 10);
}

/** Maps format review outcome to request submission fields. */
export function resolveFdsFormatReviewSubmission(formatReview: FdsFormatReviewResult): {
  status: "format_failed" | "primary_reviewing";
  tEndSeconds: number | null;
  formatReviewIssues: string[];
  shouldRunPrimaryReview: boolean;
} {
  if (!formatReview.passed) {
    return {
      status: "format_failed",
      tEndSeconds: null,
      formatReviewIssues: formatReview.issues,
      shouldRunPrimaryReview: false,
    };
  }

  return {
    status: "primary_reviewing",
    tEndSeconds: formatReview.tEndSeconds,
    formatReviewIssues: [],
    shouldRunPrimaryReview: true,
  };
}
