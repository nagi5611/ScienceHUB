/**
 * 未認証時のログイン導線（Pages ミドルウェアと同じ next を付与）
 */

/** 現在の URL（path + query）を next にして /login/ へ遷移 */
export function redirectToLogin() {
  const next = encodeURIComponent(
    `${window.location.pathname}${window.location.search}`
  );
  window.location.href = `/login/?next=${next}`;
  throw new Error("ログインが必要です");
}
